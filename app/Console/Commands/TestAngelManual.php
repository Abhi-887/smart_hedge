<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class TestAngelManual extends Command
{
    protected $signature = 'angel:test-manual {totp}';
    protected $description = 'Test Angel One API with manual TOTP code';

    public function handle()
    {
        $totp = $this->argument('totp');
        
        $this->info('Testing Angel One API with manual TOTP: ' . $totp);

        // Configuration check
        if (!config('services.angel.client_id') || config('services.angel.client_id') === 'your-angel-client-id') {
            $this->error('ANGEL_CLIENT_ID not configured in .env');
            return 1;
        }

        if (!config('services.angel.mpin') || config('services.angel.mpin') === 'your-angel-mpin') {
            $this->error('ANGEL_MPIN not configured in .env');
            return 1;
        }

        $this->info('Configuration check passed!');
        $this->line('Client ID: ' . config('services.angel.client_id'));
        $this->line('MPIN: ' . str_repeat('*', strlen(config('services.angel.mpin'))));
        $this->line('Using TOTP: ' . $totp);

        // Test authentication
        $this->info('Testing authentication...');

        try {
            $response = Http::withOptions([
                'verify' => false, // Disable SSL verification for development
                'timeout' => 30,
            ])->withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-UserType' => 'USER',
                'X-SourceID' => 'WEB',
                'X-ClientLocalIP' => '127.0.0.1',
                'X-ClientPublicIP' => '127.0.0.1',
                'X-MACAddress' => 'fe80::216:3eff:fe1e:5561',
            ])->post('https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword', [
                'clientcode' => config('services.angel.client_id'),
                'password' => config('services.angel.mpin'),
                'totp' => $totp,
            ]);

            $this->info('Raw API Response:');
            $data = $response->json();
            $this->line(json_encode($data, JSON_PRETTY_PRINT));

            if ($response->successful()) {
                if (isset($data['success']) && $data['success'] && isset($data['data']['jwtToken'])) {
                    $this->info('✅ Authentication successful!');
                    $this->line('JWT Token: ' . substr($data['data']['jwtToken'], 0, 20) . '...');
                    return 0;
                } else {
                    $this->error('❌ Authentication failed: ' . ($data['message'] ?? 'Unknown error'));
                    return 1;
                }
            } else {
                $this->error('❌ HTTP Error: ' . $response->status());
                return 1;
            }

        } catch (\Exception $e) {
            $this->error('API test failed: ' . $e->getMessage());
            return 1;
        }
    }
}
