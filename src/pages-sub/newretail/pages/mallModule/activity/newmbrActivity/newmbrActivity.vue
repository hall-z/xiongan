<template>
  <!--pages/activity/newmbrActivity/newmbrActivity.wxml-->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <!-- banner 图片 -->

  <!--<template is="add-cart-animation" :data=""></template>-->
  <view class="banner-box" v-if="state.banners.length > 0">
    <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" circular="true">
      <view v-for="(item, index) in state.banners" :key="index">
        <swiper-item class="swiper-item" :data-id="item.id" @click="bannerJumping">
          <image :src="item.pictureUrl" class="slide-image"></image>
        </swiper-item>
      </view>
    </swiper>
  </view>
  <!-- 商品列表 -->
  <view class="content">
    <view
      class="goods-item"
      v-for="(item, index) in state.goodsList"
      :key="index"
      :data-goodsId="item.productId"
      :data-activityId="item.activityId"
      :data-goodsNum="item.availableStockAmount"
      :data-balance="item.totalStockAmount"
      :data-traceId="item.traceId"
      @click="toGoodsDetail"
    >
      <view class="goods-img-box">
        <image :src="item.imageUrl" mode="widthFix"></image>
        <image
          class="qiangguang"
          v-if="item.availableStockAmount == 0"
          :src="state.imagesPath.soldOutIcon"
        ></image>
      </view>
      <view class="goods-info">
        <view class="goods-name">
          <text
            v-for="(item, index) in item.produtlabel"
            :key="index"
            v-if="index < 3"
            :style="'background-color:rgb(' + item.color + ')'"
          >
            {{ item.labelName }}
          </text>
          <view>{{ item.productName }}</view>
        </view>
        <text class="goods-desc">{{ item.productDescription ? item.productDescription : '' }}</text>
        <view class="goods-labels">
          <!-- <view >新人专享</view> -->
          <view
            v-for="(item, index) in item.promotions"
            :key="index"
            :data-id="index"
            v-if="index < 3"
            :style="'border-color:rgb(' + item.color + ')'"
          >
            {{ item.labelName }}
          </view>
        </view>
        <view class="goods-price">
          <text class="nowPrice">
            ￥{{ item.price }}
            <text style="font-size: 20rpx" v-if="item.style == 'SPEC_PARENT'">起</text>
          </text>
          <text class="oldPrice" v-if="item.originalPrice && item.price < item.originalPrice">
            ￥{{ item.originalPrice }}
          </text>
        </view>
        <view>
          <button
            v-if="!state.hasUserInfo"
            class="enable"
            :style="'background-color: ' + state.themeColor"
            @click="getUserInfo"
          >
            加入购物车
          </button>
          <button
            v-else-if="!state.isMember"
            class="enable"
            :style="'background-color: ' + state.themeColor"
            @click.stop="toAuthorize"
          >
            加入购物车
          </button>
          <view v-else>
            <form @submit="addShopcart" @click.stop="addShopcartEmpty">
              <button
                class="enable"
                :style="'background-color: ' + state.themeColor"
                form-type="submit"
                :data-index="index"
                :data-id="item.productId"
                :data-activityId="item.activityId"
                :data-style="item.style"
                :data-business="item.business"
                :data-balance="item.availableStockAmount"
                :data-traceId="item.traceId"
              >
                加入购物车
              </button>
            </form>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view class="flow-car" @click="toShopCar">
    <image :src="state.imagesPath.flowCart"></image>
    <view class="red-hint" :hidden="!(cartCount > 0)">{{ cartCount }}</view>
  </view>
  <view class="no-data" :hidden="state.goodsList.length > 0">
    <image :src="state.imagesPath.imgNoData"></image>
    <button
      size="mini"
      @click="toHome"
      :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'"
    >
      随便逛逛
    </button>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsFlyJs from '@/utils/newretail/fly'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiShopcartServiceJs from '@/service/api/newretail/shopcartService'
import _apiHelpActivityServiceJs from '@/service/api/newretail/helpActivityService'
import _apiNewmbrActivityServiceJs from '@/service/api/newretail/newmbrActivityService'
import _apiBannerServiceJs from '@/service/api/newretail/bannerService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bus from 'iny-bus'
const app = getApp()

