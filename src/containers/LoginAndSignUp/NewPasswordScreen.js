import React, { useState } from 'react';
import axios from 'axios';
import Background from '../../components/LoginAndSignUp/Background';
import BackButton from '../../components/LoginAndSignUp/BackButton';
import Logo from '../../components/LoginAndSignUp/Logo';
import Header from '../../components/LoginAndSignUp/Header';
import TextInput from '../../components/LoginAndSignUp/TextInput';
import Button from '../../components/LoginAndSignUp/Button';
import { useRoute } from '@react-navigation/native';
export default function NewPasswordScreen({ navigation }) {
  const route = useRoute();
  const email = route.params.email;  // Retrieve email from route parameters
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });

  const handlePasswordChange = async () => {
    if (password.value !== confirmPassword.value) {
      setConfirmPassword({ ...confirmPassword, error: "Passwords don't match" });
      return;
    }
console.log(email.value, password.value, confirmPassword.value)
    try {
      await axios.post('https://socialnetwork.somee.com/api/auth/changePasswordForgotPassword', {
        email: email.value,
        password: password.value,
      });
      navigation.navigate('LoginScreen');
    } catch (error) {
      // Handle error appropriately, maybe set an error message in the state
      setPassword({ ...password, error: 'Failed to change password. Please try again.' });
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create New Password</Header>
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        autoCapitalize="none"
        autoCompleteType="password"
        textContentType="password"
        secureTextEntry
      />
      <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={confirmPassword.value}
        onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
        error={!!confirmPassword.error}
        errorText={confirmPassword.error}
        autoCapitalize="none"
        autoCompleteType="password"
        textContentType="password"
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={handlePasswordChange}
        style={{ marginTop: 16 }}
      >
        Change Password
      </Button>
    </Background>
  );
}
