<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use PragmaRX\Google2FA\Google2FA;

class MarketDataController extends Controller
{
    private $apiBaseUrl = 'https://apiconnect.angelone.in/rest/secure/angelbroking';
    private $authToken = null;

    /**
     * Get authentication token for Angel API
     */
    private function getAuthToken()
    {
        if ($this->authToken) {
            return $this->authToken;
        }

        // Check if token exists in cache
        $cachedToken = Cache::get('angel_auth_token');
        if ($cachedToken) {
            $this->authToken = $cachedToken;
            return $this->authToken;
        }

        try {
            $totp = $this->generateTOTP();

            // If TOTP generation fails, use mock data
            if (!$totp) {
                Log::info('Using mock data due to missing TOTP configuration');
                return null;
            }

            $response = Http::withOptions([
                'verify' => false, // Disable SSL verification for development
                'timeout' => 30,
            ])->withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-UserType' => 'USER',
                'X-SourceID' => 'WEB',
                'X-ClientLocalIP' => request()->ip(),
                'X-ClientPublicIP' => request()->ip(),
                'X-MACAddress' => 'fe80::216:3eff:fe1e:5561',
            ])->post('https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword', [
                'clientcode' => config('services.angel.client_id'),
                'password' => config('services.angel.mpin'),
                'totp' => $totp,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if ($data['status'] && isset($data['data']['jwtToken'])) {
                    $this->authToken = $data['data']['jwtToken'];

                    // Cache token for 8 hours (Angel tokens expire in 24 hours)
                    Cache::put('angel_auth_token', $this->authToken, now()->addHours(8));

                    Log::info('Angel API authentication successful');
                    return $this->authToken;
                }
            }

            Log::error('Angel API authentication failed', [
                'response' => $response->json(),
                'status' => $response->status()
            ]);

        } catch (\Exception $e) {
            Log::error('Angel API authentication error: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Generate TOTP for Angel API authentication
     */
    private function generateTOTP()
    {
        $secret = config('services.angel.totp_secret');

        // If no secret configured, return null (will use mock data)
        if (!$secret || $secret === 'your-angel-totp-secret') {
            return null;
        }

        try {
            $google2fa = new Google2FA();
            $totp = $google2fa->getCurrentOtp($secret);

            Log::info('Generated TOTP for Angel API authentication');

            return $totp;
        } catch (\Exception $e) {
            Log::error('TOTP generation failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get Top Gainers/Losers data
     */
    public function getTopGainers(Request $request)
    {
        $dataType = $request->get('datatype', 'PercPriceGainers');
        $expiryType = $request->get('expirytype', 'NEAR');

        // Cache key for the request
        $cacheKey = "market_data_{$dataType}_{$expiryType}";

        // Try to get from cache first (cache for 5 minutes)
        $cachedData = Cache::get($cacheKey);
        if ($cachedData) {
            return response()->json($cachedData);
        }

        $token = $this->getAuthToken();
        if (!$token) {
            // Return mock data if authentication fails
            return response()->json($this->getMockData($dataType));
        }

        try {
            $response = Http::withOptions([
                'verify' => false, // Disable SSL verification for development
                'timeout' => 30,
            ])->withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-UserType' => 'USER',
                'X-SourceID' => 'WEB',
                'X-ClientLocalIP' => request()->ip(),
                'X-ClientPublicIP' => request()->ip(),
                'X-MACAddress' => 'fe80::216:3eff:fe1e:5561',
            ])->post($this->apiBaseUrl . '/marketData/v1/gainersLosers', [
                'datatype' => $dataType,
                'expirytype' => $expiryType,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                // Cache the response for 5 minutes
                Cache::put($cacheKey, $data, now()->addMinutes(5));

                return response()->json($data);
            } else {
                Log::error('Angel API request failed', [
                    'response' => $response->json(),
                    'status' => $response->status()
                ]);

                // Return mock data on failure
                return response()->json($this->getMockData($dataType));
            }

        } catch (\Exception $e) {
            Log::error('Angel API request error: ' . $e->getMessage());

            // Return mock data on error
            return response()->json($this->getMockData($dataType));
        }
    }

    /**
     * Get PCR (Put-Call Ratio) data
     */
    public function getPCRData()
    {
        $cacheKey = "pcr_data";

        // Try to get from cache first
        $cachedData = Cache::get($cacheKey);
        if ($cachedData) {
            return response()->json($cachedData);
        }

        $token = $this->getAuthToken();
        if (!$token) {
            return response()->json($this->getMockPCRData());
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-UserType' => 'USER',
                'X-SourceID' => 'WEB',
                'X-ClientLocalIP' => request()->ip(),
                'X-ClientPublicIP' => request()->ip(),
                'X-MACAddress' => 'fe80::216:3eff:fe1e:5561',
            ])->get($this->apiBaseUrl . '/marketData/v1/putCallRatio');

            if ($response->successful()) {
                $data = $response->json();
                Cache::put($cacheKey, $data, now()->addMinutes(5));
                return response()->json($data);
            }

        } catch (\Exception $e) {
            Log::error('PCR API request error: ' . $e->getMessage());
        }

        return response()->json($this->getMockPCRData());
    }

    /**
     * Get OI Buildup data
     */
    public function getOIBuildup(Request $request)
    {
        $dataType = $request->get('datatype', 'Long Built Up');
        $expiryType = $request->get('expirytype', 'NEAR');

        $cacheKey = "oi_buildup_{$dataType}_{$expiryType}";

        $cachedData = Cache::get($cacheKey);
        if ($cachedData) {
            return response()->json($cachedData);
        }

        $token = $this->getAuthToken();
        if (!$token) {
            return response()->json($this->getMockOIData($dataType));
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-UserType' => 'USER',
                'X-SourceID' => 'WEB',
                'X-ClientLocalIP' => request()->ip(),
                'X-ClientPublicIP' => request()->ip(),
                'X-MACAddress' => 'fe80::216:3eff:fe1e:5561',
            ])->post($this->apiBaseUrl . '/marketData/v1/OIBuildup', [
                'datatype' => $dataType,
                'expirytype' => $expiryType,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                Cache::put($cacheKey, $data, now()->addMinutes(5));
                return response()->json($data);
            }

        } catch (\Exception $e) {
            Log::error('OI Buildup API request error: ' . $e->getMessage());
        }

        return response()->json($this->getMockOIData($dataType));
    }

    /**
     * Market Data Dashboard Page
     */
    public function index()
    {
        return Inertia::render('MarketData/Index');
    }

    /**
     * Mock data for testing/fallback
     */
    private function getMockData($dataType)
    {
        $symbols = [
            'HDFCBANK25JAN24FUT', 'RELIANCE25JAN24FUT', 'TCS25JAN24FUT',
            'INFY25JAN24FUT', 'ITC25JAN24FUT', 'KOTAKBANK25JAN24FUT',
            'SBIN25JAN24FUT', 'BHARTIARTL25JAN24FUT', 'ICICIBANK25JAN24FUT',
            'HINDUNILVR25JAN24FUT'
        ];

        $data = [];
        foreach ($symbols as $index => $symbol) {
            $isGainer = str_contains($dataType, 'Gainers');
            $percentChange = $isGainer ?
                rand(100, 2000) / 100 : // 1% to 20% gain
                -(rand(100, 1500) / 100); // 1% to 15% loss

            $data[] = [
                'tradingSymbol' => $symbol,
                'percentChange' => $percentChange,
                'symbolToken' => 55394 + $index,
                'opnInterest' => rand(1000000, 200000000),
                'netChangeOpnInterest' => rand(100000, 20000000),
                'ltp' => rand(50000, 500000) / 100, // Random LTP
            ];
        }

        // Sort by percent change
        usort($data, function($a, $b) use ($dataType) {
            $isGainer = str_contains($dataType, 'Gainers');
            return $isGainer ?
                $b['percentChange'] <=> $a['percentChange'] :
                $a['percentChange'] <=> $b['percentChange'];
        });

        return [
            'status' => true,
            'message' => 'SUCCESS (Mock Data)',
            'errorcode' => '',
            'data' => array_slice($data, 0, 10)
        ];
    }

    private function getMockPCRData()
    {
        $symbols = ['NIFTY25JAN24FUT', 'BANKNIFTY25JAN24FUT', 'SENSEX25JAN24FUT'];
        $data = [];

        foreach ($symbols as $symbol) {
            $data[] = [
                'pcr' => rand(50, 150) / 100, // 0.5 to 1.5
                'tradingSymbol' => $symbol
            ];
        }

        return [
            'status' => true,
            'message' => 'SUCCESS (Mock Data)',
            'errorcode' => '',
            'data' => $data
        ];
    }

    private function getMockOIData($dataType)
    {
        $symbols = [
            'HDFCBANK25JAN24FUT', 'RELIANCE25JAN24FUT', 'TCS25JAN24FUT',
            'INFY25JAN24FUT', 'ITC25JAN24FUT'
        ];

        $data = [];
        foreach ($symbols as $index => $symbol) {
            $data[] = [
                'symbolToken' => (55394 + $index) . '',
                'ltp' => (rand(50000, 500000) / 100) . '',
                'netChange' => (rand(-5000, 5000) / 100) . '',
                'percentChange' => (rand(-500, 500) / 100) . '',
                'opnInterest' => (rand(1000000, 50000000) / 100) . '',
                'netChangeOpnInterest' => (rand(-1000000, 1000000) / 100) . '',
                'tradingSymbol' => $symbol
            ];
        }

        return [
            'status' => true,
            'message' => 'SUCCESS (Mock Data)',
            'errorcode' => '',
            'data' => $data
        ];
    }
}
