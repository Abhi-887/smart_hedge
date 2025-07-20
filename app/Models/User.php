<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * The attributes that should be appended to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'avatar',
        'role',
    ];

    /**
     * Get the user's avatar URL.
     */
    protected function avatar(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $value 
                ? asset('storage/' . $value)
                : "https://ui-avatars.com/api/?name=" . urlencode($attributes['name']) . "&background=0ea5e9&color=fff"
        );
    }

    /**
     * Get the user's role.
     */
    protected function role(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value) => $value ?? 'user'
        );
    }

    /**
     * Scope a query to only include active users.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to search users by name or email.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', '%' . $search . '%')
              ->orWhere('email', 'like', '%' . $search . '%');
        });
    }

    /**
     * Scope a query to filter by role.
     */
    public function scopeWithRole($query, $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is active.
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Get the user's initials for avatar fallback.
     */
    public function getInitialsAttribute(): string
    {
        return collect(explode(' ', $this->name))
            ->map(fn ($name) => strtoupper(substr($name, 0, 1)))
            ->take(2)
            ->implode('');
    }

    /**
     * Get formatted creation date.
     */
    public function getFormattedCreatedAtAttribute(): string
    {
        return $this->created_at->format('M j, Y');
    }

    /**
     * Get verification status badge.
     */
    public function getVerificationStatusAttribute(): array
    {
        return [
            'is_verified' => !is_null($this->email_verified_at),
            'verified_at' => $this->email_verified_at?->format('M j, Y'),
            'badge_text' => !is_null($this->email_verified_at) ? 'Verified' : 'Unverified',
            'badge_variant' => !is_null($this->email_verified_at) ? 'default' : 'secondary',
        ];
    }
}
