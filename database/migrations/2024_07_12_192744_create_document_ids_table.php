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
        Schema::create('document_ids', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->index('uuid');
            $table->char('admin_uuid', 36)->nullable();
            $table->char('customer_uuid', 36);
            $table->foreignId('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->string('id_number')->nullable();
            $table->string('front', 2048)->nullable();
            $table->string('back', 2048)->nullable();
            $table->string('full', 2048)->nullable();
            $table->enum('status', ['0', '1'])->default('0');
            $table->date('date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_ids');
    }
};
