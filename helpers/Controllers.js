const Html = require('./Html')
const fs = require('fs');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const moment = require('moment');
const mongoose = require('mongoose');
class Controllers{
    constructor(req, res, model){
        this.req = req
        this.res = res
        this.model = model
        // this.formList = this.arrayForm()
        // this.theadList = this.arrayThead()
        // this.tbodyList = this.arrayBody()
        // this.fullList = this.arrayFull()
        // this.checkList = this.checkForm()
    }
    async index(){
        return this.res.render('index', {
            aside: this.aside(), 
            module: this.params(2), 
            main: await this.main()
        })
    }
    async form(){ 
        return this.res.render('index', {
            aside: this.aside(), 
            module: this.params(2), 
            main: await this.main(await this.configFormList())
        }) 
    }
    async configFormList(){
        const array = await this.arrayForm()
        let str='';
        for (let index = 0; index < array.length; index++) {
            str+=Html.div('col-md-'+array[index].col, 
                Html.div('form-group fill', 
                    Html.label(array[index].title,'form-label') + 
                    Html.input(array[index].type, array[index].class, array[index].id, array[index].value, array[index].placeholder, array[index].require) +
                    Html.span('error_'+array[index].id)
                ))
        }
        return str;
    }
    async process(){
        await this.checkForm()
        return
        if(this.req.body['password']!=undefined) this.req.body['password'] = bcrypt.hashSync(this.req.body['password'], salt);
        if(this.req.body['re_password']!=undefined) delete this.req.body['re_password'];
        await this.model.create(this.req.body)
        return this.res.send({code: 200})
    }
    async delete(){
        await this.model.delete({_id: new mongoose.Types.ObjectId(this.req.body.id)})
        return this.res.send({code: 200})
    }
    async status(){
        await this.model.update({
            _id: new mongoose.Types.ObjectId(this.req.body.id)}, 
            {status: this.req.body.status, updated: new Date()}
        )
        return this.res.send({code: 200})
    }
    
