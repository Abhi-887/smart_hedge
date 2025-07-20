<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * UpdateBrokerAccountRequest
 *
 * Handles validation for updating existing broker accounts.
 * Allows updating credentials while maintaining data integrity.
 */
class UpdateBrokerAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $brokerAccount = $this->route('broker_account');
        return auth()->check() && $brokerAccount->user_id === auth()->id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $brokerAccountId = $this->route('broker_account')?->id;

        return [
            'broker_id' => [
                'required',
                'integer',
                'exists:brokers,id',
                Rule::unique('user_broker_accounts')->where(function ($query) {
                    return $query->where('user_id', auth()->id());
                })->ignore($brokerAccountId),
            ],
            'client_code' => [
                'required',
                'string',
                'max:100',
            ],
            'api_key' => [
                'required',
                'string',
                'max:500',
            ],
            'access_token' => [
                'nullable',
                'string',
                'max:500',
            ],
            'refresh_token' => [
                'nullable',
                'string',
                'max:500',
            ],
            'token_expiry' => [
                'nullable',
                'date',
                'after:now',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'is_active' => [
                'boolean',
            ],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'broker_id.required' => 'Please select a broker.',
            'broker_id.exists' => 'The selected broker is invalid.',
            'broker_id.unique' => 'You already have an account with this broker.',
            'client_code.required' => 'Client code is required.',
            'client_code.max' => 'Client code cannot exceed 100 characters.',
            'api_key.required' => 'API key is required.',
            'api_key.max' => 'API key cannot exceed 500 characters.',
            'access_token.max' => 'Access token cannot exceed 500 characters.',
            'refresh_token.max' => 'Refresh token cannot exceed 500 characters.',
            'token_expiry.date' => 'Token expiry must be a valid date.',
            'token_expiry.after' => 'Token expiry must be a future date.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'broker_id' => 'broker',
            'client_code' => 'client code',
            'api_key' => 'API key',
            'access_token' => 'access token',
            'refresh_token' => 'refresh token',
            'token_expiry' => 'token expiry',
            'is_active' => 'account status',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
        ]);
    }
}
