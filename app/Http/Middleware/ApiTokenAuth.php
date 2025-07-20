<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

/**
 * ApiTokenAuth Middleware
 *
 * Provides secure token-based authentication for internal API endpoints
 * Used by Python automation script to access active strategies
 */
class ApiTokenAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get the API token from environment
        $validToken = config('app.api_token');

        if (!$validToken) {
            Log::error('API token not configured in environment');
            return response()->json([
                'success' => false,
                'error' => 'API authentication not configured'
            ], 500);
        }

        // Check for token in multiple places (header, query, bearer)
        $providedToken = $this->extractToken($request);

        if (!$providedToken) {
            Log::warning('API access attempted without token', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'API token required',
                'message' => 'Please provide a valid API token in Authorization header, X-API-Token header, or api_token parameter'
            ], 401);
        }

        // Validate token using hash comparison to prevent timing attacks
        if (!hash_equals($validToken, $providedToken)) {
            Log::warning('Invalid API token provided', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'provided_token_length' => strlen($providedToken)
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Invalid API token'
            ], 401);
        }

        // Log successful authentication
        Log::info('API authenticated successfully', [
            'ip' => $request->ip(),
            'endpoint' => $request->path(),
            'timestamp' => Carbon::now()->toISOString()
        ]);

        return $next($request);
    }

    /**
     * Extract API token from various sources
     *
     * @param Request $request
     * @return string|null
     */
    private function extractToken(Request $request): ?string
    {
        // Check Authorization header (Bearer token)
        $authHeader = $request->header('Authorization');
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            return substr($authHeader, 7);
        }

        // Check X-API-Token header
        $apiTokenHeader = $request->header('X-API-Token');
        if ($apiTokenHeader) {
            return $apiTokenHeader;
        }

        // Check query parameter (less secure, for development only)
        $queryToken = $request->query('api_token');
        if ($queryToken && config('app.debug')) {
            return $queryToken;
        }

        return null;
    }
}
