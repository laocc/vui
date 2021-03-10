<template>
    <a :href="href" target="_blank" v-if="isLink">
        <canvas :style="{width:width+'px',height:height+'px'}"
                :width="width"
                :height="height"
                :id="canvasID"></canvas>
    </a>
    <canvas v-else
            :style="{width:width+'px',height:height+'px'}"
            :width="width"
            :height="height"
            :id="canvasID"></canvas>
</template>
<!--

        <db-thumbnail
                mode="v"
                background=""
                :width="200"
                :height="300"
                src="http://pic.pay.com/image/20210212/223025598.jpeg"></db-thumbnail>

-->
<script>
module.exports = {
    name: 'thumbnail',
    props: {
        cid: {
            type: String,
            default: ''
        },
        mode: {
            type: String,
            default: 'x'
        },
        src: {
            type: String,
            default: ''
        },
        href: {
            type: String,
            default: ''
        },
        width: {
            type: [Number, String],
            default: 300
        },
        height: {
            type: [Number, String],
            default: 300
        },
        background: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            canvasID: '',
            isLink: false
        }
    },
    mounted() {
        this.canvasID = this.cid;
        if (!this.canvasID) this.canvasID = 'CID' + String(Math.random()).substr(2);
        this.isLink = Boolean(this.href);
        let image = new Image();
        image.crossOrigin = '';
        image.src = this.src || this.href;
        image.onload = (img) => {
            this.draw(image, img.path[0].width, img.path[0].height);
        }
    },
    methods: {
        draw(image, width, height) {
            // console.log('size:', width, height);
            const obj = document.getElementById(this.canvasID);
            const ctx = obj.getContext("2d");
            obj.width = this.width;
            obj.height = this.height;
            ctx.clearRect(0, 0, this.width, this.height);
            if (this.background) {
                ctx.fillStyle = this.background;
                ctx.fillRect(0, 0, this.width, this.height);
            }
            ctx.fill();

            let x, y, w, h;
            switch (this.mode) {
                case 'v':
                case 'V':
                    //源图全部显示，不够部分留空
                    //更倾向于扁形，宽全要，高的上下留空白
                    if (width / height > this.width / this.height) {
                        x = 0;
                        w = this.width;
                        h = (this.width / width) * height;
                        y = (this.height - height) / 2;
                    } else {
                        y = 0
                        h = this.height;
                        w = (this.height / height) * width;
                        x = (this.width - w) / 2;
                    }
                    ctx.drawImage(image, 0, 0, width, height, x, y, w, h);
                    break;
                default:
                    //先计算以宽或以高为基准，计算缩放率
                    //宽高比大于目标比，则源图更倾向于扁形，所以要以高为基准，高度全要，裁切宽
                    if (width / height > this.width / this.height) {
                        w = (height / this.height) * this.width;
                        x = (width - w) / 2;
                        y = 0;
                        h = height;
                    } else {
                        h = (width / this.width) * this.height;
                        y = (height - h) / 2;
                        x = 0;
                        w = width;
                    }
                    ctx.drawImage(image, x, y, w, h, 0, 0, this.width, this.height);
            }


        }
    }
};
</script>
