<template>
<!--pages/giftCard/useNeedKnow/useNeedKnow.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="cell">
  <text>适用门店</text>
  <view class="btn" @click="toStoreList">查看全部门店</view>
</view>
<view class="cell">
  <text>活动时段</text>
  <view>{{state.timeRange}}</view>
</view>
<view class="cell">
  <text>商户电话</text>
  <view class="mobile" @click="handelCall">{{state.mobile}}</view>
</view>
<view class="cell">
  <text>有效期</text>
  <view>激活之日起{{state.validityTime}}</view>
</view>
<view class="cell">
  <text>使用须知</text>
  <view>
    <view v-for="(item , index) in remark" :key="index">{{item}}</view>
  </view>
</view>
<view class="cell">
  <text>购买说明</text>
  <view>
    <view>1、您可以在小程序中时时关注领取情况；</view>
    <view>2、礼品卡购买后无法退款，购买后24小时内未被好友领取则自动退回我的礼品卡中；</view> 
    <view>3、该礼品卡无法校验您的好友关系，因此如无特殊用途请勿将礼品卡链接发送BBS论坛等公关平台社区；</view>
  </view>
</view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/giftCard/useNeedKnow/useNeedKnow.js
const systemService = _apiSystemServiceJs;
const NAVPAGE = _utilsNavPageJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "使用须知",
  timeRange: "",
  // 活动时段
  mobile: "",
  // 商户电话
  ramark: "",
  validityTime: "",
  // 有效期
  storeRange: ''
});
onLoad(function (options) {
  let self = this;
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  uni.getStorage({
    key: '_useNeedKnow',
    success: function (res) {
      console.log(res.data);
      if (res.data) {
        let tempRemark = [];
        if (res.data.card.remark) {
          tempRemark = res.data.card.remark.split('\n');
        }
        let unit = res.data.card.useRule.validityUnit;
        if (unit === 'hour') {
          unit = '小时';
        } else if (unit === 'day') {
          unit = '天';
        } else if (unit === 'month') {
          unit = '月';
        } else if (unit === 'year') {
          unit = '年';
        }
        state.timeRange = res.data.beginDate + ' - ' + res.data.endDate;
        state.validityTime = res.data.card.useRule.validity + unit;
        state.remark = tempRemark;
        state.storeRange = res.data.card.useRule.storeRange;
      }
    }
  });
  systemService.query('appContactMobile').then(res => {
    if (res && res.length > 0) {
      res.forEach(item => {
        if (item.key === "appContactMobile") {
          state.mobile = item.value;
        }
      });
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let path = UTILS.getSharePath();
  return {
    path: path
  };
});
function toStoreList() {
  uni.setStorage({
    key: '_storeRange_',
    data: state.storeRange
  });
  NAVPAGE.toGiftCardStoreList();
}
function handelCall() {
  uni.makePhoneCall({
    phoneNumber: state.mobile
  });
}
</script>
<style scoped>
/* pages/giftCard/useNeedKnow/useNeedKnow.wxss */
.cell{
  font-size: 30rpx;
  margin: 0rpx 40rpx;
  border-bottom: 1rpx solid #EFEFEF;
  padding: 40rpx 0rpx;
  overflow: hidden;
}
.cell text{
  color: #333;
  float: left；
}
.cell view{
  float: right;
  width: 530rpx;
  color: #909090;
}
.cell .btn, .cell .mobile{
  color: #576B95;
}
</style>