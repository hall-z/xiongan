<template>
  <!-- pages/mallModule/order/order/order.wxml -->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>

  <view class="order-box">
    <view
      class="order-tab-box"
      v-if="state.showOfflineOrders || state.isOpenStoreOrder"
      :style="'top:' + navHeight + 'px;'"
    >
      <view
        :class="'order-tab-item ' + (state.orderTab == 0 ? 'active' : '')"
        :style="'color: ' + (state.orderTab == 1 ? '#999999' : state.themeColor) + ';'"
        data-idx="0"
        @click="handleSwitchOrder"
      >
        商城订单
      </view>
      <view
        :class="'order-tab-item ' + (state.orderTab == 1 ? 'active' : '')"
        :style="'color: ' + (state.orderTab == 0 ? '#999999' : state.themeColor) + ';'"
        data-idx="1"
        @click="handleSwitchOrder"
      >
        门店订单
      </view>
    </view>
    <scroll-view
      class="top-tab"
      scroll-x=""
      :style="
        'width: 100%;' +
        (state.showOfflineOrders || state.isOpenStoreOrder
          ? 'background-color: #F1F3F6;top:' + navHeightTop + 'rpx'
          : 'top:' + navHeight + 'px')
      "
      :hidden="state.orderTab == 1"
    >
      <view
        :class="'tab-item ' + (state.tabSelected == idx ? 'active' : '')"
        :style="
          'color: ' +
          (state.tabSelected == idx ? state.themeColor : '') +
          ';border-color: ' +
          (state.tabSelected == idx ? state.themeColor : '') +
          ';'
        "
        v-for="(item, idx) in state.tabType"
        :data-idx="idx"
        :key="index"
        @click="switchTab"
      >
        {{ item }}
      </view>
    </scroll-view>
    <scroll-view
      class="top-tab"
      scroll-x=""
      :style="
        'width: 100%;' +
        (state.isOpenStoreOrder
          ? 'background-color: #F1F3F6;top:' + navHeightTop + 'rpx'
          : 'top:' + navHeight + 'px')
      "
      :hidden="state.orderTab == 0"
    >
      <view
        :class="'tab-item ' + (state.tabSelected == 0 ? 'active' : '')"
        :style="
          'color: ' +
          (state.tabSelected == 0 ? state.themeColor : '') +
          ';border-color: ' +
          (state.tabSelected == 0 ? state.themeColor : '') +
          ';'
        "
        data-idx="0"
        @click="switchTab1"
      >
        全部
      </view>
      <!-- <view class="tab-item {{tabSelected == 1 ? 'active' : ''}}" style="color: {{tabSelected==1 ? themeColor : '' }};border-color: {{tabSelected==1 ? themeColor : ''}};" data-idx="1" bindtap="switchTab1">已完成</view> -->
    </scroll-view>
    <view
      :class="
        'order-list ' +
        (state.showOfflineOrders || state.isOpenStoreOrder ? 'show-offline-orders' : '')
      "
      :hidden="state.orderTab == 1"
    >
      <!-- 全部订单 -->
      <view class="order-content">
        <view class="order-item-box" v-for="(item, index) in state.allOrders" :key="id">
          <!--<template is="orderItem" :data="item, state.themeColor"></template>-->
        </view>
        <view class="no-data" :hidden="state.allOrders.length == 0 ? false : true">
          <image :src="state.imagesPath.imgNoOrders"></image>
        </view>
      </view>
    </view>
    <view class="offline-order-list" :hidden="state.orderTab == 0">
      <!-- 线下订单 -->
      <view class="order-item-box" v-for="(item, index) in state.offlineOrders" :key="id">
        <!--<template is="offlineOrderItem" :data="item"></template>-->
      </view>
      <view class="no-data" :hidden="state.offlineOrders.length == 0 ? false : true">
        <image :src="state.imagesPath.imgNoOrders"></image>
      </view>
    </view>
    <view class="mantle" v-if="state.afterShow" @click="showPopu">
      <view class="shouhouBox">
        <text>选择售后类型</text>
        <view class="shouhouBox-active">
          <view class="active-a" :data-type="'REFUND'" @click="toRefundPage">
            <view class="active-one">
              <image :src="xingIcon"></image>
              <text>我要退款（无需退货）</text>
            </view>
            <view class="Noreceived">没收到货，或与卖家协商同意不用退货只退款</view>
            <view class="arrow">
              <image
                style="width: 28rpx; height: 38rpx"
                src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/arrow.jpg"
              ></image>
            </view>
          </view>
          <view class="active-a" :data-type="'RETURNS_AND_REFUND'" @click="toRefundPage">
            <view class="active-one">
              <image :src="xingIcon2"></image>
              <text>我要退货退款</text>
            </view>
            <view class="received">已收到货，需要退还收到的货物</view>
            <view class="arrow">
              <image
                style="width: 28rpx; height: 38rpx"
                src="http://gomore-gssm.oss-cn-hangzhou.aliyuncs.com/taiko_bj_image/arrow.jpg"
              ></image>
            </view>
          </view>
        </view>
      </view>
    </view>

    <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">
      正在加载...
    </button>
    <view class="order-end" :style="state.theme.mainColor" :hidden="!state.noMore">
      ~我也是有底线的~
    </view>
  </view>
  <image
    class="movable-view"
    v-if="state.homeBack"
    :src="state.imagesPath.toHome"
    @click="toHome"
  ></image>
  <pay :order-data="state.order" path="order" :payType="state.payType"></pay>