    async dataCommon(key=''){
        const limit = this.getNumber(this.req.query.limit, process.env.LIMIT)
        const page = this.getNumber(this.req.query.page, 0)
        const skip = (page==1 || page==0) ? 0 : (page-1)*limit
        return await this.model.getList(this.search(key), '', limit, skip)
    }
    async dataFull(key=''){ 
        return await this.model.getFull(this.search(key),'_id') 
    }
    async pagination(){
        const sumData = await this.fullList
        let li='';
        if(sumData.length > 0){
            const page = this.getNumber(this.req.query.page, 1)
            const totalPage=Math.ceil(sumData.length/process.env.LIMIT);
            li = Html.li(Html.a(Html.icon('chevrons-left'), '/', 'page-link'),'paginate_button page-item previous' + (page==1?' disabled':''))
            for (let index = 1; index <= totalPage; index++) {
                li+=Html.li(Html.a(index, '?page='+index + (this.req.query.search?'&search='+this.req.query.search:''), 'page-link'), 'paginate_button page-item' + (page==index ? ' active': ''))
            }
            li+=Html.li(Html.a(Html.icon('chevrons-right'), '/', 'page-link'),'paginate_button page-item next' + (page==totalPage?' disabled':''))
        }
        return Html.div('row', Html.div('col-sm-12', Html.div('dataTables_paginate paging_simple_numbers', Html.ul(li, 'pagination'))))
    }
    async theadCommon(){
        const array = await this.theadList
        let th=''; for (let index = 0; index < array.length; index++) { th+=Html.th(array[index]['title'], array[index]['class'], array[index]['width']) }
        return Html.thead(Html.tr(th))
    }
    async content(array){
        return Html.div('row', Html.div('col-xl-12',
            Html.div('card', (
                this.params(3).split('?')[0]=='index'? (
                    Html.div('card-header', Html.div('row', Html.div('col-md-8', Html.h5(Html.a(Html.icon('plus') + ' Thêm','/admin/'+this.params(2)+'/add','btn btn-outline-primary has-ripple'))) + Html.div('col-md-4', Html.form(Html.div('input-group', Html.input('text', 'form-control', 'search', this.req.query.search, 'Tìm Kiếm')), 'formSearch')))) + 
                    Html.div('card-body table-border-style', Html.div('table-responsive', Html.table(await this.theadCommon(),await this.tbodyList)) + await this.pagination() )
                )
                : Html.div('card-body', Html.div('card-body', Html.form(Html.div('row', array) + Html.div('', '<br />' + Html.submit('btn btn-outline-primary has-ripple', 'Lưu') + '&nbsp;' + Html.a('Thoát','/admin/'+this.params(2)+'/index', 'btn btn-outline-secondary has-ripple')) + Html.div('loading', '<br/>' + Html.spiner()))))
            )
        )))
    }
    async main(array=[]){
        try {
            return Html.section('pcoded-main-container', Html.div('pcoded-content', this.breadcrumb() + await this.content(array)));
        } catch (error) {
            this.res.send({error})
        }
    }
    async checkEmpty(field){
        return (this.req.body[field] != undefined && this.req.body[field].trim() == '') ? {key: field, error: this.errorCode(401, this.convertText(field))} : {}
    }
    async checkFormatEmail(){
        if(this.req.body['email'] != undefined){
            if(!this.validateEmail(this.req.body['email'])){
                return this.res.send({error: this.errorCode(402, 'Email')})
            }
        }
        return false
    }
    async checkFormatPhone(){
        if(this.req.body['phone'] != undefined){
            if(!this.regexPhoneNumber(this.req.body['phone'])){
                return this.res.send({error: this.errorCode(402, 'Điện Thoại')})
            }
        }
        return false
    }
    async checkFieldExist(field){
        if(this.req.body[field]!=undefined){
            const getData = await this.model.getDetail({[field]: this.req.body[field]})
            if(getData.length!=0) return this.res.send({error: this.errorCode(403, this.convertText(field))})
        }
        return false
    }
    async checkCompare(){
        if(this.req.body['password']!=undefined && this.req.body['re_password']!=undefined){
            if(this.req.body['password']!=this.req.body['re_password']){
                return this.res.send({error: this.errorCode(405)})
            } 
        }
        return false
    }
    regexPhoneNumber(phone){
        const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
        return phone.match(regexPhoneNumber) ? true : false;
    }
    validateEmail(email){
        const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email.match(regexEmail) ? true : false;
    };
    convertText(key=''){
        let str='';
        switch (key) {
            case 'user': str='Thành Viên'; break;
            case 'post': str='Bài Viết'; break;
            case 'category': str='Danh Mục'; break;
            case 'email': str='Email'; break;
            case 'phone': str='Điện Thoại'; break;
            case 'password': str='Mật Khẩu'; break;
            case 're_password': str='Xác Nhận Mật Khẩu'; break;
            default: str='No Name'; break;
        }
        return str;
    }
    params(so){ return this.req.originalUrl.split('/')[so] }
    aside(){
        const array = JSON.parse(fs.readFileSync('aside.json')).data;
        let str='';
        for (let index = 0; index < array.length; index++) {
            str += Html.li(Html.a(Html.span('pcoded-micon',Html.icon(array[index].icon)) + array[index].title,'/admin/' + array[index].link + '/index','nav-link has-ripple'), (this.params(2)==array[index].link?'nav-item active': 'nav-item'));
        }
        return Html.ul(str)
    }
    breadcrumb(){
        const array=[
            {title: Html.icon('home'), link: 'dashboard'},
            {title: this.convertText(this.params(2)), link: this.params(2)},
            {title: (this.params(3)=='index'?'Bảng Dữ Liệu': 'Form'), link: ''}
        ]
        let str='';
        for (let index = 0; index < array.length; index++) {
            str += Html.li(Html.a(array[index].title, array[index].link?'/admin/' + array[index].link + '/index': '',''), 'breadcrumb-item');
        }
        return Html.div('page-header', Html.div('page-block', Html.div('row align-items-center', 
            Html.div('col-md-12', Html.div('page-header-title', Html.h5(this.convertText(this.params(2)),'m-b-10')) + Html.ul(str, 'breadcrumb'))))
        )
    }
    search(key=''){ 
        return (this.req.query.search) ? { [key]: {'$regex': this.req.query.search, '$options': 'i'}}: {}; 
    }
    getNumber(value, _default){ 
        return value?!isNaN(value) ? parseInt(value): _default: _default 
    }
    convertDate(value){ 
        const date = moment(value); return date.format('DD')+'/'+date.format('MM')+'/'+date.format('YYYY') 
    }
    errorCode(code, text){
        let str='';
        switch (code) {
            case 401: str=text + ' không được rỗng !!!'; break;
            case 402: str=text + ' không đúng định dạng !!!'; break;
            case 403: str=text + ' đã tồn tại !!!'; break;
            case 405: str='Xác nhận Mật Khẩu không đúng !!!'; break;
            default: str='No Response'; break;
        }
        return str;
    }
}
module.exports = Controllers