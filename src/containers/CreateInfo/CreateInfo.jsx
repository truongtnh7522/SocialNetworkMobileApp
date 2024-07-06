import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  StyleSheet,
  Dimensions,
  FlatList
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
import Spinner from "../../components/Spinner";
const { height: windowHeight } = Dimensions.get('window');
const { width: windowWidth } = Dimensions.get('window');
const CreateInfoScreen = ({ navigation }) => {
  //
  const [selectedImage, setSelectedImage] = useState(imagesDataURL[1]);
  const [selectedImageBg, setSelectedImageBg] = useState(imagesDataURL[0]);
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
  
  const [dataProvide, setDataProvide] = useState([]);
  const [dataDistrict, setDataDistrict] =  useState([]);
  const [dataWard, setDataWard] =  useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict1, setSelectedDistrict1] = useState("01");
  const [selectedWard, setSelectedWard] = useState("01");

  const [nameCi, setNameCi] = useState("");
  const [nameDi, setNameDi] = useState("");
  const [nameWa, setNameWa] = useState("");
  const [visibleC, setVisibleC] = useState(false);
  const [visibleD, setVisibleD] = useState(false);
  const [visibleW, setVisibleW] = useState(false);
  const loadDataProvide = async () => {
    // Gọi API để lấy dữ liệu
    setAuthToken(to);
    await api
      .get(`https://truongnetwwork.bsite.net/api/Provinces/getAllProvinces`)
      .then((response) => {
        // Cập nhật dữ liệu vào state
        if (response.status === 200) {
       
          setSelectedCity(response.data.data[0].fullName)
          setDataProvide(response.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  };
  const loadDataDistrict = async () => {
    // Gọi API để lấy dữ liệu

    await api
      .get(
        `https://truongnetwwork.bsite.net/api/Provinces/getDistrictsByProvinceId/${selectedCity}`
      )
      .then((response) => {
        // Cập nhật dữ liệu vào state
        if (response.status === 200) {
          console.log(response.data);
          setDataDistrict(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    loadDataDistrict();
    // loadDataUserCmt();
  }, [selectedCity]);
  const loadDataWard = async () => {
    // Gọi API để lấy dữ liệu

    await api
      .get(
        `https://truongnetwwork.bsite.net/api/Provinces/getWardsByDistrictId/${selectedDistrict1}`
      )
      .then((response) => {
        // Cập nhật dữ liệu vào state
        if (response.status === 200) {
          console.log(response.data);
          setDataWard(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    loadDataWard();
  }, [selectedDistrict1]);
  useEffect(() => {
    loadDataProvide();
    // loadDataUserCmt();
  }, []);
  const startDate = getFormatedDate(
    today.setDate(today.getDate() + 1),
    "YYYY/MM/DD"
  );

const date = new Date();
const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

console.log(formattedDate); // Output: "2024/06/29"
  const [selectedStartDate, setSelectedStartDate] = useState(formattedDate);
  const [startedDate, setStartedDate] = useState(formattedDate);
    //
  const handleChangeStartDate = (propDate) => {
    setStartedDate(propDate);
  };

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };



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
  const handleImageBgSelection = async () => {
    let result = await ImagePicker.launchImageLibrary({

      mediaType: 'photo',

      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });


    if (!result.canceled) {
      setSelectedImageBg(result.assets[0].uri);
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
          FileBackground: selectedImageBg,
          Career: Career,
          Nickname: NickName,
        };
        console.log(data)
      const res = await api.post("https://truongnetwwork.bsite.net/api/infor/create", data,   {
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
  const [dayCurrent, setDayCurrent] = useState(formattedDate);
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
              minimumDate={null}
              maximumDate={dayCurrent}
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
const renderItem = ({ item }) => (
  <TouchableOpacity
    style={styles.item}
    onPress={() => {
      setSelectedCity(item.code);
      setNameCi(item.fullName);
      setVisibleC(false);
    }}
  >
    <Text style={{ color: "white", textAlign: "center" }}>{item.fullName}</Text>
  </TouchableOpacity>
);
  console.log(selectedCity,nameCi)
const renderCitySelection = () => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisibleC(true)}
        style={{
          borderWidth: 1,
          borderColor: COLORS.secondaryGray,
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 10,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
      <Text style={{ color: COLORS.black }}>
          {nameCi === "" ? "Provide" : nameCi}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={25} color={COLORS.white} />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={visibleC}>
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
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              width: "90%",
              maxHeight: "80%",
            }}
          >
            <Text
              style={{
                marginBottom: 15,
                textAlign: "center",
                color: COLORS.white,
              }}
            >
              Select City
            </Text>

            <FlatList
              data={dataProvide.data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{ width: "100%" }}
            />

            <TouchableOpacity
              onPress={() => setVisibleC(false)}
              style={{
                marginTop: 20,
                borderRadius: 20,
                padding: 10,
                elevation: 2,
                backgroundColor: COLORS.primary,
                borderColor: COLORS.primary,
                borderWidth: 1,
                width: 100,
                height: 50,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const renderItemD = ({ item }) => (
  
  <TouchableOpacity
    style={styles.item}
    onPress={() => {
      setSelectedDistrict1(item.code);
      setNameDi(item.fullName);
      setVisibleD(false);
    }}
  >
    <Text style={{ color: "white", textAlign: "center" }}>{item.fullName}</Text>
  </TouchableOpacity>
);
const renderCitySelectionD = () => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisibleD(true)}
        style={{
          borderWidth: 1,
          borderColor: COLORS.secondaryGray,
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 10,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
      <Text style={{ color: COLORS.black }}>
          {nameDi === "" ? "District" : nameDi}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={25} color={COLORS.white} />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={visibleD}>
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
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              width: "90%",
              maxHeight: "80%",
            }}
          >
            <Text
              style={{
                marginBottom: 15,
                textAlign: "center",
                color: COLORS.white,
              }}
            >
              Select District
            </Text>
              
            <FlatList
              data={dataDistrict.data}
              renderItem={renderItemD}
              keyExtractor={(item, index) => index.toString()}
              style={{ width: "100%" }}
            />

            <TouchableOpacity
              onPress={() => setVisibleD(false)}
              style={{
                marginTop: 20,
                borderRadius: 20,
                padding: 10,
                elevation: 2,
                backgroundColor: COLORS.primary,
                borderColor: COLORS.primary,
                borderWidth: 1,
                width: 100,
                height: 50,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const renderItemW = ({ item }) => (
  
  <TouchableOpacity
    style={styles.item}
    onPress={() => {
      setSelectedWard(item.code);
      setNameWa(item.fullName);
      setVisibleW(false);
    }}
  >
    <Text style={{ color: "white", textAlign: "center" }}>{item.fullName}</Text>
  </TouchableOpacity>
);
const renderCitySelectionW = () => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisibleW(true)}
        style={{
          borderWidth: 1,
          borderColor: COLORS.secondaryGray,
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 10,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <Text style={{ color: COLORS.black }}>
          {nameWa === "" ? "District" : nameWa}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={25} color={COLORS.white} />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={visibleW}>
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
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              width: "90%",
              maxHeight: "80%",
            }}
          >
            <Text
              style={{
                marginBottom: 15,
                textAlign: "center",
                color: COLORS.white,
              }}
            >
              Select Ward
            </Text>
              
            <FlatList
              data={dataWard.data}
              renderItem={renderItemW}
              keyExtractor={(item, index) => index.toString()}
              style={{ width: "100%" }}
            />

            <TouchableOpacity
              onPress={() => setVisibleW(false)}
              style={{
                marginTop: 20,
                borderRadius: 20,
                padding: 10,
                elevation: 2,
                backgroundColor: COLORS.primary,
                borderColor: COLORS.primary,
                borderWidth: 1,
                width: 100,
                height: 50,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
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

        <Text style={{ ...FONTS.h3 ,color:COLORS.black}} >Add Profile</Text>
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
            <Text style={{ ...FONTS.h4,color:COLORS.black }}>Name</Text>
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
                style={{color:COLORS.black}}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4,color:COLORS.black }}>Nick name</Text>
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
                style={{color:COLORS.black}}
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
            <Text style={{ ...FONTS.h4,color:COLORS.black }}>Phone</Text>
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
                style={{color:COLORS.black}}
              
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4,color:COLORS.black }}>Career</Text>
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
                style={{color:COLORS.black}}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4,color:COLORS.black }}>Date or Birth</Text>
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
            <Text style={{ color: COLORS.black }}>{selectedStartDate}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{ ...FONTS.h4,color:COLORS.black }}>WorkPlace</Text>
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
              style={{color:COLORS.black}}
            />
          </View>
        </View>
        {renderCitySelection()}
        {renderCitySelectionD()}
        {renderCitySelectionW()}
        <View
        style={{
          flexDirection: "column",
          marginBottom: 6,
        }}
      >
        <Text style={{ ...FONTS.h4,color:COLORS.black }}>Address</Text>
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
            style={{color:COLORS.black}}
          
          />
        </View>
      </View>
        <View
        style={{
          alignItems: "center",
          marginVertical: 22,
         
        }}
      >
     
        <TouchableOpacity onPress={handleImageBgSelection}>
        <View  style={{
          height: 150,
         width: windowWidth * 0.85,
          borderRadius:10,
          borderWidth: 1,
          borderColor: COLORS.primary,
          display:"flex",
          justifyContent:"center",
          alignItems:"center"
        }}>
        <Image
        source={{ uri: selectedImageBg }}
        style={{
          height: 150,
         width: 100,
       
  
        }}
         resizeMode="contain"
      />
        </View>

         
        </TouchableOpacity>
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
           Add Info
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
  selectedText: {
    
    fontSize: 18,
    color:"black",
    textAlign:"center"
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "100%",
    color: COLORS.white,
    marginBottom: 15,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
});

export default CreateInfoScreen;
