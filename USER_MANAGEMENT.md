# User Management System

## Overview

A comprehensive user management system built with Laravel, Inertia.js, React, and shadcn/ui components. This system provides a professional interface for managing users, roles, and permissions with modern UI/UX design.

## Features

### ✨ Core Features
- **User CRUD Operations**: Create, read, update, and delete users
- **Role-based Access Control**: Admin, Editor, Moderator, and User roles
- **Email Verification**: Send verification emails to users
- **Password Management**: Reset and change user passwords
- **User Search & Filtering**: Search by name, email, or filter by roles
- **Avatar Support**: Auto-generated avatars with custom image support
- **Professional UI**: Built with shadcn/ui components

### 🎨 UI/UX Features
- **Responsive Design**: Works on all device sizes
- **Dark/Light Mode**: Theme switching support
- **Professional Tables**: Sortable and paginated data tables
- **Form Validation**: Real-time client and server-side validation
- **Status Badges**: Visual indicators for user status
- **Action Menus**: Contextual dropdown menus
- **Loading States**: Professional loading indicators

### 🔒 Security Features
- **Form Request Validation**: Comprehensive server-side validation
- **Password Complexity**: Enforced strong password requirements
- **CSRF Protection**: Built-in Laravel CSRF protection
- **Authorization**: Role-based access control
- **Data Sanitization**: Input sanitization and validation

## Installation & Setup

### Prerequisites
- PHP 8.1 or higher
- Laravel 11
- Node.js 18 or higher
- Composer

### Database Setup
The system adds the following fields to the users table:
- `avatar` (nullable) - User avatar image path
- `role` (default: 'user') - User role (user, admin, editor, moderator)
- `is_active` (default: true) - Account active status

Run the migration:
```bash
php artisan migrate
```

### Seed Sample Data
Create sample users for testing:
```bash
php artisan db:seed --class=UserManagementSeeder
```

This creates:
- Admin user: admin@example.com / password
- Editor user: editor@example.com / password
- Moderator user: moderator@example.com / password
- 5 regular users with various verification statuses

## Routes

### User Management Routes
```php
Route::middleware(['auth', 'verified'])->group(function () {
    // Resource routes for users
    Route::resource('users', UserController::class);
    
    // Additional user management routes
    Route::get('users/roles', [UserController::class, 'roles'])->name('users.roles');
    Route::post('users/{user}/send-verification', [UserController::class, 'sendVerification']);
    Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword']);
});
```

### Available Endpoints
- `GET /users` - List all users with pagination and search
- `GET /users/create` - Show create user form
- `POST /users` - Store new user
- `GET /users/{user}` - Show user details
- `GET /users/{user}/edit` - Show edit user form
- `PUT /users/{user}` - Update user
- `DELETE /users/{user}` - Delete user
- `GET /users/roles` - Manage user roles and permissions

## Components

### React Components
All components are built with TypeScript and shadcn/ui:

#### Pages
- `users/index.tsx` - User listing page with search and pagination
- `users/create.tsx` - User creation form
- `users/show.tsx` - User detail view
- `users/edit.tsx` - User editing form
- `users/roles.tsx` - Role and permission management

#### Features
- **Professional Tables**: Data tables with sorting and actions
- **Form Validation**: Real-time validation with error display
- **Status Indicators**: Badges and icons for user status
- **Avatar Display**: Auto-generated avatars with initials fallback
- **Action Menus**: Dropdown menus for user actions
- **Confirmation Dialogs**: Delete confirmations and important actions

## Validation

### User Creation Validation
```php
'name' => 'required|string|max:255|min:2',
'email' => 'required|email|unique:users,email',
'password' => 'required|confirmed|min:8|complex_password',
'role' => 'sometimes|in:user,admin,editor,moderator',
'send_verification_email' => 'sometimes|boolean'
```

### User Update Validation
```php
'name' => 'required|string|max:255|min:2',
'email' => 'required|email|unique:users,email,{user_id}',
'password' => 'sometimes|confirmed|min:8|complex_password',
'role' => 'sometimes|in:user,admin,editor,moderator',
'is_active' => 'sometimes|boolean'
```

## API Responses

### User List Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "email_verified_at": "2024-01-01T00:00:00.000000Z",
      "avatar": "https://ui-avatars.com/api/?name=John+Doe",
      "role": "user",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "per_page": 15,
  "total": 1
}
```

## User Model Methods

### Scopes
```php
User::active() // Only active users
User::search($term) // Search by name or email
User::withRole($role) // Filter by role
```

### Helper Methods
```php
$user->hasRole('admin') // Check if user has role
$user->isAdmin() // Check if user is admin
$user->isActive() // Check if user is active
$user->getInitialsAttribute() // Get user initials
$user->getVerificationStatusAttribute() // Get verification info
```

## Customization

### Adding New Roles
1. Update validation rules in form requests
2. Add role to User model `hasRole()` method
3. Update role selection dropdowns in forms
4. Add authorization logic in controllers

### Extending User Fields
1. Create migration for new fields
2. Add fields to User model `$fillable` array
3. Update form components
4. Add validation rules

### Custom Permissions
The system is designed to easily integrate with packages like Spatie Laravel Permission:

```php
// Install permission package
composer require spatie/laravel-permission

// Use in User model
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
    // ... rest of model
}
```

## Best Practices

### Security
- Always validate user input
- Use form requests for validation
- Implement proper authorization
- Hash passwords securely
- Protect against CSRF attacks

### Performance
- Use pagination for large datasets
- Implement database indexing
- Optimize queries with proper relationships
- Use caching for role/permission checks

### UX/UI
- Provide clear feedback messages
- Use loading states during operations
- Implement proper error handling
- Make forms accessible
- Use consistent design patterns

## Screenshots

### User List Page
- Professional data table with search
- Status badges and avatars
- Action dropdown menus
- Pagination controls

### User Creation Form
- Comprehensive form validation
- Role selection dropdown
- Email verification options
- Professional styling

### User Detail View
- Complete user information display
- Status indicators and badges
- Quick action buttons
- Account timeline

### Role Management
- Role and permission matrix
- Create/edit role dialogs
- Permission assignment
- User count per role

## Contributing

1. Follow Laravel coding standards
2. Use TypeScript for React components
3. Implement proper error handling
4. Write comprehensive validation
5. Add comments for complex logic
6. Test all functionality thoroughly

## Support

For issues or questions:
1. Check the documentation
2. Review validation rules
3. Check browser console for errors
4. Verify database migrations
5. Ensure proper route definitions

## License

This user management system is part of the Laravel React starter kit and follows the same licensing terms.
