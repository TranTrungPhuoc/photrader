const express = require('express')
const router = express.Router()
const Controllers = require('../controllers/Mail_Controllers')
router.get('/form', (req, res) => new Controllers(req, res).form())
router.post('/process', (req, res) => new Controllers(req, res).process())
module.exports=router