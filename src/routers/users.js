const express = require('express')
const Users = require('../models/Users')

const router = new express.Router()

router.post('/users', async(req, res) => {
    try{
        const users = await new Users(req.body)
        const token = await users.generateAuthToken()
        
        await users.save()
        res.status(201).send({ users, token })
    }
    catch (error) {
        res.status(500).send()
    }

})
router.post('/login', async(req, res) => {
    try {
        const users = await Users.findByCredentials(req.body.username, req.body.password)
        const token = await users.generateAuthToken()
        res.send({ users, token })
    } catch (error) {
        res.status(500).send()
    }
})
module.exports = router