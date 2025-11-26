<template>
<!--pages/giftCard/giftCardPayQR/giftCardPayQR.wxml-->
<view>

<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
  <!--<template is="barcode"></template>-->
  <view class="qrcode-box">
    <canvas canvas-id="qrcode">
  </canvas></view>
  <view class="number">{{filters.filtQRNumber(state.authCode)}}</view>
</view>
<text class="tig">每分钟自动刷新</text></view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsSelfJs from "@/utils/newretail/self";
import _apiGiftCardServiceJs from "@/service/api/newretail/giftCardService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/giftCard/giftCardPayQR/giftCardPayQR.js
const giftCardService = _apiGiftCardServiceJs;
const wxbarcode = _utilsSelfJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
let time;

//获取应用实例
const state = reactive({
  navigationBarTitle: "礼品卡支付",
  imagesPath: IMGAGESPATH,
  cardNo: '',
  authCode: ''
});
onLoad(function (options) {
  console.log(options);
  if (options.cardNo) {
    state.cardNo = options.cardNo;
  }
  getPayCode();
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {
  clearTimeout(time);
});
onUnload(function () {
  clearTimeout(time);
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
function getPayQrCode(content) {
  wxbarcode.barcode('barcode', content, 585, 144);
  wxbarcode.qrcode('qrcode', content, 420, 420);
}
function getPayCode() {
  let that = this;
  giftCardService.getPayCode(state.cardNo).then(res => {
    console.log(res);
    state.authCode = res.authCode;
    getPayQrCode(res.authCode);
    let expiresIn = res.expiresIn * 1000;
    time = setTimeout(() => {
      console.log('刷新了');
      getPayCode();
    }, expiresIn);
  }).catch(err => {
    uni.showToast({
      title: "请选择卡面额",
      icon: 'none',
      duration: 2000
    });
  });
}
</script>
<style scoped>
/* pages/giftCard/giftCardPayQR/giftCardPayQR.wxss */
/* @import "../../template/barcode.wxss"; */

page{
  background: #F4F5F9;
  text-align: center;
}

.content{
  width: 688rpx;
  height: 790rpx;
  background: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  margin: 0 auto;
  text-align: center;
  margin-top: 100rpx;
  position: relative;
}

.qrcode-box{
  text-align: center;
  width: 100%;
  height: 360rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40rpx;
}
.qrcode-box canvas{
  width: 420rpx;
  height: 420rpx;
  margin-top: 30rpx;
}

.content .number{
  font-size: 40rpx;
  margin-top: 50rpx;
}

.tig{
  font-size: 30rpx;
  color: #999;
}
</style>