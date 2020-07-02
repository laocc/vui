!function (win) {
    "use strict";
    win.dbVersion = '1.0.0';

    win.$db = {
        db: null,
        dbName: null,
        tableName: null,
        open(dbName) {
            this.dbName = dbName;
            let request = window.indexedDB.open(dbName);
            request.onerror = function (event) {
                console.log('数据库打开报错');
            };
            request.onsuccess = function (event) {
                this.db = request.result;
                console.log('数据库打开成功');
            };

            request.onupgradeneeded = function (event) {
                //如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded。
                this.db = event.target.result;
                console.log('数据库创建成功', event);
            };
            return this;
        },
        table(tableName) {
            this.tableName = tableName;
            if (!this.db.objectStoreNames.contains(tableName)) {
                this.db.createObjectStore(tableName, {autoIncrement: true});
            }
        },
        get(key) {
            console.log('db.get:', key);
            var transaction = this.db.transaction(['person']);
            var objectStore = transaction.objectStore('person');
            var request = objectStore.get(key);

            request.onerror = function (event) {
                console.log('事务失败');
            };

            request.onsuccess = function (event) {
                if (request.result) {
                    console.log('Name: ' + request.result.name);
                    console.log('Age: ' + request.result.age);
                    console.log('Email: ' + request.result.email);
                } else {
                    console.log('未获得数据记录');
                }
            };

        },
        set(key, value) {
            console.log(key, value)
        },
        delete(key) {

        },
        each() {

        }
    };
}(window);