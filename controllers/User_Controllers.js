const Controllers = require('../helpers/Controllers')
const User_Models = require('../models/User_Models')
class User_Controllers extends Controllers{
    constructor(req, res){
        super(req, res)
        this.model = User_Models
        this.formList = this.arrayForm()
    }
    arrayForm(){
        return [
            { title: 'Email', type: 'email', col: 6, class: 'email', id: 'email', value:'', placeholder: 'Email', require: true },
            { title: 'Điện Thoại', type: 'tel', col: 6, class: 'phone', id: 'phone', value:'', placeholder: 'Điện Thoại', require: false },
            { title: 'Mật Khẩu', type: 'password', col: 6, class: 'password', id: 'password', value:'', placeholder: 'Mật Khẩu', require: true },
            { title: 'Xác Nhận Mật Khẩu', type: 'password', col: 6, class: 're_password', id: 're_password', value:'', placeholder: 'Xác Nhận Mật Khẩu', require: true },
        ];
    }
}
module.exports = User_Controllers