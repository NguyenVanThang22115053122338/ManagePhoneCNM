<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ProductImage', function (Blueprint $table) {
            $table->id();
            $table->string('url');
            $table->integer('img_index')->default(0);

            $table->unsignedBigInteger('product_id');

            $table->foreign('product_id')
                  ->references('ProductID')
                  ->on('Product')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ProductImage');
    }
};
