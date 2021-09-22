<template>
    <div class="inputBody">
        <div class="prepend" v-if="slotPrepend">
            <slot name="prepend"></slot>
        </div>
        <div class="realBody">
            <input type="text"
                   class="input"
                   v-model="key"
                   @keyup.enter="submit"
                   :class="cls||pClass"
                   :placeholder="placeholder"
                   :required="!1"/>
            <span @click="clear" v-show="clearKey && key.length>0"
                  class="icon fc f405"></span>
        </div>
        <div class="append" v-if="slotAppend">
            <slot name="append"></slot>
        </div>
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
        console.log('this.$slots:', this.$slots);


        let clear = this.clearable;
        if (clear === '') {
            clear = true;
        } else {
            clear = !!clear;
        }
        console.log('clear', clear);
        return {
            slotPrepend: Boolean(this.$slots.prepend),
            slotAppend: Boolean(this.$slots.append),
            pClass: this.$vnode.data.staticClass || 'el-input__inner',
            clearKey: clear,
            key: this.value
        }
    },
    watch: {
        value: function (a, b) {
            this.key = a;
        },
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
.inputBody {
    display: flex;
    flex-direction: row;
    background: #fff;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
}

.realBody {
    position: relative;
    flex: 1;
}

.input {
    flex: 1;
    background: transparent;
    border: 0;
}

.prepend {
    background: #F5F7FA;
    width: 105px;
}

.append {
    background: #F5F7FA;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    color: #888;
}

.prepend input {
    border: 0;
    background: #fafafa;
    padding: 0 10px;
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
