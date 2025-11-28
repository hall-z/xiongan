'use strict'
import utils from '@/utils/newretail/utils'
import * as auth from '@/utils/newretail/auth'
import NAVPAGE from '@/utils/newretail/navPage'
// import JSEncrypt from '@/utils/newretail/jsencrypt'
import JSEncrypt from 'jsencrypt'
// 网络异常代码
const ERR_NET_ERROR = -99999
const ERR_ACCESS_TOKEN_FAIL = 19
const ERR_ACCESS_TOKEN_EXPIRED = 20
const ERR_NOT_ACCESS_TOKEN = 21
const LOGIN_FAILED_ACCESS_TOKEN = 20005
const FREEZE_CODE = 23
let loginCount = 0
let resendList: any[] = []

// 取系统配置
const DEF_APP_CONFIG = {
  // 开发环境
  // appId: "wx968d71a3d8e5558b",
  // baseUrl: "https://nrtest.ngrok.gomoretech.com",
  // baseUrl: "http://newretail.ngrok.gomoretech.com",

  // 测试环境82
  appId: 'wx968d71a3d8e5558b',
  // baseUrl: "http://192.168.1.3:8085",
  // 演示环境
  // appId: "wx4211d71800f38996",
  baseUrl: "https://newretaildev.dshxhome.com",

  payMethod: "DINGFUTONG" // SWIFTPASS,WX_MINI_APP,WXA_ISV_PAY //微信服务商,DINGFUTONG
}

export const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : DEF_APP_CONFIG
export const APP_ID = extConfig.appId || DEF_APP_CONFIG.appId
export const BASE_URL = extConfig.baseUrl || DEF_APP_CONFIG.baseUrl
export const APP_VERSION = 'wxapp-1.6.0.0'
export const INTERNAL_VERSION = '1.6.0.0'
export const API_VERSION = '0.0.6'
export const WXA_APPID = DEF_APP_CONFIG.appId
export const TENANT = 'regression'
let OS_VERSION = ''

wx.getSystemInfo({
  success: function (res: any) {
    OS_VERSION = 'wxapp-' + res.version
  }
})

export const PAYMETHOD = DEF_APP_CONFIG.payMethod

/**
 * 执行http请求
 */
