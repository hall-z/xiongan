<template>
  <!-- pages/couponCenter/couponCenter.wxml -->
  <view>
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <movable-area>
      <!-- <view class='current-store-box' bindtap='toSelectStore'>
    <image src='{{state.imagesPath.indexIconStore}}'></image>
    <text>当前门店:{{state.currentStoreInfo.storeName}}</text>
    <image src='{{state.imagesPath.iconRight1}}'></image>
  </view> -->
      <view class="banner-box" v-if="state.banners.length > 0">
        <swiper
          class="swiper"
          indicator-dots="true"
          autoplay="true"
          interval="5000"
          circular="true"
        >
          <view v-for="(item, index) in state.banners" :key="index">
            <swiper-item class="swiper-item" :data-id="item.id" @click="bannerJumping">
              <image :src="item.pictureUrl" class="slide-image"></image>
            </swiper-item>
          </view>
        </swiper>
      </view>
      <view class="coupon-list">
        <view v-for="(item, index) in state.couponList" :key="index">
          <coupon-receive
            :coupon="item"
            :hasUserInfo="state.hasUserInfo"
            @couponClick="couponClick"
            @getUserInfo.stop="onGetUserInfo"
            @assign="assign"
          ></coupon-receive>
        </view>
        <view class="no-data" :hidden="state.couponList.length > 0">
          <image :src="state.imagesPath.imgNoCouponReceive"></image>
          <button
            :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'"
            size="mini"
            @click="toHome"
          >
            随便逛逛
          </button>
        </view>
      </view>
      <movable-view :x="state.x" :y="state.y" direction="all" v-if="state.homeBack">
        <image class="movable-view" :src="state.imagesPath.toHome" @click="toHome"></image>
      </movable-view>
    </movable-area>
    <popup
      :show="state.show.middle"
      position="middle"
      custom-class="middle"
      @close="handleClosePopup"
    >
      <view class="coupon-popup">
        <view class="title">领取成功</view>
        <view class="coupon-item">
          <view class="main-coupon">
            <!-- <view class="main-coupon-code" wx:if="{{state.couponList[0].function !== 'FREESHIP'}}">
          <image src="{{state.imagesPath.iconCouponQRCode}}" mode="widthFix" lazy-load="false" ></image>
        </view> -->
            <view class="main-coupon-function">
              <view style="display: flex; flex-direction: column; align-items: center">
                <view class="coupon-head-info">
                  <view
                    :style="'font-size:36rpx; color:' + state.themeColor"
                    :hidden="
                      state.assignCoupon.function !== 'CASH' &&
                      !(state.assignCoupon.function === 'FREESHIP' && state.assignCoupon.faceValue)
                    "
                  >
                    ￥
                  </view>
                  <view
                    v-if="
                      state.assignCoupon.function === 'CASH' ||
                      (state.assignCoupon.function === 'FREESHIP' && state.assignCoupon.faceValue)
                    "
                    :style="
                      'margin-left:-16rpx;letter-spacing:-12rpx;' +
                      (state.assignCoupon.function === 'CASH' ||
                      state.assignCoupon.function === 'DISCOUNT' ||
                      (state.assignCoupon.function === 'FREESHIP' && state.assignCoupon.faceValue)
                        ? 'font-size:100rpx;'
                        : '') +
                      ';color:' +
                      state.themeColor
                    "
                  >
                    {{ state.assignCoupon.nr_headInfo }}
                  </view>
                  <view
                    v-else
                    :style="
                      (state.assignCoupon.function === 'CASH' ||
                      state.assignCoupon.function === 'DISCOUNT' ||
                      (state.assignCoupon.function === 'FREESHIP' && state.assignCoupon.faceValue)
                        ? 'font-size:100rpx;'
                        : '') +
                      ';color:' +
                      state.themeColor
                    "
                  >
                    {{ state.assignCoupon.nr_headInfo }}
                  </view>
                  <view
                    :style="'font-size:36rpx;margin-left:6rpx;' + state.themeColor"
                    :hidden="state.assignCoupon.function !== 'DISCOUNT'"
                  >
                    折
                  </view>
                </view>
              </view>
            </view>
            <view class="main-coupon-detail">
              <text class="main-coupon-detail-title">{{ state.assignCoupon.name }}</text>
              <view
                class="coupon-time-label"
                :hidden="
                  state.assignCoupon.function !== 'CASH' || !state.assignCoupon.useAmountLimit
                "
              >
                满{{ state.assignCoupon.useAmountLimit }}可用
              </view>
              <text>{{ state.assignCoupon.nr_condition }}</text>
              <view class="mini-function">{{ state.assignCoupon.nr_function }}</view>
            </view>
          </view>
          <!-- 分割线 -->
          <image
            class="coupon-seperator"
            style="width: auto; height: 28rpx"
            src="https://gomore-newretail.oss-cn-shanghai.aliyuncs.com/miniapp/UI/standard/iconCouponStyleImg.png"
          ></image>
          <view class="coupon-time-expand-board">
            <view class="coupon-time-board">
              <image class="coupon-time-icon" :src="state.imagesPath.pass_clock"></image>
              <text class="coupon-time-label" v-if="state.assignCoupon.effectiveTime">
                有效期：{{ state.assignCoupon.effectiveTime }}
              </text>
              <text class="coupon-time-label" v-else>
                抢券时间：{{ filtDateHead(state.assignCoupon.startDate) }}~{{
                  filtDateHead(state.assignCoupon.endDate)
                }}
              </text>
            </view>
          </view>
        </view>
        <view class="message">优惠券已发放至您的账户！</view>
        <view class="buttom-botton">
          <view class="botton-left" :style="'color: ' + state.themeColor" @click="handleClosePopup">
            继续领券
          </view>
          <view
            class="botton-right"
            :style="'background-color: ' + state.themeColor"
            @click="handleUseNow"
          >
            立即使用
          </view>
        </view>
      </view>
    </popup>
    <authorize @login="handleUserLogin"></authorize>
    <timeout :show="state.showTimeout" @close="timeoutPopupClose"></timeout>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsCouponHandler from '@/utils/newretail/couponHandler'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiRequestJs from '@/service/api/newretail/request'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiHelpActivityServiceJs from '@/service/api/newretail/helpActivityService'
