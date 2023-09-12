const Api = require('../helpers/Api')
const Category_Models = require('../models/Category_Models')
class Category_Api extends Api{
    constructor(req, res){
        super(req, res)
    }

    async getItemsNews(){
        const { type, limit } = this.req.query
        const data = await Category_Models.getItemsNews(type, parseInt(limit));
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            for (let j = 0; j < element['Posts'].length; j++) {
                const element2 = element['Posts'][j];
                element2['avatar'] = element2['avatar']!=''?this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element2['avatar']:'';
            }
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async getItemsHome(){
        const { type, limit } = this.req.query
        const data = await Category_Models.getItemsHome(type, parseInt(limit));
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            for (let j = 0; j < element['Posts'].length; j++) {
                const element2 = element['Posts'][j];
                element2['avatar'] = element2['avatar']!=''?this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element2['avatar']:'';
            }
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async getItemsDetail(){
        const { slug } = this.req.params
        const data = await Category_Models.getItemsDetail(slug);
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            for (let j = 0; j < element['Posts'].length; j++) {
                const element2 = element['Posts'][j];
                element2['avatar'] = element2['avatar']!=''?this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element2['avatar']:'';
            }
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async getViewMore(){
        const { slug } = this.req.params
        const data = await Category_Models.getItemsDetail(slug);
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            for (let j = 0; j < element['Posts'].length; j++) {
                const element2 = element['Posts'][j];
                element2['avatar'] = element2['avatar']!=''?this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element2['avatar']:'';
            }
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }

    async getItemsHomeDetail(){
        const { slug } = this.req.params
        const data = await Category_Models.getItemsDetail(slug);
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            for (let j = 0; j < element['Posts'].length; j++) {
                const element2 = element['Posts'][j];
                element2['avatar'] = element2['avatar']!=''?this.req.protocol + '://' + this.req.headers.host + '/uploads/post/' + element2['avatar']:'';
            }
        }
        return this.res.send({
            code: 200,
            message: "Success",
            response: data
        })
    }
}

module.exports = Category_Api