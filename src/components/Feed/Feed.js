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
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    setAuthToken(to);
      const fetchInfo = async () => {
        try {
          const responseInfor = await api.get('https://socialnetwork.somee.com/api/infor/myinfor');
          // console.log("Info",responseInfor.data.data.userId)
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
        <AntDesign name="sharealt" size={30} color="#456fe6" style={{marginRight:10}}/>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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
  
});
