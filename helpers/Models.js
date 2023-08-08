class Models{
    constructor(table){
        this.table = table
    }
    async getList(){
        return await this.table.find().exec()
    }
}
module.exports = Models;