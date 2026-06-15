const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');

async function authUser(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")

    if(!token) {
        res.status(401).json({ 
            message: "Unauthorized access, token is missing"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded.userId);

        console.log(user);

        req.user = user;
        next()

    } catch(error) {
        res.status(401).json({
            message: "Unauthorized access, token is invalid"
        });
    }
}

module.exports = { 
    authUser
}