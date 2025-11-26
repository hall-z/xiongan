import { Constant } from '@/enums/constant'
import {
  faceLogin,
  getFaceVerificationInfo,
  getLoginAlKey,
  getUserIdKey,
  getUserInfo,
  openIdCode,
  phoneChartLogin,
  phoneLogin,
  updateOpenIdAndUnionId,
  updateRealName,
  xcxScanFaceRealNameAuth,
  zfbLoginByFace,
  zfbQuickLogin,
  zfbUpdateRealName,
} from '@/service/api/auth'
import { getIsReceiveCardInfo } from '@/service/api/cardServe'
import store, { useUserStore, promotionDateStore } from '@/store'
import { useForm, useRequest } from 'alova/client'

import { isRouterCheckd } from '@/interceptors/route'
import { selectLoginCoupon } from '@/service/api/integral'
import { getUserLoginInfo } from '@/service/api/userMessage'
import { isValidChinaID, routeTo } from '@/utils'
import { storeToRefs } from 'pinia'

import {
  getLoginAlCode,
  getLoginCode,
  startFacialRecognitionVerify,
  useGetPhoneNumber,
  useStartAPVerify,
} from '@/utils/uniapi'
import { Toast } from '@/utils/uniapi/prompt'
import { loginListProps } from './types'
const { promotionDate } = storeToRefs(promotionDateStore())

// 微信登录
const wxLoginCode = ref('')
const getWxCode = async () => {
  const res: any = await getLoginCode()
  wxLoginCode.value = res
  console.log('wxLoginCode========>', wxLoginCode)
}

// 获取验证码
const { getCodeUrl, codeflog } = useImageVerify()
const { sendPhoneCode, countdown, sending } = usePhoneCode()
const openId = ref('')

const ablistShow = ref(false)
const loginUserList = ref<loginListProps[]>()

const authStore = useUserStore(store)
const read = ref(false)
const model = ref({
  username: '',
  password: '',
})
// 省份
const checkProv = function (val: any) {
  const pattern = /^[1-9][0-9]/
  const provs: Record<number, string> = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
  }
  if (pattern.test(val)) {
    if (provs[val]) {
      return true
    }
  }
  return false
}

// 出生日期
const checkDate = function (val: any) {
  const pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/
  if (pattern.test(val)) {
    const year = val.substring(0, 4)
    const month = val.substring(4, 6)
    const date = val.substring(6, 8)
    const date2 = new Date(year + '-' + month + '-' + date)
    if (date2 && date2.getMonth() === parseInt(month) - 1) {
      return true
    }
  }
  return false
}

// 校验码校验
const checkCode = function (val: any) {
  const p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
  const code = val.substring(17)
  if (p.test(val)) {
    let sum = 0
    for (let i = 0; i < 17; i++) {
      sum += val[i] * factor[i]
    }
    if (parity[sum % 11].toString() === code.toUpperCase()) {
      return true
    }
  }
  return false
}
const isIdCard = (value, rule, callback) => {
  console.log(callback)
  if (checkCode(value)) {
    const date = value.substring(6, 14)
    if (checkDate(date)) {
      if (checkProv(value.substring(0, 2))) {
        return true
      }
    }
  }
  return false
}
const rules = {
  username: [
    { required: true, message: '请输入姓名' },
    {
      pattern: /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$|^[\u4e00-\u9fa5]{2,20}$/,
      message: '请输入正确的姓名',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入身份证号码' },
    {
      required: true,
      message: '证件号码格式不正确',
      validator: (val) => {
        return isValidChinaID(val)
      },
    },
  ],
}
const rules2 = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  imgcode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入手机验证码', trigger: 'blur' }],
}

const { send: sendUserIdKey, loading: LoadingKey } = useRequest((data) => getUserIdKey(data), {
  immediate: false,
  loading: false,
})
const { send: sendFaceLogin, loading: LoadingFace } = useRequest((data) => faceLogin(data), {
  immediate: false,
  loading: false,
})

