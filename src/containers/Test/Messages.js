import {View, Text, StyleSheet, Image,TouchableOpacity,ScrollView,TextInput} from 'react-native';
import { createContext, useContext, useReducer,useEffect ,useState} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR,loadUpdateInfo
} from "../../recoil/initState";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { setAuthToken, api} from "../../utils/helpers/setAuthToken"
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
import Spinner from "../../components/Spinner"
const Messages = () => {
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
   };
   const [chats, setChats] = useState([]);
   const [load, setLoad] = useState(true);
   const { dispatch } = useContext(ChatContext);
   
   useEffect(() => {
     const getChats = () => {
       const unsub = onSnapshot(
         doc(db, "userChats", currentUser.uid),
         (doc) => {
         
           setChats(doc.data()); 
           setLoad(false)
         }
       );
 
       return () => {
         unsub();
       };
     };
 
     currentUser.uid && getChats();
   }, [currentUser.uid]);
   const handleSelect1 = (u) => {
     console.log(u);
     dispatch({ type: "CHANGE_USER", payload: u });
     navigation.navigate('ChatMessagesScreen')
   };
  return (
    <ScrollView style={{backgroundColor:"white"}}>
       <View
        style={{
          marginHorizontal: 12,
          flexDirection: "row",
          justifyContent: "center",
          marginTop:10,
          paddingBottom:10,
          
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

        <Text style={{ ...FONTS.h2,color:colors.black}} >Chat</Text>
      
      </View>
      <TouchableOpacity style={styles.container1} onPress={() =>  navigation.navigate('MessagesSearch')}>
      <View
        style={styles.input}
       
      
      >
      <EvilIcons name="search" size={20} color="black" />
      <Text style={{ fontSize:15,color:colors.gray, marginLeft:5}} >Enter search term</Text></View>
    
    </TouchableOpacity>
          {
            load === true ? <Spinner/> : <View>
            {Object.entries(chats)
              ?.sort((a, b) => b[1].date - a[1].date)
              .map((chat) => {
                if (
                  chat[1].userInfo &&
                  chat[1].userInfo.displayName &&
                  chat[1].userInfo.photoURL
                ) {
                  return (
                    <TouchableOpacity
                    style={styles.container}
                    onPress={() => handleSelect1(chat[1].userInfo)}
             
                  >
                    <View style={styles.avatarContainer}>
                      <Image
                        style={styles.avatar}
                        source={{ uri: chat[1].userInfo.photoURL }}
                      />
                    </View>
                    <View style={styles.contentContainer}>
                      <Text style={styles.displayName}>{chat[1].userInfo.displayName}</Text>
                      <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>
                          {chat[1].lastMessage?.text == "" ? "Hãy nhắn để kết nối nhau" : chat[1].lastMessage?.text }
                        </Text>
                        <Text style={styles.timestamp}>Just now</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  );
                } else {
                  return null; // or render a placeholder if necessary
                }
              })}
            </View>
          }
      

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
  borderRadius: 30,
  paddingHorizontal: 10,
  height:35,
  color:'black',
  flexDirection:"row",
  justifyContent:"start",
  alignItems:"center",

  backgroundColor:colors.gray2

},
button: {
  backgroundColor: '#456fe6',
  paddingVertical: 5,
  paddingHorizontal: 20,
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
    marginBottom: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
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
    marginLeft: 15,
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


export default Messages