const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');

const userRegister = async function(req, res) {
    const{ email,username, password} = req.body;

    const isExist = await userModel.findOne({ email: email});

    if(isExist) {
        return res.status(422).json({
            message: "user already existed"
        });
    }

    const user = await userModel.create({
        email,
        username,
        password
    });

    const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY);

    res.cookie("token", token);

    return res.status(201).json({
        user: {
            email: user.email,
            password: user.password,
            username: user.username
            },
        token
    });
}
const userLogin = async function(req, res) {
    const {email,password} = req.body;

    const user = await userModel.findOne({email: email}).select("+password");

    if(!user) {
        return res.status(401).json({message: "Invalid email and password"});
    }

    const isMatch = await user.comparePassword(password)

    if(!isMatch) {
        res.status(401).json({message: "Invalid email and password"});
    }
    const token = await jwt.sign({userId: user._id},process.env.JWT_SECRET_KEY)
    res.cookie("token", token);
    res.status(200).json({user: {
        _id: user._id,
        email: user.email,
        username: user.username
    }, token});
}

module.exports = { 
    userRegister,
    userLogin
};
