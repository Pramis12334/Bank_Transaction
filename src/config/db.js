const mongoose = require('mongoose');

async function ConnectToDb() {
    mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch(err => {
        console.log("Error while connecting to mongodb");
        process.exit(1);
    });
};

module.exports = ConnectToDb ;