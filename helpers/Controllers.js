const Html = require('./Html')
const fs = require('fs');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const moment = require('moment');
const { default: mongoose } = require('mongoose');
class Controllers{
    constructor(req, res, model, formList, theadList, tbodyList){
        this.req = req
        this.res = res
        this.model = model
        this.formList = formList
        this.theadList = theadList
        this.tbodyList = tbodyList
    }
    async index(){
        return this.res.render('index', {
            aside: this.aside(), 
            module: this.params(2), 
            main: await this.main()
        })
    }
    configFormList(){
        const array = this.formList
        let str='';
        for (let index = 0; index < array.length; index++) {
            str+=Html.div('col-md-'+array[index].col, 
                Html.div('form-group fill', 
                    Html.label(array[index].title,'form-label') + 
                    Html.input(array[index].type, array[index].class, array[index].id, array[index].value, array[index].placeholder, array[index].require)))
        }
        return str;
    }
    async form(){ return this.res.render('index', {aside: this.aside(), module: this.params(2), main: await this.main(this.configFormList())}) }
    async process(){
        if(this.req.body['re_password']!=undefined) delete this.req.body['re_password'];
        if(this.req.body['password']!=undefined) this.req.body['password'] = bcrypt.hashSync(this.req.body['password'], salt);
        if(this.req.body['email']!=undefined){
            const getData = await this.model.getDetail({email: this.req.body['email']})
            if(getData.length!=0) return this.res.send({error: 'Email đã tồn tại!'})
        }
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
    convertModule(key=''){
        let str='';
        switch (key) {
            case 'user': str='Thành Viên'; break;
            case 'post': str='Bài Viết'; break;
            case 'category': str='Danh Mục'; break;
            default: str='No Name'; break;
        }
        return str;
    }
    params(so){ return this.req.originalUrl.split('/')[so] }
    aside(){
        const array = JSON.parse(fs.readFileSync('aside.json')).data;
        let str='';
        for (let index = 0; index < array.length; index++) {
            str += Html.li(Html.a(Html.span('pcoded-micon',Html.icon(array[index].icon)) + array[index].title,'/admin/' + array[index].link + '/index','nav-link has-ripple'));
        }
        return Html.ul(str)
    }
    breadcrumb(){
        const array=[
            {title: Html.icon('home'), link: 'dashboard'},
            {title: this.convertModule(this.params(2)), link: this.params(2)},
            {title: (this.params(3)=='index'?'Bảng Dữ Liệu': 'Form'), link: ''}
        ]
        let str='';
        for (let index = 0; index < array.length; index++) {
            str += Html.li(Html.a(array[index].title, array[index].link?'/admin/' + array[index].link + '/index': '',''), 'breadcrumb-item');
        }
        return Html.div('page-header', Html.div('page-block', Html.div('row align-items-center', 
            Html.div('col-md-12', Html.div('page-header-title', Html.h5(this.convertModule(this.params(2)),'m-b-10')) + Html.ul(str, 'breadcrumb'))))
        )
    }
    search(key=''){
        return (this.req.query.search) ? { [key]: {'$regex': this.req.query.search, '$options': 'i'}}: {};
    }
    getNumber(value, _default){
        return value?!isNaN(value) ? parseInt(value): _default: _default
    }
    async pagination(){
        const data = await this.model.getFull('_id')
        const totalPage=Math.ceil(data.length/process.env.LIMIT)
        let li = Html.li(Html.a('Previous', '/', 'page-link'),'paginate_button page-item previous disabled')
        for (let index = 1; index <= totalPage; index++) {
            li+=Html.li(Html.a(index, '/', 'page-link'),'paginate_button page-item')
        }
        li+=Html.li(Html.a('Next', '/', 'page-link'),'paginate_button page-item next')
        return Html.div('row', Html.div('col-sm-12 col-md-5', Html.div('dataTables_info', 'Showing 1 to 10 of 20 entries')) + Html.div('col-sm-12 col-md-7 text-right', Html.div('dataTables_paginate paging_simple_numbers', Html.ul(li, 'pagination'))))
    }
    async theadCommon(){
        const array = await this.theadList
        let th=''; for (let index = 0; index < array.length; index++) { th+=Html.th(array[index]) }
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
    convertDate(value){ const date = moment(value); return date.format('DD')+'/'+date.format('MM')+'/'+date.format('YYYY') }
    async main(array=[]){ return Html.section('pcoded-main-container', Html.div('pcoded-content', this.breadcrumb() + await this.content(array))); }
}
module.exports = Controllers