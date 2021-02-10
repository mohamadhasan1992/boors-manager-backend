const express = require('express');
const wholePropertyController = require('../controllers/wholePropertyController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authController.protect, wholePropertyController.getWholeProperty)
  .post(authController.protect, wholePropertyController.createWholeProperty);

router
  .route("/:id")
  .patch(authController.protect, wholePropertyController.updateWholeProperty);


module.exports=router;