</template>
<script setup>
import xingIcon from '@/utils/newretail/image/xing.png'
import xingIcon2 from '@/utils/newretail/image/xing2.png'
import _utilsSubscribeMessageJs from '@/utils/newretail/subscribeMessage'
import _utilsLogJs from '@/utils/newretail/log'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiRequestJs from '@/service/api/newretail/request'
import _apiPennyServiceJs from '@/service/api/newretail/pennyService'
import _apiOfflineOrderServciceJs from '@/service/api/newretail/offlineOrderService'
import _apiTeamBuyServiceJs from '@/service/api/newretail/teamBuyService'
import _apiAdvanceSellServiceJs from '@/service/api/newretail/advanceSellService'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onPageScroll } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/mallModule/order/order/order.js
const orderService = _apiOrderServiceJs
const storeService = _apiStoreServiceJs
const advanceSellService = _apiAdvanceSellServiceJs
const teamBuyService = _apiTeamBuyServiceJs
const offlineOrderServcice = _apiOfflineOrderServciceJs
const pennyService = _apiPennyServiceJs
const request = _apiRequestJs
const util = _utilsUtilsJs
const selfA = _utilsSelfJs
const NAVPAGE = _utilsNavPageJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs
const log = _utilsLogJs
const subscribeMessage = _utilsSubscribeMessageJs
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
let autoCancelPeriod = 0
const state = reactive({
  isOpenStoreOrder: false,
  currentRequest: null,
  // 添加当前请求的控制变量
  isOpenCustomerService: false,
  navigationBarTitle: '我的订单',
  imagesPath: IMGAGESPATH,
  tabType: ['全部'],
  // 全部是固定都有的
  tabSelected: 0,
  orderTab: 0,
  allOrders: [],
  unPayedTailOrders: [],
  swiperHeight: 0,
  serviceTel: '',
  type: 'normal',
  pageIndex: 1,
  onlineCount: 1,
  pageSize: 50,
  pageCount: 1,
  allOrdersList: [],
  noMore: false,
  loading: false,
  homeBack: false,
  // 要显示的订单状态
  orderStatusEntrance: [],
  // 线下订单
  offlineOrders: [],
  page: 1,
  showOfflineOrders: false,
  order: null,
  // 订单数据
  payType: 'normal',
  // normal,payTail
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  theme: themeManager,
  floorstatus: false,
  afterShow: false,
  // 售后弹层显示隐藏
  afteRorderId: '', // 订单id
})
onLoad(function (options) {
  uni.hideShareMenu()
  autoCancelPeriod = 0
  const navHeight = app.globalData.navHeight
  if (app.globalData.uiconfig) {
    state.isOpenCustomerService = app.globalData.uiconfig.isOpenCustomerService
  }
  state.serviceTel = app.globalData.servicePhone
  state.navHeight = navHeight
  state.navHeightTop = (navHeight * 750) / app.globalData.systemInfo.windowWidth + 80
  state.theme = {
    color:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color: ' + app.globalData.uiconfig.themeColor + ';'
        : 'color:' + (uni.getStorageSync('themeColor') || '#FF9F43'),
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
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
  state.isOpenStoreOrder = app.globalData.isOpenStoreOrder
  getMemberUserInfo()
  if (options.selected) {
    state.tabSelected = parseInt(options.selected)
  }
  if (options.type) {
    state.type = options.type
  }
  const pageStack = getCurrentPages()
  if (pageStack.length === 1) {
    state.homeBack = true
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
  // 获取是否显示线下订单
  state.showOfflineOrders = app.globalData.systemConfigure.showOfflineOrders
  generateTabType()
})
function generateTabType() {
  const that = this
  console.log(app.globalData.uiconfig.orderStatusEntrance)
  // && value.orderEntranceStatus != 'WAITSHIPPED'
  // && value.orderEntranceStatus != 'CREATED'
  state.orderStatusEntrance = app.globalData.uiconfig.orderStatusEntrance.filter(
    (value) =>
      value.orderEntranceStatus != 'SCORE_RECORD' &&
      value.orderEntranceStatus != 'OFFLINE_ORDER' &&
      value.orderEntranceStatus != 'REFUND_AFTERMARKET',
  )
  // this.data.orderStatusEntrance = app.globalData.uiconfig.orderStatusEntrance;
  // 匹配状态对应的文字
  state.orderStatusEntrance.forEach((item) => {
    state.tabType.push(app.globalData.orderStatus[item.orderEntranceStatus].name)
  })
  state.tabType.push('历史单据')
  state.tabType = state.tabType
  state.selectedTab = 0
}
function callContact(e) {
  console.log(e, 'Sdfsdf')
  let _data = null
  state.allOrders.some((item) => {
    if (item.orderNum == e.target.dataset.id) {
      _data = item
    }
    return item.orderNum == e.target.dataset.id
  })
  if (_data) {
    const picture = _data.details[0].img || ''
    const title = _data.orderNum || ''
    const sellPrice = _data.totalPrice ? parseFloat(_data.totalPrice) : ''
    // return false
    // wx.navigateTo({
    //     url: `/pages/mallModule/order/qiyu/index?picture=${picture}&title=${title}&sellPrice=${sellPrice}`,
    // })
    NAVPAGE.toCustomService(
      `?sendByUser=1&cardType=1&orderId=${_data.orderNum}&picture=${picture}&title=${title}&sellPrice=${sellPrice}&orderStatus=${_data.status}&createTime=${_data.createTime}&goodsCount=${_data.buyNumber}`,
      _data.storeId,
    )
    // wx.navigateTo({
    //     url: `/pages/mallModule/order/qiyu/index?sendByUser=1&cardType=1&orderId=${data.orderNum}&picture=${picture}&title=${title}&sellPrice=${sellPrice}&orderStatus=${data.status}`,
    // })
  }
}
function historyOrderActive(page) {
  const _data2 = {
    page: page || state.pageIndex,
    pageSize: 10,
    memberMobile: app.globalData.userInfo.member.mobile,
    searchCount: true,
  }
  const that = this
  const tabNum = state.tabSelected
  let status = ''
  if (tabNum == '0') {
    status = ''
  }
  const orderStatus = status
  const tempList = []
  orderService.historyOrder(_data2).then((res) => {
    const tempOrderList = []
    res.records.forEach((item) => {
      if (item.business !== 'SCORE') {
        let itemStatus = item.status
        if (item.status === 'CREATED') {
          const date = new util.ResponseDate()
          const createTimeStamp = new Date(item.createTime.replace(/-/g, '/')).getTime()
          const now = new Date(util.formatTime(date)).getTime()
          if (now >= createTimeStamp + autoCancelPeriod) {
            item.status = 'CANCELED'
            itemStatus = 'CANCELED'
          }
        }
        let cashTotal = item.cashTotal ? item.cashTotal.toFixed(2) : '0.00'
        let orderCanRefund = true
        // 处理预售订单付完全款
        if (item.business === 'ADVANCE_SELL' && item.status !== 'WAITPAYBALANCE') {
          // 业态为预售且状态不是待付尾款
          if (item.balanceTotal && item.balanceTotal != null) {
            cashTotal = (parseFloat(cashTotal) + item.balanceTotal).toFixed(2)
          }
          if (item.shipmentType === 'SELF' && item.selfTimeScope) {
            const now = new util.ResponseDate().getTime()
            // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
            const reg =
              /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/
            if (reg.test(item.selfTimeScope)) {
              const timeScope = item.selfTimeScope
              const timeArr = timeScope.split('~')
              const selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime()
              if (now >= selfStartTime) {
                // 已过自提时间不能退款
                orderCanRefund = false
              }
            }
          }
        }
        // 计算支付渠道优惠金额
        if (item.promotionTotalFee) {
          cashTotal =
            Number(cashTotal) - Number(item.promotionTotalFee) > 0
              ? (Number(cashTotal) - Number(item.promotionTotalFee)).toFixed(2)
              : '0.00'
        }
        let canOneMore = true
        if (
          item.type === 'TEAMBUING' ||
          item.type === 'ADVANCE_SELL' ||
          item.type === 'SCORE_PRICE' ||
          item.type === 'BARGIN' ||
          item.type === 'OFFLINE' ||
          item.type === 'PENNY'
        ) {
          canOneMore = false
        }
        let tempItem = {
          type: '',
          orderNum: item.orderNumber,
          status: handleOrderStatus(item.status),
          business: item.business,
          storeName: item.storeName,
          // 发货门店名称
          storeId: item.storeId,
          shipmentAmount: item.shipmentAmount
            ? item.deductibleShipmentAmonut
              ? (item.shipmentAmount - item.deductibleShipmentAmonut).toFixed(2)
              : item.shipmentAmount.toFixed(2)
            : '0.00',
          // 运费
          details: [],
          tabSelected: state.tabSelected,
          buyNumber: item.orderProductList ? item.orderProductList.length : 0,
          totalPrice: item.orderCashTotal,
          teamId: item.teamId,
          orderProductList: item.orderProductList,
          teamLeaderRecordId: item.teamLeaderRecordId,
          shipmentType: item.shipmentType,
          orderCanRefund,
          ordertype: item.type,
          canShowService: false,
          canOneMore,
          parentId: item.parentId,
          trackingNumber: item.trackingNumber,
          sendOrderId: item.sendOrderId ? item.sendOrderId : item.orderNumber,
          isDel: false,
        }
        if (item.orderProductList) {
          item.orderProductList.forEach((i) => {
            tempItem.count += parseInt(i.goodsNum)
            let isFictitiousProduct = false
            if (
              app.globalData.systemConfigure.fictitiousProductId &&
              i.productId === app.globalData.systemConfigure.fictitiousProductId
            ) {
              isFictitiousProduct = true
            }
            const data = {
              id: i.productId,
              goodsName: i.goodsName,
              goodsNum: i.productNum,
            }
            if (isFictitiousProduct) {
              data.img = state.imagesPath.iconOffLine
            }
            tempItem.details.push(data)
          })
        } else {
          tempItem.count = 0
        }
        if (item.advanceId) {
          tempItem = {
            ...tempItem,
            advanceId: item.advanceId,
          }
        }
        if (item.teamId != '' && item.teamId != null) {
          tempItem.type = '拼团'
        } else {
          tempItem.type = ''
        }
        if (item.canRefund === false && itemStatus !== 'REJECTED') {
          tempItem.status = '退款中'
          if (tempItem.type === 'SOLITAIRE') {
            tempItem.status = '接龙失败，退款中'
          }
        }
        if (item.type === 'SOLITAIRE') {
          if (item.solitaireRecordStatus === 'NORMAL' && item.canRefund) {
            tempItem.status = '接龙中'
          } else if (
            item.type === 'SOLITAIRE' &&
            (tempItem.status === '退款中' || tempItem.status === '已退款')
          ) {
            tempItem.status = '接龙失败，' + tempItem.status
          } else if (item.solitaireRecordStatus === 'REFUND') {
            tempItem.status = '接龙失败，已退款'
          } else if (
            !item.canRefund &&
            tempItem.status !== '退款中' &&
            tempItem.status !== '已退款'
          ) {
            tempItem.status = '接龙失败，退款中'
          }
        }
        if (orderStatus === '') {
          // 所有订单
          if (
            (itemStatus === 'PAID' || itemStatus === 'WAITSHIPPED') &&
            item.teamId != '' &&
            item.teamId != null &&
            item.canRefund === true
          ) {
            tempItem.status = '待拼团'
            tempOrderList.push(tempItem)
            let teamInfo = null
            teamBuyService
              .getById(item.teamId)
              .then((res) => {
                teamInfo = res
                return teamBuyService.getRecordsByLeaderId(item.teamLeaderRecordId)
              })
              .then((res) => {
                console.log(res)
                const openTeamTime = res.leader.startTime
                  ? res.leader.startTime
                  : res.leader.createTime // 开团时间
                const timeStamp = new Date(openTeamTime.replace(/-/g, '/')).getTime()
                const newTimeStamp = parseInt(timeStamp + teamInfo.duration * 1000)
                const now = new util.ResponseDate().getTime()
                let teamStatus = ''
                let status = tempItem.status
                if (teamInfo.teamMemberCount === res.leader.joinMemberCount) {
                  teamStatus = 'success' // 团购状态正常
                  status = '已成团'
                } else {
                  if (now > newTimeStamp) {
                    teamStatus = 'overdue' // 团购已过期
                    status = '已过期' // 退款中
                  } else {
                    teamStatus = 'normal' // 团购状态正常
                  }
                }
                let sharePicture = null
                if (teamInfo.sharePicture) {
                  sharePicture = teamInfo.sharePicture
                }
                const tempOrderList = state.allOrders
                tempOrderList.forEach((ele, i) => {
                  if (ele.teamLeaderRecordId === res.leader.id) {
                    tempOrderList[i].teamStatus = teamStatus
                    tempOrderList[i].status = status
                    if (sharePicture != null) {
                      tempOrderList[i].sharePicture = sharePicture
                    }
                  }
                })
                state.allOrders = tempOrderList
              })
          } else {
            tempOrderList.push(tempItem)
          }
        } else if (
          orderStatus === 'PAID' &&
          item.teamId != '' &&
          item.teamId != null &&
          item.canRefund === true
        ) {
          // 待拼团
          tempItem.status = '待拼团'
          tempOrderList.push(tempItem)
        } else {
          // 待自提
          tempOrderList.push(tempItem)
        }
      } else {
      }
    })
    const pageCount = parseInt(res.recordCount / res.pageSize) + 1
    const allOrders = state.allOrders
    state.pageIndex = res.page
    state.onlineCount = pageCount
    state.allOrders = allOrders.concat(tempOrderList)
  })
}
onReady(function () {
  const that = this
  uni.getSystemInfo({
    success: function (res) {
      console.log(res)
      state.swiperHeight = res.windowHeight + 10
    },
  })
})
onShow(function () {
  // setTimeout(()=>{
  //   wx.navigateTo({
  //     url: '/pages-sub/newretail/pages/mallModule/order/deliveryDetails/deliveryDetails'
  //   });
  // },2000)
  const that = this
  const login = checkAuth()
  if (login) {
    if (app.globalData.userInfo.member) {
      if (state.type === 'OFFLINE') {
        state.orderTab = 1
        if (state.isOpenStoreOrder) {
          queryTradeOrder(state.page)
        } else {
          queryOfflineOrder(state.page)
        }
      } else if (state.type === 'payedTail') {
        getWaitPayedTail()
      } else {
        getOrderData(state.tabSelected)
      }
    } else {
      uni.showToast({
        title: '您还不是会员，请先绑定手机号码成为会员',
        icon: 'none',
        duration: 2000,
      })
    }
  } else {
    console.log('56')
  }
  if (app.globalData.uiconfig) {
    state.isOpenCustomerService = app.globalData.uiconfig.isOpenCustomerService
  }
})
onHide(function () {
  uni.hideLoading()
})
onUnload(function () {
  uni.hideLoading()
})
onPullDownRefresh(function () {
  if (state.orderTab == 0) {
    state.allOrders = []
    state.pageIndex = 1
    state.onlineCount = 1
    state.noMore = false
    getOrderData(state.tabSelected)
  } else {
    state.offlineOrders = []
    state.page = 1
    state.pageCount = 1
    state.noMore = false
    if (state.isOpenStoreOrder) {
      queryTradeOrder(state.page)
    } else {
      queryOfflineOrder(state.page)
    }
  }
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
onReachBottom(function () {
  if (state.orderTab == 0) {
    if (state.pageIndex < state.onlineCount) {
      // 如果查询结果数量不为0，说明还有下一页，执行查询操作
      state.loading = true
      let page = state.pageIndex
      ++page
      if (state.tabSelected == state.tabType.length - 1) {
        historyOrderActive(page)
      } else {
        loadOrderList(page)
      }
    } else {
      // 没有下一页，提示已经查询完毕
      if (state.allOrders.length > 0) {
        state.noMore = true
      } else {
        uni.showToast({
          title: '没有更多数据~',
          icon: 'none',
          duration: 2000,
        })
      }
    }
  } else {
    if (state.page < state.pageCount) {
      // 如果查询结果数量不为0，说明还有下一页，执行查询操作
      state.loading = true
      let page = state.page
      ++page
      if (state.isOpenStoreOrder) {
        queryTradeOrder(page)
      } else {
        queryOfflineOrder(page)
      }
    } else {
      // 没有下一页，提示已经查询完毕
      if (state.offlineOrders.length > 0) {
        state.noMore = true
        state.loading = false
      } else {
        uni.showToast({
          title: '没有更多数据~',
          icon: 'none',
          duration: 2000,
        })
      }
    }
  }
})
onShareAppMessage(function (res) {
  const that = this
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  const goods = state.allOrders
  let imgUrl = null
  let storeId = ''
  if (app.globalData.storeInfo) {
    storeId = app.globalData.storeInfo.id
  }
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res.target)
    let teamId = ''
    let teamLeaderRecordId = ''
    let instanceId = ''
    let name = ''
    if (res.target.dataset.teamid) {
      teamId = res.target.dataset.teamid
      teamLeaderRecordId = res.target.dataset.teamleaderrecordid
    }
    if (res.target.dataset.instanceid) {
      instanceId = res.target.dataset.instanceid
    }
    const orderId = res.target.dataset.id
    if (goods.length > 0) {
      goods.forEach((item) => {
        if (item.orderNum === orderId) {
          if (item.sharePicture != null && item.sharePicture != '') {
            imgUrl = item.sharePicture
          } else if (item.shareImageUrl != null && item.shareImageUrl != '') {
            imgUrl = item.shareImageUrl
            name = item.ordertype === 'penny' ? item.productName : ''
          } else if (item.details.length > 0) {
            imgUrl = item.details[0].img
            name = item.ordertype === 'penny' ? item.productName : ''
          }
        }
      })
    }
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      const memberId = app.globalData.userInfo.member.id
      if (teamId !== '') {
        return {
          title: '拼团有优惠',
          path:
            '/pages-sub/newretail/pages/mallModule/fightGroup/groupPurchase/groupPurchase?teamBuyId=' +
            teamId +
            '&teamLeaderRecordId=' +
            teamLeaderRecordId +
            '&shareId=' +
            memberId +
            '&storeId=' +
            storeId,
          imageUrl: imgUrl,
          success(e) {
            uni.showShareMenu({
              withShareTicket: true,
            })
          },
        }
      } else {
        return {
          title: '麻烦点一下，只差一个人就拿到' + name + '了～',
          path: '/pages-sub/newretail/pages/mallModule/activity/penny/helpPenny/helpPenny?instanceId=' + instanceId,
          imageUrl: imgUrl,
          success(e) {
            uni.showShareMenu({
              withShareTicket: true,
            })
          },
        }
      }
    } else {
      return {
        title: app.globalData.systemConfigure.miniprogramSharingName,
        path: '/pages-sub/newretail/pages/mallModule/index/index/index?storeId=' + storeId,
        imageUrl: imgUrl,
        success(e) {
          uni.showShareMenu({
            withShareTicket: true,
          })
        },
      }
    }
  } else {
    return {
      title: app.globalData.systemConfigure.miniprogramSharingName,
      path: '/pages-sub/newretail/pages/mallModule/index/index/index?storeId=' + storeId,
      imageUrl: imgUrl,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true,
        })
      },
    }
  }
})
function checkAuth() {
  try {
    if (!app.globalData.userInfo) {
      return false
    } else {
      return true
    }
  } catch (e) {
    // Do something when catch error
  }
}
function getMemberUserInfo() {
  if (!app.globalData.userInfo) {
    uni.showToast({
      title: '您还未授权，请登陆授权',
      icon: 'none',
      duration: 2000,
    })
  } else {
  }
}
onPageScroll(function (e) {
  if (e.scrollTop > 0) {
    state.floorstatus = true
  }
})
function switchTab1(e) {
  const selectedTab = e.currentTarget.dataset.idx
  state.tabSelected = selectedTab
  state.offlineOrders = []
  state.page = 1
  state.pageCount = 1
  state.noMore = false
  queryTradeOrder(state.page)
}
function switchTab(e) {
  // 如果存在未完成的请求，则取消该请求
  if (state.currentRequest) {
    state.currentRequest.abort()
  }
  const selectedTab = e.currentTarget.dataset.idx
  // 如果需要加载数据
  state.tabSelected = selectedTab
  state.loading = false
  state.noMore = false
  state.allOrders = []
  const login = checkAuth()
  if (login) {
    if (selectedTab == state.tabType.length - 1) {
      historyOrderActive()
    } else {
      getOrderData(selectedTab)
    }
  }
  if (uni.pageScrollTo && state.floorstatus) {
    uni.pageScrollTo({
      scrollTop: 0,
    })
  }
}
function toTrackingDetails(e) {
  const opts = '?orderId=' + e.target.dataset.id + '&mobile=' + e.target.dataset.mobile
  NAVPAGE.toLogisticsInfo(opts)
}
function getOrderData(tabSelected) {
  const that = this
  state.pageIndex = 1
  state.loading = false
  if (autoCancelPeriod) {
    const tempData = queryOrderList(1, 50)
    Promise.all([tempData]).then((res) => {
      handleOrderData(res)
    })
  } else {
    orderService
      .getAutoCancelPeriod()
      .then((res) => {
        autoCancelPeriod = parseFloat(res)
        const tempData = queryOrderList(1, 50)
        return Promise.all([tempData])
      })
      .then((res) => {
        handleOrderData(res)
      })
      .catch((e) => {
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000,
        })
      })
  }
  function handleOrderData(res) {
    console.log(res[0])
    const tabNum = tabSelected
    if (res[0].length) {
      // res[0].forEach(item => {
      //     item.details.forEach(arr => {
      //         selfA.getTemporaryUrl(arr.img)
      //             .then(att => {
      //                 arr.img = att;
      //                 // console.log(arr.img)
      //                 that.setData({
      //                     allOrders: res[0]
      //                 })
      //             })
      //     })
      // })
      state.allOrders = res[0]
    } else {
      state.allOrders = []
    }
  }
}
function queryOrderList(page, pageSize) {
  const that = this
  const tabNum = state.tabSelected
  let status = ''
  if (tabNum == '0') {
    status = ''
  } else {
    status = state.orderStatusEntrance[tabNum - 1].orderEntranceStatus
  }
  const orderStatus = status
  let postData = {
    page,
    pageSize,
    orderStatusEquals: status,
    searchCount: true,
    // businessEquals: 'RETAIL_CATERING',
  }
  if (postData.orderStatusEquals !== '') {
    postData = {
      ...postData,
      refund: true,
    }
  }
  let tempList = []
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    // 保存当前请求的Promise和abort函数
    const requestPromise = orderService.query(postData)
    const currentRequest = {
      promise: requestPromise,
      abort: () => {
        // 这里可以添加取消请求的逻辑，如果orderService支持的话
        console.log('Request aborted for tab:', tabNum)
      },
    }

    // 保存当前请求到data中
    state.currentRequest = currentRequest
    tempList = requestPromise
      .then((res) => {
        // 检查返回时的tab是否与发起请求时的tab一致
        if (state.tabSelected !== tabNum) {
          console.log('Tab changed, ignoring response')
          return []
        }
        console.log(res)
        const tempOrderList = []
        res.records.forEach((item) => {
          if (item.business !== 'SCORE') {
            let itemStatus = item.status
            if (item.status === 'CREATED') {
              const date = new util.ResponseDate()
              const createTimeStamp = new Date(item.createTime.replace(/-/g, '/')).getTime()
              const now = new Date(util.formatTime(date)).getTime()
              if (now >= createTimeStamp + autoCancelPeriod) {
                item.status = 'CANCELED'
                itemStatus = 'CANCELED'
              }
            }
            let cashTotal = item.cashTotal ? item.cashTotal.toFixed(2) : '0.00'
            let orderCanRefund = true
            // 处理预售订单付完全款
            if (item.business === 'ADVANCE_SELL' && item.status !== 'WAITPAYBALANCE') {
              // 业态为预售且状态不是待付尾款
              if (item.balanceTotal && item.balanceTotal != null) {
                cashTotal = (parseFloat(cashTotal) + item.balanceTotal).toFixed(2)
              }
              if (item.shipmentType === 'SELF' && item.selfTimeScope) {
                const now = new util.ResponseDate().getTime()
                // 正则自提校验时间格式1  2018-12-20 20:00:00~2018-12-20 21:15:00
                const reg =
                  /^([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})\~([1-2]{1}\d{3})\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[1-9]{1})|([1-2]{1}\d{1})|([3]{1}[0-1]{1}))\s(([0-1]{1}\d{1})|([2]{1}[0-3]))\:([0-5]{1}\d{1}):([0-5]{1}\d{1})$/
                if (reg.test(item.selfTimeScope)) {
                  const timeScope = item.selfTimeScope
                  const timeArr = timeScope.split('~')
                  const selfStartTime = new Date(timeArr[0].replace(/-/g, '/')).getTime()
                  if (now >= selfStartTime) {
                    // 已过自提时间不能退款
                    orderCanRefund = false
                  }
                }
              }
            }
            // 计算支付渠道优惠金额
            if (item.promotionTotalFee) {
              cashTotal =
                Number(cashTotal) - Number(item.promotionTotalFee) > 0
                  ? (Number(cashTotal) - Number(item.promotionTotalFee)).toFixed(2)
                  : '0.00'
            }
            let canOneMore = true
            if (
              item.type === 'TEAMBUING' ||
              item.type === 'ADVANCE_SELL' ||
              item.type === 'SCORE_PRICE' ||
              item.type === 'BARGIN' ||
              item.type === 'OFFLINE' ||
              item.type === 'PENNY'
            ) {
              canOneMore = false
            }
            let tempItem = {
              type: '',
              orderNum: item.id,
              status: handleOrderStatus(item.status, item.business),
              business: item.business,
              storeName: item.storeName,
              // 发货门店名称
              storeId: item.storeId,
              shipmentAmount: item.shipmentAmount
                ? item.deductibleShipmentAmonut
                  ? (item.shipmentAmount - item.deductibleShipmentAmonut).toFixed(2)
                  : item.shipmentAmount.toFixed(2)
                : '0.00',
              // 运费
              details: [],
              buyNumber: item.buyNumber ? item.buyNumber : 0,
              totalPrice: cashTotal,
              teamId: item.teamId,
              teamLeaderRecordId: item.teamLeaderRecordId,
              shipmentType: item.shipmentType,
              orderCanRefund,
              ordertype: item.type,
              canShowService: false,
              canOneMore,
              parentId: item.parentId,
              trackingNumber: item.trackingNumber,
              mobile: item.mobile,
              receiverMobile: item.receiverMobile,
              storeOrderIcon: state.imagesPath.iconStore,
              sendOrderId: item.sendOrderId ? item.sendOrderId : item.orderNumber,
              isDel: false,
            }
            if (item.images) {
              item.images.forEach((i) => {
                tempItem.count += parseInt(i.goodsNum)
                let isFictitiousProduct = false
                if (
                  app.globalData.systemConfigure.fictitiousProductId &&
                  i.productId === app.globalData.systemConfigure.fictitiousProductId
                ) {
                  isFictitiousProduct = true
                }
                const data = {
                  id: i.productId,
                  img: i.url,
                  goodsName: i.goodsName,
                  goodsNum: i.productNum,
                }
                if (isFictitiousProduct) {
                  data.img = state.imagesPath.iconOffLine
                }
                tempItem.details.push(data)
              })
            } else {
              tempItem.count = 0
            }
            if (item.advanceId) {
              tempItem = {
                ...tempItem,
                advanceId: item.advanceId,
              }
            }
            if (item.type !== 'CYCLE') {
              if (item.teamId != '' && item.teamId != null) {
                tempItem.type = '拼团'
              } else {
                tempItem.type = ''
              }
            }
            if (item.canRefund === false && itemStatus !== 'REJECTED') {
              tempItem.status = '退款中'
              if (tempItem.type === 'SOLITAIRE') {
                tempItem.status = '接龙失败，退款中'
              }
            }
            if (item.type === 'SOLITAIRE') {
              if (item.solitaireRecordStatus === 'NORMAL' && item.canRefund) {
                tempItem.status = '接龙中'
              } else if (
                item.type === 'SOLITAIRE' &&
                (tempItem.status === '退款中' || tempItem.status === '已退款')
              ) {
                tempItem.status = '接龙失败，' + tempItem.status
              } else if (item.solitaireRecordStatus === 'REFUND') {
                tempItem.status = '接龙失败，已退款'
              } else if (
                !item.canRefund &&
                tempItem.status !== '退款中' &&
                tempItem.status !== '已退款'
              ) {
                tempItem.status = '接龙失败，退款中'
              }
            }
            if (item.type === 'CYCLE') {
              tempItem.type = item.type
              tempItem.cyclePhase = item.cyclePhase
              tempItem.cyclePhaseTotal = item.cyclePhaseTotal
            }
            if (orderStatus === '') {
              // 所有订单
              if (
                (itemStatus === 'PAID' || itemStatus === 'WAITSHIPPED') &&
                item.teamId != '' &&
                item.teamId != null &&
                item.canRefund === true
              ) {
                tempItem.status = '待拼团'
                tempOrderList.push(tempItem)
                let teamInfo = null
                teamBuyService
                  .getById(item.teamId)
                  .then((res) => {
                    teamInfo = res
                    return teamBuyService.getRecordsByLeaderId(item.teamLeaderRecordId)
                  })
                  .then((res) => {
                    console.log(res)
                    const openTeamTime = res.leader.startTime
                      ? res.leader.startTime
                      : res.leader.createTime // 开团时间
                    const timeStamp = new Date(openTeamTime.replace(/-/g, '/')).getTime()
                    const newTimeStamp = parseInt(timeStamp + teamInfo.duration * 1000)
                    const now = new util.ResponseDate().getTime()
                    let teamStatus = ''
                    let status = tempItem.status
                    if (teamInfo.teamMemberCount === res.leader.joinMemberCount) {
                      teamStatus = 'success' // 团购状态正常
                      status = '已成团'
                    } else {
                      if (now > newTimeStamp) {
                        teamStatus = 'overdue' // 团购已过期
                        status = '已过期' // 退款中
                      } else {
                        teamStatus = 'normal' // 团购状态正常
                      }
                    }
                    let sharePicture = null
                    if (teamInfo.sharePicture) {
                      sharePicture = teamInfo.sharePicture
                    }
                    const tempOrderList = state.allOrders
                    tempOrderList.forEach((ele, i) => {
                      if (ele.teamLeaderRecordId === res.leader.id) {
                        tempOrderList[i].teamStatus = teamStatus
                        tempOrderList[i].status = status
                        if (sharePicture != null) {
                          tempOrderList[i].sharePicture = sharePicture
                        }
                      }
                    })
                    state.allOrders = tempOrderList
                  })
              } else {
                tempOrderList.push(tempItem)
              }
            } else if (
              orderStatus === 'PAID' &&
              item.teamId != '' &&
              item.teamId != null &&
              item.canRefund === true
            ) {
              // 待拼团
              tempItem.status = '待拼团'
              tempOrderList.push(tempItem)
            } else {
              // 待自提
              tempOrderList.push(tempItem)
            }
          } else {
          }
        })
        const pageCount = parseInt(res.recordCount / res.pageSize) + 1
        state.pageIndex = res.page
        state.onlineCount = pageCount
        return tempOrderList
      })
      .catch((e) => {
        util.showToast(e.message)
      })
  } else {
  }
  return tempList
}
function handleOrderStatus(status, business) {
  if (status === 'CREATED') {
    return '待付款'
  } else if (status === 'PAID') {
    return '已付款'
  } else if (status === 'SHIPPED') {
    return '配送中'
  } else if (status === 'RECEIVED') {
    return '待评价'
  } else if (status === 'FINISHED') {
    return '已完成'
  } else if (status === 'CANCELED') {
    return '已作废'
  } else if (status === 'REJECTED') {
    return '已退款'
  } else if (status === 'RETURNING') {
    return '退换货中 '
  } else if (status === 'PENDING') {
    return business == 'SERVICE' ? '待服务' : '待自提'
  } else if (status === 'WAITSHIPPED') {
    return '待发货'
  } else if (status === 'WAITPAYBALANCE') {
    return '待付尾款'
  } else if (status === 'PARTREJECTED') {
    return '部分退款'
  } else if (status === 'PAYFAILED') {
    return '支付失败'
  } else {
    return status
  }
}
function toCancel(val) {
  const self = this
  console.log(val)
  const orderId = val.currentTarget.dataset.id
  console.log(orderId)
  uni.showModal({
    title: '提示',
    content: '确认要取消该订单？',
    success: function (res) {
      if (res.confirm) {
        uni.showLoading({
          title: '处理中',
          mask: true,
        })
        orderService
          .cancel(orderId)
          .then((item) => {
            uni.hideLoading()
            getOrderData(state.tabSelected)
            uni.showToast({
              title: '取消成功',
              icon: 'none',
              duration: 2000,
            })
          })
          .catch((err) => {
            uni.hideLoading()
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000,
            })
          })
      } else if (res.cancel) {
      }
    },
  })
}
function toPay(val) {
  const self = this
  const orderId = val.currentTarget.dataset.id
  const orderList = state.allOrders
  let order = null
  orderList.forEach((ele) => {
    if (ele.parentId === orderId) {
      order = ele
    }
  })
  if (order.ordertype === 'PENNY') {
    // 处理购物抽奖订单
    state.order = order
    state.payType = 'penny'
  } else {
    const orderId = val.currentTarget.dataset.id
    toPayMethod(orderId, 'normal')
  }
}
function toPayMethod(orderId, type) {
  const orderList = state.allOrders
  let order = null
  orderList.forEach((ele) => {
    if (ele.parentId === orderId) {
      order = ele
    }
  })
  const opts =
    '?orderId=' +
    orderId +
    '&from=order&type=' +
    type +
    '&dingdan=dingdan' +
    '&parentId=' +
    order.parentId +
    '&orderType=' +
    order.ordertype
  NAVPAGE.toPayMethod(opts)
}
function toPayTail(val) {
  const self = this
  console.log(val)
  const orderId = val.currentTarget.dataset.id
  const orderList = state.allOrders
  let advanceId = null
  let productId = null
  let order = null
  orderList.forEach((ele) => {
    if (ele.parentId === orderId) {
      advanceId = ele.advanceId
      productId = ele.details[0].id
      order = ele
    }
  })
  advanceSellService.getByIds(advanceId, productId).then((res) => {
    console.log(res)
    const now = new util.ResponseDate()
    const nowTimeStamp = new Date(util.formatTime(now)).getTime()
    const startTimeStamp = new Date(res.balanceStartTime.replace(/-/g, '/')).getTime()
    const endTimeStamp = new Date(res.balanceEndTime.replace(/-/g, '/')).getTime()
    const startTime = res.balanceStartTime.split(' ')[0]
    const startArray = startTime.split('-')
    const newStart = startArray[0] + '年' + startArray[1] + '月' + startArray[2] + '日'
    const endTime = res.balanceEndTime.split(' ')[0]
    const endArray = endTime.split('-')
    const newEnd = endArray[0] + '年' + endArray[1] + '月' + endArray[2] + '日'
    if (nowTimeStamp < startTimeStamp) {
      // 未到支付尾款时间
      uni.showToast({
        title: '请于' + newStart + '至' + newEnd + '期间支付尾款',
        icon: 'none',
        duration: 2000,
      })
    } else if (startTimeStamp <= nowTimeStamp && nowTimeStamp <= endTimeStamp) {
      // 支付尾款时间段内
      // self.toPayMethod(orderId, 'payTail')
      state.order = order
      state.payType = 'payTail'
    } else {
      // 已过支付尾款时间
      uni.showToast({
        title: '很抱歉，您的订单已经超过支付尾款的最后期限了~',
        icon: 'none',
        duration: 2000,
      })
    }
  })
}
function toOrderDetails(val) {
  const orderId = val.currentTarget.dataset.id
  const tradens = val.currentTarget.dataset.tradens
  const cycleOrderId = val.currentTarget.dataset.parent
  const cycleOrdertype = val.currentTarget.dataset.ordertype
  const orderType = val.currentTarget.dataset.type
  const status = val.currentTarget.dataset.status
  const id = cycleOrdertype === 'CYCLE' && status == '待付款' ? cycleOrderId : orderId
  let opts =
    '?orderId=' +
    (status == '待付款' ? cycleOrderId : id) +
    '&status=' +
    status +
    '&orderType=' +
    cycleOrdertype
  // let opts = '?orderId=' + (status == '待付款' || cycleOrdertype == 'MIXED'? cycleOrderId : id) + '&status=' + (cycleOrdertype != 'MIXED' ? status : '待付款') + '&orderType=' + cycleOrdertype;
  if (orderType != null && orderType === 'OFFLINE') {
    if (state.isOpenStoreOrder) {
      opts = opts.replace('orderId', 'storeOrderId')
      opts += opts.indexOf('?') == -1 ? '?tradeNS=' + tradens : '&tradeNS=' + tradens
      NAVPAGE.toOrderDetails(opts)
    } else {
      NAVPAGE.toOfflineOrderDetails(opts)
    }
  } else {
    NAVPAGE.toOrderDetails(opts)
  }
  for (let i = 0; i < state.allOrders.length; i++) {
    state.allOrders[i].isDel = false
  }
  state.allOrders = state.allOrders
}
function handleConfirmReceipt(val) {
  const self = this
  const orderId = val.currentTarget.dataset.id
  uni.showModal({
    title: '提示',
    content: '请确认已经收到商品？',
    success: function (res) {
      if (res.confirm) {
        orderService.confirm(orderId).then((item) => {
          getOrderData(state.tabSelected)
        })
      } else if (res.cancel) {
      }
    },
  })
}
function toRefundGoods(val) {
  console.log('点击了退款')
  const orderId = val.currentTarget.dataset.id
  const pack = val.currentTarget.dataset.pack
  console.log(!pack, 'val.currentTarget.dataset.status', val.currentTarget.dataset.type)
  // || val.currentTarget.dataset.status == '部分退款'
  if (
    (val.currentTarget.dataset.status == '待发货' ||
      val.currentTarget.dataset.status == '待自提' ||
      val.currentTarget.dataset.status == '待服务' ||
      val.currentTarget.dataset.status == '待拼团' ||
      val.currentTarget.dataset.status == '已付款' ||
      val.currentTarget.dataset.status == '接龙中') &&
    !pack
  ) {
    const opts = '?orderId=' + orderId + '&afterSaleType=' + val.currentTarget.dataset.type
    NAVPAGE.toRefund(opts)
    //    function handleToRefundGoods() {
    //       let opts = '?orderId=' + orderId;
    //       NAVPAGE.toRefund(opts);
    //     }
  } else {
    console.log('打开弹层')
    state.afterShow = true
    state.afteRorderId = orderId
  }
  handleSubscriptionMessage(subscribeMessage.scene.REFUND, handleToRefundGoods)
}
function toRefundPage(val) {
  console.log('val', val)
  if (val.currentTarget.dataset.id === 'REFUND') {
    const opts =
      '?orderId=' + state.afteRorderId + '&afterSaleType=' + val.currentTarget.dataset.type
    NAVPAGE.toRefund(opts)
  } else {
    const opts =
      '?orderId=' + state.afteRorderId + '&afterSaleType=' + val.currentTarget.dataset.type
    NAVPAGE.toRefund(opts)
  }
  state.afterShow = false
}
function showPopu() {
  console.log('点击了')
  state.afterShow = false
}
function handleSubscriptionMessage(SCENE, originalOperation) {
  const that = this
  // 查询订阅消息
  if (app.globalData.templateIdsQuery) {
    handleSubscribeMessage()
  } else {
    subscribeMessage
      .getTemplateIds()
      .then((res) => {
        handleSubscribeMessage()
      })
      .catch((err) => {
        console.log(err.message)
        originalOperation()
        log.warn('查询模板id报错：', err.message)
      })
  }
  function handleSubscribeMessage() {
    let templateIds = []
    templateIds = subscribeMessage.handleTemplateIds(SCENE)
    console.log(templateIds)
    if (templateIds.length > 0) {
      if (uni.requestSubscribeMessage) {
        uni.requestSubscribeMessage({
          tmplIds: templateIds,
          success(res) {
            console.log(res)
            subscribeMessage.addSubscribe(SCENE, res)
            log.info(res)
            originalOperation()
          },
          fail(err) {
            console.log(err)
            log.warn(err)
            originalOperation()
          },
        })
      } else {
        log.warn('api wx.requestSubscribeMessage 当前版本不支持')
        originalOperation()
      }
    } else {
      log.info('模板id未获取到')
      originalOperation()
    }
  }
}
function toEvaluate(val) {
  const orderId = val.currentTarget.dataset.id
  const opts = '?orderId=' + orderId
  NAVPAGE.toEvaluate(opts)
}
function toHome() {
  NAVPAGE.toHome()
}
function toService(val) {
  const that = this
  const orderId = val.currentTarget.dataset.id
  let order = null
  for (let i = 0; i < state.allOrders.length; i++) {
    const it = state.allOrders[i]
    if (it.orderNum === orderId) {
      order = it
      break
    }
  }
  let serviceTel = null
  if (app.globalData.servicePhone !== '') {
    serviceTel = app.globalData.servicePhone
  }
  if (order) {
    handleSubscriptionMessage(subscribeMessage.scene.REFUND, handleOrderService)
    function handleOrderService() {
      storeService
        .getById(order.storeId)
        .then((res) => {
          if (res) {
            let tel = ''
            if (res.tel != null && res.tel !== '') {
              tel = res.tel
            } else {
              tel = serviceTel
            }
            myMakePhoneCall(tel)
          } else {
            myMakePhoneCall(serviceTel)
          }
        })
        .catch((err) => {
          // 查询门店信息失败
          myMakePhoneCall(serviceTel)
        })
    }
  }
  function myMakePhoneCall(tel) {
    uni.showModal({
      title: '提示',
      content: '确认要拨打此电话' + tel,
      success: function (res) {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: tel,
          })
        } else if (res.cancel) {
        }
      },
    })
  }
}
function getWaitPayedTail() {
  const postData = {
    page: 1,
    pageSize: 0,
    orderStatusEquals: 'WAITPAYBALANCE',
  }
  orderService
    .query(postData)
    .then((res) => {
      console.log(res)
      const tempWaitOrderList = []
      res.records.forEach((item) => {
        const itemStatus = item.status
        item.storeOrderIcon = state.imagesPath.iconStore
        const tempItem = {
          type: '',
          orderNum: item.id,
          status: app.globalData.orderStatus[item.status].name,
          storeName: item.storeName,
          // 发货门店名称
          storeId: item.storeId,
          shipmentAmount: item.shipmentAmount
            ? item.deductibleShipmentAmonut
              ? (item.shipmentAmount - item.deductibleShipmentAmonut).toFixed(2)
              : item.shipmentAmount.toFixed(2)
            : '0.00',
          // 运费
          details: [],
          buyNumber: item.buyNumber ? item.buyNumber : 0,
          totalPrice: item.cashTotal,
          teamId: item.teamId,
          teamLeaderRecordId: item.teamLeaderRecordId,
          advanceId: item.advanceId,
          trackingNumber: item.trackingNumber,
          sendOrderId: item.sendOrderId ? item.sendOrderId : item.orderNumber,
        }
        if (item.images) {
          item.images.forEach((i) => {
            tempItem.count += parseInt(i.goodsNum)
            tempItem.details.push({
              id: i.productId,
              img: i.url,
              goodsName: i.goodsName,
              goodsNum: i.productNum,
            })
          })
        } else {
          tempItem.count = 0
        }
        tempWaitOrderList.push(tempItem)
      })
      state.unPayedTailOrders = tempWaitOrderList
    })
    .catch((e) => {
      console.log(e.message)
    })
}
function loadOrderList(page) {
  const that = this
  const pageSize = state.pageSize
  const tabNum = state.tabSelected
  state.loading = true
  const tempData = queryOrderList(page, pageSize)
  Promise.all([tempData]).then((res) => {
    // if (res[0].length > 0) {
    const allOrders = state.allOrders
    console.log(allOrders)
    const tempArray = allOrders.concat(res[0])
    state.allOrders = tempArray
    state.loading = false
  })
}
function handleSwitchOrder(e) {
  const that = this
  // 调用接口查询订单
  state.orderTab = e.currentTarget.dataset.idx
  state.tabSelected = 0
  if (state.orderTab == 0) {
    // 线上订单
    state.pageIndex = 1
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        if (state.type === 'payedTail') {
          getWaitPayedTail()
        } else {
          getOrderData(state.tabSelected)
        }
      } else {
        uni.showToast({
          title: '您还不是会员，请先绑定手机号码成为会员',
          icon: 'none',
          duration: 2000,
        })
      }
    }
  } else {
    // 线下订单
    state.offlineOrders = []
    state.page = 1
    state.pageCount = 1
    state.noMore = false
    if (state.isOpenStoreOrder) {
      queryTradeOrder(1)
    } else {
      queryOfflineOrder(1)
    }
  }
}
function queryTradeOrder(page) {
  const self = this
  const postData = {
    page,
    pageSize: 10,
    searchCount: true,
    memberIdEquals: app.globalData.userInfo.member.id,
    sorters: {
      tranTime: 'desc',
    },
  }
  offlineOrderServcice
    .tradeQuery(postData)
    .then((res) => {
      if (!res || !res.records || res.records.length === 0) {
        if (state.loading) {
          state.loading = false
        }
        return
      }
      let tempList = state.offlineOrders
      res.records.forEach((item) => {
        const total = item.cashTotal ? item.cashTotal.toFixed(2) : '0.00'
        const tempItem = {
          ...item,
          xid: item.xid || item.id || item.tradeId,
          id: item.xid || item.id || item.tradeId,
          status: item.status == 'REJECTED' ? '已退款' : '已完成',
          total,
          count: 0,
          orderType: 'storeOrder',
          storeOrderIcon: state.imagesPath.storeOrderIcon,
          storeOrderDefaultIcon: state.imagesPath.storeOrderDefaultIcon,
        }
        if (item.products) {
          item.products.forEach((i) => {
            tempItem.count += parseInt(i.productNum)
          })
        }
        tempList.push(tempItem)
      })
      const pageCount = parseInt(res.recordCount / res.pageSize) + 1
      if (state.tabSelected == 1) {
        tempList = tempList.filter((item) => {
          return item.status == '已完成'
        })
      }
      state.page = page
      state.pageCount = pageCount
      state.offlineOrders = tempList
      if (state.loading) {
        state.loading = false
      }
    })
    .catch((err) => {
      util.showToast(err.message)
      if (state.loading) {
        state.loading = false
      }
    })
}
function queryOfflineOrder(page) {
  const self = this
  const postData = {
    page,
    pageSize: 10,
    searchCount: true,
  }
  offlineOrderServcice
    .query(postData)
    .then((res) => {
      if (!res || !res.records || res.records.length === 0) {
        return
      }
      const tempList = state.offlineOrders
      res.records.forEach((item) => {
        const total = item.total ? item.total.toFixed(2) : '0.00'
        const tempItem = {
          ...item,
          xid: item.xid || item.id,
          status: '已完成',
          total,
          count: 0,
        }
        if (item.products) {
          item.products.forEach((i) => {
            tempItem.count += parseInt(i.productNum)
          })
        }
        tempList.push(tempItem)
      })
      const pageCount = parseInt(res.recordCount / res.pageSize) + 1
      state.page = res.page
      state.pageCount = pageCount
      state.offlineOrders = tempList
      if (state.loading) {
        state.loading = false
      }
    })
    .catch((err) => {
      util.showToast(err.message)
      if (state.loading) {
        state.loading = false
      }
    })
}
function toMoneyGoing(val) {
  const orderId = val.currentTarget.dataset.id
  const opts = '?orderId=' + orderId
  NAVPAGE.toMoneyGoing(opts)
}
function toGoodsDetails(val) {
  toOrderDetails(val)
}
function shareGroup(val) {
  // 查询订阅消息
  if (app.globalData.templateIdsQuery) {
    handleSubscribeMessage()
  } else {
    subscribeMessage
      .getTemplateIds()
      .then((res) => {
        handleSubscribeMessage()
      })
      .catch((err) => {
        console.log(err.message)
        log.warn('查询模板id报错：', err.message)
      })
  }
  function handleSubscribeMessage() {
    let templateIds = []
    templateIds = subscribeMessage.handleTemplateIds(subscribeMessage.scene.GROUP_ORDER)
    console.log(templateIds)
    if (templateIds.length > 0) {
      if (uni.requestSubscribeMessage) {
        uni.requestSubscribeMessage({
          tmplIds: templateIds,
          success(res) {
            console.log(res)
            subscribeMessage.addSubscribe(subscribeMessage.scene.GROUP_ORDER, res)
            log.info(res)
          },
          fail(err) {
            console.log(err)
            log.warn(err)
          },
        })
      } else {
        log.warn('api wx.requestSubscribeMessage 当前版本不支持')
      }
    } else {
      log.info('模板id未获取到')
    }
  }
}
function oneMore(e) {
  const that = this
  const orderId = e.currentTarget.dataset.id
  let order = null
  for (let i = 0; i < state.allOrders.length; i++) {
    const it = state.allOrders[i]
    if (it.orderNum === orderId) {
      order = it
      break
    }
  }
  console.log(order, 'order')
  if (order && order.business === 'DISTRIBUTION') {
    app.globalData.storeIdentification = 'distribution'
  } else {
    app.globalData.storeIdentification = 'normal'
  }
  app.globalData.parameter = {
    orderId,
    storeIdentification: app.globalData.storeIdentification,
    from: 'oneMore',
    shipmentType: order.shipmentType,
  }
  NAVPAGE.toShopcart()
}
function delHandler(e) {
  const orderId = e.currentTarget.dataset.id
  const checkedIndex = state.allOrders.findIndex((item) => item.orderNum === orderId)
  // 排他，选中为关闭 点击为删除展示
  for (let i = 0; i < state.allOrders.length; i++) {
    state.allOrders[i].isDel = false
  }
  if (checkedIndex >= 0) {
    state.allOrders[checkedIndex].isDel = true
  }
  state.allOrders = state.allOrders
}
function delOrder(e) {
  const self = this
  const orderId = e.currentTarget.dataset.id
  for (let i = 0; i < state.allOrders.length; i++) {
    state.allOrders[i].isDel = false
  }
  state.allOrders = state.allOrders
  uni.showModal({
    // title: '确认删除订单',
    content: '订单删除后无法恢复 ， 确定要删除吗？',
    success: function (res) {
      if (res.confirm) {
        orderService
          .deleteOrder(orderId)
          .then((res) => {
            uni.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 2000,
            })
            getOrderData(state.selectedTab)
          })
          .catch((e) => {
            uni.showToast({
              title: e.message,
              icon: 'none',
              duration: 2000,
            })
          })
      }
    },
  })
}
</script>
<style scoped>
/* pages/mallModule/order/order/order.wxss */
/* @import "./orderItem/orderItem.wxss"; */
/* @import "./orderItem/offlineOrderItem.wxss"; */

