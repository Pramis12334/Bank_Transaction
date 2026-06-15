const transactionModel = require('../models/transaction.model');
const accountModel = require('../models/account.model')

async function getTransaction(req, res){
    
    const { fromAccount, toAccount, Amount, idempotencyKey } = req.body;

   if(!fromAccount || !toAccount || !Amount || !idempotencyKey) {
    return res.status(400).json({
        message: "fromAccount, toAccount, Amount, idempotencyKey is required"
    });
   }
    const isfromAccountExist = await accountModel.findById({fromAccount});
    const istoAccountExist = await accountModel.findById({toAccount});

    if(!isfromAccountExist || !istoAccountExist) {
        return res.status(400).json({
            message: "Account doesnt exist"
        });
    }

    const isTransactionExist = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    });

    if(isTransactionExist) {
        if(isTransactionExist.status === "Completed") {
            return res.status(200).json({
                message: "Transaction is Completed"
            });

        
        }
        if(isTransactionExist.status === "Pending") {
            return res.status(200).json({
                message: "Transaction is still pending"
            });
        }
        if(isTransactionExist.status === "Failed") {
            return res.status(500).json({
                message: "Transaction failed, please retry again"
            });
        }
        if(isTransactionExist.status === "Reversed") {
            return res.status(500).json({
                message: "Transaction reversed, please retry again"
            });
        }
    }

    if(!isfromAccountExist.status === "ACTIVE" || !istoAccountExist.status === "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE"
        });
    }
}