<?php

use App\Models\User;
use App\Models\Strategy;

test('portfolio analytics page can be accessed by authenticated user', function () {
    $user = User::factory()->create();
    
    $response = $this
        ->actingAs($user)
        ->get('/portfolio-analytics');
        
    $response->assertOk();
});

test('portfolio analytics api returns json data', function () {
    $user = User::factory()->create();
    
    // Create a test strategy
    Strategy::factory()->create([
        'user_id' => $user->id,
        'name' => 'Test Strategy',
        'is_active' => true,
    ]);
    
    $response = $this
        ->actingAs($user)
        ->get('/api/portfolio-analytics');
        
    $response->assertOk()
             ->assertJsonStructure([
                 'overview' => [
                     'total_strategies',
                     'active_strategies', 
                     'total_portfolio_value',
                     'total_pnl',
                     'total_pnl_percentage'
                 ],
                 'performance_metrics' => [
                     'sharpe_ratio',
                     'max_drawdown',
                     'win_rate'
                 ],
                 'trading_stats' => [
                     'total_trades',
                     'winning_trades',
                     'losing_trades'
                 ]
             ]);
});

test('guest users cannot access portfolio analytics', function () {
    $response = $this->get('/portfolio-analytics');
    
    $response->assertRedirect('/login');
});