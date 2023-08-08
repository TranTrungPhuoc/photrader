const Html = require('./Html')

class Controllers{
    constructor(req, res, table){
        this.req = req
        this.res = res
        this.table = table
    }
    async index(){
        const table = await this.table.getList()
        return this.res.render('index', {aside: this.aside(), main: 'partials/home'})
    }
    aside(){
        const lis = [
            { 'title': 'Bảng Điều Khiển', 'link': 'dashboard', 'icon': 'home' },
            { 'title': 'Danh Mục', 'link': 'category', 'icon': 'align-justify' },
            { 'title': 'Bài Viết', 'link': 'post', 'icon': 'box' },
            { 'title': 'Menu', 'link': 'menu', 'icon': 'align-left' },
            { 'title': 'Chia Sẻ Kèo', 'link': 'share', 'icon': 'share-2' },
            { 'title': 'Khóa Học', 'link': 'course', 'icon': 'book' },
            { 'title': 'Cấu Hình Site', 'link': 'site', 'icon': 'settings' },
            { 'title': 'Cài Đặt Mail', 'link': 'mail', 'icon': 'mail' },
            { 'title': 'Mạng Xã Hội', 'link': 'network', 'icon': 'share-2' },
            { 'title': 'Liên Hệ', 'link': 'contact', 'icon': 'phone-call' },
            { 'title': 'Thành Viên', 'link': 'user', 'icon': 'users' }
        ]
        let str='';
        for (let index = 0; index < lis.length; index++) {
            str += Html.li(
                lis[index].title, 
                '/admin/' + lis[index].link + '/index', 
                lis[index].icon
            );
        }
        return Html.ul(str)
    }
}
module.exports = Controllers