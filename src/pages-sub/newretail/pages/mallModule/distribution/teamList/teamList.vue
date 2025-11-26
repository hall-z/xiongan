<template>
<!--pages/distribution/teamList/teamList.wxml-->
<view>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
  <view class="group-item" v-for="(item , index) in state.groupList" :key="idx">
    <view class="info">
      <image :src="item.avatar ? item.avatar : state.imagesPath.userPortrait"></image>
      <view>
        <!-- <text class='name'>{{item.name}}</text> -->
        <text class="name">{{item.name == item.mobile ? filters.filtMobile(item.name) : item.name}}  {{item.name == item.mobile ? '' : filters.filtMobile(item.mobile)}}</text>
        <text class="time">{{item.area}}</text>
      </view>
    </view>
    <!-- <text class='total'>￥{{item.total}}</text> -->
  </view>
</view>
<view class="no-data" :hidden="state.groupList.length > 0">
  <image :src="state.imagesPath.imgNoData"></image>
</view></view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiDistributionServiceJs from "@/service/api/newretail/distributionService";
import _apiBackCashServiceJs from "@/service/api/newretail/backCashService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/distribution/teamList/teamList.js
const backCashService = _apiBackCashServiceJs;
const distributionService = _apiDistributionServiceJs;
const utils = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "我的团队",
  imagesPath: IMGAGESPATH,
  groupList: []
});
onLoad(function (options) {
  uni.hideShareMenu();
  const that = this;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member;
      state.mobile = app.globalData.userInfo.member.mobile;
      handelQueryList();
    } else {
      uni.showToast({
        title: '您还不是会员，请先绑定手机号码成为会员',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    try {
      uni.showModal({
        title: '提示',
        content: '请登录后查看',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            NAVPAGE.toMy();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    } catch (error) {}
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
function hideTel(tel) {
  let reg = /^(\d{3})\d{4}(\d{4})$/;
  tel = tel.replace(reg, "$1****$2");
  return tel;
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {
  onLoad();
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(function () {});
onShareAppMessage(function () {});
function handelQueryList(page) {
  const that = this;
  let memberId = app.globalData.userInfo.member.id;
  distributionService.queryGroup(memberId).then(res => {
    console.log(res);
    if (res && res.length >= 0) {
      let tempGroupList = res;
      state.groupList = tempGroupList;
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
</script>
<style scoped>
/* pages/distribution/teamList/teamList.wxss */

.content {
  padding: 0 30rpx;
}

.group-item {
  height: 140rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #ebebeb;
}

.group-item image {
  height: 90rpx;
  width: 90rpx;
  margin-right: 20rpx;
  border-radius: 50%;
}

.group-item .info {
  display: flex;
  justify-content: flex-start;
}

.group-item .info view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 36rpx;
}

.group-item .info .name {
  font-size: 30rpx;
  color: #000;
}

.group-item .info .time {
  font-size: 24rpx;
  color: #999;
  margin-top: 9rpx;
}

.group-item .total {
  font-size: 36rpx;
  color: #ff8561;
}

.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  margin-top: 50%;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
}

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #ffffff;
  border-radius: 0
}

.loading-btn::after{
  border: 0;
}

.order-end{
  color: #009136;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
}
</style>