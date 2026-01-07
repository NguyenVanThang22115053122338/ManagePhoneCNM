<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('Payment', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->unsignedBigInteger('orderId');

            $table->string('paypalOrderId')->nullable();
            $table->string('paypalCaptureId')->nullable();

            $table->string('status');
            $table->double('amount');
            $table->string('currency', 10);

            $table->timestamp('createdAt')->nullable();
            $table->timestamp('updatedAt')->nullable();

            $table->foreign('orderId')
                  ->references('OrderID')
                  ->on('order')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Payment');
    }
};
