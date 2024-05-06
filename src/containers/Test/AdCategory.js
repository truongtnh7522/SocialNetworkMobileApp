import React from 'react';
import { View, Text, StyleSheet ,TouchableOpacity} from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
const UserCategory = () => {
    const navigation11 = useNavigation();
    const handleNavigate = () => {
       
        navigation11.navigate('ManageUser')
      }
  return (
    <View style={styles.container}>
    <TouchableOpacity onPress={handleNavigate}>
    <Text style={styles.title}>Danh sách user</Text>
      {/* Danh sách người dùng */}
    </TouchableOpacity></View>
  );
};

const PostCategory = () => {
    const navigation11 = useNavigation();
    const handleNavigate = () => {
       
        navigation11.navigate('ManagePost')
     }
  return (
    <View style={styles.container}>
    <TouchableOpacity onPress={handleNavigate}>
    <Text style={styles.title}>Danh sách Bài đăng</Text>
      {/* Danh sách người dùng */}
    </TouchableOpacity></View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerButton: {
    flex: 1,
    backgroundColor: '#456fe6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    backgroundColor:"#456fe6",
    padding: 20,
    borderRadius:8,
    color:"#fff",
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default function AdCategory() {
  return (
    <View style={styles.container}>
      <UserCategory />
      <PostCategory />
    </View>
  );
}
