const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "fromAccount cant be empty to create a transaction"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "toAccount cant be empty to create a transaction"],
        index: true
    },
    Amount: {
        type: Number,
        required: [true, "Amount is required to create a transaction"],
        min: [0, "Amount must be greater than 0"]
    },
    status: {
        type: String,
        enum: {
            values: ["Pending", "Completed", "Failed", "Reversed"],
            message: "Status must be Pending, Completed, Failed, Reveresed",
            default: "Pending"
        }
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotencykey is required to create a transaction"],
        index: true,
        unique: true
    }
}, {
    timestamps: true
})

transactionSchema.index({ user: 1, status: 1});

module.exports = mongoose.model("transaction", transactionSchema);
