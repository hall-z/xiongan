<route lang="json5" type="page">
{
  layout: 'default-newretail',
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
    },
  },
}
</route>
<template>
  <!-- pages/myCoupon/myCoupon.wxml -->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view
    class="coupon-main"
    v-if="!state.loading"
    :style="'height:' + state.windowHeight + 'px;padding-top:110rpx'"
  >
    <view class="coupon-nav" :style="'top:' + state.navHeight + 'px'">
      <view
        :class="state.type == 'DISCOUNT' ? 'selected' : 'select'"
        :style="'color: ' + (state.type === 'DISCOUNT' ? state.themeColor : '') + ';'"
        @click="clickCategory"
      >
        <text>商品优惠券</text>
        <view
          class="borderbox"
          :style="'background-color: ' + (state.type === 'DISCOUNT' ? state.themeColor : '') + ';'"
          v-if="state.type == 'DISCOUNT'"
        ></view>
      </view>
      <view
        :class="state.type == 'FREESHIP' ? 'selected' : 'select'"
        :style="'color: ' + (state.type === 'FREESHIP' ? state.themeColor : '') + ';'"
        @click="clickCategory"
      >
        <text>运费优惠券</text>
        <view
          class="borderbox"
          :style="'background-color: ' + (state.type === 'FREESHIP' ? state.themeColor : '') + ';'"
          v-if="state.type == 'FREESHIP'"
        ></view>
      </view>
    </view>
    <view class="coupon-item-box" :style="'min-height:' + state.couponBoxHeight + 'px;'">
      <view :class="'coupon-available ' + (state.type === 'DISCOUNT' ? 'show' : 'hidden')">
        <view v-for="(item, index) in state.discountCoupon" :key="index">
          <!-- <coupon-item bind:onClickCouponItem="clickCouponItem" coupon="{{item}}"></coupon-item> -->
          <coupon-receive
            :showUseBtn="state.useBtnShow"
            hideSignBtn="true"
            :coupon="item"
            :hasUserInfo="hasUserInfo"
            @assign="toUse"
            @getUserInfo.stop="onGetUserInfo"
            @showCode="showCouponCode"
          ></coupon-receive>
        </view>
        <view
          class="no-data"
          :hidden="
            state.discountCoupon.length == 0 && state.discountCoupon.length == 0 ? false : true
          "
        >
          <image :src="state.imagesPath.imgNoCoupon"></image>
          <button
            :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'"
            size="mini"
            @click="toCouponCenter"
          >
            前往领券中心
          </button>
        </view>
      </view>
      <view :class="'coupon-used ' + (state.type === 'FREESHIP' ? 'show' : 'hidden')">
        <view v-for="(item, index) in state.freeshipCoupon" :key="index">
          <!-- <coupon-item bind:onClickCouponItem="clickCouponItem" coupon="{{item}}"></coupon-item> -->
          <coupon-receive
            :showUseBtn="state.useBtnShow"
            hideSignBtn="true"
            :coupon="item"
            :hasUserInfo="hasUserInfo"
            @assign="toUse"
            @getUserInfo.stop="onGetUserInfo"
            @showCode="showCouponCode"
          ></coupon-receive>
        </view>
        <view class="no-data" :hidden="state.freeshipCoupon.length == 0 ? false : true">
          <image :src="state.imagesPath.imgNoCoupon"></image>
          <button
            :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'"
            size="mini"
            @click="toCouponCenter"
          >
            前往领券中心
          </button>
        </view>
      </view>
    </view>
    <view class="coupon-bottom-box">
      <!-- <view class="coupon-data" hidden="{{!noCouponData}}">没有更多数据</view> -->
      <view
        class="coupon-history"
        :style="'color: ' + state.themeColor"
        @click="toCouponHistory"
        :data-type="state.type"
      >
        查看历史优惠券
        <image :src="state.imagesPath.iconRight1" mode="widthFix"></image>
      </view>
    </view>
    <view class="loading" :hidden="!state.load">{{ state.loadingText }}</view>
  </view>
  <view class="content" v-if="state.loading">
    <view class="spinner">
      <view class="rect1" :style="'background-color: ' + state.themeColor"></view>
      <view class="rect2" :style="'background-color: ' + state.themeColor"></view>
      <view class="rect3" :style="'background-color: ' + state.themeColor"></view>
      <view class="rect4" :style="'background-color: ' + state.themeColor"></view>
      <view class="rect5" :style="'background-color: ' + state.themeColor"></view>
    </view>
  </view>
  <image
    class="movable-view"
    v-if="state.homeBack"
    :src="state.imagesPath.toHome"
    @click="toHome"
  ></image>
  <popup
    :show="state.show.couponCode"
    position="middle"
    custom-class="middle"
    @close="toggleCouponCodePopup"
    @touchmove.stop="catchtouchmove"
  >
    <view class="popup-coupon-code-box" @click="toggleCouponCodePopup">
      <view class="popup-top-info">
        <!-- <text>线上商城</text> -->
        <text class="popup-coupon-code-tips">请向店员出示券码进行核销</text>
      </view>
      <view class="popup-coupon-code-content">
        <view class="coupon-code-box" v-if="showCodeFlag">
          <view class="barcode-box">
            <canvas id="barcode" type="2d" canvas-id="barcode">
              <image
                v-if="state.barcodeImageUrl"
                :src="state.barcodeImageUrl"
                mode="widthFix"
              ></image>
            </canvas>
          </view>
          <text>{{ state.codeText }}</text>
          <view class="qrcode-box">
            <canvas id="qrcode" type="2d" canvas-id="qrcode" :hidden="canvasHidden"></canvas>
          </view>
        </view>
      </view>
    </view>
  </popup>
