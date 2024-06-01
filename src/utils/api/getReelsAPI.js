
import { api } from "../helpers/setAuthToken";
const getReels = async () => {
  const response = await api.get("https://truongnetwwork.bsite.net/api/real");
  console.log(response)
  return response.data;
};

export default getReels;
