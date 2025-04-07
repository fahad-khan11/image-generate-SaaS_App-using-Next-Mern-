const userController = require('../controllers/userController');
const express = require('express');
const userAuth = require('../middlewares/auth');

const router = express.Router();

router.post('/register',userController.registerUser)

router.post('/login',userController.loginUser)

router.post ('/credits',userAuth,userController.userCredits)

module.exports = router;