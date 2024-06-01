import {View, Text, StyleSheet, Image,TouchableOpacity,ScrollView,TextInput} from 'react-native';
import { createContext, useContext, useReducer,useEffect ,useState} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR,idUsers
} from "../../recoil/initState";
import { setAuthToken, api} from "../../utils/helpers/setAuthToken"
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import {colors} from '../../utils/configs/Colors';
import { ChatContext } from "../../context/ChatContext";
import  MaterialIcons  from "react-native-vector-icons/MaterialIcons";
import { COLORS, FONTS } from "../../constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Spinner from '../../components/Spinner';
const SearchPage = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [to, setToken] = useRecoilState(tokenState);
  const [username, setUsername] = useState("");
  const [load, setLoad] = useState(true);
  const [idUserR, setidUsersR] = useRecoilState(idUsers);
    const handleSearch = async () => {
      setLoad(false)
      setAuthToken(to)
     
    try {
      console.log(username)
      const response = await api.get(`https://truongnetwwork.bsite.net/api/infor/searchuser`,
      {
        params: { fullname: username }, // Use params to send data in the query string
      }
    );
       console.log("dautien>>>>>>>>>>>>>>>>>>>>>>>>>>>>",response.data)
      setData(response.data);
      setLoad(true)
    } catch (error) {
      console.log(error)
    
      setLoad(false)
    }
    }
 

   const [user, setUser] = useState('');
   const [err, setErr] = useState(false);
 
 
 
   
  
 


 

 
 
 
   const navigation1 = useNavigation();
   const handleNotifi = () => {

    navigation1.navigate('Notifications')

  }
  const handleCreateReels = () => {
    navigation1.navigate('CreateReels')

  }
  const handleSearchpage = () => {
    navigation1.navigate('Search')

  }
  const handleNavigate = (id) => {
      console.log(id)
     setidUsersR(id)
     navigation1.navigate('ProfileUsers')

}
  return (
    <ScrollView>
    <View style={styles.header}>
    <Image
        style={styles.icon}
        source={require('../../assets/TKCTech.png')}
      />
      
      <View style={styles.headerRightWrapper}>
    
    
      <TouchableOpacity onPress={handleSearchpage}>
    <Feather name="search" size={30} color="black" style={{marginRight:10}}/></TouchableOpacity>
    <TouchableOpacity onPress={handleCreateReels}>
    <AntDesign name="pluscircle" size={28} color="black"  style={{marginRight:10}}/>  
  </TouchableOpacity>
    <TouchableOpacity onPress={handleNotifi}>
    <Ionicons name="notifications" size={30} color="black" />
  </TouchableOpacity>
  
      </View>
    </View>
      <View style={styles.container1}>
      <TextInput
        style={styles.input}
        placeholder="Enter search users"
        placeholderTextColor="gray"
        value={username}
        onChangeText={(text) => setUsername(text)}
      
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
      <EvilIcons name="search" size={30} color="black" />
      </TouchableOpacity>
    </View>
    <View>
    {
      load === true ?  <View>
      {data?.data?.map((item, index) => (
        <TouchableOpacity
        style={styles.container}
        onPress={() => handleNavigate(data.data[index].userId)}
  
      >
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: data.data[index].image }}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.displayName}>  {item.fullName}</Text>
        
        </View>
      </TouchableOpacity>
      ))} 
      </View>: <Spinner></Spinner>
    }
    </View>
  
                   

    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container1: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 10,
  marginBottom: 10,
},
icon: {
  width: 100,
  height: 40,
},
headerRightWrapper: {
  display: 'flex',
  flexDirection: 'row',
  justifyContent:"center",
  alignItems:"center"
},
header: {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 10,
  borderBottomColor: colors.gray1,
  borderBottomWidth: 1,
  
   backgroundColor:"#fff"
},
input: {
  flex: 1,
  borderWidth: 1,
  borderWidth: 0, 
  borderRadius: 30,
  paddingHorizontal: 20,
  marginRight: 10,
  height:"70%",
  color:'black',
  backgroundColor:"white"

},
button: {
  backgroundColor: '#fff',
  paddingVertical: 5,
  paddingHorizontal: 5,
  borderRadius: 5,
},
buttonText: {
  color: '#fff',
  fontWeight: 'bold',
},
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.gray1,
    
    marginBottom: 10,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginLeft: 5,
  },
});


export default SearchPage