// window.$ = layui.$;

Vue.use(httpVueLoader);

Vue.use(function (Vue, options) {

    Vue.prototype.$request = function (url, data, fun) {
        let option = {url: url, action: data ? 'POST' : 'GET', ajax: false};
        if (typeof data === 'object') data = JSON.stringify(data);
        if (typeof url === 'object') Object.assign(option, url);
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
                            if (!json.error) return success(json);
                        } catch (e) {
                            json = {success: 0, message: this.response};
                        }
                    } else {
                        try {
                            json = JSON.parse(this.response || '[]');
                        } catch (e) {
                            json = {success: 0, message: this.response};
                        }
                        if (!json.message) json.message = this.statusText;
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
        console.log(typeof value, value);
        if (typeof value === "object") {
            value = value.target.innerText || JSON.stringify(value);
        }
        value.copy();
    };

});


//当前脚本所在域名
let thisHost = (typeof scriptHost !== 'undefined') ? scriptHost : String(document.scripts[document.scripts.length - 1].src).match(/^(https?:\/\/[\w\.]+)\/.+/i)[1];
// console.info('vuiHost:', thisHost);

// Vue.component('db-html', `url:${thisHost}/components/db-html.vue`);
// Vue.component('db-area', `url:${thisHost}/components/db-area.vue`);
Vue.component('db-button', `url:${thisHost}/components/db-button.vue`);
Vue.component('db-upload', `url:${thisHost}/components/db-upload.vue?3`);
Vue.component('db-paging', `url:${thisHost}/components/db-paging.vue`);
Vue.component('db-radio', `url:${thisHost}/components/db-radio.vue`);
Vue.component('db-checkbox', `url:${thisHost}/components/db-checkbox.vue`);
Vue.component('db-open', `url:${thisHost}/components/db-open.vue`);
Vue.component('db-input', `url:${thisHost}/components/db-input.vue`);
Vue.component('db-canvas', `url:${thisHost}/components/db-canvas.vue`);
Vue.component('db-thumbnail', `url:${thisHost}/components/db-thumbnail.vue`);
Vue.component('db-copy', `url:${thisHost}/components/db-copy.vue`);

Vue.config.silent = false; //静默状态，取消 Vue 所有的日志与警告。
Vue.config.productionTip = false; //不显示生产环境提示


//