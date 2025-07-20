import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Heading from '@/components/heading';
import { type Strategy, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    MoreHorizontal,
    Plus,
    Search,
    Edit,
    Eye,
    Trash2,
    Play,
    Rocket,
    Download,
    FileText,
    Activity,
    Globe
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Strategies',
        href: '/strategies',
    },
];

interface StrategiesIndexProps {
    strategies: {
        data: Strategy[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        search?: string;
        status?: string;
    };
}

/**
 * Strategies Index Page Component
 *
 * Displays a paginated list of user's strategies with management actions
 * Features:
 * - Strategy status badges and info display
 * - Quick action dropdown menu with run/deploy options
 * - Responsive table design
 * - Professional pagination
 * - Search and filtering capabilities
 */
export default function StrategiesIndex({ strategies, filters }: StrategiesIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/strategies', { search: searchTerm, status: statusFilter }, {
            preserveState: true,
            replace: true
        });
    };

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        router.get('/strategies', { search: searchTerm, status: status === 'all' ? '' : status }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDeleteStrategy = (strategyId: number) => {
        if (confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) {
            router.delete(`/strategies/${strategyId}`, {
                onSuccess: () => {
                    // Success notification would be handled by a toast system
                },
            });
        }
    };

    const handleRunTest = (strategyId: number) => {
        router.post(`/strategies/${strategyId}/run-test`, {}, {
            onSuccess: () => {
                // Success notification would be handled by a toast system
            },
        });
    };

    const handleDeploy = (strategyId: number) => {
        if (confirm('Are you sure you want to deploy this strategy?')) {
            router.post(`/strategies/${strategyId}/deploy`, {}, {
                onSuccess: () => {
                    // Success notification would be handled by a toast system
                },
            });
        }
    };

    const getStatusBadge = (strategy: Strategy) => {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Strategies" />

            <div className="px-4 py-6">
                <div className="space-y-8">
                    {/* Page Header */}
                    <Heading
                        title="Strategy Management"
                        description="Manage your trading strategies and deploy them to the market"
                    />

                    {/* Search and Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Search & Filter Strategies</CardTitle>
                            <CardDescription>
                                Find strategies by name, description, or filter by status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearch} className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search strategies..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={statusFilter || 'all'} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Strategies</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit">Search</Button>
                                <Link href="/strategies/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Strategy
                                    </Button>
                                </Link>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Strategies Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Strategies ({strategies.total})</CardTitle>
                            <CardDescription>
                                Total {strategies.total} strategies in your portfolio
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Strategy</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Script</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {strategies.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="h-12 w-12 text-muted-foreground" />
                                                    <p className="text-muted-foreground">No strategies found</p>
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href="/strategies/create">
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Create Your First Strategy
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        strategies.data.map((strategy) => (
                                            <TableRow key={strategy.id}>
                                                <TableCell className="font-medium">
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{strategy.name}</div>
                                                        {strategy.description && (
                                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                                {strategy.description}
                                                            </div>
                                                        )}
                                                        <div className="text-xs text-muted-foreground">
                                                            ID: {strategy.id}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        {getStatusBadge(strategy)}
                                                        <div className="flex gap-1 text-xs">
                                                            {strategy.is_active && (
                                                                <span className="flex items-center gap-1 text-green-600">
                                                                    <Activity className="h-3 w-3" />
                                                                    Active
                                                                </span>
                                                            )}
                                                            {strategy.is_public && (
                                                                <span className="flex items-center gap-1 text-blue-600">
                                                                    <Globe className="h-3 w-3" />
                                                                    Public
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {strategy.script_file ? (
                                                        <Badge variant="outline" className="text-green-600">
                                                            <FileText className="mr-1 h-3 w-3" />
                                                            Available
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-muted-foreground">
                                                            No Script
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(strategy.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/strategies/${strategy.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/strategies/${strategy.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Strategy
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {strategy.script_file && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/strategies/${strategy.id}/download-script`}>
                                                                        <Download className="mr-2 h-4 w-4" />
                                                                        Download Script
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleRunTest(strategy.id)}
                                                                className="text-blue-600"
                                                            >
                                                                <Play className="mr-2 h-4 w-4" />
                                                                Run Test
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeploy(strategy.id)}
                                                                className="text-green-600"
                                                            >
                                                                <Rocket className="mr-2 h-4 w-4" />
                                                                Deploy
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => handleDeleteStrategy(strategy.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Strategy
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {strategies.last_page > 1 && (
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={strategies.current_page === 1}
                                onClick={() => router.get(`/strategies?page=${strategies.current_page - 1}`)}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {strategies.current_page} of {strategies.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={strategies.current_page === strategies.last_page}
                                onClick={() => router.get(`/strategies?page=${strategies.current_page + 1}`)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
