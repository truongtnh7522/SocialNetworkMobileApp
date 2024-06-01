import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  StyleSheet
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "react-native-image-picker";
import { COLORS, FONTS } from "../../constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { imagesDataURL } from "../../constants/data";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'react-native-base64';
import { setAuthToken, api } from "../../utils/helpers/setAuthToken"
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState, likeR } from "../../recoil/initState";
import { colors } from "react-native-elements";

const UpdateInfoScreen = ({ navigation }) => {
  const [myInfo, setMyInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(imagesDataURL[0]);
  const [to, setToken] = useRecoilState(tokenState);

  // State để lưu thông tin người dùng
  const [FullName, setFullName] = useState("");
  const [NickName, setNickName] = useState("");
  const [Gender, setGender] = useState(false);
  const [Career, setCareer] = useState("");
  const [WorkPlace, setWorkPlace] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Address, setAddress] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("01/01/1990");
  const [nameCi, setNameCi] = useState("Ho Chi Minh");
  const [nameDi, setNameDi] = useState("Thu Duc");
  const [nameWa, setNameWa] = useState("Linh Chieu");
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const today = new Date();
  const startDate = getFormatedDate(today.setDate(today.getDate() + 1), "YYYY/MM/DD");
  const [startedDate, setStartedDate] = useState("12/12/2023");
  const [selectedMode, setSelectedMode] = useState(null);

  const handleChangeStartDate = (propDate) => {
    setStartedDate(propDate);
  };

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

  // Hàm xử lý chọn ngày
  const handleDatePickerClose = () => {
    setOpenStartDatePicker(false);
  };

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const response = await api.get("https://socialnetwork.somee.com/api/infor/myinfor");

        if (response.status === 200) {
          const info = response.data.data;
          setMyInfo(info);
          // Set thông tin cũ vào các trường dữ liệu
          setFullName(info.fullName);
          setNickName(info.nickname);
          setGender(info.gender);
          if (info.gender==false){
            setSelectedMode("mode1")
          }else {
            setSelectedMode("mode2")
          }
          setCareer(info.career);
          setWorkPlace(info.workPlace);
          setPhoneNumber(info.phoneNumber);
          setAddress(info.direction);
          setSelectedStartDate(info.dateOfBirth);
          setSelectedImage(info.image); 

        } else {
          console.error("Error fetching my info:", response.status);
        }
      } catch (error) {
        console.error("Error fetching my info:", error);
      }
    };

    fetchMyInfo();
  }, []);

  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    setAuthToken(to);
    try {

      const formData = new FormData();
      formData.append("FullName", FullName);
      formData.append("WorkPlace", WorkPlace);
      formData.append("Gender", Gender);
      formData.append("PhoneNumber", PhoneNumber);
      formData.append("Direction", Address);
      formData.append("DateOfBirth", selectedStartDate);
      formData.append("Wards", nameWa);
      formData.append("Districts", nameDi);
      formData.append("Provinces", nameCi);
      formData.append("Career", Career);
      formData.append("Nickname", NickName);

      if (selectedImage) {
        const localUri = selectedImage;
        const filename = localUri.split('/').pop();
        formData.append('File', {
          uri: localUri,
          name: filename,
          type: 'image/jpeg',
        });
        formData.append('FileBackground', {
          uri: localUri,
          name: filename,
          type: 'image/jpeg',
        });
      }

      const res = await api.post("https://socialnetwork.somee.com/api/infor/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        console.log("okela")
        navigation.navigate('BottomTabNavigation');
      } else {
        console.log("Update failed:", res);
      }
    } catch (error) {
      console.error("Error updating info:", error);
    }
  };

  const handleModeSelect = (mode, g) => {
    setGender(g);
    setSelectedMode(mode);
  };

  function renderDatePicker() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={openStartDatePicker}
      >
        <View style={styles.modalContainer}>
          <View style={styles.datePickerContainer}>
            <DatePicker
              mode="calendar"
              minimumDate={startDate}
              selected={startedDate}
              onDateChanged={handleChangeStartDate}
              onSelectedChange={(date) => setSelectedStartDate(date)}
              options={{
                backgroundColor: COLORS.primary,
                textHeaderColor: "#469ab6",
                textDefaultColor: COLORS.white,
                selectedTextColor: COLORS.white,
                mainColor: "#469ab6",
                textSecondaryColor: COLORS.white,
                borderColor: "rgba(122,146,165,0.1)",
              }}
            />
            <TouchableOpacity onPress={handleDatePickerClose}>
              <Text style={{ ...FONTS.body3}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
        <Text style={{ ...FONTS.h3, color: COLORS.black }}>Edit Profile</Text>
      </View>
  
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleImageSelection}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.profileImage}
            />
            <View style={styles.cameraIconContainer}>
              <MaterialIcons
                name="photo-camera"
                size={32}
                color={COLORS.primary}
              />
            </View>
          </TouchableOpacity>
        </View>
  
        <View style={styles.formContainer}>
          <InputField label="Name" value={FullName} onChangeText={setFullName} />
          <InputField label="Nick name" value={NickName} onChangeText={setNickName} />
          
          <View style={styles.genderContainer}>
            <GenderButton
              title="Nam"
              selected={selectedMode === 'mode1'}
              onPress={() => handleModeSelect('mode1', false)}
            />
            <GenderButton
              title="Nữ"
              selected={selectedMode === 'mode2'}
              onPress={() => handleModeSelect('mode2', true)}
            />
          </View>
  
          <InputField label="Address" value={Address} onChangeText={setAddress}  style={{ color: "black" }}/>
          <InputField label="Phone" value={PhoneNumber} onChangeText={setPhoneNumber} />
          <InputField label="Career" value={Career} onChangeText={setCareer} />
          <DatePickerField
  label="Date of Birth"
  date={selectedStartDate ? selectedStartDate.split('T')[0].split('-').reverse().join('/') : ""}
  onPress={handleOnPressStartDate}
