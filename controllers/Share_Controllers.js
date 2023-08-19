const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Share_Models = require('../models/Share_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')
class Share_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = Share_Models
        this.title = 'command'
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

    resultList(){
        return [
            {value: 'win', name: 'Win'},
            {value: 'lost', name: 'Lost'},
            {value: 'pending', name: 'Pending'}
        ];
    }

    makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    async formList(data){
        return [
            { title: 'Mã', type: 'hidden', col: 6, class: 'code form-control ', id: 'code', value: (data.length==0)?'PTD-'+this.makeid(5):data[0]['code'], placeholder: '', require: false, disabled: false, check: true, event: '' },
            { title: 'Lệnh', type: 'text', col: 4, class: 'command form-control ', id: 'command', value: (data.length==0)?'':data[0]['command'], placeholder: 'Nhập Lệnh', require: false, disabled: false, check: true, event: '' },
            { title: 'Entry', type: 'text', col: 4, class: 'entry form-control ', id: 'entry', value: (data.length==0)?'':data[0]['entry'], placeholder: 'Nhập Entry', require: false, disabled: false, check: true, event: '' },
            { title: 'Sl', type: 'text', col: 4, class: 'sl form-control ', id: 'sl', value: (data.length==0)?'':data[0]['sl'], placeholder: 'Nhập Sl', require: false, disabled: false, check: true, event: '' },
            { title: 'Tp', type: 'text', col: 4, class: 'tp form-control ', id: 'tp', value: (data.length==0)?'':data[0]['tp'], placeholder: 'Nhập Tp', require: false, disabled: false, check: true, event: '' },
            { title: 'Link', type: 'text', col: 4, class: 'link form-control ', id: 'link', value: (data.length==0)?'':data[0]['link'], placeholder: 'Nhập Link', require: false, disabled: false, check: false, event: '' },
            { title: 'Kết quả', type: 'select', col: 4, class: 'result form-control ', id: 'result', array: this.resultList(), require: false, disabled: false, check: false, event: '' },
            { title: 'Mô tả', type: 'textarea', col: 12, class: 'description form-control ', id: 'description', value: (data.length==0)?'':data[0]['description'], placeholder: 'Nhập mô tả...', row: 3, check: false },
        ]
    }

    theadList(){
        return [
            {title: 'Lệnh', class:'', width: ''},
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
module.exports = Share_Controllers