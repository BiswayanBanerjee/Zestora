import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customer: null,             // logged-in user object
  customerData: null,         // full customer profile (with cart, orders, etc.)
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
      state.customerData = null;
    },

    setCustomerData: (state, action) => {
      state.customerData = action.payload;   // set full customer data
    },

    updateCartSuccess: (state, action) => {
      if (!state.customerData) return;

      state.customerData.cartItems = action.payload.cartItems;
    },
  },
});

export const { 
  setCustomer, 
  clearCustomer, 
  setCustomerData, 
  updateCartSuccess 
} = customerSlice.actions;

export default customerSlice.reducer;
