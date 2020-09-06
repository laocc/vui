/**
 *
 * JS扩展：
 *
 */

String.prototype.utf8_encode = function () {
    return utf8_encode(this);
};

String.prototype.utf8_decode = function () {
    return utf8_decode(this);
};

String.prototype.base64_encode = function () {
    return btoa(this.utf8_encode());
};

String.prototype.base64_decode = function () {
    return atob(this).utf8_decode();
};

//字符串Md5
String.prototype.md5 = function () {
    if (typeof Md5 === "undefined") return "未引入md5.js";
    return new Md5().md5(this);
};

String.prototype.html_decode = function () {
    return this.replace(/&#39;/g, "'")
        .replace(/<br\s*(\/)?\s*>/g, "\n")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");
};

/**
 * console.log(...'这是要提示的内容'.log('red'));
 */
String.prototype.log = function (color) {
    let background = {red: '#DC0113', blue: '#1052A6', green: '#25A76E'}[color] || '#25A76E';
    return ['%c%s%c%s',
        "background: #35495e; padding: 5px 15px; border-radius: 3px 0 0 3px;color: #fff;font-size:10px;",
        '提示',
        `background: ${background}; padding: 5px 15px; border-radius: 0 3px 3px 0;color: #fff;font-size:10px;`,
        String(this)];
};


//let str = '这个{{sex}}人今年{{age}}岁'.re({sex: '女', age: 25});
String.prototype.re = function (val) {
    return this.replace(/\{\{(\w+?)\}\}/gi, function ($0, $1) {
        return val[($1)] || $0;
    });
};


/**
 * 两种方式：
 * console.log('i am %s,is %s'.sprintf('CNE', 'Support'))
 * console.log('i am %s,is %s'.sprintf(...['CNE', 'Support']))
 */
String.prototype.sprintf = function (val) {
    let arg = arguments, i = 0;
    return this.replace(/(?:\%([bcdefsugoxEFGX]))+?/gi, function ($0, $1, $2, $3, $4) {
        // console.log('0=', $0, '1=', $1, '2=', $2, '3=', $3, '4=', $4);
        switch ($1) {
            case 'd':
                return parseInt(arg[i++]);
            case 'f':
                return parseFloat(arg[i++]);
            default:
                return String(arg[i++]);
        }

    });
};


//是否手机号码
String.prototype.is_mob = function () {
    return /^([1][345789]\d{9})$/.test(this);
};

//是否邮箱
String.prototype.is_mail = function () {
    return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this);
};

//是否日期时间
String.prototype.is_date = function () {
    return /^(?:(?:1[789]\d{2}|2[012]\d{2})[-\/](?:(?:0?2[-\/](?:0?1\d|2[0-8]))|(?:0?[13578]|10|12)[-\/](?:[012]?\d|3[01]))|(?:(?:0?[469]|11)[-\/](?:[012]?\d|30)))|(?:(?:1[789]|2[012])(?:[02468][048]|[13579][26])[-\/](?:0?2[-\/]29))$/.test(this);
    // return /^(\d{2,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(this) || /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(this);
};

//随机字符串
String.prototype.rand = function (len, hex) {
    len = len || 32;
    // let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';//去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*
    let $chars = hex ? 'abcdef0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let maxPos = $chars.length;
    let pwd = '', i;
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

//随机数字
Number.prototype.rand = function (min, max) {
    min = min || 0;
    max = max || 9007199254740990;
    return Math.round(min + Math.random() * (max - min));
};

Array.prototype.rand = function () {
    let n = (0).rand(1, this.length);
    return this[n];
};


/**
 * 日期格式化
 * console.log((new Date).format('YYYY-MM-DD HH:ii:ss'))
 * 若取一个Date的时间戳用：date.valueOf()，但这是带毫秒的
 */
Date.prototype.format = function (fmt) {
    let tm = {
        "Y": this.getFullYear(), //年份
        "y": this.getFullYear(), //年份
        "M": this.getMonth() + 1, //月份
        "m": this.getMonth() + 1, //月份
        "D": this.getDate(), //日
        "d": this.getDate(), //日
        "H": this.getHours(), //小时
        "h": this.getHours(), //小时
        "i": this.getMinutes(), //分
        "s": this.getSeconds(), //秒
        "q": Math.floor((this.getMonth() + 3) * 0.3333), //季度
        "S": this.getMilliseconds() //毫秒
    };
    fmt = fmt || 'yyyy-mm-dd hh:ii:ss';
    for (let k in tm) {
        if (new RegExp("(" + k + "+)").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ("0000" + tm[k]).substr(0 - RegExp.$1.length));
        }
    }
    return fmt;
};

