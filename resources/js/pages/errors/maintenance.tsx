import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import {
    Settings,
    Clock,
    RefreshCw,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface MaintenanceProps {
    retryAfter?: number;
    message?: string;
    estimatedTime?: string;
}

/**
 * Maintenance Mode Page
 *
 * A beautiful maintenance page with countdown timer and status updates
 */
export default function Maintenance({
    retryAfter,
    message = 'We are currently performing scheduled maintenance',
    estimatedTime
}: MaintenanceProps) {
    const [timeLeft, setTimeLeft] = useState<number>(retryAfter || 0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (retryAfter && retryAfter > 0) {
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        window.location.reload();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [retryAfter]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <>
            <Head title="Maintenance Mode - Smart Hedge" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
                <div className="max-w-2xl w-full">
                    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                        <CardHeader className="text-center pb-6">
                            {/* Animated Maintenance Icon */}
                            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <Settings className="w-12 h-12 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
                            </div>

                            <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
                                Under Maintenance
                            </CardTitle>

                            <CardDescription className="text-lg text-gray-600 leading-relaxed">
                                {message}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Countdown Timer */}
                            {timeLeft > 0 && (
                                <div className="bg-blue-50 rounded-lg p-6 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-semibold text-blue-800">Estimated Time Remaining</h3>
                                    </div>
                                    <div className="text-3xl font-bold text-blue-600 font-mono">
                                        {formatTime(timeLeft)}
                                    </div>
                                    <p className="text-sm text-blue-600 mt-2">
                                        The page will automatically refresh when maintenance is complete
                                    </p>
                                </div>
                            )}

                            {/* Estimated Time */}
                            {estimatedTime && !timeLeft && (
                                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                                        <h3 className="font-semibold text-yellow-800">Estimated Completion</h3>
                                    </div>
                                    <p className="text-yellow-700">{estimatedTime}</p>
                                </div>
                            )}

                            {/* What's Being Updated */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    What we're working on:
                                </h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        Server updates and security patches
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        Database optimization and improvements
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        Enhanced performance and new features
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        System monitoring and reliability improvements
                                    </li>
                                </ul>
                            </div>

                            {/* Manual Refresh Button */}
                            <div className="flex justify-center">
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Check if Ready
                                </Button>
                            </div>

                            {/* Contact Information */}
                            <div className="text-center text-sm text-gray-500 border-t pt-4">
                                <p className="mb-2">
                                    Having issues? Contact our support team:
                                </p>
                                <div className="space-y-1">
                                    <p>📧 support@smarthedge.com</p>
                                    <p>🐦 @SmartHedgeSupport</p>
                                    <p>📱 +1 (555) 123-4567</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Badge */}
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">Maintenance in Progress</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
