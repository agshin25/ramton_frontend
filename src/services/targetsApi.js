import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const targetsApi = createApi({
  reducerPath: "targetsApi",
  baseQuery,
  tagTypes: ["Targets"],
  endpoints: (builder) => ({
    // Get all targets
    getTargets: builder.query({
      query: () => '/targets',
      providesTags: ['Targets'],
    }),
    
    // Get single target
    getTarget: builder.query({
      query: (id) => `/targets/${id}`,
      providesTags: (result, error, id) => [{ type: 'Targets', id }],
    }),
    
    // Create target
    createTarget: builder.mutation({
      query: (target) => ({
        url: '/targets',
        method: 'POST',
        body: target,
      }),
      invalidatesTags: ['Targets'],
    }),
    
    // Update target
    updateTarget: builder.mutation({
      query: ({ id, ...target }) => ({
        url: `/targets/${id}`,
        method: 'PUT',
        body: target,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Targets', id }, 'Targets'],
    }),
    
    // Delete target
    deleteTarget: builder.mutation({
      query: (id) => ({
        url: `/targets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Targets'],
    }),
  }),
});

export const {
  useGetTargetsQuery,
  useGetTargetQuery,
  useCreateTargetMutation,
  useUpdateTargetMutation,
  useDeleteTargetMutation,
} = targetsApi;
