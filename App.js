
import { Suspense } from 'react';
import { RecoilRoot } from "recoil";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatContextProvider } from './src/context/ChatContext';
import LoginScreen from './src/containers/LoginAndSignUp/LoginScreen';
import FeedScreen from './src/containers/Feed/FeedScreen';
import FeedSimpleScreen from './src/containers/FeedSimple/FeedSimpleScreen';
import EditInforScreen from './src/containers/Infor/EditInforScreen';
import CreatePostforScreen from './src/containers/CreatePost/CreatePost';
import CreateReelsforScreen from './src/containers/CreateReels/CreateReels';
import RegisterScreen from './src/containers/LoginAndSignUp/RegisterScreen';
import ResetPasswordScreen from './src/containers/LoginAndSignUp/ResetPasswordScreen';
import NewPasswordScreen from './src/containers/LoginAndSignUp/NewPasswordScreen';
import BottomTabNav from './src/containers/Test/BottomTabNav';
import VertifyPinScreen from "./src/containers/LoginAndSignUp/VertifyPinScreen"
import VertifyPinPwScreen from "./src/containers/LoginAndSignUp/VertifyPinPwScreen"
import Profile from './src/containers/Test/Profile';
import ManagePost from './src/containers/Test/ManagePost';
import ManageUser from './src/containers/Test/ManageUser';
import AdCategory from './src/containers/Test/AdCategory';
import ProfileUsers from './src/containers/Test/ProfileUsers';
import CreateInfoScreen from './src/containers/CreateInfo/CreateInfo';
import UpdateInfoScreen from './src/containers/UpdateInfo/UpdateInfo';
import ChatMessagesScreen from "./src/components/ChatMessagesScreen/ChatMessagesScreen";
import Comment from "./src/containers/Comment/Comment"
import Notifications from "./src/containers/Notifications/Notifications"
import Toast from 'react-native-toast-message';
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
import { View, Text, ActivityIndicator,Image } from 'react-native';
import React, { useState, useEffect } from 'react';
const Stack = createStackNavigator();


const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:"white", position:"relative" }}>
  <Image
 
  source={require('./src/assets/LogoLoad.png')}
/>
  <Text style={{bottom:20,position:"absolute", color:"#456fe6", fontWeight:"600", right:115}}>KTC SOCIAL NETWORK</Text>
  </View>
);
const onUserLogout = async () => {
  return ZegoUIKitPrebuiltCallService.uninit()
}

const App = () => {
  return (
    <ChatContextProvider>
      <RecoilRoot>

        <NavigationContainer>
          <ZegoCallInvitationDialog />
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BottomTabNavigation" component={BottomTabNav} options={{ headerShown: false }} />
            <Stack.Screen name="FeedScreen" component={FeedScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FeedSimpleScreen" component={FeedSimpleScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditInforScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreateInfo" component={CreateInfoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreatePost" component={CreatePostforScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreateReels" component={CreateReelsforScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VertifyPinScreen" component={VertifyPinScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatMessagesScreen" component={ChatMessagesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Comment" component={Comment} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileUsers" component={ProfileUsers} options={{ headerShown: false }} />
            <Stack.Screen name="AdCategory" component={AdCategory} options={{ headerShown: false }} />
            <Stack.Screen name="ManagePost" component={ManagePost} options={{ headerShown: false }} />
            <Stack.Screen name="ManageUser" component={ManageUser} options={{ headerShown: false }} />
            <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VertifyPinPwScreen" component={VertifyPinPwScreen} options={{ headerShown: false }} />
            <Stack.Screen name="UpdateInfo" component={UpdateInfoScreen} options={{ headerShown: false }} />
            <Stack.Screen
              options={{ headerShown: false }}
              // DO NOT change the name 
              name="ZegoUIKitPrebuiltCallWaitingScreen"
              component={ZegoUIKitPrebuiltCallWaitingScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              // DO NOT change the name
              name="ZegoUIKitPrebuiltCallInCallScreen"
              component={ZegoUIKitPrebuiltCallInCallScreen}
            />
          </Stack.Navigator>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </RecoilRoot>

    </ChatContextProvider>
  );
};


const Root = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a 5-second loading delay
    const timer = setTimeout(() => {
       setLoading(false);
    }, 5000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <RecoilRoot>
      <Suspense fallback={<LoadingScreen />}>
        <App />
      </Suspense>
    </RecoilRoot>
  );
};

export default Root;
