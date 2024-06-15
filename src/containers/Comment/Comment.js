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
  import FontAwesome from "react-native-vector-icons/FontAwesome";
  import Entypo from "react-native-vector-icons/Entypo";
  import EmojiSelector from "react-native-emoji-selector";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import * as ImagePicker from "react-native-image-picker";
  import { ChatContext } from "../../context/ChatContext";
  import { useRecoilState, useRecoilValue } from "recoil";
  import {
    tokenState, likeR,idPost,loadUpdateInfo
  } from "../../recoil/initState";
  import { setAuthToken, api } from "../../utils/helpers/setAuthToken"

const Comment = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [idPostR, setidPostR] = useRecoilState(idPost);
    const [loadCmt, setLoadCmt] = useState(true);
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");
  const { data } = useContext(ChatContext);
  const [dataCmt, setData] = useState([]);
  const [postId, setPostId] = useState(data.id);
  const [to, setToken] = useRecoilState(tokenState);
  const [dataInfo, setDataInfo] = useState([]);

  const loadData = async () => {
    // Gọi API để lấy dữ liệu
    console.log(idPostR)
    setAuthToken(to)
    await api
      .get(
        `https://truongnetwwork.bsite.net/api/cmt/getcmtPost/${idPostR}`
      )
      .then((response) => {
       
        // Cập nhật dữ liệu vào state
        if (response.status === 200) {
          
          console.log("data",response.data)
          setData(response.data);
          setLoadCmt(false)
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    scrollToBottom()
    loadData()
  }, []);
  const [loadUpdateInfoR, setloadUpdateInfoR] = useRecoilState(loadUpdateInfo);
  useEffect(() => {
    const fetchDataInfo = async () => {

      setAuthToken(to)

      try {
        console.log(12)
        const response = await api.get('https://truongnetwwork.bsite.net/api/infor/myinfor');
        if(loadUpdateInfoR=== false) {
          setloadUpdateInfoR(true)
         
        }
    
        setDataInfo(response.data.data);
       
      } catch (error) {
        console.log(error)
      
      }
    }
    fetchDataInfo()
  }, [loadUpdateInfoR]);

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

  console.log(dataInfo.id)
  const handleAddPostBig = async () => {
    setAuthToken(to);
    try {
      // const data =;
      const res = await api.post("https://truongnetwwork.bsite.net/api/cmt/create", {
        Content: text,
        postId: idPostR,
        userId: dataInfo.id,
      },    {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
     console.log(res.data)
     loadData()
     setText("")
    } catch (error) {
      console.error("Add sai!", error);
    }
  };
  const hanldDltCmtChild = async (pId) => {
    setAuthToken(to);
    // const postId = idPost;
    // const userId = id;
    const parentId = pId;
    console.log("Ss",parentId)
    return api
      .post(
        `https://truongnetwwork.bsite.net/api/cmt/deleteOrUndo/${parentId}`
      )
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          loadData();
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0", paddingTop:"10px" }}>
    <Text style={{
      width:"100%",
      textAlign:"center"
    }}>
      Bình luận bài Post
    </Text>
    {
      loadCmt === false ? <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}>
      {
      
          <>
            <>
           
            {dataCmt.data.map((item, index) => (
              <View  style={[
                {
                  display:"flex",
                  flexDirection: "row",
                  justifyContent:"start",
                  alignItems:"center",
                  paddingLeft:10
           
                 },

             
             ]}>
             <Image
             style={styles.profileThumb}
             source={{uri: item.image}}
           />
            <View


              style={[
                 {
                    alignSelf: "flex-start",
                    backgroundColor: "white",
                    padding: 8,
                    margin: 10,
                    borderRadius: 7,
                    maxWidth: "80%",
                  },

                {  backgroundColor: "#F0FFFF" },
              ]}
            >
              <Text
                style={{
                  fontSize: 13,
                  textAlign: "left",
                  color:"black"
                }}
              >
              {item.content}
              </Text>
            
            </View>
            <Feather name="trash-2" size={18} color="gray" onPress={() => hanldDltCmtChild(item.id)}/>
            </View>
          ))}
            </>
          
          </>
       
      }



    </ScrollView> : <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }}></ScrollView>
    }
     

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
          

          <Feather name="mic" size={24} color="gray" />
        </View>

        <Pressable
          onPress={handleAddPostBig}
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
  )
}
export const styles = StyleSheet.create({
  profileThumb: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
});
export default Comment;