// src/redux/services/customerApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CUSTOMER = `${import.meta.env.VITE_CUSTOMER_API_BASE_URL}/api`;

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CUSTOMER}/customers`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 🔹 Base CRUD
    getCustomers: builder.query({
      query: () => ``,
    }),
    getCustomerById: builder.query({
      query: (id) => `/${id}`,
    }),
    addCustomer: builder.mutation({
      query: (customer) => ({
        url: ``,
        method: "POST",
        body: customer,
      }),
    }),
    updateCustomer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),

    // 🔹 Orders
    getOrders: builder.query({
      query: (id) => `/${id}/orders`,
    }),
    addOrder: builder.mutation({
      query: ({ id, order }) => ({
        url: `/${id}/orders`,
        method: "PATCH",
        body: order,
      }),
    }),

    // 🔹 Favourites
    getFavourites: builder.query({
      query: (id) => `/${id}/favourites`,
    }),
    updateFavourites: builder.mutation({
      query: ({ id, favourites }) => ({
        url: `/${id}/favourites`,
        method: "PATCH",
        body: favourites,
      }),
    }),

    // 🔹 Cart
    getCart: builder.query({
      query: (id) => `/${id}/cart`,
    }),
    updateCart: builder.mutation({
      query: ({ id, cart }) => ({
        url: `/${id}/cart`,
        method: "PATCH",
        body: cart,
      }),
    }),

    // 🔹 Ratings
    getRating: builder.query({
      query: (id) => `/${id}/rating`,
    }),
    updateRating: builder.mutation({
      query: ({ id, rating }) => ({
        url: `/${id}/rating`,
        method: "PATCH",
        body: rating,
      }),
    }),

    // 🏠 🔹 Address Management (NEW)
    addAddress: builder.mutation({
      query: ({ id, address }) => ({
        url: `/${id}/address`,
        method: "PATCH",
        body: address,
      }),
    }),
    updateAddress: builder.mutation({
      query: ({ id, addressId, address }) => ({
        url: `/${id}/address/${addressId}`,
        method: "PATCH",
        body: address,
      }),
    }),
    deleteAddress: builder.mutation({
      query: ({ id, index }) => ({
        url: `/${id}/address/${index}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetOrdersQuery,
  useAddOrderMutation,
  useGetFavouritesQuery,
  useUpdateFavouritesMutation,
  useGetCartQuery,
  useUpdateCartMutation,
  useGetRatingQuery,
  useUpdateRatingMutation,
  // 🏠 Address
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = customerApi;
