import React, {Component,useEffect,useState} from 'react';
import {Text, View, StyleSheet, ScrollView, Image,ActivityIndicator,TouchableOpacity,Platform } from 'react-native';
import {colors} from '../../utils/configs/Colors';
import Feed from '../../components/Feed/Feed';
import Stories from '../../components/Feed/Stories';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR,idPostSimple
} from "../../recoil/initState";
import { setAuthToken, api} from "../../utils/helpers/setAuthToken"
import Spinner from "../../components/Spinner"
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from "react-native-vector-icons/Feather";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
export const FeedSimpleScreen = ({ navigation}) => {
  const [data, setData] = useState([]);
  const [dataInfo, setDataInfo] = useState([]);
  const [status, setStatus] = useState('idle');
  const [to, setToken] = useRecoilState(tokenState);
  const [likeRR, setLikeRR] = useRecoilState(likeR);
  const [load,setLoad] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(3);
  const navigation1 = useNavigation();
  const [idPostSimpleR,setIdPostSimple] = useRecoilState(idPostSimple)
  const onUserLogin = async (userID, userName, props) => {
    console.log(`User logged in with userID: ${userID}, userName: ${userName}`);
    return ZegoUIKitPrebuiltCallService.init(
      722062014, // You can get it from ZEGOCLOUD's console
      "46231991ad89a2dfa10ed17e8d900b182acba20c3425117595f07fb4ed734cbf", // You can get it from ZEGOCLOUD's console
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
      const response = await api.get(`https://www.socialnetwork.somee.com/api/post/${idPostSimpleR}`);
       console.log(response)
       const newData = response.data.data;
       setData(newData);
      setLoad(true)
      setStatus('success');
    } catch (error) {
      console.log(error)
      setStatus('error');
    }
    }
  
    // const intervalId = setInterval(fetchData, 1000); // Gọi fetchData mỗi giây một lần

    // // Hủy interval khi component unmount
    // return () => clearInterval(intervalId);
    fetchData();
  }, [likeRR,pageNumber]);

  const handleNotifi = () => {

    navigation1.navigate('Notifications')

  }
 

  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
        <Image
            style={styles.icon}
            source={require('../../assets/TKCTech.png')}
          />
          
          <View style={styles.headerRightWrapper}>
        
        
        
        <Feather name="search" size={30} color="black" style={{marginRight:10}}/>
        <AntDesign name="pluscircle" size={28} color="black"  style={{marginRight:10}}/>
        <TouchableOpacity onPress={handleNotifi}>
        <Ionicons name="notifications" size={30} color="black" />
      </TouchableOpacity>
      
          </View>
        </View>
        {/* <View style={styles.storiesWrapper}>
          <Stories />
        </View> */}
        {
          load == false ? (
            <Spinner></Spinner>
          ) : (
                <View style={styles.containerBody}>
       
          <ScrollView
            style={styles.feedContainer}
           
            scrollEventThrottle={400}
          >
            
              <View>
                <Feed data={data} />
              </View>
           
          
          </ScrollView>
       
      </View>
          )
        }
    
       

      </View>
    );
  }


export default FeedSimpleScreen;


export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  containerBody: {
    paddingBottom:130
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems:"center",
    justifyContent: 'space-between',
    padding: 10,
    paddingRight:20,
    paddingLeft:20,
    borderBottomColor: colors.gray1,
    borderBottomWidth: 1,
   
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
  },
  storiesWrapper: {
    backgroundColor: colors.gray1,
    borderBottomColor: colors.gray1,
    borderBottomWidth: 1,
  },
});
