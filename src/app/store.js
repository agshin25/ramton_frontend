import { configureStore } from '@reduxjs/toolkit';
import { ordersApi } from '../services/ordersApi';
import { customersApi } from '../services/customersApi';
import { productsApi } from '../services/productsApi';
import { zonesApi } from '../services/zonesApi';
import { adminsApi } from '../services/adminsApi';
import { rolesApi } from '../services/rolesApi';
import { categoriesApi } from '../services/categoriesApi';





export const store = configureStore({
  reducer: {
    [ordersApi.reducerPath]: ordersApi.reducer,
    [customersApi.reducerPath]: customersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [zonesApi.reducerPath]: zonesApi.reducer,
    [adminsApi.reducerPath]: adminsApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ordersApi.middleware, customersApi.middleware, productsApi.middleware, zonesApi.middleware, adminsApi.middleware, rolesApi.middleware, categoriesApi.middleware),
});
