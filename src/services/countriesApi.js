import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery,
  tagTypes: ["Countries"],
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => "/countries",
      providesTags: ["Countries"],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),
    getCountry: builder.query({
      query: (id) => `/countries/${id}`,
      providesTags: (result, error, id) => [{ type: "Countries", id }],
    }),
    createCountry: builder.mutation({
      query: (country) => ({
        url: "/countries",
        method: "POST",
        body: country,
      }),
      invalidatesTags: ["Countries"],
    }),
    updateCountry: builder.mutation({
      query: ({id, ...country}) => ({
        url: `/countries/${id}`,
        method: "PUT",
        body: country,
      }),
      invalidatesTags: ["Countries"],
    }),
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `/countries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Countries"],
    }),
  }),
});

export const { 
  useGetCountriesQuery, 
  useGetCountryQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation
} = countriesApi;
