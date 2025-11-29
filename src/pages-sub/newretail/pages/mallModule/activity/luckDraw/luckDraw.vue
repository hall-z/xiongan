<template>
  <!-- pages/mallModule/activity/luckDraw/luckDraw.wxml -->
  <view>
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <view class="navigation-bar-top" :style="'height:' + state.navHeight + 'px;'"></view>
    <image
      class="top-luckdraw-bg"
      :src="state.imagesPath.iconLuckDrawBg"
      mode="widthFix"
      v-if="state.raffleType === 'LHJ'"
      :style="'top:' + state.navHeight + 'px;'"
    ></image>
    <image
      class="top-luckdraw-bg"
      :src="state.imagesPath.iconLuckDrawBg2"
      mode="widthFix"
      v-else
      :style="'top:' + state.navHeight + 'px;'"
    ></image>
    <view class="luckdraw-main">
      <luckdraw-game
        v-if="state.raffleType === 'LHJ'"
        :luckDrawText="state.luckDrawTextImage"
        @draw="getUserClickDraw"
        :onClickLuckDraw="state.isMember"
        @fans="getUserIsFans"
        :status="state.raffleResult"
        reference-page="luckDraw"
      ></luckdraw-game>
      <view
        class="popup-windows-box"
        v-if="state.raffleType === 'POPUP_WINDOWS'"
        :style="
          state.raffleResult !== 'UNSTART' && state.raffleResult !== 'FALSE' ? 'height:556rpx;' : ''
        "
      >
        <form
          v-if="state.raffleResult === 'UNSTART' || state.raffleResult === 'FALSE'"
          :hidden="!hasUserInfo"
          @submit="getUserClickDraw"
        >
          <button
            form-type="submit"
            :class="'luck-draw-btn ' + (disabled ? 'disabled' : 'flicker')"
            :style="state.theme.mainBgColor"
            :disabled="disabled"
            data-userDraw="true"
          >
            立即抽奖
          </button>
        </form>
        <button
          v-if="state.raffleResult === 'UNSTART' || state.raffleResult === 'FALSE'"
          :style="state.theme.mainBgColor"
          :hidden="hasUserInfo"
          :class="'luck-draw-btn ' + (disabled ? 'disabled' : 'flicker')"
          :disabled="disabled"
          @click="getUserInfo"
        >
          立即抽奖
        </button>
      </view>
    </view>
    <view
      class="luckdraw-text"
      :style="'color: ' + state.themeColor"
      v-if="state.raffleResult === 'END'"
    >
      {{ state.luckdrawResText }}
    </view>
    <view class="activity-coupon-box" v-if="state.doLuckDraw">
      <view v-if="state.hasCoupon">
        <view class="title">恭喜您成功领取</view>
        <view class="name">{{ state.raffleInfo.rafflePrizeName }}</view>
        <view class="tips">已放入您的账户</view>
        <button
          class="activity-botton"
          open-type="share"
          :style="
            state.hasCoupon
              ? state.theme.mainBgColor
              : state.theme.mainBgColor + 'margin-top: 104rpx;'
          "
        >
          去分享
        </button>
        <text class="activity-toshopmall" :style="state.theme.mainColor" @click="toShoppingMall">
          去商城使用
        </text>
      </view>
      <view v-else>
        <button
          class="activity-botton"
          @click="toShoppingMall"
          :style="
            state.hasCoupon
              ? state.theme.mainBgColor
              : state.theme.mainBgColor + 'margin-top: 104rpx;'
          "
        >
          去商城逛逛
        </button>
      </view>
    </view>
    <view class="luck-rankings" :style="state.doLuckDraw ? '' : 'margin-top: 80rpx;'">
      <view class="title">看看大家的手气</view>
      <view class="rankings-box">
        <view class="rankings-item" v-for="(item, index) in state.rankingsList" :key="index">
          <image class="user-logo" :src="item.avatar"></image>
          <view class="rankings-info">
            <view class="user-info">
              <view>
                <text>
                  {{ item.nickName ? item.nickName : filtMobile(item.creatorName) }}
                </text>
                {{ item.receiveTime }}
              </view>
              <view>{{ item.raffleComment }}</view>
            </view>
            <view class="coupon-name">{{ item.rafflePrizeName }}</view>
          </view>
        </view>
      </view>
      <view class="rankings-box-line" :hidden="state.productList.length == 0"></view>
      <view class="recommend-goods" :hidden="state.productList.length == 0">
        <view class="share-people">
          <image class="share-user-logo" :src="state.creator.avatar"></image>
          <view>{{ state.creator.nickName }} 正在购买这些商品</view>
        </view>
        <view class="recommend-goods-list">
          <view v-for="(item, index) in state.productList" :key="index" v-if="index < 3">
            <view
              class="goods-box"
              :style="'border: 2px solid ' + state.themeColor"
              :data-productId="item.productId"
              :data-newmbrActivityId="item.newmbrActivityId ? item.newmbrActivityId : ''"
              :data-advanceId="item.advanceId ? item.advanceId : ''"
              :data-grabActivityId="item.grabActivityId ? item.grabActivityId : ''"
              @click="toGoodsDetail"
            >
              <image :src="item.imageUrl" mode="widthFix"></image>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="activity-tips">
      <view class="title">活动说明</view>
      <view class="tips-box">
        <view>
          <image :src="state.imagesPath.iconLuckDrawItem"></image>
          下单即可送优惠券给朋友，自己也能抢哦;
        </view>
        <view>
          <image :src="state.imagesPath.iconLuckDrawItem"></image>
          每个链接仅限20人领取;
        </view>
        <view>
          <image :src="state.imagesPath.iconLuckDrawItem"></image>
          每个链接按照领取顺序随机发放优惠券，使用有效期7天;
        </view>
        <view>
          <image :src="state.imagesPath.iconLuckDrawItem"></image>
          优惠券仅限本人使用，不可转赠;
        </view>
      </view>
    </view>
    <popup
      :show="state.show.middle"
      position="middle"
      custom-class="middle"
      @close="toggleMiddlePopup"
    >
      <view class="popup-box">
        <view class="popup-title">抽奖结果</view>
        <view class="popup-close" @click="toggleMiddlePopup">
          <image :src="state.imagesPath.iconLuckDrawClose"></image>
        </view>
        <view v-if="state.activeState === 'start'">
          <view v-if="state.hasCoupon">
            <view class="popup-content">
              <text class="popup-tips">恭喜您成功领取</text>
              <text class="popup-text" :style="state.themeColor">
                {{ state.raffleInfo.rafflePrizeName }}
              </text>
            </view>
            <view class="popup-button">
              <view>
                <text>已放入您的账户</text>
                <button class="share-btn" :style="state.theme.mainBgColor" open-type="share">
                  把好运气分享给小伙伴
                </button>
                <text
                  class="toshopmall"
                  :style="'color: ' + state.themeColor"
                  @click="toShoppingMall"
                >
                  立刻去商城用掉
                </text>
              </view>
              <view v-if="false">
                <text>绑定手机号后领取</text>
                <button class="share-btn" @click="handlePopupPhone">立即绑定</button>
              </view>
            </view>
          </view>
          <view v-else>
            <view class="popup-content">
              <text class="popup-text">您来晚了</text>
              <text class="popup-text">奖品已被抽光了！</text>
            </view>
            <view class="popup-button">
              <text>活动期间下单可获得抽奖机会</text>
              <button class="share-btn" @click="toShoppingMall">去商城逛逛</button>
            </view>
          </view>
        </view>
        <view v-if="state.activeState === 'end'">
          <view class="popup-content">
            <text class="popup-text">您来晚了</text>
            <text class="popup-text">活动已经结束了！</text>
          </view>
          <view class="popup-button">
            <text>敬请期待下次活动哦</text>
            <button class="share-btn" @click="toShoppingMall">去商城逛逛</button>
          </view>
        </view>
      </view>
    </popup>
    <authorize @login="handleUserLogin"></authorize>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiOrderServiceJs from '@/service/api/newretail/orderService'
