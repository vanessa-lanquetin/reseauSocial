import React, { useEffect, useState } from "react";
import Routes from "./components/Routes";
import { UidContext } from "./components/UidContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";

const App = () => {
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/jwtid`,
          withCredentials: true,
        });
        setUid(response.data);
        if(uid) {
          dispatch(getUser(uid));
        }
      } catch (error) {
        if(error?.response?.status === 401) {
          navigate("/profil");
        } else {
          console.error(error)
        }
      }
    };
    

    fetchToken();
  }, [uid, dispatch,navigate]);
  
  return (
      <UidContext.Provider value={{setUid, uid}}>
        <Routes />
      </UidContext.Provider>
  );
};

export default App;
