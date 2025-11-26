<template>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<!-- 商品列表 -->
<view class="cycle-content">
  <scroll-view scroll-y="true" style="height: 100%;">
    <view class="cycle-item" v-for="(item , index) in state.cycleList" :data-acitvityid="item.id" :data-obj="item" @click="toDetail">
      <view class="item-img">
        <image :src="item.imgUrl" mode="widthFix"></image>
      </view>
      <view class="item-title">{{item.cycleName}}</view>
      <view class="item-dec">{{item.cycleDescribe}}</view>
      <view class="item-pirce">
        <view class="item-price-lt">
          <text :style="'color: ' + state.themeColor + ';'">￥{{item.activityPrice || 0}}<text :style="'padding-left: 4rpx;color: ' + state.themeColor + ';font-size: 24rpx'">起</text></text>
          <text>￥{{item.salesPrice || 0}}<text style="font-weight: 400;color: #999;font-size: 24rpx">起</text></text>
        </view>
        <!-- ON=上架/OFF=下架/DELETED=已删除 -->
        <view class="item-price-rt" v-if="item.storeStatue === 'OFF'" style="background-color: #C1C1C1;">已下架</view>
        <view class="item-price-rt" v-else-if="item.totalOrderLimit <= item.totalOrder || item.storeQty <= 0" style="background-color: #C1C1C1;">已售罄</view>
        <view class="item-price-rt" v-else-if="item.storeStatue === 'ON'" :style="'background-color: ' + state.themeColor + ';'">去订购</view>
      </view>
    </view>
    <view class="no-data" v-if="state.cycleList.length === 0">
      <image :src="state.imagesPath.imgNoData"></image>
      <button :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'" size="mini" @click="toHome">随便逛逛</button>
    </view>
  </scroll-view>
</view>
</template>
<script setup>
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _apiCycleServiceJs from "@/service/api/newretail/cycleService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/activity/cycle/cycle.js
const cycleService = _apiCycleServiceJs;
const themeManager = _utilsThemeManagerJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const ADDRESS = _utilsAddressJs;
const state = reactive({
  cycleList: [],
  navigationBarTitle: '周期购',
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  userInfo: {},
  hasUserInfo: false,
  isMember: false,
  imagesPath: IMGAGESPATH
});
onLoad(function (options) {});
onReady(function () {
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
});
onShow(function () {
  app.globalData.storeInfo = app.globalData.storeInfo && app.globalData.storeInfo.id ? app.globalData.storeInfo : uni.getStorageSync('storeIdactive');
  if (!app.globalData.storeInfo || !app.globalData.storeInfo.id) {
    getStoreInfo();
  } else {
    getCycleByStoreId();
  }
});
async function getStoreInfo(options) {
  if (!app.globalData.storeInfo || !app.globalData.storeInfo.id) {
    // 获取到当前的地理位置，查找出最近的门店
    await ADDRESS.getAllStore1();
    await getCycleByStoreId();
  }
}
onHide(function () {});
onUnload(function () {});
function handleUserLogin() {
  const that = this;
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo;
    state.userInfo = {
      ...user.wxaUser
    };
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true;
      state.isMember = true;
    } else {
      // 不是会员跳转授权页
      state.userInfo = user.wxaUser;
      state.hasUserInfo = true;
      state.isMember = false;
      NAVPAGE.toAuthorize();
    }
  }
}
function toHome() {
  NAVPAGE.toHome();
}
function getCycleByStoreId() {
  // wx.showLoading()
  let store = app.globalData.storeInfo.id;
  cycleService.getCycleByStoreId(store).then(res => {
    if (res) {
      state.cycleList = res;
    }
  });
  // wx.hideLoading();
}
function toDetail(val) {
  let totalOrderLimit = val.currentTarget.dataset.obj.totalOrderLimit;
  let totalOrder = val.currentTarget.dataset.obj.totalOrder;
  let storeQty = val.currentTarget.dataset.obj.storeQty;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    NAVPAGE.toCycleDetails(`?id=${val.currentTarget.dataset.acitvityid}`);
  } else {
    // this.handleUserLogin()
    NAVPAGE.toAuthorize();
  }
}
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/mallModule/activity/cycle/cycle.wxss */
page {
  background-color: #f1f3f6;
  height: 100%;
}

.cycle-content {
  width: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.cycle-item {
  height: 544rpx;
  background-color: #fff;
  border-radius: 30rpx;
  padding-bottom: 20rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(228, 228, 228, 0.38);
  overflow: hidden;
  margin: 20rpx 0;
}

.cycle-item .item-img {
  width: 100%;
  height: 326rpx;
  background-color: #eee;
  overflow: hidden;
}

.cycle-item .item-img image {
  width: 100%;
  height: 100%;
}

.cycle-item .item-title {
  padding-left: 30rpx;
  font-weight: bold;
  font-size: 32rpx;
  color: #333333;
  margin: 28rpx 0 16rpx;
}

.cycle-item .item-dec {
  padding-left: 30rpx;
  font-weight: 400;
  font-size: 26rpx;
  color: #999999;
}

.cycle-item .item-pirce {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
  padding: 0 25rpx;
  box-sizing: border-box;
}

.cycle-item .item-pirce .item-price-lt {
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
}

.cycle-item .item-pirce .item-price-lt text:nth-of-type(1) {
  font-size: 34rpx;
  color: #FC6700;
  font-weight: bold;
}

.cycle-item .item-pirce .item-price-lt text:nth-of-type(2) {
  text-decoration: line-through;
  display: inline-block;
  margin-left: 10rpx;
  font-size: 24rpx;
  color: #999;
}

.cycle-item .item-pirce .item-price-rt {
  width: 176rpx;
  height: 71rpx;
  background: #FC6700;
  border-radius: 35rpx;
  color: #fff;
  text-align: center;
  line-height: 71rpx;
}

.no-data {
  width: 100%;
  height: calc(100% - 120rpx);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background: #ffffff; */
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
  margin-top: 40%;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
  /* position: unset; */
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: transparent;
}
</style>