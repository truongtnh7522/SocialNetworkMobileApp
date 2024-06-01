import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "react-native-image-picker";
import { COLORS, FONTS } from "../../constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { imagesDataURL } from "../../constants/data";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState, likeR, LoadPage } from "../../recoil/initState";
import { setAuthToken, api } from "../../utils/helpers/setAuthToken";
import Spinner from "../../components/Spinner";
import Toast from 'react-native-toast-message';
import Video from 'react-native-video';

const CreatePostforScreen = ({ navigation }) => {
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [content, setContent] = useState("");
  const [isChecked, setIsChecked] = useState("1");
  const [to, setToken] = useRecoilState(tokenState);
  const [LoadPageR, setLoadPageR] = useRecoilState(LoadPage);
  const [load, setLoad] = useState(false);
  const today = new Date();

  const handlePost = async () => {
      setLoad(true);
      setAuthToken(to);
      try {
          const formData = new FormData();
          formData.append("Content", content);
          formData.append("LevelVieW", isChecked);

          selectedMedia.forEach((media, index) => {
              const localUri = media.uri;
              const filename = localUri.split('/').pop();
              const fileType = media.type.startsWith("image") ? "image/jpeg" : "video/mp4";

              formData.append('File', {
                  uri: localUri,
                  name: filename,
                  type: fileType,
              });
          });

          const res = await api.post("https://truongnetwwork.bsite.net/api/post", formData, {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
          });

          if (res.status === 200) {
              Toast.show({
                  type: 'success',
                  text1: 'Create Post Successfully',
                  visibilityTime: 2000,
              });
              setSelectedMedia([]);
              setContent("");
              setLoad(false);
              setLoadPageR(!LoadPageR);
          }

      } catch (error) {
          Toast.show({
              type: 'error',
              text1: 'Create Post Failed',
              visibilityTime: 2000,
          });
          console.error("Add failed!", error);
      }
  };

  const handleMediaSelection = async () => {
      let result = await ImagePicker.launchImageLibrary({
          mediaTypes: 'mixed',
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
          selectionLimit: 0, // allows multiple selections
      });

      if (!result.canceled) {
          setSelectedMedia(result.assets);
      }
  };

  const [selectedMode, setSelectedMode] = useState(null);

  const handleModeSelect = (mode, number) => {
      setIsChecked(number);
      setSelectedMode(mode);
  };

  return (
      <SafeAreaView
          style={{
              flex: 1,
              backgroundColor: COLORS.white,
              paddingHorizontal: 22,
          }}
      >
          <View
              style={{
                  paddingVertical: 10,
                  flexDirection: "row",
                  justifyContent: "center",
              }}
          >
              <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{
                      position: "absolute",
                      left: 0,
                      top: 10,
                  }}
              >
                  <MaterialIcons
                      name="keyboard-arrow-left"
                      size={24}
                      color="#456fe6"
                  />
              </TouchableOpacity>

              <Text style={{ ...FONTS.h3, color: "#333", fontWeight: 800 }}>Create Post</Text>
          </View>

          <View>
              <ScrollView>
                  <View
                      style={{
                          flexDirection: "column",
                          marginBottom: 6,
                          marginTop: 20,
                      }}
                  >
                      <Text style={{ ...FONTS.h5 }}>Content</Text>
                      <View
                          style={{
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
                              placeholder="Hãy nhập suy nghĩ của bạn"
                              placeholderTextColor="gray"
                              value={content}
                              onChangeText={(value) => setContent(value)}
                              editable={true}
                              multiline={true} // Allow multiline text input
                              numberOfLines={2}
                              style={{
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                  color: 'black'
                              }}
                          />
                      </View>
                  </View>

                  <View
                      style={{
                          alignItems: "left",
                          marginVertical: 22,
                      }}
                  >
                      <Text style={{ ...FONTS.h5, marginBottom: 10 }}>Image or Video</Text>
                      <TouchableOpacity onPress={handleMediaSelection} style={{ borderColor: COLORS.secondaryGray,
                          borderWidth: 1,
                          borderRadius: 4,
                          paddingTop: 10,
                          paddingBottom: 10,
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                      }}>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {selectedMedia.length === 0 ? (
                        <Image
                            source={{ uri: "https://ung-dung.com/images/upanh_online/upanh.png" }}
                            style={{
                                height: 100,
                                width: 100,
                            }}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {selectedMedia.map((media, index) => (
                          <View key={index} style={{ margin: 5 }}>
                              {media.type.startsWith("image") ? (
                                  <Image
                                      source={{ uri: media.uri }}
                                      style={{
                                          height: 100,
                                          width: 100,
                                      }}
                                      resizeMode="contain"
                                  />
                              ) : (
                                  <Video
                                      source={{ uri: media.uri }}
                                      style={{
                                          height: 100,
                                          width: 100,
                                      }}
                                      resizeMode="contain"
                                      controls={true}
                                  />
                              )}
                          </View>
                      ))}
                        </View>
                        )}
                      </View>
                  </View>
                  
                      </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 30 }}>
                      <TouchableOpacity
                          style={{
                              paddingHorizontal: 20,
                              paddingVertical: 10,
                              marginHorizontal: 5,
                              backgroundColor: selectedMode === 'mode1' ? '#007bff' : '#ccc',
                              borderRadius: 5,
                              width: 150,
                          }}
                          onPress={() => handleModeSelect('mode1', '1')}
                      >
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Công khai</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          style={{
                              paddingHorizontal: 20,
                              paddingVertical: 10,
                              marginHorizontal: 5,
                              backgroundColor: selectedMode === 'mode2' ? '#007bff' : '#ccc',
                              borderRadius: 5,
                              width: 150,
                          }}
                          onPress={() => handleModeSelect('mode2', '2')}
                      >
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Bạn bè</Text>
                      </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                      style={{
                          backgroundColor: COLORS.primary,
                          height: 44,
                          borderRadius: 6,
                          alignItems: "center",
                          justifyContent: "center",
                      }}
                      onPress={handlePost}
                  >
                      {load === false ? (
                          <Text
                              style={{
                                  ...FONTS.body3,
                                  color: COLORS.white,
                              }}
                          >
                              Save Change
                          </Text>
                      ) : (
                          <Spinner />
                      )}
                  </TouchableOpacity>
              </ScrollView>
          </View>
          <Toast ref={(ref) => Toast.setRef(ref)} />
      </SafeAreaView>
  );
};

export default CreatePostforScreen;
