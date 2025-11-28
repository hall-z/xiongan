<template>
  <!--pages/mallModule/bargain/helpBargain/helpBargain.wxml-->
  <view>
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <view
      class="top-bg"
      :style="'background: url(' + state.imagesPath.barga_bg + ');background-size: cover'"
    ></view>
    <view class="top-info">
      <view class="scroll-rule">
        <swiper
          class="scroll-box"
          :autoplay="true"
          :vertical="true"
          :interval="2000"
          v-if="state.isBargainCreator && state.bargainInstances.length > 0"
          :circular="true"
        >
          <view v-for="(item, index) in state.bargainInstances" :key="index">
            <swiper-item @touchmove.stop="catchtouchmoveSwiper">
              <view style="text-align: left">{{ item.name }}刚以￥{{ item.finalPrice }}购买</view>
            </swiper-item>
          </view>
        </swiper>
        <view class="creator-box" v-else-if="!state.isBargainCreator">
          <image :src="state.creator.avatar"></image>
          <view class="info" v-if="state.instance.mobile">
            <text>
              {{
                state.instance.creatorName == state.instance.mobile
                  ? filtMobile(item.mobile)
                  : state.instance.creatorName
              }}:
            </text>
            <text>“我发现一件好货，一起来砍价吧！”</text>
          </view>
        </view>
        <view class="bargain-rule" @click="toggleBargainRulesPopup">砍价规则</view>
      </view>
      <bargain-goods
        :balance="balance"
        :bargain-data="state.instance"
        @click="toGoodsDetails"
      ></bargain-goods>
      <view class="bargain-progress">
        <view
          class="title"
          v-if="
            state.bargainStatus === 'CREATE' &&
            !state.instance.orderId &&
            !state.isLowerPrice &&
            !state.isHelpBargain
          "
        >
          已有{{ state.instance.barginNowMemberCount }}人帮助砍掉
          <text class="font-size-48">{{ state.instance.savePrice }}</text>
          元，还剩
          <text>{{ state.instance.finalPrice }}</text>
          元
        </view>
        <view v-if="state.isBargainCreator">
          <view
            class="title"
            v-if="state.isLowerPrice && !state.instance.orderId && state.bargainStatus !== 'FAILED'"
          >
            恭喜你，已砍到最低价！
          </view>
          <view class="title" v-if="state.instance.orderId && state.bargainStatus !== 'FAILED'">
            您已通过
            <text>￥{{ state.instance.finalPrice }}</text>
            购买成功
          </view>
          <view class="tips" v-if="state.bargainStatus === 'SUCCESS'">
            节省了￥{{ state.instance.savePrice }}
          </view>
          <view class="title bargain-failed-box" v-if="state.bargainStatus === 'FAILED'">
            <image
              class="bargain-failed"
              :src="state.imagesPath.iconBargainClose"
              mode="widthFix"
            ></image>
            砍价失败
          </view>
          <view class="title bargain-failed-box" v-else-if="state.isActivityEnd">
            <image
              class="bargain-failed"
              :src="state.imagesPath.iconBargainClose"
              mode="widthFix"
            ></image>
            活动时间已结束，无法购买
          </view>
        </view>
        <view v-else>
          <view class="title" v-if="state.instance.orderId && state.bargainStatus !== 'FAILED'">
            好友已通过
            <text>￥{{ state.instance.finalPrice }}</text>
            购买
          </view>
          <view class="tips" v-if="state.instance.orderId && state.bargainStatus !== 'FAILED'">
            节省了￥{{ state.instance.savePrice }}
          </view>
          <view class="title" v-if="state.isHelpBargain && state.bargainStatus === 'CREATE'">
            已帮助好友砍价，快去发起你的砍价吧！
          </view>
          <view class="title" v-if="state.isLowerPrice && !state.instance.orderId">
            好友已砍至最低价
          </view>
          <view class="title bargain-failed-box" v-if="state.bargainStatus === 'FAILED'">
            <image
              class="bargain-failed"
              :src="state.imagesPath.iconBargainClose"
              mode="widthFix"
            ></image>
            好友砍价失败
          </view>
        </view>
        <view
          class="progress-box"
          v-if="state.bargainStatus === 'CREATE' && !state.instance.orderId"
        >
          <progress
            stroke-width="10"
            v-if="state.bargainStatus === 'CREATE' && !state.instance.orderId"
            :percent="percent"
            troke-width="12"
            border-radius="6"
            activeColor="#FF7103"
            backgroundColor="#FFE6D2"
          >
            <view v-if="'percent'" class="percenticon" :style="'left:' + percent * 6.4 + 'rpx'">
              <image :src="priceicon" mode="widthFix"></image>
            </view>
          </progress>
        </view>
      </view>
      <view class="bargain-button" v-if="state.isBargainCreator">
        <view v-if="state.instance.availableStockAmount > 0 && state.activityStatus !== 'ABORTED'">
          <button
            class="friend-bargain"
            @click="toBargainDetails"
            v-if="state.bargainStatus === 'FAILED' && !state.isActivityEnd"
          >
            再次发起砍价
          </button>
          <button
            class="friend-bargain"
            @click="toBargainList"
            v-else-if="state.instance.orderId || state.isActivityEnd"
          >
            去砍其他好货
          </button>
          <button
            class="friend-bargain"
            @click="toPerfectOrder"
            v-else-if="state.isLowerPrice && !state.instance.orderId && !state.isActivityEnd"
          >
            以￥{{ state.instance.finalPrice }}购买
          </button>
          <view v-else>
            <button class="buy-button" @click="toPerfectOrder">当前价购买</button>
            <button class="share-button" @click="handleClickShare">邀请好友帮我砍价</button>
          </view>
          <button v-if="!hasUserInfo" class="authorization" @click="getUserInfo"></button>
        </view>
        <view class="aborted-block" v-else-if="state.activityStatus === 'ABORTED'"></view>
        <view v-else>
          <button class="buy-button" @click="toBargainList">去砍其他好货</button>
        </view>
      </view>
      <view class="bargain-button" v-else>
        <view v-if="state.instance.availableStockAmount > 0">
          <button
            class="friend-bargain"
            @click="helpBargain"
            v-if="
              state.bargainStatus === 'CREATE' && !state.isHelpBargain && !state.instance.orderId
            "
          >
            帮 Ta 砍一刀
          </button>
          <button
            class="friend-bargain"
            @click="toBargainDetails"
            v-if="
              state.activityStatus === 'SUBMIT' &&
              (state.bargainStatus !== 'CREATE' || state.isHelpBargain || state.instance.orderId) &&
              !state.hasBargain
            "
          >
            我也要砍价
          </button>
          <button
            class="friend-bargain"
            :style="'background: linear-gradient(90deg, ' + state.themeColor + ', #ee5253);'"
            @click="toMyBargain"
            v-if="
              state.hasBargain &&
              (state.bargainStatus !== 'CREATE' || state.isHelpBargain || state.instance.orderId)
            "
          >
            查看我的砍价进度
          </button>
          <button v-if="!hasUserInfo" class="authorization" @click="getUserInfo"></button>
        </view>
        <view v-else>
          <button class="buy-button" @click="toBargainList">查看更多活动</button>
        </view>
      </view>
      <view
        class="bargain-button-text"
        v-if="state.isBargainCreator && state.bargainStatus === 'FAILED'"
        @click="toBargainList"
      >
        去砍其他好货>
      </view>
      <view
        class="bargain-button-text"
        v-else-if="state.isBargainCreator && state.instance.orderId"
        @click="toOrderDetails"
      >
        查看我的订单>
      </view>
      <view
        class="bargain-button-text"
        v-if="!state.isBargainCreator && state.hasCoupon"
        @click="toMyCoupon"
      >
        查看我的优惠>
      </view>
      <view
        class="bargain-button-text"
        v-if="
          !state.isBargainCreator &&
          !state.hasCoupon &&
          !(
            state.activityStatus === 'SUBMIT' &&
            (state.bargainStatus !== 'CREATE' || state.isHelpBargain || state.instance.orderId) &&
            !state.hasBargain
          )
        "
        @click="toBargainList"
      >
        去砍其他好货>
      </view>
    </view>
    <view class="help-list">
      <view class="title">
        <image :src="state.imagesPath.barga_title_bg"></image>
        <view>好友贡献榜</view>
      </view>
      <view class="help-count">已有 {{ state.instance.barginNowMemberCount }} 位好友助力</view>
      <scroll-view class="help-people-list" scroll-x="">
        <view class="help-people-item" v-for="(item, index) in state.helpBargainList" :key="index">
          <image :src="item.avatar"></image>
          <view>
            砍掉
            <text>{{ item.amount }}</text>
            元
          </view>
        </view>
      </scroll-view>
    </view>
    <recommend-list
      :storeId="storeId"
      :excludeId="state.excludeId"
      :excludeType="state.excludeType"
    ></recommend-list>
    <popup
      :show="state.show.middle"
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
    <popup
      :show="state.show.bargain"
      position="middle"
      custom-class="middle"
      @close="toggleBargainPopup"
    >
      <view :class="'popup-bargain ' + (!state.hasCoupon ? 'noCoupon' : '')">
        <view class="popup-bargain-box" v-if="state.hasCoupon">
          <view class="title">
            成功砍掉了
            <text class="price">￥{{ state.bargainAmount }}</text>
          </view>
          <view class="bargain-text">
            好友送你一份最高
            <text>50元</text>
            红包哦~
          </view>
          <image
            class="popup-image"
            :src="state.imagesPath.iconBargainCoupon"
            mode="widthFix"
          ></image>
          <view class="bottom-button-box">
            <view class="coupon" @click="toMyCoupon">查看我的优惠</view>
            <view class="bargain" @click="toBargainList">我也要砍价></view>
          </view>
        </view>
        <view class="popup-bargain-box noCoupon" v-else>
          <view class="title">
            成功砍掉了
            <text class="price">￥{{ state.bargainAmount }}</text>
          </view>
          <view class="bottom-button-box">
            <view class="coupon" @click="toMyCoupon">查看我的优惠</view>
          </view>
        </view>
        <view class="popup-bargain-close" @click="toggleBargainPopup">
          <image
            class="popup-close"
            :src="state.imagesPath.iconIndexPopupClose"
            mode="widthFix"
          ></image>
        </view>
      </view>
    </popup>
    <authorize @login="handleUserLogin"></authorize>
    <image
      class="movable-view"
      v-if="state.homeBack"
      :src="state.imagesPath.toHome"
      @click="toHome"
    ></image>
    <view class="bottom-pop" :hidden="state.showSharePop" @click="handleSharePopCancel">
      <view
        class="bottom-pop-main"
        :animation="state.animationData"
        @click.stop="catchSharePopCancel"
      >
        <view class="share-type-box">
          <view class="share-wx">
            <image :src="state.imagesPath.iconWX"></image>
            <text>分享给好友</text>
            <button open-type="share" @click="subscriptionMessagePopup"></button>
          </view>
          <view class="share-circle" @click="handleShareTimeline">
            <image :src="state.imagesPath.iconFriendsCircle"></image>
            <text>发朋友圈</text>
          </view>
        </view>
        <view class="cancel" @click="handleSharePopCancel">取消</view>
      </view>
    </view>
    <view
      class="poster-box"
      v-if="state.showPoster"
      @click="handlePosterCancel"
      @touchmove.stop="preventTouchMove"
    >
      <view class="poster-box-bg">
        <view class="poster-picture-box">
          <view class="close-poster-box" @click.stop="handlePosterCancel">×</view>
          <canvas canvas-id="pictureQRCanvas" style="display: block"></canvas>
        </view>
        <button
          @click.stop="handleSaveToImg"
          class="saveImage"
          :style="'background: ' + state.themeColor"
        >
          保存图片到相册
        </button>
        <text class="saveImageTips">分享海报时可到相册选取图片</text>
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsSubscribeMessageJs from '@/utils/newretail/subscribeMessage'
import _utilsLogJs from '@/utils/newretail/log'
import _utilsThemeManagerJs2 from '@/utils/newretail/themeManager'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
import _apiRequestJs from '@/service/api/newretail/request'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiAddressServiceJs from '@/service/api/newretail/addressService'
import _apiBargainServiceJs from '@/service/api/newretail/bargainService'
import priceicon from '@/utils/newretail/image/priceicon.png'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import bargainGoods from '@/pages-sub/newretail/components/bargain/bargain-goods/bargain-goods.vue';
import recommendList from '@/pages-sub/newretail/components/recommend/recommend-list-two/recommend-list.vue';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
const app = getApp()

