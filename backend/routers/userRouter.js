const express = require('express');
const {protectRoute} = require('../middlewares/protectedRoute');
const { signup, login, logout, checkAuth } = require('../controllers/userController');
const router = express.Router();
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/check",protectRoute,checkAuth)
module.exports= router;
