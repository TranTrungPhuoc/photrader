const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const User_Models = require('../models/User_Models')
class User_Controllers extends Controllers{
    constructor(req, res){
        super(req, res)
        this.model = User_Models
        this.formList = this.arrayForm()
        this.theadList = this.arrayThead()
        this.tbodyList = this.arrayBody()
    }
    arrayForm(){
        return [
            { title: 'Email', type: 'email', col: 6, class: 'email form-control ', id: 'email', value:'', placeholder: 'Email', require: true },
            { title: 'Điện Thoại', type: 'tel', col: 6, class: 'phone form-control ', id: 'phone', value:'', placeholder: 'Điện Thoại', require: false },
            { title: 'Mật Khẩu', type: 'password', col: 6, class: 'password form-control ', id: 'password', value:'', placeholder: 'Mật Khẩu', require: true },
            { title: 'Xác Nhận Mật Khẩu', type: 'password', col: 6, class: 're_password form-control ', id: 're_password', value:'', placeholder: 'Xác Nhận Mật Khẩu', require: true },
        ];
    }
    async arrayBody(){
        const limit = this.getNumber(this.req.query.limit, process.env.LIMIT)
        const page = this.getNumber(this.req.query.page, 0)
        const skip = (page==1 || page==0) ? 0 : (page-1)*limit
        const array = await this.model.getList(this.search('email'), '', limit, skip)
        let tr='';
        for (let index = 0; index < array.length; index++) {
            let td='';
            td+=Html.td(array[index]['email'])
            td+=Html.td(this.convertDate(array[index]['created']), 'text-center')
            td+=Html.td(Html.switch(array[index]['_id'], (array[index]['status']==true?'checked':'')), 'text-center')
            td+=Html.td(
                Html.a(Html.icon('edit'),'/admin/'+this.params(2)+'/edit/'+array[index]['_id'],'btn btn-sm btn-outline-info has-ripple') + '&nbsp;' +
                Html.button(Html.icon('trash'),'btn btn-sm btn-outline-danger has-ripple', ' data-bs-toggle="modal" data-bs-target="#deleteModal"', "popupDelete('"+array[index]['_id']+"', '"+array[index]['email']+"')"), 
                'text-center'
            )
            tr+=Html.tr(td,array[index]['_id'])
        }
        return Html.tbody(tr)
    }
    arrayThead(){
        return ['Tên', 'Ngày Tạo', 'Hiển Thị', 'Chức Năng']
    }
}
module.exports = User_Controllers