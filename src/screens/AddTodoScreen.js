import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, updateTodo } from '../redux/slices/todoSlice';
import { ThemedButton } from 'react-native-really-awesome-button';

export default function AddTodoScreen({ navigation, route }) {
  const { todoId } = route.params; // Extract todoId from route params
  const dispatch = useDispatch(); 
  const [newTodo, setNewTodo] = useState(''); // State for new todo title
  const [error, setError] = useState(''); 
  const { items } = useSelector(state => state.todo); // Get items from redux state

  useEffect(() => {
    if (todoId) {
      const todoToUpdate = items.find(todo => todo.id === todoId); // Find the todo to update
      if (todoToUpdate) {
        setNewTodo(todoToUpdate.title); // Set the title of the todo to update
      }
    }
  }, [todoId, items]); // Run effect when todoId or items change

  const handleAddOrUpdateTodo = () => {
    if (newTodo.trim()) {
      setError(''); // Clear error message if input is valid
      if (todoId) {
        dispatch(updateTodo({ id: todoId, title: newTodo })); // Dispatch update action
      } else {
        const newTodoId = new Date().getTime().toString(); // Generate new todo ID
        dispatch(addTodo({ id: newTodoId, title: newTodo, completed: false })); // Dispatch add action
      }
      navigation.goBack(); 
    } else {
      setError('Todo title cannot be empty'); // Set error message if input is empty
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {todoId ? 'Update Todo' : 'Add New Todo'} {/* Dynamic title based on action */}
      </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={'black'}
        placeholder="Enter Todo Title"
        value={newTodo}
        onChangeText={text => {
          setNewTodo(text);
          if (text.trim()) {
            setError(''); // Clear error message when the user starts typing
          }
        }}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={{ alignItems: 'center' }}>
        <ThemedButton
          progress
          backgroundColor="white"
          backgroundDarker="grey"
          borderRadius={10}
          textColor="#ffff"
          alignSelf="center"
          name={'rick'}
          borderWidth={1}
          title={todoId ? 'Update Todo' : 'Add Todo'}
          onPress={handleAddOrUpdateTodo}>
          <Text style={{ color: 'black' }}>{todoId ? 'Update' : 'Add'}</Text> 
        </ThemedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    color: 'black',
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
