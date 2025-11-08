import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const RESTAURANT = import.meta.env.VITE_RESTAURANT_API_BASE_URL;

export const dishApi = createApi({
  reducerPath: "dishApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${RESTAURANT}/restaurants` }),
  endpoints: (builder) => ({
    getDishes: builder.query({
      query: () => "/dishes",
    }),
    getDishById: builder.query({
      query: (id) => `/dishes/${id}`,
    }),
    addDish: builder.mutation({
      query: (newDish) => ({
        url: "/dishes",
        method: "POST",
        body: newDish,
      }),
    }),
  }),
});

// ✅ Export auto-generated hooks
export const {
  useGetDishesQuery,
  useGetDishByIdQuery,
  useAddDishMutation,
} = dishApi;