/>

          <InputField label="WorkPlace" value={WorkPlace} onChangeText={setWorkPlace} />
  
          <TouchableOpacity style={styles.saveButton} onPress={handlePost}>
            <Text style={{ ...FONTS.body3, color: COLORS.white }}>Save Change</Text>
          </TouchableOpacity>
        </View>
  
        {renderDatePicker()}
      </ScrollView>
    </SafeAreaView>
  );
  };
  
  const InputField = ({ label, value, onChangeText }) => (
    <View style={styles.inputFieldContainer}>
      <Text style={{ ...FONTS.h4, color: COLORS.black }}>{label}</Text>
      <View style={styles.inputField}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable
          style={{ color: "black" }}
          />
          </View>
        </View>
      );
      
      const GenderButton = ({ title, selected, onPress }) => (
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginHorizontal: 5,
            backgroundColor: selected ? '#007bff' : '#ccc',
            borderRadius: 5,
            width: 150,
          }}
          onPress={onPress}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>{title}</Text>
        </TouchableOpacity>
      );
      
      const DatePickerField = ({ label, date, onPress }) => (
        <View style={styles.inputFieldContainer}>
          <Text style={{ ...FONTS.h4, color: COLORS.black }}>{label}</Text>
          <TouchableOpacity
            onPress={onPress}
            style={styles.datePickerField}
          >
           <Text style={{color: "black"}}>{date}</Text>
          </TouchableOpacity>
        </View>
      );
      
      const styles = StyleSheet.create({
        safeAreaView: {
          color:"black",
          flex: 1,
          backgroundColor: COLORS.white,
        },
        header: {
          marginHorizontal: 12,
          flexDirection: "row",
          justifyContent: "center",
        },
        scrollView: {
          paddingHorizontal: 22,
        },
        imageContainer: {
          color:"black",
          alignItems: "center",
          marginVertical: 22,
        },
        profileImage: {
          height: 170,
          width: 170,
          borderRadius: 85,
          borderWidth: 2,
          borderColor: COLORS.primary,
        },
        cameraIconContainer: {
          position: "absolute",
          bottom: 0,
          right: 10,
          zIndex: 9999,
        },
        formContainer: {
          marginBottom: 30,
        },
        inputFieldContainer: {
          flexDirection: "column",
          marginBottom: 6,
        },
        inputField: {
          height: 44,
          width: "100%",
          borderColor: COLORS.secondaryGray,
          borderWidth: 1,
          borderRadius: 4,
          marginVertical: 6,
          justifyContent: "center",
          paddingLeft: 8,
        },
        genderContainer: {
          color:"black",
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: 30,
        },
        datePickerField: {
           color: "black" ,
          height: 44,
          width: "100%",
          borderColor: COLORS.secondaryGray,
          borderWidth: 1,
          borderRadius: 4,
          marginVertical: 6,
          justifyContent: "center",
          paddingLeft: 8,
        },
        saveButton: {
          backgroundColor: COLORS.primary,
          height: 44,
          borderRadius: 6,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20
        },
        modalContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        datePickerContainer: {
          margin: 20,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          padding: 35,
          width: "90%",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        },
      });
      
      export default UpdateInfoScreen;
  