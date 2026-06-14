const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth.controllers');

router.post('/register',authControllers.userRegister);
router.post('/login', authControllers.userLogin);

module.exports = router;