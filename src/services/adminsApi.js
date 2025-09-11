import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const adminsApi = createApi({
  reducerPath: "adminsApi",
  baseQuery,
  endpoints: (builder) => ({
    getAdmins: builder.query({
      query: () => "/admins",
    }),
  }),
});

export const { useGetAdminsQuery } = adminsApi;
