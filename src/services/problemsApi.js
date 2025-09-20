import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const problemsApi = createApi({
  reducerPath: "problemsApi",
  baseQuery,
  tagTypes: ["Problems"],
  endpoints: (builder) => ({
    getProblems: builder.query({
      query: () => "/problems",
      providesTags: ["Problems"],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),
    getProblem: builder.query({
      query: (id) => `/problems/${id}`,
      providesTags: (result, error, id) => [{ type: "Problems", id }],
    }),
    createProblem: builder.mutation({
      query: (problem) => ({
        url: "/problems",
        method: "POST",
        body: problem,
      }),
      invalidatesTags: ["Problems"],
    }),
    updateProblem: builder.mutation({
      query: ({id, ...problem}) => ({
        url: `/problems/${id}`,
        method: "PUT",
        body: problem,
      }),
      invalidatesTags: ["Problems"],
    }),
    deleteProblem: builder.mutation({
      query: (id) => ({
        url: `/problems/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Problems"],
    }),
    getDepartments: builder.query({
      query: () => "/departments",
      providesTags: ["Departments"],
    }),
  }),
});

export const { 
  useGetProblemsQuery, 
  useGetProblemQuery,
  useCreateProblemMutation, 
  useUpdateProblemMutation, 
  useDeleteProblemMutation,
  useGetDepartmentsQuery
} = problemsApi; 