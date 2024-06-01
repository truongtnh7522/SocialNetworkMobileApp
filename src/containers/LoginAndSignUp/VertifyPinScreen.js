import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import Background from '../../components/LoginAndSignUp/Background';
import Logo from '../../components/LoginAndSignUp/Logo';
import Header from '../../components/LoginAndSignUp/Header';
import Button from '../../components/LoginAndSignUp/Button';
import BackButton from '../../components/LoginAndSignUp/BackButton';
import { theme } from '../../theme/LoginAndSignUp/theme';

export default function VertifyPinScreen({ navigation }) {
  const route = useRoute();
  const email = route.params.email;
  const [pin, setPin] = useState(Array(6).fill(''));
  const pinInputRefs = Array(6).fill().map(() => useRef(null));

  const onPinInputChange = (index, value) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < pinInputRefs.length - 1) {
      pinInputRefs[index + 1].current.focus();
    }
  };
  const handleKeyPress = (index, key) => {
    if (key === 'Backspace' && pin[index] === '') {
      if (index > 0) {
        pinInputRefs[index - 1].current.focus();
      }
    }
  };
  const onVerifyPressed = () => {
    const body = {
      email: email.value,
      pin: pin.join('')
    };
    console.log(body)
    fetch('https://truongnetwwork.bsite.net/api/auth/VerifyPin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (response.ok) {
          console.log('Verification successful');
        } else {
          console.log('Verification failed');
        }
      })
      .catch(error => {
        console.error('Error calling VerifyPin API:', error);
      });
  };
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Pin Code</Header>
      <View style={styles.pinContainer}>
        {pin.map((_, i) => (
          <TextInput
            key={i}
            style={styles.pinInput}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={value => onPinInputChange(i, value)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
            ref={pinInputRefs[i]}
          />
        ))}
      </View>
      <Button mode="contained" onPress={onVerifyPressed} style={{ marginTop: 24 }}>
        Verify
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    alignSelf: 'center',
    marginBottom: 24,
  },
  pinInput: {
    width: '15%',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
    textAlign: 'center',
    color:'black',
    fontSize: 24,
  },
});