import _apiBannerServiceJs from '@/service/api/newretail/bannerService'
import _apiCouponServiceJs from '@/service/api/newretail/couponService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bus from 'iny-bus'
import couponReceive from '@/pages-sub/newretail/components/coupon/coupon-receive/coupon-receive.vue';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
import timeout from '@/pages-sub/newretail/components/order/timeout/timeout.vue';
const app = getApp()

// pages/couponCenter/couponCenter.js
const couponService = _apiCouponServiceJs
const bannerService = _apiBannerServiceJs
const helpActivityService = _apiHelpActivityServiceJs
const memberService = _apiMemberServiceJs
const orderService = _apiOrderServiceJs
const request = _apiRequestJs
const utils = _utilsUtilsJs
const ADDRESS = _utilsAddressJs
const NAVPAGE = _utilsNavPageJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const couponHandler = _utilsCouponHandler
const themeManager = _utilsThemeManagerJs
// 获取应用实例
let isQueryExternalCoupon = false // 是否在查询外部券
const state = reactive({
  navigationBarTitle: '领券中心',
  imagesPath: IMGAGESPATH,
  currentStoreInfo: {
    storeId: '',
    storeName: '未获取到门店信息',
  },
  couponList: [],
  internalCouponList: [],
  loading: false,
  loadText: '正在加载中...',
  x: 750,
  y: 450,
  scale: 2,
  homeBack: false,
  phone: false,
  banners: [],
  sharePictures: '',
  hdCouponCanBuy: true,
  hasUserInfo: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  // 内部券活动分页数据
  page: 1,
  pageSize: 10,
  internalCouponPageCount: 0,
  // 外部券活动分页数据
  externalCouponPage: 1,
  externalCouponPageSize: 10,
  externalCouponPageCount: 0,
  showTimeout: false,
  show: {
    middle: false,
  },
  activityId: '',
  assignCoupon: {},
})
const _data = {
  hasExternalCoupon: true,
  hasInternalCoupon: true,
  hasAssign: false, // 当前是否在领取中
}
onLoad(function (_options) {
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
  const self = this
  let showExternalCouponActivity = false
  let isUseExternalCoupon = true
  // 查询系统配置项，根据系统配置项控制列表菜单显示
  const systemOptions = app.globalData.configureInfo
  systemOptions.forEach((item) => {
    // 查询配置控制外部券显示
    if (item.key === 'showExternalCouponActivity' && item.value != null) {
      item.value == 'TRUE'
        ? (showExternalCouponActivity = true)
        : (showExternalCouponActivity = false)
    } else if (item.key === 'isUseExternalCoupon' && item.value != null) {
      item.value == 'TRUE' ? (isUseExternalCoupon = true) : (isUseExternalCoupon = false)
    }
  })
  if (!isUseExternalCoupon) {
    showExternalCouponActivity = false
  }
  _data.hasExternalCoupon = showExternalCouponActivity
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    state.currentStoreInfo = {
      storeId: app.globalData.storeInfo.id,
      storeName: app.globalData.storeInfo.name,
    }
    state.themeColor =
      app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor')
    if (_options.formtype != null) {
      if (isUseExternalCoupon) {
        _data.hasExternalCoupon = true
      }
      _data.hasInternalCoupon = false
    }
    getCouponList(state.page)
    getBannerList(state.currentStoreInfo.storeId)
    // 统计PV
    ANALYSIS.PVStatistics(state.currentStoreInfo.storeId)
  } else {
    ADDRESS.getLocation()
      .then((res) => {
        app.globalData.storeInfo = res
        state.currentStoreInfo = {
          storeId: res.id,
          storeName: res.name,
        }
        if (_options.formtype) {
          if (isUseExternalCoupon) {
            _data.hasExternalCoupon = true
          }
          _data.hasInternalCoupon = false
        }
        getCouponList(state.page)
        getBannerList(res.id)
        // 统计PV
        ANALYSIS.PVStatistics(res.id)
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  }
  const pageStack = getCurrentPages()
  console.log(pageStack)
  if (pageStack.length === 1) {
    state.homeBack = true
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures()
})
onReady(function () {})
onShow(function () {
  if (app.globalData.storeInfo && app.globalData.storeInfo.id != state.currentStoreInfo.storeId) {
    console.log(app.globalData.storeInfo)
    state.currentStoreInfo = {
      storeId: app.globalData.storeInfo.id,
      storeName: app.globalData.storeInfo.name,
    }
    state.couponList = []
    getCouponList(state.page)
  }
  // 获取用户信息
  state.middle = false
  checkUserInfo()
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {
  state.couponList = []
  state.page = 1
  getCouponList(1)
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
onReachBottom(function () {
  if (state.page < state.internalCouponPageCount) {
    state.page = ++state.page
    getCouponList(state.page)
  } else if (state.externalCouponPage < state.externalCouponPageCount) {
    // 内部券不足才查询外部券
    state.externalCouponPage = ++state.externalCouponPage
    getExternalCouponActivities(state.externalCouponPage)
  }
})
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
function getCouponList(page) {
  uni.showLoading({
    title: '加载中',
  })
  const that = this
  // 有内部券，查询内部券活动
  if (_data.hasInternalCoupon) {
    const storeId = state.currentStoreInfo.storeId
    const postData = {
      page,
      pageSize: state.pageSize,
      storeIdEquals: storeId,
      isOpen: '1',
    }
    couponService
      .getCouponActivitiesByFilter(postData)
      .then((res) => {
        uni.hideLoading()
        const tempList = []
        state.internalCouponPageCount = res.pageCount
        if (res.records && res.records.length > 0) {
          res.records.forEach((item) => {
            if (item.status === 'COMMIT') {
              let tempItem = {
                ...item,
                isExternal: false,
              }
              if (item.rate) {
                tempItem = {
                  ...tempItem,
                  rate: (item.rate * 10).toFixed(1),
                }
              }
              couponHandler.handleCouponFunction(tempItem)
              tempList.push(tempItem)
            }
          })
        }
        let tempCouponList = state.couponList
        tempCouponList = tempCouponList.concat(tempList)
        // if (that._data.hasExternalCoupon) {
        // } else {
        //   that.setData({
        //     couponList: tempCouponList
        //   })
        // }
        // 有外部券，查询外部券活动
        state.internalCouponList = tempCouponList
        state.couponList = tempCouponList
        console.log(page)
        console.log(state.internalCouponPageCount)
        if (_data.hasExternalCoupon && page >= state.internalCouponPageCount) {
          console.log('查询外部券')
          getExternalCouponActivities(state.externalCouponPage)
        }
      })
      .catch((err) => {
        uni.hideLoading()
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  }
}
function toCouponDetails(val) {
  const that = this
  const tempCouponList = state.couponList
  const currentId = val.detail.couponid
  let currentCoupon = null
  tempCouponList.forEach((item) => {
    if (item.id === currentId) {
      currentCoupon = item
    }
  })
  if (currentCoupon) {
    const isExternal = currentCoupon.isExternal
    if (!isExternal) {
      const opts = '?couponActivityId=' + currentCoupon.id + '&type=assign&isExternal=' + isExternal
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toCouponDetails(opts)
      } else {
        NAVPAGE.toAuthorize()
      }
    } else {
      const opts = '?couponActivityId=' + currentCoupon.id + '&type=assign&isExternal=' + isExternal
      NAVPAGE.toCouponDetails(opts)
    }
  }
}
function toHome() {
  NAVPAGE.toHome()
}
function getBannerList(storeId) {
  bannerService
    .getStoreBannerList('COUPON_ACTIVITY', storeId)
    .then((res) => {
      state.banners = res
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function toSelectStore() {
  NAVPAGE.toSelectStore()
}
function handleUserLogin() {
  console.log(app.globalData.userInfo)
  const that = this
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo
    state.userInfo = {
      ...user.wxaUser,
    }
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true
      state.isMember = true
    } else {
      // 不是会员跳转授权页
      state.userInfo = user.wxaUser
      state.hasUserInfo = true
      state.isMember = false
      NAVPAGE.toAuthorize()
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
  if (e.detail.bindMobile === true) {
    handlePopupPhone()
  }
}
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
function getExternalCouponActivities(page) {
  const that = this
  if (isQueryExternalCoupon) {
    console.log('已经在查询外部券了')
    return
  }
  isQueryExternalCoupon = true
  couponService
    .getExternalCouponActivities({
      page,
      pageSize: state.externalCouponPageSize,
      showCenter: true,
    })
    .then((res) => {
      // wx.hideLoading()
      let tempCouponList = state.couponList
      const tempList = []
      state.externalCouponPageCount = res.pageCount
      if (res.records && res.records.length > 0) {
        res.records.forEach((item) => {
          let tempItem = {
            ...item,
            isExternal: true,
          }
          if (item.rate) {
            tempItem = {
              ...tempItem,
              rate: (item.rate * 10).toFixed(1),
            }
          }
          couponHandler.handleCouponFunction(tempItem)
          tempList.push(tempItem)
        })
        console.log('外部券列表')
        console.log(tempList)
      }
      tempCouponList = tempCouponList.concat(tempList)
      state.couponList = tempCouponList
      isQueryExternalCoupon = false
    })
    .catch((e) => {
      isQueryExternalCoupon = false
      const tempCouponList = state.couponList.concat([])
      state.couponList = tempCouponList
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function bannerJumping(e) {
  const that = this
  const bannerId = e.currentTarget.dataset.id
  const bannerList = state.banners
  let advertisementInfo = null
  bannerList.forEach((item) => {
    if (item.id === bannerId) {
      advertisementInfo = item
    }
  })
  toAdPage(advertisementInfo, 'banner')
}
function toAdPage(pageInfo, pageType) {
  const that = this
  if (pageInfo.linkType === 'APP') {
    // 应用
    // 判断跳转模块
    if (pageInfo.appReturnType === 'PRODUCT_MENU') {
      // 跳转商品分类页面
      NAVPAGE.toCategory('?categoryId=' + pageInfo.productMenuId)
    } else if (pageInfo.appReturnType === 'MIAOSHA') {
      NAVPAGE.toSeckill()
    } else if (pageInfo.appReturnType === 'RECHARGE') {
      NAVPAGE.toRecharge()
    } else if (pageInfo.appReturnType === 'MEAL') {
      //  餐饮
    } else if (pageInfo.appReturnType === 'RECEIVECOUPON') {
      // 领券中心
      NAVPAGE.toCouponCenter()
    } else if (pageInfo.appReturnType === 'ADVANCE_SELL_PRODUCT') {
      // 预售商品
      if (pageInfo.activityId) {
        const opts =
          '?productId=' +
          pageInfo.productId +
          '&advanceId=' +
          pageInfo.activityId +
          '&type=advanceSell'
        NAVPAGE.toGoodsDetails(opts)
      } else {
        NAVPAGE.toAdvanceSell()
      }
    } else if (pageInfo.appReturnType === 'TEAM_BUYING') {
      // 团购
      NAVPAGE.toFightGroup()
    } else if (pageInfo.appReturnType === 'SCOREMALL') {
      // 积分商场
      NAVPAGE.toScoreMall()
    } else if (pageInfo.appReturnType === 'INVITE_MEMBER') {
      // 邀请好友
      NAVPAGE.toInvite()
    } else if (pageInfo.appReturnType === 'MEMBER_CARD') {
      // 会员卡
      // 如果首页开启付款码，则不到会员码页面，点击直接跳转付款码页面
      if (app.globalData.uiconfig.isHomePayCodeEnabled) {
        NAVPAGE.toPayCode()
      } else {
        NAVPAGE.toMemberCard()
      }
    } else if (pageInfo.appReturnType === 'MY_COUPON') {
      // 我的优惠券
      NAVPAGE.toMyCoupon()
    } else if (pageInfo.appReturnType === 'NEWMBR') {
      // 新用户专享
      NAVPAGE.toNewmbrActivity()
    } else if (pageInfo.appReturnType === 'GIFTCARD') {
      // 如果跳转类型是礼品卡，跳转到礼品卡界面
      NAVPAGE.toGiftCardCenter()
    } else if (pageInfo.appReturnType === 'HELP_COUPON') {
      // 助力送券
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        if (pageInfo.helpActivityId != null) {
          helpActivityService
            .getHelpActivityById(pageInfo.helpActivityId)
            .then((res) => {
              if (res.status === 'SUBMITED') {
                const opts = '?helpActivityId=' + pageInfo.helpActivityId
                NAVPAGE.toAssistanceCoupon(opts)
              } else if (res.status === 'FINISHED') {
                uni.showToast({
                  title: '您来晚了，助力活动已结束~',
                  icon: 'none',
                })
              } else if (res.status === 'CREATED') {
                uni.showToast({
                  title: '助力活动还没有开始哦~',
                  icon: 'none',
                })
              } else {
                uni.showToast({
                  title: '当前助力活动不在进行中~',
                  icon: 'none',
                })
              }
            })
            .catch((err) => {
              console.log('查询进行中的助力送券活动出错：' + err.message)
              uni.showToast({
                title: '当前没有正在进行中的活动哦~',
                icon: 'none',
              })
            })
        }
      } else {
        uni.showToast({
          title: '您还不是会员，请绑定手机号成为会员~',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(() => {
          NAVPAGE.toAuthorize()
        }, 2000)
      }
    } else if (pageInfo.appReturnType === 'CREDIT_CARD') {
      // 申请办卡
      NAVPAGE.toCreditCard()
    } else if (pageInfo.appReturnType === 'BARGAIN') {
      // 砍价模块
      NAVPAGE.toBargainList()
    } else if (pageInfo.appReturnType === 'PENNY') {
      // 购物抽奖
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toPennyList()
      } else {
        NAVPAGE.toAuthorize()
      }
    } else if (pageInfo.appReturnType === 'RECHARGE_DRAW') {
      // 充值抽奖
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toLotteryIndex()
      } else {
        NAVPAGE.toAuthorize()
      }
    } else if (pageInfo.appReturnType === 'NOTICE') {
      // 系统公告
      NAVPAGE.toSysNotice()
    } else if (pageInfo.appReturnType === 'SOLITAIRE') {
      NAVPAGE.toSolitaireList()
    } else if (pageInfo.appReturnType === 'PACKAGING') {
      // 打包一口价
      if (pageInfo.packagingId != null) {
        const opts = '?packagingId=' + pageInfo.packagingId
        NAVPAGE.toPackaging(opts)
      }
    } else if (pageInfo.pageUrl) {
      uni.navigateTo({
        url: pageInfo.pageUrl,
      })
    }
  } else if (pageInfo.linkType === 'FEEDBACK') {
    // 跳转意见反馈页面
    NAVPAGE.toFeedback()
  } else if (pageInfo.linkType === 'GRADPRODUCT') {
    // 秒杀商品
    const opts =
      '?productId=' +
      pageInfo.productId +
      '&storeId=' +
      app.globalData.storeInfo.id +
      '&activityId=' +
      pageInfo.grabActivityId +
      '&type=secondkill'
    NAVPAGE.toGoodsDetails(opts)
  } else if (pageInfo.linkType === 'PRODUCT') {
    // 商品
    const opts =
      '?productId=' +
      pageInfo.productId +
      '&storeId=' +
      app.globalData.storeInfo.id +
      '&type=normal'
    NAVPAGE.toGoodsDetails(opts)
  } else if (pageInfo.linkType === 'TEAMPRODUCT') {
    // 拼团商品
    const opts =
      '?productId=' +
      pageInfo.teamActivityId +
      '&storeId=' +
      app.globalData.storeInfo.id +
      '&type=group'
    NAVPAGE.toGoodsDetails(opts)
  } else if (pageInfo.linkType === 'GIFTCARDACTIVITYDETAILS') {
    // 如果跳转类型是礼品卡详情，根据giftcardActivityId跳转到礼品卡详情页
    const opts = '?giftCardActivityId=' + pageInfo.giftcardActivityId
    NAVPAGE.toGiftCardBuy(opts)
  } else if (pageInfo.linkType === 'COUPONACTIVITYDETAILS') {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        const opts =
          '?couponActivityId=' + pageInfo.couponActivityId + '&type=assign&isExternal=false'
        NAVPAGE.toCouponDetails(opts)
      } else {
        uni.showToast({
          title: '您还不是会员，请绑定手机号成为会员~',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(() => {
          NAVPAGE.toAuthorize()
        }, 2000)
      }
    } else {
      NAVPAGE.toAuthorize()
    }
  } else if (pageInfo.linkType === 'URL') {
    // 链接
    const url = pageInfo.linkUrl
    if (!url) {
      return false
    }
    const index = '?'
    let webUrl = url
    if (url.indexOf(index) > -1) {
      webUrl = webUrl + '&storeId=' + state.storeId + '&type=normal'
      if (app.globalData.TENANT && webUrl.indexOf('tenant') < 0) {
        webUrl = webUrl + '&tenant=' + app.globalData.TENANT
      }
    }
    const urlData = {
      url: encodeURIComponent(webUrl),
    }
    console.log(webUrl, urlData)
    const jsonUrl = JSON.stringify(urlData)
    const opts = '?webUrl=' + jsonUrl
    NAVPAGE.toAdvertising(opts)
  } else if (pageInfo.pageUrl) {
    uni.navigateTo({
      url: pageInfo.pageUrl,
    })
  } else {
  }
}
function handleCoupon(val) {
  const self = this
  const couponId = val.detail.couponid
  const couponList = state.couponList
  let currentCoupon = null
  couponList.forEach((item) => {
    if (couponId === item.id) {
      currentCoupon = item
    }
  })
  // 外部券没有库存
  if (currentCoupon.balance == null || currentCoupon.balance > 0) {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        if (!_data.hasAssign) {
          uni.showLoading({
            title: '领取中...',
          })
          _data.hasAssign = true // 标识状态为领取中
          // 判断当前用户是否已经点击了领券并且还没有返回领券结果
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
                couponAssign(currentCoupon)
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
        NAVPAGE.toAuthorize()
      }
    } else {
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
  state.activityId = coupon.id
  utils.setHideLoading(true)
  couponService
    .createCouponOrder(couponActivityId, serviceType, state.currentStoreInfo.storeId, coupon.score)
    .then((res) => {
      console.log(res)
      if (res.status === 'ACQUIRE') {
        _data.hasAssign = false
        utils.setHideLoading(false)
        uni.hideLoading()
        state.assignCoupon = coupon
        state.show = {
          middle: true,
        }
        bus.emit('userCouponChange', 'assign')
        // wx.showToast({
        //   title: '领券成功,稍后请到我的优惠券中查看~',
        //   icon: 'none',
        //   duration: 2000
        // })
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
        _data.hasAssign = false
        uni.showToast({
          title: res.acquireFailedReason,
          icon: 'none',
          duration: 2000,
        })
      }
    })
    .catch((e) => {
      _data.hasAssign = false
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function couponAssign(coupon) {
  const self = this
  const postData = {
    activityId: coupon.id,
  }
  state.activityId = coupon.id
  uni.showLoading({
    title: '领取中',
  })
  couponService
    .assign(postData)
    .then((res) => {
      _data.hasAssign = false
      uni.hideLoading()
      state.assignCoupon = coupon
      state.show = {
        middle: true,
      }
      bus.emit('userCouponChange', 'assign')
      // wx.showToast({
      //   title: '领券成功,稍后请到我的优惠券中查看~',
      //   icon: 'none',
      //   duration: 2000
      // })
    })
    .catch((e) => {
      _data.hasAssign = false
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
      _data.hasAssign = false
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
      _data.hasAssign = false
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
        self._data.hasAssign = false
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
        bus.emit('userCouponChange', 'assign')
        utils.showToast('领券成功,稍后请到我的优惠券中查看~')
        self._data.hasAssign = false
      } else if (result.status === 'ACQUIREFAILED') {
        utils.setHideLoading(false)
        uni.hideLoading()
        // 弹出支付超时
        self.setData({
          showTimeout: true,
        })
        self._data.hasAssign = false
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
        duration: 2000,
      })
    })
}
function catchCoupon() {
  console.log('catchCoupon')
}
function couponClick(e) {
  toCouponDetails(e)
}
function onGetUserInfo(e) {
  getUserInfo(e.detail)
}
function assign(e) {
  handleCoupon(e)
}
function handleClosePopup() {
  state.show = {
    middle: false,
  }
}
function handleUseNow() {
  const self = this
  couponService
    .queryByCouponActivityId(1, 10, state.activityId, state.currentStoreInfo.storeId)
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
        const opts =
          '?couponActivityId=' + state.activityId + '&couponName=' + state.assignCoupon.name
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
</script>
<style scoped>
/* pages/couponCenter/couponCenter.wxss */

page {
  background: #f1f0f5;
  position: relative;
  height: 100%;
  width: 100%;
}

.current-store-box {
  width: 480rpx;
  height: 60rpx;
  border-radius: 30rpx;
  overflow: hidden;
  margin: 0 auto;
  font-size: 24rpx;
  color: #444;
  background: #fff;
  text-align: center;
  line-height: 60rpx;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.current-store-box text {
  display: inline-block;
  width: 380rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.current-store-box image:first-of-type {
  width: 34rpx;
  height: 31rpx;
  margin: 0rpx;
  overflow: hidden;
  margin-right: 10rpx;
}

.current-store-box image:last-of-type {
  width: 10rpx;
  height: 16.7rpx;
  margin: 0rpx;
  overflow: hidden;
  margin-left: 10rpx;
}

.coupon-list {
  /* padding: 20rpx 8rpx 0 18rpx; */
  margin-bottom: 80rpx;
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
  height: 247rpx;
  margin-top: 40%;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: transparent;
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

/* banner */
.banner-box {
  width: 100%;
  padding: 0 40rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
}

.swiper {
  width: 100%;
  height: 360rpx;
}

.swiper-item {
  width: 100%;
  height: 360rpx;
  margin-right: 40rpx;
}

.banner-box image {
  width: 100%;
  height: 360rpx;
  display: block;
}

.bold {
  font-weight: bold;
}

.coupon-popup {
  position: relative;
  width: 680rpx;
  min-height: 600rpx;
  padding-top: 30rpx;
  /* box-sizing: border-box; */
  background-color: #fff;
  border-radius: 20rpx;
}

.coupon-popup .title {
  width: 100%;
  height: 40rpx;
  font-size: 36rpx;
  text-align: center;
  line-height: 40rpx;
  color: #333;
}

.coupon-item {
  width: 650rpx;
  /* height: 330rpx; */
  overflow: hidden;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 40rpx 0rpx 20rpx 0;
  font-size: 24rpx;
  color: #8b8b8c;
  position: relative;
  display: flex;
  flex-direction: column;
}

.coupon-item .coupon-bg {
  width: 650rpx;
  height: 338rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.coupon-item image.coupon-logo {
  width: 89rpx;
  height: 58rpx;
  margin-top: 10rpx;
  position: relative;
}

.coupon-item button {
  width: 160rpx;
  height: 60rpx;
  background: #ff762a;
  color: #fff;
  font-size: 26rpx;
  border: none;
  padding: 0rpx;
  line-height: 60rpx;
  position: absolute;
  right: 40rpx;
  bottom: 0rpx;
}

.use-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff7121;
  border-radius: 4rpx;
  width: 160rpx;
  height: 50rpx;
  color: #ff762a;
  font-size: 26rpx;
  color: #fff;
  padding: 0rpx;
  position: absolute;
  right: 40rpx;
  bottom: 0rpx;
  border: 2rpx solid #ff762a;
}

.coupon-item .sign-unable-btn {
  background: #e6e6e6;
}

.coupon-item .coupon-info {
  width: 450rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
}

.coupon-item .name {
  font-size: 32rpx;
  color: #454545;
  font-weight: bold;
  margin: 10rpx 0rpx 20rpx 0;
  position: relative;
}

.coupon-item .name text {
  color: #ff8561;
  font-size: 36rpx;
  font-style: oblique;
  margin: 0rpx 10rpx;
}

.coupon-item .coupon-bottom {
  position: absolute;
  bottom: 40rpx;
  left: 50rpx;
  width: 600rpx;
}

.coupon-item .coupon-bottom .remain-count {
  float: right;
}

.coupon-item .coupon-bottom .remain-count text {
  color: #ff8561;
}

.coupon-price {
  color: #ffbf00;
  font-size: 28rpx;
  line-height: 188rpx;
  width: 165rpx;
  text-align: center;
}

.coupon-price text {
  font-size: 48rpx;
  font-weight: bold;
}

.coupon-price.discount text {
  font-size: 36rpx;
}

.coupon-price.freeship text {
  font-size: 36rpx;
}

.main-coupon {
  position: relative;
  display: flex;
  background-color: white;
  width: auto;
  min-height: 185rpx;
  border-top-left-radius: 15rpx;
  border-top-right-radius: 15rpx;
  border-top: 2rpx solid #e5e5e5;
  border-left: 2rpx solid #e5e5e5;
  border-right: 2rpx solid #e5e5e5;
}

.main-coupon-code {
  position: absolute;
  right: 0;
  top: 0;
  width: 50rpx;
  height: 50rpx;
}

.main-coupon-code image {
  width: 50rpx;
  height: 50rpx;
}

.main-coupon-function {
  width: 232rpx;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 45rpx;
  font-weight: Medium;
  padding-top: 20rpx;
  font-family: SourceHanSansCN-Medium;
  /* padding-left: 24rpx;
  box-sizing: border-box;*/
}

.main-coupon-detail {
  width: 300rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20rpx 0rpx;
  justify-content: space-around;
  color: #666666;
}

.main-coupon-detail-title {
  font-size: 32rpx;
  color: #3e3e3e;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.mini-function {
  font-size: 20rpx;
  background-color: #ededed;
  width: 80rpx;
  height: 30rpx;
  border-radius: 15rpx;
  color: #999999;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
}

.coupon-seperator {
  width: 99%;
}

.coupon-time-expand-board {
  width: auto;
  display: flex;
  justify-content: space-between;
  background-color: white;
  padding: 10rpx 20rpx;
  border-bottom: 2rpx solid #e5e5e5;
  border-left: 2rpx solid #e5e5e5;
  border-right: 2rpx solid #e5e5e5;
  border-radius: 0 0 15rpx 15rpx;
}

.coupon-time-baord {
  display: flex;
}

.coupon-time-icon {
  width: 20rpx;
  height: 20rpx;
}

.coupon-time-label {
  font-size: 22rpx;
  color: #666666;
}

.coupon-rule-btn {
  width: 100rpx;
  height: 30rpx;
  font-size: 26rpx;
}

.coupon-head-info {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
}

.coupon-popup .message {
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 34rpx;
  color: #333;
}

.coupon-popup .buttom-botton {
  position: absolute;
  width: 100%;
  height: 100rpx;
  bottom: -2rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 34rpx;
  font-weight: 500;
  border-top: 2rpx solid #e5e5e5;
  box-sizing: border-box;
}

.coupon-popup .buttom-botton .botton-left {
  width: 50%;
  background-color: #fff;
  text-align: center;
  line-height: 100rpx;
  border-radius: 0 0 0 20rpx;
}

.coupon-popup .buttom-botton .botton-right {
  width: 50%;
  background-color: #fff;
  text-align: center;
  line-height: 100rpx;
  color: #fff;
  border-radius: 0 0 20rpx 0;
}
</style>
