// window.$ = layui.$;

Vue.use(httpVueLoader);

Vue.use(function (Vue, options) {

    Vue.prototype.$request = function (url, data, fun) {
        let option = {url: url, action: data ? 'POST' : 'GET', ajax: false};
        if (typeof data === 'object') data = JSON.stringify(data);
        if (typeof  url === 'object') Object.assign(option, url);
        // console.log(option, data, url);

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
            let f = function (v) {
                console.log(v);
            };
            call(fun['success'] || f, fun['fail'] || f);
        }
    };

    Vue.prototype.$submit = function (id, encode = '', send = true) {
        let value = {};
        let form = $(id || 'form');
        if (encode === 'json') {
            form.serializeArray().forEach(fid => {
                value[fid.name] = fid.value || '';
            });
        } else {
            value = form.serialize();
        }
        if (send === false) return {action: form.attr('action'), data: value};

        return this.$request(form.attr('action'), value);
    };

    Vue.prototype.$get = function (url, data, fun) {
        if (typeof data === 'function') {
            fun = data;
            data = null;
        }
        if (typeof data === 'object') {
            url = url.build_query(data)
        }
        return this.$request(url, null, fun);
    };

    Vue.prototype.$ajax = function (url, data, fun) {
        if (typeof data === 'function') {
            fun = data;
            data = null;
        }
        if (typeof data === 'object') {
            url = url.build_query(data)
        }
        return this.$request({url: url, ajax: true, action: 'GET'}, null, fun);
    };

    Vue.prototype.$post = function (url, data, fun) {
        return this.$request(url, data || {}, fun);
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

Vue.mixin({
    mounted() {
        if (!$('#body').hasClass('onSelfShow')) this.showBody();
    },
    methods: {
        showBody(animation) {
            let body = $('#body');
            if (body.hasClass('noAnimation')) animation = false;
            if (animation === false) {
                body.removeClass('initHidden');
            } else {
                body.addClass('initHiddenShow').removeClass('initHidden');
            }
        }
    }
});

// const fileHost = String(document.scripts[document.scripts.length - 1].src).match(/^(https?:\/\/[\w\.]+)\/.+/i)[1];

//当前脚本所在域名
if (typeof scriptHost === 'undefined') {
    // var scriptHost = String(document.scripts[document.scripts.length - 1].src).match(/^(https?:\/\/[\w\.]+)\/.+/i)[1];
}

// Vue.component('db-area', `url:${scriptHost}/vue/components/db-area.vue`);
Vue.component('db-button', `url:${scriptHost}/vue/components/db-button.vue`);
Vue.component('db-upload', `url:${scriptHost}/vue/components/db-upload.vue`);
Vue.component('db-html', `url:${scriptHost}/vue/components/db-html.vue`);
Vue.component('db-page', `url:${scriptHost}/vue/components/db-page.vue`);
Vue.component('db-radio', `url:${scriptHost}/vue/components/db-radio.vue`);
Vue.component('db-checkbox', `url:${scriptHost}/vue/components/db-checkbox.vue`);


Vue.config.silent = false; //静默状态，取消 Vue 所有的日志与警告。
Vue.config.productionTip = false; //不显示生产环境提示
Vue.filter('rnd', function (val) {
    return val / 100;
});