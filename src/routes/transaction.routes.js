const { Router } = require('express');
const transactionRoutes = Router();
const transactionControllers = require('../controllers/transaction.controllers');
const authMiddleware = require('../middleware/auth.middleware');


transactionRoutes.post('/',authMiddleware.authUser,transactionControllers.createTransaction);

transactionRoutes.post('/system/initial-funds',authMiddleware.systemUser,transactionControllers.initialTransactionFunds);

module.exports = transactionRoutes;
