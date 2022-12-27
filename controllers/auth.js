const User = require('../models/User')

// createJWT dan comparePassword custom method dari models/User.js
const register = async (req, res) => {
    try{   
        const user = await User.create( {...req.body} )
        const token = user.createJWT()

        res.status(201).json({user: {name: user.name}, token})
    } catch (error){
        res.status(400).json({msg: error.message})
    }
    
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password){
            throw new Error('Masukan email dan password')
        }

        const user = await User.findOne({email})

        if (!user){
            throw new Error('User tidak ditemukan')
        } 

        const isPasswordCorrect = await user.comparePassword(password)

        if (!isPasswordCorrect){
            throw new Error('Password salah')
        }

        const token = user.createJWT()
        res.status(200).json({user: {name: user.name}, token})
    } catch(error){
        res.status(400).json({msg: error.message})
    }
}

module.exports = {register, login}