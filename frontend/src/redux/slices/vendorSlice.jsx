import { createSlice } from "@reduxjs/toolkit";

const vendorSlice = createSlice({
    name: "vendor",
    initialState: {
        all_vendors: {},
    },
    reducers: {
        set_all_vendors: (state, action) => {
            state.all_vendors = action.payload;
        },
        add_vendor: (state, action) => {
            state.all_vendors.push(action.payload);
        },
        get_all_vendors: (state) => {
            return state.all_vendors;
        }
    },
});
export const { set_all_vendors, add_vendor, get_all_vendors } = vendorSlice.actions;
export default vendorSlice.reducer;