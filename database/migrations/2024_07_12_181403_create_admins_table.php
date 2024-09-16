<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->index('uuid');
            $table->string('name');
            $table->string('phone')->unique();
            // $table->string('email')->unique()->nullable();
            // $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('plain_password')->nullable();
            $table->double('point')->nullable();
            $table->string('register_ip')->nullable();
            $table->string('last_login_at')->nullable();
            $table->string('last_login_ip')->nullable();
            $table->string('avatar', 2048)->default('default.png')->nullable();
            $table->string('referral_code')->unique()->nullable();
            $table->enum('status', ['0', '1'])->default('0');
            $table->char('admin_uuid', 36)->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};