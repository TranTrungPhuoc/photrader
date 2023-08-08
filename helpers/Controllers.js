const Html = require('./Html')
const fs = require('fs');
class Controllers{
    constructor(req, res, model){
        this.req = req
        this.res = res
        this.model = model
    }
    async index(){
        const getList = await this.model.getList()
        return this.res.render('index', {aside: this.aside(), main: Html.main()})
    }
    aside(){
        const array = JSON.parse(fs.readFileSync('aside.json')).data;
        let str='';
        for (let index = 0; index < array.length; index++) {
            str += Html.li(array[index].title, '/admin/' + array[index].link + '/index', array[index].icon, 'pcoded-micon');
        }
        return Html.ul(str)
    }
}
module.exports = Controllers