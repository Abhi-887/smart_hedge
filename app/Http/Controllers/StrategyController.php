<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStrategyRequest;
use App\Http\Requests\UpdateStrategyRequest;
use App\Models\Strategy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

/**
 * StrategyController
 *
 * Handles strategy management operations including CRUD operations,
 * file uploads, and strategy execution functionality.
 * Follows Laravel best practices with proper validation and authorization.
 */
class StrategyController extends Controller
{
    /**
     * Display a listing of strategies for the authenticated user.
     */
    public function index(Request $request): Response
    {
        $query = Strategy::where('user_id', auth()->id())
                         ->with('user:id,name,email');

        // Search functionality
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Status filtering
        if ($request->filled('status')) {
            switch ($request->status) {
                case 'active':
                    $query->where('is_active', true);
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
                case 'public':
                    $query->where('is_public', true);
                    break;
                case 'private':
                    $query->where('is_public', false);
                    break;
            }
        }

        $strategies = $query->select(['id', 'name', 'description', 'script_file', 'is_active', 'is_public', 'created_at', 'updated_at'])
                           ->orderBy('created_at', 'desc')
                           ->paginate(15)
                           ->withQueryString();

        return Inertia::render('strategies/index', [
            'strategies' => $strategies,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new strategy.
     */
    public function create(): Response
    {
        return Inertia::render('strategies/create');
    }

    /**
     * Store a newly created strategy in storage.
     */
    public function store(StoreStrategyRequest $request)
    {
        $validated = $request->getValidatedDataWithFile();

        $strategy = Strategy::create($validated);

        return Redirect::route('strategies.show', $strategy)
                      ->with('success', 'Strategy created successfully.');
    }

    /**
     * Display the specified strategy.
     */
    public function show(Strategy $strategy): Response
    {
        // Check authorization
        if ($strategy->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this strategy.');
        }

        $strategy->load('user:id,name,email');

        return Inertia::render('strategies/show', [
            'strategy' => $strategy,
        ]);
    }

    /**
     * Show the form for editing the specified strategy.
     */
    public function edit(Strategy $strategy): Response
    {
        // Check authorization
        if ($strategy->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this strategy.');
        }

        return Inertia::render('strategies/edit', [
            'strategy' => $strategy,
        ]);
    }

    /**
     * Update the specified strategy in storage.
     */
    public function update(UpdateStrategyRequest $request, Strategy $strategy)
    {
        $validated = $request->getValidatedDataWithFile();

        // Delete old script file if a new one is uploaded or if removal is requested
        if (isset($validated['script_file']) && $strategy->script_file) {
            if (Storage::exists($strategy->script_file)) {
                Storage::delete($strategy->script_file);
            }
        }

        $strategy->update($validated);

        return Redirect::route('strategies.show', $strategy)
                      ->with('success', 'Strategy updated successfully.');
    }

    /**
     * Remove the specified strategy from storage.
     */
    public function destroy(Strategy $strategy)
    {
        // Check authorization
        if ($strategy->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this strategy.');
        }

        // Delete associated script file
        if ($strategy->script_file && Storage::exists($strategy->script_file)) {
            Storage::delete($strategy->script_file);
        }

        $strategy->delete();

        return Redirect::route('strategies.index')
                      ->with('success', 'Strategy deleted successfully.');
    }

    /**
     * Download the strategy's script file.
     */
    public function downloadScript(Strategy $strategy)
    {
        // Check authorization
        if ($strategy->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this strategy.');
        }

        if (!$strategy->script_file || !Storage::exists($strategy->script_file)) {
            abort(404, 'Script file not found.');
        }

        return Storage::download($strategy->script_file, basename($strategy->script_file));
    }

    /**
     * Run a test execution of the strategy (placeholder for future implementation).
     */
    public function runTest(Strategy $strategy)
    {
        // Check authorization
        if ($strategy->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this strategy.');
        }

        // TODO: Implement strategy test execution
        return back()->with('info', 'Strategy test execution is not yet implemented.');
    }

    /**
     * Deploy the strategy (placeholder for future implementation).
     */
    public function deploy(Strategy $strategy)
    {
        // Check authorization
        if ($strategy->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this strategy.');
        }

        // TODO: Implement strategy deployment
        return back()->with('info', 'Strategy deployment is not yet implemented.');
    }
}
