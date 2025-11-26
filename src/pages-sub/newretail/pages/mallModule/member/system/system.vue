<template>
<!--pages/system/system.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
  <!-- <view class="section">
        <text>关于我们</text>
        <image class="right-icon" src="{{state.imagesPath.iconPointRight}}"></image>
    </view> -->
  <view class="section" @click="unbindMobile">
    <text>解绑会员</text>
    <image class="right-icon" :src="state.imagesPath.iconPointRight"></image>
  </view>
  <view class="section">
    <text @longpress="toCouponCenter">当前版本</text>
    <text class="line">{{state.version}}</text>
  </view>
  <!-- <view class="section">
    <text>当前位置</text>
    <view class="copy-btn" bindtap="copyLocation">复制</view>
    <text class="location" selectable='true'>{{state.location.latitude + ',' + state.location.longitude}}</text>
  </view> -->
  <view class="clear-torage">
    <view @click="clearStorage" :style="'color: ' + state.themeColor + ';border: 2rpx solid ' + state.themeColor + ';'">清除缓存</view>
  </view>
</view>
</template>
<script setup>
import _utilsAuthJs from "@/utils/newretail/auth";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsThemeManager from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _apiRequestJs from "@/service/api/newretail/request";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/system/system.js
const request = _apiRequestJs;
const wxaUserService = _apiWxaUserServiceJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManager;
const UTILS = _utilsUtilsJs;
const auth = _utilsAuthJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "系统设置",
  imagesPath: IMGAGESPATH,
  version: "0.0.1",
  location: {
    latitude: 0,
    longitude: 0
  },
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor')
});
onLoad(function (options) {
  uni.hideShareMenu();
  // 统计PV
  state.version = request.APP_VERSION;
  state.location = {
    latitude: app.globalData.location.latitude.toFixed(6),
    longitude: app.globalData.location.longitude.toFixed(6)
  };
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function toCouponCenter() {
  let opts = '?formtype=admin';
  NAVPAGE.toCouponCenter(opts);
}
function copyLocation() {
  let location = state.location.latitude + ',' + state.location.longitude;
  uni.setClipboardData({
    data: location,
    success(res) {
      uni.hideToast();
      uni.showToast({
        title: "位置信息复制成功",
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function clearStorage() {
  // app.globalData.storeInfo = null
  try {
    uni.removeStorageSync('wj_sceneForm');
    uni.removeStorageSync('wj_speechSearch');
    uni.removeStorageSync('wj_sharingId');
    uni.removeStorageSync('wj_sharingInfo');
    uni.removeStorageSync('wj_shopcart');
    uni.removeStorageSync('wj_storePickupTime'); // 自提时间
    uni.removeStorageSync('wj_pageUrl');
    uni.removeStorageSync('wj_distributionStore');
    uni.removeStorageSync('wj_nextDayStore');
    uni.removeStorageSync('searchDataLog');
    uni.removeStorageSync('wj_sharePictures'); // 分享图
    uni.removeStorageSync('wj_queryStoreTime'); // 查询门店记录
    uni.removeStorageSync('wj_refreshNotify'); // 门店刷新记录
    uni.removeStorageSync('wj_wxa_formId'); // formid
    uni.removeStorageSync('wj_chooseCoupon'); // 已选择的优惠券
    uni.removeStorageSync('wj_locationInfo'); // 经纬度信息
    uni.removeStorageSync('wj_payCodeTimePay'); // 付款码记录
    uni.removeStorageSync('wj_queryStoreTimeCount'); // 门店刷新记录
    uni.removeStorageSync('__distributor__'); // 分销账户信息
    //   app.globalData.distributorInfo = null // 分销账户信息
    uni.removeStorage({
      key: 'wj_allStores',
      success(res) {
        uni.reLaunch({
          url: '/pages-sub/newretail/pages/mallModule/index/index/index'
        });
      }
    });
    //   wx.removeStorageSync('wj_UIConfig') //清除UIconfig
  } catch (e) {
    // Do something when catch error
  }
}
function unbindMobile() {
  if (!app.globalData.userInfo || !app.globalData.userInfo.member) {
    uni.showToast({
      title: '未登录，无法解绑'
    });
    return false;
  }
  uni.showModal({
    title: '提示',
    content: '是否确认解绑手机号' + app.globalData.userInfo.member.mobile + '，解绑后需重新绑定手机号',
    success(res) {
      if (res.confirm) {
        console.log('用户点击确定');
        wxaUserService.unbindMobile().then(res => {
          app.globalData.userInfo = null;
          auth.clearUserInfo();
          auth.clearTokens();
          NAVPAGE.toAuthorize();
        }).catch(err => {
          UTILS.showToast(err.message);
        });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    }
  });
}
</script>
<style scoped>
/* pages/system/system.wxss */
page {
  /* background: #f1f1f1; */
  border-top: 1rpx solid #f1f1f1;
}

.content {
  padding: 0 40rpx;
  box-sizing: border-box;
  background: #ffffff;
}

.section {
  /* padding: 0rpx 30rpx; */
  height: 90rpx;
  line-height: 90rpx;
  border-bottom: 1rpx solid #dcdcdc;
  text-align: left;
  font-size: 32rpx;
  color: #1b1b1d;
}

.section:last-of-type {
  border: none;
}

.section image.right-icon {
  float: right;
  width: 16rpx;
  height: 32rpx;
  margin-top: 26rpx;
}

.line {
  font-size: 28rpx;
  line-height: 90rpx;
  color: #313131;
  text-decoration: underline;
  float: right;
  margin-right: 36rpx;
}

.location {
  float: right;
  margin-right: 24rpx;
  color: #454545;
  font-size: 26rpx;
}

.copy-btn {
  float: right;
  border: 2rpx solid #454545;
  font-size: 26rpx;
  color: #454545;
  line-height: 40rpx;
  height: 40rpx;
  padding: 0 12rpx;
  border-radius: 12rpx;
  margin-top: 23rpx;
}

.clear-torage view {
  width: 600rpx;
  height: 90rpx;
  font-size: 36rpx;
  color: #009F55;
  font-weight: bold;
  line-height: 90rpx;
  border: 2rpx solid #009F55;
  border-radius: 16rpx;
  display: block;
  text-align: center;
  margin: 80rpx auto;
}
</style>