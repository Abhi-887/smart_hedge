<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;

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

    // Broker Accounts Management
    Route::resource('broker-accounts', App\Http\Controllers\BrokerAccountController::class);
    Route::post('brokers', [App\Http\Controllers\BrokerController::class, 'store'])->name('brokers.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