const { send: sendZfbLoginByFace, loading: LoadingZfbFace } = useRequest(
  (data) => zfbLoginByFace(data),
  {
    immediate: false,
    loading: false,
  },
)

const { send: sendWxUserInfo, loading: LoadingInfo } = useRequest((data) => getUserInfo(data), {
  immediate: false,
  loading: false,
})
const { send: sendAlUserInfo, loading: LoadingAlInfo } = useRequest(
  (data) => getFaceVerificationInfo(data),
  {
    immediate: false,
    loading: false,
  },
)
const { send: sendXcxScanFaceRealNameAuth } = useRequest((data) => xcxScanFaceRealNameAuth(data), {
  immediate: false,
  loading: false,
})

const { send: sendZfbUpdateRealName } = useRequest((data) => zfbUpdateRealName(data), {
  immediate: false,
  loading: false,
})

const { loading, send: sendIsReceiveCardInfo } = useRequest((data) => getIsReceiveCardInfo(data), {
  immediate: false,
  loading: false,
})

const { send: sendGetLoginAlKey } = useRequest((data) => getLoginAlKey(data), {
  immediate: false,
  loading: false,
})

const { send: sedUserInfo, data: userInfoData } = useRequest(() => getUserLoginInfo(), {
  immediate: false,
  loading: false,
})

// 默认身份证登录
// loginStatus 1  正常登录  2, 后实名认证
const Login = (form, flog = 1, loginStatus = 1) => {
  form.validate().then(async ({ valid, errors }) => {
    if (valid) {
      try {
        uni.showLoading({ title: flog || flog === 0 ? '加载中...' : '登录中...' })

        const newData = {
          appKey: Constant.APP_KEY,
          name: model.value.username,
          idCardNumber: model.value.password,
          type: 1,
          terminal: Constant.TERMINAL,
        }
        // #ifdef MP-WEIXIN
        // 获取key
        const { userIdKey }: any = await sendUserIdKey(newData)
        const verifyData = {
          name: model.value.username,
          idCardNumber: model.value.password,
          userIdKey,
        }
        // 用key 验证
        const { verifyResult }: any = await startFacialRecognitionVerify(verifyData)
        const infoParams = {
          verifyResult,
          name: model.value.username,
          idCardNumber: model.value.password,
        }

        // #endif
        // #ifdef MP-ALIPAY

        // 调用支付宝人脸Key
        const paramsAl = {
          cardName: model.value.username,
          cardCode: model.value.password,
        }
        const datas: any = await sendGetLoginAlKey(paramsAl)

        // 调用支付宝人脸
        const { result: response } = (await useStartAPVerify({
          url: datas.body,
          certifyId: datas.certify_id,
        })) as { result: any }
        // 人脸验证
        const infoalParams = {
          certifyId: response.certifyId,
          name: model.value.username,
          idCardNumber: model.value.password,
        }
        // #endif

        uni.hideLoading()
        if (loginStatus === 2) {
          // #ifdef MP-WEIXIN
          await sendXcxScanFaceRealNameAuth(infoParams)
          submitUpRealsfz(0) // 提交更新实名认证
          // #endif

          // #ifdef MP-ALIPAY
          submitUpRealsfz(0, response.certifyId) // 提交更新实名认证
          // #endif
        } else {
          let dataInfo: any
          // #ifdef MP-WEIXIN
          // info 验证
          dataInfo = await sendWxUserInfo(infoParams)
          // #endif

          // #ifdef MP-ALIPAY
          dataInfo = await sendAlUserInfo(infoalParams)
          // #endif

          // 登录根据返回结果列表登录 补充电话
          if (dataInfo?.loginUserList?.length === 1) {
            // 只有一个用户，自动登录
            const usrData = {
              userPhone: dataInfo.loginUserList[0].userPhone,
              cardCode: model.value.password,
            }
            await userLogin(usrData, 2)
          } else if (dataInfo?.loginUserList?.length > 1) {
            // 显示选择框

            dataInfo.loginUserList.forEach((item) => {
              item.cardCode = model.value.password
            })
            loginUserList.value = dataInfo.loginUserList
            ablistShow.value = true
            return false
          } else {
            // 展示补充电话号吗
            routeTo({
              url: '/pages/login/phoneLoginbc',
              data: { cardCode: model.value.password, cardName: model.value.username },
            })
            return false
          }
        }
      } catch (error) {
        uni.hideLoading()
        console.log('error', error)
      }
    } else {
      uni.hideLoading()
      console.log('数据校验失败')
    }
  })
}

