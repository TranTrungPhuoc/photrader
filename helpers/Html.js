class Html{
    td(value){ return '<td>' + value +'</td>'; }
    tr(tds=[]){ return '<tr>' + tds + '</tr>'; }
    input(
        type='text',
        _class='',
        id='',
        value='',
        placeholder=''
    ){
        return '<input type="'+type+'" class="'+_class+'" id="'+id+'" value="'+value+'" placeholder="'+placeholder+'" />';
    }
    option(value='', name=''){ return '<option value="'+value+'">' + name + '</option>'; }
    select(
        options=[],
        _class='',
        id=''
    ){
        return '<select class="'+_class+'" id="'+id+'">' + options + '</select>';
    }
    textarea(
        rows=3,
        value='',
        _class='',
        id=''
    ){
        return '<textarea rows="'+rows+'" class="'+_class+'" id="'+id+'">' + value + '</textarea>';
    }
    span(name='', _class='pcoded-micon'){
        return '<span class="'+_class+'">'+this.icon(name)+'</span>';
    }
    icon(name=''){ return '<i class="feather icon-'+name+'"></i>'; }
    a(value='', link='', icon='', _class='nav-link'){
        return '<a href="'+link+'" class="'+_class+'">' + this.span(icon) + value + '</a>';
    }
    li(value='', link='', icon='', _class='nav-item'){
        return '<li class="'+_class+'">' + this.a(value, link, icon) + '</li>';
    }
    ul(lis=[], _class='nav pcoded-inner-navbar'){
        return '<ul class="'+_class+'">' + lis + '</ul>';
    }
}
module.exports = new Html