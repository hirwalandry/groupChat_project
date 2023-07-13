const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const groupMessagesSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        required: true
    },
    groupName: String
})

const groupMessages = model('groupMessages', groupMessagesSchema)

module.exports = groupMessages