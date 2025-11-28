import React, { useState, useEffect } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Reports = () => {
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        level: '',
        startDate: '',
        endDate: ''
    });
    const [downloadFormat, setDownloadFormat] = useState('json');

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const queryParams = {
                ...filters
            };
            const token = sessionStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get('http://localhost:8000/api/logs/getLogs', {
                params: queryParams,
                headers: headers
            });
            console.log(response.data);
            setLogs(response.data.rows || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
        setLoading(false);
    };

    const handleDownload = async () => {
        if (!['json', 'csv', 'xml', 'txt'].includes(downloadFormat)) {
            console.error('Invalid download format selected');
            return;
        }

        try {
            let content = '';
            let mimeType = '';

            if (downloadFormat === 'json') {
                content = JSON.stringify(logs, null, 2);
                mimeType = 'application/json';
            } else if (downloadFormat === 'csv') {
                const headers = Object.keys(logs[0] || {}).join(',');
                const rows = logs.map(log => Object.values(log).join(',')).join('\n');
                content = `${headers}\n${rows}`;
                mimeType = 'text/csv';
            } else if (downloadFormat === 'xml') {
                content = `<logs>\n` + logs.map(log => {
                    return `  <log>\n` + Object.entries(log).map(([key, value]) => `    <${key}>${value}</${key}>`).join('\n') + `\n  </log>`;
                }).join('\n') + `\n</logs>`;
                mimeType = 'application/xml';
            } else if (downloadFormat === 'txt') {
                content = logs.map(log => JSON.stringify(log)).join('\n');
                mimeType = 'text/plain';
            }

            const blob = new Blob([content], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `logs.${downloadFormat}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error preparing download:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filters]);

    return (
        <div className={`h-screen flex flex-col p-4 overflow-auto scrollbar-hide ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-xl font-bold font-['Oswald']">System Logs</h1>
                <div className="flex space-x-2">
                    <div className="relative inline-block">
                        <select
                            className={`px-2 py-1 pr-8 text-sm border rounded appearance-none ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            value={downloadFormat}
                            onChange={(e) => setDownloadFormat(e.target.value)}
                        >
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                            <option value="xml">XML</option>
                            <option value="txt">TXT</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                    <button
                        onClick={handleDownload}
                        className={`flex items-center px-3 py-1 text-sm rounded ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                    </button>
                    <button
                        onClick={fetchLogs}
                        className={`flex items-center px-3 py-1 text-sm rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' : 'bg-white hover:bg-gray-100 border border-gray-300'}`}
                    >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                <div className="relative">
                    <select
                        name="level"
                        value={filters.level}
                        onChange={handleFilterChange}
                        className={`p-2 pr-8 text-sm border rounded appearance-none ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                        <option value="">All Levels</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>

                <div className="relative">
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className={`p-2 text-sm border rounded ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                </div>

                <div className="relative">
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className={`p-2 text-sm border rounded ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                </div>
            </div>

            <div className={`flex-1 rounded border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="h-full flex flex-col">
                    <div className="overflow-auto scrollbar-hide" style={{ height: "calc(100vh - 200px)" }}>
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead className={`sticky top-0 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <tr>
                                    <th scope="col" className={`px-4 py-2 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider w-16`}>#</th>
                                    <th scope="col" className={`px-4 py-2 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider w-48`}>Timestamp</th>
                                    <th scope="col" className={`px-4 py-2 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider w-24`}>Level</th>
                                    <th scope="col" className={`px-4 py-2 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Message</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {logs.length > 0 ? (
                                    logs.map((log) => (
                                        <tr key={log.id} className={log.id % 2 === 0 ? (isDark ? 'bg-gray-800' : 'bg-gray-50') : ''}>
                                            <td className="px-4 py-2 text-sm whitespace-nowrap">{log.id}</td>
                                            <td className="px-4 py-2 text-sm whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                                            <td className="px-4 py-2 text-sm whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${log.level === 'error' ? 'bg-red-100 text-red-800' :
                                                    log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {log.level}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-sm truncate">{log.message}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-4 text-center text-sm">
                                            {loading ? 'Loading...' : 'No logs found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;