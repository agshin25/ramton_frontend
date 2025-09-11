import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const customersApi = createApi({
  reducerPath: "customersApi",
  tagTypes: ["Customers"],
  baseQuery,
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => "/customers",
      providesTags: ["Customers"],
    }),
    createCustomer: builder.mutation({
      query: (customer) => ({
        url: "/customers",
        method: "POST",
        body: customer,
        invalidatesTags: ["Customers"],
      }),
    }),
    updateCustomer: builder.mutation({
      query: ({id, ...customer}) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: customer,
        invalidatesTags: ["Customers"],
      }),
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
        invalidatesTags: ["Customers"],
      }),
    }),
  }),
});

export const { useGetCustomersQuery, useCreateCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation } = customersApi;
