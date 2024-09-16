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
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->index('uuid');
            $table->char('admin_uuid', 36)->nullable();
            $table->char('customer_uuid', 36);
            $table->foreignId('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->float('score_amount', 10, 2)->nullable()->default('0');
            $table->float('before_score', 10, 2)->nullable()->default('0');
            $table->float('after_score', 10, 2)->nullable()->default('0');
            $table->text('remake')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};
