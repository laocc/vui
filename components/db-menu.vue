<template>
    <div class="dbMenu unselect" :style="'width:'+width+';background-color:'+background+';'">
        <ul v-for="(m,a) in menu" v-if="m!==null" class="c">

            <li class="dm-head" v-if="!m.item" :class="{active:tabs.index===item+a+''}">
                <template v-if="type==='href'">
                    <a :target="m.target" v-if="m.target" :href="m.uri" :style="m.css||''">
                        <em :class="m.icon"></em>{{ m.title }}
                    </a>
                    <a v-else-if="m.title" @click="clkMenu(a+'',m.uri,m.title,m.sandbox)" :style="m.css||''"
                       onclick="return !1;"
                       :href="m.uri">
                        <em :class="m.icon"></em>{{ m.title }}
                    </a>
                </template>
                <template v-else>
                    <span @click="clkMenu(a+'',m.uri,m.title,m.sandbox)" :style="m.css||''">
                        <em :class="m.icon"></em>{{ m.title }}
                    </span>
                </template>
            </li>

            <li class="dm-group-title" v-else-if="m.display!==false" @click="reGroup(a)" :style="m.css||''">
                <em :class="m.icon"></em>{{ m.title }}
            </li>

            <li class="dm-group-body" v-if="m.item && m.display!==false" :class="{hidden:(group!==a && open>=0)}">
                <dl v-for="(t,b) in m.item" v-if="m!==null && t!==null && m.item.length>0"
                    v-show="t.display!==false && t.display!==0 && t.display!=='none'">
                    <dt class="da" v-if="t && type==='href'" :class="{active:tabs.index===item+a+'_'+b}">
                        <a :target="t.target" v-if="t.target" :href="t.uri" :style="t.css||''">
                            <em :class="t.icon"></em>{{ t.title }}
                        </a>
                        <a v-else-if="t.title" @click="clkMenu(a+'_'+b,t.uri,t.title,t.sandbox)" :style="t.css||''"
                           onclick="return !1;" :href="t.uri">
                            <em :class="t.icon"></em>{{ t.title }}
                        </a>
                    </dt>
                    <dt class="db" v-else @click="clkMenu(a+'_'+b,t.uri,t.title,t.sandbox)" :style="t.css||''"
                        :class="{active:tabs.index===item+a+'_'+b}">
                        <em :class="t.icon"></em>{{ t.title }}
                    </dt>
                </dl>
            </li>
        </ul>
    </div>
</template>

<script>
    module.exports = {
        props: {
            width: {
                type: String,
                default: '150px',
                validator(v) {
                    return /^\d+px$/i.test(v);
                }
            },
            color: {
                type: Object,
                validator(v) {
                    return v.background && v.active;
                }
            },
            background: {
                type: String,
                default: '#545c64',
                validator(v) {
                    return /^#([a-f0-9]{3}|[a-f0-9]{6})$/i.test(v);
                }
            },
            type: String,
            item: {
                type: String,
                default: ''
            },
            open: {
                type: Number,
                default: -1
            },
            menu: {
                type: Array,
                required: !0
            },
            tabs: Object,

        },
        data() {
            return {
                cls: 'active',
                group: this.open
            }
        },
        created() {
            // console.log(menu);
        }, mounted() {
            this.menu.forEach((m1, a) => {
                console.log(m1);
                if (m1.item) {
                    m1.item.forEach((m2, b) => {
                        if (m2 && m2.preload) {
                            let key = a + '_' + b;
                            if (this.tabs.keys.indexOf(key) < 0) {
                                this.tabs.keys.push(key);
                                this.tabs.items.push({
                                    title: m2.title,
                                    name: key,
                                    content: this.$iframe(m2.uri, !!m2.sandbox)
                                });
                            }
                        }
                    })
                } else if (m1.preload) {
                    let key = a + '';
                    // a+'',m.uri,m.title,m.sandbox
                    if (this.tabs.keys.indexOf(key) < 0) {
                        this.tabs.keys.push(key);
                        this.tabs.items.push({
                            title: m1.title,
                            name: key,
                            content: this.$iframe(m1.uri, !!m1.sandbox)
                        });
                    }
                }
            })

        },
        computed: {
            wid: function () {
                return this.width + 'px';
            }
        },
        watch: {
            tabs: function (a, b) {
                console.log(a);
            }
        },
        methods: {
            newTab(tabs) {
                this.tabs.keys.length = 0;
                this.tabs.keys.push('0');
            },
            clkMenu(key, uri, title, sandbox) {
                if (!this.tabs) return !0;
                if (sandbox === undefined) sandbox = 0;
                key = this.item + key;
                console.log(key, this.tabs.keys);

                if (this.tabs.keys.indexOf(key) < 0) {
                    this.tabs.keys.push(key);
                    console.log({title: title, name: key, content: this.$iframe(uri, !!sandbox)});
                    this.tabs.items.push({title: title, name: key, content: this.$iframe(uri, !!sandbox)});
                }
                this.tabs.index = key;
                return !1;
            },
            requestUrl() {
                const self = this;
                self.$request(self.url).then(
                    function (resp) {
                        let back = function () {
                            if (resp.reload || resp.self === 'reload') {
                                location.reload();
                            } else {
                                let u = (resp.jump || resp.href);
                                if (u) location.href = u;
                            }
                        };
                        if (resp.message) {
                            self.$alert(resp.message, {callback: back});
                        } else {
                            back();
                        }
                    },
                    function (resp) {
                        self.$alert(resp.message);
                    }
                );
            },
            reGroup(i) {
                this.group = i;
            }
        },
    }
</script>
<!--http://debug.vue.com/vue/components-->
<style scoped>

</style>