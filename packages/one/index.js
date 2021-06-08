import pinyin from "tiny-pinyin";
import Vue from 'vue';
const ieVersion = Vue.prototype.$isServer ? 0 : Number(document.documentMode);

export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function getParentCompByName(context, name) {
    var parent = context.$parent
    while (parent) {
        if (parent.$options.name !== name) {
            parent = parent.$parent
        } else {
            return parent
        }
    }
    return null
}

export function getChildCompsByName(context, name) {
    var result = []
    var childrens = context.$children
    while (childrens && childrens.length > 0) {
        childrens.forEach(function (child) {
            childrens = child.$children ? child.$children : null
            if (child.$options.name === name) {
                result.push(child)
            }
        })
    }
    return result
}
//防抖
export function debounce(fn, who, delay) {
    var timeoutID = null
    return function () {
        clearTimeout(timeoutID)
        var args = arguments
        var that = who

        timeoutID = setTimeout(function () {
            fn.apply(that, args)
        }, delay)

    }
}

//节流 时间戳
export function throttle(fn, delay) {
    var prev = Date.now();
    return function () {
        var context = this;
        var args = arguments;
        var now = Date.now();
        if (now - prev >= delay) {
            fn.apply(context, args);
            prev = Date.now();
        }
    }
}

//节流 定时器
export function throttleTwo(fn, delay) {
    var timer = null;
    return function () {
        var context = this;
        var args = arguments;
        if (!timer) {
            timer = setTimeout(function () {
                fn.apply(context, args);
                timer = null;
            }, delay);
        }
    }
}

//取出两个数组不同的元素
export function getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
    });
}

//取出两个数组相同的元素
export function getArrEqual(arr1, arr2) {
    let newArr = [];
    for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
            if (arr1[j] === arr2[i]) {
                newArr.push(arr1[j]);
            }
        }
    }
    return newArr;
}

// 数组以及对象深拷贝
export function deepClone(o) {
    // 把o instanceof Array 放在 o instanceof Object上面
    // 因为如果是数组的话，instanceof Object也返回true。
    // debugger
    if (o instanceof Array) {
        /*eslint-disable*/
        var n = [];
        for (let i = 0; i < o.length; ++i) {
            n[i] = deepClone(o[i]);
        }
        return n;
    } else if (o instanceof Object) {
        var n = {};
        for (var i in o) {
            // console.log(i)
            n[i] = deepClone(o[i]);
        }
        return n;
    } else {
        return o;
    }
}

//获取当前时间，格式yyyy-MM-dd HH:mm:ss
export function getNowFormatDate() {
    let date = new Date();
    let seperator1 = "-";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }
    let currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + hours + ":" + minutes + ":" + seconds;
    return currentdate;
}

//判断是否为null
export function isNull(value) {
    if (!value && typeof (value) != "undefined" && value != 0) {
        return true;
    } else {
        return false
    }

}

//模糊搜索
export function fuzzySearch(total, library, searchValue, typeOne, typeTwo, typeThree) {
    let str = searchValue.trim()
    if (str === '') {
        return JSON.parse(JSON.stringify(total))
    } else {
        let arr = []
        if (typeThree) {
            library.filter((item) => {
                if (item[typeOne].indexOf(str) != -1 || item[typeTwo].indexOf(str) != -1 || item[typeThree].indexOf(str) != -1) {
                    arr.push(item)
                }
            })
        } else if (typeTwo) {
            library.filter((item) => {
                if (item[typeOne].indexOf(str) != -1 || item[typeTwo].indexOf(str) != -1) {
                    arr.push(item)
                }
            })
        } else {
            library.filter((item) => {
                if (item[typeOne].indexOf(str) != -1) {
                    arr.push(item)
                }
            })
        }
        return arr
    }
}

//判断是否为空对象空数组
export function isEmptyObject(obj) {
    for (let key in obj) {
        return false
    }
    return true
}

//解析文本\r\n
export function analysisText(str) {
    let newStr = str.replace(/\r\n/g, "<br/>");
    return newStr
}

//判断请求是否是成功状态
export function isRequestSuccess(res) {
    return (res.hasOwnProperty('code') && res.code === 1);
}

//判断是否为空值( '' || undefined || null)
export function isEmpty(value) {
    return !value && value !== 0
}

//判断是否为真(0 || '' || undefined || null)
export function isExist(value) {
    return !!value
}

