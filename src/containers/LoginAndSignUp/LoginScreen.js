
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
  TouchableOpacity,Dimensions
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import * as Keychain from 'react-native-keychain';
import { AxiosContext } from '../../context/AxiosContext';
import {

  tokenState,
} from "../../recoil/initState";
import axios from 'axios'
import Spinner from '../../components/Spinner'

const { height: windowHeight } = Dimensions.get('window');
const { width: windowWidth } = Dimensions.get('window');
const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [to, setToken] = useRecoilState(tokenState);
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const [token2, setToken2] = useState('');
  const [token3, setToken3] = useState('');
  const [load, setLoad] = useState(true);
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
    console.log("Toke la", token3.length)
    if (token3 !== "") {
      navigation.navigate('BottomTabNavigation')
    }

  }, [token3])

 
  const handleLogin = () => {
    setLoad(false)
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
      .then( async  (data) => {
        console.log('Response from login:', data);
        const token = data.data.data.jwtToken;

        await  AsyncStorage.setItem('token', token)
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

        setLoad(true)

        // console.log(to)
        if (data.data.data.hasInfor == false) {
          console.log(123)
          navigation.navigate('CreateInfo')

        } else {
          if( data.data.data.role?.[0] === "Admin")
            {
              navigation.navigate('AdCategory')
            }
            else {
              navigation.navigate('BottomTabNavigation')
            }
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
    <View style={{backgroundColor:"#333", height: windowHeight *1 ,
    width: windowWidth * 1,}}>
     
      <Background>
     
      <Logo />
      <Header>Welcome back</Header>

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
      {
        load == true ?   <Button mode="contained"  onPress={handleLogin}>
        Login
      </Button> : <Button mode="contained" >
      <Spinner></Spinner>
    </Button>
      }
    
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
    
    </View>
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