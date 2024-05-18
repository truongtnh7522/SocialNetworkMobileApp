import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { ChatContext } from "../../context/ChatContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect,useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES, images } from "../../constants";
import { StatusBar, ActivityIndicator,StyleSheet,ScrollView ,Modal,Button } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from 'react-native-vector-icons/FontAwesome';
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
  import { photos1 } from "../../constants/data";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRecoilState, useRecoilValue } from "recoil";
import {
  tokenState, likeR,photosR,idPostSimple,idUsers,photosRU
} from "../../recoil/initState";
import { setAuthToken, api } from "../../utils/helpers/setAuthToken"
import Spinner from "../../components/Spinner"
import Background from '../../components/LoginAndSignUp/Background';
import {  colors } from 'react-native-elements';
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

// console.log("data",photos.data?.[0].images?.[0].linkImage)
const PhotosRoutes = ({ navigation }) => {
  const navigation1 = useNavigation();
  const [photos,setPhotos] = useRecoilState(photosRU)
  const [idPostSimpleR,setIdPostSimple] = useRecoilState(idPostSimple)
  const handleGetPost = (id) => {
    console.log(id)
    setIdPostSimple(id)
     navigation1.navigate('FeedSimpleScreen')
  }
  // console.log("pts",photos.data?.[0].images[0].linkImage )
  
  return (
    <View style={{ flex: 1 }}>
    <FlatList
      data={photos.data}
      numColumns={3}
      contentContainerStyle={{ paddingBottom: 100 }}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={{
            flex: 1,
            aspectRatio: 1,
            margin: 3,
          }}
          onPress={() => {handleGetPost(photos.data?.[index].id)}}
        >
        <Image
        key={index}
        source={{ uri: photos.data?.[index].images[0].linkImage  }} 
        style={{ width: "100%", height: "100%", borderRadius: 12 }}
      />
        </TouchableOpacity>
      )}
    />
  </View>
  )
}


