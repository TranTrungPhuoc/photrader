const express = require('express')
const router = express.Router()
const prefix = process.env.ROUTER_PREFIX
router.use('/login', require('../routers/Login_' + prefix))
const array = ['Dashboard', 'User', 'Category', 'Post', 'Menu', 'Share'];
for (let index = 0; index < array.length; index++) {
    const element = array[index];
    router.use( '/admin/'+element.toLowerCase(), require('../routers/'+element+'_' + prefix))
}
module.exports=router