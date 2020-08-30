<template>
    <div class="body" :style="'overflow-y:scroll;height:'+ divHei">

        <div class="unitAll" v-show="unitShow">
            <template v-for="u in unit">
                <db-button
                        :class="'btn '+ (setup.unit===u?'danger':'primary')"
                        @click="reUnit(u)"
                        :key="u">{{u}}
                </db-button>
            </template>
        </div>

        <div class="setting">
            <div class="lab">SKU层级</div>
            <div class="setup">
                <div class="select">
                    <select v-model="setup.level">
                        <option :value="1">1级</option>
                        <option :value="2">2级</option>
                        <option :value="3">3级</option>
                    </select>
                </div>
            </div>
            <div class="lab">计价单位</div>
            <div class="setup">
                <db-button class="units" @click="showUnit">{{setup.unit}}</db-button>
            </div>

        </div>

        <div class="labels" v-for="l in setup.level*1">
            <input type="tel" class="lab txt" v-model="setup.label[l]">
            <input type="tel" class="val txt" @focus="inFocus=true" @blur="inFocus=false" v-model="setup.value[l]">
        </div>

        <div class="notes">
            销售订单中以销售时SKU显示的名称为准，库存核减时以自编号为准，所以，当SKU自编号确定后，不要轻易修改自编号。<br>
            自编号和价格为空或=0的不显示；非虚拟商品时库存为空或=0的显示但不能购买，虚拟商品可以不填写库存<br>
            两级SKU在前端显示效果可能更佳，若非特别需要，不建议用三级SKU。
        </div>


        <div class="tr head">
            <div class="a">SKU名称</div>
            <div class="b">自编号</div>
            <div class="c">价格</div>
            <div class="d">库存</div>
            <div class="f">单件重量(克)</div>
            <div class="e">图片</div>
            <div class="f"></div>
        </div>


        <div class="tr" v-show="setup.level===1" v-for="(first,ia,i) in value[1]">
            <div class="a sku"><span>{{ia}}</span></div>
            <div class="b">
                <input type="tel" class="txt" @blur="realSkuArray" :style="css.code[i]||''" v-model="first.code">
            </div>
            <div class="c">
                <input type="tel" class="txt" @blur="realSkuArray" :style="css.price[i]||''" v-model="first.price">
            </div>
            <div class="d">
                <input type="tel" class="txt" @blur="realSkuArray" :style="css.stock[i]||''" v-model="first.stock">
            </div>
            <div class="f">
                <input type="tel" class="txt" v-model="first.weight"></div>
            <div class="e">
                <img :src="host+(first.picture||'/null.png')">
            </div>
            <div class="f">
                <db-upload api="/api/upload"
                           style="float:left;"
                           @success="uploadTrue"
                           :option="{level:1,a:ia}"
                           :data="{type:'sku'}">上传
                </db-upload>
            </div>
        </div>

        <div v-show="setup.level===2" v-for="(first,ia,i) in value[2]">
            <div class="tr" v-for="(second,ib,j) in first">
                <div class="a sku"><span :class="j===0?'':'h'">{{ia}}</span><span>{{ib}}</span></div>
                <div class="b">
                    <input type="tel" class="txt" @blur="realSkuArray" :style="css.code[`${i}_${j}`]"
                           v-model="second.code">
                </div>
                <div class="c">
                    <input type="tel" class="txt" @blur="realSkuArray" :style="css.price[`${i}`]"
                           v-model="second.price">
                </div>
                <div class="d">
                    <input type="tel" class="txt" @blur="realSkuArray" :style="css.stock[`${i}`]"
                           v-model="second.stock">
                </div>
                <div class="f">
                    <input type="tel" class="txt" v-model="second.weight"></div>
                <div class="e">
                    <img :src="host+(second.picture||'/null.png')">
                </div>
                <div class="f">
                    <db-upload api="/api/upload"
                               style="float:left;"
                               @success="uploadTrue"
                               :option="{level:2,a:ia,b:ib}"
                               :data="{type:'sku'}">上传
                    </db-upload>
                </div>
            </div>
        </div>

        <div v-show="setup.level===3" v-for="(first,ia,x) in value[3]">
            <div v-for="(second,ib,y) in first">
                <div class="tr" v-for="(third,ic,z) in second">
                    <div class="a sku">
                        <span :class="z===0 && y===0?'':'h'">{{ia}}</span>
                        <span :class="z===0?'':'h'">{{ib}}</span>
                        <span>{{ic}}</span></div>
                    <div class="b">
                        <input type="tel" class="txt" @blur="realSkuArray" :style="css.code[`${x}_${y}_${z}`]"
                               v-model="third.code">
                    </div>
                    <div class="c">
                        <input type="tel" class="txt" @blur="realSkuArray" :style="css.price[`${x}`]"
                               v-model="third.price">
                    </div>
                    <div class="d">
                        <input type="tel" class="txt" @blur="realSkuArray" :style="css.stock[`${x}`]"
                               v-model="third.stock">
                    </div>
                    <div class="e">
                        <img :src="host+(third.picture||'/null.png')">
                    </div>
                    <div class="f">
                        <db-upload api="/api/upload"
                                   style="float:left;"
                                   @success="uploadTrue"
                                   :option="{level:3,a:ia,b:ib,c:ic}"
                                   :data="{type:'sku'}">上传
                        </db-upload>
                    </div>
                </div>
            </div>
        </div>

        <input type="hidden" :name="name" :value='getSkuValue'>
    </div>

