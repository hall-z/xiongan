<template>
<!--pages/giftCard/giftCardPaysuccess/giftCardPaysuccess.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<text>pages/giftCard/giftCardPaysuccess/giftCardPaysuccess.wxml</text>

</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/giftCard/giftCardPaysuccess/giftCardPaysuccess.js
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "支付成功"
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
onShareAppMessage(function (res) {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let path = "/pages-sub/newretail/pages/mallModule/index/index/index";
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    let memberId = app.globalData.userInfo.member.id;
    path = path + "?shareId=" + memberId;
  }
  return {
    path: path
  };
});
</script>
<style scoped>
/* pages/giftCard/giftCardPaysuccess/giftCardPaysuccess.wxss */
</style>