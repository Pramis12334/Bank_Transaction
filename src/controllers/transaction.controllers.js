const transactionModel = require('../models/transaction.model');
const accountModel = require('../models/account.model');
const ledgerModel = require('../models/ledger.model');
const emailService = require('../services/email.services');
const mongoose = require('mongoose');

async function createTransaction(req, res){
    
    const { fromAccount, toAccount, Amount, idempotencyKey } = req.body;

   if(!fromAccount || !toAccount || !Amount || !idempotencyKey) {
    return res.status(400).json({
        message: "fromAccount, toAccount, Amount, idempotencyKey is required"
    });
   }
    const isfromAccountExist = await accountModel.findById(fromAccount);
    const istoAccountExist = await accountModel.findById(toAccount);

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

    const balance = await isfromAccountExist.getBalance();
    if(balance<Amount) {
        return res.status(400).json({
            message: `Insufficient balance, balance must be equal or more than ${Amount}`
        });
    }


    /*
    **session is used to verify if all the conditon is fulfilled or not while creating transaction and ledger and if not then that transaction will be saved in database.
    */

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = (await transactionModel.create([{
        fromAccount,
        toAccount,
        Amount,
        idempotencyKey,
        status: "Pending"
    }],{ session }))[0];

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        amount: Amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session });

    await (() => {
        return new Promise((resolve) => setTimeout(resolve, 5*1000));
    });

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: Amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session });

    await transactionModel.findOneAndUpdate(
        {_id: transaction._id},
        {status: "Completed"},
        { session }
    );

    await session.commitTransaction();
    session.endSession();
    

    await emailService.sendTransactionEmail(req.user.email,req.user.username,Amount,toAccount);

    return res.status(201).json({
        message: "Transaction created successfully",
        transaction: transaction
    });

}

async function initialTransactionFunds(req, res) {
    const {toAccount, amount, idempotencyKey } = req.body;

    if(!toAccount || !amount || !idempotencyKey) {
        return res.status(422).json({
            message: "All fields are required"
        });
    }

    const istransactionExist = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    });

    const istoAccountExist = await accountModel.findById(toAccount);

    if(!istoAccountExist) {
        return res.status(400).json({
            message: "Account doesnt exist"
        });
    }
    const isfromAccount = await accountModel.findOne({
        user: req.user._id
    });
    
    console.log(toAccount,amount,idempotencyKey, isfromAccount);

    if(!isfromAccount) {
        return res.status(400).json({
            message: "isfromAccount doesnt exist"
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = (await transactionModel.create([{
        fromAccount: isfromAccount._id,
        toAccount: istoAccountExist._id,
        Amount: amount,
        idempotencyKey: idempotencyKey,
        status: "Pending"
    }], { session }))[0];

    const debitLedgerEntry = await ledgerModel.create([{
        account: isfromAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session });

    await (() => {
        return new Promise((resolve) => setTimeout(resolve, 5*1000));
    })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session });

    
    await transactionModel.findOneAndUpdate([
        {_id: transaction._id},
        {status: "Completed"}],
        {session}
    );

    await session.commitTransaction();
    session.endSession();

    await emailService.sendTransactionEmail(req.user.email,req.user.username,amount,toAccount);

    return res.status(201).json({
        message: "Transaction is successfull",
        transaction
    });
}


module.exports = {
    createTransaction,
    initialTransactionFunds
};