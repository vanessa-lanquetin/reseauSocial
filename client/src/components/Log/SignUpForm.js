import React, { useState } from "react";
import axios from "axios";
import SignInForm from "./SignInForm";

const SignUpForm = () => {
  const [formSubmit, setFormSubmit] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [controlPassword, setControlPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [pseudoError, setPseudoError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [controlPasswordError, setControlPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur avec des valeurs par défaut
    setPseudoError("Veuillez renseigner un pseudo disponible/valide");
    setEmailError("Veuillez renseigner une adresse email valide");
    setPasswordError("Veuillez renseigner un mot de passe d'au moins 6 caractères");
    setControlPasswordError("Les mots de passe ne correspondent pas");
    setTermsError("Veuillez accepter les conditions générales");

    if (password !== controlPassword || !termsAccepted) {
      if (password !== controlPassword) {
        setControlPasswordError("Les mots de passe ne correspondent pas");
      }

      if (!termsAccepted) {
        setTermsError("Veuillez valider les conditions générales");
      }
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/user/register`,
          {
            pseudo,
            email,
            password,
          }
        );

        if (response.data.errors) {
          if (response.data.errors.pseudo) {
            setPseudoError(response.data.errors.pseudo);
          }
          if (response.data.errors.email) {
            setEmailError(response.data.errors.email);
          }
          if (response.data.errors.password) {
            setPasswordError(response.data.errors.password);
          }
        } else {
          setFormSubmit(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      {formSubmit ? (
        <>
          <SignInForm />
          <span></span>
          <h4 className="success">
            Enregistrement réussi, veuillez-vous connecter
          </h4>
        </>
      ) : (
        <form action="" onSubmit={handleRegister} id="sign-up-form">
          <label htmlFor="pseudo">Pseudo</label>
          <br />
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            onChange={(e) => setPseudo(e.target.value)}
            value={pseudo}
          />
          <div className="pseudo error">{pseudoError}</div>
          <br />
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="text"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="email error">{emailError}</div>
          <br />
          <label htmlFor="password">Mot de passe</label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <div className="password error">{passwordError}</div>
          <br />
          <label htmlFor="password-conf">Confirmer mot de passe</label>
          <br />
          <input
            type="password"
            name="password"
            id="password-conf"
            onChange={(e) => setControlPassword(e.target.value)}
            value={controlPassword}
          />
          <div className="password-confirm error">{controlPasswordError}</div>
          <br />
          <input
            type="checkbox"
            id="terms"
            onChange={() => setTermsAccepted(!termsAccepted)}
            checked={termsAccepted}
          />
          <label htmlFor="terms">
            J'accepte les{" "}
            <a href="/" target="_blank" rel="noopener noreferrer">
              conditions générales
            </a>
          </label>
          <div className="terms error">{termsError}</div>
          <br />
          <input type="submit" value="Valider inscription" />
        </form>
      )}
    </>
  );
};

export default SignUpForm;
