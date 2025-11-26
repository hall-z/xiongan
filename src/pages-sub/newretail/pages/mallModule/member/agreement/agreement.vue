<template>
<!--pages/mallModule/member/agreement.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
    <rich-text mode="compat" class="content-font" :nodes="state.innerText"></rich-text>
</view>
</template>
<script setup>
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/member/agreement.js
const systemService = _apiSystemServiceJs;
//获取应用实例
const state = reactive({
  navigationBarTitle: "注册协议",
  innerText: '' // 会员注册协议内容
});
function getAgreement() {
  systemService.query('memberRegisterAgreement').then(res => {
    if (res && res.length > 0 && res[0].value) {
      state.innerText = res[0].value;
    }
  });
}
onLoad(function (options) {
  getAgreement();
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
/* pages/mallModule/member/agreement.wxss */
.content {
    padding: 20rpx 30rpx 30rpx;
    font-size: 30rpx;
    color: #333;
}
.content-font {
    /* line-height: 38rpx; */
    display: block;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
	color: #333;
    word-break: normal;
    text-align: justify;
}
.content-font  p {
    text-indent: 2em;
}
</style>