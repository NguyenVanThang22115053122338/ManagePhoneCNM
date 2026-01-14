<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order', function (Blueprint $table) {

            /* ===== DISCOUNT SNAPSHOT ===== */
            $table->string('DiscountCode')->nullable();
            $table->string('DiscountType')->nullable();      // PERCENT | FIXED
            $table->decimal('DiscountValue', 15, 2)->nullable();
            $table->decimal('DiscountAmount', 15, 2)->default(0);

            /* ===== PRICE ===== */
            $table->decimal('SubTotal', 15, 2)->default(0);
            $table->decimal('TotalAmount', 15, 2)->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('order', function (Blueprint $table) {
            $table->dropColumn([
                'DiscountCode',
                'DiscountType',
                'DiscountValue',
                'DiscountAmount',
                'SubTotal',
                'TotalAmount'
            ]);
        });
    }
};
