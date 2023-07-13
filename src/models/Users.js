const mongoose  = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const userSchema = new Schema({
    username: {
        type: String,
        unique: true,

    },
    password: {
        type: String,
        minlength: 5,

    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]

}, {collection: 'users'})
userSchema.statics.findByCredentials = async(username, password) => {
    const user = await Users.findOne({username})
    if(!user){
        throw new Error({error: 'user doesnt exist'})
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error({error: 'user doesnt exist'})
    }
    return user
}
userSchema.methods.generateAuthToken = async function(next){
    const token = await jwt.sign({_id: this.id.toString()}, 'uniqueGroup')
    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token

    next()
}
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})
const Users = model('Users', userSchema)
module.exports = Users