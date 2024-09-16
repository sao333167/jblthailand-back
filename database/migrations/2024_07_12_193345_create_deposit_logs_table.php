<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('deposit_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->index('uuid');
            $table->char('admin_uuid', 36)->nullable();
            $table->char('deposit_order_number', 36)->nullable();
            $table->char('customer_uuid', 36);
            $table->foreignId('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->float('deposit_amount', 10, 2)->nullable()->default('0');
            $table->float('before_amount', 10, 2)->nullable()->default('0');
            $table->float('after_amount', 10, 2)->nullable()->default('0');
            $table->string('deposit_remark')->default('under review');
            $table->string('withdraw_code')->nullable()->default('000000');
            $table->date('deposit_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->enum('status', ['0', '1', '2'])->default('0')->comment('0 under review, 1 approved, 2 deposit reject');
            $table->string('ip_address')->nullable();
            $table->enum('is_read', ['0', '1'])->default('0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deposit_logs');
    }
};
