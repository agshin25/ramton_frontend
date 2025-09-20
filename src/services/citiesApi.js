import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const citiesApi = createApi({
  reducerPath: "citiesApi",
  baseQuery,
  tagTypes: ["Cities"],
  endpoints: (builder) => ({
    getCities: builder.query({
      query: () => "/cities",
      providesTags: ["Cities"],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),
    getCity: builder.query({
      query: (id) => `/cities/${id}`,
      providesTags: (result, error, id) => [{ type: "Cities", id }],
    }),
    createCity: builder.mutation({
      query: (city) => ({
        url: "/cities",
        method: "POST",
        body: city,
      }),
      invalidatesTags: ["Cities"],
    }),
    updateCity: builder.mutation({
      query: ({id, ...city}) => ({
        url: `/cities/${id}`,
        method: "PUT",
        body: city,
      }),
      invalidatesTags: ["Cities"],
    }),
    deleteCity: builder.mutation({
      query: (id) => ({
        url: `/cities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cities"],
    }),
  }),
});

export const { 
  useGetCitiesQuery, 
  useGetCityQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation
} = citiesApi;

