
import { configureStore } from '@reduxjs/toolkit';
import { todoSlice } from '../slices/todoSlice'; 

  // Store configuration inline
const store = configureStore({
  reducer: {
    todo: todoSlice.reducer,
  },
});

export default store;
