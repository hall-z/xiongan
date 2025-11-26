<template>
<!--pages/mallModule/coupon/exchangeCoupon/exchangeCoupon.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
	<view class="content-main">
		<image class="" :src="state.imagesPath.couponBgImg"></image>
    <input type="text" placeholder="请输入您的兑换码" :value="state.code" @input="handleInput">
    <view v-if="!state.hasUserInfo">
      <button :style="'background-color: ' + state.themeColor" @click="getUserInfo">立即兑换</button>
    </view>
    <view v-else>
      <button v-if="state.isClick" :style="'background-color: ' + state.themeColor" @click="handleExchange">立即兑换</button>
		  <button v-else style="background-color:#999">立即兑换</button>
    </view>
	</view>
</view>
<popup :show="state.show.middle" position="middle" custom-class="middle">
  <view class="popup-box">
    <view class="popup-title">
      <text>{{state.couponStatusText}}</text>
    </view>
    <text class="receive-message">{{state.receiveMessage}}</text>
    <view class="popup-button">
      <view v-if="state.couponStatus === 'couponSuccess'" :style="'color: ' + state.themeColor" class="left-button" @click="handleGoOn">继续兑换</view>
      <view v-if="state.couponStatus === 'couponSuccess'" :style="'background-color: ' + state.themeColor" class="right-button" @click="handleToMyCoupon">查看我的优惠券</view>
      <view v-if="state.couponStatus === 'failed'" :style="'color: ' + state.themeColor" class="middle-button" @click="handleGoOn">确  定</view>
    </view>
  </view>
