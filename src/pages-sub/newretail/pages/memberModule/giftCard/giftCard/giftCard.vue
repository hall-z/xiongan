<template>
  <!--pages/giftCard/giftCard.wxml-->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view class="top-img" v-if="state.bannerList.length > 0">
    <image :src="state.bannerList"></image>
  </view>
  <view class="activity-box" v-for="(item, index) in state.activityGroup" :key="index">
    <view class="title">{{ item.name }}</view>
    <view
      class="act-item"
      @click="toGiftCardBuy"
      v-for="(it, index) in item.giftCardActivity"
      :key="it.giftCardActivityId"
      :data-id="it.giftCardActivityId"
    >
      <image :src="it.giftCardImageUrl"></image>
      <text>{{ it.giftCardActivityName }}</text>
    </view>
  </view>
  <view
    v-if="state.activityGroup.length === 0 && state.bannerList.length === 0"
    class="no-data no-data1"
  >
    <image :src="state.imagesPath.imgNoGiftCardBuy"></image>
    <button
      size="mini"
      @click="toHome"
      :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'"
    >
      随便逛逛
    </button>
  </view>
  <view
    v-if="state.activityGroup.length === 0 && state.bannerList.length !== 0"
    class="no-data no-data2"
  >
    <image :src="state.imagesPath.imgNoGiftCardBuy"></image>
    <button
      size="mini"
      @click="toHome"
      :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'"
    >
      随便逛逛
    </button>
  </view>
  <view class="footer" @click="toBuyHistory">
    <image :src="state.imagesPath.iconBuyHis"></image>
    我的礼品卡
  </view>
