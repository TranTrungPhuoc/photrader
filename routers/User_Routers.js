const express = require('express')
const router = express.Router()
const User_Controllers = require('../controllers/User_Controllers')
router.get('/index', (req, res) => new User_Controllers(req, res).index())
router.get('/form', (req, res) => new User_Controllers(req, res).form())
module.exports=router