import { baseUrlApi } from '@/interceptors/utils'
import { request } from '@/utils/http'

import { useRequest } from 'alova/client'

import { METHOD_INSTANCE } from '../model/baseModel'

const CONFIG = baseUrlApi('/captcha/config')
const CODE = baseUrlApi('/captcha/getCode')
const RESCONFIG = baseUrlApi('/captcha/getResponseConfig')
const GETDOT = baseUrlApi('/captcha/getDot')
const PHNECODE = baseUrlApi('/member/app/sendVerificationCode')

export const PRIVACY_UPLOAD = baseUrlApi('/zos/app/file/put')

export const UPLOAD_FILE = baseUrlApi('/system/file/api/minio/upload')

export const PRIVACY_FILE_STREAM = baseUrlApi('/system/file/minio/getPrivacyFileStream')

export const GET_UNLIMITED_QRCODE = baseUrlApi('/member/app/xcxLogin/getUnlimitedQRCode')
export const SAVED_OR_UPDATE_PROMOTER = baseUrlApi('/member/app/promoter/saveOrUpdatePromoter')
export const COUNT_STATUS = baseUrlApi('/member/app/promoterBind/countStatus')
export const GET_USER_COUNT_BY_TIME = baseUrlApi(
  '/member/app/promoterBind/getUserCountByTimeWindow',
)
export const GET_USER_LIST_BY_TIME = baseUrlApi('/member/app/promoterBind/getUserListByTime')
export const SAVE_PROMOTER_USER = baseUrlApi('/member/app/promoterBind/saveOrUpdatePromoterBind')
export const GET_PROMOTER_USER_BY_USERID = baseUrlApi('/member/app/promoter/getPromoterByUserId')

export const GET_PROMOTER_USER_BY_ID = baseUrlApi('/member/app/promoter/getPromoterById')
export const CET_BANK_CODE_BY_ID = baseUrlApi('/member/app/cooperativeBankCode/getBankCodeById')
export const CET_PROMOTER_ORG_USER_BY_ID = baseUrlApi(
  '/member/app/promoterOrg/getPromoterOrgUserById',
)

export const CHECK_PROMOTERORG_USER = baseUrlApi(
  '/member/app/promoterOrg/getPromoterOrgUserByUserid',
)
export const GET_ORG_USER_BYUSER_ID = baseUrlApi('/member/app/promoter/getOrgUserByUserId')

// export const UPDATE_STATUS = baseUrlApi('/member/app/promoterUser/updateStatus')
export const UPDATE_STATUS = baseUrlApi('/member/app/promoterBind/saveOrUpdatePromoterRecord')
export const getDot = (config: any) => {
  const methodInstance = request.Post(GETDOT)
  methodInstance.meta = {
    resAll: true,
    ignorEencrypt: true,
  }

  return useRequest(methodInstance, config)
}

/**
 * 获取配置
 * @param params
 */
export const captchaConfig = (config: any) => {
  const methodInstance = request.Post(CONFIG)
  methodInstance.meta = {
    ignoreSign: true,
    ignorEencrypt: true,
    resAll: true,
  }

  return useRequest(methodInstance, config)
}
/**
 * @description: 获取响应配置
 * @param {} config
 * @return {}
 */
export const getResponseConfig = (config: any) => {
  const methodInstance = request.Post(RESCONFIG)
  methodInstance.meta = {
    ignoreSign: true,
    ignorEencrypt: true,
    resAll: true,
  }

  return useRequest(methodInstance, config)
}

/**
 * 获取验证吗
 * @param params
 */
export function getCode(config: any) {
  const methodInstance = request.Post(
    CODE, // 请求地址
    {},
    {
      // #ifndef MP-ALIPAY
      responseType: 'arraybuffer', // 配置参数
      // #endif
      // #ifdef MP-ALIPAY
      dataType: 'arraybuffer',
      // #endif
    },
  )
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
  }
  methodInstance.meta = meta

  return useRequest(methodInstance, config)
}

/**
 * @description:  获取手机验证吗
 * @param {} data
 * @param {} config
 * @return {}
 */
