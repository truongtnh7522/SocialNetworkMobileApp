import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Image,
  } from "react-native";
  import React, { useState, useContext, useLayoutEffect, useEffect,useRef } from "react";
  import  Feather  from "react-native-vector-icons/Feather";
  import  Ionicons  from "react-native-vector-icons/MaterialCommunityIcons";
  import  Ioniconss  from "react-native-vector-icons/MaterialIcons";
  import  FontAwesome  from "react-native-vector-icons/FontAwesome";
  import  Entypo from "react-native-vector-icons/Entypo";
  import EmojiSelector from "react-native-emoji-selector";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import * as ImagePicker from "react-native-image-picker";
  import { ChatContext } from "../../context/ChatContext";
  import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR
} from "../../recoil/initState";
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
  Timestamp,
  arrayUnion,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import {colors} from '../../utils/configs/Colors';
import { MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { COLORS, FONTS } from "../../constants";
  const ChatMessagesScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);

    const [recepientData, setRecepientData] = useState();
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState("");
    const route = useRoute();

    const [message, setMessage] = useState("");

  
    const scrollViewRef = useRef(null);
    const { data } = useContext(ChatContext);
    useEffect(() => {
      scrollToBottom()
    },[]);
  
    const scrollToBottom = () => {
        if(scrollViewRef.current){
            scrollViewRef.current.scrollToEnd({animated:false})
        }
    }
  
    const handleContentSizeChange = () => {
        scrollToBottom();
    }
  
    const handleEmojiPress = () => {
      setShowEmojiSelector(!showEmojiSelector);
    };
  
  
  
  

  
    console.log(data)


    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: "",
        headerLeft: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ioniconss
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
              color="black"
            />
  
          
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                  source={{ uri: data.user.photoURL }}
                />
  
                <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                  {data.user.displayName}
                </Text>
              </View>
        
          </View>
        ),
        headerRight: () =>
          selectedMessages.length > 0 ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="redo-variant" size={24} color="black" />
              <Ionicons name="undo-variant" size={24} color="black" />
              <FontAwesome name="star" size={24} color="black" />
              
            </View>
          ) : null,
      });
    }, [recepientData, selectedMessages]);
  
 

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.cancelled) {
          setImg(result.uri); // Lưu đường dẫn của hình ảnh đã chọn
        }
      };
    
    const [currentUser, setDataInfo] = useState([]);
    
    const [to, setToken] = useRecoilState(tokenState);
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
  
    useEffect(() => {
      const fetchDataInfo = async () => {
  
        setAuthToken(to)
       
      try {
     
        const response = await api.get('https://www.socialnetwork.somee.com/api/infor/myinfor');
        //  console.log(response.data)
        setDataInfo(response.data.data.firebaseData);
  
      } catch (error) {
        console.log(error)
        setStatus('error');
      }
      }
      fetchDataInfo()
    }, []);
    const uuid = () => {
        const timestamp = new Date().getTime(); // Lấy thời gian hiện tại
        const randomChars = Math.random().toString(36).substring(2, 6); // Tạo một chuỗi ngẫu nhiên
        const id = timestamp.toString() + randomChars; // Kết hợp thời gian và chuỗi ngẫu nhiên
        return id;
      };
      
      // Sử dụng hàm generateId để tạo ID mới

    const handleSend = async () => {
        if (img) {
          const storageRef = ref(storage, uuid());
    
          const uploadTask = uploadBytesResumable(storageRef, img);
    
          uploadTask.on(
            (error) => {
              //TODO:Handle Error
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              });
            }
          );
        } else {
          console.log(
            currentUser.uid,
            uuid(),
            text,
            data.user.uid
          );
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
            }),
          });
        }
        console.log(data.chatId);
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
        console.log(data.user);
    
        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
    
        setText("");
        setImg(null);
      };
      const [messages, setMessages] = useState([]);
     
    
      useEffect(() => {
        console.log(data.chatId);
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
          doc.exists() && setMessages(doc.data().messages);
        });
    
        return () => {
          unSub();
        };
      }, [data.chatId]);
      console.log(messages)
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
        <View style={{display:"flex", flexDirection: "row",justifyContent:"space-between",marginTop:30, paddingLeft:10, paddingRight:10}}>
         <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ioniconss
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
              color="black"
            />
  
          
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                  source={{ uri: data.user.photoURL }}
                />
  
                <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                  {data.user.displayName}
                </Text>
              </View>
        
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="redo-variant" size={24} color="black" />
              <Ionicons name="undo-variant" size={24} color="black" />
              <FontAwesome name="star" size={24} color="black" />
              
            </View></View>
        <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow:1}} onContentSizeChange={handleContentSizeChange}>
                  {
                    messages.map((item,index) => (
                    <>
                      <>
                        {
                            item.text == ""? <></> :   <Pressable
                
               
                            style={[
                              item.senderId === currentUser.uid
                                ? {
                                    alignSelf: "flex-end",
                                    backgroundColor: "#DCF8C6",
                                    padding: 8,
                                    maxWidth: "60%",
                                    borderRadius: 7,
                                    margin: 10,
                                  }
                                : {
                                    alignSelf: "flex-start",
                                    backgroundColor: "white",
                                    padding: 8,
                                    margin: 10,
                                    borderRadius: 7,
                                    maxWidth: "60%",
                                  },
            
                              { width: "100%", backgroundColor: "#F0FFFF" },
                            ]}
                          >
                            <Text
                              style={{
                                fontSize: 13,
                                textAlign:"right",
                              }}
                            >
                         {messages[index].text}
                            </Text>
                            <Text
                              style={{
                                textAlign: "right",
                                fontSize: 9,
                                color: "gray",
                                marginTop: 5,
                              }}
                            >
                            ss
                            </Text>
                          </Pressable>
                        }
                      </>
                      <>
                        {
                            item.img == undefined? <></> :   <Pressable
                
               
                            style={[
                              item.senderId === currentUser.uid
                                ? {
                                    alignSelf: "flex-end",
                                    backgroundColor: "white",
                                    padding: 8,
                                    maxWidth: "60%",
                                    borderRadius: 7,
                                    margin: 10,
                                  }
                                : {
                                    alignSelf: "flex-start",
                                    backgroundColor: "white",
                                    padding: 8,
                                    margin: 10,
                                    borderRadius: 7,
                                    maxWidth: "60%",
                                  },
            
                              { width: "100%", backgroundColor: "transperent" },
                            ]}
                          >
                           <View>
                  <Image
                    source={{uri: messages[index].img}}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      color: "white",
                      marginTop: 5,
                    }}
                  >
                   
                  </Text>
                </View>
                          </Pressable>
                        }
                      </>
                      </>
                    ))
                  }
               
           
  
        </ScrollView>
  
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: "#dddddd",
            marginBottom: showEmojiSelector ? 0 : 25,
          }}
        >
          <Entypo
            onPress={handleEmojiPress}
            style={{ marginRight: 5 }}
            name="emoji-happy"
            size={24}
            color="gray"
          />
  
          <TextInput
            value={text}
            onChangeText={(text) => setText(text)}
            style={{
              flex: 1,
              height: 40,
              borderWidth: 1,
              borderColor: "#dddddd",
              borderRadius: 20,
              paddingHorizontal: 10,
            }}
            placeholder="Type Your message..."
          />
  
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginHorizontal: 8,
            }}
          >
            <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
  
            <Feather name="mic" size={24} color="gray" />
          </View>
  
          <Pressable
            onPress={handleSend}
            style={{
              backgroundColor: "#007bff",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
          </Pressable>
        </View>
  
        {showEmojiSelector && (
          <EmojiSelector
            onEmojiSelected={(emoji) => {
              setMessage((prevMessage) => prevMessage + emoji);
            }}
            style={{ height: 250 }}
          />
        )}
      </KeyboardAvoidingView>
    );
  };
  
  export default ChatMessagesScreen;
  
  const styles = StyleSheet.create({});
  