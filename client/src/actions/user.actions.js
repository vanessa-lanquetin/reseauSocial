import axios from "axios";
import { setUser } from "../reducers/user.reducer";
import { setUser as setUserReducer } from "../reducers/user.reducer"; // Renommez setUser en setUserReducer pour éviter les conflits de noms

export const getUser = (uid) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}/api/user/${uid}`)
      .then((res) => {
        dispatch(setUser(res.data));
      })
      .catch((err) => {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur :",
          err
        );
      });
  };
};

export const uploadPicture = (data, id) => {
  return (dispatch) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/user/upload`, data, {
        withCredentials: true,
      })
      .then((res) => {
        axios
          .get(`${process.env.REACT_APP_API_URL}/api/user/${id}`)
          .then((res) => {
            dispatch(setUser(res.data));
            console.log("Image téléchargée avec succès");
          })
          .catch((err) => {
            console.error(
              "Erreur lors de la récupération des données mises à jour de l'utilisateur :",
              err
            );
          });
      })
      .catch((err) => {
        console.error("Erreur lors du téléchargement de l'image :", err);
      });
  };
};



export const updateBio = (userId, bio) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/api/user/` + userId,
      data: { bio },
    })
      .then((res) => {
        dispatch(setUserReducer(res.data)); // Utilisez setUserReducer au lieu de setUser
        console.log("Bio téléchargée avec succès");
      })
      .catch((err) => {
        console.error("Erreur lors du téléchargement de la bio :", err);
      });
  };
};