//时间戳转换为可读时间格式
Number.prototype.date = function (fmt) {
    return (new Date(this * 1000)).format(fmt);
};

//去除<*>,冒号和空格
String.prototype.text = function () {
    return this.replace(/(\<.*?\>)|[\:\：\*]|(\s*?)/gi, "");
};

String.prototype.ucfirst = function () {
    if (!this) return '';
    return this[0].toUpperCase() + this.substr(1).toLowerCase();
};


/**
 * 拆分位运算的和值
 * 例：7=1+2+4；10=2+8
 * 1|2|4=7
 */
Number.prototype.bit = function () {
    let n = this;
    let i = 1, val = [];
    while (n > 0) {
        if (i & n) val.push(i), n -= i;
        i *= 2;
    }
    return val;
};

/**
 * 将金额转换为大写
 * @returns {string}
 */
Number.prototype.rmb = function () {
    let number = this;
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    let head = number < 0 ? '-' : '';
    number = Math.abs(number);
    let s = '';
    for (let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(number * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    number = Math.floor(number);
    for (let v = 0; v < unit[0].length && number > 0; v++) {
        let p = '';
        for (let j = 0; j < unit[1].length && number > 0; j++) {
            p = digit[number % 10] + unit[1][j] + p;
            number = Math.floor(number / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][v] + s;
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
};

//给一个时间戳，计算倒计时
Number.prototype.clock = function (over) {
    let time = this;
    let offTime = time - Math.floor((new Date()).valueOf() / 1000);
    if (offTime <= 0) return over || '';

    let days = Math.floor(offTime / 86400);
    let hour = Math.floor(offTime % 86400 / 3600);
    let minute = Math.floor(offTime % 3600 / 60);
    let second = (offTime % 60);
    let html = '';
    if (days > 0) {
        html += `${days}天`;
    }
    if (hour > 0) {
        html += `${hour}小时`;
    }
    if (minute > 0) {
        html += `${minute}分钟`;
    }
    html += `${second}秒`;
    return html;
};

/*
 货币格式化-￥2,342.00，
 decimal     小数位数，默认2位
 thousands   带千分位,默认不带，
 */
Number.prototype.format = function (decimal, thousands) {
    decimal = decimal || 2;
    let w = Math.pow(10, decimal);
    let n = Math.round(parseFloat(this) * w) / w;
    if (decimal > 0 && String(n).indexOf('.') < 0) {
        n = n + '.' + '0'.repeat(decimal);
    }
    return !thousands ? n : n.toLocaleString();
};

String.prototype.format = function (decimal, thousands) {
    return Number(this).format(decimal, thousands);
};

//组合URL参数
String.prototype.build_query = function (params) {
    if (!params || (params === undefined) || Object.keys(params).length === 0) return this;
    let arg = [],
        url = this;
    for (let k in params) {
        arg.push(k + '=' + params[k])
    }
    url += (url.indexOf('?') > 0) ? '&' : '?';
    return url + arg.join('&');
};

/**
 * 获取URL地址的一个参数
 * window.location.href.get('key')
 * @param name
 * @returns {any}
 */
String.prototype.get = function (name) {
    let url = this || window.location.href;
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let mth = url.substr(url.indexOf("?") + 1).match(reg);
    return mth ? decodeURI(mth[2]) : null;
};


/**
 * 查询某个网址的上级目录
 * @param lev=0，当前目录，0需明确指定
 lv=1，上一级目录，【默认值】
 lv=X，上X级目录
 */
String.prototype.parent = function (lev) {
    if (typeof lev === "undefined") lev = 1;
    let url = this || window.location.href;
    url = url.substr(0, url.lastIndexOf("/"));
    if (lev === 0) return url;
    for (let i = 0; i < lev; i++) {
        url = url.substr(0, url.lastIndexOf("/"));
    }
    return url;
};

//当前网址的目录，与url.parent(0)相同
String.prototype.path = function () {
    let url = this || window.location.href;
    return url.substr(0, url.lastIndexOf("/"));
};

//当前网址的域名
String.prototype.domain = function () {
    let url = this || window.location.href;
    return url.split("/")[2] || '';
};

//当前网址的根域名
String.prototype.host = function () {
    let dom = (this || window.location.href).split("/")[2].split(".");
    let host = dom.slice(-2).join('.'), host2;
    ['com', 'net', 'org', 'gov', 'idv', 'co', 'name'].some(a => {
        ['cn', 'cm', 'my', 'ph', 'tw', 'uk', 'hk'].some(b => {
            if (`${a}.${b}` === host) {
                host2 = dom.slice(-3).join('.');
                return true;
            }
        });
        if (host2) return true;
    });
    return host2 || host;
};

/**
 * 复制文本
 */
String.prototype.copy = function (fun) {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", this);
    input.setAttribute("style", "width:1px;height:1px;box-sizing:unset;-moz-box-sizing:unset;-webkit-box-sizing:unset;");
    document.getElementsByTagName('body')[0].appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    if (fun) fun(this);
};

Number.prototype.copy = function (fun) {
    String(this).copy(fun);
};


/**
 * 判断密码强度是否符合要求
 * @param i     [数字，大写，小写，符号]的种类数，默认2
 * @returns {boolean}
 */
String.prototype.password = function (i) {
    const pwd = this;
    let len = pwd.length;
    if (len < 3 || len > 30) return false;
    let n = 0;
    if (/\d/.test(pwd)) n++; //包含数字
    if (/[a-z]/.test(pwd)) n++; //包含小写字母
    if (/[A-Z]/.test(pwd)) n++; //包含大写字母
    if (/\W/.test(pwd)) n++; //包含其他字符
    return n >= (i || 2);
};


/**
 * rgba转换为rgb
 * @returns {string}
 */
String.prototype.rgbaRgb = function () {
    // let [r, g, b] = this.match(/\d+/g);
    return this.replace(/\w+\((\d+), (\d+), (\d+), ([\d\.]+)\)/g, function (
        ...v
    ) {
        let color = "#";
        for (let i = 1; i <= 3; i++) {
            color += ("0" + parseInt(v[i]).toString(16)).substr(-2, 2);
        }
        return color;
    });
};

//rgb(123, 20, 30)转换为#7B141E格式
String.prototype.rgbHex = function () {
    let [r, g, b] = this.match(/\d+/g);
    return "#" + ((1 << 24) + (r * 1 << 16) + (g * 1 << 8) + b * 1).toString(16).slice(1).toUpperCase();
};

/**
 * 若带小数，返回原数，如：2.01
 * 若不带小说，则返回整数，如：2.00
 * @returns {*}
 */
String.prototype.intFloat = function () {
    let i = parseInt(this);
    let f = parseFloat(this);
    if (f - i > 0) return this;
    return i;
};
Number.prototype.intFloat = function () {
    let i = parseInt(this);
    let f = parseFloat(this);
    if (f - i > 0) return this;
    return i;
};


//删除指定下标元素
Array.prototype.unset = function (index) {
    return this.filter((k, i) => i !== index);
};

//删除指定值
//对于Object，只能用：obj.filter(tab => tab.name !== key);
Array.prototype.del = function (key) {
    return this.filter(k => k !== key);
};

Array.prototype.min = function () {
    return Math.min(...this.map(n => {
        return Number(n) || 0;
    }));
};
Array.prototype.max = function (v) {
    return Math.max(...this.map(n => {
        return Number(n) || 0;
    }));
};
Array.prototype.in = function (v) {
    let i = 0;
    this.map(n => {
        return n === v ? i++ : '';
    });
    return i > 0;
};

/**
 * TODO 此方法主要是用于console.table打印，实际数据，一般不需要用这个
 * 重新序列化vue里的array，主要是去掉里面附加的属性
 * @param key 先把key项进行json编码
 * @returns {any}
 */
Array.prototype.json = function (...key) {
    let arr = JSON.parse(JSON.stringify(this));
    key.forEach(k => {
        arr.forEach((a, i) => {
            arr[i][k] = JSON.stringify(a[k]);
        });
    });
    return arr;
};

//数组中是否含有value
Array.prototype.has = function (value) {
    return this.some(val => {
        return String(val) === String(value);
    });
};

//数字是否存在于数组值中，判断数组是否有某个下标值，直接用：if(key in array)
Number.prototype.in_array = function (value) {
    return value.some(val => {
        return Number(val) === Number(this);
    });
};

//文本是否存在于数组值中
String.prototype.in_array = function (value) {
    if (typeof value !== 'object') {
        console.log('当前：', typeof value, value);
        throw new Error('in_array的对象须是array类型');
    }
    return value.some(val => {
        return String(val) === String(this);
    });
};

function require(file, fun) {
    // const scriptHost = String(document.scripts[document.scripts.length - 1].src).match(/^(https?:\/\/[\w\.]+)\/.+/i)[1];
    // const path = document.currentScript.src.substr(0, document.currentScript.src.lastIndexOf("/") + 1);
    const host = 'http://debug.vue.com';
    const ref = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    const head = document.getElementsByTagName("head").item(0);
    script.src = scriptHost + file;
    script.async = false;
    // script.type = 'text/javascript';//text/javascript
    script.type = 'module';//text/javascript
    script.onload = function () {
        // console.log('自动加载', path + file);
        // fun();
    };
    head.appendChild(script);
}


String.prototype.CheckCode = function () {

    //date格式化成日期+时间
    console.log('Date.format', (new Date).format('YYYY-MM-DD HH:ii:ss'));
    //时间戳转为日期+时间
    console.log('Number.date', (1590119255).date());


    //字符串格式化
    console.log('String.re', 'my name {{name}},age {{age}},mob {{mob}}'.re({name: 'CNE', age: 18}));
    console.log('String.sprintf', 'u am %s,is %s,age %d,val=%f'.sprintf(...['CNE', 'Man', 18, 12.34]));

    //剔除HTML
    console.log('String.text', '<span>test</span>'.text());

    //随机字符串，随机数字
    console.log('String.rand', ''.rand());
    console.log('Number.rand', (3).rand(2));

    //首字母大写
    console.log('String.ucfirst', 'abc'.ucfirst());

    //rgb(123, 20, 30)转为#aabbcc格式
    console.log('String.rgbHex', 'rgb(123, 20, 30)'.rgbHex());

    //手机号、邮箱格式校验
    console.log('String.is_mob', '15205534455'.is_mob(), '1520553445'.is_mob());
    console.log('String.is_mail', 'abc@abc.com'.is_mail(), 'a.com'.is_mail());
    console.log('String.is_date', 'abc@abc.com'.is_date(), '2020-02-02'.is_date(), '2020-02-29'.is_date());

    //数字格式化
    console.log('String.format,Number.format', (123456.78529).format(3, 0));

    //金额转为人民币大写
    console.log('Number.rmb', (1234656.78).rmb());

    //数组删除指定下标/指定值
    let a = ['a', 'b', 'c'];
    console.log('Array.del', a, a = a.del('b'));
    console.log('Array.unset', a, a.unset(1));
    console.log('Array.min', [1, 2, 4, '5', 's', 'f'].min());
    console.log('Array.max', [1, 2, 4, '5', 's', 'f'].max());
    console.log('Array.in', [1, 2, 4, '5', 's', 'f'].in('s'));


    //base64互转
    let base = '中华人民共和国'.base64_encode();
    console.log('String.base', base.base64_decode(), base);


    //Md5
    console.log('String.md5', 'abc'.md5());


    return true;
};

