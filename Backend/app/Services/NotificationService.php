<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Resources\NotificationResource;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class NotificationService
{
    public function getAll()
    {
        return NotificationResource::collection(
    Notification::orderBy('NotificationID', 'desc')->get()
);
    }

    public function getById(int $id)
    {
        $notification = Notification::findOrFail($id);
        return new NotificationResource($notification);
    }

    public function getByUserId(int $userId)
    {
        $user = User::findOrFail($userId);

        $notifications = $user->notifications()
            ->withPivot('isRead')
            ->orderBy('NotificationID', 'desc')
            ->get();

        return NotificationResource::collection($notifications);
    }

    public function getByRole(string $roleName)
    {
        $notifications = DB::table('receivenotification as rn')
            ->join('notification as n', 'n.NotificationID', '=', 'rn.NotificationID')
            ->join('user as u', 'u.UserID', '=', 'rn.UserID')
            ->join('role as r', 'r.RoleID', '=', 'u.RoleID')
            ->where('r.RoleName', $roleName)
            ->select(
                'n.NotificationID',
                'n.Title',
                'n.NotificationType',
                'n.Content',
                'rn.isRead'
            )
            ->distinct()
            ->get();

        return NotificationResource::collection($notifications);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {

            $notification = Notification::create([
                'Title'           => $data['title']           ?? throw new RuntimeException('Thiếu trường title'),
                'NotificationType' => $data['notificationType'] ?? throw new RuntimeException('Thiếu trường notificationType'),
                'Content'         => $data['content']         ?? throw new RuntimeException('Thiếu trường content'),
            ]);

            if (!empty($data['sendToAll'])) {
                $users = User::all();
            } elseif (!empty($data['roles'])) {
                $users = User::whereHas('role', function ($q) use ($data) {
                    $q->whereIn('RoleName', (array) $data['roles']);
                })->get();
            } elseif (!empty($data['userIds'])) {
                $users = User::whereIn('UserID', (array) $data['userIds'])->get();
            } else {
                throw new RuntimeException('Phải chỉ định ít nhất một trong: sendToAll, roles hoặc userIds');
            }

            if ($users->isEmpty()) {
                throw new RuntimeException('Không tìm thấy user nào để gửi notification');
            }

            $syncData = [];
            foreach ($users as $user) {
                $syncData[$user->UserID] = ['isRead' => false];
            }

            $notification->users()->sync($syncData);

            $notification->load('users');

            return new NotificationResource($notification);
        });
    }
    
    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $notification = Notification::findOrFail($id);

            // Chỉ cập nhật các trường được cung cấp
            $updateData = [];
            if (isset($data['title'])) {
                $updateData['Title'] = $data['title'];
            }
            if (isset($data['content'])) {
                $updateData['Content'] = $data['content'];
            }
            if (isset($data['notificationType'])) {
                $updateData['NotificationType'] = $data['notificationType'];
            }

            if (empty($updateData)) {
                throw new RuntimeException('Không có trường dữ liệu nào để cập nhật');
            }

            $notification->update($updateData);

            if (isset($data['sendToAll']) || isset($data['roles']) || isset($data['userIds'])) {
                if (!empty($data['sendToAll'])) {
                    $users = User::all();
                } elseif (!empty($data['roles'])) {
                    $users = User::whereHas('role', function ($q) use ($data) {
                        $q->whereIn('RoleName', (array) $data['roles']);
                    })->get();
                } elseif (!empty($data['userIds'])) {
                    $users = User::whereIn('UserID', (array) $data['userIds'])->get();
                } else {
                    $users = collect();
                }

                if ($users->isNotEmpty()) {
                    $syncData = [];
                    foreach ($users as $user) {
                        $syncData[$user->UserID] = ['isRead' => false];
                    }
                    $notification->users()->sync($syncData);
                }
            }

            $notification->load('users');

            return new NotificationResource($notification);
        });
    }
    public function delete(int $id)
    {
        $notification = Notification::findOrFail($id);

        $notification->users()->detach();

        $notification->delete();
    }

    public function markAsRead(int $notificationId, int $userId)
    {
        $user = User::findOrFail($userId);
        $notification = Notification::findOrFail($notificationId);

        if (!$user->notifications()->where('notification.NotificationID', $notificationId)->exists()) {
            throw new RuntimeException('User không có thông báo này');
        }

        $user->notifications()->updateExistingPivot($notificationId, ['isRead' => true]);

        return response()->json(['message' => 'Đã đánh dấu thông báo đã đọc']);
    }

    public function markAllAsRead(int $userId)
    {
        $user = User::findOrFail($userId);
        DB::table('receivenotification')
            ->where('UserID', $userId)
            ->update(['isRead' => true]);

        return response()->json(['message' => 'Đã đánh dấu tất cả thông báo đã đọc']);
    }
}