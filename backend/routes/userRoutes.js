const userController = require('../controllers/userController');
const express = require('express');
const userAuth = require('../middlewares/auth');

const router = express.Router();

router.post('/register',userController.registerUser)

router.post('/login',userController.loginUser)

router.get ('/credits',userAuth,userController.userCredits)

router.post('/payment-stripe',userAuth,userController.paymentMethod)

router.post('/verify-stripe',userAuth,userController.verifyPayment)



module.exports = router;