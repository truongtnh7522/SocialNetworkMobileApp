import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Image,TouchableOpacity, TextInput} from 'react-native';
import {colors} from '../../utils/configs/Colors';
import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR , idPost,idUsers} from "../../recoil/initState";
import { setAuthToken, api} from "../../utils/helpers/setAuthToken"
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
const Feed = ({data}) => {
  const [likeRR, setLikeRR] = useRecoilState(likeR);
  const [to, setToken] = useRecoilState(tokenState);
  const [idPostR, setidPostR] = useRecoilState(idPost);
  const [idUserR, setidUsersR] = useRecoilState(idUsers);
  const [idUser,setIdUser] = useState("")
  const navigation = useNavigation();
  useEffect(() => {
    setAuthToken(to);
      const fetchInfo = async () => {
        try {
          const responseInfor = await api.get('https://www.socialnetwork.somee.com/api/infor/myinfor');
          console.log("Info",responseInfor.data.data.userId)
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
        .post(`https://www.socialnetwork.somee.com/api/like/${id}`)
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
  console.log(data.userId)
  const handleNavigate = () => {
    if(data.userId === idUser) {
      setidUsersR(idUser)
      navigation.navigate('Profile')
    }
    else {
      setidUsersR(data.userId )
      navigation.navigate('ProfileUsers')
    }
  }
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
       
      </View>
      <Text style={{marginBottom:10, paddingLeft:10}}>
          {' '}
          <Text style={styles.headerTitle}>{data.content}</Text>{' '}

        </Text>
      <View>
    
      {
        data.images.map((item, index) => (
          data.images.length > 1 ? 
          
           <Image
         
           style={{  aspectRatio: 1, height: "auto", width:"100px" }}
           resizeMode="contain"
           source={{ uri: item.linkImage }}
         />
        
          :
          <Image
          key={index}
          style={{ flex: 1, aspectRatio: 1, height: "auto" }}
          resizeMode="contain"
          source={{ uri: item.linkImage }}
        />
        ))
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
        <Image
          style={styles.icon}
          source={require('../../assets/images/comment.png')}
        />
       </TouchableOpacity>
          <Image
   
            style={styles.icon}
            source={require('../../assets/images/messagefeed.png')}
          />
        </View>
        <Image
          style={styles.icon}
          source={require('../../assets/images/bookmarkfeed.png')}
        />
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
});
