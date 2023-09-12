import axios from "axios";
import { setUser } from "../reducers/user.reducer";
export const getUser = (uid) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}/api/user/${uid}`)
      .then((res) => {
        dispatch(setUser(res.data));
      })
      .catch((err) => console.log(err));
  };
};
