## description
>Allows to filter selective data and add new data.
>It works like a SELECT object but provides filtering with a JSON data block.
>Allows you to perform live search from database with AJAX url.
>If the written data is not in the data block, it marks it as new, so it provides an opportunity to define it like an INPUT object.

## description TR
>Seçimli verileri süzmeye ve yeni verileri eklemeye olanak tanır. 
>SELECT nesnesi gibi çalışır ancak JSON data bloğu ile filtreleme olanağı sağlar. 
>AJAX url ile veritabanından canlı arama yapmanıza imkan verir. 
>Yazılan veri eğer data bloğunda yoksa yeni olduğunu işaretler bu sayene INPUT nesnesi gibi yani tanımlama imkanı sağlar.


## install
> npm i jquery <br><br>
> npm i px-autocomplete-jquery


## html
> \<div id="objectid"\>\</div\><br>
> or<br>
> \<div id="objectid" data-name="requestname" data-result-max-height="300" data-style="" data-placeholder="" data-new-text="new" data-registered-text="registered" data-alert-text="No record available!"\>\</div\><br>
> or<br>
> \<select id="objectid" name="city"\><br>
>   \<option valeu="01"\>Adana\</option\><br>
>   \<option valeu="06" selected="true"\>Ankara\</option\><br>
>   \<option valeu="16"\>Bursa\</option\><br>
> \</select\>

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
>            jsondata: [{ val: '1', image: null, text: 'data 1' }, ...],<br>
>            ajaxpage: 'api/searchpage',<br>
>            name: "requestname",<br>
>            selected_value: null,<br>
>            selected_text: null,<br>
>            maxheight: '100',<br>
>            placeholder: '',<br>
>            registered_text: 'registered',<br>
>            image_title: 'Show Image',<br>
>            new_text: 'new',<br>
>            alert_text: 'No record available!',<br>
>            style: "background:#fff; color:#444",<br>
>            class: "extraclass default null",
>            focuscallback: function(e){},<br>
>            callback : function(){}<br>
>        });<br>
<br>

### using php with ajax
> **_URL:_** http://localhost/api/searchpage
> <br><br>
> **_PHP CODE EXAMPLE:_** <br><br>
> $text = $_POST["text"]; <br><br>
> ... "your php codes" ...<br><br>
> $resultdata = [['val' => 1, 'text' => 'data 1', 'image' => 'imageurl or null or undefined'], ...];<br><br>
> echo json_encode($resultdata);<br>
<br>


### set data:
> $("#objectid").pxautocomplete("set", { val: '16', image: 'http://127.0.0.1:8000/images/logo.png', text: 'Bursa' });<br>

### set new json data:
> $("#objectid").pxautocomplete("setjsondata", [{ val: '16', image: 'http://127.0.0.1:8000/images/logo.png', text: 'Bursa' }, ... ]);<br>


### view:
#### 1.
![alt text](https://raw.githubusercontent.com/PiriAykut/px-autocomplete/master/screenshots/Screenshot_1.png)

<br>

#### 2.
![alt text](https://raw.githubusercontent.com/PiriAykut/px-autocomplete/master/screenshots/Screenshot_2.png)

<br>

#### 3.
![alt text](https://raw.githubusercontent.com/PiriAykut/px-autocomplete/master/screenshots/Screenshot_3.png)

#### 4.
![alt text](https://raw.githubusercontent.com/PiriAykut/px-autocomplete/master/screenshots/Screenshot_6.png)

#### 5.
![alt text](https://raw.githubusercontent.com/PiriAykut/px-autocomplete/master/screenshots/Screenshot_7.png)

