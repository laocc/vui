<template>
    <div>
        dadadf
    </div>

</template>

<script>
    module.exports = {
        props: {
            sku: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                setup: {},
                realValue: {},
                value: {},
                array: {},
                css: {code: {}, price: {}, stock: {}},
            }
        },
        created() {

        },
        computed: {
            getSkuValue() {
                return JSON.stringify({setup: this.setup, value: this.value, array: this.array});
            }
        },
        methods: {
            realSkuArray(lev) {
                if (typeof lev !== "number") lev = this.setup.level;
                let array = [];
                let value = {};
                let oldVal = this.value[lev] || {};
                // console.log('oldVal', lev, oldVal, this.value);
                let fst = (this.setup.value[1] || '').split(',');
                let ful = function (val) {
                    return !$.isEmptyObject(val);
                };

                fst.forEach((a, ia) => {
                    if (!a.trim()) return;
                    value[a] = {};
                    if (this.setup.level === 1) {
                        value[a] = {id: 0, code: '', price: 0, stock: 0, picture: '', weight: 0};
                        if (ful(oldVal[a])) Object.assign(value[a], oldVal[a]);
                        array.push({id: ia, val: value[a], old: oldVal[a]});
                    }

                    if (this.setup.level > 1) {
                        let scd = (this.setup.value[2] || '').split(',');
                        scd.forEach((b, ib) => {
                            if (!b.trim()) return;
                            value[a][b] = {};
                            if (this.setup.level === 2) {
                                value[a][b] = {id: 0, code: '', price: 0, stock: 0, picture: '', weight: 0};
                                if (ful(oldVal[a]) && ful(oldVal[a][b])) {
                                    value[a][b] = oldVal[a][b];
                                    array.push({id: `${ia}_${ib}`, val: value[a][b]})
                                }
                            }
                            if (this.setup.level > 2) {
                                let thd = (this.setup.value[3] || '').split(',');
                                thd.forEach((c, ic) => {
                                    if (!c.trim()) return;
                                    value[a][b][c] = {id: 0, code: '', price: 0, stock: 0, picture: '', weight: 0};
                                    if (ful(oldVal[a]) && ful(oldVal[a][b]) && ful(oldVal[a][b][c])) {
                                        value[a][b][c] = oldVal[a][b][c];
                                        array.push({id: `${ia}_${ib}_${ic}`, val: value[a][b][c]});
                                    }
                                });
                            }
                        });
                    }
                });
                this.value[lev] = value;
                this.array = array;
                // console.table(value);
                this.chkSku();
            },
            chkSku() {
                const self = this;
                self.css = {code: {}, price: {}, stock: {}};
                let code = [];
                let warn = 'background:red;color:#fff;';
                // console.table(this.array.json('val', 'old'));
                this.array.forEach(sku => {
                    if (sku.val.price.length > 0 && isNaN(sku.val.price)) {
                        self.css.price[sku.id] = warn;
                    }
                    if (sku.val.stock.length > 0 && isNaN(sku.val.stock)) {
                        self.css.stock[sku.id] = warn;
                    }
                    let c = sku.val.code.trim();
                    if (c.length === 0) return;
                    if (c.in_array(code)) {
                        self.css.code[sku.id] = warn;
                    }
                    code.push(c);
                });
                // console.table(code.json());
                // console.table(this.css);
            }
        },

        watch: {
            'sku': function (val, e) {
                console.log('formatSKU:', val);
                this.setup = val.setup;
                this.realValue = val.value;
                this.value = val.value;
                this.array = val.array;

                this.realSkuArray(this.setup.level);
            },
            'setup.level': function (a, b) {
                this.realSkuArray(a);
            },
            'setup.value': function (a, b) {
                for (let i = 1; i <= this.setup.level; i++) {
                    this.setup.value[i] = (this.setup.value[i] || '').replace('，', ',').replace(' ', ',').replace('-', '_');
                }
            },
            'inFocus': function (a, b) {
                if (!a) this.realSkuArray(this.setup.level);
            }
        }
    }
</script>

<style scoped>

</style>