const submitPhoneCode = (form, formData) => {
  if (!formData?.imgcode) {
    Toast('请输入图形验证码')
    return false
  }
  form
    .validate('phone')
    .then(async ({ valid, errors }) => {
      if (valid) {
        try {
          const params = {
            phone: formData.phone,
            code: formData.imgcode,
            uuid: codeflog.value,
          }
          const data: any = await sendPhoneCode(params)
          Toast(data.msg)
        } catch (error) {
          getCodeUrl()
        }
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
//
const {
  loading: phoneLoading,
  send: phoneSend,
  form: model2,
} = useForm(
  (formData) => {
    const params = {
      userId: '',
      userPhone: formData.phone,
      userName: '',
      verCode: formData.code,
      shopId: '',
      orgUserId: promotionDate.value.promoterType
        ? promotionDate.value.promoterType === '3'
          ? Number(promotionDate.value.promoterId)
          : ''
        : '',
      promoterType: promotionDate.value.promoterType
        ? promotionDate.value.promoterType === '3'
          ? Number(promotionDate.value.promoterType)
          : ''
        : '',
    }
    // 可以在此转换表单数据并提交
    return phoneLogin(params)
  },
  {
    // 设置这个参数为true即可在提交完成后自动重置表单数据
    resetAfterSubmiting: true,
    immediate: false,
    loading: false,
    // 初始化表单数据
    initialForm: {
      phone: '',
      imgcode: '',
      code: '',
    },
  },
)

// 手机号登录
const submitPhoneLogin = (form) => {
  form.validate().then(async ({ valid, errors }) => {
    if (valid) {
      try {
        uni.showLoading({ title: '登录中...' })
        const data: any = await phoneSend()
        await resultData(data)
      } catch (error) {
        console.log('🍱=====[error]:---->>>>', error)
      } finally {
        getCodeUrl()
      }
    }
  })
}

// 获取openid
const { loading: openLoading, send: sendOpenIdCode } = useRequest((data) => openIdCode(data), {
  immediate: false,
  loading: false,
})

const { loading: chartLoading, send: chartSend } = useRequest((data) => phoneChartLogin(data), {
  immediate: false,
  loading: false,
})

const { loading: zfbLoading, send: zfbSend } = useRequest((data) => zfbQuickLogin(data), {
  immediate: false,
  loading: false,
})

// 点击快捷登录
const getphonenumberLogin = async (e) => {
  console.log('e=======>')

  if (e.errMsg === 'getPhoneNumber:ok') {
    try {
      uni.showLoading({ title: '登录中...' })
      // openid
      const { openId, unionId }: any = await sendOpenIdCode({ code: wxLoginCode.value })
      console.log('取缓存promotionDate', promotionDate.value)
      const param = {
        encryptedData: e.encryptedData,
        iv: e.iv,
        openId,
        openid: openId,
        userId: openId,
        shopId: '',
        unionId,
        orgUserId: promotionDate.value.promoterType
          ? promotionDate.value.promoterType === '3'
            ? Number(promotionDate.value.promoterId)
            : ''
          : '',
        promoterType: promotionDate.value.promoterType
          ? promotionDate.value.promoterType === '3'
            ? Number(promotionDate.value.promoterType)
            : ''
          : '',
      }
      const data = await chartSend(param)
      // TODO: 最终登录 存储信息
      authStore.setOpenid(openId)
      await resultData(Object.assign(data, { loginType: '1' }))
    } catch (error) {
      Toast(error?.data?.msg)
    }
  }
}
// 支付宝快捷登录
const getPhoneNumberAlipay = async (e) => {
  try {
    uni.showLoading({ title: '登录中...' })
    const response = await useGetPhoneNumber()
    const openId = await getLoginAlCode()
    const params = { encryptedData: response, openId }
    const data = await zfbSend(params)
    await resultData(Object.assign(data, { loginType: '1' }))
  } catch (error) {
    Toast(error?.data?.msg)
  }
}

// 补充手机号/ 实名认证补充
const {
  loading: bcphoneLoading,
  send: sendUpRealName,
  form: model3,
} = useForm(
  (formData) => {
    const authStore = useUserStore()
    const params = {
      userPhone: formData.phone,
      verCode: formData.code,
      code: formData.code,
      // TODO: 证件姓名
      userName: formData.userName || model.value.username,
      userCardCode: formData.userCardCode || model.value.password,
      userId: formData.userId || authStore.userInfo.userDId,
    }
    // 可以在此转换表单数据并提交
    return updateRealName(params)
  },
  {
    immediate: false,
    loading: false,
    // 设置这个参数为true即可在提交完成后自动重置表单数据
    resetAfterSubmiting: true,
    // 初始化表单数据
    initialForm: {
      phone: '',
      imgcode: '',
      code: '',
      userCardCode: '',
      userId: '',
      userName: '',
    },
  },
)
// 补充手机号登录校验
const submitUpRealName = (form, flog) => {
  form.validate().then(async ({ valid, errors }) => {
    if (valid) {
      try {
        uni.showLoading({ title: '处理中...' })
        // await sendUpRealName()
        const usrData = {
          userPhone: model3.value.phone,
          cardCode: model3.value.userCardCode || model.value.password,
          cardName: model.value.username,
        }
        await userLogin(usrData, flog)
      } catch (error) {
        console.log('补充error:', error)
      } finally {
        getCodeUrl()
      }
    }
  })
}
// 登录后的实名认证提交
const submitUpRealsfz = async (flog, id?: string) => {
  uni.showLoading({ title: '认证中...' })
  try {
    let res = null
    // #ifdef MP-WEIXIN
    res = await sendUpRealName()
    // #endif

    // #ifdef MP-ALIPAY
    res = await sendZfbUpdateRealName({
      userCardCode: model.value.password,
      userName: model.value.username,
      userPhone: useUserStore().userInfo.userPhone,
      certifyId: id,
    })
    // #endif
    if (res) {
      console.log('实名认证', res)
      const data = authStore.userInfo
      const newData = {
        idCardNumber: model.value.password,
        cardName: model.value.username,
        cardId: res,
        isReal: '1',
      }
      uni.showToast({ title: '认证成功' })

      resultData({ ...data, ...newData }, flog)
    } else {
      uni.showToast({ title: '认证失败...' })
      uni.hideLoading()
    }
  } catch (error) {
    console.log('认证错误:', error)
    uni.hideLoading()
  } finally {
    uni.hideLoading()
  }
}

// 最后一步登录
const userLogin = async (item, flog) => {
  console.log('最后登录数据------>', item)
  item.orgUserId = promotionDate.value.promoterType
    ? promotionDate.value.promoterType === '3'
      ? Number(promotionDate.value.promoterId)
      : ''
    : ''
  item.promoterType = promotionDate.value.promoterType
    ? promotionDate.value.promoterType === '3'
      ? Number(promotionDate.value.promoterType)
      : ''
    : ''
  let data: any
  // #ifdef MP-WEIXIN
  data = await sendFaceLogin(item)
  // #endif
  // #ifdef MP-ALIPAY
  data = await sendZfbLoginByFace(item)
  // #endif

  await resultData(data, flog)
}

// 登录后结果处理
const resultData = async (data, flog = 2) => {
  uni.showLoading({ title: '登录成功' })

  // 保存
  // authStore.clearUserInfo()
  authStore.setUserInfo(data)
  // 登录检测
  authStore.setNoLoginRequired(authStore.noLoginRequired ?? '30')
  useTimeLogin()

  // #ifdef APP-PLUS
  uni.setStorageSync('userInfo', data)
  // #endif

  if (flog === 0) {
    // 重新更新用户信息
    await sedUserInfo()
    // authStore.clearUserInfo()
    // 这里清除缓存会将 openId 清除，支付时会出现 openId 为空的错误
    // authStore.clearUserInfo()
    authStore.setUserInfo(Object.assign(data, userInfoData.value))
    // #ifdef APP-PLUS
    uni.setStorageSync('userInfo', data)

    authStore.isRealSataus()

    // #endif
  }

  // 跳转到登录后的页面
  uni.hideLoading()
  const pages = getCurrentPages() // 当前页面栈
  // 确定返回页面的层数
  const index = pages[pages.length - 1].route === 'pages/login/index' ? 1 : flog

  console.log('456456456-----')
  let notips = false

  if (pages[pages.length - 1].options && pages[pages.length - 1].options.redirectPath) {
    const p = pages[pages.length - 1].options

    notips = true
    uni.redirectTo({
      url:
        p.redirectPath +
        '?path=' +
        p.path +
        '&needLogin=' +
        p.needLogin +
        '&needRealname=' +
        p.needRealname +
        '&title=' +
        p.title +
        '&id=' +
        p.id +
        '&data=' +
        p.data,
    })
  } else {
    if (pages.length === 1) {
      uni.switchTab({ url: '/pages/mine/index' })
    } else {
      uni.navigateBack({ delta: index })
    }
  }

  // uni.navigateBack({ delta: index })

  // #ifdef MP-WEIXIN
  /** 小程序登录成功后更新或新增 openId 和 unionId */

  if (!(data?.loginType === '1')) {
    const { openId }: any = await sendOpenIdCode({ code: wxLoginCode.value })
    authStore.setOpenid(openId)
  }
  // #endif
  // #ifdef MP-ALIPAY
  const openId = await getLoginAlCode()
  if (!authStore.userInfo.openid) {
    authStore.setOpenid(openId)
  }
  // #endif

  if (!authStore.isRealSataus && !notips) {
    isRouterCheckd({ showTps: 1 })
  } else {
    // 登录领取积分
    await selectLoginCoupon()
  }
}

const goPhoneLogin = () => {
  routeTo({
    url: '/pages/login/phoneLogin',
  })
}
const goSfzLogin = () => {
  routeTo({
    url: '/pages/login/sfzLogin',
  })
}

const toAgreement = (articleId: string, title: string) => {
  routeTo({
    url: '/pages-sub/webView/index',
    data: { type: articleId, showTop: true, title },
  })
}

const { loading: unionLoading, send: sendUpdateOpenIdAndUnionId } = useRequest(
  (data) => updateOpenIdAndUnionId(data),
  {
    immediate: false,
    loading: false,
  },
)

const updateUnionId = async () => {
  // openid
  await sendUpdateOpenIdAndUnionId({ code: wxLoginCode.value, appKey: Constant.APP_KEY })
}

export default () => {
  return {
    Login,
    model,
    rules,
    read,
    LoadingKey,
    LoadingInfo,
    sendFaceLogin,
    LoadingFace,
    model2,
    model3,
    rules2,
    getCodeUrl,
    codeflog,
    submitPhoneCode,
    countdown,
    sending,
    phoneLoading,
    submitPhoneLogin,
    getphonenumberLogin,
    resultData,
    openIdCode,
    goPhoneLogin,
    goSfzLogin,
    toAgreement,
    sendIsReceiveCardInfo,
    submitUpRealName,
    userLogin,
    ablistShow,
    loginUserList,
    getWxCode,
    getPhoneNumberAlipay,
  }
}