</template>
<script setup>
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsCouponHandler from '@/utils/newretail/couponHandler'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiShopcartServiceJs from '@/service/api/newretail/shopcartService'
import _apiBackCashServiceJs from '@/service/api/newretail/backCashService'
import _utilsAuthJs from '@/utils/newretail/auth'
import {
  onPageScroll,
  onLoad,
  onReady,
  onShow,
  onHide,
  onUnload,
  onPullDownRefresh,
  onReachBottom,
  onShareAppMessage,
} from '@dcloudio/uni-app'
import { reactive, ref, getCurrentInstance } from 'vue'
import couponItem from '@/pages-sub/newretail/components/coupon/coupon-item4/coupon-item.vue'
import couponReceive from '@/pages-sub/newretail/components/coupon/coupon-receive/coupon-receive.vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue'
const app = getApp()
const instance = getCurrentInstance()
const wxaUserService = _apiWxaUserServiceJs
const auth = _utilsAuthJs

// pages/myCoupon/myCoupon.js
const couponService = _apiCouponServiceJs
const sysService = _apiSystemServiceJs
const memberService = _apiMemberServiceJs
const shopcartService = _apiShopcartServiceJs
const backCashService = _apiBackCashServiceJs
const NAVPAGE = _utilsNavPageJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const couponHandler = _utilsCouponHandler
const wxbarcode = _utilsSelfJs
const themeManager = _utilsThemeManagerJs
const ADDRESS = _utilsAddressJs