import _apiRaffleServiceJs from '@/service/api/newretail/raffleService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
const app = getApp()

// pages/mallModule/activity/luckDraw/luckDraw.js
const raffleService = _apiRaffleServiceJs
const orderService = _apiOrderServiceJs
const productService = _apiProductServiceJs
const util = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const AUTHORIZE = _utilsAuthorizeJs
const themeManager = _utilsThemeManagerJs

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
  navigationBarTitle: '优惠券抽奖',
  imagesPath: IMGAGESPATH,
  userInfo: {},
  member: {},
  phone: false,
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
  },
  isMember: false,
  activeState: 'start',
  // start end
  hasCoupon: true,
  doLuckDraw: false,
  luckDrawTextImage: './image/text.png',
  rankingsList: [],
  raffleId: '',
  orderId: '',
  creator: {},
  productList: [],
  raffleInfo: null,
  luckdrawResText: '',
  isLuckdrawEnd: false,
  onLoad: false,
  type: 'order',
  // order,store
  raffleResult: 'UNSTART',
  theme: themeManager,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  raffleType: 'LHJ',
  navHeight: 46,
})
function getRaffleById(raffleId) {
  raffleService
    .getById(raffleId)
    .then((res) => {
      const creator = {
        avatar: res.avatar ? res.avatar : state.imagesPath.userImg1,
        creatorId: res.creatorId,
        creatorName: res.creatorName,
      }
      state.creator = creator
      state.raffleType = res.raffleType
      if (res.orderId) {
        state.creator = creator
        state.orderId = res.orderId
      }
      // 获取已经抽奖的记录
      if (state.type == 'order') {
        getRecordsById(raffleId, creator)
        getProductsByOrderId(res.orderId, creator)
      } else if (state.type == 'store') {
        getRecordsById(raffleId, creator)
      }
    })
    .catch((err) => {
      console.log(err)
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function getRecordsById(raffleId, creator) {
  raffleService
    .getRecordsById(raffleId)
    .then((res) => {
      const tempList = []
      let raffleInfo = null
      if (res.length > 0) {
        res.forEach((item) => {
          const time = item.updateTime.split(' ')
          const dateArr = time[0].split('-')
          const receiveTime = dateArr[1] + '/' + dateArr[2] + ' ' + time[1].slice(0, 5)
          const tempItem = {
            ...item,
            receiveTime,
          }
          if (item.rafflePrizeName !== '未中奖') {
            tempList.push(tempItem)
          }
          if (creator.creatorId === item.creatorId) {
            creator = {
              ...creator,
              avatar: item.avatar,
              nickName: item.nickName,
            }
          }
          if (
            app.globalData.userInfo.member &&
            app.globalData.userInfo.member.id == item.creatorId &&
            item.rafflePrizeName !== '未中奖'
          ) {
            raffleInfo = item
          }
        })
        state.rankingsList = tempList
        state.creator = creator
        if (raffleInfo) {
          state.hasCoupon = true
          state.raffleInfo = raffleInfo
          state.isLuckdrawEnd = true
          if (!onClickDraw) {
            state.doLuckDraw = true
          }
          if (state.onLoad) {
            state.luckdrawResText = '您已经参加过了~'
            state.onLoad = false
            state.raffleResult = 'END'
          }
        }
      }
      if (state.onLoad) {
        state.onLoad = false
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
function getProductsByOrderId(orderId) {
  orderService
    .getProductsByOrderId(orderId)
    .then((res) => {
      state.productList = res
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
  if (val.currentTarget.dataset.advanceid !== '') {
    const opts =
      '?productId=' +
      val.currentTarget.dataset.productid +
      '&advanceId=' +
      val.currentTarget.dataset.advanceid +
      '&type=advanceSell'
    NAVPAGE.toGoodsDetails(opts)
  } else if (val.currentTarget.dataset.grabActivityid !== '') {
    const opts =
      '?productId=' +
      val.currentTarget.dataset.productid +
      '&activityId=' +
      val.currentTarget.dataset.grabActivityid +
      '&type=secondkill'
    NAVPAGE.toGoodsDetails(opts)
  } else {
    const opts = '?productId=' + val.currentTarget.dataset.productid + '&type=normal'
    NAVPAGE.toGoodsDetails(opts)
  }
}
function getUserClickDraw(e) {
  const self = this
  if (e.detail.userDraw || e.detail.target.dataset.userdraw) {
    hasUserDraw = true
    onClickDraw = true
    // 用户已经点击抽奖
    util.setHideLoading(true)
    if (!state.isActive) {
      state.isActive = true
      if (app.globalData.userInfo) {
        handleDraw(state.raffleId, state.raffleActivityId)
      } else {
        // 授权操作在抽奖组件中完成
      }
    } else {
      uni.showToast({
        title: '您已经在抽奖了~',
        icon: 'none',
      })
    }
  }
}
function handleDraw(raffleId, raffleActivityId) {
  const self = this
  const time = state.raffleType === 'LHJ' ? 2400 : 0
  const postData = {
    raffleActivityId,
    raffleId,
    wxaOpenid: app.globalData.userInfo.wxaUser.openId,
  }
  raffleService
    .draw(postData)
    .then((res) => {
      util.setHideLoading(false)
      let raffleInfo = null
      let hasCoupon = true
      if (res.rafflePrizeName == '未中奖') {
        hasCoupon = false
      } else {
        raffleInfo = res
        hasCoupon = true
      }
      setTimeout(() => {
        state.raffleInfo = raffleInfo
        state.hasCoupon = hasCoupon
        state.raffleResult = 'TRUE'
        state.doLuckDraw = true
        state.isActive = false
        toggleMiddlePopup()
      }, time)
    })
    .catch((err) => {
      util.setHideLoading(false)
      state.hasCoupon = false
      state.raffleResult = 'FALSE'
      state.isActive = false
      if (err.code === 41011) {
        setTimeout(() => {
          uni.showToast({
            title: '您今天的抽奖次数已超过上限，明天再来吧~',
            icon: 'none',
            duration: 2000,
          })
          state.raffleResult = 'END'
          state.doLuckDraw = true
          state.luckdrawResText = '抽奖次数已超过上限~'
        }, time)
      } else if (err.code === 41005 || err.code === 41007 || err.code === 41003) {
        // 活动过期
        state.activeState = 'end'
        state.raffleResult = 'END'
        state.doLuckDraw = true
        state.luckdrawResText = '您来晚了~'
        setTimeout(() => {
          toggleMiddlePopup()
        }, time)
      } else if (err.code === 41004 || err.code === 41010) {
        /**
         * 报错原因是券数量不足
         * 弹窗应该是您来晚了奖品已被抽光了！
         */
        setTimeout(() => {
          state.raffleResult = 'END'
          state.doLuckDraw = true
          state.luckdrawResText = '您来晚了~'
          toggleMiddlePopup()
        }, time)
      } else if (err.code === 41014) {
        setTimeout(() => {
          state.raffleResult = 'END'
          state.doLuckDraw = true
          state.luckdrawResText = '您今天已经抽过了，不要贪心哦~'
          uni.showToast({
            title: '您今天已经抽过了，不要贪心哦~',
            icon: 'none',
            duration: 2000,
          })
        }, time)
      } else {
        // 其他报错需要查询具体原因
        setTimeout(() => {
          state.raffleResult = 'END'
          state.doLuckDraw = true
          state.luckdrawResText = '抽奖人数过多，请稍后再试哦~'
          uni.showToast({
            title: '抽奖人数过多，请稍后再试哦~',
            icon: 'none',
            duration: 2000,
          })
        }, time)
      }
    })
}
function handleRaffleCash(self) {
  console.log(self.data.raffleInfo)
  const raffleRecordId = self.data.raffleInfo.id
  raffleService
    .cash(raffleRecordId)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function toShoppingMall() {
  NAVPAGE.toHome()
}
onLoad(function (_options) {
  console.log(_options)
  const self = this
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
  onClickDraw = false // 点击抽奖
  if (_options.raffleId) {
    state.raffleId = _options.raffleId
    state.raffleActivityId = _options.activityId
    state.onLoad = true
    state.navHeight = app.globalData.navHeight
    state.raffleType = _options.raffleType != null ? _options.raffleType : 'LHJ'
    if (_options.type != null) {
      state.type = _options.type
    }
  }
  if (app.globalData.userInfo) {
    state.userInfo = app.globalData.userInfo.wxaUser
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member
      state.isMember = true
    }
    getRaffleById(_options.raffleId)
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId
    try {
      uni.setStorageSync('wj_sharingId', shareId)
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures()
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
})
onReady(function () {})
onShow(function () {
  // 从绑定手机号返回
  if (state.phone === true) {
    handlePopupPhone()
    handleRaffleCash(this)
    if (state.isMember) {
      toggleMiddlePopup()
    }
  }
  checkUserInfo()
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  const sharePictures = state.sharePictures
  if (state.show.middle) {
    toggleMiddlePopup()
  }
  const path = util.getSharePath()
  console.log(path)
  return {
    title: '优惠券大抽奖',
    imageUrl: sharePictures,
    path,
  }
})
function getSharePictures() {
  util
    .getSharePictures('RAFFLE_ACTIVITY')
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
function toggleMiddlePopup() {
  toggle('middle')
}
function toggle(type) {
  state[`show.${type}`] = !state.show[type]
}
function handleUserLogin(e) {
  const self = this
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo
    state.userInfo = user.wxaUser
    getRaffleById(options.raffleId)
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member
      state.isMember = true
    } else {
      state.userInfo = user.wxaUser
    }
  }
}
function handleTabbar(e) {
  if (e.detail.showTabbar === true) {
    state.showTabbar = e.detail.showTabbar
  } else {
    state.showTabbar = e.detail.showTabbar
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
  if (e.detail.bindMobile === true) {
    handlePopupPhone()
    state.isMember = true
  }
}
function getUserIsFans(e) {
  if (e.detail.isFans == false) {
    // 不是粉丝的处理
  } else {
    // 是粉丝的处理
    // 根据全局报错的用户信息检查用户信息
    checkUserInfo()
    getRaffleById(options.raffleId)
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
/* pages/mallModule/activity/luckDraw/luckDraw.wxss */
page {
  position: relative;
}

.top-luckdraw-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 927rpx;
  z-index: -1;
}

.luckdraw {
  background: #fff;
}

.luckdraw-main {
  position: relative;
}

.luckdraw-main luckdraw-game {
}

.luckdraw-text {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 36rpx;
  line-height: 64rpx;
  color: #009f55;
  margin-top: 42rpx;
  margin-bottom: 50rpx;
}

.activity-coupon-box {
  text-align: center;
}

.activity-coupon-box text {
  display: block;
}

.activity-coupon-box .title {
  font-size: 36rpx;
  line-height: 56rpx;
  color: #1c1c1c;
  margin-top: 30rpx;
  margin-bottom: 9rpx;
}

.activity-coupon-box .name {
  font-size: 48rpx;
  line-height: 64rpx;
  color: #019f55;
  margin-bottom: 28rpx;
}

.activity-coupon-box .tips {
  font-size: 30rpx;
  line-height: 50rpx;
  color: #414141;
  margin-bottom: 14rpx;
}

.activity-botton {
  width: 369rpx;
  height: 70rpx;
  background: #019f55;
  border-radius: 10rpx;
  font-size: 30rpx;
  line-height: 70rpx;
  color: #fff;
}

.activity-toshopmall {
  color: #019f55;
  margin-top: 10rpx;
  font-size: 30rpx;
  line-height: 50rpx;
}

.luck-rankings {
  text-align: center;
  margin-top: 35rpx;
}

.luck-rankings .title {
  font-size: 30rpx;
  color: #666;
  position: relative;
  padding: 0 35rpx;
  line-height: 60rpx;
  display: inline-block;
}

.luck-rankings .title::before,
.luck-rankings .title::after {
  width: 192rpx;
  height: 2rpx;
  background: #ccc;
  position: absolute;
  content: '';
}

.luck-rankings .title::before {
  top: 29rpx;
  left: -192rpx;
}

.luck-rankings .title::after {
  top: 29rpx;
  right: -192rpx;
}

.rankings-box {
  padding: 0 36rpx 25rpx 36rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 29rpx;
  position: relative;
}

.rankings-box-line {
  margin: 0 auto;
  background: #e5e5e5;
  width: 665rpx;
  height: 1px;
}

.rankings-item {
  padding: 16rpx 0;
  display: flex;
  text-align: left;
  width: 100%;
  height: 84rpx;
}

.rankings-item .user-logo {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
}

.rankings-info {
  width: calc(100% - 108rpx);
  height: 100%;
  margin-left: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 34rpx;
}

.rankings-info .user-info {
  width: 62%;
}

.rankings-info .user-info > view:first-of-type {
  color: #424242;
  font-size: 20rpx;
}

.rankings-info .user-info > view:first-of-type text {
  color: #555;
  font-size: 24rpx;
  font-weight: bold;
  margin-right: 14rpx;
}

.rankings-info .user-info > view:last-of-type {
  font-size: 24rpx;
  color: #595959;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rankings-info .coupon-name {
  font-size: 24rpx;
  color: #019f55;
  width: 38%;
  text-align: right;
}

.recommend-goods {
  padding: 30rpx 35rpx 0 35rpx;
  text-align: left;
}

.recommend-goods .share-user-logo {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.recommend-goods .share-people {
  display: flex;
  align-items: center;
}

.recommend-goods .share-people view {
  color: #595959;
  font-size: 30rpx;
  line-height: 84rpx;
}

.recommend-goods-list {
  margin-left: 108rpx;
  display: flex;
  justify-content: flex-start;
}

.recommend-goods-list .goods-box {
  width: 170rpx;
  height: 170rpx;
  border: 2px solid #009f55;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10rpx 20rpx 10rpx 0;
  border-radius: 9rpx;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.recommend-goods-list .goods-box::before {
  position: absolute;
  content: '';
  width: 100%;
  height: 18rpx;
  display: block;
  /* background: #009F55; */
  background: #ff9f43;
  top: 0;
  left: 0;
  z-index: 2;
}

.recommend-goods-list image {
  width: 170rpx;
  height: 170rpx;
}

.activity-tips {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30rpx;
}

.activity-tips .title {
  font-size: 30rpx;
  color: #666;
  position: relative;
  padding: 0 35rpx;
  line-height: 60rpx;
  display: inline-block;
}

.activity-tips .title::before,
.activity-tips .title::after {
  width: 236rpx;
  height: 2rpx;
  background: #ccc;
  position: absolute;
  content: '';
}

.activity-tips .title::before {
  top: 29rpx;
  left: -236rpx;
}

.activity-tips .title::after {
  top: 29rpx;
  right: -236rpx;
}

.tips-box {
  width: 100%;
  padding: 0 50rpx 30rpx 50rpx;
  box-sizing: border-box;
}

.tips-box > view {
  display: block;
  font-size: 24rpx;
  color: #424242;
  line-height: 48rpx;
  padding-left: 38rpx;
  position: relative;
}

.tips-box image {
  width: 18rpx;
  height: 24rpx;
  position: absolute;
  top: 12rpx;
  left: 0;
}

/* 弹窗提示 */

.popup-box {
  width: 562rpx;
  background: #fff;
  border-radius: 10rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.popup-close {
  width: 42rpx;
  height: 42rpx;
  position: absolute;
  right: 20rpx;
  top: 20rpx;
}

.popup-close image {
  width: 22rpx;
  height: 22rpx;
}

.popup-title {
  color: #1c1c1c;
  font-size: 34rpx;
  font-weight: 400;
  line-height: 54rpx;
  margin-top: 44rpx;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 59rpx 0;
}

.popup-content text {
  display: block;
}

.popup-text {
  color: #019f55;
  font-size: 44rpx;
  line-height: 68rpx;
  font-weight: 500;
  text-align: center;
  font-family: SourceHanSansCN-Medium;
  margin-top: 50rpx;
  width: 374rpx;
}

.popup-tips {
  color: #1c1c1c;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 54rpx;
}

.popup-button {
  padding-bottom: 52rpx;
  text-align: center;
}

.popup-button text {
  font-size: 30rpx;
  line-height: 50rpx;
  color: #999;
  margin-bottom: 10rpx;
  display: block;
}

.popup-button .toshopmall {
  color: #009f55;
  margin-top: 20rpx;
}

.share-btn {
  font-size: 30rpx;
  color: #fff;
  font-weight: 400;
  text-align: center;
  width: 369rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: #019f55;
  border-radius: 10rpx;
  padding: 0;
}

.navigation-bar-top {
  width: 100%;
}

.popup-windows-box {
  height: 656rpx;
  padding-top: 456rpx;
  width: 100%;
  box-sizing: border-box;
}

.popup-windows-box button {
  font-size: 30rpx;
  color: #fff;
  font-weight: 400;
  text-align: center;
  width: 369rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: #019f55;
  border-radius: 10rpx;
  padding: 0;
}

.luck-draw-btn {
  margin-top: 100rpx;
  width: 415rpx;
  height: 100rpx;
  padding: 0;
  background: transparent;
}

.luck-draw-btn image {
  width: 100%;
  height: 100%;
}

button.disabled {
  opacity: 0.6;
}
</style>