page {
  background-color: #f1f3f6;
  height: 100%;
  width: 100%;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

.order-box {
  width: 100%;
  height: 100%;
  /* overflow: scroll; */
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
  position: fixed;
  right: 0;
  bottom: 240rpx;
}

.order-tab-box {
  width: 100%;
  /* padding: 20rpx 0; */
  display: flex;
  justify-content: center;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}

.order-tab-box .order-tab-item {
  width: 240rpx;
  height: 80rpx;
  font-size: 30rpx;
  line-height: 80rpx;
  color: #999999;
  text-align: center;
  margin: 0;
  /* border: 2rpx solid #009f55; */
  border-left: 0;
  border-right: 0;
}

.order-tab-box .order-tab-item:first-of-type {
  border-top-left-radius: 6rpx;
  border-bottom-left-radius: 6rpx;
  /* border-left: 2rpx solid #009f55; */
}

.order-tab-box .order-tab-item:last-of-type {
  border-top-right-radius: 6rpx;
  border-bottom-right-radius: 6rpx;
  /* border-right: 2rpx solid #009f55; */
}

.order-tab-box .active {
  position: relative;
  /* background: #009f55; */
  color: #fff;
}
.order-tab-box .active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: -29rpx;
  width: 58rpx;
  height: 4rpx;
  background-color: #fb5606;
}

