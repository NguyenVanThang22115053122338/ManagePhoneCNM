<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('order', function (Blueprint $table) {
            $table->id('OrderID');

            $table->timestamp('Order_Date');
            $table->string('Status');
            $table->string('PaymentStatus');
            $table->string('DeliveryAddress')->nullable();
            $table->string('DeliveryPhone')->nullable();

            $table->unsignedBigInteger('UserID');

            $table->timestamps();

            $table->foreign('UserID')
                  ->references('UserID')
                  ->on('user')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order');
    }
};
