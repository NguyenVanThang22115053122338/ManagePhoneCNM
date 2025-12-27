<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cart_details', function (Blueprint $table) {
            $table->id('cartDetailsId');

            $table->unsignedBigInteger('CartID');
            $table->unsignedBigInteger('ProductID');

            $table->timestamps();

            $table->foreign('CartID')
                  ->references('CartID')
                  ->on('carts')
                  ->onDelete('cascade');

            $table->foreign('ProductID')
                  ->references('ProductID')
                  ->on('Product')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_details');
    }
};
