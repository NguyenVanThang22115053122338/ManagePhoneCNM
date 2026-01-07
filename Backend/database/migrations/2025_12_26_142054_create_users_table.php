<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id('UserID');

            $table->string('SDT', 15)->nullable();
            $table->string('FullName', 100);
            $table->string('Email', 100)->unique();
            $table->string('Address', 255)->nullable();
            $table->string('Avatar', 255)->nullable();
            $table->string('Password', 255);
            $table->string('googleId')->nullable();

            $table->unsignedBigInteger('RoleID')->nullable();
            $table->foreign('RoleID')->references('RoleID')->on('role');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
