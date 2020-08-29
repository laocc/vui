
const fileHost = String(document.scripts[document.scripts.length - 1].src).match(/^(https?:\/\/[\w\.]+)\/.+/i)[1];

let vm = new Vue({
    el: '#body',
    data() {
        return {
            menu: menu,
            tabs: {
                index: '',
                items: [],
                keys: [],
            },
        }
    },
    created() {
        let key = '0';
        let fst = menu[0];
        if (typeof fst[0] !== "undefined") {
            fst = fst[0];
            key = '0_0';
        }

        let m = {
            title: fst.title,
            name: key,
            content: this.$iframe(fst.uri)
        };
        this.tabs.index = key;
        this.tabs.keys = [key];
        this.tabs.items = [m];
    },
    components: {
        'db-menu': `url:${fileHost}/vue/components/db-menu.vue`,
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        frmNewTab(uri, title) {
            let key = uri.md5();
            if (this.tabs.keys.indexOf(key) < 0) {
                this.tabs.keys.push(key);
                this.tabs.items.push({title: title, name: key, content: this.$iframe(uri)});
            }
            this.tabs.index = key;
        },
        menuClick(key, uri, title) {
            if (this.tabs.keys.indexOf(key) < 0) {
                this.tabs.keys.push(key);
                this.tabs.items.push({title: title, name: key, content: this.$iframe(uri)});
            }
            this.tabs.index = key;
        },
        removeTab(key) {
            let tabs = this.tabs.items;
            let activeName = this.tabs.index;
            if (activeName === key) {
                tabs.forEach((tab, index) => {
                    if (tab.name === key) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.name;
                        }
                    }
                });
            }

            this.tabs.keys = this.tabs.keys.del(key);
            this.tabs.items = tabs.filter(tab => tab.name !== key);
            this.tabs.index = activeName;
        },

    }
});

function frmNewTab(uri, title) {
    vm.frmNewTab(uri, title);
}
