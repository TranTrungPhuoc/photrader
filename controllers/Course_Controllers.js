const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Course_Models = require('../models/Course_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')
class Course_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = Course_Models
        this.title = 'fullname'
    }

    async checkForm(id){
        const formList=await this.formList(id);
        let errors = [];
        for (let index = 0; index < formList.length; index++) {
            const field=formList[index]['id']
            const value=this.getValue(field)
            if(value != undefined && formList[index]['check']==true){
                const checkEmpty=Validation.checkEmpty(value)
                if(!checkEmpty){
                    errors.push({ [field]: Error.index(401, Convert.index(field)) })
                }
            }
        }
        return errors
    }

    async arrayFull(){ 
        return await this.dataFull(this.title);
    }

    schedule(){
        return [
            {value: '50', name: 'Học Phí 50.000.000Đ'},
        ];
    }

    async formList(data){
        return [
            { title: 'Họ & Tên', type: 'text', col: 6, class: 'fullname form-control ', id: 'fullname', value: (data.length==0)?'':data[0]['fullname'], placeholder: 'Nhập Họ & Tên', require: false, disabled: false, check: true, event: '' },
            { title: 'Email', type: 'email', col: 6, class: 'email form-control ', id: 'email', value: (data.length==0)?'':data[0]['email'], placeholder: 'Nhập Email', require: false, disabled: false, check: true, event: '' },
            { title: 'Điện Thoại', type: 'tel', col: 6, class: 'phone form-control ', id: 'phone', value: (data.length==0)?'':data[0]['phone'], placeholder: 'Nhập Điện Thoại', require: false, disabled: false, check: true, event: '' },
            { title: 'Lịch Học', type: 'select', col: 6, class: 'schedule form-control ', id: 'schedule', array: this.schedule(), require: false, disabled: false, check: true, event: '' },
        ]
    }

    theadList(){
        return [
            {title: 'Họ & Tên', class:'', width: ''},
            {title: 'Ngày Tạo', class: 'text-center', width: '15%'},
            {title: 'Hiển Thị', class: 'text-center', width: '10%'},
            {title: 'Chức Năng', class: 'text-center', width: '15%'}
        ]
    }

    async tbodyList(){
        const array = await this.dataCommon(this.title)
        let tr='';
        for (let index = 0; index < array.length; index++) {
            let td='';
            td+=Html.td(array[index][this.title])
            td+=this.tdDate(array[index]['created'])
            td+=this.tdStatus(array[index]['_id'], array[index]['status'])
            td+=this.tdFunction(array[index]['_id'], this.params(2), array[index][this.title])
            tr+=Html.tr(td,array[index]['_id'])
        }
        return Html.tbody(tr)
    }

}
module.exports = Course_Controllers