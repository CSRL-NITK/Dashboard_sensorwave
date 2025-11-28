import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Introduction = () => {
    const navigate = useNavigate();
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
    const features = [
        {
            icon: '📊',
            title: 'Real-time Dashboard',
            description: 'Monitor all your sensors in real-time with our intuitive dashboard interface.'
        },
        {
            icon: '🔔',
            title: 'Smart Alerts',
            description: 'Get instant notifications when your sensors detect anomalies or exceed thresholds.'
        },
        {
            icon: '📱',
            title: 'Device Management',
            description: 'Easily manage and configure all your connected devices from one central location.'
        },
        {
            icon: '📈',
            title: 'Advanced Analytics',
            description: 'Gain valuable insights with our powerful analytics and reporting tools.'
        }
    ];

    // If user is already authenticated, redirect to dashboard
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = () => {
        loginWithRedirect({
            appState: { returnTo: '/' }
        });
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            textAlign: 'center',
        }}>
            <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '20px',
            }}>
                SensorWave
            </h1>

            <p style={{
                fontSize: '24px',
                marginBottom: '40px',
            }}>
                The Next Generation IoT Platform for Intelligent Sensor Management and Real-time Monitoring
            </p>

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                marginBottom: '40px',
                padding: '0 20px',
            }}>
                {features.map((feature, index) => (
                    <div
                        key={index}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '10px',
                            width: '250px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{
                            fontSize: '48px',
                        }}>{feature.icon}</div>
                        <h3 style={{
                            fontSize: '24px',
                            marginBottom: '0px',
                        }}>
                            {feature.title}
                        </h3>
                        <p style={{
                            fontSize: '16px',
                        }}>
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            <button
                style={{
                    background: '#fff',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    color: 'black'
                }}
                onClick={handleLogin}
                onMouseEnter={(e) => {
                    if (!isLoading) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.background = '#f8f9fa';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isLoading) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.background = '#fff';
                    }
                }}
                disabled={isLoading}
            >
                {isLoading ? 'Loading...' : 'Login'}
            </button>

            <p style={{
                fontSize: '16px',
                marginTop: '20px',
            }}>
                © 2024 SensorWave. All rights reserved.
            </p>
        </div>
    );
};

export default Introduction; 