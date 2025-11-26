<template>
<!-- pages/myCoupon/myCoupon.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="tourism-main" :style="'height:' + state.windowHeight + 'px;padding-top:110rpx'">
  <view class="tourism-nav" :style="'top:' + state.navHeight + 'px'">
    <view :class="state.already == 0 ? 'selected' : 'select'" :style="'color: ' + (state.already == 0 ? state.themeColor : '') + ';'" data-type="0" @click="clickCategory">
      <text>待出行</text> 
      <view class="borderbox" v-if="state.already == 0" :style="'background-color: ' + (state.already == 0 ? state.themeColor : '') + ';'"></view>
    </view>
    <view :class="state.already == 1 ? 'selected' : 'select'" :style="'color: ' + (state.already == 1 ? state.themeColor : '') + ';'" data-type="1" @click="clickCategory">
      <text>已出行</text> 
      <view class="borderbox" v-if="state.already == 1" :style="'background-color: ' + (state.already == 1 ? state.themeColor : '') + ';'"></view>
    </view>
  </view>
  <view class="tourism-item-box" :style="'min-height:' + state.tourismBoxHeight + 'px;'">
    <view class="tourism-available">
      <view class="plan-detail" v-for="(item , index) in state.tourismList" :key="index">
        <image class="list_img" :src="item.bannerUrlList ? item.bannerUrlList[0] : item.detailsUrl"></image>
        <view class="detail_box">
          <view class="detail_name">{{item.name}}</view>
          <view class="detail_note">{{item.note}}</view>
          <view class="detail_bottom">
            <view>{{item.inOut == 2 ? '省外' : '省内'}}</view>
            <view class="detail_btn_box">
              <view @click="toDetail" :data-id="item.id" class="detail_btn" :style="'background-color: ' + state.themeColor">
                详情
              </view>
              <view v-if="item.already && item.evaluateFlag != 1" @click="skipEvaluation" :data-id="item.id" class="detail_btn" :style="'background-color: ' + state.themeColor">
                评价
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="no-data" :hidden="state.tourismList.length == 0 && state.tourismList.length == 0 ? false : true">
        暂无数据~
      </view>
    </view>
  </view>
  <view class="loading" :hidden="!load">{{loadingText}}</view>
</view>
<view class="content" v-if="state.loading">
  <view class="spinner">
    <view class="rect1" :style="'background-color: ' + state.themeColor"></view>
    <view class="rect2" :style="'background-color: ' + state.themeColor"></view>
    <view class="rect3" :style="'background-color: ' + state.themeColor"></view>
    <view class="rect4" :style="'background-color: ' + state.themeColor"></view>
    <view class="rect5" :style="'background-color: ' + state.themeColor"></view>
  </view>
</view>
</template>
<script setup>
import _apiWelfarePlanServiceJs from "@/service/api/newretail/welfarePlanService";
// import { onReady, onLoad, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

//获取应用实例
const welfarePlanService = _apiWelfarePlanServiceJs;
const state = reactive({
  navigationBarTitle: "我的线路",
  loading: false,
  windowHeight: 667,
  tourismBoxHeight: 667,
  themeColor: '',
  navHeight: '',
  already: 0,
  tourismList: []
});
function toDetail(e) {
  let id = e.currentTarget.dataset.id;
  state.tourismList.some(item => {
    if (item.id == id) {
      uni.navigateTo({
        url: '/pages-sub/newretail/pages/mallModule/benefitPlan/tourismPlanDetail/tourismPlanDetail?id=' + item.id + '&planId=' + item.tourismPlanId + '&choose=' + 1
      });
    }
    return item.id == id;
  });
}
function skipEvaluation(e) {
  let id = e.currentTarget.dataset.id;
  state.tourismList.some(item => {
    if (item.id == id) {
      let data = {
        tourismPlanId: item.tourismPlanId,
        routeId: item.id,
        userId: app.globalData.userInfo.member.id
      };
      uni.setStorageSync('evaluationData', JSON.stringify(data));
    }
    return item.id == id;
  });
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/benefitPlan/routeEvaluation/routeEvaluation'
  });
}
function clickCategory(e) {
  state.already = e.currentTarget.dataset.type;
  state.tourismList = [];
  getListData();
}
function getListData() {
  state.loading = true;
  welfarePlanService.getRouteByUserId({
    userId: app.globalData.userInfo.member.id,
    already: state.already
  }).then(res => {
    state.loading = false;
    if (res) {
      res.forEach(item => {
        item.bannerUrlList = item.bannerUrl ? item.bannerUrl.split(',') : [];
      });
      state.tourismList = res;
    }
  });
}
onReady(function () {});
onLoad(function () {
  uni.hideShareMenu();
  const self = this;
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  const navHeight = app.globalData.navHeight;
  state.navHeight = navHeight;
  state.windowHeight = app.globalData.systemInfo.windowHeight - navHeight - 110 * app.globalData.systemInfo.windowWidth / 750;
  state.tourismBoxHeight = app.globalData.systemInfo.windowHeight - navHeight - 110 * app.globalData.systemInfo.windowWidth / 750 - 143 * app.globalData.systemInfo.windowWidth / 750;
});
onShow(function () {
  if (checkAuth() && app.globalData.userInfo.member) {
    getListData();
  } else {
    uni.showToast({
      title: '您还不是会员，请先绑定手机号码成为会员',
      icon: 'none',
      duration: 2000
    });
  }
  uni.hideShareMenu();
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false;
  } else {
    return true;
  }
}
</script>
<style scoped>
/* pages/myCoupon/myCoupon.wxss */

