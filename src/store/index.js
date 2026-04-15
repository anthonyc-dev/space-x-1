import { configureStore } from '@reduxjs/toolkit';
import launchesReducer from './launchesSlice';

export const store = configureStore({
  reducer: {
    launches: launchesReducer
  }
});