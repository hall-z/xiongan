import { baseUrlApi } from '@/interceptors/utils'
import { request } from '@/utils/http'
import { METHOD_INSTANCE } from '../model/baseModel'

const BASIC_INFO = baseUrlApi('/card/app/getBasicInfo')
const GET_CARD_TYPE_INFO = baseUrlApi('/card/app/getCardTypeInfo')

const CARD_SCHEDULE_INFO = baseUrlApi('/card/app/getCardScheduleInfo')

const GET_CARD_PAYMENT_INFO = baseUrlApi('/card/app/getCardPaymentInfo')

const CARDCHECK_INFO = baseUrlApi('/card/app/getCardcheckInfo')
const SMS_CARD_PROGRESS = baseUrlApi('/user/app/smsCardProgress')
const SMS_AND_STATION_PROGRESS = baseUrlApi('/user/app/smsAndStationProgress')

const CARD_STEP_APPLICATION = baseUrlApi('/user/app/xcxFeedBack/addOrUpdateCardApply')

const GET_STEP_APPLICATION_INFO = baseUrlApi('/user/app/xcxFeedBack/getCardApplyDetail')

const CARD_FIRST_APPLICATION = baseUrlApi('/card/app/cardFirstApplication')

const CARD_FIRST_DBR_APPLICATION = baseUrlApi('/card/app/cardFirstDbrApplication')

const UPLOAD_PHOTO = baseUrlApi('/card/app/uploadPhoto')
const UPLOAD_OCR = baseUrlApi('/card/app/photoOcr')

const SERVICE_PASSWORD_RESET = baseUrlApi('/card/app/getServicePasswordReset')

const CHANGE_CARD_PWD = baseUrlApi('/card/app/changeCardPwd')

const CARD_RECHARGE = baseUrlApi('/card/app/changeCardData')

const SOCIAL_SECARD_ACTIVE = baseUrlApi('/card/app/getSocialActive')

const IS_RECEIVE_CARD_INFO = baseUrlApi('/card/app/getIsReceiveCardInfo')

const PERSON_INFO_CHANGE = baseUrlApi('/card/app/personInfoChange')
const CHECK_CARD_CHANGE = baseUrlApi('/card/app/checkCardChange ')

const CARD_LOSS = baseUrlApi('/card/app/getLossInfo')

const UNBOXING_INFO = baseUrlApi('/card/app/getUnboxingInfo')

const CARDSIGN_VALID = baseUrlApi('/card/app/signValid')
const GET_SIGN_PARAM = baseUrlApi('/card/app/getSignParam')

const GET_BRANCHES_INFO_SELECT = baseUrlApi('/card/app/getBranchesInfoSelect')
const GET_BRANCHES_INFO_SELECT_NEW = baseUrlApi('/card/app/getBranchesInfoSelectNew')
const GET_CARD_TOKEN = baseUrlApi('/card/app/getToken')
const GET_CHECK_ZJZ = baseUrlApi('/card/app/checkToZjz')
const CARD_EXPIRATION = baseUrlApi('/card/app/getCardExpirationDate')

const QRCODELNIT = baseUrlApi('/member/applications/csb/qrcodeInit')
const GET_GENERATE = baseUrlApi('/member/applications/csb/getGenerate')
const CANTEEN_RECHARGE = baseUrlApi('/trade/app/XcxPayment/canteenRecharge')
const CANTEEN_RECHARGE2 = baseUrlApi('/trade/app/XcxPayment/canteenLieuRecharge')
const ACCOUNT_RECHARGE = baseUrlApi('/third/app/canteen/accountRecharge')
const APP_CANTEEN_RECHARGE = baseUrlApi('/trade/app/canteenRecharge')
const APP_CANTEEN_RECHARGE2 = baseUrlApi('/trade/app/canteenLieuRecharge')

const GET_ALL_CODE_INFO = baseUrlApi('/member/app/v1/QrCode/getAllCodeInfo')
const GET_APPLY_USER = baseUrlApi('/user/app/xcxFeedBack/getCardApplyUser')

