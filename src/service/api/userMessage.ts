import { baseUrlApi, staticUrlApi } from '@/interceptors/utils'
import { request } from '@/utils/http'
import { METHOD_INSTANCE } from '../model/baseModel'

const FIND_XCX_SCORE_USER = baseUrlApi('/member/app/signIn/getSignInDetail')

const SIGN_IN = baseUrlApi('/member/app/signIn/addSignIn')

const GET_USER_SCORE_PAGE = baseUrlApi('/member/app/integral/getPointsDetailList')

const GET_XIN_CANG_CARD_INFO = baseUrlApi('/card/app/getXinCangCardInfo')
const SET_XIN_CANG_CARD_AUTHORIZE = baseUrlApi('/card/app/setXinCangCardAuthorize')

const PAY_COUPON_USER_PHONE = baseUrlApi('/promotion/app/coupon/payCouponUserPhone')
const COUPON_RECEIVE = baseUrlApi('/promotion/app/coupon/receiveCenter')

const USER_COUPON_LIST = baseUrlApi('/promotion/app/coupon/userCouponList')

const RECEIVE_COUPON = baseUrlApi('/promotion/app/coupon/userReceive')

const GET_USER_GOODS_ADDRESS_LIST = baseUrlApi('/member/app/goodsAddress/getUserGoodsAddressList')

const ADD_BUSINESS_ADVICE = baseUrlApi('/user/app/adviceFeedback/addAdviceFeedBack')

const FIND_MY_INFO = baseUrlApi('/member/app/myInfo')

const GET_ADVICELIST = baseUrlApi('/user/app/adviceFeedback/getAdviceFeedBackAppPage')
const GET_DETAIL_BY_ADVICE_ID = baseUrlApi('/user/app/adviceFeedback/getAdviceFeedBackAppInfo')

const GET_USER_CARD_DETAIL = baseUrlApi('/promotion/app/member/getUserCardDetail')
const UPDATE_NICK_AND_AVATAR = baseUrlApi('/member/app/userInfo/updateNickAndAvatar')

const ADD_SHARE_RECORD = baseUrlApi('/product/app/shareRecord/addShareRecord')
const HAS_MERCHANT_AUTH = baseUrlApi('/member/app/userInfo/hasMerchantAuth')

const GET_CARD_INFO = baseUrlApi('/third/app/transit/getCardInfoByCardNo')
const GET_CARD_REALNAME = baseUrlApi('/third/app/transit/cardRealNameQuery')
const GET_CARD_RECORD = baseUrlApi('/third/app/transit/getTransitCardTradeDetails')
const GET_USER_CARD = baseUrlApi('/member/app/userInfo/userCardInfo ')

const GET_INFO_ID = baseUrlApi('/third/app/canteen/getCanteenPersonListV1')
const GET_CARD_INFO2 = baseUrlApi('/third/app/canteen/getAccountBalance')
const GET_INFO_LIST = baseUrlApi('/third/app/canteen/getCanteenRechargeRecord')

const GET_USER_LOGIN_INFO = baseUrlApi('/member/app/xcxLogin/getUserLoginInfo')

const SEARCH_USER = baseUrlApi('/third/app/canteen/getCanteenPersonListV1')
//
const GET_PAY_LIST = baseUrlApi('/member/app/xcxLogin/getUserLoginInfo')
const GET_PAY_DETAIL = baseUrlApi('/order/app/getCanteenOrderDetail')

// 银行卡相关
const GET_USER_BANKCARD_LIST = baseUrlApi('/bankcard/app/getUserBankcardList')
const ADD_OR_UPDATE_USER_BANKCARD = baseUrlApi('/bankcard/app/addOrUpdateUserBankcard')
const DEL_USER_BANKCARD = baseUrlApi('/bankcard/app/delUserBankcard')

const AGENCY_TEXTING_SERVICE = baseUrlApi('/trade/fastPay/agencyTextingService')
const SEND_MSG_CODE = baseUrlApi('/bankcard/app/sendMsgCode')
const SET_BANKCARD_PAY_CODE = baseUrlApi('/bankcard/app/setBankcardPayCode')
const TO_PAY_CODE_VERIFY = baseUrlApi('/bankcard/app/toPayCodeVerify')
const UPDATE_BANKCARD_PAY_CODE = baseUrlApi('/bankcard/app/updateBankcardPayCode')
const TO_VERIFY_SMS_CODE = baseUrlApi('/bankcard/app/toVerifySmsCode')

