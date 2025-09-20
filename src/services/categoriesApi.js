import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";


export const categoriesApi = createApi({
    reducerPath: "categoriesApi",
    baseQuery,
    tagTypes: ["Categories"],
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => "/categories",
            providesTags: ["Categories"],
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }),
        createCategory: builder.mutation({
            query: (category) => ({
                url: "/categories",
                method: "POST",
                body: category,
            }),
            invalidatesTags: ["Categories"],
        }),
        updateCategory: builder.mutation({
            query: ({id, ...category}) => ({
                url: `/categories/${id}`,
                method: "PUT",
                body: category,
            }),
            invalidatesTags: ["Categories"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Categories"],
        }),
    }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } = categoriesApi;