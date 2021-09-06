<template>
    <span class="cpspan" @click="copyA" :class="{unselect:!select}">
        <i v-if="before||label">{{ before || label }}</i><i>
        <slot></slot>
        </i><em v-if="cpText && clk && icon" :class="ico" @click.stop="copy"></em>
    </span>
</template>

<script>
module.exports = {
    name: "db-copy",
    props: {
        label: {//前置label，不被复制
            type: String,
            default: ''
        },
        before: {//前置label，不被复制
            type: String,
            default: ''
        },
        after: {
            type: String,
            default: ''
        },
        text: {//实际要复制的内容
            type: [String, Number],
            default: ''
        },
        full: {//点击整个内容就复制
            type: [Boolean, String, Number],
            default: true
        },
        icon: {//是否显示复制icon
            type: Boolean,
            default: true
        },
        select: {//文本是否允许被选择
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            ico: 'fc f3ef',
            cpText: null,
            clk: true,
        }
    },
    created() {
        this.cpText = (this.text ? this.text : this.$slots.default[0].text.trim()) + '';
    },
    updated() {
        this.cpText = (this.text ? this.text : this.$slots.default[0].text.trim()) + '';
    },
    methods: {
        copyA() {
            if (this.full || !this.icon) this.copy();
        },
        copy() {
            if (!this.cpText) return;
            this.cpText.replace(/<br>/g, "\r\n").copy((obj) => {
                this.$notify({
                    title: '复制成功',
                    message: obj,
                    type: 'success',
                    duration: 2000
                });
            });
        }
    }
}
</script>

<style scoped>
.cpspan {
    display: block;
    clear: both;
    cursor: default;
    overflow: hidden;
    padding-left: 0;
    position: relative;
}

.cpspan:hover {
    color: #2a57ff;
}

.cpspan:hover em {
    display: inline-block;
}

em {
    display: none;
    margin-left: 3px;
    color: #2a57ff;
}

em:hover {
    color: #ff2300;
}

i {
    display: inline;
}


</style>