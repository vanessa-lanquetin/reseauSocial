import React, { useEffect, useState } from "react";
import Routes from "./components/Routes";
import { UidContext } from "./components/UidContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/jwtid`,
          withCredentials: true,
        });
        setUid(response.data);
      } catch (error) {
        if(error?.response?.status === 401) {
          navigate("/profil");
        } else {
          console.error(error)
        }
      }
    };

    fetchToken();
  }, [uid]);

  return (
      <UidContext.Provider value={{setUid, uid}}>
        <Routes />
      </UidContext.Provider>
  );
};

export default App;
