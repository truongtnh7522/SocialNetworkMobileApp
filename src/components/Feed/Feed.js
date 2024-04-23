import React from 'react';
import {View, Text, StyleSheet, Image,TouchableOpacity} from 'react-native';
import {colors} from '../../utils/configs/Colors';
import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR
} from "../../recoil/initState";
import { setAuthToken, api} from "../../utils/helpers/setAuthToken"
const Feed = ({data}) => {
  const [likeRR, setLikeRR] = useRecoilState(likeR);
  const [to, setToken] = useRecoilState(tokenState);
  
   const handleLike = async () => {

    setAuthToken(to);
    try {
      const id = data.id;
      await api
        .post(`https://www.socialnetwork.somee.com/api/like/${id}`)
        .then((response) => {
          // Cập nhật dữ liệu vào state

          if (response.status === 200) {
            console.log(response)
            console.log(456)
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

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerLeftWrapper}>
          <Image
            style={styles.profileThumb}
            source={{uri: data.avatarUrl}}
          />
          <Text style={styles.headerTitle}> {data.fullName}</Text>
        </View>
        <Image
          style={styles.icon}
          source={require('../../assets/images/dots.jpg')}
        />
      </View>
      <Text style={{marginBottom:10, paddingLeft:10}}>
          {' '}
          <Text style={styles.headerTitle}>{data.content}</Text>{' '}

        </Text>
      <View>
    
       {
          data.images.map((item,index) => (
            <Image
            key={index}
            style={{ flex: 1, aspectRatio: 1 }} // Sử dụng flex và aspectRatio để điều chỉnh tỷ lệ của hình ảnh
            resizeMode="contain" // Sử dụng resizeMode="contain" để hình ảnh vừa với kích thước hiển thị
            source={{ uri: item.linkImage }}
          />
          ))
       }
      </View>
      <View style={styles.feedImageFooter}>
        <View style={styles.feddimageFooterLeftWrapper}>
        <TouchableOpacity onPress={handleLike}>
        <Image
          style={styles.icon}
          source={require('../../assets/images/heartfeed.jpg')}
        />
      </TouchableOpacity>
          
       
        <Image
          style={styles.icon}
          source={require('../../assets/images/comment.png')}
        />
      
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
        <Image
          style={styles.likesImage}
          source={require('../../assets/images/heart.png')}
        />
        <Text style={styles.likesTitle}> {data.countLike}  Likes</Text>

      
      </View>
    </View>
  );
};

export default Feed;

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
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
  },
});
