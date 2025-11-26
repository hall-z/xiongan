<template>
  <!--pages/mallModule/bargain/bargainDetails/bargainDetails.wxml-->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view
    class="top-bg"
    :style="'background-image: url(' + state.imagesPath.barga_bg + ');background-size: cover'"
  ></view>
  <view class="top-info">
    <view class="bargain-rule" @click="toggleBargainRulesPopup">砍价规则</view>
    <view class="prompt">您正在发起砍价</view>
    <view class="process">
      <image :src="state.imagesPath.barga_tip" mode=""></image>
      <!-- <text>发起砍价</text>>
    <text>邀请好友帮砍</text>>
    <text>砍至任意价均可购买</text> -->
    </view>
    <view class="goods_box">
      <bargain-goods
        :balance="balance"
        :bargain-data="state.bargainActivity"
        @click="toGoodsDetails"
      ></bargain-goods>
      <view class="button-box">
        <button v-if="!state.hasUserInfo" class="bargain-button" @click="getUserInfo">
          发起砍价
        </button>
        <button v-else class="bargain-button" :disabled="!state.canBargain" @click="openGoodsSpecs">
          发起砍价
        </button>
      </view>
    </view>
  </view>
  <view class="shipping-method">
    <view class="title">配送方式</view>
    <view class="type-check-box">
      <view v-for="(item, index) in state.shipmentSortList" :key="index">
        <view
          class="self-take"
          :style="
            (state.type == 'selftake' ? state.theme.mainColor + state.theme.borderColor : '') +
            ' ' +
            (state.optionalShipmentType[item] == false ? 'opacity:0.3;background-color: #eee' : '')
          "
          data-type="selftake"
          @click="optionalShipmentType[item] == false ? 'handleTips' : 'handleClick'"
          v-if="item == 'SELF'"
        >
          <!-- <view class="self-take" style="{{type=='selftake'?theme.mainColor + theme.borderColor :''}}" data-type="selftake" bindtap="handleClick" wx:if="{{canSelfmention && item == 'SELF'}}"> -->
          <image v-if="state.type != 'selftake'" :src="state.imagesPath.iconOrderSelfTake"></image>
          <image
            v-if="state.type == 'selftake'"
            :src="state.imagesPath.iconOrderSelfTakeActive"
          ></image>
          <text>到店自提</text>
        </view>
        <!-- <view class="dispatch" style="{{state.type == 'dispatch' ? state.theme.mainColor + state.theme.borderColor : ''}} {{state.optionalShipmentType[item] == false ? 'opacity:0.3;background-color: #eee' : ''}}" data-type="dispatch" bindtap="{{state.optionalShipmentType[item] == false ? 'handleTips' : 'handleClick'}}" wx:if="{{item == 'EXPRESS'}}">
        <image wx:if="{{state.type != 'dispatch'}}" src="{{state.imagesPath.iconOrderTakeout}}" ></image>
        <image wx:if="{{state.type == 'dispatch'}}" src="{{state.imagesPath.iconOrderTakeoutActive}}" ></image>
        <text>{{state.isDistributionOrder ? "快递配送" : "外卖配送"}}</text>
      </view>
      <view class="dispatch" style="{{state.type == 'logistical' ? state.theme.mainColor + state.theme.borderColor : ''}} {{state.optionalShipmentType[item] == false ? 'opacity:0.3;background-color: #eee' : ''}}" data-type="logistical" bindtap="{{state.optionalShipmentType[item] == false ? 'handleTips' : 'handleClick'}}" wx:if="{{item == 'LOGISTICAL'}}">
        <image wx:if="{{state.type != 'logistical'}}" src="{{state.imagesPath.iconOrderDistribution}}" ></image>
        <image wx:if="{{state.type == 'logistical'}}" src="{{state.imagesPath.iconOrderDistributionActive}}" ></image>
        <text>快递配送</text>
      </view> -->
      </view>
    </view>
    <view class="selftake-box" :hidden="state.type === 'dispatch' || state.type === 'logistical'">
      <picker
        mode="multiSelector"
        @change="bindMultiPickerChange"
        @columnchange="bindMultiPickerColumnChange"
        :value="state.multiIndex"
        :range="state.multiArray"
      >
        <view class="select-item picker time-picker">
          <view>
            <image class="left-icon" :src="state.imagesPath.iconBargainTime"></image>
            <text class="color-454545">选择自提时间</text>
          </view>
          <view class="color-009F55">
            {{ selfTimeDate }} {{ state.multiArray[1][state.multiIndex[1]] }}
            <image class="right-point" :src="state.imagesPath.iconBargainRight"></image>
          </view>
        </view>
      </picker>
      <view class="select-item select-store" @click="toSelectStore">
        <view>
          <image class="left-icon" :src="state.imagesPath.iconBargainStore"></image>
          <text class="color-454545">提货门店</text>
        </view>
        <view style="color: #ff7103">
          {{ state.storeInfo.name }}
          <image class="right-point" :src="state.imagesPath.iconBargainRight"></image>
        </view>
      </view>
    </view>
    <view class="dispatch-box" :hidden="state.type === 'selftake'">
      <view class="select-item select-address" @click="toChooseAddress">
        <view>
          <!-- <image class='left-icon' src='{{imagesPath.iconBargainPosition}}'></image> -->
          <view class="receive-info">
            <view class="name-mobile" :hidden="state.addressInfo">
              <text>{{ state.addressInfo.contacts }}</text>
              <text>{{ state.addressInfo.contactsMobile }}</text>
            </view>
            <view class="receive-address" :hidden="state.addressInfo">
              {{
                state.addressInfo.province +
                state.addressInfo.city +
                state.addressInfo.county +
                state.addressInfo.detailedAddress +
                state.addressInfo.houseNum
              }}
            </view>
            <view class="no-address" :hidden="state.addressInfo">请选择收货地址</view>
          </view>
        </view>
        <view>
          <image class="right-point" :src="state.imagesPath.iconRight1"></image>
        </view>
      </view>
      <view class="select-item select-store" @click="toSelectStore">
        <view>
          <!-- <image class='left-icon' src='{{imagesPath.iconBargainStore}}'></image> -->
          <text class="color-454545">配送门店</text>
        </view>
        <view style="color: #ff7103">
          {{ state.storeInfo.name }}
          <image
            v-if="state.distributionStoreId"
            class="right-point"
            :src="state.imagesPath.iconBargainRight"
          ></image>
        </view>
      </view>
    </view>
  </view>
  <popup
    :show="state.show.middle"
    position="middle"
    custom-class="middle"
    @close="toggleBargainPopup"
  >
    <view class="popup-bargain">
      <view class="popup-bargain-box">
        <text class="title">太给力了,你帮自己</text>
        <view>
          砍掉了
          <text class="price">￥{{ state.selfBargainAmount }}</text>
        </view>
        <image class="popup-image" :src="state.imagesPath.iconBargaining" mode="widthFix"></image>
      </view>
    </view>
  </popup>
  <popup
    :show="state.show.goodsSpec"
    position="bottom"
    custom-class="bottom"
    @close="toggleGoodsSpecPopup"
  >
    <goods-spec
      :specs="state.specs"
      :specDetails="state.specDetails"
      activity-type="bargain"
      :hasSelected="state.hasSelected"
      @close="toggleGoodsSpecPopup"
      :goodsImg="goodsImg"
      :price="sellPrice"
      @confirm="confirmSpecs"
    ></goods-spec>
  </popup>
  <popup
    :show="state.show.rule"
    position="middle"
    custom-class="middle"
    @close="toggleBargainRulesPopup"
  >
    <view class="bargain-rules-popup">
      <view class="title">砍价规则</view>
      <view class="close">
        <image :src="state.imagesPath.iconBargainClose" @click="toggleBargainRulesPopup"></image>
      </view>
      <text>
        1、用户选择自提或配送后才能发起砍价活动，如选择的配送且送货地址不在配送范围内，则不能发起砍价；
      </text>
      <text>2、邀请好友砍价，砍到任意价格均可下单购买，最低可以砍到底价购买；</text>
      <text>3、每次砍价后只有一次下单机会，不能重复下单；</text>
      <text>
        4、用户需要在活动有效期内（砍价页面有活动倒计时）砍价并进行购买，活动结束后不能砍价或下单，如果砍价有效期结束未购买，则砍价失败，在活动时间内可重新发起砍价；
      </text>
      <text>
        5、每个用户每个砍价商品同一时间段只能发起一次，每天最多可以助力砍价活动三次，对同一用户发起的单次活动只能助力一次；
      </text>
      <text>6、砍价起点价格取门店商品的售价；</text>
      <text>7、若砍价商品已被砍完，所有正在进行中的砍价活动自动失效。</text>
    </view>
  </popup>
  <authorize @login="handleUserLogin"></authorize>
  <image
    class="movable-view"
    v-if="state.homeBack"
    :src="state.imagesPath.toHome"
    @click="toHome"
  ></image>
