import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customer: null,
  customerData: { cartItems: [] }, // IMPORTANT!!
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },

    setCustomerData: (state, action) => {
      state.customerData = {
        ...state.customerData,
        ...action.payload, // can contain cartItems
      };
    },

    clearCustomer: (state) => {
      state.customer = null;
      state.customerData = { cartItems: [] };
    },

    updateCartSuccess: (state, action) => {
      state.customerData = {
        ...state.customerData,
        cartItems: action.payload.cartItems, // NEW OBJECT 🔥 triggers rerender
      };
    },
  },
});

export const {
  setCustomer,
  clearCustomer,
  setCustomerData,
  updateCartSuccess,
} = customerSlice.actions;

export default customerSlice.reducer;
