<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StrategyController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // User Management Routes
    Route::resource('users', UserController::class);
    Route::get('users/roles', [UserController::class, 'roles'])->name('users.roles');
    Route::post('users/{user}/send-verification', [UserController::class, 'sendVerification'])->name('users.send-verification');
    Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');

    // Strategy Management Routes
    Route::resource('strategies', StrategyController::class);
    Route::get('strategies/{strategy}/download-script', [StrategyController::class, 'downloadScript'])->name('strategies.download-script');
    Route::post('strategies/{strategy}/run-test', [StrategyController::class, 'runTest'])->name('strategies.run-test');
    Route::post('strategies/{strategy}/deploy', [StrategyController::class, 'deploy'])->name('strategies.deploy');

    // Portfolio Analytics Routes
    Route::get('portfolio-analytics', [App\Http\Controllers\PortfolioAnalyticsController::class, 'index'])->name('portfolio-analytics.index');
    Route::get('api/portfolio-analytics', [App\Http\Controllers\PortfolioAnalyticsController::class, 'getAnalytics'])->name('api.portfolio-analytics');

    // Broker Accounts Management
    Route::resource('broker-accounts', App\Http\Controllers\BrokerAccountController::class);
    Route::post('brokers', [App\Http\Controllers\BrokerController::class, 'store'])->name('brokers.store');

    // Market Data Routes
    Route::get('market-data', [App\Http\Controllers\MarketDataController::class, 'index'])->name('market-data.index');
    Route::get('api/market-data/gainers-losers', [App\Http\Controllers\MarketDataController::class, 'getTopGainers'])->name('api.market-data.gainers-losers');
    Route::get('api/market-data/pcr', [App\Http\Controllers\MarketDataController::class, 'getPCRData'])->name('api.market-data.pcr');
    Route::get('api/market-data/oi-buildup', [App\Http\Controllers\MarketDataController::class, 'getOIBuildup'])->name('api.market-data.oi-buildup');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
