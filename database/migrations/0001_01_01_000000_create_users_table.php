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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->index('uuid');
            $table->string('name')->nullable();
            $table->string('username')->unique()->nullable();
            $table->string('tel')->unique();
            $table->float('amount', 10, 2)->default('0');
            $table->float('score')->default('500');
            $table->string('email')->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('plain_password');
            $table->date('birthday')->nullable();
            $table->string('gender')->nullable();
            $table->string('current_occupation')->nullable(); //មុខរបប បច្ចុប្បន្ន
            $table->string('company_name')->nullable();
            $table->string('monthly_income')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('current_address')->nullable();
            $table->string('emergency_contact_number')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_relativity')->nullable();
            $table->string('referral_code')->unique()->nullable();
            $table->char('admin_uuid', 36)->nullable();
            $table->char('referred_by_user_uuid', 36)->nullable();
            $table->char('referred_by_admin_uuid', 36)->nullable();
            $table->enum('status', ['0', '1'])->default('0');
            $table->enum('suspended', ['0', '1'])->default('0');
            $table->string('avatar', 2048)->default('default.png');
            $table->timestamp('last_activity')->nullable();
            $table->string('register_ip')->nullable();
            $table->datetime('last_login_at')->nullable();
            $table->string('last_login_ip')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
