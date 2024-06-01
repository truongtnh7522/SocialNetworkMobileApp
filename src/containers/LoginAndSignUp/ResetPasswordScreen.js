import React, { useState } from 'react';
import axios from 'axios';
import Background from '../../components/LoginAndSignUp/Background';
import BackButton from '../../components/LoginAndSignUp/BackButton';
import Logo from '../../components/LoginAndSignUp/Logo';
import Header from '../../components/LoginAndSignUp/Header';
import TextInput from '../../components/LoginAndSignUp/TextInput';
import Button from '../../components/LoginAndSignUp/Button';
import { emailValidator } from '../../utils/helpers/emailValidator';

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' });

  const sendResetPasswordEmail = async () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    try {
      await axios.post('https://truongnetwwork.bsite.net/api/auth/sendPinforgotPassword', {
        email: email.value,
      });
      navigation.navigate('VertifyPinPwScreen', { email: email });
    } catch (error) {
      // Handle error appropriately, maybe set an error message in the state
      setEmail({ ...email, error: 'Failed to send reset email. Please try again.' });
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Restore Password</Header>
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="You will receive email with password reset link."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Send Instructions
      </Button>
    </Background>
  );
}
