import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit, Calendar, Trash2, Folder } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface BrokerAccountShowProps {
    brokerAccount: any;
}

export default function BrokerAccountShow({ brokerAccount }: BrokerAccountShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Broker Accounts',
            href: '/broker-accounts',
        },
        {
            title: brokerAccount.broker?.name || 'Broker',
            href: `/broker-accounts/${brokerAccount.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Broker Account: ${brokerAccount.broker?.name || ''}`} />
            <div className="px-4 py-6">
                <div className="space-y-6">
                    <Heading
                        title={brokerAccount.broker?.name || 'Broker Account'}
                        description={`Viewing details for client code: ${brokerAccount.client_code}`}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Broker Profile Card */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src={brokerAccount.broker?.logo} />
                                            <AvatarFallback className="text-2xl">
                                                {brokerAccount.broker?.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <CardTitle className="text-xl">{brokerAccount.broker?.name}</CardTitle>
                                    <CardDescription>{brokerAccount.broker?.code?.toUpperCase()}</CardDescription>
                                    <div className="flex justify-center pt-2">
                                        <Badge
                                            variant={brokerAccount.is_active ? 'default' : 'secondary'}
                                            className="flex items-center gap-1"
                                        >
                                            {brokerAccount.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                        {/* Broker Account Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Folder className="mr-2 h-5 w-5" />
                                        Account Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Client Code
                                            </label>
                                            <p className="text-sm">{brokerAccount.client_code}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                API Key
                                            </label>
                                            <p className="text-sm">{brokerAccount.api_key ? '************' : '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Access Token
                                            </label>
                                            <p className="text-sm">{brokerAccount.access_token ? '************' : '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Token Expiry
                                            </label>
                                            <p className="text-sm">
                                                {brokerAccount.token_expiry ? (
                                                    new Date(brokerAccount.token_expiry).toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">-</span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Notes
                                            </label>
                                            <p className="text-sm">{brokerAccount.notes || '-'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>
                                        Manage this broker account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-3">
                                        <Link href={`/broker-accounts/${brokerAccount.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Account
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm" color="destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Account
                                        </Button>
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
