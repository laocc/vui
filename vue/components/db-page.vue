<template>
    <ul class="page">
        <li>
            <slot></slot>
        </li>
        <li class="num" v-for="i in size" :class="{active:i===page.index}">
            <a :href="url(i)" v-if="link && i===page.index" onclick="return !1;">{{i}}</a>
            <a :href="url(i)" v-else-if="link">{{i}}</a>
            <a :href="url(i)" v-else @click="click(i)" onclick="return !1;">{{i}}</a>
        </li>
        <li class="lab">共{{page.recode}}条/每页{{page.size}}条 第{{page.index}}页/共{{page.page}}页</li>
        <li style="flex: 1;"></li>
    </ul>
</template>

<script>
    module.exports = {
        props: {
            page: {
                type: Object,
                default() {
                    //{"recode":3,"size":25,"index":1,"key":"page","last":3,"page":1}
                    return {
                        index: 1,
                        recode: 0,
                        size: 10,
                        key: 'page',
                        page: 1
                    };
                }
            }
        },
        data() {
            return {
                link: true,
                param: {}
            };
        },
        created() {
            this.link = !this._events.click;
            let mch = window.location.search.substr(1).match(/([\w\-\.]+=[^&]+)+/ig);
            // console.log(window.location.search.substr(1), mch);
            const self = this;
            if (mch !== null) {
                mch.forEach(pm => {
                    let p = pm.split(/([\w\-\.]+)=(.+)/i);
                    self.param[p[1]] = decodeURI(p[2]);
                });
            }
        },
        computed: {
            size: function () {
                let p = [], val = this.page;
                // val.page = 4;
                // val.index = 2;

                if (val.page < 2) {
                    p.push(1);
                } else if (val.page < 10) {
                    for (let i = 1; i <= val.page; i++) p.push(i);
                } else {
                    if (val.index < 5) {
                        for (let i = 1; i <= val.index; i++) p.push(i);
                        p.push('.');
                        p.push('.');
                        p.push('.');
                        p.push(val.page);
                    } else if (val.index > (val.page - 5)) {
                        p.push(1);
                        p.push('.');
                        p.push('.');
                        p.push('.');
                        for (let i = val.page - 6; i <= val.page; i++) p.push(i);

                    } else {
                        p.push(1);
                        p.push('.');
                        p.push('.');
                        for (let i = val.index - 2; i <= val.index + 2; i++) p.push(i);
                        p.push('.');
                        p.push('.');
                        p.push(val.page);
                    }
                }
                return p;
            }
        },
        methods: {
            url(i) {
                let arg = [];
                for (let k in this.param) {
                    if (k !== this.page.key) {
                        arg.push(`${k}=${this.param[k]}`);
                    }
                }
                arg.push(`${this.page.key}=${i}`);
                return `?` + arg.join('&');
            },
            click(i) {
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
        padding: 5px 10px;
    }

    .num {
        background: #fafafa;
        border-right: 1px solid #ddd;
        display: flex;
    }

    a {
        padding: 5px 10px;
        display: inline-block;
        flex: 1;
        width: 100%;
        height: 100%;
    }

    a:hover {
        background: #9da696;
    }

    .active, .active a {
        background: #00a65a;
        color: #fff;
    }

</style>