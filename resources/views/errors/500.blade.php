<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Server Error - {{ config('app.name') }}</title>
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
                    component: 'errors/500',
                    props: {
                        status: {{ $exception->getStatusCode() ?? 500 }},
                        message: '{{ config('app.debug') ? $exception->getMessage() : 'Internal server error' }}',
                        @if(config('app.debug'))
                        exception: '{{ get_class($exception) }}',
                        file: '{{ $exception->getFile() }}',
                        line: {{ $exception->getLine() }},
                        trace: @json(array_slice($exception->getTrace(), 0, 10)),
                        @endif
                    },
                    url: '{{ request()->url() }}',
                    version: '{{ Inertia\Inertia::getVersion() }}'
                }
            };
        </script>
    </body>
</html>
