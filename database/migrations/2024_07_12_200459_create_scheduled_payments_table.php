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
        Schema::create('scheduled_payments', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->index('uuid');
            $table->char('customer_uuid', 36)->nullable();
            $table->foreignId('loan_id')->references('id')->on('loans')->cascadeOnDelete();
            $table->date('date');
            $table->double('amount', 12, 2); //Opening Balance
            $table->double('loan_repayment', 12, 2)->nullable(); //ยอดต้องจ่าย รวมกับดอกเบี้ย Loan Repayment
            $table->double('interest_charged', 12, 2)->nullable(); // ดอกเบี้ย Interest Charged
            $table->double('capital_repaid', 12, 2)->nullable(); // ทุน ชำระคืน Capital Repaid
            $table->double('closing_amount', 12, 2); // ยอดเงินคงเหลื่อ Closing Balance
            $table->double('capital_outstanding_percent', 12, 2); // เปอร์เซ็นต์คงเหลือจากยอดเงิน % Capital Outstanding
            $table->enum('status', ['0', '1'])->default('0');
            $table->string('loan_remark')->default('under review');
            $table->string('ip_address')->nullable();
            // $table->foreignId('status_id')->references('id')->on('statuses')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scheduled_payments');
    }
};
