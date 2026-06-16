const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
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
    },
    systemUser: {
        type: Boolean,
        default: false,
        select: false,
        immutable: true
    }

}, {
    timestamps: true
});

userSchema.pre("save", async function(){
if(!this.isModified("password")) {
    return
}
const hash = await bcrypt.hash(this.password, 10);
this.password = hash
return
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password,this.password);
}

module.exports = mongoose.model("User",userSchema);