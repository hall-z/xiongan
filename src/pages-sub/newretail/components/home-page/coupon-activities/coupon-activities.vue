<template>
  <!--components/home-page/theme-activities/theme-activities.wxml-->
  <view>
    <view class="theme-activities-loading theme-activities-loading1" v-if="!loaded || !isShow">
      <view class="three">
        <view class="left"></view>
        <view class="right">
          <view></view>
          <view></view>
        </view>
      </view>
      <view class="one"></view>
    </view>
    <view v-for="(item, idx) in dataList" :key="idx" v-if="dataList.length > 0">
      <!-- 普通主题 -->
      <view>
        <view
          class="module-box"
          :style="'margin: ' + moduleSpacing + 'px 0'"
          v-if="item.coupons.length > 0"
        >
          <view v-if="item.coupons.length > 0">
            <!-- 横向滑动 -->
            <scroll-view
              class="module-coupon"
              scroll-x=""
              :style="
                'width: 100%;padding: 0 ' + (item.pageMargin || 0) + 'px;box-sizing: border-box'
              "
              v-if="item.showType === 'QHDhenghualiebiao'"
            >
              <view
                :style="
                  'display: flex;flex-wrap: wrap;width: calc(' +
                  (item.pageMargin ? item.pageMargin * 2 : 0) +
                  'px + ' +
                  (item.rowNumber || (item.coupons.length < 8 ? item.coupons.length : 8)) * 185 +
                  'rpx)'
                "
              >
                <view v-for="(couponItem, couponIdx) in item.coupons">
                  <view :class="'coupon-item ' + (couponItem.balance == 0 ? 'coupon-item-no' : '')">
                    <image
                      lazy-load=""
                      :src="imagesPath.couponBg"
                      v-if="couponItem.balance > 0"
                    ></image>
                    <image lazy-load="" :src="imagesPath.couponBg1" v-else></image>
                    <view class="coupon-bd">
                      <view class="coupon-price-board">
                        <view
                          class="coupon-price no-cash"
                          v-if="
                            couponItem.function === 'DISCOUNT' ||
                            (couponItem.function === 'FREESHIP' &&
                              (couponItem.rate || couponItem.rate === 0))
                          "
                        >
                          <!-- <view></view> -->
                          <view>{{ couponItem.rate * 10 }}</view>
                          <view class="discount">折</view>
                        </view>
                        <view
                          class="coupon-price"
                          v-else-if="
                            couponItem.function === 'CASH' ||
                            (couponItem.function === 'FREESHIP' &&
                              !couponItem.rate &&
                              (couponItem.faceValue || couponItem.faceValue === 0))
                          "
                        >
                          <!-- <view></view> -->
                          <view>{{ couponItem.faceValue }}</view>
                          <view class="discount">元</view>
                        </view>
                        <view
                          class="coupon-price no-cash"
                          v-else-if="couponItem.function == 'FREESHIP' && !couponItem.faceValue"
                        >
                          <view>运费券</view>
                        </view>
                        <view
                          class="coupon-price no-cash"
                          v-else-if="couponItem.function == 'PACKAGE'"
                        >
                          <view>券包</view>
                        </view>
                        <view
                          class="coupon-price no-cash"
                          v-else-if="couponItem.function == 'PRODUCT'"
                        >
                          <view>商品券</view>
                        </view>
                      </view>
                      <view class="coupon-name">
                        {{ couponItem.name }}
                      </view>
                      <view class="coupon-desc">
                        {{ couponItem.description }}
                      </view>
                      <view
                        class="coupon-btn"
                        v-if="(!updateTimeFlag || !couponItem.dateText) && timeNumber"
                        :data-idx="couponIdx"
                        :data-pridx="idx"
                        @click="handleCoupon"
                        :data-coupon="couponItem"
                      >
                        <image
                          lazy-load=""
                          :src="imagesPath.couponText"
                          mode="widthFix"
                          v-if="couponItem.balance > 0"
                        ></image>
                        <image
                          lazy-load=""
                          :src="imagesPath.couponText1"
                          mode="widthFix"
                          v-else
                        ></image>
                      </view>
                      <view class="time-box" v-else>仅剩{{ couponItem.dateText }}</view>
                    </view>
                  </view>
                </view>
              </view>
            </scroll-view>
            <!-- 一行三个 -->
            <view
              class="module-coupon QHDyihangsanzhang"
              v-if="item.showType === 'QHDyihangsanzhang'"
              style="white-space: normal"
            >
              <view class="flexbox">
                <view
                  v-for="(couponItem, couponIdx) in item.coupons"
                  :key="couponIdx"
                  v-if="item.shelvesStatus != 'OFF'"
                >
                  <view
                    :class="'coupon-item ' + (couponItem.balance == 0 ? 'coupon-item-no' : '')"
                    style="width: 165rpx"
                  >
                    <!-- calc(100% / 3 - 10px * 2) -->
                    <image
                      lazy-load=""
                      :src="imagesPath.couponBg"
                      v-if="couponItem.balance > 0"
                    ></image>
                    <image lazy-load="" :src="imagesPath.couponBg1" v-else></image>
                    <view class="coupon-bd">
                      <view class="coupon-price-board">
                        <view
                          class="coupon-price no-cash"
                          v-if="
                            couponItem.function === 'DISCOUNT' ||
                            (couponItem.function === 'FREESHIP' &&
                              (couponItem.rate || couponItem.rate === 0))
                          "
                        >
                          <!-- <view></view> -->
                          <view>{{ couponItem.rate * 10 }}</view>
                          <view class="discount">折</view>
                        </view>
                        <view
                          class="coupon-price"
                          v-else-if="
                            couponItem.function === 'CASH' ||
                            (couponItem.function === 'FREESHIP' &&
                              !couponItem.rate &&
                              (couponItem.faceValue || couponItem.faceValue === 0))
                          "
                        >
                          <!-- <view></view> -->
                          <view>{{ couponItem.faceValue }}</view>
                          <view class="discount">元</view>
                        </view>
                        <view
                          class="coupon-price no-cash"
                          v-else-if="couponItem.function == 'FREESHIP' && !couponItem.faceValue"
                        >
                          <view>运费券</view>
                        </view>
                        <view
                          class="coupon-price no-cash"
                          v-else-if="couponItem.function == 'PACKAGE'"
                        >
                          <view>券包</view>
                        </view>
                        <view
                          class="coupon-price no-cash"
                          v-else-if="couponItem.function == 'PRODUCT'"
                        >
                          <view>商品券</view>
                        </view>
                      </view>
                      <view class="coupon-name">
                        {{ couponItem.name }}
                      </view>
                      <view class="coupon-desc">
                        {{ couponItem.description }}
                      </view>
                      <view
                        class="coupon-btn"
                        v-if="(!updateTimeFlag || !couponItem.dateText) && timeNumber"
                        @click="handleCoupon"
                        :data-idx="couponIdx"
                        :data-pridx="idx"
                        :data-coupon="couponItem"
                      >
                        <image
                          lazy-load=""
                          :src="imagesPath.couponText"
                          mode="widthFix"
                          v-if="couponItem.balance > 0"
                        ></image>
                        <image
                          lazy-load=""
                          :src="imagesPath.couponText1"
                          mode="widthFix"
                          v-else
                        ></image>
                      </view>
                      <view class="time-box" v-else>仅剩{{ couponItem.dateText }}</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsAddressJs from '@/utils/newretail/address'
