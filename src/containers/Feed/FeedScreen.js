import React, {Component,useEffect,useState} from 'react';
import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import {colors} from '../../utils/configs/Colors';
import Feed from '../../components/Feed/Feed';
import Stories from '../../components/Feed/Stories';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR
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

export const FeedScreen = ({ navigation}) => {
  const [data, setData] = useState([]);
  const [dataInfo, setDataInfo] = useState([]);
  const [status, setStatus] = useState('idle');
  const [to, setToken] = useRecoilState(tokenState);
  const [likeRR, setLikeRR] = useRecoilState(likeR);
  const [load,setLoad] = useState(false)

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

  useEffect(() => {
    const fetchData = async () => {

      setAuthToken(to)
     
    try {
      const responseInfor = await api.get('https://www.socialnetwork.somee.com/api/infor/myinfor');
   onUserLogin(responseInfor.data.data.fullName,responseInfor.data.data.fullName)
      const response = await api.get('https://www.socialnetwork.somee.com/api/post?numberOfPosts=10');
      // console.log(response)
      setData(response.data.data);
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
    fetchData()
  }, [likeRR]);



    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.icon}
            source={require('../../assets/images/camera.jpg')}
          />
          <Image
            style={styles.logo}
            source={require('../../assets/images/instagramLogo.png')}
          />
          <View style={styles.headerRightWrapper}>
            <Image
              style={styles.icon}
              source={require('../../assets/images/igtv.png')}
            />
            <Image
              style={styles.icon}
              source={require('../../assets/images/message.jpg')}
            />
          </View>
        </View>
        <View style={styles.storiesWrapper}>
          <Stories />
        </View>
        <View>
          {
            load === false ? (
              <ScrollView style={styles.feedContainer}>
              <Spinner/>
              </ScrollView>
            ) : (
              <ScrollView style={styles.feedContainer}>
              {
                data.map((item,index) => (
                  <View key={index}>
                    <Feed data= {item}/>
                  </View>
                ))
              }
          
               
              </ScrollView>
            )
          }
        </View>
       
      
      </View>
    );
  }


export default FeedScreen;

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: colors.gray1,
    borderBottomWidth: 1,
    marginTop:15
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
    width: 40,
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
