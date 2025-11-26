<template>
<!--pages/mallModule/liveplay/showDetails/showDetails.wxml-->
<view class="page-body">
  <view class="page-section page-section-gap">
    <web-view :src="state.webUrl"></web-view>
  </view>
</view>

</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsUtilsJs from "@/utils/newretail/utils";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/liveplay/showDetails/showDetails.js
const util = _utilsUtilsJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "",
  webUrl: '',
  JSONEncodeURI: ''
});
onLoad(function (_options) {
  const that = this;
  console.log(_options);
  if (_options.webUrl) {
    console.log(_options.webUrl);
    state.JSONEncodeURI = _options.webUrl;
    let url = JSON.parse(_options.webUrl);
    let webUrl = decodeURIComponent(url.url);
    console.log(webUrl);
    let index = '?';
    if (webUrl.indexOf(index) > -1) {
      state.webUrl = webUrl + '#wechat_redirect';
    } else {
      state.webUrl = webUrl;
    }
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId;
    try {
      uni.setStorageSync('wj_sharingId', shareId);
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures();
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
  let sharePictures = state.sharePictures;
  let storeId = '';
  let path = '/pages-sub/newretail/pages/mallModule/showDetails/showDetails?webUrl=' + state.JSONEncodeURI;
  if (app.globalData.storeInfo != null) {
    storeId = app.globalData.storeInfo.id;
    path = path + '&storeId=' + storeId;
  }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    let memberId = app.globalData.userInfo.member.id;
    return {
      title: app.globalData.systemConfigure.miniprogramSharingName,
      path: path + '&shareId=' + memberId,
      imageUrl: sharePictures,
      success(e) {}
    };
  } else {
    return {
      title: app.globalData.systemConfigure.miniprogramSharingName,
      path: path,
      imageUrl: sharePictures,
      success(e) {}
    };
  }
});
function getSharePictures() {
  util.getSharePictures('H5').then(res => {
    state.sharePictures = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
</script>
<style scoped>
/* pages/mallModule/liveplay/showDetails/showDetails.wxss */
.page-section-gap {
  box-sizing: border-box;
  padding: 0 30rpx;
}

</style>