page {
  background-color: #eee;
  height: 100%;
  width: 100%;
}

.tourism-main {
  width: 100%;
  /* height: calc(100% - 130rpx); */
}

.tourism-nav {
  overflow: hidden;
  height: 80rpx;
  width: 100%;
  line-height: 80rpx;
  display: flex;
  border-top: 2rpx solid #e6e6e6;
  background: #fff;
  color: #333333;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  font-weight: bold;
}

.tourism-nav>view {
  font-size: 32rpx;
}

.selected {
  position: relative;
  flex: 1;
  color: #009f55;
  border-bottom: 5rpx solid transparent;
  text-align: center;
}
.borderbox{
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 70rpx;
  height: 5rpx;
  transform: translateX(-50%);
}
.select {
  flex: 1;
  text-align: center;
}

.show {
  display: block;
  background-color: #fff;
}

.hidden {
  display: none;
  background-color: #f3f2f6;
}

.tourism-item-box {
  padding: 21rpx 21rpx 122rpx 21rpx;
  /* margin-top: 110rpx; */
  background: #eee;
  /* border-top: 20rpx solid #f1f1f1; */
  min-height: 100%;
  background-color: #eee;
}
tourism-item {
  display: flex;
  align-items: center;
}
tourism-item:last-of-type {
  margin-bottom: 0;
}

.no-data {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
  margin-top: 200rpx;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  margin-top: 50rpx;
  width: 242rpx;
  height: 60rpx;
  background: #fff;
}

.tourism-bottom-box {
  width: 100%;
  height: 122rpx;
  margin-top: 24rpx;
  font-size: 24rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  background-color: #f3f2f6;
}

.tourism-bottom-box view {
  height: 36rpx;
  padding: 0 30rpx;
}

.tourism-data {
  border-right: 1rpx solid #f0f0f0;
  color: #8b8b8c;
}

.tourism-history {
  font-size: 24rpx;
  color: #009f55;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tourism-history image {
  width: 11rpx;
  height: 20rpx;
  margin-left: 8rpx;
  margin-top: 2rpx
}

.loading {
  color: #999;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  background: #eee;
}

movable-area {
  height: 100%;
  width: 100%;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
  position: fixed;
  right: 0;
  bottom: 120rpx;
}

movable-view {
  width: 120rpx;
  height: 120rpx;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plan-detail {
  padding: 15rpx;
  font-size: 24rpx;
  margin-bottom: 15px;
  display: flex;
  border-radius: 15rpx;
  background-color: #fff;
}
.plan-detail .list_img {
  width: 200rpx;
  height: 200rpx;
  margin-right: 20rpx;
  flex: 0 0 auto;
}
.detail_name {
  font-size: 36rpx;
}

.detail_box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200rpx;
  flex: 0 0 auto;
  width: calc(100% - 220rpx);
  font-size: 26rpx;
}
.detail_bottom {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
  flex: 0 0 auto;
  color: #ccc;
  font-size: 28rpx;
}
.detail_note {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 设置文本最多显示3行 */
  overflow: hidden;
  text-overflow: ellipsis;
}
.detail_btn {
  padding: 10rpx 20rpx;
  color: #fff;
  background-color: rgb(131, 26, 26);
  border-radius: 30rpx;
  font-size: 24rpx;
  flex: 0 0 auto;
  margin-left: 15rpx;
}
.detail_btn_box {
  display: flex;
}
</style>