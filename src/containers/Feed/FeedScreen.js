import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Image,TouchableOpacity,Modal, TextInput,Dimensions} from 'react-native';
import {colors} from '../../utils/configs/Colors';
import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR , idPost,idUsers,isUpdatePost} from "../../recoil/initState";
import { setAuthToken, api} from "../../utils/helpers/setAuthToken"
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import DropDownPicker from 'react-native-dropdown-picker';
import Sound from 'react-native-sound';
const { height: windowHeight } = Dimensions.get('window');
const { width: windowWidth } = Dimensions.get('window');
const Feed = ({data}) => {
  const [likeRR, setLikeRR] = useRecoilState(likeR);
  const [to, setToken] = useRecoilState(tokenState);
  const [idPostR, setidPostR] = useRecoilState(idPost);
  const [idUserR, setidUsersR] = useRecoilState(idUsers);
  const [isUpdatePostR, setSsUpdatePost] = useRecoilState(isUpdatePost);
  const [idUser,setIdUser] = useState("")
  const [content,setContent] = useState("")
  const [visible, setVisible] = useState(false);
  const [visibleShare, setVisibleShare] = useState(false);
  const [dataInfo, setDataInfo] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    setAuthToken(to);
      const fetchInfo = async () => {
        try {
          const responseInfor = await api.get('https://socialnetwork.somee.com/api/infor/myinfor');
           console.log("Info",responseInfor.data.data)
          setDataInfo(responseInfor.data.data)
          setIdUser(responseInfor.data.data.userId)
        }catch (e) {
          console.log(e)
        }
      }
      fetchInfo()
  },[])
   const handleLike = async () => {

    setAuthToken(to);
    try {
      const id = data.id;
      await api
        .post(`https://socialnetwork.somee.com/api/like/${id}`)
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
    if(data.userId === idUser) {
  
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
    console.log(img.linkImage)
    setVisible(true)
    setImageBig(img.linkImage)
  }
  const hanldDltPost = async () => {
   
    console.log(data.id);
    setAuthToken(to);
    return api
      .delete(`https://socialnetwork.somee.com/api/post/${data.id}`)
      .then((res) => {
        console.log("Delete 1",res);
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
  console.log("SSS", value, items)
  const handleShare = async () => {
    try {
      // setLike(!like);
      // setCountData(data.countLike + 1);


      await api
        .post(
          "https://socialnetwork.somee.com/api/post/share",
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
          console.log(response);
          if (response.status == 200) {
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
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity style={styles.headerLeftWrapper} onPress={handleNavigate}>
          <Image
            style={styles.profileThumb}
            source={{uri: data.avatarUrl}}
          />
          <Text style={styles.headerTitle}> {data.fullName}</Text>
        </TouchableOpacity>
        {
          idUser === data.userId && ( <View style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
          <TouchableOpacity style={styles.headerLeftWrapper}>
          <AntDesign name="edit" size={20} color="#456fe6" style={{marginRight:10}}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerLeftWrapper} onPress={hanldDltPost}>
        <AntDesign name="closecircleo" size={20} color="#456fe6" style={{marginRight:10}}/>
      </TouchableOpacity>
          </View>)
        }
       
      </View>
      <Text style={{marginBottom:10, paddingLeft:10}}>
          {' '}
          <Text style={styles.headerTitle}>{data.content}</Text>{' '}

        </Text>
      <View>
      {
        data.images.length > 1 ? <View style={{display:"flex", flexDirection:"row",justifyContent:"center", alignItems:"center"}}>
        {
          data.images.map((item, index) => (
           
            
           
          
      
            <TouchableOpacity onPress={() => handleImage(item)} key={index} >
        <Image
          style={{ height:300, width:200, flex:1 }}
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
        style={{ width:windowWidth * 0.8, height:"auto", aspectRatio: 1 }}
        resizeMode="contain"
        source={{ uri: imageBig }}
      />
        </TouchableOpacity>
      </Modal>
      </TouchableOpacity>
          ))
        }
        </View>  : <View>
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
        style={{ width:windowWidth * 1, height:"auto", aspectRatio: 1 }}
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
        <TouchableOpacity onPress={handleLike}>
        <Feather name="heart" size={30} color="pink" style={{marginRight:10}}/>
      </TouchableOpacity>
          
      <TouchableOpacity
      style={styles.container1}
      onPress={handleCmt}
    >
    <Octicons name="comment" size={30} color="#456fe6" style={{marginRight:10}}/>
       </TouchableOpacity>
         
        </View>
        <TouchableOpacity
        style={styles.container1}
        onPress={() => setVisibleShare(true)}
      >
      <AntDesign name="sharealt" size={30} color="#456fe6" style={{marginRight:10}}/>
         </TouchableOpacity>
  
      </View>
      <Modal
      transparent={true}
      visible={visibleShare}
      onRequestClose={() => setVisibleShare(false)}
    >
        <TouchableOpacity style={styles.modalBackground} onPress={() => setVisibleShare(false)}>
        <View style={styles.popup}>
        <View style={styles.headerWrapper}>
        <View style={styles.headerLeftWrapper}>
          <Image
            style={styles.profileThumb}
            source={{uri: dataInfo.image}}
          />
          <View><Text style={styles.headerTitle}> {dataInfo.fullName}</Text>
          
          </View>
         
        </View>
        <View style={styles.headerLeftWrapper1}>
        <TextInput
        style={styles.input}
        placeholder="Enter search term"
        value={content}
        onChangeText={(text) => setContent(text)}
      />
      </View>
      <View style={styles.headerLeftWrapper2}>
    
      <TouchableOpacity
      style={{
        backgroundColor: "#456fe6",
        height: 34,
        paddingHorizontal:10,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
      }}
     
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
      <Feather name="heart" size={20} color="pink" style={{marginRight:10}}/>
        <Text style={styles.likesTitle}> {data.countLike}  Likes</Text>

      
      </View>
      <View style={styles.likesAndCommentsWrapper}>
      
    

      
      </View>
 
    </View>
  );
};

export default Feed;

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  container1: {
   width:"full"
  },
  profileThumb: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  headerWrapper: {
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
    justifyContent:"flex-end"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color:"#333"
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
    color:"#333"
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
  input: {
    flex: 1,
   
    paddingVertical:20,
    height:"80%"
  },
  containerS: {
    flex: 1,
    justifyContent: 'center',
    height:100,


  },
  dropdown: {

   padding:0,
   
  },

});
