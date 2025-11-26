<template>
<!--pages/balance/changeBalancePass/changeBalancePass.wxml-->
<view class="content">
  <form @submit="handelChangePassword">
    <view class="section">
      <view class="section-title">最新密码</view>
      <input password="" name="input" @input="handelPassInput" placeholder="请输入最新密码">
    </view>
    <view class="section">
      <view class="section-title">确认密码</view>
      <input password="" name="input" @input="handelPass1Input" placeholder="请再次输入密码">
    </view>
    <button class="btn" formType="submit">确认修改</button>
  </form>
</view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/balance/changeBalancePass/changeBalancePass.js
const memberService = _apiMemberServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "",
  imagesPath: IMGAGESPATH,
  password: '',
  password1: ''
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
function handelChangePassword() {
  if (state.password) {
    if (state.password1) {
      if (state.password !== state.password1) {
        uni.showToast({
          title: '两次密码不一致，请重新输入',
          icon: 'none',
          duration: 2000
        });
        return;
      } else {
        let postData = {
          newPassword: state.password
        };
        memberService.resetCardPassword(postData).then(res => {
          console.log(res);
          uni.showToast({
            title: '修改密码成功',
            icon: 'none',
            duration: 2000
          });
          setTimeout(function () {
            uni.navigateBack({
              delta: 1
            });
          }, 1000);
        }).catch(err => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      }
    } else {
      uni.showToast({
        title: '请再次输入新密码',
        icon: 'none',
        duration: 2000
      });
      return;
    }
  } else {
    uni.showToast({
      title: '请输入新密码',
      icon: 'none',
      duration: 2000
    });
    return;
  }
}
function handelPassInput(val) {
  state.password = val.detail.value;
}
function handelPass1Input(val) {
  console.log(val);
  state.password1 = val.detail.value;
}
</script>
<style scoped>
/* pages/balance/changeBalancePass/changeBalancePass.wxss */

.content {
  padding: 0rpx 40rpx;
}

.section {
  font-size: 28rpx;
  height: 90rpx;
  line-height: 90rpx;
  color: #454545;
  border-bottom: 1rpx solid #f1f1f1;
}

.section-title {
  width: 150rpx;
  float: left;
}

.section input {
  float: left;
  height: 64rpx;
  margin-top: 13rpx;
}

.btn {
  background: #ffa300;
  color: #fff;
  margin-top: 60rpx;
}

.btn::after {
  border: none;
}

</style>