// import 'extend/mall.js';
window.$ = layui.$;

Vue.use(httpVueLoader);

Vue.use(function (Vue, options) {

    Vue.prototype.$request = function (url, data, fun) {
        let option = {url: url, action: data ? 'POST' : 'GET', ajax: false};
        if (typeof data === 'object') data = JSON.stringify(data);
        if (typeof  url === 'object') Object.assign(option, url);
        console.log(option, data, url);

        let call = function (success, fail) {
            let client = new XMLHttpRequest();
            client.open(option.action, option.url);
            client.setRequestHeader("Accept", "application/json");
            if (option.ajax) client.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            client.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            client.send(data);
            client.onreadystatechange = function () {
                if (this.readyState === 4) {
                    let json;
                    if (this.status === 200) {
                        try {
                            json = JSON.parse(this.response || '[]');
                            if (json.success) return success(json);
                        } catch (e) {
                            json = {success: 0, message: this.response};
                        }
                    } else {
                        json = {success: 0, message: this.statusText};
                    }
                    fail(json);
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

    Vue.prototype.$ajax = function (url, fun) {
        return this.$request({url: url, ajax: true, action: 'GET'}, null, fun);
    };

    Vue.prototype.$post = function (url, data) {
        return this.$request(url, data || {});
    };

    Vue.prototype.$iframe = function (src, sandbox) {
        //只要没有明确要求sandbox，则都不加
        if (sandbox !== !0) return `<iframe src="${src}" frameborder="0"/>`;
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

const docS = document.scripts;
const currentPath = docS[docS.length - 1].src.substring(0, docS[docS.length - 1].src.lastIndexOf("/"));


Vue.component('db-form', {
    props: [],
    data() {
        return {msg: ''}
    },
    template: `
    <div class="dbForm"><slot></slot></div>
    `
});


Vue.component('db-area', `url:${currentPath}/components/area.vue`);
Vue.component('db-button', `url:${currentPath}/components/db-button.vue`);


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
        // $(".pageHead").prepend($('<div class="tools"><div class="shade"></div></div>'));
    },
    methods: {
        openWindows(e) {
            console.log(e);
        }
    },
    extends: extendObj
});

Vue.config.silent = false; //静默状态，取消 Vue 所有的日志与警告。
Vue.config.productionTip = false; //不显示生产环境提示
Vue.filter('rnd', function (val) {
    return val / 100;
});