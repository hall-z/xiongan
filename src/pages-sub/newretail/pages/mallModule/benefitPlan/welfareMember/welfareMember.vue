<template>
  <!-- pages/addressList/addressList.wxml -->
  <view class="content">
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <view class="title">
      <view>
        <!-- <image src="{{imagesPath.iconPositionActive}}" ></image> -->
        <text>发放信息</text>
      </view>
      <!-- <view class="delete" style="color: {{state.themeColor}}"  bindtap="bindDelete">
            <image src="{{state.imagesPath.iconAddressDelete}}" ></image>
            <text>{{isDeleteText}}</text>
        </view> -->
    </view>
    <view v-for="(planDetail, index) in state.benefitPlan" class="plan-detail">
      <view v-for="(item, index) in state.planDetailKeyList">
        <text>{{ item.label }}</text>
        <text>
          {{ planDetail[item.key] }}{{ item.key == 'score' ? '积分' : ''
          }}{{ item.key == 'startTime' && planDetail.endTime ? '-' + planDetail.endTime : '' }}
        </text>
      </view>
    </view>
  </view>
  <view
    style="
      display: flex;
      position: fixed;
      bottom: 0;
      justify-content: space-around;
      width: 100%;
      border-top: 1rpx solid #dcdcdc;
    "
  >
    <view class="bottom-box" @click="toSign">
      <button class="btn" :style="'background: ' + state.themeColor">签字签收</button>
    </view>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _libsQqmapWxJssdkMinJs from '@/libs/qqmap-wx-jssdk'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _apiAddressServiceJs from '@/service/api/newretail/addressService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/addressList/addressList.js
const addressService = _apiAddressServiceJs
const NAVPAGE = _utilsNavPageJs
const QQMapWX = _libsQqmapWxJssdkMinJs
const memberService = _apiMemberServiceJs
let qqmapsdk
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const ADDRESS = _utilsAddressJs
const themeManager = _utilsThemeManagerJs

// 获取应用实例
const state = reactive({
  benefitPlan: [],
  planDetailKeyList: [
    {
      label: '发放计划：',
      key: 'benefitPlanName',
    },
    {
      label: '发放工会：',
      key: 'unionName',
    },
    {
      label: '发放积分：',
      key: 'score',
    },
    {
      label: '发放员工：',
      key: 'unionUserName',
    },
    {
      label: '积分可用时间：',
      key: 'startTime',
    },
  ],
  navigationBarTitle: '领取详情',
  imagesPath: IMGAGESPATH,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
})
function handleRefresh() {
  getPlanList()
}
function getPlanList() {
  uni.showLoading({
    title: '加载中',
  })
  memberService
    .benefitPlanGetByMemberId(app.globalData.userInfo.member.id)
    .then((res) => {
      state.benefitPlan = res || []
      console.log(res, 'resresresres')
    })
    .finally(() => {
      uni.hideLoading()
    })
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false
  } else {
    return true
  }
}
onLoad(function (options) {
  uni.hideShareMenu()
  // 实例化API核心类
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey,
    })
  })
  state.themeColor = app.globalData.uiconfig.themeColor
  if (app.globalData.userInfo.member) {
    getPlanList()
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
})
onReady(function () {})
onShow(function () {
  uni.hideShareMenu()
  uni.setStorageSync('signList', '')
  if (app.globalData.userInfo.member) {
    getPlanList()
  } else {
    uni.showToast({
      title: '您还不是会员，请先绑定手机号码成为会员',
      icon: 'none',
      duration: 2000,
    })
  }
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {})
function toSign() {
  const ids = []
  state.benefitPlan.forEach((item) => {
    ids.push(item.id)
  })
  uni.setStorageSync('signList', JSON.stringify(ids))
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/benefitPlan/grantSign/grantSign',
  })
}
</script>
<style scoped>
/* pages/addressList/addressList.wxss */

page {
  background: #ffffff;
  /* height: 100%; */
}

.content {
  /* margin-bottom: 100rpx; */
  padding: 0 20rpx 150rpx;
  width: 100%;
  /* height: 100%; */
  box-sizing: border-box;
  background: #fff;
  margin-bottom: 20rpx;
}

.title {
  font-size: 28rpx;
  height: 90rpx;
  line-height: 90rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  border-bottom: 1rpx solid #f1f1f1;
}

.title view:first-of-type {
  color: #454545;
}

.title view:first-of-type image {
  width: 25rpx;
  height: 30rpx;
  vertical-align: middle;
  margin-right: 18rpx;
  margin-top: -6rpx;
}

/* .title view:last-of-type {
    color: #009f55;
  } */
/* 
  .title view:last-of-type image {
    width: 20rpx;
    height: 20rpx;
    margin-right: 15rpx;
    margin-top: -6rpx;
  } */

/* .title view.delete {
    color: #454545;
  } */

/* .title view.delete image {
    width: 29rpx;
    height: 35rpx;
    vertical-align: middle;
    margin-top: -9rpx;
  } */

.bottom-box {
  /* width: 100%; */
  height: 130rpx;
  /* border-top: 1rpx solid #dcdcdc; */
  text-align: center;
  line-height: 100rpx;
  /* position: fixed;
    bottom: 0rpx; */
  left: 0rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  z-index: 999;
}

.bottom-box image {
  width: 36rpx;
  height: 36rpx;
  vertical-align: middle;
  margin-top: -6rpx;
  font-size: 36rpx;
}

.bottom-box button {
  height: 88rpx;
  width: 300rpx;
  line-height: 88rpx;
  color: #fff;
  background: #009f55;
  padding: 0;
  border-radius: 6rpx;
}
.plan-detail {
  border: 1px solid #ccc;
  padding: 15rpx;
  font-size: 24rpx;
  margin-bottom: 15px;
}
.plan-detail view {
  line-height: 40rpx;
}
.plan-detail view text {
  display: inline-block;
  /* min-width: 50%; */
}
/* .plan-detail view text:first-of-type {
    text-align: right;
    min-width: 40%;
  } */
</style>
