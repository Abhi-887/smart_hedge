import { AppShell } from '@/components/app-shell';
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
import { Separator } from '@/components/ui/separator';
import { type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Mail, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';

interface UserShowProps {
    user: User;
}

/**
 * User Detail Page Component
 * 
 * Displays comprehensive user information in a professional layout
 * Features:
 * - User avatar and basic info
 * - Account status and verification
 * - Activity timeline (if available)
 * - Quick action buttons
 * - Responsive card layout
 */
export default function UserShow({ user }: UserShowProps) {
    return (
        <AppShell>
            <Head title={`User: ${user.name}`} />
            
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
                            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
                            <p className="text-muted-foreground">
                                Viewing profile for {user.name}
                            </p>
                        </div>
                    </div>
                    <Link href={`/users/${user.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Profile Card */}
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
                                        className="flex items-center gap-1"
                                    >
                                        {user.email_verified_at ? (
                                            <CheckCircle className="h-3 w-3" />
                                        ) : (
                                            <XCircle className="h-3 w-3" />
                                        )}
                                        {user.email_verified_at ? 'Verified' : 'Unverified'}
                                    </Badge>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* User Information Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Shield className="mr-2 h-5 w-5" />
                                    Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            User ID
                                        </label>
                                        <p className="text-sm">{user.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Email Status
                                        </label>
                                        <p className="text-sm flex items-center gap-1">
                                            {user.email_verified_at ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    Verified on {new Date(user.email_verified_at).toLocaleDateString()}
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                    Not verified
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Member Since
                                        </label>
                                        <p className="text-sm flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Last Updated
                                        </label>
                                        <p className="text-sm">
                                            {new Date(user.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Common actions you can perform for this user
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-3">
                                    <Link href={`/users/${user.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Profile
                                        </Button>
                                    </Link>
                                    {!user.email_verified_at && (
                                        <Button variant="outline" size="sm">
                                            <Mail className="mr-2 h-4 w-4" />
                                            Send Verification Email
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm">
                                        <Shield className="mr-2 h-4 w-4" />
                                        Reset Password
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity or Additional Info (placeholder) */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    User's recent actions and login history
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No recent activity to display</p>
                                    <p className="text-sm">Activity tracking will appear here once implemented</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