// b---c 支付
const PASSWORD_PAY_B_TO_C = baseUrlApi('/trade/app/XcxPayment/passwordPayBToC')
const QUERY_B_TO_C_ORDER = baseUrlApi('/trade/app/XcxPayment/queryBToCOrder')

const GET_ORDER_INTERFERE_STATUS = baseUrlApi('/order/app/manage/getOrderInterfere')

const GET_ORDER_INTERFERE_PAGE = baseUrlApi('/order/app/manage/getOrderInterferePage')
const REPLY_ORDER_INTERFERE = baseUrlApi('/order/app/manage/replyOrderInterfere')

// const GET_AVAILABLE_MERCHANT_LIST = staticUrlApi('/availableStore')
const GET_AVAILABLE_MERCHANT_LIST = staticUrlApi(
  '/api/promotion/app/availableStores/getAvailableStoresAndClassifyByStockId',
)
const SAVE_OR_UPDATE_COURSE_REFIST = baseUrlApi('/member/app/courseRegist/saveOrUpdateCourseRegist')
const GET_COURSE_REGIST = baseUrlApi('/member/app/courseRegist/getCourseRegistByPage')
const GET_VAL_BY_TYPE_CODE = baseUrlApi('/user/app/sysConfigVal/getValByTypeCode')
const SEND_APPLY_FOR_CARD = baseUrlApi('/member/app/xcxActivityStu/sendActivity')
const SEND_APPLY_FOR_CARDLIST = baseUrlApi('/member/app/xcxActivityStu/getSendListByUserId')

/**
 /**
 *  查询食堂信息
 * @param params
 * */
export function searchUser(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    resAll: true,
    ignorEencrypt: true,
  }
  return request.Post(
    SEARCH_USER, // 地址
    data,
    {
      meta,
    },
  )
}

/** https://ykt.xionganbc.com/wxcard/?state=1440194W1943150812284895234W1867148231755022338
 *  查询公交卡信息
 * @param params
 * */
export function getpaylist(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    resAll: true,
    ignorEencrypt: true,
  }
  return request.Post(
    GET_PAY_LIST, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询公交卡信息
 * @param params
 * */
export function getCanteenOrderDetail(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    GET_PAY_DETAIL, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询公交卡信息
 * @param params
 * */
export function getUserCard(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    GET_USER_CARD, // 地址
    data,
    {
      meta,
    },
  )
}

export function sendApplyForCard(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: false,
    AnalysisData: true,
  }
  return request.Post(
    SEND_APPLY_FOR_CARD, // 地址
    data,
    {
      meta,
    },
  )
}

