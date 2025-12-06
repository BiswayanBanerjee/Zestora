// src/redux/services/restaurantApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const RESTAURANT = `${import.meta.env.VITE_RESTAURANT_API_BASE_URL}/api`;

export const restaurantApi = createApi({
  reducerPath: "restaurantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${RESTAURANT}/restaurants`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 🔹 GET all restaurants
    getRestaurants: builder.query({
      query: () => ``,
    }),

    // 🔹 GET single restaurant by ID
    getRestaurantById: builder.query({
      query: (id) => `/${id}`,
    }),

    // 🔹 DELETE restaurant by ID
    deleteRestaurant: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),

    // 🔹 PATCH restaurant approval
    toggleApproval: builder.mutation({
      query: ({ id, isApproved }) => ({
        url: `/${id}/approval?isApproved=${isApproved}`,
        method: "PATCH",
      }),
    }),

    // 🔹 PATCH restaurant availability
    toggleAvailability: builder.mutation({
      query: ({ id, isAvailable }) => ({
        url: `/${id}/availability?isAvailable=${isAvailable}`,
        method: "PATCH",
      }),
    }),

    // 🔹 GET statuses for multiple restaurants
    fetchStatuses: builder.query({
      query: (ids) => `/statuses?ids=${ids.join(",")}`,
    }),

    // ----------------- 🍽 Dish management -----------------
    // 🔹 ADD dish to a restaurant
    addDish: builder.mutation({
      query: ({ restaurantId, dish }) => ({
        url: `/${restaurantId}/dishes`,
        method: "POST",
        body: dish,
      }),
    }),

    // 🔹 DELETE dish from a restaurant
    deleteDish: builder.mutation({
      query: ({ restaurantId, dishId }) => ({
        url: `/${restaurantId}/dishes/${dishId}`,
        method: "DELETE",
      }),
    }),

    // 🔹 UPDATE dish of a restaurant
    updateDish: builder.mutation({
      query: ({ restaurantId, dishId, data }) => ({
        url: `/${restaurantId}/dishes/${dishId}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useDeleteRestaurantMutation,
  useToggleApprovalMutation,
  useToggleAvailabilityMutation,
  useFetchStatusesQuery,

  // dish hooks
  useAddDishMutation,
  useDeleteDishMutation,
  useUpdateDishMutation,
} = restaurantApi;
