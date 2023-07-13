const express = require('express')
const Message = require('../models/message')

const router = new express.Router()

router.get('/chat', (req, res) => {
    const groupName = 'Unique-Group'
    Message.find({ groupName }).then((result) => {
        res.send(result)
    }).catch((e) => {
        res.send(e)
    })
})

module.exports = router