export function sendApplyForCardList(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    SEND_APPLY_FOR_CARDLIST, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询食堂卡信息
 * @param params
 * */
export function getInfoId(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    resAll: true,
    ignorEencrypt: true,
  }
  return request.Post(
    GET_INFO_ID, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询公交卡信息
 * @param params
 * */
export function getCardInfo2(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    resAll: true,
    ignorEencrypt: true,
  }
  return request.Post(
    GET_CARD_INFO2, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询公交卡信息
 * @param params
 * */
export function getInfoList(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    resAll: true,
    ignorEencrypt: true,
  }
  return request.Post(
    GET_INFO_LIST, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询公交卡充值记录
 * @param params
 * */
export function getTransitCardTradeDetails(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    resAll: true,
    Analysis: true,
    ignorEencrypt: true,
  }
  return request.Post(
    GET_CARD_RECORD, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询公交卡实名信息
 * @param params
 * */
export function cardRealNameQuery(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Analysis: true,
  }
  return request.Post(
    GET_CARD_REALNAME, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询公交卡信息
 * @param params
 * */
export function getCardInfo(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    resAll: true,
    ignorEencrypt: true,
  }
  return request.Post(
    GET_CARD_INFO, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询雄才卡信息
 * @param params
 * */
export function getXinCangCardInfo(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    GET_XIN_CANG_CARD_INFO, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询雄才卡查询授权
 * @param params
 * */
export function setXinCangCardAuthorize(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    SET_XIN_CANG_CARD_AUTHORIZE, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询登录信息
 * @param params
 * */
export function findmyInfo<T>(data) {
  return request.Post<T>(
    FIND_MY_INFO, // 地址
    data,
  )
}

/**
 *  重新获取用户登录信息----/ 确保完整
 * @param params
 * */
export function getUserLoginInfo<T>(data?: any) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(
    GET_USER_LOGIN_INFO, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  积分信息
 * @param params 初始参数()
 * */
export function findXcxScoreUser<T>(data?, flog?: boolean) {
  const meta: METHOD_INSTANCE = {
    loading: !flog,
  }
  return request.Post<T>(
    FIND_XCX_SCORE_USER, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 * 用户积分签到
 * @param params 初始参数()
 * */
export function interSignIn(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    SIGN_IN, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 * 积分列表
 * @param params 初始参数()
 * */
export function getInterList(data) {
  return request.Post(GET_USER_SCORE_PAGE, data)
}

/**
 * 当前用户可使用的支付券列表
 * @param params 初始参数()
 * */
export function getPayCouponUserPhone<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(PAY_COUPON_USER_PHONE, data, {
    meta,
  })
}

/**
 *  可领取优惠券
 * @param params 初始参数()
 * */
export function getCouponList(data) {
  return request.Post(
    COUPON_RECEIVE, // 请求地址
    data,
  )
}

/**
 *  个人中心查看用户优惠卷列表
 * @param params 初始参数()
 * */
export function getUserCouponList(data) {
  return request.Post(
    USER_COUPON_LIST, // 请求地址
    data,
  )
}

/**
 * 用户领取优惠卷
 * @param params 初始参数()
 * */
export function receiveCoupon(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    loadingText: '领取中...',
  }
  return request.Post(
    RECEIVE_COUPON, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 * 用户 收货地址维护
 * @param params 初始参数()
 * */
export function getUserGoodsAddressList(data) {
  return request.Post(
    GET_USER_GOODS_ADDRESS_LIST, // 地址
    data,
  )
}

/**
 * 用户反馈建议新增==
 * @param params 初始参数()
 * */
export function addBusinessAdvice(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post(
    ADD_BUSINESS_ADVICE, // 地址
    data,
  )
}

/**
 * 用户反馈建议列表
 * @param params 初始参数()
 * */
export function getAdvicelist<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(
    GET_ADVICELIST, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 * 用户反馈详情
 * @param params 初始参数()
 * */
export function getDetailByAdviceId<T>(data) {
  const meta: METHOD_INSTANCE = {
    // loading: true,
  }
  return request.Post<T>(
    GET_DETAIL_BY_ADVICE_ID, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 * 我的社保卡详情
 * @param params 初始参数()
 * */
export function getUserCardDetail<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(
    GET_USER_CARD_DETAIL, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  修改用户昵称头像
 * @param params 初始参数()
 * */
export function updateNickAndAvatar<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(
    UPDATE_NICK_AND_AVATAR, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  用户分享行为 记录
 * @param params 初始参数()
 * */
export function userShareLog<T>(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
  }
  return request.Post<T>(
    ADD_SHARE_RECORD, // 地址
    data,
  )
}

/**
 *  查询用户是否商户权限
 * @param params 初始参数()
 * */
export function userHasMerchantAuth<T>(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
  }
  return request.Post<T>(
    HAS_MERCHANT_AUTH, // 地址
    data,
    {
      meta,
    },
  )
}

/**
 *  查询用户银行卡列表
 * @param params 初始参数()
 * */
export function getUserBankcardList<T>(data) {
  return request.Post<T>(GET_USER_BANKCARD_LIST, data)
}

/**
 *  添加或更新用户银行卡
 * @param params 初始参数()
 * */
export function addOrUpdateUserBankcard<T>(data, config?: any) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post<T>(ADD_OR_UPDATE_USER_BANKCARD, data, {
    meta,
  })
}

/**
 *  删除用户银行卡
 * @param params 初始参数()
 * */
export function delUserBankcard<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post<T>(DEL_USER_BANKCARD, data, {
    meta,
  })
}

/**
 *  发送银行短信验证码
 * @param params 初始参数()
 * */
export function agencyTextingService<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    // ignorEencrypt: true,
    // Analysis: true,
    Tips: true,
    loadingText: '发送中...',
  }
  return request.Post<T>(AGENCY_TEXTING_SERVICE, data, {
    meta,
  })
}

/**
 *  发送系统银行短信验证码
 * @param params 初始参数()
 * */
export function sendMsgCode<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
    loadingText: '发送中...',
  }
  return request.Post<T>(SEND_MSG_CODE, data, {
    meta,
  })
}

/**
 *  设置支付密码和支付额度
 * @param params 初始参数()
 * */
export function setBankcardPayCode<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(SET_BANKCARD_PAY_CODE, data, {
    meta,
  })
}

/**
 *  支付密码校验
 * @param params 初始参数()
 * */
export function toPayCodeVerify<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post<T>(TO_PAY_CODE_VERIFY, data, {
    meta,
  })
}

/**
 *   校验后可修改。。
 * @param params 初始参数()
 * */
export function toVerifySmsCode<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    Tips: true,
  }
  return request.Post<T>(TO_VERIFY_SMS_CODE, data, {
    meta,
  })
}

/**
 * 修改支付密码
 * @param params 初始参数()
 * */
export function updateBankcardPayCode<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(UPDATE_BANKCARD_PAY_CODE, data, {
    meta,
  })
}

/**
 *  被扫支付/扫码支付
 * @param params 初始参数()
 * */
export function queryBToCOrder<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: false,
    Tips: false,
    loadingText: '正在支付...',
    // ignorEencrypt: true,
    // Analysis: true,
  }
  return request.Post<T>(QUERY_B_TO_C_ORDER, data, {
    meta,
  })
}

/**
 *  用户扫码后密码支付
 * @param params 初始参数()
 * */
export function passwordPayBToC<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
    loadingText: '正在支付...',
    Tips: true,
    // ignorEencrypt: true,
    // Analysis: true,
  }
  return request.Post<T>(PASSWORD_PAY_B_TO_C, data, {
    meta,
  })
}

// 查询工单介入状态
export function getOrderInterfereStatus<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(GET_ORDER_INTERFERE_STATUS, data, {
    meta,
  })
}

