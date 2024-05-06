import React from 'react';
import { Suspense } from 'react';
import { RecoilRoot } from "recoil";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatContextProvider } from './src/context/ChatContext';
import Login from './src/containers/LoginAndSignUp/LoginScreen';
import FeedScreen from './src/containers/Feed/FeedScreen';
import FeedSimpleScreen from './src/containers/FeedSimple/FeedSimpleScreen';
import EditInforScreen from './src/containers/Infor/EditInforScreen';
import CreatePostforScreen from './src/containers/CreatePost/CreatePost';
import RegisterScreen from './src/containers/LoginAndSignUp/RegisterScreen';
import BottomTabNav from './src/containers/Test/BottomTabNav';
import VertifyPinScreen from "./src/containers/LoginAndSignUp/VertifyPinScreen"
import Profile from './src/containers/Test/Profile';
import ProfileUsers from './src/containers/Test/ProfileUsers';
import CreateInfoScreen from './src/containers/CreateInfo/CreateInfo';
import ChatMessagesScreen from "./src/components/ChatMessagesScreen/ChatMessagesScreen";
import Comment from "./src/containers/Comment/Comment"
import Notifications from "./src/containers/Notifications/Notifications"
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
const Stack = createStackNavigator();



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
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="BottomTabNavigation" component={BottomTabNav} options={{ headerShown: false }} />
            <Stack.Screen name="FeedScreen" component={FeedScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FeedSimpleScreen" component={FeedSimpleScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditInforScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreateInfo" component={CreateInfoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreatePost" component={CreatePostforScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VertifyPinScreen" component={VertifyPinScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatMessagesScreen" component={ChatMessagesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Comment" component={Comment} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileUsers" component={ProfileUsers} options={{ headerShown: false }} />
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
        </NavigationContainer>
      </RecoilRoot>

    </ChatContextProvider>
  );
};

const Root = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={console.log("load")}>
        <App />

      </Suspense>
    </RecoilRoot>
  );
};

export default Root;
