<template>
    <div xmlns:v-slot="http://www.w3.org/1999/XSL/Transform"
         xmlns:v-html="http://www.w3.org/1999/XSL/Transform">

        <el-drawer
            v-if="option.type==='drawer'"
            :visible.sync="show"
            :title="option.title"
            :with-header="option.title!==false"
            :size="option.size"
            :wrapper-closable="wrapperClosable"
            :direction="option.dir">
            <template v-slot:title>
                <span>{{ option.title }}</span>
            </template>
            <div v-html="option.src"></div>
        </el-drawer>

        <el-dialog
            v-if="option.type==='dialog' || option.type==='open'"
            :title="option.title"
            :visible.sync="show"
            :before-close="before"
            :destroy-on-close="true">
            <div style="display:flex;flex:1;" v-html="option.src"></div>
            <div slot="footer" class="dialog-footer" v-if="option.btn && (option.btn.yes || option.btn.no)">
                <el-button @click="close" v-if="option.btn.no">{{ option.btn.no }}</el-button>
                <el-button type="primary" @click="submit" v-if="option.btn.yes">{{ option.btn.yes }}</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
module.exports = {
    props: {
        type: {
            type: String,
            default: ''
        },
        value: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    watch: {
        show: function (a, b) {
            if (a === false) {
                Object.assign(this.value, {show: false})
            }
        },
        value: {
            deep: true,
            handler: function (a, b) {
                /**
                 * 这个值，在页面中是：openOption
                 * 而这个值的内容是在db-button中组合的
                 */
                // console.log('openOption:', a, b);
                this.option = a;
                this.show = a.show;
                this.wrapperClosable = true;
            }
        }
    },
    data() {
        return {
            show: false,
            wrapperClosable: true,
            option: {}
        }
    },
    updated() {
        if (this.type === 'dialog') {
            let w = parseInt(this.option.width), h = parseInt(this.option.height || 0);
            if (h === 0) h = w * 0.75;
            $('.el-dialog').css({width: `${w}px`, height: `${h}px`});
            console.log(w, h);
        }
    },
    computed: {},
    methods: {
        fixedOpen(val) {
            this.wrapperClosable = val;//点击遮罩层是否允许关闭，false=不允许
        },
        display(attrs) {
            console.log('open attrs:', attrs);
            let type = attrs.type.value;

            let url = '';
            if (attrs.href) url = attrs.href.value;
            else if (attrs.url) url = attrs.url.value;
            else if (attrs.api) url = attrs.api.value;
            if (typeof url === 'object') url = url.shift().sprintf(...url);

            let btn = '确定';
            let width = 600, height = 0;
            if (attrs.width) width = parseInt(attrs.width.value);
            if (attrs.height) height = parseInt(attrs.height.value);
            if (!height) height = width * 0.6;

            let title = '';
            if (attrs.title) title = (attrs.title.value);
            if (title === 'false') title = false;

            let option = {};
            option.show = true;
            option.btn = false;
            option.type = type;
            option.width = width;
            option.height = height;
            option.title = title;
            option.src = this.$iframe(`${url}#` + ((new Date()).valueOf()), !1);

            if (attrs.btns) {
                console.log(attrs);

                if (typeof attrs.btns.value === 'string') {
                    option.btn = {yes: attrs.btns.value, no: false};
                } else if (typeof attrs.btns.value === 'object') {
                    option.btn = {yes: attrs.btns.value[0], no: attrs.btns.value[1] || false};
                }
            }
            console.log(option);
            this.option = option;
            this.show = true;
        },
        before() {
            console.log('before');
            this.show = false;
        },
        open() {
            console.log('open');
        },
        close() {
            console.log('close');
            this.show = false;
        },
        submit() {
            console.log('submit');
            this.show = false;
        },
    }
}
</script>

<style scoped>
.el-dialog__wrapper {
    flex: 1;
    display: flex;
}

.el-dialog__wrapper .el-dialog {
    display: flex;
    flex-direction: column;
}

.el-dialog__wrapper .el-dialog .el-dialog__body {
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
    flex: 1;
}

.el-dialog__wrapper .el-dialog .el-dialog__body .el-form {
    display: flex;
}

.el-dialog__wrapper .el-dialog .el-dialog__body .el-form .el-form-item {
    flex: 2;
}

.el-dialog__wrapper .el-dialog .el-dialog__body iframe {
    flex: 1;
}
</style>