const FriendsRoutes = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [friendsPerPage] = useState(3);
  const [idUserR, setidUsersR] = useRecoilState(idUsers);
  const navigation = useNavigation();
  const handleNavigate = (userIDD) => {
   console.log("Ưse",userIDD)
    setidUsersR(userIDD)
    navigation.navigate('ProfileUsers')
 
}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          "https://socialnetwork.somee.com/api/Friend/getAllNotFriend"
        );
        setFriends(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm này để lấy danh sách bạn bè cho từng trang
  const paginate = (pageNumber) => {
    const startIndex = (pageNumber - 1) * friendsPerPage;
    const endIndex = startIndex + friendsPerPage;
    return friends.slice(startIndex, endIndex);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <ScrollView horizontal={true} contentContainerStyle={styles1.scrollView}>
            {paginate(currentPage).map((friend, index) => (
              <TouchableOpacity key={index} style={styles1.friendContainer} onPress={() => handleNavigate(friend.userId)}>
                <Image
                  source={{ uri: friend.image }} // Nếu avatar là URL
                  style={styles1.avatar}
                />
                <Text>{friend.fullName ? friend.fullName : "Unknown"}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles1.buttonContainer}>
            <Button title="Previous" onPress={prevPage} disabled={currentPage === 1} />
            <Button title="Next" onPress={nextPage} disabled={currentPage === Math.ceil(friends.length / friendsPerPage)} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles1 = StyleSheet.create({
  scrollView: {
    paddingVertical: 16,
    paddingBottom:-10
  },
  friendContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
});

const renderScene = SceneMap({
  first: PhotosRoutes,
  second: FriendsRoutes,
});
const ProfileUsers = ({ navigation }) => {
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
  const [photos,setPhotos] = useRecoilState(photosRU)

  const fetchDataInfo = async () => {

    setAuthToken(to)

    try {
     
      const response = await api.get(`https://socialnetwork.somee.com/api/infor/user/${idUserR}`)

      setDataInfo(response.data.data);

       console.log("s", response.data.data)
    } catch (error) {
      console.log(error)
 
    }
  }
  useEffect(() => {
   
    fetchDataInfo()
  }, [idUserR]);
 
  const [routes] = useState([
    { key: "first", title: "Photos" },
    { key: "second", title: "Friendship suggestions" },
  ]);
  useEffect(() => {
    setAuthToken(to)
    const fetchData = async () => {
      try {
      
        const response = await api.get(
          `https://socialnetwork.somee.com/api/post/user/${idUserR}`
        );
        // console.log("DataPOst",response.data);
        setLengthPost(response.data.data.length);
        setPhotos(response.data)
        // setTotal(response.data.data.length);
        setData(response.data);
        setLoadData(true);
      } catch (error) {
        console.error("Get post failed", error);
      }
    };
    fetchData();
  }, [dataInfo.userId,idUserR]);
  const loadDataFriend = async () => {
    // Gọi API để lấy dữ liệu

    await api
      .get(
        `https://socialnetwork.somee.com/api/Friend/getAllNotFriend`
      )
      .then((response) => {
        // Cập nhật dữ liệu vào state
        if (response.status === 200) {
          setLengthFriend(response.data.data.length);
          //setLoadData(true);
          // console.log(response.data.data.length);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    loadDataFriend();
  }, []);
  const [currentUser, setCurrent] = useState([]);
  useEffect(() => {
    const fetchDataInfo = async () => {

      setAuthToken(to)
     
    try {
   
      const response = await api.get('https://socialnetwork.somee.com/api/infor/myinfor');
      
      setCurrent(response.data);

    } catch (error) {
      console.log(error)
    
    }
    }
    fetchDataInfo()
  }, [])
  const { dispatch } = useContext(ChatContext);
  const handleMessage = async () => {
    const combinedId =
      currentUser.data.firebaseData.uid > dataInfo.firebaseData.uid
        ? currentUser.data.firebaseData.uid + dataInfo.firebaseData.uid
        : dataInfo.firebaseData.uid + currentUser.data.firebaseData.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      console.log(combinedId);
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        console.log(
          "u:",
          dataInfo.firebaseData.uid,
          "di:",
          dataInfo.firebaseData.displayName,
          "pho:",
          dataInfo.firebaseData.photoURL
        );

        await updateDoc(
          doc(db, "userChats", currentUser.data.firebaseData.uid),
          {
            [combinedId + ".userInfo"]: {
              uid: dataInfo.firebaseData.uid,
              displayName:dataInfo.firebaseData.displayName,
              photoURL: dataInfo.firebaseData.photoURL,
            },
            [combinedId + ".date"]: serverTimestamp(),
          }
        );
        console.log(
          "u:",
          currentUser.data.firebaseData.uid,
          "di:",
          currentUser.data.firebaseData.displayName,
          "pho:",
          currentUser.data.firebaseData.photoURL
        );
        await updateDoc(doc(db, "userChats", data.data.firebaseData.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.data.firebaseData.uid,
            displayName: currentUser.data.firebaseData.displayName,
            photoURL: currentUser.data.firebaseData.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        console.log(456);
      }
    } catch (error) {
      console.log("Loi r");
    }
    dispatch({ type: "CHANGE_USER", payload: dataInfo.firebaseData });
    navigation11.navigate("ChatMessagesScreen");
  };
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      style={{
        backgroundColor: COLORS.white,
        height: 44,
      }}
      renderLabel={({ focused, route }) => (
        <Text style={[{ color: focused ? COLORS.black : COLORS.gray }]}>
          {route.title}
        </Text>
      )}
    />
  );
  const handleAddF = async (idfriend: any) => {
   
    try {
      const id = idfriend;
      const response = await api.post(
        `https://socialnetwork.somee.com/api/Friend/send/${id}`
      );

      if (response.status == 200) {
        fetchDataInfo();
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleAcceptF = async (idfriend: any) => {
    try {
      const id = idfriend;
      console.log(1);
      const response = await api.post(
        `https://socialnetwork.somee.com/api/Friend/accept/${id}`
      );
      if (response.status == 200) {
        fetchDataInfo();
      }
    } catch (error) {
      console.log("Login failed", error);
    }
  };
  const handleRemoveF = async (idfriend: any) => {
    // setLoadSearch2(true);

    try {
      const id = idfriend;
      const response = await api.post(
        `https://socialnetwork.somee.com/api/Friend/refuseFriend/${id}`
      );
      console.log(response);
      if (response.status == 200) {
        fetchDataInfo();
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  
  const handleUpLevelF1 = async (idfriend: any) => {
    try {
      const response = await api.post(
        `https://socialnetwork.somee.com/api/Friend/updateFriendLevel`,
        {
          user2: idfriend,
          level: "4",
        }
      );

      if (response.status == 200) {
        console.log(response);
        fetchDataInfo();  setVisible(false);
      }
    } catch (error) {
      console.log("Login failed", error);
    }
  };
  const handleUpLevelF = async (idfriend: any) => {
    // setLoadSearch1(true);
    // setAuthToken(token);
    try {
      const id = idfriend;
      console.log(1);
      const response = await api.post(
        `https://socialnetwork.somee.com/api/Friend/updateFriendLevel`,
        {
          user2: idfriend,
          level: "5",
        }
      );
      console.log(response);
      if (response.status == 200) {
        fetchDataInfo();
        setVisible(false);
      }
    } catch (error) {
      console.log("Login failed", error);
    }
  };
  const handleConfirm = async () => {
    try {
      const response = await api.delete(
        `https://socialnetwork.somee.com/api/Friend/unfriend/${idUserR}`
      );
      if (response.status == 200) {
        fetchDataInfo();
        setVisible(false);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
    // Xử lý khi nhấn xác nhận
    setSb(false);
  };
  return (

    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      <StatusBar backgroundColor={COLORS.gray} />
      <View style={{ width: "100%" }}>
        <Image
        source={{uri: dataInfo.background}}
          resizeMode="cover"
          style={{
            height: 228,
            width: "100%",
          }}
        />
      </View>

      <View style={{  alignItems: "center", height:"fit-content"}}>
        <Image
        source={{uri: dataInfo.image}}
          resizeMode="contain"
          style={{
            height: 155,
            width: 155,
            borderRadius: 999,
            borderColor: COLORS.primary,
            borderWidth: 2,
            marginTop: -90,
          }}
        />

        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.primary,
            marginVertical: 8,
          }}
        >
          {dataInfo.fullName}
        </Text>
        <Text
          style={{
            color: COLORS.black,
            ...FONTS.body4,
          }}
        >
          {dataInfo.career}
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <MaterialIcons name="location-on" size={24} color="black" />
          <Text
            style={{
              ...FONTS.body4,
              marginLeft: 4,
              color:"black"
            }}
          >
            {dataInfo.address}
          </Text>
        </View>

        <View
          style={{
            paddingVertical: 8,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: SIZES.padding,
            }}
          >
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.primary,
              }}
            >
              {lengthFriend}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.primary,
              }}
            >
              Followers
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: SIZES.padding,
            }}
          >
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.primary,
              }}
            >
              {lengthPost}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.primary,
              }}
            >
              Posts
            </Text>
          </View>


        </View>

       
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            style={{
              width: 280,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              marginHorizontal: SIZES.padding * 2,
            }}
            onPress={handleMessage}
          >
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.white,
              }}
            >
              Chat
            </Text>
          </TouchableOpacity>
              
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
        {dataInfo.statusFriend === "Thêm bạn bè" ? (

          <TouchableOpacity
          style={{
            width: 280,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.primary,
            borderRadius: 10,
            marginHorizontal: SIZES.padding * 2,
          }}
          onPress={() => {
            handleAddF(dataInfo.userId);
          }}
        >
          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.white,
            }}
          >
         Thêm bạn bè
          </Text>
        </TouchableOpacity>
        ) : dataInfo.statusFriend === "Hủy lời mời" ? (

          <TouchableOpacity
          style={{
            width: 280,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.primary,
            borderRadius: 10,
            marginHorizontal: SIZES.padding * 2,
          }}
       
        >
          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.white,
            }}
          >
          Chờ xác nhận
          </Text>
        </TouchableOpacity>
        ): dataInfo.statusFriend === "Phản Hồi" ? (
          <View style={{flex:1,flexDirection:"row" , alignItems: "center",
          justifyContent: "center",}}>
          <TouchableOpacity
          style={{
            width: 120,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.primary,
            borderRadius: 10,
            marginHorizontal: SIZES.padding * 2,
          
          }}
          onPress={() => {
            handleAcceptF(dataInfo.userId);
          }}
        >
          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.white,
            }}
          >
       Chấp nhận
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={{
          width: 120,
          height: 36,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ff0000",
          borderRadius: 10,
          marginHorizontal: SIZES.padding * 2,
        }}
        onPress={() => {
          handleRemoveF(dataInfo.userId);
        }}
      >
        <Text
          style={{
            ...FONTS.body4,
            color: COLORS.white,
          }}
        >
    Từ chối
        </Text>
      </TouchableOpacity>
          </View>
        ) : ( 
          <View style={styles.container}>
         
          <TouchableOpacity  style={{
            width: 280,
              height: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#456fe6",
            borderRadius: 10,
            marginHorizontal: SIZES.padding * 2,
          }} onPress={() => setVisible(true)}><Text style={{color:"white"}}>{dataInfo.statusFriend === "Bạn thường"  ?  "Bạn bè" : "Bạn thân"}</Text></TouchableOpacity>
      
    
          <Modal
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
          >
            <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
              <View style={styles.popup}>
              {
                dataInfo.statusFriend === "Bạn thường"   ? (
                  <TouchableOpacity style={styles.item} onPress={() => {
                    handleUpLevelF(
                      dataInfo.userId
                    );
                  }}>
                  <Text style={{color:colors.white, textAlign:"center"}}>Bạn thân</Text>
                </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.item} onPress={() => {
                    handleUpLevelF1(
                      dataInfo.userId
                    );
                  }}>
                  <Text style={{color:colors.white,textAlign:"center"}}>Bạn bè</Text>
                </TouchableOpacity>
                )
              }
             
                <TouchableOpacity style={styles.item} onPress={handleConfirm}>
                  <Text style={{color:colors.white, textAlign:"center"}}>Delete Friend</Text>
                </TouchableOpacity>
               
              </View>
            </TouchableOpacity>
          </Modal>
        </View>)}
     
            
      </View>
      </View>

      <View style={{ flex: 1, marginHorizontal: 22, marginTop: 20 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  item: {
    padding: 10,
    backgroundColor:"#456fe6",
     marginBottom:10,
      marginTop:10,
      borderRadius:5
  },
});
export default ProfileUsers
