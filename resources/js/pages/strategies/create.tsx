import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, Plus, Upload, FileText, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = (name?: string): BreadcrumbItem[] => [
    {
        title: 'My Strategies',
        href: '/strategies',
    },
    {
        title: 'Create Strategy',
        href: '/strategies/create',
    },
];

interface StrategyCreateProps {}

/**
 * Strategy Creation Page Component
 *
 * Provides a professional form for creating new trading strategies
 * Features:
 * - Form validation with real-time feedback
 * - File upload for Python scripts
 * - JSON parameter editor with validation
 * - Toggle switches for active/public status
 * - Responsive design
 * - Professional styling
 */
export default function StrategyCreate({}: StrategyCreateProps) {
    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const [jsonError, setJsonError] = useState<string>('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        script_file: null as File | null,
        params_json: '{}',
        is_active: true as boolean,
        is_public: false as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate JSON before submission
        if (data.params_json.trim()) {
            try {
                JSON.parse(data.params_json);
                setJsonError('');
            } catch (error) {
                setJsonError('Invalid JSON format');
                return;
            }
        }

        post('/strategies', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.name.endsWith('.py')) {
                setData('script_file', file);
            } else {
                alert('Please select a Python (.py) file');
                e.target.value = '';
            }
        }
    };

    const handleJsonChange = (value: string) => {
        setData('params_json', value);

        // Validate JSON in real-time
        if (value.trim()) {
            try {
                JSON.parse(value);
                setJsonError('');
            } catch (error) {
                setJsonError('Invalid JSON format');
            }
        } else {
            setJsonError('');
        }
    };

    const formatJson = () => {
        try {
            const parsed = JSON.parse(data.params_json);
            const formatted = JSON.stringify(parsed, null, 2);
            setData('params_json', formatted);
            setJsonError('');
        } catch (error) {
            setJsonError('Cannot format invalid JSON');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs()}>
            <Head title="Create Strategy" />

            <div className="px-4 py-6">
                <div className="space-y-8">
                    <Heading
                        title="Create New Strategy"
                        description="Build a new trading strategy with custom parameters and Python scripts"
                    />

                    {/* Strategy Creation Form */}
                    <div className="max-w-4xl">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Strategy Information
                                </CardTitle>
                                <CardDescription>
                                    Fill in the details below to create your new trading strategy
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Strategy Name *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter strategy name"
                                                className={errors.name ? 'border-red-500' : ''}
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="script_file">Python Script File</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="script_file"
                                                    type="file"
                                                    accept=".py"
                                                    onChange={handleFileChange}
                                                    className={errors.script_file ? 'border-red-500' : ''}
                                                />
                                                {data.script_file && (
                                                    <div className="flex items-center text-green-600 text-sm">
                                                        <FileText className="mr-1 h-4 w-4" />
                                                        {data.script_file.name}
                                                    </div>
                                                )}
                                            </div>
                                            {errors.script_file && (
                                                <p className="text-sm text-red-500">{errors.script_file}</p>
                                            )}
                                            <p className="text-sm text-muted-foreground">
                                                Upload a Python script file (.py) for your strategy
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                            placeholder="Describe your strategy, its purpose, and how it works..."
                                            rows={4}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description}</p>
                                        )}
                                    </div>

                                    {/* JSON Parameters */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="params_json">Strategy Parameters (JSON)</Label>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={formatJson}
                                                    disabled={!data.params_json.trim() || !!jsonError}
                                                >
                                                    Format JSON
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowJsonPreview(!showJsonPreview)}
                                                >
                                                    {showJsonPreview ? (
                                                        <>
                                                            <EyeOff className="mr-1 h-4 w-4" />
                                                            Hide Preview
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="mr-1 h-4 w-4" />
                                                            Show Preview
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                        <Textarea
                                            id="params_json"
                                            value={data.params_json}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleJsonChange(e.target.value)}
                                            placeholder='{"param1": "value1", "param2": 100}'
                                            rows={6}
                                            className={`font-mono ${errors.params_json || jsonError ? 'border-red-500' : ''}`}
                                            style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}
                                        />
                                        {(errors.params_json || jsonError) && (
                                            <p className="text-sm text-red-500">
                                                {errors.params_json || jsonError}
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            Define strategy parameters in JSON format
                                        </p>

                                        {/* JSON Preview */}
                                        {showJsonPreview && data.params_json && !jsonError && (
                                            <div className="mt-2 p-3 bg-muted rounded-md">
                                                <p className="text-sm font-medium mb-2">JSON Preview:</p>
                                                <pre className="text-xs text-muted-foreground overflow-auto">
                                                    {JSON.stringify(JSON.parse(data.params_json || '{}'), null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Options */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label>Strategy Status</Label>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="is_active"
                                                        checked={data.is_active}
                                                        onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                                    />
                                                    <Label htmlFor="is_active" className="text-sm">
                                                        Strategy is active
                                                    </Label>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Active strategies can be executed and deployed
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Visibility</Label>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="is_public"
                                                        checked={data.is_public}
                                                        onCheckedChange={(checked: boolean) => setData('is_public', checked)}
                                                    />
                                                    <Label htmlFor="is_public" className="text-sm">
                                                        Make strategy public
                                                    </Label>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Public strategies can be viewed by other users
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                        <Link href="/strategies">
                                            <Button variant="outline" type="button">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing || !!jsonError}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Creating...' : 'Create Strategy'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
