<?php

namespace Database\Seeders;

use App\Models\Broker;
use Illuminate\Database\Seeder;

/**
 * BrokerSeeder
 *
 * Seeds the database with popular Indian brokers.
 * Creates default broker records for the application.
 */
class BrokerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brokers = [
            [
                'name' => 'Angel One',
                'code' => 'angel',
                'base_api_url' => 'https://apiconnect.angelbroking.com',
                'description' => 'Angel One is a leading retail stockbroker in India offering comprehensive trading and investment solutions.',
                'is_active' => true,
            ],
            [
                'name' => 'Zerodha',
                'code' => 'zerodha',
                'base_api_url' => 'https://api.kite.trade',
                'description' => 'Zerodha is India\'s largest retail stockbroker offering equity, commodity and currency trading.',
                'is_active' => true,
            ],
            [
                'name' => 'Upstox',
                'code' => 'upstox',
                'base_api_url' => 'https://api.upstox.com',
                'description' => 'Upstox is a leading discount broker providing trading services across equity, commodity, and currency segments.',
                'is_active' => true,
            ],
            [
                'name' => 'Groww',
                'code' => 'groww',
                'base_api_url' => 'https://api.groww.in',
                'description' => 'Groww is a popular investment platform offering stocks, mutual funds, and other investment options.',
                'is_active' => true,
            ],
            [
                'name' => 'IIFL Securities',
                'code' => 'iifl',
                'base_api_url' => 'https://api.iifl.com',
                'description' => 'IIFL Securities provides comprehensive trading and investment solutions with advanced research.',
                'is_active' => true,
            ],
            [
                'name' => 'Motilal Oswal',
                'code' => 'motilal',
                'base_api_url' => 'https://api.motilaloswal.com',
                'description' => 'Motilal Oswal is a leading financial services company offering broking and wealth management.',
                'is_active' => true,
            ],
            [
                'name' => 'HDFC Securities',
                'code' => 'hdfc',
                'base_api_url' => 'https://api.hdfcsec.com',
                'description' => 'HDFC Securities is the broking arm of HDFC Bank offering comprehensive investment solutions.',
                'is_active' => true,
            ],
            [
                'name' => 'ICICI Direct',
                'code' => 'icici',
                'base_api_url' => 'https://api.icicidirect.com',
                'description' => 'ICICI Direct is the online trading platform of ICICI Bank offering various investment products.',
                'is_active' => true,
            ],
            [
                'name' => 'Kotak Securities',
                'code' => 'kotak',
                'base_api_url' => 'https://api.kotaksecurities.com',
                'description' => 'Kotak Securities provides online trading services with research and advisory support.',
                'is_active' => true,
            ],
            [
                'name' => '5paisa',
                'code' => '5paisa',
                'base_api_url' => 'https://api.5paisa.com',
                'description' => '5paisa is a discount broker offering trading services at competitive pricing.',
                'is_active' => true,
            ],
        ];

        foreach ($brokers as $broker) {
            Broker::firstOrCreate(
                ['code' => $broker['code']],
                $broker
            );
        }

        $this->command->info('Brokers seeded successfully!');
    }
}
