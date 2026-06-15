const express = require('express');
const router = express.Router();
const accountControllers = require('../controllers/account.controllers');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/',authMiddleware.authUser,accountControllers.createAccount);


module.exports = router;