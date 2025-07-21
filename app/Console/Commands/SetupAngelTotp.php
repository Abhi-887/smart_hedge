<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PragmaRX\Google2FA\Google2FA;

class SetupAngelTotp extends Command
{
    protected $signature = 'angel:setup-totp';
    protected $description = 'Generate TOTP secret for Angel One API authentication';

    public function handle()
    {
        $this->info('Setting up Angel One TOTP authentication...');

        // Check if Google2FA is installed
        if (!class_exists(Google2FA::class)) {
            $this->error('Google2FA package not found. Please install it first with: composer require pragmarx/google2fa');
            return 1;
        }

        $google2fa = new Google2FA();

        // Generate a new secret
        $secretKey = $google2fa->generateSecretKey();

        $this->info('Your TOTP Secret Key: ' . $secretKey);
        $this->line('');

        // Generate QR Code URL for easier setup
        $qrCodeUrl = $google2fa->getQRCodeUrl(
            'Angel One SmartAPI',
            config('services.angel.client_id', 'smarthedge'),
            $secretKey
        );

        $this->info('QR Code URL for Google Authenticator:');
        $this->line($qrCodeUrl);
        $this->line('');

        $this->info('Steps to complete setup:');
        $this->line('1. Update your .env file with this secret:');
        $this->line('   ANGEL_TOTP_SECRET=' . $secretKey);
        $this->line('');
        $this->line('2. Add your actual MPIN to .env:');
        $this->line('   ANGEL_MPIN=your-actual-mpin');
        $this->line('');
        $this->line('3. Scan the QR code with Google Authenticator app');
        $this->line('4. Or manually enter the secret key in your authenticator app');
        $this->line('');

        // Test TOTP generation
        $testTotp = $google2fa->getCurrentOtp($secretKey);
        $this->info('Test TOTP (current): ' . $testTotp);
        $this->line('This TOTP should match what your authenticator app shows.');

        return 0;
    }
}
