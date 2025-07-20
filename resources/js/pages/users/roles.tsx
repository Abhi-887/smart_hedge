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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Plus, 
    Edit, 
    Trash2, 
    Shield, 
    Users, 
    Settings,
    Eye,
    User
} from 'lucide-react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
    display_name: string;
    description: string;
    permissions: string[];
    users_count: number;
    created_at: string;
    updated_at: string;
}

interface Permission {
    id: number;
    name: string;
    display_name: string;
    description: string;
}

interface UserRolesProps {
    roles: Role[];
    permissions: Permission[];
}

/**
 * User Roles Management Page Component
 * 
 * Provides comprehensive role and permission management
 * Features:
 * - Role listing with user counts
 * - Permission management
 * - Role creation and editing
 * - Role assignment overview
 * - Professional table layout
 */
export default function UserRoles({ roles, permissions }: UserRolesProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        display_name: '',
        description: '',
        permissions: [] as string[],
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors } = useForm({
        name: '',
        display_name: '',
        description: '',
        permissions: [] as string[],
    });

    const handleCreateRole = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users/roles', {
            onSuccess: () => {
                resetCreate();
                setIsCreateDialogOpen(false);
            },
        });
    };

    const handleEditRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRole) {
            put(`/users/roles/${selectedRole.id}`, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    setSelectedRole(null);
                },
            });
        }
    };

    const openEditDialog = (role: Role) => {
        setSelectedRole(role);
        setEditData({
            name: role.name,
            display_name: role.display_name,
            description: role.description,
            permissions: role.permissions,
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteRole = (role: Role) => {
        if (confirm(`Are you sure you want to delete the role "${role.display_name}"? This action cannot be undone.`)) {
            // router.delete(`/users/roles/${role.id}`);
        }
    };

    const togglePermission = (permissionName: string, isCreate: boolean = true) => {
        if (isCreate) {
            const currentPermissions = createData.permissions;
            if (currentPermissions.includes(permissionName)) {
                setCreateData('permissions', currentPermissions.filter(p => p !== permissionName));
            } else {
                setCreateData('permissions', [...currentPermissions, permissionName]);
            }
        } else {
            const currentPermissions = editData.permissions;
            if (currentPermissions.includes(permissionName)) {
                setEditData('permissions', currentPermissions.filter(p => p !== permissionName));
            } else {
                setEditData('permissions', [...currentPermissions, permissionName]);
            }
        }
    };

    return (
        <AppShell>
            <Head title="User Roles & Permissions" />
            
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
                            <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
                            <p className="text-muted-foreground">
                                Manage user roles and their associated permissions
                            </p>
                        </div>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create New Role</DialogTitle>
                                <DialogDescription>
                                    Define a new role with specific permissions for your users.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateRole}>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="create-name">Role Name</Label>
                                            <Input
                                                id="create-name"
                                                value={createData.name}
                                                onChange={(e) => setCreateData('name', e.target.value)}
                                                placeholder="e.g., editor"
                                                className={createErrors.name ? 'border-red-500' : ''}
                                            />
                                            {createErrors.name && (
                                                <p className="text-sm text-red-500">{createErrors.name}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="create-display-name">Display Name</Label>
                                            <Input
                                                id="create-display-name"
                                                value={createData.display_name}
                                                onChange={(e) => setCreateData('display_name', e.target.value)}
                                                placeholder="e.g., Content Editor"
                                                className={createErrors.display_name ? 'border-red-500' : ''}
                                            />
                                            {createErrors.display_name && (
                                                <p className="text-sm text-red-500">{createErrors.display_name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="create-description">Description</Label>
                                        <Input
                                            id="create-description"
                                            value={createData.description}
                                            onChange={(e) => setCreateData('description', e.target.value)}
                                            placeholder="Describe what this role can do"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Permissions</Label>
                                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-3">
                                            {permissions.map((permission) => (
                                                <div key={permission.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`create-perm-${permission.id}`}
                                                        checked={createData.permissions.includes(permission.name)}
                                                        onCheckedChange={() => togglePermission(permission.name, true)}
                                                    />
                                                    <Label 
                                                        htmlFor={`create-perm-${permission.id}`} 
                                                        className="text-sm font-normal"
                                                    >
                                                        {permission.display_name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setIsCreateDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={createProcessing}>
                                        {createProcessing ? 'Creating...' : 'Create Role'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Roles Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{roles.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Active user roles
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{permissions.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Available permissions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Users with Roles</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {roles.reduce((total, role) => total + role.users_count, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Assigned role users
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Roles Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Roles</CardTitle>
                        <CardDescription>
                            Manage roles and their permissions for your application
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead>Users</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <Shield className="h-12 w-12 text-muted-foreground opacity-50" />
                                                <p className="text-muted-foreground">No roles found</p>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => setIsCreateDialogOpen(true)}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Create First Role
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    roles.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{role.display_name}</div>
                                                    <div className="text-sm text-muted-foreground font-mono">
                                                        {role.name}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <p className="text-sm truncate" title={role.description}>
                                                    {role.description || 'No description'}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.slice(0, 3).map((permission) => (
                                                        <Badge key={permission} variant="secondary" className="text-xs">
                                                            {permission}
                                                        </Badge>
                                                    ))}
                                                    {role.permissions.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{role.permissions.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <User className="h-4 w-4" />
                                                    <span>{role.users_count}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => openEditDialog(role)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleDeleteRole(role)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Edit Role Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Role</DialogTitle>
                            <DialogDescription>
                                Update the role information and permissions.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedRole && (
                            <form onSubmit={handleEditRole}>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-name">Role Name</Label>
                                            <Input
                                                id="edit-name"
                                                value={editData.name}
                                                onChange={(e) => setEditData('name', e.target.value)}
                                                className={editErrors.name ? 'border-red-500' : ''}
                                            />
                                            {editErrors.name && (
                                                <p className="text-sm text-red-500">{editErrors.name}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-display-name">Display Name</Label>
                                            <Input
                                                id="edit-display-name"
                                                value={editData.display_name}
                                                onChange={(e) => setEditData('display_name', e.target.value)}
                                                className={editErrors.display_name ? 'border-red-500' : ''}
                                            />
                                            {editErrors.display_name && (
                                                <p className="text-sm text-red-500">{editErrors.display_name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-description">Description</Label>
                                        <Input
                                            id="edit-description"
                                            value={editData.description}
                                            onChange={(e) => setEditData('description', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Permissions</Label>
                                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-3">
                                            {permissions.map((permission) => (
                                                <div key={permission.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`edit-perm-${permission.id}`}
                                                        checked={editData.permissions.includes(permission.name)}
                                                        onCheckedChange={() => togglePermission(permission.name, false)}
                                                    />
                                                    <Label 
                                                        htmlFor={`edit-perm-${permission.id}`} 
                                                        className="text-sm font-normal"
                                                    >
                                                        {permission.display_name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setIsEditDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={editProcessing}>
                                        {editProcessing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppShell>
    );
}
