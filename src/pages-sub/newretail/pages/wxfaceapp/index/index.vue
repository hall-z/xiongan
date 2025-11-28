<template>
  <!--pages/wxfaceapp/index/index.wxml-->
  <view>
    <!-- <goodsDetail-bar :title="state.navigationBarTitle" color="#ffffff"></goodsDetail-bar> -->
    <view class="top-info">
      <image class="to-img" :src="state.imagesPath.iconFacePayTop" mode="widthFix"></image>
      <view class="content">
        <view class="user-info">
          <button class="user-portrait" v-if="!state.hasUserInfo" @click="getUserInfo"></button>
          <image v-else class="user-portrait" :src="state.userInfo.avatarUrl"></image>
          <view class="name-mobile">
            <text>{{ state.hasUserInfo ? state.userInfo.nickName : '请点击头像登录' }}</text>
            <text>
              {{ state.member.id ? filters.filtMobile(state.member.mobile) : 'xxx xxxx xxxx' }}
            </text>
          </view>
        </view>
        <view class="card-coupon">
          <view class="card">
            <text class="amount">{{ isMember ? state.storedValueCard.balance : '*' }}</text>
            <text>储值余额</text>
          </view>
          <view>
            <text class="amount">{{ isMember ? state.member.couponNum : '*' }}</text>
            <text>优惠券</text>
          </view>
        </view>
      </view>
    </view>
    <view class="order-info" v-if="!state.loading">
      <view class="store-box">{{ storeInfo.name }}</view>
      <view class="order-details">
        <view
          class="goods-list"
          :style="state.showMoreGoods ? 'min-height: 102rpx;' : 'max-height: 362rpx;'"
        >
          <view class="goods-box" v-for="(item, index) in goodsList" :key="index">
            <view class="goods-img">
              <image :src="item.imageUrl"></image>
            </view>
            <view class="goods-info">
              <view class="goods-name">{{ item.name }}</view>
              <view class="goods-num-price">
                <view class="goods-num">x{{ item.productNum }}</view>
                <view class="goods-price">
                  ￥
                  <text class="now-price">{{ item.sellPrice }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="more-details" @click="showGoodsDeatils">
          <text>{{ state.showMoreGoodsText }}</text>
          <image
            :src="state.imagesPath.iconFacePayMore"
            :class="state.showMoreGoods ? 'show' : ''"
          ></image>
        </view>
      </view>
    </view>
    <view class="discount-info" v-if="!state.loading">
      <view class="discount-item" @click="handleScoreChoice" data-type="discount">
        <view class="left" :data-scorerule="state.scoreInfo.scoreRule" @click.stop="viewScoreWarn">
          积分抵扣
          <image
            src="http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/xianfengImages/iconOrderTips2.png"
          ></image>
        </view>
        <view class="right">
          最多可抵
          <view class="score-amount">-￥{{ filters.filtToFix(state.scoreAmount) }}</view>
          <view :class="'checkbox-icon ' + (state.useScore ? 'active' : '')"></view>
        </view>
      </view>
      <view class="discount-item" @click="toChoiceCoupon" data-type="discount">
        <view class="left">优惠券抵扣</view>
        <view class="right">
          <text class="no-coupon" v-if="state.couponDiscount === 0">
            {{ discountNum > 0 ? discountNum + '张可用优惠券' : '暂无可用优惠券' }}
          </text>
          <text class="amount" v-else>
            -￥
            <text class="now-price">{{ state.couponDiscount }}</text>
          </text>
          <image class="right-icon" :src="state.imagesPath.iconPointRight" mode="widthFix"></image>
        </view>
      </view>
    </view>
    <view class="pay-info" v-if="isMember && !state.loading">
      <view class="pay-item card" data-type="CARD" @click="handlePayMethod">
        <view>
          <image :src="state.imagesPath.iconFacePayCard" class="icon"></image>
          <text>余额支付</text>
        </view>
        <image
          :src="
            state.payMethod.useStoredValueCard
              ? state.imagesPath.iconFacePaySelected
              : state.imagesPath.iconFacePayUnSelect
          "
          class="select-icon"
        ></image>
      </view>
      <view class="pay-item wx" data-type="WX" @click="handlePayMethod">
        <view>
          <image :src="state.imagesPath.iconFacePayWX" class="icon"></image>
          <text>微信支付</text>
        </view>
        <image
          :src="
            state.payMethod.facePay
              ? state.imagesPath.iconFacePaySelected
              : state.imagesPath.iconFacePayUnSelect
          "
          class="select-icon"
        ></image>
      </view>
    </view>
    <view class="loading-box" v-if="state.isMember && state.loading">
      <loading></loading>
    </view>
    <view class="middle-button" v-if="!state.hasUserInfo || !state.isMember">
      <button
        class="pay-btn"
        :style="state.theme.mainBgColor"
        v-if="!state.hasUserInfo"
        @click="getUserInfo"
      >
        获取授权
      </button>
      <button
        class="pay-btn"
        :style="state.theme.mainBgColor"
        v-else-if="!isMember"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        手机号授权登录
      </button>
    </view>
    <view class="bottom-button" v-if="state.hasUserInfo && isMember">
      <button
        class="pay-btn"
        :style="state.theme.mainBgColor"
        v-if="!state.hasUserInfo"
        @click="getUserInfo"
      >
        获取授权
      </button>
      <button
        class="pay-btn"
        :style="state.theme.mainBgColor"
        v-else-if="!isMember"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        手机号授权登录
      </button>
      <button
        class="pay-btn"
        :style="state.theme.mainBgColor"
        v-else-if="state.disabled"
        :disabled="state.disabled"
      >
        确认支付
      </button>
      <button
        class="pay-btn"
        :style="state.theme.mainBgColor"
        v-else
        :disabled="state.disabled"
        @click="toPay"
      >
        确认支付￥{{ filters.filtToFix(allPrice - state.totalDiscount - state.scoreDiscount) }}
      </button>
    </view>
    <!-- 付款超时弹窗 -->
    <popup
      :show="state.show.timeOut"
      position="middle"
      custom-class="middle"
      @close="toggleTimeOutPopup"
    >
      <view class="popup-content">
        <view class="popup-content-box">
          <image :src="state.imagesPath.iconNetworkTimeout" mode="widthFix"></image>
        </view>
        <view class="button" :style="state.theme.mainBgColor" @click="toggleTimeOutPopup">
          我知道了
        </view>
      </view>
    </popup>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsAuthJs from '@/utils/newretail/auth'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _apiPromotionServiceJs from '@/service/api/newretail/promotionService'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
// import goodsDetailBar from '@/pages-sub/newretail/components/goodsDetail-bar/goodsDetail-bar.vue';
import loading from '@/pages-sub/newretail/components/loading/loading.vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue'
const app = getApp()

// pages/wxfaceapp/index/index.js
const wxaUserService = _apiWxaUserServiceJs
const orderService = _apiOrderServiceJs
const memberService = _apiMemberServiceJs
const couponService = _apiCouponServiceJs
const promotionService = _apiPromotionServiceJs
const storeService = _apiStoreServiceJs
const systemService = _apiSystemServiceJs
const auth = _utilsAuthJs
const UTILS = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const IMGAGESPATH = _utilsImagesPathJs
const THEME = _utilsThemeManagerJs
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
// 获取应用实例
const state = reactive({
  navigationBarTitle: '支付确认',
  imagesPath: IMGAGESPATH,
  theme: THEME,
  tabbar: {},
  userInfo: {},
  hasUserInfo: false,
  member: {
    couponNum: 0,
  },
  canBuy: true,
  disabled: true,
  showMoreGoods: false,
  // 显示更多商品
  showMoreGoodsText: '展开查看更多',
  // 显示更多商品文字
  scource: 'SHOPPINGCART',
  // 来自购物车SHOPPINGCART,立即购买BUYNOW
  mallOrderType: 'COMMON',
  // 订单类型 OFFLINE
  offlinType: 'normal',
  // cashReceipt
  scoreDiscount: 0,
  // 积分抵扣
  couponDiscount: 0,
  // 券抵扣
  cashDiscount: 0,
  // 现金抵扣金额
  totalDiscount: 0,
  // 总优惠金额
  giftCardDiscount: 0,
  // 礼品卡优惠金额
  inputAmount: 0,
  // 整单优惠金额
  shipmentAmount: 0,
  shipmentDiscount: 0,
  shipmentRealPay: 0,
  shipmentCouponDiscount: 0,
  // 运费抵扣金额(运费券)
  vipGradeConfig: null,
  giftProducts: [],
  couponTips: '选择优惠券',
  couponInfo: {
    description: '选择优惠券',
    data: {
      freeship: [],
      discount: [],
    },
    useCoupon: false,
  },
  useCoupon: [],
  usedCoupons: [],
  payMethod: {
    facePay: false,
    useStoredValueCard: false,
    cardDeductTotal: 0,
  },
  cardDeductTotal: 0,
  // 储值抵扣金额
  storedValueCard: {
    useAmount: 0.0,
    // 本次使用额度
    balance: 0.0, // 储值卡余额
  },
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    timeOut: false,
  },
  loading: false,
  integral: 0,
  memberScore: 0,
  scoreInfo: {
    scoreAmount: 0,
  },
  scoreAmount: 0.0,
  useScore: false,
  systemOptions: {
    // 系统配置项信息
    isGiftCard: false,
    // 是否支持礼品卡
    isBothScoreAndCoupon: false, // 是否能同时使用积分和优惠券
  },
})
function querySystemOptions() {
  const that = this
  // 查询配置项
  const configures = {
    isGiftCard: true,
    isBothScoreAndCoupon: false,
  }
  const keys = ['isGiftCard', 'isBothScoreAndCoupon', 'fictitiousProductId']
  systemService
    .query(keys)
    .then((res) => {
      if (res && res.length > 0) {
        res.forEach((item) => {
          // 遍历配置项，获取订单预约时间和订单自提开始时间
          if (item.key === 'isGiftCard' && item.value != null && item.value !== '') {
            item.value === 'TRUE' ? (configures.isGiftCard = true) : (configures.isGiftCard = false)
          } else if (
            item.key === 'isBothScoreAndCoupon' &&
            item.value != null &&
            item.value !== ''
          ) {
            item.value === 'TRUE'
              ? (configures.isBothScoreAndCoupon = true)
              : (configures.isBothScoreAndCoupon = false)
          } else if (
            item.key === 'fictitiousProductId' &&
            item.value != null &&
            item.value !== ''
          ) {
            app.globalData.systemConfigure.fictitiousProductId = item.value
          }
        })
      }
      console.log('----------------查询配置信息')
      console.log(configures)
      state.systemOptions = configures
    })
    .catch((err) => {
      console.log('----------------查询配置信息出错')
      console.log(err)
      state.systemOptions = configures
    })
}
onLoad(function (options) {
  console.log('20912201350')
  // 清除上一个使用者的token信息
  app.globalData.userInfo = null
  state.theme = {
    color:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color: ' + app.globalData.uiconfig.themeColor + ';'
        : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background: ' + app.globalData.uiconfig.themeColor + ';'
        : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';'
        : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient:
      app.globalData.uiconfig &&
      app.globalData.uiconfig.themeColor != null &&
      app.globalData.uiconfig.themeColor !== '#FF9F43'
        ? 'background: linear-gradient(-270deg, ' +
          app.globalData.uiconfig.themeColor +
          ', ' +
          app.globalData.uiconfig.themeColor +
          ');'
        : 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
    mainColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'border-color:rgba(255,159,67, 0.4);',
    mainColorRgb02:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? colorRgba(app.globalData.uiconfig.themeColor, 0.4)
        : 'rgba(255,159,67, 0.2)',
    BgColorRgb01:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';'
        : 'background-color:rgba(255,159,67, 0.1);',
  }
  querySystemOptions()
  auth.clearTokens()
  try {
    console.log('获取⻘蛙相关信息')
    wxfaceapp.checkWxFacePayOsInfo({
      success(res) {
        console.log('success [checkWxFacePayOsInfo]')
        console.log(res)
      },
      fail(res) {
        console.log('fail [checkWxFacePayOsInfo]')
        console.log(res)
      },
    })
  } catch (e) {
    // Do something when catch error
    console.log(e)
  }
  state.loading = true
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig
  login()
})
onReady(function () {})
onShow(function () {
  const self = this
  // 读取优惠券使用数据
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    try {
      const couponData = uni.getStorageSync('wj_chooseCoupon')
      if (couponData) {
        calcCoupon(couponData)
      }
      uni.removeStorageSync('wj_chooseCoupon')
    } catch (error) {
      console.log(error)
    }
  }
  if (!state.isMember && app.globalData.userInfo && app.globalData.userInfo.member) {
    handleLoginData(app.globalData.userInfo)
  }
})
onHide(function () {
  clearPayCodeTimeout()
})
onUnload(function () {
  clearPayCodeTimeout()
})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {})
function clearPayCodeTimeout() {
  // console.log("->->一码付取消定时器")
  clearTimeout(state.orderTimer)
  state.orderTimer = null
}
function login() {
  const that = this
  wxaUserService
    .login()
    .then((res) => {
      handleLoginData(res)
    })
    .catch((err) => {
      console.log(err)
      const msg = 'meet frequency limit'
      const authorize = 'auth deny'
      const errMsg = err.message
      state.isMember = false
      state.hasUserInfo = false
      if (
        errMsg.indexOf(msg) > -1 ||
        errMsg.indexOf(authorize) > -1 ||
        errMsg.indexOf('fail') > -1
      ) {
      } else {
        uni.showToast({
          title: errMsg,
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function handleLoginData(res) {
  const that = this
  console.log(res, '会员信息')
  app.globalData.userInfo = res && res.member ? res : null
  if (!res.member) {
    state.isMember = false
    state.userInfo = res.wxaUser
    state.hasUserInfo = true
    state.member = {
      couponNum: 0,
    }
  } else {
    let isExpired = false
    let isVIP = false
    const now = new UTILS.ResponseDate().getTime()
    let vipEndTimeStamp = now + 1000
    let vipEndTime = ''
    if (res.member.vipEndTime) {
      vipEndTimeStamp = new Date(res.member.vipEndTime.replace(/-/g, '/')).getTime()
      vipEndTime = res.member.vipEndTime.split(' ')[0].replace(/-/g, '.')
    }
    if (now > vipEndTimeStamp) {
      isExpired = true
    }
    if (res.member.vipEndTime && now < vipEndTimeStamp) {
      isVIP = true
      app.globalData.userInfo.member.vip = true
    }
    state.member = {
      ...state.member,
      ...res.member,
      nickName: res.member.nickName ? res.member.nickName : res.wxaUser.nickName,
    }
    state.isVIP = isVIP
    state.isMember = true
    state.userInfo = res.wxaUser
    state.hasUserInfo = true
    getMemberInfo()
    sendMemberCode(res.member)
    checkUserInfo()
  }
}
function getUserInfo(e) {
  const that = this
  wxaUserService
    .login(true)
    .then((res) => {
      console.log(res, '会员信息')
      handleLoginData(res)
    })
    .catch((err) => {
      console.log(err)
      const msg = 'meet frequency limit'
      const authorize = 'auth deny'
      const errMsg = err.message
      state.isMember = false
      state.hasUserInfo = false
      if (
        errMsg.indexOf(msg) > -1 ||
        errMsg.indexOf(authorize) > -1 ||
        errMsg.indexOf('fail') > -1
      ) {
      } else {
        uni.showToast({
          title: errMsg,
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function getPhoneNumber(e) {
  // console.log(e)
  const self = this
  if (e.detail.errMsg.indexOf('ok') >= 0) {
    const params = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      registerSourceType: 'WXAPP',
    }
    if (app.globalData.channel) {
      params.channel = app.globalData.channel
    }
    wxaUserService
      .bindMobileByEncrypt(params)
      .then((res) => {
        return wxaUserService.login()
      })
      .then((res) => {
        auth.setUser(res)
        app.globalData.userInfo = res && res.member ? res : null
        if (!res.member) {
          state.hasUserInfo = true
          uni.showToast({
            title: '绑定失败~',
            icon: 'none',
            duration: 2000,
          })
        } else {
          handleLoginData(res)
        }
      })
      .catch((err) => {
        if (err.code === 23002) {
          getUserInfo()
        } else {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
        }
      })
  } else {
    uni.showToast({
      title: '获取手机号失败，即将跳转到手动绑定手机号',
      icon: 'none',
      duration: 2000,
    })
    setTimeout(function () {
      toBindMobile()
    }, 2000)
  }
}
function toBindMobile() {
  NAVPAGE.toBindMobile()
}
function getMemberInfo() {
  // 获取用户未使用的券数量
  queryCoupon()

  // 获取用户的储值余额
  getMbrBalance()
}
function queryCoupon() {
  couponService
    .getMbrUnUseCouponCount()
    .then((res) => {
      let tempMember = state.member
      tempMember = {
        ...tempMember,
        couponNum: res,
      }
      state.member = tempMember
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function getMbrBalance() {
  const that = this
  memberService.getMbrBalance().then((res) => {
    // 储值卡余额大于0时才会使用
    if (res > 0) {
      state.storedValueCard = {
        ...state.storedValueCard,
        balance: res, // 储值卡余额
      }
      state.payMethod.balance = res
      if (cacheOrder) {
        handleCardBalance()
      }
    } else {
      state.storedValueCard = {
        useAmount: 0,
        // 本次使用额度
        balance: 0, // 储值卡余额
      }
      state.cardDeductTotal = 0
      state.payMethod.useStoredValueCard = false
    }
  })
}
function handleCardBalance(isUserChange = false) {
  const that = this
  const allPrice = Number(state.allPrice) // 订单金额
  const totalDiscount = Number(state.totalDiscount) // 现金抵扣金额
  // 积分抵扣
  const scoreDeductionAmount = Number(state.scoreDiscount)
  const canUseAmount = Number(state.storedValueCard.balance) // 可以使用的储值金额
  // 总价减去抵扣（现金、券和积分优惠）和运费抵扣剩下的金额
  const paymentTotal = parseFloat((allPrice - totalDiscount).toFixed(2))
  // 计算礼品卡抵扣的金额
  const giftCardDiscount = 0
  const tempPrice = parseFloat(
    (allPrice - totalDiscount - scoreDeductionAmount - giftCardDiscount).toFixed(2),
  )
  const useStoredValueCard = canUseAmount > 0
  if (!isUserChange) {
    // 不是用户手动操作
    if (tempPrice > 0) {
      if (tempPrice > canUseAmount) {
        // 默认勾选储值支付
        state.storedValueCard = {
          ...state.storedValueCard,
          useAmount: canUseAmount, // 本次使用余额
        }
        state.cardDeductTotal = canUseAmount
        state.useStoredValueCard = useStoredValueCard
        state.payMethod.useStoredValueCard = useStoredValueCard
        state.payMethod.cardDeductTotal = canUseAmount
        state.payMethod.facePay = true
      } else {
        state.storedValueCard = {
          ...state.storedValueCard,
          useAmount: tempPrice, // 本次使用余额
        }
        state.cardDeductTotal = tempPrice
        state.useStoredValueCard = useStoredValueCard
        state.payMethod.useStoredValueCard = useStoredValueCard
        state.payMethod.cardDeductTotal = tempPrice
      }
    } else {
      state.storedValueCard = {
        ...state.storedValueCard,
        useAmount: 0, // 本次使用余额
      }
      state.cardDeductTotal = 0
      state.useStoredValueCard = true
      state.payMethod.useStoredValueCard = true
      state.payMethod.cardDeductTotal = 0
      state.payMethod.facePay = true
    }
    checkPayMethod(allPrice)
  } else {
    if (tempPrice > 0) {
      if (tempPrice > canUseAmount) {
        // 默认勾选储值支付
        state.storedValueCard = {
          ...state.storedValueCard,
          useAmount: canUseAmount, // 本次使用余额
        }
        state.cardDeductTotal = canUseAmount
        state.payMethod.cardDeductTotal = canUseAmount
      } else {
        state.storedValueCard = {
          ...state.storedValueCard,
          useAmount: tempPrice, // 本次使用余额
        }
        state.cardDeductTotal = tempPrice
        state.payMethod.cardDeductTotal = tempPrice
      }
    } else {
      state.storedValueCard = {
        ...state.storedValueCard,
        useAmount: 0, // 本次使用余额
      }
      state.cardDeductTotal = 0
      state.payMethod.cardDeductTotal = 0
    }
  }
}
function getStoreInfoById(id) {
  const that = this
  storeService.getById(id).then((res) => {
    if (!res) {
      return
    }
    const storeInfo = res
    state.storeInfo = storeInfo
  })
}
function checkUserInfo() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    // 判断用户是否是会员
    const res = app.globalData.userInfo
    let isExpired = false
    let isVIP = false
    const now = new UTILS.ResponseDate().getTime()
    let vipEndTimeStamp = now + 1000
    let vipEndTime = ''
    if (res.member.vipEndTime) {
      vipEndTimeStamp = new Date(res.member.vipEndTime.replace(/-/g, '/')).getTime()
      vipEndTime = res.member.vipEndTime.split(' ')[0].replace(/-/g, '.')
    }
    if (now > vipEndTimeStamp) {
      isExpired = true
    }
    if (res.member.vipEndTime && now < vipEndTimeStamp) {
      isVIP = true
      app.globalData.userInfo.member.vip = true
    }
    state.isVIP = isVIP
    state.isExpired = isExpired
    state.vipEndTime = vipEndTime
  }
}
function sendMemberCode(member) {
  const that = this
  try {
    state.memberCode = member.mobile
    console.log('将会员码传⼊串⼝⾄POS机')
    wxfaceapp.writeToSerialPort({
      msgToFlush: member.mobile,
      success(res) {
        console.log('success [writeToSerialPort]')
        console.log(res.replyCode)
        console.log(res.reply)
        console.log(res.flushedMsg)
        // 查询缓存订单
        getCacheOrder()
      },
      fail(res) {
        console.log('fail [writeToSerialPort]')
        console.log(res.replyCode)
        console.log(res.reply)
      },
    })
  } catch (e) {
    // Do something when catch error
    console.log(e)
    getCacheOrder()
  }
}
function handleGetCacheOrder(amount, that) {
  clearTimeout(state.orderTimer)
  uni.hideLoading()
  UTILS.setHideLoading(true)
  orderService
    .getCacheOrder(that.data.memberCode)
    .then((res) => {
      console.log('查询缓存订单结果-------------')
      console.log(res)
      amount++
      console.log(amount)
      if (amount > 30) {
        UTILS.setHideLoading(false)
        uni.hideLoading()
        // 弹出支付超时
        UTILS.showToast('没有待付款订单~')
        setTimeout(() => {
          try {
            wxfaceapp.exitMp({
              success(res) {
                console.log('exit mini app!')
              },
            })
          } catch (error) {
            console.log(error)
          }
        }, 500)
        return
      }
      if (res && res.products.length > 0) {
        // 将缓存订单传到下单页面
        cacheOrder = JSON.parse(JSON.stringify(res))
        // 添加购物车
        const storeId = res.storeId
        // 查询门店信息
        getStoreInfoById(storeId)
        orderJump()
        /**
         * 下单跳转
         * 1、添加购物车
         * 2、查询购物车
         * 3、跳转下单页面
         */
        function orderJump() {
          let allPrice = 0
          const cacheOrderId = res.cacheOrderId
          const discount = 0
          const tempList = []
          let isFictitiousProduct = false // 是否虚拟商品
          res.products.forEach((item) => {
            let tempItem = {
              ...item,
            }
            if (res.productDetails && res.productDetails.length > 0) {
              res.productDetails.forEach((ele) => {
                if (item.productId === ele.id) {
                  tempItem = {
                    ...tempItem,
                    ...ele,
                    sellPrice: ele.sellPrice || ele.originalPrice,
                  }
                  if (
                    that.data.isVIP &&
                    that.data.vipGradeConfig.openMemberPrice &&
                    ele.memberPrice &&
                    Number(ele.memberPrice) < Number(ele.sellPrice)
                  ) {
                    tempItem.sellPrice = ele.memberPrice
                    tempItem.useMemberPrice = true
                  }
                  if (
                    ele.promotionPrice &&
                    Number(ele.promotionPrice) < Number(tempItem.sellPrice)
                  ) {
                    tempItem = {
                      ...tempItem,
                      sellPrice: ele.promotionPrice,
                      usePromotionPrice: true,
                      useMemberPrice: false,
                    }
                  }
                  allPrice =
                    allPrice +
                    parseFloat(
                      (Number(tempItem.sellPrice) * Number(tempItem.productNum)).toFixed(2),
                    )
                  tempList.push(tempItem)
                }
              })
            } else {
              if (
                app.globalData.systemConfigure.fictitiousProductId &&
                item.productId === app.globalData.systemConfigure.fictitiousProductId
              ) {
                isFictitiousProduct = true
                tempItem = {
                  ...tempItem,
                  name: '无码商品',
                  imageUrl: that.data.imagesPath.iconOffLine,
                  sellPrice: res.allPrice || 0,
                }
              }
              tempList.push(tempItem)
              allPrice = res.allPrice || 0
            }
          })
          try {
            that.setData({
              allPrice: allPrice.toFixed(2),
              goodsList: tempList,
              giftProducts: [],
              orderType: 'normal',
              storeId,
              discount: parseFloat(discount),
              scource: res.scource,
              cacheOrderId,
              // 缓存订单id
              type: res.type,
              offlinType: isFictitiousProduct ? 'cashReceipt' : 'normal',
              inputAmount: res.inputAmount || 0,
            })
            if (res.allPrice >= 0) {
              that.getMbrScoreBalance()
              that.getAvailableCouponNum()
              that.setData({
                disabled: false,
              })
            }
          } catch (e) {
            console.log(e.message)
          }
        }
      } else {
        const orderTimer = setTimeout(() => {
          console.log('轮询缓存订单')
          const page = UTILS.utilGetCurrentPage()
          if (page == that) {
            that.handleGetCacheOrder(amount, that)
          } else {
            console.log('当前显示的页面不是index，不调用')
          }
        }, 1000)
        that.data.orderTimer = orderTimer
      }
    })
    .catch((err) => {
      console.log(err.message)
      uni.hideLoading()
      UTILS.setHideLoading(false)
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function getCacheOrder() {
  const that = this
  const amount = 0
  handleGetCacheOrder(amount, that)
}
function handlePayMethod(e) {
  const that = this
  const type = e.currentTarget.dataset.type
  const allPrice = Number(state.allPrice) // 订单金额
  const totalDiscount = Number(state.totalDiscount) // 现金抵扣金额
  // 积分抵扣
  const scoreDeductionAmount = Number(state.scoreDiscount)
  // 计算礼品卡抵扣的金额
  const giftCardDiscount = 0
  const tempPrice = parseFloat(
    (allPrice - totalDiscount - scoreDeductionAmount - giftCardDiscount).toFixed(2),
  )
  if (type === 'CARD') {
    state.payMethod.useStoredValueCard = !state.payMethod.useStoredValueCard
    handleCardBalance(true)
  } else if (type === 'WX') {
    state.payMethod.facePay = !state.payMethod.facePay
  } else {
    state.payMethod.useStoredValueCard = false
    state.payMethod.facePay = false
  }
  checkPayMethod(tempPrice)
}
function checkPayMethod(allPrice) {
  const self = this
  allPrice = parseFloat(allPrice) > 0 ? allPrice : 0
  if (parseFloat(allPrice) >= 0) {
    // 如果未选择支付方式则订单不能支付
    if (!state.payMethod.useStoredValueCard && !state.payMethod.facePay) {
      state.disabled = true
    } else {
      state.disabled = false
    }
  } else {
    state.disabled = true
  }
}
function toChoiceCoupon(val) {
  const that = this
  if (!state.canBuy) {
    return
  }
  if (state.useScore && !state.systemOptions.isBothScoreAndCoupon) {
    uni.showModal({
      title: '提示',
      content: '积分和优惠券不可同时使用',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          state.integral = 0
          state.scoreDiscount = 0
          state.useScore = false
          handleChoiceCoupon()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  } else {
    handleChoiceCoupon()
  }
  function handleChoiceCoupon() {
    const orderData = JSON.stringify(getPostData())
    const opts =
      '?orderData=' +
      orderData +
      '&type=' +
      state.type +
      '&orderType=' +
      state.orderType +
      '&couponType=' +
      val.currentTarget.dataset.type
    NAVPAGE.toChoiceCoupon(opts)
  }
}
function getAvailableCouponNum() {
  const that = this
  const data = getPostData()
  const postData = {
    order: data,
  }
  queryAvailableCoupon()
  console.log(postData)
  function queryAvailableCoupon() {
    const allPrice = parseFloat(data.allPrice)
    if (allPrice > 0) {
      couponService
        .getAvailableCoupon(null, postData)
        .then((res) => {
          console.log(res)
          let discountNum = 0
          let freeshipNum = 0
          let deductionAmount = 0
          let deductionRate = 1
          let tempCoupon = null
          const discountCoupons = [] // 可用折扣券列表
          if (res && res.length > 0) {
            res.forEach((item) => {
              if (item.usable === true) {
                if (item.coupon.function !== 'FREESHIP') {
                  discountNum++
                  // 找出满减券中可抵扣金额最大的那张
                  if (item.coupon.function === 'CASH') {
                    if (item.coupon.faceValue > deductionAmount) {
                      tempCoupon = item
                      deductionAmount = item.coupon.faceValue
                    }
                  } else if (item.coupon.function === 'DISCOUNT') {
                    discountCoupons.push(item)
                  }
                } else {
                  freeshipNum++
                }
              }
            })
            // 自动选择折扣率最大的折扣券
            if (deductionAmount === 0 && discountCoupons.length > 0) {
              discountCoupons.forEach((item) => {
                if (item.coupon.rate < deductionRate) {
                  tempCoupon = item
                  deductionRate = item.coupon.rate
                }
              })
            }
          }
          // 如果用户当前没有选择优惠券，默认选择最大抵扣的现金券
          if (
            !state.couponInfo.useCoupon &&
            state.usedCoupons.length === 0 &&
            tempCoupon &&
            (deductionAmount > 0 || deductionRate < 1)
          ) {
            const couponData = {
              couponType: 'discount',
              coupons: [tempCoupon],
            }
            calcCoupon(couponData)
          } else {
            calcPromotions()
          }
          state.hasAvailableCoupon = true
          state.discountNum = discountNum
          state.freeshipNum = freeshipNum
        })
        .catch((err) => {
          console.log(err)
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
        })
    } else {
      state.hasAvailableCoupon = true
      state.discountNum = 0
      state.freeshipNum = 0
    }
  }
}
function calcCoupon(couponData) {
  const self = this
  let shipmentDiscount = 0 // 运费券抵扣金额
  const shipmentAmount = state.shipmentAmount // 运费
  let freeship = shipmentAmount
  let couponDiscount = state.couponDiscount
  let coupons = {
    freeship: [],
    discount: [],
  }
  const usedCoupons = []
  if (couponData.coupons.length > 0) {
    coupons = state.couponInfo.data
    couponData.coupons.forEach((item) => {
      if (couponData.couponType === 'freeship') {
        coupons.freeship = []
        coupons.freeship.push(item)
      } else if (couponData.couponType === 'discount') {
        coupons.discount = []
        coupons.discount.push(item)
      }
    })
    if (coupons.freeship && coupons.freeship.length > 0) {
      coupons.freeship.forEach((ele) => {
        usedCoupons.push({
          couponId: ele.coupon.id,
          service: ele.service,
        })
      })
    }
    if (coupons.discount && coupons.discount.length > 0) {
      coupons.discount.forEach((ele) => {
        usedCoupons.push({
          couponId: ele.coupon.id,
          service: ele.service,
        })
      })
    }
  } else {
    coupons = state.couponInfo.data
    if (couponData.couponType === 'freeship') {
      shipmentDiscount = 0
      freeship = shipmentAmount
      coupons.freeship = []
    } else if (couponData.couponType === 'discount') {
      couponDiscount = 0
      shipmentDiscount = state.shipmentDiscount
      freeship = state.shipmentRealPay
      coupons.discount = []
    }
  }
  state.couponInfo = {
    description: '选择优惠券',
    data: coupons,
    useCoupon: true,
  }
  state.usedCoupons = usedCoupons
  calcPromotions()
}
function calcPromotions() {
  const self = this
  const products = []
  state.goodsList.forEach((item) => {
    let tempItem = {
      id: item.productId,
      count: item.productNum,
    }
    // 分享人id
    if (item.sharingPersonId) {
      tempItem = {
        ...tempItem,
        sharingPersonId: item.sharingPersonId,
      }
    }
    if (item.groupProducts && item.groupProducts.length > 0) {
      tempItem.cateringOrderDetails = item.groupProducts
    }
    if (state.scource === 'SHOPPINGCART') {
      tempItem = {
        ...tempItem,
        shoppingCartItemId: item.id,
      }
    }
    if (item.newmbrActivityId) {
      tempItem = {
        ...tempItem,
        newmbrActivityId: item.newmbrActivityId,
      }
      products.push(tempItem)
    } else if (item.grabActivityId) {
      tempItem = {
        ...tempItem,
        grabActivityId: item.grabActivityId,
      }
      products.push(tempItem)
    } else if (state.teamBuyId !== '' && state.teamBuyId != null && state.orderType === 'group') {
      tempItem = {
        ...tempItem,
        teamBuyingActivityId: state.teamBuyId,
      }
      if (state.teamLeaderRecordId !== '') {
        tempItem = {
          ...tempItem,
          teamLeaderRecordId: state.teamLeaderRecordId,
        }
      }
      products.push(tempItem)
    } else if (item.usePromotionPrice) {
      tempItem = {
        ...tempItem,
        usePromotionPrice: true,
      }
      products.push(tempItem)
    } else if (item.useMemberPrice) {
      tempItem = {
        ...tempItem,
        useMemberPrice: true,
      }
      products.push(tempItem)
    } else {
      products.push(tempItem)
    }
    // 如果该商品有赠品
    if (item.goodsPromotions && item.goodsPromotions.length > 0) {
      item.goodsPromotions.forEach((item) => {
        products.push({
          gift: true,
          id: item.goods.uuid,
          count: item.count,
        })
      })
    }
  })
  state.giftProducts.forEach((item) => {
    products.push({
      gift: true,
      productId: item.productId,
      productNum: item.productNum,
    })
  })
  let shipmentAmount = 0
  if (state.type === 'dispatch') {
    shipmentAmount = state.shipmentAmount
  }
  let postData = {
    memberId: state.member.id,
    products,
    storeId: state.storeId,
    usedCoupons: state.usedCoupons,
    shipmentAmount: shipmentAmount || null,
  }
  if (cacheOrder) {
    // 收银下单，传入缓存订单id
    postData = {
      ...postData,
      inputAmount: state.inputAmount > 0 ? state.inputAmount : 0,
    }
  }
  promotionService
    .calcPromotions(postData)
    .then((res) => {
      const goods = state.goodsList
      if (res) {
        // 处理运费券
        const shipmentDiscount =
          res.discounts.shipmentDiscount && res.discounts.shipmentDiscount.details.length > 0
            ? res.discounts.shipmentDiscount.discount
            : state.shipmentDiscount // 运费抵扣
        // 处理运费券不能使用的情况
        if (
          state.type === 'dispatch' &&
          shipmentDiscount === 0 &&
          state.couponInfo.data.freeship &&
          state.couponInfo.data.freeship.length > 0
        ) {
          const freeship = state.couponInfo.data.freeship
          const usedCoupons = state.usedCoupons
          for (let i = 0; i < usedCoupons.length; i++) {
            const ele = usedCoupons[i]
            if (ele.couponId === freeship[0].coupon.id) {
              usedCoupons.splice(i, 1)
              break
            }
          }
          state.couponInfo.data.freeship = []
        }
        // 处理优惠券不能使用的情况
        if (
          couponDiscount === 0 &&
          state.couponInfo.data.discount &&
          state.couponInfo.data.discount.length > 0
        ) {
          const discount = state.couponInfo.data.discount
          const usedCoupons = state.usedCoupons
          for (let i = 0; i < usedCoupons.length; i++) {
            const ele = usedCoupons[i]
            if (ele.couponId === discount[0].coupon.id) {
              usedCoupons.splice(i, 1)
              break
            }
          }
          state.couponInfo.data.discount = []
        }

        // 计算订单抵扣
        // 现金抵扣金额
        const cashDiscount = res.discounts.cashDiscount ? res.discounts.cashDiscount.discount : 0
        // 券抵扣金额
        const couponDiscount = res.discounts.couponDiscount
          ? res.discounts.couponDiscount.discount
          : 0
        const shipmentRealPay =
          Number(state.shipmentAmount) - Number(shipmentDiscount) > 0
            ? parseFloat((Number(state.shipmentAmount) - Number(shipmentDiscount)).toFixed(2))
            : 0
        // 计算促销(拼团不参与送商品促销)
        state.cashDiscount = cashDiscount
        state.couponDiscount = couponDiscount
        state.totalDiscount = res.discounts.totalDiscount
        state.shipmentDiscount = shipmentDiscount
        state.shipmentRealPay = shipmentRealPay
        if (
          res.promotions &&
          res.promotions.goodsPromotions &&
          res.promotions.goodsPromotions.length > 0 &&
          state.orderType !== 'group'
        ) {
          // 有促销且促销中有送商品促销
          const giftGoods = []
          res.promotions.goodsPromotions.forEach((it) => {
            if (it.goodsRange && it.goodsRange.length === 1) {
              // 指定商品送赠品
              const goodsPromotions = []
              for (let i = 0; i < goods.length; i++) {
                const ele = goods[i]
                if (ele.productId === it.goodsRange[0]) {
                  goodsPromotions.push(it)
                  goods[i].goodsPromotions = goodsPromotions
                  break
                }
              }
            } else if (it.goodsRange && (it.goodsRange.length === 0 || it.goodsRange.length > 1)) {
              giftGoods.push({
                giftProduct: true,
                productId: it.goods.uuid,
                productNum: it.count,
                name: it.goods.name,
                image: it.goods.image,
              })
            } else {
              giftGoods.push({
                giftProduct: true,
                productId: it.goods.uuid,
                productNum: it.count,
                name: it.goods.name,
                image: it.goods.image,
              })
            }
          })
          state.goodsList = goods
          state.giftProducts = giftGoods
        }
        // 重新选择优惠券之后调用接口计算储值余额抵扣
        handleCardBalance()
      }
      state.loading = false
    })
    .catch((e) => {
      // 重新选择优惠券之后调用接口计算储值余额抵扣
      handleCardBalance()
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function getPostData() {
  const that = this
  const products = []
  state.goodsList.forEach((item) => {
    let tempItem = {
      productId: item.productId,
      productNum: item.productNum,
    }
    if (state.offlinType === 'cashReceipt') {
      tempItem = {
        ...tempItem,
        price: state.allPrice,
      }
    }
    // 分享人id
    if (item.sharingPersonId) {
      tempItem = {
        ...tempItem,
        sharingPersonId: item.sharingPersonId,
      }
    }
    if (item.groupProducts && item.groupProducts.length > 0) {
      tempItem.cateringOrderDetails = item.groupProducts
    }
    if (state.scource === 'SHOPPINGCART') {
      tempItem = {
        ...tempItem,
        shoppingCartItemId: item.id,
      }
    }
    if (item.newmbrActivityId) {
      tempItem = {
        ...tempItem,
        newmbrActivityId: item.newmbrActivityId,
      }
      products.push(tempItem)
    } else if (item.grabActivityId) {
      tempItem = {
        ...tempItem,
        activityId: item.grabActivityId,
      }
      products.push(tempItem)
    } else if (item.usePromotionPrice) {
      tempItem = {
        ...tempItem,
        usePromotionPrice: true,
      }
      products.push(tempItem)
    } else if (item.useMemberPrice) {
      tempItem = {
        ...tempItem,
        useMemberPrice: true,
      }
      products.push(tempItem)
    } else {
      products.push(tempItem)
    }
    // 如果该商品有赠品
    if (item.goodsPromotions && item.goodsPromotions.length > 0) {
      item.goodsPromotions.forEach((item) => {
        products.push({
          giftProduct: true,
          productId: item.goods.uuid,
          productNum: item.count,
        })
      })
    }
  })
  state.giftProducts.forEach((item) => {
    products.push({
      giftProduct: true,
      productId: item.productId,
      productNum: item.productNum,
    })
  })
  let postData = ''
  let tempSelfTime = null
  const shipmentType = 'SELF'
  // 自提时间格式为yyyy-mm-dd HH:mm:ss~yyyy-mm-dd HH:mm:ss
  const now = new UTILS.ResponseDate()
  // 自提时间默认为当前时间
  const date = UTILS.formatTime(now).replace(/\//g, '-')
  tempSelfTime = date + '~' + date
  let paymentPrice =
    parseFloat(state.allPrice) - parseFloat(state.totalDiscount) - parseFloat(state.scoreDiscount)
  paymentPrice = paymentPrice > 0 ? paymentPrice.toFixed(2) : 0
  const couponData = []
  let externalCouponData = ''
  if (state.couponInfo.useCoupon) {
    if (state.usedCoupons.length > 0) {
      state.usedCoupons.forEach((item) => {
        if (item.service === 'GM') {
          couponData.push(item.couponId)
        } else if (item.service === 'HD' || item.service === 'ZJIAN') {
          externalCouponData = item.couponId
        }
      })
    }
  }

  // 查询本地缓存，是否有场景值‘_scene_’缓存,
  let fromScene = ''
  try {
    const scene = uni.getStorageSync('_scene_')
    if (scene) {
      // Do something with return value
      fromScene = '-' + scene
    }
  } catch (e) {
    // Do something when catch error
  }
  const receiverMobile = state.member.mobile
  postData = {
    allPrice: paymentPrice,
    // 应该支付的金额
    products,
    // 商品列表
    receiverMobile,
    // 收货人手机号
    remark: '无',
    // 备注
    scource: state.scource,
    // 来自购物车SHOPPINGCART 立即购买BUYNOW
    shipmentAmount: 0,
    // 快递费
    shipmentType,
    // 配送方式
    selfTimeScope: tempSelfTime,
    // 预约自提时间
    storeId: state.storeId,
    // 门店id
    couponIds: couponData,
    // 券Id
    externalCouponNumber: externalCouponData,
    score: state.integral,
    orderSource: 'MINI_APP' + fromScene,
    // lat: app.globalData.location ? app.globalData.location.latitude.toFixed(6) : '',
    // lng: app.globalData.location ? app.globalData.location.longitude.toFixed(6) : ''
  }
  if (cacheOrder) {
    // 收银下单，传入缓存订单id
    postData = {
      ...postData,
      cacheOrderId: cacheOrder.cacheOrderId,
      scource: cacheOrder.scource,
      type: cacheOrder.type,
      inputAmount: state.inputAmount > 0 ? state.inputAmount : 0,
    }
  }
  return postData
}
function createOrder(val) {
  const self = this
  const postData = getPostData()
  console.log(postData)
  if (state.canBuy) {
    state.canBuy = false
    if (state.order) {
      // 订单已经创建，支付失败
      handlePayment(state.order)
      return
    }
    orderService
      .createCatering(postData)
      .then((res) => {
        console.log(res)
        handlePayment(res)
      })
      .catch((err) => {
        console.log(err)
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
        state.canBuy = true
      })
  }
}
function toPay() {
  const that = this
  const allPrice = Number(state.allPrice) // 订单金额
  const totalDiscount = Number(state.totalDiscount) // 现金抵扣金额
  // 积分抵扣
  const scoreDeductionAmount = Number(state.scoreDiscount)
  // 计算礼品卡抵扣的金额
  const giftCardDiscount = 0
  const tempPrice = parseFloat(
    (allPrice - totalDiscount - scoreDeductionAmount - giftCardDiscount).toFixed(2),
  )
  if (tempPrice > 0) {
    if (!state.payMethod.useStoredValueCard && !state.payMethod.facePay) {
      UTILS.showToast('请选择支付方式~')
      return
    }
  }
  createOrder()
}
function handlePayment(order) {
  const that = this
  state.order = order
  if (state.payMethod.useStoredValueCard) {
    if (order.cashTotal === 0) {
      getOrderStatusById(order.id, that)
      orderLock(order)
    } else if (order.cashTotal > 0) {
      if (parseFloat(state.payMethod.cardDeductTotal) < parseFloat(order.cashTotal)) {
        facePay()
      } else {
        getCardPay(order)
      }
    }
  } else {
    facePay()
  }
}
function getCardPay(order) {
  const self = this
  const postData = {
    orderId: order.id,
    entry: 'ORDER',
    total: order.cashTotal,
    payMethod: 'CARDPAY',
  }
  orderService
    .getCashPaySign(postData)
    .then((res) => {
      getOrderStatusById(order.id, self)
      orderLock(order)
    })
    .catch((e) => {
      state.canBuy = true
      if (e.code === -1001) {
        // 请求超时
        orderLock(order)
        toggle('timeOut')
      } else {
        UTILS.showToast(e.message)
      }
    })
}
function handleFacepay(authCode) {
  const that = this
  if (state.payMethod.useStoredValueCard) {
    if (parseFloat(state.order.cardDeductTotal) < parseFloat(state.order.cashTotal)) {
      // 储值抵扣金额小于应付金额
      console.log('储值抵扣金额小于应付金额,使用组合支付')
      getComposePay(authCode)
    } else {
      console.log('储值抵扣金额小于应付金额,使用微信支付')
      getWxPay(authCode)
    }
  } else {
    getWxPay(authCode)
  }
}
function getWxPay(authCode) {
  const self = this
  const order = state.order
  const postData = {
    orderId: order.id,
    entry: 'ORDER',
    total: order.cashTotal,
    payMethod: 'WXPAY_MICRO_PAY',
    authCode,
  }
  orderService
    .getCashPaySign(postData)
    .then((res) => {
      getOrderStatusById(order.id, self)
      orderLock(order)
    })
    .catch((e) => {
      state.canBuy = true
      if (e.code === -1001) {
        // 请求超时
        orderLock(order)
        toggle('timeOut')
      } else {
        UTILS.showToast(e.message)
      }
    })
}
function getComposePay(authCode) {
  const self = this
  const order = state.order
  const postData = {
    orderId: order.id,
    entry: 'ORDER',
    total: state.payMethod.cardDeductTotal,
    payMethod: 'CARDPAY',
  }
  orderService
    .getCashPaySign(postData)
    .then((res) => {
      getOrderStatusById(order.id, self)
      let total = parseFloat(
        (parseFloat(order.cashTotal) - parseFloat(state.payMethod.cardDeductTotal)).toFixed(2),
      )
      total = total > 0 ? total : 0
      const tempData = {
        orderId: order.id,
        entry: 'ORDER',
        total,
        payMethod: 'WXPAY_MICRO_PAY',
        authCode,
      }
      return orderService.getCashPaySign(tempData)
    })
    .then((res) => {
      getOrderStatusById(order.id, self)
      orderLock(order)
    })
    .catch((e) => {
      state.canBuy = true
      if (e.code === -1001) {
        // 请求超时
        orderLock(order)
        toggle('timeOut')
      } else {
        UTILS.showToast(e.message)
      }
    })
}
function orderLock(order) {
  orderService.orderLock(order.id).then((res) => {
    console.log(res)
  })
}
function handleGetOrderStatusById(orderId, amount, self) {
  uni.showLoading({
    title: '支付中',
  })
  orderService
    .getOrderStatusById(orderId)
    .then((result) => {
      console.log('查询交易结果-------------')
      console.log(result)
      amount++
      console.log(amount)
      if (amount > 40) {
        UTILS.setHideLoading(false)
        uni.hideLoading()
        // 弹出支付超时
        self.toggle('timeOut')
        return
      }
      if (
        result.status === 'PAID' ||
        result.status === 'WAITPAYBALANCE' ||
        result.status === 'PENDING' ||
        result.status === 'WAITSHIPPED' ||
        result.status === 'RECEIVED' ||
        result.status === 'SHIPPED'
      ) {
        UTILS.setHideLoading(false)
        uni.hideLoading()
        UTILS.showToast('支付成功')
        // 跳转到成功页面
        self.toPaymentSuccess(orderId)
      } else {
        const orderTimeId = setTimeout(() => {
          UTILS.setHideLoading(true)
          // 如果没有成功，调用函数本身，实现重复查询
          self.handleGetOrderStatusById(orderId, amount, self)
        }, 2000)
        self.setData({
          orderTimeId,
        })
      }
    })
    .catch((err) => {
      UTILS.showToast(err.message)
    })
}
function getOrderStatusById(orderId, self) {
  const amount = 0
  // self.handleGetOrderStatusById(orderId, amount, self);
  setTimeout(() => {
    self.handleGetOrderStatusById(orderId, amount, self)
  }, 1000)
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
function toggleTimeOutPopup() {
  toggle('timeOut')
}
function facePay() {
  const that = this
  try {
    console.log('调用人脸支付API')
    wxfaceapp.facePay({
      // msgToFlush: "需要传⼊串⼝⾄POS机的信息",
      requireFaceCode: true,
      // 是否需要获取付款码返回给小程序
      success(res) {
        console.log('success [launchFaceApp]')
        console.log(res.replyCode)
        console.log(res.reply)
        if (res.faceCode != null) {
          // faceCode，在传入requireFaceCode=true时起效
          console.log(res.faceCode)
        }
        // 刷脸成功Event 建议配合facePay的调用结果进行注册
        wxfaceapp.onFacePayPassEvent(function (res) {
          console.log('onFacePayPassEvent retCode = ' + res.replyCode)
          if (res.faceCode != null) {
            // faceCode，在传入requireFaceCode=true时起效
            // 调用微信当面付流程
            handleFacepay(res.faceCode)
          } else {
            state.canBuy = true
            uni.showModal({
              title: '温馨提示',
              content: '刷脸支付失败，请联系收银员~',
              showCancel: false,
              confirmText: '我知道了',
              confirmColor: '#3CC51F',
              success: (result) => {
                if (result.confirm) {
                  exitWxMiniApp()
                }
              },
              fail: () => {},
              complete: () => {},
            })
          }
        })
        wxfaceapp.onFacePayFailedEvent(function (res) {
          console.log('onFacePayFailedEvent retCode = ' + res.replyCode)
          state.canBuy = true
          uni.showModal({
            title: '温馨提示',
            content: '刷脸支付失败，请重新支付~',
            showCancel: false,
            confirmText: '我知道了',
            confirmColor: '#3CC51F',
            success: (result) => {
              if (result.confirm) {
                createOrder()
              }
            },
            fail: () => {},
            complete: () => {},
          })
        })
      },
      fail(res) {
        console.log('fail [launchFaceApp]')
        console.log(res.replyCode)
        console.log(res.reply)
        uni.showModal({
          title: '温馨提示',
          content: '刷脸支付失败，请联系收银员~',
          showCancel: false,
          confirmText: '我知道了',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              exitWxMiniApp()
            }
          },
          fail: () => {},
          complete: () => {},
        })
      },
    })
  } catch (e) {
    // Do something when catch error
    uni.showModal({
      title: '温馨提示',
      content: '刷脸支付失败，请联系收银员~',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          exitWxMiniApp()
        }
      },
      fail: () => {},
      complete: () => {},
    })
  }
}
function toPaymentSuccess(orderId) {
  uni.redirectTo({
    url: '/pages-sub/newretail/pages/wxfaceapp/payment/payment',
  })
}
function showGoodsDeatils() {
  console.log('?')
  const showMoreGoods = state.showMoreGoods
  state.showMoreGoods = !showMoreGoods
  state.showMoreGoodsText = !showMoreGoods ? '收起' : '展开查看更多'
}
function getMbrScoreBalance() {
  const that = this
  let mobile = ''
  if (app.globalData.userInfo && app.globalData.userInfo.member.mobile) {
    mobile = app.globalData.userInfo.member.mobile
  }
  if (mobile === '') {
    console.log('未查到会员信息')
    return
  }
  memberService
    .getBalance(mobile)
    .then((res) => {
      state.memberScore = res
      getAvailableScoreNum(res)
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function getAvailableScoreNum(score) {
  const self = this
  const allPrice = parseFloat(Number(state.allPrice)).toFixed(2)
  memberService
    .getScoreDeutible(score, allPrice)
    .then((res) => {
      let scoreAmount = parseFloat(res.orderAmount / res.scoreSpace)
      const price = (parseFloat(state.allPrice) - parseFloat(state.inputAmount)).toFixed(2)
      scoreAmount = scoreAmount > parseFloat(price) ? parseFloat(price) : scoreAmount
      const tempData = {
        ...res,
        scoreAmount,
        orderAmount: scoreAmount * res.scoreSpace,
      }
      state.scoreInfo = tempData
      state.scoreAmount = scoreAmount
      console.log(state.storedValueCard.balance)
      if (
        state.offlinType === 'cashReceipt' &&
        state.memberScore > 0 &&
        state.storedValueCard.balance > 0 &&
        !state.useScore
      ) {
        handleScoreChoice()
      } else {
        // 重新选择优惠券之后调用接口计算储值余额抵扣
        handleCardBalance()
      }
    })
    .catch((err) => {
      // 重新选择优惠券之后调用接口计算储值余额抵扣
      handleCardBalance()
    })
}
function viewScoreWarn(e) {
  const dataSet = e.currentTarget.dataset
  if (dataSet.scorerule) {
    uni.showModal({
      title: '提示',
      content: e.currentTarget.dataset.scorerule,
    })
  }
}
function handleScoreChoice() {
  const self = this
  if (!state.canBuy) {
    return
  }
  console.log('是否使用积分：', state.useScore, '使用积分：', state.integral)
  let paymentPrice =
    parseFloat(state.allPrice) -
    parseFloat(state.totalDiscount) +
    parseFloat(state.couponDiscount) +
    parseFloat(state.shipmentAmount) -
    parseFloat(state.shipmentCouponDiscount)
  paymentPrice = paymentPrice > 0 ? paymentPrice.toFixed(2) : 0
  const tempUseCoupon = !!state.couponInfo.useCoupon
  if (state.couponInfo.useCoupon && !state.systemOptions.isBothScoreAndCoupon) {
    // 使用了优惠券
    uni.showModal({
      title: '提示',
      content: '积分和优惠券不可同时使用',
      confirmText: '使用积分',
      success: function (res) {
        if (res.confirm) {
          // 确定使用积分
          state.couponDiscount = 0
          state.usedCoupons = []
          state.couponInfo = {
            description: '选择优惠券',
            data: {
              freeship: [],
              discount: [],
            },
            useCoupon: false,
          }
          state.shipmentRealPay = state.shipmentAmount
          state.shipmentDiscount = 0
          state.shipmentCouponDiscount = 0
          state.totalDiscount = 0
          setTimeout(() => {
            chooseScore()
          }, 100)
        } else if (res.cancel) {
        }
      },
    })
  } else if (state.orderType !== 'scoreMall') {
    state.couponDiscount = 0
    state.usedCoupons = []
    state.couponInfo = {
      description: '选择优惠券',
      data: {
        freeship: [],
        discount: [],
      },
      useCoupon: false,
    }
    state.shipmentRealPay = state.shipmentAmount
    state.shipmentDiscount = 0
    state.shipmentCouponDiscount = 0
    state.totalDiscount = 0
    setTimeout(() => {
      chooseScore()
    }, 100)
  }
  function chooseScore() {
    if (paymentPrice > 0) {
      const useScore = !state.useScore
      state.useScore = useScore
      const scoreDiscount = state.scoreInfo.scoreAmount ? state.scoreInfo.scoreAmount : 0
      if (useScore) {
        state.integral = state.scoreInfo.orderAmount ? state.scoreInfo.orderAmount : 0
        state.scoreAmount = state.scoreInfo.scoreAmount ? state.scoreInfo.scoreAmount : 0
        state.scoreDiscount = scoreDiscount
      } else {
        state.integral = 0
        state.scoreDiscount = 0
      }
      console.log(tempUseCoupon)
      if (tempUseCoupon && state.systemOptions.isBothScoreAndCoupon) {
        // 重新查询可用优惠券
        getAvailableCouponNum()
      } else {
        calcPromotions()
      }
    } else {
      uni.showToast({
        title: '商品实付金额已为0',
        icon: 'none',
        duration: 2000,
      })
    }
  }
}
function exitWxMiniApp() {
  try {
    wxfaceapp.exitMp({
      success(res) {
        console.log('exit mini app!')
      },
    })
  } catch (e) {}
}
</script>
<style scoped>
/* pages/wxfaceapp/index/index.wxss */

page {
  position: relative;
  background: #f1f1f1;
  padding-bottom: 144rpx;
}

.top-info {
  padding-top: 136rpx;
  position: relative;
}

.top-info .to-img {
  width: 100%;
  height: 283rpx;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}

.top-info .content {
  width: 711rpx;
  height: 173rpx;
  background: #fff;
  border-radius: 10rpx;
  margin: 0 auto;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
}

.user-info {
  display: flex;
  position: relative;
  padding-left: 35rpx;
}

.user-info button.user-portrait {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin: 0 0 0 0;
  overflow: hidden;
  z-index: 10;
  background: #ff8561;
  margin-right: 20rpx;
}

.user-info image.user-portrait {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  overflow: hidden;
  z-index: 10;
}

.user-info .name-mobile {
  display: flex;
  flex-direction: column;
}

.user-info .name-mobile text {
  display: block;
  font-size: 32rpx;
  line-height: 48rpx;
}

.user-info .name-mobile text:first-of-type {
  color: #333;
  margin-bottom: 10rpx;
}

.user-info .name-mobile text:last-of-type {
  color: #666;
}

.top-info .content .card-coupon {
  display: flex;
  align-items: center;
  font-size: 20rpx;
  color: #333;
  line-height: 36rpx;
}

.top-info .content .card-coupon view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 142rpx;
  position: relative;
}

.top-info .content .card-coupon .card::after {
  content: '';
  display: block;
  width: 1px;
  height: 60rpx;
  background: rgba(213, 213, 213, 1);
  position: absolute;
  top: 50%;
  margin-top: -30rpx;
  right: -1rpx;
}

.top-info .content .card-coupon view .amount {
  font-size: 32rpx;
  color: #ff8327;
  margin-bottom: 5rpx;
}

.bottom-button {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  height: 124rpx;
  padding-top: 20rpx;
}

.middle-button {
  position: fixed;
  bottom: 430rpx;
  width: 100%;
  height: 124rpx;
  padding-top: 20rpx;
}

button.pay-btn {
  width: 711rpx;
  height: 105rpx;
  border-radius: 10rpx;
  color: #fff;
  margin: 0 auto;
  font-size: 40rpx;
  line-height: 105rpx;
  font-weight: bold;
}

button.pay-btn::after {
  border: 0;
}

button[disabled] {
  color: #fff;
  opacity: 0.6;
}

button[disabled]:not([type]) {
  color: #fff;
  opacity: 0.6;
}

/* 订单信息 */

.order-info {
  width: 711rpx;
  min-height: 125rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 9rpx;
  margin: 13rpx auto;
}

.store-box {
  font-size: 34rpx;
  line-height: 50rpx;
  color: #454545;
  padding: 9rpx 22rpx 0 22rpx;
  font-weight: bold;
}

.order-details {
}

.goods-list {
  padding: 0 27rpx 0 22rpx;
  overflow: hidden;
}

.goods-box {
  padding: 10rpx 0;
  display: flex;
}

.goods-box .goods-img {
  width: 73rpx;
  height: 73rpx;
  background: #f1f1f1;
  border-radius: 6rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-right: 10rpx;
}

.goods-box .goods-img image {
  width: 100%;
  height: 100%;
}

.goods-box .goods-info {
  color: #454545;
  margin-top: -6rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-box .goods-info .goods-name {
  font-size: 24rpx;
  line-height: 36rpx;
  width: 580rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.goods-box .goods-info .goods-num-price {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 24rpx;
  line-height: 24rpx;
}

.goods-box .goods-info .goods-num {
  color: #989898;
}

.goods-box .goods-info .goods-price {
  font-weight: bold;
  letter-spacing: -3rpx;
}

.goods-box .goods-info .goods-price .now-price {
  font-size: 32rpx;
  letter-spacing: normal;
}

.more-details {
  height: 54rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #ff8328;
  font-family: Source Han Sans CN;
  font-weight: 400;
  line-height: 54rpx;
  padding-bottom: 7rpx;
}

.more-details image {
  width: 28rpx;
  height: 28rpx;
  margin-left: 11rpx;
}

.more-details image.show {
  transform: rotate(-180deg);
}

/* 优惠部分 */

.discount-info {
  width: 711rpx;
  min-height: 101rpx;
  background: #fff;
  border-radius: 9rpx;
  margin: 0 auto;
}

.discount-item {
  display: flex;
  font-size: 34rpx;
  height: 101rpx;
  line-height: 101rpx;
  justify-content: space-between;
  align-items: center;
  padding: 0 17rpx 0 22rpx;
}

.discount-item .left {
  color: #323332;
}

.discount-item .left image {
  width: 23rpx;
  height: 23rpx;
  margin-left: 12rpx;
}

.discount-item .right {
  color: #ccc;
}

.discount-item .right .amount {
  font-size: 24rpx;
  color: #ff8327;
  letter-spacing: -5rpx;
}

.discount-item .right .amount text {
  font-size: 32rpx;
  letter-spacing: normal;
}

.discount-item .right .right-icon {
  width: 16rpx;
  height: 28rpx;
  margin-left: 10rpx;
}

.discount-item .right {
  display: flex;
  align-items: center;
  font-size: 24rpx;
}

.discount-item .right .score-amount {
  color: #f9a72a;
  font-weight: bold;
  margin: 0 30rpx 0 20rpx;
  font-size: 28rpx;
}

.checkbox-icon {
  width: 32rpx;
  height: 32rpx;
  background: url('http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/xianfengImages/iconUnchecked.png')
    no-repeat center;
  background-size: 100% 100%;
}

.checkbox-icon.active {
  width: 32rpx;
  height: 32rpx;
  background: url('https://app-1256684088.cos.ap-beijing.myqcloud.com/wxapp/iconChecked.png')
    no-repeat center;
  background-size: 100% 100%;
}
/* 支付方式 */

.pay-info {
  width: 711rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 13rpx auto;
}

.pay-info .pay-item {
  width: 338rpx;
  height: 111rpx;
  background: #fff;
  border-radius: 9rpx;
  font-size: 32rpx;
  color: #323332;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding-right: 20rpx;
  padding-left: 22rpx;
}

.pay-info .pay-item.wx {
  padding-left: 28rpx;
}

.pay-info .pay-item view {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-info .pay-item image.icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 22rpx;
}

.pay-info .pay-item.wx image.icon {
  width: 46rpx;
  height: 42rpx;
  margin-right: 22rpx;
}

.pay-info .pay-item image.select-icon {
  width: 44rpx;
  height: 44rpx;
}

.popup-content {
  width: 670rpx;
  height: 500rpx;
  background: #fff;
  border-radius: 6rpx;
  position: relative;
}

.popup-content-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400rpx;
}

.popup-content-box image {
  width: 410rpx;
  height: 421rpx;
}

.popup-content .button {
  height: 100rpx;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 100rpx;
  width: 100%;
  color: #fff;
  text-align: center;
  border-bottom-left-radius: 6rpx;
  border-bottom-right-radius: 6rpx;
  position: absolute;
  bottom: 0;
  left: 0;
}

.loading-box {
  width: 100%;
  height: calc(100vh - 552rpx);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
