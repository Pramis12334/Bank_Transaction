const mongoose = require('mongoose');
const ledgerModel = require('./ledger.model');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE","FROZEN","CLOSED"],
            message: "Status can be either ACTIVE, FROZEN and CLOSED",
            default: "ACTIVE"
        }
    },
    currency: {
        type: String,
        required: [true, "Currency must be given in order to create an account"],
        default: "NPR"
    }
}, {
    timestamps: true
});

accountSchema.index({ user: 1, status: 1});

accountSchema.methods.getBalance = async function() {
    const balance = await ledgerModel.aggregate([
        { $match: { account: this._id }},
        {
            $group: {
                _id: null,
                $totalDebit: {
                    $sum: {
                        $cond: [
                           {$eq: ["$type","DEBIT"]},
                           "$amount",
                           0
                        ]
                    }
                },
                $totalCredit: {
                    $sum: {
                        $cond: [
                            {$eq: ["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {  
            $project: {
            _id: 0,
            balance: { $subtract: ["$totalDebit","$totalCredit"]}
           }
        }
    ])
}

module.exports = mongoose.model("account", accountSchema);