//数组中对象根据某个属性去重
export function reduce(arr, property) {
    var hash = {};
    arr = arr.reduce(function (item, next) {
        hash[next[property]] ? '' : hash[next[property]] = true && item.push(next);
        return item
    }, [])
    return arr
}

//sort方法根据数组中对象的某个属性排序,第二个参数不传递，默认表示升序排序
export function compare(attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = (rev) ? 1 : -1;
    }
    return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}

/*
 * get date information
 * @param { dateStr } dateStr input (''/null/undefined/Date对象/时间戳/'yyyy-MM-dd'/...,注: 只要是new Date()支持的参数格式即可)
 * @return { Object } dateInfo output
 */
export function getDateInfo(dateStr) {
    if (!!dateStr && typeof dateStr === 'string' && dateStr.indexOf('T') !== -1) {
        dateStr = dateStr.replace('T', ' ');
    }
    let date = !!dateStr ? new Date(dateStr) : new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let week = date.getDay()
    let yearFull = formatNumber(year)
    let monthFull = formatNumber(month)
    let dayFull = formatNumber(day)
    let hourFull = formatNumber(hour)
    let minuteFull = formatNumber(minute)
    let secondFull = formatNumber(second)
    let dateInfoDate = yearFull + '-' + monthFull + '-' + dayFull
    let dateInfoDatePure = year + '-' + month + '-' + day
    let timeStamp = + date
    // let separator = '-'
    let weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    let weekdayShorts = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let quarter = 0
    month > 0 && month < 4 ? quarter = 1 : month > 3 && month < 7 ? quarter = 2 : month > 6 && month < 10 ? quarter = 3 : month > 9 && month < 13 ? quarter = 4 : 0
    let quarterChinese = convertToChinaNum(quarter)
    let dateInfo = {
        date: dateInfoDate,
        dateShort: year + '-' + month + '-' + day,
        dateMonthDay: monthFull + '-' + dayFull,
        dateStr: yearFull + monthFull + dayFull,
        year: year,
        month: month,
        monthFull: monthFull,
        day: day,
        dayFull: dayFull,
        hour: hour,
        hourFull: hourFull,
        minute: minute,
        minuteFull: minuteFull,
        second: second,
        secondFull: secondFull,
        time: dateInfoDatePure + ' ' + hour + ':' + minute + ':' + second,
        timeFull: dateInfoDate + ' ' + hourFull + ':' + minuteFull + ':' + secondFull,
        times: dateInfoDatePure + ' ' + hourFull + ':' + minuteFull,
        ts: timeStamp,
        week: week,
        weekday: weekdays[week],
        weekdayShort: weekdayShorts[week],
        chineseCharacter: `${year}年${monthFull}月${dayFull}日`,
        noSecond: `${dateInfoDate} ${hourFull}:${minuteFull}`,
        quarter: quarter,
        quarterChinese: quarterChinese,
        quarterChineseFull: `第${quarterChinese}季度`,
        noDay: hour + ':' + minute + ':' + second,
        noDayFull: hourFull + ':' + minuteFull + ':' + secondFull
    }
    // 若 dateStr 参数为空，则清空值
    if (!dateStr) {
        Object.keys(dateInfo).forEach(function (key) {
            dateInfo[key] = '';
        });
    }
    return dateInfo
}

export function formmateDate(startTime, endTime) {
    // 以天数为参考点， 7天以内包括7 startTime < endTime（系统当前时间，从后台获取）
    let stime = new Date(startTime),
        etime = new Date(endTime),
        difference = Date.parse(etime) - Date.parse(stime), //时间差的毫秒数
        weekdays = [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
        ],
        result = startTime;
    let month = formatNumber(stime.getMonth() + 1)
    if (etime.getFullYear() - stime.getFullYear() > 0) {
        result =
            formatNumber(stime.getFullYear()) +
            "-" +
            month +
            "-" +
            formatNumber(stime.getDate());
    } else {
        if ((etime.getMonth() + 1) - (stime.getMonth() + 1) > 0) {
            if (difference <= 7 * 24 * 3600 * 1000) {
                let week = stime.getDay();
                result = weekdays[week];
            } else {
                result = month + "-" + formatNumber(stime.getDate());
            }
        } else {
            if (
                etime.getDate() - stime.getDate() > 0 &&
                etime.getDate() - stime.getDate() < 2
            ) {
                result = "昨天";
            } else if (
                etime.getDate() - stime.getDate() > 1 &&
                etime.getDate() - stime.getDate() < 8
            ) {
                let week = stime.getDay();
                result = weekdays[week];
            } else if (etime.getDate() - stime.getDate() > 7) {
                result = month + "-" + formatNumber(stime.getDate());
            } else {
                let h = formatNumber(stime.getHours()),
                    m = formatNumber(stime.getMinutes());
                result = h + ":" + m;
            }
        }
    }
    return result;
}

