// import 'extend/mall.js';


Vue.use(function (Vue, options) {
    Vue.prototype.request = function (url, data, fun) {
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

        if (fun) {
            call(fun, fun);
        } else {
            return new Promise(function (success, fail) {
                call(success, fail);
            });
        }
    };

    Vue.prototype.get = function (url, fun) {
        return this.request(url, null, fun);
    };

    Vue.prototype.post = function (url, data) {
        return this.request(url, data);
    };

    Vue.prototype.iframe = function (src) {
        let box = 'allow-scripts allow-top-navigation allow-same-origin allow-forms';
        return `<iframe src="${src}" frameborder="0" sandbox="${box}"/>`;
    };

    Vue.prototype.format = function (txt, pnt) {

        txt.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g, function () {
            console.log(arguments);
        });

        return txt;
    };

    Vue.prototype.copy = function (value) {
        console.log(typeof value);
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        value.copy();
    };

    //大白的快应用
    Vue.prototype.isDaBaiApp = function (ua) {
        return /\.(dabai|linghu)/i.test(ua || window.navigator.userAgent);
    };
});

function require(file) {
    const path = document.currentScript.src.substr(0, document.currentScript.src.lastIndexOf("/") + 1);
    const ref = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    script.src = path + file;
    script.async = true;
    script.type = 'module';
    ref.parentNode.insertBefore(script, ref);
    script.onload = function () {
        // console.log('自动加载', path + file);
    }
}

// import 'extend/mall.js';

const extendObj = {
    methods: {
        createTable(e) {
            console.log(e);
        },
    }
};

Vue.component('db-button', {
    props: ['width', 'height', 'url', 'title', 'cls', 'type'],
    data() {
        return {
            dialogVisible: false
        }
    },
    created() {
        const dialog = document.createElement('div');
        dialog.id = 'db-dialog';
        dialog.className = 'db-dialog';
        let css = [];
        css.append('display:none');
        css.append('position:absolute');
        css.append('left:50%;top:50%');
        css.append('margin-top: -150px');
        css.append('margin-left: -200px');
        css.append('width: 400px');
        css.append('height: 400px');
        css.append('padding: 5px');
        dialog.setAttribute("style", css.join(';'));

        document.getElementsByTagName('body')[0].appendChild(dialog);
    },
    methods: {
        openWin(e) {
            console.log(e);
            this.dialogVisible = true;
            // let option = {};
            // option.title = this.title || '';
            // option.message = this.iframe(this.url);
            // option.dangerouslyUseHTMLString = true;
            // option.cancel = function () {
            //
            // };
            // this.$msgbox(option);
        },
        requestUrl() {
            const self = this;
            self.request(self.url).then(
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
        <a :class="cls" class="blue" @click="openWin" v-if="type==='open'"><slot></slot></a>
        <a :class="cls" class="blue" @click="requestUrl" v-else-if="type==='ajax'"><slot></slot></a>
    `
});

//全局混入
Vue.mixin({
    beforeCreate() {
        // require('extend/mall.js');
    },
    created: function () {
        $(".pageHead").prepend($('<div class="tools"><div class="shade"></div></div>'));
        // $("button.openwin").attr('v-on:click.stop', 'openWindows');
        // $("db-button").each(e => {
        //     console.log(e);
        // });
    },
    methods: {
        openWindows(e) {
            console.log(e);
        }
    },
    extends: extendObj
});
