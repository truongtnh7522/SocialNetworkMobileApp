import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import Modal from 'react-native-modal';

const CommentScreen = ({ comment, onDelete, onEdit }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleEdit = () => {
    onEdit(editedComment);
    toggleModal();
  };

  return (
    <View style={styles.commentContainer}>
      <Image source={{ uri: comment.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <Text style={styles.username}>{comment.username}</Text>
        <Text>{comment.content}</Text>
      </View>
      <TouchableOpacity onPress={toggleModal}>
        <Text>...</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleEdit}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(comment.id)}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default CommentScreen;
