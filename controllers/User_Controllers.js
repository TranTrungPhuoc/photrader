const { default: mongoose } = require('mongoose')
const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const User_Models = require('../models/User_Models')
class User_Controllers extends Controllers{
    constructor(req, res){
        super(req, res)
        this.model = User_Models
    }
    async checkForm(){
        const array = await this.arrayForm(); let errors = [];
        const _id=array[0]['_id']
        for (let index = 0; index < array.length; index++) errors.push(await this.checkEmpty(array[index].id, array[index].title))
        if(errors[0]['error']=='') errors[0]['error']=(await this.checkFormatEmail()).error;
        if(errors[0]['error']=='') errors[0]['error']=(await this.checkFieldExist('email', _id)).error;
        if(errors[1]['error']=='') errors[1]['error']=(await this.checkFormatPhone()).error;
        if(errors[1]['error']=='') errors[1]['error']=(await this.checkFieldExist('phone', _id)).error;
        if(errors[2]['error']=='') errors[2]['error']=(await this.checkLength('password', 6)).error;
        if(errors[3]['error']=='') errors[3]['error']=(await this.checkCompare()).error;
        return errors
    }
    async arrayForm(){
        let email=''; let phone='';
        const _id = this.req.params.id;
        if(_id!=undefined){
            const getData=await this.model.getDetail({_id: new mongoose.Types.ObjectId(_id)})
            email=getData[0]['email']
            phone=getData[0]['phone']
        }
        return [
            { _id, title: 'Email', type: 'email', col: 6, class: 'email form-control ', id: 'email', value: email, placeholder: 'Ví dụ: abc@gmail.com', require: true, disabled: false },
            { _id, title: 'Điện Thoại', type: 'tel', col: 6, class: 'phone form-control ', id: 'phone', value: phone, placeholder: 'Ví dụ: 0333.444.555', require: true, disabled: false },
            { _id, title: 'Mật Khẩu', type: 'password', col: 6, class: 'password form-control ', id: 'password', value:'', placeholder: '******', require: true, disabled: (_id!=undefined) ? true: false },
            { _id, title: 'Xác Nhận Mật Khẩu', type: 'password', col: 6, class: 're_password form-control ', id: 're_password', value:'', placeholder: '******', require: true, disabled: (_id!=undefined) ? true: false },
        ];
    }
    async arrayFull(){ 
        return await this.dataFull('email'); 
    }
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