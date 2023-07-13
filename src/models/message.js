const mongoose = require('mongoose')

const Schema = mongoose.Schema
const model = mongoose.model

const messageSchema = new Schema([{
    username: {
        type: String
    },
    text: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date().getTime()
    },
    groupName: String
}])
const Message = model('messages', messageSchema)

module.exports = Message
