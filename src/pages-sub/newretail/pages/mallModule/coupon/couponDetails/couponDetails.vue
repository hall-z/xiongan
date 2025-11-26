<template>
  <!-- pages/couponDetails/couponDetails.wxml -->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <movable-area>
    <view class="cartop">
      <image :src="cardtop" mode="widthFix" style="display: block"></image>
    </view>
    <view class="content" v-if="!state.loading">
      <view v-if="state.coupon.function == 'PACKAGE'">
        <view
          class="coupon-box"
          v-for="(item, index) in state.coupon.childCouponActivity"
          :key="id"
        >
          <!-- <coupon-item coupon="{{item}}" bind:toUseCoupon="toUseCoupon" type="{{type}}"></coupon-item> -->
          <coupon-receive
            hideSignBtn="true"
            :coupon="item"
            :hasUserInfo="state.hasUserInfo"
            @couponClick="couponClick"
            @getUserInfo.stop="onGetUserInfo"
          ></coupon-receive>
        </view>
      </view>
      <view v-else>
        <view class="coupon-box">
          <coupon-item
            :coupon="state.coupon"
            @toUseCoupon="toUseCoupon"
            :type="state.type"
          ></coupon-item>
        </view>
      </view>
      <view class="coupon-code-box" v-if="state.showCode">
        <view class="barcode-box">
          <canvas canvas-id="barcode"></canvas>
        </view>
        <text>{{ state.codeText }}</text>
      </view>
      <view class="coupon-details">
        <view class="section">
          <view>使用条件</view>
          <text>{{ state.coupon.useRule }}</text>
        </view>
        <view class="section">
          <view v-if="state.type === 'assign'">抢券时间</view>
          <view v-else-if="state.type === 'score'">活动有效期</view>
          <view v-else>有效期限</view>
          <text>{{ state.coupon.validityTime }}</text>
        </view>
        <view class="section">
          <view>使用说明</view>
          <text>{{ state.coupon.description }}</text>
        </view>
        <view class="section" v-if="state.hasBizBill && state.writeOffTime">
          <view>核销时间</view>
          <text>{{ state.writeOffTime }}</text>
        </view>
        <view class="section" v-if="state.hasBizBill && state.writeOffBizBill">
          <view>核销交易号</view>
          <text>{{ state.writeOffBizBill }}</text>
        </view>
        <view class="section" :hidden="state.type !== 'score'">
          <view>兑换须知</view>
          <text>
            1、兑换成功后，优惠券将直接放入“我的-优惠券”中。优惠券一经兑换，-律不退还积分。
            2、无法转赠他人，仅限本账号使用。 3、特价商品不可使用该优惠券。
            4、该优惠券不可与其他优惠活动同享。
          </text>
        </view>
      </view>
      <view class="button-box">
        <view v-if="state.type === 'assign'">
          <view v-if="state.coupon.balance > 0 || state.coupon.balance == null">
            <view v-if="state.isExternal">
              <button
                :class="'btn ' + (state.hasAssign ? 'nonsupport' : '')"
                v-if="!state.isAssign"
                @click="toAssign"
              >
                立即抢券
              </button>
              <button
                class="btn"
                :style="'background: ' + state.themeColor"
                v-if="state.isAssign"
                @click="toUseCoupon"
              >
                立即使用
              </button>
            </view>
            <view v-else>
              <button
                class="btn bold"
                @click="toAssign"
                v-if="
                  state.coupon.price != null &&
                  state.coupon.price > 0 &&
                  state.coupon.score != null &&
                  state.coupon.score > 0
                "
              >
                {{ '￥' + state.coupon.price + '+' + state.coupon.score + ' 分' }}
              </button>
              <button
                class="btn bold"
                @click="toAssign"
                v-else-if="state.coupon.price != null && state.coupon.price > 0"
              >
                {{ state.coupon.price + ' 元购' }}
              </button>
              <button
                class="btn bold"
                @click="toAssign"
                v-else-if="state.coupon.score != null && state.coupon.score > 0"
              >
                {{ state.coupon.score + ' 积分购' }}
              </button>
              <view v-else>
                <button class="btn" :style="'background: ' + state.themeColor" @click="toAssign">
                  立即领取
                </button>
              </view>
            </view>
          </view>
          <view v-else>
            <button class="btn sign-unable-btn" @click="toAssign">已抢完</button>
          </view>
        </view>
        <button
          class="btn"
          :style="'background: ' + state.themeColor"
          @click="toUseCoupon"
          :hidden="state.coupon.status !== 'OPEN'"
        >
          立即使用
        </button>
        <button
          class="btn"
          :style="'background: ' + state.themeColor"
          @click="toUseCoupon"
          :hidden="state.type !== 'score'"
          v-if="state.isClick"
        >
          立即兑换
        </button>
        <button class="btn" style="background: #ccc" :hidden="state.type !== 'score'" v-else>
          立即兑换
        </button>
        <button v-if="!state.hasUserInfo" class="authorization" @click="getUserInfo"></button>
        <button
          v-else-if="!state.isMember"
          class="authorization"
          @click.stop="toAuthorize"
        ></button>
      </view>
    </view>
    <view class="content-box" v-if="state.loading">
      <view class="spinner">
        <view class="rect1" :style="'background-color: ' + state.themeColor"></view>
        <view class="rect2" :style="'background-color: ' + state.themeColor"></view>
        <view class="rect3" :style="'background-color: ' + state.themeColor"></view>
        <view class="rect4" :style="'background-color: ' + state.themeColor"></view>
        <view class="rect5" :style="'background-color: ' + state.themeColor"></view>
      </view>
    </view>
    <movable-view :x="state.x" :y="state.y" direction="all" v-if="state.homeBack">
      <image class="movable-view" :src="state.imagesPath.toHome" @click="toIndex"></image>
    </movable-view>
  </movable-area>
  <timeout :show="state.showTimeout" @close="timeoutPopupClose"></timeout>
  <!-- 提示升级弹窗 -->
  <popup
    :show="state.show.upgrade"
    position="middle"
    custom-class="middle"
    @close="toggleUpgradePopup"
  >
    <view class="popup-upgrade-box">
      <view class="popup-upgrade-title">
        <text>温馨提示</text>
      </view>
      <view class="popup-upgrade-content">
        当前等级剩余兑换次数不足{{ state.showScoreUpdate ? '您可以去升级会员等级' : '' }}!
      </view>
      <view class="popup-upgrade-button">
        <view
          :style="'background-color: ' + state.theme.color"
          @click="handleUpgrade"
          v-if="state.showScoreUpdate"
        >
          升级会员等级
        </view>
        <view :style="'background-color: ' + state.theme.color" @click="toggleUpgradePopup" v-else>
          我知道了
        </view>
      </view>
    </view>
  </popup>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _apiScoreProductService from '@/service/api/newretail/scoreProductService'
