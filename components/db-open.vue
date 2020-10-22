<template>
    <div xmlns:v-slot="http://www.w3.org/1999/XSL/Transform"
         xmlns:v-html="http://www.w3.org/1999/XSL/Transform">

        <el-drawer
                v-if="option.type==='drawer'"
                :visible.sync="show"
                :title="option.title"
                :with-header="option.title!==false"
                :size="option.size"
                :direction="option.dir">
            <template v-slot:title>
                <span>{{option.title}}</span>
            </template>
            <div v-html="option.src"></div>
        </el-drawer>

        <el-dialog
                v-if="option.type==='dialog' || option.type==='open'"
                :title="option.title"
                :visible.sync="show"
                :before-close="before"
                :destroy-on-close="true">
            <div style="display: flex;flex:1;" v-html="option.src"></div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
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
                    console.log('openOption:', a);
                    this.option = a;
                    this.show = a.show;
                }
            }
        },
        data() {
            return {
                show: false,
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