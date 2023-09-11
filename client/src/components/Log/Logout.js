import React from "react";
import axios from "axios";
import cookie from "js-cookie";

const Logout = () => {
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
      window.location.href = "/profil";
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
