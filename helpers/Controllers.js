const Html = require('./Html')
const fs = require('fs');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const moment = require('moment');
const mongoose = require('mongoose');
const Validation=require('./Validatation')
const Convert=require('./Convert')
class Controllers{
    
    constructor(req, res, model){
        this.req=req
        this.res=res
        this.model=model
        this.module=this.params(2)
    }

    params(so){ 
        return this.req.originalUrl.split('/')[so] 
    }
    
    addHtml(){
        return Html.div('col-md-8', Html.h5(Html.a(Html.icon('plus') + ' Thêm','/admin/'+this.module+'/add','btn btn-outline-primary has-ripple')))
    }

    searchHtml(){
        return Html.div('col-md-4', Html.form(Html.div('input-group', Html.input('text', 'form-control', 'search', this.req.query.search, 'Tìm Kiếm')), 'formSearch'))
    }

    async pagination(){
        const sumData = await this.arrayFull()
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

    headerContent(){
        return Html.div('card-header', Html.div('row', this.addHtml() + this.searchHtml()))
    }

    async bodyContent(){
        return Html.div('card-body table-border-style', Html.div('table-responsive', Html.table(await this.theadCommon(),await this.arrayBody())) + await this.pagination() )
    }

    formContent(array){
        return Html.div('card-body', Html.div('card-body', Html.form(Html.div('row', array) + Html.div('', '<br />' + Html.submit('btn btn-outline-primary has-ripple', 'Lưu') + '&nbsp;' + Html.a('Thoát','/admin/'+this.module+'/index', 'btn btn-outline-secondary has-ripple')) + Html.div('loading', '<br/>' + Html.spiner()))))
    }

    action(){
        return this.params(3).split('?')[0]
    }

    async content(array){
        return Html.div('row', Html.div('col-xl-12', Html.div('card', (this.action()=='index'? (this.headerContent() + await this.bodyContent()) : this.formContent(array)))))
    }

    breadcrumbHTML(str){
        const title=Html.div('page-header-title', Html.h5(Convert.index(this.module),'m-b-10'))
        const url=Html.ul(str, 'breadcrumb')
        return Html.div('page-header', Html.div('page-block', Html.div('row align-items-center', Html.div('col-md-12', title + url ))))
    }

    breadcrumb(){
        const array=[
            {title: Html.icon('home'), link: 'dashboard'},
            {title: Convert.index(this.module), link: this.module},
            {title: (this.params(3)=='index'?'Bảng Dữ Liệu': 'Form'), link: ''}
        ]
        let str='';
        for (let index = 0; index < array.length; index++) {
            str += Html.li(Html.a(array[index].title, array[index].link?'/admin/' + array[index].link + '/index': '',''), 'breadcrumb-item');
        }
        return this.breadcrumbHTML(str)
    }

    async main(array=[]){
        return Html.section('pcoded-main-container', Html.div('pcoded-content', this.breadcrumb() + await this.content(array)));
    }

    aside(){
        const array = JSON.parse(fs.readFileSync('aside.json')).data;
        let str='';
        for (let index = 0; index < array.length; index++) {
            str += Html.li(Html.a(Html.span('pcoded-micon',Html.icon(array[index].icon)) + array[index].title,'/admin/' + array[index].link + '/index','nav-link has-ripple'), (this.params(2)==array[index].link?'nav-item active': 'nav-item'));
        }
        return Html.ul(str)
    }

    async index(array=[]){ await this.res.render('index', { aside: this.aside(), module: this.module, main: await this.main(array) }) }

    async formHTML(id){
        const data=await this.model.getDetail({_id: new mongoose.Types.ObjectId(id)})
        const array=await this.formList(data)
        let str='';
        for (let index = 0; index < array.length; index++) {
            str+=Html.div('col-md-'+array[index]['col'], 
            Html.div('form-group fill', Html.label(array[index]['title'],'form-label') + 
                Html.input(array[index]['type'], array[index]['class'], array[index]['id'], array[index]['value'], array[index]['placeholder'], array[index]['require'], array[index]['disabled']) +
                Html.span('error error_'+array[index]['id'])
            ))
        }
        if(id!=undefined){str+=Html.input('hidden','','idEdit',id)}
        return str;
    }

    async form(){
        const id = this.req.params['id']
        return await this.index(await this.formHTML(id));
    }

    getValue(field){
        return this.req.body[field]
    }

    async process(){
        const id=this.req.query['id']
        let error=[];
        error=this.checkForm(id)
        if(error.length == 0){
            if(this.req.body['password']!=undefined){ this.req.body['password'] = bcrypt.hashSync(this.req.body['password'], salt); }
            (id == 'undefined') ? await this.model.create(this.req.body) : await this.model.update(this.objectId(id), this.req.body);
        }
        return this.res.send(error)
    }

    checkFormatEmail(){
        return Validation.checkEmail(this.getValue('email'))
    }

    checkFormatPhone(){
        return Validation.checkPhone(this.getValue('phone'))
    }

    checkPasswordLength(number){
        return Validation.checkMaxLength(this.getValue('password'), number)
    }

    checkPasswordCompare(){
        return Validation.checkCompare(this.getValue('password'), this.getValue('re_password'))
    }

    objectId(id){
        return {_id: new mongoose.Types.ObjectId(id)}
    }

    async delete(){
        await this.model.delete(this.objectId(this.req.body.id))
        return this.res.send({code: 200})
    }

    async status(){
        await this.model.update(this.objectId(this.req.body.id), {status: this.req.body.status, updated: new Date()})
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

    theadCommon(){
        const array = this.theadList()
        let th=''; for (let index = 0; index < array.length; index++) { th+=Html.th(array[index]['title'], array[index]['class'], array[index]['width']) }
        return Html.thead(Html.tr(th))
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

    // tbody elements
    tdDate(date){
        return Html.td(this.convertDate(date), 'text-center')
    }
    tdStatus(id, status){
        return Html.td(Html.switch(id, (status==true?'checked':'')), 'text-center')
    }
    tdEdit(id, module){
        return Html.a(Html.icon('edit'),'/admin/'+module+'/edit/'+id,'btn btn-sm btn-outline-info has-ripple')
    }
    tdDelete(id, value){
        return Html.button(Html.icon('trash'),'btn btn-sm btn-outline-danger has-ripple', ' data-bs-toggle="modal" data-bs-target="#deleteModal"', "popupDelete('"+id+"', '"+value+"')")
    }
    tdFunction(id, module, value){
        return Html.td(this.tdEdit(id, module) + '&nbsp;' + this.tdDelete(id, value))
    }
    // end
}
module.exports = Controllers