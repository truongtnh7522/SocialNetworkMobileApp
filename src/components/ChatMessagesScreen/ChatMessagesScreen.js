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
import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from "react";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import Ioniconss from "react-native-vector-icons/MaterialIcons";
import Ionicons1 from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import EmojiSelector from "react-native-emoji-selector";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "react-native-image-picker";
import { ChatContext } from "../../context/ChatContext";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  tokenState, likeR
} from "../../recoil/initState";
import { setAuthToken, api } from "../../utils/helpers/setAuthToken"
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
import { colors } from '../../utils/configs/Colors';
import { MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { COLORS, FONTS } from "../../constants";

import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import ZegoUIKitPrebuiltCallService, {
  ZegoCallInvitationDialog,
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoSendCallInvitationButton,
  ZegoMenuBarButtonName,
  ZegoUIKitPrebuiltCallFloatingMinimizedView,
  ZegoCountdownLabel,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import Spinner from "../Spinner";

const ChatMessagesScreen = () => {
  const [invitees, setInvitees] = useState([]);

  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [load, setLoad] = useState(false);

  const [recepientData, setRecepientData] = useState();
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState("");
  const route = useRoute();

  const [message, setMessage] = useState("");


  const scrollViewRef = useRef(null);
  const { data } = useContext(ChatContext);
  useEffect(() => {
    scrollToBottom()
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false })
    }
  }

  const handleContentSizeChange = () => {
    scrollToBottom();
  }

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  function removeDiacriticsAndSpaces(str) {
    // Loại bỏ dấu từ chuỗi
    const diacriticsMap = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'đ': 'd',
        'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
        'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
        'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
        'Đ': 'D',
        'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
        'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
        'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
        'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
        'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
        'Ơ': 'O', 'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
        'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
        'Ư': 'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
        'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y'
    };

    return str.replace(/[^A-Za-z0-9]/g, char => diacriticsMap[char] || '');
}

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ioniconss
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="#456fe6"
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
            <ZegoSendCallInvitationButton
              invitees={invitees.map((inviteeID) => {
                return { userID: inviteeID, userName: inviteeID };
              })}
              isVideoCall={false}
              resourceID={"zego_data"}
            />
            <ZegoSendCallInvitationButton
              invitees={invitees.map((inviteeID) => {
                return { userID: inviteeID, userName: inviteeID };
              })}
              isVideoCall={true}
              resourceID={"zegouikit_call"}
            />
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
        const fullName = data.user?.displayName;
        const responseInfo = await api.get(
          "https://socialnetwork.somee.com/api/infor/searchuser",
          {
            params: { fullname: fullName },
          }
        );
        const firstUserFullName = responseInfo.data.data?.[0]?.fullName;
        const fullNameWithoutDiacriticsAndSpaces = removeDiacriticsAndSpaces(firstUserFullName);
        if (fullNameWithoutDiacriticsAndSpaces) {
          setInvitees([fullNameWithoutDiacriticsAndSpaces]);
        }

        const response = await api.get('https://socialnetwork.somee.com/api/infor/myinfor');
        //  console.log(response.data)
        setDataInfo(response.data.data.firebaseData);
        setLoad(true)
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
    <KeyboardAvoidingView style={{ flex: 1,}}>
      <View style={{ display: "flex", flexDirection: "row",backgroundColor:"white" , justifyContent: "space-between",  paddingLeft: 10, paddingRight: 10 , paddingTop:10, paddingBottom:10}}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10,}}>
          <Ioniconss
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="#456fe6"
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

            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold",color:"#333" }}>
              {data.user.displayName}
            </Text>
          </View>

        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <ZegoSendCallInvitationButton
            invitees={invitees.map((inviteeID) => {
              return { userID: inviteeID, userName: inviteeID };
            })}
            isVideoCall={false}
            resourceID={"zego_data"}
          
          />
          <ZegoSendCallInvitationButton
            invitees={invitees.map((inviteeID) => {
              return { userID: inviteeID, userName: inviteeID };
            })}
            isVideoCall={true}
            resourceID={"zegouikit_call"}
          />
        
         

        </View></View>
      <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}>
        {
          load === false ? <Spinner></Spinner> : <View>
          {
            messages.map((item, index) => (
              <>
                <>
                  {
                    item.text == "" ? <></> : <Pressable
  
  
                      style={[
                        item.senderId === currentUser.uid
                          ? {
                            alignSelf: "flex-end",
                            backgroundColor: "#DCF8C6",
                            padding: 8,
                            paddingTop:0,
                            maxWidth: "60%",
                            borderRadius: 7,
                            margin: 10,
                            width:"fit-content"
                          }
                          : {
                            alignSelf: "flex-start",
                            backgroundColor: "white",
                            padding: 8,
                            paddingTop:0,
                            margin: 10,
                            borderRadius: 7,
                            maxWidth: "60%",
                            width:"fit-content"
                          },
  
                        { backgroundColor: "#F0FFFF" },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          textAlign: "right",
                        }}
                      >
                        {messages[index].text}
                      </Text>
                      <Text
                        style={{
                          textAlign: "right",
                          fontSize: 16,
                          color: "gray",
                          marginTop: 5,
                        }}
                      >
                      {messages[index].text}
                      </Text>
                    </Pressable>
                  }
                </>
                <>
                  {
                    item.img == undefined ? <></> : <Pressable
  
  
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
                          source={{ uri: messages[index].img }}
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
          </View>
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
          background:"#fff"
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
            backgroundColor: "#456fe6",
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
