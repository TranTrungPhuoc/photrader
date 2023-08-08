const Models = require('../helpers/Models')
const Schema = require('../schemas/User_Schemas')

class User_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
}

module.exports = new User_Models()