const Models = require('../helpers/Models')
const Schema = require('../schemas/Category_Schemas')
class Category_Models extends Models{
    constructor(table){
        super(table)
        this.table = Schema
    }
}
module.exports = new Category_Models