import {View, Text, StyleSheet, Image,TouchableOpacity,ScrollView,TextInput} from 'react-native';
import { createContext, useContext, useReducer,useEffect ,useState} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR,loadUpdateInfo
} from "../../recoil/initState";
import { setAuthToken, api} from "../../utils/helpers/setAuthToken"
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
const MessagesSearch = () => {
  const [currentUser, setDataInfo] = useState([]);
  const navigation = useNavigation();
  const [to, setToken] = useRecoilState(tokenState);
  const [loadUpdateInfoR, setloadUpdateInfoR] = useRecoilState(loadUpdateInfo);
  useEffect(() => {
    const fetchDataInfo = async () => {

      setAuthToken(to)
     
    try {
   
      const response = await api.get('https://truongnetwwork.bsite.net/api/infor/myinfor');
      if(loadUpdateInfoR=== false) {
        setloadUpdateInfoR(true)
       
      }
  
      setDataInfo(response.data.data.firebaseData);

    } catch (error) {
      console.log(error)
      setStatus('error');
    }
    }
    fetchDataInfo()
  }, [loadUpdateInfoR]);
  console.log(currentUser.uid)
   const [username, setUsername] = useState("");
   const [user, setUser] = useState('');
   const [err, setErr] = useState(false);
 
   const handleSearch = async () => {
     const q = query(
       collection(db, "users"),
       where("DisplayName", "==", username)
     );
 
     try {
       const querySnapshot = await getDocs(q);
       querySnapshot.forEach((doc) => {
         console.log(123);
         setUser(doc.data());
       });
     } catch (error) {
       setErr(true);
     }
   };
 
   const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };
  
 
   const handleSelect = async () => {
     const combinedId =
     currentUser.uid > user.Uid
         ? currentUser.uid + user.Uid
         : user.Uid + currentUser.uid;
     console.log(combinedId, user.Uid);
     try {
       const res = await getDoc(doc(db, "chats", combinedId));
 
       if (!res.exists()) {
         console.log(123);
         await setDoc(doc(db, "chats", combinedId), { messages: [] });
 
         await updateDoc(
           doc(db, "userChats", currentUser.uid),
           {
             [combinedId + ".userInfo"]: {
               uid: user.Uid,
               displayName: user.DisplayName,
               photoURL: user.PhotoUrl,
             },
             [combinedId + ".date"]: serverTimestamp(),
           }
         );
         console.log(
          currentUser.uid,
           "va",
           currentUser.displayName,
           "va",
           currentUser.photoUrl
         );
         await updateDoc(doc(db, "userChats", user.Uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL:   currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
         console.log(456);
       }
     } catch (error) {
       console.log("Loi r");
     }
 
     setUser(null);
     setUsername("");
     navigation.navigate('Messages')
   };
   const [chats, setChats] = useState([]);
 
   const { dispatch } = useContext(ChatContext);
 
   useEffect(() => {
     const getChats = () => {
       const unsub = onSnapshot(
         doc(db, "userChats", currentUser.uid),
         (doc) => {
           setChats(doc.data());
         }
       );
 
       return () => {
         unsub();
       };
     };
 
     currentUser.uid && getChats();
   }, [currentUser.uid]);
   console.log(chats)
   const handleSelect1 = (u) => {
     console.log(u);
     dispatch({ type: "CHANGE_USER", payload: u });
     navigation.navigate('ChatMessagesScreen')
   };
  return (
    <ScrollView>
       <View
        style={{
          marginHorizontal: 12,
          flexDirection: "row",
          justifyContent: "center",
          marginTop:10,
          paddingBottom:10
        }}
      >
      <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
        position: "absolute",
        left: 0,
        borderRadius:9999,
        backgroundColor:colors.gray1
      
      }}
    >
      <MaterialIcons
        name="keyboard-arrow-left"
        size={24}
        color={COLORS.black}
      />
    </TouchableOpacity>

        <Text style={{ ...FONTS.h3,color:colors.black}} ></Text>
      
      </View>
      <View style={styles.container1}>
      <View    style={styles.input}>
      <TextInput
          style={{width:"90%",height:"100%",fontSize:12}}
        placeholder="Enter search term"
        placeholderTextColor="gray"
        value={username}
        onChangeText={(text) => setUsername(text)}
      
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
      <EvilIcons name="search" size={30} color="black" />
      </TouchableOpacity></View>
    </View>
    {user && user.PhotoUrl && ( // Kiểm tra xem user và user.PhotoUrl có tồn tại không
      <TouchableOpacity
                      style={styles.container}
                      onPress={handleSelect}
                    >
                      <View style={styles.avatarContainer}>
    {user && user.PhotoUrl && ( // Kiểm tra xem user và user.PhotoUrl có tồn tại không
      <Image
        style={styles.avatar}
        source={{ uri: user.PhotoUrl }}
      />
    )}
  </View>
  <View style={styles.contentContainer}>
    <Text style={styles.displayName}>
      {user.DisplayName} 
    </Text>
  </View>
                    </TouchableOpacity>
    )}
   

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
input: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 30,
  paddingHorizontal: 10,
  height:35,
  color:'black',
  backgroundColor:"#fff",
  flexDirection:"row",
  justifyContent:"start",
  alignItems:"center"

},
button: {
  backgroundColor: 'transparent',
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


export default MessagesSearch