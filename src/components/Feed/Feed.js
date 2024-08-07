import React, { useEffect, useState,useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Dimensions } from 'react-native';
import { colors } from '../../utils/configs/Colors';
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState, likeR, idPost, idUsers, isUpdatePost, isSharePost ,isOpenUpdatePost,IdEditR,loadUpdateInfo} from "../../recoil/initState";
import { setAuthToken, api } from "../../utils/helpers/setAuthToken"
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import DropDownPicker from 'react-native-dropdown-picker';
import UpdatePostforScreen from "../../containers/UpdatePost/UpdatePost"
import Sound from 'react-native-sound';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import Video from 'react-native-video';
const { height: windowHeight } = Dimensions.get('window');
const { width: windowWidth } = Dimensions.get('window');
const Feed = ({ data }) => {
  const [likeRR, setLikeRR] = useRecoilState(likeR);
  const [data1,setData1] = useState(data)
  const [to, setToken] = useRecoilState(tokenState);
  const [idPostR, setidPostR] = useRecoilState(idPost);
  const [idUserR, setidUsersR] = useRecoilState(idUsers);
  const [isUpdatePostR, setSsUpdatePost] = useRecoilState(isUpdatePost);
  const [isOpenUpdatePostR, setIsOpenUpdatePost] = useRecoilState(isOpenUpdatePost);
  const [isSharePostR, setIsSharePostR] = useRecoilState(isSharePost);
  const [idUser, setIdUser] = useState("")
  const [content, setContent] = useState("")
  const [countLike, setCountLike] = useState(data.countLike)
  const [visible, setVisible] = useState(false);
  const [visibleShare, setVisibleShare] = useState(false);
  const [dataInfo, setDataInfo] = useState([]);
  const navigation = useNavigation();
  const [isLikeLo, setIsLikeLo] = useState(data.isLike)
  const [isLikeNu, setIsLikeNu] = useState(false)
  const [IdEdit, setIdEdit] = useRecoilState(IdEditR);
  const [loadUpdateInfoR, setloadUpdateInfoR] = useRecoilState(loadUpdateInfo);
  useEffect(() => {
    setAuthToken(to);
    const fetchInfo = async () => {
      try {
        const responseInfor = await api.get('https://truongnetwwork.bsite.net/api/infor/myinfor');
        if(loadUpdateInfoR=== false) {
          setloadUpdateInfoR(true)
         
        }
    
        setDataInfo(responseInfor.data.data)
        setIdUser(responseInfor.data.data.userId)
      } catch (e) {
        console.log(e)
      }
    }
    fetchInfo()
  }, [loadUpdateInfoR])
  const handleLike = async () => {

    setAuthToken(to);
    try {
      const id = data.id;
      setIsLikeLo(!isLikeLo)
      setIsLikeNu(true)
      await api
        .post(`https://truongnetwwork.bsite.net/api/like/${id}`)
        .then((response) => {
          // Cập nhật dữ liệu vào state

          if (response.status === 200) {


            setLikeRR(!likeRR);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  const handleCmt = () => {
    setidPostR(data.id);
    navigation.navigate('Comment')

  }
  // console.log(data.userId)
  const handleNavigate = () => {
    if (data.userId === idUser) {

      navigation.navigate('Profile')
    }
    else {
      setidUsersR(data.userId)
      navigation.navigate('ProfileUsers')
    }
  }
  const [imageBig, setImageBig] = useState("")
  const [isImage, setIsImage] = useState(false)
  const handleImage = (img) => {

    setVisible(true)
    setImageBig(img)
  }
  const hanldDltPost = async () => {
    setAuthToken(to);
    return api
      .delete(`https://truongnetwwork.bsite.net/api/post/${data.id}`)
      .then((res) => {
  
        if (res.status === 204) {
          setSsUpdatePost(false);
        }
      })
      .catch((err) => console.log(err));
  };
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("1");
  const [items, setItems] = useState([
    { label: 'Công khai', value: '1' },
    { label: 'Bạn bè', value: '2' },
  ]);
  const handleShare = async () => {
    try {
      // setLike(!like);
      // setCountData(data.countLike + 1);


      await api
        .post(
          "https://truongnetwwork.bsite.net/api/post/share",
          {
            PostId: data.id,
            LevelView: value,
            content: content,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {

          // Cập nhật dữ liệu vào state
   
          if (response.status == 200) {
            setIsSharePostR(false)
            setVisibleShare(false)
            // dispatch(fetchPost());
            // setLike(like + 1);
            // setCountData(data.countLike - 1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  const hanlđUpatePost = () => {
     setIdEdit(data.id);
    console.log("Id",data.id)
     setIsOpenUpdatePost(true)
  }
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
            source={{ uri: data.avatarUrl }}
          />
          <Text style={styles.headerTitle}> {data.fullName}</Text>
        </TouchableOpacity>
        {
          idUser === data.userId && (<View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={styles.headerLeftWrapper} onPress={hanlđUpatePost}>
              <AntDesign name="edit" size={20} color="#456fe6" style={{ marginRight: 10 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerLeftWrapper} onPress={hanldDltPost}>
              <AntDesign name="closecircleo" size={20} color="#456fe6" style={{ marginRight: 10 }} />
            </TouchableOpacity>
          </View>)
        }

      </View>
      <Text style={{ marginBottom: 10, paddingLeft: 10, marginTop: 10 }}>
        {' '}
        <Text style={styles.headerTitle}>{data.content}</Text>{' '}

      </Text>
      <View>
        {
          data.images.length === 2 &&  data.videos.length === 0 ? 
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            {
              data.images.map((item, index) => (


                <TouchableOpacity onPress={() => handleImage(data.images[0].linkImage)} >
                  <Image
                    style={{ height: 300, width: 200, flex: 1 }}
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
              ))
            }
          </View>
          : data.images.length === 3 ? (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <View style={{display:"flex"}}>
            <TouchableOpacity onPress={() => handleImage(data.images[0].linkImage)} >
            <Image
              style={{ height: 300, width:400, flex: 1 }}
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
                  style={{ width: windowWidth * 0.8, height: "auto", aspectRatio: 1 }}
                  resizeMode="contain"
                  source={{ uri: imageBig }}
                />
              </TouchableOpacity>
            </Modal>
          </TouchableOpacity>
            <View style={{display:"flex",flexDirection:"row"}}>
            <TouchableOpacity onPress={() => handleImage(data.images[1].linkImage)}  >
            <Image
              style={{ height: 300, width: 200, flex: 1 }}
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
          <TouchableOpacity onPress={() => handleImage(data.images[2].linkImage)} >
          <Image
          style={{ height: 300, width: 200, flex: 1 }}
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
          ) :         data.images.length === 2 &&  data.videos.length !== 0 ? (
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
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            {
              data.images.map((item, index) => (





                <TouchableOpacity onPress={() => handleImage(item)} key={index} >
                  <Image
                    style={{ height: 300, width: 200, flex: 1 }}
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
              ))
            }
          </View></View>
          )
          : data.videos.length !== 0 ? ( 
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
          : 
          <View>
            {
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
            }
          </View>

        }


      </View>
      <View style={styles.feedImageFooter}>
        <View style={styles.feddimageFooterLeftWrapper}>
          {
            isLikeLo === true ? <TouchableOpacity onPress={handleLike}>
              <FontAwesome name="heart" size={30} color="pink" style={{ marginRight: 10 }} />
            </TouchableOpacity> : <TouchableOpacity onPress={handleLike}>
              <FontAwesome name="heart-o" size={30} color="pink" style={{ marginRight: 10 }} />
            </TouchableOpacity>


          }



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
                <View><Text style={styles.headerTitle}> {dataInfo.fullName}</Text>

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
                  onPress={handleShare}
                >
                  <Text
                    style={{

                      color: "white",
                    }}
                  >
                    Save Change
                  </Text>
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
      <View style={styles.underLineWRapper}>
        <View style={styles.underLine} />
      </View>
      <View style={styles.likesAndCommentsWrapper}>
        <Feather name="heart" size={20} color="pink" style={{ marginRight: 10 }} />
        {
          isLikeNu == true ? <Text style={styles.likesTitle}>You and  {countLike} Likes</Text> : <Text style={styles.likesTitle}> {countLike}  Likes</Text>
        }


      </View>
      <View style={styles.likesAndCommentsWrapper}>




      </View>
      {isOpenUpdatePostR === true && IdEdit === data.id && <UpdatePostforScreen data={data}/>}
    </View>
  );
};

export default Feed;

export const styles = StyleSheet.create({
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
    color: "#333",

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
  input: {
    flex: 1,

    paddingVertical: 20,
    height: "80%"
  },
  containerS: {
    flex: 1,
    justifyContent: 'center',
    height: 100,


  },
  dropdown: {

    padding: 0,

  },
  containerBodyVideo: {
    height: windowHeight * 0.82
  },
  containerBodyVideo2: {
    height: windowHeight * 0.42
  },
});
