import { configureStore } from '@reduxjs/toolkit';
import { ordersApi } from '../services/ordersApi';
import { customersApi } from '../services/customersApi';
import { productsApi } from '../services/productsApi';
import { zonesApi } from '../services/zonesApi';
import { adminsApi } from '../services/adminsApi';
import { rolesApi } from '../services/rolesApi';
import { categoriesApi } from '../services/categoriesApi';
import { taskApi } from '../services/taskApi';
import { problemsApi } from '../services/problemsApi';
import { citiesApi } from '../services/citiesApi';
import { countriesApi } from '../services/countriesApi';
import { targetsApi } from '../services/targetsApi';
import { authApi } from '../services/authApi';
import { paymentsApi } from '../services/paymentsApi';





export const store = configureStore({
  reducer: {
    [ordersApi.reducerPath]: ordersApi.reducer,
    [customersApi.reducerPath]: customersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [zonesApi.reducerPath]: zonesApi.reducer,
    [adminsApi.reducerPath]: adminsApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [problemsApi.reducerPath]: problemsApi.reducer,
    [citiesApi.reducerPath]: citiesApi.reducer,
    [countriesApi.reducerPath]: countriesApi.reducer,
    [targetsApi.reducerPath]: targetsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ordersApi.middleware, 
      customersApi.middleware, 
      productsApi.middleware, 
      zonesApi.middleware, 
      adminsApi.middleware, 
      rolesApi.middleware, 
      categoriesApi.middleware, 
      taskApi.middleware, 
      problemsApi.middleware,
      citiesApi.middleware,
      countriesApi.middleware,
      targetsApi.middleware,
      authApi.middleware,
      paymentsApi.middleware,

    ),
});
