import React from 'react';
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
} from 'react-native';
import {useDispatch} from 'react-redux';
import {setFilter} from '../redux/slices/todoSlice';
const FilterModal = ({showFilterModal, setShowFilterModal}) => {
  const dispatch = useDispatch();
  return (
    <Modal
      style={styles.ModalContainer}
      transparent={true}
      presentationStyle="overFullScreen"
      visible={showFilterModal}
      animationType="slide">
      <View style={styles.filterModal}>
        <TouchableOpacity onPress={() => dispatch(setFilter('all'))}>
          <Text style={styles.filterOption}>Filter todo by all</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(setFilter('active'))}>
          <Text style={styles.filterOption}>Filter todo by active</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(setFilter('done'))}>
          <Text style={styles.filterOption}>Filter todo by done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{}} onPress={() => setShowFilterModal(false)}>
          <Text style={styles.closeModalText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
export default FilterModal;

const styles = StyleSheet.create({
  closeModalText: {
    fontSize: 20,
    color: 'black',
    top:10,
    width: 80,
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    // justifyContent:'center'
  },
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModal: {
    width: 300,
    height: 220,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignSelf: 'center',
    top: 300,
  },
  filterOption:{
    color:'black',
    padding:10,
    borderBottomWidth:1
  }
});