/**
 *  食堂卡充值
 * @param params 初始参数()
 * */
export function accountRecharge<T>(data, tips = false) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    ignorEencrypt: true,
    resAll: true,
  }

  return request.Post<T>(
    ACCOUNT_RECHARGE, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  APP食堂充值支付
 * @param params 初始参数()
 * */
export function appCanteenRecharge<T>(data, tips = false) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    // ignorEencrypt: true,
    // Analysis: true,
  }

  return request.Post<T>(
    APP_CANTEEN_RECHARGE, // 请求地址
    data,
    {
      meta,
    },
  )
}

export function appCanteenRecharge2<T>(data, tips = false) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    // ignorEencrypt: true,
    // Analysis: true,
  }

  return request.Post<T>(
    APP_CANTEEN_RECHARGE2, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  食堂充值支付
 * @param params 初始参数()
 * */
export function canteenRecharge<T>(data, tips = false) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    // ignorEencrypt: true,
    // Analysis: true,
  }

  return request.Post<T>(
    CANTEEN_RECHARGE, // 请求地址
    data,
    {
      meta,
    },
  )
}

export function canteenRecharge2<T>(data, tips = false) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    // ignorEencrypt: true,
    // Analysis: true,
  }

  return request.Post<T>(
    CANTEEN_RECHARGE2, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  卡基础信息查询
 * @param params 初始参数()
 * */
export function getCardBasicInfo<T>(data, tips = false) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: tips,
  }

  return request.Post<T>(
    BASIC_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  卡基础信息查询
 * @param params 初始参数()
 * */
export function getCardBasicInfo2<T>(data, tips = true) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: tips,
  }

  return request.Post<T>(
    BASIC_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  卡基础信息查询
 * @param params 初始参数()
 * */
export function getCardBasicInfo3<T>(data, tips = true) {
  const meta: METHOD_INSTANCE = {
    Tips: tips,
  }

  return request.Post<T>(
    BASIC_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  卡进度信息查询
 * @param params 初始参数()
 * */
export function getCardScheduleInfo(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }

  return request.Post(
    CARD_SCHEDULE_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  卡类型查询
 * @param params 初始参数()
 * */
export function getCardTypeInfo<T>(data, tips = true) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: tips,
  }

  return request.Post<T>(
    GET_CARD_TYPE_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  卡进度邮寄信息查询
 * @param params 初始参数()
 * */
export function getCardPaymentInfo(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
  }

  return request.Post(
    GET_CARD_PAYMENT_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社保卡申请前
 * @param params 初始参数()
 * */
export function getCardcheckInfo(data, loading = true) {
  const meta: METHOD_INSTANCE = {
    loading,
  }

  console.log('data--------', data)
  return request.Post(
    CARDCHECK_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社保卡催办短信
 * @param params 初始参数()
 * */
export function getsmsCardProgress(data, loading = true) {
  const meta: METHOD_INSTANCE = {
    loading,
  }

  console.log('data--------', data)
  return request.Post(
    SMS_CARD_PROGRESS, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社保卡催办短信和站内
 * @param params 初始参数()
 * */
export function getSmsAndStationProgress(data, loading = true) {
  const meta: METHOD_INSTANCE = {
    loading,
  }

  return request.Post(
    SMS_AND_STATION_PROGRESS, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 * @description: 上传身份正
 * @param {} config
 * @return {}
 */
export function uploadPhoneInfo(data) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
    Tips: true,
  }

  return request.Post(
    UPLOAD_PHOTO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 * @description: ocr请求
 * @param {} config
 * @return {}
 */
export function uploadOCRInfo(data) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
    Tips: true,
  }

  return request.Post(
    UPLOAD_OCR, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社保卡申请数据提交
 * @param params 初始参数()
 * */
export function cardFirstApplication(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post(
    CARD_FIRST_APPLICATION, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社保卡申请数据分部提交
 * @param params 初始参数()
 * */
export function cardStepApplication(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post(
    CARD_STEP_APPLICATION, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社保卡申领详情信息
 * @param params 初始参数()
 * */
export function getApplyFortInfo(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
  }

  return request.Post(
    GET_STEP_APPLICATION_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社会保障卡首次申请(加代办人)（支持永居证）
 * @param params 初始参数()
 * */
export function cardFirstDbrApplication(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post(
    CARD_FIRST_DBR_APPLICATION, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社保卡补换
 * @param params 初始参数()
 * */
export function changeCardData(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post(
    CARD_RECHARGE, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社保卡补换查询6个月
 * @param params 初始参数()
 * */
export function checkCardChange(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }

  return request.Post(
    CHECK_CARD_CHANGE, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  服务密码重置
 * @param params 初始参数()
 * */
export function SeverPassRest(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post(
    SERVICE_PASSWORD_RESET, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  服务密码修改
 * @param params 初始参数()
 * */
export function changeCardPwd(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post(
    CHANGE_CARD_PWD, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社保卡挂失
 * @param params 初始参数()
 * */
export function cardLoss(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post(
    CARD_LOSS, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询人员是否领取过河北地区的社保卡
 * @param params 初始参数()
 * */
export function getIsReceiveCardInfo(data) {
  return request.Post(
    IS_RECEIVE_CARD_INFO, // 请求地址
    data,
    {},
  )
}

/**
 *  人员信息变更
 * @param params 初始参数()
 * */
export function personInfoChange(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post(
    PERSON_INFO_CHANGE, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社保卡启用
 * @param params 初始参数()
 * */
export function cardSocialStart(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post(
    SOCIAL_SECARD_ACTIVE, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *社保卡解挂
 */
export function getUnboxingInfo(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post(
    UNBOXING_INFO, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 * 电子社保卡相关
 */
export function getSignValid(data) {
  return request.Post(
    CARDSIGN_VALID, // 请求地址
    data,
  )
}

/**
 * 电子社保卡相关H5
 */
export function getSignParam(data) {
  return request.Post(
    GET_SIGN_PARAM, // 请求地址
    data,
  )
}

export function getBranchesInfoSlect<T>(data: any) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
  }

  return request.Post<T>(GET_BRANCHES_INFO_SELECT, data, {
    meta,
  })
}

// 选择网点新
export function getBranchesInfoSlectNew<T>(data: any) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
  }

  return request.Post<T>(GET_BRANCHES_INFO_SELECT_NEW, data, {
    meta,
  })
}

/**
 * 电子社保卡 验码
 */
export function getQrcodelnit(data) {
  const meta: METHOD_INSTANCE = {
    ignorEencrypt: true,
    loading: true,
    Analysis: true,
    Tips: true,
  }
  return request.Post(QRCODELNIT, data, {
    meta,
  })
}

/**
 * 电子社保卡 验码
 */
export function getGenerate(data) {
  const meta: METHOD_INSTANCE = {
    loading: false,
    ignorEencrypt: true,
    Analysis: true,
  }
  return request.Post(GET_GENERATE, data, {
    meta,
  })
}

/**
 * 电子社保卡 解码详细内容
 */
export function getAllCodeInfo(data) {
  const meta: METHOD_INSTANCE = {
    loading: false,
    // ignorEencrypt: true,
    // Analysis: true,
  }
  return request.Post(GET_ALL_CODE_INFO, data, {
    meta,
  })
}

/**
 *  代办人信息查询
 * @param params 初始参数()
 * */
export function getCardApplyUser<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post<T>(
    GET_APPLY_USER, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  获取卡片token信息
 * @param params 初始参数()
 * */
export function getCardToken() {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }

  return request.Post(
    GET_CARD_TOKEN, // 请求地址

    {
      meta,
    },
  )
}

/**
 *  证件照校验并剪裁
 * @param params 初始参数()
 * */
export function getCheckToZjz(data) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    Analysis: true,
    Tips: true,
  }

  return request.Post(
    GET_CHECK_ZJZ, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  社保卡有效期
 * @param params 初始参数()
 * */
export function getCardExpirationDate(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }

  return request.Post(
    CARD_EXPIRATION, // 请求地址
    data,
    {
      meta,
    },
  )
}
