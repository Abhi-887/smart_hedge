import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    Home,
    ArrowLeft,
    RefreshCw,
    FileQuestion,
    Server,
    Wifi,
    Shield,
    Clock,
    Bug
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ErrorPageProps {
    status?: number;
    message?: string;
    exception?: string;
    file?: string;
    line?: number;
    trace?: string[];
}

/**
 * Dynamic Error Page Component
 *
 * A beautiful, responsive error page that handles different types of errors dynamically
 * Features:
 * - Dynamic error code detection
 * - Appropriate icons and messages for different errors
 * - Helpful actions and suggestions
 * - Professional design with animations
 * - Responsive layout
 */
export default function ErrorPage({
    status = 500,
    message = 'Something went wrong',
    exception,
    file,
    line,
    trace
}: ErrorPageProps) {
    const [isRetrying, setIsRetrying] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getErrorConfig = (statusCode: number) => {
        switch (statusCode) {
            case 404:
                return {
                    icon: FileQuestion,
                    title: 'Page Not Found',
                    description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-50',
                    suggestions: [
                        'Check the URL for typing errors',
                        'Go back to the previous page',
                        'Visit our homepage',
                        'Use the navigation menu'
                    ]
                };
            case 403:
                return {
                    icon: Shield,
                    title: 'Access Forbidden',
                    description: 'You don\'t have permission to access this resource. Please contact your administrator if you believe this is an error.',
                    color: 'text-red-500',
                    bgColor: 'bg-red-50',
                    suggestions: [
                        'Check if you\'re logged in',
                        'Verify your permissions',
                        'Contact support',
                        'Go back to dashboard'
                    ]
                };
            case 500:
                return {
                    icon: Server,
                    title: 'Internal Server Error',
                    description: 'We\'re experiencing some technical difficulties. Our team has been notified and is working to fix the issue.',
                    color: 'text-red-500',
                    bgColor: 'bg-red-50',
                    suggestions: [
                        'Try refreshing the page',
                        'Wait a few minutes and try again',
                        'Check our status page',
                        'Contact support if problem persists'
                    ]
                };
            case 503:
                return {
                    icon: Clock,
                    title: 'Service Unavailable',
                    description: 'The service is temporarily unavailable due to maintenance or high traffic. Please try again later.',
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-50',
                    suggestions: [
                        'Try again in a few minutes',
                        'Check our status page',
                        'Follow us for updates',
                        'Contact support'
                    ]
                };
            case 429:
                return {
                    icon: Clock,
                    title: 'Too Many Requests',
                    description: 'You have made too many requests in a short period. Please slow down and try again later.',
                    color: 'text-orange-500',
                    bgColor: 'bg-orange-50',
                    suggestions: [
                        'Wait a moment before trying again',
                        'Reduce the frequency of requests',
                        'Check rate limits',
                        'Contact support if needed'
                    ]
                };
            default:
                return {
                    icon: AlertCircle,
                    title: 'Unexpected Error',
                    description: message || 'An unexpected error has occurred. Please try again or contact support if the problem persists.',
                    color: 'text-gray-500',
                    bgColor: 'bg-gray-50',
                    suggestions: [
                        'Try refreshing the page',
                        'Check your internet connection',
                        'Clear browser cache',
                        'Contact support'
                    ]
                };
        }
    };

    const config = getErrorConfig(status);
    const Icon = config.icon;

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.visit('/');
        }
    };

    if (!mounted) {
        return null; // Prevent hydration mismatch
    }

    return (
        <>
            <Head title={`Error ${status} - ${config.title}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
                <div className="max-w-2xl w-full">
                    {/* Error Card */}
                    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center pb-4">
                            {/* Animated Error Icon */}
                            <div className={`mx-auto w-24 h-24 ${config.bgColor} rounded-full flex items-center justify-center mb-6 animate-pulse`}>
                                <Icon className={`w-12 h-12 ${config.color}`} />
                            </div>

                            {/* Error Code */}
                            <div className="text-6xl font-bold text-gray-300 mb-2">
                                {status}
                            </div>

                            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                                {config.title}
                            </CardTitle>

                            <CardDescription className="text-lg text-gray-600 leading-relaxed">
                                {config.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Quick Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    onClick={handleGoBack}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Go Back
                                </Button>

                                <Link href="/">
                                    <Button className="flex items-center gap-2 w-full sm:w-auto">
                                        <Home className="w-4 h-4" />
                                        Go Home
                                    </Button>
                                </Link>

                                <Button
                                    onClick={handleRetry}
                                    variant="outline"
                                    disabled={isRetrying}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                                    {isRetrying ? 'Retrying...' : 'Retry'}
                                </Button>
                            </div>

                            {/* Suggestions */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Bug className="w-4 h-4" />
                                    What you can try:
                                </h3>
                                <ul className="space-y-2">
                                    {config.suggestions.map((suggestion, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Debug Information (only in development) */}
                            {process.env.NODE_ENV === 'development' && exception && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-red-800 mb-2">Debug Information</h3>
                                    <div className="text-sm text-red-700 space-y-1">
                                        <div><strong>Exception:</strong> {exception}</div>
                                        {file && <div><strong>File:</strong> {file}</div>}
                                        {line && <div><strong>Line:</strong> {line}</div>}
                                        {message && <div><strong>Message:</strong> {message}</div>}
                                    </div>

                                    {trace && trace.length > 0 && (
                                        <details className="mt-3">
                                            <summary className="cursor-pointer font-medium text-red-800">
                                                Stack Trace
                                            </summary>
                                            <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">
                                                {trace.join('\n')}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Support Contact */}
                            <div className="text-center text-sm text-gray-500">
                                <p>
                                    Need help? Contact our{' '}
                                    <Link href="/contact" className="text-blue-600 hover:underline">
                                        support team
                                    </Link>
                                    {' '}or check our{' '}
                                    <Link href="/status" className="text-blue-600 hover:underline">
                                        status page
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <div className="mt-8 text-center text-sm text-gray-400">
                        <p>Smart Hedge Trading Platform</p>
                        <p>Error ID: {Date.now().toString(36).toUpperCase()}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
