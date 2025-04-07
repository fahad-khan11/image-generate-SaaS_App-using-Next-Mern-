const express = require('express');
const userAuth = require('../middlewares/auth');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.post('/generate-image',userAuth,imageController.generateImage);

module.exports = router;