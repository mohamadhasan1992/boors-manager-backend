const express = require('express');
const wholePropertyController = require('../controllers/wholePropertyController');

const router = express.Router();

router
  .route("/")
  .get(wholePropertyController.getWholeProperty)
  .post(wholePropertyController.createWholeProperty);

  router.route("/:id").get(wholePropertyController.getWholePropertyById);

module.exports=router;