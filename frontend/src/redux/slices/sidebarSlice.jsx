import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    collapsed: true,
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.collapsed = !state.collapsed;
        },
        setSidebarState: (state, action) => {
            state.collapsed = action.payload;
        },
    },
});

export const { toggleSidebar, setSidebarState } = sidebarSlice.actions;

export default sidebarSlice.reducer;
