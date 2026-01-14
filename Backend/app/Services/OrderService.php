<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Discount;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /* ================= CREATE ================= */

    public function create(array $data): Order
    {
        return Order::create([
            'Order_Date'    => Carbon::now(),
            'Status'        => $data['status'] ?? 'PENDING',
            'PaymentStatus' => $data['paymentStatus'] ?? 'UNPAID',
            'UserID'        => $data['userID'],

            // snapshot mặc định
            'SubTotal'        => 0,
            'DiscountCode'   => null,
            'DiscountType'   => null,
            'DiscountValue'  => null,
            'DiscountAmount' => 0,
            'TotalAmount'    => 0,
        ]);
    }

    /* ================= GET ================= */

    public function getById(int $id): Order
{
    $order = Order::with(['user', 'orderDetails.product'])->findOrFail($id);

    if ((float) $order->SubTotal === 0.0) {
        $this->applyDiscount($order, null);
        $order->refresh();
    }

    return $order;
}

    public function getByUser(int $userId)
{
    $orders = Order::with(['orderDetails.product'])
        ->where('UserID', $userId)
        ->orderByDesc('Order_Date')
        ->get();

    foreach ($orders as $order) {
        if ((float) $order->SubTotal === 0.0) {
            $this->applyDiscount($order, null); // tính snapshot
            $order->refresh();
        }
    }

    return $orders;
}



    public function getAll()
    {
        return Order::with(['user', 'orderDetails.product'])
            ->orderByDesc('Order_Date')
            ->get();
    }

    /* ================= UPDATE ================= */

    public function update(int $id, array $data): Order
    {
        $order = $this->getById($id);

        if (isset($data['status'])) {
            $order->Status = $data['status'];
        }

        if (isset($data['paymentStatus'])) {
            $order->PaymentStatus = $data['paymentStatus'];
        }

        $order->save();
        return $order;
    }

    /* ================= DELETE ================= */

    public function delete(int $id): void
    {
        $this->getById($id)->delete();
    }

    /* ================= CHECK USER BOUGHT PRODUCT ================= */

    public function getOrderByUserAndProduct(int $userId, int $productId): ?int
    {
        return DB::table('order')
            ->join('orderdetail', 'order.OrderID', '=', 'orderdetail.OrderID')
            ->where('order.UserID', $userId)
            ->where('orderdetail.ProductID', $productId)
            ->value('order.OrderID');
    }

    /* ================= APPLY DISCOUNT ================= */
    /**
     * Có mã thì áp – không có mã vẫn thanh toán
     */
    public function applyDiscount(Order $order, ?string $code = null): Order
    {
        // 1️⃣ Tính SubTotal
        $subTotal = DB::table('orderdetail')
            ->join('product', 'orderdetail.ProductID', '=', 'product.ProductID')
            ->where('orderdetail.OrderID', $order->OrderID)
            ->sum(DB::raw('orderdetail.Quantity * product.Price'));


        // reset snapshot
        $order->SubTotal = $subTotal;
        $order->DiscountCode = null;
        $order->DiscountType = null;
        $order->DiscountValue = null;
        $order->DiscountAmount = 0;
        $order->TotalAmount = $subTotal;

        // 2️⃣ Không có mã → done
        if (!$code) {
            $order->save();
            return $order;
        }

        // 3️⃣ Tìm discount hợp lệ
        $discount = Discount::where('Code', strtoupper($code))
            ->where('IsActive', 1)
            ->where(function ($q) {
                $q->whereNull('StartDate')->orWhere('StartDate', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('EndDate')->orWhere('EndDate', '>=', now());
            })
            ->first();

        // mã không hợp lệ → bỏ qua
        if (!$discount) {
            $order->save();
            return $order;
        }

        // điều kiện đơn tối thiểu
        if ($discount->MinOrderValue && $subTotal < $discount->MinOrderValue) {
            $order->save();
            return $order;
        }

        // giới hạn lượt dùng
        if ($discount->UsageLimit !== null && $discount->UsedCount >= $discount->UsageLimit) {
            $order->save();
            return $order;
        }

        // 4️⃣ Tính tiền giảm
        if ($discount->Type === 'PERCENT') {
            $discountAmount = $subTotal * ($discount->Value / 100);
            if ($discount->MaxDiscountAmount) {
                $discountAmount = min($discountAmount, $discount->MaxDiscountAmount);
            }
        } else {
            $discountAmount = $discount->Value;
        }

        // không cho âm
        $discountAmount = min($discountAmount, $subTotal);

        // 5️⃣ Snapshot
        $order->DiscountCode = $discount->Code;
        $order->DiscountType = $discount->Type;
        $order->DiscountValue = $discount->Value;
        $order->DiscountAmount = $discountAmount;
        $order->TotalAmount = $subTotal - $discountAmount;

        $order->save();

        // 6️⃣ Tăng lượt dùng
        $discount->increment('UsedCount');

        return $order;
    }

    /* ================= STATISTIC ================= */

    public function getDoanhThuDonHang(int $year): array
    {
        return [
            'data'         => $this->getMonthlyRevenue($year),
            'tongDoanhThu' => $this->getTotalRevenue($year)['tongDoanhThu'],
            'tongDonHang'  => $this->getTotalRevenue($year)['tongDonHang'],
            'years'        => $this->getAvailableYears(),
        ];
    }

    private function getMonthlyRevenue(int $year)
    {
        return DB::table('order')
            ->selectRaw('
                MONTH(Order_Date) as thang,
                COUNT(*) as soLuong,
                SUM(TotalAmount) as doanhThu
            ')
            ->whereYear('Order_Date', $year)
            ->groupByRaw('MONTH(Order_Date)')
            ->orderBy('thang')
            ->get();
    }

    private function getTotalRevenue(int $year): array
    {
        $total = DB::table('order')
            ->whereYear('Order_Date', $year)
            ->selectRaw('
                COUNT(*) as tongDonHang,
                SUM(TotalAmount) as tongDoanhThu
            ')
            ->first();

        return [
            'tongDoanhThu' => (float) ($total->tongDoanhThu ?? 0),
            'tongDonHang'  => (int) ($total->tongDonHang ?? 0),
        ];
    }

    private function getAvailableYears()
    {
        return DB::table('order')
            ->selectRaw('DISTINCT YEAR(Order_Date) as year')
            ->orderByDesc('year')
            ->pluck('year');
    }
}