// pages/mallModule/bargain/helpBargain/helpBargain.js
const bargainService = _apiBargainServiceJs
const addressService = _apiAddressServiceJs
const productService = _apiProductServiceJs
const request = _apiRequestJs
const wxaUserService = _apiWxaUserServiceJs
const IMGAGESPATH = _utilsImagesPathJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
const ANALYSIS = _utilsAnalysisJs
const THEME = _utilsThemeManagerJs
const AUTHORIZE = _utilsAuthorizeJs
const themeManager = _utilsThemeManagerJs2
const log = _utilsLogJs
const subscribeMessage = _utilsSubscribeMessageJs

// 获取应用实例
const state = reactive({
  navigationBarTitle: '砍价进度',
  imagesPath: IMGAGESPATH,
  isBargainCreator: false,
  //  是否是砍价实例发起人
  bargainStatus: 'CREATE',
  // 砍价状态 CREATE SUCCESS FAILED
  activityStatus: 'SUBMIT',
  // 砍价活动状态 CREATE, SUBMIT, ABORTED
  hasBargain: false,
  // 自己是否开了砍价
  isHelpBargain: false,
  // 是否帮助了砍价
  hasCoupon: false,
  // 是否有送券
  isLowerPrice: false,
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    bargain: false,
  },
  instance: null,
  helpBargainList: [],
  creator: null,
  // 创建人信息
  bargainInstances: [],
  // 最新成交的信息列表
  member: null,
  // 当前会员信息
  bargainAmount: '0.00',
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  homeBack: false,
  excludeId: '',
  excludeType: 'BARGAIN',
  isActivityEnd: false,
  showSharePop: true,
  animationData: {},
  showPoster: false,
  isInstanceEnd: false,
})
const customData = {
  sharePictures: '',
  myInstanceId: '',
  hasMyInstanceQueryCount: false,
  onLoad: false,
  canHelpBargain: true,
}
function initPage() {
  const self = this
  if (options.scene) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(options.scene)
    if (scene.indexOf('gmparam:') >= 0) {
      const sceneArr = scene.split('gmparam:')
      const sceneId = sceneArr[1]
      getSceneById(sceneId)
    }
  } else if (options.barginInstanceId != null) {
    getBargainInstanceById(options.barginInstanceId)
  }
  customData.onLoad = false
}
onLoad(function (options) {
  queryCount = 0
  const pageStack = getCurrentPages()
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
  if (pageStack.length === 1) {
    state.homeBack = true
  }
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
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
  // 获取成交数据
  getNew()
})
onReady(function () {})
onShow(function () {
  const self = this
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member
      state.isMember = true
      if (memberId != null) {
        if (app.globalData.userInfo.member.id === memberId) {
          state.isBargainCreator = true
        }
      }
      if (!state.isBargainCreator) {
        queryMyInstance()
      }
      if (options.barginInstanceId != null) {
        queryHelpRecord(options.barginInstanceId)
      }
    }
    state.hasUserInfo = true
  }
  if (state.storeId && !customData.onLoad) {
    initPage() // 初始化页面内容
  }
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {
  const self = this
  const sharePictures = customData.sharePictures
  const title = generateRandomSharing()
  let memberId = null
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    memberId = app.globalData.userInfo.member.id
  }
  let pages =
    '/pages-sub/newretail/pages/mallModule/bargain/helpBargain/helpBargain?barginInstanceId=' +
    options.barginInstanceId +
    '&storeId=' +
    state.storeId
  if (memberId) {
    pages = pages + '&shareId=' + memberId
  }
  return {
    title,
    imageUrl: sharePictures,
    path: pages,
    success(e) {},
  }
})
function toPerfectOrder() {
  const that = this
  const price = state.instance.finalPrice
  if (!state.isLowerPrice) {
    uni.showModal({
      title: '提示',
      content: '您将以' + price + '价格购买当前商品\n一旦确认将无法继续砍价',
      cancelText: '继续砍价',
      confirmText: '确认购买',
      confirmColor: '#FF8E00',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          const bargainOrder = state.instance
          if (!bargainOrder.orderId) {
            uni.setStorageSync('wj_bargainOrder', bargainOrder)
            NAVPAGE.toBargainAddOrder()
          } else {
            util.showToast('您已经下过单了，请不要重复下单哦~')
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  } else {
    const bargainOrder = state.instance
    if (!bargainOrder.orderId) {
      uni.setStorageSync('wj_bargainOrder', bargainOrder)
      NAVPAGE.toBargainAddOrder()
    } else {
      util.showToast('您已经下过单了，请不要重复下单哦~')
    }
  }
}
function toggleBargainRulesPopup() {
  toggle('middle')
}
function toggleBargainPopup() {
  toggle('bargain')
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
function generateRandomSharing() {
  const sharing = [
    '帮我砍一刀嘛，还差一点点，快来帮忙哦',
    '真朋友两肋插刀，麻烦你帮我砍一刀',
    '帮我砍一刀哦，我真的很想要，爱你呦',
    '是朋友就帮我砍一刀，我真的很想要',
    '老王都帮我砍了，就差你一刀了',
  ]
  const num = Math.random() * 4
  const n = parseInt(num)
  console.log(num, n, sharing[n])
  return sharing[n]
}
function getBargainInstanceById(id, storeId = null) {
  const self = this
  let instance = null
  bargainService
    .getInstanceDetails(id)
    .then((res) => {
      const savePrice = parseFloat((res.price - res.finalPrice).toFixed(2))
      instance = {
        ...res,
        savePrice,
        // 已砍去的金额
        isInstance: true,
      }
      console.log('instanceup111', instance)
      memberId = res.memberId
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        if (app.globalData.userInfo.member.id === memberId) {
          state.isBargainCreator = true
        }
      }
      queryHelpRecord(id)
      state.excludeId = res.activityId
      state.storeId = app.globalData.storeInfo.id
      state.storeInfo = app.globalData.storeInfo
      storeId = storeId || state.storeId
      return bargainService.getDetails(res.activityId, state.isBargainCreator ? storeId : null)
    })
    .then((res) => {
      instance = {
        ...instance,
        name: res.name,
        productImage: res.productImage,
        availableStockAmount: res.availableStockAmount,
        lowerPrice: res.lowerPrice,
        originalPrice: res.originalPrice,
        couponActivityId: res.couponActivityId,
      }
      console.log('instanceupupup', instance)
      if (res.children && res.children.length > 0) {
        res.children.forEach((ele) => {
          if (ele.productId === instance.productId) {
            instance.availableStockAmount = ele.availableStockAmount
            instance.totalStockAmount = ele.totalStockAmount
            instance.lowerPrice = ele.lowerPrice
          }
        })
      }
      let hasCoupon = false
      if (res.couponActivityId) {
        hasCoupon = true
      }
      let isLowerPrice = false
      if (instance.finalPrice === instance.lowerPrice) {
        isLowerPrice = true
      }
      let percent =
        ((instance.price - instance.finalPrice) / (instance.price - instance.lowerPrice)) * 100
      percent = percent > 0 ? percent : 0
      customData.sharePictures = res.shareUrl ? res.shareUrl : res.productImage
      state.isLowerPrice = isLowerPrice
      state.bargainStatus = instance.status
      state.activityStatus = res.status
      state.percent = percent
      state.hasCoupon = hasCoupon
      state.balance =
        res.balance > res.availableStockAmount ? res.availableStockAmount : res.balance
      const nowTime = new util.ResponseDate().getTime() // 当前时间时间戳
      const endDateTimeStamp = new Date(res.endDate.replace(/-/g, '/')).getTime() // 活动结束时间时间戳
      // 实例结束时间戳
      const endTimeStamp =
        new Date(instance.createTime.replace(/-/g, '/')).getTime() + instance.duration * 1000
      if (nowTime >= endDateTimeStamp) {
        // 活动已结束
        state.isActivityEnd = true
      }
      if (instance.status !== 'SUCCESS' && nowTime >= endTimeStamp) {
        // 实例已结束
        state.isInstanceEnd = true
        state.bargainStatus = 'FAILED'
      }
      queryHelpRecord(options.barginInstanceId)
      return state.isBargainCreator
        ? productService.getDetails(storeId, res.productId)
        : productService.getDetailsById(res.productId)
    })
    .then((res) => {
      if (!res) {
        return
      }
      let balance =
        res.balance > instance.availableStockAmount ? instance.availableStockAmount : res.balance
      if (!state.isBargainCreator) {
        balance = instance.availableStockAmount
      }
      console.log('门店库存：', res.balance)
      console.log('砍价实例商品可用数量: ', instance.availableStockAmount)
      console.log('balance: ', balance)
      const toast = state.isBargainCreator
        ? '当前砍价商品已被砍完，没关系，去看看其他活动~'
        : '当前砍价商品已被砍完，您无法帮砍~'
      if (balance <= 0) {
        util.showToast(toast)
      }
      instance = {
        ...instance,
        availableStockAmount: balance,
        business: res.business,
        shipmentType: res.shipmentType,
      }
      console.log('instance1111', instance)
      state.instance = instance
      state.balance = balance
      if (app.globalData.userInfo && app.globalData.userInfo.member && !state.isBargainCreator) {
        queryMyInstance()
      }
    })
    .catch((err) => {
      if (err.code === 16015) {
        if (queryCount === 0) {
          queryCount = 1
          ADDRESS.getDistributionStore().then((res) => {
            if (res) {
              state.storeId = res.id
              getBargainInstanceById(id, res.id)
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
function queryHelpRecord(id) {
  const postData = {
    instanceIdEquals: id,
    page: 1,
    pageSize: 0,
    searchCount: true,
  }
  bargainService
    .queryHelpRecord(postData)
    .then((res) => {
      if (!res || !res.records) {
        return
      }
      const tempList = []
      let creator = null
      let isHelpBargain = false
      if (res.records && res.records.length > 0) {
        res.records.forEach((item) => {
          if (item.memberId === memberId) {
            creator = {
              ...item,
              avatar: item.avatar ? item.avatar : state.imagesPath.userPortrait,
            }
          }
          if (state.member && item.memberId === state.member.id) {
            isHelpBargain = true
          }
          tempList.push(item)
        })
      }
      if (isHelpBargain && state.member && state.member.id === memberId) {
        isHelpBargain = false
      }
      state.creator = creator
      state.helpBargainList = tempList
      state.isHelpBargain = isHelpBargain
    })
    .catch((err) => {
      util.showToast(err.message)
    })
}
function handleUserLogin() {
  const that = this
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true
      state.isMember = true
      state.member = app.globalData.userInfo.member
      if (memberId != null) {
        if (app.globalData.userInfo.member.id === memberId) {
          state.isBargainCreator = true
        }
      }
      if (!state.isBargainCreator) {
        queryMyInstance()
      }
      queryHelpRecord(options.barginInstanceId)
    } else {
      // 不是会员跳转授权页
      state.hasUserInfo = true
      state.isMember = false
      NAVPAGE.toAuthorize()
    }
  }
}
function getUserInfo(e) {
  const that = this
  AUTHORIZE.login(e)
    .then((res) => {
      state.hasUserInfo = true
      if (res.member) {
        state.isMember = true
        state.member = res.member
        if (memberId != null) {
          if (res.member.id === memberId) {
            state.isBargainCreator = true
          }
        }
        if (!state.isBargainCreator) {
          queryMyInstance()
        }
        queryHelpRecord(options.barginInstanceId)
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
function getNew() {
  bargainService
    .getNew()
    .then((res) => {
      if (!res || res.length === 0) {
        return
      }
      const tempList = []
      const reg = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))[0-9]{8}$/
      res.forEach((item) => {
        if (item.memberMobile != null) {
          const name = hidden(item.memberMobile, 3, 3)
          const tempItem = {
            ...item,
            finalPrice: item.finalPrice.toFixed(2),
            name,
          }
          tempList.push(tempItem)
        }
      })
      state.bargainInstances = tempList
    })
    .catch((err) => {
      util.showToast(err.message)
    })
}
function hidden(str, frontLen, endLen) {
  const len = str.length - frontLen - endLen
  let newStr = ''
  for (let i = 0; i < len; i++) {
    newStr += '*'
  }
  return str.substring(0, frontLen) + newStr + str.substring(str.length - endLen)
}
function catchtouchmoveSwiper() {
  return false
}
function helpBargain() {
  const that = this
  if (!customData.canHelpBargain) {
    console.log('当前已经在砍价中了~')
    return
  }
  customData.canHelpBargain = false
  const postData = {
    instanceId: state.instance.id,
    memberId: state.member.id,
  }
  bargainService
    .help(postData)
    .then((res) => {
      customData.canHelpBargain = true
      state.bargainAmount = res.toFixed(2)
      state.isHelpBargain = true
      toggleBargainPopup()
      // 刷新当前页面数据
      getBargainInstanceById(options.barginInstanceId)
    })
    .catch((err) => {
      customData.canHelpBargain = true
      util.showToast(err.message)
    })
}
function queryMyInstance() {
  if (!customData.hasMyInstanceQueryCount) {
    if (!state.instance) {
      return
    }
    const postData = {
      page: 1,
      pageSize: 1,
      searchCount: true,
      memberIdEquals: state.member.id,
      activityIdEquals: state.instance.activityId,
    }
    bargainService
      .queryInstance(postData)
      .then((res) => {
        if (!res || !res.records || res.records.length === 0) {
          return
        }
        customData.hasMyInstanceQueryCount = true
        if (res.records.length > 0) {
          customData.myInstanceId = res.records[0].id
          state.hasBargain = true
        }
      })
      .catch((err) => {
        util.showToast(err.message)
      })
  }
}
function toMyBargain() {
  const opts = '?barginInstanceId=' + customData.myInstanceId
  NAVPAGE.toHelpBargain(opts)
}
function toBargainDetails() {
  const opts = '?barginId=' + state.instance.activityId
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const postData = {
      page: 1,
      pageSize: 1,
      searchCount: true,
      memberIdEquals: app.globalData.userInfo.member.id,
      activityIdEquals: state.instance.activityId,
      statusIn: ['CREATE', 'SUCCESS'],
    }
    bargainService
      .queryInstance(postData)
      .then((res) => {
        if (!res || !res.records || res.records.length === 0 || state.bargainStatus === 'FAILED') {
          NAVPAGE.toBargainDetails(opts)
          return
        }
        if (res.records.length > 0 && state.bargainStatus !== 'FAILED') {
          const opts = '?barginInstanceId=' + res.records[0].id
          NAVPAGE.toHelpBargain(opts)
        }
      })
      .catch((err) => {
        util.showToast(err.message)
      })
  } else {
    NAVPAGE.toBargainDetails(opts)
  }
}
function toBargainList() {
  NAVPAGE.toBargainList()
}
function toHome() {
  NAVPAGE.toHome()
}
function toMyCoupon() {
  NAVPAGE.toMyCoupon()
}
function toOrderDetails() {
  const opts = '?orderId=' + state.instance.orderId
  NAVPAGE.toOrderDetails(opts)
}
function handleClickShare(e) {
  state.showSharePop = false
  const animation = uni.createAnimation({
    duration: 300,
  })
  animation.translateY(-140).step()
  state.animationData = animation
}
function catchSharePopCancel() {}
function handleSharePopCancel(e) {
  const animation = uni.createAnimation({
    duration: 300,
  })
  animation.translateY(0).step()
  state.animationData = animation
  setTimeout(
    function () {
      this.setData({
        showSharePop: true,
      })
    }.bind(this),
    300,
  )
}
function handleShareTimeline(e) {
  const screenWidth = app.globalData.systemInfo.screenWidth
  const rate = screenWidth / 375
  state.showPoster = true
  handleSharePopCancel()
  const self = this
  // 获取到id为‘pictureQRCanvas’的canvas
  const ctx = uni.createCanvasContext('pictureQRCanvas')
  // 绘制背景
  ctx.setFillStyle('white')
  ctx.fillRect(0, 0, 300 * rate, 450 * rate)

  // 绘制logo
  ctx.drawImage(state.imagesPath.iconLogo, 110 * rate, 15 * rate, 80 * rate, 30 * rate)
  // ctx.draw(true)

  // 绘制上部分商品图片
  const sharePicture = customData.sharePictures.replace('http://', 'https://')
  uni.getImageInfo({
    src: sharePicture,
    success(res) {
      // ctx.drawImage(image, dx, dy, dWidth, dHeight);
      ctx.drawImage(res.path, 15 * rate, 60 * rate, 270 * rate, 270 * rate)
      ctx.draw(true)
      function commonHandle() {
        // 秒杀拼团价格展示区
        ctx.setFillStyle(state.themeColor)
        // ctx.fillRect(x, y, width, height);绘制一个填充的矩形,覆盖商品图片居下
        ctx.fillRect(15, 282 * rate, 270 * rate, 48 * rate)
        ctx.setFillStyle('#ffffff')
        ctx.font = 'normal 10px sans-serif'
      }
      function drawActivityType(text) {
        ctx.moveTo(200 * rate, 330 * rate)
        ctx.lineTo(230 * rate, 278 * rate)
        ctx.lineTo(286 * rate, 278 * rate)
        ctx.lineTo(286 * rate, 330 * rate)
        ctx.fillStyle = '#4E4442'
        ctx.fill()
        ctx.setFillStyle('#ECDB63')
        ctx.font = 'normal 12px sans-serif'
        ctx.fillText(text, 230 * rate, 310 * rate)
      }
      commonHandle()
      ctx.font = 'normal bold 12px sans-serif'
      ctx.fillText('麻烦帮我砍一刀，谢谢', 20 * rate, 310 * rate)
      drawActivityType('砍价')
      ctx.draw(true)
    },
  })

  // 绘制商品名称价格
  ctx.setFillStyle('black')
  ctx.font = 'normal bold 12px sans-serif'
  util.dealWords({
    ctx,
    // 画布上下文
    fontSize: 12 * rate,
    // 字体大小
    word: state.instance.productName,
    // 需要处理的文字
    maxWidth: 175 * rate,
    // 一行文字最大宽度
    x: 20 * rate,
    // 文字在x轴要显示的位置
    y: 330 * rate,
    // 文字在y轴要显示的位置
    maxLine: 2, // 文字最多显示的行数
  })
  ctx.setFillStyle('grey')
  ctx.font = 'normal 9px sans-serif'
  util.dealWords({
    ctx,
    // 画布上下文
    fontSize: 9 * rate,
    // 字体大小
    word: '麻烦帮我砍一刀，我是真的很想要，谢谢啦~',
    // 需要处理的文字
    // word: '测试分享图商品描述-测试分享图商品描述-测试分享图商品描述-测试分享图商品描述-测试分享图商品描述-测试分享图商品描述-测试分享图商品描述-测试分享图商品描述-测试分享图商品描述',
    maxWidth: 170 * rate,
    // 一行文字最大宽度
    x: 20 * rate,
    // 文字在x轴要显示的位置
    y: 360 * rate,
    // 文字在y轴要显示的位置
    maxLine: 3, // 文字最多显示的行数
  })
  ctx.setFillStyle('#ff8561')
  ctx.font = 'normal 24px sans-serif'
  ctx.fillText('￥' + state.instance.lowerPrice, 12 * rate, 430 * rate)
  ctx.setFillStyle('#8b8b8c')
  if (state.instance.price) {
    ctx.font = 'normal 10px sans-serif'
    ctx.fillText('￥' + state.instance.price, 100 * rate, 436 * rate)
    ctx.setStrokeStyle('#8b8b8c')
    ctx.moveTo(100 * rate, 433 * rate)
    ctx.lineTo(130 * rate, 433 * rate)
    ctx.stroke()
  }
  ctx.draw(true)
  drawTags('最低可砍至')
  function drawTags(text) {
    // 绘制箭头标签
    ctx.moveTo(100 * rate, 417 * rate)
    ctx.lineTo(105 * rate, 411 * rate)
    ctx.lineTo(105 * rate, 423 * rate)
    ctx.fillStyle = '#EE5253'
    ctx.fill()
    ctx.setFillStyle('#EE5253')
    ctx.fillRect(105 * rate, 411 * rate, 48 * rate, 12 * rate)
    ctx.setFillStyle('#ffffff')
    ctx.font = 'normal 9px sans-serif'
    ctx.fillText(text, 105 * rate, 420 * rate)
  }
  ctx.setFillStyle('gray')
  ctx.font = 'normal 10px sans-serif'
  ctx.fillText('长按识别小程序码', 205 * rate, 434 * rate)
  ctx.draw(true)

  // 获取小程序码
  const appid = request.APP_ID
  const page = 'pages/mallModule/bargain/helpBargain/helpBargain'
  let scene = ''
  const width = parseInt(300 * rate)

  // 预售获取场景值
  const param = 'barginInstanceId=' + options.barginInstanceId + '&storeId=' + state.storeId
  wxaUserService
    .createScene(appid, param)
    .then((res) => {
      scene = 'gmparam:' + res
      createSharePicture(appid, page, scene, width)
    })
    .catch((err) => {
      console.log('分享图生产报错:', err.message)
    })
  function createSharePicture(appid, page, scene, width) {
    uni.getImageInfo({
      src:
        request.BASE_URL +
        '/newretail/api/wxa/qrcode/create?appid=' +
        appid +
        '&page=' +
        page +
        '&scene=' +
        scene +
        '&size=' +
        width,
      success(res) {
        ctx.drawImage(res.path, 200 * rate, 330 * rate, 90 * rate, 90 * rate)
        ctx.draw(true)
      },
    })
  }
}
function handleSaveToImg(e) {
  const self = this
  let specialHeight = 0
  if (state.isSecKill || state.isTeam) {
    specialHeight = 48
  }
  const baseWidthUnit = 375 // 以iPhone6的分辨率为基准
  const windowWidth = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo(),
  }.windowWidth
  const rate = windowWidth / baseWidthUnit // 计算出当前设备分辨率与标准分辨率的比率
  const height = 460 * rate
  const width = 300 * rate
  let destHeight = 1800 * 2 * rate
  if (app.globalData.systemInfo.platform == 'ios') {
    destHeight = 1800 * 2 * rate
  }
  const destWidth = 1200 * 2 * rate
  uni.canvasToTempFilePath({
    x: 0,
    y: 0,
    width,
    height,
    destWidth,
    destHeight,
    fileType: 'jpg',
    quality: 1,
    canvasId: 'pictureQRCanvas',
    success(res) {
      uni.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          // 隐藏海报显示
          state.showPoster = false
          uni.showToast({
            title: '保存成功',
          })
        },
      })
    },
  })
}
function handlePosterCancel(e) {
  state.showPoster = false
}
function preventTouchMove(e) {}
function getSceneById(id) {
  const self = this
  console.log(id)
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
      if (options.barginInstanceId != null) {
        getBargainInstanceById(options.barginInstanceId)
      }
    })
    .catch((err) => {
      util.showToast(err.message)
    })
}
function toGoodsDetails() {
  const opts =
    '?productId=' + state.instance.productId + '&storeId=' + state.storeId + '&type=normal'
  NAVPAGE.toGoodsDetails(opts)
}
function subscriptionMessagePopup(val) {
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
    templateIds = subscribeMessage.handleTemplateIds(subscribeMessage.scene.BARGIN)
    console.log(templateIds)
    if (templateIds.length > 0) {
      if (uni.requestSubscribeMessage) {
        uni.requestSubscribeMessage({
          tmplIds: templateIds,
          success(res) {
            console.log(res)
            log.info(res)
            subscribeMessage.addSubscribe(subscribeMessage.scene.BARGIN, res)
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
</script>
<style scoped>
/* pages/mallModule/bargain/helpBargain/helpBargain.wxss */

page {
  background: #f8f6f9;
}

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
  position: relative;
  width: 720rpx;
  min-height: 567rpx;
  margin: 110rpx auto 0;
  padding-bottom: 22rpx;
  background: #fff;
  box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.05);
  border-radius: 6rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 36rpx;
}

.top-info .scroll-rule {
  position: absolute;
  top: -80rpx;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 17rpx 0 20rpx 0;
  box-sizing: border-box;
  margin-bottom: 30rpx;
}

.top-info .scroll-rule .scroll-box {
  min-width: 302rpx;
  height: 32rpx;
  /* background: #f1f1f1; */
  border-radius: 16rpx;
  font-size: 20rpx;
  color: #ffffff;
  text-align: center;
  padding: 0 0rpx;
}

.top-info .scroll-rule .creator-box {
  display: flex;
}

.top-info .scroll-rule .creator-box image {
  width: 58rpx;
  height: 58rpx;
  border-radius: 50%;
  margin-right: 13rpx;
}

.top-info .scroll-rule .creator-box .info {
  font-size: 24rpx;
  line-height: 34rpx;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.top-info .scroll-rule .creator-box .info text {
  display: block;
}

.top-info .scroll-rule .creator-box .info text:first-of-type {
  color: #666;
}

.top-info .scroll-rule .bargain-rule {
  width: 132rpx;
  height: 45rpx;
  background: #c53205;
  border-radius: 23rpx 0px 0px 23rpx;
  font-size: 24rpx;
  color: #fff;
  text-align: center;
  position: absolute;
  right: -20rpx;
  top: 50%;
  transform: translateY(-50%);
  line-height: 45rpx;
}

/* 砍价进度 */

.bargain-progress {
  width: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  text-align: center;
  /* margin-top: 36rpx; */
}

.bargain-progress .title {
  font-size: 30rpx;
  color: #343434;
  line-height: 48rpx;
}
.bargain-progress .font-size-48 {
  font-size: 40rpx;
}

.bargain-progress text {
  color: #ff7103;
  font-weight: bold;
}

.font-size-48 {
  font-size: 48rpx;
}

.bargain-progress .tips {
  font-size: 30rpx;
  color: #999;
  line-height: 48rpx;
  text-align: center;
}

.bargain-progress progress {
  margin-top: 24rpx;
}

/* 按钮 */

.bargain-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 36rpx;
  position: relative;
  padding: 0 0 18rpx;
  box-sizing: border-box;
}

.bargain-button button {
  width: 320rpx;
  height: 74rpx;
  padding: 0;
  font-size: 30rpx;
  line-height: 74rpx;
  border-radius: 10rpx;
  background: transparent;
  border-radius: 37rpx;
}

.bargain-button button::after {
  border: 0;
}

.bargain-button button.buy-button {
  background: #fff;
  border: 2rpx solid #ff8e00;
  color: #ff8e00;
}

.bargain-button button.share-button {
  background: linear-gradient(180deg, #fea25b, #ff7103);
  color: #f8f6f9;
}

.bargain-button button.friend-bargain {
  width: 620rpx;
  height: 74rpx;
  background: linear-gradient(90deg, #ff9f43, #ee5253);
  border-radius: 10rpx;
  color: #f8f6f9;
}

.aborted-block {
  height: 24rpx;
  width: 100%;
}

button.authorization {
  width: 100% !important;
  height: 100% !important;
  background: transparent !important;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
}

.bargain-button-text {
  font-size: 30rpx;
  line-height: 48rpx;
  color: #f6784b;
}

button.authorization::after {
  border: none;
}

.help-list {
  width: 720rpx;
  background: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6rpx;
  margin: 20rpx auto;
}

.help-list .title {
  margin: 0 auto 20rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 29rpx;
  font-weight: bold;
  line-height: 59rpx;
  height: 59rpx;
  color: #fff;
}

.help-list .title image {
  position: absolute;
  top: 0;
  width: 307rpx;
  height: 59rpx;
}
.help-list .title view {
  position: absolute;
}

.help-count {
  font-size: 24rpx;
  line-height: 30rpx;
  height: 30rpx;
  color: #333333;
  width: 100%;
  text-align: center;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eeeeee;
}

.help-people-list {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  width: 640rpx;
  margin: 0 40rpx 0;
}

.help-people-item {
  width: 100%;
  margin-right: 60rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
}

.help-people-item:last-of-type {
  margin-right: 0;
}

.help-people-item image {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background-color: #fea25b;
}

.help-people-item {
  font-size: 24rpx;
  font-weight: bold;
  line-height: 24rpx;
  color: #333;
  border-bottom: 1px solid #ebebeb;
}
.help-people-item text {
  color: #ff8e00;
  font-weight: 400;
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

/* 弹窗 */

.popup-bargain {
  width: 590rpx;
  height: 770rpx;
  padding: 50rpx 0 0 0;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 10rpx;
  font-size: 30rpx;
  color: #333333;
  position: relative;
}

.popup-bargain.noCoupon {
  height: 387rpx;
}

.popup-bargain-box {
  line-height: 42rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-bargain-box .title {
  font-size: 40rpx;
}

.popup-bargain-box.noCoupon .title {
  margin-top: 66rpx;
}

.popup-bargain-box .price {
  color: #f33;
}

.popup-bargain-box .popup-image {
  width: 590rpx;
  height: 386rpx;
  margin-top: 23rpx;
}

.popup-bargain-box .bargain-text {
  color: #343434;
  margin-top: 16rpx;
}

.popup-bargain-box .bargain-text text {
  color: #ff3333;
}

.popup-bargain-box .bottom-button-box {
  width: 100%;
  height: 200rpx;
  background: #ffeede;
  position: absolute;
  left: 0;
  bottom: 0;
}

.popup-bargain-box .bottom-button-box .coupon {
  width: 470rpx;
  height: 90rpx;
  background: linear-gradient(90deg, #ff9f43, #ee5253);
  border-radius: 10rpx;
  font-weight: bold;
  line-height: 90rpx;
  text-align: center;
  color: #ffffff;
  margin: 21rpx auto 0;
}

.popup-bargain-box.noCoupon .bottom-button-box {
  background: #ffffff;
  height: 148rpx;
}

.popup-bargain-box .bottom-button-box .bargain {
  color: #f6784b;
  margin-top: 27rpx;
  text-align: center;
}

.popup-bargain-close {
  padding-top: 46rpx;
  position: absolute;
  bottom: -124rpx;
  width: 104rpx;
  height: 104rpx;
  left: 50%;
  margin-left: -26rpx;
}

.popup-bargain-close image {
  width: 52rpx;
  height: 52rpx;
}

.bargain-failed-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.bargain-failed {
  width: 28rpx;
  height: 28rpx;
  margin-right: 20rpx;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
  position: fixed;
  right: 0;
  bottom: 120rpx;
}

/* 分享选择 */

.bottom-pop {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9;
}

.bottom-pop-main {
  position: absolute;
  bottom: -280rpx;
  left: 0rpx;
  width: 100%;
  height: 280rpx;
  overflow: hidden;
  background: #fff;
  text-align: center;
}

.bottom-pop-main .cancel {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  border-top: 1rpx solid #ddd;
}

.bottom-pop-main .share-type-box {
  width: 100%;
  height: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-pop-main .share-type-box > view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  width: 50%;
  height: 120rpx;
  box-sizing: border-box;
  float: left;
}

.bottom-pop-main .share-type-box > view image {
  height: 80rpx;
  width: 80rpx;
}

.bottom-pop-main .share-wx {
  border-right: 1rpx solid #ddd;
  position: relative;
}

.bottom-pop-main .share-wx button {
  background: transparent;
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
}

.bottom-pop-main .share-wx button::after {
  border: none;
}

.poster-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0rpx;
  left: 0rpx;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 32rpx;
  overflow-y: scroll;
}

.poster-box-bg {
  background: #fff;
  width: 100%;
  height: 92%;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.close-poster-box {
  position: absolute;
  right: -40rpx;
  top: -60rpx;
  color: #000;
  font-size: 48rpx;
  z-index: 10000;
}

.poster-picture-box {
  position: relative;
  width: 600rpx;
  height: 900rpx;
  margin: 0 auto;
  margin-top: 48rpx;
  margin-bottom: 40rpx;
}

.poster-picture-box canvas {
  width: 600rpx;
  height: 900rpx;
  margin: 0 auto;
  border-radius: 10rpx;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}

.poster-box .saveImage {
  width: 80%;
  height: 90rpx;
  background: #019f55;
  color: #fff;
  font-size: 34rpx;
  margin: 0 auto 8rpx auto;
  border-radius: 50rpx;
}

.poster-box .saveImageTips {
  font-size: 28rpx;
  color: #5b5b5b;
}
.progress-box {
  position: relative;
}
.percenticon {
  position: absolute;
  top: 50%;
  transform: translate(-10%, -50%);
  width: 46rpx;
}
.percenticon image {
  width: 100%;
}
</style>
