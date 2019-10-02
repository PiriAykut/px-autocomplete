
## install
> npm install jquery <br>
> npm install pixi-autocomplete-jquery

## html
> \<div id="objectid"\>\</div\>

<br>

## javascript - jquery
### init
> $("#objectid").pixiautocomplete({ <br>
>           jsondata: [{ val: '1', image: null, text: 'value 1' }, ...],<br>
>            name: "musteri",<br>
>            maxheight: '100',<br>
>            placeholder: '',<br>
>            ajaxpage: 'stok/musteriara',<br>
>            style: "background:#fff; color:#444",<br>
>            focuscallback: function(e){<br>
><br>
>            },<br>
>            callback : function(){<br>
><br>
>            }<br>
>        });<br>
<br>

### set data:
> $("#objectid").pixiautocomplete("set", { val: '16', image: 'http://127.0.0.1:8000/images/logo.png', text: 'Bursa' });
