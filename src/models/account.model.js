const mongoose = require('mongoose');

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

module.exports = mongoose.model("account", accountSchema);