<template>
    <div class="input">
        <input type="text"
               v-model="key"
               @keyup.enter="submit"
               :class="cls||pClass"
               :placeholder="placeholder"
               :required="!1"/>
        <span @click="clear" v-show="clearKey && key.length>0" class="icon fc f405"></span>
    </div>
</template>

<script>
module.exports = {
    props: {
        value: String,
        cls: String,
        placeholder: String,
        clearable: [String, Boolean, Number],
    },
    data() {
        let clear = this.clearable;
        if (clear === '') {
            clear = true;
        } else {
            clear = !!clear;
        }
        console.log('clear', clear);
        return {
            pClass: this.$vnode.data.staticClass || 'el-input__inner',
            clearKey: clear,
            key: this.value
        }
    },
    watch: {
        key: function (a, b) {
            this.$emit('input', a);
        }
    },
    methods: {
        clear() {
            this.key = '';
            this.$emit('input', '');
            this.$emit('enter', '');
        },
        submit(e) {
            // console.log(this.value);
            this.$emit('enter', '');
        }
    }
}
</script>
<style scoped>
.input {
    position: relative;
}

.icon {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 12px;
    color: #aaa;
}

.icon:hover {
    color: #000;
}
</style>
