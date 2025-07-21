<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Strategy;

class PortfolioAnalyticsController extends Controller
{
    /**
     * Display the portfolio analytics dashboard
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get user's strategies
        $strategies = Strategy::where('user_id', $user->id)->get();
        
        // Calculate portfolio analytics
        $analytics = $this->calculatePortfolioAnalytics($strategies);
        
        return Inertia::render('PortfolioAnalytics/Index', [
            'analytics' => $analytics,
            'strategies' => $strategies
        ]);
    }

    /**
     * Get portfolio analytics data via API
     */
    public function getAnalytics(Request $request)
    {
        $user = Auth::user();
        $strategies = Strategy::where('user_id', $user->id)->get();
        
        $analytics = $this->calculatePortfolioAnalytics($strategies);
        
        return response()->json($analytics);
    }

    /**
     * Calculate portfolio analytics based on strategies
     */
    private function calculatePortfolioAnalytics($strategies)
    {
        // Mock data for demonstration - in a real app this would come from trading history/performance data
        $totalStrategies = $strategies->count();
        $activeStrategies = $strategies->where('is_active', true)->count();
        
        // Generate mock performance data
        $performanceData = $this->generateMockPerformanceData($totalStrategies);
        
        return [
            'overview' => [
                'total_strategies' => $totalStrategies,
                'active_strategies' => $activeStrategies,
                'total_portfolio_value' => $performanceData['portfolio_value'],
                'total_pnl' => $performanceData['total_pnl'],
                'total_pnl_percentage' => $performanceData['total_pnl_percentage'],
                'daily_pnl' => $performanceData['daily_pnl'],
                'weekly_pnl' => $performanceData['weekly_pnl'],
                'monthly_pnl' => $performanceData['monthly_pnl'],
            ],
            'performance_metrics' => [
                'sharpe_ratio' => $performanceData['sharpe_ratio'],
                'max_drawdown' => $performanceData['max_drawdown'],
                'win_rate' => $performanceData['win_rate'],
                'avg_win' => $performanceData['avg_win'],
                'avg_loss' => $performanceData['avg_loss'],
                'profit_factor' => $performanceData['profit_factor'],
            ],
            'trading_stats' => [
                'total_trades' => $performanceData['total_trades'],
                'winning_trades' => $performanceData['winning_trades'],
                'losing_trades' => $performanceData['losing_trades'],
                'avg_trade_duration' => $performanceData['avg_trade_duration'],
                'largest_win' => $performanceData['largest_win'],
                'largest_loss' => $performanceData['largest_loss'],
            ],
            'monthly_returns' => $this->generateMonthlyReturns(),
            'strategy_performance' => $this->generateStrategyPerformance($strategies),
            'equity_curve' => $this->generateEquityCurve(),
            'drawdown_chart' => $this->generateDrawdownChart(),
        ];
    }

    /**
     * Generate mock performance data based on number of strategies
     */
    private function generateMockPerformanceData($strategyCount)
    {
        // Base performance increases with more strategies
        $baseReturn = max(0.05, $strategyCount * 0.02); // 5% base + 2% per strategy
        $portfolioValue = 100000 + ($strategyCount * 50000); // $100k base + $50k per strategy
        
        $totalPnl = $portfolioValue * $baseReturn;
        $totalPnlPercentage = $baseReturn * 100;
        
        $totalTrades = $strategyCount * rand(50, 200);
        $winRate = 0.6 + (min($strategyCount, 10) * 0.02); // Improves with more strategies
        $winningTrades = (int)($totalTrades * $winRate);
        
        return [
            'portfolio_value' => $portfolioValue,
            'total_pnl' => $totalPnl,
            'total_pnl_percentage' => $totalPnlPercentage,
            'daily_pnl' => $totalPnl * 0.001, // 0.1% of total
            'weekly_pnl' => $totalPnl * 0.005, // 0.5% of total
            'monthly_pnl' => $totalPnl * 0.02, // 2% of total
            'sharpe_ratio' => 1.2 + ($strategyCount * 0.1),
            'max_drawdown' => -(5 + rand(0, 10)),
            'win_rate' => $winRate * 100,
            'avg_win' => 250 + rand(50, 200),
            'avg_loss' => -(120 + rand(30, 100)),
            'profit_factor' => 1.5 + ($strategyCount * 0.1),
            'total_trades' => $totalTrades,
            'winning_trades' => $winningTrades,
            'losing_trades' => $totalTrades - $winningTrades,
            'avg_trade_duration' => rand(45, 240) . ' minutes',
            'largest_win' => 1500 + rand(500, 2000),
            'largest_loss' => -(800 + rand(200, 500)),
        ];
    }

    /**
     * Generate monthly returns data
     */
    private function generateMonthlyReturns()
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $returns = [];
        
        foreach ($months as $month) {
            $returns[] = [
                'month' => $month,
                'return' => rand(-5, 15) / 100, // -5% to 15% monthly returns
            ];
        }
        
        return $returns;
    }

    /**
     * Generate strategy performance data
     */
    private function generateStrategyPerformance($strategies)
    {
        $performance = [];
        
        foreach ($strategies as $strategy) {
            $performance[] = [
                'id' => $strategy->id,
                'name' => $strategy->name,
                'pnl' => rand(-10000, 50000),
                'pnl_percentage' => rand(-20, 80),
                'trades' => rand(20, 150),
                'win_rate' => rand(45, 85),
                'sharpe_ratio' => rand(80, 200) / 100,
                'max_drawdown' => rand(-25, -5),
                'is_active' => $strategy->is_active,
            ];
        }
        
        return $performance;
    }

    /**
     * Generate equity curve data
     */
    private function generateEquityCurve()
    {
        $data = [];
        $baseValue = 100000;
        $currentValue = $baseValue;
        
        // Generate 30 days of equity curve data
        for ($i = 30; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $change = rand(-500, 1500); // Daily change
            $currentValue += $change;
            
            $data[] = [
                'date' => $date,
                'value' => $currentValue,
                'change' => $change,
            ];
        }
        
        return $data;
    }

    /**
     * Generate drawdown chart data
     */
    private function generateDrawdownChart()
    {
        $data = [];
        $maxValue = 100000;
        $currentValue = $maxValue;
        
        // Generate 30 days of drawdown data
        for ($i = 30; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $change = rand(-800, 1200); // Daily change
            $currentValue += $change;
            
            if ($currentValue > $maxValue) {
                $maxValue = $currentValue;
            }
            
            $drawdown = (($currentValue - $maxValue) / $maxValue) * 100;
            
            $data[] = [
                'date' => $date,
                'drawdown' => $drawdown,
            ];
        }
        
        return $data;
    }
}