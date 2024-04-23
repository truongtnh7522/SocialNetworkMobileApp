import React from 'react'
import Background from '../../components/LoginAndSignUp/Background'
import Logo from '../../components/LoginAndSignUp/Logo'
import Header from '../../components/LoginAndSignUp/Header'
import Button from '../../components/LoginAndSignUp/Button'
import Paragraph from '../../components/LoginAndSignUp/Paragraph'

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>KTC Social NetWork</Header>
      <Paragraph>
        The easiest way to start with your amazing application.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
    </Background>
  )
}
