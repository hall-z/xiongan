<template>
<!-- pages/mallModule/myCard/topUp/topUp.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view class="info">
      <view class="section">
          <view class="section-title">充值卡号：</view>
          <view class="right">
              <input type="text" placeholder="请填写充值卡号" name="number" :value="state.number" @input="inputNumber">
          </view>
      </view>
  </view>
  <view class="info">
      <view class="section">
          <view class="section-title">充值密码：</view>
          <view class="right">
              <input type="password" placeholder="请填写充值密码" name="password" :value="state.password" @input="inputPassword">
          </view>
      </view>
  </view>
  <button v-if="state.allowSubmit" class="btn" :style="'background: ' + state.themeColor" @click="handleSave">立即充值</button>
  <button v-else class="btn" style="background: #8B8B8C">立即充值</button>
  <!-- <view class="topUp-box">
      <view class="topUpRecord" style="color: {{themeColor}}" bind:tap="toTopUpRecord">充值记录</view>
  </view> -->
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiRechargeServiceJs from "@/service/api/newretail/rechargeService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
// import { onLoad, onReady, onShow, onHide, onUnload } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/myCard/topUp/topUp.js
const wxaUserService = _apiWxaUserServiceJs;
const memberService = _apiMemberServiceJs;
const rechargeService = _apiRechargeServiceJs;
const auth = _utilsAuthJs;
const utils = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "在线充值",
  imagesPath: IMGAGESPATH,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  number: '',
  password: '',
  allowSubmit: false
});
onLoad(function (options) {
  uni.hideShareMenu();
  const that = this;
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  state.themeColor = app.globalData.uiconfig.themeColor;
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
function inputNumber(e) {
  state.number = e.detail.value;
  allowSubmit();
}
function inputPassword(e) {
  state.password = e.detail.value;
  allowSubmit();
}
function allowSubmit() {
  if (state.number !== "" && state.password !== "") {
    state.allowSubmit = true;
  } else {
    state.allowSubmit = false;
  }
}
function toTopUpRecord() {
  NAVPAGE.toTopUpRecord();
}
function handleSave(e) {
  state.allowSubmit = false;
  console.log(e.detail.value);
  const number = state.number;
  const password = state.password;
  const postData = {
    cardNumber: number,
    password: password
  };
  rechargeService.imprestCard(postData).then(res => {
    uni.showToast({
      title: '充值成功',
      icon: 'success',
      duration: 2000
    });
    state.allowSubmit = false;
    state.number = '';
    state.password = '';
  }).catch(err => {
    state.allowSubmit = true;
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
</script>
<style scoped>
/* pages/mallModule/myCard/topUp/topUp.wxss */
page {
	background-color: #eee;
	padding-bottom: 82rpx;
}

.info {
	padding: 0 40rpx;
	background: #fff;
}

.section {
	background: #fff;
	border-bottom: 1rpx solid #f1f1f1;
	font-size: 28rpx;
	height: 98rpx;
	line-height: 98rpx;
	overflow: auto;
	display: flex;
	position: relative;
}

.section-title {
	color: #454545;
	width: 164rpx;
	float: left;
	text-align: left;
}

.right {
	float: left;
	width: 524rpx;
	position: relative;
	color: #8B8B8C;
	display: flex;
}

.right input {
	font-size: 28rpx;
	height: 98rpx;
	width: 80%;
	line-height: 36rpx;
	padding: 27rpx 0;
	box-sizing: border-box;
	color: #313131;
}

.address {
	width: 20%;
	display: flex;
	align-items: center;
}

.address-img {
	width: 25rpx;
	height: 30rpx;
	margin-right: 8rpx;
}

.btn {
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
	height: 100rpx;
	line-height: 100rpx;
	width: 670rpx;
	border-radius: 6rpx;
	border: none;
	background: #009f55;
	margin-top: 60rpx;
}

.topUp-box {
	position: absolute;
	bottom: 40rpx;
	width: 100%;
	display: flex;
	justify-content: center;
}

.topUpRecord {
	font-size: 30rpx;
	font-weight: bold;
}
</style>