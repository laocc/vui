;(function (win) {
    'use strict';
    let logValue = [];

    win.debug = {
        host: '',
        api: '/api/debug',
        logValue: [],
        cErr: console.error,
        init(host, api) {
            let self = this;
            this.host = host || '';
            this.api = api || '/api/debug';
            console.log = this.log;
            console.error = this.log;
            win.onbeforeunload = function (e) {
                self.send();
            };
            return this;
        },
        log(...val) {
            console.info(...val);
            logValue.push(JSON.stringify(val));
            return this;
        },
        send() {
            let client = new XMLHttpRequest();
            client.open('POST', this.host + this.api, true);
            client.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            client.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            client.send(JSON.stringify(logValue));
        }
    };

})(window);