import _utilsCouponHandler from '@/utils/newretail/couponHandler'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsAddressJs from '@/utils/newretail/address'
import _apiRequestJs from '@/service/api/newretail/request'
import _utilsSelfJs from '@/utils/newretail/self'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
import cardtop from '@/utils/newretail/image/cardtop.png'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import couponItem from '@/pages-sub/newretail/components/coupon/coupon-item4/coupon-item.vue';
import couponReceive from '@/pages-sub/newretail/components/coupon/coupon-receive/coupon-receive.vue';
import timeout from '@/pages-sub/newretail/components/order/timeout/timeout.vue';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp()

// pages/couponDetails/couponDetails.js
const couponService = _apiCouponServiceJs
const orderService = _apiOrderServiceJs
const memberService = _apiMemberServiceJs
const wxbarcode = _utilsSelfJs
const request = _apiRequestJs
const ADDRESS = _utilsAddressJs
const NAVPAGE = _utilsNavPageJs
const utils = _utilsUtilsJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const couponHandler = _utilsCouponHandler
const scoreProductService = _apiScoreProductService
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs
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
// 获取应用实例
const state = reactive({
  navigationBarTitle: '商品优惠券',
  imagesPath: IMGAGESPATH,
  coupon: {},
  type: '',
  loading: true,
  showCode: false,
  codeText: '',
  x: 750,
  y: 450,
  scale: 2,
  homeBack: false,
  phone: false,
  isAssign: false,
  isExternal: false,
  hasAssign: false,
  hdCouponCanBuy: true,
  storeId: '',
  hasUserInfo: false,
  isMember: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  theme: themeManager,
  isClick: true,
  showTimeout: false,
  show: {
    upgrade: false,
  },
  nextGradeNo: '',
  showScoreUpdate: false,
  writeOffTime: '',
  writeOffBizBill: '',
  hasBizBill: false,
})
function showCouponDetail() {
  if (options.isExternal) {
    const isExternal = JSON.parse(options.isExternal)
    if (isExternal) {
      // 外部券
      showExternalCouponDetails()
    } else {
      // 内部券
      showInsideCouponDetails()
    }
  }
}
function showInsideCouponDetails() {
  const that = this
  const postData = {
    cardNumEquals: options.couponId,
    pages: 1,
    pageSize: 10,
  }
  couponService
    .query(postData)
    .then((res) => {
      console.log(res)
      if (res.records.length > 0) {
        const ele = res.records[0]
        let tempData = {
          ...ele,
          name: ele.couponActivityName,
          description: ele.activityRemark,
          effectiveTime: '',
          validityTime: '',
        }
        if (ele.bytimeStart) {
          // 处理有效期时间格式
          const startTime = ele.bytimeStart.slice(0, 16)
          const endTime = ele.bytimeEnd.slice(0, 16)
          const effectiveTime = startTime + ' ~ ' + endTime
          const validityTime = startTime + ' —— ' + endTime
          const couponStatus = ele.status
          tempData = {
            ...tempData,
            effectiveTime,
            validityTime,
            status: couponStatus,
          }
        }
        // if (ele.function === "FREESHIP") {
        //   tempData.condition = '该优惠券只针对配送使用'
        // } else {
        //   tempData.condition = ele.allProduct ? '该优惠券对全部商品(不包含部分促销商品)可用' : '该优惠券仅对指定商品(不包含部分促销商品)可用'
        // }
        couponHandler.handleCouponFunction(tempData)
        if (ele.status === 'OPEN' && ele.cardNum) {
          const cardNum = app.globalData.systemConfigure.externalCouponPrefix + ele.cardNum
          showCode(cardNum)
        }
        if (ele.status === 'USED' && ele.cardNum) {
          queryCouponFlow(ele.cardNum)
        }
        state.coupon = tempData
        state.loading = false
      }
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
      state.loading = false
    })
}
function showExternalCouponDetails() {
  const that = this
  const couponData = JSON.parse(options.coupon)
  let tempData = {
    ...couponData,
    name: couponData.couponActivityName,
    useRule: couponData.useRule,
    description: couponData.activityRemark,
  }
  if (tempData.bytimeStart) {
    const startTime = tempData.bytimeStart.slice(0, 16)
    const endTime = tempData.bytimeEnd.slice(0, 16)
    let effectiveTime = startTime + ' ~ ' + endTime
    let validityTime = startTime + ' —— ' + endTime
    const couponStatus = tempData.status
    if (couponData.couponActivityName.indexOf('双十二') >= 0) {
      effectiveTime = '2018-12-12 00:00 ~ 2018-12-12 23:59'
      validityTime = '2018-12-12 00:00 —— 2018-12-12 23:59'
    }
    tempData = {
      ...tempData,
      effectiveTime,
      validityTime,
      status: couponStatus,
    }
  } else {
    tempData = {
      ...tempData,
      effectiveTime: '',
      validityTime: '',
    }
  }
  // if (tempData.function === "FREESHIP") {
  //   tempData = {
  //     ...tempData,
  //     name: '运费券',
  //     condition: '该优惠券只针对配送使用'
  //   }
  // } else {
  //   tempData = {
  //     ...tempData,
  //     condition: tempData.allProduct ? '该优惠券对全部商品(不包含部分促销商品)可用' : '该优惠券仅对指定商品(不包含部分促销商品)可用'
  //   }
  // }
  if (tempData.status === 'OPEN' && tempData.externalCardNum) {
    showCode(tempData.externalCardNum)
  }
  couponHandler.handleCouponFunction(tempData)
  state.coupon = tempData
  state.loading = false
}
function showCouponActivity(activityId) {
  state.isExternal = false
  const that = this
  couponService
    .getById(activityId)
    .then((res) => {
      if (res) {
        let tempData = {
          ...res,
          rate: res.rate || res.rate === 0 ? (res.rate * 10).toFixed(1) : '',
        }
        couponHandler.handleCouponFunction(tempData)
        if (state.type === 'assign' || state.type === 'score') {
          if (res.function === 'PACKAGE') {
            getCouponPackageDetails(res.id)
          } else {
            if (res.startDate) {
              // let startTime = res.startDate.slice(0, 16)
              // let endTime = res.endDate.slice(0, 16)
              const startTime = res.startDate.split(' ')[0]
              const endTime = res.endDate.split(' ')[0]
              const effectiveTime = startTime + ' ~ ' + endTime
              const validityTime = startTime + ' —— ' + endTime
              const couponStatus = res.status
              tempData = {
                ...tempData,
                effectiveTime,
                validityTime,
                status: couponStatus,
              }
            } else {
              tempData = {
                ...tempData,
                effectiveTime: '',
                validityTime: '',
              }
            }
            // if (res.function === "FREESHIP") {
            //   tempData = {
            //     ...tempData,
            //     name: '运费券',
            //     condition: '该优惠券只针对配送使用'
            //   }
            // } else {
            //   tempData = {
            //     ...tempData,
            //     condition: res.allProduct ? '该优惠券对全部商品(不包含部分促销商品)可用' : '该优惠券仅对指定商品(不包含部分促销商品)可用'
            //   }
            // }
            couponHandler.handleCouponFunction(tempData)
            console.log(tempData, 'tempDatatempData')
            state.coupon = tempData
            state.loading = false
          }
        } else {
          const id = options.couponId
          const postData = {
            cardNumEquals: id,
            pages: 1,
            pageSize: 10,
          }
          couponService
            .query(postData)
            .then((res) => {
              console.log(res)
              if (res.records.length > 0) {
                res.records.forEach((ele) => {
                  if (ele.id === id) {
                    if (ele.bytimeStart) {
                      const startTime = ele.bytimeStart.slice(0, 16)
                      const endTime = ele.bytimeEnd.slice(0, 16)
                      const effectiveTime = startTime + ' ~ ' + endTime
                      const validityTime = startTime + ' —— ' + endTime
                      const couponStatus = ele.status
                      tempData = {
                        ...tempData,
                        effectiveTime,
                        validityTime,
                        status: couponStatus,
                      }
                    } else {
                      tempData = {
                        ...tempData,
                        effectiveTime: '',
                        validityTime: '',
                      }
                    }
                    // if (ele.function === "FREESHIP") {
                    //   tempData = {
                    //     ...tempData,
                    //     condition: '该优惠券只针对配送使用'
                    //   }
                    // } else {
                    //   tempData = {
                    //     ...tempData,
                    //     condition: ele.allProduct ? '该优惠券对全部商品(不包含部分促销商品)可用' : '该优惠券仅对指定商品(不包含部分促销商品)可用'
                    //   }
                    // }
                    // ele.couponServiceType === 'GM'
                  }
                })
                couponHandler.handleCouponFunction(tempData)
                state.coupon = tempData
                state.loading = false
              }
            })
            .catch((e) => {
              uni.showToast({
                title: e.message,
                icon: 'none',
                duration: 2000,
              })
              state.loading = false
            })
        }
      } else {
        state.loading = false
      }
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
      state.loading = false
    })
}
function showExternalActivity(item) {
  const that = this
  console.log(item)
  const couponData = item
  let tempData = {
    ...couponData,
    name: couponData.name,
    useRule: couponData.useRule,
    description: couponData.description,
  }
  if (tempData.startDate) {
    const startTime = tempData.startDate.slice(0, 16)
    const endTime = tempData.endDate.slice(0, 16)
    const effectiveTime = startTime + ' ~ ' + endTime
    const validityTime = startTime + ' —— ' + endTime
    const couponStatus = tempData.status
    tempData = {
      ...tempData,
      effectiveTime,
      validityTime,
      status: couponStatus,
    }
  } else {
    tempData = {
      ...tempData,
      effectiveTime: '',
      validityTime: '',
    }
  }
  // if (item.function === "FREESHIP") {
  //   tempData = {
  //     ...tempData,
  //     condition: '该优惠券只针对配送使用'
  //   }
  // } else {
  //   tempData = {
  //     ...tempData,
  //     condition: item.allProduct ? '该优惠券对全部商品(不包含部分促销商品)可用' : '该优惠券仅对指定商品(不包含部分促销商品)可用'
  //   }
  // }
  if (tempData.status === 'OPEN' && tempData.externalCardNum) {
    showCode(tempData.externalCardNum)
  }
  couponHandler.handleCouponFunction(tempData)
  state.coupon = tempData
  state.loading = false
  state.isExternal = true
}
function getCouponDetails(activityId) {
  const that = this
  if (options.type === 'assign') {
    // 领券详情
    // 如果已知不是外部券
    if (options.isExternal === 'false') {
      showCouponActivity(activityId)
      return
    }
    const postData = {
      activityId,
      page: 1,
      pageSize: 0,
    }
    // 判断是否是外部券
    couponService
      .getExternalCouponActivities(postData)
      .then((res) => {
        // 没有获取到外部券，直接显示内部券活动
        if (!res || res.records.length == 0) {
          showCouponActivity(activityId)
          return
        }

        // 判断是否是外部券
        const item = res.records.filter((value) => value.id == activityId)
        if (item.length === 0 || item[0] == null) {
          showCouponActivity(activityId)
        } else {
          showExternalActivity(item[0])
        }
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  } else {
    // 券详情
    showCouponDetail()
  }
}
function showCode(codeText) {
  wxbarcode.barcode('barcode', codeText, 586, 144)
  state.codeText = codeTextPartition(codeText)
  state.showCode = true
}
function codeTextPartition(val) {
  console.log(val)
  val = val.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, '$1 ')
  console.log(val)
  return val
}
function toIndex() {
  NAVPAGE.toHome()
}
onLoad(function (_options) {
  console.log(_options, 'optionsoptions')
  const self = this
  if (_options.type !== 'assign') {
    uni.hideShareMenu()
  } else {
    state.isExternal = _options.isExternal == 'true'
  }
  if (_options.type === 'freeship') {
    state.navigationBarTitle = '运费优惠券'
  } else if (_options.type === 'score') {
    getScoreProductDetails(_options.productId)
  }
  // 获取当前页面分享图
  state.type = _options.type
  getSharePictures()
  const pageStack = getCurrentPages()
  console.log(pageStack)
  if (pageStack.length === 1) {
    state.homeBack = true
  }
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    // 统计PV
    state.storeId = app.globalData.storeInfo.id
    ANALYSIS.PVStatistics(state.storeId)
    queryDetailsData()
  } else {
    ADDRESS.getLocation()
      .then((res) => {
        app.globalData.storeInfo = res
        // 统计PV
        state.storeId = res.id
        ANALYSIS.PVStatistics(res.id)
        queryDetailsData()
      })
      .catch((err) => {
        // wx.showToast({
        //   title: err.message,
        //   icon: 'icon',
        //   duration: 2000,
        // })
      })
  }

  /**
   * 调用接口获取券详情数据
   */
  function queryDetailsData() {
    // if (app.globalData.userInfo && app.globalData.userInfo.member) {}
    if (_options.type === 'score') {
    } else {
      getCouponDetails(_options.couponActivityId)
    }
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.hasUserInfo = true
    state.member = app.globalData.userInfo.member
  }
  if (_options.scene) {
    state.isExternal = true
    state.type = 'assign'
    showCouponActivity(_options.scene)
  }
})
onReady(function () {})
onShow(function () {
  // 获取用户信息
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
        : 'background-color:rgba(255,159,67, 0.1);',
  }
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
  checkUserInfo()
  getUpgradeScore()
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  const sharePictures = state.sharePictures
  const path = utils.getSharePath()
  return {
    title: app.globalData.systemConfigure.miniprogramSharingName,
    imageUrl: sharePictures,
    path,
    success(e) {
      uni.showShareMenu({
        withShareTicket: true,
      })
    },
  }
})
function getSharePictures() {
  utils
    .getSharePictures('COUPON_ACTIVITY')
    .then((res) => {
      state.sharePictures = res
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function toAssign(val) {
  const self = this
  const currentCoupon = state.coupon
  // 外部券没有库存
  if (currentCoupon.balance == null || currentCoupon.balance > 0) {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        if (!state.hasAssign) {
          uni.showLoading({
            title: '领取中...',
          })
          // 标识状态为领取中
          // 判断当前用户是否已经点击了领券并且还没有返回领券结果
          state.hasAssign = true
          if (currentCoupon.price && currentCoupon.price > 0) {
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
                couponAssign(currentCoupon.id)
              }
            }
          }
        } else {
          uni.showToast({
            title: '您已经在领取中了,请稍等片刻~',
            icon: 'none',
            duration: 2000,
          })
          setTimeout(() => {
            uni.showLoading({
              title: '领取中...',
            })
          }, 2000)
        }
      } else {
        handlePopupPhone()
      }
    } else {
      uni.showToast({
        title: '您还没有登录，请点击头像授权登陆~',
        icon: 'icon',
        duration: 2000,
      })
    }
  } else {
    uni.showToast({
      title: '券已经被抢完了，看看别的吧~',
      icon: 'none',
      duration: 2000,
    })
  }
}
function createCouponOrder(coupon) {
  const self = this
  let serviceType = 'GM' // 券服务类型默认为内部券（GM）
  let couponActivityId = coupon.id
  if (coupon.service === 'HD' || coupon.service === 'ZJIAN') {
    serviceType = coupon.service
    couponActivityId = coupon.id // 海鼎券券活动ID为鼎力云券活动ID-----已作废；统一使用id
  }
  utils.setHideLoading(true)
  couponService
    .createCouponOrder(couponActivityId, serviceType, state.storeId, coupon.score)
    .then((res) => {
      console.log(res)
      if (res.status === 'ACQUIRE') {
        // 标识状态为领取中
        state.hasAssign = false
        utils.setHideLoading(false)
        uni.hideLoading()
        if (serviceType === 'GM') {
          uni.showToast({
            title: '领券成功,稍后请到我的优惠券中查看~',
            icon: 'none',
            duration: 2000,
          })
        } else {
          queryExternalCoupons()
        }
      } else if (res.status === 'CREATED') {
        const postData = {
          orderId: res.id,
          payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
          entry: 'COUPON',
          total: res.price,
        }
        if (res.price === 0 && coupon.score && coupon.score > 0) {
          // 积分换券
          getOrderStatusById(res.id, self)
        } else {
          couponWXPay(postData)
        }
      } else {
        // 标识状态为领取中
        state.hasAssign = false
        uni.showToast({
          title: res.acquireFailedReason,
          icon: 'none',
          duration: 2000,
        })
      }
    })
    .catch((e) => {
      // 标识状态为领取中
      state.hasAssign = false
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function couponAssign(activityId) {
  const self = this
  const postData = {
    activityId,
  }
  uni.showLoading({
    title: '领取中',
  })
  couponService
    .assign(postData)
    .then((res) => {
      // 标识状态为领取中
      state.hasAssign = false
      uni.hideLoading()
      uni.showToast({
        title: '领券成功,稍后请到我的优惠券中查看~',
        icon: 'none',
        duration: 2000,
      })
    })
    .catch((e) => {
      // 标识状态为领取中
      state.hasAssign = false
      uni.hideLoading()
      if (e.code === 17005) {
        uni.showToast({
          title: '券活动指定的有效期已经过期，不能领取~',
          icon: 'none',
          duration: 2000,
        })
      } else {
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000,
        })
      }
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
              duration: 2000,
            })
          } else {
            uni.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000,
            })
          }
        },
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
          duration: 2000,
        })
      } else if (err.code === -1001) {
        state.showTimeout = true
      } else {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function handleGetOrderStatusById(orderId, amount, self) {
  uni.showLoading({
    title: '支付中',
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
        self.setData({
          hasAssign: false,
        })
        uni.hideLoading()
        // 弹出支付超时
        self.setData({
          showTimeout: true,
        })
        return
      }
      if (result.status === 'ACQUIRE') {
        utils.setHideLoading(false)
        uni.hideLoading()
        utils.showToast('领券成功,稍后请到我的优惠券中查看~')
        self.setData({
          hasAssign: false,
        })
        // 查询未使用券
        self.queryCoupon()
      } else if (result.status === 'ACQUIREFAILED') {
        utils.setHideLoading(false)
        uni.hideLoading()
        // 弹出支付超时
        self.setData({
          showTimeout: true,
        })
        self.setData({
          hasAssign: false,
        })
      } else {
        const orderTimeId = setTimeout(() => {
          utils.setHideLoading(true)
          // 如果没有成功，调用函数本身，实现重复查询
          self.handleGetOrderStatusById(orderId, amount, self)
        }, 2000)
        self.setData({
          orderTimeId,
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
function getCouponPackageDetails(id) {
  const self = this
  couponService
    .getPackageById(id)
    .then((res) => {
      console.log(res)
      let tempData = res
      if (res.startDate) {
        const startTime = res.startDate.slice(0, 16)
        const endTime = res.endDate.slice(0, 16)
        const effectiveTime = startTime + ' ~ ' + endTime
        const validityTime = startTime + ' —— ' + endTime
        const couponStatus = res.status
        tempData = {
          ...tempData,
          effectiveTime,
          validityTime,
          status: couponStatus,
        }
      } else {
        tempData = {
          ...tempData,
          effectiveTime: '',
          validityTime: '',
        }
      }
      const couponList = []
      if (res.childCouponActivity && res.childCouponActivity.length > 0) {
        // 处理券包中单个券的数据
        res.childCouponActivity.forEach((item) => {
          let couponData = {
            ...item,
          }
          if (item.startDate) {
            const startTime = item.startDate.slice(0, 16)
            const endTime = item.endDate.slice(0, 16)
            const effectiveTime = startTime + ' ~ ' + endTime
            const couponStatus = item.status
            couponData = {
              ...couponData,
              effectiveTime,
              status: couponStatus,
            }
          } else {
            couponData = {
              ...couponData,
              effectiveTime: '',
              validityTime: '',
            }
          }
          // if (item.function === "FREESHIP") {
          //   couponData = {
          //     ...tempDcouponDataata,
          //     condition: '该优惠券只针对配送使用'
          //   }
          // } else {
          //   couponData = {
          //     ...couponData,
          //     condition: item.allProduct ? '该优惠券对全部商品(不包含部分促销商品)可用' : '该优惠券仅对指定商品(不包含部分促销商品)可用'
          //   }
          // }
          couponHandler.handleCouponFunction(couponData)
          couponList.push(couponData)
        })
      }
      if (res.function === 'FREESHIP') {
        tempData = {
          ...tempData,
          name: '运费券',
        }
      }
      tempData = {
        ...tempData,
        childCouponActivity: couponList,
      }
      state.coupon = tempData
      state.loading = false
    })
    .catch((err) => {
      state.loading = false
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function handleUserLogin() {
  console.log(app.globalData.userInfo)
  const self = this
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo
    state.userInfo = {
      ...user.wxaUser,
    }
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true
      state.member = app.globalData.userInfo.member
    } else {
      state.hasUserInfo = false
      handlePopupPhone()
    }
  }
}
function handlePopupPhone() {
  if (!app.globalData.userInfo.member) {
    state.phone = true
  } else {
    state.phone = false
  }
}
function handleBindPhone(e) {
  console.log(e.detail)
  const that = this
  if (e.detail.bindMobile === true) {
    handlePopupPhone()
    getCouponDetails(options.couponActivityId)
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true
      state.member = app.globalData.userInfo.member
    }
  }
}
function queryExternalCoupons() {
  const that = this
  const postData = {
    memberId: state.member.id,
    state: 'OPEN',
  }
  couponService
    .queryExternalCoupons(postData)
    .then((res) => {
      console.log(res)
      utils.setHideLoading(false)
      uni.hideLoading()
      if (res && res.records.length > 0) {
        res.records.forEach((item) => {
          if (item.status === 'OPEN') {
            if (item.couponActivityId == options.couponActivityId) {
              // clearInterval(selfTime)
              uni.showToast({
                title: '领券成功',
                icon: 'none',
                duration: 2000,
              })
              state.hasAssign = false
              state.isAssign = true
              showCode(item.externalCardNum)
            }
          }
        })
      }
    })
    .catch((e) => {
      utils.setHideLoading(false)
      uni.hideLoading()
      state.hasAssign = false
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true
    state.userInfo = app.globalData.userInfo
    if (app.globalData.userInfo.member) {
      state.isMember = true
      state.member = app.globalData.userInfo.member
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
        duration: 2000,
      })
    })
}
function getScoreProductDetails(productId) {
  const that = this
  scoreProductService
    .getScoreProductById(productId)
    .then((response) => {
      const self = this
      console.log(response)
      if (response.couponActivity === null) {
        return
      }
      state.scoreProduct = response
      const isExternal = JSON.parse(options.isExternal)
      if (isExternal) {
        const item = JSON.parse(options.couponData)
        showExternalActivity(item)
      } else {
        showCouponActivity(response.couponActivity.id)
      }
    })
    .catch((err) => {})
}
function toUseCoupon() {
  const that = this
  if (!state.isClick) return false
  state.isClick = false
  if (state.type === 'score') {
    scoreProductService
      .getMemberCount(state.scoreProduct.activityId, state.member.id)
      .then((res) => {
        if (res > 0) {
          creatScoreOrder()
        } else {
          state.show.upgrade = true
        }
      })
      .catch((err) => {
        utils.showToast(err.message)
      })
    function creatScoreOrder() {
      const param = {
        id: state.scoreProduct.id,
      }
      scoreProductService
        .creatScoreOrder(param)
        .then((res) => {
          uni.showToast({
            title: '兑换成功',
            icon: 'none',
            duration: 2000,
          })
          setTimeout(() => {
            state.isClick = true
            uni.navigateBack({})
          }, 1500)
        })
        .catch((e) => {
          uni.showToast({
            title: e.message,
            icon: 'none',
            duration: 2000,
          })
          state.isClick = true
        })
    }
    return
  }
  couponService
    .queryByCouponActivityId(1, 10, options.couponActivityId, state.storeId)
    .then((res) => {
      console.log(res)
      if (!res || !res.records || res.records.length === 0) {
        uni.showToast({
          title: '商品已下架~',
          icon: 'none',
          duration: 2000,
        })
        state.isClick = true
        return
      }
      if (res.records.length === 1) {
        let goodsType = 'normal'
        const productId = res.records[0].id
        const business = res.records[0].business
        if (business === 'RETAIL' || business === 'CATERING' || business === 'RETAIL_CATERING') {
          goodsType = 'normal'
        } else if (business === 'SCORE') {
          goodsType = 'score'
        } else if (business === 'ADVANCE_SELL') {
          goodsType = 'advanceSell'
        }
        const opts = '?productId=' + productId + '&type=' + goodsType
        state.isClick = true
        NAVPAGE.toGoodsDetails(opts)
      } else {
        state.isClick = true
        const opts =
          '?couponActivityId=' + options.couponActivityId + '&couponName=' + state.coupon.name
        NAVPAGE.toGoodsList(opts)
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
      state.isClick = true
    })
}
function getUpgradeScore() {
  if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
    return
  }
  memberService.queryGrade().then((res) => {
    if (res) {
      res = utils.compareMemberGrade(res)
    }
    const gradeNo = app.globalData.userInfo.member.gradeNo
    let score = 0
    let nextGradeNo = 0
    const memberGrade = []
    let showScoreUpdate = true
    if (gradeNo < 0) {
      state.showScoreUpdate = false
    } else {
      for (let i = 1; i <= 10; i++) {
        res.forEach((el) => {
          if (el.gradeNo === i) {
            memberGrade.push(el)
          }
        })
      }
      memberGrade.forEach((el, i) => {
        if (el.gradeNo === gradeNo) {
          const index = i + 1
          if (index === memberGrade.length) {
            showScoreUpdate = false
          } else {
            if (memberGrade[index].score) {
              console.log(memberGrade[index], gradeNo, el, 'memberGrade[index]')
              score = memberGrade[index].score
              nextGradeNo = memberGrade[index].gradeNo
              showScoreUpdate = true
            } else {
              showScoreUpdate = false
            }
          }
        }
      })
      state.nextGradeNo = nextGradeNo
      state.showScoreUpdate = showScoreUpdate
    }
  })
}
function handleUpgrade() {
  state.show.upgrade = false
  const opts = '?nextGradeNo=' + state.nextGradeNo
  NAVPAGE.toScoreVip(opts)
}
function toggleUpgradePopup() {
  state.show.upgrade = false
}
function queryCouponFlow(cardNumEquals) {
  const opts = {
    'actionIn[0]': 'CONSUME',
    cardNumEquals,
  }
  couponService
    .queryCouponHistory(1, 1, opts)
    .then((res) => {
      let hasBizBill = false
      if (res && res.records.length > 0) {
        const data = res.records[0]
        hasBizBill = true
        state.writeOffTime = data.createTime
        state.writeOffBizBill = data.bizBill
        state.hasBizBill = hasBizBill
      }
    })
    .catch((err) => {
      utils.showToast(err.message)
    })
}
</script>
<style scoped>
/* pages/couponDetails/couponDetails.wxss */

page {
  height: 100%;
  width: 100%;
  padding-bottom: 20rpx;
  background-color: #f3f2f6;
}
.cartop {
  width: 750rpx;
}
.cartop image {
  width: 100%;
}
.coupon-box {
  width: 640rpx;
  margin: -22rpx auto 0 auto;
  background-color: #fff;
}

.content {
  background-color: #f3f2f6;
}

.coupon-details {
  width: 640rpx;
  padding: 10rpx 40rpx;
  background-color: #fff;
  box-sizing: border-box;
  margin: auto;
}

.section {
  /* padding-left: 44rpx; */
  /* padding-bottom: 42rpx; */
}

.section view:first-of-type {
  position: relative;
  font-size: 28rpx;
  line-height: 36rpx;
  color: #333;
  font-weight: bold;
  /* margin-bottom: 10rpx; */
}

/* .section view:first-of-type::before {
  content: '';
  display: block;
  width: 21rpx;
  height: 21rpx;
  position: absolute;
  border-radius: 50%; */
/* border: 5rpx solid #009f55; */
/* border: 5rpx solid #FF9F43;
  box-sizing: border-box;
  top: 10rpx;
  left: -44rpx;
} */

.section text {
  display: inline-block;
  margin: 0 0 30rpx 0;
  font-size: 26rpx;
  color: #999;
  line-height: 42rpx;
}

.button-box {
  width: 640rpx;
  position: relative;
  padding: 50rpx 0;
  box-sizing: border-box;
  background-color: #fff;
  margin: auto;
}

.btn {
  width: 600rpx;
  height: 74rpx;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAACUCAYAAACDU9D8AAAAAXNSR0IArs4c6QAAG+xJREFUeF7t3WuUZWV9JvDnPft0NbYQMoBLBHSQxUCiAn5QhkjUjhNAFEhmOQgmCIOQwMRLgze8xZSaGNAlN9HRSdS4dClINEGIgCQKGgTRD0oLMxgG0TTKKBDRFrurap931mkDAvalrl276vzOWvWhu979vs//V+fTs/bZp2REX/WDJzxhqhn8p1Kyd+kNnlxreVKSxyXZtSa7lmTXJE2SfpKdRpTJ2AQIECBAgAABAgQIECBAgMDCC/w0yVSStib3luTe/OLnR6XU79VB7zu15s5+GdxeTrn4+wsfp3snlO5Fmv9E9a+OfXKbcmjt5Zml5oAkBw6Lqvk/yY4ECBAgQIAAAQIECBAgQIAAgQUVuC/JN2vJ2jLI15pm6ivlZZ+5Y0FP7MDmy7LAqh85dvd2Ms9Prx6Rmmcn2bMD1iIQIECAAAECBAgQIECAAAECBBZC4K4k16fkmqYOrip/9Jl1C3HIYu65bAqs+oHfe8pUaV7cy+CYWsrTkyyb2RbzDeJsAgQIECBAgAABAgQIECBAYGkJlGTtoJbP9Gv7qXL6ZbcurfSbT7ukS576oWP2GEyVk5Mcl2z6aKAXAQIECBAgQIAAAQIECBAgQIDALwVuSfLJXr9+pJzy2SX7/KwlV2DV8fFeu/vXX9grObXWvPDfH7TujUmAAAECBAgQIECAAAECBAgQILBlgbaU/MOg5q+bu5/xD2V8fLCUsJZMgVU/ePSqwWDqpKT36qTuu5SQZSVAgAABAgQIECBAgAABAgQIdEeg3J4Mzu31+h8tp13+QHdybTlJ5wus+r7VOw4ytialnJFkt6WAKiMBAgQIECBAgAABAgQIECBAYAkI3JOUC3p1w/nl5deu73LezhZYm+64mtrwiiSvU1x1+S0kGwECBAgQIECAAAECBAgQILDEBe5J8u5ef4eLunpHVucKrFpT2vc/7/hSc3aSJy3xN4D4BAgQIECAAAECBAgQIECAAIGlIrCulry++ZMvXFxKapdCd6rAqu977jPbQbmwJId0CUkWAgQIECBAgAABAgQIECBAgMCoCNTkxqZXX1Veft3XujJzJwqsTc+5att3JHlVkl5XcOQgQIAAAQIECBAgQIAAAQIECIyowPBbCi/sNc2fduH5WIteYE2ef+hhvZL/lWTvEX1DGJsAAQIECBAgQIAAAQIECBAg0FWBOwc1f7zijOuvWcyAi1Zg1QuPXDkY/PjskqxJsmg5FhPf2QQIECBAgAABAgQIECBAgACBJSBQa3JBb+eVbywnX7thMfIuSnFUzzvkN2sdXJzkwMUY2pkECBAgQIAAAQIECBAgQIAAAQIzFahry6B3fHntV2+d6ZVzXb/dC6x67jNfXGv9UJId5xre9QQIECBAgAABAgQIECBAgAABAttVYH1JObW85muXbM9Tt1uBVcdX9wc73n92SXm1jwxuzz+xswgQIECAAAECBAgQIECAAAEC8ytQU9/TW7/zG8r4tVPzu/Pmd9suBVY9Z/+dau8xlyT1yO0xlDMIECBAgAABAgQIECBAgAABAgQWWqBcWQY/P66cddtPF/ykhT6gnnvQnnWqXpHUpy/0WfYnQIAAAQIECBAgQIAAAQIECBDYngLlG6Vfjiqv/uZdC3nqgt6BVc85cP+advg1i09cyCHsTYAAAQIECBAgQIAAAQIECBAgsGgC/1rSHFbOuvm2hUqwYAVWPXu/g2p6Vyd5/EKFty8BAgQIECBAgAABAgQIECBAgEAnBP5faerh5XW33bwQaRakwKrn7P+M2tarU7LLQoS2JwECBAgQIECAAAECBAgQIECAQMcEau4rTTminHXb1+c72bwXWPXsfQ6og961ifJqvv9Y9iNAgAABAgQIECBAgAABAgQIdFzgvtIbrC5vuGPtfOac1wKrvnOf/WrNPyd53HyGtBcBAgQIECBAgAABAgQIECBAgMCSEfhRKfnt8qY7vj1fieetwKrj++6VFZM3pJa95iucfQgQIECAAAECBAgQIECAAAECBJagQKnrMrnit8r47evmI/28FFj17H12zuTUl5McMB+h7EGAAAECBAgQIECAAAECBAgQILDkBdZmRf/Z5Q133D/XSeZcYNVPpcn/fuLfJfXouYZxPQECBAgQIECAAAECBAgQIECAwDISKLkiv7Hu98uL085lqrkXWONPeE9SXj2XEK4lQIAAAQIECBAgQIAAAQIECBBYrgL13DL+g9fMZbo5FVj1rbsfm14uSc2c9pnLAK4lQIAAAQIECBAgQIAAAQIECBDosEBJzSDHlbfffelsU866eKrjuz8lg8FXk+w428NdR4AAAQIECBAgQIAAAQIECBAgMBIC69Pr/ecyfvets5l2VgVWfeW+K7Pzj29KyYGzOdQ1BAgQIECAAAECBAgQIECAAAECIyZQc3Pu//WDy3tv3zjTyWdXYL1lt3OTeuZMD7OeAAECBAgQIECAAAECBAgQIEBghAVKOb+8454Zd0ozLrDqm3Y5LKVenXju1Qi/3YxOgAABAgQIECBAgAABAgQIEJiNQE0tR5R33nfNTC6eUYFVxx+3YyYm1ibZeyaHWEuAAAECBAgQIECAAAECBAgQIEDg3wXuzNjYAWX8R+unKzKzAuuNv3ZekjOmu7l1BAgQIECAAAECBAgQIECAAAECBDYjcH75y59M+6OE0y6w6htWPTPp3ZCkwU6AAAECBAgQIECAAAECBAgQIEBgDgJtBr1nlXf95Kbp7DGtAqsOn3d11o5fSeoh09nUGgIECBAgQIAAAQIECBAgQIAAAQJbFyg35pz1zypJ3ZbU9Aqs1+/wh0n5+LY283sCBAgQIECAAAECBAgQIECAAAEC0xYo9aXlnA3b7Jy2WWDV8azKz3b4dpI9p324hQQIECBAgAABAgQIECBAgAABAgS2LXBXHrthvzKeB7a2dNsF1mtXvi7Ju7Z9nhUECBAgQIAAAQIECBAgQIAAAQIEZihQ6lnl3RNb7Z62WmDV12entCvvSOpuMzzacgIECBAgQIAAAQIECBAgQIAAAQLTECj3pNm4T3lXfrqlxVsvsM7svyWlvGMaJ1lCgAABAgQIECBAgAABAgQIECBAYHYCtf5pOW/qz2dcYNUz85ik+V4Sd1/Njt5VBAgQIECAAAECBAgQIECAAAEC0xO4J2mfVM7Lzze3fIt3YNUzei9PKRdN7wyrCBAgQIAAAQIECBAgQIAAAQIECMxFoL6ynDfYbBe12QKrjqeXHze3Jdl3Lse6lgABAgQIECBAgAABAgQIECBAgMA0BW7Pr7f7l/EMHr1+8wXWmuaolFw+zc0tI0CAAAECBAgQIECAAAECBAgQIDB3gZqjywXtFdMtsC5LcszcT7UDAQIECBAgQIAAAQIECBAgQIAAgWkLXFEuaI/eZoFVz8yeGTR3JulPe2sLCRAgQIAAAQIECBAgQIAAAQIECMxdYCq9du9yXu56+Fa/8hHCuqb3ptTyF3M/zw4ECBAgQIAAAQIECBAgQIAAAQIEZihQ6pvLBYN3br3AelXv5qQcMMOtLSdAgAABAgQIECBAgAABAgQIECAwDwL1W+XCwSO6qUfcgVXPyG+mbW6dh5NsQYAAAQIECBAgQIAAAQIECBAgQGB2AoPmaeV9E7c8ePEjC6xX9cdT65/NbmdXESBAgAABAgQIECBAgAABAgQIEJgPgfL28t6phzqqRxZYr+h9IykHzccx9iBAgAABAgQIECBAgAABAgQIECAwK4FSby7vHTzUUT1UYNVXZI+kWZfkVx7sPquDXESAAAECBAgQIECAAAECBAgQIEBgdgI1afcqF+X7w8sfVmA1J6fmw7Pb01UECBAgQIAAAQIECBAgQIAAAQIE5lXglPK+dlNX9csC60+ai1Ny3LweYzMCBAgQIECAAAECBAgQIECAAAECsxGouaS8vz3+0QXWXcnwY4ReBAgQIECAAAECBAgQIECAAAECBBZd4Pvl/e2eDxVY9fTsnV7znUWPJQABAgQIECBAgAABAgQIECBAgACBBwV67T7lonxn00cI6/9oTkjyMToECBAgQIAAAQIECBAgQIAAAQIEOiTw0vI/249vKrDa0/vnl1LXdCicKAQIECBAgAABAgQIECBAgAABAiMuUEu5sHn/1JpNBdbgtOYLKfmdETcxPgECBAgQIECAAAECBAgQIECAQLcErut9oF39iwLr9ObeJLt0K580BAgQIECAAAECBAgQIECAAAECIy5wX+8D7a6lnp49a23WjTiG8QkQIECAAAECBAgQIECAAAECBDooUEq7V6mn9Z9Ta72ug/lEIkCAAAECBAgQIECAAAECBAgQGHGBUspzSz2tObHWfHTELYxPgAABAgQIECBAgAABAgQIECDQQYFSclKpf9R7a015WwfziUSAAAECBAgQIECAAAECBAgQIDDiArWUt5X2j5sPl5qTR9zC+AQIECBAgAABAgQIECBAgAABAh0UqMnflMEpzWUpOaaD+UQiQIAAAQIECBAgQIAAAQIECBAYdYGaz5bBqc0NSQ4ZdQvzEyBAgAABAgQIECBAgAABAgQIdFLgxjI4pX9bUvfrZDyhCBAgQIAAAQIECBAgQIAAAQIERlyg/MvwI4R3J3n8iEsYnwABAgQIECBAgAABAgQIECBAoIsCNT8sg5c1P06ycxfzyUSAAAECBAgQIECAAAECBAgQIDDyAvcPC6yfJNlp5CkAECBAgAABAgQIECBAgAAB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);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 37rpx;
  font-size: 32rpx;
  line-height: 74rpx;
  color: #fff;
  text-align: center;
  font-weight: bold;
}

.btn.sign-unable-btn {
  background-color: #e6e6e6;
}

button[class='btn']::after {
  border: 0;
}

.bold {
  font-weight: bold;
}

.coupon-code-box {
  width: 100%;
  margin: 30rpx 0 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.coupon-code {
  width: 586rpx;
  height: 144rpx;
}

.barcode-box {
  width: 586rpx;
  height: 144rpx;
  margin: 0 auto;
}

.barcode-box canvas {
  width: 586rpx;
  height: 144rpx;
  margin: 0 auto;
}

.coupon-code-box text {
  width: 100%;
  display: block;
  font-size: 32rpx;
  color: #3c3c3c;
  line-height: 36rpx;
  margin-top: 16rpx;
  text-align: center;
}

.content-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 240rpx;
  height: 100rpx;
  text-align: center;
  font-size: 10rpx;
}

.spinner > view {
  background-color: #009f55;
  height: 100%;
  width: 8rpx;
  margin: 0 3rpx;
  display: inline-block;
  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }

  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}

movable-area {
  height: 100%;
  width: 100%;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
}

movable-view {
  width: 120rpx;
  height: 120rpx;
}

button.authorization {
  width: 100% !important;
  height: 100% !important;
  background: transparent !important;
  position: absolute;
  top: 0;
  left: 0;
}

button.authorization::after {
  border: none;
}

.popup-upgrade-box {
  width: 660rpx;
  /* height: 440rpx; */
  padding-bottom: 140rpx;
  background: #fff;
  border-radius: 20rpx;
  position: relative;
}

.popup-upgrade-title {
  width: 368rpx;
  height: 87rpx;
  margin: 0 auto;
  padding-top: 30rpx;
  position: relative;
  color: #1c1c1c;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 80rpx;
  text-align: center;
  overflow: hidden;
}

.popup-upgrade-content {
  color: #1c1c1c;
  font-size: 42rpx;
  font-weight: 400;
  line-height: 64rpx;
  padding: 0 60rpx 20rpx 60rpx;
  text-align: left;
}

.popup-upgrade-button {
  position: absolute;
  bottom: 0;
  font-size: 36rpx;
  width: 100%;
  height: 110rpx;
  display: flex;
}

.popup-upgrade-button > view {
  width: 100%;
  height: 100%;
  font-weight: 400;
  text-align: center;
  line-height: 110rpx;
  color: #fff;
  border-radius: 0 0 20rpx 20rpx;
}
</style>
