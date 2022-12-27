const User = require('../models/User')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization 
        
        if (!authHeader || !authHeader.startsWith('Bearer')){
            throw new Error('Authentication gagal')
        }
        
        const token = authHeader.split(' ')[1]
    
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            userId: payload.userId,
            name: payload.name
        }
        next()
    } catch(error){
        res.status(401).json({msg: error.message})
    }
}

module.exports = auth