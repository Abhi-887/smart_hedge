<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e): Response
    {
        $response = parent::render($request, $e);

        // Handle maintenance mode specifically
        if ($e instanceof \Illuminate\Foundation\Http\Exceptions\MaintenanceModeException) {
            return $this->renderMaintenancePage($request, $e);
        }

        // If this is an Inertia request and we have a custom error page
        if ($request->header('X-Inertia') && in_array($response->getStatusCode(), [404, 403, 500, 503, 429])) {
            return $this->renderInertiaErrorPage($request, $response, $e);
        }

        return $response;
    }

    /**
     * Render maintenance mode page.
     */
    protected function renderMaintenancePage(Request $request, $e): Response
    {
        $data = json_decode($e->getMessage(), true) ?: [];

        $maintenanceData = [
            'retryAfter' => $data['time'] ?? 0,
            'message' => $data['message'] ?? 'We are currently performing scheduled maintenance',
            'estimatedTime' => $data['estimatedTime'] ?? null,
        ];

        if ($request->header('X-Inertia')) {
            return Inertia::render('errors/maintenance', $maintenanceData)
                         ->toResponse($request)
                         ->setStatusCode(503);
        }

        return response()->view('errors.503-maintenance', $maintenanceData, 503);
    }

    /**
     * Render an Inertia error page.
     */
    protected function renderInertiaErrorPage(Request $request, Response $response, Throwable $e): Response
    {
        $statusCode = $response->getStatusCode();

        $errorData = [
            'status' => $statusCode,
            'message' => $this->getErrorMessage($e, $statusCode),
        ];

        // Add debug information if in debug mode
        if (config('app.debug')) {
            $errorData = array_merge($errorData, [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => array_slice($e->getTrace(), 0, 10), // Limit trace for performance
            ]);
        }

        return Inertia::render($this->getErrorComponent($statusCode), $errorData)
                     ->toResponse($request)
                     ->setStatusCode($statusCode);
    }

    /**
     * Get the appropriate error component based on status code.
     */
    protected function getErrorComponent(int $statusCode): string
    {
        switch ($statusCode) {
            case 404:
                return 'errors/404';
            case 500:
                return 'errors/500';
            default:
                return 'errors/error';
        }
    }

    /**
     * Get a user-friendly error message.
     */
    protected function getErrorMessage(Throwable $e, int $statusCode): string
    {
        // In production, use generic messages for security
        if (!config('app.debug')) {
            switch ($statusCode) {
                case 404:
                    return 'Page not found';
                case 403:
                    return 'Access forbidden';
                case 500:
                    return 'Internal server error';
                case 503:
                    return 'Service temporarily unavailable';
                case 429:
                    return 'Too many requests';
                default:
                    return 'Something went wrong';
            }
        }

        // In debug mode, show actual error message
        return $e->getMessage() ?: 'An error occurred';
    }
}
