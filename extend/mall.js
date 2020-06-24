// let myMixin = require('./test');
const extendObj = {
    updated: function () {
        console.log('我是扩展的Update')
    },
    methods: {
        //如果方法名一样 他只触发构造器里的方法 扩展不触发 混入选项也一样
        add: function () {
            // this.num++;
            console.log('我是扩展出来的方法')
        },
        createTable(e) {
            console.log(e);
        },
    }
};
// export default extendObj;

export default {
    extendObj
}