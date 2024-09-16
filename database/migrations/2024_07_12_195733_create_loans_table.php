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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->index('uuid');
            $table->char('admin_uuid', 36)->nullable();
            $table->char('loan_order_number', 36)->nullable();
            $table->char('customer_uuid', 36);
            $table->foreignId('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->integer('duration_id')->nullable();
            $table->float('amount', 10, 2)->nullable()->default('0');
            $table->float('interest', 10, 2)->nullable()->default('0'); //​ការប្រាក់
            $table->float('total', 10, 2)->nullable()->default('0');
            $table->float('pay_month', 10, 2)->nullable()->default('0'); // រយះពេលបង់ប៉ុន្មានខែ
            $table->date('date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->enum('status', ['0', '1', '2'])->default('0')->comment('0 under review, 1 approved, 2 loan reject');
            $table->string('withdraw_code')->nullable();
            $table->string('loan_remark')->default('under review');
            $table->string('status_color')->nullable();
            $table->enum('confirm', ['0', '1'])->default('0');
            $table->enum('approved', ['no', 'yes'])->default('no');
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
        Schema::dropIfExists('loans');
    }
};
