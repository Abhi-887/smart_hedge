import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, Bot, Zap, Shield, BarChart3, Target, Brain, Code, DollarSign, LineChart } from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock real-time data simulation
const mockMarketData = [
    { symbol: 'BTCUSDT', price: 43250.67, change: 2.34, positive: true },
    { symbol: 'ETHUSDT', price: 2634.89, change: -1.23, positive: false },
    { symbol: 'AAPL', price: 184.92, change: 0.87, positive: true },
    { symbol: 'TSLA', price: 248.73, change: -2.45, positive: false },
    { symbol: 'SPY', price: 478.56, change: 1.12, positive: true },
];

function MarketTicker() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % mockMarketData.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const current = mockMarketData[currentIndex];

    return (
        <div className="flex items-center gap-4 text-sm font-mono bg-muted/30 px-4 py-2 rounded-lg border">
            <span className="text-muted-foreground">LIVE:</span>
            <span className="font-semibold">{current.symbol}</span>
            <span className="font-bold">${current.price.toLocaleString()}</span>
            <span className={`flex items-center gap-1 ${current.positive ? 'text-green-500' : 'text-red-500'}`}>
                {current.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {current.positive ? '+' : ''}{current.change}%
            </span>
        </div>
    );
}

function AnimatedChart() {
    const [dataPoints, setDataPoints] = useState(Array.from({ length: 20 }, () => Math.random() * 100));

    useEffect(() => {
        const interval = setInterval(() => {
            setDataPoints(prev => [...prev.slice(1), Math.random() * 100]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-20 flex items-end gap-1">
            {dataPoints.map((point, index) => (
                <div
                    key={index}
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-1000 ease-in-out"
                    style={{ height: `${point}%`, width: '4px' }}
                />
            ))}
        </div>
    );
}

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Smart Hedge - Advanced Algorithmic Trading Platform">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Animated background grid */}
                <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />

                {/* Header with market ticker */}
                <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
                    <div className="container max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">Smart Hedge</h1>
                                    <p className="text-xs text-muted-foreground">Algorithmic Trading</p>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <MarketTicker />
                            </div>

                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Button asChild>
                                        <Link href={route('dashboard')}>
                                            <Activity className="w-4 h-4 mr-2" />
                                            Trading Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="ghost" asChild>
                                            <Link href={route('login')}>Log in</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href={route('register')}>
                                                Start Trading
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="container max-w-7xl mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <Badge variant="outline" className="mb-6">
                                <Zap className="w-3 h-3 mr-1" />
                                Advanced Algorithms Active
                            </Badge>
                            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Algorithmic Trading
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                                    Redefined
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                Execute high-frequency trades with precision. Our AI-powered algorithms analyze market patterns,
                                execute trades in milliseconds, and optimize your portfolio 24/7.
                            </p>

                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" className="text-lg font-semibold" asChild>
                                        <Link href={route('register')}>
                                            <Target className="w-5 h-5 mr-2" />
                                            Start Algo Trading
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="text-lg font-semibold" asChild>
                                        <Link href={route('login')}>
                                            <BarChart3 className="w-5 h-5 mr-2" />
                                            View Strategies
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Live Chart */}
                        <Card className="p-6">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Portfolio Performance</CardTitle>
                                        <CardDescription>Real-time algorithm execution</CardDescription>
                                    </div>
                                    <Badge variant="default" className="animate-pulse">
                                        <Activity className="w-3 h-3 mr-1" />
                                        LIVE
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <AnimatedChart />
                                <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-green-500">+24.7%</p>
                                        <p className="text-xs text-muted-foreground">Today's Gain</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">847</p>
                                        <p className="text-xs text-muted-foreground">Trades Executed</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-500">0.12s</p>
                                        <p className="text-xs text-muted-foreground">Avg Response</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Features Section */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <Brain className="w-6 h-6 text-blue-500" />
                                </div>
                                <CardTitle>AI-Powered Strategies</CardTitle>
                                <CardDescription>
                                    Machine learning algorithms that adapt to market conditions and optimize trading strategies in real-time.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                            <CardHeader>
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-indigo-500" />
                                </div>
                                <CardTitle>High-Frequency Execution</CardTitle>
                                <CardDescription>
                                    Lightning-fast trade execution with sub-millisecond latency for maximum profit capture.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-purple-500" />
                                </div>
                                <CardTitle>Risk Management</CardTitle>
                                <CardDescription>
                                    Advanced risk controls and stop-loss mechanisms to protect your capital in volatile markets.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <Code className="w-6 h-6 text-green-500" />
                                </div>
                                <CardTitle>Custom Algorithms</CardTitle>
                                <CardDescription>
                                    Build and backtest your own trading algorithms with our comprehensive development environment.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <LineChart className="w-6 h-6 text-orange-500" />
                                </div>
                                <CardTitle>Market Analysis</CardTitle>
                                <CardDescription>
                                    Real-time market sentiment analysis and technical indicators to guide your trading decisions.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
                            <CardHeader>
                                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <DollarSign className="w-6 h-6 text-cyan-500" />
                                </div>
                                <CardTitle>Portfolio Optimization</CardTitle>
                                <CardDescription>
                                    Automated portfolio rebalancing and diversification strategies to maximize risk-adjusted returns.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Stats Section */}
                    <Card className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-0">
                        <CardContent className="p-8">
                            <div className="grid md:grid-cols-4 gap-8 text-center">
                                <div className="space-y-2">
                                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        $2.8B+
                                    </p>
                                    <p className="text-sm text-muted-foreground">Volume Traded Daily</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        127%
                                    </p>
                                    <p className="text-sm text-muted-foreground">Average Annual Return</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        45,000+
                                    </p>
                                    <p className="text-sm text-muted-foreground">Active Algorithms</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                        0.08ms
                                    </p>
                                    <p className="text-sm text-muted-foreground">Execution Latency</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>

                {/* Footer */}
                <footer className="border-t bg-muted/30">
                    <div className="container max-w-7xl mx-auto px-6 py-8">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center gap-2 mb-4 md:mb-0">
                                <Bot className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold">Smart Hedge</span>
                                <Badge variant="secondary" className="text-xs">Alpha</Badge>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <a href="#" className="hover:text-foreground transition-colors">API Docs</a>
                                <a href="#" className="hover:text-foreground transition-colors">Risk Disclosure</a>
                                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
                            <p>© 2025 Smart Hedge. Advanced algorithmic trading platform. Trading involves substantial risk.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
