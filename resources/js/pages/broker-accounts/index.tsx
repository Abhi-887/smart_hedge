// Broker Accounts Index Page
// ...will list all broker accounts for the user

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { MoreHorizontal, Plus, Search, Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Broker Accounts',
        href: '/broker-accounts',
    },
];

interface BrokerAccount {
    id: number;
    broker: {
        id: number;
        name: string;
        code: string;
        logo?: string;
    };
    client_code: string;
    is_active: boolean;
    token_expiry?: string | null;
    created_at: string;
    status_badge?: { text: string; variant: string };
}

interface BrokerAccountsIndexProps {
    brokerAccounts: {
        data: BrokerAccount[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    brokers: Array<{ id: number; name: string }>;
    filters?: {
        search?: string;
        broker?: string;
        status?: string;
    };
}

export default function BrokerAccountsIndex({ brokerAccounts, brokers, filters }: BrokerAccountsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [brokerFilter, setBrokerFilter] = useState(filters?.broker || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/broker-accounts', {
            search: searchTerm,
            broker: brokerFilter,
            status: statusFilter,
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this broker account?')) {
            router.delete(`/broker-accounts/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Broker Accounts" />
            <div className="px-4 py-6">
                <div className="space-y-8">
                    <Heading
                        title="Broker Accounts"
                        description="Manage your broker API accounts and credentials"
                    />
                    {/* Search and Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Search Broker Accounts</CardTitle>
                            <CardDescription>
                                Find broker accounts by broker, client code, or status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search by broker or client code..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <select
                                    className="border rounded px-3 py-2 min-w-[140px] text-sm bg-background"
                                    value={brokerFilter}
                                    onChange={e => setBrokerFilter(e.target.value)}
                                >
                                    <option value="">All Brokers</option>
                                    {brokers.map(broker => (
                                        <option key={broker.id} value={broker.id}>{broker.name}</option>
                                    ))}
                                </select>
                                <select
                                    className="border rounded px-3 py-2 min-w-[120px] text-sm bg-background"
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <Button type="submit">Search</Button>
                                <Link href="/broker-accounts/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Broker Account
                                    </Button>
                                </Link>
                            </form>
                        </CardContent>
                    </Card>
                    {/* Broker Accounts Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>All Broker Accounts ({brokerAccounts.total})</CardTitle>
                            <CardDescription>
                                Total {brokerAccounts.total} broker accounts linked to your profile
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Broker</TableHead>
                                        <TableHead>Client Code</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Token Expiry</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {brokerAccounts.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <p className="text-muted-foreground">No broker accounts found</p>
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href="/broker-accounts/create">
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add First Broker Account
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        brokerAccounts.data.map((account) => (
                                            <TableRow key={account.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={account.broker.logo} />
                                                            <AvatarFallback>
                                                                {account.broker.name.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{account.broker.name}</div>
                                                            <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                                                {account.broker.code}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{account.client_code}</TableCell>
                                                <TableCell>
                                                    <Badge variant={account.is_active ? 'default' : 'secondary'}>
                                                        {account.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {account.token_expiry ? (
                                                        <span>{new Date(account.token_expiry).toLocaleString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">-</span>
                                                    )}
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
                                                                <Link href={`/broker-accounts/${account.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/broker-accounts/${account.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Account
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => handleDelete(account.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Account
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
                    {brokerAccounts.last_page > 1 && (
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={brokerAccounts.current_page === 1}
                                onClick={() => router.get(`/broker-accounts?page=${brokerAccounts.current_page - 1}`)}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {brokerAccounts.current_page} of {brokerAccounts.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={brokerAccounts.current_page === brokerAccounts.last_page}
                                onClick={() => router.get(`/broker-accounts?page=${brokerAccounts.current_page + 1}`)}
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
