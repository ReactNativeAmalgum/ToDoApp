import RNFS from 'react-native-fs';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const filePath = `${RNFS.DocumentDirectoryPath}/todos.json`;

// Read the JSON file
export const readTodosFromFile = async () => {
  try {
    const fileExists = await RNFS.exists(filePath);
    if (!fileExists) {
      console.error('File does not exist');
      return [];
    }
    const content = await RNFS.readFile(filePath);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading the file', error);
    return [];
  }
};

// Write to the JSON file
export const writeTodosToFile = async (todos) => {
  try {
    const content = JSON.stringify(todos, null, 2);
    await RNFS.writeFile(filePath, content);
  } catch (error) {
    console.error('Error writing to the file', error);
  }
};

// Function to read JSON file and upload its content to Firestore
export const uploadJsonToFirestore = async () => {
  try {
    const todos = await readTodosFromFile();
    for (const todo of todos) {
      const newTodo = {
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
      };
      await addDoc(collection(db, 'todos'), newTodo);
    }
    console.log('Todos uploaded successfully');
  } catch (error) {
    console.error('Error uploading JSON to Firestore', error);
  }
};
