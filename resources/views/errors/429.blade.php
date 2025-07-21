<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Too Many Requests - {{ config('app.name') }}</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    </head>
    <body class="font-sans antialiased">
        <div id="app" data-page="{{ json_encode([
            'component' => 'errors/error',
            'props' => [
                'status' => 429,
                'message' => $exception->getMessage() ?: 'Too many requests',
            ],
            'url' => request()->url(),
            'version' => \Inertia\Inertia::getVersion()
        ]) }}"></div>
    </body>
</html>