// pages/activity/newmbrActivity/newmbrActivity.js
const bannerService = _apiBannerServiceJs
const newmbrActivityService = _apiNewmbrActivityServiceJs
const helpActivityService = _apiHelpActivityServiceJs
const shopcartService = _apiShopcartServiceJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const FLY = _utilsFlyJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs

// 获取应用实例
let canAddToCart = true
const state = reactive({
  navigationBarTitle: '新用户专享',
  imagesPath: IMGAGESPATH,
  banners: [],
  goodsList: [],
  hasUserInfo: false,
  isMember: false,
  storeId: '',
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
})
onLoad(function (_options) {
  busPos = {}
  busPos.x = 45 // 购物车的位置
  busPos.y = app.globalData.systemInfo.windowHeight - 56
  const self = this
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    // 统计PV
    state.storeId = app.globalData.storeInfo.id
    state.themeColor =
      app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor')
    ANALYSIS.PVStatistics(state.storeId)
    queryNewMbrActivityMain(app.globalData.storeInfo.id)
    getBannerList(app.globalData.storeInfo.id)
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation()
      .then((res) => {
        app.globalData.storeInfo = res
        // 统计PV
        state.storeId = res.id
        ANALYSIS.PVStatistics(res.id)
        queryNewMbrActivityMain(res.id)
        getBannerList(res.id)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures()
  if (app.globalData.systemConfigure.showCartModule) {
    getProductsCount()
  }
})
function addToCartAnimateTest(e) {}
onReady(function () {})
onShow(function () {
  // 判断用户是否授权
  checkUserInfo()
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {
  if (state.storeId !== '') {
    queryNewMbrActivityMain(state.storeId)
    getBannerList(state.storeId)
    if (app.globalData.systemConfigure.showCartModule) {
      getProductsCount()
    }
  }
})
onReachBottom(function () {})
onShareAppMessage(function () {
  const self = this
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  const sharePictures = state.sharePictures
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const memberId = app.globalData.userInfo.member.id
    return {
      path:
        '/pages-sub/newretail/pages/mallModule/activity/newmbrActivity/newmbrActivity?shareId=' +
        memberId +
        '&storeId=' +
        state.storeId,
      imageUrl: sharePictures,
    }
  }
})
function getNearestStore(allStores, latitude, longitude) {
  const distanceArr = []
  allStores.forEach((item) => {
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
  state.store = allStores[tempIndex].name
  state.storeId = allStores[tempIndex].id
  return tempIndex
}
function getBannerList(storeId) {
  bannerService.getStoreBannerList('NEWMBRACTIVITYADSENSE', storeId).then((res) => {
    console.log(res)
    state.banners = res
  })
}
function queryNewMbrActivityMain(storeId) {
  const that = this
  let storeIdIn = storeId
  ADDRESS.getDistributionStore()
    .then((res) => {
      if (res) {
        storeIdIn = storeIdIn + ',' + res.id
      }
      getNewmbrActivity(storeId)
    })
    .catch((err) => {
      getNewmbrActivity(storeId)
    })
}
function getNewmbrActivity(storeId) {
  const that = this
  newmbrActivityService.getAll(storeId).then((res) => {
    console.log(res)
    const tempList = []
    for (let i = 0; i < res.length; i++) {
      const item = res[i]
      item.products.forEach((ele) => {
        let tempEle = {
          ...ele,
        }
        let specifications = []
        const produtlabel = []
        const promotions = []
        if (ele.labels && ele.labels.length > 0) {
          ele.labels.forEach((item) => {
            if (item.type === 'GOODSLABEL' && item.color != null) {
              produtlabel.push(item)
            } else if (item.type === 'PROMOTIONLABEL') {
              promotions.push(item)
            }
          })
        }
        if (ele.propertys && ele.propertys.length > 0) {
          for (let i = 0; i < ele.propertys.length; i++) {
            const temp = ele.propertys[i]
            if (temp.propertyName === '规格') {
              specifications = temp.propertyValue
              break
            }
          }
        }
        tempEle = {
          ...tempEle,
          specifications,
          produtlabel,
          promotions,
        }
        tempList.push(tempEle)
      })
      break
    }
    state.goodsList = tempList
  })
}
function addShopcartEmpty() {}
function addShopcart(val) {
  console.log(canAddToCart)
  if (!canAddToCart) {
    console.log('==============================正在加入购物车')
    return
  }
  canAddToCart = false
  const that = this
  const balance = val.detail.target.dataset.balance
  const activityId = val.detail.target.dataset.activityid
  const productId = val.detail.target.dataset.id
  const business = val.detail.target.dataset.business
  const style = val.detail.target.dataset.style
  const sharingPersonId = ''
  let hasSharingPersonId = false
  if (canAddToCart === false) {
    console.log(app.globalData.userInfo.member)
    if (app.globalData.userInfo.member.newMember === false) {
      util.showToast('该活动仅限新会员专享哦~', 2000)
      canAddToCart = true
    } else {
      if (balance > 0) {
        if (style !== 'SPEC_PARENT' && style !== 'MEALS2') {
          const postData = {
            storeId: state.storeId,
            lists: [
              {
                count: 1,
                newmbrActivityId: activityId,
                productId,
              },
            ],
          }
          if (app.globalData.isShoppingGuidanceRecordGoods) {
            // 获取分享人id
            const shareData = util.getSharingPersonInfo()
            if (shareData && shareData != null && shareData.productId === productId) {
              postData.lists[0].sharingPersonId = shareData.shareId
              hasSharingPersonId = true
            }
          }
          console.log(postData)
          shopcartService
            .cateringAdd(postData)
            .then((res) => {
              canAddToCart = true
              app.globalData.storeIdentification = 'normal'
              app.globalData.isShopCartChange = true
              uni.showToast({
                title: '加入购物车成功~',
                icon: 'none',
                duration: 2000,
              })
              if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
                util.removeSharingPersonInfo()
              }
              if (app.globalData.systemConfigure.showCartModule) {
                getProductsCount()
              }
              const opts = {
                products: [
                  {
                    productId,
                  },
                ],
              }
            })
            .catch((err) => {
              canAddToCart = true
              if (err.code === 39008) {
                uni.showToast({
                  title: '该活动仅限新会员专享哦~',
                  icon: 'none',
                  duration: 2000,
                })
              } else {
                uni.showToast({
                  title: err.message,
                  icon: 'none',
                  duration: 2000,
                })
              }
            })
        } else {
          canAddToCart = true
          // 多规格商品跳转商品详情
          let goods = null
          for (let i = 0; i < state.goodsList.length; i++) {
            const item = state.goodsList[i]
            if (item.productId === productId) {
              goods = item
            }
          }
          const goodsDetail = JSON.stringify(goods)
          let opts = '?productId=' + productId + '&goodsDetail=' + goodsDetail + '&type=newmbr'
          if (options.shareId) {
            opts = opts + '&shareId=' + options.shareId
          }
          NAVPAGE.toGoodsDetails(opts)
        }
      } else {
        canAddToCart = true
        uni.showToast({
          title: '门店补货中，去其他门店看看吧~',
          icon: 'none',
          duration: 2000,
        })
      }
    }
  }
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
function toHome() {
  NAVPAGE.toHome()
}
function toShopCar() {
  NAVPAGE.toShopcart()
}
function getProductsCount() {
  const that = this
  shopcartService
    .getProductsCount()
    .then((res) => {
      const count = String(res)
      app.globalData.setTabBarBadge('shopping_cart', count)
      state.cartCount = count
      try {
        uni.setStorageSync('wj_userProductsCount', res)
      } catch (e) {}
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function toGoodsDetail(val) {
  console.log(val)
  const that = this
  if (val.currentTarget.dataset.balance > 0) {
    if (val.currentTarget.dataset.goodsnum > 0) {
      const activityId = val.currentTarget.dataset.activityid
      const goodsId = val.currentTarget.dataset.goodsid
      let goods = null
      for (let i = 0; i < state.goodsList.length; i++) {
        const item = state.goodsList[i]
        if (item.productId === goodsId) {
          goods = item
        }
      }
      uni.setStorageSync('newMember_goodsDetail', goods)
      let opts = '?productId=' + goodsId + '&type=newmbr'
      if (options.shareId) {
        opts = opts + '&shareId=' + options.shareId
      }
      console.log(opts, '11111')
      NAVPAGE.toGoodsDetails(opts)
    } else {
      uni.showToast({
        title: '您来晚了，已经被抢光了',
        icon: 'none',
        duration: 2000,
      })
    }
  } else {
    if (val.currentTarget.dataset.goodsnum > 0) {
      uni.showModal({
        title: '提示',
        content: '门店正在努力补货中,去其他门店看看吧~',
        success: function (res) {
          if (res.confirm) {
            NAVPAGE.toHome()
          } else if (res.cancel) {
          }
        },
      })
    } else {
      uni.showToast({
        title: '您来晚了，已经被抢光了',
        icon: 'none',
        duration: 2000,
      })
    }
  }
}
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures
  }
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
function toAuthorize() {
  NAVPAGE.toAuthorize()
}
</script>
<style scoped>
/* pages/activity/newmbrActivity/newmbrActivity.wxss */

page {
  height: 100%;
}

.banner-box {
  width: 670rpx;
  margin: 40rpx auto 12rpx auto;
}

.swiper {
  width: 100%;
  height: 300rpx;
  background: #f0f0f0;
}

.swiper-item {
  width: 100%;
  height: 300rpx;
}

.banner-box image {
  width: 100%;
  height: 300rpx;
  display: block;
}

/* 商品列表 */

.content {
  padding: 0 40rpx;
}

.goods-item {
  /* width: 100%; */
  height: 210rpx;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 28rpx 0;
  overflow: hidden;
}

.goods-img-box {
  width: 210rpx;
  height: 210rpx;
  overflow: hidden;
  float: left;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.goods-img-box image {
  width: 100%;
  height: 100%;
}

.goods-img-box .qiangguang {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
}

.goods-info {
  width: calc(100% - 248rpx);
  height: 100%;
  position: relative;
  float: right;
}

.goods-info .goods-name {
  color: #333;
  font-size: 32rpx;
  line-height: 42rpx;
  height: 42rpx;
  margin: 12rpx 0 2rpx 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.goods-info .goods-name text {
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 6rpx;
  background: #009136;
  color: #fff;
  font-size: 20rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.goods-info .goods-name view {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: Medium;
}

.goods-info .goods-desc {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #999;
  font-size: 24rpx;
  height: 36rpx;
  line-height: 36rpx;
  margin: 2rpx 0rpx 14rpx;
}

.goods-info .goods-labels {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30rpx;
  margin: 0 0 44rpx 0;
}

.goods-info .goods-labels view {
  /* width: 60rpx; */
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 5rpx;
  border: 1rpx solid #ffbc2f;
  font-size: 18rpx;
  line-height: 42rpx;
  color: #ffbc2f;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 8rpx;
  font-weight: normal;
  box-sizing: border-box;
  flex-shrink: 0;
}

.goods-price {
  color: #fd856a;
  font-size: 24rpx;
  line-height: 32rpx;
  position: absolute;
  left: 0;
  bottom: 6rpx;
}

.goods-price .nowPrice {
  font-size: 32rpx;
  margin-right: 9rpx;
}

.goods-price .oldPrice {
  color: #8a8a8a;
  text-decoration: line-through;
}

.goods-info button {
  width: 160rpx;
  height: 70rpx;
  line-height: 70rpx;
  font-weight: bold;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
  padding: 0;
  position: absolute;
  right: 0rpx;
  bottom: 0rpx;
}

.goods-info button::after {
  border: none;
}

.goods-info button.unable {
  background-color: #b2e2cc;
  /* box-shadow: 0px 4px 13px 0px rgba(153, 153, 153, 0.5); */
}

.goods-info button.enable {
  background-color: #009f55;
  /* box-shadow: 0px 4px 13px 0px rgba(255,190,0, 0.5); */
}

.no-data {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  margin-top: 30%;
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
  font-size: 28rpx;
  line-height: 60rpx;
  background: #fff;
}

.flow-car {
  position: fixed;
  left: 40rpx;
  bottom: 200rpx;
  width: 120rpx;
  height: 120rpx;
}

.red-hint {
  position: absolute;
  top: 25rpx;
  right: 25rpx;
  background-color: red;
  color: white;
  font-size: 30rpx;
  height: 40rpx;
  width: 40rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-car image {
  width: 120rpx;
  height: 120rpx;
}
</style>
