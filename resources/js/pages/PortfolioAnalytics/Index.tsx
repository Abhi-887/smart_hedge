import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Target, Zap, RefreshCw, Calculator } from 'lucide-react';

interface Analytics {
    overview: {
        total_strategies: number;
        active_strategies: number;
        total_portfolio_value: number;
        total_pnl: number;
        total_pnl_percentage: number;
        daily_pnl: number;
        weekly_pnl: number;
        monthly_pnl: number;
    };
    performance_metrics: {
        sharpe_ratio: number;
        max_drawdown: number;
        win_rate: number;
        avg_win: number;
        avg_loss: number;
        profit_factor: number;
    };
    trading_stats: {
        total_trades: number;
        winning_trades: number;
        losing_trades: number;
        avg_trade_duration: string;
        largest_win: number;
        largest_loss: number;
    };
    monthly_returns: Array<{
        month: string;
        return: number;
    }>;
    strategy_performance: Array<{
        id: number;
        name: string;
        pnl: number;
        pnl_percentage: number;
        trades: number;
        win_rate: number;
        sharpe_ratio: number;
        max_drawdown: number;
        is_active: boolean;
    }>;
    equity_curve: Array<{
        date: string;
        value: number;
        change: number;
    }>;
    drawdown_chart: Array<{
        date: string;
        drawdown: number;
    }>;
}

interface Props {
    analytics: Analytics;
    strategies: Array<any>;
}

