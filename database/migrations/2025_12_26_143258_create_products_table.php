<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('Product', function (Blueprint $table) {
            $table->id('ProductID');

            $table->string('name');
            $table->double('price');
            $table->integer('Stock_Quantity')->default(0);
            $table->text('description')->nullable();

            // ===== FOREIGN KEYS =====
            $table->unsignedBigInteger('BrandID')->nullable();
            $table->unsignedBigInteger('CategoryID')->nullable();
            $table->unsignedBigInteger('SpecID')->unique()->nullable();

            // ===== CUSTOM TIMESTAMP =====
            $table->timestamp('Created_At')->nullable();
            $table->timestamp('Updated_At')->nullable();

            // ===== FK CONSTRAINT =====
            $table->foreign('BrandID')
                  ->references('brandId')
                  ->on('Brand')
                  ->nullOnDelete();

            $table->foreign('CategoryID')
                  ->references('categoryId')
                  ->on('Category')
                  ->nullOnDelete();

            $table->foreign('SpecID')
                  ->references('specId')
                  ->on('Specification')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Product');
    }
};
