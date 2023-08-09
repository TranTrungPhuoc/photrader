const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const User_Models = require('../models/User_Models')

class User_Controllers extends Controllers{
    constructor(req, res){
        super(req, res)
        this.model = User_Models
        this.formList = this.list()
    }
    list(){
        const array = [
            { title: 'Email', col: 6, class: 'email', id: 'email', value:'', placeholder: 'Email', require: true },
            { title: 'Điện Thoại', col: 6, class: 'phone', id: 'phone', value:'', placeholder: 'phone', require: false },
            { title: 'Mật Khẩu', col: 6, class: 'password', id: 'password', value:'', placeholder: 'Mật Khẩu', require: true },
        ]
        let str='';
        for (let index = 0; index < array.length; index++) {
            str+=Html.div('col-md-'+array[index].col, Html.div('form-group fill', Html.label(array[index].title,'form-label') + Html.input('text', array[index].class, array[index].id, array[index].value, array[index].placeholder)))
        }
        return str;
    }
}
module.exports = User_Controllers