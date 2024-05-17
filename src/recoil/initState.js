import { atom, selector } from "recoil";
import AsyncStorage from '@react-native-async-storage/async-storage';

const getTokenFromStorage = async () => {
  const token = await AsyncStorage.getItem("token");
  return token || "";
}

export const tokenState = atom({
  key: "tokenState",
  default: selector({
    key: "tokenDefault",
    get: async () => {
      return await getTokenFromStorage();
    }
  })
});
export const likeR = atom({
  key: "likeR",
  default: false
});
export const LoadPage = atom({
  key: "LoadPage",
  default: false
});
export const idPost = atom({
  key: "idPost",
  default: ""
});
export const idUsers = atom({
  key: "idUsers",
  default: ""
});
export const idPostSimple = atom({
  key: "idPostSimple",
  default: ""
});
export const initState = atom({
  key: "initText",
  default: "",
});
export const photosR = atom({
  key: "photosR",
  default: [],
});
export const photosRU = atom({
  key: "photosRU",
  default: [],
});

export const isUpdatePost = atom({
  key: "isUpdatePost",
  default: true,
});

export const isUpdateReels = atom({
  key: "isUpdateReels",
  default: true,
});