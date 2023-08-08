class Html{
    td(value){ return '<td>' + value +'</td>'; }
    th(value){ return '<th>' + value +'</th>'; }
    tr(array=[]){ return '<tr>' + array + '</tr>';}
    thead(trs=[]){ return '<thead>'+this.tr(trs)+'</thead>'; }
    tbody(trs=[]){ return '<tbody>'+this.tr(trs)+'</tbody>'; }
    table(array=[], _class='table table-striped'){
        return '<table class="'+_class+'">'+this.thead(array) + this.tbody(array) +'</table>';
    }

    input(type='text', _class='', id='', value='', placeholder=''){
        return '<input type="'+type+'" class="'+_class+'" id="'+id+'" value="'+value+'" placeholder="'+placeholder+'" />';
    }

    option(value='', name=''){ return '<option value="'+value+'">' + name + '</option>'; }
    select(array=[], _class='', id=''){let str=''
        for (let index = 0; index < array.length; index++) { str+=this.option(array[index]['value'], array[index]['name'])}
        return '<select class="'+_class+'" id="'+id+'">' + str + '</select>';
    }

    textarea(rows=3, value='', _class='', id=''){
        return '<textarea rows="'+rows+'" class="'+_class+'" id="'+id+'">' + value + '</textarea>';
    }

    span(_class='', value=''){ return '<span class="'+_class+'">'+value+'</span>'; }
    icon(_class=''){ return '<i class="feather icon-'+_class+'"></i>'; }
    a(value='', link='', icon='', _class='nav-link'){ return '<a href="'+link+'" class="'+_class+'">' + (icon? (this.span(_class, this.icon(icon)) + value) : value) + '</a>';}

    li(value='', link='', icon='', _class='nav-item'){ return '<li class="'+_class+'">' + (link?this.a(value, link, icon, _class):value) + '</li>'; }
    ul(array=[], _class='nav pcoded-inner-navbar'){ return '<ul class="'+_class+'">' + array + '</ul>'; }

    div(_class='', value=''){ return '<div class="'+_class+'">' +value+ '</div>'; }

    section(_class='', value=''){ return '<section class="'+_class+'">' +value+ '</section>'; }

    breadcrumb(){
        const ul = `<ul class="breadcrumb">
            <li class="breadcrumb-item"><a href="index.html"><i class="feather icon-home"></i></a></li>
            <li class="breadcrumb-item"><a href="#!">Bootstrap Table</a></li>
            <li class="breadcrumb-item"><a href="#!">Basic Tables</a></li>
        </ul>`;
        return this.div('page-header', 
        this.div('page-block', 
            this.div('row align-items-center', 
                this.div('col-md-12', 
                    this.div('page-header-title', '<h5 class="m-b-10">Bootstrap Basic Tables</h5>') + ul
                )
            )
        ))
    }

    h1(value=''){ return '<h1>'+value+'</h1>'; }
    h2(value=''){ return '<h2>'+value+'</h2>'; }
    h3(value=''){ return '<h3>'+value+'</h3>'; }
    h4(value=''){ return '<h4>'+value+'</h4>'; }
    h5(value=''){ return '<h5>'+value+'</h5>'; }

    content(array){
        return this.div('row', 
            this.div('col-xl-12', 
            this.div('card', this.div('card-header', this.h5('User') + this.span('d-block m-t-5', 'Add')) + this.div('card-body table-border-style', 
            this.div('table-responsive', this.table(array))))))
    }

    main(array=[]){
        return this.section('pcoded-main-container', this.div('pcoded-content', this.breadcrumb()+this.content(array)));
    }
}
module.exports = new Html