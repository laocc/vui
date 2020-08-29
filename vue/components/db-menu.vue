<template>
    <div class="dbMenu unselect" :style="'width:'+width+';background-color:'+background+';'">
        <ul v-for="(m,a) in menu" class="c">

            <li class="dm-head" v-if="!m.item" :class="{active:tabs.index===a+''}">
                <template v-if="type==='href'">
                    <a :target="m.target" v-if="m.target" :href="m.uri" :style="m.css||''">
                        <em :class="m.icon"></em>{{m.title}}
                    </a>
                    <a v-else @click="clkMenu(a+'',m.uri,m.title,m.sandbox)" :style="m.css||''" onclick="return !1;"
                       :href="m.uri">
                        <em :class="m.icon"></em>{{m.title}}
                    </a>
                </template>
                <template v-else>
                    <span @click="clkMenu(a+'',m.uri,m.title,m.sandbox)" :style="m.css||''">
                        <em :class="m.icon"></em>{{m.title}}
                    </span>
                </template>
            </li>

            <li class="dm-group-title" v-else @click="reGroup(a)" :style="m.css||''"><em :class="m.icon"></em>{{m.title}}
            </li>

            <li class="dm-group-body" v-if="m.item" :class="{hidden:(group!==a && open>=0)}">
                <dl v-for="(t,b) in m.item" v-show="t.display!=='none'">
                    <dt v-if="type==='href'" :class="{active:tabs.index===a+'_'+b}">
                        <a :target="t.target" v-if="t.target" :href="t.uri" :style="t.css||''">
                            <em :class="t.icon"></em>{{t.title}}
                        </a>
                        <a v-else @click="clkMenu(a+'_'+b,t.uri,t.title,t.sandbox)" :style="t.css||''"
                           onclick="return !1;" :href="t.uri">
                            <em :class="t.icon"></em>{{t.title}}
                        </a>
                    </dt>
                    <dt v-else @click="clkMenu(a+'_'+b,t.uri,t.title,t.sandbox)" :style="t.css||''"
                        :class="{active:tabs.index===a+'_'+b}">
                        <em :class="t.icon"></em>{{t.title}}
                    </dt>
                </dl>
            </li>
        </ul>
    </div>
</template>

<script>
    module.exports = {
        props: {
            'width': {
                type: String,
                default: '150px',
                validator(v) {
                    return /^\d+px$/i.test(v);
                }
            },
            'color': {
                type: Object,
                validator(v) {
                    return v.background && v.active;
                }
            },
            'background': {
                type: String,
                default: '#545c64',
                validator(v) {
                    return /^#([a-f0-9]{3}|[a-f0-9]{6})$/i.test(v);
                }
            },
            'type': String,
            'open': {
                type: Number,
                default: -1
            },
            'menu': {
                type: Array,
                required: !0
            },
            'tabs': Object,

        },
        data() {
            return {
                cls: 'active',
                group: this.open
            }
        },
        created() {
            console.log(menu);
        },
        computed: {
            wid: function () {
                return this.width + 'px';
            }
        },
        watch: {},
        methods: {
            clkMenu(key, uri, title, sandbox) {
                if (!this.tabs) return !0;
                if (sandbox === undefined) sandbox = 0;
                console.log(key,this.tabs.keys);

                if (this.tabs.keys.indexOf(key) < 0) {
                    this.tabs.keys.push(key);
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