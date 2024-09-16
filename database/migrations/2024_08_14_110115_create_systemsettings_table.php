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
        Schema::create('systemsettings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->index('uuid');
            $table->char('admin_uuid', 36)->nullable();
            $table->char('customer_uuid', 36);
            $table->string('name')->nullable();
            $table->longText('web_message')->nullable();
            $table->string('slides', 2048)->nullable();
            $table->string('telegram_qr', 2048)->nullable();
            $table->string('line_qr', 2048)->nullable();
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
        Schema::dropIfExists('systemsettings');
    }
};
