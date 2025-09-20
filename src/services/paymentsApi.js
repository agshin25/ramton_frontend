import { baseQuery } from './baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery,
  tagTypes: ["CourierPayments"],
  endpoints: (builder) => ({
    getCourierPayments: builder.query({
      query: () => 'couriers/payments',
      providesTags: ['CourierPayments'],
    }),
    
    // Pay money TO courier (billing_type: 'payment')
    payCourierForOrder: builder.mutation({
      query: ({ courierId, paymentData }) => ({
        url: `couriers/${courierId}/payments`,
        method: 'POST',
        body: {
          ...paymentData,
          billing_type: 'payment'
        },
      }),
      invalidatesTags: ['CourierPayments', 'Couriers'],
    }),
    
    collectFromCourier: builder.mutation({
      query: ({ courierId, paymentData }) => ({
        url: `couriers/${courierId}/payments/revert`,
        method: 'POST',
        body: {
          ...paymentData,
          billing_type: 'revert'
        },
      }),
      invalidatesTags: ['CourierPayments', 'Couriers'],
    }),
    
    // Delete payment
    deletePayment: builder.mutation({
      query: ({ paymentId }) => ({
        url: `couriers/payments/${paymentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CourierPayments', 'Couriers'],
    }),
  }),
});

export const {
  useGetCourierPaymentsQuery,
  usePayCourierForOrderMutation,
  useCollectFromCourierMutation,
  useDeletePaymentMutation,
} = paymentsApi;
