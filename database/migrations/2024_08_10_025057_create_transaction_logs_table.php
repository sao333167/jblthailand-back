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
        Schema::create('transaction_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->index('uuid');
            $table->char('admin_uuid', 36)->nullable();
            $table->char('withdraw_order_number', 36)->nullable();
            $table->char('customer_uuid', 36);
            $table->foreignId('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->float('amount', 10, 2)->nullable()->default('0');
            $table->float('before_amount', 10, 2)->nullable()->default('0');
            $table->float('after_amount', 10, 2)->nullable()->default('0');
            $table->text('remake')->nullable();
            $table->date('transaction_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->enum('status', ['0', '1'])->default('0');
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_logs');
    }
};
