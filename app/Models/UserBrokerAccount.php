<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * UserBrokerAccount Model
 *
 * Represents a user's account with a specific broker.
 * Handles encrypted storage of sensitive API credentials.
 */
class UserBrokerAccount extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'broker_id',
        'client_code',
        'api_key',
        'access_token',
        'refresh_token',
        'token_expiry',
        'is_active',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'token_expiry' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'api_key',
        'access_token',
        'refresh_token',
    ];

    /**
     * Get the user that owns this broker account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the broker this account belongs to.
     */
    public function broker(): BelongsTo
    {
        return $this->belongsTo(Broker::class);
    }

    /**
     * Encrypt the API key when storing.
     */
    protected function apiKey(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => decrypt($value),
            set: fn (string $value) => encrypt($value),
        );
    }

    /**
     * Encrypt the access token when storing.
     */
    protected function accessToken(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? decrypt($value) : null,
            set: fn (?string $value) => $value ? encrypt($value) : null,
        );
    }

    /**
     * Encrypt the refresh token when storing.
     */
    protected function refreshToken(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? decrypt($value) : null,
            set: fn (?string $value) => $value ? encrypt($value) : null,
        );
    }

    /**
     * Scope a query to only include active accounts.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by broker.
     */
    public function scopeForBroker($query, $brokerId)
    {
        return $query->where('broker_id', $brokerId);
    }

    /**
     * Check if the token is expired.
     */
    public function isTokenExpired(): bool
    {
        if (!$this->token_expiry) {
            return false;
        }

        return $this->token_expiry->isPast();
    }

    /**
     * Get the account status badge info.
     */
    public function getStatusBadgeAttribute(): array
    {
        if (!$this->is_active) {
            return [
                'text' => 'Inactive',
                'variant' => 'secondary',
                'color' => 'gray',
            ];
        }

        if ($this->isTokenExpired()) {
            return [
                'text' => 'Token Expired',
                'variant' => 'destructive',
                'color' => 'red',
            ];
        }

        return [
            'text' => 'Active',
            'variant' => 'default',
            'color' => 'green',
        ];
    }

    /**
     * Get masked API key for display.
     */
    public function getMaskedApiKeyAttribute(): string
    {
        $apiKey = $this->api_key;
        if (strlen($apiKey) <= 8) {
            return str_repeat('*', strlen($apiKey));
        }

        return substr($apiKey, 0, 4) . str_repeat('*', strlen($apiKey) - 8) . substr($apiKey, -4);
    }

    /**
     * Get formatted creation date.
     */
    public function getFormattedCreatedAtAttribute(): string
    {
        return $this->created_at->format('M j, Y');
    }
}