export function formatNumber(number) {
    return number <= 9 ? ('0' + number) : number
}

//获取选中日期是当年的第几周
export function getWeekOfYear(val) {
    let today = new Date(val);
    let firstDay = new Date(today.getFullYear(), 0, 1);
    let dayOfWeek = firstDay.getDay();
    let spendDay = 1;
    if (dayOfWeek != 0) {
        spendDay = 7 - dayOfWeek + 1;
    }
    firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
    let d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
    let result = Math.ceil(d / 7);
    result = result + 1
    return today.getFullYear() + '年' + result;
}

//将数字转换为汉字
export function convertToChinaNum(num) {
    var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
    var arr2 = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿');//可继续追加更高位转换值
    if (!num || isNaN(num)) {
        return "零";
    }
    var english = num.toString().split("")
    var result = "";
    for (var i = 0; i < english.length; i++) {
        var des_i = english.length - 1 - i;//倒序排列设值
        result = arr2[i] + result;
        var arr1_index = english[des_i];
        result = arr1[arr1_index] + result;
    }
    //将【零千、零百】换成【零】 【十零】换成【十】
    result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
    //合并中间多个零为一个零
    result = result.replace(/零+/g, '零');
    //将【零亿】换成【亿】【零万】换成【万】
    result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
    //将【亿万】换成【亿】
    result = result.replace(/亿万/g, '亿');
    //移除末尾的零
    result = result.replace(/零+$/, '')
    //将【零一十】换成【零十】
    //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
    //将【一十】换成【十】
    result = result.replace(/^一十/g, '十');
    return result;
}

//计算两个日期之间的时间差
export function GetDateTimeDiff(startTime, endTime) {
    var retValue = {};
    var stime = Date.parse(new Date(startTime));
    var etime = Date.parse(new Date(endTime))
    var date3 = etime - stime;  //时间差的毫秒数

    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    retValue.Days = days;

    var years = Math.floor(days / 365);
    retValue.Years = years;

    var months = Math.floor(days / 30);
    retValue.Months = months;

    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    retValue.Hours = hours;

    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    retValue.Minutes = minutes;

    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    retValue.Seconds = seconds;

    var strTime = "";
    if (years >= 1) {
        strTime = years + "年前";
    } else if (months >= 1) {
        strTime = months + "个月前";
    } else if (days >= 1) {
        strTime = days + "天前";
    } else if (hours >= 1) {
        strTime = hours + "小时前";
    } else {
        strTime = minutes + "分钟前";
    }
    retValue.PubTime = strTime;     //帖子,文章,博客发表时间的一种简短表示方法
    return retValue;
}

export function compareDate(d1, d2) {
    return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
}

export function dateDifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
    let dateSpan
    let dateObj = {}
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateObj.large = dateSpan > 0 ? true : false
    // dateSpan = Math.abs(dateSpan);
    dateObj.iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    dateObj.iDays = dateSpan / (24 * 3600 * 1000);
    return dateObj
};

//   合并单元格 数据格式转换 ，   指控体系 - 考核表格处使用  （后期可以优化数据结构，就不使用该方法了。 ）
export function tyMergeCells(cols) {    //sDate1和sDate2是2006-12-18格式
    //  合并单元格
    let keys = null;
    let mergeCells = [];
    function numAtArrayCount(arr, num) {
        return arr.lastIndexOf(num) - arr.indexOf(num) + 1;
    }
    for (let i = 0; i < cols.length; i++) {
        let mark = cols[i].mark;
        if (Array.isArray(mark) && mark.length > 0) {
            for (let j = 0; j < mark.length; j++) {
                if (mark[j] != 0) {
                    keys = mark[j];
                    let indexs = mark.indexOf(keys);
                    let num = numAtArrayCount(mark, keys);
                    if (num > 1) {
                        let row = cols[i].sortno - 1;
                        let col = indexs;
                        let Obj = {
                            row: col,
                            col: row,
                            rowspan: num,
                            colspan: 1
                        };
                        if (
                            JSON.stringify(mergeCells).indexOf(
                                JSON.stringify(Obj)
                            ) == -1
                        ) {
                            mergeCells.push(Obj);
                        }
                    }
                }
            }
        }
    }
    console.log('合并转换后的数据', mergeCells)
    return mergeCells
};
//  数组改为字符串以','逗号，连接为字符串  并去除最后一个字符串 （可优化，  现在仅限于数组元素都存在）
export function ArrayToString(Arr) {    //sDate1和sDate2是2006-12-18格式
    let Str = ''
    for (let i = 0; i < Arr.length; i++) {
        if (i == Arr.length - 1) {
            Str += Arr[i];
        } else {
            Str += Arr[i] + ",";
        }
    }
    return Str
};