export function request(url: string, method = 'GET', data: any = {}, contentType = 'json', dataType = 'json'): Promise<any> {
  const self = this
  console.log(BASE_URL + url)

  if (url.indexOf('sys/options/queryV2') > -1) {
    const PUBLIC_KEY = '30819F300D06092A864886F70D010101050003818D0030818902818100B941E983339F2BD6ED6D08AA9C3B5D744259D39C249136177B14D1FDC9A92D0D3AC6634523A3CA13DEA05F608168BE2FEA1D3EF593D7578EA9590E50689208F04D529D7512449E8EC5C79790F5204B536718C7D7F65E35E009EB3EA929C40F6CF7AA9F0D960E81E99A7C781A62DB3FC595180D16E384B639449C1C31DD625FB90203010001'
    const encrypt = new JSEncrypt()
    console.log(new JSEncrypt(), 'sdjfdfjfskdf')
    encrypt.setPublicKey(PUBLIC_KEY)
    const encryptedAppId = encrypt.encrypt(APP_ID)
    data.encryptedAppId = encryptedAppId
  }

  const headers: any = {}
  if (contentType == 'json') {
    headers['content-type'] = 'application/json'
  } else {
    headers['content-type'] = 'application/x-www-form-urlencoded'
  }

  headers['app-version'] = APP_VERSION
  headers['os-version'] = OS_VERSION
  headers['api-version'] = API_VERSION
  headers['wxa-appid'] = APP_ID

  const tokens = auth.getTokens()
  if (tokens && tokens.accessToken) {
    headers['access-token'] = tokens.accessToken
  }

  function onSucc(res: any, resolve: Function, reject: Function) {
    if (res.header && res.header.Date) {
      const app = getApp()
      const serverTime = new Date(res.header.Date)
      const date = new Date()
      const currentTime = new Date(utils.formatTime(date)).getTime()
      const differenceTime = new Date(utils.formatTime(serverTime)).getTime() - currentTime
      app.globalData.differenceTime = differenceTime
    }

    const ok = (res.statusCode >= 200 && res.statusCode < 300)
    if (!ok) {
      reject({
        code: ERR_NET_ERROR,
        message: '服务器繁忙，请稍后再试~'
      })
      return
    }

    const userData = res.data
    if (userData.code == 0 || userData.repCode == '0000') {
      if (url.indexOf('/mall/store/queryList') >= 0) {
        const time = utils.timestampToTime(new Date().getTime())
        try {
          wx.setStorageSync('wj_queryStoreTime', time)
        } catch (e) { }
      }
      resolve(userData.repCode == '0000' ? userData.repData : userData.data)
    } else {
      const app = getApp()
      if (userData.code == LOGIN_FAILED_ACCESS_TOKEN) {
        if (app && app.globalData.userInfo) {
          app.globalData.userInfo = null
        }
        auth.clearUserInfo()
        auth.clearTokens()
        NAVPAGE.toAuthorize()
      } else if (userData.code != ERR_ACCESS_TOKEN_EXPIRED && userData.code != ERR_ACCESS_TOKEN_FAIL) {
        if (userData.code != ERR_NOT_ACCESS_TOKEN) {
          reject(userData)
        } else {
          const errorData = {
            ...userData,
            message: '登录过期，请重新登录~'
          }
          const page = utils.utilGetCurrentPage()
          if (page && page.route != null && page.route !== '' && page.route !== app.globalData.heavyLoadRoute) {
            app.globalData.heavyLoadRoute = page.route
            auth.clearUserInfo()
            app.globalData.userInfo = null
            page.onShow()
            reject(errorData)
          }
        }
      } else {
        const postData = data
        if (loginCount === 0) {
          resendList.push({
            url: url,
            method: method,
            data: postData,
            contentType: contentType,
            dataType: dataType
          })
          if (resendList.length === 1) {
            self.login()
              .then((data: any) => {
                loginCount = 1
                for (let i = 0; i < resendList.length; i++) {
                  const ele = resendList[i]
                  self.request(ele.url, ele.method, ele.data, ele.contentType, ele.dataType)
                    .then(function (data: any) {
                      resolve(data)
                    }).catch(function (err: any) {
                      reject(err)
                    })
                }
                resendList = []
              })
              .catch((err: any) => {
                reject(userData)
              })
          }
        } else {
          self.request(url, method, postData, contentType, dataType)
            .then(function (data: any) {
              resolve(data)
            }).catch(function (err: any) {
              reject(err)
            })
        }
      }
    }
  }

  return new Promise(function (resolve, reject) {
    const requestTask = wx.request({
      url: BASE_URL + url,
      method: method,
      dataType: dataType,
      data: data,
      header: headers,

      success: function (res: any) {
        onSucc(res, resolve, reject)
      },

      fail: function (res: any) {
        console.error(BASE_URL + url + ' 请求失败返回: ' + JSON.stringify(res))
        let message = res.errMsg
        let code = -1
        if (message.indexOf('timeout') >= 0) {
          code = -1001
          requestTask.abort()
          message = '网络出小差了~'
        }
        if (message.indexOf('request:fail') >= 0) {
          message = '服务器繁忙，请稍后再试~'
        }

        reject({
          code: code,
          message: message
        })
      },

      complete: function () { }
    })
  })
}

function wx_login(): Promise<any> {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res: any) {
        console.debug('!!!微信登录返回结果-----' + JSON.stringify(res))
        if (res.code) {
          resolve(res.code)
        } else {
          reject({
            code: -1,
            message: res.errMsg
          })
        }
      },
      fail: function (res: any) {
        console.log(res)
        auth.clearUserInfo()
        reject({
          code: -1,
          message: res.errMsg
        })
      }
    })
  })
}

