<template>
<!-- pages/advertising/advertising.wxml -->
<view class="page-body">
  <view class="page-section page-section-gap">
    <!-- {{webUrl.indexOf('?') > -1 ? '&token=' + token : '?token=' + token}} -->
    <web-view :src="state.webUrl"></web-view>
  </view>
</view>
</template>
<script setup>
import _apiRequestJs from "@/service/api/newretail/request";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsAuthJs from "@/utils/newretail/auth";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/advertising/advertising.js
const auth = _utilsAuthJs;
const util = _utilsUtilsJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const request = _apiRequestJs;
//获取应用实例
const state = reactive({
  navigationBarTitle: "",
  webUrl: '',
  JSONEncodeURI: '',
  token: null
});
onLoad(function (_options) {
  const that = this;
  console.log(_options, state.token, auth.getTokens());
  if (_options.scene) {
    _options.webUrl = {
      url: encodeURIComponent(request.BASE_URL + '/newretail-admin/#/advertShow?id=' + _options.scene + '&storeId=' + app.globalData.storeInfo.id + '&type=normal')
      // url: encodeURIComponent('http://localhost:9530/#/advertShow?id=' + options.scene + '&storeId=' + app.globalData.storeInfo.id + '&type=normal')
    };
    _options.webUrl = JSON.stringify(_options.webUrl);
  }
  if (_options.webUrl) {
    console.log(_options.webUrl);
    state.JSONEncodeURI = _options.webUrl;
    state.token = auth.getTokens() ? auth.getTokens().accessToken : null;
    let url = JSON.parse(_options.webUrl);
    let webUrl = decodeURIComponent(url.url);
    console.log(webUrl);
    let index = '?';
    if (webUrl.indexOf(index) > -1) {
      // + '#wechat_redirect' 
      state.webUrl = webUrl + (state.token ? '&token=' + state.token : '');
    } else {
      state.webUrl = webUrl + (state.token ? '&token=' + state.token : '');
    }
    console.log(state.webUrl, 'webUrlwebUrlwebUrl');
  }
  try {
    let value = uni.getStorageSync('webUrl');
    console.log(value);
    if (value) {
      // Do something with return value
      if (_options.from === 'bindMobile') {
        state.webUrl = value;
      } else {
        let index = '?';
        let url = value;
        if (url.indexOf(index) > -1) {
          state.webUrl = value + '#wechat_redirect';
        } else {
          state.webUrl = value;
        }
      }
      uni.removeStorage({
        key: 'webUrl',
        success: function (res) {}
      });
    }
  } catch (e) {
    // Do something when catch error
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId;
    try {
      uni.setStorageSync('wj_sharingId', shareId);
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures();

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
  let sharePictures = state.sharePictures;
  let storeId = '';
  let path = '/pages-sub/newretail/pages/mallModule/advertising/advertising?webUrl=' + state.JSONEncodeURI;
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
/* pages/advertising/advertising.wxss */
.page-section-gap{
  box-sizing: border-box;
  padding: 0 30rpx;
}

</style>