class Models{
    constructor(table){ this.table = table }
    async getList(select=''){ return await this.table.find().select(select).exec() }
    async getDetail(obj={}){ return await this.table.find(obj).exec() }
    async delete(obj={}){ return await this.table.deleteMany(obj)}
    async create(body){ return await this.table.create(body) }
    async update(id={}, value={}){ return await this.table.updateMany(id, value) }
}
module.exports = Models;