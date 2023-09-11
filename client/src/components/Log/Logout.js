import React, {useContext} from "react";
import axios from "axios";
import cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import UidContext from "../UidContext";

const Logout = () => {
  const navigate = useNavigate();
  const {uid, setUid} = useContext(UidContext)
  const removeCookie = (key) => {
    if (typeof window !== "undefined") {
      cookie.remove(key);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/api/user/logout`, {
        withCredentials: true,
      });
      removeCookie("jwt");
      setUid(null)
      navigate("/profil");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <li onClick={logout}>
      <img src="./img/icons/logout.svg" alt="logout" />
    </li>
  );
};

export default Logout;
