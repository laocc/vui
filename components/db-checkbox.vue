<template>
    <ul>
        <li v-for="(lab,key) in items" @click="clk(key)"
            v-show="lab!==undefined"
            :style="'color:'+(key.in_array(item)?color:'')">
            <em class="fa" :class="(key.in_array(item)?b:a)"></em>
            <span>{{ lab }}</span>
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
            type: [Array, String, Number],
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
            b: 'e652',
            once: (!!this.$slots.default)
        }
    },
    created() {
        if (typeof this.value === 'object') {
            this.item = this.value;
        } else {
            this.item = [this.value];
        }
        this.reItems();
    },
    computed: {
        joinValue: function () {
            if (this.type === 'int') {
                this.item.forEach((v, i) => {
                    this.item[i] = parseInt(v);
                })
            }
            if (typeof this.value === 'object') {
                return JSON.stringify(this.item)
            } else {
                return this.item.join(',');
            }
        }
    },
    watch: {
        value: function (a, b) {
            if (typeof a === 'object') {
                this.item = a;
            } else {
                this.item = [a];
            }
        },
        data: function (a, b) {
            this.reItems();
        }
    },
    methods: {
        reItems() {
            if (this.field) {
                this.items = {};
                if (this.data.constructor === Array) {
                    this.data.forEach(ds => {
                        this.items[ds[this.field]] = ds[this.label]
                    })
                } else {
                    for (let tm in this.data) {
                        // console.log(this.data[tm], this.field, this.label);
                        this.items[this.data[tm][this.field]] = this.data[tm][this.label]
                    }
                }
            } else {
                this.items = this.data;
            }
        },
        updateData(value) {
            //受理外部控制
            this.items = value;
        },
        updateValue(value) {
            //受理外部控制
            if (typeof value === 'object') {
                this.item = value;
            } else {
                this.item = [value];
            }
        },
        clk(v) {
            if (this.type === 'int') v = parseInt(v);
            let add = true;
            if (v.in_array(this.item)) {
                // this.item.splice(this.item.indexOf(v), 1);
                this.item = this.item.filter(k => k !== v);
                add = false;
            } else {
                if (this.max > 0 && this.item.length >= this.max) {
                    this.$message.error(`最多可选择${this.max}个选项`);
                    return;
                }
                add = true;
                //只有一个目标元素时，若是选中，则清空原来的数据，这只是临时变通办法，有待优化
                if (Object.keys(this.items).length === 1) this.item = [];
                this.item.push(v);
            }

            if (typeof this.value === 'object') {
                this.$emit('click', this.item, v, add);
                this.$emit('input', this.item)
            } else {
                this.$emit('click', this.item.join(','), v, add);
                this.$emit('input', this.item.join(','))
            }

        }
    }
}
</script>
