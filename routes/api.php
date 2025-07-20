<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ActiveStrategyController;

// API Routes for automated trading system
Route::middleware(['api.token'])->group(function () {
    // Health check endpoint
    Route::get('/health', [ActiveStrategyController::class, 'health']);

    // Get active strategies for automation
    Route::get('/active-strategies', [ActiveStrategyController::class, 'index']);

    // Get specific strategy details
    Route::get('/strategies/{strategy}', [ActiveStrategyController::class, 'show']);
});

// Fallback for unauthenticated API requests
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'error' => 'Endpoint not found',
        'message' => 'The requested API endpoint does not exist or requires authentication'
    ], 404);
});
