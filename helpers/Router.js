const express = require('express')
const router = express.Router()

const prefix = process.env.ROUTER_PREFIX

router.use('/login', require('../routers/Login_' + prefix))

router.use( '/admin/dashboard', require('../routers/Dashboard_' + prefix))
router.use( '/admin/user', require('../routers/User_' + prefix))
router.use( '/admin/category', require('../routers/Category_' + prefix))

module.exports=router