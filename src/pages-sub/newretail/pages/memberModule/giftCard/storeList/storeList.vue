<template>
<!--pages/giftCard/storeList/storeList.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="title">可用门店</view>
<view class="store-item" :hidden="state.storeList.length === 0" v-for="(item , index) in state.storeList" :key="id">{{item.name}}</view>
<view class="all" :hidden="state.storeList.length !== 0">全部门店可用</view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/giftCard/storeList/storeList.js
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "门店列表",
  storeList: []
});
onLoad(function (options) {
  let self = this;
  uni.hideShareMenu();
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  uni.getStorage({
    key: '_storeRange_',
    success: function (res) {
      console.log(res);
      if (res.data) {
        let storeList = [];
        if (res.data) {
          storeList = res.data.stores;
        }
        state.storeList = storeList;
      }
    }
  });
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/giftCard/storeList/storeList.wxss */
view{
  margin:0rpx 40rpx;
  border-bottom: 1rpx solid #f1f1f1;
  line-height: 90rpx;
  color: #454545;
  font-size: 28rpx;
}

.store-item{
  font-weight: bold;
}
.all{
  text-align: center;
}
</style>