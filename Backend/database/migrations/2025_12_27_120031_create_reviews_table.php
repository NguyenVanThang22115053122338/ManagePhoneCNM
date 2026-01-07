<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('review', function (Blueprint $table) {
            $table->id('ReviewID');

            $table->unsignedBigInteger('OrderID');
            $table->unsignedBigInteger('ProductID');
            $table->unsignedBigInteger('UserID');

            $table->text('Comment')->nullable();
            $table->string('Video')->nullable();
            $table->string('Photo')->nullable();

            $table->integer('Rating');
            $table->timestamp('CreatedAt');

            // ===== FOREIGN KEYS =====
            $table->foreign('OrderID')
                  ->references('OrderID')
                  ->on('order')
                  ->onDelete('cascade');

            $table->foreign('ProductID')
                  ->references('ProductID')
                  ->on('Product')
                  ->onDelete('cascade');

            $table->foreign('UserID')
                  ->references('UserID')
                  ->on('user')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review');
    }
};