</template>
<script setup>
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _apiBannerServiceJs from '@/service/api/newretail/bannerService'
import _apiGiftCardServiceJs from '@/service/api/newretail/giftCardService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/giftCard/giftCard.js
const giftCardService = _apiGiftCardServiceJs
const bannerService = _apiBannerServiceJs
const NAVPAGE = _utilsNavPageJs
const IMGAGESPATH = _utilsImagesPathJs
const utils = _utilsUtilsJs
const wxaUserService = _apiWxaUserServiceJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs
const selfJs = _utilsSelfJs
const state = reactive({
  navigationBarTitle: '礼品卡',
  imagesPath: IMGAGESPATH,
  bannerList: [],
  activityGroup: [],
  options: {},
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
})
onLoad(function (options) {
  state.options = options
  queryActivityGroup()
  getBannerList()
  setSharePeopleInfo(options)
  // 统计PV
  state.themeColor = app.globalData.uiconfig.themeColor
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
})
function checkUserInfo() {
  if (!app.globalData.userInfo) {
    NAVPAGE.toAuthorize()
  }
}
function setSharePeopleInfo(options) {
  const shareData = {
    shareId: null,
  }
  if (options.scene) {
    const scene = decodeURIComponent(options.scene)
    if (scene.indexOf('gmparam:') >= 0) {
      const sceneArr = scene.split('gmparam:')
      const _sceneId = sceneArr[1]
      sceneId = _sceneId != null ? _sceneId : null
      getSceneById(sceneId)
    } else {
      saveGiftCardPerson(scene)
      // 分享信息打开统计
      ANALYSIS.ShareOpenAnalysis()
    }
  } else if (options.shareId && options.shareId != '' && options.shareId != null) {
    saveGiftCardPerson(options.shareId)
    // 分享信息打开统计
    ANALYSIS.ShareOpenAnalysis()
  }
}
function saveGiftCardPerson(shareId) {
  if (!shareId) {
    return
  }
  const shareData = {
    shareId,
  }
  utils.setSharingGiftCardPerson(shareData)
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
onReady(function () {})
onShow(function () {
  // 判断用户是否授权
  checkUserInfo()
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function (res) {
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  let path = '/pages-sub/newretail/pages/mallModule/index/index/index'
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const memberId = app.globalData.userInfo.member.id
    path = path + '?shareId=' + memberId
  }
  return {
    path,
  }
})
function toGiftCardBuy(e) {
  const opts = '?giftCardActivityId=' + e.currentTarget.dataset.id
  NAVPAGE.toGiftCardBuy(opts)
}
function toBuyHistory() {
  NAVPAGE.toBuyHistory()
}
function getBannerList() {
  bannerService
    .getBannerList('GIFTCARD')
    .then((res) => {
      console.log(res)
      if (res && res.length > 0) {
        state.bannerList = res[0].pictureUrl
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
function queryActivityGroup() {
  giftCardService
    .queryActivityGroup()
    .then((res) => {
      console.log(res)
      const tempData = []
      if (res.length > 0) {
        res.forEach((ele) => {
          const tempActivitys = []
          if (ele.giftCardActivity && ele.giftCardActivity.length > 0) {
            const now = new utils.ResponseDate().getTime()
            ele.giftCardActivity.forEach((item) => {
              const beginDate = new Date(item.beginDate.replace(/-/g, '/')).getTime()
              const endDate = new Date(item.endDate.replace(/-/g, '/')).getTime()
              if (now >= beginDate && now < endDate) {
                tempActivitys.push(item)
              }
            })
          }
          const tempEle = {
            ...ele,
            giftCardActivity: tempActivitys,
          }
          if (tempEle.giftCardActivity.length > 0) {
            tempData.push(tempEle)
          }
        })
      }
      //   this.data.activityGroup.forEach((group,groupIndex) => {
      //     group.giftCardActivity.forEach(async (item,index) => {
      //         if(item.giftCardImageUrl) {
      //             await selfJs.getTemporaryUrl(item.giftCardImageUrl)
      //             .then (res1=>{
      //                 item.giftCardImageUrl = res1;
      //                 this.setData({
      //                     activityGroup: this.data.activityGroup
      //                 })
      //             })
      //         }
      //     })
      //   })
      state.activityGroup = tempData
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
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
      saveGiftCardPerson(_options.shareId)
    })
    .catch((err) => {
      util.showToast(err.message)
    })
}
function toHome() {
  NAVPAGE.toHome()
}
</script>
<style scoped>
/* pages/giftCard/giftCard.wxss */
page {
  background: #fffbff;
  padding-bottom: 70rpx;
}

.top-img {
  width: 100%;
  height: 628rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
}

.top-img image {
  width: 100%;
  height: 100%;
}

.activity-box {
  padding: 0rpx 40rpx;
  box-sizing: border-box;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.activity-box .title {
  font-size: 32rpx;
  color: #000;
  margin-bottom: 20rpx;
}

.activity-box .act-item {
  width: 314.6rpx;
  height: 252.8rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-sizing: border-box;
  text-align: center;
  background: #fff;
  box-shadow: 0rpx 4rpx 28rpx 0rpx rgba(0, 0, 0, 0.15);
  font-size: 25rpx;
  float: left;
  margin-right: 40rpx;
  margin-bottom: 40rpx;
}

.activity-box .act-item:nth-of-type(2n + 1) {
  margin-right: 0rpx;
}

.act-item image {
  width: 100%;
  height: 186rpx;
}

.act-item text {
  line-height: 50rpx;
}

.footer {
  font-size: 30rpx;
  color: #2d5170;
  text-align: center;
  width: 100%;
  height: 80rpx;
  line-height: 70rpx;
  margin-bottom: 0rpx;
  position: fixed;
  bottom: 0px;
  left: 0px;
  background: #fffbff;
}

.footer image {
  width: 30rpx;
  height: 30rpx;
  vertical-align: middle;
  margin-top: -6rpx;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.no-data1 {
  margin-top: 40%;
}

.no-data2 {
  text-align: center;
}

.no-data1 image,
.no-data2 image {
  width: 242rpx;
  height: 247rpx;
  margin-top: 20rpx;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  margin-top: 50rpx;
  width: 262rpx;
  height: 60rpx;
  background: transparent;
}
</style>
