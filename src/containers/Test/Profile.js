import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
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
import Background from './../../components/LoginAndSignUp/Background';

// console.log("data",photos.data?.[0].images?.[0].linkImage)
const PhotosRoutes = ({ navigation }) => {
  const navigation1 = useNavigation();
  const [photos,setPhotos] = useRecoilState(photosR)
  console.log(photos)
  const [idPostSimpleR,setIdPostSimple] = useRecoilState(idPostSimple)
  const handleGetPost = (id) => {
    console.log(id)
    setIdPostSimple(id)
     navigation1.navigate('FeedSimpleScreen')
  }
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
            source={{ uri: photos.data?.[index].images[0].linkImage }} 
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          "https://socialnetwork.somee.com/api/Friend/getAll"
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
              <View key={index} style={styles1.friendContainer}>
                <Image
                  source={{ uri: friend.image }} // Nếu avatar là URL
                  style={styles1.avatar}
                />
                <Text>{friend.fullName ? friend.fullName : "Unknown"}</Text>
              </View>
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
const Profile = ({ navigation }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [dataInfo, setDataInfo] = useState([]);
  const [lengthFriend, setLengthFriend] = useState(0);
  const [loadData, setLoadData] = useState(false);
  const [lengthPost, setLengthPost] = useState(0);
  const [dataPost, setData] = useState([]);
  const [idUserR, setidUsersR] = useRecoilState(idUsers);

  const [to, setToken] = useRecoilState(tokenState);

  const [load, setLoad] = useState(false)
  const [photos,setPhotos] = useRecoilState(photosR)
  useEffect(() => {
    const fetchDataInfo = async () => {

      setAuthToken(to)

      try {
       
        const response = await api.get('https://socialnetwork.somee.com/api/infor/myinfor');

        setDataInfo(response.data.data);
        // console.log("s", response.data.data)
      } catch (error) {
      
        setStatus('error');
      }
    }
    fetchDataInfo()
  }, []);
  const Logout = () => {
    AsyncStorage.removeItem('token')
    setToken("")
    navigation.navigate('LoginScreen')
  }
  const [routes] = useState([
    { key: "first", title: "Photos" },
    { key: "second", title: "Friends" },
  ]);
  useEffect(() => {
    setAuthToken(to)
    const fetchData = async () => {
      try {
        const id =  dataInfo.userId ;
        const response = await api.get(
          `https://socialnetwork.somee.com/api/post/user/${id}`
        );
         console.log("DataPOst User", id);
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
  }, [dataInfo.userId]);
  const loadDataFriend = async () => {
    // Gọi API để lấy dữ liệu

    await api
      .get(
        `https://socialnetwork.somee.com/api/Friend/getAll`
      )
      .then((response) => {
        // Cập nhật dữ liệu vào state
        if (response.status === 200) {
          setLengthFriend(response.data.data.length);
       
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    loadDataFriend();
  }, []);
  console.log("data",photos.data)
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
              color:"#333"
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

        <View style={{ flexDirection: "row" }}>
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
            onPress={() => navigation.navigate('CreateInfo')}
          >
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.white,
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>




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
            onPress={Logout}
          >
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.white,
              }}
            >
              Log out
            </Text>
          </TouchableOpacity>

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

export default Profile
