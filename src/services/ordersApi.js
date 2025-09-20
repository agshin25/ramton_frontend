import { createApi} from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";


export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery,
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Orders", id })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Orders", id: "LIST" },
        { type: "Orders", id: result?.data?.id }
      ],
      // Optimistic update for better UX
      async onQueryStarted(order, { dispatch, queryFulfilled }) {
        try {
          const { data: newOrder } = await queryFulfilled;
          dispatch(
            ordersApi.util.updateQueryData('getOrders', undefined, (draft) => {
              if (draft?.data) {
                draft.data.unshift(newOrder.data);
              }
            })
          );
        } catch {
          // Error handling is done in the component
        }
      },
    }),
    updateOrder: builder.mutation({
      query: ({id, ...order}) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body: order,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Orders", id: "LIST" },
        { type: "Orders", id }
      ],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Orders", id: "LIST" },
        { type: "Orders", id }
      ],
    }),
    completeOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Orders", id: "LIST" },
        { type: "Orders", id }
      ],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Orders", id: "LIST" },
        { type: "Orders", id }
      ],
      // Optimistic update for better UX
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          ordersApi.util.updateQueryData('getOrders', undefined, (draft) => {
            if (draft?.data) {
              draft.data = draft.data.filter(order => order.id !== id);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useCancelOrderMutation,
  useCompleteOrderMutation,
} = ordersApi;


