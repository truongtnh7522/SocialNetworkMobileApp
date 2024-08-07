import React, { useEffect, useState ,forwardRef, useRef} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Dimensions } from 'react-native';
import { colors } from '../../utils/configs/Colors';
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState, likeR, idPost, idUsers, isUpdatePost, idPostSimple ,UpdatePost2,loadUpdateInfo} from "../../recoil/initState";
import { setAuthToken, api } from "../../utils/helpers/setAuthToken"
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import DropDownPicker from 'react-native-dropdown-picker';
import Sound from 'react-native-sound';
import Toast from 'react-native-toast-message';
import Video from 'react-native-video';
const { height: windowHeight } = Dimensions.get('window');
const { width: windowWidth } = Dimensions.get('window');

const FeedShare = ({ data }, ref) => {
  const [likeRR, setLikeRR] = useRecoilState(likeR);
  const [to, setToken] = useRecoilState(tokenState);
  const [idPostR, setidPostR] = useRecoilState(idPost);
  const [idUserR, setidUsersR] = useRecoilState(idUsers);
  const [isUpdatePostR, setSsUpdatePost] = useRecoilState(isUpdatePost);
  const [UpdatePost2R, setUpdatePost2R] = useRecoilState(UpdatePost2);
  const [idUser, setIdUser] = useState("");
  const [content, setContent] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleShare, setVisibleShare] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [dataInfo, setDataInfo] = useState([]);
  const [contentShare, setContentShare] = useState("");
  const [levelViewShare, setLevelViewShare] = useState("1");
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("1");
  const [items, setItems] = useState([
    { label: 'Công khai', value: '1' },
    { label: 'Bạn bè', value: '2' },
  ]);
  const [loadUpdateInfoR, setloadUpdateInfoR] = useRecoilState(loadUpdateInfo);
  useEffect(() => {
    setAuthToken(to);
    const fetchInfo = async () => {
      try {
        const responseInfor = await api.get('https://truongnetwwork.bsite.net/api/infor/myinfor');
        if(loadUpdateInfoR=== false) {
          setloadUpdateInfoR(true)
         
        }
    
        setDataInfo(responseInfor.data.data);
        setIdUser(responseInfor.data.data.userId);
      } catch (e) {
        console.log(e);
      }
    };
    fetchInfo();
  }, [loadUpdateInfoR]);

  const handleLike = async () => {
    setAuthToken(to);
    try {
      const id = data.idShare;
      await api.post(`https://truongnetwwork.bsite.net/api/like/${id}`).then((response) => {
        if (response.status === 200) {
          setLikeRR(!likeRR);
        }
      }).catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleCmt = () => {
    setidPostR(data.idShare);
    navigation.navigate('Comment');
  };

  const [idPostSimpleR, setIdPostSimple] = useRecoilState(idPostSimple);
  const handleNavigatePost = () => {
    setIdPostSimple(data.id);
    navigation.navigate('FeedSimpleScreen');
  };

  const handleNavigate = () => {
    if (data.userIdSharePost === idUser) {
      navigation.navigate('Profile');
    } else {
      setidUsersR(data.userIdSharePost);
      navigation.navigate('ProfileUsers');
    }
  };

  const [imageBig, setImageBig] = useState("");
  const handleImage = (img) => {
    console.log(img)
    setVisible(true);
    setImageBig(img);
  };

  const hanldDltShare = async () => {
    setAuthToken(to);
    return api.delete(`https://truongnetwwork.bsite.net/api/post/share/delete?shareId=${data.idShare}`).then((res) => {

      if (res.status === 200) {
        setSsUpdatePost(false);
        Toast.show({
          type: 'success',
          text1: 'Delete Share Successfully',
          visibilityTime: 2000, 
        });
      }
    }).catch((err) => {
      Toast.show({
        type: 'error',
        text1: 'Delete Share Failed',
        visibilityTime: 2000, 
      });
      console.log(err)});
  };

  const handleEdit = () => {
    setContentShare(data.contentShare);
    setLevelViewShare(data.levelViewShare.toString());
    setVisibleEdit(true);
  };

  const handleSaveEdit = async () => {
    setAuthToken(to);
    try {


      await api.put("https://truongnetwwork.bsite.net/api/post/share/update", {
        shareId: data.idShare,
        Content: contentShare,
        LevelView: levelViewShare,
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((response) => {
        if (response.status === 200) {
        
          setUpdatePost2R(false);
          setVisibleEdit(false);
          Toast.show({
            type: 'success',
            text1: 'Update Share Successfully',
            visibilityTime: 2000, 
          });
        }
      }).catch((error) => {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Update Share Failed',
          visibilityTime: 2000, 
        });
      });
    } catch (error) {
      console.error("Update failed", error);
    }
  };
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef(null);
  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity style={styles.headerLeftWrapper} onPress={handleNavigate}>
          <Image
            style={styles.profileThumb}
            source={{ uri: data.avatarUrlShare }}
          />
          <Text style={styles.headerTitle}> {data.fullNameShare}</Text>
        </TouchableOpacity>

        {idUser === data.userIdSharePost && (
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={styles.headerLeftWrapper} onPress={handleEdit}>
              <AntDesign name="edit" size={20} color="#456fe6" style={{ marginRight: 10 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerLeftWrapper} onPress={hanldDltShare}>
              <AntDesign name="closecircleo" size={20} color="#456fe6" style={{ marginRight: 10 }} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={{ marginBottom: 10, paddingLeft: 10 }}>
        <Text style={styles.headerTitle}>{data.contentShare}</Text>
      </Text>
      <View>
        <View style={{ paddingHorizontal: 10 }}>
          {data.images.length === 2 &&  data.videos.length === 0  ? (
            <View style={styles.container2}>
              {data.images.map((item, index) => (
                <TouchableOpacity onPress={() => handleImage(item)} key={index} style={styles.imageContainer}>
                  <Image
                  style={styles.image}
                    resizeMode="cover"
                    source={{ uri: item.linkImage }}
                  />
                  <Modal
                    transparent={true}
                    visible={visible}
                    onRequestClose={() => setVisible(false)}
                  >
                    <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
                      <Image
                        style={{ width: windowWidth * 0.8, height: "auto", aspectRatio: 1 }}
                        resizeMode="contain"
                        source={{ uri: imageBig }}
                      />
                    </TouchableOpacity>
                  </Modal>
                </TouchableOpacity>
              ))}
            </View>
          ) :
          data.images.length === 3 &&  data.videos.length === 0 ? (
            <View style={styles.container2}>
            <View style={styles.container3}>
            <TouchableOpacity onPress={() => handleImage(data.images[0].linkImage)} style={styles.imageContainer}>
            <Image
            style={styles.image}
              resizeMode="cover"
              source={{ uri: data.images[0].linkImage }}
            />
            <Modal
              transparent={true}
              visible={visible}
              onRequestClose={() => setVisible(false)}
            >
              <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
                <Image
                style={styles.image}
                  resizeMode="contain"
                  source={{ uri: imageBig }}
                />
              </TouchableOpacity>
            </Modal>
          </TouchableOpacity>
          <View style={styles.container4}>
            <TouchableOpacity onPress={() => handleImage(data.images[1].linkImage)}  style={styles.imageContainer}>
            <Image
            style={styles.image}
              resizeMode="cover"
              source={{ uri: data.images[1].linkImage }}
            />
            <Modal
              transparent={true}
              visible={visible}
              onRequestClose={() => setVisible(false)}
            >
              <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
                <Image
                  style={{ width: windowWidth * 0.8, height: "auto", aspectRatio: 1 }}
                  resizeMode="contain"
                  source={{ uri: imageBig }}
                />
              </TouchableOpacity>
            </Modal>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImage(data.images[2].linkImage)}  style={styles.imageContainer}>
          <Image
          style={styles.image}
            resizeMode="cover"
            source={{ uri: data.images[2].linkImage }}
          />
          <Modal
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
          >
            <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
              <Image
                style={{ width: windowWidth * 0.8, height: "auto", aspectRatio: 1 }}
                resizeMode="contain"
                source={{ uri: imageBig }}
              />
            </TouchableOpacity>
          </Modal>
        </TouchableOpacity>
            </View>
            </View>
           
          </View>
          ) :
          data.images.length === 3 &&  data.videos.length !== 0 ? (
            <View>
            <View >
            {
              data.videos.map((item, index) => ( 
                <View style={[styles.containerBodyVideo2,{display:"flex", flex:1,justifyContent:"center", alignItems:"center", backgroundColor:"#000000", borderBottomColor:"#fff",borderBottomWidth:1}]}>
                <Video
                paused={paused}
            muted={muted}
                ref={videoRef}
                source={{ uri: data.videos[index].link }}
                style={{ flex: 1, aspectRatio: 1 }}
                resizeMode="contain"
              />
              <View style={styles.controls}>
            <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
              <Ionicons name={paused ? 'play' : 'pause'} size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
              <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={30} color="#fff" />
            </TouchableOpacity>
           
          </View>
          </View>
              ))
            }
           
          </View>
            <View style={styles.container2}>
            <View style={styles.container3}>
            <TouchableOpacity onPress={() => handleImage(data.images[0].linkImage)} style={styles.imageContainer}>
            <Image
            style={styles.image}
              resizeMode="cover"
              source={{ uri: data.images[0].linkImage }}
            />
            <Modal
              transparent={true}
              visible={visible}
              onRequestClose={() => setVisible(false)}
            >
              <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
                <Image
                style={styles.image}
                  resizeMode="contain"
                  source={{ uri: imageBig }}
                />
              </TouchableOpacity>
            </Modal>
          </TouchableOpacity>
          <View style={styles.container4}>
            <TouchableOpacity onPress={() => handleImage(data.images[1].linkImage)}  style={styles.imageContainer}>
            <Image
            style={styles.image}
              resizeMode="cover"
              source={{ uri: data.images[1].linkImage }}
            />
            <Modal
              transparent={true}
              visible={visible}
              onRequestClose={() => setVisible(false)}
            >
              <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
                <Image
                  style={{ width: windowWidth * 0.8, height: "auto", aspectRatio: 1 }}
                  resizeMode="contain"
                  source={{ uri: imageBig }}
                />
              </TouchableOpacity>
            </Modal>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImage(data.images[2].linkImage)}  style={styles.imageContainer}>
          <Image
          style={styles.image}
            resizeMode="cover"
            source={{ uri: data.images[2].linkImage }}
          />
          <Modal
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
          >
            <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
              <Image
                style={{ width: windowWidth * 0.8, height: "auto", aspectRatio: 1 }}
                resizeMode="contain"
                source={{ uri: imageBig }}
              />
            </TouchableOpacity>
          </Modal>
        </TouchableOpacity>
            </View>
            </View>
           
          </View></View>
          ) : data.images.length === 2 &&  data.videos.length !== 0  ?
          (
            <View>
            <View >
            {
              data.videos.map((item, index) => ( 
                <View style={[styles.containerBodyVideo2,{display:"flex", flex:1,justifyContent:"center", alignItems:"center", backgroundColor:"#000000", borderBottomColor:"#fff",borderBottomWidth:1}]}>
                <Video
                paused={paused}
            muted={muted}
                ref={videoRef}
                source={{ uri: data.videos[index].link }}
                style={{ flex: 1, aspectRatio: 1 }}
                resizeMode="contain"
              />
              <View style={styles.controls}>
            <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
              <Ionicons name={paused ? 'play' : 'pause'} size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
              <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={30} color="#fff" />
            </TouchableOpacity>
           
          </View>
          </View>
              ))
            }
           
          </View>
            <View style={styles.container2}>
            {data.images.map((item, index) => (
              <TouchableOpacity onPress={() => handleImage(item.linkImage)} key={index} style={styles.imageContainer}>
                <Image
                style={styles.image}
                  resizeMode="cover"
                  source={{ uri: item.linkImage }}
                />
                <Modal
                  transparent={true}
                  visible={visible}
                  onRequestClose={() => setVisible(false)}
                >
                  <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
                    <Image
                      style={{ width: windowWidth * 0.8, height: "auto", aspectRatio: 1 }}
                      resizeMode="contain"
                      source={{ uri: imageBig }}
                    />
                  </TouchableOpacity>
                </Modal>
              </TouchableOpacity>
            ))}
          </View></View>
          ) : data.videos.length !== 0 ? ( 
            <View style={[styles.containerBodyVideo,{display:"flex", flex:1,justifyContent:"center", alignItems:"center", backgroundColor:"#000000", borderBottomColor:"#fff",borderBottomWidth:1}]}>
            <Video
            paused={paused}
        muted={muted}
            ref={videoRef}
            source={{ uri: data.videos[0].link }}
            style={{ flex: 1, aspectRatio: 1 }}
            resizeMode="contain"
          />
          <View style={styles.controls}>
        <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
          <Ionicons name={paused ? 'play' : 'pause'} size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
          <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={30} color="#fff" />
        </TouchableOpacity>
       
      </View>
      </View>
          )
          : (
            data.images.map((item, index) => (
              <TouchableOpacity onPress={() => handleImage(item.linkImage)} key={index}>
                <Image
                  style={{ flex: 1, aspectRatio: 1 }}
                  resizeMode="cover"
                  source={{ uri: item.linkImage }}
                />
                <Modal
                  transparent={true}
                  visible={visible}
                  onRequestClose={() => setVisible(false)}
                >
                  <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
                    <Image
                      style={{ width: windowWidth * 1, height: "auto", aspectRatio: 1 }}
                      resizeMode="contain"
                      source={{ uri: item.linkImage }}
                    />
                  </TouchableOpacity>
                </Modal>
              </TouchableOpacity>
            ))
          )}
          <View style={styles.headerWrapper3}>
            <TouchableOpacity style={styles.headerLeftWrapper} onPress={handleNavigatePost}>
              <Image
                style={styles.profileThumb}
                source={{ uri: data.avatarUrl }}
              />
              <Text style={styles.headerTitle}> {data.fullName}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.feedImageFooter}>
        <View style={styles.feddimageFooterLeftWrapper}>
          <TouchableOpacity onPress={handleLike}>
            <Feather name="heart" size={30} color="pink" style={{ marginRight: 10 }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.container1}
            onPress={handleCmt}
          >
            <Octicons name="comment" size={30} color="#456fe6" style={{ marginRight: 10 }} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.container1}
          onPress={() => setVisibleShare(true)}
        >
          <AntDesign name="sharealt" size={30} color="#456fe6" style={{ marginRight: 10 }} />
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={visibleShare}
        onRequestClose={() => setVisibleShare(false)}
      >
        <TouchableOpacity style={styles.modalBackground} onPress={() => setVisibleShare(false)}>
          <View style={styles.popup}>
            <View style={styles.headerWrapper1}>
              <View style={styles.headerLeftWrapper}>
                <Image
                  style={styles.profileThumb}
                  source={{ uri: dataInfo.image }}
                />
                <View>
                  <Text style={styles.headerTitle}> {dataInfo.fullName}</Text>
                </View>
              </View>
              <View style={styles.headerLeftWrapper1}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter content"
                  value={content}
                  onChangeText={(text) => setContent(text)}
                />
              </View>
              <View style={styles.headerLeftWrapper2}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#456fe6",
                    height: 34,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white" }}>Save Change</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.headerLeftWrapper2}>
                <View style={styles.containerS}>
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={styles.dropdown}
                    placeholder="Công khai"
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        transparent={true}
        visible={visibleEdit}
        onRequestClose={() => setVisibleEdit(false)}
      >
        <TouchableOpacity style={styles.modalBackground} onPress={() => setVisibleEdit(false)}>
          <View style={styles.popup}>
            <View style={styles.headerWrapper1}>
              <View style={styles.headerLeftWrapper}>
                <Image
                  style={styles.profileThumb}
                  source={{ uri: dataInfo.image }}
                />
                <View>
                  <Text style={styles.headerTitle}> {dataInfo.fullName}</Text>
                </View>
              </View>
              <View style={styles.headerLeftWrapper1}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter content"
                  value={contentShare}
                  onChangeText={(text) => setContentShare(text)}
                />
              </View>
              <View style={styles.headerLeftWrapper2}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#456fe6",
                    height: 34,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={handleSaveEdit}
                >
                  <Text style={{ color: "white" }}>Save Change</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.headerLeftWrapper2}>
                <View style={styles.containerS}>
                  <DropDownPicker
                    open={open}
                    value={levelViewShare}
                    items={items}
                    setOpen={setOpen}
                    setValue={setLevelViewShare}
                    setItems={setItems}
                    style={styles.dropdown}
                    placeholder="Công khai"
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <View style={styles.underLineWRapper}>
        <View style={styles.underLine} />
      </View>
      <View style={styles.likesAndCommentsWrapper}>
        <Feather name="heart" size={20} color="pink" style={{ marginRight: 10 }} />
        <Text style={styles.likesTitle}> {data.countLikeShare} Likes</Text>
      </View>
      <View style={styles.likesAndCommentsWrapper}></View>
      <Toast ref={ref} />
    </View>
  );
};

