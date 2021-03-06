const express = require('express');
const authController = require('../controllers/authController');
const dailyPropertyController = require('../controllers/dailyPropertyController');


const router = express.Router({mergeParams:true});

// router.use(authController.protect);
router
  .route("/")
  .post(dailyPropertyController.createDailyProperties)
  .get(dailyPropertyController.getDailyProperties);

router
  .route("/:id")
  .delete(dailyPropertyController.deleteDailyProperty)

module.exports = router;