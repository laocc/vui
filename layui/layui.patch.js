$(function () {
    //
    // const url = document.scripts[0].src;
    //
    // layui.config({
    //     base: layui.cache.dir + 'extend/',
    //     rand: url.substr(url.lastIndexOf("?") + 1),
    // }).extend({autocomplete: 'layui_complete-master/autocomplete'});
    db.render();

    layui.use(['form', 'flow', 'element', 'layedit'], function () {
        const body = $('body');
        const form = layui.form;
        // const element = layui.element;
        const layedit = layui.layedit;

        //动态修改当前页面的title
        if (document.title !== parent.document.title)
            parent.layer.title(document.title, parent.layer.getFrameIndex(window.name));

        // layui.flow.lazyimg();    //开启懒加载


        //.parent,a[target=parent],a[target=top]
        body.on('click', '.parent', function () {
            const self = $(this);
            if (self.hasClass('layui-btn-disabled') || self.data('disabled') || self.attr('disabled')) return false;
            let title = self.attr('title') || self.data('title') || self.text();
            let href = self.attr('href') || self.data('url') || self.data('link');
            //frmNewTab在index/index.php中定义
            parent.frmNewTab(href, title);
            return false;
        });


        body.on('click', '.alert', function () {
            const self = $(this);

            let title = self.attr('title') || self.data('title');
            let cont = self.data('content') || self.data('message') || self.data('value') || self.text();
            let btn = self.data('btn') || self.data('button');
            let opt = {
                title: title,
                shadeClose: true,
            };
            if (title === false) opt.closeBtn = 0;
            if (btn) opt.btn = btn;
            let id = layer.alert(cont, opt);
            // layer.iframeAuto(id);
            return false;
        });
        body.on('dblclick', '.layui-code', function () {
            if ($(this).attr('contenteditable')) {
                $(this).removeAttr('contenteditable').css({
                    'background': '#f2f2f2',
                    'border-color': '#ddd',
                    'color': '#333'
                });
            } else {
                $(this).attr('contenteditable', true).css({
                    'background': '#fff',
                    'border-color': '#d00',
                    'color': '#333'
                });
            }
        });
        body.on('click', '.open,a[target=open]', function (ob) {
            return db.open($(this));
        });

        body.on('click', '.fullScreen', function (ob) {
            let obj = $('body')[0];
            if (obj.requestFullscreen) {
                obj.requestFullscreen();
            } else if (obj.mozRequestFullScreen) {
                obj.mozRequestFullScreen();
            } else if (obj.webkitRequestFullscreen) {
                obj.webkitRequestFullscreen();
            } else if (obj.msRequestFullscreen) {
                obj.msRequestFullscreen();
            }
            return false;
        });
        body.on('focus', 'input.select', function (ob) {
            $(this).select();
        });
        body.on('click', '.copy', function () {
            db.copy($(this));
            /**
             * <a href="/" class="copy" data-object="span#durl" title="复制成功">复制</a> 优先
             * <a href="/" class="copy" data-data="要复制的内容" title="复制成功">复制</a>
             */
            return false;
        });
        body.on('dblclick', '.dblcopy', function () {
            db.copy($(this));
            return false;
        });
        body.on('click', '.tips', function () {
            const self = $(this);
            let title = self.attr('title') || self.data('title');
            let time = self.attr('time') || self.data('time') || 5;
            let tips = self.attr('tips') || self.data('tips');
            let opt = {
                time: 5000,
                shade: [0.1, '#ffffff'],
                shadeClose: true,
            };
            if (time) opt.time = time * 1000;
            if (tips) {
                if (typeof tips === "string") tips = tips.array();
                opt.tips = tips;
            }
            let id = layer.tips(title, self, opt);
            self.on('mouseout', function () {
                layer.close(id);
            });
            return false;
        });
        body.on('mouseenter', '.alt', function () {
            const self = $(this);
            /**
             mouseover,mouseout
             mouseenter,mouseleave
             */
            self.css({cursor: 'help'});
            let title = self.attr('alt') || self.data('alt') || self.data('title') || self.attr('title');
            let color = self.attr('color') || self.data('color');
            let skin = self.attr('skin') || self.data('skin');
            let time = self.attr('time') || self.data('time');
            let tips = self.attr('tips') || self.data('tips');
            let width = self.attr('width') || self.data('width');
            let height = self.attr('height') || self.data('height');
            let opt = {
                time: 0,
                tips: [1, '#111111'],
            };
            if (width) {
                opt.area = [width + 'px'];
                if (height) opt.area = [width + 'px', height + 'px'];
            }
            if (time && time < 1000) opt.time = time * 1000;
            // alert(tips);
            if (tips) {
                if (typeof tips === "string") tips = tips.array();
                opt.tips = tips;
            }
            if (color) opt.tips[1] = color;
            if (skin) opt.skin = skin;
            let id = layer.tips(title, self, opt);
            self.on('mouseleave', function () {
                layer.close(id);
            });
            return false;
        });
        body.on('click', '.prompt', function () {
            const self = $(this);
            let value = self.attr('value') || self.data('value');
            let title = self.attr('title') || self.data('title');
            let width = self.attr('width') || self.data('width');
            let height = self.attr('height') || self.data('height');
            let button = self.attr('button') || self.data('button');
            let line = self.attr('line');
            let href = self.attr('href');
            if (!width) width = 400;
            if (!height) height = 250;
            if (!line) line = 0;
            if (line > 0) line = 2;
            if (line === 1) height = 'auto';

            let option = {
                formType: 2,
                anim: 5,
                value: value,
                title: title,
                area: [width + 'px'],
                shade: [0.1, '#393D49'],
                btn: ['确定', '取消'],
                shadeClose: true
            };

            let callback = function (value, index, elem) {
                const self = $(this);
                $('input').blur();
                $.post(href, {value: value}, function ($response) {
                    db.forResponse($response, self)
                });
            };

            layer.prompt(option, callback);
            return false;
        });
        body.on('click', '.close', function () {
            const index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        });
        body.on('click', '.chang', function () {
            const self = $(this);
            if (self.hasClass('layui-btn-disabled') || self.data('disabled') || self.attr('disabled')) return false;

            let object, chang = self.attr('chang') || self.data('chang');

            if (chang === "self") object = self;
            else if (chang === "parent") object = self.parent();
            else object = $(chang);
            console.log('a.chang');
            $.get(self.attr('href'), function ($data) {
                if ($data.success) {
                    if (object.prop("tagName").toUpperCase() === 'INPUT') {
                        object.val($data.message);
                    } else {
                        object.html($data.message);
                    }
                } else {
                    layer.msg($data.message);
                }
            });

            return false;
        });
        body.on('click', '.ajax', function () {
            const self = $(this);
            if (self.hasClass('layui-btn-disabled') || self.data('disabled') || self.attr('disabled')) return false;

            let title = self.attr('title') || self.data('title');
            let href = self.attr('href') || self.data('url');

            if (self.attr('checked') || self.hasClass('checked')) {
                let tag = self.parent().parent().find('.layui-form-checkbox');
                if (!tag.hasClass('layui-form-checked')) {
                    layer.tips('请选中要处理的数据行', tag.parent(), {tips: [2, '#ae0025']});
                    return false;
                }
            }

            if (title) {
                let click = false;
                let label = self.attr('label') || self.data('label');
                let icon = self.attr('icon') || self.data('icon');
                let width = self.attr('width') || self.data('width');
                if (!label) label = "操作确认";
                if (!icon) icon = 3;
                let opt = {title: label, icon: icon};
                if (width) opt.area = width;

                /**
                 * icon: * 0：叹号 * 1：对号* 2：叉号 * 3：问号 * 4：小锁 * 5：伤心* 6：开心
                 */
                layer.confirm(title, opt, function (index) {
                    db.get(href, self);
                    layer.close(index);
                }, function (index) {
                    layer.close(index);
                    return false;
                });
                if (!click) return false;
            } else {
                db.get(href, self);
            }

            return false;
        });
        body.on('click', '.layui-nav a', function () {
            return false;
        });
        body.on('click', '.inputSearch>li', function () {
            const self = $(this);
            $(`input[name=${self.parent().data('object')}]`).val(self.text());
            self.parent().hide();
        });
        body.on('mouseout', '.layui-header .layui-nav a', function () {
            $(this).parent().removeClass('layui-this');
            return false;
        });

        /**
         * lay-verify="required|url"
         required（必填项）
         phone（手机号）
         email（邮箱）
         url（网址）
         number（数字）
         date（日期）
         identity（身份证）
         */
        form.verify({
            username: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                } else if (/^(_.+|.+_)$/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                } else if (!/^\w{3,11}$/.test(value)) {
                    return '用户名只能为手机号码或3至11位的字母与数字组合';
                }
            },
            password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            domain: [/^((https?:\/\/)?([a-z0-9][-a-z0-9]{1,62}\.)+?[a-z]{2,10})?$/i, '域名格式不正确'],
            appid: [/^((wx|db|ali)[a-f0-9]{16})?$/, 'APPID是以wx/db/ali开头加16位英文数字组合的字符串'],
            realid: function (value, item) {
                //[/^(gh_[a-f0-9]{12})?$/, 'RealID是以gh_开头的15位英文数字组合的字符串']
                if (/^(gh_[a-f0-9]{12})?$/.test(value)) return;
                if (/^(\w+?\.)+\w+$/.test(value)) return;
                return 'RealID是以gh_开头的15位英文数字组合的字符串，或类似com.abc.xyz的APP包名'
            },
        });


        /**
         * 编辑器
         * https://www.layui.com/doc/modules/layedit.html
         *  tool: ['link', 'unlink', '|', 'left', 'center', 'right'],
         */
        let editIndex = layedit.build('editor', {height: 450});

        form.on('submit(post)', function (data) {
            //  lay-submit lay-filter="post"
            const self = $(this);//按钮
            const $form = $(data.form);//表单对象
            if (self.data('auto') === 'disabled') return true;
            if (self.data('disabled') !== 'disabled') {
                self.blur().attr('disabled', 'disabled').addClass('layui-btn-disabled');
            }

            let ta = $('#editor');
            if (ta.length > 0) {
                data.field[ta.attr('name')] = layedit.getContent(editIndex);
            }

            //有拦截器
            let it = self.attr('intercept');
            if (it) {
                self.removeAttr('disabled').removeClass('layui-btn-disabled');
                return window[it](data.field);
            }

            //附加，由vue检查
            let c = self.attr('validator');
            if (c && !1 === window[c](data.field)) {
                self.removeAttr('disabled').removeClass('layui-btn-disabled');
                return;
            }

            $.post($form.attr('action'), data.field, function ($response) {
                //$response是服务器给出的值
                let mch = window.location.href.match(/callback=(\w+)/i);
                if (mch) {
                    self.removeAttr('disabled').removeClass('layui-btn-disabled');
                    if ($response.success) {
                        parent[mch[1]]($response);
                        // eval(`parent.${mch[1]}($response)`);
                    } else {
                        layer.msg($response.message, {icon: 2})
                    }
                } else {
                    db.forResponse($response, self, $form)
                }
            });

            return false;
        });
        form.on('checkbox', function (data) {
            let self = $(data.elem);
            self.attr('checked', data.elem.checked);
            self.prev().attr('checked', data.elem.checked);

            if (self.hasClass('ajax')) {
                let href = self.data('href');
                if (!href || href === 'undefined') return;
                let checked = (data.elem.checked ? '1' : '0');
                let item = data.elem.name;
                let value = data.value;
                let obj, object = self.data('object');
                if (object) {
                    if (object === 'self' || object === 'this') {
                        obj = $(this);
                    } else {
                        obj = $(self.data('object'));
                    }
                } else {
                    obj = self.parent().children('div');
                }
                $.get(href + '/' + checked + '/' + item + '/' + value, function ($response) {
                    db.forResponse($response, obj)
                });

            } else if (self.hasClass('all')) {
                let box = $("input[type=checkbox]");
                if (data.elem.checked) {
                    box.attr("checked", true).next('div').addClass('layui-form-checked');
                } else {
                    box.removeAttr('checked').next('div').removeClass('layui-form-checked');
                }
            }
        });
        form.on('switch(ajax)', function (data) {
            let href = data.value, self = $(this);
            let checked = (data.elem.checked ? '1' : '0');
            $.get(href + '/' + checked, function ($response) {
                db.forResponse($response, self)
            });
        });
        form.on('checkbox(select_all)', function (data) {
            /**
             * 列表页面，全选/全不选
             */
            let box = $("input[type=checkbox]");
            if (data.elem.checked) {
                box.attr("checked", true).next('div').addClass('layui-form-checked');
            } else {
                box.removeAttr('checked').next('div').removeClass('layui-form-checked');
            }
        });

        // form.on('radio', function (data) {
        //     const self = $(data.elem);
        //     self.show().attr('checked', true).click().hide();
        //     console.log('radio click', self);
        //     // $(obj).toggle(val == value);
        // });

        form.on('radio(switchInput)', function (data) {
            const self = $(data.elem);
            let value = self.val();
            let val = self.data('value');
            let obj = self.data('object');
            console.log(obj, value, val);
            $(obj).toggle(val == value);
        });

        form.render(); //更新全部
        console.log('layui.form.render');

    });

    layui.use(['upload'], function () {
        const upload = layui.upload;
        let load;
        let images = {
            elem: ".uploadImage",
            accept: 'images',
            url: '',
            done: function (data, index, upload) {
                let item = this.item;
                let object = item.data('object') || item.data('show');

                layer.close(load);
                if (data.success) {
                    if (data.message) layer.msg(data.message);
                    if (data.href === 'reload') {
                        window.location.reload();
                    } else if (data.href) {
                        self.location.href = data.href;
                    } else if (object) {
                        let o = $(object);
                        if (o.prop("tagName").toUpperCase() === 'INPUT') {
                            o.val(data.value);
                        } else {
                            o.text(data.value);
                        }
                    }
                } else {
                    layer.msg(data.message);
                }
            },
            allDone: function (obj) { //当文件全部被提交后，才触发
                // console.log(obj.total); //得到总文件数
                // console.log(obj.successful); //请求成功的文件数
                // console.log(obj.aborted); //请求失败的文件数
            },
            error: function (index, upload) {
                layer.msg('上传API出错');
                layer.close(load);
            },
            before: function (obj) {
                load = layer.load();
                let item = this.item;
                if (item.data('img')) {
                    obj.preview(function (index, file, result) {
                        // $(button.data('img')).attr('src', "data:image/png;base64," + result);
                        $(item.data('img')).attr('src', result);
                        // console.log(index); //得到文件索引
                        // console.log(file); //得到文件对象
                        // console.log(result); //得到文件base64编码，比如图片
                    });
                }
                console.log('this.multiple', this.multiple);
            },
            choose: function (obj) {
                let item = this.item;
                if (!this.url) this.url = item.data('api') || item.data('url');
            }
        };
        let zips = {
            elem: ".uploadChapter",
            accept: 'file',
            exts: 'zip|xls|xlsx|csv',
            url: '',
            done: function (data, index, upload) {
                let item = this.item;
                let object = item.data('object');
                let callback = item.data('callback');
                layer.close(load);
                if (data.success) {
                    if (data.message) layer.msg(data.message);
                    if (data.href === 'reload') {
                        window.location.reload();
                    } else if (data.href) {
                        self.location.href = data.href;
                    } else if (object) {
                        let o = $(object);
                        if (o.prop("tagName").toUpperCase() === 'INPUT') {
                            o.val(data.value);
                        } else {
                            o.text(data.value);
                        }
                    }
                    if (callback) {
                        eval(callback);
                    }

                } else {
                    layer.msg(data.message);
                }
            },
            error: function (index, upload) {
                layer.msg('上传API出错');
                layer.close(load);
            },
            choose: function (obj) {
                let item = this.item;
                if (!this.url) this.url = item.data('api') || item.data('url');
            }
        };

        upload.render(images);
        upload.render(zips);
    });

    layui.use(['colorpicker'], function () {
        const picker = layui.colorpicker;
        $('.colorPicker').each(function (i) {
            const self = $(this);
            let opt = {
                elem: self,
                color: self.data('value'),
                change: function (color) {
                    const cal = $(this.elem).data('change');
                    console.log('color=', color, 'call=', cal);
                    if (cal && undefined !== cal && 'undefined' !== cal) {
                        if (cal === 'self') {
                            $(this.elem).prev().val(color).focus().blur();
                        } else if (window[cal]) {
                            window[cal](color);//直接执行
                        }
                    }
                },
                done: function (color) {
                    const cal = $(this.elem).prev().data('done');
                    if (color === void 0) color = '';
                    $(this.elem).prev().val(color);
                    console.log('color=', color, 'call=', cal);
                    // window[cal](color);//直接执行
                    if (cal && undefined !== cal && 'undefined' !== cal && window[cal]) {
                        window[cal](color);//直接执行
                    }
                }
            };
            let col = self.data('colors');
            if (!!col && (typeof col === 'string')) {
                opt.colors = col.split(',');
                opt.predefine = true;
            }
            picker.render(opt);
        });

    });

    layui.use(['laydate'], function () {
        let layDate = layui.laydate;
        let ready = function () {
            $(this.elem).attr('readonly', true);
        };
        let optDate = {elem: 'input.layDate', type: 'date', format: 'yyyy-MM-dd', ready: ready};
        let optDate2 = {elem: 'input.layDate2', type: 'date', format: 'yyyy-MM-dd',};
        let optTime = {elem: 'input.layTime', type: 'time', format: 'HH:mm:ss', ready: ready};
        let optTime2 = {elem: 'input.layTime2', type: 'time', format: 'HH:mm:ss', ready: ready};
        let optDateTime = {elem: 'input.layDateTime', type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss', ready: ready};
        let optDateTime2 = {elem: 'input.layDateTime2', type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss', ready: ready};
        let optMonth = {elem: 'input.layMonth', type: 'month', format: 'yyyy-MM', ready: ready};
        let optRange = {elem: 'input.layDateRange', type: 'date', format: 'yyyy-MM-dd', range: true};

        let calendar = function (inputTag, obj) {

            let dB = [];
            dB.push('<span class="laydate_befor3">近三天</span>');
            dB.push('<span class="laydate_befor2">近两天</span>');
            dB.push('<span class="laydate_yestoday">昨天</span>');
            dB.push('<span class="laydate_today red">今天</span>');
            // dB.push('<span class="laydate_Tomorrow">明天</span>');
            // dB.push('<span class="laydate_after3">后三天</span>');
            dB.push('<span class="dimgray">|</span>');
            dB.push('<span class="laydate_weekPrev">上周</span>');
            dB.push('<span class="laydate_week red">本周</span>');
            // dB.push('<span class="laydate_weekNext">下周</span>');
            dB.push('<span class="dimgray">|</span>');
            dB.push('<span class="laydate_monthPrev">上月</span>');
            dB.push('<span class="laydate_month red">本月</span>');
            // dB.push('<span class="laydate_monthNext">下月</span>');
            dB.push('<span class="dimgray">|</span>');
            dB.push('<span class="laydate_year">今年</span>');

            let dFoot = $('div.layui-laydate-footer');
            dFoot.prepend(dB.join(""));

            let now = new Date();

            dFoot.on('click', 'span.laydate_today', function () {
                let d = now.format("yyyy-MM-dd");
                inputTag.val(d + ' - ' + d);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_yestoday', function () {
                now.setDate(now.getDate() - 1);
                let d = now.format("yyyy-MM-dd");
                inputTag.val(d + ' - ' + d);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_Tomorrow', function () {
                now.setDate(now.getDate() + 1);
                let d = now.format("yyyy-MM-dd");
                inputTag.val(d + ' - ' + d);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_befor3', function () {
                let d2 = now.format("yyyy-MM-dd");
                now.setDate(now.getDate() - 2);
                let d1 = now.format("yyyy-MM-dd");
                inputTag.val(d1 + ' - ' + d2);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_befor2', function () {
                let d2 = now.format("yyyy-MM-dd");
                now.setDate(now.getDate() - 1);
                let d1 = now.format("yyyy-MM-dd");
                inputTag.val(d1 + ' - ' + d2);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_after3', function () {
                let d1 = now.format("yyyy-MM-dd");
                now.setDate(now.getDate() + 2);
                let d2 = now.format("yyyy-MM-dd");
                inputTag.val(d1 + ' - ' + d2);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_month', function () {
                let d1 = now.format("yyyy-MM-01");

                let m = now.getMonth();
                now.setMonth(m + 1);
                now.setDate(1);
                now.setDate(now.getDate() - 1);

                let d2 = now.format("yyyy-MM-dd");
                inputTag.val(d1 + ' - ' + d2);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_year', function () {
                let d1 = now.format("yyyy-01-01");
                let d2 = now.format("yyyy-12-31");
                inputTag.val(d1 + ' - ' + d2);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_monthPrev', function () {
                let m = now.getMonth();
                now.setMonth(m - 1);
                let l = layDate.getEndDate(m, now.getFullYear());
                let d1 = now.format("yyyy-MM-01");
                let d2 = now.format("yyyy-MM-" + l);
                inputTag.val(d1 + ' - ' + d2);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_monthNext', function () {
                let m = now.getMonth();
                now.setMonth(m + 1);
                let l = layDate.getEndDate(m, now.getFullYear());
                let d1 = now.format("yyyy-MM-01");
                let d2 = now.format("yyyy-MM-" + l);
                inputTag.val(d1 + ' - ' + d2);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_week', function () {
                let w = now.getDay(), d1, d2;

                if (w === 0) {//星期天
                    now.setDate(now.getDate() - 7);
                    d1 = now.format("yyyy-MM-dd");
                } else {
                    now.setDate(now.getDate() - (w - 1));
                    d1 = now.format("yyyy-MM-dd");
                }
                now.setDate(now.getDate() + 6);
                d2 = now.format("yyyy-MM-dd");

                inputTag.val(d1 + ' - ' + d2);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_weekPrev', function () {
                let w = now.getDay(), d1, d2;
                if (w === 0) {//星期天
                    now.setDate(now.getDate() - 7);
                    d2 = now.format("yyyy-MM-dd");
                    now.setDate(now.getDate() - 7);
                    d1 = now.format("yyyy-MM-dd");
                } else {
                    now.setDate(now.getDate() - w);
                    d2 = now.format("yyyy-MM-dd");
                    now.setDate(now.getDate() - 6);
                    d1 = now.format("yyyy-MM-dd");
                }
                inputTag.val(d1 + ' - ' + d2);
                obj.hide();
            });
            dFoot.on('click', 'span.laydate_weekNext', function () {
                let w = now.getDay(), d1, d2;
                if (w === 0) {//星期天
                    now.setDate(now.getDate() + 7);
                    d1 = now.format("yyyy-MM-dd");
                    now.setDate(now.getDate() + 7);
                    d2 = now.format("yyyy-MM-dd");
                } else {
                    now.setDate(now.getDate() + w + 6);
                    d1 = now.format("yyyy-MM-dd");
                    now.setDate(now.getDate() + 6);
                    d2 = now.format("yyyy-MM-dd");
                }
                inputTag.val(d1 + ' - ' + d2);
                obj.hide();
            });
        };

        optRange.ready = function (date) {
            calendar($(this.elem), $('div.layui-laydate'));
            $(this.elem).attr('readonly', true);
        };

        optRange.change = function (value, starDate, endDate) {
            $(this.elem).val(value);
            $('div.layui-laydate').hide();
        };

        optMonth.change = function (value, starDate, endDate) {
            $(this.elem).val(value);
            $('div.layui-laydate').hide();
        };

        layDate.render(optDate);
        layDate.render(optDate2);
        layDate.render(optTime);
        layDate.render(optTime2);
        layDate.render(optDateTime);
        layDate.render(optDateTime2);
        layDate.render(optMonth);
        layDate.render(optRange);

        /**
         * 下两个方法针对日期选择器的前一天后一天
         */
        $('#date_star,#date_stop').each(function (i) {
            $(this).css({"float": "left", "width": '80%', 'border-radius': 0})
                .before('<span class="layui-input date_time_bar_prev layui-icon">&#xe603;</span>')
                .after('<span class="layui-input date_time_bar_next layui-icon">&#xe602;</span>');
        });

        $('.date_time_bar_prev,.date_time_bar_next').on('click', function () {
            const self = $(this);
            let i = self.index(), p, n = 1;
            if (i === 0) {
                p = self.next();
                n = -1;
            } else {
                p = self.prev();
            }
            let now = new Date();
            let ny = now.getFullYear(), nm = (now.getMonth() + 1), nd = now.getDate();

            let v = p.val();
            if (v === '') {
                if (nm < 10) nm = '0' + nm;
                if (nd < 10) nd = '0' + nd;
                p.val(ny + '-' + nm + '-' + nd);
                return;
            }
            let tm = new Date(v);
            tm.setDate(tm.getDate() + n);
            let y = tm.getFullYear(), m = (tm.getMonth() + 1), d = tm.getDate();

            if (tm.getTime() > now.getTime()) {
                y = ny;
                m = nm;
                d = nd;
            }
            if (m < 10) m = '0' + m;
            if (d < 10) d = '0' + d;
            p.val(y + '-' + m + '-' + d);
        });
    });


});
