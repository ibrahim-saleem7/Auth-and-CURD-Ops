const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./middlewares/globalErrorHandler.js');
const fileUpload = require('./utils/fileUpload');
const itemRouter = require('./routes/item.routes');
const authRouter = require('./routes/auth.routes');







//---------------------------------//
const app = express();
app.use(cors())
app.use(express.static(path.join(__dirname,'../uploads')));
app.use(express.urlencoded({ extended: true}))
app.use(express.json());
app.use(hpp())
app.use(helmet())
app.use(mongoSanitize());

//-------------------------------//




app.use('/api/item', itemRouter);
app.use('/api/auth', authRouter);


app.use(fileUpload());
app.all('*', (req, res, next)=>{
    next(new AppError(`Invalid URL: ${req.originalUrl}`, 404))
})
app.use(globalErrorHandler)
//--------------------------------//
module.exports = app;
