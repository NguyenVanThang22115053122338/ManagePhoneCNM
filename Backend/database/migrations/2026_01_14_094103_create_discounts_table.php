<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('discounts', function (Blueprint $table) {

            $table->id('DiscountID');

            /* ================= BASIC ================= */
            $table->string('Code')->unique();              // NEWYEAR2026
            $table->string('Type');                        // PERCENT | FIXED
            $table->decimal('Value', 15, 2);               // 10 (%) | 50000

            /* ================= LIMIT ================= */
            $table->decimal('MaxDiscountAmount', 15, 2)->nullable();
            $table->decimal('MinOrderValue', 15, 2)->nullable();

            /* ================= TIME ================= */
            $table->dateTime('StartDate')->nullable();
            $table->dateTime('EndDate')->nullable();

            /* ================= USAGE ================= */
            $table->integer('UsageLimit')->nullable();     // tổng lượt dùng
            $table->integer('UsedCount')->default(0);      // đã dùng

            /* ================= STATUS ================= */
            $table->boolean('IsActive')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
