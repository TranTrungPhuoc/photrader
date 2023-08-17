class Convert{
    index(key){
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
}
module.exports = new Convert()