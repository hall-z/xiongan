<template>
<!--pages/balancePay/balancePay.wxml-->
<view>

<view class="content">
  <view class="title">向商家付款</view>
  <!--<template is="barcode"></template>-->
  <text class="number">{{filtQRNumber(state.payNumber)}}</text>
  <view class="qrcode-box">
    <canvas canvas-id="qrcode">
  </canvas></view>
  <text class="tig">付款码每分钟自动刷新</text>
  <view class="value-info">
    <text>储值余额：￥{{state.storedValue}}</text>
    <view @click="toBalancePay">前往充值 <image class="right-icon" src="https://app-1256684088.cos.ap-beijing.myqcloud.com/MemberImgs/iconRightPoint.png"></image></view>
  </view>
</view></view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _utilsSelfJs from "@/utils/newretail/self";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/balancePay/balancePay.js
const wxbarcode = _utilsSelfJs;
const memberService = _apiMemberServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
let _time;

//获取应用实例
const state = reactive({
  navigationBarTitle: "余额支付",
  imagesPath: IMGAGESPATH,
  payNumber: '',
  storedValue: 0
});
onLoad(function (options) {
  getPayQrCode();
  getMbrBalance();
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {
  clearTimeout(_time);
});
onUnload(function () {
  clearTimeout(_time);
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
function getPayQrCode() {
  const that = this;
  memberService.getPayCode().then(res => {
    console.log(res);
    wxbarcode.barcode('barcode', res.code, 585, 144);
    wxbarcode.qrcode('qrcode', res.code, 380, 380);
    state.payNumber = res.code;
    let expiresInSeconds = res.expiresInSeconds * 1000;
    _time = setTimeout(() => {
      getPayQrCode();
      console.log('刷新了');
    }, expiresInSeconds);
  });
}
function getMbrBalance() {
  memberService.getMbrBalance().then(res => {
    state.storedValue = res;
  }).catch(err => {
    if (e.message !== "查询会员余额失败") {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    } else {
      console.log("查询会员余额失败");
    }
  });
}
function toBalancePay() {
  uni.navigateTo({
    url: '../storedValue/storedValue'
  });
}
</script>
<style scoped>
/* pages/balancePay/balancePay.wxss */
/* @import "../../template/barcode.wxss"; */

page{
  background: #f1b400;
}

.content{
  width: 688rpx;
  height: 906rpx;
  background: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  margin: 0 auto;
  text-align: center;
  margin-top: 50rpx;
  position: relative;
}

.content .title{
  width: 100%;
  height: 92rpx;
  line-height: 92rpx;
  background: #F4F5F9;
  font-size: 36rpx;
  color: #333;
}

.qrcode-box{
  text-align: center;
  width: 100%;
  height: 360rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.qrcode-box canvas{
  width: 380rpx;
  height: 380rpx;
}

.content .tig{
  font-size: 30rpx;
  color: #999;
}

.value-info{
  width: 100%;
  height: 100rpx;
  font-size: 30rpx;
  line-height: 100rpx;
  position: absolute;
  bottom: 0rpx;
  left: 0rpx;
  border-top: 1rpx dashed #CCCCCC;
}

.value-info >text{
  float: left;
  margin-left: 50rpx;
  color: #333;
}
.value-info view{
  float: right;
  margin-right: 50rpx;
  color: #999;
}
.right-icon{
  width: 16rpx;
  height: 32rpx;
  vertical-align: middle;
  margin-top: -6rpx;
}
</style>