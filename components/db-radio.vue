<template>
    <div class="body">
        <ul :class="type">
            <li v-for="(lab,key) in items"
                v-show="lab!==undefined"
                @click="clickRadio(key)"
                :class="{active:key==value}">
                <template v-if="type=='radio'">
                    <div :class="'fc '+(key==value?a:b) "
                         :style="key==value? 'color:'+color : 'color:#333333' "
                    ></div>
                    <div :style="key==value?'color:'+color : 'color:#333333' ">
                        {{ lab }}
                    </div>
                </template>

                <template v-else>
                    <div :style="key==value?'color:#ffffff;background:'+color:'color:'+color">{{ lab }}</div>
                </template>
            </li>
            <li v-if="$slots.default" class="slot"><slot></slot></li>
        </ul>
        <input type="hidden" :name="name" v-model="value">
    </div>
</template>

<script>
    module.exports = {
        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            color: {
                type: String,
                default: '#00a65a'
            },
            type: {
                type: String,
                default: 'radio',
                validator: function (value) {
                    return ['radio', 'button'].indexOf(value) !== -1
                }
            },
            field: {
                type: String,
                default: ''
            },
            label: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            },
            data: {
                type: [Object, Array],
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                items: {},
                kvValue: {},
                a: 'f3a7',//选中
                b: 'f3a6'//未选
            }
        },
        watch: {
            data: function (a, b) {
                this.reItems();
            }
        },
        created() {
            this.reItems();
        },
        methods: {
            clickRadio(val) {
                this.$emit('input', val, this.kvValue[val]);
                this.$emit('click', val, this.kvValue[val]);
                this.$emit('change', val, this.kvValue[val]);
            },
            reItems() {
                this.items = {};
                this.kvValue = {};
                if (this.data.constructor === Array) {
                    if (this.field) {
                        this.data.forEach(ds => {
                            this.items[ds[this.field]] = ds[this.label];
                            this.kvValue[ds[this.field]] = ds;
                        })
                    } else {
                        this.data.forEach(ds => {
                            this.items[ds] = ds;
                            this.kvValue[ds] = ds;
                        })
                    }
                } else {
                    if (this.field) {
                        for (let tm in this.data) {
                            // console.log(this.data[tm], this.field, this.label);
                            this.items[this.data[tm][this.field]] = this.data[tm][this.label];
                            this.kvValue[this.data[tm][this.field]] = this.data[tm];
                        }
                    } else {
                        this.items = this.data;
                        this.kvValue = this.data;
                    }

                }

            }
        }
    }
</script>


<style scoped>
    div.body {
        flex: 1;
        display: flex;
        margin-left: 1px;
    }

    ul {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
    }

    ul li {
        cursor: default;
        vertical-align: middle;
        min-width: 60px;
        align-items: stretch;
        display: flex;
        justify-content: flex-start;
        border-radius: 1px;
        /*background: #ffffff;*/
        min-height: 32px;
        font-size: 14px;
    }

    ul.button li div {
        flex: 1;
        display: flex;
        justify-content: center;
        padding: 0 9px;
        height: auto;
        align-items: center;
    }

    ul.button li:last-child {
        border-right: 1px solid #ddd;
    }

    ul.button li:hover {
        background: #eee9c6;
    }

    ul.radio li:hover {
        background: #eee9c6;
    }

    li.slot {
        display: flex;
        justify-content: center;
        padding: 0 9px;
        height: auto;
        align-items: center;
        position: absolute;
        right: 0;
    }

    ul.radio li .fc {
        font-size: 22px;
    }

    ul.radio li .f3a6 {
        transition: 1s;
    }

    ul.radio li div {
        align-items: center;
        height: auto;
        display: flex;
        padding: 0 3px;
    }

    ul li.active {

    }
</style>
