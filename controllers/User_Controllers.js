const { default: mongoose } = require('mongoose')
const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const User_Models = require('../models/User_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
class User_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = User_Models
    }

    checkForm(id){
        const formList=this.formList(id);
        let errors = [];
        for (let index = 0; index < formList.length; index++) {
            const field=formList[index]['id']
            const value=this.getValue(field)
            const checkEmpty=Validation.checkEmpty(value)
            if(!checkEmpty){
                errors.push({ [field]: Error.index(401, field) })
            }else{
                if(field=='email'&&formList[index]['check']==true){
                    if(!this.checkFormatEmail()){
                        errors.push({ [field]: Error.index(402, field) })
                    }
                }
                if(field=='phone'&&formList[index]['check']==true){
                    if(!this.checkFormatPhone()){
                        errors.push({ [field]: Error.index(402, field) })
                    }
                }
                if(field=='password'&&formList[index]['check']==true){
                    if(!this.checkPasswordLength(6)){
                        errors.push({ [field]: Error.index(406, field, 6) })
                    }
                }
                if(field=='re_password'&&formList[index]['check']==true){
                    if(!this.checkPasswordCompare()){
                        errors.push({ [field]: Error.index(405) })
                    }
                }
            }
        }

        // if(errors.length>0){
        //     if(errors[0]['error']=='') errors[0]['error']=(await this.checkFieldExist('email', _id)).error;
        //     if(errors[1]['error']=='') errors[1]['error']=(await this.checkFieldExist('phone', _id)).error;
        // }

        return errors
    }
    async arrayForm(_id){
        let email='';
        let phone='';
        if(_id!=undefined){
            const getData=await this.model.getDetail({_id: new mongoose.Types.ObjectId(_id)})
            email=getData[0]['email']
            phone=getData[0]['phone']
        }
        const array = [
            { title: 'Email', type: 'email', col: 6, class: 'email form-control ', id: 'email', value: email, placeholder: 'Ví dụ: abc@gmail.com', require: true, disabled: false },
            { title: 'Điện Thoại', type: 'tel', col: 6, class: 'phone form-control ', id: 'phone', value: phone, placeholder: 'Ví dụ: 0333.444.555', require: true, disabled: false },
            { title: 'Mật Khẩu', type: 'password', col: 6, class: 'password form-control ', id: 'password', value:'', placeholder: '******', require: true, disabled: (_id!=undefined) ? true: false },
            { title: 'Xác Nhận Mật Khẩu', type: 'password', col: 6, class: 're_password form-control ', id: 're_password', value:'', placeholder: '******', require: true, disabled: (_id!=undefined) ? true: false },
        ]
        return array;
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
    formList(data){
        return [
            { title: 'Email', type: 'email', col: 6, class: 'email form-control ', id: 'email', value: (data.length==0)?'':data[0]['email'], placeholder: 'Ví dụ: abc@gmail.com', require: false, disabled: false, check: true },
            { title: 'Điện Thoại', type: 'tel', col: 6, class: 'phone form-control ', id: 'phone', value: (data.length==0)?'':data[0]['phone'], placeholder: 'Ví dụ: 0333.444.555', require: false, disabled: false, check: true },
            { title: 'Mật Khẩu', type: 'password', col: 6, class: 'password form-control ', id: 'password', value:'', placeholder: '******', require: false, disabled: (data.length==0)?false:true, check: true },
            { title: 'Xác Nhận Mật Khẩu', type: 'password', col: 6, class: 're_password form-control ', id: 're_password', value:'', placeholder: '******', require: false, disabled: (data.length==0)?false:true, check: true },
        ]
    }
    theadList(){
        return [
            {title: 'Tên', class:'', width: ''},
            {title: 'Ngày Tạo', class: 'text-center', width: '15%'},
            {title: 'Hiển Thị', class: 'text-center', width: '10%'},
            {title: 'Chức Năng', class: 'text-center', width: '15%'}
        ]
    }
    async tbodyList(){
        const array = await this.dataCommon('email')
        let tr='';
        for (let index = 0; index < array.length; index++) {
            let td='';
            td+=Html.td(array[index]['email'])
            td+=this.tdDate(array[index]['created'])
            td+=this.tdStatus(array[index]['_id'], array[index]['status'])
            td+=this.tdFunction(array[index]['_id'], this.params(2), array[index]['email'])
            tr+=Html.tr(td,array[index]['_id'])
        }
        return Html.tbody(tr)
    }
}
module.exports = User_Controllers