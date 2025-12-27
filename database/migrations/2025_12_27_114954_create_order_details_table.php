<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orderdetail', function (Blueprint $table) {
            $table->id('OrderDetailID');

            $table->unsignedBigInteger('OrderID');
            $table->unsignedBigInteger('ProductID');

            $table->integer('Quantity');

            $table->timestamps();

            $table->foreign('OrderID')
                  ->references('OrderID')
                  ->on('order')
                  ->onDelete('cascade');

            $table->foreign('ProductID')
                  ->references('ProductID')
                  ->on('Product')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orderdetail');
    }
};
