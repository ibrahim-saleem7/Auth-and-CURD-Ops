const bcrypt = require('bcryptjs')
const AppError = require("../utils/appError.js")

const generateToken = require('./generateToken')

async function login (body , user , res ,next){

    if(!user.isConfirm) return next(new AppError("please confirm your account", 403))

    const matchPassword = await bcrypt.compare(body.password, user.password)

    if(!matchPassword) return next(new AppError("Invalid email or password", 400))

    const token = generateToken({id : user._id ,name : user.name,})

    return res.status(200).json({id : user._id,token: token})
}


module.exports = login