export function getPhoneCode(data: any) {
  // const meta: METHOD_INSTANCE = {
  //   ignoreSign: true,
  //   ignorEencrypt: true,
  //   ignorToken: true,
  // }

  return request.Post(PHNECODE, data)
}

/**
 * @description: 解析加密图片
 * @param {} data
 * @param {} config
 * @return {}
 */
export function getFileParse(data: any, config: any) {
  const methodInstance = request.Post(
    PRIVACY_FILE_STREAM, // 请求地址
    data,
    {
      responseType: 'arraybuffer', // 配置参数
    },
  )

  return useRequest(methodInstance, config)
}

/**
 *  生成二维码接口
 * @param params
 * @returns
 */

export const getUnlimitedQRCode = <T>(params: any) => {
  const meta: METHOD_INSTANCE = {
    Tips: true,
    AnalysisData: true,
  }
  return request.Post<T>(GET_UNLIMITED_QRCODE, params, {
    meta,
  })
}

/**
 * @description: 保存推广人
 * @param {} config
 * @return {}
 */
export function saveOrUpdatePromoter<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(
    SAVED_OR_UPDATE_PROMOTER, // 地址
    data,
    {
      meta,
    },
  )
}
/**
 * @description: 保存用户和推广人绑定信息（小程序）
 * @param {} config
 * @return {}
 */
export function savePromoterUser(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post(
    SAVE_PROMOTER_USER, // 地址
    data,
    {
      meta,
    },
  )
}
/**
 * @description: 统计推广人数
 * @param {} config
 * @return {}
 */
export function getCountStatus<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(
    COUNT_STATUS, // 地址
    data,
  )
}
/**
 * @description: 根据时间窗口统计推广人数
 * @param {} config
 * @return {}
 */
export function getUserCountByTimeWindow<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(
    GET_USER_COUNT_BY_TIME, // 地址
    data,
    {
      meta,
    },
  )
}
/**
 * @description: 根据状态和时间窗口查询推广用户信息
 * @param {} config
 * @return {}
 */
export function getUserListByTime<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(
    GET_USER_LIST_BY_TIME, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 * @description: 获取推广人基础身份信息查询
 * @param {} config
 * @return {}
 */
export function checkBankPromoterByUserId<T>(data?) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(baseUrlApi('/member/app/promoter/checkBankPromoterByUserId'), data, {
    meta,
  })
}
/**
 * @description: 获取推广人基础身份信息查询
 * @param {} config
 * @return {}
 */
export function getPromoterSwitch<T>(data?) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(baseUrlApi('/member/app/promoterBind/getPromoterSwitch'), data, {
    meta,
  })
}
/**
 * @description: 根据当前用户id 查询推广人信息
 * @param {} config
 * @return {}
 */
export function getPromoterUserByUserId<T>() {
  return request.Post<T>(
    GET_PROMOTER_USER_BY_USERID, // 地址
  )
}
/**
 * @description: 根据当前用户id 查询推广人信息
 * @param {} config
 * @return {}
 */
export function getPromoterById(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post(
    GET_PROMOTER_USER_BY_ID, // 地址
    data,
  )
}

/**
 * @description: 根据id获取推广码详情
 * @param {} config
 * @return {}
 */
export function getBankCodeById(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post(
    CET_BANK_CODE_BY_ID, // 地址
    data,
  )
}

/**
 * @description: 根据id获取第三方机构推广码详情
 * @param {} config
 * @return {}
 */
export function getPromoterOrgUserById(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post(
    CET_PROMOTER_ORG_USER_BY_ID, // 地址
    data,
  )
}
/**
 * @description: 查询当前用户是否是机构推广人
 * @param {} config
 * @return {}
 */
export function checkPromoterOrgUser() {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post(
    CHECK_PROMOTERORG_USER, // 地址
    // data,
  )
}

/**
 * @description: 根据当前用户查询绑定的机构推广人
 * @param {} config
 * @return {}
 */
export function getOrgUserByUserId() {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post(
    GET_ORG_USER_BYUSER_ID, // 地址
    // data,
  )
}
/**
 * @description: 更新申领状态
 * @param {} config
 * @return {}
 */
export function updateStatus(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post(
    UPDATE_STATUS, // 地址
    data,
  )
}
