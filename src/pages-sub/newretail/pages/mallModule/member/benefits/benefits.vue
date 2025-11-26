<template>
<!--pages/mallModule/member/benefits/benefits.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="grade">
  <view class="grade-title" @click="toGrade">等级说明</view>
  <image :src="state.memberGrade.gradePicture"></image>
</view>
<view class="benefits">
  <view class="benefits-title">当前会员权益</view>
  <image :src="state.memberGrade.gradeBenefitsPicture" mode="widthFix"></image>
</view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/member/benefits/benefits.js
const memberService = _apiMemberServiceJs;
const NAVPAGE = _utilsNavPageJs;
const UTILS = _utilsUtilsJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "会员权益",
  memberGrade: {}
});
onLoad(function (options) {
  uni.hideShareMenu();
  getMemberGrade();
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function toGrade() {
  NAVPAGE.toGrade();
}
function getMemberGrade() {
  const that = this;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const member = app.globalData.userInfo.member;
    state.member = app.globalData.userInfo.member;
    if (app.globalData.memberGrade) {
      state.memberGrade = app.globalData.memberGrade;
    } else {
      if (member.gradeId) {
        memberService.getGradeById(member.gradeId).then(res => {
          app.globalData.memberGrade = res;
          state.memberGrade = res;
        }).catch(err => {
          UTILS.showToast(err.message);
        });
      }
    }
  }
}
</script>
<style scoped>
/* pages/mallModule/member/benefits/benefits.wxss */

.grade {
  position: relative;
  padding: 72rpx 30rpx 0 30rpx;
}

.grade-title {
  font-size: 26rpx;
  position: absolute;
  right: 30rpx;
  top: 12rpx;
}

.grade image {
  width: 690rpx;
  height: 364rpx;
}

.benefits {
  margin-top: 24rpx;
}

.benefits-title {
  padding: 16rpx 30rpx;
  font-size: 28rpx;
  font-weight: bold;
  line-height: 48rpx;
  height: 48rpx;
}

.benefits image {
  width: 750rpx;
}

</style>