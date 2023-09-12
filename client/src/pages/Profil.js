import React, { useContext } from 'react';
import Log from '../components/Log';
import UidContext from '../components/UidContext'
import { useSelector } from 'react-redux';
import {selectUser} from '../reducers/user.reducer';

const Profil = () => {
  const {uid} = useContext(UidContext);
  const profil = useSelector(selectUser)
  return (
    <div className="profil-page">
      {uid && profil?.pseudo ? (
        <h1>UPDATE PAGE {profil.pseudo}</h1>
      ) : (
        <div className="log-container">
          <Log signin={false} signup={true} />
          <div>
            <img src="./img/log.svg" alt="img-log" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;