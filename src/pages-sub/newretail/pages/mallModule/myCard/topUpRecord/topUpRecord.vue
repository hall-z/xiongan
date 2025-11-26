<template>
<!-- pages/mallModule/myCard/topUpRecord/topUpRecord.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="record-list">
	<view class="record-item" v-for="(item , index) in state.records" :key="index">
		<view class="money-num">{{item.money}} 元</view>
		<view class="topUp-date">{{item.date}}</view>
	</view>
</view>
<view class="no-data" :hidden="state.records.length > 0">
  <image :src="state.imagesPath.imgNoData"></image>
</view>
<view class="button-box">
	<button class="button" :style="'background: ' + state.themeColor" @click="toTopUp">立即充值</button>
</view>

</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
// pages/mallModule/myCard/topUpRecord/topUpRecord.js
const wxaUserService = _apiWxaUserServiceJs;
const memberService = _apiMemberServiceJs;
const auth = _utilsAuthJs;
const utils = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const state = reactive({
  navigationBarTitle: "充值记录",
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  imagesPath: IMGAGESPATH,
  records: []
});
function toTopUp() {
  NAVPAGE.toTopUp();
}
onLoad(function (options) {
  state.themeColor = app.globalData.uiconfig.themeColor;
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
/* pages/mallModule/myCard/topUpRecord/topUpRecord.wxss */
page {
	background-color: #f3f4f6;
	padding-bottom: 140rpx;
}

.record-list {
	background-color: #fff;
	width: 100%;
}

.record-item {
	width: 100%;
	height: 98rpx;
	line-height: 98rpx;
	border-top: 2rpx solid #f1f1f1;
	padding: 0 40rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
}

.money-num {
	font-size: 26rpx;
	font-weight: bold;
	color: black；
}

.topUp-date {
	font-size: 24rpx;
	color: #8B8B8C;
}

.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
  margin-top: 30%;
}

.button-box {
	position: fixed;
	bottom: 30rpx;
	width: 100%;
}

.button {
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
	height: 100rpx;
	line-height: 100rpx;
	width: 670rpx;
	border-radius: 6rpx;
	border: none;
	background: #009f55;
	margin: auto;
}
</style>