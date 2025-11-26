<template>
<!-- pages/selectAddress/selectAddress.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>

<!--<template is="searchTemplate" :data="state.searchLabelShow"></template>-->
<view class="current-position">
    <view :style="'color: ' + state.themeColor">
        <text>{{state.currentAddress}}</text>
        <text>(当前定位)</text>
    </view>
    <image :src="state.imagesPath.iconRefresh" @click="handleRefresh"></image>
</view>
<view class="nearby-title">
    附近地址
</view>
<view class="store-item" v-for="(item , index) in state.nearbyAddress" :key="index" :data-name="item.title" :data-address="item.address" :data-location="item.location" @click="clickAddress">
    <view>{{item.title}}</view>
    <view>{{item.address}}</view>
</view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _libsQqmapWxJssdkMinJs from "@/libs/qqmap-wx-jssdk";
import _utilsNavPageJs from "@/utils/newretail/navPage";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/selectAddress/selectAddress.js
const NAVPAGE = _utilsNavPageJs;
let QQMapWX = _libsQqmapWxJssdkMinJs;
let qqmapsdk;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const ADDRESS = _utilsAddressJs;
const themeManager = _utilsThemeManagerJs;
const util = _utilsUtilsJs;
//获取应用实例
const state = reactive({
  navigationBarTitle: "选择地址",
  imagesPath: IMGAGESPATH,
  searchLabelShow: false,
  currentAddress: "",
  nearbyAddress: [],
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor')
});
function handleFocus(e) {
  state.searchLabelShow = true;
}
function handleBlur(e) {
  console.log(e);
  if (!e.detail.value) {
    state.searchLabelShow = false;
  } else {
    handleConfirm(e.detail.value);
  }
}
function handleRefresh() {
  getAddressList(this);
}
function clickAddress(val) {
  let opts = '?name=' + val.currentTarget.dataset.name + '&lat=' + val.currentTarget.dataset.location.lat + '&lng=' + val.currentTarget.dataset.location.lng;
  NAVPAGE.toSelectStore(opts);
}
function getAddressList(self) {
  uni.showLoading({
    title: '加载中'
  });
  //1、获取当前位置坐标
  uni.getLocation({
    type: 'gcj02',
    success: function (res) {
      let latitude = res.latitude;
      let longitude = res.longitude;
      //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
      util.inverseAnalysisAddress(latitude, longitude).then(res => {
        let resData = res.data.result || res.result;
        self.setData({
          currentAddress: resData.formatted_address ? resData.formatted_address : resData.formattedAddresses.recommend,
          // 获取经过腾讯地图优化过的地理位置描述
          nearbyAddress: resData.pois // 获取附近poi列表
        });
        uni.hideLoading();
      });
      // qqmapsdk.reverseGeocoder({
      //   location: {
      //     latitude: latitude,
      //     longitude: longitude
      //   },
      //   get_poi: 1,
      //   success: function (res) {
      //     self.setData({
      //       currentAddress: res.result.formatted_addresses.recommend, // 获取经过腾讯地图优化过的地理位置描述
      //       nearbyAddress: res.result.pois // 获取附近poi列表
      //     })
      //     wx.hideLoading()
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //   }
      // })
    }
  });
}
onLoad(function (options) {
  uni.hideShareMenu();
  // 实例化API核心类
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey
    });
  });
  getAddressList(this);
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  state.themeColor = app.globalData.uiconfig.themeColor;
});
function handleInput(e) {
  if (!e.detail.value) {
    handleRefresh();
  }
}
function handleConfirm(val) {
  let self = this;
  if (!val.detail.value) {
    handleRefresh();
  } else {
    qqmapsdk.search({
      keyword: val.detail.value,
      success: function (res) {
        console.log(res);
        state.nearbyAddress = res.data;
      },
      fail: function (res) {
        console.log(res);
      }
    });
  }
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/selectAddress/selectAddress.wxss */

page {
    background: #eee;
}
.current-position,
.nearby-title,
.store-item {
    padding: 0rpx 30rpx;
}

.current-position {
    height: 98rpx;
    background: #fff;
    line-height: 98rpx;
    border-bottom: 1rpx solid #d8dbdb;
    margin-top: 10rpx;
    font-size: 26rpx;
    overflow: hidden;
}

.current-position image {
    float: right;
    width: 34rpx;
    height: 36rpx;
    margin-top: 31rpx;
}

.current-position view {
    float: left;
    color: #009f55;
}

.current-position view text:last-of-type {
    font-size: 22rpx;
}

.nearby-title {
    font-size: 28rpx;
    color: #9b9b9b;
    height: 80rpx;
    line-height: 80rpx;
}

.store-item {
    height: 150rpx;
    background: #fff;
    border-bottom: 1px solid #eee;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
}

.store-item view:first-of-type {
    font-size: 32rpx;
    margin-bottom: 20rpx;
}

.store-item view:last-of-type {
    color: #8e8e8e;
    font-size: 26rpx;
}
</style>