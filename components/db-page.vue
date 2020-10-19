<template>
    <ul class="page">
        <li style="margin-right:5px" v-if="hasSlot">
            <slot></slot>
        </li>
        <li class="num"><a :href="url('p')" @click="click('p')" onclick="return !1;">＜</a></li>
        <li class="num" v-for="i in size" :class="{active:i===page.index}">
            <a :href="url(i)" v-if="i==='…'" onclick="return !1;">{{i}}</a>
            <a :href="url(i)" v-else-if="link && i===page.index" onclick="return !1;">{{i}}</a>
            <a :href="url(i)" v-else-if="link">{{i}}</a>
            <a :href="url(i)" v-else @click="click(i)" onclick="return !1;">{{i}}</a>
        </li>
        <li class="num"><a :href="url('n')" @click="click('n')" onclick="return !1;">＞</a></li>
        <li class="lab">共{{page.recode}}条/每页{{page.size}}条 第{{page.index}}/{{page.page}}页</li>
        <li style="flex: 1;"></li>
    </ul>
</template>

<script>
    module.exports = {
        props: {
            page: {
                type: Object,
                default() {
                    return {
                        index: 1,
                        recode: 0,
                        size: 10,
                        key: 'page',
                        page: 1,
                    };
                }
            }
        },
        data() {
            return {
                link: true,
                param: '_=1',
                hasSlot: Boolean(this.$slots.default),
            };
        },
        created() {
            const self = this;
            this.link = !this._events.click;
            let mch = window.location.search.substr(1).match(/([\w\-\.]+=[^&]+)+/ig);
            if (mch !== null) {
                let params = [];
                mch.forEach(pm => {
                    let p = pm.split(/([\w\-\.]+)=(.+)/i);
                    if (p[1] !== this.page.key) params[p[1]] = decodeURI(p[2]);
                });
                this.param = params.join('&');
            }
        },
        computed: {
            size: function () {
                let p = [], val = this.page;

                //{"recode":1437,"size":25,"index":1,"key":"page","last":12,"page":58}

                if (val.page < 2) {
                    p.push(1);//只有一页
                } else if (val.page < 10) {
                    //少于10页全显示
                    for (let i = 1; i <= val.page; i++) p.push(i);
                } else {
                    if (val.index < 5) {
                        //前5页：前1234567.L后 =9
                        for (let i = 1; i < val.index; i++) p.push(i);
                        p.push(val.index);
                        for (let i = val.index + 1; i <= 7; i++) p.push(i);
                        p.push('…');
                        p.push(val.page);

                    } else if (val.index > (val.page - 5)) {
                        //第5页开始：前1.12021.L后 = 11
                        p.push(1);
                        p.push('…');
                        for (let i = val.page - 6; i <= val.page; i++) p.push(i);

                    } else {
                        //最后5页：前1.2112345后 = 11
                        p.push(1);
                        p.push('…');
                        for (let i = val.index - 2; i <= val.index + 2; i++) p.push(i);
                        p.push('…');
                        p.push(val.page);
                    }
                }
                return p;
            }
        },
        methods: {
            url(i) {
                if (i === 'p') {
                    i = this.page.index - 1;
                    if (i < 1) i = 1;
                } else if (i === 'n') {
                    i = this.page.index + 1;
                    if (i > this.page.page) i = this.page.page;
                }
                return `?` + this.param + `\&${this.page.key}=${i}`;
            },
            click(i) {
                console.log(i);
                if (i === 'p') {
                    i = this.page.index - 1;
                    if (i < 1) i = 1;
                } else if (i === 'n') {
                    i = this.page.index + 1;
                    if (i > this.page.page) i = this.page.page;
                }
                if (i === this.page.index) return false;

                if (!this._events.click) {
                    console.log('未定义 @click');
                    return false;
                }
                let param = this.param;
                param[this.page.key] = i;
                this.$emit('click', {index: i, url: this.url(i), param: param})
            }
        }
    }
</script>

<style scoped>
    .page {
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