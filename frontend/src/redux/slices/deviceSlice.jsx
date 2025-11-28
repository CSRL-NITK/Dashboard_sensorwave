import { createSlice } from "@reduxjs/toolkit";

const deviceSlice = createSlice({
    name: "device",
    initialState: {
        lastRecentlyDevice: null,

    },
    reducers: {
        setLastRecentlyDevice: (state, action) => {
            state.lastRecentlyDevice = action.payload;
        },
    },
});
export const { setLastRecentlyDevice } = deviceSlice.actions;
export default deviceSlice.reducer;