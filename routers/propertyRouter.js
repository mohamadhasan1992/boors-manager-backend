const express = require('express');
const propertyController = require('../controllers/propertyController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route("/")
  .get(propertyController.getAllProperties)
  .post(propertyController.createProperty);

  router
    .route("/:id")
    .get(propertyController.getProperty)
    .delete(propertyController.deleteProperty)
    .patch(propertyController.updateProperty);

  module.exports =router;