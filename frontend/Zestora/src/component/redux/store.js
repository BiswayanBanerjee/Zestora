import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import customerReducer from "./slices/customerSlice";  // ✅ new

import { dishApi } from "./services/dishApi";
import { customerApi } from "./services/customerApi";
import { restaurantApi } from "./services/restaurantApi";
import { authApi } from "./services/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,  // ✅ new slice

    [dishApi.reducerPath]: dishApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [restaurantApi.reducerPath]: restaurantApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(dishApi.middleware)
      .concat(customerApi.middleware)
      .concat(restaurantApi.middleware)
      .concat(authApi.middleware),
});
