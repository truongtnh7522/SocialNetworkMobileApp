import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    Modal,Button,StyleSheet
  } from "react-native";
  import React, { useState ,useEffect} from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import * as ImagePicker from "react-native-image-picker";
  import { COLORS, FONTS } from "../../constants";
  import  MaterialIcons  from "react-native-vector-icons/MaterialIcons";
  import { imagesDataURL } from "../../constants/data";
  import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
  import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR,LoadPage
} from "../../recoil/initState";
import { setAuthToken, api} from "../../utils/helpers/setAuthToken"
import Spinner from "../../components/Spinner";
import CheckBox from 'react-native-check-box';
import { colors } from "../../utils/configs/Colors";
import Sound from 'react-native-sound';

Sound.setCategory('Playback');
  const CreateReelsforScreen = ({ navigation }) => {
    const [selectedImage, setSelectedImage] = useState(imagesDataURL[0]);
    const [content, setContent] = useState("");
    const [isChecked, setIsChecked] = useState("1");
    const [to, setToken] = useRecoilState(tokenState);
    const [LoadPageR, setLoadPageR] = useRecoilState(LoadPage);
    const [load,setLoad] = useState(false)
    const [disableVoice, setDisableVoice] = useState(true);
    const [audio, setAudio] = useState([]);
    const [visible, setVisible] = useState(false);
    const today = new Date();
    useEffect(() => {
      const fetchAudio = async () => {
        try {
          setAuthToken(to);
          const res = await api.get("https://socialnetwork.somee.com/api/audio");
          setAudio(res.data.data);
          console.log(res);
        } catch (e) {
          console.log(e);
        }
      };
      fetchAudio();
    }, []);
    const handlePost = async () => {
      setLoad(true);
      setAuthToken(to);
      try {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("LevelVieW", isChecked);
        formData.append("audioId", audioID);
        let apiEndpoint = "";
    
        if (selectedImage) {
          const localUri = selectedImage;
          const filename = localUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const fileType = match ? match[1].toLowerCase() : null;
         
          if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') {
            // It's an image
            apiEndpoint = "https://socialnetwork.somee.com/api/real/MergeImageWithAudio";
            formData.append('file', {
              uri: localUri,
              name: filename,
              type: 'image/jpeg', // Change type based on actual file type if necessary
            });
            // Remove DisableVoice for images
          } else if (fileType === 'mp4' || fileType === 'mov' || fileType === 'avi') {
            // It's a video
            apiEndpoint = "https://socialnetwork.somee.com/api/real/MergeVideoWithAudio";
            formData.append('file', {
              uri: localUri,
              name: filename,
              type: 'video/mp4', // Change type based on actual file type if necessary
            });
            formData.append("DisableVoice", disableVoice); // Add DisableVoice for videos
       console.log(formData);

          }
        }
       
        const res = await api.post(apiEndpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
    
        if (res.status === 200) {
          setSelectedImage(imagesDataURL[0]);
          setContent("");
          setLoad(false);
          setLoadPageR(!LoadPageR);
        }
    
      } catch (error) {
        console.error("Add sai!", error);
      }
    };
    
    const handleImageSelection = async () => {
      let result = await ImagePicker.launchImageLibrary({
        mediaType: 'mixed',
        allowsEditing: true,
        quality: 1,
      });
    
    
     
  
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    };
  
    const [selectedMode, setSelectedMode] = useState(null);

    const handleModeSelect = (mode,number) => {
        setIsChecked(number)
      setSelectedMode(mode);
    };
    const [selectedItem, setSelectedItem] = useState("");
    const [audioSrc, setAudioSrc] = useState("");
    const [audioID, setAudioID] = useState("");
    const stopSound = () => {
      if (sound) {
        sound.stop(() => {
          console.log('Stop');
        });
      }
    };
    const handleMenuClick = (item: any) => {
      console.log(item.link);
      stopSound()
      setVisible(false)
      setSelectedItem(item.name);
      setAudioSrc(item.link);
      setAudioID(item.id);
    };
    const [sound, setSound] = useState(null);

    const playSound = () => {
      const sound = new Sound(audioSrc, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      });
      setSound(sound);
    };
  
  
    useEffect(() => {
     if(audioSrc !== "") {
      playSound();
     }
    },[audioSrc])
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
         
            paddingVertical:10,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              left: 0,
              top:10,
            }}
          >
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color="#456fe6"
            />
          </TouchableOpacity>
  
          <Text style={{ ...FONTS.h3 , color:"#333", fontWeight:800}}>Create Reels</Text>
        </View>
            
        <View>
        <ScrollView>
        
            
      
       
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
              marginTop:20
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
                value={content}
                onChangeText={(value) => setContent(value)}
                editable={true}
                multiline={true} // Cho phép nhập văn bản trên nhiều dòng
                numberOfLines={2}
                style={{
               paddingLeft:10,
               paddingRight:10
                }}
              />
            </View>
          </View>
         
          <View style={styles.container}>
          <TouchableOpacity onPress={() => setVisible(true)}  style={{
            backgroundColor: COLORS.primary,
            height: 36,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
            width:"100%"
          }}>
                <Text style={{color:"white"}}>Choose Audio</Text>
          </TouchableOpacity>
          <Text style={styles.selectedText}>Audio: {selectedItem}</Text>
    
          <Modal
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
          >
            <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
              <View style={styles.popup}>
              <TouchableOpacity style={styles.item} >
              <Text style={{color:colors.black, textAlign:"center",fontWeight:700,fontSize:20}}> Choose Audio</Text>
              </TouchableOpacity>
              {audio.map((item: any, index: number) => (
                <TouchableOpacity style={styles.item} key={index} onPress={() => handleMenuClick(item)}>
                <Text style={{color:colors.black, textAlign:"center"}}>  {item.name}</Text>
                </TouchableOpacity>
               
              ))}
               
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        <View
        style={{
          alignItems: "left",
     
        }}
      >  
       <Text style={{ ...FONTS.h5, marginBottom:10 }}>Image or Video</Text>
        <TouchableOpacity onPress={handleImageSelection} style={{  borderColor: COLORS.secondaryGray,
          borderWidth: 1,
          borderRadius: 4,
          paddingTop:10,
          paddingBottom:10,
          width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
        <View>
          <Image
            source={{ uri: selectedImage }}
            style={{
              height: 170,
              width: 170,
              
              borderWidth: 2,
              // borderColor: COLORS.primary,
            }}
            resizeMode="contain"
          />
          
         
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ display:"flex",flexDirection:"row", justifyContent: 'center', alignItems: 'center' , marginBottom:10}}>
      <Text style={{color:"#000000"}}>Disable Voice: </Text>
      <CheckBox
        style={{ flex: 1, padding: 10, color:colors.primaryBlue }}
        onClick={() => setDisableVoice(!disableVoice)}
        isChecked={disableVoice}
        rightText="Check me"
      
      />
      <Text>{isChecked ? "Checked" : "Unchecked"}</Text>
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
        onPress={() => handleModeSelect('mode1','1')}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff',  textAlign: 'center' }}>Công khai</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          marginHorizontal: 5,
          backgroundColor: selectedMode === 'mode2' ? '#007bff' : '#ccc',
          borderRadius: 5,  width:150,
        }}
        onPress={() => handleModeSelect('mode2','2')}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff',  textAlign: 'center'}}>Bạn bè</Text>
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
        {
          load === false ?  <Text
          style={{
            ...FONTS.body3,
            color: COLORS.white,
          }}
        >
          Save Change
        </Text> : <Spinner></Spinner>
        }
         
        </TouchableOpacity>

      
      </ScrollView>
        </View>
      </SafeAreaView>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   
    },
    selectedText: {
      marginTop: 20,
      fontSize: 18,
      color:"black",
      textAlign:"left"
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    popup: {
      width: 300,
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 1,
    },
    item: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
  });
  
  export default CreateReelsforScreen;
  