import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const adminsApi = createApi({
  reducerPath: "adminsApi",
  baseQuery,
  tagTypes: ["Admins"],
  endpoints: (builder) => ({
    getAdmins: builder.query({
      query: () => "/admins",
      providesTags: ["Admins"],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),
    getAdmin: builder.query({
      query: (id) => `/admins/${id}`,
      providesTags: (result, error, id) => [{ type: "Admins", id }],
    }),
    createAdmin: builder.mutation({
      query: (admin) => ({
        url: "/admins",
        method: "POST",
        body: admin,
      }),
      invalidatesTags: ["Admins"],
    }),
    updateAdmin: builder.mutation({
      query: ({id, ...admin}) => ({
        url: `/admins/${id}`,
        method: "PUT",
        body: admin,
      }),
      invalidatesTags: ["Admins"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admins"],
    }),
  }),
});

export const { 
  useGetAdminsQuery, 
  useGetAdminQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation
} = adminsApi;
