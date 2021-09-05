

# 目前依赖包：
npm install vue
npm install jquery
npm install http-vue-loader
npm install element-ui -S
npm install layui-src   

# 引用：
jquery,vue,http-vue-loader:
``` 
<script src="/public/dbui/node_modules/jquery/dist/jquery.js"></script>
<script src="/public/dbui/node_modules/vue/dist/vue.js"></script>
<script src="/public/dbui/node_modules/http-vue-loader/src/httpVueLoader.js"></script>
```

element:
``` 
<script src="/public/dbui/node_modules/element-ui/lib/index.js"></script>
<link rel="stylesheet" href="/public/dbui/node_modules/element-ui/lib/theme-chalk/index.css" media="all">
```

layui:
``` 
<script src="/public/dbui/node_modules/layui-src/dist/layui.all.js"></script>
<link rel="stylesheet" href="/public/dbui/node_modules/layui-src/dist/css/layui.css" media="all">
```
其中：要删除layui.css中`a{color:#333}`和其后的hover部分

