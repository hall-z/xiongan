<template>
  <!--pages/advanceSell/advanceSell.wxml-->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>

  <view class="goods-list">
    <view
      class="goods-item"
      v-for="(item, index) in state.goodsList"
      :key="index"
      :data-advanceId="item.id"
      :data-goodsnum="item.advanceBalance"
      :data-status="item.shelvesStatus"
      :data-balance="item.balance"
      :data-productId="item.productId"
      @click="toGoodsDetail"
    >
      <view class="advance-sell-icon">
        <image :src="state.imagesPath.presale_title"></image>
        <text v-if="item.memberLimit">每人限购{{ item.memberLimit }}份</text>
      </view>
      <view class="goods-img-box">
        <image
          class="good_img"
          :src="item.advanceUrl ? item.advanceUrl : item.imageUrl"
          mode="widthFix"
        ></image>
        <view class="no-balance" v-if="item.advanceBalance <= 0 || !item.balance">
          <image mode="heightFix" :src="state.imagesPath.soldOutIcon"></image>
        </view>
      </view>
      <view class="goods-info">
        <view class="name-desc">
          <text class="goods-name">{{ item.productName }}</text>
          <text class="goods-desc" v-if="item.productDescription">
            {{ item.productDescription ? item.productDescription : '' }}
          </text>
        </view>
        <view class="advance-time">
          <text>预售时间：{{ item.advanceSellDate }}</text>
          <view v-if="item.payType === 'PARTIAL'">
            <text>尾款支付时间：{{ item.balanceDate }}</text>
            <text>提货时间：预售活动结束后即可提货</text>
          </view>
          <text v-else>
            {{ item.shipmentType === 'SELF' ? '提货/发货时间' : '配送时间' }}：{{
              item.orderSelfTime !== ''
                ? item.orderSelfTime
                : '预售活动结束' + item.deliveryTime + '天后'
            }}
          </text>
        </view>
        <view class="goods-price">
          <view class="price-item">
            预售价
            <text class="price" :hidden="item.sellPrice ? false : true">
              <text>￥</text>
              {{ item.sellPrice }}
            </text>
          </view>
          <view class="price-item front-money" v-if="item.payType === 'PARTIAL'">
            定金
            <text class="price" :hidden="item.frontPrice ? false : true">
              <text>￥</text>
              {{ item.frontPrice }}
            </text>
          </view>
        </view>
        <view class="button-box">
          <!-- <text wx:if="{{item.memberLimit}}">每人限购{{item.memberLimit}}份</text> -->
          <button
            :class="item.advanceBalance > 0 && item.balance ? 'enable' : 'unable'"
            :style="
              'background: ' +
              (item.advanceBalance > 0 &&
              item.balance &&
              !(item.shelvesStatus == 'OFF' || item.shelvesStatus == 'DELETED')
                ? '#7E21EC'
                : '#d9d9d9')
            "
          >
            <view v-if="item.shelvesStatus == 'OFF' || item.shelvesStatus == 'DELETED'">
              <text>已下架</text>
            </view>
            <view v-else-if="item.payType === 'PARTIAL'"><text>立即付定金</text></view>
            <!-- <text>￥{{item.frontPrice}}</text> -->
            <view v-else>立即预定</view>
          </button>
        </view>
      </view>
    </view>
  </view>
  <view class="loading" :hidden="!state.loading">{{ state.loadText }}</view>
  <view class="no-data" :hidden="state.goodsList.length > 0">
    <image :src="state.imagesPath.imgNoData"></image>
    <button
      size="mini"
      @click="toHome"
      :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor"
    >
      随便逛逛
    </button>
  </view>
  <authorize @login="handleUserLogin"></authorize>
  <image
    class="movable-view"
    v-if="state.homeBack"
    :src="state.imagesPath.toHome"
    @click="toHome"
  ></image>
</template>
<script setup>
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsAddressJs from '@/utils/newretail/address'
import _apiHelpActivityServiceJs from '@/service/api/newretail/helpActivityService'
import _apiAdvanceSellServiceJs from '@/service/api/newretail/advanceSellService'
import _apiBannerServiceJs from '@/service/api/newretail/bannerService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue'
const app = getApp()

// pages/advanceSell/advanceSell.js
const bannerService = _apiBannerServiceJs
const advanceSellService = _apiAdvanceSellServiceJs
const helpActivityService = _apiHelpActivityServiceJs
const ADDRESS = _utilsAddressJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const selfA = _utilsSelfJs
const themeManager = _utilsThemeManagerJs
const wxaUserService = _apiWxaUserServiceJs

