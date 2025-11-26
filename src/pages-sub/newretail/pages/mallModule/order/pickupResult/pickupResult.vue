<template>
<!-- pages/mallModule/order/pickupResult/pickupResult.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="icon-box">
  <icon :type="state.type" :size="state.size"></icon>
  <view class="status-text">{{state.status}}</view>
</view>
<view class="express-info" v-if="state.type == 'success'">
  <view>
    <text class="left">快递单号：</text>
    <text class="right">{{state.trackingNumber}}</text>
  </view>
  <view>
    <text class="left">手机号：</text>
    <text class="right">{{state.mobile}}</text>
  </view>
  <view>
    <text class="left">取件号：</text>
    <text class="right">{{state.takeCode}}</text>
  </view>
</view>
<view v-if="state.type != 'success'">
  <view class="warn-notice">当前小程序会员手机号与收件人手机号不符请通过
    <text>取件号</text>取件</view>
  <view class="input-box">
    <text>取件号：</text>
    <input type="number" placeholder="输入取件号" @input="bindKeyInput">
  </view>
</view>
<view class="button-box">
  <text v-if="state.type == 'success'">*匹配成功后请将本页面出示给店员确认</text>
  <button v-if="state.type == 'success'" @click="tapBackToRoot">随便逛逛</button>
  <button v-else @click="tapPickUp">重新查询</button>
</view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/order/pickupResult/pickupResult.js
const request = _apiOrderServiceJs;
const NAVPAGE = _utilsNavPageJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "取件结果",
  type: 'success',
  //success,warn
  size: '168rpx',
  status: "取件成功",
  //取件成功，取件失败
  mobile: "",
  takeCode: "",
  trackingNumber: "",
  inputValue: ''
});
onLoad(function (options) {
  uni.hideShareMenu();
  state.size = 168 * app.globalData.systemInfo.windowWidth / 750;
  if (options.result == 'true') {
    let res = JSON.parse(options.res);
    state.type = 'success';
    state.status = '取件成功';
    state.mobile = res.mobile;
    state.takeCode = res.takeCode;
    state.trackingNumber = res.trackingNumber;
  } else {
    state.type = "warn";
    state.status = '取件失败';
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
function tapPickUp() {
  if (state.inputValue.length == 0) {
    uni.showToast({
      title: '请输入取件号',
      icon: 'none'
    });
    return;
  }
  const that = this;
  request.pickUp('', state.inputValue).then(res => {
    state.type = 'success';
    state.status = '取件成功';
    state.mobile = res.mobile;
    state.takeCode = res.takeCode;
    state.trackingNumber = res.trackingNumber;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function bindKeyInput(e) {
  state.inputValue = e.detail.value;
}
function tapBackToRoot(e) {
  NAVPAGE.toRoot();
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
});
</script>
<style scoped>
/* pages/mallModule/order/pickupResult/pickupResult.wxss */
.icon-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 108rpx 0 70rpx 0;
  border-bottom: 1px solid #C7C7C7;
  margin: 0 38rpx;
}

.status-text {
  font-size: 36rpx;
  line-height: 56rpx;
  margin-top: 53rpx;
  color: #5A5A5A;
}

.express-info {
  font-size: 36rpx;
  padding: 27rpx 38rpx;
}

.express-info>view {
  height: 72rpx;
  line-height: 72rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.express-info text {
  display: block;
}

.express-info .left {
  color: #666666;
  width: 180rpx;
}

.warn-notice {
  padding: 42rpx 38rpx 55rpx;
  font-size: 34rpx;
  line-height: 46rpx;
  color: #666666;
}

.warn-notice text {
  color: #0198FF;
}

.input-box {
  margin: 0 38rpx 27rpx;
  height: 114rpx;
  line-height: 114rpx;
  border-bottom: 1px solid #C7C7C7;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.input-box text {
  display: block;
  width: 160rpx;
  font-size: 34rpx;
  color: #666666;
}

.input-box input {
  width: calc(100% - 160rpx);
  font-size: 40rpx;
}

.button-box {
  padding: 83rpx 38rpx 40rpx 38rpx;
}

.button-box text {
  display: block;
  font-size: 30rpx;
  color: #989898;
  line-height: 50rpx;
  margin-bottom: 15rpx;
}

.button-box button {
  width: 675rpx;
  height: 90rpx;
  background: #FF7200;
  border-radius: 8rpx;
  font-size: 42rpx;
  line-height: 90rpx;
  color: #ffffff;
}

.button-box button::after {
  border: none;
}
</style>