class Html{
    td(value){ return '<td>' + value +'</td>'; }
    th(value){ return '<th>' + value +'</th>'; }
    tr(array=[]){ return '<tr>' + array + '</tr>';}
    thead(trs=[]){ return '<thead>'+this.tr(trs)+'</thead>'; }
    tbody(trs=[]){ return '<tbody>'+this.tr(trs)+'</tbody>'; }
    table(array=[], _class='table table-striped'){ return '<table class="'+_class+'">'+this.thead(array) + this.tbody(array) +'</table>';}
    form(value='', id='formData'){ return '<form id="'+id+'">'+value+'</form>'; }
    input(type='text', _class='', id='', value='', placeholder=''){ return '<input type="'+type+'" class="form-control '+_class+'" id="'+id+'" name="'+id+'" value="'+value+'" placeholder="'+placeholder+'" />';}
    option(value='', name=''){ return '<option value="'+value+'">' + name + '</option>'; }
    select(array=[], _class='', id=''){let str=''; for (let index = 0; index < array.length; index++) { str+=this.option(array[index]['value'], array[index]['name'])} return '<select class="'+_class+'" id="'+id+'">' + str + '</select>'; }
    textarea(rows=3, value='', _class='', id=''){ return '<textarea rows="'+rows+'" class="'+_class+'" id="'+id+'">' + value + '</textarea>'; }
    span(_class='', value=''){ return '<span class="'+_class+'">'+value+'</span>'; }
    icon(_class=''){ return '<i class="feather icon-'+_class+'"></i>'; }
    a(value='', link='', icon='', _class='nav-link'){ return '<a href="'+link+'" class="'+_class+'">' + (icon? (this.span(_class, this.icon(icon)) + value) : value) + '</a>';}
    li(value='', link='', icon='', _class='nav-item'){ return '<li class="'+_class+'">' + (link?this.a(value, link, icon, _class):value) + '</li>'; }
    ul(array=[], _class='nav pcoded-inner-navbar'){ return '<ul class="'+_class+'">' + array + '</ul>'; }
    div(_class='', value=''){ return '<div class="'+_class+'">' +value+ '</div>'; }
    section(_class='', value=''){ return '<section class="'+_class+'">' +value+ '</section>'; }
    h1(value='', _class=''){ return '<h1 class="'+_class+'">'+value+'</h1>'; }
    h2(value='', _class=''){ return '<h2 class="'+_class+'">'+value+'</h2>'; }
    h3(value='', _class=''){ return '<h3 class="'+_class+'">'+value+'</h3>'; }
    h4(value='', _class=''){ return '<h4 class="'+_class+'">'+value+'</h4>'; }
    h5(value='', _class=''){ return '<h5 class="'+_class+'">'+value+'</h5>'; }
    label(name='', _class=''){ return '<label class="'+_class+'">'+name+'</label>'; }
    submit(_class='btn-primary'){ return '<hr /><button type="submit" class="btn '+_class+'">Lưu</button>'; }
}
module.exports = new Html