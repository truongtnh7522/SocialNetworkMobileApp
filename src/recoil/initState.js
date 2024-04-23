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

export const initState = atom({
  key: "initText",
  default: "",
});