// 获取应用实例
const state = reactive({
  useBtnShow: false,
  // 立即使用按钮展示
  navigationBarTitle: '我的优惠券',
  imagesPath: IMGAGESPATH,
  userInfo: {},
  type: 'DISCOUNT',
  page: 1,
  pageSize: 10,
  externalPage: 1,
  limit: 10,
  available: true,
  searchCount: true,
  pageCount: 1,
  couponsList: [],
  discountCoupon: [],
  // 优惠券
  freeshipCoupon: [],
  // 运费券
  x: 0,
  y: 60,
  scale: 2,
  homeBack: false,
  loading: true,
  member: {},
  load: false,
  loadingText: '正在加载...',
  noCouponData: false,
  codeText: '',
  // 弹窗控制
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    couponCode: false,
  },
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  externalPageCount: 1,
  floorstatus: false,
  windowHeight: 667,
  couponBoxHeight: 667,
  barcodeImageUrl: '',
  navHeight: 0,
  storeId: '',
  storeInfo: {},
})
const _data = {
  couponsList: [],
  discountCoupon: [],
  // 优惠券
  freeshipCoupon: [], // 运费券
}
let isUseExternalCoupon = true
const hasUserInfo = ref(true)
const showCodeFlag = ref(false)
const canvasHidden = ref(false)
onPageScroll(function (e) {
  if (e.scrollTop > 0) {
    state.floorstatus = true
  }
})
function clickCategory() {
  if (state.type === 'DISCOUNT') {
    state.type = 'FREESHIP'
  } else {
    state.type = 'DISCOUNT'
  }
  if (uni.pageScrollTo && state.floorstatus) {
    uni.pageScrollTo({
      scrollTop: 0,
    })
  }
}
function clickCouponItem(e) {
  toCouponDetails(e.detail)
}
function toCouponDetails(val) {
  const isExternal = val.external
  const couponActivityId = val.activityid
  const type = val.type
  const couponsList = state.couponsList
  const id = val.id
  if (!isExternal) {
    const opts =
      '?couponActivityId=' +
      couponActivityId +
      '&type=' +
      type +
      '&couponId=' +
      id +
      '&isExternal=' +
      isExternal
    NAVPAGE.toCouponDetails(opts)
  } else {
    // 外部券详情跳转
    let tempCoupons = null
    couponsList.forEach((item) => {
      if (item.externalCardNum === id) {
        tempCoupons = item
      }
    })
    const coupon = JSON.stringify(tempCoupons)
    const opts =
      '?couponActivityId=' +
      couponActivityId +
      '&type=' +
      type +
      '&couponId=' +
      id +
      '&isExternal=' +
      isExternal +
      '&coupon=' +
      coupon
    NAVPAGE.toCouponDetails(opts)
  }
}
function toCouponHistory(val) {
  const opts = '?type=' + val.currentTarget.dataset.type
  NAVPAGE.toCouponHistory(opts)
}
function onGetUserInfo(e) {
  console.log(e)
  wxaUserService
    .login(true)
    .then((res) => {
      console.log(res)
      auth.setUser(res)
      app.globalData.userInfo = res && res.member ? res : null
      if (!res.member) {
        hasUserInfo.value = true
        NAVPAGE.toAuthorize()
      } else {
        auth.getDistributor()
        auth.bindDistribution()
        state.member = res.member
        hasUserInfo.value = true
        // 刷新优惠券列表
        state.page = 1
        state.externalPage = 1
        state.couponsList = []
        state.externalPageCount = 1
        _data.couponsList = []
        _data.discountCoupon = []
        _data.freeshipCoupon = []
        const listData = getCouponList(1, state.pageSize, state.searchCount, res.member.id)
        Promise.all([listData]).then((res) => {
          if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
            _data.discountCoupon = res[0][0]
            _data.freeshipCoupon = res[0][1]
            state.discountCoupon = res[0][0]
            state.freeshipCoupon = res[0][1]
            if (res[0][0] && res[0][0].length < state.limit) {
              queryExternalCoupons()
            }
          } else {
            queryExternalCoupons()
          }
        })
        uni.setStorage({
          key: 'wj_member',
          data: res.member,
        })
      }
    })
    .catch((err) => {
      console.log(err)
      hasUserInfo.value = false
      const msg = 'meet frequency limit'
      const authorize = 'auth deny'
      const errMsg = err.message
      if (errMsg.indexOf(msg) > -1) {
        uni.showToast({
          title: '登陆超时，请小憩片刻再来登陆吧~',
          icon: 'none',
          duration: 2000,
        })
      } else if (errMsg.indexOf(authorize) > -1) {
        uni.showToast({
          title: '授权失败，请点击头像重新登录~',
          icon: 'none',
          duration: 2000,
        })
      } else {
        uni.showToast({
          title: '登陆失败，请点击头像重新登录~',
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function getUseKey() {
  sysService
    .query('couponEnableUseNow')
    .then((res) => {
      if (res && res.length > 0 && res[0].value != null) {
        // console.log(res[0].value,233333)
        if (res[0].value === 'TRUE') {
          state.useBtnShow = true
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
function getCouponList(page, pageSize, searchCount, memberId) {
  const tempList = []
  // 优惠券
  const tempDiscountCoupon = []
  // 运费券
  const tempFreeshipCoupon = []
  const memberMobile = state.member.mobile
  const postData = {
    page,
    pageSize,
    searchCount,
    memberIdEquals: memberId,
    memberMobileEquals: memberMobile,
    orderDirection: 'desc',
    orderField: 'assign_time',
    statusEquals: 'OPEN',
  }
  const listData = couponService
    .queryCoupon(postData)
    .then((res) => {
      uni.hideToast()
      state.pageCount = res.pageCount
      console.log(res)
      if (res.records && res.records.length > 0) {
        // 读券
        const ids = res.records.map(function (item) {
          return item.id
        })
        couponService.visited(ids).then((res) => {})

        // 显示券
        res.records.forEach((item) => {
          let tempItem = {
            id: item.id,
            faceValue: item.faceValue,
            balance: item.balance,
            allProduct: item.allProduct,
            couponTypeName: item.couponTypeName,
            couponActivityName: item.couponActivityName,
            bytimeStart: item.bytimeStart,
            bytimeEnd: item.bytimeEnd,
            status: item.status,
            statusDesc: handleCouponStatus(item.status),
            rate: item.rate || item.rate === 0 ? (item.rate * 10).toFixed(1) : '',
            function: item.function,
            name: item.couponActivityName,
            couponActivityId: item.couponActivityId,
            isExternal: false,
            description: item.activityRemark,
            useAmountLimit: item.useAmountLimit,
            cardNum: item.cardNum,
          }
          if (item.bytimeStart) {
            // let startTime = item.bytimeStart.split(' ')[0]
            // let endTime = item.bytimeEnd.split(' ')[0]
            const startTime = item.bytimeStart.slice(0, 16)
            const endTime = item.bytimeEnd.slice(0, 16)
            const effectiveTime = startTime + ' ~ ' + endTime
            tempItem = {
              ...tempItem,
              effectiveTime,
            }
          } else {
            tempItem = {
              ...tempItem,
              effectiveTime: '',
            }
          }
          couponHandler.handleCouponFunction(tempItem)
          if (item.function === 'FREESHIP') {
            tempFreeshipCoupon.push(tempItem)
          } else {
            tempDiscountCoupon.push(tempItem)
          }
        })
        let tempCouponsList = []
        tempCouponsList = [].concat(_data.couponsList)
        tempCouponsList = tempCouponsList.concat(res.records)
        _data.couponsList = tempCouponsList
        state.couponsList = tempCouponsList
      }
      tempList.push(tempDiscountCoupon, tempFreeshipCoupon)
      return tempList
    })
    .catch((e) => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
      tempList.push(tempDiscountCoupon, tempFreeshipCoupon)
      return tempList
    })
  return listData
}
function handleCouponName(name) {
  if (name === 'FREESHIP') {
    return '运费券'
  } else if (name === 'DISCOUNT') {
    return '折扣券'
  } else if (name === 'CASH') {
    return '满减券'
  } else if (name === 'GIFT') {
    return '礼品券'
  } else {
    return '优惠券'
  }
}
function handleCouponStatus(status) {
  if (status === 'OPEN') {
    return '已发放'
  } else if (status === 'USED') {
    return '已使用'
  } else if (status === 'EXPIRE') {
    return '已过期'
  } else if (status === 'CANCEL') {
    return '已作废'
  } else if (status === 'MADE') {
    return '已生成'
  } else {
    return '已领取'
  }
}
function toUse(e) {
  console.log(e.detail.coupon)
  if (!e.detail.coupon || !e.detail.coupon.couponActivityId) {
    return
  }
  let postFunc = couponService.queryByCouponActivityId
  if (e.detail.coupon.couponServiceType === 'HDCRM') {
    postFunc = couponService.queryByHdCrmCode
  }
  postFunc(
    1,
    10,
    e.detail.coupon.couponServiceType === 'HDCRM'
      ? e.detail.coupon.templateNumber
      : e.detail.coupon.couponActivityId,
    state.storeId,
  )
    .then((res) => {
      console.log(res)
      if (!res || !res.records || res.records.length === 0) {
        uni.showToast({
          title: '商品已下架~',
          icon: 'none',
          duration: 2000,
        })
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
        NAVPAGE.toGoodsDetails(opts)
      } else {
        let opts =
          '?couponActivityId=' +
          e.detail.coupon.couponActivityId +
          '&couponName=' +
          e.detail.coupon.name
        if (e.detail.coupon.couponServiceType === 'HDCRM') {
          opts =
            '?templateNumber=' +
            e.detail.coupon.templateNumber +
            '&couponName=' +
            e.detail.coupon.name
        }
        NAVPAGE.toGoodsList(opts)
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
function queryExternalCoupons() {
  const tempList = []
  // 优惠券
  const tempDiscountCoupon = []
  // 运费券
  const tempFreeshipCoupon = []
  let tempPage = state.externalPage
  const memberId = state.member.id
  const pageSize = state.pageSize
  const postData = {
    memberId,
    page: tempPage,
    pageSize,
    state: 'OPEN',
  }
  let listData = [[], []]
  if (isUseExternalCoupon) {
    //   if (tempPage <= state.externalPageCount) {
    listData = couponService
      .queryExternalCoupons(postData)
      .then((res) => {
        uni.hideToast()
        console.log(res)
        if (res && res.records.length > 0) {
          state.externalPageCount = res.pageCount
          const tempExternalList = []
          res.records.forEach((item) => {
            if (item.status === 'OPEN') {
              tempExternalList.push(item)
              let tempItem = {
                id: item.externalCardNum,
                faceValue: item.faceValue,
                balance: item.balance,
                couponTypeName: item.couponTypeName,
                couponActivityName: item.couponActivityName,
                bytimeStart: item.bytimeStart,
                bytimeEnd: item.bytimeEnd,
                status: item.status,
                statusDesc: handleCouponStatus(item.status),
                rate: item.rate || item.rate === 0 ? (item.rate * 10).toFixed(1) : '',
                function: item.function,
                name: item.couponActivityName,
                couponActivityId: item.couponActivityId,
                isExternal: true,
                description: item.useRule,
                externalCardNum: item.externalCardNum,
                templateNumber: item.templateNumber,
                couponServiceType: item.couponServiceType,
              }
              if (item.bytimeStart) {
                const startTime = item.bytimeStart.split(' ')[0]
                const endTime = item.bytimeEnd.split(' ')[0]
                const effectiveTime = startTime + ' 至 ' + endTime
                tempItem = {
                  ...tempItem,
                  effectiveTime,
                }
              } else {
                tempItem = {
                  ...tempItem,
                  effectiveTime: '',
                }
              }
              couponHandler.handleCouponFunction(tempItem)
              if (item.function === 'FREESHIP') {
                tempFreeshipCoupon.push(tempItem)
              } else {
                tempDiscountCoupon.push(tempItem)
              }
            }
          })
          console.log(state.couponsList)
          let tempCouponsList = []
          tempCouponsList = [].concat(_data.couponsList)
          tempCouponsList = tempCouponsList.concat(tempExternalList)
          _data.couponsList = tempCouponsList
          state.couponsList = tempCouponsList
        }
        tempList.push(tempDiscountCoupon, tempFreeshipCoupon)
        return tempList
      })
      .catch((e) => {
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000,
        })
        tempList.push(tempDiscountCoupon, tempFreeshipCoupon)
        return tempList
      })
    //   }
  } else {
    console.log('未启用外部券的配置信息')
    uni.hideToast()
  }
  Promise.all([listData]).then((res) => {
    console.log(res)
    if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
      console.log(res[0])
      setCoupons(res[0])
      tempPage++
      state.externalPage = tempPage
    } else {
      state.load = false
      state.noCouponData = true
    }
    uni.hideLoading()
  })
}
function toHome() {
  NAVPAGE.toHome()
}
function toCouponCenter() {
  NAVPAGE.toCouponCenter()
}
function initPage() {
  if (app.globalData.storeInfo) {
    state.storeId = app.globalData.storeInfo.id
    state.storeInfo = app.globalData.storeInfo
  }
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      const memberInfo = app.globalData.userInfo.member
      state.member = memberInfo
      const listData = getCouponList(state.page, state.pageSize, state.searchCount, memberInfo.id)
      Promise.all([listData]).then((res) => {
        console.log(res)
        if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
          _data.discountCoupon = res[0][0] // 优惠券
          _data.freeshipCoupon = res[0][1] // 运费券
          state.discountCoupon = res[0][0]
          state.freeshipCoupon = res[0][1]
          if (res[0][0] && res[0][0].length < state.limit) {
            queryExternalCoupons()
          }
        } else {
          queryExternalCoupons()
        }
        state.loading = false
      })
    } else {
      uni.showToast({
        title: '您还不是会员，请先绑定手机号码成为会员',
        icon: 'none',
        duration: 500,
      })
      setTimeout(() => {
        NAVPAGE.toAuthorize()
      }, 500)
      state.loading = false
    }
  } else {
    uni.showToast({
      title: '您还未授权，请点击允许授权',
      icon: 'none',
      duration: 500,
    })
    setTimeout(() => {
      NAVPAGE.toAuthorize()
    }, 500)
    state.loading = false
  }
}
onLoad(function (options) {
  uni.hideShareMenu()
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
  const pageStack = getCurrentPages()
  console.log(pageStack)
  if (pageStack.length === 1) {
    state.homeBack = true
  }
  const navHeight = app.globalData.navHeight || 0
  // 是否启用外部券的配置信息：TRUE是、FALSE否，默认TRUE
  state.navHeight = navHeight
  state.windowHeight =
    app.globalData.systemInfo.windowHeight -
    navHeight -
    (110 * app.globalData.systemInfo.windowWidth) / 750
  state.couponBoxHeight =
    app.globalData.systemInfo.windowHeight -
    navHeight -
    (110 * app.globalData.systemInfo.windowWidth) / 750 -
    (143 * app.globalData.systemInfo.windowWidth) / 750
  let _isUseExternalCoupon = true
  // 查询系统配置项，根据系统配置项控制列表菜单显示
  const systemOptions = app.globalData.configureInfo
  systemOptions.forEach((item) => {
    // 是否启用外部券的配置信息：TRUE是、FALSE否，默认TRU
    if (item.key === 'isUseExternalCoupon' && item.value != null) {
      item.value === 'TRUE' ? (_isUseExternalCoupon = true) : (_isUseExternalCoupon = false)
    }
  })
  isUseExternalCoupon = _isUseExternalCoupon
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
    initPage() // 初始化页面内容
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation()
      .then((res) => {
        app.globalData.storeInfo = res
        // 统计PV
        ANALYSIS.PVStatistics(res.id)
        initPage() // 初始化页面内容
      })
      .catch((err) => {
        console.log(err)
      })
  }
})
onReady(function () {})
onShow(function () {
  console.log(app.globalData.userInfo)
  if (app.globalData.userInfo) {
    hasUserInfo.value = true
    if (app.globalData.userInfo.member) {
      const memberInfo = app.globalData.userInfo.member
      state.member = memberInfo
      // 刷新用户信息
      memberService
        .getLoginMember(false)
        .then((res) => {
          if (app.globalData.userInfo && app.globalData.userInfo.member) {
            app.globalData.userInfo.member = {
              ...app.globalData.userInfo.member,
              ...res,
            }
            state.member = app.globalData.userInfo.member
          }
        })
        .catch((err) => {
          console.log('刷新会员信息失败:', err)
        })
      // 检查是否是导购员
      if (app.globalData.userInfo.member && app.globalData.userInfo.member.id) {
        backCashService
          .memberIsGuide(app.globalData.userInfo.member.id)
          .then((res) => {
            app.globalData.isShoppingGuide = res
          })
          .catch((err) => {
            console.log('查询是否是导购员失败:', err)
          })
      }
      // 获取购物车数量
      shopcartService
        .getProductsCount()
        .then((res) => {
          const tabBar = app.globalData.tabBar
          if (tabBar && tabBar.list && tabBar.list.length > 0) {
            tabBar.list.forEach((item) => {
              if (item.pagePath && item.pagePath.indexOf('shopcart') > -1) {
                item.badge = String(res)
              }
            })
            app.globalData.tabBar = tabBar
            if (app.globalData.editTabbar) {
              app.globalData.editTabbar()
            }
          }
          try {
            uni.setStorageSync('wj_userProductsCount', res)
          } catch (error) {
            console.log('保存购物车数量失败:', error)
          }
        })
        .catch((err) => {
          console.log('获取购物车数量失败:', err)
        })
    } else {
      hasUserInfo.value = false
    }
  } else {
    hasUserInfo.value = false
  }
  getUseKey()
  // 获取模板ID（如果还没获取过）
  if (
    app.globalData.templateIdsQuery === 0 &&
    app.globalData.userInfo &&
    app.globalData.userInfo.member
  ) {
    sysService
      .getTemplateIds()
      .then((res) => {
        if (res) {
          app.globalData.templateIdsQuery = 1
          app.globalData.templateIds = res
          uni.setStorage({
            key: 'wj_templateIds',
            data: res,
          })
        }
      })
      .catch((err) => {
        app.globalData.templateIdsQuery = 1
        console.log('查询模板id失败:', err)
      })
  }
})
onHide(function () {
  uni.hideLoading()
})
onUnload(function () {
  uni.hideLoading()
})
onPullDownRefresh(function () {
  console.log('onPullDownRefresh')
  state.page = 1
  state.externalPage = 1
  state.couponsList = []
  state.externalPageCount = 1
  _data.couponsList = []
  _data.discountCoupon = []
  _data.freeshipCoupon = []
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const tempList = getCouponList(1, state.pageSize, state.searchCount, state.member.id)
    Promise.all([tempList]).then((res) => {
      console.log(res[0])
      if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
        _data.discountCoupon = res[0][0] // 优惠券
        _data.freeshipCoupon = res[0][1] // 运费券
        state.discountCoupon = res[0][0]
        state.freeshipCoupon = res[0][1]
        if (res[0][0] && res[0][0].length < state.limit) {
          queryExternalCoupons()
        }
      } else {
        queryExternalCoupons()
      }
      uni.stopPullDownRefresh()
    })
  } else {
    uni.showToast({
      title: '您还不是会员，请绑定手机号成为会员~',
      icon: 'none',
      duration: 2000,
    })
  }
})
onReachBottom(function () {
  console.log('onReachBottom')
  loadingCoupon()
})
function loadingCoupon() {
  if (!state.member || !state.member.id) {
    uni.hideLoading()
    return
  }
  state.load = true
  uni.showLoading({
    title: '加载中',
    mask: true,
  })
  // 保存当前数据到 _data，避免接口重复调用造成的数据显示重复的问题
  _data.couponsList = state.couponsList
  _data.discountCoupon = state.discountCoupon
  _data.freeshipCoupon = state.freeshipCoupon
  let index = state.page
  index++
  const tempList = getCouponList(index, state.pageSize, state.searchCount, state.member.id)
  Promise.all([tempList])
    .then((res) => {
      if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
        console.log(res[0])
        setCoupons(res[0])
        state.page = index
        if (res[0][0] && res[0][0].length < state.limit) {
          // 查询到的内部券数量不够一屏，查询外部券
          console.log('内部券数量不够，查询外部券')
          queryExternalCoupons()
        } else {
          state.load = false
        }
      } else {
        // 内部券加载完开始查询外部券
        queryExternalCoupons()
      }
      uni.hideLoading()
    })
    .catch((err) => {
      console.log(err)
      uni.hideLoading()
      state.load = false
    })
}
function setCoupons(coupons) {
  let tempDiscountCoupon = _data.discountCoupon
  let tempFreeshipCoupon = _data.freeshipCoupon
  tempDiscountCoupon = tempDiscountCoupon.concat(coupons[0])
  tempFreeshipCoupon = tempFreeshipCoupon.concat(coupons[1])
  state.discountCoupon = tempDiscountCoupon
  state.freeshipCoupon = tempFreeshipCoupon
  state.load = false
}
onShareAppMessage(function () {})
function showCouponCode(e) {
  const couponId = e.detail.couponid
  const couponsList = state.discountCoupon // 折扣券有券码
  let coupon = null
  for (let i = 0; i < couponsList.length; i++) {
    const ele = couponsList[i]
    if (ele.id === couponId) {
      coupon = ele
    }
  }
  if (coupon) {
    if (coupon.isExternal && coupon.externalCardNum) {
      // 外部券
      toggleCouponCodePopup()
      showCode(coupon.externalCardNum)
    } else if (!coupon.isExternal && coupon.cardNum) {
      // 内部券
      const cardNum = app.globalData.systemConfigure.externalCouponPrefix + coupon.cardNum
      toggleCouponCodePopup()
      showCode(cardNum)
    }
  }
}
function toggleCouponCodePopup() {
  state.show.couponCode = !state.show.couponCode
}
function toggle(type) {
  state.show[type] = !state.show[type]
}
function catchtouchmove() {}
function showCode(codeText) {
  state.codeText = codeTextPartition(codeText)
  showCodeFlag.value = true
  canvasHidden.value = false
  // 使用 instance 作为上下文
  wxbarcode
    .barcode('barcode', codeText, 629, 166, instance)
    .then(() => {
      return wxbarcode.qrcode('qrcode', codeText, 290, 290, instance)
    })
    .then(() => {
      const pixelRatio = app.globalData.systemInfo ? app.globalData.systemInfo.pixelRatio : 2
      setTimeout(() => {
        uni.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            width: 640,
            height: 120,
            destWidth: 640 * pixelRatio,
            destHeight: 120 * pixelRatio,
            canvasId: 'qrcode',
            success(res) {
              console.log(res, 'res')
              state.barcodeImageUrl = res.tempFilePath
            },
            fail(err) {
              console.log(err)
            },
          },
          instance,
        )
      }, 1000)
    })
    .catch((err) => {
      console.log('生成条形码或二维码失败:', err)
    })
}
function codeTextPartition(val) {
  console.log(val)
  val = val.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, '$1 ')
  console.log(val)
  return val
}
</script>
<style scoped>
/* pages/myCoupon/myCoupon.wxss */

