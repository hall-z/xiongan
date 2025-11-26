<template>
<!--pages/memberModule/giftCard/bindGiftCard/bindGiftCard.wxml-->
<view>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="bind-gift">
    <image :src="state.themeManager.BASE_URL + '/bindbg.png'" class="bindbg"></image>
    <view class="bind-box">
        <text class="bind-font">请输入卡号和卡密</text>
        <input class="card-num" @input="bindcardNoInput" placeholder="请输入卡号">
        <input class="card-password" @input="bindPasswordInput" placeholder="请输入卡密">
        <view class="btn-newcard" @click="bindCard">绑定</view>
    </view>
</view></view>
</template>
<script setup>
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiGiftCardServiceJs from "@/service/api/newretail/giftCardService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/memberModule/giftCard/bindGiftCard/bindGiftCard.js
const giftCardService = _apiGiftCardServiceJs;
const auth = _utilsAuthJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const selfA = _utilsSelfJs;
//获取应用实例
const state = reactive({
  navigationBarTitle: "绑定礼品卡",
  themeManager: themeManager,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  cardNo: '',
  passWord: '',
  startBind: true // 可以绑卡
});
function bindCard() {
  if (!state.cardNo) {
    uni.showToast({
      title: "请输入卡号~",
      icon: 'none',
      duration: 2000
    });
    return;
  }
  if (!state.passWord) {
    uni.showToast({
      title: "请输入卡密~",
      icon: 'none',
      duration: 2000
    });
    return;
  }
  if (!state.startBind) return;
  state.startBind = false;
  let postData = {
    cardNo: state.cardNo,
    passWord: state.passWord
  };
  giftCardService.bindCard(postData).then(res => {
    // console.log(res)
    uni.navigateBack({
      delta: 1
    });
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  }).finally(() => {
    state.startBind = true;
  });
}
function bindcardNoInput(e) {
  state.cardNo = e.detail.value;
}
function bindPasswordInput(e) {
  state.passWord = e.detail.value;
}
onLoad(function (options) {
  let _userInfo = auth.getUser();
  let memberId = _userInfo.member.id;
  // 统计PV
  state.themeColor = app.globalData.uiconfig.themeColor;
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
onShareAppMessage(function (res) {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  return {
    path: "/pages-sub/newretail/pages/mallModule/index/index/index"
  };
});
</script>
<style scoped>
/* pages/memberModule/giftCard/bindGiftCard/bindGiftCard.wxss */
.bind-gift {
    position: relative;
}
.bindbg {
    width: 750rpx;
    height: 623rpx;
    position: absolute;
    top: 0;
    left: 0;
}
.bind-box {
    position: relative;
    top: 320rpx;
    margin: 0 auto;
    width: 689rpx;
    height: 611rpx;
    background: #FFFFFF;
    box-shadow: 0px 0px 32rpx 0px #E4E4E4;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    flex-direction: column;
}
.bind-font {
    font-family: Source Han Sans CN;
    font-size: 38rpx;
    color: #333333;
    margin: 85rpx 0;
}
.card-num, .card-password {
    width: 609rpx;
    height: 88rpx;
    background: #F4F5F7;
    border-radius: 44rpx;
    text-align: center;
}
.card-password {
    margin: 30rpx 0 50rpx;
}
.btn-newcard {
    width: 609rpx;
    height: 88rpx;
    /* background: #FC6700;
    background: #FC6700; */
    background: linear-gradient(to right, #F41C0C, #FC6700);
    border-radius: 44rpx;
    text-align: center;
    line-height: 88rpx;
    color: #fff;
    font-size: 32rpx;
}
</style>