# Strategy Management System

## Overview

A comprehensive strategy management system built with Laravel, Inertia.js, React, and shadcn/ui components. This system provides a professional interface for managing trading strategies with file uploads, JSON parameters, and deployment capabilities.

## Features

### ✨ Core Features
- **Strategy CRUD Operations**: Create, read, update, and delete trading strategies
- **File Upload Support**: Upload and manage Python (.py) script files
- **JSON Parameter Management**: Define and validate strategy parameters in JSON format
- **Status Management**: Toggle active/inactive and public/private status
- **User Ownership**: Strategies are tied to authenticated users
- **Professional UI**: Built with shadcn/ui components

### 🎨 UI/UX Features
- **Responsive Design**: Works on all device sizes
- **Dark/Light Mode**: Theme switching support
- **Professional Tables**: Sortable and paginated data tables
- **Form Validation**: Real-time client and server-side validation
- **Status Badges**: Visual indicators for strategy status
- **Action Menus**: Contextual dropdown menus
- **Loading States**: Professional loading indicators
- **JSON Editor**: Syntax highlighting and validation for JSON parameters

### 🔒 Security Features
- **Authorization**: Users can only access their own strategies
- **File Validation**: Only Python files (.py) are allowed for upload
- **JSON Validation**: Parameters must be valid JSON format
- **Size Limits**: File uploads limited to 5MB
- **Input Sanitization**: All inputs are validated and sanitized

## Installation & Setup

### Database Migration
The strategies table is automatically created with the following fields:
- `id` - Primary key
- `user_id` - Foreign key to users table
- `name` - Strategy name (required)
- `description` - Optional description
- `script_file` - Path to uploaded Python file
- `params_json` - JSON string for parameters
- `is_active` - Boolean for active status
- `is_public` - Boolean for public visibility
- `timestamps` - Created and updated timestamps

### File Storage
Python script files are stored in `storage/app/strategies/` directory.

## Routes

### Strategy Management Routes
```php
Route::middleware(['auth', 'verified'])->group(function () {
    // Resource routes for strategies
    Route::resource('strategies', StrategyController::class);
    
    // Additional strategy management routes
    Route::get('strategies/{strategy}/download-script', [StrategyController::class, 'downloadScript']);
    Route::post('strategies/{strategy}/run-test', [StrategyController::class, 'runTest']);
    Route::post('strategies/{strategy}/deploy', [StrategyController::class, 'deploy']);
});
```

### Available Endpoints
- `GET /strategies` - List user's strategies with pagination and search
- `GET /strategies/create` - Show create strategy form
- `POST /strategies` - Store new strategy
- `GET /strategies/{strategy}` - Show strategy details
- `GET /strategies/{strategy}/edit` - Show edit strategy form
- `PUT /strategies/{strategy}` - Update strategy
- `DELETE /strategies/{strategy}` - Delete strategy
- `GET /strategies/{strategy}/download-script` - Download Python script file
- `POST /strategies/{strategy}/run-test` - Run strategy test (placeholder)
- `POST /strategies/{strategy}/deploy` - Deploy strategy (placeholder)

## Components

### React Components
All components are built with TypeScript and shadcn/ui:

#### Pages
- `strategies/index.tsx` - Strategy listing page with search and filters
- `strategies/create.tsx` - Strategy creation form
- `strategies/show.tsx` - Strategy detail view
- `strategies/edit.tsx` - Strategy editing form

#### Features
- **Professional Tables**: Data tables with sorting and actions
- **Form Validation**: Real-time validation with error display
- **Status Indicators**: Badges and icons for strategy status
- **File Upload**: Drag-and-drop file upload with validation
- **JSON Editor**: Code editor with syntax highlighting and validation
- **Action Menus**: Dropdown menus for strategy actions
- **Confirmation Dialogs**: Delete confirmations and important actions

## Validation

### Strategy Creation Validation
```php
'name' => 'required|string|max:255|min:3',
'description' => 'nullable|string|max:1000',
'script_file' => 'nullable|file|mimes:py|max:5120',
'params_json' => 'nullable|string|json',
'is_active' => 'sometimes|boolean',
'is_public' => 'sometimes|boolean'
```

### Strategy Update Validation
```php
'name' => 'required|string|max:255|min:3',
'description' => 'nullable|string|max:1000',
'script_file' => 'nullable|file|mimes:py|max:5120',
'params_json' => 'nullable|string|json',
'is_active' => 'sometimes|boolean',
'is_public' => 'sometimes|boolean',
'remove_script' => 'sometimes|boolean'
```

## API Responses

