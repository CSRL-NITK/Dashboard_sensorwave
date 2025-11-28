import { createSlice } from '@reduxjs/toolkit';

const lightColors = {
  LeftBar: {
    backgroundColor: '#daf0f9',
    color: '#000',
  },
  TopBar: {
    backgroundColor: 'skyblue',
    searchBar: '#f0f0f0',
    color: '#000',
  },
  LiveSensors: {
    sensorHead: '#eee',
    th: '#007bff',
    even: '#f2f2f2',
  },
  Headers: {
    color: '#000'
  },
  Alerts: {
    background: '#fff',
    tableHead: '#007bff',
    evenRow: '#f9f9f9',
    oddRow: '#fff',
    filterPanel: '#f5f5f5',
    filterOptionHover: '#e0e0e0',
    filterOptionActive: '#2196f3',
    border: '#ddd',
    text: '#000',
    noAlertsText: '#666'
  },
  Devices: {
    background: '#fff',
    headerBackground: '#f5f5f5',
    cardBackground: '#fff',
    cardHeaderBackground: '#f8f9fa',
    cardFooterBackground: '#f8f9fa',
    text: '#333',
    secondaryText: '#666',
    border: '#eee',
    tableHeaderBackground: '#f5f5f5',
    tableRowBorder: '#eee'
  },
  Reports: {
    background: '#fff',
    tableHead: '#007bff',
    evenRow: '#f9f9f9',
    oddRow: '#fff',
    color: '#000'
  }
};

const darkColors = {
  LeftBar: {
    backgroundColor: '#333',
    color: '#ddd',
  },
  TopBar: {
    backgroundColor: '#444',
    searchBar: '#333',
    color: '#ddd',
  },
  LiveSensors: {
    background: '#666',
    sensorHead: '#444',
    th: '#025252',
    even: '#999',
  },
  Headers: {
    color: '#eee'
  },
  Alerts: {
    background: '#333',
    tableHead: '#025252',
    evenRow: '#444',
    oddRow: '#555',
    filterPanel: '#444',
    filterOptionHover: '#555',
    filterOptionActive: '#025252',
    border: '#555',
    text: '#eee',
    noAlertsText: '#ccc'
  },
  Devices: {
    background: '#333',
    headerBackground: '#444',
    cardBackground: '#444',
    cardHeaderBackground: '#555',
    cardFooterBackground: '#555',
    text: '#eee',
    secondaryText: '#ccc',
    border: '#555',
    tableHeaderBackground: '#555',
    tableRowBorder: '#666'
  },
  Reports: {
    background: '#333',
    tableHead: '#025252',
    evenRow: '#444',
    oddRow: '#555',
    color: '#000'
  }
};

const initialState = {
  theme: 'light',
  colors: lightColors,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.theme === 'light') {
        state.theme = 'dark';
        state.colors = darkColors;
      } else {
        state.theme = 'light';
        state.colors = lightColors;
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
