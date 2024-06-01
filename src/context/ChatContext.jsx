import { createContext, useContext, useReducer,useEffect ,useState} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {   tokenState,likeR,loadUpdateInfo
} from "../recoil/initState";
import { setAuthToken, api} from "../utils/helpers/setAuthToken"
// import { useSelector } from "react-redux";
export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  // const currentUser = useSelector((state) => state.info.info);
  // console.log(currentUser)
  const [currentUser, setDataInfo] = useState([]);

  const [to, setToken] = useRecoilState(tokenState);
  const [loadUpdateInfoR, setloadUpdateInfoR] = useRecoilState(loadUpdateInfo);
  useEffect(() => {
    const fetchDataInfo = async () => {

      setAuthToken(to)
     
    try {
   
      const response = await api.get('https://truongnetwwork.bsite.net/api/infor/myinfor');
      if(loadUpdateInfoR=== false) {
        setloadUpdateInfoR(true)
       
      }
  
      setDataInfo(response.data);

    } catch (error) {
      console.log(error)
      setStatus('error');
    }
    }
    fetchDataInfo()
  }, [loadUpdateInfoR]);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
          currentUser.data.firebaseData.uid > action.payload.uid
              ? currentUser.data.firebaseData.uid + action.payload.uid
              : action.payload.uid + currentUser.data.firebaseData.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
