const express = require('express');
const app = express();
const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',authRouter);
app.use('/api/account', accountRouter);


module.exports = app;