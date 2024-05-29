import React, {Component,useEffect,useState,useRef } from 'react';
import {Text, View, StyleSheet, ScrollView, Image,ActivityIndicator,TouchableOpacity ,Dimensions} from 'react-native';
import {colors} from '../../utils/configs/Colors';
import Feed from '../../components/Feed/Feed';
import FeedShare from '../../components/FeedShare/FeedShare';
import Stories from '../../components/Feed/Stories';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR,LoadPage,isUpdatePost,isUpdateReels,isSharePost
} from "../../recoil/initState";
import { setAuthToken, api} from "../../utils/helpers/setAuthToken"
import Spinner from "../../components/Spinner"

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
import getReels from "../../utils/api/getReelsAPI"
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Video from 'react-native-video';
const { height: windowHeight } = Dimensions.get('window');
export const FeedScreen = ({ navigation}) => {
  const [data, setData] = useState([]);
  const [dataInfo, setDataInfo] = useState([]);
  const [status, setStatus] = useState('idle');
  const [to, setToken] = useRecoilState(tokenState);
  const [likeRR, setLikeRR] = useRecoilState(likeR);
  const [LoadPageR, setLoadPageR] = useRecoilState(LoadPage);
  const [load,setLoad] = useState(false);
  const [isUpdateReelsR, setIsUpdateReels] = useRecoilState(isUpdateReels);
  const [loadingMore, setLoadingMore] = useState(false);
  const [modePost, setModePost] = useState(true)
  const [pageNumber, setPageNumber] = useState(15);
  const [isUpdatePostR, setSsUpdatePost] = useRecoilState(isUpdatePost);
  const [isSharePostR, setIsSharePostR] = useRecoilState(isSharePost);
  const navigation1 = useNavigation();
  const onUserLogin = async (userID, userName, props) => {
  
    return ZegoUIKitPrebuiltCallService.init(
      67139489, // You can get it from ZEGOCLOUD's 
      "9deb90808df9aa343a7c4c982b3b51527759169f15b93d3c1830872c01b4c6db", // You can get it from ZEGOCLOUD's console
      userID, // It can be any valid characters, but we recommend using a phone number.
      userName,
      [ZIM, ZPNs],
      {
          ringtoneConfig: {
              incomingCallFileName: 'zego_incoming.mp3',
              outgoingCallFileName: 'zego_outgoing.mp3',
          },
          androidNotificationConfig: {
              channelID: "ZegoUIKit",
              channelName: "ZegoUIKit",
          },
      });
  }
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
  useEffect(() => {
    const fetchData = async () => {

      setAuthToken(to)
     
    try {
      const responseInfor = await api.get('https://www.socialnetwork.somee.com/api/infor/myinfor');
      const fullName = responseInfor.data.data.fullName;
      const fullNameWithoutDiacriticsAndSpaces = removeDiacriticsAndSpaces(fullName);
      
      onUserLogin(fullNameWithoutDiacriticsAndSpaces, fullNameWithoutDiacriticsAndSpaces);
      const response = await api.get(`https://www.socialnetwork.somee.com/api/post?numberOfPosts=${pageNumber}`);
    
       const newData = response.data.data;
       setData(newData);
      setLoad(true)
      setStatus('success');
    } catch (error) {
   
      setStatus('error');
    }
    }
  
    // const intervalId = setInterval(fetchData, 1000); // Gọi fetchData mỗi giây một lần

    // // Hủy interval khi component unmount
    // return () => clearInterval(intervalId);
    fetchData();
  }, [likeRR,pageNumber,LoadPageR]);

  const handleNotifi = () => {

    navigation1.navigate('Notifications')

  }
  const handleCreateReels = () => {
    navigation1.navigate('CreateReels')

  }
  const handleSearch = () => {
    navigation1.navigate('Search')

  }
  const [reels, setReels] = useState([]);
  useEffect(() => {
    getReels().then((data) => setReels(data));
  }, [isUpdateReelsR]);
  useEffect(() => {
    if (isUpdatePostR === false) {
     const fetchData = async () => {
      try {
      
        const response = await api.get(`https://www.socialnetwork.somee.com/api/post?numberOfPosts=${pageNumber}`);
      
         const newData = response.data.data;
         setData(newData);
             
      setSsUpdatePost(true);
      } catch (error) {
     
        console.log(error)
      }
     }
     fetchData()
    }
  }, [isUpdatePostR]);
  useEffect(() => {
    if (isSharePostR === false) {
      console.log(2929292)
     const fetchDataShare = async () => {
      try {
        const pageNumberS = pageNumber + 1;
        const response = await api.get(`https://www.socialnetwork.somee.com/api/post?numberOfPosts=${pageNumberS}`);
        console.log(111111)
         const newData = response.data.data;
         setData(newData);
             
         setIsSharePostR(true);
      } catch (error) {
     
        console.log(error)
      }
     }
     fetchDataShare()
    }
  }, [isSharePostR]);
  const handleLoadMore = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      setPageNumber(prevPageNumber => prevPageNumber + 2);
    }
  };

  const renderFooter = () => {
    return loadingMore ? <ActivityIndicator size="large" color={colors.primary} /> : null;
  };
  
    return (
      <View style={styles.container}>
      <View style={styles.header}>
      <Image
          style={styles.icon}
          source={require('../../assets/TKCTech.png')}
        />
        
        <View style={styles.headerRightWrapper}>
      
      
        <TouchableOpacity onPress={handleSearch}>
      <Feather name="search" size={30} color="black" style={{marginRight:10}}/></TouchableOpacity>
      <TouchableOpacity onPress={handleCreateReels}>
      <AntDesign name="pluscircle" size={28} color="black"  style={{marginRight:10}}/>  
    </TouchableOpacity>
      <TouchableOpacity onPress={handleNotifi}>
      <Ionicons name="notifications" size={30} color="black" />
    </TouchableOpacity>
    
        </View>
      </View>
      <View style={styles.headerSe}>

    <TouchableOpacity onPress={() => setModePost(true)} style={[styles.containerSe ,modePost && { borderBottomWidth: 1, borderBottomColor: colors.primaryBlue }]}>  
      <Text style={{color:"#333",fontWeight:600}}>Posts</Text>
   </TouchableOpacity>
    <View style={{width:3,height:40,backgroundColor:"#f9f9f9"}}>
    <Text style={{color:"#333",}}></Text>
  </View>
  <TouchableOpacity onPress={() => setModePost(false)} style={[styles.containerSe ,!modePost && { borderBottomWidth: 1, borderBottomColor: colors.primaryBlue }]}>  
      <Text style={{color:"#333",fontWeight:600}}>Reels</Text>
   </TouchableOpacity>
      
      </View>
      { 
        modePost === true ?  <View style={styles.container}>
        {
          load === false ? <Spinner></Spinner> :     
          <View >
         
            <ScrollView
            style={[ {display: 'flex',
            marginBottom: loadingMore ? 80 : 20 }]}
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  handleLoadMore();
                }
              }}
              scrollEventThrottle={400}
            >
              {data.map((item, index) => (
                <View key={index}>
                {item.idShare === undefined ? (
                   <Feed data={item} />
                 
                ) : (
                  <FeedShare data={item} />
                )}
                </View>
               
              ))}
              {renderFooter()}
            </ScrollView>
         
        </View>
        }
        </View> : <View style={[styles.container, {paddingBottom:50}]}>
        <View >
        <ScrollView
        style={[ {paddingBottom:30,display: 'flex',
        marginBottom:0,}]}
       
        scrollEventThrottle={400}
      >
        {reels?.data?.map((item, index) => (
          <VideoPlayer data={item} key={index}/>
        ))}
        </ScrollView>
        </View>
        </View>
      }
     
      
       
      
      </View>
    );
  }


