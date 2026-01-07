<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stockin', function (Blueprint $table) {
            $table->id('stockInID');

            $table->unsignedBigInteger('BatchID');
            $table->unsignedBigInteger('UserID');

            $table->integer('quantity');
            $table->string('note')->nullable();

            $table->timestamp('date');

            $table->timestamps();

            $table->foreign('BatchID')
                  ->references('BatchID')
                  ->on('batch')
                  ->onDelete('cascade');

            $table->foreign('UserID')
                  ->references('UserID')
                  ->on('user')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stockin');
    }
};
