// store.js

import { configureStore } from '@reduxjs/toolkit';
import { todoSlice } from '../slices/todoSlice'; 

const store = configureStore({
  reducer: {
    todo: todoSlice.reducer,
  },
});

export default store;
