const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../models/tokenBlacklist.model');

async function authUser(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token) {
        res.status(401).json({ 
            message: "Unauthorized access, token is missing"
        })
    }

    const isBlacklist = await tokenBlacklist.findOne({
        token: token
    });

    if(isBlacklist) {
        return res.status(400).json({
            message: "Unauthorized access, token is invalid"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded.userId);

        req.user = user;
        
        next()

    } catch(error) {
        res.status(401).json({
            message: "Unauthorized access, token is invalid"
        });
    }
}

async function systemUser(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ");

    if(!token) {
        return res.status(400).json({
            message: "Unauthorized access"
        });
    }

    const isBlacklist = await tokenBlacklist.findOne({
        token: token
    });
    if(isBlacklist) {
        return res.status(400).json({
            message: "Unauthorized access, token is invalid"
        });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decoded.userId).select("+systemUser");

    if(!user) {
        return res.status(400).json({
            message: "Unauthorized access"
        });
    }
    req.user = user;
    next()
    } catch(error) {
        return res.status(400).json({
            message: "Error occured",
            error
        });
    }
}

module.exports = { 
    authUser,
    systemUser
}