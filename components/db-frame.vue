<template>
    <div class="flex" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
        <db-menu
                background="#545c64"
                :color="{background:'d',active:'s'}"
                width="150px"
                type="href"
                :menu="menu"
                :tabs="tabs"
        ></db-menu>
        <div class="container">

            <el-tabs v-model="tabs.index"
                     :type="tabs.type"
                     :closable="true"
                     @tab-remove="removeTab">
                <el-tab-pane
                        v-for="(item, index) in tabs.items"
                        :key="item.name"
                        :name="item.name"
                        v-html="item.content"
                >
                    <template v-slot:label>{{item.title}}</template>
                </el-tab-pane>
            </el-tabs>

        </div>
    </div>

</template>

<script>
    module.exports = {
        name: "db-frame"
    }
</script>

<style scoped>

</style>