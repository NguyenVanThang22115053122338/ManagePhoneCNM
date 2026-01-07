<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    // lấy tất cả notification
    public function getAll()
    {
        return Notification::all();
    }

    // lấy theo id
    public function getById($id)
    {
        return Notification::find($id);
    }

    // lấy notification theo user
    public function getByUserId($userId)
    {
        return User::findOrFail($userId)
            ->notifications()
            ->get()
            ->map(fn($n) => [
                'id' => $n->NotificationID,
                'title' => $n->Title,
                'notificationType' => $n->NotificationType,
                'content' => $n->Content,
                'isRead' => $n->pivot->isRead
            ]);
    }

    // lấy theo role
    public function getByRole($roleName)
    {
        return DB::table('receivenotification as rn')
            ->join('notification as n', 'n.NotificationID', '=', 'rn.NotificationID')
            ->join('user as u', 'u.UserID', '=', 'rn.UserID')
            ->join('role as r', 'r.RoleID', '=', 'u.RoleID')
            ->where('r.RoleName', $roleName)
            ->select(
                'n.NotificationID as id',
                'n.Title as title',
                'n.NotificationType as notificationType',
                'n.Content as content',
                'rn.isRead'
            )
            ->distinct()
            ->get();
    }

    // tạo + gửi notification
    public function create($req)
    {
        return DB::transaction(function () use ($req) {

            // 1. lưu notification
            $notification = Notification::create([
                'Title' => $req['title'],
                'NotificationType' => $req['notificationType'],
                'Content' => $req['content']
            ]);

            // 2. xác định user nhận
            if (!empty($req['sendToAll'])) {
                $users = User::all();
            } elseif (!empty($req['roles'])) {
                $users = User::whereHas('role',
                    fn($q) => $q->whereIn('RoleName', $req['roles'])
                )->get();
            } else {
                $users = User::whereIn('UserID', $req['userIds'] ?? [])->get();
            }

            // 3. attach pivot
            foreach ($users as $user) {
                $user->notifications()->attach(
                    $notification->NotificationID,
                    ['isRead' => false]
                );
            }

            return $notification;
        });
    }

    // xóa notification
    public function delete($id)
    {
        DB::table('receivenotification')
            ->where('NotificationID', $id)
            ->delete();

        Notification::where('NotificationID', $id)->delete();
    }
}
