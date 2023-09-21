import React from "react";
import LeftNav from "../LeftNav";
import { useSelector } from "react-redux";
import { selectUser } from "../../reducers/user.reducer";

const UpdateProfil = () => {
  const profil = useSelector(selectUser);
  return (
    <div className="profil-container">
      <LeftNav></LeftNav>
      {profil?.pseudo ? <h1>Profil de  {profil?.pseudo}</h1> : <></>}
    </div>
  );
};

export default UpdateProfil;
