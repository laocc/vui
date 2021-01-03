!(function (win, doc, $self, $parent, $top, $fun) {
    "use strict";
    win.espWx = {
        auth: function (opt) {
            /**
             * 改编自：http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js
             */
            let params = {};
            params.appid = opt.appid;
            params.scope = 'snsapi_login';
            params.redirect_uri = (opt.uri);
            params.state = opt.state;
            params.login_type = 'jssdk';
            params.self_redirect = (opt.self ? 'true' : 'false');
            params.styletype = (opt.styletype || '');
            params.sizetype = (opt.sizetype || '');
            params.bgcolor = (opt.bgcolor || '');
            params.rst = (opt.rst || '');
            params.style = (opt.style || '');
            params.href = (opt.href || '');

            let fm = doc.createElement("iframe");
            fm.src = "https://open.weixin.qq.com/connect/qrconnect?" + $.param(params);
            fm.frameBorder = "0";
            fm.allowTransparency = "true";
            fm.scrolling = "no";
            fm.width = (opt.width || "300px");
            fm.height = (opt.height || "400px");
            fm.style = "display:block;margin:0 auto;";
            fm.sandbox = "allow-scripts allow-top-navigation allow-same-origin";

            let obj = doc.getElementById(opt.id);
            obj.innerHTML = "";
            obj.appendChild(fm)
        }
    };
    win.$ = layui.$;

    const getMsgOption = function ($data, $button, $form) {
        let option = {}, temp = {};
        if (!$button) $button = $('v');
        if (!$form) $form = $('v');

        option.color = $data.color || $button.data('color') || $form.data('color');
        option.time = $data.time || $button.data('time') || $form.data('time') || 0;
        option.title = $data.title || $button.data('title') || $form.data('title') || false;
        option.anim = $data.anim || $button.data('anim') || $form.data('anim') || 0;
        temp.width = $data.width || $button.data('width') || $form.data('width') || 420;
        temp.height = $data.height || $button.data('height') || $form.data('height') || null;
        temp.button = $data.button || $button.data('button') || $form.data('button') || '确定';
        option.btn = [temp.button];
        if (temp.height) {
            option.area = [temp.width, temp.height];
        } else {
            option.area = temp.width;
        }
        option.type = 0;
        option.shade = 0.1;
        option.closeBtn = 0;

        if ($data.content) {
            option.content = $data.content;
            option.type = 1;//页面层
        } else if ($data.message) {
            option.content = $data.message;
            // $button.text($data.message);
        } else if ($data.iframe) {
            option.content = $data.iframe;
            option.type = 2;//iframe层
        }
        option.success = function (layerOBJ, index) {
            $('table,form').addClass('blur1');
            $button.removeAttr('disabled').removeClass('layui-btn-disabled');
        };
        option.end = function (layerOBJ, index) {
            if ($data.endrun) eval($data.endrun);
            $('table,form').removeClass('blur1');
        };
        return option;
    };
    const setRedirect = function ($data) {
        if ($data.self) {
            if ($data.self === 'reload') {
                $self.location.reload();
            } else if ($data.self === '') {

            } else if ($data.self === 'close') {
                $parent.layer.close($parent.layer.getFrameIndex(win.name));
            } else {
                $self.location.href = $data.self;
            }
        } else if ($data.parent) {
            if ($data.parent === 'reload') {
                $parent.location.reload();
            } else {
                $parent.location.href = $data.parent;
            }
        } else if ($data.top) {
            if ($data.top === 'reload') {
                $top.location.reload();
            } else {
                $top.location.href = $data.top;
            }
        } else {
            let url = $data.href || $data.jump;
            if (url === 'reload') {
                $self.location.reload();
            } else if (url === 'close') {
                $parent.layer.close($parent.layer.getFrameIndex(win.name));
            } else if (!!url) {
                let win = ($parent.location === $parent.parent.location) ? $self : $parent;
                win.location.href = url;
            }
        }
    };

    win.db = {
        get: function (url, $button, $form) {
            $.get(url, function ($data) {
                db.forResponse($data, $button, $form);
            });
        },

        post: function (url, data, $button, $form) {
            $('input').blur();
            $.post(url, data, function ($data) {
                db.forResponse($data, $button, $form);
            });
        },
        reArea: function (v) {
            if (typeof v === 'object') {
                if (/^\d+$/.test(v[0])) v[0] = v[0] + 'px';
                if (/^\d+$/.test(v[1])) v[1] = v[1] + 'px';
            } else {
                if (/^\d+$/.test(v)) v = v + 'px';
            }
            return v;
        },
        forResponse: function ($response, $button, $form) {

            let option = getMsgOption($response, $button, $form);

            if ($response.callback) return eval($response.callback);

            if ($response.tips) {
                let opt = {};
                if ($response.option) opt = $response.option;
                if (opt[0]) opt = {tips: opt};
                let id = layer.tips($response.tips, $button, opt);
                $button.on('mouseout', function () {
                    layer.close(id);
                });
                return;
            }

            if ($response.success) {
                option.skin = "layui-layer-green";
                option.shadeClose = $button.data('shade');
                // option.shadeClose = false;
                option.yes = function (index, layerOBJ) {
                    if ($response.yes) {
                        parent[$response.yes]($response);
                        parent.layer.close(parent.layer.getFrameIndex(window.name));
                    } else {
                        setRedirect($response);
                    }
                    layer.close(layer.index);
                };

            } else {
                option.skin = "layui-layer-red";
                option.shadeClose = true;
                option.yes = function (a, b) {
                    layer.close(layer.index);
                };
            }

            doc.onkeydown = function () {
                let event = doc.all ? win.event : arguments[0];
                let key = event.keyCode;
                //回车，空格，Shift
                if (key.in_array([13, 32, 16])) {
                    option.yes();
                }
            };
            if (option.area) option.area = this.reArea(option.area);
            if (option.offset) option.offset = this.reArea(option.offset);
            console.log('forResponseOption:', option);
            if (option.content === 'none') {
                option.yes();
            } else {
                layer.open(option);
            }
        },
        open: function (self) {
            if (self.hasClass('layui-btn-disabled') || self.data('disabled') || self.attr('disabled')) return false;
            // console.log(1);
            let pIndex = win.parent.openIndex;
            let width = self.attr('width') || self.data('width') || 800,
                height = self.attr('height') || self.data('height'),
                size = self.data('size'),
                button = self.attr('button') || self.data('button'),
                href = self.attr('href') || self.data('href') || self.data('url') || self.data('content'),
                title = self.attr('title') || self.data('title'),
                minmax = self.attr('minmax') || self.data('minmax'),
                resize = self.attr('resize') || self.data('resize'),
                left = self.attr('left') || self.data('left'),
                top = self.attr('top') || self.data('top'),
                areav = self.attr('offset') || self.data('offset'),
                shadeClose = self.attr('shade') || self.data('shade'),
                shadeVal = self.attr('shadeval') || self.data('shadeval'),
                scrollbar = self.attr('scrollbar') || self.data('scrollbar'),
                fix = self.data('fix'),
                blur = self.data('blur'),
                anim = self.data('anim'),
                callback = self.data('callback'),
                type = self.data('type');//0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            // type = (self.attr('href') || self.data('href')) ? 2 : 0;
            if (!type || type === '' || type === 'undefined') type = 2;
            if (href === '#' || href === '' || href === 'undefined') return false;
            minmax = (minmax !== 'false');
            type = parseInt(type);
            if (type === 1 && self.data('obj')) {
                href = $(self.data('obj')).html();
            }

            if (areav === 'mouse') {
                const event = window.event;
                if (event.pageX || event.pageY) {
                    left = event.pageX + 10;
                    top = event.pageY + 10;
                } else if (event.clientX || event.clientY) {
                    left = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft + 10;
                    top = event.clientY + document.documentElement.scrollTop + document.body.scrollTop + 10;
                }
            }

            if (left < 0) {
                left = window.innerWidth + left;
            }


            if (!resize) resize = 'false';
            resize = (resize !== 'false');
            if (!resize) minmax = false;
            if (!shadeVal) shadeVal = 0.3;

            if (!width && size) {
                size = size.split(',');
                width = size[0];
                height = size[1];
            }
            if (!height) height = parseInt(width * 0.625);
            let offset = 'auto';
            if (!!top && !!left) offset = [top, left];
            if (title === undefined) title = self.text();
            else if (title === 'false') title = false;
            if (scrollbar === 'false') scrollbar = false;
            if (shadeClose === 'false') shadeClose = false;
            if (blur !== 'false' && blur !== false) blur = true;
            shadeClose = (shadeClose !== false);
            if (!anim) anim = 0;
            let area = [width, height];

            let option = {
                id: 'boxFrame',
                type: type,//0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                title: title,
                area: area,
                // btn: ['确定', '取消'],
                closeBtn: title ? 1 : 0,
                shade: [shadeVal, '#393D49'],
                fixed: false, //不固定
                maxmin: minmax,
                anim: anim,//0:平滑放大;1:从上掉落;2从最底部往上滑入;3从左滑入;4从左翻滚;5渐显;6抖动
                // skin: 'layui-layer-lan',//molv
                // skin: 'demo-class',//molv
                resize: resize,
                offset: offset,
                shadeClose: shadeClose,
                content: href,
                success: function (layero, index) {
                    if (blur) $('table,form').addClass('blur1');
                    if (fix) {
                        win.onscroll = function (e) {
                            win.scrollTo(doc.scrollLeft, doc.scrollTop);
                        };
                    }
                    if (pIndex && win.parent && win.parent.layer) {
                        win.parent.layer.shade(pIndex, 1);
                    }
                },
                end: function () {
                    if (fix) win.onscroll = null;
                    if (blur) $('table,form').removeClass('blur1');
                    if (callback) eval(callback);
                    if (pIndex && win.parent && win.parent.layer) win.parent.layer.shade(pIndex, 0);
                }
            };
            if (false === scrollbar) {
                option.scrollbar = false;
            }
            if (button) {
                option.btn = button.split(",");
            }
            if (self.data('out')) {
                option.moveOut = true;
            }
            if (option.area) option.area = this.reArea(option.area);
            if (option.offset) option.offset = this.reArea(option.offset);
            console.log(option);
            win.openIndex = layer.open(option);
            return false;
        },
        copy: function (self) {
            if (self.hasClass('layui-btn-disabled') || self.data('disabled') || self.attr('disabled')) return false;

            let obj = self.data('object'), val;
            let title = self.attr('title') || self.data('title') || '复制完成';
            let tips = self.attr('tips') || self.data('tips');
            let time = self.attr('time') || self.data('time') || 4000;
            if (obj) {
                val = $(obj).data('value') || $(obj).data('val') || $(obj).attr('href') || $(obj).val() || $(obj).text();
            } else {
                val = self.data('value') || self.data('val') || self.attr('href') || self.val() || self.text() || self.parent().text();
            }
            if (!val) {
                layer.tips('未定义目标Copy数据', self);
                return false;
            }
            val.copy(function () {
                if (tips) {
                    if (typeof tips === "string") tips = tips.array();
                    let id = layer.tips(title, self, {time: time, tips: tips});
                    self.on('mouseout', function () {
                        layer.close(id);
                    });
                } else {
                    layer.msg(title, {icon: 6, time: time, shade: [0.01, '#ffffff'], shadeClose: true});
                }
            });
        },
        render: function () {

            //表单输入框后渲染data-unit
            $('.layui-form input[data-unit]').each(function (i) {
                const self = $(this);
                if ('' === self.data('unit')) return;
                self.after("<em class='unit '>{{unit}}</em>".re(self.data()));
            });

            $('.layui-table').each(function (i) {
                const self = $(this);
                console.log(self.find('thead>tr'))
            });

        }
    };

    win.vdb = $fun(win.Vue)

})(window, document, self, parent, top, function (vue) {

});