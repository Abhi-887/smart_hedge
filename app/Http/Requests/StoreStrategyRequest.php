<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StoreStrategyRequest
 *
 * Handles validation for creating new strategies.
 * Implements comprehensive validation rules for strategy creation.
 */
class StoreStrategyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only authenticated users can create strategies
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'min:3',
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'script_file' => [
                'nullable',
                'file',
                'mimes:py',
                'max:5120', // 5MB max
            ],
            'params_json' => [
                'nullable',
                'string',
                'json',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
            'is_public' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'strategy name',
            'description' => 'strategy description',
            'script_file' => 'Python script file',
            'params_json' => 'parameters JSON',
            'is_active' => 'active status',
            'is_public' => 'public status',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The strategy name is required.',
            'name.min' => 'The strategy name must be at least 3 characters.',
            'script_file.mimes' => 'The script file must be a Python (.py) file.',
            'script_file.max' => 'The script file may not be larger than 5MB.',
            'params_json.json' => 'The parameters must be valid JSON.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default values if not provided
        $this->merge([
            'user_id' => auth()->id(),
            'is_active' => $this->boolean('is_active', true),
            'is_public' => $this->boolean('is_public', false),
        ]);

        // Validate JSON if provided
        if ($this->has('params_json') && !empty($this->params_json)) {
            $decoded = json_decode($this->params_json, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                // Reset to empty if invalid JSON
                $this->merge(['params_json' => '{}']);
            }
        }
    }

    /**
     * Get the validated data with processed file upload.
     */
    public function getValidatedDataWithFile(): array
    {
        $validated = $this->validated();

        // Handle file upload
        if ($this->hasFile('script_file')) {
            $file = $this->file('script_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $validated['script_file'] = $file->storeAs('strategies', $filename, 'local');
        }

        return $validated;
    }
}