page {
  background-color: #f3f2f6;
  height: 100%;
  width: 100%;
}

.coupon-main {
  width: 100%;
  /* height: calc(100% - 130rpx); */
  background-color: #fff;
}

.coupon-nav {
  overflow: hidden;
  height: 80rpx;
  width: 100%;
  line-height: 80rpx;
  display: flex;
  border-top: 2rpx solid #e6e6e6;
  background: #fff;
  color: #333333;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  font-weight: bold;
}

.coupon-nav > view {
  font-size: 32rpx;
}

.selected {
  position: relative;
  flex: 1;
  color: #009f55;
  border-bottom: 5rpx solid transparent;
  text-align: center;
}
.borderbox {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 70rpx;
  height: 5rpx;
  transform: translateX(-50%);
  background-color: #fb5606;
}
.select {
  flex: 1;
  text-align: center;
}

/*券列表  */

.show {
  display: block;
  background-color: #fff;
}

.hidden {
  display: none;
  background-color: #f3f2f6;
}

.coupon-item-box {
  padding: 21rpx 21rpx 122rpx 21rpx;
  /* margin-top: 110rpx; */
  background: #fff;
  /* border-top: 20rpx solid #f1f1f1; */
  min-height: 100%;
  background-color: #fff;
}

coupon-item:last-of-type {
  margin-bottom: 0;
}

