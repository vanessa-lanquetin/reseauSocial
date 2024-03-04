import React, { useState } from "react";
import LeftNav from "../LeftNav";
import { useDispatch, useSelector } from "react-redux";
import { updateBio } from "../../actions/user.actions";
import { selectUser} from "../../reducers/user.reducer";
import UploadImg from "./UploadImg";

const UpdateProfil = () => {
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  const profil = useSelector(selectUser);
  const dispatch = useDispatch()

  const handleUpdate = () => {
    if (bio !== profil?.bio) {
      // Vérifie si la bio a changé
      dispatch(updateBio(profil?._id, bio));
    }
    setUpdateForm(false);
  };
  return (
    <div className="profil-container">
      <LeftNav></LeftNav>
      {profil?.pseudo ? <h1>Profil de {profil?.pseudo}</h1> : <></>}
      <div className="update-container">
        <div className="left-part">
          <h3>Photo de profil</h3>
          <img
            src={`${process.env.REACT_APP_API_URL}/pictures/profil/${profil?.picture}`}
            alt="user-pic"
          ></img>
          <UploadImg></UploadImg>
        </div>
        <div className="right-part">
          <div className="bio-update">
            <h3>Bio</h3>
            {updateForm === false && (
              <>
                <p onClick={() => setUpdateForm(!updateForm)}>{profil?.bio}</p>
                <button onClick={() => setUpdateForm(!updateForm)}>
                  Modifier bio
                </button>
              </>
            )}
            {updateForm && (
              <>
                <textarea
                  /* type="text" */
                  name="bio"
                  defaultValue={profil?.bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
                <button onClick={handleUpdate}> Valider modification</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfil;
