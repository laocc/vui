// window.$ = layui.$;



function appendCSS(cssText) {
    const style = document.createElement("style"), //创建一个style元素
        head = document.head || document.getElementsByTagName("head")[0]; //获取head元素
    style.type = "text/css"; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
    if (style.styleSheet) {
        //IE
        const func = function () {
            try {
                //防止IE中stylesheet数量超过限制而发生错误
                style.styleSheet.cssText = cssText;
            } catch (e) {
            }
        };
        //如果当前styleSheet还不能用，则放到异步中则行
        if (style.styleSheet.disabled) {
            setTimeout(func, 10);
        } else {
            func();
        }
    } else {
        //w3c
        //w3c浏览器中只要创建文本节点插入到style元素中就行了
        const textNode = document.createTextNode(cssText);
        style.appendChild(textNode);
    }
    head.appendChild(style);
}

//数组长度，可计算有键名的数组，若是无键名的，可以直接用 arr.length
function count(arr) {
    let i = 0;
    for (let c in arr) i++;
    return i - 1;
}

//数组对比，两个无键名数组是否有相同内容
function same(arr1, arr2) {
    return arr1.sort().toString() === arr2.sort().toString();
}

//生成一个min到max的随机整数
function rand(min, max) {
    min = min ? min : 1;
    max = max ? max : 99999999999;
    return Math.round((max - min) * Math.random() + min);
}

function isset($val) {
    return typeof $val !== "undefined";
}

//加载文件,多个文件用数组引入
function load(file) {
    if (typeof file === "object") {
        for (key in file) {
            load(file[key]);
        }
        return;
    }
    //let scriptTag = document.getElementById('loadScript');
    let head = document.getElementsByTagName("head").item(0);
    //if(scriptTag) head.removeChild(scriptTag);
    let script = document.createElement("script");
    script.src = file;
    script.type = "text/javascript";
    //script.id = 'loadScript';
    head.appendChild(script);
}

//浏览器内核
function browser_name() {
    let agent = navigator.userAgent;
    if (agent.indexOf("MSIE") > 0) {
        return "ie";
    } else if (agent.indexOf("Edge") > 0) {
        return "edge";
    } else if (agent.indexOf("QQBrowser") > 0) {
        return "qq";
    } else if (agent.indexOf("TheWorld") > 0) {
        return "theworld";
    } else if (agent.indexOf("Chrome") > 0) {
        return "chrome";
    } else if (agent.indexOf("Firefox") > 0) {
        return "firefox";
    } else if (agent.indexOf("Safari") > 0) {
        return "safari";
    } else if (agent.indexOf("Camino") > 0) {
        return "camino";
    } else if (agent.indexOf("Gecko") > 0) {
        return "gecko";
    } else {
        return null;
    }
}

function lowIE() {
    return /MSIE [5-8]/.test(window.navigator.userAgent) ? 1 : 0;
}

//是否在微信浏览器里
function isWeChat() {
    let ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf("micromessenger") > 0;
}

/**
 * 判断是否是手机端
 * @returns {boolean}
 */
function is_wap() {
    let userAgentInfo = navigator.userAgent;
    let Agents = [
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod",
    ];
    let flag = false;
    for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = true;
            break;
        }
    }
    return flag;
}

//获取url  的参数
function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
