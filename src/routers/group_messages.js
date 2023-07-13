const express = require('express')
const groupMessages = require('../models/groupMessages')

const router = new express.Router()

router.post('storeMessages', async(req, res) => {

    const group_messages = new groupMessages(req.body)

    await group_messages.save()
    res.send(group_messages)
})

router.get('retrieveMessages', async(req, res) => {

    const group_messages =  await groupMessages.find()
    res.send(group_messages)
})

module.exports = router