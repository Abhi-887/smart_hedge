<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Server Error - {{ config('app.name') }}</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    </head>
    <body class="font-sans antialiased">
        <div id="app" data-page="{{ json_encode([
            'component' => 'errors/500',
            'props' => [
                'status' => $exception->getStatusCode() ?? 500,
                'message' => config('app.debug') ? $exception->getMessage() : 'Internal server error',
                'exception' => config('app.debug') ? get_class($exception) : null,
                'file' => config('app.debug') ? $exception->getFile() : null,
                'line' => config('app.debug') ? $exception->getLine() : null,
                'trace' => config('app.debug') ? array_slice($exception->getTrace(), 0, 10) : null,
            ],
            'url' => request()->url(),
            'version' => \Inertia\Inertia::getVersion()
        ]) }}"></div>
    </body>
</html>
