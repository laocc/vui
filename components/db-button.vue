<template>
    <a :href="href" ref="btn" :class="cls" @click.stop="clickBtn" onclick="return !1">
        <slot></slot><span :class="icon" v-if="icon"></span>
    </a>
</template>

<script>
    module.exports = {
        name: "db-button",
        props: {
            type: {//按钮形式，open,ajax,post,link,text
                type: String,
                default: ''
            },
            width: {//open时的宽高
                type: [Number, String],
                default: 600
            },
            height: {
                type: [Number, String],
                default: 0
            },
            value: {
                type: [Number, String, Array, Object]
            },
            data: {
                type: [String, Array, Object],
                default() {
                    return {};
                }
            },
            btn: {
                type: [String, Array],
                default: ''
            },
            url: {//弹出或ajax的目标
                type: [String, Array],
                default: ''
            },
            icon: {
                type: String,
                default: ''
            },
            callback: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
            shade: {
                type: Boolean,
                default: true
            },
            direction: {
                type: String,
                default: 'left'
            },
            title: {//open的标题
                type: [String, Array, Boolean],
                default: ''
            }
        },
        data() {
            return {
                css: {min: '', small: '', normal: '', big: ''},
                action: '',
                beClick: false,
                btnHtml: '',
                drawerCall: false,//上层以@drawer="fun"形式，则将组合后的结果传至该函数，
            }
        },
        created() {
            this.action = this.type;
            if (!this.action) {
                let c = ' ' + this.$vnode.data.staticClass;
                if (c.indexOf('ajax') > 0) this.action = 'ajax';
                else if (c.indexOf('open') > 0) this.action = 'open';
                else if (c.indexOf('dialog') > 0) this.action = 'dialog';
                else if (c.indexOf('post') > 0) this.action = 'post';
                else if (c.indexOf('link') > 0) this.action = 'link';
                else if (c.indexOf('drawer') > 0) this.action = 'drawer';
                else if (c.indexOf('parent') > 0) this.action = 'parent';
            }
            if (!this.action) this.action = 'text';
            if (this._events.drawer) {
                this.drawerCall = true;
                this.action = 'drawer';
            }
        },
        computed: {
            href: function () {
                if (typeof this.url === 'object') {
                    return this.url.shift().sprintf(...this.url);
                }
                return this.url;
            },
            cls: function () {
                if (this.disabled) return 'disabled';
                return '';
            },
            titleVal: function () {
                if (typeof this.title === 'boolean') return this.title;
                if (this.title === 'false') {
                    this.title = false;
                    return false;

                } else if (this.title === '') {
                    return this.$slots.default[0].text.trim();

                } else if (typeof this.title === 'object') {
                    return this.title.shift().sprintf(...this.title);
                }

                return this.title;
            }
        },
        methods: {
            clearSubmit() {
                this.beClick = false;
                this.$refs.btn.innerHTML = this.btnHtml;
            },
            clickBtn(e) {
                console.log('click', this.action, this.href);
                if (this.disabled || this.beClick) {
                    console.log('disabled');
                    return;
                }
                if (this._events.submit) {
                    this.beClick = true;
                    this.btnHtml = this.$refs.btn.innerHTML;
                    this.$refs.btn.innerHTML = "<em class='fc f29d'>保存中</em>";
                    this.$emit('submit', e);
                    return;
                } else {
                    this.$emit('click', e);
                }

                if (this.action === 'link') {
                    top.location.href = this.href;
                    return true;
                }
                if (this.action === 'parent') {
                    parent.frmNewTab(this.href, this.titleVal);
                    return true;
                }
                if (this.action === 'text' || !this.url) return;

                if (this.action === 'ajax' || this.action === 'post') {
                    this.requestUrl();

                } else if (this.action === 'open' || this.action === 'dialog') {
                    let option = {};
                    option.show = true;
                    option.type = 'dialog';
                    option.width = parseInt(this.width);
                    option.height = parseInt(this.height) || (option.width * 0.6);
                    option.title = this.titleVal;
                    option.src = this.$iframe(this.href + '#' + ((new Date()).valueOf()), !1);
                    this.$emit('input', option, e);

                } else if (this.action === 'drawer') {
                    let dir = {left: 'ltr', right: 'rtl', top: 'ttb', bottom: 'btt'};
                    let size = this.direction.in_array(['top', 'bottom']) ? this.height : this.width;
                    if (!size) size = '500';
                    if (String(size).indexOf('%') < 0) size = parseInt(size) + 'px';

                    let title = this.titleVal;
                    if (!title || title === 'false') title = false;
                    let option = {
                        type: 'drawer',
                        show: true,
                        title: title,
                        width: this.width,
                        height: this.height,
                        src: this.$iframe(this.href + '#' + ((new Date()).valueOf()), !1),
                        size: size,
                        dir: dir[this.direction] || 'left'
                    };
                    console.log(option.src);
                    this.drawerCall ? this.$emit('drawer', option, e) : Object.assign(this.value, option);
                    this.$emit('input', option, e);

                } else {
                    // this.openDialog();
                }
            },
            openWin(e) {
                if (typeof layui === "undefined") {
                    console.log('未引入layui.js');
                    return;
                }
                const self = this;
                let pIndex = window.parent.dbOpenIndex;
                let width = parseInt(this.width);
                let height = parseInt(this.height) || (width * 0.75);
                let area = [width + 'px', height + 'px'];

                let option = {
                    id: 'boxFrame',
                    type: 2,//0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
                    title: this.titleVal,
                    area: area,
                    closeBtn: this.title ? 1 : 0,
                    shade: [0.1, '#393D49'],
                    fixed: !1, //不固定
                    maxmin: !1,
                    anim: 0,//0:平滑放大;1:从上掉落;2从最底部往上滑入;3从左滑入;4从左翻滚;5渐显;6抖动
                    resize: !1,
                    offset: 'auto',
                    shadeClose: this.shade !== false,
                    content: this.href,
                    yes: function () {
                        if (self._events.yes) {
                            self.$emit('yes');
                        }
                    },
                    success: function (layero, index) {
                        if (self.blur) $('table,form').addClass('blur1');
                        if (self.fix) {
                            window.onscroll = function (e) {
                                window.scrollTo(document.scrollLeft, document.scrollTop);
                            };
                        }
                        if (pIndex) window.parent.layer.shade(pIndex, 1);
                        if (self._events.success) {
                            self.$emit('open');
                        }
                    },
                    end: function () {
                        if (self.fix) window.onscroll = null;
                        if (self.blur) $('table,form').removeClass('blur1');
                        // if (callback) eval(callback);
                        if (pIndex) window.parent.layer.shade(pIndex, 0);
                        if (self._events.end) {
                            self.$emit('end');
                        }
                    }
                };

                if (this.btn) option.btn = this.btn;

                console.log(option);
                window.dbOpenIndex = layer.open(option);
                return !1;
            },

            requestUrl() {
                const self = this;
                let data = null;
                let option = {url: self.href, ajax: false, action: 'GET'};
                if (this.action === 'ajax') option.ajax = true;
                if (this.action === 'post') {
                    option.action = 'POST';
                    data = this.data;
                }

                const callRequest = function () {

                    self.$request(option, data).then(
                        function (resp) {
                            let back = function (v) {
                                console.log(v);
                                if (resp.reload || resp.self === 'reload') {
                                    location.reload();
                                } else {
                                    if (self._events.finish) {
                                        self.$emit('finish', resp);
                                    } else {
                                        let u = (resp.jump || resp.href);
                                        if (u) location.href = u;
                                    }
                                }
                            };
                            if (self._events.success) {
                                self.$emit('success', resp);
                                self.$message({message: resp.message, type: 'success'});

                            } else if (resp.message) {
                                console.log('ok', resp);
                                self.$message({message: resp.message, type: 'success', onClose: back});

                            } else {
                                console.log('null', resp);
                                back();
                            }
                        },
                        function (resp) {
                            self.$message({message: resp.message, type: 'error'});
                        }
                    );
                };

                if (this.title) {
                    this.$confirm(this.titleVal, '确认信息', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '确认',
                        cancelButtonText: '放弃'
                    }).then(() => {
                        callRequest()
                    }).catch(action => {
                        // return;
                    });
                } else {
                    callRequest()
                }

            }
        },
    }
