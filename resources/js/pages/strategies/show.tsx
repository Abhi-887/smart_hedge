import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import { type Strategy, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Edit,
    Trash2,
    Play,
    Rocket,
    Download,
    FileText,
    Activity,
    Globe,
    Calendar,
    User,
    Settings,
    Code,
    Eye,
    EyeOff
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = (strategy: Strategy): BreadcrumbItem[] => [
    {
        title: 'My Strategies',
        href: '/strategies',
    },
    {
        title: strategy.name,
        href: `/strategies/${strategy.id}`,
    },
];

interface StrategyShowProps {
    strategy: Strategy;
}

/**
 * Strategy Detail Page Component
 *
 * Displays comprehensive information about a specific trading strategy
 * Features:
 * - Strategy overview with status indicators
 * - JSON parameters display with formatting
 * - File download capabilities
 * - Quick action buttons for run/deploy
 * - Professional layout with responsive design
 */
export default function StrategyShow({ strategy }: StrategyShowProps) {
    const [showRawJson, setShowRawJson] = useState(false);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) {
            router.delete(`/strategies/${strategy.id}`, {
                onSuccess: () => {
                    router.visit('/strategies');
                },
            });
        }
    };

    const handleRunTest = () => {
        router.post(`/strategies/${strategy.id}/run-test`, {}, {
            onSuccess: () => {
                // Success notification would be handled by a toast system
            },
        });
    };

    const handleDeploy = () => {
        if (confirm('Are you sure you want to deploy this strategy?')) {
            router.post(`/strategies/${strategy.id}/deploy`, {}, {
                onSuccess: () => {
                    // Success notification would be handled by a toast system
                },
            });
        }
    };

    const getStatusBadge = () => {
        if (strategy.is_active && strategy.is_public) {
            return <Badge className="bg-green-100 text-green-800">Active & Public</Badge>;
        } else if (strategy.is_active) {
            return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
        } else if (strategy.is_public) {
            return <Badge className="bg-yellow-100 text-yellow-800">Public</Badge>;
        } else {
            return <Badge variant="secondary">Inactive</Badge>;
        }
    };

    const formatJsonParams = () => {
        try {
            if (strategy.params_json) {
                const parsed = JSON.parse(strategy.params_json);
                return JSON.stringify(parsed, null, 2);
            }
            return '{}';
        } catch (error) {
            return strategy.params_json || '{}';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(strategy)}>
            <Head title={`Strategy: ${strategy.name}`} />

            <div className="px-4 py-6">
                <div className="space-y-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <Heading
                            title={strategy.name}
                            description="Strategy details and configuration"
                        />
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleRunTest}
                                className="text-blue-600"
                            >
                                <Play className="mr-2 h-4 w-4" />
                                Run Test
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleDeploy}
                                className="text-green-600"
                            >
                                <Rocket className="mr-2 h-4 w-4" />
                                Deploy
                            </Button>
                            <Link href={`/strategies/${strategy.id}/edit`}>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Strategy Overview */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Settings className="mr-2 h-5 w-5" />
                                        Strategy Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                                            <p className="text-lg font-semibold">{strategy.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {getStatusBadge()}
                                                <div className="flex gap-1">
                                                    {strategy.is_active && (
                                                        <span className="flex items-center gap-1 text-xs text-green-600">
                                                            <Activity className="h-3 w-3" />
                                                            Active
                                                        </span>
                                                    )}
                                                    {strategy.is_public && (
                                                        <span className="flex items-center gap-1 text-xs text-blue-600">
                                                            <Globe className="h-3 w-3" />
                                                            Public
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {strategy.description && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                                                <p className="text-sm leading-relaxed">{strategy.description}</p>
                                            </div>
                                        </>
                                    )}

                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Created:</span>
                                            <span>{new Date(strategy.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Updated:</span>
                                            <span>{new Date(strategy.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Parameters */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center">
                                            <Code className="mr-2 h-5 w-5" />
                                            Strategy Parameters
                                        </CardTitle>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowRawJson(!showRawJson)}
                                        >
                                            {showRawJson ? (
                                                <>
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    Formatted
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="mr-1 h-4 w-4" />
                                                    Raw JSON
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <CardDescription>
                                        Configuration parameters for this strategy
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {strategy.params_json ? (
                                        <div className="bg-muted rounded-md p-4">
                                            <pre className="text-sm font-mono overflow-auto">
                                                {showRawJson ? strategy.params_json : formatJsonParams()}
                                            </pre>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No parameters configured</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Side Panel */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Link href={`/strategies/${strategy.id}/edit`}>
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Strategy
                                        </Button>
                                    </Link>
                                    {strategy.script_file && (
                                        <Link href={`/strategies/${strategy.id}/download-script`}>
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Download className="mr-2 h-4 w-4" />
                                                Download Script
                                            </Button>
                                        </Link>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-blue-600"
                                        onClick={handleRunTest}
                                    >
                                        <Play className="mr-2 h-4 w-4" />
                                        Run Test
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-green-600"
                                        onClick={handleDeploy}
                                    >
                                        <Rocket className="mr-2 h-4 w-4" />
                                        Deploy Strategy
                                    </Button>
                                    <Separator />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-destructive"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Strategy
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Script File Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <FileText className="mr-2 h-5 w-5" />
                                        Script File
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {strategy.script_file ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-green-600">
                                                    <FileText className="mr-1 h-3 w-3" />
                                                    Available
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                <p>Python script file is uploaded and ready for execution.</p>
                                            </div>
                                            <Link href={`/strategies/${strategy.id}/download-script`}>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download Script
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Badge variant="outline" className="text-muted-foreground">
                                                No Script
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">
                                                No Python script file has been uploaded for this strategy.
                                            </p>
                                            <Link href={`/strategies/${strategy.id}/edit`}>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Upload Script
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Strategy Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Strategy Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Strategy ID:</span>
                                        <span className="font-mono">{strategy.id}</span>
                                    </div>
                                    {strategy.user && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Owner:</span>
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {strategy.user.name}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Active:</span>
                                        <span className={strategy.is_active ? 'text-green-600' : 'text-red-600'}>
                                            {strategy.is_active ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Public:</span>
                                        <span className={strategy.is_public ? 'text-blue-600' : 'text-gray-600'}>
                                            {strategy.is_public ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
