import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery,
  tagTypes: ["Roles"],
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => "/roles",
      providesTags: ["Roles"],
    }),
    createRole: builder.mutation({
      query: (role) => ({
        url: "/roles",
        method: "POST",
        body: role,
        invalidatesTags: ["Roles"],
      }),
    }),
    updateRole: builder.mutation({
      query: ({id, ...role}) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: role,
        invalidatesTags: ["Roles"],
      }),
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
        invalidatesTags: ["Roles"],
      }),
    }),
  }),
});

export const { useGetRolesQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRoleMutation } = rolesApi;
