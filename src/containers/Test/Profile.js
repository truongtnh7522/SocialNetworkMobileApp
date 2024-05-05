import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES, images } from "../../constants";
import { StatusBar, ActivityIndicator ,Button,StyleSheet,ScrollView  } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { photos } from "../../constants/data";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRecoilState, useRecoilValue } from "recoil";
import {
  tokenState, likeR
} from "../../recoil/initState";
import { setAuthToken, api } from "../../utils/helpers/setAuthToken"
import Spinner from "../../components/Spinner"
const PhotosRoutes = ({ navigation }) => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={photos}
      numColumns={3}
      contentContainerStyle={{ paddingBottom: 100 }}
      renderItem={({ item, index }) => (
        <View
          style={{
            flex: 1,
            aspectRatio: 1,
            margin: 3,
          }}
        >
          <Image
            key={index}
            source={item}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
          />
        </View>
      )}
    />
  </View>
);

const FriendsRoutes = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [friendsPerPage] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          "https://www.socialnetwork.somee.com/api/Friend/getAll"
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

  const [to, setToken] = useRecoilState(tokenState);

  const [load, setLoad] = useState(false)
  useEffect(() => {
    const fetchDataInfo = async () => {

      setAuthToken(to)

      try {
        console.log(12)
        const response = await api.get('https://www.socialnetwork.somee.com/api/infor/myinfor');

        setDataInfo(response.data.data);
        console.log("s", response.data.data)
      } catch (error) {
        console.log(error)
        setStatus('error');
      }
    }
    fetchDataInfo()
  }, []);
  const Logout = () => {
    AsyncStorage.removeItem('token')
    navigation.navigate('Login')
  }
  const [routes] = useState([
    { key: "first", title: "Photos" },
    { key: "second", title: "Friends" },
  ]);
  useEffect(() => {
    setAuthToken(to)
    const fetchData = async () => {
      try {
        const id = dataInfo.userId;
        const response = await api.get(
          `https://www.socialnetwork.somee.com/api/post/user/${id}`
        );
        console.log(response);
        setLengthPost(response.data.data.length);
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
        `https://www.socialnetwork.somee.com/api/Friend/getAll`
      )
      .then((response) => {
        // Cập nhật dữ liệu vào state
        if (response.status === 200) {
          setLengthFriend(response.data.data.length);
          //setLoadData(true);
          console.log(response.data.data.length);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    loadDataFriend();
  }, []);
  console.log(dataPost)
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
          source={images.cover}
          resizeMode="cover"
          style={{
            height: 228,
            width: "100%",
          }}
        />
      </View>

      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={images.profile}
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
