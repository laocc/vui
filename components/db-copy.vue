<template>
    <span class="cpspan" @click="copyA" :class="{unselect:!select}">
        <em v-if="label && clk && icon && direction==='left'" :class="ico" @click.stop="copy"></em><i>
        <slot></slot>
        </i><em v-if="label && clk && icon && direction==='right'" :class="ico" @click.stop="copy"></em>
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
            direction: {
                type: String,
                default: 'right'
            },
            text: {
                type: [String, Number],
                default: ''
            },
            full: {
                type: [Boolean, String, Number],
                default: true
            },
            icon: {
                type: Boolean,
                default: true
            },
            select: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                ico: 'fc f3ef',
                label: null,
                clk: true,
            }
        },
        created() {
            this.label = (this.text ? this.text : this.$slots.default[0].text.trim()) + '';
        },
        updated() {
            this.label = (this.text ? this.text : this.$slots.default[0].text.trim()) + '';
        },
        methods: {
            copyA() {
                let isHand = 0;//this.$el.classList.has('hand');
                if (this.full || isHand || !this.icon) this.copy();
            },
            copy() {
                if (!this.label) return;
                let txt = this.before + (this.label.replace(/<br>/g, "\r\n")) + this.after;
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
        margin-left: 3px;
        color: #2a57ff;
    }

    em:hover {
        color: #ff2300;
    }

    .cpspan {
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

    i {
        display: inline;
    }


</style>