.no-data {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
  margin-top: 200rpx;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  margin-top: 50rpx;
  width: 242rpx;
  height: 60rpx;
  background: #fff;
}

.coupon-bottom-box {
  width: 100%;
  height: 122rpx;
  margin-top: 24rpx;
  font-size: 24rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  background-color: #f3f2f6;
  z-index: 10;
}

.coupon-bottom-box view {
  height: 36rpx;
  padding: 0 30rpx;
}

.coupon-data {
  border-right: 1rpx solid #f0f0f0;
  color: #8b8b8c;
}

.coupon-history {
  font-size: 24rpx;
  color: #009f55;
  display: flex;
  justify-content: center;
  align-items: center;
}

.coupon-history image {
  width: 11rpx;
  height: 20rpx;
  margin-left: 8rpx;
  margin-top: 2rpx;
}

.loading {
  color: #999;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  background: #eee;
}

movable-area {
  height: 100%;
  width: 100%;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
  position: fixed;
  right: 0;
  bottom: 120rpx;
}

movable-view {
  width: 120rpx;
  height: 120rpx;
}

.content {
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

.popup-coupon-code-box {
  background: #ffffff;
  width: 708rpx;
  max-height: 900rpx;
  border-radius: 10rpx;
  padding-bottom: 100rpx;
}

.popup-top-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  padding-top: 22rpx;
  margin-bottom: 12rpx;
}

.popup-top-info text {
  font-size: 30rpx;
  color: #000000;
  line-height: 50rpx;
  margin-top: 6rpx;
  margin-bottom: 36rpx;
}

.popup-top-info .popup-coupon-code-tips {
  color: #b0b0b0;
  margin: 0;
}

.popup-top-info .logo {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
}

.coupon-code-box {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.coupon-code {
  width: 629rpx;
  height: 166rpx;
}

.barcode-box {
  width: 629rpx;
  height: 166rpx;
  margin: 0 auto;
}

.barcode-box canvas {
  width: 629rpx;
  height: 166rpx;
  margin: 0 auto;
}

.qrcode-box {
  margin-top: 28rpx;
  width: 290rpx;
  height: 290rpx;
}

.qrcode-box canvas {
  width: 290rpx;
  height: 290rpx;
}

.coupon-code-box text {
  width: 100%;
  display: block;
  font-size: 34rpx;
  color: #333333;
  line-height: 42rpx;
  margin-top: 19rpx;
  text-align: center;
}
</style>
