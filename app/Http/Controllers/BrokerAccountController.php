<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBrokerAccountRequest;
use App\Http\Requests\UpdateBrokerAccountRequest;
use App\Models\Broker;
use App\Models\UserBrokerAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

/**
 * BrokerAccountController
 *
 * Handles broker account management operations including CRUD operations,
 * API credential management, and account activation/deactivation.
 * All sensitive data is encrypted for security.
 */
class BrokerAccountController extends Controller
{
    /**
     * Display a listing of user's broker accounts.
     */
    public function index(Request $request): Response
    {
        $query = UserBrokerAccount::with('broker')
            ->where('user_id', auth()->id());

        // Search functionality
        if ($request->filled('search')) {
            $query->whereHas('broker', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
            })->orWhere('client_code', 'like', '%' . $request->search . '%');
        }

        // Filter by broker
        if ($request->filled('broker')) {
            $query->where('broker_id', $request->broker);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $brokerAccounts = $query->orderBy('created_at', 'desc')
                               ->paginate(15)
                               ->withQueryString();

        $brokers = Broker::active()->orderBy('name')->get();

        return Inertia::render('broker-accounts/index', [
            'brokerAccounts' => $brokerAccounts,
            'brokers' => $brokers,
            'filters' => [
                'search' => $request->search,
                'broker' => $request->broker,
                'status' => $request->status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new broker account.
     */
    public function create(): Response
    {
        $brokers = Broker::active()->orderBy('name')->get();

        // Get user's existing broker IDs to exclude from selection
        $existingBrokerIds = UserBrokerAccount::where('user_id', auth()->id())
            ->pluck('broker_id')
            ->toArray();

        $availableBrokers = $brokers->whereNotIn('id', $existingBrokerIds);

        return Inertia::render('broker-accounts/create', [
            'brokers' => $availableBrokers->values(),
        ]);
    }

    /**
     * Store a newly created broker account.
     */
    public function store(StoreBrokerAccountRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();

        UserBrokerAccount::create($validated);

        return Redirect::route('broker-accounts.index')
            ->with('success', 'Broker account added successfully.');
    }

    /**
     * Display the specified broker account.
     */
    public function show(UserBrokerAccount $brokerAccount): Response
    {
        // Ensure user can only view their own accounts
        if ($brokerAccount->user_id !== auth()->id()) {
            abort(403);
        }

        $brokerAccount->load('broker', 'user');

        return Inertia::render('broker-accounts/show', [
            'brokerAccount' => $brokerAccount,
        ]);
    }

    /**
     * Show the form for editing the specified broker account.
     */
    public function edit(UserBrokerAccount $brokerAccount): Response
    {
        // Ensure user can only edit their own accounts
        if ($brokerAccount->user_id !== auth()->id()) {
            abort(403);
        }

        $brokerAccount->load('broker');
        $brokers = Broker::active()->orderBy('name')->get();

        // Get user's existing broker IDs (excluding current account)
        $existingBrokerIds = UserBrokerAccount::where('user_id', auth()->id())
            ->where('id', '!=', $brokerAccount->id)
            ->pluck('broker_id')
            ->toArray();

        $availableBrokers = $brokers->whereNotIn('id', $existingBrokerIds);

        return Inertia::render('broker-accounts/edit', [
            'brokerAccount' => $brokerAccount,
            'brokers' => $availableBrokers->values(),
        ]);
    }

    /**
     * Update the specified broker account.
     */
    public function update(UpdateBrokerAccountRequest $request, UserBrokerAccount $brokerAccount)
    {
        // Ensure user can only update their own accounts
        if ($brokerAccount->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validated();
        $brokerAccount->update($validated);

        return Redirect::route('broker-accounts.show', $brokerAccount)
            ->with('success', 'Broker account updated successfully.');
    }

    /**
     * Remove the specified broker account.
     */
    public function destroy(UserBrokerAccount $brokerAccount)
    {
        // Ensure user can only delete their own accounts
        if ($brokerAccount->user_id !== auth()->id()) {
            abort(403);
        }

        $brokerAccount->delete();

        return Redirect::route('broker-accounts.index')
            ->with('success', 'Broker account deleted successfully.');
    }

    /**
     * Test connection with broker API.
     */
    public function testConnection(UserBrokerAccount $brokerAccount)
    {
        // Ensure user can only test their own accounts
        if ($brokerAccount->user_id !== auth()->id()) {
            abort(403);
        }

        // Mock API connection test - implement actual broker API calls here
        $isConnected = true; // Replace with actual API test

        $message = $isConnected
            ? 'Connection test successful!'
            : 'Connection test failed. Please check your credentials.';

        $type = $isConnected ? 'success' : 'error';

        return Redirect::back()->with($type, $message);
    }

    /**
     * Refresh access token for the broker account.
     */
    public function refreshToken(UserBrokerAccount $brokerAccount)
    {
        // Ensure user can only refresh their own accounts
        if ($brokerAccount->user_id !== auth()->id()) {
            abort(403);
        }

        // Mock token refresh - implement actual broker API calls here
        $newToken = 'refreshed_token_' . time();
        $expiryTime = now()->addHours(24);

        $brokerAccount->update([
            'access_token' => $newToken,
            'token_expiry' => $expiryTime,
        ]);

        return Redirect::back()->with('success', 'Token refreshed successfully.');
    }

    /**
     * Toggle account status (activate/deactivate).
     */
    public function toggleStatus(UserBrokerAccount $brokerAccount)
    {
        // Ensure user can only toggle their own accounts
        if ($brokerAccount->user_id !== auth()->id()) {
            abort(403);
        }

        $brokerAccount->update([
            'is_active' => !$brokerAccount->is_active,
        ]);

        $status = $brokerAccount->is_active ? 'activated' : 'deactivated';

        return Redirect::back()->with('success', "Broker account {$status} successfully.");
    }
}
