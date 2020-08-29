<template>
    <div class="kindeditor">
        <textarea class="form-control" ref="kindeditor" v-model="localValue" name="content"
                  v-loaded-callback='initKindeditor'></textarea>
    </div>
</template>

<!--<script src=""></script>-->
<script >
    Vue.directive('loaded-callback', {
        inserted: function (el, binding, vnode) {
            binding.value(el, binding, vnode)
        }
    });

    // const scriptHost = String(document.scripts[document.scripts.length - 1].src).match(/^(https?:\/\/[\w\.]+)\/.+/i)[1];

    // httpVueLoader.load('http://debug.vue.com/node_modules/kindeditor/kindeditor-all.js');

    // import scriptHost +'../../node_modules/kindeditor/kindeditor-all.js'
    import '../../node_modules/test.js'
    // import 'http://debug.vue.com/node_modules/kindeditor/kindeditor-all.js'
    // import 'http://debug.vue.com/node_modules/kindeditor/lang/zh-CN.js'
    // import 'http://debug.vue.com/node_modules/kindeditor/themes/default/default.css'

    module.exports = {
        props: ['options', 'value'],
        data() {
            return {
                localValue: ''
            }
        },
        watch: {
            localValue: 'updateValue',
            value: 'setDefault'
        },
        created() {
            this.setDefault()
        },
        methods: {
            initKindeditor() {
                let _this = this;
                // 默认参数
                let options = {
                    uploadJson: 'upload/image',
                    width: '100%',
                    afterChange() {
                        _this.localValue = this.html()
                    }
                };
                // 调用外部参数
                if (_this.options) {
                    for (let i in _this.options) {
                        options[i] = _this.options[i]
                    }
                }
                KindEditor.create(_this.$refs.kindeditor, options);
            },
            // 设置初始值
            setDefault() {
                this.localValue = this.value
            },
            // 修改父件的值
            updateValue() {
                this.$emit('input', this.localValue)
            }
        }
    }
</script>


<style scoped>

</style>