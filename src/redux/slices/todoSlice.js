

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../utensils/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';

export const fetchTodos = createAsyncThunk('todo/fetchTodos', async () => {
  const querySnapshot = await getDocs(collection(db, 'todo'));
  let todos = [];
  querySnapshot.forEach(doc => {
    todos.push({ id: doc.id, ...doc.data() });
  });
  return todos;
});

export const deleteTodo = createAsyncThunk('todo/deleteTodo', async (todoId, { rejectWithValue }) => {
  try {
    const docRef = doc(db, 'todo', todoId.toString());
    await deleteDoc(docRef);
    return todoId;
  } catch (error) {
    console.error('Failed to delete todo:', error);
    return rejectWithValue(error.message);
  }
});

export const toggleCompleteTodoAction = createAsyncThunk(
  'todo/toggleCompleteTodo',
  async ({ id, completed }, { rejectWithValue }) => {
    const todoRef = doc(db, 'todo', id.toString());
    const updatedAt = new Date().toISOString(); // Convert to ISO string
    await updateDoc(todoRef, { completed, updatedAt });
    return { id, completed: !completed, updatedAt }; // Include updatedAt in the returned value
  }
);
export const addTodo = createAsyncThunk('todo/addTodo', async ({ id, title, completed }, { rejectWithValue }) => {
  try {
    // Add the new todo to Firestore
    const docRef = await addDoc(collection(db, 'todo'), {
      id,
      title,
      completed,
      createdAt: new Date().toISOString(),
    });
    // Return the todo ID
    return { id: docRef.id, title, completed, createdAt: new Date().toISOString() };
  } catch (error) {
    // Handle error
    console.error('Failed to add todo:', error);
    return rejectWithValue(error.message);
  }
});

export const updateTodo = createAsyncThunk('todo/updateTodo', async ({ id, title }) => {
  try {
    const todoRef = doc(db, 'todo', id.toString());
    const updatedAt = new Date().toISOString();
    await updateDoc(todoRef, { title, updatedAt });
    return { id, title, updatedAt };
  } catch (error) {
    console.error('Failed to update todo:', error);
    throw error;
  }
});

export const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    filter: 'all',
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteTodo.pending, state => {
        state.status = 'loading';
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(toggleCompleteTodoAction.fulfilled, (state, action) => {
        const { id, completed, updatedAt } = action.payload;
        const todoIndex = state.items.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
          state.items[todoIndex] = {
            ...state.items[todoIndex],
            completed,
            updatedAt: updatedAt.toString(), // Ensure updatedAt is stored in ISO format
          };
        }
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, title, updatedAt } = action.payload;
        const todoToUpdate = state.items.find(todo => todo.id === id);
        if (todoToUpdate) {
          todoToUpdate.title = title;
          todoToUpdate.updatedAt = updatedAt;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(toggleCompleteTodoAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
  },
});

export const { setFilter } = todoSlice.actions;
export default todoSlice.reducer;