export default function Index({ analytics, strategies }: Props) {
    const [loading, setLoading] = useState(false);
    const [currentAnalytics, setCurrentAnalytics] = useState(analytics);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatPercentage = (value: number) => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    };

    const refreshAnalytics = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/portfolio-analytics');
            const data = await response.json();
            setCurrentAnalytics(data);
        } catch (error) {
            console.error('Failed to refresh analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPnlColor = (value: number) => {
        return value >= 0 ? 'text-green-600' : 'text-red-600';
    };

    const getPnlIcon = (value: number) => {
        return value >= 0 ? TrendingUp : TrendingDown;
    };

    return (
        <AppLayout>
            <Head title="Portfolio Analytics - What You Get" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Portfolio Analytics</h1>
                        <p className="text-muted-foreground">
                            Discover what you get from your trading strategies - performance, insights, and returns
                        </p>
                    </div>
                    <Button 
                        onClick={refreshAnalytics} 
                        disabled={loading}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </Button>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Portfolio Value */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                                <h3 className="text-2xl font-bold">{formatCurrency(currentAnalytics.overview.total_portfolio_value)}</h3>
                            </div>
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <PieChart className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    {/* Total P&L */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total P&L</p>
                                <h3 className={`text-2xl font-bold ${getPnlColor(currentAnalytics.overview.total_pnl)}`}>
                                    {formatCurrency(currentAnalytics.overview.total_pnl)}
                                </h3>
                                <p className={`text-sm ${getPnlColor(currentAnalytics.overview.total_pnl_percentage)}`}>
                                    {formatPercentage(currentAnalytics.overview.total_pnl_percentage)}
                                </p>
                            </div>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                currentAnalytics.overview.total_pnl >= 0 ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                                {currentAnalytics.overview.total_pnl >= 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Active Strategies */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Strategies</p>
                                <h3 className="text-2xl font-bold">{currentAnalytics.overview.active_strategies}</h3>
                                <p className="text-sm text-muted-foreground">
                                    of {currentAnalytics.overview.total_strategies} total
                                </p>
                            </div>
                            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Zap className="h-4 w-4 text-purple-600" />
                            </div>
                        </div>
                    </Card>

                    {/* Win Rate */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                                <h3 className="text-2xl font-bold">{currentAnalytics.performance_metrics.win_rate.toFixed(1)}%</h3>
                                <p className="text-sm text-muted-foreground">
                                    {currentAnalytics.trading_stats.winning_trades} wins
                                </p>
                            </div>
                            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <Target className="h-4 w-4 text-orange-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Key Performance Metrics */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">Performance Metrics</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                                <span className="font-medium">{currentAnalytics.performance_metrics.sharpe_ratio.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Max Drawdown</span>
                                <span className={`font-medium ${getPnlColor(currentAnalytics.performance_metrics.max_drawdown)}`}>
                                    {currentAnalytics.performance_metrics.max_drawdown.toFixed(2)}%
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Profit Factor</span>
                                <span className="font-medium">{currentAnalytics.performance_metrics.profit_factor.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Average Win</span>
                                <span className="font-medium text-green-600">
                                    {formatCurrency(currentAnalytics.performance_metrics.avg_win)}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Average Loss</span>
                                <span className="font-medium text-red-600">
                                    {formatCurrency(currentAnalytics.performance_metrics.avg_loss)}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Trading Statistics */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Calculator className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold">Trading Statistics</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Trades</span>
                                <span className="font-medium">{currentAnalytics.trading_stats.total_trades.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Winning Trades</span>
                                <span className="font-medium text-green-600">{currentAnalytics.trading_stats.winning_trades.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Losing Trades</span>
                                <span className="font-medium text-red-600">{currentAnalytics.trading_stats.losing_trades.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Avg Trade Duration</span>
                                <span className="font-medium">{currentAnalytics.trading_stats.avg_trade_duration}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Largest Win</span>
                                <span className="font-medium text-green-600">
                                    {formatCurrency(currentAnalytics.trading_stats.largest_win)}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Period P&L */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Period Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Daily P&L</p>
                            <p className={`text-xl font-bold ${getPnlColor(currentAnalytics.overview.daily_pnl)}`}>
                                {formatCurrency(currentAnalytics.overview.daily_pnl)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Weekly P&L</p>
                            <p className={`text-xl font-bold ${getPnlColor(currentAnalytics.overview.weekly_pnl)}`}>
                                {formatCurrency(currentAnalytics.overview.weekly_pnl)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Monthly P&L</p>
                            <p className={`text-xl font-bold ${getPnlColor(currentAnalytics.overview.monthly_pnl)}`}>
                                {formatCurrency(currentAnalytics.overview.monthly_pnl)}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Strategy Performance */}
                {currentAnalytics.strategy_performance.length > 0 && (
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Strategy Performance</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Strategy</th>
                                        <th className="text-left py-2">Status</th>
                                        <th className="text-right py-2">P&L</th>
                                        <th className="text-right py-2">Trades</th>
                                        <th className="text-right py-2">Win Rate</th>
                                        <th className="text-right py-2">Sharpe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAnalytics.strategy_performance.map((strategy) => (
                                        <tr key={strategy.id} className="border-b">
                                            <td className="py-3 font-medium">{strategy.name}</td>
                                            <td className="py-3">
                                                <Badge variant={strategy.is_active ? "default" : "secondary"}>
                                                    {strategy.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className={`py-3 text-right font-medium ${getPnlColor(strategy.pnl)}`}>
                                                {formatCurrency(strategy.pnl)}
                                                <br />
                                                <span className="text-sm">
                                                    {formatPercentage(strategy.pnl_percentage)}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right">{strategy.trades}</td>
                                            <td className="py-3 text-right">{strategy.win_rate.toFixed(1)}%</td>
                                            <td className="py-3 text-right">{strategy.sharpe_ratio.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Monthly Returns */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Monthly Returns</h3>
                    <div className="grid grid-cols-12 gap-2">
                        {currentAnalytics.monthly_returns.map((monthData) => (
                            <div key={monthData.month} className="text-center">
                                <div className="text-xs text-muted-foreground mb-1">{monthData.month}</div>
                                <div className={`text-sm font-medium ${getPnlColor(monthData.return * 100)}`}>
                                    {formatPercentage(monthData.return * 100)}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* What You Get Summary */}
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900">What You Get From Smart Hedge</h3>
                            <p className="text-sm text-blue-700">Your algorithmic trading results and benefits</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-900">
                                {formatPercentage(currentAnalytics.overview.total_pnl_percentage)}
                            </div>
                            <div className="text-sm text-blue-700">Total Returns</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-900">
                                {currentAnalytics.performance_metrics.sharpe_ratio.toFixed(2)}
                            </div>
                            <div className="text-sm text-blue-700">Sharpe Ratio</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-900">
                                {currentAnalytics.performance_metrics.win_rate.toFixed(0)}%
                            </div>
                            <div className="text-sm text-blue-700">Success Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-900">
                                {currentAnalytics.trading_stats.total_trades.toLocaleString()}
                            </div>
                            <div className="text-sm text-blue-700">Trades Executed</div>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}