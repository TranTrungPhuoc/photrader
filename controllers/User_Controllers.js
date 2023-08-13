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
        this.fullList = this.arrayFull()
        this.checkList = this.checkForm()
    }
    async checkForm(){
        const array = this.arrayForm()
        for (let index = 0; index < array.length; index++) { await this.checkEmpty(array[index].id,array[index].title)}
        await this.checkFormatEmail();
        await this.checkFormatPhone();
        await this.checkFieldExist('email', 'Email');
    }
    arrayForm(){
        return [
            { title: 'Email', type: 'email', col: 6, class: 'email form-control ', id: 'email', value:'', placeholder: 'Email', require: true },
            { title: 'Điện Thoại', type: 'tel', col: 6, class: 'phone form-control ', id: 'phone', value:'', placeholder: 'Điện Thoại', require: true },
            { title: 'Mật Khẩu', type: 'password', col: 6, class: 'password form-control ', id: 'password', value:'', placeholder: 'Mật Khẩu', require: true },
            { title: 'Xác Nhận Mật Khẩu', type: 'password', col: 6, class: 're_password form-control ', id: 're_password', value:'', placeholder: 'Xác Nhận Mật Khẩu', require: true },
        ];
    }
    async arrayFull(){ return await this.dataFull('email'); }
    async arrayBody(){ 
        const array = await this.dataCommon('email')
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
        return [
            {title: 'Tên', class:'', width: ''},
            {title: 'Ngày Tạo', class: 'text-center', width: '15%'},
            {title: 'Hiển Thị', class: 'text-center', width: '10%'},
            {title: 'Chức Năng', class: 'text-center', width: '15%'}
        ]
    }
}
module.exports = User_Controllers