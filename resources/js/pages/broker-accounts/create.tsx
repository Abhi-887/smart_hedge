// Broker Account Create Page
// ...will provide a form to add a new broker account

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, BookOpen } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Broker Accounts',
        href: '/broker-accounts',
    },
    {
        title: 'Add Broker Account',
        href: '/broker-accounts/create',
    },
];

interface BrokerAccountCreateProps {
    brokers: Array<{ id: number; name: string }>;
}

export default function BrokerAccountCreate({ brokers = [] }: BrokerAccountCreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        broker_id: '',
        client_code: '',
        api_key: '',
        access_token: '',
        refresh_token: '',
        token_expiry: '',
        is_active: true as boolean,
        notes: '',
    });
    const [showBrokerModal, setShowBrokerModal] = useState(false);
    const [newBroker, setNewBroker] = useState({ name: '', code: '', base_api_url: '' });
    const [brokerError, setBrokerError] = useState('');
    interface Broker { id: number; name: string; code?: string; base_api_url?: string; }
    const [brokerList, setBrokerList] = useState<Broker[]>(brokers);
    const [addingBroker, setAddingBroker] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/broker-accounts', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleAddBroker = async (e: React.FormEvent) => {
        e.preventDefault();
        setBrokerError('');
        if (!newBroker.name || !newBroker.code) {
            setBrokerError('Name and code are required.');
            return;
        }
        setAddingBroker(true);
        fetch('/brokers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
            body: JSON.stringify(newBroker),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.message || 'Failed to add broker.');
                }
                return res.json();
            })
            .then((broker) => {
                setBrokerList(prev => [...prev, broker]);
                setData('broker_id', broker.id);
                setShowBrokerModal(false);
                setNewBroker({ name: '', code: '', base_api_url: '' });
            })
            .catch((err) => {
                setBrokerError(err.message || 'Failed to add broker.');
            })
            .finally(() => setAddingBroker(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Broker Account" />
            <div className="px-4 py-6">
                <div className="space-y-8">
                    <Heading
                        title="Add Broker Account"
                        description="Link a new broker API account to your profile"
                    />
                    <div className="max-w-2xl">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    Broker Account Information
                                </CardTitle>
                                <CardDescription>
                                    Fill in the details below to add a new broker account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Broker Selection */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="broker_id">Broker *</Label>
                                            <Button type="button" size="sm" variant="outline" onClick={() => setShowBrokerModal(true)}>
                                                + Add Broker
                                            </Button>
                                        </div>
                                        <select
                                            id="broker_id"
                                            value={data.broker_id}
                                            onChange={e => setData('broker_id', e.target.value)}
                                            className={`border rounded px-3 py-2 w-full ${errors.broker_id ? 'border-red-500' : ''}`}
                                            required
                                        >
                                            <option value="">Select a broker</option>
                                            {brokerList.map(broker => (
                                                <option key={broker.id} value={broker.id}>{broker.name}</option>
                                            ))}
                                        </select>
                                        {errors.broker_id && (
                                            <p className="text-sm text-red-500">{errors.broker_id}</p>
                                        )}
                                    </div>
                                    {/* Client Code */}
                                    <div className="space-y-2">
                                        <Label htmlFor="client_code">Client Code *</Label>
                                        <Input
                                            id="client_code"
                                            type="text"
                                            value={data.client_code}
                                            onChange={e => setData('client_code', e.target.value)}
                                            placeholder="Enter your broker client code"
                                            className={errors.client_code ? 'border-red-500' : ''}
                                            required
                                        />
                                        {errors.client_code && (
                                            <p className="text-sm text-red-500">{errors.client_code}</p>
                                        )}
                                    </div>
                                    {/* API Key */}
                                    <div className="space-y-2">
                                        <Label htmlFor="api_key">API Key *</Label>
                                        <Input
                                            id="api_key"
                                            type="text"
                                            value={data.api_key}
                                            onChange={e => setData('api_key', e.target.value)}
                                            placeholder="Enter your broker API key"
                                            className={errors.api_key ? 'border-red-500' : ''}
                                            required
                                        />
                                        {errors.api_key && (
                                            <p className="text-sm text-red-500">{errors.api_key}</p>
                                        )}
                                    </div>
                                    {/* Access Token */}
                                    <div className="space-y-2">
                                        <Label htmlFor="access_token">Access Token</Label>
                                        <Input
                                            id="access_token"
                                            type="text"
                                            value={data.access_token}
                                            onChange={e => setData('access_token', e.target.value)}
                                            placeholder="Enter access token (if available)"
                                            className={errors.access_token ? 'border-red-500' : ''}
                                        />
                                        {errors.access_token && (
                                            <p className="text-sm text-red-500">{errors.access_token}</p>
                                        )}
                                    </div>
                                    {/* Refresh Token */}
                                    <div className="space-y-2">
                                        <Label htmlFor="refresh_token">Refresh Token</Label>
                                        <Input
                                            id="refresh_token"
                                            type="text"
                                            value={data.refresh_token}
                                            onChange={e => setData('refresh_token', e.target.value)}
                                            placeholder="Enter refresh token (if available)"
                                            className={errors.refresh_token ? 'border-red-500' : ''}
                                        />
                                        {errors.refresh_token && (
                                            <p className="text-sm text-red-500">{errors.refresh_token}</p>
                                        )}
                                    </div>
                                    {/* Token Expiry */}
                                    <div className="space-y-2">
                                        <Label htmlFor="token_expiry">Token Expiry</Label>
                                        <Input
                                            id="token_expiry"
                                            type="datetime-local"
                                            value={data.token_expiry}
                                            onChange={e => setData('token_expiry', e.target.value)}
                                            className={errors.token_expiry ? 'border-red-500' : ''}
                                        />
                                        {errors.token_expiry && (
                                            <p className="text-sm text-red-500">{errors.token_expiry}</p>
                                        )}
                                    </div>
                                    {/* Notes */}
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Input
                                            id="notes"
                                            type="text"
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            placeholder="Any additional notes (optional)"
                                            className={errors.notes ? 'border-red-500' : ''}
                                        />
                                        {errors.notes && (
                                            <p className="text-sm text-red-500">{errors.notes}</p>
                                        )}
                                    </div>
                                    {/* Is Active */}
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={checked => setData('is_active', !!checked)}
                                        />
                                        <Label htmlFor="is_active" className="text-sm">
                                            Account is active
                                        </Label>
                                    </div>
                                    {/* Form Actions */}
                                    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                        <Link href="/broker-accounts">
                                            <Button variant="outline" type="button">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Creating...' : 'Create Broker Account'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            {/* Add Broker Modal */}
            <Dialog open={showBrokerModal} onOpenChange={setShowBrokerModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Broker</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddBroker} className="space-y-4">
                        <div>
                            <Label htmlFor="broker_name">Broker Name *</Label>
                            <Input
                                id="broker_name"
                                value={newBroker.name}
                                onChange={e => setNewBroker({ ...newBroker, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="broker_code">Broker Code *</Label>
                            <Input
                                id="broker_code"
                                value={newBroker.code}
                                onChange={e => setNewBroker({ ...newBroker, code: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="broker_api">Base API URL</Label>
                            <Input
                                id="broker_api"
                                value={newBroker.base_api_url}
                                onChange={e => setNewBroker({ ...newBroker, base_api_url: e.target.value })}
                            />
                        </div>
                        {brokerError && <p className="text-sm text-red-500">{brokerError}</p>}
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setShowBrokerModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={addingBroker}>
                                {addingBroker ? 'Adding...' : 'Add Broker'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
