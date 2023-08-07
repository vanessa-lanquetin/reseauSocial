module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.message.includes("pseudo"))
    errors.pseudo = "Pseudo incorect ou déjà pris";

  if (err.message.includes("email")) errors.email = "email incorect";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe doit faire 6 caractères minimum";

  if (err.code == 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.pseudo = "pseudo déjà pris";

  if (err.code == 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "email déjà enregistré";

  return errors;
};

module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email")) errors.email = "email inconnu";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe ne correspond pas";

    return errors
};

module.exports.uploadErrors = (err) => {
  let errors = { format: '', maxSize: '' };

  if (err.message.includes('invalid file'))
    errors.format = 'Format incompatible';

  if (err.message.includes('max size'))
    errors.maxSize = 'Le fichier dépasse 500ko';

  return errors;
};
