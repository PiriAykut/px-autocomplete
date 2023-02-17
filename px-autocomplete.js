/*
author      : Piri Aykut
email       : piriaykut@hotmail.com
create date : 04.11.2019
*/

String.prototype.toTrLowerCasePxAuto = function () {
    //     if((typeof this)!=='string')
    //        return this;
    try {
        var str = [];
        for (var i = 0; i < this.length; i++) {
            var ch = this.charCodeAt(i);
            var c = this.charAt(i);

            if (ch === 304) str.push('i');
            else if (ch === 73) str.push('ı');
            else if (ch === 286) str.push('ğ');
            else if (ch === 220) str.push('ü');
            else if (ch === 350) str.push('ş');
            else if (ch === 214) str.push('ö');
            else if (ch === 199) str.push('ç');
            else if (ch === 399) str.push('ə');
            else if (ch >= 65 && ch <= 90)
                str.push(c.toLowerCase());
            else
                str.push(c);
        }
        return str.join('');
    } catch (error) {
        return '';
    }

};

(function ($) {
    $.fn.pxautocomplete = function (options, _data) {
        var mainclass = "px-auto-complete";
        var self = this;
        var search_timeout = null;
        var blur_timeout = null;
        var first_ajax_data = null;

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
            ajax_query_objects: null,
            use_first_data: true,
            not_available_show_result_panel: true,
            maxheight: '300',
            style: null,
            class: null,
            placeholder: null,
            focuscallback: null,
            callback: null,
            image_title: 'Show Image',
            registered_text: 'registered',
            new_text: 'new',
            alert_text: 'No record available!'
        };

        options = $.extend(defaults, options);

        if (self.prop('tagName') === "SELECT") {
            let jdata = [];

            // if ($("option:selected", self).length > 0) {
            //     options.selected_value = $("option:selected", self).attr("value").trim();
            //     options.selected_text = $("option:selected", self).html().trim();
            // }

            $("option", self).each(function () {
                jdata.push({ val: $(this).attr("value").trim(), text: $(this).html().trim() });
            });

            self.removeClass('form-control');
            let id = self.attr("id");
            let obj = '<div id="' + id + '" ' + (self.attr("class") !== undefined ? 'class="' + self.attr("class") + '"' : '') + '></div>';

            self.after(obj);
            self.remove();

            let name = self.attr("name");
            self = $("#" + id);

            options.jsondata = jdata;
            if (name != undefined && name != null) {
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

        if (self.attr("data-value-id") != undefined) {
            options.selected_value = self.attr("data-value-id");
            self.removeAttr("data-value-id");
        }
        if (self.attr("data-value-text") != undefined) {
            options.selected_text = self.attr("data-value-text");
            self.removeAttr("data-value-text");
        }

        if (options.alert_text == null || options.alert_text == "") {
            options.alert_text = "Kayıt mevcut değil!";
        }

        let _id = getMyGUID();

        let def_status_html = '<span class="status"></span>';

        if (options.selected_value != null) {
            def_status_html = '<span class="status saved" data-status="saved">' + options.registered_text + '</span>';
        }

        var noimage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAg0AAAGlCAIAAAD23VLdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUxQTQyRkMyRkNCMjExRTM5NTU4OTZEQkJFNzU1OEY1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUxQTQyRkMzRkNCMjExRTM5NTU4OTZEQkJFNzU1OEY1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTFBNDJGQzBGQ0IyMTFFMzk1NTg5NkRCQkU3NTU4RjUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTFBNDJGQzFGQ0IyMTFFMzk1NTg5NkRCQkU3NTU4RjUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7hkGSKAAAPo0lEQVR42uzd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';
        self.attr("data-id", _id).addClass(mainclass).html(
            def_status_html +
            '<div class="search-container">' +
            '   <a href="" class="aimage" target="_blank" title="' + options.image_title + '"><img src="//:0" onerror="this.src=\'' + noimage + '\';" /><div class="hover-image"><img src="//:0" onerror="this.src=\'' + noimage + '\';" /></div></a>' +
            '   <input type="hidden" name="' + options.name + 'id" value="' + (options.selected_value != null ? options.selected_value : '') + '" />' +
            '   <input type="text" autocomplete="off" name="' + options.name + 'text" value="' + (options.selected_text != null ? options.selected_text : '') + '" ' + (options.placeholder !== null ? 'placeholder="' + options.placeholder + '"' : '') + ' />' +
            '   <i class="fa fa-exclamation-triangle d-none"></i>' +
            '   <i class="fa fa-search"></i>' +
            '   <i class="fa fa-spinner fa-spin d-none"></i>' +
            '   <div class="px-auto-complete-jdata">' + JSON.stringify(options.jsondata) + '</div>' +
            '</div>' +
            '<ul class="result-container" style="max-height:' + options.maxheight + 'px !important"></ul>');

        if (options.style != null) {
            self.attr("style", options.style);
        }

        if (options.class != null) {
            let cls = options.class.split(" ");
            for (let i = 0; i < cls.length; i++) {
                const el = cls[i].trim();

                if (el != "") {
                    self.addClass(el);
                }
            }
        }

        // myExtraMethod("clear");

        $(window).bind('click', function (event) {
            if ($(event.target).hasClass(mainclass) || $(event.target).parents('ul').hasClass('result-container') || $(event.target).parents().hasClass('search-container')) {
                return;
            }
            if ($(".result-container.open").length > 0) {
                $(".result-container.open").removeClass("open")
            }
        });
        $(window).bind('load', function (event) {
            if ($(".result-container.open").length > 0) {
                $(".result-container.open").removeClass("open")
            }
        });

        $("body")
            // .on("click", "[data-id='" + _id + "'] .search-container input[type='text']", function () {
            //     $(this).trigger("focus");
            // })
            .on("focus", "[data-id='" + _id + "'] .search-container input[type='text']", function () {
                $(this).select();

                get_autocomplate_data($(this).val());

                if (options.focuscallback !== undefined && options.focuscallback != null) {
                    if (options.focuscallback.length > 0)
                        options.focuscallback(self);
                    else
                        options.focuscallback();
                }
            })
            .on("blur", "[data-id='" + _id + "'] .search-container input[type='text']", function () {
                return;
                let _val = $("[data-id='" + _id + "'] .search-container input[type='hidden']").val();
                let _text = $(this).val();

                if (_text.trim() != "") {
                    status_clear();

                    if ($("[data-id='" + _id + "'] .result-container li[data-value]").length == 1 && _text.toTrLowerCasePxAuto() == $("[data-id='" + _id + "'] .result-container li[data-value]").html().toTrLowerCasePxAuto()) {
                        $("[data-id='" + _id + "'] .search-container input[type='hidden']").val($("[data-id='" + _id + "'] .result-container li[data-value]").attr("data-value"));
                    }

                    let _modname = (_val == "0" ? "new" : "saved");
                    let _othermodname = (_val == "0" ? "saved" : "new");

                    $("[data-id='" + _id + "'] .status").removeClass(_othermodname).addClass(_modname).attr("data-status", _modname).html((_modname == 'new' ? options.new_text : options.registered_text))

                    if (options.callback !== undefined && options.callback != null) {
                        blur_timeout = setTimeout(function () {
                            _val = $("[data-id='" + _id + "'] .search-container input[type='hidden']").val();
                            _text = $("[data-id='" + _id + "'] .search-container input[type='text']").val();

                            options.callback({ object: self, val: (_val == "0" ? null : _val), text: _text.trim() });
                        }, 1200);
                    }
                } else {
                    if (options.callback !== undefined && options.callback != null) {
                        blur_timeout = setTimeout(function () {
                            _val = $("[data-id='" + _id + "'] .search-container input[type='hidden']").val();
                            _text = $("[data-id='" + _id + "'] .search-container input[type='text']").val();

                            options.callback({ object: self, val: (_val == "0" ? null : _val), text: _text.trim() });
                        }, 1200);
                    }
                }
            })
            .on("mouseleave", "[data-id='" + _id + "']", function () {
                $("[data-id='" + _id + "'] .result-container").removeClass("open");
            })
            .on("input", "[data-id='" + _id + "'] .search-container input[type='text']", function () {
                $("[data-id='" + _id + "'] .search-container input[type='hidden']").val("0");

                if ($("[data-id='" + _id + "'] .search-container").hasClass('show-image'))
                    $("[data-id='" + _id + "'] .search-container").removeClass('show-image');

                let _text = $(this).val();

                if (options.ajaxpage == null) {
                    get_autocomplate_data(_text);
                } else {
                    if (search_timeout != null) {
                        clearTimeout(search_timeout);
                        search_timeout = null;
                    }

                    search_timeout = setTimeout(function () {
                        get_autocomplate_data(_text);
                    }, 1500);
                }
            })
            .on("keydown", "[data-id='" + _id + "'] .search-container input[type='text']", function (e) {
                switch (e.key) {
                    case "Tab":
                        if ($("[data-id='" + _id + "'] .result-container li:not(.nodata)").length > 0) {
                            $("[data-id='" + _id + "'] .result-container li:eq(0)").focus();

                        } else {
                            $("[data-id='" + _id + "'] .result-container").removeClass("open");
                        }
                        return true;
                    case "ArrowDown":
                        $("[data-id='" + _id + "'] .result-container li:eq(0)").focus();
                        return false;
                }
            })
            .on("keydown", "[data-id='" + _id + "'] .result-container li", function (e) {
                switch (e.keyCode) {
                    case 38:
                        $(this).prev().focus();
                        break;
                    case 40:
                        $(this).next().focus();
                        break;
                    case 13:
                        $("a", $(this)).trigger("click");
                        break;
                }
                return false;
            })
            .on("click", "[data-id='" + _id + "'] .result-container li a", function () {
                if ($(this).hasClass("nodata")) return;

                if (blur_timeout != null) {
                    clearTimeout(blur_timeout);
                    blur_timeout = null;
                }

                let _val = $(this).parents("li").attr("data-value");

                if (_val == undefined) {
                    _val = $("[data-id='" + _id + "'] .result-container").index($(this).parents("li"));
                }

                let _text = $(this).html();
                if ($(this).parents("li").attr("data-image") !== undefined) {
                    if (_text.indexOf('<img') > -1) {
                        let p = _text.indexOf(">", 3);
                        if (p > -1) {
                            _text = _text.substr(p + 1, _text.length - p).trim();
                        }
                    }

                    if (!$("[data-id='" + _id + "'] .search-container").hasClass('show-image'))
                        $("[data-id='" + _id + "'] .search-container").addClass('show-image');

                    $("[data-id='" + _id + "'] .search-container img").attr("src", $(this).parents("li").attr("data-image"));
                    $("[data-id='" + _id + "'] .search-container img").parent().attr("href", $(this).parents("li").attr("data-image"));
                }

                $("[data-id='" + _id + "'] .search-container input[type='text']").val(_text);
                $("[data-id='" + _id + "'] .search-container input[type='hidden']").val(_val);

                show_icon('status-save');

                $("[data-id='" + _id + "'] .result-container").removeClass("open");

                if (options.callback !== undefined && options.callback != null) {
                    options.callback({ object: self, val: _val, text: $(this).html() });
                }
            });



        function get_autocomplate_data(_text) {
            show_icon('spin');

            let jsondata = JSON.parse($(".px-auto-complete-jdata", self).html());
            if (jsondata != null) {
                let sonuc = null;
                if (_text.trim() != "") {
                    sonuc = jsonfilter(jsondata, "text", _text);
                } else {
                    sonuc = jsondata;
                }

                create_result_items(_text, sonuc);

            } else if (options.ajaxpage != null) {
                let isrunajax = (_text.trim() != "" || (_text.trim() == "" && (options.use_first_data && first_ajax_data == null || !options.use_first_data)));

                if (isrunajax) {
                    let _extra = "";
                    if (options.ajax_query_objects != null && Array.isArray(options.ajax_query_objects) && options.ajax_query_objects.length > 0) {
                        for (let i = 0; i < options.ajax_query_objects.length; i++) {
                            const el = options.ajax_query_objects[i];
                            if ($(el).attr("name") != undefined) {
                                _extra += (_extra != "" ? "&" : "") + $(el).attr("name") + "=" + encodeURIComponent($(el).val());
                            }
                        }
                    }

                    $.ajax({
                        headers: {
                            'X-CSRF-TOKEN': ($('meta[name="csrf-token"]').length > 0 ? $('meta[name="csrf-token"]').attr('content') : '')
                        },
                        type: "POST",
                        url: window.location.origin + "/" + options.ajaxpage,
                        data: "text=" + encodeURIComponent(_text) + (_extra != "" ? "&" + _extra : ""),
                        timeout: 15000,
                        success: function (e) {
                            if (e === null) {
                                return;
                            }
                            try {
                                let _vl = $("[data-id='" + _id + "'] .search-container input[type='text']").val().trim();

                                if (_vl !== _text) {
                                    if (_vl == "") {
                                        show_icon("default");
                                    } else {
                                        show_icon("new");
                                    }
                                    return;
                                }

                                e = JSON.parse(e);

                                if (e.length > 0) {
                                    if (first_ajax_data == null) {
                                        first_ajax_data = e;
                                    }
                                    create_result_items(_text, e);
                                } else {
                                    show_icon('default');

                                    if (options.not_available_show_result_panel) {
                                        if (!$("[data-id='" + _id + "'] .result-container").hasClass("open")) {
                                            $("[data-id='" + _id + "'] .result-container").addClass("open");
                                        }

                                        $("[data-id='" + _id + "'] .result-container").html('<li class="nodata"><span class="alert">' + options.alert_text + '</span></li>');
                                    } else {
                                        if ($("[data-id='" + _id + "'] .result-container").hasClass("open")) {
                                            $("[data-id='" + _id + "'] .result-container").removeClass("open");
                                        }
                                    }
                                }
                            } catch (e) { }
                        },
                        error: function (err) {
                            let _msj = "Error px-autocomplete ajax : " + err.status + "\n" + err.statusText;
                            console.log(_msj);
                            console.log(err);

                            show_icon('error', _msj)
                        }
                    });
                } else if (_text.trim() == "" && first_ajax_data != null) {
                    create_result_items('', first_ajax_data);
                }
            }
        }

        function show_icon(_vl, _title) {
            //let cont = "[data-id='" + _id + "'] ";
            $(".status", self).addClass('d-none').removeClass("new").removeClass("saved").attr("data-status", "").html("");
            $(".search-container .fa:not(.d-none)", self).addClass('d-none');

            switch (_vl) {
                case 'spin':
                    $(".search-container .fa.fa-spinner", self).removeClass('d-none');
                    break;
                case 'default':
                case 'search':
                    $(".search-container .fa.fa-search", self).removeClass('d-none');
                    break;
                case 'error':
                    create_result_items('', 'error');
                    $(".search-container .fa.fa-exclamation-triangle", self).removeClass('d-none').attr("title", _title);
                    break;
                case 'status-new':
                    $(".status", self).addClass("new").attr("data-status", "new").html(options.new_text)
                    break;
                case 'status-save':
                    $(".status", self).addClass("saved").attr("data-status", "saved").html(options.registered_text)
                    break;
            }
        }

        function create_result_items(_text, _jsondata) {
            if (_jsondata == "error") {
                $("[data-id='" + _id + "'] .result-container").removeClass("open").html("");
                return;
            }

            let value_items = '';
            let isalert = false;

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
                        value_items += '<li tabindex="-1" data-value="' + el.val + '" ' + (el.image !== undefined && el.image != null ? 'data-image="' + el.image + '"' : '') + '><a href="javascript:void(0);">' + (el.image !== undefined && el.image != null ? '<img src="' + el.image + '" onerror="this.src=\'' + noimage + '\';" />' : '') + el.text + '</a></li>';
                    }
                } else {
                    isalert = true;
                    value_items = '<li class="nodata"><span class="alert">' + options.alert_text + '</span></li>';
                }
            } else {
                isalert = true;
                value_items = '<li class="nodata"><span class="alert">' + options.alert_text + '</span></li>';
            }

            $("[data-id='" + _id + "'] .result-container").html(value_items);

            if (isalert) {
                if (options.not_available_show_result_panel) {
                    if (!$("[data-id='" + _id + "'] .result-container").hasClass("open")) {
                        $("[data-id='" + _id + "'] .result-container").addClass("open").scrollTop(0);
                    }
                } else {
                    if ($("[data-id='" + _id + "'] .result-container").hasClass("open")) {
                        $("[data-id='" + _id + "'] .result-container").removeClass("open");
                    }
                }
            } else {
                if (!$("[data-id='" + _id + "'] .result-container").hasClass("open")) {
                    $("[data-id='" + _id + "'] .result-container").addClass("open").scrollTop(0);
                }
            }

            if (_text != '') {
                let _selval = '0';
                let _seltext = '';

                if (_jsondata != null) {
                    if (_jsondata.length > 0) {
                        for (let i = 0; i < _jsondata.length; i++) {
                            const el = _jsondata[i];
                            if (getMyslugify(el.text) == getMyslugify(_text)) {
                                _selval = el.val;
                                _seltext = el.text;
                                break;
                            }
                        }
                    }
                }

                if (_selval != '0') {
                    show_icon('status-save');
                } else {
                    if (_text.trim() != "") {
                        show_icon('status-new');
                    } else {
                        show_icon('default');
                    }
                }

                $("[data-id='" + _id + "'] .search-container input[type='hidden']").val(_selval);

                if (options.callback !== undefined && options.callback != null) {
                    options.callback({ object: self, val: (_selval == "0" ? null : _selval), text: _seltext.trim() });
                }
            } else {
                show_icon('default');
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
                .toTrLowerCasePxAuto();

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
                    arrCriteria.push([field, value.toTrLowerCasePxAuto()]);
                }
            } else {
                for (var i = 0; i < field.length; i++) {
                    arrCriteria.push([field[i], value[i].toTrLowerCasePxAuto()]);
                }
            }

            if (arrCriteria.length > 0 && arr !== undefined && arr !== null && arr.length > 0) {
                rv = arr.filter(function (e) {
                    let status = false;
                    for (let i = 0; i < arrCriteria.length; i++) {
                        const el = arrCriteria[i];

                        if (e.text.toTrLowerCasePxAuto().indexOf(el[1]) !== -1) {
                            status = true;
                            break;
                        }
                    }
                    return status;
                });
            }

            // if (arrCriteria.length > 0 && arr !== undefined && arr !== null && arr.length > 0) {
            //     var kriter = "";
            //     var status = true;
            //     for (var i = 0; i < arrCriteria.length; i++) {
            //         eval('status = arr[0].' + arrCriteria[i][0] + '!==undefined');
            //         if (!status) {
            //             return null;
            //         }

            //         kriter += (kriter !== "" ? " && " : "") +
            //             '(' +
            //             '   ($.type(i).toString() == "object" && ' + (arrCriteria[i][1] == null ? 'i.' + arrCriteria[i][0] + operator + 'null' : 'i.' + arrCriteria[i][0] + '!==null && i.' + arrCriteria[i][0] + '.toString().toTrLowerCasePxAuto() ' + operator + ' "' + arrCriteria[i][1] + '"') + ') || ' +
            //             '   ($.type(i).toString() == "object" && ' + (arrCriteria[i][1] == null ? '0=0' : 'i.' + arrCriteria[i][0] + '!==null && i.' + arrCriteria[i][0] + '.toString().toTrLowerCasePxAuto().indexOf("' + arrCriteria[i][1] + '") > -1') + ') || ' +
            //             '   ($.type(n).toString() == "object" && ' + (arrCriteria[i][1] == null ? 'n.' + arrCriteria[i][0] + operator + 'null' : 'n.' + arrCriteria[i][0] + '!==null && n.' + arrCriteria[i][0] + '.toString().toTrLowerCasePxAuto() ' + operator + '"' + arrCriteria[i][1] + '"') + ') || ' +
            //             '   ($.type(n).toString() == "object" && ' + (arrCriteria[i][1] == null ? '0=0' : 'n.' + arrCriteria[i][0] + '!==null && n.' + arrCriteria[i][0] + '.toString().toTrLowerCasePxAuto().indexOf("' + arrCriteria[i][1] + '") > -1') + ') ' +
            //             ')';
            //     }
            //     debugger
            //     eval('rv = arr.filter(function (i, n) { return (' + kriter + ')});');
            // }
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
                        $(".search-container img", self).parent().attr("href", _data.image);
                    }

                    $(".search-container input[type='text']", self).val(_data.text);
                    $(".search-container input[type='hidden']", self).val(_data.val);
                    $(".status", self).addClass("saved").attr("data-status", "saved").html(self.attr("data-registered-text"));

                    break;
                case 'clear':
                    show_icon('default');
                    $(".search-container input[type='text']", self).val("");
                    $(".search-container input[type='hidden']", self).val("");
                    break;
                case "setjsondata":
                    $(".px-auto-complete-jdata", self).html(JSON.stringify(_data));

                    myExtraMethod("clear");
                    break;
            }
        };
    }
})(jQuery);