<template>
    <a :href="href" @click.stop="clickBtn" onclick="return !1;">
        <slot></slot>
        <span :class="icon" v-if="icon"></span>
        <!--这儿两个元素要保持在一行，否则会在后面有个空格-->
    </a>
</template>

<script>
    module.exports = {
        name: "db-button",
        props: {
            type: {//按钮形式，open,ajax,post,text
                type: String,
                default: 'text'
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
                type: [Number, String, Array],
                default: ''
            },
            data: {
                type: [String, Array, Object],
                default: ''
            },
            btn: {
                type: [String, Array],
                default: ''
            },
            url: {//弹出或ajax的目标
                type: String,
                default: ''
            },
            icon: {
                type: String,
                default: ''
            },
            title: {//open的标题
                type: [String, Array],
                default: ''
            }
        },
        data() {
            return {
                css: {min: '', small: '', normal: '', big: ''},
                action: '',
            }
        },
        created() {
            this.action = this.type;
            let c = ' ' + this.$vnode.data.staticClass;
            if (c.indexOf('ajax') > 0) this.action = 'ajax';
            else if (c.indexOf('open') > 0) this.action = 'open';
            else if (c.indexOf('post') > 0) this.action = 'post';
        },
        computed: {
            href: function () {
                if (typeof  this.value === 'object') {
                    return this.url.sprintf(...this.value);
                }
                return this.url.sprintf(this.value);
            },
            titleVal: function () {
                if (typeof this.title === 'object') {
                    return this.title.shift().sprintf(...this.title);

                } else if (typeof this.url === 'object') {
                    return this.url.shift().sprintf(...this.url);

                } else if (typeof this.value === 'object') {
                    return this.title.sprintf(...this.value);

                }
                return this.title.sprintf(this.value);
            }
        },
        methods: {
            clickBtn() {
                console.log('click', this.action, this.href);
                this.$emit('click');
                if (this.action === 'text' || !this.url) return;
                if (this.action === 'ajax' || this.action === 'post') {
                    this.requestUrl();
                } else {
                    this.openWin();
                }
            },

            openWin(e) {
                if (typeof layui === "undefined") return "未引入layui.js";
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
                    shadeClose: !0,
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
                            self.$emit('success');
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
                                        self.$emit('finish');
                                    } else {
                                        let u = (resp.jump || resp.href);
                                        if (u) location.href = u;
                                    }
                                }
                            };
                            if (self._events.success) {
                                self.$emit('success');
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

    .btn {
        background: #1471f1;
        color: #fff;
        padding: 8px 12px;
        border-radius: 2px;
        margin: 2px;
    }

    .min {
        padding: 1px 3px;
    }

    .small {
        padding: 5px 8px;
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