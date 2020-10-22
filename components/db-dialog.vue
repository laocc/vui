<template>

    <el-dialog
            :title="title"
            :visible.sync="value"
            :before-close="before"
            :destroy-on-close="true"
    >
        <div class="iframe" v-if="message">{{message}}</div>
        <iframe :src="url" v-else frameborder="0"></iframe>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    module.exports = {
        props: {
            option: {
                type: Object,
                default() {
                    return {};
                }
            },
            value: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            option: function (opt, b) {
                // this.displayDialog = Boolean(a);
                this.title = opt.title;
                this.url = opt.url;
                this.message = opt.message;
                this.width = opt.width;
                this.height = opt.height;
            }
        },
        data() {
            return {
                displayDialog: false,
                url: '',
                title: '',
                message: '',
                width: '',
                height: '',
            }
        },
        updated() {
            let w = parseInt(this.width), h = parseInt(this.height);
            if (h === 0) h = w * 0.75;
            $('.el-dialog').css({width: `${w}px`, height: `${h}px`});
        },
        computed: {},
        methods: {
            before() {
                console.log('before');
                // this.displayDialog = false;
                this.$emit('input', false);
            },
            open() {
                console.log('open');
            },
            close() {
                console.log('close');
                // this.displayDialog = false;
                this.$emit('input', false);
            },
            submit() {
                console.log('submit');
                // this.displayDialog = false;
                this.$emit('input', false);
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