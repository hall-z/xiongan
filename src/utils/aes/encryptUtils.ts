import { Constant } from '@/enums/constant'

import { useUserStore } from '@/store'
import { Decrypt, Encrypt } from '@/utils/aes/aesMgr'
import { decrypt } from '@/utils/aes/jsencrypt'
import PLATFORM from '@/utils/platform'
import { Base64 } from 'js-base64' // 引入
import { md5 } from 'js-md5'
import { createFilter } from './filter'
import { uuid } from './uuid'
//  需要的固定常量数据
export const constast = () => {
  const userStore = useUserStore()

  return {
    appKey: Constant.APP_KEY,
    timestamp: getTimeStamp(),
    replay: uuid(),
    userId: userStore.userInfo.userDId,
    userDId: userStore.userInfo.userDId,
    phone: userStore.userInfo.userPhone,
    merchantId: userStore.userInfo.merchantId,
    cardId: userStore.userInfo.cardId,
    // shopId: userStore.userInfo.merchantId,
    terminal: PLATFORM.platform,
  }
}

// 生成时间
export function getTimeStamp() {
  const date = Date.parse(new Date() as any)
  return date
}
export function convertObjToStr(obj: any) {
  const arr = []
  let num = 0
  let str = ''
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // 判断空格的情况
      obj[key] = obj[key].trim()
    }
    if (obj[key] || obj[key] === false) {
      arr[num] = key
      num++
    } else if (obj[key] === 0) {
      arr[num] = key
      num++
    }
  }
  const sortArr = arr.sort()
  if (Object.keys(arr).length <= 0) {
    str = ''
  } else {
    for (const i in sortArr) {
      if (obj[sortArr[i]] instanceof Array && obj[sortArr[i]].length !== 0) {
        str = str + sortArr[i] + '=' + JSON.stringify(obj[sortArr[i]]) + '&'
      } else if (obj[sortArr[i]] instanceof Array && obj[sortArr[i]].length === 0) {
        str += sortArr[i] + '=[]&'
      } else {
        str += sortArr[i] + '=' + obj[sortArr[i]] + '&'
      }
    }
  }
  return str
}

// 签名生成
export function sign(obj: any) {
  let str = convertObjToStr(obj)
  str = str.slice(0, str.length - 1)
  const md5Str = md5(str)
  return Encrypt(md5Str)
}

// 请求拦截参数处理
export function beforeQuest(method: any) {
  const { config, data, params } = method
  const ignoreSign = method?.meta?.ignoreSign
  const isinitParams = method?.meta?.initParams ?? true
  // 数据合并转换

  const initParams = isinitParams ? { ...constast() } : {}
  if (isinitParams) {
    // #ifdef APP-PLUS
    initParams.appKey = Constant.APP_KEY_ANDROID
    // #endif
    // #ifdef MP-ALIPAY
    initParams.appKey = Constant.APP_KEY_ALIPAY
    // #endif
  }

  if (method.type === 'GET') {
    method.params = {
      ...initParams,
      ...params,
    }
    config.headers.sign = !ignoreSign ? sign(method.params) : ''
  }
  if (method.type === 'POST') {
    method.data = {
      ...initParams,
      ...data,
    }

    config.headers.sign = !ignoreSign ? sign(method.data) : ''
  }
  console.log('请求入参==>', method.url, method.data)

  createFilter(method)
}

// 返回数据cont处理配置
export function changeRes(res: any, code: string) {
  const count: number = (res.header.count || res.header.Count) * 1

  if (count > 0) {
    for (let i = 0; i < count; i++) {
      code = Base64.decode(code)
    }
  }
  return code
}
// 返回参数解密
export function responseAes(res: any) {
  const aesRes = decrypt(res.header.responsek ?? res.header.ResponseK)
  const aesResiv = decrypt(res.header.responsev ?? res.header.Responsev)
  if (!aesRes || !aesResiv) {
    return { msg: '数据提示:系统解密异常!' }
  }
  return JSON.parse(Decrypt(res.data, aesRes, aesResiv) as any)
}
