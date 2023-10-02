import React from "react";
import LeftNav from "../LeftNav";
import { useSelector } from "react-redux";
import { selectUser } from "../../reducers/user.reducer";
import UploadImg from "./UploadImg";

const UpdateProfil = () => {
  const profil = useSelector(selectUser);
  return (
    <div className="profil-container">
      <LeftNav></LeftNav>
      {profil?.pseudo ? <h1>Profil de {profil?.pseudo}</h1> : <></>}
      <div className="update-container">
        <div className="left-part">
          <h3>Photo de profil</h3>
          <img src={`${process.env.REACT_APP_API_URL}/pictures/profil/${profil?.picture}`} alt="user-pic"></img>
          <UploadImg></UploadImg>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfil;
