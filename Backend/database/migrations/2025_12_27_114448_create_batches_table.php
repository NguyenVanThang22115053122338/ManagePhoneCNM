<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('batch', function (Blueprint $table) {
            $table->id('BatchID');

            $table->unsignedBigInteger('ProductID');

            $table->date('ProductionDate');
            $table->integer('Quantity');
            $table->double('PriceIn');
            $table->date('Expiry');

            $table->timestamps();

            $table->foreign('ProductID')
                  ->references('ProductID')
                  ->on('Product')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batch');
    }
};
