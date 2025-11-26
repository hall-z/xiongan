<template>
  <navigationBar
    :isHome="true"
    style="position: absolute; left: 0; top: 0"
    background=""
    :isShowTopNavigation="true"
    :isShowTopNavigationFlag="false"
    title=""
  ></navigationBar>
  <view
    class="page-content"
    v-if="state.mobile && state.memberInfo"
    style="position: relative; padding-top: 200rpx"
  >
    <image
      style="height: 300rpx"
      class="page_bg_image"
      mode="widthFix"
      :src="state.imagesPath.memberInfoBg"
    ></image>
    <view
      class="top-info"
      style="border-radius: 30rpx; height: 300rpx; width: 694rpx; margin: 0 28rpx 28rpx"
    >
      <image
        style="border-radius: 30rpx"
        class="bg"
        mode="widthFix"
        :src="state.imagesPath.memberCardBg"
      ></image>
      <view class="user-info">
        <image
          class="user-portrait"
          :src="state.memberInfo.avatar1 || state.memberInfo.avatar || state.memberAvatar"
        ></image>
        <view class="user-grade">
          <view class="nickName-box">
            <view class="nickName">{{ state.memberInfo.nickName || state.mobile }}</view>
            <view v-if="isVIP" class="member-nameplate">
              <image class="flower" :src="state.imagesPath.iconVIPFlower"></image>
              <!-- {{systemOptions.vipGradeConfig.name}} -->
            </view>
            <view class="user-sync-box" v-if="isMemberLogin">
              <button
                class="user-sync-button"
                open-type="chooseAvatar"
                @chooseavatar="refreshAvatarA"
              >
                <image
                  class="user-sync-image"
                  :src="state.imagesPath.iconUserRefresh"
                  mode="widthFix"
                ></image>
                <text class="user-sync-text">同步头像与昵称</text>
              </button>
            </view>
          </view>
          <view class="interests_box">
            <view class="vip-nameplate" v-if="state.memberInfo.gradeName">
              <image
                v-if="memberGrade && memberGrade.gradeLablePicture"
                class="vip-nameplate-img"
                :src="memberGrade.gradeLablePicture"
              ></image>
              <text>{{ state.memberInfo.gradeName ? state.memberInfo.gradeName : '' }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="my-info">
        <view>
          <view class="my-info-item balance">
            <view class="num">{{ state.memberInfo.mbrBalance }}</view>
            <view class="name">储值余额</view>
          </view>
          <view class="my-info-item score">
            <view class="num">{{ state.memberInfo.score }}</view>
            <view class="name">我的积分</view>
          </view>
          <!-- <view class="my-info-item coupon">
                <view class="num">{{state.memberInfo.couponNum}}</view>
                <view class="name">优惠券</view>
            </view> -->
          <view class="my-info-item giftCard">
            <view class="num">
              {{ state.memberInfo.giftCardList ? state.memberInfo.giftCardList.length : 0 }}
            </view>
            <view class="name">礼品卡</view>
          </view>
        </view>
      </view>
    </view>
    <view class="order-box">
      <view class="order-tab-box">
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
        style="width: 100%; background-color: #f1f3f6"
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
        style="width: 100%; background-color: #f1f3f6"
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
      </scroll-view>
      <view class="order-list" :hidden="state.orderTab == 1">
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
      <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">
        正在加载...
      </button>
      <view class="order-end" :style="state.themeColor" :hidden="!state.noMore">
        ~我也是有底线的~
      </view>
    </view>
  </view>
  <view class="page-content tip" v-else-if="!state.memberLoading">未查询到会员信息</view>
  <custom-loading v-if="state.loading"></custom-loading>
  <view :class="isIphoneX ? 'iphoneX-height' : ''"></view>
</template>
<script setup>
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiSalesclerkViewingServiceJs from '@/service/api/newretail/salesclerkViewingService'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
// import { onLoad, onPageScroll, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/mallModule/member/salesclerkViewing/salesclerkViewing.js
const IMGAGESPATH = _utilsImagesPathJs
const salesclerkViewingService = _apiSalesclerkViewingServiceJs
const util = _utilsUtilsJs
const state = reactive({
  memberLoading: true,
  loading: false,
  memberAvatar: '',
  pageSize: 50,
  unPayedTailOrders: [],
  floorstatus: false,
  currentRequest: null,
  // 添加当前请求的控制变量
  tabType: ['全部'],
  // 全部是固定都有的
  allOrders: [],
  tabSelected: 0,
  offlineOrders: [],
  page: 1,
  pageCount: 1,
  pageIndex: 1,
  noMore: false,
  orderTab: 0,
  navigationBarTitle: '会员中心',
  imagesPath: IMGAGESPATH,
  memberInfo: {},
  orderStatusEntrance: [],
  mobile: null,
  themeColor: '#FB5606',
  corpId: 'wwdd26becdbaaf3c7f',
  agentId: '1000004',
})
onLoad(function (options) {
  console.log('进入页面', options)
  const that = this
  if (!uni.qy) {
    state.memberLoading = false
  }
  uni.qy &&
    uni.qy.checkSession({
      success: function () {
        // session_key 未过期，并且在本生命周期一直有效
        console.log('session_key未过期')
        getCurExternalContact()
      },
      fail: function () {
        console.log('session_key已过期')
        uni.qy &&
          uni.qy.login({
            success: function (res) {
              salesclerkViewingService
                .loginByjscode(state.corpId, state.agentId, res.code)
                .then((res) => {
                  getCurExternalContact()
                })
            },
            fail: function (res) {
              state.memberLoading = false
            },
          })
      },
    })
  function getCurExternalContact() {
    uni.qy.getCurExternalContact({
      success: function (res1) {
        if (res1 && res1.userId) {
          salesclerkViewingService
            .getExternalcontact(state.corpId, state.agentId, res1.userId)
            .then((res) => {
              console.log('获取信息成功！success', res)
              if (res && res.followedUsers && res.followedUsers.length > 0) {
                let remarkMobiles = null
                res.followedUsers.forEach((item) => {
                  if (item.remarkMobiles && item.remarkMobiles.length > 0) {
                    remarkMobiles = item.remarkMobiles[0]
                  }
                })
                if (remarkMobiles) {
                  state.memberAvatar = res.externalContact.avatar
                  state.options = options
                  state.mobile = remarkMobiles
                  getMemberInfo()
                  getStatusCount()
                  handleSwitchOrder()
                }
                state.memberLoading = false
              } else {
                state.memberLoading = false
              }
            })
        } else {
          state.memberLoading = false
        }
        console.log('登录成功！success', res1)
      },
      fail: function (err) {
        state.memberLoading = false
        console.log('登录失败！err', err)
      },
    })
  }
  // this.setData({
  //   options: options,
  //   mobile: options ? options.mobile : ''
  // })
  // if(!this.data.mobile) return false
  // this.getMemberInfo()
  // this.getStatusCount()
  // this.handleSwitchOrder()
})
function handleSwitchOrder(e) {
  // 调用接口查询订单
  state.orderTab = e ? e.currentTarget.dataset.idx : 0
  state.tabSelected = 0
  if (state.orderTab == 0) {
    // 线上订单
    state.pageIndex = 1
    if (state.type === 'payedTail') {
      getWaitPayedTail()
    } else {
      getOrderData(state.tabSelected)
    }
  } else {
    // 线下订单
    state.offlineOrders = []
    state.page = 1
    state.pageCount = 1
    state.noMore = false
    queryTradeOrder(1)
  }
}
function getStatusCount() {
  salesclerkViewingService
    .getStatusCount({
      mobile: state.mobile,
    })
    .then((res) => {
      if (res) {
        const typeList = ['全部']
        res.forEach((item) => {
          if (app.globalData.orderStatus[item.status]) {
            typeList.push(app.globalData.orderStatus[item.status].name)
          }
          // typeList.push({
          //   value: item,
          //   name: app.globalData.orderStatus && app.globalData.orderStatus[item] && app.globalData.orderStatus[item].name
          // })
        })
        typeList.push('历史单据')
        state.orderStatusEntrance = res
        state.tabType = typeList
      }
    })
}
function getMemberInfo() {
  salesclerkViewingService
    .getByMobileDetails({
      mobile: state.mobile,
    })
    .then((res) => {
      console.log('会员信息:', res)
      state.memberInfo = res
    })
}
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
  if (selectedTab == state.tabType.length - 1) {
    historyOrderActive()
  } else {
    getOrderData(selectedTab)
  }
  if (uni.pageScrollTo && state.floorstatus) {
    uni.pageScrollTo({
      scrollTop: 0,
    })
  }
}
onPageScroll(function (e) {
  if (e.scrollTop > 0) {
    state.floorstatus = true
  }
})
function queryTradeOrder(page) {
  const self = this
  const postData = {
    page,
    pageSize: 10,
    searchCount: true,
    mobileEquals: state.mobile,
    // memberIdEquals: app.globalData.userInfo.member.id,
    sorters: {
      tranTime: 'desc',
    },
  }
  salesclerkViewingService
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
function getWaitPayedTail() {
  const postData = {
    page: 1,
    pageSize: 0,
    orderStatusEquals: 'WAITPAYBALANCE',
    mobileEquals: state.mobile,
  }
  salesclerkViewingService
    .query(postData)
    .then((res) => {
      console.log(res)
      const tempWaitOrderList = []
      res.records.forEach((item) => {
        const itemStatus = item.status
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
function getOrderData(tabSelected) {
  const that = this
  state.pageIndex = 1
  state.loading = false
  const tempData = queryOrderList(1, 50)
  Promise.all([tempData]).then((res) => {
    handleOrderData(res)
  })
  function handleOrderData(res) {
    console.log(res[0])
    const tabNum = tabSelected
    if (res[0].length) {
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
    status = state.orderStatusEntrance[tabNum - 1].status
  }
  const orderStatus = status
  let postData = {
    page,
    pageSize,
    orderStatusEquals: status,
    searchCount: true,
    mobileEquals: state.mobile,
  }
  if (postData.orderStatusEquals !== '') {
    postData = {
      ...postData,
      refund: true,
    }
  }
  let tempList = []
  // 保存当前请求的Promise和abort函数
  const requestPromise = salesclerkViewingService.query(postData)
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
              // let teamInfo = null
              // teamBuyService.getById(item.teamId).then(res => {
              //     teamInfo = res
              //     return teamBuyService.getRecordsByLeaderId(item.teamLeaderRecordId)
              // }).then(res => {
              //     console.log(res)
              //     const openTeamTime = res.leader.startTime ? res.leader.startTime : res.leader.createTime // 开团时间
              //     let timeStamp = new Date(openTeamTime.replace(/-/g, '/')).getTime()
              //     let newTimeStamp = parseInt(timeStamp + (teamInfo.duration * 1000))
              //     const now = new util.ResponseDate().getTime()
              //     let teamStatus = ''
              //     let status = tempItem.status
              //     if (teamInfo.teamMemberCount === res.leader.joinMemberCount) {
              //         teamStatus = 'success' //团购状态正常
              //         status = "已成团"
              //     } else {
              //         if (now > newTimeStamp) {
              //             teamStatus = 'overdue' //团购已过期
              //             status = "已过期" //退款中
              //         } else {
              //             teamStatus = 'normal' //团购状态正常
              //         }
              //     }
              //     let sharePicture = null
              //     if (teamInfo.sharePicture) {
              //         sharePicture = teamInfo.sharePicture
              //     }
              //     let tempOrderList = that.data.allOrders
              //     tempOrderList.forEach((ele, i) => {
              //         if (ele.teamLeaderRecordId === res.leader.id) {
              //             tempOrderList[i].teamStatus = teamStatus
              //             tempOrderList[i].status = status
              //             if (sharePicture != null) {
              //                 tempOrderList[i].sharePicture = sharePicture
              //             }
              //         }
              //     })
              //     that.setData({
              //         allOrders: tempOrderList
              //     })
              // })
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
  return tempList
}
function handleOrderStatus(status) {
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
    return '待自提'
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
onReady(function () {})
onShow(function () {})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
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
onShareAppMessage(function () {})
</script>
<style scoped>
/* @import "./orderItem/orderItem.wxss"; */
/* @import "./orderItem/offlineOrderItem.wxss"; */
page {
  background-color: #f1f3f6;
  height: 100%;
  width: 100%;
}
.page_bg_color,
.page_bg_image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.iphoneX-height {
  height: 50rpx;
  width: 100%;
}

.top-info {
  width: 100%;
  height: 300rpx;
  padding: 50rpx 30rpx 25rpx 30rpx;
  box-sizing: border-box;
  /* 这里需要改成主题色 */
  /* background: #80BD01; */
  text-align: center;
  font-size: 32rpx;
  position: relative;
  overflow: hidden;
}
.bg {
  position: absolute;
  left: 0;
  top: 0;
  /* z-index: -1; */
  width: 100%;
}
.top-bg {
  /* background: #009f55; */
  width: 100%;
  height: 100rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.vip-bg {
  width: 750rpx;
  height: 380rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.user-info {
  display: flex;
  height: 100rpx;
  width: 100%;
  margin-bottom: 46rpx;
  position: relative;
}

.user-info .user-grade {
  height: 100rpx;
  margin-left: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.user-info .user-grade .nickName-box {
  display: flex;
  align-items: center;
  height: 42rpx;
  margin-bottom: 10rpx;
}

.user-info .user-grade view.nickName {
  font-size: 32rpx;
  line-height: 42rpx;
  color: #fff;
  display: block;
  max-width: 360rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.user-info .user-grade view.no-userInfo {
  font-size: 28rpx;
  color: #8b8b8c;
  line-height: 28rpx;
}

.top-info .user-info .member-nameplate {
  min-width: 65rpx;
  height: 30rpx;
  padding: 0 10rpx;
  background: linear-gradient(-60deg, #4e4f54, #3f3d3d);
  border-radius: 6rpx;
  font-size: 24rpx;
  color: #ffeba5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  margin-left: 13rpx;
}

.top-info .user-info .member-nameplate .flower {
  width: 21rpx;
  height: 23rpx;
  margin-right: 7rpx;
}

.top-info .user-info .vip-nameplate {
  min-width: 91rpx;
  height: 40rpx;
  padding: 0 21rpx 0 21rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20rpx;
  font-size: 20rpx;
  color: #3f3d3d;
  text-align: center;
  line-height: 40rpx;
  color: #666666;
  position: relative;
  overflow: hidden;
}

.vip-nameplate image.vip-nameplate-img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}

.vip-nameplate text {
  position: relative;
}

.top-info button.user-portrait-button {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin: 0 0 0 0;
  margin-bottom: 15rpx;
  overflow: hidden;
  z-index: 10;
  background: #ff8561;
}

.top-info image.user-portrait {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  /* border: 15rpx solid #80cdc1; */
  margin-bottom: 15rpx;
  overflow: hidden;
  z-index: 10;
  background-color: #eee;
}

.top-info .MbrQrcodeBox {
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  /* right: 40rpx; */
  /* top: 3%; */
  right: 20rpx;
  /* padding: 20rpx; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.MbrQrcodeBox button {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  left: 0;
  top: 0;
}

.MbrQrcodeBox button::after {
  border: none;
}
.top-info .sign-box {
  position: position;
  right: 30rpx;
}
.top-info .sign {
  position: absolute;
  right: 0;
  top: 20rpx;
  width: 135rpx;
  height: 50rpx;
  line-height: 50rpx;
  background: linear-gradient(180deg, rgba(198, 141, 40, 1) 0%, rgba(167, 113, 17, 1) 100%);
  border-radius: 27rpx;
  font-size: 26rpx;
  color: #ffeacc;
  text-align: center;
  margin-top: 60rpx;
}
.top-info .member-card {
  width: 50rpx;
  height: 50rpx;
  border-radius: 0;
  border: 0;
  margin-bottom: 0;
}

.top-info text {
  position: relative;
  z-index: 10;
  color: #fff;
  margin-bottom: 32rpx;
}

.my-info {
  width: 100%;
  z-index: 5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
}
.my-info .my-info-item {
  width: 220rpx;
  height: 80rpx;
  /* margin-top: 47rpx; */
  /* border-left: 1rpx solid #f1f1f1; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /* padding-left: 24rpx; */
  box-sizing: border-box;
}

.my-info .my-info-item text {
  display: block;
  margin-bottom: 0;
}

.my-info-item .num {
  color: #fff;
  font-size: 32rpx;
  line-height: 36rpx;
  height: 36rpx;
  margin-bottom: 12rpx;
  width: 100%;
  text-align: center;
}

.my-info-item .name {
  color: #fff;
  font-size: 20rpx;
  line-height: 28rpx;
  width: 100%;
  text-align: center;
}

.my-info .my-info-item:last-of-type {
  float: right;
  font-size: 32rpx;
}

.tel {
  font-size: 28rpx;
  line-height: 90rpx;
  color: #313131;
  text-decoration: underline;
  float: right;
  margin-right: 36rpx;
}

.balance {
  font-size: 32rpx;
  line-height: 90rpx;
  color: #ff8561;
  float: right;
  /* margin-right: 36rpx; */
}

.edition-info {
  margin-top: 72rpx;
  font-size: 28rpx;
  color: #d9dbe0;
  line-height: 36rpx;
  width: 100%;
  text-align: center;
}

.popup-content {
  /* height: 264rpx; */
}

.popup-content-box {
  font-size: 34rpx;
  line-height: 50rpx;
  color: #444;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 80rpx;
}

.popup-content-box image {
  width: 255rpx;
}

button.authorization {
  width: 100%;
  height: 100%;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
}

button.authorization::after {
  border: none;
}

.official-account {
  width: 670rpx;
  margin: 0 auto;
}

.banner-box {
  margin-bottom: 20rpx;
  border-radius: 6rpx;
}

.banner-box .banner-wrap {
  padding: 20rpx;
  background: #fff;
}

.banner-box .swiper {
  border-radius: 18rpx;
  overflow: hidden;
}

.banner-box .swiper-item image {
  width: 100%;
  height: 100%;
}

.page-content {
  background-color: #f5f5f5;
}

.content-box {
  width: 100%;
  height: 100vh;
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

/* VIP会员相关 */

.vip-memmber-entrance {
  width: 692rpx;
  height: 124rpx;
  border-radius: 10rpx;
  position: relative;
  margin-bottom: 20rpx;
}

.vip-memmber-entrance image.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.vip-memmber-entrance view.block {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}

.vip-memmber-entrance image.crown {
  width: 55rpx;
  height: 47rpx;
  margin-left: 23rpx;
  margin-right: 6rpx;
}

.vip-memmber-entrance .text {
  width: 438rpx;
}

.vip-memmber-entrance .text .name {
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: bold;
  color: #ffeba5;
}

.vip-memmber-entrance .text .name text {
  color: #fff;
}

.vip-memmber-entrance .text .desc {
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #fff;
  font-style: italic;
  font-size: 22rpx;
  line-height: 42rpx;
}

.vip-memmber-entrance view .button {
  width: 145rpx;
  height: 45rpx;
  background: #ffeba5;
  border-radius: 23rpx;
  font-size: 24rpx;
  color: #201f1f;
  text-align: center;
  line-height: 45rpx;
  font-weight: bold;
  margin-right: 14rpx;
  margin-left: 11rpx;
}

.user-sync-button {
  padding: 0 12rpx;
  margin-left: 12rpx;
  color: #fff;
  height: 38rpx;
  border: 2rpx solid #ffffff;
  border-radius: 21rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}

.user-sync-button::after {
  border: none;
}

.user-sync-image {
  width: 20rpx;
  height: 20rpx;
  margin-right: 12rpx;
}

.user-sync-text {
  font-size: 20rpx;
  line-height: 42rpx;
  margin-bottom: 0 !important;
}
.interests_box {
  display: flex;
  font-size: 22rpx;
  align-items: center;
}
.interests_box .interests {
  margin-left: 15rpx;
  color: #fff;
}

.order-box {
  width: 100%;
  height: 100%;
  /* overflow: scroll; */
}

.order-tab-box {
  width: 100%;
  /* padding: 20rpx 0; */
  display: flex;
  justify-content: center;
  background: #fff;
  /* position: fixed;
    top: 0;
    left: 0;
    z-index: 99; */
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
  /* position: fixed;
    top: 0;
    left: 0;
    z-index: 99; */
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
  /* margin-top: 100rpx; */
  min-height: calc(100% - 100rpx);
}

.order-list.show-offline-orders {
  margin-top: 164rpx;
  min-height: calc(100% - 164rpx);
}

/* 线下订单 */
.offline-order-list {
  /* margin-top: 164rpx; */
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
.tip {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
