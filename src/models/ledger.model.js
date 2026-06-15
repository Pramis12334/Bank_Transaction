const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Account is required"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, "amount cannot be empty"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "transaction is required"],
        index: true,
        immutable: true
    },
    type: {
        type:String,
        enum : {
            values: ["DEBIT", "CREDIT"],
            message: "Type can be debited and credited only"
        },
        required: [true, "ledger type is required"],
        immutable: true
    }

})

ledgerSchema.index({ user: 1, status: 1});


function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified or delete");
}

ledgerSchema.pre("findOneAndUpdate",preventLedgerModification);
ledgerSchema.pre("findOneAndDelete",preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("replaceOne",preventLedgerModification);
ledgerSchema.pre("deleteMany",preventLedgerModification);
ledgerSchema.pre("deleteOne",preventLedgerModification);

module.exports = mongoose.model("ledger",ledgerSchema);

