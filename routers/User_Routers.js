const express = require('express')
const router = express.Router()
const User_Controllers = require('../controllers/User_Controllers')
router.get('/index', (req, res) => new User_Controllers(req, res).index())
router.get('/add', (req, res) => new User_Controllers(req, res).form())
router.get('/edit/:id', (req, res) => new User_Controllers(req, res).form())
router.post('/process', (req, res) => new User_Controllers(req, res).process())
module.exports=router