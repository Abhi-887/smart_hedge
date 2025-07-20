<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Access Forbidden - {{ config('app.name') }}</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        <script>
            window.Inertia = {
                page: {
                    component: 'errors/error',
                    props: {
                        status: 403,
                        message: '{{ $exception->getMessage() ?: 'Access forbidden' }}',
                    },
                    url: '{{ request()->url() }}',
                    version: '{{ Inertia\Inertia::getVersion() }}'
                }
            };
        </script>
    </body>
</html>
