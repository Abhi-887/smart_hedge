<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use PragmaRX\Google2FA\Google2FA;

class TestAngelApi extends Command
{
    protected $signature = 'angel:test';
    protected $description = 'Test Angel One API connection and authentication';

    public function handle()
    {
        $this->info('Testing Angel One API connection...');

        // Check configuration
        $clientId = config('services.angel.client_id');
        $mpin = config('services.angel.mpin');
        $secret = config('services.angel.totp_secret');

        if (!$clientId || $clientId === 'smarthedge') {
            $this->error('ANGEL_CLIENT_ID not configured in .env');
            return 1;
        }

        if (!$mpin || $mpin === 'your-angel-mpin') {
            $this->error('ANGEL_MPIN not configured in .env');
            return 1;
        }

        if (!$secret || $secret === 'your-angel-totp-secret') {
            $this->error('ANGEL_TOTP_SECRET not configured in .env');
            $this->line('Run: php artisan angel:setup-totp to generate one');
            return 1;
        }

        $this->info('Configuration check passed!');
        $this->line('Client ID: ' . $clientId);
        $this->line('MPIN: ' . str_repeat('*', strlen($mpin)));
        $this->line('TOTP Secret: ' . substr($secret, 0, 4) . str_repeat('*', strlen($secret) - 4));
        $this->line('');

        // Generate TOTP
        try {
            $google2fa = new Google2FA();
            $totp = $google2fa->getCurrentOtp($secret);
            $this->info('Generated TOTP: ' . $totp);
        } catch (\Exception $e) {
            $this->error('TOTP generation failed: ' . $e->getMessage());
            return 1;
        }

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

            if ($response->successful()) {
                $data = $response->json();
                
                // Debug: Show the actual response
                $this->info('Raw API Response:');
                $this->line(json_encode($data, JSON_PRETTY_PRINT));

                if (isset($data['status']) && $data['status'] && isset($data['data']['jwtToken'])) {
                    $this->info('✅ Authentication successful!');
                    $this->line('JWT Token: ' . substr($data['data']['jwtToken'], 0, 20) . '...');

                    // Test market data API
                    $this->info('Testing market data API...');

                    $marketResponse = Http::withHeaders([
                        'Authorization' => 'Bearer ' . $data['data']['jwtToken'],
                        'Content-Type' => 'application/json',
                        'Accept' => 'application/json',
                        'X-UserType' => 'USER',
                        'X-SourceID' => 'WEB',
                        'X-ClientLocalIP' => '127.0.0.1',
                        'X-ClientPublicIP' => '127.0.0.1',
                        'X-MACAddress' => 'fe80::216:3eff:fe1e:5561',
                    ])->post('https://apiconnect.angelone.in/rest/secure/angelbroking/marketData/v1/gainersLosers', [
                        'datatype' => 'PercPriceGainers',
                        'expirytype' => 'NEAR',
                    ]);

                    if ($marketResponse->successful()) {
                        $marketData = $marketResponse->json();
                        if ($marketData['status']) {
                            $this->info('✅ Market data API working!');
                            $this->line('Found ' . count($marketData['data']) . ' gainers');

                            if (!empty($marketData['data'])) {
                                $first = $marketData['data'][0];
                                $this->line('Top gainer: ' . $first['tradingSymbol'] . ' (+' . $first['percentChange'] . '%)');
                            }
                        } else {
                            $this->warn('Market data API returned status false: ' . $marketData['message']);
                        }
                    } else {
                        $this->error('Market data API request failed: ' . $marketResponse->status());
                    }

                } else {
                    $this->error('Authentication failed: ' . ($data['message'] ?? 'Unknown error'));
                    $this->line('Response: ' . json_encode($data, JSON_PRETTY_PRINT));
                }
            } else {
                $this->error('HTTP request failed: ' . $response->status());
                $this->line('Response: ' . $response->body());
            }

        } catch (\Exception $e) {
            $this->error('API test failed: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
