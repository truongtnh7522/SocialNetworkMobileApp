
import { api } from "../helpers/setAuthToken";
const getReels = async () => {
  const response = await api.get("https://www.socialnetwork.somee.com/api/real");
  console.log(response)
  return response.data;
};

export default getReels;