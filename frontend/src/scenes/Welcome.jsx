import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const Welcome = () => {
    const theme = useSelector((state) => state.theme.theme);
    const needsResetPassword = sessionStorage.getItem("needsReset") === 'true';
    const navigate = useNavigate();
    const [currentFeature, setCurrentFeature] = useState(0);

    // Features to highlight in the carousel
    const features = [
        {
            title: "Real-time Monitoring",
            description: "View and analyze your sensor data in real-time with interactive dashboards.",
            icon: "📊"
        },
        {
            title: "Smart Alerts",
            description: "Set up custom alerts to notify you when sensor readings exceed thresholds.",
            icon: "🔔"
        },
        {
            title: "Data Analytics",
            description: "Gain valuable insights through advanced analytics and reporting tools.",
            icon: "📈"
        },
        {
            title: "Mobile Access",
            description: "Monitor your sensors on the go with our responsive mobile interface.",
            icon: "📱"
        }
    ];

    // Automatically rotate through features
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Redirect if password reset is needed
    useEffect(() => {
        if (needsResetPassword) {
            navigate('/reset-password');
        }
    }, [navigate, needsResetPassword]);

    const isDarkMode = theme === 'dark';

    return (
        <div
            className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
                }`}
        >
            {/* Header */}
            {/* <header className={`py-4 px-6 flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex items-center gap-2">
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        Sensor Wave
                    </div>
                </div>
                <nav>
                    <ul className="flex gap-6">
                        <li><Link to="/login" className={`hover:${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Log In</Link></li>
                        <li><Link to="/signup" className={`hover:${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Sign Up</Link></li>
                    </ul>
                </nav>
            </header> */}

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-16 px-4">
                <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Welcome to Sensor Wave
                </h1>
                <p className="text-xl mb-8 max-w-2xl">
                    Your comprehensive platform for sensor data monitoring, analysis, and management.
                </p>
                <div className="flex gap-4 mb-12">
                    <button
                        // onClick={() => navigate('/signup')}
                        className="bg-blue-500 border-b-4 border-blue-800 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Get Started
                    </button>
                    {/* <Link
                        to="/demo"
                        className={`py-3 px-6 rounded-lg font-bold border-2 transition-all duration-300 ${isDarkMode
                            ? 'border-gray-600 hover:border-gray-500 text-gray-300'
                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                            }`}
                    >
                        View Demo
                    </Link> */}
                </div>
            </section>

            {/* Feature Carousel */}
            <section className={`py-12 px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                <h2 className="text-2xl font-bold text-center mb-12">Key Features</h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-xl transition-all duration-500 w-full max-w-xs ${currentFeature === index
                                ? isDarkMode
                                    ? 'bg-gray-700 shadow-lg transform scale-105'
                                    : 'bg-white shadow-lg transform scale-105'
                                : isDarkMode
                                    ? 'bg-gray-800 opacity-70'
                                    : 'bg-gray-50 opacity-70'
                                }`}
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                                {feature.title}
                            </h3>
                            <p className="text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    {features.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentFeature(index)}
                            className={`w-3 h-3 mx-1 rounded-full ${currentFeature === index
                                ? isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                                : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                                }`}
                            aria-label={`Go to feature ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* How to Get Started */}
            <section className="py-16 px-4">
                <h2 className="text-2xl font-bold text-center mb-8">How to Get Started</h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                            }`}>
                            1
                        </div>
                        <h3 className="text-lg font-bold mb-2">Create an Account</h3>
                        <p className="text-sm">Sign up for free and set up your personal or business profile.</p>
                        <Link
                            to="/signup"
                            className={`block mt-4 text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                            Register Now →
                        </Link>
                    </div>
                    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                            }`}>
                            2
                        </div>
                        <h3 className="text-lg font-bold mb-2">Connect Your Sensors</h3>
                        <p className="text-sm">Add your sensors through our simple integration process.</p>
                        <Link
                            to="/guide/connect"
                            className={`block mt-4 text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                            View Integration Guide →
                        </Link>
                    </div>
                    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                            }`}>
                            3
                        </div>
                        <h3 className="text-lg font-bold mb-2">Monitor & Analyze</h3>
                        <p className="text-sm">Start tracking your sensor data and gain valuable insights.</p>
                        <Link
                            to="/guide/dashboard"
                            className={`block mt-4 text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                            Explore Dashboard Features →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className={`py-12 px-4 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-600'} text-white`}>
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Sensor Data Experience?</h2>
                    <p className="mb-8">Join thousands of users who are already optimizing their operations with Sensor Wave.</p>
                    <button
                        // onClick={() => navigate('/signup')}
                        className={`py-3 px-8 rounded-lg font-bold transition-all duration-300 ${isDarkMode
                            ? 'bg-white text-blue-900 hover:bg-gray-100'
                            : 'bg-white text-blue-600 hover:bg-gray-100'
                            }`}
                    >
                        Start Free Trial
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className={`py-8 px-6 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold mb-4">Sensor Wave</h3>
                        <p className="text-sm">Your one-stop solution for all your sensor data needs.</p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Resources</h3>
                        <ul className="text-sm space-y-2">
                            <li><Link to="/docs">Documentation</Link></li>
                            <li><Link to="/guides">Guides</Link></li>
                            <li><Link to="/api">API</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Company</h3>
                        <ul className="text-sm space-y-2">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Legal</h3>
                        <ul className="text-sm space-y-2">
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm">
                    <p>&copy; {new Date(Date.now()).getFullYear()} Sensor Wave. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;