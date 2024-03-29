export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero(str) {
    return('00' + str).substr(str.length);
}

// 将16进制转为 字符串
export function hexToString(str) {
    var val = "",
        len = str.length / 2;
    for (var i = 0; i < len; i++) {
        val += String.fromCharCode(parseInt(str.substr(i * 2, 2), 16));
    }
    console.log(val, '16进制转字符串')
    return utf8to16(val);
}
// 处理中文乱码问题
function utf8to16(str) {
    var out,
        i,
        len,
        c;
    var char2,
        char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7: out += str.charAt(i - 1);
                break;
            case 12:
            case 13: char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14: char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        }
    }

    console.log(out, 'out')
    return out;
}


export function uint8ArrayToHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('').toUpperCase();
}

export function HexStringToArray(hex) {

    var buffer = new ArrayBuffer((hex.length) / 2);
    var byteStream = new Uint8Array(buffer);
    var i = 0;
    while (hex.length >= 2) {
        var x = parseInt(hex.substring(0, 2), 16);
        hex = hex.substring(2, hex.length);
        byteStream[i++] = x;
    }
    return byteStream;
}

export function saveJSON(data, filename) {
    if (! data) {
        alert('保存的数据为空');
        return;
    }
    if (! filename) 
        filename = 'json.json'
    
    if (typeof data === 'object') {
        data = JSON.stringify(data, undefined, 4)
    }
    var blob = new Blob([data], {type: 'text/json'}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

export function SaveToLocal(key, value) {
    window.localStorage.setItem(key, value);
}
export function GetFromLocal(key) {
    return window.localStorage.getItem(key);
}


// 格式方法
// 公共方法
export function transitionJsonToString(jsonObj, callback) { // 转换后的jsonObj受体对象
    var _jsonObj = null;
    // 判断传入的jsonObj对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
    if (Object.prototype.toString.call(jsonObj) !== "[object String]") {
        try {
            _jsonObj = JSON.stringify(jsonObj);
        } catch (error) { // 转换失败错误信息
            console.error('您传递的json数据格式有误，请核对...');
            console.error(error);
            callback(error);
        }
    } else {
        try {
            jsonObj = jsonObj.replace(/(\')/g, '\"');
            _jsonObj = JSON.stringify(JSON.parse(jsonObj));
        } catch (error) { // 转换失败错误信息
            console.error('您传递的json数据格式有误，请核对...');
            console.error(error);
            callback(error);
        }
    }
    return _jsonObj;
}
// callback为数据格式化错误的时候处理函数
export function formatJson(jsonObj, callback) { // 正则表达式匹配规则变量
    var reg = null;
    // 转换后的字符串变量
    var formatted = '';
    // 换行缩进位数
    var pad = 0;
    // 一个tab对应空格位数
    var PADDING = '    ';
    // json对象转换为字符串变量
    var jsonString = transitionJsonToString(jsonObj, callback);
    if (! jsonString) {
        return jsonObj;
    }
    // 存储需要特殊处理的字符串段
    var _index = [];
    // 存储需要特殊处理的“再数组中的开始位置变量索引
    var _indexStart = null;
    // 存储需要特殊处理的“再数组中的结束位置变量索引
    var _indexEnd = null;
    // 将jsonString字符串内容通过\r\n符分割成数组
    var jsonArray = [];
    // 正则匹配到{,}符号则在两边添加回车换行
    jsonString = jsonString.replace(/([\{\}])/g, '\r\n$1\r\n');
    // 正则匹配到[,]符号则在两边添加回车换行
    jsonString = jsonString.replace(/([\[\]])/g, '\r\n$1\r\n');
    // 正则匹配到,符号则在两边添加回车换行
    jsonString = jsonString.replace(/(\,)/g, '$1\r\n');
    // 正则匹配到要超过一行的换行需要改为一行
    jsonString = jsonString.replace(/(\r\n\r\n)/g, '\r\n');
    // 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
    jsonString = jsonString.replace(/\r\n\,/g, ',');
    // 特殊处理双引号中的内容
    jsonArray = jsonString.split('\r\n');
    jsonArray.forEach(function (node, index) { // 获取当前字符串段中"的数量
        var num = node.match(/\"/g) ? node.match(/\"/g).length : 0;
        // 判断num是否为奇数来确定是否需要特殊处理
        if (num % 2 && ! _indexStart) {
            _indexStart = index
        }
        if (num % 2 && _indexStart && _indexStart != index) {
            _indexEnd = index
        }
        // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
        if (_indexStart && _indexEnd) {
            _index.push({start: _indexStart, end: _indexEnd})
            _indexStart = null
            _indexEnd = null
        }
    })
    // 开始处理双引号中的内容，将多余的"去除
    _index.reverse().forEach(function (item, index) {
        var newArray = jsonArray.slice(item.start, item.end + 1)
        jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(''))
    })
    // 奖处理后的数组通过\r\n连接符重组为字符串
    jsonString = jsonArray.join('\r\n');
    // 将匹配到:后为回车换行加大括号替换为冒号加大括号
    jsonString = jsonString.replace(/\:\r\n\{/g, ':{');
    // 将匹配到:后为回车换行加中括号替换为冒号加中括号
    jsonString = jsonString.replace(/\:\r\n\[/g, ':[');
    // 将上述转换后的字符串再次以\r\n分割成数组
    jsonArray = jsonString.split('\r\n');
    // 将转换完成的字符串根据PADDING值来组合成最终的形态
    jsonArray.forEach(function (item, index) { // console.log(item)
        var i = 0;
        // 表示缩进的位数，以tab作为计数单位
        var indent = 0;
        // 表示缩进的位数，以空格作为计数单位
        var padding = '';
        if (item.match(/\{$/) || item.match(/\[$/)) { // 匹配到以{和[结尾的时候indent加1
            indent += 1
        } else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/)) { // 匹配到以}和]结尾的时候indent减1
            if (pad !== 0) {
                pad -= 1
            }
        } else {
            indent = 0
        }
        for (i = 0; i < pad; i++) {
            padding += PADDING
        }
        formatted += padding + item + '\r\n'
        pad += indent
    })
    // 返回的数据需要去除两边的空格
    return formatted.trim();
}