function wx_getUserInfo(): Promise<any> {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      success: function (res: any) {
        resolve(res)
      },
      fail: function (res: any) {
        console.log(res)
        reject({
          code: -1,
          message: res.errMsg
        })
      }
    })
  })
}

function wx_getUserProfile(): Promise<any> {
  return new Promise(function (resolve, reject) {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: function (res: any) {
        resolve(res)
      },
      fail: function (res: any) {
        console.log(res)
        reject({
          code: -1,
          message: res.errMsg
        })
      }
    })
  })
}

function wx_checkSession(sessionExpired: boolean): Promise<any> {
  return new Promise(function (resolve, reject) {
    if (sessionExpired) {
      resolve()
      return
    }
    wx.checkSession({
      success: function (res: any) {
        console.debug('!!!微信session_key检验结果-----' + JSON.stringify(res))
        resolve(res)
      },
      fail: function (res: any) {
        console.debug('!!!微信session_key检验结果-----' + JSON.stringify(res))
        auth.clearUserInfo()
        const app = getApp()
        app.globalData.userInfo = null
        reject({
          ...res,
          message: 'checkSession:fail'
        })
      }
    })
  })
}

export function login(userLogin = false, sessionExpired = false, decryptUserInfo = true): Promise<any> {
  const self = this
  let loginCode = ''

  if (!userLogin) {
    return wx_checkSession(sessionExpired)
      .then((res: any) => {
        return wx_login()
      })
      .then(function (code: string) {
        loginCode = code
        return wx_getUserInfo()
      })
      .then(function (res: any) {
        const encryptedUserInfo = decryptUserInfo ? {
          encryptedData: res.encryptedData,
          iv: res.iv
        } : null
        const req = {
          appid: APP_ID,
          code: loginCode,
          encryptedUserInfo: encryptedUserInfo
        }
        return self.post('/newretail/api/wxa/login', req)
      })
      .then(function (data: any) {
        auth.setTokens(data)
        auth.setUser(data)
        auth.getDistributor()
        return data
      })
      .catch((res: any) => {
        console.log(res)
        if (res && res.message != null && res.message.indexOf('checkSession:fail') > -1) {
          return self.login(userLogin, true, decryptUserInfo)
        } else {
          const page = utils.utilGetCurrentPage()
          if (page && page.route != null && page.route !== '' && page.route !== 'pages/mallModule/member/authorize/authorize' && page.route !== 'pages/wxfaceapp/index/index') {
            NAVPAGE.toAuthorize()
          }
        }
      }) as Promise<any>
  } else {
    let req = {} as any
    return wx_getUserProfile()
      .then(function (res: any) {
        const encryptedUserInfo = decryptUserInfo ? {
          encryptedData: res.encryptedData,
          iv: res.iv
        } : null

        req = {
          appid: APP_ID,
          code: loginCode,
          encryptedUserInfo: encryptedUserInfo,
          userInfo: res.userInfo
        }
        return wx_login()
      })
      .then(function (code: string) {
        req.code = code
        return self.post('/newretail/api/wxa/login', req)
      })
      .then(function (data: any) {
        auth.setTokens(data)
        auth.setUser(data)
        auth.getDistributor()
        return data
      })
  }
}

export function get(url: string, data?: any): Promise<any> {
  return this.request(url, 'GET', data)
}

export function post(url: string, data?: any): Promise<any> {
  return this.request(url, 'POST', data)
}

export function put(url: string, data?: any): Promise<any> {
  return this.request(url, 'PUT', data)
}

export function del(url: string, data?: any): Promise<any> {
  return this.request(url, 'DELETE', data)
}

export default {
  APP_ID,
  BASE_URL,
  APP_VERSION: APP_VERSION.split('-')[1],
  PAYMETHOD: DEF_APP_CONFIG.payMethod,
  TENANT,
  request,
  login,
  get,
  post,
  put,
  delete: del
}