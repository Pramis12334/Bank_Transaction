const accountModel = require('../models/account.model');

async function createAccount(req, res){
    try {

     const user = req.user;
        const account = await accountModel.create({
            user: user._id
        });

    res.status(201).json({
        account
    })

    } catch(error) {
        res.status(401).json({
            error
        });

    }
}

async function getAccount(req, res) {
    const account = await accountModel.findOne({
        user: req.user._id
    });

    if(!account) {
        return res.status(400).json({
            message: "User doesnt have account"
        });
    }
    return res.status(200).json({
        account
    });
}

async function getAccountBalance(req, res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    });
    if(!account) {
        return res.status(400).json({
            message: "Account doesnt exist"
        });
    }

    const balance = await account.getBalance();


    console.log(balance);

    return res.status(200).json({
        account,
        balance
    });
}


module.exports = {
createAccount,
getAccount,
getAccountBalance
};