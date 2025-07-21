import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Activity, RefreshCw, BarChart3, Target, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketDataItem {
    tradingSymbol: string;
    percentChange: number;
    symbolToken: number;
    opnInterest: number;
    netChangeOpnInterest: number;
    ltp?: number;
    netChange?: number;
}

interface PCRData {
    pcr: number;
    tradingSymbol: string;
}

interface OIData {
    symbolToken: string;
    ltp: string;
    netChange: string;
    percentChange: string;
    opnInterest: string;
    netChangeOpnInterest: string;
    tradingSymbol: string;
}

interface ApiResponse<T> {
    status: boolean;
    message: string;
    errorcode: string;
    data: T[];
}

export default function MarketDataIndex() {
    const [activeTab, setActiveTab] = useState('gainers-losers');
    const [dataType, setDataType] = useState('PercPriceGainers');
    const [expiryType, setExpiryType] = useState('NEAR');
    const [oiDataType, setOiDataType] = useState('Long Built Up');

    const [gainersLosersData, setGainersLosersData] = useState<MarketDataItem[]>([]);
    const [pcrData, setPcrData] = useState<PCRData[]>([]);
    const [oiData, setOiData] = useState<OIData[]>([]);

    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Fetch Gainers/Losers data
    const fetchGainersLosers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/market-data/gainers-losers?datatype=${dataType}&expirytype=${expiryType}`);
            const result: ApiResponse<MarketDataItem> = await response.json();

            if (result.status && result.data) {
                setGainersLosersData(result.data);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Error fetching gainers/losers data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch PCR data
    const fetchPCRData = async () => {
        try {
            const response = await fetch('/api/market-data/pcr');
            const result: ApiResponse<PCRData> = await response.json();

            if (result.status && result.data) {
                setPcrData(result.data);
            }
        } catch (error) {
            console.error('Error fetching PCR data:', error);
        }
    };

    // Fetch OI Buildup data
    const fetchOIData = async () => {
        try {
            const response = await fetch(`/api/market-data/oi-buildup?datatype=${oiDataType}&expirytype=${expiryType}`);
            const result: ApiResponse<OIData> = await response.json();

            if (result.status && result.data) {
                setOiData(result.data);
            }
        } catch (error) {
            console.error('Error fetching OI data:', error);
        }
    };

    // Auto-refresh data every 5 minutes
    useEffect(() => {
        fetchGainersLosers();
        fetchPCRData();
        fetchOIData();

        const interval = setInterval(() => {
            fetchGainersLosers();
            fetchPCRData();
            fetchOIData();
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [dataType, expiryType, oiDataType]);

    const formatNumber = (num: number | string) => {
        const value = typeof num === 'string' ? parseFloat(num) : num;
        if (isNaN(value)) return '0';

        if (value >= 10000000) {
            return (value / 10000000).toFixed(2) + 'Cr';
        } else if (value >= 100000) {
            return (value / 100000).toFixed(2) + 'L';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(2) + 'K';
        }
        return value.toFixed(2);
    };

    const formatSymbol = (symbol: string) => {
        return symbol.replace(/\d{2}[A-Z]{3}\d{2}FUT$/, '').toUpperCase();
    };

    return (
        <AppLayout>
            <Head title="Market Data - Angel One SmartAPI" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Market Data</h1>
                        <p className="text-muted-foreground">
                            Real-time market insights from Angel One SmartAPI
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {lastUpdated && (
                            <div className="text-sm text-muted-foreground">
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </div>
                        )}
                        <Button
                            onClick={() => {
                                fetchGainersLosers();
                                fetchPCRData();
                                fetchOIData();
                            }}
                            disabled={loading}
                            size="sm"
                        >
                            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Market Overview Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Live Market Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm text-muted-foreground">Connected to Angel API</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {gainersLosersData.length + pcrData.length + oiData.length}
                            </div>
                            <p className="text-sm text-muted-foreground">Active instruments</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Update Frequency</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5min</div>
                            <p className="text-sm text-muted-foreground">Auto refresh interval</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="gainers-losers" className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Top Gainers/Losers
                        </TabsTrigger>
                        <TabsTrigger value="pcr" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            PCR Data
                        </TabsTrigger>
                        <TabsTrigger value="oi-buildup" className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            OI Buildup
                        </TabsTrigger>
                    </TabsList>

                    {/* Top Gainers/Losers Tab */}
                    <TabsContent value="gainers-losers">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <CardTitle>Top Gainers & Losers</CardTitle>
                                        <CardDescription>
                                            Real-time price and OI movement data from derivatives segment
                                        </CardDescription>
                                    </div>

                                    <div className="flex gap-2">
                                        <Select value={dataType} onValueChange={setDataType}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PercPriceGainers">Price Gainers</SelectItem>
                                                <SelectItem value="PercPriceLosers">Price Losers</SelectItem>
                                                <SelectItem value="PercOIGainers">OI Gainers</SelectItem>
                                                <SelectItem value="PercOILosers">OI Losers</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={expiryType} onValueChange={setExpiryType}>
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NEAR">Near</SelectItem>
                                                <SelectItem value="NEXT">Next</SelectItem>
                                                <SelectItem value="FAR">Far</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {gainersLosersData.length === 0 && !loading ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No data available. Click refresh to fetch latest data.
                                        </div>
                                    ) : (
                                        gainersLosersData.map((item, index) => (
                                            <div
                                                key={item.symbolToken}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{formatSymbol(item.tradingSymbol)}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {item.tradingSymbol}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className={cn(
                                                        "flex items-center gap-1 font-semibold",
                                                        item.percentChange >= 0 ? "text-green-600" : "text-red-600"
                                                    )}>
                                                        {item.percentChange >= 0 ? (
                                                            <TrendingUp className="w-4 h-4" />
                                                        ) : (
                                                            <TrendingDown className="w-4 h-4" />
                                                        )}
                                                        {item.percentChange >= 0 ? '+' : ''}{item.percentChange.toFixed(2)}%
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        OI: {formatNumber(item.opnInterest)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    {loading && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Activity className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            Loading market data...
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* PCR Data Tab */}
                    <TabsContent value="pcr">
                        <Card>
                            <CardHeader>
                                <CardTitle>Put-Call Ratio (PCR)</CardTitle>
                                <CardDescription>
                                    Market sentiment indicator based on options trading volume
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {pcrData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div>
                                                <div className="font-medium">{formatSymbol(item.tradingSymbol)}</div>
                                                <div className="text-sm text-muted-foreground">{item.tradingSymbol}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold">{item.pcr.toFixed(2)}</div>
                                                <Badge variant={item.pcr > 1 ? "default" : "secondary"}>
                                                    {item.pcr > 1 ? "Bearish" : "Bullish"}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* OI Buildup Tab */}
                    <TabsContent value="oi-buildup">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <CardTitle>Open Interest Buildup</CardTitle>
                                        <CardDescription>
                                            Track Long/Short buildup and unwinding patterns
                                        </CardDescription>
                                    </div>

                                    <div className="flex gap-2">
                                        <Select value={oiDataType} onValueChange={setOiDataType}>
                                            <SelectTrigger className="w-[160px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Long Built Up">Long Buildup</SelectItem>
                                                <SelectItem value="Short Built Up">Short Buildup</SelectItem>
                                                <SelectItem value="Short Covering">Short Covering</SelectItem>
                                                <SelectItem value="Long Unwinding">Long Unwinding</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={expiryType} onValueChange={setExpiryType}>
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NEAR">Near</SelectItem>
                                                <SelectItem value="NEXT">Next</SelectItem>
                                                <SelectItem value="FAR">Far</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {oiData.map((item, index) => (
                                        <div
                                            key={item.symbolToken}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{formatSymbol(item.tradingSymbol)}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        LTP: ₹{parseFloat(item.ltp).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className={cn(
                                                    "flex items-center gap-1 font-semibold",
                                                    parseFloat(item.percentChange) >= 0 ? "text-green-600" : "text-red-600"
                                                )}>
                                                    {parseFloat(item.percentChange) >= 0 ? (
                                                        <TrendingUp className="w-4 h-4" />
                                                    ) : (
                                                        <TrendingDown className="w-4 h-4" />
                                                    )}
                                                    {parseFloat(item.percentChange) >= 0 ? '+' : ''}{parseFloat(item.percentChange).toFixed(2)}%
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    OI: {formatNumber(item.opnInterest)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
