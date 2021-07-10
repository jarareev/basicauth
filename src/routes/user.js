const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')
const { auth } = require('../middlewares/authentication');

router.get("/ping", (req, res, next) => res.send("pong"));
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/dashboard', auth(), userController.dashboard);

module.exports = router;