.top-tab {
  /* overflow: hidden;
  width: 100%; */
  height: 80rpx;
  white-space: nowrap;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}

.top-tab.show-offline-orders {
  top: 104rpx;
}

.tab-item {
  display: inline-block;
  width: 20%;
  height: 100%;
  border-bottom: 4rpx solid transparent;
  text-align: center;
  line-height: 80rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  color: #999999;
}

.tab-item.active {
  color: #009f55;
  border-color: #009f55;
}

.order-list {
  margin-top: 100rpx;
  min-height: calc(100% - 100rpx);
}

.order-list.show-offline-orders {
  margin-top: 164rpx;
  min-height: calc(100% - 164rpx);
}

/* 线下订单 */
.offline-order-list {
  margin-top: 164rpx;
  min-height: calc(100% - 164rpx);
}

.swiper {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow: hidden;
  display: block;
  margin-top: 80rpx;
}

.swiper swiper-item scroll-view {
  white-space: nowrap;
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

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  border-radius: 0;
}

.loading-btn::after {
  border: 0;
}

.order-end {
  color: #009136;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
}
.mantle {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 10, 10, 0.6);
  z-index: 999;
}
.shouhouBox {
  width: 100%;
  height: 450rpx;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  padding: 0 30rpx;
  font-size: 31rpx;
  font-weight: 500;
  color: #404040;
  border-radius: 25rpx 25rpx;
  box-sizing: border-box;
}
.shouhouBox > text {
  display: inline-block;
  width: 100%;
  height: 100rpx;
  text-align: center;
  line-height: 100rpx;
  font-size: 36rpx;
}
.shouhouBox-active {
  width: 100%;
  height: 350rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.active-a {
  position: relative;
  width: 100%;
  font-size: 27rpx;
}

.active-a > view > image {
  width: 40rpx;
  height: 40rpx;
}
.active-one {
  height: 40rpx;
  line-height: 40rpx;
  display: flex;
}
.active-one text {
  margin-left: 20rpx;
}
.Noreceived,
.received {
  width: 100%;
  padding-left: 60rpx;
  box-sizing: border-box;
  color: #9aa6ba;
}
.arrow {
  width: 15rpx;
  height: 40rpx;
  position: absolute;
  top: 50%;
  right: 30rpx;
  transform: translateY(-50%);
}
</style>
