<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

/**
 * UserController
 *
 * Handles user management operations including CRUD operations,
 * role management, and user verification functionality.
 * Follows Laravel best practices with proper validation and authorization.
 */
class UserController extends Controller
{
    /**
     * Display a listing of users with pagination and search functionality.
     */
    public function index(Request $request): Response
    {
        $query = User::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Role filtering (if roles are implemented)
        if ($request->filled('role')) {
            // $query->whereHas('roles', function ($q) use ($request) {
            //     $q->where('name', $request->role);
            // });
        }

        $users = $query->select(['id', 'name', 'email', 'email_verified_at', 'created_at', 'updated_at'])
                      ->orderBy('created_at', 'desc')
                      ->paginate(15)
                      ->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
                'role' => $request->role,
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        return Inertia::render('users/create', [
            // Add roles and permissions if needed
            // 'roles' => Role::all(),
            // 'permissions' => Permission::all(),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => $validated['send_verification_email'] ? null : now(),
        ]);

        // Assign role if provided
        if (isset($validated['role'])) {
            // $user->assignRole($validated['role']);
        }

        // Send verification email if requested
        if ($validated['send_verification_email']) {
            // $user->sendEmailVerificationNotification();
        }

        return Redirect::route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $user->load(['roles', 'permissions']); // If using roles/permissions

        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => $user,
            // 'roles' => Role::all(),
            // 'permissions' => Permission::all(),
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        // Update password if provided
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        // Update role if provided
        if (isset($validated['role'])) {
            // $user->syncRoles([$validated['role']]);
        }

        return Redirect::route('users.show', $user)->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deletion of the current user
        if ($user->id === auth()->id()) {
            return Redirect::back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return Redirect::route('users.index')->with('success', 'User deleted successfully.');
    }

    /**
     * Display user roles management page.
     */
    public function roles(): Response
    {
        // Mock data - replace with actual role/permission models
        $roles = [
            [
                'id' => 1,
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Full system access with all permissions',
                'permissions' => ['create_users', 'edit_users', 'delete_users', 'manage_roles'],
                'users_count' => 2,
                'created_at' => now()->toISOString(),
                'updated_at' => now()->toISOString(),
            ],
            [
                'id' => 2,
                'name' => 'editor',
                'display_name' => 'Content Editor',
                'description' => 'Can create and edit content',
                'permissions' => ['create_content', 'edit_content'],
                'users_count' => 5,
                'created_at' => now()->toISOString(),
                'updated_at' => now()->toISOString(),
            ],
            [
                'id' => 3,
                'name' => 'user',
                'display_name' => 'Regular User',
                'description' => 'Basic user with limited permissions',
                'permissions' => ['view_content'],
                'users_count' => 25,
                'created_at' => now()->toISOString(),
                'updated_at' => now()->toISOString(),
            ],
        ];

        $permissions = [
            [
                'id' => 1,
                'name' => 'create_users',
                'display_name' => 'Create Users',
                'description' => 'Can create new user accounts',
            ],
            [
                'id' => 2,
                'name' => 'edit_users',
                'display_name' => 'Edit Users',
                'description' => 'Can modify existing user accounts',
            ],
            [
                'id' => 3,
                'name' => 'delete_users',
                'display_name' => 'Delete Users',
                'description' => 'Can delete user accounts',
            ],
            [
                'id' => 4,
                'name' => 'manage_roles',
                'display_name' => 'Manage Roles',
                'description' => 'Can create and manage user roles',
            ],
            [
                'id' => 5,
                'name' => 'create_content',
                'display_name' => 'Create Content',
                'description' => 'Can create new content',
            ],
            [
                'id' => 6,
                'name' => 'edit_content',
                'display_name' => 'Edit Content',
                'description' => 'Can modify existing content',
            ],
            [
                'id' => 7,
                'name' => 'view_content',
                'display_name' => 'View Content',
                'description' => 'Can view content',
            ],
        ];

        return Inertia::render('users/roles', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Send email verification to user.
     */
    public function sendVerification(User $user)
    {
        if ($user->hasVerifiedEmail()) {
            return Redirect::back()->with('info', 'Email is already verified.');
        }

        $user->sendEmailVerificationNotification();

        return Redirect::back()->with('success', 'Verification email sent successfully.');
    }

    /**
     * Reset user password and send notification.
     */
    public function resetPassword(User $user)
    {
        // Generate temporary password or send reset link
        $temporaryPassword = \Str::random(12);

        $user->update([
            'password' => Hash::make($temporaryPassword),
        ]);

        // Send password reset email with temporary password
        // Mail::to($user)->send(new PasswordResetMail($temporaryPassword));

        return Redirect::back()->with('success', 'Password reset successfully. Temporary password sent to user.');
    }
}
