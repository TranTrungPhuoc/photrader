const Html = require('./Html')
const fs = require('fs');
class Controllers{
    constructor(req, res, model, formList){
        this.req = req
        this.res = res
        this.model = model
        this.formList = formList
    }
    async index(){
        const getList = await this.model.getList()
        return this.res.render('index', {aside: this.aside(), main: this.main(getList,this.convertModule(this.module()))})
    }
    form(){
        return this.res.render('index', {aside: this.aside(), main: this.main(this.formList,this.convertModule(this.module()))})
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
    module(){
        return this.req.originalUrl.split('/')[2]
    }
    page(){
        return this.req.originalUrl.split('/')[3]
    }
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
            {title: 'Bảng Điều Khiển', link: 'dashboard'},
            {title: this.convertModule(this.module()), link: this.module()},
            {title: (this.page()=='index'?'Bảng Dữ Liệu': 'Form'), link: ''}
        ]
        let str='';
        for (let index = 0; index < array.length; index++) {
            str += Html.li(array[index].title, (array[index].link)? '/admin/' + array[index].link + '/index': '', array[index].icon, 'breadcrumb-item');
        }
        return Html.div('page-header', Html.div('page-block', Html.div('row align-items-center', 
            Html.div('col-md-12', Html.div('page-header-title', Html.h5(this.convertModule(this.module()),'m-b-10')) + Html.ul(str, 'breadcrumb'))))
        )
    }
    table(array=[], _class='table table-striped'){ return '<table class="'+_class+'">'+this.thead(array) + this.tbody(array) +'</table>';}
    formDiv(array=[]){
        return Html.div('card-body', Html.form(Html.div('row', array)));
    }
    content(array){
        return Html.div('row', Html.div('col-xl-12', 
            Html.div('card', 
            (
                this.page()=='index'? (
                    Html.div('card-header', Html.h5('User')) + 
                    Html.div('card-body table-border-style', Html.div('table-responsive', Html.table(array)))
                )
                :
                Html.div('card-body', this.formDiv(array))
            )
        )))
    }
    main(array=[]){
        return Html.section('pcoded-main-container', Html.div('pcoded-content', this.breadcrumb() + this.content(array)));
    }
}
module.exports = Controllers