export default FeedScreen;
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 40;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};
const VideoPlayer = (data) => {
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef(null);
  const [videos, setVideos] = useState(data.videos);
  const [userId, setUserId] = useState(null);
  const [isUpdateReelsR, setIsUpdateReels] = useRecoilState(isUpdateReels);
  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const handleDeleteReel = async (reelId) => {
    try {
     
      const responseDelete = await api.post(`https://socialnetwork.somee.com/api/real/DeleteReels?reelIds=${reelId}`);
      console.log(responseDelete)
      if (responseDelete.status === 200) {
        // Remove video from local state
        setIsUpdateReels(!isUpdateReelsR)
        console.log('Video deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseInfor = await api.get('https://socialnetwork.somee.com/api/infor/myinfor');
        const userId = responseInfor.data.data.userId;
        setUserId(userId);

        const video = videoRef.current;
        if (video) {
          console.log(data.data.content);
          setPaused(false);
        }
        console.log(data.data.userId, "and", userId);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchData();

    return () => {
      if (videoRef.current) {
        setPaused(true);
      }
    };
  }, [data]); // Ensure the effect runs when `data` changes
 

  return (
    <View style={[styles.containerBodyVideo,{display:"flex", flex:1,justifyContent:"center", alignItems:"center", backgroundColor:"#000000", borderBottomColor:"#fff",borderBottomWidth:1}]}>
      <Video
        ref={videoRef}
        source={{ uri:data.data.videos[0].link }}
        style={styles.video}
        paused={paused}
        muted={muted}
        resizeMode="contain"
      />
      <View style={styles.controls}>
        <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
          <Ionicons name={paused ? 'play' : 'pause'} size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
          <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={30} color="#fff" />
        </TouchableOpacity>
        {data.data.userId === userId && ( // Only show close button if userId matches
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleDeleteReel(data.data.id)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

        )}
      </View>
      <View style={styles.controlsContent}>
      <View style={styles.headerWrapper}>
      
        <Text style={styles.headerContent}> {data.data.content}</Text>
    
     
    </View>
    </View>
      <View style={styles.controlsName}>
      <View style={styles.headerWrapper}>
      <TouchableOpacity style={styles.headerLeftWrapper} >
        <Image
          style={styles.profileThumb}
          source={{uri: data.data.avatarUrl}}
        />
        <Text style={styles.headerTitle}> {data.data.fullName}</Text>
      </TouchableOpacity>
     
    </View>
    </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  profileThumb: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerLeftWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color:"#fff",
    marginLeft:10
  },
  headerContent: {
    fontSize: 22,
    fontWeight: '500',
    color:"#fff",
    marginLeft:10
  },
  feedImage: {
    width: '100%',
  },
  container: {
    display: 'flex',
    flex: 1,
  },
  containerBody: {
    height: windowHeight * 0.8
  },
  containerBodyVideo: {
    height: windowHeight * 0.82
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
  containerSe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    height:"100%"
  },
  headerSe: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height:40,
   
    borderBottomColor: colors.gray1,
    borderBottomWidth: 1,
    
     backgroundColor:"#fff"
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    bottom: 0,
    justifyContent: 'space-between',
    padding: 10,
    borderTopColor: colors.gray1,
    borderTopWidth: 1,
  },
  feedContainer: {
    display: 'flex',
    marginBottom:80,
  },
  icon: {
    width: 100,
    height: 40,
  },
  logo: {
    width: 150,
    height: '100%',
  },
  headerRightWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:"center",
    alignItems:"center"
  },
  storiesWrapper: {
    backgroundColor: colors.gray1,
    borderBottomColor: colors.gray1,
    borderBottomWidth: 1,
  },
  containerV: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  video: {
    width: "100%",
    height: 300,
  },
  controls: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    justifyContent: 'start',
    width: '100%',
  },
  controlsName: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'start',
    width: '100%',
  },
  controlsContent: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    justifyContent: 'start',
    width: '100%',
  },
  controlButton: {
    padding: 10,
    backgroundColor:"#676767",
    borderRadius: 99999,
    marginLeft:20
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure it's on top of other elements
  },
});