### Strategy List Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Moving Average Strategy",
      "description": "Simple moving average crossover strategy",
      "script_file": "strategies/1234567890_strategy.py",
      "is_active": true,
      "is_public": false,
      "created_at": "2025-07-20T19:00:03.000000Z",
      "updated_at": "2025-07-20T19:00:03.000000Z"
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "per_page": 15,
  "total": 1
}
```

### Strategy Detail Response
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Moving Average Strategy",
  "description": "Simple moving average crossover strategy",
  "script_file": "strategies/1234567890_strategy.py",
  "params_json": "{\"fast_period\": 10, \"slow_period\": 20}",
  "is_active": true,
  "is_public": false,
  "created_at": "2025-07-20T19:00:03.000000Z",
  "updated_at": "2025-07-20T19:00:03.000000Z",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Strategy Model Methods

### Scopes
```php
Strategy::ownedBy($userId) // Only user's strategies
Strategy::active() // Only active strategies
Strategy::public() // Only public strategies
Strategy::search($term) // Search by name or description
```

### Helper Methods
```php
$strategy->hasScriptFile() // Check if strategy has a script file
$strategy->getDecodedParamsAttribute() // Get decoded JSON parameters
$strategy->getStatusAttribute() // Get formatted status string
$strategy->getScriptPathAttribute() // Get full path to script file
```

### File Management
The Strategy model automatically handles file cleanup when strategies are deleted using the `booted()` method.

## File Upload Features

### Supported File Types
- Only Python (.py) files are allowed
- Maximum file size: 5MB
- Files are stored in `storage/app/strategies/`

### File Naming Convention
Uploaded files are renamed using the pattern: `{timestamp}_{original_name}.py`

### File Management
- Files are automatically deleted when strategies are deleted
- Users can replace existing files during strategy updates
- Option to remove files without uploading new ones

## JSON Parameter System

### Features
- Real-time JSON validation
- Syntax highlighting in the editor
- Format/prettify JSON button
- Preview mode to see formatted JSON
- Error highlighting for invalid JSON

### Example Parameters
```json
{
  "fast_ma_period": 10,
  "slow_ma_period": 20,
  "risk_per_trade": 0.02,
  "max_positions": 5,
  "entry_conditions": {
    "rsi_threshold": 30,
    "volume_confirmation": true
  },
  "exit_conditions": {
    "take_profit": 2.0,
    "stop_loss": 1.0
  }
}
```

## Status Management

### Strategy Status Options
- **Active**: Strategy can be executed and deployed
- **Inactive**: Strategy is disabled
- **Public**: Strategy can be viewed by other users
- **Private**: Strategy is only visible to the owner

### Status Combinations
- **Active & Public**: Green badge, fully operational and visible
- **Active**: Blue badge, operational but private
- **Public**: Yellow badge, visible but not active
- **Inactive**: Gray badge, disabled

## Future Implementation

### Placeholder Features
The following features are prepared but not yet implemented:

#### Run Test (`runTest` method)
- Execute strategy with test data
- Return performance metrics
- Validate strategy logic

#### Deploy Strategy (`deploy` method)
- Deploy strategy to live trading environment
- Monitor strategy performance
- Handle strategy lifecycle

## Best Practices

### Security
- Always validate user ownership before allowing access
- Validate file types and sizes for uploads
- Sanitize all JSON inputs
- Use form requests for validation
- Implement proper authorization checks

### Performance
- Use pagination for large strategy lists
- Implement database indexing on user_id and status fields
- Optimize queries with proper relationships
- Use file storage efficiently

### UX/UI
- Provide clear feedback for all operations
- Use loading states during file uploads
- Implement proper error handling for file operations
- Make forms accessible and user-friendly
- Use consistent design patterns

## File Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── StrategyController.php
│   └── Requests/
│       ├── StoreStrategyRequest.php
│       └── UpdateStrategyRequest.php
├── Models/
│   ├── Strategy.php
│   └── User.php (updated with strategies relationship)
database/
└── migrations/
    └── 2025_07_20_190003_create_strategies_table.php
resources/
└── js/
    ├── pages/
    │   └── strategies/
    │       ├── index.tsx
    │       ├── create.tsx
    │       ├── show.tsx
    │       └── edit.tsx
    ├── components/
    │   └── ui/
    │       └── textarea.tsx (created)
    └── types/
        └── index.d.ts (updated with Strategy interface)
storage/
└── app/
    └── strategies/ (for uploaded files)
```

## Testing

### Manual Testing Checklist
- [ ] Create a new strategy with all fields
- [ ] Upload a Python file during creation
- [ ] Edit strategy and update parameters
- [ ] Replace script file during edit
- [ ] Remove script file without replacement
- [ ] Toggle active/inactive status
- [ ] Toggle public/private status
- [ ] Search strategies by name/description
- [ ] Filter strategies by status
- [ ] View strategy details
- [ ] Download script file
- [ ] Delete strategy and verify file cleanup
- [ ] Test authorization (users can't access others' strategies)

### Error Scenarios to Test
- [ ] Upload non-Python file
- [ ] Upload oversized file
- [ ] Invalid JSON in parameters
- [ ] Access another user's strategy
- [ ] Delete strategy with missing file

## Contributing

1. Follow Laravel coding standards
2. Use TypeScript for React components
3. Implement proper error handling
4. Write comprehensive validation
5. Add comments for complex logic
6. Test all functionality thoroughly
7. Ensure responsive design
8. Follow security best practices

## Support

For issues or questions:
1. Check the validation rules
2. Verify file permissions for storage directory
3. Check browser console for frontend errors
4. Verify database migrations are run
5. Ensure proper route definitions

## License

This strategy management system is part of the Smart Hedge application and follows the same licensing terms.
