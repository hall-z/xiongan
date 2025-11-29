<template>
<!--pages/myCard/myCard.wxml-->


<view>
<view class="content">
  <view class="userinfo-box">
    <image :src="state.userInfo.wxaUser.avatarUrl"></image>
  </view>
  <text class="nickName">{{state.userInfo.wxaUser.nickName}}</text>
  <!--<template is="barcode"></template>-->
  <text>{{filtQRNumber(state.userInfo.member.id)}}</text>
  <!--<template is="couponBalanceScore" :data="state.couponCount, state.storedValue, state.score"></template>-->
  <view class="bottom-btn">
    <view class="balance-btn" @click="toBalancePay">
      <image :src="state.imagesPath.payYE"></image>
      余额支付</view>
    <!-- <view class='wxpay-btn'>
      <image src='{{state.imagesPath.payWX}}'></image>
      微信支付</view> -->
  </view>
</view>
<!-- <view class='bottom-info'>
  <navigator target="miniProgram" open-type="navigate" app-id="wxb34bc4be8e276ed8" path="pages/index/index" extra-data="" version="release">
    <image src='{{state.imagesPath.iconStore}}'></image>
    进入商城
  </navigator>
</view> --></view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthJs from "@/utils/newretail/auth";
import _utilsSelfJs from "@/utils/newretail/self";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/myCard/myCard.js
const memberService = _apiMemberServiceJs;
const couponService = _apiCouponServiceJs;
const wxbarcode = _utilsSelfJs;
const auth = _utilsAuthJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const state = reactive({
  navigationBarTitle: "我的会员卡",
  imagesPath: IMGAGESPATH,
  userInfo: "",
  // 用户信息，头像，昵称，手机号等
  couponCount: '*',
  storedValue: '*',
  score: '*'
});
onLoad(function (options) {
  let userInfo = auth.getUser();
  console.log(userInfo);
  if (userInfo) {
    state.userInfo = userInfo;
    wxbarcode.barcode('barcode', userInfo.member.id, 585, 144);
    queryCoupon(1, 0, userInfo.member.id);
    getMbrBalance();
    queryScore(userInfo.member.mobile);
  }
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
function queryCoupon(page, pageSize, memberId) {
  let tempAllCouponCount = 0;
  // 查询内部券，将查到的券相加
  couponService.queryCoupon(page, pageSize, memberId).then(res => {
    // console.log(res)
    if (res.records && res.records.length > 0) {
      let count = 0;
      res.records.forEach(item => {
        if (item.status === 'OPEN') count++;
      });
      tempAllCouponCount += count;
    }
    let couponData = {
      memberId: memberId
    };
    // 查询外部券
    return couponService.queryExternalCoupons(couponData);
  }).then(res => {
    // console.log(res)
    if (res && res.records.length > 0) {
      let count = 0;
      res.records.forEach(item => {
        if (item.status === 'OPEN') count++;
      });
      tempAllCouponCount += count;
      state.couponCount = tempAllCouponCount;
    } else {
      state.couponCount = '*';
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getMbrBalance() {
  memberService.getMbrBalance().then(res => {
    state.storedValue = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function queryScore(mobile) {
  memberService.getBalance(mobile).then(res => {
    console.log(res);
    state.score = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toBalancePay() {
  uni.navigateTo({
    url: '../balance/balancePay/balancePay'
  });
}
</script>
<style scoped>
/* pages/myCard/myCard.wxss */

/* @import "../template/couponBalanceScore.wxss"; */
/* @import "../template/barcode.wxss"; */

page {
  background: #ebeff7;
}

.content {
  width: 688rpx;
  height: 727rpx;
  background: #fff;
  border-radius: 10rpx;
  text-align: center;
  margin: 0 auto;
  margin-top: 150rpx;
  position: relative;
  padding: 1rpx;
}

.userinfo-box {
  width: 160rpx;
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: -60rpx;
  margin-left: -80rpx;
}

.userinfo-box image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  overflow: hidden;
  background: #eee;
}

.nickName {
  font-size: 30rpx;
  margin-top: 110rpx;
  display: inline-block;
}

.coupon-balance-score {
  margin-top: 60rpx;
}

.bottom-btn {
  width: 100%;
  position: absolute;
  bottom: 0rpx;
  left: 0rpx;
  height: 120rpx;
  background: #f4f5f9;
  font-size: 30rpx;
  border-bottom-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
  overflow: hidden;
}

.bottom-btn >view {
  float: left;
  line-height: 120rpx;
  width: 100%;
  position: relative;
}

.bottom-btn .balance-btn::after {
  content: " ";
  width: 0rpx;
  height: 74rpx;
  position: absolute;
  right: 0rpx;
  top: 23rpx;
  /* border-right: 1rpx solid #000; */
  border-color: rgba(0, 0, 0, 0.1);
}

.bottom-btn >view image {
  width: 50rpx;
  height: 50rpx;
  vertical-align: middle;
  margin-top: -6rpx;
}

.bottom-btn >view:active {
  background: rgb(245, 245, 245);
}

.bottom-info {
  width: 100%;
  height: 80rpx;
  position: fixed;
  bottom: 0px;
  left: 0px;
  line-height: 80rpx;
  color: #000;
  text-align: center;
  font-size: 26rpx;
}

.bottom-info image {
  width: 45rpx;
  height: 40rpx;
  vertical-align: middle;
  margin-top: -6rpx;
}
</style>