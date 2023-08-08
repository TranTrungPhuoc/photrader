const express = require('express')
const router = express.Router()
const User_Controllers = require('../controllers/User_Controllers')
router.get('/', (req, res) => {
    res.render('partials/login')
})
router.post('/proccess', async (req, res) => {
    return await User_Controllers.login(req, res)
})
module.exports=router