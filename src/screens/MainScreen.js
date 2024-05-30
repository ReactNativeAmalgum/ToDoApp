import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodos,
  deleteTodo,
  toggleCompleteTodoAction,
} from '../redux/slices/todoSlice';
import CheckBox from '@react-native-community/checkbox';
import imagePath from '../utensils/imagePath';
import { ThemedButton } from 'react-native-really-awesome-button';
import FilterModal from '../components/components';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const FilterButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.filterButton} onPress={onPress}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

export default function MainScreen({ navigation }) {
  const dispatch = useDispatch(); // Initialize dispatch function from redux
  const [sortOrder, setSortOrder] = useState('id'); // State for sorting order
  const { items, status, error, filter } = useSelector(state => state.todo); // Get items, status, error, and filter from redux state
  const [showFilterModal, setShowFilterModal] = useState(false); // State for filter modal visibility

  useEffect(() => {
    dispatch(fetchTodos()); // Fetch todos when component mounts
  }, [dispatch]); // Run effect when dispatch changes

  const handleToggleComplete = async (itemId, completed) => {
    try {
      await dispatch(
        toggleCompleteTodoAction({ id: itemId, completed: !completed }), // Toggle completion status of todo
      );
      dispatch(fetchTodos()); // Fetch updated todos
    } catch (error) {
      console.error('Error toggling completion status:', error); // Log error if toggling fails
    }
  };

  const handleDeleteItem = itemId => {
    dispatch(deleteTodo(itemId)); // Dispatch delete action for the specified todo
  };

  const handleSort = () => {
    setSortOrder(prevSortOrder => (prevSortOrder === 'id' ? 'recent' : 'id')); // Toggle sort order between 'id' and 'recent'
  };

  const getFilteredItems = () => {
    return items.filter(item => {
      if (filter === 'all') return true; // Show all items if filter is 'all'
      if (filter === 'active') return !item.completed; // Show active items if filter is 'active'
      if (filter === 'done') return item.completed; // Show completed items if filter is 'done'
    });
  };

  const getSortedItems = () => {
    const filteredItems = getFilteredItems(); // Get filtered items
    if (sortOrder === 'id') {
      return filteredItems.sort((a, b) => a.id - b.id); // Sort by id
    } else {
      return filteredItems.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt), // Sort by creation date
      );
    }
  };

  if (status === 'loading') {
    return (
      <View style={styles.error}>
      <ActivityIndicator size="large" color="#00ff00" />

      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.error}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const totalCount = items.length; // Total count of todos
  const completedTodoCount = items.filter(item => item.completed).length; // Count of completed todos
  const FilterButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Image source={imagePath.filter} style={styles.filterIcon} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
     <View style={{borderWidth:0.5, borderBottomRightRadius:10,borderBottomLeftRadius:10,}}>
     <View style={styles.header}>
     <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
       <Text style={styles.sortButtonText}>
         Sort by {sortOrder === 'id' ? 'Most Recent' : 'ID'}
       </Text>
     </TouchableOpacity>

     <FilterButton onPress={() => setShowFilterModal(true)} />
     <FilterModal
       showFilterModal={showFilterModal}
       setShowFilterModal={setShowFilterModal}
     />
   </View>
   <View
     style={{
       justifyContent: 'space-between',
       flexDirection: 'row',
       marginHorizontal: 20,
     }}>
     <View style={{ borderWidth: 1, borderRadius: 10, marginBottom:10 }}>
       <Text style={styles.total}>Total: {totalCount}</Text>
     </View>
     <View style={{ borderWidth: 1, borderRadius: 10, marginBottom:10 }}>
       <Text style={styles.total}>Completed: {completedTodoCount}</Text>
     </View>
   </View>
     </View>
      <FlatList
        data={getSortedItems()}
        keyExtractor={item => item.id.toString()} // Extract key from item id
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CheckBox
                disabled={false}
                value={item.completed}
                tintColors={'black'}
                style={{ borderColor: 'black', borderBlockColor: 'black' }}
                onValueChange={() =>
                  handleToggleComplete(item.id, item.completed) // Toggle completion status
                }
              />
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => handleDeleteItem(item.id)}>
                <Image
                  source={imagePath.close}
                  style={{ width: 15, height: 15 }}
                />
              </TouchableOpacity>
            </View>
            <Text
              onPress={() =>
                navigation.navigate('AddTodoScreen', { todoId: item.id, items }) 
              }
              style={styles.title}>
              {item.title}
            </Text>
          </View>
        )}
      />
      <View style={styles.addBtn}>
        <ThemedButton
          backgroundColor="white"
          backgroundDarker="grey"
          borderRadius={10}
          textColor="#ffff"
          alignSelf="center"
          name={'rick'}
          borderWidth={1}
          onPress={() => navigation.navigate('AddTodoScreen', { items })}>
          <Text style={{ color: 'black' }}>Add todo</Text>
        </ThemedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error:{
    justifyContent:'center',
    alignItems:'center'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 15,
    width: 250,
    color: 'black',
    flexWrap: 'wrap',
  },
  closeIcon: {
    width: 15,
    alignSelf: 'center',
    height: 15,
    left: 300,
  },
  sortButtonText: {
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  sortButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: 150,
    height: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  total: {
    color: 'black',
    padding: 10,
    marginLeft: 10,
  },
  addBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth:0.5,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    padding: 10,
  },
  newTodoInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  searchContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 1,
    borderRadius: 10,
    width: 150,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontWeight: '600',
    fontSize: 13,
    color: 'black',
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  filterIcon: {
    width: 25,
    height: 25,
  },
  filterOption: {
    fontSize: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  closeModalText: {
    fontSize: 20,
    color: 'black',
    width: 80,
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  filterModal: {
    width: 300, // Adjust width as needed
    height: 220, // Adjust height as needed
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignSelf: 'center', // Center the modal horizontally
    top: 300,
  },
});
