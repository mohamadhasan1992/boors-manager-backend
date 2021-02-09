const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();
router.get('/',userController.getAllUser);
router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post("/forgetpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);
router.patch("/updatepassword", authController.protect, authController.updatePassword);
router.patch("/updateme", authController.protect, userController.updateMe);
router.delete("/deleteme",authController.protect,userController.deleteMe);

router.route('/:id').get(userController.getUser);

module.exports = router;