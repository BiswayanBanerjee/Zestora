// src/redux/slices/customerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customer: null,   // stores logged-in customer details
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    clearCustomer: (state) => {
      state.customer = null;
    },
  },
});

export const { setCustomer, clearCustomer } = customerSlice.actions;
export default customerSlice.reducer;
