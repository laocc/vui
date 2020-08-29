<template>
    <div>
        <el-popover
                v-model="areaShow"
                placement="top-start"
                trigger="manual">
            <div style="padding:5px;">
                <db-button style="float:left;" class="btn small fa e60b" @click="areaShow=false">取消</db-button>
                <db-button style="float:right;" class="btn success small" @click="edit(0)">确定当前地区选择</db-button>
            </div>
            <table class="layui-table" style="margin:0;">
                <tbody>
                <tr v-for="s in area">
                    <template v-if="canBeChoose(s.code)">
                        <td width="120">
                    <span class="ad" @click="newCode(s.code)"
                          :class="s.code.in_array(form)?'yes':'no'">{{s.name}}</span>
                        </td>
                        <td class="city">
                    <span v-for="c in s.list" @click="newCode(c.code)" class="ad"
                          :class="c.code.in_array(form)?'yes':'no'" v-show="canBeChoose(c.code)">
                        {{c.name}}
                    </span>
                        </td>
                    </template>
                </tr>
                </tbody>
            </table>
            <span class="blue">除不销售地区外，市级地区优先级大于省级地区，无论是否在同一条规则内。</span>
        </el-popover>

        <el-popover
                v-model="priceShow"
                placement="bottom"
                width="100%"
                trigger="manual">
            <div style="padding:5px;">
                <db-button style="float:left;" class="btn small fa e60b" @click="priceShow=false">取消</db-button>
                <db-button style="float:right;" class="btn success small" @click="savePrice">保存当前规则</db-button>
            </div>

            <table class="layui-table" style="margin:0;">
                <thead>
                <tr>
                    <th width="100">类型</th>
                    <th width="150">单位重量(公斤)</th>
                    <th width="150">运费(元)</th>
                    <th></th>
                </tr>
                </thead>
                <tbody class="layui-form">
                <tr>
                    <td>基础运费</td>
                    <td><input type="text" class="layui-input" v-model="item.base.weight"></td>
                    <td><input type="text" class="layui-input" v-model="item.base.price"></td>
                    <td>基础运费，指首重，例如：前3公斤x元</td>
                </tr>
                <tr>
                    <td>续重运费</td>
                    <td><input type="text" class="layui-input" v-model="item.more.weight"></td>
                    <td><input type="text" class="layui-input" v-model="item.more.price"></td>
                    <td>续重运费，指超出首重之后，每x重增加x元，例：每1公斤x元</td>
                </tr>
                </tbody>
            </table>
            <table class="layui-table" style="margin:0;">
                <thead>
                <tr>
                    <th width="100">其他设置</th>
                    <th width="300"></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>快递公司</td>
                    <td>
                        <el-select v-model="item.conf.express" placeholder="请选择">
                            <el-option
                                    v-for="(exp,e) in express"
                                    :key="exp.code"
                                    :label="exp.name"
                                    :value="exp.code">
                            </el-option>
                            <el-option value="other">其他快递公司</el-option>
                        </el-select>
                    </td>
                    <td>选择快递公司，仅为运营备注，实际面单打印时，仍由打印时选择处理</td>
                </tr>
                <tr v-if="editIndex>0">
                    <td>不销售地区</td>
                    <td>
                        <el-checkbox v-model="item.conf.skip" :border="true" size="medium">此规则内地区不销售/不发货</el-checkbox>
                    </td>
                    <td>若选择，则此条规则内的地区将显示为【本地区无货】</td>
                </tr>
                <tr v-if="editIndex>0 && item.conf.skip">
                    <td>相关说明</td>
                    <td colspan="2" style="color:red;">若当前规则选择为不销售地区，则此规则内的地区在其他销售规则内无效，即：不销售规则优先</td>
                </tr>
                <tr v-if="editIndex>0">
                    <td>已选地区</td>
                    <td colspan="2">
                        <span class="c" v-for="c in item.address">{{location[c]}}</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </el-popover>

        <div style="padding:5px;">
            <db-button style="float:left;" @click="newAdd" class="btn small">添加一条规则</db-button>
            <db-button style="float:right;" class="btn post success small"
                       url="/postage/express/%s" :value="id" :data="setup"
                       @success="close">保存当前设置
            </db-button>
        </div>

        <table class="layui-table " style="margin:0">
            <thead>
            <tr>
                <th width="140">首重</th>
                <th width="140">续重</th>
                <th width="140">物流</th>
                <th>地区</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(p,i) in setup">
                <td>
                    <db-button class="blue" icon="fa e641" @click="editPrice(i)">
                        {{p.base.price.format()}}/{{p.base.weight}}Kg
                    </db-button>
                </td>
                <td>
                    <db-button class="blue" icon="fa e641" @click="editPrice(i)">
                        {{p.more.price.format()}}/{{p.more.weight}}Kg
                    </db-button>
                </td>
                <td>
                    <db-button class="blue" icon="fa e641" @click="editPrice(i)">
                        {{expName(p.conf)}}
                    </db-button>
                </td>
                <td v-if="i===0">所有地区(下列地区以外的全部地区适用此设置)</td>
                <td v-else>
                    <db-button url="/" class="btn small success" @click="edit(i)">编辑</db-button>
                    <span class="c" v-for="c in p.address">{{location[c]}}</span>
                </td>
            </tr>
            </tbody>

        </table>
    </div>
