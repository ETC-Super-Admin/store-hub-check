// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/redux/features/counter/counterSlice';
import countdownReducer from '@/redux/features/countdown/countdownSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      countdown: countdownReducer,
    },
  });
};

// Export the store instance
export const store = makeStore(); // Ensure the store is created only once

// Infer the type of makeStore
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];