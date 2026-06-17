const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        unique: [true, "Token is already in use"],
        required: [true, "Token is required to blacklist user"]
    }
});

module.exports = mongoose.model("tokenblacklist", tokenBlacklistSchema);