</template>

<script>

    module.exports = {
        props: {
            area: {type: Object, default: {}}, //完整的地区表
            express: {type: Array, default: {}},//全部快递公司
            id: {type: Number, default: 0},//运费ID
            setup: {type: Array, default: {}},//相关设置
        },

        data() {
            return {
                areaShow: false,
                priceShow: false,
                form: [],
                item: {
                    base: {price: 0, weight: 0},
                    more: {price: 0, weight: 0},
                    conf: {express: '', skip: false},
                    address: []
                }, //当前编辑的价格项
                editIndex: 0,
                expressKv: {},
                location: {},
            }
        },
        created() {
            // console.log(this.expressKv)
            this.express.forEach(e => {
                this.expressKv[e.code] = e.name;
            });

            for (let a in this.area) {
                this.location[a] = this.area[a].name;
                for (let b in this.area[a].list) {
                    this.location[b] = this.area[a].list[b].name;
                }
            }

        },
        methods: {
            expName(conf) {
                if (conf.skip === true) return '此地区不销售';
                // return conf.express;
                return this.expressKv[conf.express] || '';
                //true===p.conf.skip?'此地区不销售':(expressKv[p.conf.express]||'')

            },
            canBeChoose(code) {
                let value = true;
                this.setup.forEach((p, i) => {
                    if (typeof p.address === 'object' && i !== this.editIndex) {
                        p.address.forEach(c => {
                            if (c === code) {
                                value = false;
                                return false;
                            }
                        });
                        if (!value) return false;
                    }
                });
                return value;
            },
            newCode(code) {
                if (code.in_array(this.form)) {
                    this.form.splice(this.form.indexOf(code), 1)
                } else {
                    this.form.push(code);
                }
                this.setup[this.editIndex].address = this.form;
                console.log(this.form);
            },
            editPrice(i) {
                this.item = this.setup[i];
                if (!this.item.conf) this.item.conf = {express: '', skip: false};
                this.priceShow = true;
                this.editIndex = i;
            },
            savePrice() {
                this.setup[this.editIndex] = this.item;
                this.priceShow = false;
                this.editIndex = 0;
            },
            close() {
                parent.layer.close(parent.layer.getFrameIndex(window.name));
            },
            edit(i) {
                if (i === 0) {
                    if (this.form.length === 0) {
                        this.setup.splice(this.editIndex, 1)
                    }
                    this.form = [];
                    this.areaShow = false;
                    this.editIndex = 0;
                } else {
                    this.form = this.setup[i].address;
                    this.areaShow = true;
                    this.editIndex = i;
                }
            },
            newAdd() {
                let val = {
                    base: {price: 0, weight: 0},
                    more: {price: 0, weight: 0},
                    conf: {express: '', skip: false},
                    address: []
                };
                this.setup.push(val);
            }
        },
    }
</script>

<style scoped>

    html, body, #body {
        height: 100%;
    }

    .c {
        margin: 2px;
        border: 1px solid #cccccc;
        padding: 5px 8px;
        border-radius: 3px;
        background: #eae3e6;
    }

    .el-popover {
        padding: 0;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
    }

    .layui-table td {
        padding: 5px;
    }

    .city {
        display: flex;
        align-content: flex-start;
        flex-wrap: wrap;
    }

    .ad {
        margin: 4px;
        padding: 1px 3px;
        border-radius: 3px;
        cursor: default;
    }

    .yes {
        border: 1px solid #f14716;
        background: #f14716;
        color: #fff;
    }

    .no {
        border: 1px solid #cccccc;
        background: #bbb;
        color: #fff;
    }

</style>