</template>
<script setup>
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiDistributionServiceJs from '@/service/api/newretail/distributionService'
import _apiAddressServiceJs from '@/service/api/newretail/addressService'
import _apiBargainServiceJs from '@/service/api/newretail/bargainService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bargainGoods from '@/pages-sub/newretail/components/bargain/bargain-goods/bargain-goods.vue';
import goodsSpec from '@/pages-sub/newretail/components/product/goods-spec/goods-spec.vue';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
const app = getApp()

// pages/mallModule/bargain/bargainDetails/bargainDetails.js
const bargainService = _apiBargainServiceJs
const addressService = _apiAddressServiceJs
const distributionService = _apiDistributionServiceJs
const productService = _apiProductServiceJs
const storeService = _apiStoreServiceJs
const IMGAGESPATH = _utilsImagesPathJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
const ANALYSIS = _utilsAnalysisJs
const THEME = _utilsThemeManagerJs
const AUTHORIZE = _utilsAuthorizeJs
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
  optionalShipmentType: {
    SELF: true,
    EXPRESS: true,
    LOGISTICAL: true,
  },
  navigationBarTitle: '砍价进度',
  imagesPath: IMGAGESPATH,
  theme: THEME,
  type: 'selftake',
  shipmentSortList: ['SELF', 'EXPRESS', 'LOGISTICAL'],
  canSelfmention: true,
  canDelivery: true,
  date: '2016-09-01',
  time: '12:01',
  multiArray: [
    ['2018-06-01', '2018-06-02', '2018-06-03'],
    ['6:00-9:00', '9:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'],
  ],
  multiIndex: [0, 0],
  addressInfo: '',
  // 收货地址信息
  isDistributionOrder: false,
  // 是否统配订单
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    goodsSpec: false,
    rule: false,
  },
  storeInfo: {},
  storeId: '',
  productId: '',
  // 选择的商品id，可能是多规格商品子商品id
  specs: [],
  specDetails: [],
  hasSelected: false,
  bargainActivity: null,
  // 砍价活动信息
  canBargain: false,
  // 是否可以砍价
  hasUserInfo: false,
  isMember: false,
  selfBargainAmount: '0.00',
  // 自砍金额
  instance: null,
  // 砍价实例
  themeColor: THEME.color,
  distributionStoreId: uni.getStorageSync('distributionStoreId'),
  homeBack: false,
})
const localData = {
  shipmentTypes: 'EXPRESS',
}
function initPage() {
  const self = this
  // this.handleDeliveryType()
  state.storeId = app.globalData.storeInfo.id
  state.storeInfo = app.globalData.storeInfo
  if (options.scene) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(options.scene)
    const sceneArr = scene.split(',')
    options.barginId = sceneArr[0]
    getBargainDetails(options.barginId, state.storeId)
    // 分享信息打开统计 扫码默认为分享
    ANALYSIS.ShareOpenAnalysis()
  }
  if (options.barginId) {
    getBargainDetails(options.barginId, state.storeId)
  }
  // 处理自提时间段
  initializationTime()
}
onLoad(function (options) {
  const self = this
  bargainQueryEnd = false
  queryCount = 0
  canCreateBargain = true
  const pageStack = getCurrentPages()
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
  if (pageStack.length === 1) {
    state.homeBack = true
  }
  // 查询配置项获取订单预约时间和订单自提开始时间和预约时间间隔
  const systemOptions = app.globalData.configureInfo
  const configures = {
    orderChooseDateAllowDays: 3,
    orderChooseDateInterval: 10800000,
    daysOfSelfTimeDelay: 0,
  }
  systemOptions.forEach((item) => {
    // 遍历配置项，获取订单预约时间和订单自提开始时间
    if (item.key === 'orderChooseDateAllowDays' && item.value != null && item.value !== '') {
      // 订单预约可以预约几天 （单位 天）
      configures.orderChooseDateAllowDays = parseInt(item.value)
    } else if (item.key === 'orderChooseDateInterval' && item.value != null && item.value !== '') {
      // 订单预约时间的间隔 （单位 毫秒）
      configures.orderChooseDateInterval = parseInt(item.value) * 1000
    } else if (item.key === 'daysOfSelfTimeDelay' && item.value != null && item.value !== '') {
      configures.daysOfSelfTimeDelay = parseInt(item.value)
    }
  })
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  state.systemOptions = configures
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
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
  if (app.globalData.storeInfo && app.globalData.storeInfo.id !== state.storeId) {
    if (state.distributionStoreId === '') {
      state.storeId = app.globalData.storeInfo.id
      state.storeInfo = app.globalData.storeInfo
      initPage() // 初始化页面内容
      // this.handleDeliveryType()
      // 处理自提时间段
      initializationTime()
    }
  }
  if (state.type === 'dispatch' || state.type === 'logistical') {
    // 检查配送距离
    console.log('检查配送距离')
    checkDistribution()
  }
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member
      state.isMember = true
    }
    state.hasUserInfo = true
  }
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {
  const self = this
  const sharePictures = state.sharePictures
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  let memberId = null
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    memberId = app.globalData.userInfo.member.id
  }
  const pages = getCurrentPages() // 获取加载的页面
  const currentPage = pages[pages.length - 1] // 获取当前页面的对象
  const url = currentPage.route // 当前页面url
  const options = currentPage.options // 如果要获取url中所带的参数可以查看options
  let path = url + '?storeId=' + state.storeId
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      const ele = options[key]
      if (key !== 'storeId' && key !== 'shareId') {
        path = path + '&' + key + '=' + ele
      }
    }
  }
  if (memberId) {
    path = path + '&shareId=' + memberId
  }
  return {
    title: '',
    path,
    imageUrl: sharePictures,
    success(e) {},
  }
})
function getBargainDetails(barginId, storeId) {
  const self = this
  bargainQueryEnd = false
  let availableStockAmount = 0
  bargainService
    .getDetails(barginId, storeId)
    .then((res) => {
      if (!res) {
        bargainQueryEnd = true
        return
      }
      availableStockAmount = res.availableStockAmount
      const bargainActivity = {
        availableStockAmount: res.availableStockAmount,
        barginAmountType: res.barginAmountType,
        barginMemeberCount: res.barginMemeberCount,
        createTime: res.createTime,
        creatorId: res.creatorId,
        description: res.description,
        duration: res.duration,
        endDate: res.endDate,
        id: res.id,
        imageUrl: res.imageUrl,
        lowerPrice: res.lowerPrice,
        name: res.name,
        originalPrice: res.originalPrice,
        price: res.price,
        productId: res.productId,
        productImage: res.productImage,
        productName: res.productName,
        productStyle: res.productStyle,
        startDate: res.startDate,
        status: res.status,
        totalStockAmount: res.totalStockAmount,
        children: res.children ? res.children : [],
      }
      if (res.productStyle === 'SPEC_PARENT' || res.productStyle === 'SPEC_CHILD') {
        getGoodsSpec(res.productId, storeId, bargainActivity.children)
      }
      state.productId = res.productId
      state.bargainActivity = bargainActivity
      state.sharePictures = res.shareUrl ? res.shareUrl : res.productImage
      return productService.getDetails(storeId, res.productId)
    })
    .then((res) => {
      if (!res) {
        bargainQueryEnd = true
        return
      }

      //   设置配送方式为商品的配送方式
      state.bargainActivity.business = res.business
      state.bargainActivity.shipmentTypes = res.shipmentType
      // 判断统配商品
      state.bargainActivity = state.bargainActivity
      if (res.business === 'DISTRIBUTION') {
        if (app.globalData.distributionStore) {
          const store = app.globalData.distributionStore
          // 检查配送距离
          state.distributionStoreId = store.id
          state.storeId = store.id
          state.isDistributionOrder = true
          state.storeInfo = store
          state.type = 'dispatch'
          console.log('检查配送距离')
          checkDistribution()
          // 重新设置配送方式
          handleDeliveryType()
          getDistributionStoreProductDetails(store.id, state.productId)
        } else {
          storeService.getDistributionStore().then((res) => {
            if (res) {
              // 检查配送距离
              state.distributionStoreId = res.id
              state.storeId = res.id
              state.isDistributionOrder = true
              state.storeInfo = res
              state.type = 'dispatch'
              console.log('检查配送距离')
              checkDistribution()
              // 重新设置配送方式
              handleDeliveryType()
              getDistributionStoreProductDetails(res.id, state.productId)
            }
          })
        }
        function getDistributionStoreProductDetails(storeId, productId) {
          productService
            .getDetails(storeId, productId)
            .then((res) => {
              if (res) {
                if (res.style === 'SPEC_PARENT' || res.style === 'SPEC_CHILD') {
                  getGoodsSpec(res.id, state.distributionStoreId, state.bargainActivity.children)
                }
                const balance =
                  res.balance > availableStockAmount ? availableStockAmount : res.balance
                state.balance = balance > 0 ? balance : 0
                state.canBargain = true
                state.storeBalance = res.balance
                state.availableStockAmount = availableStockAmount
              }
              bargainQueryEnd = true
            })
            .catch((err) => {
              console.log(err)
              bargainQueryEnd = true
            })
        }
      } else {
        const balance = res.balance > availableStockAmount ? availableStockAmount : res.balance
        state.balance = balance > 0 ? balance : 0
        state.canBargain = true
        bargainQueryEnd = true

        // console.log(balance,'balance111')
      }
      handleDeliveryType()
    })
    .catch((err) => {
      bargainQueryEnd = true
      if (err.code === 16015) {
        //   console.log(self.queryCount,'self.queryCount')
        if (queryCount === 0) {
          queryCount = 1
          ADDRESS.getDistributionStore().then((res) => {
            //   console.log('getDistributionStore',res)
            if (res) {
              getBargainDetails(barginId, res.id)
            }
          })
        } else {
          util.showToast(err.message)
        }
      } else {
        util.showToast(err.message)
      }
    })
}
function handleTips(val) {
  let tipsFont = '该订单不支持'
  if (val.currentTarget.dataset.type === 'selftake') {
    tipsFont += '到店自提'
  } else if (val.currentTarget.dataset.type === 'dispatch') {
    tipsFont += '外卖配送'
  } else {
    tipsFont += '快递配送'
  }
  uni.showToast({
    title: tipsFont,
    icon: 'none',
    duration: 2000,
  })
}
function handleClick(val) {
  if (!bargainQueryEnd) {
    console.log('砍价活动查询未结束')
    return
  }
  const shipmentTypes = state.storeInfo.shipmentTypes
  if (
    val.currentTarget.dataset.type === 'dispatch' ||
    val.currentTarget.dataset.type === 'logistical'
  ) {
    const type = val.currentTarget.dataset.type
    state.type = type
    if (shipmentTypes.indexOf('EXPRESS') >= 0 || shipmentTypes.indexOf('LOGISTICAL') >= 0) {
      checkDistribution()
    } else {
      uni.showToast({
        title: '该门店暂不支持配送~',
        icon: 'none',
        duration: 2000,
      })
    }
  } else {
    if (!state.isDistributionOrder) {
      state.canBargain = true
      state.type = 'selftake'
    }
  }
}
function initializationTime() {
  const self = this
  const configure = state.systemOptions // 获取订单相关的系统配置
  const now = new util.ResponseDate()
  const daysNumber = configure.orderChooseDateAllowDays // 订单预约可以预约几天 （单位 天）
  const orderAppointmentDate = configure.daysOfSelfTimeDelay // 订单预约限定下单后第几天开始
  console.log('订单预约限定下单后第几天开始：', orderAppointmentDate)
  const newAppointmentDate = addDay(now, orderAppointmentDate) // 新的订单预约开始日期
  const tempTime = [[], []]
  console.log('订单预约开始时间：', util.formatTime(newAppointmentDate).replace(/\//g, '-'))
  for (let i = 0; i < daysNumber; i++) {
    const date = addDay(newAppointmentDate, i)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const newDate = [year, month, day].map(util.timeFormat).join('-')
    tempTime[0].push(newDate)
  }
  tempTime[1] = handleChooseTime()
  // 特别的处理日期显示
  state.multiArray = tempTime
  const days = state.multiArray[0][state.multiIndex[0]]
  const daysArr = days.split('-')
  const date = daysArr[1] + '月' + daysArr[2] + '日'
  const selfTimeDate = date
  state.selfTimeDate = selfTimeDate
}
function handleChooseTime() {
  const self = this
  const now = new util.ResponseDate()
  let hour = now.getHours() // 小时数
  const minute = now.getMinutes() // 分钟数
  let time = [hour, minute].map(util.timeFormat).join(':')
  const configure = state.systemOptions // 获取订单相关的系统配置
  const orderAppointmentDate = configure.daysOfSelfTimeDelay // 订单预约限定下单后第几天开始
  let storeTime = '00:00-23:59'
  let tempTime = []
  let businessHours = []
  // 处理经营时间
  if (state.storeInfo && state.storeInfo.storeHours && state.storeInfo.storeHours !== '') {
    storeTime = state.storeInfo.storeHours.split('-')
  }
  const tempStart = storeTime[0] + ':00'
  const tempEnd = storeTime[1] + ':00'
  let date = util.formatTime(now).split(' ')[0]
  let nowTime = new Date(util.formatTime(now)).getTime()
  if (state.type === 'selftake' && orderAppointmentDate > 0) {
    const storeHours = storeTime[0].slice(0, 2)
    hour = Number(storeHours)
    time = storeTime[0]
    const newDate = addDay(now, orderAppointmentDate)
    const year = newDate.getFullYear()
    const month = newDate.getMonth() + 1
    const day = newDate.getDate()
    date = [year, month, day].map(util.timeFormat).join('/')
    const newTime = date + ' ' + tempStart
    nowTime = new Date(newTime).getTime()
  }
  const startTimeDetails = new Date(date + ' ' + tempStart).getTime()
  const endTimeDetails = new Date(date + ' ' + tempEnd).getTime()
  businessHours = splitTime(
    date,
    date,
    state.systemOptions.orderChooseDateInterval,
    tempStart,
    tempEnd,
  )
  const hourArray = [] // 营业时间小时数组
  businessHours.forEach((ele) => {
    hourArray.push(ele.slice(0, 2))
  })
  const hourArrayLength = hourArray.length
  const chooseTime = [[], []]
  for (let j = 0; j < businessHours.length - 1; j++) {
    const eleStart = businessHours[j]
    const eleEnd = businessHours[j + 1]
    const tempData = eleStart + '-' + eleEnd
    chooseTime[0].push(tempData)
  }
  for (let i = 0; i < hourArrayLength; i++) {
    if (hour >= hourArray[i] && hour < hourArray[i + 1]) {
      chooseTime[1].push(time + '-' + businessHours[i + 1])
      for (let k = i + 1; k < businessHours.length - 1; k++) {
        const eleStart = businessHours[k]
        const eleEnd = businessHours[k + 1]
        const tempData = eleStart + '-' + eleEnd
        chooseTime[1].push(tempData)
      }
    } else if (hour == hourArray[hourArrayLength - 1]) {
      const now = util.timestampToTime(nowTime)
      const end = util.timestampToTime(endTimeDetails)
      const start = now.split(' ')[1].slice(0, 5)
      const endTime = end.split(' ')[1].slice(0, 5)
      const tempData = start + '-' + endTime
      if (chooseTime[1].length > 0) {
        let hasTime = false
        chooseTime[1].forEach((it) => {
          if (it === tempData) {
            hasTime = true
          }
        })
        if (!hasTime) {
          chooseTime[1].push(tempData)
        }
      } else {
        chooseTime[1].push(tempData)
      }
    }
  }
  state.chooseTime = chooseTime
  state.storeTime = storeTime
  console.log(chooseTime)
  // 小时
  if (nowTime <= startTimeDetails) {
    tempTime = chooseTime[0]
  } else if (nowTime > startTimeDetails && nowTime < endTimeDetails) {
    tempTime = chooseTime[1]
  } else {
    if (state.multiIndex[0] === 0) {
      tempTime = ['无法预约自提时间']
      state.chooseTime[1] = tempTime
    } else {
      tempTime = chooseTime[0]
    }
  }
  return tempTime
}
function splitTime(startDate, endDate, amount, timeStart, timeEnd) {
  const startTime = new Date(startDate + ' ' + timeStart)
  const endTime = new Date(endDate + ' ' + timeEnd)
  const gap = amount
  const count = Math.ceil((endTime - startTime) / gap)
  const realCount = (endTime - startTime) / gap
  const temp = []
  let tempTime = []
  if (count - realCount >= 0) {
    temp.push(util.formatTime(startTime))
    for (let i = 1; i < count; i++) {
      startTime.setMilliseconds(startTime.getMilliseconds() + gap)
      temp[i] = util.formatTime(new Date(startTime.getTime()))
    }
    temp.push(util.formatTime(endTime))
  } else {
    temp.push(util.formatTime(startTime))
    for (let i = 1; i < count; i++) {
      startTime.setMilliseconds(startTime.getMilliseconds() + gap)
      temp[i] = util.formatTime(new Date(startTime.getTime()))
    }
  }
  temp.forEach((item) => {
    const tempData = item.split(' ')[1].slice(0, 5)
    tempTime.push(tempData)
  })
  tempTime = Array.from(new Set(tempTime))
  return tempTime
}
function addDay(curDate, days) {
  return new Date((curDate / 1000 + 86400 * days) * 1000)
}
function bindMultiPickerChange(e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  state.multiIndex = e.detail.value
}
function bindMultiPickerColumnChange(e) {
  console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
  const _data = {
    multiArray: state.multiArray,
    multiIndex: state.multiIndex,
  }
  _data.multiIndex[e.detail.column] = e.detail.value
  const now = new util.ResponseDate()
  const tempStart = state.storeTime[0] + ':00'
  const tempEnd = state.storeTime[1] + ':00'
  const date = util.formatTime(now).split(' ')[0]
  const startTimeDetails = new Date(date + ' ' + tempStart).getTime()
  const endTimeDetails = new Date(date + ' ' + tempEnd).getTime()
  const nowTime = new Date(util.formatTime(now)).getTime()
  switch (_data.multiIndex[0]) {
    case 0:
      if (nowTime > startTimeDetails) {
        _data.multiArray[1] = state.chooseTime[1]
      } else {
        _data.multiArray[1] = state.chooseTime[0]
      }
      break
    case 1:
      _data.multiArray[1] = state.chooseTime[0]
      break
    case 2:
      _data.multiArray[1] = state.chooseTime[0]
      break
  }
  if (
    _data.multiArray[1][0] === '请选择其他时间' ||
    _data.multiArray[1][0] === '不能下单' ||
    _data.multiArray[1][0] === '无法预约自提时间'
  ) {
    state.canBargain = false
  } else {
    state.canBargain = true
  }
  if (e.detail.column == 0) {
    // 特别的处理日期在完善订单页面的显示
    const days = _data.multiArray[0][_data.multiIndex[0]]
    const daysArr = days.split('-')
    const date = daysArr[1] + '月' + daysArr[2] + '日'
    const selfTimeDate = date
    state.selfTimeDate = selfTimeDate
  }
  Object.assign(state, _data)
}
function toSelectStore() {
  if (state.distributionStoreId === '') {
    NAVPAGE.toSelectStore()
  }
}
function toChooseAddress() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const opts = '?from=perfectOrder'
    NAVPAGE.toAddressList(opts)
  } else {
    NAVPAGE.toAuthorize()
  }
}
function checkDistribution() {
  const that = this
  try {
    const value = uni.getStorageSync('wj_chooseAddressInfo')
    if (value) {
      // 缓存中有默认地址
      console.log('缓存中有默认地址')
      state.addressInfo = value
      calcDistance(value)
    } else {
      // 缓存中没有默认地址
      if (state.addressInfo == '') {
        // 当前没有选择地址
        addressService
          .getDefaultAddress()
          .then((res) => {
            if (res) {
              // 有默认地址
              state.addressInfo = res
              uni.setStorage({
                key: 'wj_chooseAddressInfo',
                data: res,
              })
              calcDistance(res)
            } else {
              // 无默认地址
              uni.getLocation({
                type: 'gcj02',
                success: function (res) {
                  const latitude = res.latitude
                  const longitude = res.longitude
                  // 查询所有地址
                  addressService
                    .query()
                    .then((result) => {
                      console.log(result)
                      if (result.length > 0) {
                        const allAddress = result
                        const tempIndex = getNearestAddress(allAddress, latitude, longitude)
                        uni.setStorage({
                          key: 'wj_chooseAddressInfo',
                          data: allAddress[tempIndex],
                        })
                        state.addressInfo = allAddress[tempIndex]
                        calcDistance(allAddress[tempIndex])
                      } else {
                        uni.showToast({
                          title: '请选择收货地址~',
                          icon: 'none',
                          duration: 2000,
                        })
                      }
                    })
                    .catch((err) => {
                      uni.showToast({
                        title: err.message,
                        icon: 'none',
                        duration: 2000,
                      })
                    })
                },
              })
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
        // 当前选择了地址
        // 查询所有地址
        addressService
          .query()
          .then((result) => {
            if (result.length > 0) {
              uni.getLocation({
                type: 'gcj02',
                success: function (res) {
                  const latitude = res.latitude
                  const longitude = res.longitude
                  const allAddress = result
                  const tempIndex = getNearestAddress(allAddress, latitude, longitude)
                  // 缓存最近的地址
                  uni.setStorage({
                    key: 'wj_chooseAddressInfo',
                    data: allAddress[tempIndex],
                  })
                  state.addressInfo = allAddress[tempIndex]
                  calcDistance(allAddress[tempIndex])
                },
              })
            } else {
              state.addressInfo = ''
              uni.showToast({
                title: '请选择收货地址~',
                icon: 'none',
                duration: 2000,
              })
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
    }
  } catch (error) {
    uni.showToast({
      title: error.message,
      icon: 'none',
      duration: 2000,
    })
  }
}
function getNearestAddress(allAddress, latitude, longitude) {
  const distanceArr = []
  allAddress.forEach((item) => {
    const dis = util.distance(latitude, longitude, item.latitude, item.longitude)
    distanceArr.push(dis)
  })
  // 计算最小值
  const minN = Math.min.apply(Math, distanceArr)
  let tempIndex = 0
  for (let i = 0; i < distanceArr.length; i++) {
    if (minN === distanceArr[i]) {
      tempIndex = i
      break
    }
  }
  return tempIndex
}
function calcDistance(chooseAddress) {
  const self = this
  const type = state.type
  let shipmentType = 'EXPRESS'
  if (type === 'dispatch') {
    shipmentType = 'EXPRESS'
  } else if (type === 'logistical') {
    shipmentType = 'LOGISTICAL'
  }
  // 获得用户的骑行距离
  // var cyclingDistance = util.calculateDistance(chooseAddress.latitude, chooseAddress.longitude, self.data.storeInfo.latitude, self.data.storeInfo.longitude)
  const cyclingDistance = util.getTripDist(
    chooseAddress.longitude,
    chooseAddress.latitude,
    state.storeInfo.longitude,
    state.storeInfo.latitude,
    self,
  )
  cyclingDistance
    .then((res) => {
      const distance = res.distance
        ? (res.distance * 1000).toFixed(2)
        : res.data.result.routes['0'].distance.toFixed(2)
      return distance
    })
    .then((distance) => {
      state.distance = distance
      const address =
        chooseAddress.province +
        chooseAddress.city +
        chooseAddress.county +
        chooseAddress.detailedAddress +
        chooseAddress.houseNum
      const postData = {
        address,
        distance: Number(distance),
        latitude: chooseAddress.latitude,
        longitude: chooseAddress.longitude,
        positionSource: 1,
        storeId: state.storeId,
        shipmentType,
      }
      distributionService
        .check(postData)
        .then((res) => {
          if (res || state.isDistributionOrder) {
            state.canBargain = true
          } else {
            uni.showToast({
              title: '未在配送范围内~',
              icon: 'none',
              duration: 2000,
            })
            state.canBargain = false
          }
        })
        .catch((err) => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
          if (!state.isDistributionOrder) {
            state.canBargain = false
          } else {
            state.canBargain = true
          }
        })
    })
    .catch((err) => {
      //   util.showToast("当前门店地理位置有问题，导致无法下单，请联系门店人员解决")
      //   self.setData({
      //     canBuy: false
      //   })
    })
}
function toggleBargainPopup(val) {
  const that = this
  if (val !== true) {
    clearTimeout(bargainTimeId)
  }
  toggle('middle')
  if (val !== true) {
    const opts = '?barginInstanceId=' + state.instance.id
    NAVPAGE.toHelpBargain(opts)
  }
}
function toggleGoodsSpecPopup() {
  toggle('goodsSpec')
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
function getGoodsSpec(productId, storeId, children) {
  const self = this
  productService
    .getSpecDetails(productId, storeId)
    .then((res) => {
      if (res) {
        const specDetails = JSON.parse(res.specDetailsJson)
        const specList = []
        if (children && children.length > 0) {
          specDetails.forEach((it, p_i) => {
            if (Array.isArray(it)) {
              specList.push([])
              for (let i = 0; i < it.length; i++) {
                const ele = it[i]
                if (Array.isArray(ele)) {
                  specList[p_i].push([])
                  for (let k = 0; k < it[i].length; k++) {
                    const it_k = it[i][k]
                    if (Array.isArray(it_k)) {
                      specList[p_i][i].push([])
                      for (let l = 0; l < it_k.length; l++) {
                        const it_l = it[i][k][l]
                        if (Array.isArray(it_l)) {
                        } else {
                          let tempItem = {
                            ...it_l,
                          }
                          for (let q = 0; q < children.length; q++) {
                            const it_q = children[q]
                            if (it_q.productId === it_q.productId) {
                              tempItem = {
                                ...tempItem,
                                availableStockAmount: it_q.availableStockAmount,
                                lowerPrice: it_q.lowerPrice,
                                price: it_q.price,
                                totalStockAmount: it_q.totalStockAmount,
                              }
                              break
                            }
                          }
                          specList[p_i][i][k].push(tempItem)
                        }
                      }
                    } else {
                      let tempItem = {
                        ...it_k,
                      }
                      for (let t = 0; t < children.length; t++) {
                        const it_t = children[t]
                        if (it_k.productId === it_t.productId) {
                          tempItem = {
                            ...tempItem,
                            availableStockAmount: it_t.availableStockAmount,
                            lowerPrice: it_t.lowerPrice,
                            price: it_t.price,
                            totalStockAmount: it_t.totalStockAmount,
                          }
                          break
                        }
                      }
                      specList[p_i][i].push(tempItem)
                    }
                  }
                } else {
                  let tempItem = {
                    ...ele,
                  }
                  for (let j = 0; j < children.length; j++) {
                    const it_j = children[j]
                    if (ele.productId === it_j.productId) {
                      tempItem = {
                        ...tempItem,
                        availableStockAmount: it_j.availableStockAmount,
                        lowerPrice: it_j.lowerPrice,
                        price: it_j.price,
                        totalStockAmount: it_j.totalStockAmount,
                      }
                      break
                    }
                  }
                  specList[p_i].push(tempItem)
                }
              }
            } else {
              let tempItem = {
                ...it,
              }
              for (let i = 0; i < children.length; i++) {
                const ele = children[i]
                if (it.productId === ele.productId) {
                  tempItem = {
                    ...tempItem,
                    availableStockAmount: ele.availableStockAmount,
                    lowerPrice: ele.lowerPrice,
                    price: ele.price,
                    totalStockAmount: ele.totalStockAmount,
                  }
                  break
                }
              }
              specList.push(tempItem)
            }
          })
        }
        state.specs = res.specs
        state.specDetails = children && children.length > 0 ? specList : specDetails
      }
    })
    .catch((err) => {
      console.log('查询商品规格：' + err.message)
    })
}
function openGoodsSpecs(e) {
  if (state.specs.length > 0) {
    if (state.balance > 0) {
      state.goodsImg = state.bargainActivity.productImage
      toggleGoodsSpecPopup()
    } else {
      uni.showToast({
        title: '门店正在补货中，看看其他商品吧~',
        icon: 'none',
        duration: 2000,
      })
    }
  } else {
    createBargain()
  }
}
function confirmSpecs(e) {
  console.log(e)
  // 关闭弹窗
  toggleGoodsSpecPopup()
  specs = e.detail
  // 调用添加购物车接口
  state.productId = e.detail.productId
  createBargain()
}
function getPostData() {
  const that = this
  let postData = {}
  let tempSelfTime = null
  let shipmentType = 'SELF'
  if (state.type === 'dispatch' || state.type === 'logistical') {
    shipmentType = 'EXPRESS'
    if (state.type === 'logistical') {
      shipmentType = 'LOGISTICAL'
    }
  } else {
    shipmentType = 'SELF'
    // 自提时间格式为yyyy-mm-dd HH:mm:ss~yyyy-mm-dd HH:mm:ss
    const tempTime = state.multiArray[1][state.multiIndex[1]]
    const tempTimeArr = tempTime.split('-')
    tempSelfTime =
      state.multiArray[0][state.multiIndex[0]] +
      ' ' +
      tempTimeArr[0] +
      ':00' +
      '~' +
      state.multiArray[0][state.multiIndex[0]] +
      ' ' +
      tempTimeArr[1] +
      ':00'
  }
  postData = {
    activityId: state.bargainActivity.id,
    memberId: state.member.id,
    productId: state.productId,
    selfTimeScope: tempSelfTime,
    shipmentType,
    storeId: state.storeId,
  }
  if ((shipmentType === 'EXPRESS' || shipmentType === 'LOGISTICAL') && state.addressInfo) {
    postData = {
      ...postData,
      deliveryAddressId: state.addressInfo.id, // 收货地址id
    }
  }
  return postData
}
function createBargain() {
  const that = this
  if (!canCreateBargain) {
    console.log('已经在发起砍价了')
    return
  }
  canCreateBargain = false
  if (!state.isMember) {
    canCreateBargain = true
    // 不是会员，前往授权页
    NAVPAGE.toAuthorize()
    return
  }
  if (state.balance <= 0) {
    canCreateBargain = true
    util.showToast('该砍价商品库存不足，看看其他活动吧~')
    return
  }
  if (
    state.type === 'selftake' &&
    (state.multiArray[1][0] === '请选择其他时间' ||
      state.multiArray[1][0] === '不能下单' ||
      state.multiArray[1][0] === '无法预约自提时间')
  ) {
    canCreateBargain = true
    util.showToast('当前时间不能自提，请选择其他时间~')
    return
  }
  if (state.canBargain) {
    const postData = getPostData()
    if (postData.shipmentType === 'EXPRESS' || postData.shipmentType === 'LOGISTICAL') {
      if (!postData.deliveryAddressId) {
        canCreateBargain = true
        uni.showToast({
          title: '收货地址不能为空~',
          icon: 'none',
          duration: 2000,
        })
        return
      }
    }
    bargainService
      .create(postData)
      .then((res) => {
        canCreateBargain = true
        state.selfBargainAmount = res.amount
        state.instance = res.instance
        toggleBargainPopup(true)
        bargainTimeId = setTimeout(() => {
          // 关闭弹窗，跳转帮砍页面
          toggleBargainPopup(true)
          const opts = '?barginInstanceId=' + res.instance.id
          NAVPAGE.toHelpBargain(opts)
        }, 1000)
      })
      .catch((err) => {
        canCreateBargain = true
        util.showToast(err.message)
      })
  } else {
    canCreateBargain = true
  }
}
function getUserInfo(e) {
  AUTHORIZE.login(e)
    .then((res) => {
      state.hasUserInfo = true
      if (res.member) {
        state.member = res.member
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
function handleUserLogin() {
  console.log(app.globalData.userInfo)
  const that = this
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true
      state.isMember = true
      state.member = app.globalData.userInfo.member
    } else {
      // 不是会员跳转授权页
      state.hasUserInfo = true
      state.isMember = false
      NAVPAGE.toAuthorize()
    }
  }
}
function handleDeliveryType() {
  const self = this
  // let shipmentTypes = this.data.storeInfo.shipmentTypes
  const shipmentTypes =
    state.bargainActivity &&
    state.bargainActivity.shipmentTypes &&
    state.bargainActivity.shipmentTypes.length > 0
      ? state.bargainActivity.shipmentTypes.split(',')
      : []
  // 取门店和商品配送方式的交集
  const optionalShipmentType = state.optionalShipmentType
  console.log(optionalShipmentType, 'optionalShipmentType')
  const keys = Object.keys(optionalShipmentType)
  keys.forEach((shipmentTypeItem) => {
    console.log(
      state.storeInfo.shipmentTypes.indexOf(shipmentTypeItem) == -1,
      shipmentTypes.indexOf(shipmentTypeItem) == -1,
      optionalShipmentType[shipmentTypeItem],
    )
    if (
      (state.storeInfo.shipmentTypes.indexOf(shipmentTypeItem) == -1 ||
        shipmentTypes.indexOf(shipmentTypeItem) == -1) &&
      optionalShipmentType[shipmentTypeItem]
    ) {
      console.log('shipmentTypeItem', shipmentTypeItem)
      optionalShipmentType[shipmentTypeItem] = false
    }
  })
  console.log(optionalShipmentType, 'optionalShipmentType')
  // let canDelivery = false;
  // let canSelfmention = false;
  // 判断是否支持配送或者快递
  // shipmentTypes = 'LOGISTICAL'
  // if (shipmentTypes.indexOf('EXPRESS') >= 0 || shipmentTypes.indexOf('LOGISTICAL') >= 0) {
  //   canDelivery = true
  // }
  // if (shipmentTypes.indexOf('SELF') >= 0) {
  //   canSelfmention = true
  // }

  // var shipmentList = []
  // if (!app.globalData.uiconfig || !app.globalData.uiconfig.shipmentSortList || app.globalData.uiconfig.shipmentSortList.length == 0) {
  //   if (app.globalData.uiconfig) {
  //     app.globalData.uiconfig.shipmentSortList = ["SELF", "EXPRESS", "LOGISTICAL"]
  //   } else {
  //     app.globalData.uiconfig = {
  //       shipmentSortList: ["SELF", "EXPRESS", "LOGISTICAL"]
  //     }
  //   }
  // }
  // 处理排序问题
  // for (const key in app.globalData.uiconfig.shipmentSortList) {
  //   if (app.globalData.uiconfig.shipmentSortList.hasOwnProperty(key)) {
  //     const value = app.globalData.uiconfig.shipmentSortList[key];

  //     if (value === "TAKEMEALNOW") {
  //       continue
  //     }
  //     if (this.data.isDistributionOrder) { //统配
  //       //排除配送
  //       if (value === "EXPRESS") {
  //         continue
  //       }
  //     } else {
  //       //排除门店不支持的外送方式（快递或者外送）
  //       if (shipmentTypes.indexOf(value) < 0) {
  //         // if ((value === "LOGISTICAL" || value === "EXPRESS") && shipmentTypes.indexOf(value) < 0) {
  //         continue
  //       }
  //     }
  //     console.log(value)
  //     shipmentList.push(value)
  //   }
  // }
  // 统配商品
  if (
    state.distributionStoreId !== '' &&
    state.bargainActivity &&
    state.bargainActivity.business === 'DISTRIBUTION'
  ) {
    //   shipmentList = ["LOGISTICAL"]
    optionalShipmentType.SELF = false
    optionalShipmentType.EXPRESS = false
    optionalShipmentType.LOGISTICAL = true
    //   if (shipmentTypes.indexOf('EXPRESS') >= 0) {
    //     shipmentList.push("EXPRESS")
    //   }
    //   if (shipmentTypes.indexOf('LOGISTICAL') >= 0) {
    //     shipmentList.push("LOGISTICAL")
    //   }
  }
  console.log(optionalShipmentType, 'optionalShipmentType')
  // 配送方式顺序
  // this.setData({
  //   shipmentSortList: shipmentList
  // })
  state.optionalShipmentType = optionalShipmentType
  let firstType = state.shipmentSortList[0]
  let type = 'selftake'
  if (!state.optionalShipmentType[firstType]) {
    const keys = Object.keys(state.optionalShipmentType)
    keys.some((key) => {
      if (state.optionalShipmentType[key]) {
        firstType = key
      }
      return state.optionalShipmentType[key]
    })
  }
  if (firstType === 'SELF') {
    type = 'selftake'
  } else if (firstType === 'EXPRESS') {
    type = 'dispatch'
  } else if (firstType === 'LOGISTICAL') {
    type = 'logistical'
  }
  // if (this.data.orderType === "advanceSell" && this.data.advanceSellInfo.shipmentType) {
  //   // 预售订单以预售活动的配送方式为准
  //   this.setData({
  //     type: this.data.advanceSellInfo.shipmentType === "SELF" ? "selftake" : "dispatch",
  //   })
  // } else {
  //   if ((firstType === "LOGISTICAL" || firstType === "EXPRESS") && canDelivery) {
  //     let type = 'dispatch'
  //     if (firstType === "LOGISTICAL") {
  //       type = 'logistical'
  //     }
  //     this.setData({
  //       type: type,
  //     })
  //   } else if (firstType === "SELF" && canSelfmention) {
  //     if (this.data.isDistributionOrder) {
  //       // 排除统配订单
  //       let type = 'dispatch'
  //       if (shipmentTypes.indexOf('EXPRESS') >= 0) {
  //         type = 'dispatch'
  //       } else if (shipmentTypes.indexOf('LOGISTICAL') >= 0) {
  //         type = 'logistical'
  //       }
  //     } else {
  //       this.setData({
  //         type: 'selftake'
  //       })
  //     }
  //   }
  // }
  // self.setData({
  //   canDelivery: canDelivery,
  //   canSelfmention: canSelfmention
  // })
  state.type = type
}
function toHome() {
  NAVPAGE.toHome()
}
function toGoodsDetails() {
  const opts =
    '?productId=' + state.bargainActivity.productId + '&storeId=' + state.storeId + '&type=normal'
  NAVPAGE.toGoodsDetails(opts)
}
function toggleBargainRulesPopup() {
  toggle('rule')
}
</script>
<style scoped>
/* pages/mallModule/bargain/bargainDetails/bargainDetails.wxss */

.color-454545 {
  color: #454545;
}

.top-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}

.top-info {
  width: 100%;
  /* height: 410rpx; */
  /* margin: 30rpx auto 0; */
  /* background: #fff; */
  box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.05);
  border-radius: 6rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 36rpx;
  position: relative;
  padding-top: 35rpx;
}
.goods_box {
  background-color: #fff;
  margin: 0 20rpx;
  width: 710rpx;
  border-radius: 10rpx;
  padding-bottom: 20rpx;
}

.top-info .bargain-rule {
  width: 132rpx;
  height: 45rpx;
  background: #c53205;
  border-radius: 23rpx 0px 0px 23rpx;
  font-size: 24rpx;
  color: #fff;
  text-align: center;
  position: absolute;
  right: 0;
  top: 35rpx;
  line-height: 45rpx;
}

.top-info .prompt {
  font-size: 34rpx;
  color: #fff;
  font-weight: bold;
  margin-top: 6rpx;
}

.top-info .process {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 27rpx;
  margin-top: 39rpx;
}
.top-info .process image {
  width: 709rpx;
  height: 95rpx;
}

/* 配送方式 */

.shipping-method {
  width: 710rpx;
  background: #fff;
  box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.05);
  border-radius: 6rpx;
  margin: 10rpx auto 50rpx;
  padding: 13rpx 30rpx 0;
  box-sizing: border-box;
}

.shipping-method .title {
  font-size: 28rpx;
  line-height: 30rpx;
  height: 30rpx;
  color: #333;
  padding-top: 20rpx;
}

.type-check-box {
  height: 110rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
}

.type-check-box > view {
  border: 1px solid #8b8b8c;
  color: #8b8b8c;
  border-radius: 6rpx;
  height: 50rpx;
  width: 180rpx;
  font-size: 24rpx;
  line-height: 50rpx;
  margin-right: 38rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.type-check-box > view.active {
  border-color: #fbbe35;
  color: #fbbe35;
}

.type-check-box > view image {
  width: 33rpx;
  height: 33rpx;
  margin-right: 10rpx;
}

.type-check-box .self-take image {
  width: 25rpx;
  height: 36rpx;
}

.type-check-box .self-take.active {
  border-color: #009f55;
  color: #009f55;
}

.type-check-box > view:last-of-type {
  margin-right: 0;
}

.time-picker {
  width: 100%;
  background: #fff;
}

.select-item {
  padding: 19rpx 0;
  font-size: 24rpx;
  border-top: 1rpx solid #f1f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #454545;
  text-align: right;
  position: relative;
}

.select-item:last-of-type {
  border-bottom: 0;
}

.select-item > view {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.select-item .left-icon {
  margin-right: 13rpx;
}

.time-picker .left-icon {
  width: 34rpx;
  height: 34rpx;
}

.select-store .left-icon {
  width: 35rpx;
  height: 32rpx;
}

.select-address .left-icon {
  width: 33rpx;
  height: 39rpx;
}

.right-point {
  width: 12rpx;
  height: 23rpx;
}

.select-item .right-point {
  margin-left: 10rpx;
}

/* .select-store {
  padding-bottom: 3rpx;
} */

.select-address {
  padding-bottom: 8rpx;
  height: auto;
}

.receive-info {
  width: 560rpx;
  min-height: 40rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  padding: 16rpx 0 20rpx;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  text-align: left;
}

.receive-info .name-mobile text:first-of-type {
  margin-right: 22rpx;
  padding-right: 20rpx;
  position: relative;
}

.receive-info .name-mobile text:first-of-type::after {
  content: '';
  height: 20rpx;
  background: #8b8b8c;
  width: 1px;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -8rpx;
}

.receive-info .receive-address {
  font-size: 24rpx;
  color: #454545;
}

.receive-info .no-address {
  height: 100%;
  font-size: 24rpx;
}

.bargain-button {
  width: 670rpx;
  height: 74rpx;
  background: linear-gradient(180deg, #fea25b, #ff7103);
  border-radius: 37rpx;
  font-size: 30rpx;
  line-height: 74rpx;
  color: #f8f6f9 !important;
}

.bargain-button::after {
  border: 0;
}

button[disabled] {
  opacity: 0.6 !important;
}

button.disabled {
  opacity: 0.6 !important;
}

/* 弹窗 */

.popup-bargain {
  width: 387rpx;
  height: 391rpx;
  padding: 33rpx 0 0 0;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20rpx;
  font-size: 30rpx;
  color: #fff;
}

.popup-bargain-box {
  line-height: 42rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-bargain-box view {
  font-size: 40rpx;
  margin-top: 23rpx;
}

.popup-bargain-box .price {
  color: #f33;
}

.popup-bargain-box .popup-image {
  width: 225rpx;
  height: 221rpx;
  margin-top: 29rpx;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
  position: fixed;
  right: 0;
  bottom: 120rpx;
}

.bargain-rules-popup {
  width: 520rpx;
  padding: 24rpx 40rpx;
  background: #fff;
  color: #454545;
  border-radius: 24rpx;
  font-size: 24rpx;
  line-height: 36rpx;
}

.bargain-rules-popup .title {
  font-size: 36rpx;
  line-height: 64rpx;
  width: 100%;
  text-align: center;
  margin-bottom: 24rpx;
}

.bargain-rules-popup text {
  display: block;
  margin-bottom: 12rpx;
}

.bargain-rules-popup .close {
  width: 80rpx;
  height: 80rpx;
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bargain-rules-popup .close image {
  width: 40rpx;
  height: 40rpx;
}
</style>
