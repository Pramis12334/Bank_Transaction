const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating a account"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Email must be valid"
        ],
        unique: [true,"Email already exist"]
    },
    username: {
        type: String,
        required: [true,"Username must be provided to create a account"]
    },
    password: {
        type: String,
        required: [true, "Password must be provided to create a account"],
        minlength: [6, "Password must be longer than 6 character"],
        select: false
    }
});

module.exports = mongoose.model("user",userSchema);