import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { ChatContext } from "../../context/ChatContext";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect,useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES, images } from "../../constants";
import { StatusBar, ActivityIndicator ,Button,StyleSheet,ScrollView  } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from 'react-native-vector-icons/FontAwesome';
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
  import { photos1 } from "../../constants/data";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRecoilState, useRecoilValue } from "recoil";
import {
  tokenState, likeR,photosR,idPostSimple,idUsers
} from "../../recoil/initState";
import { setAuthToken, api } from "../../utils/helpers/setAuthToken"
import Spinner from "../../components/Spinner"
import Background from '../../components/LoginAndSignUp/Background';
import BackButton from '../../components/LoginAndSignUp/BackButton'





const styles = StyleSheet.create({
  container: {
 
    
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'start',
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical:50
  },
  element:{
    height:100,
    width:"80%",
    backgroundColor:"#456fe6",
    borderRadius:12,
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingLeft:10,
    paddingRight:10
  },
  container1: {
 
 
    flex: 1,
  },
  item: {
    marginRight: 20,
    position: 'relative',
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  name: {
    fontSize: 16,
    color: '#fff',
  },
  price: {
    fontSize: 14,
    color: '#fff',
  },
});
const ManagePost = ({ navigation }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [dataInfo, setDataInfo] = useState([]);
  const [lengthFriend, setLengthFriend] = useState(0);
  const [loadData, setLoadData] = useState(false);
  const [lengthPost, setLengthPost] = useState(0);
  const [dataPost, setData] = useState([]);
  const [idUserR, setidUsersR] = useRecoilState(idUsers);
  const navigation11 = useNavigation();

  const [to, setToken] = useRecoilState(tokenState);

  const [load, setLoad] = useState(false)
  const [photos,setPhotos] = useRecoilState(photosR)

 
  const fetchData = async () => { 
    setAuthToken(to)
    try {
    
      const response = await api.post(
        `https://socialnetwork.somee.com/api/admin/user/GetAllPostsAdmin`
      );
      console.log(response.data.data.images?.[0].linkImage)
      setData(response.data.data);
      setLoadData(true);
    } catch (error) {
      console.error("Get post failed", error);
    }
  };
  useEffect(() => {
   
   
    fetchData();
  }, []);
 

 

 
  const hanldDltPost = async (id) => {
    setAuthToken(to);
    console.log(id)
    try {
      // const data =;
      const res = await api.post(`https://socialnetwork.somee.com/api/admin/user/DeletePostAdmin?postId=${id}`);
     console.log(res.data)
     fetchData()
  
    } catch (error) {
      console.error("Add sai!", error);
    }
  } 
  return (

    <View style={styles.container}>
    <BackButton />
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.innerContainer}>
    
      {
        dataPost.map((item, index) => (
          <View style={
      styles.element
            
      }  key={index}>
        <Image
    
        source={{ uri: dataPost[index]?.images[0].linkImage}} 
        style={{ width: "30%", height: "60%" , borderRadius:10 }}
      />
      <View style={{
        width:"50%"
      }}>
      <Text>{dataPost[index]?.content}</Text>
      </View>
    <Feather name="trash-2" size={18} color="gray" onPress={() => hanldDltPost(dataPost[index]?.id)}/>
      </View>
     
        ))
      }
      
   
    
      </View>
   
      </ScrollView>
    </View>
  );
};

export default ManagePost
