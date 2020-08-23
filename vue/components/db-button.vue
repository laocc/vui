<template>
    <a :class="btnClass" :href="url" @click.stop="clickBtn" onclick="return !1;">
        <slot></slot>
    </a>
</template>

<script>
    module.exports = {
        name: "db-button",
        props: {
            type: {//按钮形式，open,ajax,post
                type: String,
                default: 'link'
            },
            width: {//open时的宽高
                type: [Number, String],
                default: 600
            },
            height: {
                type: [Number, String],
                default: 1000
            },
            url: {//弹出或ajax的目标
                type: String,
                default: ''
            },
            title: {//open的标题
                type: String,
                default: ''
            },
            cls: {//class，若是btn则显示按钮式样
                type: String,
                default: ''
            },
            size: {//按钮的大小 、、small
                type: String,
                default: ''
            }
        },
        data() {
            return {
                css: {min: '', small: '', normal: '', big: ''}
            }
        },
        created() {
            // console.log('this.cls=', this.class, '/');
        },
        computed: {
            btnClass: function () {
                if (this.cls === 'btn') return 'btn';
                return (this.cls || '') + ' blue href';
            }
        },
        methods: {
            clickBtn() {
                if (this.type === 'ajax') {
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
                    title: this.title,
                    area: area,
                    closeBtn: this.title ? 1 : 0,
                    shade: [0.1, '#393D49'],
                    fixed: !1, //不固定
                    maxmin: !1,
                    anim: 0,//0:平滑放大;1:从上掉落;2从最底部往上滑入;3从左滑入;4从左翻滚;5渐显;6抖动
                    resize: !1,
                    offset: 'auto',
                    shadeClose: !0,
                    content: this.url,
                    success: function (layero, index) {
                        if (self.blur) $('table,form').addClass('blur1');
                        if (self.fix) {
                            window.onscroll = function (e) {
                                window.scrollTo(document.scrollLeft, document.scrollTop);
                            };
                        }
                        if (pIndex) window.parent.layer.shade(pIndex, 1);
                    },
                    end: function () {
                        if (self.fix) window.onscroll = null;
                        if (self.blur) $('table,form').removeClass('blur1');
                        // if (callback) eval(callback);
                        if (pIndex) window.parent.layer.shade(pIndex, 0);
                    }
                };
                console.log(option);
                window.dbOpenIndex = layer.open(option);
                return !1;
            },
            requestUrl() {
                const self = this;
                let data = {url: self.url, ajax: false, action: 'GET'};
                if (this.type === 'ajax') data.ajax = true;
                if (this.type === 'post') data.action = 'POST';

                self.$request(data).then(
                    function (resp) {
                        let back = function () {
                            if (resp.reload || resp.self === 'reload') {
                                location.reload();
                            } else {
                                let u = (resp.jump || resp.href);
                                if (u) location.href = u;
                            }
                        };
                        if (resp.message) {
                            self.$alert(resp.message, {callback: back});
                        } else {
                            back();
                        }
                    },
                    function (resp) {
                        self.$alert(resp.message);
                    }
                );
            }
        },
    }
</script>

<style scoped>
    .btn {
        background: #00a0e9;
        color: #fff;
        padding: 5px 8px;
        border-radius: 2px;
        margin: 2px;
    }

    .min {
    }

    .small {
    }

    .normal {
    }

    .big {
    }
</style>