// 数据转化  ，  将 科室 name  转为  osid
export function NameChangeID(mydata, dataname) {
    let data = mydata
    let selectName = []
    let selectOptions = JSON.parse(dataname)
    for (let i = 0; i < selectOptions.length; i++) {
        selectName.push(selectOptions[i].name)
    }
    data.find((item, index, arr) => {
        item.find((ones, oneindex, arrones) => {
            selectName.find((values, indexs, arrs) => {
                if (values == ones) {
                    data[index][oneindex] = selectOptions[indexs].osid
                }
            })
        })
    })
    return data
};

//  数据转换，   合并单元格后将缺失信息补全
export function mergeCellsChangedata(mydata, mergeCells) {
    let data = mydata
    let mergeCell = mergeCells
    data.find((item, row, arr) => {
        item.find((ones, col, arrones) => {
            for (let i = 0; i < mergeCell.length; i++) {
                if (mergeCell[i].col == col) {
                    if (mergeCell[i].row == row) {

                    } else if (row > mergeCell[i].row && row < mergeCell[i].rowspan + mergeCell[i].row) {
                        data[row][col] = data[mergeCell[i].row][mergeCell[i].col]
                    }
                }
            }


        })
    })
    return data
};

// 原始数据数字类型  null 转化为 -1234
export function nullChangeNub(mydata, tableCol) {
    let data = mydata
    let thArry = tableCol
    let typeNumArr = []
    console.log(mydata, tableCol)
    for (let i = 0; i < thArry.length; i++) {
        if (thArry[i].coltype == '1' || thArry[i].coltype == 1) {
            if (thArry[i].colvaluetype == '2' || thArry[i].colvaluetype == 2) {
                typeNumArr.push({
                    type: 'yiwei',
                    value: i
                })
            } else if (thArry[i].colvaluetype == '3' || thArry[i].colvaluetype == 3) {
                typeNumArr.push({
                    type: 'erwei',
                    value: i
                })
            } else {
                typeNumArr.push({
                    type: 'zhnegshu',
                    value: i
                })
            }
        }
    }
    data.find((item, index, arr) => {
        item.find((ones, oneindex, arrones) => {
            typeNumArr.find((tyrow, indexs, arrs) => {
                if (tyrow.value == oneindex) {
                    if (data[index][oneindex] == null || typeof data[index][oneindex] == 'string') {
                        data[index][oneindex] = -1234
                    } else {
                        if (tyrow.type == 'yiwei') {
                            data[index][oneindex] = data[index][oneindex] == -1234 ? null : data[index][oneindex]
                        } else if (tyrow.type == 'erwei') {
                            data[index][oneindex] = data[index][oneindex] == -1234 ? null : data[index][oneindex]
                        } else {
                            data[index][oneindex] = data[index][oneindex] == -1234 ? null : data[index][oneindex]
                        }
                    }
                }
            })
        })
    })
    return data
};
//伪数组转成数组
export function makeArray(arr) {
    if (arr.item) {
        var len = arr.length;
        var array = [];
        while (len--) {
            array[len] = arr[len];
        }
        return array;
    }
    return Array.prototype.slice.call(arr);
}

/*质量检查模块 表名拼接
* type 类型
* dateType 考核时间类型
* template 模板名称
* objectType 考核对象
* other 其它信息
* */
export function titleSplicing(type, dateType, objectType, template, other) {
    if (type === "1") {
        return `${dateType}${template}${other}`
    } else if (type === "2") {
        return `${dateType}${objectType}${template}${other}`
    } else if (type === "3") {
        return `${dateType}${objectType}${other}`
    }
}

