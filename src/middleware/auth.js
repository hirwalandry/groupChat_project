const Users = require('../models/Users')
const jwt = require('jsonwebtoken')


const auth = async(req, res, next) => {
    const token = req.header('Authorization').replace('bearer ', '')
    const decode = jwt.verify({_id: token.id}, 'uniqueGroup')
    const user = await Users.findOne({_id: decode.id, 'tokens.token' : token})
    try {
        if(!user){
            throw new Error({error: 'user doesnt exist'})
        }
        req.user = user
        req.token = token
    
        next()
    } catch (error) {
        res.status(401).send({error: 'please authenticate'})
    }
  

}

module.exports = auth