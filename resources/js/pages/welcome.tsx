import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Smart Hedge - Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-900">
                {/* Header */}
                <header className="relative z-10 p-6">
                    <nav className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Smart Hedge</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="max-w-7xl mx-auto px-6 py-12">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                                Intelligent
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Investment</span>
                                <br />Solutions
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                                Make smarter investment decisions with our AI-powered hedge fund platform.
                                Optimize your portfolio, manage risks, and maximize returns with cutting-edge technology.
                            </p>

                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                    <Link
                                        href={route('register')}
                                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        Get Started Free
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600 dark:hover:border-blue-400 rounded-xl font-semibold text-lg transition-all duration-200"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Portfolio Optimization</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Advanced algorithms analyze market trends and optimize your portfolio for maximum returns while minimizing risk.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Risk Management</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Comprehensive risk assessment tools help protect your investments with intelligent hedging strategies.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Real-time Analytics</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Live market data and instant insights powered by machine learning to keep you ahead of the curve.
                                </p>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="grid md:grid-cols-4 gap-8 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">$2.5B+</div>
                                    <div className="text-gray-600 dark:text-gray-300">Assets Under Management</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">15.2%</div>
                                    <div className="text-gray-600 dark:text-gray-300">Average Annual Return</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">10,000+</div>
                                    <div className="text-gray-600 dark:text-gray-300">Active Investors</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">99.9%</div>
                                    <div className="text-gray-600 dark:text-gray-300">Platform Uptime</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                    </svg>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">Smart Hedge</span>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
                                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                            © 2025 Smart Hedge. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
