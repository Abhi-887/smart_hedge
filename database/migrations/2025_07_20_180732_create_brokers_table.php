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
        Schema::create('brokers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Broker name (e.g., Angel One, Zerodha)
            $table->string('code')->unique(); // Short code like 'angel', 'zerodha'
            $table->string('base_api_url')->nullable(); // API base URL
            $table->string('logo')->nullable(); // Broker logo path
            $table->text('description')->nullable(); // Broker description
            $table->boolean('is_active')->default(true); // Active status
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brokers');
    }
};
