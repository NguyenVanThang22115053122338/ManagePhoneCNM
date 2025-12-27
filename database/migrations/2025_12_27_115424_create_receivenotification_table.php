<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('receivenotification', function (Blueprint $table) {

            $table->unsignedBigInteger('NotificationID');
            $table->unsignedBigInteger('UserID');

            $table->boolean('isRead')->default(false);

            // composite primary key
            $table->primary(['NotificationID', 'UserID']);

            $table->foreign('NotificationID')
                  ->references('NotificationID')
                  ->on('notification')
                  ->onDelete('cascade');

            $table->foreign('UserID')
                  ->references('UserID')
                  ->on('user')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receivenotification');
    }
};