</popup>
</template>
<script setup>
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsNavPage from "@/utils/newretail/navPage";
import _apiCouponService from "@/service/api/newretail/couponService";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/mallModule/coupon/exchangeCoupon/exchangeCoupon.js
const IMGAGESPATH = _utilsImagesPathJs;
const themeManager = _utilsThemeManagerJs;
const CouponService = _apiCouponService;
const NAVPAGE = _utilsNavPage;
const AUTHORIZE = _utilsAuthorizeJs;
const state = reactive({
  navigationBarTitle: "兑换优惠券",
  imagesPath: IMGAGESPATH,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  code: '',
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false
  },
  couponStatusText: '',
  receiveMessage: '',
  couponStatus: '',
  isClick: true,
  hasUserInfo: false,
  isMember: false
});
function handleInput(val) {
  const code = val.detail.value;
  console.log(code);
  state.code = code;
}
function handleExchange() {
  if (state.hasUserInfo) {
    if (state.isMember) {
      state.isClick = false;
      if (state.code) {
        if (app.globalData.systemConfigure.isUseExternalCoupon) {
          // 启用外部券配置
          const opts = {
            exchangeCode: state.code,
            memberId: app.globalData.userInfo.member.id
          };
          CouponService.externalSendByCode(opts).then(res => {
            state.show = {
              middle: true,
              top: false,
              bottom: false,
              right: false,
              right2: false
            };
            state.couponStatusText = '兑换成功';
            state.receiveMessage = '优惠券已发放至您的账户 \n 请注意查收！';
            state.couponStatus = 'couponSuccess';
            state.isClick = true;
          }).catch(e => {
            state.show = {
              middle: true,
              top: false,
              bottom: false,
              right: false,
              right2: false
            };
            state.couponStatusText = '兑换失败';
            state.receiveMessage = '无效的兑换码';
            state.couponStatus = 'failed';
            state.isClick = true;
          });
        } else {
          const opts = {
            couponCode: state.code
          };
          CouponService.assignByCoupon(opts).then(res => {
            state.show = {
              middle: true,
              top: false,
              bottom: false,
              right: false,
              right2: false
            };
            state.couponStatusText = '兑换成功';
            state.receiveMessage = '优惠券已发放至您的账户 \n 请注意查收！';
            state.couponStatus = 'couponSuccess';
            state.isClick = true;
          }).catch(e => {
            state.show = {
              middle: true,
              top: false,
              bottom: false,
              right: false,
              right2: false
            };
            state.couponStatusText = '兑换失败';
            state.receiveMessage = '无效的兑换码';
            state.couponStatus = 'failed';
            state.isClick = true;
          });
        }
      } else {
        uni.showToast({
          title: '请输入兑换码',
          icon: 'none',
          duration: 2000
        });
        state.isClick = true;
      }
    } else {
      NAVPAGE.toAuthorize();
    }
  }
}
function handleToMyCoupon() {
  state.show = {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false
  };
  state.code = "";
  NAVPAGE.toMyCoupon();
}
function handleGoOn() {
  state.show = {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false
  };
  state.code = "";
}
onLoad(function (options) {
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
});
onReady(function () {});
onShow(function () {
  checkUserInfo();
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    if (app.globalData.userInfo.member) {
      state.isMember = true;
    }
  } else {
    state.hasUserInfo = false;
    state.isMember = false;
    state.member = null;
    state.userInfo = null;
  }
}
function getUserInfo(e) {
  AUTHORIZE.login(e).then(res => {
    state.hasUserInfo = true;
    if (res.member) {
      state.isMember = true;
      handleExchange();
    } else {
      NAVPAGE.toAuthorize();
    }
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
/* pages/mallModule/coupon/exchangeCoupon/exchangeCoupon.wxss */
page {
	width: 100%;
	height: 100%;
	background: #f1f1f1;
}

.content {
	padding: 30rpx 30rpx 30rpx 30rpx;
	box-sizing: border-box;
	height: 100%;
	position: relative;
	display: flex;
	justify-content: center;
}

.content .content-main {
	width: 100%;
	height: 680rpx;
	background-color: #fff;
	border-radius: 10rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.content .content-main image {
	margin-top: 70rpx;
	width: 50%;
	height: 180rpx;
}

.content .content-main .input-box {
	width: 60%;
	height: 80rpx;
	border-bottom: 2rpx solid #999999;
	font-size: 36rpx;
	font-weight: bold;
	color: #999999;
	text-align: center;
	line-height: 50rpx;
	margin-top: 90rpx;
}

.content .content-main input {
	width: 60%;
	height: 70rpx;
	border-bottom: 2rpx solid #999999;
	font-size: 36rpx;
	color: #999999;
	text-align: center;
	line-height: 50rpx;
	margin-top: 90rpx;
}

.content .content-main view {
	width: 80%;
	margin-top: 80rpx;
	height: 90rpx;
}

.content .content-main view button {
	border: none;
	color: #fff;
}

.popup-box {
	width: 560rpx;
	height: 440rpx;
	background: #fff;
	border-radius: 20rpx;
	position: relative;
}

.popup-title {
	width: 368rpx;
	height: 87rpx;
	margin: 0 auto;
	padding-top: 30rpx;
	position: relative;
	font-size: 36rpx;
	font-weight: 400;
	line-height: 80rpx;
	text-align: center;
	overflow: hidden;
}

.receive-message {
	height: 160rpx;
	font-size: 32rpx;
	line-height: 55rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	max-width: 100%;
}

.receive-message .thirdCouponCode {
	line-height: 80rpx;
	font-size: 50rpx;
}

.popup-button {
	position: absolute;
	bottom: 0;
	font-size: 32rpx;
	width: 100%;
	height: 110rpx;
	border-top: 2rpx solid #8b8b8c;
	display: flex;
}

.left-button {
	width: 50%;
	height: 100%;
	font-weight: 400;
	text-align: center;
	line-height: 110rpx;
	background-color: #fff;
	border-radius: 0 0 0 20rpx;
}

.right-button {
	width: 50%;
	height: 100%;
	font-weight: 400;
	text-align: center;
	line-height: 110rpx;
	color: #fff;
	border-radius: 0 0 20rpx 0;
}

.middle-button {
	width: 100%;
	height: 100%;
	font-weight: 400;
	text-align: center;
	line-height: 110rpx;
	color: #fff;
	border-radius: 0 0 20rpx 20rpx;
}
</style>