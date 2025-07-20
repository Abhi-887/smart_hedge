<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Strategy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

/**
 * ActiveStrategyController
 *
 * Provides secure API endpoints for automated trading system
 * Returns active strategies for Python automation script consumption
 */
class ActiveStrategyController extends Controller
{
    /**
     * Get all active strategies for automated trading
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Log API access for monitoring
            Log::info('Active strategies API accessed', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'timestamp' => Carbon::now()->toISOString()
            ]);

            // Get active strategies with script files
            $activeStrategies = Strategy::where('is_active', true)
                                      ->whereNotNull('script_file')
                                      ->where('script_file', '!=', '')
                                      ->select(['id', 'name', 'script_file', 'params_json', 'user_id'])
                                      ->get()
                                      ->map(function ($strategy) {
                                          return $this->formatStrategyForApi($strategy);
                                      })
                                      ->filter() // Remove any null results from invalid files
                                      ->values(); // Re-index array

            Log::info('Active strategies retrieved', [
                'count' => $activeStrategies->count(),
                'strategy_ids' => $activeStrategies->pluck('id')->toArray()
            ]);

            return response()->json([
                'success' => true,
                'data' => $activeStrategies,
                'meta' => [
                    'count' => $activeStrategies->count(),
                    'timestamp' => Carbon::now()->toISOString(),
                    'version' => '1.0'
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error retrieving active strategies', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve active strategies',
                'timestamp' => Carbon::now()->toISOString()
            ], 500);
        }
    }

    /**
     * Format strategy data for API consumption
     *
     * @param Strategy $strategy
     * @return array|null
     */
    private function formatStrategyForApi(Strategy $strategy): ?array
    {
        try {
            // Verify script file exists
            if (!$strategy->script_file || !Storage::exists($strategy->script_file)) {
                Log::warning('Strategy script file not found', [
                    'strategy_id' => $strategy->id,
                    'script_file' => $strategy->script_file
                ]);
                return null;
            }

            // Get absolute path to script file
            $scriptPath = Storage::path($strategy->script_file);

            // Decode and validate JSON parameters
            $params = [];
            if ($strategy->params_json) {
                try {
                    $params = json_decode($strategy->params_json, true, 512, JSON_THROW_ON_ERROR);
                } catch (\JsonException $e) {
                    Log::warning('Invalid JSON parameters for strategy', [
                        'strategy_id' => $strategy->id,
                        'json_error' => $e->getMessage()
                    ]);
                    $params = [];
                }
            }

            return [
                'id' => $strategy->id,
                'name' => $strategy->name,
                'script_path' => $scriptPath,
                'params' => $params,
                'user_id' => $strategy->user_id,
                'last_modified' => Storage::lastModified($strategy->script_file),
                'file_size' => Storage::size($strategy->script_file)
            ];

        } catch (\Exception $e) {
            Log::error('Error formatting strategy for API', [
                'strategy_id' => $strategy->id,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Health check endpoint for monitoring
     *
     * @return JsonResponse
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'healthy',
            'timestamp' => Carbon::now()->toISOString(),
            'version' => '1.0',
            'laravel_version' => app()->version()
        ]);
    }

    /**
     * Get strategy execution logs (for monitoring)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logs(Request $request): JsonResponse
    {
        try {
            $limit = min($request->get('limit', 100), 1000); // Max 1000 logs
            $strategyId = $request->get('strategy_id');

            // This would typically read from a dedicated logs table
            // For now, return recent log entries from Laravel logs
            $logFile = storage_path('logs/trading.log');
            $logs = [];

            if (file_exists($logFile)) {
                $logContent = file_get_contents($logFile);
                $logLines = array_slice(explode("\n", $logContent), -$limit);

                foreach ($logLines as $line) {
                    if (!empty(trim($line))) {
                        $logs[] = [
                            'content' => $line,
                            'timestamp' => Carbon::now()->toISOString() // In real implementation, parse from log
                        ];
                    }
                }
            }

            return response()->json([
                'success' => true,
                'data' => $logs,
                'meta' => [
                    'count' => count($logs),
                    'limit' => $limit
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error retrieving logs', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve logs'
            ], 500);
        }
    }
}
