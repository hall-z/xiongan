<template>
  <!--pages/wxfaceapp/payment/payment.wxml-->
  <!-- <goodsDetail-bar :title="state.navigationBarTitle" color="#ffffff"></goodsDetail-bar> -->
  <view class="content">
    <view class="prompt-box">
      <image class="success-icon" :src="state.imagesPath.iconSuccess"></image>
      <view class="success-text">支付成功</view>
    </view>
    <view class="btn-box">
      <button class="btn" type="default" @click="exitWxMiniApp">完成</button>
    </view>
  </view>
</template>
<script setup>
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
// import goodsDetailBar from '@/pages-sub/newretail/components/goodsDetail-bar/goodsDetail-bar.vue';
// pages/wxfaceapp/payment/payment.js
const IMGAGESPATH = _utilsImagesPathJs
const state = reactive({
  imagesPath: IMGAGESPATH,
  navigationBarTitle: '支付成功',
})
onLoad(function (options) {})
onReady(function () {})
onShow(function () {})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {})
function exitWxMiniApp() {
  try {
    wxfaceapp.exitMp({
      success(res) {
        console.log('exit mini app!')
      },
    })
  } catch (e) {}
}
</script>
<style scoped>
/* pages/wxfaceapp/payment/payment.wxss */

.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
  padding-top: 144rpx;
}

.prompt-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 204rpx;
}

.success-icon {
  width: 109rpx;
  height: 109rpx;
}

.success-text {
  font-size: 38rpx;
  line-height: 38rpx;
  color: #313131;
  margin-top: 28rpx;
}

.btn-box {
  display: flex;
  flex-direction: row;
  padding-bottom: 24rpx;
  margin-top: 354rpx;
}

.btn-box .btn {
  margin: 0 21rpx;
  width: 250rpx;
  height: 84rpx;
  background: #fff;
  border: 1px solid #a2a2a2;
  border-radius: 8rpx;
  font-size: 32rpx;
  line-height: 84rpx;
  text-align: center;
  color: #292929;
  box-sizing: border-box;
}

button::after {
  border: none;
}
</style>
