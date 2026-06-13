require('dotenv').config();
const app = require('./src/app');
const ConnectToDb = require('./src/config/db');

ConnectToDb();


app.listen(3000, () => {
    console.log("Server connected successfully");
})