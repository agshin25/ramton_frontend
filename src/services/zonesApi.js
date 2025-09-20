import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const zonesApi = createApi({
  reducerPath: "zonesApi",
  baseQuery,
  tagTypes: ["Zones"],
  endpoints: (builder) => ({
    getZones: builder.query({
      query: () => "/zones",
      providesTags: ["Zones"],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),
    createZone: builder.mutation({
      query: (zone) => ({
        url: "/zones",
        method: "POST",
        body: zone,
      }),
      invalidatesTags: ["Zones"],
    }),
    updateZone: builder.mutation({
      query: ({id, ...zone}) => ({
        url: `/zones/${id}`,
        method: "PUT",
        body: zone,
      }),
      invalidatesTags: ["Zones"],
    }),
    deleteZone: builder.mutation({
      query: (id) => ({
        url: `/zones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Zones"],
    }),
  }),
});

export const { useGetZonesQuery, useCreateZoneMutation, useUpdateZoneMutation, useDeleteZoneMutation } = zonesApi;
