const express = require('express');
const wholePropertyController = require('../controllers/wholePropertyController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

//router.use(authController.protect);

router
  .route("/")
  .get(wholePropertyController.getWholeProperty)
  .post(wholePropertyController.createWholeProperty);

router
  .route("/:id")
  .patch(wholePropertyController.updateWholeProperty);


module.exports=router;