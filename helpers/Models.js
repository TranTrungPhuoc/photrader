class Models{
    constructor(table){
        this.table = table
    }
    async getList(){
        return await this.table.find().exec()
    }
    async getDetail(obj={}){
        return await this.table.find(obj).exec()
    }
    async create(body){
        return await this.table.create(body)
    }
}
module.exports = Models;