import _homePageCommonBehaviorJs from '../homePageCommonBehavior'
import _lazyLoadPageLazyLoadBaseJs from '../../lazy-load-page/lazy-load-base'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _apiRequestJs from '@/service/api/newretail/request'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import { reactive , watch} from 'vue'
import bus from 'iny-bus'
const app = getApp()
// components/home-page/theme-activities/theme-activities.js
const IMGAGESPATH = _utilsImagesPathJs
const couponService = _apiCouponServiceJs
const orderService = _apiOrderServiceJs
const request = _apiRequestJs
const THEME = _utilsThemeManagerJs
const utils = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const AUTHORIZE = _utilsAuthorizeJs
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs
const homePageCommonBehavior = _homePageCommonBehaviorJs
const ADDRESS = _utilsAddressJs
// 获取应用实例
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
const state = reactive({
  hasUserInfo: false,
  isMember: false,
  assignCoupon: null,
  activityId: null,
  hasAssign: false,
  urlSwiperObj: {},
  counterSwiperObj: {},
  imagesPath: IMGAGESPATH,
  loaded: false,
  isShow: false,
  storeId: '',
  theme: THEME,
  page: 1,
  pageSize: 10,
  pageCount: 1,
  totalCount: 0,
  themeSignShow: false,
  dataList: [],
  updateTimeFlag: true,
  currentCouponPrIdx: null,
  currentCouponIndex: null
})
const props = defineProps({
  show: {
    // 属性名
    type: String,
    value: Boolean
  },
  timeNumber: {
    type: Number,
    value: 0
  },
  storeInfo: Object,
  pageScrollData: {
    // 属性名
    type: Object,
    value: {}
  },
  moduleSpacing: {
    // 属性名
    type: Number,
    value: 0
  },
  modelMargin: {
    // 属性名
    type: Number,
    value: 0
  },
  pageMargin: {
    // 属性名
    type: Number,
    value: 0
  },
  middleMargin: {
    // 属性名
    type: Number,
    value: 0
  },
  fillet: {
    // 属性名
    type: Number,
    value: 0
  },
  itemData: {
    // 属性名
    type: Object,
    value: {}
  },
  refreshType: {
    // 属性名
    type: String,
    value: ''
  }
})
function updateTime(newTime) {
  if (!state.updateTimeFlag) {
    // 判断当前列表中是否还需要倒计时，不需要则不走下列逻辑
    return false
  }
  state.updateTimeFlag = false
  state.dataList.forEach((item, index) => {
    if (item.coupons && item.coupons.length > 0) {
      item.coupons.forEach((couponItem, couponIndex) => {
        const couponStartTime = new Date(couponItem.startDate.replace(/\-/g, '/')).getTime()
        state.dataList[index].coupons[couponIndex].dateText = null
        if (couponStartTime > newTime) {
          const diff = couponStartTime - newTime
          const date = new Date(diff)
          const H = Math.floor(diff / 1000 / 3600)
          const M = date.getUTCMinutes()
          const S = date.getUTCSeconds()
          // let H = parseInt(diff / 1000 / 60 / 60);
          // let M = parseInt((diff - H * 1000 * 60 * 60) / 1000 / 60);
          // let S = parseInt((diff - H * 1000 * 60 * 60 - M * 1000 * 60) / 1000 / 60);
          state.dataList[index].coupons[couponIndex].dateText =
            H + ':' + (M >= 10 ? M : '0' + M) + ':' + (S >= 10 ? S : '0' + S)
          state.updateTimeFlag = true
        }
        state.dataList = state.dataList
      })
    }
  })
}
async function handleCoupon(val) {
  await checkUserInfo()
  if (!state.hasUserInfo || !state.isMember) {
    uni.showToast({
      title: '请进行登录'
    })
    return false
  }
  const self = this
  // const couponId = val.detail.coupon
  // const couponList = self.data.couponList
  const currentCoupon = val.currentTarget.dataset.coupon || val.target.dataset.coupon
  const idx = val.currentTarget.dataset.idx || 0
  const prIdx = val.currentTarget.dataset.pridx || 0
  state.currentCouponIndex = idx
  state.currentCouponPrIdx = prIdx
  if (currentCoupon.balance == null || currentCoupon.balance == 0) {
    return false
  }
  // couponList.forEach(item => {
  // if (couponId === item.id) {
  //     currentCoupon = item
  // }
  // })
  // 外部券没有库存
  if (currentCoupon.balance == null || currentCoupon.balance > 0) {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        if (!state.hasAssign) {
          uni.showLoading({
            title: '领取中...'
          })
          state.hasAssign = true // 标识状态为领取中
          // 判断当前用户是否已经点击了领券并且还没有返回领券结果
          if (currentCoupon.sellPrice && currentCoupon.sellPrice > 0) {
            // 有价券
            createCouponOrder(currentCoupon)
          } else {
            // 非有价券
            if (currentCoupon.service === 'HD' || currentCoupon.service === 'ZJIAN') {
              // 海鼎非有价券走创建订单步骤
              createCouponOrder(currentCoupon)
            } else {
              // 积分换券
              if (currentCoupon.score && currentCoupon.score > 0) {
                createCouponOrder(currentCoupon)
              } else {
                couponAssign(currentCoupon)
              }
            }
          }
        } else {
          uni.showToast({
            title: '您已经在领取中了,请稍等片刻~',
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            uni.showLoading({
              title: '领取中...'
            })
          }, 2000)
        }
      } else {
        NAVPAGE.toAuthorize()
      }
    } else {
    }
  } else {
    uni.showToast({
      title: '券已经被抢完了，看看别的吧~',
      icon: 'none',
      duration: 2000
    })
  }
}
function couponAssign(coupon) {
  const self = this
  const postData = {
    activityId: coupon.id
  }
  state.activityId = coupon.id
  uni.showLoading({
    title: '领取中'
  })
  couponService
    .assign(postData)
    .then((res) => {
      state.hasAssign = false
      state.dataList[state.currentCouponPrIdx].coupons[state.currentCouponIndex].balance -= 1
      uni.hideLoading()
      // bus.emit('userCouponChange', "assign")
      state.assignCoupon = coupon
      state.dataList = state.dataList
      state.show = {
        middle: true
      }
      uni.showToast({
        title: '领券成功,稍后请到我的优惠券中查看~',
        icon: 'none',
        duration: 2000
      })
    })
    .catch((e) => {
      state.hasAssign = false
      uni.hideLoading()
      if (e.code === 17005) {
        uni.showToast({
          title: '券活动指定的有效期已经过期，不能领取~',
          icon: 'none',
          duration: 2000
        })
      } else {
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
}
function createCouponOrder(coupon) {
  const self = this
  let serviceType = 'GM' // 券服务类型默认为内部券（GM）
  let couponActivityId = coupon.id
  if (coupon.service === 'HD' || coupon.service === 'ZJIAN') {
    serviceType = coupon.service
    couponActivityId = coupon.id // 海鼎券券活动ID为鼎力云券活动ID-----已作废；统一使用id
  }
  state.activityId = coupon.id
  utils.setHideLoading(true)
  couponService
    .createCouponOrder(couponActivityId, serviceType, state.storeId, coupon.score)
    .then((res) => {
      console.log(res)
      if (res.status === 'ACQUIRE') {
        state.hasAssign = false
        utils.setHideLoading(false)
        uni.hideLoading()
        state.dataList[state.currentCouponPrIdx].coupons[state.currentCouponIndex].balance -= 1
        // bus.emit('userCouponChange', "assign")
        state.assignCoupon = coupon
        state.dataList = state.dataList
        state.show = {
          middle: true
        }
        uni.showToast({
          title: '领券成功,稍后请到我的优惠券中查看~',
          icon: 'none',
          duration: 2000
        })
      } else if (res.status === 'CREATED') {
        const postData = {
          orderId: res.id,
          payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
          entry: 'COUPON',
          total: res.price
        }
        if (res.price === 0 && coupon.score && coupon.score > 0) {
          // 积分换券
          getOrderStatusById(res.id, self)
        } else {
          couponWXPay(postData)
        }
      } else {
        state.hasAssign = false
        uni.showToast({
          title: res.acquireFailedReason,
          icon: 'none',
          duration: 2000
        })
      }
    })
    .catch((e) => {
      state.hasAssign = false
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      })
    })
}
function couponWXPay(postData) {
  const that = this
  orderService
    .getCashPaySign(postData)
    .then((res) => {
      console.log(res)
      if (utils.isHideLoading()) {
        utils.setHideLoading(false)
        uni.hideLoading()
      }
      state.hasAssign = false
      const resData = JSON.parse(res)
      const sign = JSON.parse(resData.sign)
      let packageValue = ''
      if (postData.payMethod === 'SWIFTPASS' || postData.payMethod === 'DINGFUTONG') {
        packageValue = sign.package
      } else if (postData.payMethod === 'WX_MINI_APP' || postData.payMethod === 'WXA_ISV_PAY') {
        packageValue = sign.packageValue
      }
      uni.requestPayment({
        timeStamp: sign.timeStamp,
        nonceStr: sign.nonceStr,
        package: packageValue,
        signType: sign.signType,
        paySign: sign.paySign,
        success: function (res) {
          getOrderStatusById(postData.orderId, that)
        },
        fail: function (res) {
          console.log(res)
          if (res.errMsg.indexOf('cancel') >= 0) {
            uni.showToast({
              title: '您取消了订单支付~',
              icon: 'none',
              duration: 2000
            })
          } else {
            uni.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    })
    .catch((err) => {
      if (utils.isHideLoading()) {
        utils.setHideLoading(false)
        uni.hideLoading()
      }
      state.hasAssign = false
      if (err.code === 1) {
        uni.showToast({
          title: '领券失败，请稍后再试~',
          icon: 'none',
          duration: 2000
        })
      } else if (err.code === -1001) {
        state.showTimeout = true
      } else {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
}
function handleGetOrderStatusById(orderId, amount, self) {
  uni.showLoading({
    title: '支付中'
  })
  couponService
    .getCouponOrderById(orderId)
    .then((result) => {
      console.log('查询交易结果-------------')
      console.log(result)
      amount++
      console.log(amount)
      if (amount > 40) {
        utils.setHideLoading(false)
        self.data.hasAssign = false
        uni.hideLoading()
        // 弹出支付超时
        self.setData({
          showTimeout: true
        })
        return
      }
      if (result.status === 'ACQUIRE') {
        utils.setHideLoading(false)
        uni.hideLoading()
        self.data.dataList[self.data.currentCouponPrIdx].coupons[
          self.data.currentCouponIndex
        ].balance -= 1
        self.setData({
          dataList: self.data.dataList
        })
        // bus.emit('userCouponChange', "assign")
        utils.showToast('领券成功,稍后请到我的优惠券中查看~')
        self.data.hasAssign = false
      } else if (result.status === 'ACQUIREFAILED') {
        utils.setHideLoading(false)
        uni.hideLoading()
        // 弹出支付超时
        self.setData({
          showTimeout: true
        })
        self.data.hasAssign = false
      } else {
        const orderTimeId = setTimeout(() => {
          utils.setHideLoading(true)
          // 如果没有成功，调用函数本身，实现重复查询
          self.handleGetOrderStatusById(orderId, amount, self)
        }, 2000)
        self.setData({
          orderTimeId
        })
      }
    })
    .catch((err) => {
      utils.showToast(err.message)
    })
}
function getOrderStatusById(orderId, self) {
  const amount = 0
  // self.handleGetOrderStatusById(orderId, amount, self);
  setTimeout(() => {
    self.handleGetOrderStatusById(orderId, amount, self)
  }, 1000)
}
function timeoutPopupClose() {
  state.showTimeout = false
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true
    if (app.globalData.userInfo.member) {
      state.isMember = true
    }
  } else {
    state.hasUserInfo = false
    state.isMember = false
    state.member = null
    state.userInfo = null
  }
}
function getUserInfo(e) {
  AUTHORIZE.login(e)
    .then((res) => {
      state.hasUserInfo = true
      if (res.member) {
        state.isMember = true
      } else {
        NAVPAGE.toAuthorize()
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      })
    })
}
function reload(refresh = false) {
  const that = this
  if (!state.loaded) {
    // that.getIndexActivity(that.data.storeId)
    state.loaded = true
    state.theme = {
      color:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? app.globalData.uiconfig.themeColor
          : uni.getStorageSync('themeColor') || '#FF9F43',
      mainColor:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'color: ' + app.globalData.uiconfig.themeColor + ';'
          : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
      mainBgColor:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'background: ' + app.globalData.uiconfig.themeColor + ';'
          : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
      borderColor:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';'
          : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
      mainBgGradient:
        app.globalData.uiconfig &&
        app.globalData.uiconfig.themeColor != null &&
        app.globalData.uiconfig.themeColor !== '#FF9F43'
          ? 'background: linear-gradient(-270deg, ' +
            app.globalData.uiconfig.themeColor +
            ', ' +
            app.globalData.uiconfig.themeColor +
            ');'
          : 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
      mainColorRgb:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
          : 'color:rgba(255,159,67, 0.4);',
      borderColorRgb:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
          : 'border-color:rgba(255,159,67, 0.4);',
      mainColorRgb02:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? colorRgba(app.globalData.uiconfig.themeColor, 0.4)
          : 'rgba(255,159,67, 0.2)',
      BgColorRgb01:
        app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
          ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';'
          : 'background-color:rgba(255,159,67, 0.1);'
    }
  } else if (refresh) {
    // that.getIndexActivity(that.data.storeId)
  }
}
function handleStore() {
  if (app.globalData.storeInfo) {
    state.storeId = app.globalData.storeInfo.id
  }
}

// Watch listeners converted from observers
watch(() => props.show, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal && app.globalData.storeInfo) {
          handleStore()
          reload(true)
        }
});

watch(() => props.timeNumber, (newVal, oldVal) => {
  updateTime(newVal)
});

watch(() => props.value, (newVal, oldVal) => {
  // 属性值变化时执行
        reload(false)
});

watch(() => props.value, (newVal, oldVal) => {
  app.globalData.systemInfo = {
          ...uni.getSystemSetting(),
          ...uni.getAppAuthorizeSetting(),
          ...uni.getDeviceInfo(),
          ...uni.getWindowInfo(),
          ...uni.getAppBaseInfo(),
        }
        // let arr = [...newVal.coupons]
        // arr.map((item)=>{
        //     item.prdouctDisplayStyle = newVal.prdouctDisplayStyle
        // })
        // newVal.showType = 'QHDhenghualiebiao';
        // newVal.showInfo = 'QHDyihangsanzhang';
        state.dataList = [
          {
            ...newVal,
          },
        ]
        state.isShow = true
        state.screenWidth = app.globalData.systemInfo.screenWidth
});

watch(() => props.refreshType, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal !== '' && newVal !== 'USER') {
          console.log('更新？', newVal)
          handleStore()
          reload(true)
        } else if (newVal === 'USER') {
          // 刷新会员数据
          checkUserInfo()
        }
});

</script>
<style scoped>
/* components/home-page/theme-activities/theme-activities.wxss */
/* loading */
.theme-activities-loading {
  padding: 0 40rpx;
}
.theme-activities-loading .three {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40rpx;
}
.theme-activities-loading .three .left {
  /* background: #EFEFEF; */
  width: 336rpx;
  height: 280rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}
.theme-activities-loading .three .right {
  width: 336rpx;
  height: 280rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.theme-activities-loading .three .right view {
  width: 336rpx;
  height: 130rpx;
  border-radius: 8rpx;
  /* background: #EFEFEF; */
}
.theme-activities-loading .one {
  /* background: #EFEFEF; */
  width: 670rpx;
  height: 250rpx;
  border-radius: 8rpx;
}
.module-coupon {
  /* display: flex; */
  width: 100%;
  /* margin-top: 20rpx; */
  white-space: nowrap;
}
.flexbox {
  width: 100%;
}
.QHDyihangsanzhang .flexbox {
  flex-wrap: wrap;
  display: flex;
}
.coupon-item {
  position: relative;
  width: 165rpx;
  margin: 10rpx;
  display: inline-block;
}
.coupon-item > image {
  width: 100%;
  height: 190rpx;
}
.coupon-bd {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  text-align: center;
}
.coupon-price {
  display: flex;
}
.coupon-price-board {
  color: rgb(214, 87, 57);
  height: 54rpx;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 8%;
  font-size: 32rpx;
  font-weight: 700;
}
.coupon-name,
.coupon-desc {
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
  width: 95%;
  margin: 0 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 32rpx;
}
.coupon-desc {
  font-size: 18rpx;
  font-weight: 500;
  margin-top: 5rpx;
  height: 22rpx;
}
.coupon-btn {
  display: flex;
  align-items: center;
  height: 50rpx;
}
.coupon-btn image {
  width: 70%;
  margin: 10rpx auto 0;
}
.time-box {
  color: #fff;
  background-color: rgb(163, 62, 34);
  border-radius: 20rpx;
  width: 85%;
  font-size: 20rpx;
  margin: 15rpx auto 0;
  padding: 4rpx 0;
}
.coupon-item-no .coupon-desc,
.coupon-item-no .coupon-name,
.coupon-item-no .coupon-price-board {
  color: #fff;
}
.coupon-item-no .time-box {
  background-color: #ccc;
}
</style>