// 获取应用实例
const state = reactive({
  navigationBarTitle: '新品预售',
  imagesPath: IMGAGESPATH,
  banners: [],
  goodsList: [],
  storeInfo: {},
  page: 1,
  pageSize: 10,
  loading: false,
  loadText: '正在加载中...',
  noStoreData: false,
  homeBack: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
})
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
  console.log(advertisementInfo)
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
  } else if (pageInfo.linkType === 'BENEFIT_PLAN') {
    NAVPAGE.toBenefitPlan()
  } else if (pageInfo.linkType === 'MEITUAN_XIAOXIANG') {
    NAVPAGE.toMeituan()
  } else if (pageInfo.linkType === 'TOURISM_PLAN') {
    const opts = '?id=' + pageInfo.tourismPlanId
    NAVPAGE.toTourismPlan(opts)
  } else if (pageInfo.pageUrl) {
    uni.navigateTo({
      url: pageInfo.pageUrl,
    })
  } else {
  }
}
function getAdvanceSellGoodsList(page, pageSize) {
  const that = this
  const postData = {
    page,
    pageSize,
    searchCount: true,
    status: 'STARTED',
    storeId: app.globalData.storeInfo.id,
    enable: true,
    status: 'STARTED',
    orderField: 'sort_number',
    orderDirection: 'desc',
  }
  advanceSellService
    .query(postData)
    .then((res) => {
      console.log(res)
      const tempList = []
      if (res.records && res.records.length > 0) {
        res.records.forEach((item) => {
          let tempItem = {
            ...item,
            advanceBalance:
              item.advanceBalance || item.advanceBalance === 0 ? item.advanceBalance : 999,
          }
          function timeToArray(time) {
            const timeArray = time.split(' ')
            const timeList = timeArray[0].split('-')
            const newTime = timeList[1] + '月' + timeList[2] + '日'
            return newTime
          }
          function timeDivision(time) {
            const timeArray = time.split(' ')
            const timeSlot = timeArray[1].slice(0, 5)
            return timeSlot
          }
          function addDay(curDate, days) {
            return new Date((curDate / 1000 + 86400 * days) * 1000)
          }
          const frontStartTime = timeToArray(item.frontStartTime)
          const frontEndTime = timeToArray(item.frontEndTime)
          let balanceStartTime = ''
          let balanceEndTime = ''
          const deliverTime = ''
          let balanceDate = ''
          if (item.payType === 'PARTIAL') {
            balanceStartTime = timeToArray(item.balanceStartTime)
            balanceEndTime = timeToArray(item.balanceEndTime)
            balanceDate =
              balanceStartTime +
              ' ' +
              timeDivision(item.balanceStartTime) +
              '~' +
              balanceEndTime +
              ' ' +
              timeDivision(item.balanceEndTime)
            if (balanceStartTime === balanceEndTime) {
              balanceDate =
                balanceStartTime +
                ' ' +
                timeDivision(item.balanceStartTime) +
                '~' +
                timeDivision(item.balanceEndTime)
            }
          }
          let orderSelfTime = ''
          // 预售自提固定时间
          if (item.selfTimeScope) {
            const selfStartTime = timeToArray(item.selfTimeScope.split('~')[0])
            const selfEndTime = timeToArray(item.selfTimeScope.split('~')[1])
            orderSelfTime =
              selfStartTime +
              ' ' +
              timeDivision(item.selfTimeScope.split('~')[0]) +
              '~' +
              selfEndTime +
              ' ' +
              timeDivision(item.selfTimeScope.split('~')[1])
            if (selfStartTime === selfEndTime) {
              orderSelfTime =
                selfStartTime +
                ' ' +
                timeDivision(item.selfTimeScope.split('~')[0]) +
                '~' +
                timeDivision(item.selfTimeScope.split('~')[1])
            }
          }
          let advanceSellDate =
            frontStartTime +
            ' ' +
            timeDivision(item.frontStartTime) +
            '~' +
            frontEndTime +
            ' ' +
            timeDivision(item.frontEndTime)
          if (frontStartTime === frontEndTime) {
            advanceSellDate =
              frontStartTime +
              ' ' +
              timeDivision(item.frontStartTime) +
              '~' +
              timeDivision(item.frontEndTime)
          }
          tempItem = {
            ...tempItem,
            balanceDate,
            advanceSellDate,
            deliverDate: deliverTime,
            orderSelfTime,
          }
          if (item.enable === true) {
            tempList.push(tempItem)
          }
        })
        console.log(tempList)
        // tempList.forEach(itema=>{
        //     if(itema.advanceUrl){
        //   selfA.getTemporaryUrl(itema.advanceUrl)
        //     .then (res=>{
        //         itema.advanceUrl=res;
        //         that.setData({
        //             goodsList:tempList
        //         })
        //     })
        //     }else{
        //     selfA.getTemporaryUrl(itema.imageUrl)
        //     .then (res=>{
        //         itema.imageUrl=res;
        //         that.setData({
        //             goodsList:tempList
        //         })
        //     })
        //     }
        //     // selfA.getTemporaryUrl(itema.imageUrl)
        //     // .then (res=>{
        //     //     itema.imageUrl=res

        //     // })
        // })
        state.goodsList = tempList
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
function toGoodsDetail(val) {
  console.log(val)
  if (val.currentTarget.dataset.goodsnum <= 0 || !val.currentTarget.dataset.balance) {
    uni.showToast({
      title: '您来晚了，已经被预定光了',
      icon: 'none',
      duration: 2000,
    })
  } else if (
    val.currentTarget.dataset.status == 'OFF' ||
    val.currentTarget.dataset.status == 'DELETED'
  ) {
    uni.showToast({
      title: '商品暂未上架，请到别的门店看看吧！',
      icon: 'none',
      duration: 2000,
    })
  } else {
    const opts =
      '?productId=' +
      val.currentTarget.dataset.productid +
      '&advanceId=' +
      val.currentTarget.dataset.advanceid +
      '&type=advanceSell'
    NAVPAGE.toGoodsDetails(opts)
  }
}
function toHome() {
  NAVPAGE.toHome()
}
function getBannerList(id) {
  // 获取banner图片getStoreBannerList
  bannerService.getStoreBannerList('ADVANCE', id).then((res) => {
    console.log(res)
    state.banners = res
  })
}
onLoad(function (options) {
  const self = this
  const pageStack = getCurrentPages()
  if (pageStack.length === 1) {
    state.homeBack = true
  }
  getAdvanceSellGoodsList(state.page, state.pageSize)
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    // 统计PV
    state.storeInfo = app.globalData.storeInfo
    state.themeColor =
      app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor')
    ANALYSIS.PVStatistics(state.storeInfo.id)
  } else {
    ADDRESS.getLocation().then((res) => {
      // 统计PV
      state.storeInfo = res
      ANALYSIS.PVStatistics(res.id)
    })
  }
  // 设置分享信息
  setSharePeopleInfo(options, 'advanceSell')
  // 获取当前页面分享图
  getSharePictures()
})
onReady(function () {})
onShow(function () {})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {
  state.page = 1
  state.loading = false
  getAdvanceSellGoodsList(state.page, state.pageSize)
  setTimeout(() => {
    // 特别处理iOS下有loading时下拉刷新秒回弹的问题
    uni.stopPullDownRefresh()
  }, 1000)
})
onReachBottom(function () {
  state.loading = true
  const that = this
  let index = state.page
  index++
  const oldGoodsList = state.goodsList
  let newGoodsList = []
  const postData = {
    page: index,
    pageSize: state.pageSize,
    searchCount: true,
    status: 'STARTED',
    storeId: app.globalData.storeInfo.id,
    enable: true,
    status: 'STARTED',
    orderField: 'sort_number',
    orderDirection: 'desc',
  }
  console.log(postData)
  advanceSellService.query(postData).then((res) => {
    console.log(res)
    const tempList = []
    if (res.records) {
      if (res.records.length !== 0) {
        res.records.forEach((item) => {
          let tempItem = {
            ...item,
            advanceBalance:
              item.advanceBalance || item.advanceBalance === 0 ? item.advanceBalance : 999,
          }
          function timeToArray(time) {
            const timeArray = time.split(' ')
            const timeList = timeArray[0].split('-')
            const newTime = timeList[1] + '月' + timeList[2] + '日'
            return newTime
          }
          function timeDivision(time) {
            const timeArray = time.split(' ')
            const timeSlot = timeArray[1].slice(0, 5)
            return timeSlot
          }
          function addDay(curDate, days) {
            return new Date((curDate / 1000 + 86400 * days) * 1000)
          }
          const frontStartTime = timeToArray(item.frontStartTime)
          const frontEndTime = timeToArray(item.frontEndTime)
          let balanceStartTime = ''
          let balanceEndTime = ''
          const deliverTime = ''
          let balanceDate = ''
          if (item.payType === 'PARTIAL') {
            balanceStartTime = timeToArray(item.balanceStartTime)
            balanceEndTime = timeToArray(item.balanceEndTime)
            balanceDate =
              balanceStartTime +
              ' ' +
              timeDivision(item.balanceStartTime) +
              '~' +
              balanceEndTime +
              ' ' +
              timeDivision(item.balanceEndTime)
            if (balanceStartTime === balanceEndTime) {
              balanceDate =
                balanceStartTime +
                ' ' +
                timeDivision(item.balanceStartTime) +
                '~' +
                timeDivision(item.balanceEndTime)
            }
          }
          let orderSelfTime = ''
          // 预售自提固定时间
          if (item.selfTimeScope) {
            const selfStartTime = timeToArray(item.selfTimeScope.split('~')[0])
            const selfEndTime = timeToArray(item.selfTimeScope.split('~')[1])
            orderSelfTime =
              selfStartTime +
              ' ' +
              timeDivision(item.selfTimeScope.split('~')[0]) +
              '~' +
              selfEndTime +
              ' ' +
              timeDivision(item.selfTimeScope.split('~')[1])
            if (selfStartTime === selfEndTime) {
              orderSelfTime =
                selfStartTime +
                ' ' +
                timeDivision(item.selfTimeScope.split('~')[0]) +
                '~' +
                timeDivision(item.selfTimeScope.split('~')[1])
            }
          }
          let advanceSellDate =
            frontStartTime +
            ' ' +
            timeDivision(item.frontStartTime) +
            '~' +
            frontEndTime +
            ' ' +
            timeDivision(item.frontEndTime)
          if (frontStartTime === frontEndTime) {
            advanceSellDate =
              frontStartTime +
              ' ' +
              timeDivision(item.frontStartTime) +
              '~' +
              timeDivision(item.frontEndTime)
          }
          tempItem = {
            ...tempItem,
            balanceDate,
            advanceSellDate,
            deliverDate: deliverTime,
            orderSelfTime,
          }
          if (item.enable === true) {
            tempList.push(tempItem)
          }
        })
        newGoodsList = oldGoodsList.concat(tempList)
        state.goodsList = newGoodsList
        state.page = index
        state.loading = false
      } else {
        uni.hideToast()
        state.loading = true
        state.loadText = '已经加载到底了~'
      }
    }
  })
})
onShareAppMessage(function () {
  const self = this
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  const sharePictures = state.sharePictures
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const memberId = app.globalData.userInfo.member.id
    return {
      path:
        '/pages-sub/newretail/pages/mallModule/activity/advanceSell/advanceSell?shareId=' +
        memberId +
        '&storeId=' +
        state.storeInfo.id,
      imageUrl: sharePictures,
    }
  }
})
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
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures
  }
}
function getSceneById(id) {
  const self = this
  wxaUserService
    .getSceneById(id)
    .then((res) => {
      function urlToObj(str) {
        const obj = {}
        const arr = str.split('&')
        for (let i = 0; i < arr.length; i++) {
          const ele = arr[i].split('=')
          obj[ele[0]] = ele[1]
        }
        return obj
      }
      const _options = urlToObj(res)
      options = _options
      if (_options.shareId != null && _options.shareId !== '') {
        saveSharePerson(_options.shareId)
        // 分享信息打开统计
        ANALYSIS.ShareOpenAnalysis()
      }
    })
    .catch((err) => {
      util.showToast(err.message)
    })
}
function setSharePeopleInfo(options, type) {
  if (options.scene) {
    const scene = decodeURIComponent(options.scene)
    if (scene.indexOf('gmparam:') >= 0) {
      const sceneArr = scene.split('gmparam:')
      const _sceneId = sceneArr[1]
      sceneId = _sceneId != null ? _sceneId : null
      getSceneById(sceneId)
    } else if (scene !== 'isfromQR') {
      const reg = /^[0-9]*$/
      if (reg.test(options.scene)) {
        // 分享信息打开统计
        ANALYSIS.ShareOpenAnalysis()
        saveSharePerson(scene)
      }
    }
  } else if (options.shareId && options.shareId != '' && options.shareId != null) {
    saveSharePerson(options.shareId)
  }
}
function saveSharePerson(shareId) {
  if (!shareId) {
    return
  }
  const shareData = {
    shareId,
    type: 'advanceSell',
    productId: '',
  }
  if (app.globalData.isShoppingGuidanceRecordGoods) {
    util.setSharingPersonInfo(shareData)
  } else {
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
}
</script>
<style scoped>
/* pages/advanceSell/advanceSell.wxss */
page {
  /* background: #F0F0F0; */
}

.store-info {
  height: 126rpx;
  padding: 26rpx 32rpx;
  display: flex;
  color: #454545;
  border-bottom: 1px solid #d5d5d5;
  background: #ffffff;
}

.store-info image {
  width: 126rpx;
  height: 126rpx;
  border-radius: 50%;
  background: #d5d5d5;
  margin-right: 12rpx;
}

.store-info view {
  width: calc(100% - 138rpx);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.store-info view text {
  display: block;
  text-align: left;
}

.store-info view text:first-of-type {
  font-size: 30rpx;
  line-height: 42rpx;
  margin-bottom: 10rpx;
}

.store-info view text:last-of-type {
  font-size: 26rpx;
  line-height: 36rpx;
}

.banner-box {
  width: 100%;
  background: #f0f0f0;
}

.swiper {
  width: 100%;
  height: 375rpx;
}

.swiper-item {
  width: 100%;
  height: 375rpx;
}

.banner-box image {
  width: 100%;
  height: 375rpx;
  display: block;
}

.goods-list {
  width: 100%;
  background: #f0f0f0;
  padding: 20rpx;
  box-sizing: border-box;
}

.goods-item {
  position: relative;
  /* width: 100%; */
  padding: 22rpx;
  background: #ffffff;
  margin-bottom: 20rpx;
  overflow: hidden;
  border-radius: 10rpx;
}

.goods-img-box {
  height: 300rpx;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding-top: 80rpx; */
  box-sizing: border-box;
  margin: 20rpx;
}

.goods-img-box image {
  height: 100%;
}
.goods-img-box .no-balance {
  position: absolute;
  top: 0;
  left: 0;
  height: 300rpx;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.goods-img-box .no-balance image {
  height: 100%;
  width: auto;
}

.advance-sell-icon {
  width: 100%;
  box-sizing: border-box;
  height: 43rpx;
  display: flex;
  color: #999999;
  font-size: 26rpx;
  justify-content: space-between;
  align-items: center;
  margin-top: 6rpx;
}

.advance-sell-icon image {
  width: 152rpx;
  height: 43rpx;
}

.goods-info {
  height: 100%;
  position: relative;
}

.goods-info .name-desc {
  padding: 14rpx 0 4rpx 0;
}

.goods-info .goods-name {
  color: #333;
  display: block;
  width: 100%;
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
  font-size: 30rpx;
  font-weight: bold;
  line-height: 36rpx;
}

.goods-info .goods-desc {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #999999;
  font-size: 21rpx;
  height: 24rpx;
  line-height: 24rpx;
  margin: 17rpx 0rpx 0 0;
}

.advance-time {
  font-size: 24rpx;
  color: #333333;
  line-height: 32rpx;
  margin: 10rpx 0 5rpx 0;
}

.advance-time text {
  display: block;
}

.goods-price {
  font-size: 24rpx;
  color: #333;
  display: flex;
  justify-content: flex-start;
  line-height: 36rpx;
  height: 36rpx;
  padding: 22rpx 0 10rpx;
  font-weight: 700;
}

.goods-price .price {
  color: #ff8425;
  font-size: 43rpx;
}

.goods-price .front-money {
  color: #ff8425;
  margin-left: 49rpx;
}

.goods-price .front-money .price {
  font-size: 43rpx;
  color: #ff8425;
}
.goods-price .price text,
.goods-price .front-money .price text {
  font-size: 25rpx;
  font-weight: 400;
}
.goods-info .button-box {
  position: absolute;
  right: 0;
  bottom: 2rpx;
  text-align: center;
}

.goods-info .button-box text {
  font-size: 24rpx;
  line-height: 32rpx;
}

.goods-info button {
  width: 158rpx;
  height: 60rpx;
  overflow: hidden;
  color: #fff;
  border: none;
  border-radius: 60rpx;
  font-size: 26rpx;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.goods-info .button-box button text {
  line-height: 30rpx;
}

.goods-info button::after {
  border: none;
}

.goods-info button.unable {
  background-color: #d9d9d9;
}

.goods-info button.enable {
  background-color: #009f55;
}

.loading {
  color: #999999;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  display: flex;
  justify-content: center;
}

.no-data {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  margin-top: 200rpx;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  /* position: unset; */
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: #ffffff;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
  position: fixed;
  right: 0;
  bottom: 120rpx;
}
</style>
