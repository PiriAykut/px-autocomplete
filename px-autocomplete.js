/*
author  : Piri Aykut
email   : piriaykut@hotmail.com
*/

(function($) {
    $.fn.pxautocomplete = function(options, _data) {
        var mainclass = "px-auto-complete";
        var self = this;
        var search_timeout = null;
        var blur_timeout = null;

        if ((typeof options) === "string") {
            myExtraMethod(options, _data);
            return;
        }

        if (self.hasClass(mainclass))
            return;

        var defaults = {
            name: '',
            selected_value: null,
            selected_text: null,
            jsondata: null,
            ajaxpage: null,
            maxheight: '300',
            style: null,
            placeholder: null,
            focuscallback: null,
            callback: null,
            registered_text: 'registered',
            new_text: 'new',
            alert_text: 'No record available!'
        };

        options = $.extend(defaults, options);

        if (self.prop('tagName') === "SELECT"){
            let jdata = [];

            if ($("option:selected", self).length > 0){
                options.selected_value = $("option:selected", self).attr("value").trim();
                options.selected_text = $("option:selected", self).html().trim();
            }

            $("option", self).each(function(){
                jdata.push({val: $(this).attr("value").trim(), text: $(this).html().trim() });
            });

            self.removeClass('form-control');
            let id = self.attr("id");
            let obj = '<div id="' + id + '" ' + (self.attr("class") !== undefined ? 'class="' + self.attr("class") + '"' : '') + '></div>';

            self.after(obj);
            self.remove();
            let name = self.attr("name");
            self = $("#" + id);

            options.jsondata = jdata;
            if (name != undefined && name != null){
                options.name = name;
            }
        }

        if (self.attr("data-name") != undefined) {
            options.name = self.attr("data-name");
        } else {
            self.attr("data-name", options.name);
        }

        if (self.attr("data-placeholder") != undefined) {
            options.placeholder = self.attr("data-placeholder");
        } else {
            self.attr("data-placeholder", options.placeholder);
        }

        if (self.attr("data-style") != undefined) {
            options.style = self.attr("data-style");
        } else {
            self.attr("data-style", options.style);
        }

        if (self.attr("data-result-max-height") != undefined) {
            options.maxheight = self.attr("data-result-max-height");
        } else {
            self.attr("data-result-max-height", options.maxheight);
        }

        if (self.attr("data-registered-text") != undefined) {
            options.registered_text = self.attr("data-registered-text");
        } else {
            self.attr("data-registered-text", options.registered_text);
        }

        if (self.attr("data-new-text") != undefined) {
            options.new_text = self.attr("data-new-text");
        } else {
            self.attr("data-new-text", options.new_text);
        }

        if (self.attr("data-alert-text") != undefined) {
            options.alert_text = self.attr("data-alert-text");
        } else {
            self.attr("data-alert-text", options.alert_text);
        }

        if (self.attr("name") != undefined) {
            options.name = self.attr("name");
            self.removeAttr("name");
        }

        if (options.alert_text == null || options.alert_text == "") {
            options.alert_text = "Kayıt mevcut değil!";
        }

        let _id = getMyGUID();
        
        let def_status_html = '<span class="status"></span>';

        if(options.selected_value != null){
            def_status_html = '<span class="status saved" data-status="saved">' + options.registered_text + '</span>';
        }

        self.attr("data-id", _id).addClass(mainclass).html(
            def_status_html +
            '<div class="search-container">' +
            '   <img src="//:0" />' +
            '   <input type="hidden" name="' + options.name + 'id" value="' + (options.selected_value != null ? options.selected_value : '') + '" />' +
            '   <input type="text" name="' + options.name + 'text" value="' + (options.selected_text != null ? options.selected_text : '') + '" ' + (options.placeholder !== null ? 'placeholder="' + options.placeholder + '"' : '') + ' />' +
            '   <i class="fa fa-exclamation-triangle d-none"></i>' +
            '   <i class="fa fa-search"></i>' +
            '   <i class="fa fa-spinner fa-spin d-none"></i>' +
            '</div>' +
            '<ul class="result-container" style="max-height:' + options.maxheight + 'px !important"></ul>');

        if (options.style != null) {
            self.attr("style", options.style);
        }

        create_result_items("", options.jsondata);

        $(window).bind('click', function(event) {
            if ($(event.target).hasClass(mainclass) || $(event.target).parents('ul').hasClass('result-container')|| $(event.target).parents().hasClass('search-container')) {
                return;
            }
            if ($(".result-container.open").length > 0) {
                $(".result-container.open").removeClass("open")
            }
        });

        $("body")
            .on("click", "[data-id='" + _id + "'] .search-container input[type='text']", function() {
                $(this).trigger("focus");
            })
            .on("focus", "[data-id='" + _id + "'] .search-container input[type='text']", function() {
                $(this).select();

                //if (options.ajaxpage != null) {
                    getMyFilter($(this).val());
                //}

                if (options.focuscallback !== undefined && options.focuscallback != null) {
                    if (options.focuscallback.length > 0)
                        options.focuscallback(self);
                    else
                        options.focuscallback();
                }
            })
            .on("blur", "[data-id='" + _id + "'] .search-container input[type='text']", function() {
                return;
                let _val = $("[data-id='" + _id + "'] .search-container input[type='hidden']").val();
                let _text = $(this).val();

                if (_text.trim() != "") {
                    status_clear();

                    if ($("[data-id='" + _id + "'] .result-container li[data-value]").length == 1 && _text.toLowerCase() == $("[data-id='" + _id + "'] .result-container li[data-value]").html().toLowerCase()) {
                        $("[data-id='" + _id + "'] .search-container input[type='hidden']").val($("[data-id='" + _id + "'] .result-container li[data-value]").attr("data-value"));
                    }

                    let _modname = (_val == "0" ? "new" : "saved");
                    let _othermodname = (_val == "0" ? "saved" : "new");

                    $("[data-id='" + _id + "'] .status").removeClass(_othermodname).addClass(_modname).attr("data-status", _modname).html((_modname == 'new' ? options.new_text : options.registered_text))

                    if (options.callback !== undefined && options.callback != null) {
                        blur_timeout = setTimeout(function() {
                            _val = $("[data-id='" + _id + "'] .search-container input[type='hidden']").val();
                            _text = $("[data-id='" + _id + "'] .search-container input[type='text']").val();

                            options.callback({ object: self, val: (_val == "0" ? null : _val), text: _text.trim() });
                        }, 1200);
                    }
                } else {
                    if (options.callback !== undefined && options.callback != null) {
                        blur_timeout = setTimeout(function() {
                            _val = $("[data-id='" + _id + "'] .search-container input[type='hidden']").val();
                            _text = $("[data-id='" + _id + "'] .search-container input[type='text']").val();

                            options.callback({ object: self, val: (_val == "0" ? null : _val), text: _text.trim() });
                        }, 1200);
                    }
                }
            })
            .on("mouseleave", "[data-id='" + _id + "']", function() {
                $("[data-id='" + _id + "'] .result-container").removeClass("open");
            })
            .on("input", "[data-id='" + _id + "'] .search-container input[type='text']", function() {
                $("[data-id='" + _id + "'] .search-container input[type='hidden']").val("0");

                status_clear();

                if ($("[data-id='" + _id + "'] .search-container").hasClass('show-image'))
                    $("[data-id='" + _id + "'] .search-container").removeClass('show-image');

                if (options.ajaxpage == null) {
                    getMyFilter($(this).val());
                } else {
                    let _text = $(this).val();

                    if (search_timeout != null) {
                        clearTimeout(search_timeout);
                        search_timeout = null;
                    }

                    search_timeout = setTimeout(function() {
                        getMyFilter(_text);
                    }, 500);
                }
            })
            .on("click", "[data-id='" + _id + "'] .result-container li", function() {
                if ($(this).hasClass("nodata")) return;

                if (blur_timeout != null) {
                    clearTimeout(blur_timeout);
                    blur_timeout = null;
                }

                let _val = $(this).attr("data-value");

                if (_val == undefined) {
                    _val = $("[data-id='" + _id + "'] .result-container").index($(this));
                }

                let _text = $(this).html();
                if ($(this).attr("data-image") !== undefined) {
                    if (_text.indexOf('<img') > -1) {
                        let p = _text.indexOf(">", 3);
                        if (p > -1) {
                            _text = _text.substr(p + 1, _text.length - p).trim();
                        }
                    }

                    if (!$("[data-id='" + _id + "'] .search-container").hasClass('show-image'))
                        $("[data-id='" + _id + "'] .search-container").addClass('show-image');

                    $("[data-id='" + _id + "'] .search-container img").attr("src", $(this).attr("data-image"));
                }

                $("[data-id='" + _id + "'] .search-container input[type='text']").val(_text);
                $("[data-id='" + _id + "'] .search-container input[type='hidden']").val(_val);

                status_clear();

                $("[data-id='" + _id + "'] .status").removeClass("new").addClass("saved").attr("data-status", "saved").html(options.registered_text)
                $("[data-id='" + _id + "'] .result-container").removeClass("open");

                if (options.callback !== undefined && options.callback != null) {
                    options.callback({ object: self, val: _val, text: $(this).html() });
                }
            });

        function show_spin() {

            $("[data-id='" + _id + "'] .search-container .status").addClass('d-none');
            $("[data-id='" + _id + "'] .search-container .fa.fa-search").addClass('d-none');
            $("[data-id='" + _id + "'] .search-container .fa.fa-spinner").removeClass('d-none');

            if (!$("[data-id='" + _id + "'] .search-container .fa.fa-exclamation-triangle").hasClass('d-none')) {
                $("[data-id='" + _id + "'] .search-container .fa.fa-exclamation-triangle").hasClass('d-none');
            }
            if ($("[data-id='" + _id + "'] .search-container .fa.fa-exclamation-triangle").attr("title") != undefined) {
                $("[data-id='" + _id + "'] .search-container .fa.fa-exclamation-triangle").removeAttr("title");
            }
        }

        function hide_spin(_iserror = false) {
            if ($("[data-id='" + _id + "'] .search-container .status").hasClass('d-none')) {
                $("[data-id='" + _id + "'] .search-container .status").removeClass('d-none');
            }
            $("[data-id='" + _id + "'] .search-container .fa.fa-search").removeClass('d-none');
            $("[data-id='" + _id + "'] .search-container .fa.fa-spinner").addClass('d-none');

            if (_iserror) {
                $("[data-id='" + _id + "'] .search-container .fa.fa-exclamation-triangle").removeClass('d-none');
            }
        }

        function status_clear() {
            let statusObj = "[data-id='" + _id + "'] .status";
            if ($(statusObj).attr("data-status") !== undefined) {
                $(statusObj).removeClass($(statusObj).attr("data-status")).removeAttr("data-status");
            }
            $(statusObj).html('').removeClass('new').removeClass('saved');

        }

        function getMyFilter(_text) {
            show_spin();

            if ($("[data-id='" + _id + "'] .result-container").attr("data-container") != undefined) {
                $("[data-id='" + _id + "'] .result-container").removeAttr("data-container");
            }

            if (options.jsondata != null) {
                let sonuc = null;
                if (_text.trim() != "") {
                    sonuc = jsonfilter(options.jsondata, "text", _text);
                } else {
                    sonuc = options.jsondata;
                }

                if (!$("[data-id='" + _id + "'] .result-container").hasClass("open"))
                    $("[data-id='" + _id + "'] .result-container").addClass("open");

                create_result_items(_text, sonuc);

            } else if (options.ajaxpage != null) {

                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': ($('meta[name="csrf-token"]').length > 0 ? $('meta[name="csrf-token"]').attr('content') : '')
                    },
                    type: "POST",
                    url: window.location.origin + "/" + options.ajaxpage,
                    data: "text=" + encodeURIComponent(_text),
                    timeout: 30000,
                    success: function(e) {
                        
                        if (e === null) {
                            return;
                        }
                        try {
                            e = JSON.parse(e);

                            if (!$("[data-id='" + _id + "'] .result-container").hasClass("open"))
                                $("[data-id='" + _id + "'] .result-container").addClass("open");

                            if (e.durum) {
                                create_result_items(_text, e.data);
                            } else {
                                $("[data-id='" + _id + "'] .result-container").html('<li class="nodata"><span class="alert">' + e.mesaj + '</span></li>');
                            }

                        } catch (e) {}
                    },
                    error: function(err) {
                        hide_spin(true);
                        create_result_items(_text, null);
                        console.log("Error px-autocomplete ajax : " + err.status + "\n" + err.statusText); // + "\n\n" + err.responseText);
                        console.log(err);
                        $("[data-id='" + _id + "'] .search-container .fa.fa-exclamation-triangle").attr("title", "Error px-autocomplete ajax : " + err.status + "\n" + err.statusText);
                    }
                });
            }
        }

        var timeout_spin = null;
        function create_result_items(_text, _jsondata) {
            let value_items = '';
            if (_jsondata != null) {
                if (!$.isArray(_jsondata)) {
                    alert("jsondata error : array and [{ val: 0, text : ''}, ...]");
                    return;
                }
                if (_jsondata.length > 0) {
                    if (_jsondata[0].val === undefined || _jsondata[0].text === undefined) {
                        alert("jsondata error : [{ val: 0, text : ''}, ...] ");
                        return;
                    }
                }
                if (_jsondata.length > 0) {
                    for (let i = 0; i < _jsondata.length; i++) {
                        const el = _jsondata[i];
                        value_items += '<li data-value="' + el.val + '" ' + (el.image !== undefined && el.image != null ? 'data-image="' + el.image + '"' : '') + '>' + (el.image !== undefined && el.image != null ? '<img src="' + el.image + '" />' : '') + el.text + '</li>';
                    }
                } else {
                    value_items = '<li class="nodata"><span class="alert">' + options.alert_text + '</span></li>';
                }
            } else {
                value_items = '<li class="nodata"><span class="alert">' + options.alert_text + '</span></li>';
            }

            $("[data-id='" + _id + "'] .result-container").attr("data-container", btoa(unescape(encodeURIComponent(JSON.stringify(_jsondata))))).html(value_items);

            if (_text != '') {
                let _selval = '0';
                let _seltext = '';

                if (_jsondata != null && _jsondata.length > 0) {
                    for (let i = 0; i < _jsondata.length; i++) {
                        const el = _jsondata[i];
                        if (getMyslugify(el.text) == getMyslugify(_text)) {
                            _selval = el.val;
                            _seltext = el.text;

                            $("[data-id='" + _id + "'] .search-container input[type='hidden']").val(el.val);
                            break;
                        }
                    }
                }

                let _modname = (_selval == "0" ? "new" : "saved");
                let _othermodname = (_selval == "0" ? "saved" : "new");

                if (timeout_spin != null){
                    clearTimeout(timeout_spin);
                }

                timeout_spin = setTimeout(function() {
                    $("[data-id='" + _id + "'] .status").removeClass(_othermodname).addClass(_modname).attr("data-status", _modname).html((_modname == 'new' ? options.new_text : options.registered_text));
                    hide_spin();
                }, 500);

                if (options.callback !== undefined && options.callback != null) {
                    options.callback({ object: self, val: (_selval == "0" ? null : _selval), text: _seltext.trim() });
                }
            }else{
                hide_spin();
            }
            
        }

        function getMyslugify(text) {
            var trMap = {
                'çÇ': 'c',
                'ğĞ': 'g',
                'şŞ': 's',
                'üÜ': 'u',
                'ıİ': 'i',
                'öÖ': 'o'
            };
            for (var key in trMap) {
                text = text.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
            }
            return text.replace(/[^-a-zA-Z0-9\s]+/ig, '') // remove non-alphanumeric chars
                .replace(/\s/gi, "-") // convert spaces to dashes
                .replace(/[-]+/gi, "-") // trim repeated dashes
                .toLowerCase();

        }

        function getMyGUID() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        function jsonfilter(arr, field, value, operator) {
            var rv = null;
            var arrCriteria = [];

            if (operator === undefined || operator == null) {
                operator = '==';
            }

            if (Array.isArray(field) === false) {
                if (field !== "") {
                    arrCriteria.push([field, value.toLowerCase()]);
                }
            } else {
                for (var i = 0; i < field.length; i++) {
                    arrCriteria.push([field[i], value[i].toLowerCase()]);
                }
            }
            if (arrCriteria.length > 0 && arr !== undefined && arr !== null && arr.length > 0) {
                var kriter = "";
                var status = true;
                for (var i = 0; i < arrCriteria.length; i++) {
                    eval('status = arr[0].' + arrCriteria[i][0] + '!==undefined');
                    if (!status) {
                        return null;
                    }

                    kriter += (kriter !== "" ? " && " : "") +
                        '(' +
                        '   ($.type(i).toString() == "object" && ' + (arrCriteria[i][1] == null ? 'i.' + arrCriteria[i][0] + operator + 'null' : 'i.' + arrCriteria[i][0] + '!==null && i.' + arrCriteria[i][0] + '.toString().toLowerCase() ' + operator + ' "' + arrCriteria[i][1] + '"') + ') || ' +
                        '   ($.type(i).toString() == "object" && ' + (arrCriteria[i][1] == null ? '0=0' : 'i.' + arrCriteria[i][0] + '!==null && i.' + arrCriteria[i][0] + '.toString().toLowerCase().indexOf("' + arrCriteria[i][1] + '") > -1') + ') || ' +
                        '   ($.type(n).toString() == "object" && ' + (arrCriteria[i][1] == null ? 'n.' + arrCriteria[i][0] + operator + 'null' : 'n.' + arrCriteria[i][0] + '!==null && n.' + arrCriteria[i][0] + '.toString().toLowerCase() ' + operator + '"' + arrCriteria[i][1] + '"') + ') || ' +
                        '   ($.type(n).toString() == "object" && ' + (arrCriteria[i][1] == null ? '0=0' : 'n.' + arrCriteria[i][0] + '!==null && n.' + arrCriteria[i][0] + '.toString().toLowerCase().indexOf("' + arrCriteria[i][1] + '") > -1') + ') ' +
                        ')';
                }
                eval('rv = arr.filter(function (i, n) { return (' + kriter + ')});');
            }
            return rv;
        };

        function myExtraMethod(_type, _data) {
            switch (_type) {
                case 'set':
                case 'val':
                case 'setval':
                    if (_data.val === undefined || _data.text === undefined) {
                        alert("jsondata error : { val: 0, text : ''} ");
                        return;
                    }

                    if (_data.image !== undefined) {
                        if (!$(".search-container", self).hasClass("show-image")) {
                            $(".search-container", self).addClass("show-image");
                        }

                        $(".search-container img", self).attr("src", _data.image);
                    }
                    $(".search-container input[type='text']", self).val(_data.text);
                    $(".search-container input[type='hidden']", self).val(_data.val);
                    $(".status", self).addClass("saved").attr("data-status", "saved").html(self.attr("data-registered-text"));

                    break;
            }
        };

    }
})(jQuery);