</template>

<script>

    module.exports = {
        props: {
            sku: {
                type: Object,
                default: {}
            },
            height: {
                type: [String, Number],
                default: 500
            },
            name: {
                type: String,
                default: 'sku'
            },
            host: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                unit: ['份', '件', '套', '公斤', '斤', '吨', '克', '两', '位',
                    '年', '月', '周', '天', '小时', '分钟', '张', '片',
                    '碗', '只', '双', '台', '部', '次', '疗程', '人'],
                setup: {},
                realValue: {},
                value: {},
                checkValue: {},
                css: {code: {}, price: {}, stock: {}},
                inFocus: false,
                unitShow: false,

            }
        },
        created() {
            console.log('formatSKU:', this.sku);

            if (!this.sku.value) this.sku.value = {};
            if (!this.sku.value[1]) this.sku.value[1] = {};
            if (!this.sku.value[2]) this.sku.value[2] = {};
            if (!this.sku.value[3]) this.sku.value[3] = {};

            this.setup = this.sku.setup;
            this.realValue = this.sku.value;
            this.value = this.sku.value;
            this.checkValue = this.sku.array || []; //将sku级别按下标ID组合成一维数组，用于重复code/price/stock检查，外部整时sku时用到

            if (!this.setup.unit) this.setup.unit = '件';

            this.realSkuArray(this.setup.level);
        },
        computed: {
            getSkuValue() {
                return JSON.stringify({
                    setup: this.setup,
                    value: this.value,
                    array: this.checkValue,
                });
            },
            divHei() {
                let h = parseInt(this.height);
                return `${h}px;`;
            }
        },
        methods: {
            uploadTrue(option, data) {
                //{level:2,a:i,b:j}
                //{"success":1,"message":"ok","data":
                // {"url":"http:\/\/pic.mall.com\/sku\/20200830160606170.jpeg","path":"\/sku\/20200830160606170.jpeg","type":"image\/jpeg","size":56274}}
                console.log(option, data);
                console.log(this.value);
                if (option.level === 1) {
                    this.value[option.level][option.a].picture = data.data.path;
                } else if (option.level === 2) {
                    this.value[option.level][option.a][option.b].picture = data.data.path;
                } else {
                    this.value[option.level][option.a][option.b][option.c].picture = data.data.path;
                }
            },
            showUnit() {
                this.unitShow = !this.unitShow;
            },
            reUnit(u) {
                // console.log(this.setup);
                this.setup.unit = u;
                this.unitShow = false;
            },
            realSkuArray(lev) {
                if (typeof lev !== "number") lev = this.setup.level;
                let checkValue = [];
                let value = {};
                let oldVal = this.value[lev] || {};
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
                        checkValue.push({id: ia, val: value[a], old: oldVal[a]});
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
                                    checkValue.push({id: `${ia}_${ib}`, val: value[a][b]});
                                }
                            } else if (this.setup.level > 2) {
                                let thd = (this.setup.value[3] || '').split(',');
                                thd.forEach((c, ic) => {
                                    if (!c.trim()) return;
                                    value[a][b][c] = {id: 0, code: '', price: 0, stock: 0, picture: '', weight: 0};
                                    if (ful(oldVal[a]) && ful(oldVal[a][b]) && ful(oldVal[a][b][c])) {
                                        value[a][b][c] = oldVal[a][b][c];
                                        checkValue.push({id: `${ia}_${ib}_${ic}`, val: value[a][b][c]});
                                    }
                                });
                            }
                        });
                    }
                });
                this.value[lev] = value;
                this.checkValue = checkValue;
                this.chkSku();
            },
            chkSku() {
                const self = this;
                self.css = {code: {}, price: {}, stock: {}};
                let code = [];
                let warn = 'background:red;color:#fff;';
                this.checkValue.forEach(sku => {
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
            }
        },

        watch: {
            'sku': function (val, e) {
                console.log('formatSKU:', val);
                this.setup = val.setup;
                if (!this.setup.unit) this.setup.unit = '件';
                this.realValue = val.value;
                this.value = val.value;
                this.checkValue = val.array || [];

                this.realSkuArray(this.setup.level);
            },
            'setup.unit': function (a, b) {
                // this.realSkuArray(a);
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

    .body {
        background: #eeeeee;
    }

    input.txt {
        display: block;
        width: 100%;
        /*padding-left: 10px;*/
        height: 38px;
        text-indent: 10px;
        line-height: 1.3;
        line-height: 38px \9;
        border: 1px solid #aaa;
        background-color: #fff;
        border-radius: 2px;
    }

    .units {
        margin: 5px;
        padding: 5px 20px;
        background: #1055a6;
        color: #fff;
        border-radius: 3px;
        cursor: default;
    }

    .units:hover {
        background: #2696a6;
    }

    .setting {
        display: flex;
        height: 38px;
        margin: 2px;
    }

    .setting .lab {
        flex: 1;
        /*padding-left: 10px;*/
        text-align: center;
        line-height: 38px;
        background: #51a273;
        color: #fff;
        padding: 1px 5px;
        width: 80px;
    }

    .setting .setup {
        flex: 6;
        display: flex;
        margin-left: 1px;
    }

    select {
        display: block;
        flex: 1;
        border: 0;
    }

    .setting .setup .select {
        height: 38px;
        line-height: 1.3;
        line-height: 38px \9;
        border: 1px solid #eee;
        flex: 1;
        display: flex;
    }

    .setting .setup .option {
        flex: 5;
        line-height: 38px;
        text-indent: 5px;
    }

    .labels {
        display: flex;
        margin: 2px;
    }

    .labels .lab {
        flex: 1;
        /*border: 1px solid #ddd;*/
    }

    .labels .val {
        flex: 8;
        /*border: 1px solid #ddd;*/
        margin-left: -1px;
    }

    .sku td {
        padding: 2px;
    }

    .sku img {
        width: 32px;
        height: 32px;
    }

    div.head {
        background: #51a273;
        color: #fff;
    }

    div.tr {
        display: flex;
        justify-content: space-between;
    }

    div.tr div {
        padding: 2px;
        border-bottom: 1px solid #d2d2d2;
        border-left: 1px solid #d2d2d2;
    }

    div.tr div.a {
        flex: 4;
        text-align: center;
    }

    div.tr .b {
        flex: 3;
    }

    div.tr .c {
        flex: 2;
    }

    div.tr .d {
        flex: 2;
    }

    div.tr .e {
        width: 34px;
    }

    div.tr .f {
        width: 105px;
    }

    div.tr div:last-child {
        border-right: 1px solid #d2d2d2;
    }

    div.tr div img {
        width: 32px;
        height: 32px;
    }

    div.sku {
        display: flex;
        justify-content: space-between;
    }

    div.sku span {
        flex: 1;
        height: 32px;
        line-height: 32px;
        font-weight: bold;
    }

    div.sku span.h {
        color: #BBBBBB;
    }

    .el-popover {
        background: #ddd;
        height: fit-content;
    }

    .unitAll {
        /*display: flex;*/
        display: block;
        flex-wrap: wrap;
        padding: 20px;
        height: 200px;
        line-height: 40px;
        position: absolute;
        left: 15px;
        right: 35px;
        background: #fff;
        top: 90px;
    }

    .unitAll .com {
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    .unitAll a {
        width: 80px;
        text-align: center;
    }
</style>