const Html = require('./Html')
const fs = require('fs');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
class Controllers{
    constructor(req, res, model, formList){
        this.req = req
        this.res = res
        this.model = model
        this.formList = formList
    }
    async index(){
        const getList = await this.model.getList()
        return this.res.render('index', {aside: this.aside(), module: this.params(2), main: this.main(getList,this.convertModule(this.params(2)))})
    }
    configFormList(){
        const array = this.formList
        let str='';
        for (let index = 0; index < array.length; index++) {
            str+=Html.div('col-md-'+array[index].col, Html.div('form-group fill', Html.label(array[index].title,'form-label') + Html.input(array[index].type, array[index].class, array[index].id, array[index].value, array[index].placeholder)))
        }
        return str;
    }
    form(){ return this.res.render('index', {aside: this.aside(), module: this.params(2), main: this.main(this.configFormList(),this.convertModule(this.params(2)))}) }
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
            str += Html.li(array[index].title, '/admin/' + array[index].link + '/index', array[index].icon, 'pcoded-micon');
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
    table(array=[], _class='table table-striped'){ return '<table class="'+_class+'">'+this.thead(array) + this.tbody(array) +'</table>';}
    content(array){
        return Html.div('row', Html.div('col-xl-12',
            Html.div('card', (
                this.params(3)=='index'? (
                    Html.div('card-header', Html.h5('User')) + 
                    Html.div('card-body table-border-style', Html.div('table-responsive', Html.table(array)))
                )
                : Html.div('card-body', Html.div('card-body', Html.form(Html.div('row', array) + Html.submit())))
            )
        )))
    }
    main(array=[]){ return Html.section('pcoded-main-container', Html.div('pcoded-content', this.breadcrumb() + this.content(array))); }
}
module.exports = Controllers