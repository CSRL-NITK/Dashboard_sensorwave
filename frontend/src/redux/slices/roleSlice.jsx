// rolesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const rolesSlice = createSlice({
    name: 'roles',
    initialState: [],
    reducers: {
        setRoles: (state, action) => action.payload,
        clearRoles: () => []
    }
});

export const { setRoles, clearRoles } = rolesSlice.actions;
export default rolesSlice.reducer;
