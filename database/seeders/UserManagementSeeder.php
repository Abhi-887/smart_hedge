<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserManagementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Administrator',
                'email' => 'admin@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // Create editor user
        User::updateOrCreate(
            ['email' => 'editor@example.com'],
            [
                'name' => 'Content Editor',
                'email' => 'editor@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'editor',
                'is_active' => true,
            ]
        );

        // Create moderator user
        User::updateOrCreate(
            ['email' => 'moderator@example.com'],
            [
                'name' => 'Community Moderator',
                'email' => 'moderator@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'moderator',
                'is_active' => true,
            ]
        );

        // Create regular users
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'role' => 'user',
                'verified' => true,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'role' => 'user',
                'verified' => true,
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike@example.com',
                'role' => 'user',
                'verified' => false,
            ],
            [
                'name' => 'Sarah Williams',
                'email' => 'sarah@example.com',
                'role' => 'user',
                'verified' => true,
            ],
            [
                'name' => 'David Brown',
                'email' => 'david@example.com',
                'role' => 'user',
                'verified' => false,
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'email_verified_at' => $userData['verified'] ? now() : null,
                    'password' => Hash::make('password'),
                    'role' => $userData['role'],
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('User management seed data created successfully!');
        $this->command->info('Default password for all users: password');
    }
}
