import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { appendAllAlerts } from '../redux/slices/notificationSlice';

const SSEListener = () => {
    const yourDetail = JSON.parse(sessionStorage.getItem("yourDetailAsCustomer"));
    const theme = useSelector(state => state.theme.theme);
    const dispatch = useDispatch();
    // console.log("yourDetail : ", yourDetail.vendor_id);
    const uniqueId = sessionStorage.getItem('uniqueId');
    const thisUserThresholds = {
        nh3: { min: 0, max: 25.0 },
        ch4: { min: 0, max: 50.0 },
        co: { min: 0, max: 25.0 },
        co2: { min: 0, max: 1000.0 },
        lpg: { min: 0, max: 100.0 },
        smoke: { min: 0, max: 400.0 },
        pm25: { min: 0, max: 91.0 },
        pm10: { min: 0, max: 251.0 },
    };
    const [alertArray, setAlertArray] = useState([]);
    const debounceTimerRef = useRef(null);
    const generateAlerts = (data) => {
        const genAlert = {
            device_id: data.device_id,
            customer_id: uniqueId,
            vendor_id: yourDetail.vendor_id,
            device_name: data.device_id,
            parameter: data.parameter,
            value: data.value,
            alert_status: data.status,
            resolved_status: "Send Request",
            alert_gen_time: new Date().toLocaleString('en-US', {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        }
        return genAlert;
    }
    const debouncer = (newAlert, delay = 1000) => {
        setAlertArray(prev => [...prev, newAlert]);
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            setAlertArray(prev => {
                if (prev.length > 0) {
                    insertAlert(prev);
                    console.log("Alerts : ", prev);
                }
                return [];
            });
        }, delay);
    };
    function checkParameterThreshold(data) {
        let truthArray = [];
        for (const [parameter, value] of Object.entries(data)) {
            const threshold = thisUserThresholds[parameter];
            if (threshold) {
                const { min, max } = threshold;
                const field = {
                    device_id: data.device_id,
                    device_name: data.device_name,
                    parameter: parameter,
                    value: value,
                }
                if (value < min) {
                    truthArray.push({ ...field, status: "Low" });
                } else if (value > max) {
                    truthArray.push({ ...field, status: "High" });
                }
            }
        }
        return truthArray;
    }
    async function insertAlert(alertArrayToInsert) {
        try {
            const res = await axios({
                url: "http://localhost:8000/api/alert/insertAlerts",
                method: "POST",
                data: { alerts: alertArrayToInsert },
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.status === 200) {
                dispatch(appendAllAlerts(alertArrayToInsert));
                toast.success("Alert inserted Successfully", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: theme === 'dark' ? 'dark' : 'light'
                });
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
            toast.error("Alert insertion Failed", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: theme === 'dark' ? 'dark' : 'light'
            });
        }
    }
    useEffect(() => {
        const eventSource = new EventSource(`http://localhost:8000/api/aq/events?customer_id=${encodeURIComponent(uniqueId)}`);

        eventSource.onopen = () => {
            console.log('🔌 SSE connection opened');
        }

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📥 New SSE data:', data);
                const alertData = checkParameterThreshold(data);
                if (alertData.length > 0) {
                    alertData.forEach(alert => {
                        const newAlert = generateAlerts(alert);
                        debouncer(newAlert, 1000);
                    });
                }
            } catch (error) {
                console.error('❌ Error parsing SSE data:', error);
            }
        };

        eventSource.onerror = (err) => {
            console.error('❌ EventSource error:', err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
            console.log('🔌 EventSource closed');
        };
    }, []);

    return null;
};

export default SSEListener;
