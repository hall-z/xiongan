<template>
<navigationBar :title="navigationBarTitle"></navigationBar>
<view class="containerA">
    <image :src="state.shareImage" class="share-image"></image>
    <canvasdrawer :bgUrl="state.sharePictures" :url="state.url" :painting="state.painting" class="canvasdrawer" @getImage="eventGetImage">
    <!-- <button bind:tap="eventDraw">绘制</button> -->
    <button @click="eventSave" class="btn">保存到本地</button>
</canvasdrawer></view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiRequestJs from "@/service/api/newretail/request";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import canvasdrawer from '@/pages-sub/newretail/components/canvasdrawer/canvasdrawer/canvasdrawer.vue';
const app = getApp();

// pages/mallModule/member/share/share.js
const request = _apiRequestJs;
const util = _utilsUtilsJs;
const state = reactive({
  shareImage: '',
  painting: null,
  qrcodeImg: null,
  url: '',
  sharePictures: ''
});
function eventSave() {
  uni.saveImageToPhotosAlbum({
    filePath: state.shareImage,
    success(res) {
      uni.showToast({
        title: '保存图片成功',
        icon: 'success',
        duration: 2000
      });
    }
  });
}
function eventGetImage(event) {
  console.log(event);
  uni.hideLoading();
  const {
    tempFilePath,
    errMsg
  } = event.detail;
  console.log(errMsg, 'errMsgerrMsg');
  if (errMsg === 'canvasdrawer:ok') {
    state.shareImage = tempFilePath;
  }
}
onLoad(function (options) {});
onReady(function () {});
function getImageInfo(url) {
  console.log(url, state.sharePictures);
  let that = this;
  uni.getImageInfo({
    src: url,
    success: res => {
      // this.setData({
      //     qrcodeImg: res.path
      // })

      uni.showLoading({
        title: '绘制分享图片中',
        mask: true
      });
      state.painting = {
        width: 375,
        height: 600,
        clear: true,
        views: [
        //这个是一个纯白的图片,给整个画布一个白背景,要不然会有马赛克
        {
          type: 'image',
          url: state.sharePictures,
          width: 375,
          height: 600
        },
        //边框,直接拿了一张图,当做边框
        {
          type: 'image',
          url: res.path,
          width: 160,
          height: 160,
          top: 250,
          left: 110
        }]
      };
    },
    fail: () => {}
  });
}
onShow(function () {
  state.member = app.globalData.userInfo.member;
  let appid = request.APP_ID;
  let page = 'pages/mallModule/index/index/index';
  let scene = 'memberID=' + state.member.id;
  state.url = request.BASE_URL + "/newretail/api/wxa/qrcode/create?appid=" + appid + "&page=" + page + "&scene=" + scene;
  util.getSharePictures('INVITE_MEMBER').then(res => {
    state.sharePictures = res;
    getImageInfo(request.BASE_URL + "/newretail/api/wxa/qrcode/create?appid=" + appid + "&page=" + page + "&scene=" + scene);
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
  // this.getImageInfo(request.BASE_URL + "/newretail/api/wxa/qrcode/create?appid=" + appid + "&page=" + page + "&scene=" + scene)
  // this.eventDraw()
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/mallModule/member/share/share.wxss */
page{
    width: 100%;
    height: 100%;
    background-color: #fff;
}
.containerA {
  padding-bottom: 120rpx;
}
.btn{
    width: 100%;
    padding-bottom: 30rpx;
    position: fixed;
    bottom: 0;
}
.share-image {
    width: 100%;
    height: 1350rpx;
    /* margin: 0 75rpx; */
    /* padding: 1px; */
    /* margin-top: 40px; */
}
</style>