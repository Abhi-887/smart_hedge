import { AppShell } from '@/components/app-shell';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';

interface UserCreateProps {
    // You can add roles, permissions, etc. here if needed
}

/**
 * User Creation Page Component
 * 
 * Provides a professional form for creating new users
 * Features:
 * - Form validation with real-time feedback
 * - Role selection
 * - Email verification option
 * - Responsive design
 * - Professional styling
 */
export default function UserCreate({}: UserCreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
        send_verification_email: true as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users', {
            onSuccess: () => {
                reset();
                // Success notification would be handled by a toast system
            },
        });
    };

    return (
        <AppShell>
            <Head title="Create New User" />
            
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/users">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
                            <p className="text-muted-foreground">
                                Add a new user to your system with proper credentials
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Creation Form */}
                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <UserPlus className="mr-2 h-5 w-5" />
                                User Information
                            </CardTitle>
                            <CardDescription>
                                Fill in the details below to create a new user account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter full name"
                                            className={errors.name ? 'border-red-500' : ''}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter email address"
                                            className={errors.email ? 'border-red-500' : ''}
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Password Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter password"
                                            className={errors.password ? 'border-red-500' : ''}
                                            required
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-500">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm Password *</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm password"
                                            className={errors.password_confirmation ? 'border-red-500' : ''}
                                            required
                                        />
                                        {errors.password_confirmation && (
                                            <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="role">User Role</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                            <SelectItem value="moderator">Moderator</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-sm text-red-500">{errors.role}</p>
                                    )}
                                </div>

                                {/* Email Verification Option */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="send_verification_email"
                                        checked={data.send_verification_email}
                                        onCheckedChange={(checked) => setData('send_verification_email', !!checked)}
                                    />
                                    <Label htmlFor="send_verification_email" className="text-sm">
                                        Send email verification link to user
                                    </Label>
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                    <Link href="/users">
                                        <Button variant="outline" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Creating...' : 'Create User'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
