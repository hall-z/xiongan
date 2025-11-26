<template>
<!--pages/mallModule/score/thirdCouponCode/thirdCouponCode.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="couponList">
	<view class="coupon-item" v-for="(item , index) in state.orderList" :key="index">
		<view class="top">
			<view class="coupon-name">{{item.scoreProduct.name}}</view>
			<view v-if="item.status === 'CASHED'" class="score" :style="'color: ' + state.themeColor">-{{item.score}}</view>
		</view>
		<view class="bottom">
			<text class="convert-state" v-if="item.status === 'CASHED'">兑换成功</text>
      <text class="convert-state" v-else-if="item.status === 'CREATED'">未兑换</text>
      <text class="convert-state" v-else>兑换失败</text>
			<view class="look-code" v-if="item.status === 'CASHED'" :data-code="item.thirdCouponCode" @click="handleCode">查看兑换码 >></view>
		</view>
	</view>
	<view class="no-data" :hidden="state.orderList.length == 0 ? false : true">
    <image :src="state.imagesPath.imgNoOrders"></image>
	</view>
	<button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
	<view class="order-end" :hidden="!state.noMore">~我也是有底线的~</view>
</view>
<popup :show="state.show.middle" position="middle" custom-class="middle">
  <view class="popup-coupon-code-box">
		<view class="popup-coupon-title">兑换码</view>
		<view class="popup-coupon-content">
			<view>
				{{state.thirdCouponCode}}
			</view>
			<view class="popup-coupon-tip" @click="copyCode">(复制)</view>
		</view>
		<button class="popup-coupon-button" @click="handleButton">确定</button>
  </view>
</popup>
</template>
<script setup>
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiScoreProductService from "@/service/api/newretail/scoreProductService";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/mallModule/score/thirdCouponCode/thirdCouponCode.js
const themeManager = _utilsThemeManagerJs;
const scoreProductService = _apiScoreProductService;
const IMGAGESPATH = _utilsImagesPathJs;
const state = reactive({
  navigationBarTitle: "我的兑换码",
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  imagesPath: IMGAGESPATH,
  page: 1,
  pageSize: 15,
  pageCount: 1,
  member: {},
  noMore: false,
  loading: false,
  orderList: [],
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false
  },
  thirdCouponCode: ''
});
function copyCode() {
  uni.setClipboardData({
    data: state.thirdCouponCode,
    success: function (res) {
      uni.getClipboardData({
        success: function (res) {
          uni.showToast({
            title: '复制成功'
          });
        }
      });
    }
  });
}
function handleCode(val) {
  state.thirdCouponCode = val.currentTarget.dataset.code;
  state.show = {
    middle: true,
    top: false,
    bottom: false,
    right: false,
    right2: false
  };
}
function handleButton() {
  state.show = {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false
  };
}
function getOrderData(page) {
  const that = this;
  let postData = {
    page: page,
    pageSize: state.pageSize,
    searchCount: true,
    typeEquals: "SCORE_PRODUCT_THIRDCOUPONCODE"
  };
  scoreProductService.queryScoreOrder(postData).then(res => {
    console.log(res);
    let tempList = state.orderList;
    if (res.records && res.records.length > 0) {
      let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
      if (res.recordCount % res.pageSize === 0) {
        pageCount = parseInt(res.recordCount / res.pageSize);
      }
      state.page = res.page;
      state.pageCount = pageCount;
      state.orderList = tempList.concat(res.records);
    }
    if (state.loading) {
      state.loading = false;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
    if (state.loading) {
      state.loading = false;
    }
  });
}
onLoad(function (options) {
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member;
      getOrderData(state.page);
    }
  }
  state.themeColor = app.globalData.uiconfig.themeColor;
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true;
    let page = state.page;
    ++page;
    getOrderData(page);
  } else {
    // 没有下一页，提示已经查询完毕
    state.noMore = true;
  }
});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/mallModule/score/thirdCouponCode/thirdCouponCode.wxss */
page {
	background-color: #f1f1f1;
}

.couponList {
	width: 100%;
	height: 100%;
}

.couponList .coupon-item {
	width: 82%;
	height: 100rpx;
	margin: auto;
	margin-top: 20rpx;
	padding: 30rpx;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border-radius: 6rpx;
}

.couponList .coupon-item .top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	line-height: 40rpx;
}

.couponList .coupon-item .top .coupon-name {
	font-size: 34rpx;
	font-weight: 400;
}

.couponList .coupon-item .top .score {
	font-size: 32rpx;
}

.couponList .coupon-item .bottom {
	width: 100%;
	font-size: 24rpx;
	color: #999999;
	line-height: 30rpx;
	display: flex;
	justify-content: space-between;
}

.popup-coupon-code-box {
	width: 560rpx;
  height: 340rpx;
  background: #fff;
  border-radius: 20rpx;
  position: relative;
}

.popup-coupon-code-box .popup-coupon-title {
	width: 100%;
  height: 80rpx;
  margin: 0 auto;
  padding-top: 20rpx;
  position: relative;
  font-size: 36rpx;
  font-weight: 400;
  line-height: 80rpx;
  text-align: center;
  overflow: hidden;
}

.popup-coupon-code-box .popup-coupon-content {
	height: 160rpx;
  font-size: 50rpx;
  line-height: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100%;
}

.popup-coupon-code-box .popup-coupon-content .popup-coupon-tip {
  font-size: 20rpx;
  color: #999999;
}

.popup-coupon-code-box .popup-coupon-button {
	width: 100%;
  height: 100rpx;
  font-weight: 400;
  text-align: center;
  line-height: 100rpx;
  border-radius: 0 0 20rpx 20rpx;
}

.no-data {
  width: 100%;
	height: 100%;
	margin-top: 30%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
  /* margin-top: 40%; */
}

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #fff;
  border-radius: 0;
}

.loading-btn::after {
  border: 0;
}

.order-end {
  color: #009f55;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
}
</style>