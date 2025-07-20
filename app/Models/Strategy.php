<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * Strategy Model
 *
 * Represents trading strategies created by users.
 * Each strategy belongs to a user and contains configuration parameters.
 */
class Strategy extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'script_file',
        'params_json',
        'is_active',
        'is_public',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'is_public' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the strategy.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter strategies by the current user.
     */
    public function scopeOwnedBy($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter active strategies.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter public strategies.
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope to search strategies by name or description.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', '%' . $search . '%')
              ->orWhere('description', 'like', '%' . $search . '%');
        });
    }

    /**
     * Get the decoded JSON parameters.
     */
    public function getDecodedParamsAttribute()
    {
        return $this->params_json ? json_decode($this->params_json, true) : [];
    }

    /**
     * Set the JSON parameters from an array.
     */
    public function setParamsAttribute($value)
    {
        $this->attributes['params_json'] = is_array($value) ? json_encode($value) : $value;
    }

    /**
     * Get the status of the strategy (combining active and public states).
     */
    public function getStatusAttribute()
    {
        if ($this->is_active && $this->is_public) {
            return 'Active & Public';
        } elseif ($this->is_active) {
            return 'Active';
        } elseif ($this->is_public) {
            return 'Public';
        } else {
            return 'Inactive';
        }
    }

    /**
     * Get the full path to the script file.
     */
    public function getScriptPathAttribute()
    {
        return $this->script_file ? Storage::path($this->script_file) : null;
    }

    /**
     * Check if the strategy has a script file.
     */
    public function hasScriptFile()
    {
        return $this->script_file && Storage::exists($this->script_file);
    }

    /**
     * Delete the associated script file when deleting the strategy.
     */
    protected static function booted()
    {
        static::deleting(function ($strategy) {
            if ($strategy->script_file && Storage::exists($strategy->script_file)) {
                Storage::delete($strategy->script_file);
            }
        });
    }
}
