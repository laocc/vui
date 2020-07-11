// import 'extend/mall.js';
window.$ = layui.$;

Vue.use(function (Vue, options) {
    Vue.prototype.$request = function (url, data, fun) {
        let action = data ? 'POST' : 'GET';
        if (typeof data === 'object') data = JSON.stringify(data);

        let call = function (success, fail) {
            let client = new XMLHttpRequest();
            client.open(action, url);
            client.setRequestHeader("Accept", "application/json");
            client.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            client.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            client.send(data);
            client.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        let json = JSON.parse(this.response || '[]');
                        if (json.success) {
                            success(json, this.status === 200);// === 200
                        } else {
                            fail(json, this.status === 200);// === 200
                        }
                    } else {
                        fail({success: 0, message: this.statusText}, this.status === 200);
                        // fail(new Error(this.statusText), this.status === 200);
                    }
                }
            };
        };

        if (fun === undefined) {
            return new Promise((success, fail) => {
                call(success, fail);
            });
        } else {
            call(fun['success'], fun['fail']);
        }
    };

    Vue.prototype.$get = function (url, fun) {
        return this.$request(url, null, fun);
    };

    Vue.prototype.$post = function (url, data) {
        return this.$request(url, data);
    };

    Vue.prototype.$iframe = function (src, sandbox) {
        if (sandbox === !1) return `<iframe src="${src}" frameborder="0"/>`;
        let sb = [];
        sb.push('allow-same-origin');//允许 iframe 内容被视为与包含文档有相同的来源。
        sb.push('allow-top-navigation');//允许 iframe 内容从包含文档导航（加载）内容。
        sb.push('allow-forms');//允许表单提交。
        sb.push('allow-scripts');//允许脚本执行。
        let box = sb.join(' ');
        return `<iframe src="${src}" frameborder="0" sandbox="${box}"/>`;
    };

    Vue.prototype.$copy = function (value) {
        console.log(typeof value);
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        value.copy();
    };

    //大白的快应用
    Vue.prototype.$isDaBaiApp = function (ua) {
        return /\.(dabai|linghu)/i.test(ua || window.navigator.userAgent);
    };
});


Vue.component('db-form', {
    props: [],
    data() {
        return {msg: ''}
    },
    template: `
    <div class="dbForm"><slot></slot></div>
    `
});

Vue.component('db-button', {
    props: ['width', 'height', 'url', 'title', 'cls', 'type', 'click', 'size'],
    data() {
        return {
            css: {min: '', small: '', normal: ''}
        }
    },
    methods: {
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
            self.$request(self.url).then(
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
    template: `
        <a :class="cls" class="blue href" :href="url" @click.stop="openWin" v-if="type==='open'" onclick="return !1;"><slot></slot></a>
        <a :class="cls" class="blue href" :href="url" @click.stop="requestUrl" v-else-if="type==='ajax'" onclick="return !1;"><slot></slot></a>
        <span :class="cls" class="db-button" @click.stop="$emit('click')" v-else><slot></slot></span>
    `
});

const dbMenu = {
    props: {
        'width': {
            type: String,
            default: '150px',
            validator(v) {
                return /^\d+px$/i.test(v);
            }
        },
        'color': {
            type: Object,
            validator(v) {
                return v.background && v.active;
            }
        },
        'background': {
            type: String,
            default: '#545c64',
            validator(v) {
                return /^#([a-f0-9]{3}|[a-f0-9]{6})$/i.test(v);
            }
        },
        'type': String,
        'open': {
            type: Number,
            default: -1
        },
        'menu': {
            type: Array,
            required: !0
        },
        'tabs': Object,

    },
    data() {
        return {
            cls: 'active',
            group: this.open
        }
    },
    created() {
        console.log(menu);
    },
    computed: {
        wid: function () {
            return this.width + 'px';
        }
    },
    watch: {},
    methods: {
        clkMenu(key, uri, title, sandbox) {
            if (!this.tabs) return !0;
            if (sandbox === undefined) sandbox = 1;
            if (this.tabs.keys.indexOf(key) < 0) {
                this.tabs.keys.push(key);
                this.tabs.items.push({title: title, name: key, content: this.$iframe(uri, !!sandbox)});
            }
            this.tabs.index = key;
            return !1;
        },
        requestUrl() {
            const self = this;
            self.$request(self.url).then(
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
        },
        reGroup(i) {
            this.group = i;
        }
    },
    template: `
        <div class="dbMenu unselect" :style="'width:'+width+';background-color:'+background+';'">
        <ul v-for="(m,a) in menu" class="c">
            
            <li class="dm-head" v-if="!m.item" :class="{active:tabs.index===a+''}">
                <template v-if="type==='href'">
                    <a :target="m.target" v-if="m.target" :href="m.uri">
                        <em :class="m.icon"></em>{{m.title}}
                    </a>
                    <a v-else @click="clkMenu(a+'',m.uri,m.title,m.sandbox)" onclick="return !1;" :href="m.uri" >
                        <em :class="m.icon"></em>{{m.title}}
                    </a>
                </template>
                <template v-else>
                    <span  @click="clkMenu(a+'',m.uri,m.title,m.sandbox)" >
                        <em :class="m.icon"></em>{{m.title}}
                    </span>
                </template>
            </li>
            
            <li class="dm-group-title" v-else @click="reGroup(a)"><em :class="m.icon"></em>{{m.title}}</li>
            <li class="dm-group-body" v-if="m.item" :class="{hidden:(group!==a && open>=0)}">
                <dl v-for="(t,b) in m.item">
                    <dt v-if="type==='href'" :class="{active:tabs.index===a+'_'+b}">
                        <a :target="t.target" v-if="t.target" :href="t.uri" >
                            <em :class="t.icon"></em>{{t.title}}
                        </a>
                        <a v-else @click="clkMenu(a+'_'+b,t.uri,t.title,t.sandbox)" onclick="return !1;" :href="t.uri" >
                            <em :class="t.icon"></em>{{t.title}}
                        </a>
                    </dt>
                    <dt v-else @click="clkMenu(a+'_'+b,t.uri,t.title,t.sandbox)" :class="{active:tabs.index===a+'_'+b}">
                        <em :class="t.icon"></em>{{t.title}}
                    </dt>
                </dl>
            </li>
        </ul>
        </div>
    `
};


const extendObj = {
    methods: {
        createTable(e) {
            console.log(e);
        },
    }
};

//全局混入
Vue.mixin({
    beforeCreate() {
        // require('extend/mall.js');
    },
    created: function () {
        $(".pageHead").prepend($('<div class="tools"><div class="shade"></div></div>'));
    },
    methods: {
        openWindows(e) {
            console.log(e);
        }
    },
    extends: extendObj
});
