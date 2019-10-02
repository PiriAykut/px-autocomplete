
## install
> npm i jquery <br>
> npm i px-autocomplete-jquery


## html
> \<div id="objectid"\>\</div\><br>
> or<br>
> \<div id="objectid" data-name="requestname" data-result-max-height="300" data-style="" data-placeholder="" data-new-text="new" data-registered-text="registered" data-alert-text="No record available!"\>\</div\>

#### options attributes
> data-name="requestname" <br>
> data-result-max-height="300"<br>
> data-style=""<br>
> data-placeholder=""<br>
> data-new-text="new"<br>
> data-registered-text="registered" <br>
> data-alert-text="No record available!"<br>

## css
> @import "~px-autocomplete-jquery/px-autocomplete.css";

## javascript - jquery
> require('px-autocomplete-jquery');


### init
> $("#objectid").pxautocomplete({ <br>
>            jsondata: [{ val: '1', image: null, text: 'value 1' }, ...],<br>
>            ajaxpage: 'stok/musteriara',<br>
>            name: "requestname",<br>
>            maxheight: '100',<br>
>            placeholder: '',<br>
>            registered_text: 'registered',<br>
>            new_text: 'new',<br>
>            alert_text: 'No record available!'<br>
>            style: "background:#fff; color:#444",<br>
>            focuscallback: function(e){},<br>
>            callback : function(){}<br>
>        });<br>
<br>

### set data:
> $("#objectid").pxautocomplete("set", { val: '16', image: 'http://127.0.0.1:8000/images/logo.png', text: 'Bursa' });
