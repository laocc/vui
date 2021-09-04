<template>
    <span @click="copyA" class="unselect">
        <slot></slot><em v-if="text && clk" class="fc f41b" @click="copy"></em>
    </span>
</template>

<script>
    module.exports = {
        name: "db-copy",
        props: {
            before: {
                type: String,
                default: ''
            },
            after: {
                type: String,
                default: ''
            },
            full: {
                type: [Boolean, String, Number],
                default: true
            },
        },
        data() {
            return {
                text: null,
                clk: true,
            }
        },
        created() {
            // var fontSize = this.$el.style.fontSize;
            // console.log('copy', this);
            // console.log(this.$vnode);
            // console.log(this);

            this.text = this.$slots.default[0].text.trim();
        },
        methods: {
            copyA() {
                let isHand = 0;//this.$el.classList.has('hand');
                if (this.full || isHand) this.copy();
            },
            copy() {
                if (!this.text) return;
                let txt = this.before + this.text + this.after;
                txt.copy((obj) => {
                    this.$notify({
                        title: '复制成功',
                        message: txt,
                        type: 'success',
                        duration: 2000
                    });
                    // this.clk = false;
                    // console.log('复制成功', val, obj);
                });
            }
        }
    }
</script>

<style scoped>
    em {
        display: none;
        margin-left: 5px;
        color: #2a57ff;
        font-size: 16px;
    }

    em:hover {
        color: red;
    }

    span {
        cursor: default;
        /*padding-right: 20px;*/
    }

    span:hover em {
        display: inline-block;
    }
</style>