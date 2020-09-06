const Progress = {
    object: null,
    time: 5000,//执行秒
    has: function (obj, c) {
        return new RegExp("(^|\\s+)" + c + "(\\s+|$)").test(obj.className);
    },
    add: function (obj, c) {
        obj.className = obj.className + ' ' + c;
    },
    loading: function () {
        let self = this;
        if (self.has(self.object, 'in')) return;
        self.add(self.object, 'in');
        setTimeout(function () {
            self.object.parentNode.removeChild(self.object);
        }, self.time);
    },
    star: function () {
        let self = this;
        self.object = document.createElement('div');
        self.add(self.object, 'loading');
        document.body.appendChild(self.object);

        if (document.addEventListener) {//FF,Google
            document.addEventListener('DOMContentLoaded', function () {
                document.removeEventListener('DOMContentLoaded', arguments.callee, false);
                self.loading();
            }, false);
        } else if (document.attachEvent) {//IE
            document.attachEvent('onreadytstatechange', function () {
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", arguments.callee);
                    self.loading();
                }
            });
        } else if (document.lastChild === document.body) {
            self.loading();
        }
    },
    stop: function () {

    }
};

