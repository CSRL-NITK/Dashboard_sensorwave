import React from 'react'
import { useSelector } from 'react-redux';
import { DashboardMap } from '../data/deviceData';
import { useLocation } from 'react-router-dom';

function dashboard() {
    const { state } = useLocation();
    console.log(state);
    const theme = useSelector(state => state.theme.theme);
    const lastRecentlyDevice = useSelector(state => state.device.lastRecentlyDevice);

    return (
        <div className="overflow-auto scrollbar-hide" style={{ height: '100vh', boxSizing: 'border-box' }}>
            {/* <iframe
                src={`http://192.168.0.18:3000/public-dashboards/${DashboardMap[state] || DashboardMap[lastRecentlyDevice]}?from=now-12h&to=now&theme=${theme === 'dark' ? 'dark' : 'light'}`}
                width="100%"
                height="100%"
                frameBorder={0}
            ></iframe> */}
            <iframe src="http://localhost:3000/d-solo/ef2lg0oq5glxcc/new-dashboard?orgId=1&from=1762222849214&to=1762244449214&timezone=browser&showCategory=Panel%20options&theme=dark&panelId=1&__feature.dashboardSceneSolo" width="1350" height="650" frameborder="0"></iframe>
        </div>
    )
}

export default dashboard
