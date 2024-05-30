import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../utensils/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';

// Thunk action to fetch todos from Firestore
export const fetchTodos = createAsyncThunk('todo/fetchTodos', async () => {
  // Fetch todos from Firestore collection
  const querySnapshot = await getDocs(collection(db, 'todo'));
  let todos = [];
  // Map todos from Firestore documents
  querySnapshot.forEach(doc => {
    todos.push({ id: doc.id, ...doc.data() });
  });
  return todos;
});

// Thunk action to delete a todo from Firestore
export const deleteTodo = createAsyncThunk('todo/deleteTodo', async (todoId, { rejectWithValue }) => {
  try {
    // Delete todo document from Firestore
    const docRef = doc(db, 'todo', todoId.toString());
    await deleteDoc(docRef);
    return todoId;
  } catch (error) {
    // Handle error if deletion fails
    console.error('Failed to delete todo:', error);
    return rejectWithValue(error.message);
  }
});

// Thunk action to toggle completion status of a todo in Firestore
export const toggleCompleteTodoAction = createAsyncThunk(
  'todo/toggleCompleteTodo',
  async ({ id, completed }, { rejectWithValue }) => {
    const todoRef = doc(db, 'todo', id.toString());
    const updatedAt = new Date().toISOString(); // Convert to ISO string
    // Update todo document with new completion status and updatedAt timestamp
    await updateDoc(todoRef, { completed, updatedAt });
    // Return updated todo details
    return { id, completed: !completed, updatedAt };
  }
);

// Thunk action to add a new todo to Firestore
export const addTodo = createAsyncThunk('todo/addTodo', async ({ id, title, completed }, { rejectWithValue }) => {
  try {
    // Add the new todo to Firestore collection
    const docRef = await addDoc(collection(db, 'todo'), {
      id,
      title,
      completed,
      createdAt: new Date().toISOString(),
    });
    // Return the added todo details
    return { id: docRef.id, title, completed, createdAt: new Date().toISOString() };
  } catch (error) {
    // Handle error if adding todo fails
    console.error('Failed to add todo:', error);
    return rejectWithValue(error.message);
  }
});

// Thunk action to update a todo in Firestore
export const updateTodo = createAsyncThunk('todo/updateTodo', async ({ id, title }) => {
  try {
    // Update todo document with new title and updatedAt timestamp
    const todoRef = doc(db, 'todo', id.toString());
    const updatedAt = new Date().toISOString();
    await updateDoc(todoRef, { title, updatedAt });
    // Return updated todo details
    return { id, title, updatedAt };
  } catch (error) {
    // Handle error if updating todo fails
    console.error('Failed to update todo:', error);
    throw error;
  }
});

// Redux slice for managing todo state
export const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    items: [], // Array to hold todos
    status: 'idle', // Status indicator for async operations
    error: null, // Error message if any
    filter: 'all', // Filter for displaying todos
  },
  reducers: {
    // Reducer to set filter for displaying todos
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Reducer for handling pending state of fetchTodos thunk
      .addCase(fetchTodos.pending, state => {
        state.status = 'loading';
      })
      // Reducer for handling successful completion of fetchTodos thunk
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      // Reducer for handling failure of fetchTodos thunk
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Reducer for handling pending state of deleteTodo thunk
      .addCase(deleteTodo.pending, state => {
        state.status = 'loading';
      })
      // Reducer for handling successful completion of deleteTodo thunk
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      // Reducer for handling failure of deleteTodo thunk
      .addCase(deleteTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Reducer for handling successful completion of toggleCompleteTodoAction thunk
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
      // Reducer for handling successful completion of updateTodo thunk
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, title, updatedAt } = action.payload;
        const todoToUpdate = state.items.find(todo => todo.id === id);
        if (todoToUpdate) {
          todoToUpdate.title = title;
          todoToUpdate.updatedAt = updatedAt;
        }
      })
      // Reducer for handling failure of updateTodo thunk
      .addCase(updateTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Reducer for handling failure of toggleCompleteTodoAction thunk
      .addCase(toggleCompleteTodoAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions
export const { setFilter } = todoSlice.actions;
export default todoSlice.reducer;
