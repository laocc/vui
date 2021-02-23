<template>
    <canvas :style="canvasCSS"
            :width="width"
            :height="height"
            :id="cID"></canvas>
</template>

<script>
module.exports = {
    name: 'myCanvas',
    props: {
        canvasId: {
            type: String,
            default: ''
        },
        automatic: { //若不是自动开始，则在触发显示后用setTimeout延时一点再开始工作
            type: Boolean,
            default: true
        },
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 300
        },
        background: {
            type: String,
            default: '#fff'
        },
        data: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            cID: '',
            total: 0,
            finish: 0,
            drawIng: false,
        };
    },
    computed: {
        canvasCSS() {
            return `width:${this.width}px;height:${this.height}px;`;
        }
    },
    mounted() {
        this.cID = this.canvasId;
        if (!this.cID) this.cID = 'CID' + String(Math.random()).substr(2)

        if (this.automatic) this.drawStar();
    },
    methods: {
        drawStar(data) {
            if (this.drawIng) return;
            this.drawIng = true;
            this.$emit('speed', '开始绘图');
            let canvasData = JSON.parse(JSON.stringify(data || this.data));
            //按index进行排序，值大的在后面，最后绘，也就是要在最上层
            canvasData.sort(function (a, b) {
                if (!a.index) a.index = 0;
                if (!b.index) b.index = 0;
                return String(a.index).localeCompare(b.index)
            });
            this.total = canvasData.length;
            let PromiseTask = [];
            canvasData.forEach((item, p) => {
                if (item.type !== 'img' && item.type !== 'image') return;
                PromiseTask.push(new Promise((resolve, reject) => {
                    this.$emit('speed', `(${p})加载图片`);
                    let image = new Image();
                    image.crossOrigin = '';
                    image.src = item.src;
                    image.onload = (img) => {
                        console.log(img, img.path[0].width, img.path[0].height);
                        item.src = image;
                        resolve()
                    }
                }));
            });
            if (PromiseTask.length > 0) {
                Promise.all(PromiseTask).then(
                    res => {
                        console.log('Promise.all success', res)
                        this.drawData(canvasData);
                    },
                    err => {
                        console.log('Promise.all fail', err)
                        this.$emit('error', err.errMsg);
                    }
                );
            } else {
                this.drawData(canvasData);
            }
        },
        drawData(data) {
            console.warn('drawData:', data);
            const obj = document.getElementById(this.cID);
            const ctx = obj.getContext("2d");
            obj.width = this.width;
            obj.height = this.height;
            ctx.save();
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.fillStyle = (this.background)
            ctx.fillRect(0, 0, this.width, this.height)
            ctx.fill()
            // ctx.draw(true);
            data.forEach((item, i) => {
                this.$emit('speed', `绘元素(${i}).${item.type}`);
                ctx.restore(); //每个项目开始前先恢复初始设置
                if (item.x < 0) item.x = this.width + item.x;
                if (item.y < 0) item.y = this.height + item.y;
                if (!item.alpha) item.alpha = 1;
                item.finish = 0;
                switch (item.type) {
                    case 'rect':
                        this.drawRect(ctx, item);
                        break;
                    case 'text':
                        this.drawText(ctx, item);
                        break;
                    case 'img':
                    case 'image':
                        this.drawImg(ctx, item);
                        break;
                    case 'circular':
                        this.drawCircular(ctx, item);
                        break;
                    case 'line':
                        this.drawLine(ctx, item);
                        break;
                    case 'clear':
                        this.drawLine(ctx, item);
                        break;
                }
                this.draw(ctx, item);
            });

            let count = 0;
            let tm = setInterval(() => {
                let i = 0;
                data.forEach(obj => {
                    if (!obj.finish) i++;
                });

                if (i === 0 || count++ > 5) {
                    clearInterval(tm)
                    this.$emit('save', document.getElementById(this.cID).toDataURL());
                    this.drawIng = false;
                }
            }, 200);

        },
        drawCircular(ctx, item) { //画圆
            ctx.arc(item.x, item.y, item.radius, 0, 2 * Math.PI)
            ctx.fillStyle = (item.color)
            ctx.fill()
        },
        drawClear(ctx, item) { //清除某个区域
            ctx.clearRect(item.x, item.y, item.width, item.height)
        },
        drawLine(ctx, item) { //画线
            ctx.strokeStyle = (item.color)
            ctx.lineWidth = (item.width || 10)
            ctx.lineCap = (item.cap || 'round') //'butt'平角、'round'圆角、'square'
            ctx.lineJoin = (item.join || 'miter') //'bevel'斜面、'round'圆角，'miter'斜角
            if (item.dash) ctx.setLineDash(item.dash.pattern, item.dash.offset);
            ctx.moveTo(item.x, item.y)
            if (item.point) {
                item.point.forEach(p => {
                    ctx.lineTo(p[0], p[1])
                })
            } else {
                item.relative.forEach(p => {
                    item.x += p[0];
                    item.y += p[1];
                    ctx.lineTo(item.x, item.y)
                })
            }

            ctx.stroke()
        },
        drawText(ctx, item) {
            if (!item.line || item.line === 0) item.line = 1;
            if (!item.lineHeight || item.lineHeight === 0) item.lineHeight = 2; //行距
            if (!item.size) item.size = 12;
            if (!item.padding) item.padding = 0;
            // ctx.setFontSize(item.size);
            ctx.font = `${item.size}px DejaVu Sans Mono, Helvetica Neue, Helvetica, Arial, sans-serif`;
            let xy = [item.x, item.y];
            if (!item.width) {
                let mea = ctx.measureText(item.text)
                item.width = mea.width + item.padding * 2;
                if (item.width > this.width) item.width = this.width;
            }
            if (!item.height) {
                item.height = ((item.size + item.lineHeight) * item.line - item.lineHeight + item.padding * 2);
            }
            console.log('text', JSON.stringify(item))
            if (item.background) {
                let bg = {
                    type: 'extend',
                    color: item.background,
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height,
                    alpha: 1,
                };
                this.drawRect(ctx, bg)
            }
            item.y += item.size;
            let width = item.width - item.padding * 2;
            let height = item.height - item.padding * 2;
            item.x += item.padding;
            item.y += item.padding;

            if (item.alpha) ctx.globalAlpha = (item.alpha)
            ctx.fillStyle = (item.color);
            if (!item.width || item.line === 1) {
                //不指定宽，直接显示整行
                if (item.shade) {
                    // ctx.setShadow(item.shade.x, item.shade.y, 50, item.shade.color)
                    ctx.fillStyle = (item.shade.color);
                    ctx.fillText(item.text, item.x + item.shade.x, item.y + item.shade.y);
                }
                ctx.fillStyle = (item.color);
                ctx.fillText(item.text, item.x, item.y);
                // ctx.strokeText(item.text, item.x, item.y, 300)
                return;
            }
            let metrics;
            let stop = 0;
            let star = 0; //每次开始截取的字符串的索引

            for (let i = 0; i < item.text.length; i++) {
                metrics = ctx.measureText(item.text.substring(star, i))
                if (metrics.width >= width) {
                    stop = i;
                    if (metrics.width > width) stop -= 1;
                    ctx.fillText(item.text.substring(star, stop), item.x, item.y); //绘制截取部分
                    item.y += (item.size + item.lineHeight);
                    star = stop;
                    item.line--;
                    if (item.line <= 1) break;
                }
            }
            let len = Math.floor(width / item.size);
            // console.log(item.line, star, len, len);
            if (item.line > 0 && star < item.text.length) {
                ctx.fillText(item.text.substring(star, len + star), item.x, item.y);
            }
            if (item.radius) {
                item.x = xy[0];
                item.y = xy[1];
                this.drawRadius(ctx, item);
            }
        },
        drawRect(ctx, item) {
            console.log('rect', JSON.stringify(item))
            ctx.fillStyle = (item.color)
            if (item.rotate) ctx.rotate(item.rotate * Math.PI / 180)
            if (item.alpha) ctx.globalAlpha = item.alpha;
            ctx.fillRect(item.x, item.y, item.width, item.height)
            if (item.rotate) ctx.rotate(360 - item.rotate * Math.PI / 180)
            if (item.radius) this.drawRadius(ctx, item);
        },
        drawImg(ctx, item) {
            if (item.download === 0) {
                console.log('img Not Download', JSON.stringify(item))
                return;
            }
            console.log('img', JSON.stringify(item))
            if (!item.padding) item.padding = 0;
            if (item.padding > 0) {
                let bg = {
                    type: 'extend',
                    color: item.background || '#fff',
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height,
                    alpha: 1,
                };
                this.drawRect(ctx, bg)
            }
            if (item.alpha) ctx.globalAlpha = item.alpha;
            let pos = [item.x + item.padding, item.y + item.padding, item.width - item.padding * 2, item.height - item.padding * 2];
            let opt = [item.src, ...pos];
            if (item.area) opt = [item.src, ...item.area, ...pos];
            ctx.drawImage(...opt);

            if (item.radius) this.drawRadius(ctx, item);
        },
        drawRadius(ctx, item) {
            ctx.fillStyle = (item.radiusBackground || this.background)

            let radius = item.radius;
            if (typeof radius === 'number' || typeof radius === 'string') {
                radius = Array.from(Array(4), (v, k) => radius);
            }
            radius.forEach((r, i) => {
                if (String(r).indexOf('%') > 0) {
                    radius[i] = ((item.width + item.height) / 2 + item.padding * 2) * (parseFloat(r) / 100);
                }
            });

            //pi从3点钟方向开始，这里分别是12/3/6/9点钟的pi值
            let pi = [Math.PI * 3 / 2, 0, Math.PI / 2, Math.PI];

            //右上角
            if (radius[0]) {
                ctx.beginPath();
                ctx.arc(item.x + item.width - radius[0], item.y + radius[0], radius[0], pi[0], pi[1])
                ctx.lineTo(item.x + item.width, item.y);
                ctx.closePath();
                ctx.fill()
            }

            //右下角
            if (radius[1]) {
                ctx.beginPath();
                ctx.arc(item.x + item.width - radius[1], item.y + item.height - radius[1], radius[1], pi[1], pi[2])
                ctx.lineTo(item.x + item.width, item.y + item.height);
                ctx.closePath();
                ctx.fill()
            }

            //左下角
            if (radius[2]) {
                ctx.beginPath();
                ctx.arc(item.x + radius[2], item.y + item.height - radius[2], radius[2], pi[2], pi[3])
                ctx.lineTo(item.x, item.y + item.height);
                ctx.closePath();
                ctx.fill()
            }


            //左上角
            if (radius[3]) {
                ctx.beginPath();
                ctx.arc(item.x + radius[3], item.y + radius[3], radius[3], pi[3], pi[0])
                ctx.lineTo(item.x, item.y);
                ctx.closePath();
                ctx.fill()
            }

        },
        draw(ctx, item) {
            return;
            ctx.draw(true, setTimeout(() => {
                item.finish = 1;
                if (item.type !== 'extend') this.finish++;
                this.$emit('speed', Math.ceil((this.finish / this.total) * 100) + '%');
            }, 50));
        },
    },
}
</script>