</script>

<style scoped>
    a {
        white-space: nowrap;
        display: inline-block;
        line-height: normal;
    }

    a:hover {
        color: #eee9c6;
    }

    .disabled {
        -webkit-filter: blur(1px);
        -moz-filter: blur(1px);
        -o-filter: blur(1px);
        -ms-filter: blur(1px);
        filter: blur(1px);
    }

    .btn {
        background: #1471f1;
        color: #fff;
        padding: 8px 12px;
        font-size: 14px;
        border-radius: 2px;
        margin: 2px;
    }

    .mini {
        padding: 1px 3px;
    }

    .small {
        padding: 6px 12px;
    }

    .normal {
        padding: 8px 12px;
    }

    .big {
        padding: 12px 18px;
    }

    .error {
        background: #f10114;
        color: #fff;
    }

    .error:hover {
        background: #b40113;
        color: #fff;
    }

    .danger {
        background: #f10114;
        color: #fff;
    }

    .danger:hover {
        background: #a90110;
        color: #fff;
    }

    .hui {
        background: #cbcbcb;
        color: #111111;
    }

    .hui:hover {
        background: #bcbcbc;
        color: #000;
    }

    .white {
        background: #fff;
        color: #606266;
        border: 1px solid #DCDFE6;
    }

    .white:hover {
        background: #ddd;
        color: #1471f1;
    }

    .primary {
        background: #1471f1;
        color: #fff;
    }

    .primary:hover {
        background: #1052a6;
        color: #fff;
    }

    .warn {
        background: #e46459;
        color: #fff;
    }

    .warn:hover {
        background: #b85a50;
        color: #fff;
    }

    .success {
        background: #51a273;
        color: #fff;
    }

    .success:hover {
        background: #3e7257;
        color: #fff;
    }

</style>