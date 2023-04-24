var express = require('express');
var router = express.Router();
const userController = require('../controller/user.controller')
const { upload_profile } = require('../middleware/upload')
const { authenticate_user } = require('../middleware/auth')


// /* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/create', userController.createUser)
router.post('/login', userController.login)
router.post('/otp/send/:mobile', userController.sendOtp)
router.post('/get/:userId', userController.getUserDetails)
router.post('/otp/verify', userController.verifyOtp)
router.post('/is-found', userController.isUserExist)
router.post('/upload-profile/:user_id', upload_profile, userController.add_profile_image)
router.post('/reset-password', userController.resetPassword)

module.exports = router;
