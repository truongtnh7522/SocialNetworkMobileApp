
import { Text } from 'react-native-paper'
import Background from '../../components/LoginAndSignUp/Background'
import Logo from '../../components/LoginAndSignUp/Logo'
import Header from '../../components/LoginAndSignUp/Header'
import Button from '../../components/LoginAndSignUp/Button'
import TextInput from '../../components/LoginAndSignUp/TextInput'
import BackButton from '../../components/LoginAndSignUp/BackButton'
import { theme } from '../../theme/LoginAndSignUp/theme'
import { useRecoilState, useRecoilValue } from "recoil";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emailValidator } from '../../utils/helpers/emailValidator'
import { passwordValidator } from '../../utils/helpers/passwordValidator'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import * as Keychain from 'react-native-keychain';
import { AxiosContext } from '../../context/AxiosContext';
import {

  tokenState,
} from "../../recoil/initState";
import axios from 'axios'

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

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [to, setToken] = useRecoilState(tokenState);
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const [token2, setToken2] = useState('');
  const [token3, setToken3] = useState('');
  const publicAxios = axios.create({
    baseURL: 'https://www.socialnetwork.somee.com/api',
  });
  useEffect(() => {
    AsyncStorage.getItem('token')
      .then(token => {
        if (token !== null) {

          setToken3(token)

        } else {
          setToken3("")
        }
      })
      .catch(error => {
        console.log('Error retrieving token:', error);
      });
    console.log("Toke la", token3)
    if (token3 !== "") {
      navigation.navigate('BottomTabNavigation')
    }

  }, [])

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
  const handleLogin = () => {
    fetch('https://www.socialnetwork.somee.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from login:', data);
        const token = data.data.data.jwtToken;

        AsyncStorage.setItem('token', token)
          .then(() => {

            // Sau khi đã lưu token vào AsyncStorage, bạn cần lấy lại giá trị token từ AsyncStorage
            return AsyncStorage.getItem('token');
          })
          .then(token1 => {
            // Ở đây bạn nhận được giá trị token đã được lưu vào AsyncStorage

            setToken2(token1 || ''); // Gán giá trị token1 vào state
          })
          .catch(error => {
            console.log(error);
          });
        console.log("Info: ", data.data.data.hasInfor)
        setToken(token)

        onUserLogin(email, email).then(() => {
          // Jump to HomeScreen to make new call
          navigation.navigate('BottomTabNavigation', { email });
        })

        // console.log(to)
        if (data.data.data.hasInfor == false) {
          console.log(123)
          navigation.navigate('CreateInfo')

        } else {
          navigation.navigate('BottomTabNavigation')
        }
        // if (data.success == 200) {

        //   navigation.navigate('BottomTabNavigation')
        //   // setLoggedIn(true); // Đăng nhập thành công
        // } else {
        //   navigation.navigate('BottomTabNavigation')
        // }
      })
      .catch(error => {
        console.error('Error:', error);
        // Xử lý lỗi ở đây
        setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      });
  };




  return (
    <Background>
      <BackButton />
      <Logo />
      <Header>Welcome back.</Header>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email}
        onChangeText={(text) => setEmail(text)}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password}
        onChangeText={(text) => setPassword(text)}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity

        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
export default Login;  