export default forwardRef(FeedShare);

export const styles = StyleSheet.create({
  containerBodyVideo: {
    height: windowHeight * 0.42
  },
  containerBodyVideo2: {
    height: windowHeight * 0.42
  },
  controlButton: {
    padding: 10,
    backgroundColor:"#676767",
    borderRadius: 99999,
    marginLeft:20
  },
  controls: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    justifyContent: 'start',
    width: '100%',
  },
  container: {
    display: 'flex',
  },
  container1: {
    width: "full"
  },
  container2: { 
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  container3: { 
    display: 'flex',
 
    width: '100%',
  },
  container4: { 
    display: 'flex',
    flexDirection:"row",
    width: '100%',
  },
  imageContainer: {
    flex: 1,
    aspectRatio: 1, // Đảm bảo các hình ảnh đều có chiều cao bằng nhau
  },
  image: {
    width: '100%',
    height: '100%',
  },
  profileThumb: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerWrapper3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  headerWrapper1: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 20,
    height: "80%",
    color:"black"
  },
  icon: {
    width: 40,
    height: 40,
    opacity: 0.5,
  },
  headerLeftWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerLeftWrapper1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerLeftWrapper2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-end"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "#333"
  },
  feedImage: {
    width: '100%',
  },
  feedImageFooter: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feddimageFooterLeftWrapper: {
    flexDirection: 'row',
  },
  underLine: {
    height: 1,
    backgroundColor: colors.gray1,
  },
  underLineWRapper: {
    marginLeft: 10,
    marginRight: 10,
  },
  likesImage: {
    width: 25,
    height: 25,
  },
  likesAndCommentsWrapper: {
    flexDirection: 'row',
    padding: 15,
  },
  likesTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: "#333"
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    color: "black",
    textAlign: "left"
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
  containerS: {
    flex: 1,
    justifyContent: 'center',
    height: 100,
  },
  dropdown: {
    padding: 0,
  },
});
