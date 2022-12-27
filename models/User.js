const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserShcema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tolong Masukan Nama'],
        minLength: 3,
        maxLength: 50
    },
    email:{
        type: String,
        required: [true, "Masukan Email dengan benar"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Tolong Masukan Email dengan benar'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Tolong Masukan Password'],
        minLength: 6
    }
})

UserShcema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserShcema.methods.createJWT = function () {
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

UserShcema.methods.comparePassword = async function (thePassword) {
    const isCorrect = await bcrypt.compare(thePassword, this.password)
    return isCorrect
}

module.exports = mongoose.model('User', UserShcema)