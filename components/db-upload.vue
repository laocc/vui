<template>
    <div class="form" :style="cssBtn">
        <progress class="progress" v-show="run && progress" :id="'progressBar_'+rand" value="0" max="100"></progress>
        <div class="value" v-show="run && progress">
            <span>{{ percent }}</span>
            <span style="text-align: right">{{ speed }}</span>
        </div>
        <a v-show="!(run && progress)" :style="cssH" class="btnUP fc f40a" :class="cls" :href="api" @click="upload"
           onclick="return !1;">
            <slot></slot>
        </a>
        <input type="file" :id="name+'_'+rand" @change="uploadNow" :accept="type+'/*'" :multiple="number>1"
               v-show="!1"/>
    </div>
</template>

<script>
module.exports = {
    name: "db-upload",
    props: {
        api: {//上传目标路径
            type: String,
            default: ''
        },
        number: {//可选择数量
            type: [Number, String],
            default: 1
        },
        progress: {
            type: Boolean,
            default: true
        },
        /**
         audio/*    接受所有的声音文件。
         video/*    接受所有的视频文件。
         image/*    接受所有的图像文件。
         */
        type: {//可选择的文件类型
            type: String,
            default: 'image'
        },
        name: {//上传表单中文件名的键前缀，服务器收到的是file_0,file_1
            type: String,
            default: 'file'
        },
        data: {//附加到表单中的数据
            type: Object,
            default: function () {
                return {}
            }
        },
        option: {//回传到页面事件时所带值
            type: Object,
            default: function () {
                return {}
            }
        },
        disabled: {//是否禁用
            type: Boolean,
            default: false
        },
        width: {//按钮宽
            type: [String, Number],
            default: 100
        },
        height: {//按钮高
            type: [String, Number],
            default: 32
        },
        background: {//按钮背景
            type: String,
            default: '#206cf1'
        },
        value: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            http: {},
            offSize: 0,
            starTime: 0,
            run: false,
            percent: '0%',//进度
            speed: '0Kb/s',//速度
            offTime: '0s',//剩余时间
            progressBar: {},
            max: 100,
            pnt: 0,
            rand: 0,
            errColor: '',
        }
    },
    computed: {
        cssBtn: function () {
            let w = parseInt(this.width);
            let h = parseInt(this.height);
            return `width:${w}px;height:${h}px;`;
        },
        cssH: function () {
            let h = parseInt(this.height);//line-height:${h}px;
            let c = this.errColor || this.background;
            return `background:${c}`;
        },
        cls: function () {
            if (this.disabled) return 'disabled';
            return '';
        },
    },
    created() {
        this.rand = (0).rand();
        // console.log('upload be created', `${this.name}_${this.rand}`);
    },
    methods: {
        upload() {
            if (this.disabled) return;
            document.getElementById(`${this.name}_${this.rand}`).click();
        },
        uploadNow() {
            const self = this;
            if (!this.api) {
                console.error('未设置上传API');
                return;
            }
            self.errColor = '';
            let fmData = new FormData();
            let files = document.getElementById(`${this.name}_${this.rand}`).files;
            for (let i = 0; i < files.length; i++) fmData.append(`${this.name}_${i}`, files[i]);
            for (let d in this.data) fmData.append(d, this.data[d]);

            console.log('this.api', this.api);

            this.http = new XMLHttpRequest();  // XMLHttpRequest 对象
            this.http.open("POST", this.api, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
            // this.http.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            this.http.onload = function (proEnt) {                //服务断接收完文件返回的结果
                try {
                    let resp = JSON.parse(this.response);
                    console.log('upload.onLoad', resp, proEnt);
                    if (resp.success) {
                        let filePath = (this.number > 1) ? JSON.stringify(resp.data) : resp.data.path;
                        self.$emit('input', filePath);
                        self.$emit('success', self.option, resp);
                    } else {
                        self.$emit('error', self.option, resp);
                        self.errColor = '#c10111';
                    }
                    self.close();
                } catch (err) {
                    console.log('upload.onLoad.Error', err.message, proEnt);
                    self.$emit('error', self.option, {success: 0, message: this.response});
                    self.errColor = '#c10111';
                    self.close();
                }
            };

            this.http.onreadystatechange = function (ent) {
                console.log('upload.onReadyStateChange', this.readyState, this.status, ent);
            };

            this.http.onerror = function (err) {//请求失败
                console.log('upload.onError', err);
                self.$emit('error', self.option, {success: 0, message: '请求失败，请检查目标网络是否通顺'});
                self.errColor = '#c10111';
                self.close();
            };

            this.http.upload.onprogress = function (proEnt) {
                console.log('upload.onProgress', proEnt);

                ////所关联的资源是否具有可以计算的长度，false时，proEnt所有数据都是无意义的
                if (proEnt.lengthComputable) return;

                /**
                 * event.total  是需要传输的总字节
                 * event.loaded 是已经传输的字节
                 */
                let progressBar = document.getElementById(`progressBar_${this.rand}`);
                progressBar.max = proEnt.total;
                progressBar.pnt = proEnt.loaded;
                self.percent = Math.round(proEnt.loaded / proEnt.total * 100) + "%";

                let now = new Date().getTime();
                let pRun = (now - self.starTime) / 1000;
                self.starTime = now;

                let pUpload = proEnt.loaded - self.offSize; //计算该分段上传的文件大小，单位b
                self.offSize = proEnt.loaded;//重新赋值已上传文件大小，用以下次计算

                let speed = (pUpload / pRun); //单位b/s

                if (speed > 1024 * 1024) {
                    self.speed = (speed / (1024 * 1024)).toFixed(1) + 'Mb/s';
                } else if (speed > 1024) {
                    self.speed = (speed / 1024).toFixed(1) + 'Kb/s';
                }

                //剩余时间
                self.offTime = ((proEnt.total - proEnt.loaded) / speed).toFixed(1) + 's';

                self.$emit('progress', self.option, {
                    percent: self.percent,
                    speed: self.speed,
                    offTime: self.offTime,
                });
            };

            this.http.upload.onloadstart = function (proEnt) {//上传开始执行方法
                console.log('upload.onLoadStart', self.api, proEnt);
                self.starTime = new Date().getTime();   //设置上传开始时间
                self.offSize = 0;//设置上传开始时，以上传的文件大小为0
                self.run = true;
                self.errColor = '';
            };

            this.http.send(fmData); //开始上传，发送form数据
        },
        cancel() {
            this.http.abort();
            this.close();
        },
        close() {
            this.starTime = 0;
            this.offSize = 0;
            this.run = false;
            this.percent = '';
            this.speed = '';
            this.offTime = '';
        }

    }
}
</script>

<style scoped>
.form {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.btnUP {
    flex: 1;
    margin: 0 2px;
    border-radius: 2px;
    background: #093476;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 0;
    padding: 6px 5px;
}

.disabled {
    -webkit-filter: blur(1px);
    -moz-filter: blur(1px);
    -o-filter: blur(1px);
    -ms-filter: blur(1px);
    filter: blur(1px);
    background: #626b7c !important;
}

.progress {
    flex: 1;
    width: 96px;
    height: 8px;
    margin: 0 2px;
    border-radius: 2px;
    background: #ffffff;
    color: #9a6e3a;
}

.value {
    flex: 1;
    display: flex;
    height: 24px;
    margin: 0 2px;
}

.value span {
    flex: 1;
    font-size: 10px;
    color: #888;
}

</style>
