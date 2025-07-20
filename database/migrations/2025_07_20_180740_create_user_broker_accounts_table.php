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
        Schema::create('user_broker_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('broker_id')->constrained()->onDelete('cascade');
            $table->string('client_code'); // Client/User ID from broker
            $table->text('api_key'); // Encrypted API key
            $table->text('access_token')->nullable(); // Encrypted access token
            $table->text('refresh_token')->nullable(); // Encrypted refresh token
            $table->timestamp('token_expiry')->nullable(); // Token expiry time
            $table->boolean('is_active')->default(true); // Account status
            $table->text('notes')->nullable(); // Additional notes
            $table->timestamps();

            // Unique constraint: one account per user per broker
            $table->unique(['user_id', 'broker_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_broker_accounts');
    }
};
