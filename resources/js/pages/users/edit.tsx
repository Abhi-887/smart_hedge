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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { type User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, User as UserIcon, Shield, Mail } from 'lucide-react';

interface UserEditProps {
    user: User;
}

/**
 * User Edit Page Component
 * 
 * Provides a comprehensive form for editing existing users
 * Features:
 * - Pre-populated form with current user data
 * - Avatar display with current user image
 * - Role management
 * - Email verification controls
 * - Password reset option
 * - Professional form validation
 */
export default function UserEdit({ user }: UserEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: 'user', // You would get this from user data if roles are implemented
        is_active: true as boolean,
        email_verified_at: user.email_verified_at,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`, {
            onSuccess: () => {
                // Success notification would be handled by a toast system
            },
        });
    };

    const handleSendVerificationEmail = () => {
        // Handle sending verification email
        // router.post(`/users/${user.id}/send-verification`);
    };

    const handleResetPassword = () => {
        // Handle password reset
        // router.post(`/users/${user.id}/reset-password`);
    };

    return (
        <AppShell>
            <Head title={`Edit User: ${user.name}`} />
            
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={`/users/${user.id}`}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Profile
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                            <p className="text-muted-foreground">
                                Update user information and settings
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Avatar and Status */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback className="text-2xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle className="text-xl">{user.name}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                                <div className="flex justify-center pt-2">
                                    <Badge
                                        variant={user.email_verified_at ? 'default' : 'secondary'}
                                    >
                                        {user.email_verified_at ? 'Verified' : 'Unverified'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Quick Actions */}
                                {!user.email_verified_at && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full"
                                        onClick={handleSendVerificationEmail}
                                    >
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send Verification Email
                                    </Button>
                                )}
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full"
                                    onClick={handleResetPassword}
                                >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Reset Password
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Edit Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <UserIcon className="mr-2 h-5 w-5" />
                                    User Information
                                </CardTitle>
                                <CardDescription>
                                    Update the user's profile information and settings
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

                                    {/* Role and Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                        <div className="space-y-2">
                                            <Label>Account Status</Label>
                                            <div className="flex items-center space-x-2 pt-2">
                                                <Checkbox
                                                    id="is_active"
                                                    checked={data.is_active}
                                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                                />
                                                <Label htmlFor="is_active" className="text-sm">
                                                    Account is active
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Verification Status */}
                                    <div className="space-y-2">
                                        <Label>Email Verification</Label>
                                        <div className="p-4 border rounded-lg bg-muted/50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Email verification status
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.email_verified_at 
                                                            ? `Verified on ${new Date(user.email_verified_at).toLocaleDateString()}`
                                                            : 'Email not verified'
                                                        }
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={user.email_verified_at ? 'default' : 'secondary'}
                                                >
                                                    {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                        <Link href={`/users/${user.id}`}>
                                            <Button variant="outline" type="button">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
