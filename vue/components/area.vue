<template>
    <div class="dbArea">
        <select v-model="key1" lay-ignore>
            <option :value="p.code" v-for="p in address">{{p.name}}</option>
        </select>
        <select v-model="key2" lay-ignore>
            <option :value="c.code" v-for="c in city">{{c.name}}</option>
        </select>
        <select v-model="key3" lay-ignore>
            <option :value="x.code" v-for="x in cont">{{x.name}}</option>
        </select>
        <input type="hidden" :name="name" v-model="code">
    </div>
</template>

<script>
    module.exports = {
        props: [
            'level',
            'value',
            'name'
        ],
        data() {
            return {
                code: '',
                address: {},
                formatED: false,
                key1: '', key2: '', key3: '',
                prov: {},
                city: {},
                cont: {},
                defaultCode: '000000'
            }
        },
        created() {
            this.$get('/api/area').then(
                res => {
                    console.table(res.data);
                    this.address = res.data;

                    this.renderList(this.value || this.defaultCode);
                    this.code = this.value || this.defaultCode;

                },
                err => {
                    console.error(err)
                }
            )
        },
        methods: {
            renderList(value) {
                let lev = this.level;
                let val = String(value);
                console.log(val);
                let a = val.substr(0, 2);
                let b = val.substr(2, 2);
                let c = val.substr(4, 2);
                if (a === '00') {
                    for (let c in this.address) {
                        this.key1 = this.address[c]['code'];
                        return;
                    }
                    return;
                }
                this.key1 = `${a}0000`;
                this.key2 = `${a}${b}00`;
                this.key3 = value;
                this.city = this.address[this.key1]['list'];
                this.cont = this.city[this.key2]['list'];
            }
        },
        watch: {
            key1: function (a, b) {
                // console.log(a, b);
                this.city = this.address[a]['list'];
                if (!this.formatED) {
                    this.cont = this.city[this.key2]['list'];
                    return;
                }
                for (let c in this.city) {
                    this.cont = this.city[c]['list'];
                    this.key2 = this.city[c]['code'];
                    return;
                }
                this.formatED = true;
            },
            key2: function (a, b) {
                // console.log(a, b);
                this.cont = this.city[a]['list'];
                if (!this.formatED) {
                    // this.cont = this.city[this.key2]['list'];
                    return;
                }
                for (let x in this.cont) {
                    this.key3 = this.cont[x]['code'];
                    return;
                }
                this.formatED = true;
            },
            key3: function (a, b) {
                this.code = a;
                this.formatED = true;
            }
        }
    }
</script>

<style scoped>
    div.dbArea select {
        border-radius: 5px;
        margin-left: 2px;
    }

</style>