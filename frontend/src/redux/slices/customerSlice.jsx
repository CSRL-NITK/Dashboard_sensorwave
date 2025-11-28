import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
    name: "customer",
    initialState: {
        all_customers: {},
    },
    reducers: {
        set_all_customers: (state, action) => {
            state.all_customers = action.payload;
        },
        add_customer: (state, action) => {
            state.all_customers.push(action.payload);
        },
        get_all_customers: (state) => {
            return state.all_customers;
        }
    },
});
export const { set_all_customers, add_customer, get_all_customers } = customerSlice.actions;
export default customerSlice.reducer;