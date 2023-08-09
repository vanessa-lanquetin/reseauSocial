const router = require("express").Router();
const pathfs = require("path");
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const { requireAuth } = require("../middleware/auth.middleware");
const multer = require("multer");
const upload= multer({
  dest: pathfs.resolve(__dirname, '..', 'temp')
});

//Authentification
router.post("/register", authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout)

//user de la base de donnée MongoDB
router.get("/", userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/follow/:id', userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

//upload
router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  uploadController.uploadProfil
);


module.exports=router;