/**
 *  查询工单介入列表
 * @param params 初始参数()
 * */
export function getOrderInterferePage<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(GET_ORDER_INTERFERE_PAGE, data, {
    meta,
  })
}

/**
 *  回复工单介入
 * @param params 初始参数()
 * */
export function replyOrderInterfere<T>(data) {
  const meta: METHOD_INSTANCE = {
    loading: true,
  }
  return request.Post<T>(REPLY_ORDER_INTERFERE, data, {
    meta,
  })
}

/**
 *  查询可用商户
 * @param params 初始参数()
 * */
export function getAvailableMerchantList<T>(data) {
  const meta: METHOD_INSTANCE = {
    ignoreSign: true,
    ignorEencrypt: true,
    ignorToken: true,
    resAll: true,
    // Analysis: true,
    initParams: false,
    loading: true,
  }
  return request.Post<T>(GET_AVAILABLE_MERCHANT_LIST, data, {
    meta,
  })
}

/**
 *  保存课程信息
 * @param params 初始参数()
 * */
export function saveOrUpdateCourseRegist(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
    // Analysis: true
  }

  return request.Post(
    SAVE_OR_UPDATE_COURSE_REFIST, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  获取我的课程信息
 * @param params 初始参数()
 * */
export function getCourseRegistByList(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
    // Analysis: true
  }

  return request.Post(
    GET_COURSE_REGIST, // 请求地址
    data,
    {
      meta,
    },
  )
}

/**
 *  获取课程列表
 * @param params 初始参数()
 * */
export function getValByTypeCode(data) {
  const meta: METHOD_INSTANCE = {
    Tips: true,
    // Analysis: true
  }

  return request.Post(
    GET_VAL_BY_TYPE_CODE, // 请求地址
    data,
    {
      meta,
    },
  )
}
