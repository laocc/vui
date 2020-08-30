<template>
    <div class="dbArea">
        <select v-model="firstID" lay-ignore>
            <option :value="i" v-for="(p,i) in classAll">{{p.classID+' - '+p.className}}</option>
        </select>
        <select v-model="secondID" lay-ignore>
            <option :value="0">请选择</option>
            <option :value="c.classID" v-for="c in classChild">{{c.classID+' - '+c.className}}</option>
        </select>
        <input type="hidden" :name="name" v-model="secondID">
    </div>
</template>

<script>
    module.exports = {
        props: {
            value: {type: [String, Number], default: 0},
            name: {type: String, default: 'classID'}
        },
        data() {
            return {
                firstID: -1,
                secondID: -1,
                classAll: [],
                classChild: [],
                formatED: false,
            }
        },
        created() {
            this.secondID = parseInt(this.value);
            this.$get('/api/class').then(
                res => {
                    this.classAll = res.data;
                    this.reSecond();
                },
                err => {
                    console.error(err)
                }
            )
        },
        methods: {
            reSecond() {
                const self = this;
                if (this.secondID > 0) {
                    this.classAll.forEach((c, i) => {
                        c.children.forEach(a => {
                            if (a.classID === this.secondID) {
                                self.firstID = i;
                                return;
                            }
                        });
                        if (self.firstID >= 0) return;
                    });
                }
            }
        },
        watch: {
            firstID: function (a, b) {
                if (b >= 0) this.secondID = 0;
                this.classChild = this.classAll[a]['children'];
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