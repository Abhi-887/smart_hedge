<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Broker Model
 *
 * Represents different brokers like Angel One, Zerodha, etc.
 * Each broker can have multiple user accounts associated.
 */
class Broker extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
        'base_api_url',
        'logo',
        'description',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get all user broker accounts for this broker.
     */
    public function userBrokerAccounts(): HasMany
    {
        return $this->hasMany(UserBrokerAccount::class);
    }

    /**
     * Get active user broker accounts for this broker.
     */
    public function activeAccounts(): HasMany
    {
        return $this->hasMany(UserBrokerAccount::class)->where('is_active', true);
    }

    /**
     * Scope a query to only include active brokers.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the broker's logo URL.
     */
    public function getLogoUrlAttribute(): string
    {
        return $this->logo
            ? asset('storage/' . $this->logo)
            : "https://ui-avatars.com/api/?name=" . urlencode($this->name) . "&background=0ea5e9&color=fff";
    }

    /**
     * Get formatted broker display name.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->name . ' (' . strtoupper($this->code) . ')';
    }

    /**
     * Get total accounts count for this broker.
     */
    public function getTotalAccountsAttribute(): int
    {
        return $this->userBrokerAccounts()->count();
    }

    /**
     * Get active accounts count for this broker.
     */
    public function getActiveAccountsCountAttribute(): int
    {
        return $this->activeAccounts()->count();
    }
}
