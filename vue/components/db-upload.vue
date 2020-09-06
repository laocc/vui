<template>
    <div class="form" :style="cssBtn">
        <progress class="progress" v-show="run && progress" :id="'progressBar_'+rand" value="0" max="100"></progress>
        <div class="value" v-show="run && progress">
            <span>{{percent}}</span>
            <span style="text-align: right">{{speed}}</span>
        </div>
        <a v-show="!(run && progress)" :style="cssH" class="btn fc f40a" :class="cls" :href="api" @click="upload"
           onclick="return !1;">
            <slot></slot>
        </a>
        <input type="file" :id="'file_'+rand" @change="uploadNow"
               :accept="type+'/*'" :multiple="number>1" v-show="!1"/>
    </div>
</template>

<script>
    module.exports = {
        name: "db-upload",
        props: {
            api: {
                type: String,
                default: ''//"http://admin.mall.com/temp/upload"
            },
            number: {
                type: [Number, String],
                default: 1
            },
            progress: {
                type: Boolean,
                default: true
            },
            name: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'image'
            },
            background: {
                type: String,
                default: '#206cf1'
            },
            data: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            option: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            disabled: {
                type: Boolean,
                default: false
            },
            width: {
                type: [String, Number],
                default: 100
            },
            height: {
                type: [String, Number],
                default: 32
            }
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
                value: 0,
                rand: 0,
                errColor: '',
            }
        },
        computed: {
            cssBtn: function () {
                let w = parseInt(this.width);
                let h = parseInt(this.height);
                return `width:${w}px;height:${h}px;border: 0;padding:0;`;
            },
            cssH: function () {
                let h = parseInt(this.height);
                let c = this.errColor || this.background;
                return `line-height:${h}px;background:${c}`;
            },
            cls: function () {
                if (this.disabled) return 'disabled';
                return '';
            },
        },
        created() {
            this.rand = (0).rand()
        },
        methods: {
            upload() {
                if (this.disabled) return;
                document.getElementById(`file_${this.rand}`).click();
            },
            uploadNow() {
                const self = this;
                self.errColor = '';
                let form = new FormData();
                let files = document.getElementById(`file_${this.rand}`).files;
                for (let i = 0; i < files.length; i++) form.append(`file${i}`, files[i]);
                for (let d in this.data) form.append(d, this.data[d]);

                this.http = new XMLHttpRequest();  // XMLHttpRequest 对象
                this.http.open("POST", this.api, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
                // this.http.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
                this.http.onload = function (proEnt) {                //服务断接收完文件返回的结果
                    try {
                        let data = JSON.parse(this.response);
                        console.log('upload.onLoad', data, proEnt);
                        if (data.success) {
                            self.$emit('success', self.option, data);
                        } else {
                            self.$emit('error', self.option, data);
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
                    progressBar.value = proEnt.loaded;
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

                this.http.send(form); //开始上传，发送form数据
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
        flex-direction: column;
    }

    .btn {
        flex: 1;
        margin: 0 2px;
        border-radius: 2px;
        background: #093476;
        color: #fff;
        display: block;
        text-align: center;
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
