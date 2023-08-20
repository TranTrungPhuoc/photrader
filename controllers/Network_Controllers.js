const Controllers = require('../helpers/Controllers')
const Html = require('../helpers/Html')
const Network_Models = require('../models/Network_Models')
const Validation=require('../helpers/Validatation')
const Error=require('../helpers/Error')
const Convert=require('../helpers/Convert')
class Network_Controllers extends Controllers{
    
    constructor(req, res){
        super(req, res)
        this.model = Network_Models
        this.title = 'title'
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

    location(){
        return [
            {value: 'top', name: 'Top'},
            {value: 'bottom', name: 'Bottom'},
        ];
    }

    async formList(data){
        return [
            { title: 'Tên Icon', type: 'text', col: 4, class: 'title form-control ', id: 'title', value: (data.length==0)?'':data[0]['title'], placeholder: 'Nhập Icon', require: false, disabled: false, check: true, event: '' },
            { title: 'Link', type: 'text', col: 4, class: 'link form-control ', id: 'link', value: (data.length==0)?'':data[0]['link'], placeholder: 'Nhập Link', require: false, disabled: false, check: false, event: '' },
            { title: 'Vị Trí', type: 'select', col: 4, class: 'location form-control ', id: 'location', array: this.location(), require: false, disabled: false, check: false, event: '' },
            { title: 'Svg', type: 'textarea', col: 12, class: 'svg form-control ', id: 'svg', value: (data.length==0)?'':data[0]['svg'], placeholder: 'Nhập Svg', require: false, disabled: false, check: false, event: '' },
        ]
    }

    theadList(){
        return [
            {title: 'Tên Icon', class:'', width: ''},
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
module.exports = Network_Controllers