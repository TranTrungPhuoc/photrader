const Controllers = require('../helpers/Controllers')

const User_Models = require('../models/User_Models')

class User_Controllers extends Controllers{
    constructor(req, res){
        super(req, res)
        this.model = User_Models
    }
    async login(){
        return 'login'
    }
}
module.exports = User_Controllers