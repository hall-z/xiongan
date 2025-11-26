<template>
<!--pages/mallModule/order/pickup/pickup.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="title">快递单号</view>
<view class="input-box">
  <input id="courierNumber" type="number" placeholder="输入或扫一扫快递单号" :value="state.inputValue" @input="actionInput">
  <label for="courierNumber" @click.stop="scanCode">
    <image :src="state.imagesPath.iconSweepCode"></image>
  </label>
</view>
<view class="button-box" @click="tapPickUp">
  <button>查询</button>
</view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/order/pickup/pickup.js
const IMAGESPATH = _utilsImagesPathJs;
const request = _apiOrderServiceJs;
const NAVPAGE = _utilsNavPageJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const util = _utilsUtilsJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "取件",
  imagesPath: IMAGESPATH,
  inputValue: ""
});
onLoad(function (options) {
  // 统计PV
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
function actionInput(e) {
  state.inputValue = e.detail.value;
}
function tapPickUp() {
  if (state.inputValue.length == 0) {
    uni.showToast({
      title: '请输入快递单号',
      icon: 'none'
    });
    return;
  }
  httpPickUp();
}
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let path = util.getSharePath();
  return {
    path: path
  };
});
function scanCode() {
  const that = this;
  uni.scanCode({
    onlyFromCamera: true,
    success(res) {
      console.log(res);
      state.inputValue = res.result;
      httpPickUp();
    }
  });
}
function httpPickUp() {
  request.pickUp(state.inputValue, '').then(res => {
    console.log(res);
    let resString = JSON.stringify(res);
    let param = "?result=true&res=" + resString;
    NAVPAGE.toPickUpResult(param);
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
    NAVPAGE.toPickUpResult("?result=false");
  });
}
</script>
<style scoped>
/* pages/mallModule/order/pickup/pickup.wxss */

.title {
  font-size: 34rpx;
  color: #666;
  line-height: 48rpx;
  margin: 35rpx 0 17rpx;
  padding: 0 38rpx;
}

.input-box {
  height: 124rpx;
  padding-right: 80rpx;
  position: relative;
  border-bottom: 2rpx solid #c7c7c7;
  margin: 0 38rpx;
}

.input-box input {
  width: 100%;
  height: 100%;
}

.input-box label {
  position: absolute;
  right: 0;
  top: 42rpx;
}

.input-box image {
  width: 44rpx;
  height: 44rpx;
}

.button-box {
  padding: 0 38rpx;
  margin-top: 218rpx;
}

button {
  width: 675rpx;
  height: 90rpx;
  background: #ff7200;
  border-radius: 8rpx;
  font-size: 42rpx;
  color: #fff;
  line-height: 90rpx;
}

</style>