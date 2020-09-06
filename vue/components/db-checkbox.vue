<template>
    <ul>
        <li v-for="(lab,key) in items" @click="clk(key)"
            :style="'color:'+(key.in_array(item)?color:'')">
            <em :class="'fa '+(key.in_array(item)?b:a)"></em>
            <span>{{lab}}</span>
        </li>
        <input type="hidden" :name="name" :value="joinValue">
    </ul>
</template>

<style scoped>
    ul {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
    }

    ul li {
        padding: 5px 16px 5px 6px;
        cursor: pointer;
        vertical-align: middle;
        text-align: center;
        align-items: center;
        display: flex;
        justify-content: center;
        border-radius: 1px;
        background: #ffffff;
        min-height: 32px;
        font-size: 14px;
    }

    ul li:hover {
        background: #f0f0f0;
    }

    em {
        font-size: 16px;
        border: 0;
        border-radius: 0;
    }

    span {
        margin-left: 5px;

    }

</style>

<script>
    module.exports = {
        props: {
            value: {
                type: Array,
                default() {
                    return []
                }
            },
            color: {
                type: String,
                default: '#00a65a'
            },
            type: {//值数据类型
                type: String,
                default: 'string'
            },
            field: {
                type: String,
                default: ''
            },
            label: {
                type: String,
                default: ''
            },
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 0
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
                item: [],
                a: 'e651',
                b: 'e652'
            }
        },
        created() {
            this.item = this.value;
            if (this.field) {
                this.data.forEach(ds => {
                    this.items[ds[this.field]] = ds[this.label]
                })
            } else {
                this.items = this.data;
            }
        },
        computed: {
            joinValue: function () {
                if (this.type === 'int') {
                    this.item.forEach((v, i) => {
                        this.item[i] = parseInt(v);
                    })
                }

                return JSON.stringify(this.item)
            }
        },
        watch: {
            value: function (a, b) {
                this.item = a;
            }
        },
        methods: {
            updateData(value) {
                //受理外部控制
                this.items = value;
            },
            updateValue(value) {
                //受理外部控制
                this.item = value;
            },
            clk(v) {
                if (this.type === 'int') v = parseInt(v);
                if (v.in_array(this.item)) {

                    // this.item.splice(this.item.indexOf(v), 1);
                    this.item = this.item.filter(k => k !== v);

                    this.$emit('click', this.item, v, false)
                } else {
                    if (this.max > 0 && this.item.length >= this.max) {
                        this.$message.error(`最多可选择${this.max}个选项`);
                        return;
                    }
                    this.item.push(v);
                    this.$emit('click', this.item, v, true)
                }

                this.$emit('input', this.item)

            }
        }
    }
</script>
