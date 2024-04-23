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
import  MaterialIcons  from "react-native-vector-icons/MaterialIcons";
import { imagesDataURL } from "../../constants/data";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import  {decode }  from 'react-native-base64';
import { setAuthToken, api} from "../../utils/helpers/setAuthToken"
import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR
} from "../../recoil/initState";
const CreateInfoScreen = ({ navigation }) => {
  //
  const [selectedImage, setSelectedImage] = useState(imagesDataURL[0]);
  const [to, setToken] = useRecoilState(tokenState);
  const [name, setName] = useState("Melissa Peters");

  const [FullName, setFullName] = useState("");
const [NickName, setNickName] = useState("");
const [Gender, setGender] = useState(false);
const [Career, setCareer] = useState("");
const [WorkPlace, setWorkPlace] = useState("");
const [PhoneNumber, setPhoneNumber] = useState("");
const [Address, setAddress] = useState("");
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const today = new Date();
  
const [nameCi, setNameCi] = useState("Ho Chi Minh");
const [nameDi, setNameDi] = useState("Thu Duc");
const [nameWa, setNameWa] = useState("Linh Chieu");
  const startDate = getFormatedDate(
    today.setDate(today.getDate() + 1),
    "YYYY/MM/DD"
  );
  const [selectedStartDate, setSelectedStartDate] = useState("01/01/1990");
  const [startedDate, setStartedDate] = useState("12/12/2023");
    //
  const handleChangeStartDate = (propDate) => {
    setStartedDate(propDate);
  };

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };



  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

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
      formData.append("DateOfBirth", today);
      formData.append("Wards", nameWa);
      formData.append("Districts", nameDi);
      formData.append("Provinces", nameCi);
      formData.append("Career", Career);
      formData.append("Nickname", NickName);
  
      if (selectedImage) {
        const localUri = selectedImage;
        const filename = localUri.split('/').pop();

        // Thêm thông tin hình ảnh vào formData
        formData.append('File', {
          uri: localUri,
          name: filename,
          type: 'image/jpeg', // Đổi loại hình ảnh tùy thuộc vào định dạng của file
        });
      }
      if (selectedImage) {
        const localUri = selectedImage;
        const filename = localUri.split('/').pop();

        // Thêm thông tin hình ảnh vào formData
        formData.append('FileBackground', {
          uri: localUri,
          name: filename,
          type: 'image/jpeg', // Đổi loại hình ảnh tùy thuộc vào định dạng của file
        });
      }
   
      const data = {
        //  UserId: UserId,
          FullName: FullName,
          WorkPlace: WorkPlace,
          Gender: Gender,
          PhoneNumber: PhoneNumber,
          File: selectedImage,
          Direction: Address,
          DateOfBirth: today,
          Wards: nameWa,
          Districts: nameDi,
          Provinces: nameCi,
          FileBackground: selectedImage,
          Career: Career,
          Nickname: NickName,
        };
        console.log(data)
      const res = await api.post("https://www.socialnetwork.somee.com/api/infor/create", data,   {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if(res.status == 200) {
        navigation.navigate('BottomTabNavigation')
      }
      console.log("het qua: ", res)
    } catch (error) {
      console.log("Add sai!", error);
    }
  };
  function renderDatePicker() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={openStartDatePicker}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
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
            }}
          >
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

            <TouchableOpacity onPress={handleOnPressStartDate}>
              <Text style={{ ...FONTS.body3, color: COLORS.white }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  const [selectedMode, setSelectedMode] = useState(null);
  const handleModeSelect = (mode,g) => {
    setGender(g)
  setSelectedMode(mode);
  // Thực hiện hành động tương ứng với việc chọn chế độ
};
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
       
      }}
    >
      <View
        style={{
          marginHorizontal: 12,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            left: 0,
          }}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={24}
            color={COLORS.black}
          />
        </TouchableOpacity> */}

        <Text style={{ ...FONTS.h3 }} >Add Profile</Text>
      </View>

      <ScrollView style={{
      
      paddingHorizontal: 22,
    }}>
        <View
          style={{
            alignItems: "center",
            marginVertical: 22,
           
          }}
        >
          <TouchableOpacity onPress={handleImageSelection}>
            <Image
              source={{ uri: selectedImage }}
              style={{
                height: 170,
                width: 170,
                borderRadius: 85,
                borderWidth: 2,
                borderColor: COLORS.primary,
              }}
            />

            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 10,
                zIndex: 9999,
              }}
            >
              <MaterialIcons
                name="photo-camera"
                size={32}
                color={COLORS.primary}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>Name</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={FullName}
                onChangeText={(value) => setFullName(value)}
                editable={true}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>Nick name</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={NickName}
                onChangeText={(value) => setNickName(value)}
                editable={true}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom:30 }}>
      <TouchableOpacity
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          marginHorizontal: 5,
          backgroundColor: selectedMode === 'mode1' ? '#007bff' : '#ccc',
          borderRadius: 5,
          width:150,
          
        }}
        onPress={() => handleModeSelect('mode1',false)}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff',  textAlign: 'center' }}>Nam</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          marginHorizontal: 5,
          backgroundColor: selectedMode === 'mode2' ? '#007bff' : '#ccc',
          borderRadius: 5,  width:150,
        }}
        onPress={() => handleModeSelect('mode2',true)}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff',  textAlign: 'center'}}>Nữ</Text>
      </TouchableOpacity>
    </View>
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>Address</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={Address}
                onChangeText={(value) => setAddress(value)}
                editable={true}
              
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>Phone</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={PhoneNumber}
                onChangeText={(value) => setPhoneNumber(value)}
                editable={true}
              
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>Career</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={Career}
                onChangeText={(value) => setCareer(value)}
                editable={true}

              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>Date or Birth</Text>
            <TouchableOpacity
              onPress={handleOnPressStartDate}
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <Text>{selectedStartDate}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{ ...FONTS.h4 }}>WorkPlace</Text>
          <View
            style={{
              height: 44,
              width: "100%",
              borderColor: COLORS.secondaryGray,
              borderWidth: 1,
              borderRadius: 4,
              marginVertical: 6,
              justifyContent: "center",
              paddingLeft: 8,
            }}
          >
            <TextInput
              value={WorkPlace}
              onChangeText={(value) => setWorkPlace(value)}
              editable={true}
            />
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            height: 44,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
            marginBottom:20
          }}
          onPress={handlePost}
        >
          <Text
            style={{
              ...FONTS.body3,
              color: COLORS.white,
            }}
          >
            Save Change
          </Text>
        </TouchableOpacity>

        {renderDatePicker()}
      </ScrollView>
    </SafeAreaView>
  );
};
export const styles = StyleSheet.create({
 
  feedContainer: {
    display: 'flex',
  },

});

export default CreateInfoScreen;