export function flatArray(arr) {
    if (Array.prototype.flat) {
        return Object.prototype.toString.call(arr).toLowerCase() == "[object array]"
            ? Array.from(new Set(arr.flat(Infinity)))
            : []
    } else {
        return Object.prototype.toString.call(arr).toLowerCase() == "[object array]"
            ? flattenDeep(arr)
            : []
    }
}
// flat兼容方法
function flattenDeep(arr) {
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

//拼音搜索，包含首字母搜索
export function searchWithPinyin(keywords = "", name = "") {
    if (name.indexOf(keywords) > -1) {
        return true;
    }
    // if (pinyin.isSupported()) {
    //   return false;
    // }
    let pinyinName = pinyin.convertToPinyin(name, ""), headpinyinName = pinyin.convertToPinyin(name, "-").split("-").map(item => item.slice(0, 1).toUpperCase()).join("");
    if (pinyinName.indexOf(keywords.toUpperCase()) > -1) {
        return true;
    }
    if (headpinyinName.indexOf(keywords.toUpperCase()) > -1) {
        return true;
    }
    return false;
}


// 获取格式化时间
// @params { date: [Object Date] <required> **原始日期对象 }
// @params { format String 日期格式, 默认格式：yyyy-MM-dd hh:mm:ss }
export function getFormatDate(date, format) {
    if (typeof format !== "string" || Object.prototype.toString.call(date) !== "[object Date]") {
        throw new ReferenceError("TypeError, String or Date Object required");
    } else {
        let year = date.getFullYear(),
            month = ('0' + (date.getMonth() + 1)).slice(-2),
            day = ('0' + date.getDate()).slice(-2),
            hours = ('0' + date.getHours()).slice(-2),
            minutes = ('0' + date.getMinutes()).slice(-2),
            seconds = ('0' + date.getSeconds()).slice(-2)
        return format.replace("yyyy", year).replace("MM", month).replace("dd", day).replace("hh", hours).replace("mm", minutes).replace("ss", seconds);
    }
}

const camelCase = function (name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

export const getStyle = ieVersion < 9 ? function (element, styleName) {
    if (isServer) return;
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'styleFloat';
    }
    try {
        switch (styleName) {
            case 'opacity':
                try {
                    return element.filters.item('alpha').opacity / 100;
                } catch (e) {
                    return 1.0;
                }
            default:
                return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
        }
    } catch (e) {
        return element.style[styleName];
    }
} : function (element, styleName) {
    if (isServer) return;
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    try {
        var computed = document.defaultView.getComputedStyle(element, '');
        return element.style[styleName] || computed ? computed[styleName] : null;
    } catch (e) {
        return element.style[styleName];
    }
};

//合并单元格
export function getRowspanWithTwoKeys(data, key, value, row, index, key1, key2) {
    const len = data.length
    const prev = data[index - 1]
    const curr = data[index]
    const next = data[index + 1]
    if (len === 0) {
        return 1
    }
    const _key = key1 || key
    if (prev && prev[_key] === curr[_key] && prev[key2] === curr[key2]) { // 上一行有值 && 当前行与之相等 => 返回 0
        return 0
    }
    if (next && curr[_key] === next[_key] && curr[key2] === next[key2]) { // 下一行有值 && 当前行与之相等 => 返回计算的 rowspan 值
        let moreIndex = index + 2
        while (moreIndex < len && data[moreIndex - 1][_key] === data[moreIndex][_key] && data[moreIndex - 1][key2] === data[moreIndex][key2]) { // 未超出 index && 下一行与下下一行相等 => ++moreIndex
            moreIndex++
        }
        return moreIndex - index
    }
    return 1
}

/**
 * 根据条件筛选树形数组，然后返回筛选后的树形数组
 * @param {*} tree 原始树形数组
 * @param {*} validate 条件函数
 * @param {*} param 参数
 * @param {*} arr 新的树形数据
 * @param {*} alias children 别名
 * @returns 
 */
export function filterTree(tree = [], validate = () => { }, param = [], arr = [], alias = "children") {
    if (!tree.length) return []
    for (let item of tree) {
        if (!validate.apply(null, [item, ...param])) continue
        let node = { ...item, [alias]: [] }
        arr.push(node)
        if (item[alias] && item[alias].length) filterTree(item[alias], validate, param, node[alias], alias)
    }
    return arr
}