import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UidContext } from "../components/UidContext";
import Logout from "../components/Log/Logout"
import { useSelector } from "react-redux";
import { selectUser } from "../reducers/user.reducer";

const Navbar = () => {
  const uid = useContext(UidContext);
  const profil = useSelector(selectUser)
  return (
    <nav>
      <div className="nav-container">
        <div className="logo">
          <NavLink to="/">
            <div className="logo">
              <img src="./img/icon.png" alt="icon"></img>
              <h3>Raccount</h3>
            </div>
          </NavLink>
        </div>
        {uid ? (
          <ul>
            <li></li>
            {
              profil?.pseudo ? (
                <li className="welcome">
                  <NavLink to="/profil">
                    <h5>Bienvenue {profil?.pseudo}</h5>
                  </NavLink>
                </li>
              )
              : <></>
            }
            <Logout></Logout>
          </ul>
        ) : (
          <ul>
            <li></li>
            <li>
              <NavLink to="/profil">
                <img src="./img/icons/login.svg" alt="login"></img>
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
