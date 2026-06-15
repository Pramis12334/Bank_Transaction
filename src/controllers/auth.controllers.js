const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.services');

const userRegister = async function(req, res) {
    try {
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
        
        // Send registration email
        try {
            await emailService.sendRegistrationEmail(user.email, user.username);
            console.log('Registration email sent successfully');
            } catch (emailError) {
                console.error('Failed to send registration email:', emailError.message);
                // Optionally: delete the user if email fails
                // await userModel.deleteOne({ _id: user._id });
                // return res.status(500).json({ message: 'Registration failed: Could not send email' });
            }

        return res.status(201).json({
            user: {
                    email: user.email,
                    password: user.password,
                    username: user.username
                },
                token
            });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Registration failed', error: error.message });
    }
    
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
const userLogout = async function(req, res) {
    res.clearCookie("token");
}

module.exports = { 
    userRegister,
    userLogin,
    userLogout
};
