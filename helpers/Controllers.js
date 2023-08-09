const Html = require('./Html')
const fs = require('fs');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const moment = require('moment')
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
                    Html.input(array[index].type, array[index].class, array[index].id, array[index].value, array[index].placeholder)))
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
        const data = await this.model.create(this.req.body)
        return this.res.send(data)
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
            str += Html.li(Html.span('pcoded-micon',Html.icon(array[index].icon)) + array[index].title, '/admin/' + array[index].link + '/index');
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
            str += Html.li(array[index].title, (array[index].link)? '/admin/' + array[index].link + '/index': '', array[index].icon, 'breadcrumb-item');
        }
        return Html.div('page-header', Html.div('page-block', Html.div('row align-items-center', 
            Html.div('col-md-12', Html.div('page-header-title', Html.h5(this.convertModule(this.params(2)),'m-b-10')) + Html.ul(str, 'breadcrumb'))))
        )
    }
    async theadCommon(){
        const array = await this.theadList
        let th=''; for (let index = 0; index < array.length; index++) { th+=Html.th(array[index]) }
        return Html.thead(Html.tr(th))
    }
    async content(array){
        return Html.div('row', Html.div('col-xl-12',
            Html.div('card', (
                this.params(3)=='index'? (
                    Html.div('card-header', Html.h5(Html.a(Html.icon('plus') + ' Thêm','/admin/'+this.params(2)+'/add','btn btn-outline-primary has-ripple'))) + 
                    Html.div('card-body table-border-style', Html.div('table-responsive', Html.table(await this.theadCommon(),await this.tbodyList)))
                )
                : Html.div('card-body', Html.div('card-body', Html.form(Html.div('row', array) + Html.submit())))
            )
        )))
    }
    convertDate(value){ const date = moment(value); return date.format('DD')+'/'+date.format('MM')+'/'+date.format('YYYY') }
    async main(array=[]){ return Html.section('pcoded-main-container', Html.div('pcoded-content', this.breadcrumb() + await this.content(array))); }
}
module.exports = Controllers