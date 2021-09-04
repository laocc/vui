<template>
    <ul class="paging">
        <li style="margin-right:5px" v-if="hasSlot">
            <slot></slot>
        </li>
        <li class="num"><a :href="url('p')" @click="click('p')" onclick="return !1;">＜</a></li>
        <li class="num" v-for="i in sizeLabel" :class="{active:i===data.index}">
            <a :href="url(i)" v-if="i==='…'" onclick="return !1;">{{ i }}</a>
            <a :href="url(i)" v-else-if="link && i===data.index" onclick="return !1;">{{ i }}</a>
            <a :href="url(i)" v-else-if="link">{{ i }}</a>
            <a :href="url(i)" v-else @click="click(i)" onclick="return !1;">{{ i }}</a>
        </li>
        <li class="num"><a :href="url('n')" @click="click('n')" onclick="return !1;">＞</a></li>

        <el-dropdown class="lab" placement="top" trigger="click" @command="rePageSize">
            <li>共{{ data.recode }}条/每页{{ data.size }}条 第{{ data.index }}/{{ data.total }}页</li>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="s in sizeOptions" :key="s" :command="s">每页 {{ s }} 条</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <li style="flex: 1;"></li>
    </ul>
</template>

<script>
    module.exports = {
        props: {
            sizeOption: {
                type: Array,
                default() {
                    return [];
                }
            },
            data: {
                type: Object,
                default() {
                    return {
                        index: 1,
                        recode: 0,
                        size: 10,
                        key: 'page',
                        total: 1,
                    };
                }
            },
        },
        data() {
            return {
                link: true,
                param: '_=1',
                hasSlot: Boolean(this.$slots.default),
            };
        },
        created() {
            this.link = !this._events.click;
            let mch = window.location.search.substr(1).match(/([\w\-\.]+=[^&]+)+/ig);
            if (mch !== null) {
                let params = [];
                mch.forEach(pm => {
                    let p = pm.split(/([\w\-\.]+)=(.+)/i);
                    if (p[1] !== this.data.key) params[p[1]] = decodeURI(p[2]);
                });
                this.param = params.join('&');
            }
            console.log('this.option', this.txt, this.opt, this.data);

        },
        computed: {
            sizeOptions() {
                if (this.sizeOption.length > 0) return this.sizeOption;
                let opt = [];
                for (let i = 1; i <= 4; i++) opt.push(i * 10);
                for (let j = 1; j <= 6; j++) opt.push(j * 50);
                return opt;
            },
            sizeLabel: function () {
                let p = [], val = this.data;

                if (val.total < 2) {
                    p.push(1);//只有一页
                } else if (val.total < 10) {
                    //少于10页全显示
                    for (let i = 1; i <= val.total; i++) p.push(i);
                } else {
                    if (val.index < 5) {
                        //前5页：前1234567.L后 =9
                        for (let i = 1; i < val.index; i++) p.push(i);
                        p.push(val.index);
                        for (let i = val.index + 1; i <= 7; i++) p.push(i);
                        p.push('…');
                        p.push(val.total);

                    } else if (val.index > (val.total - 5)) {
                        //第5页开始：前1.12021.L后 = 11
                        p.push(1);
                        p.push('…');
                        for (let i = val.total - 6; i <= val.total; i++) p.push(i);

                    } else {
                        //最后5页：前1.2112345后 = 11
                        p.push(1);
                        p.push('…');
                        for (let i = val.index - 2; i <= val.index + 2; i++) p.push(i);
                        p.push('…');
                        p.push(val.total);
                    }
                }
                return p;
            }
        },
        methods: {
            rePageSize(v) {
                console.log(v);
                this.data.size = parseInt(v);
                this.click(0);
            },
            url(i) {
                if (i === 'p') {
                    i = this.data.index - 1;
                    if (i < 1) i = 1;
                } else if (i === 'n') {
                    i = this.data.index + 1;
                    if (i > this.data.total) i = this.data.total;
                }
                return `?` + this.param + `\&${this.data.key}=${i}\&total=${this.data.total}`;
            },
            click(i) {
                console.log(i);
                if (i === 'p') {
                    i = this.data.index - 1;
                    if (i < 1) i = 1;
                } else if (i === 'n') {
                    i = this.data.index + 1;
                    if (i > this.data.total) i = this.data.total;
                }
                if (i === this.data.index) return false;

                if (!this._events.click) {
                    console.log('未定义 @click');
                    return false;
                }
                let param = this.param;
                param[this.data.key] = i;
                let value = {index: i, size: this.data.size, url: this.url(i), param: param, total: this.data.recode};
                console.log('pageClick:', value);
                this.$emit('click', value);
            }
        }
    }
</script>

<style scoped>
    .paging {
        width: 100%;
        display: flex;
        border-radius: 3px;
        border: 1px solid #ddd;
    }

    .btn {
        padding: 5px 10px;
        display: block;
    }

    .lab {
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
        align-items: center;
        min-width: 38px;
        text-align: center;
        cursor: pointer;
    }

    .num {
        background: #fafafa;
        border-right: 1px solid #ddd;
        display: flex;
        align-items: center;
        height: 34px;
        line-height: 34px;
        min-width: 38px;
        text-align: center;
    }

    a {
        padding-left: 10px;
        padding-right: 10px;
        display: inline-block;
        flex: 1;
        width: 100%;
        height: 100%;
        /*color: #fff !important;*/
    }

    a:hover {
        background: #dfdfdf;
    }

    .active, .active a {
        background: #1471f1;
        color: #fff;
    }

</style>