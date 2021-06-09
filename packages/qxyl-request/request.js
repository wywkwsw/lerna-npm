import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
// import store from '@/store'
import qs from 'qs'
import { throttle } from 'yjh-utils-one'
import Vue from 'vue'
/*
✘  http://eslint.org/docs/rules/no-unused-vars      'EventBus' is defined but never used
src\views\layout\components\Navbar.vue:8:8
import EventBus from "@/utils/eventBus"
*/

let notLoginConfirm;

const errorConfirm = throttle(function (message) {
    console.log("throttle: error.message", message)
    Message({
        // message: typeof message === 'string' && message.indexOf("timeout") > -1 ? "请求超时" : message === "Network Error" ? "网络错误" : "请求失败",
        message,
        // message: '请求失败',
        type: 'error',
        duration: 5 * 1000
    })
}, 500)

// const notLoginFunc = throttle(function () {
//     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
//         confirmButtonText: '重新登录',
//         cancelButtonText: '取消',
//         type: 'warning'
//     }).then(() => {
//         EventBus.$emit('login')
//         store.dispatch('FedLogOut').then(() => {
//             location.reload() // 为了重新实例化vue-router对象 避免bug
//         })
//     }).catch(() => {
//         notLoginConfirm = false;
//     })
// }, 500)

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 60000,
    maxRedirects: 0,
    // 拦截处理请求数据
    transformRequest: [function (data) {
        data = qs.stringify(data)
        return data
    }],
    // 拦截处理响应数据
    transformResponse: [function (data) {
        return data
    }],
    // post参数，使用axios.post(url,{},config);如果没有额外的也必须要用一个空对象，否则会报错
    data: {},
    // 返回数据类型
    responseType: 'json',
    withCredentials: true,
    validateStatus(status) {
        if (status === 302) {
            return false;
        }
        return true;
    }
})

service.interceptors.request.use(config => {
    if (process.env.VUE_APP_ENV_FLAG === 'config') {
        config.baseURL = Vue.prototype.$configBaseApi
    }
    // 统一添加时间戳参数，清除缓存
    config.url = config.url + '?t=' + +Date.now()
    return config
}, error => {
    Promise.reject(error)
})

service.interceptors.response.use(
    response => {
        if (!response.data) {
            return Promise.reject(new Error('操作失败'));
        } else {
            const res = response.data
            if (res.code !== 1) {
                if (res.code === 10105 || res.code === 10106) {
                    if (notLoginConfirm) {
                        return;
                    }
                    // todo: 同时多个请求时， 只弹出一个提示弹框
                    notLoginFunc();
                    // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    //     confirmButtonText: '重新登录',
                    //     cancelButtonText: '取消',
                    //     type: 'warning'
                    // }).then(() => {
                    //     EventBus.$emit('login')
                    //     store.dispatch('FedLogOut').then(() => {
                    //         location.reload() // 为了重新实例化vue-router对象 避免bug
                    //     })
                    // }).catch(() => {
                    //     notLoginConfirm = false;
                    //     // store.dispatch('FedLogOut').then(() => {
                    //     //     location.reload() // 为了重新实例化vue-router对象 避免bug
                    //     // })
                    // })
                    notLoginConfirm = true;
                    return Promise.reject('error')
                } else {
                    if (res.code === 10204) {
                        // Message({
                        //     message: '系统异常',
                        //     type: 'error'
                        // })
                        errorConfirm("系统异常")
                        return Promise.reject(new Error('系统异常'))
                    } else if (res.code === 10205) {
                        // Message({
                        //     message: '请求超时',
                        //     type: 'error'
                        // })
                        errorConfirm("请求超时")
                        return Promise.reject(new Error('请求超时'))
                    } else if (res.code === 403) {
                        errorConfirm("没有访问权限")
                        return Promise.reject(new Error('没有访问权限'));
                    }
                    notLoginConfirm = false;
                    return response.data
                }
            } else {
                notLoginConfirm = false;
                return response.data
            }
        }
    },
    error => {
        // 只弹一次提示
        errorConfirm("请求失败");
        // Message({
        //     // message: error.message,
        //     message: '请求失败',
        //     type: 'error',
        //     duration: 5 * 1000
        // })
        return Promise.reject(new Error('请求失败'))
        // 正式版本不会存在代码错误，故注释
        // return Promise.reject({
        //   error: error,
        //   code: 'requestError',
        //   isByReq: 1 // 对错误信息进一步封装，该参数若为1即代表是请求抛出的错误
        // })
    }
)

export default service
