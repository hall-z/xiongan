<template>
<!--pages/giftCard/giftCardDetails/giftCardDetails.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<image class="card-img" :src="state.imageUrl"></image>
<view class="balance">余额<text>￥{{state.balance}}</text></view>
<button class="use-btn" @click="clickUse">立即使用</button>
<view class="tig">请出示二维码使用</view>
<view class="cell">
  <text>适用门店</text>
  <view class="btn" @click="toStoreList">查看全部门店</view>
</view>
<view class="cell">
  <text>可用时段</text>
  <view>{{state.beginDate}}至{{state.endDate}}</view>
</view>
<view class="cell">
  <text>商户电话</text>
  <view class="mobile" @click="handelCall">{{state.mobile}}</view>
</view>
<view class="cell">
  <text>使用须知</text>
  <view>
    <view v-for="(item , index) in state.remark" :key="index">{{item}}</view>
  </view>
</view>
</template>
<script setup>
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiGiftCardServiceJs from "@/service/api/newretail/giftCardService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/giftCard/giftCardDetails/giftCardDetails.js
const giftCardService = _apiGiftCardServiceJs;
const systemService = _apiSystemServiceJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const selfA = _utilsSelfJs;
//获取应用实例
const state = reactive({
  navigationBarTitle: "礼品卡详情",
  imagesPath: IMGAGESPATH,
  balance: "",
  beginDate: "",
  cardId: "",
  cardNo: "",
  created: "",
  endDate: "",
  imageUrl: "",
  memberCode: "",
  name: "",
  recharge: "",
  state: "",
  timeRange: "",
  remark: "",
  mobile: ""
});
onLoad(function (options) {
  console.log(options);
  if (options.cardNo) {
    giftCardService.queryMyGiftCardDetails(options.cardNo).then(res => {
      console.log(res);
      if (res.remark) {
        state.remark = res.remark.split('\n');
      }
      if (res.myGiftCardDTO) {
        state.imageUrl = res.myGiftCardDTO.imageUrl;
        state.balance = res.myGiftCardDTO.balance;
        state.beginDate = res.myGiftCardDTO.beginDate;
        state.cardId = res.myGiftCardDTO.cardId;
        state.cardNo = res.myGiftCardDTO.cardNo;
        state.created = res.myGiftCardDTO.created;
        state.endDate = res.myGiftCardDTO.endDate;
        state.memberCode = res.myGiftCardDTO.memberCode;
        state.name = res.myGiftCardDTO.name;
        state.recharge = res.myGiftCardDTO.recharge;
        state.state = res.myGiftCardDTO.state;
      }
      if (res.useRule) {
        state.storeRange = res.useRule.storeRange;
      }
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  // 查询商户电话号
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
onShareAppMessage(function (res) {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let path = "/pages-sub/newretail/pages/mallModule/index/index/index";
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    let memberId = app.globalData.userInfo.member.id;
    path = path + "?shareId=" + memberId;
  }
  return {
    path: path
  };
});
function clickUse() {
  let opts = '?cardNo=' + state.cardNo;
  NAVPAGE.toGiftCardPayQR(opts);
}
function handelCall() {
  uni.makePhoneCall({
    phoneNumber: state.mobile
  });
}
function toStoreList() {
  uni.setStorage({
    key: '_storeRange_',
    data: state.storeRange
  });
  NAVPAGE.toGiftCardStoreList();
}
</script>
<style scoped>
/* pages/giftCard/giftCardDetails/giftCardDetails.wxss */
page{
  text-align: center;
}
.card-img{
  width: 630rpx;
  height: 380rpx;
  border-radius: 20rpx;
  margin-top: 30rpx;
  box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.4)
}

.balance{
  font-size: 30rpx;
  margin: 30rpx 0rpx 50rpx;
}
.balance text{
  font-size: 36rpx;
  color:#f1b400;
}

.use-btn{
  width: 334rpx;
  height: 90rpx;
  line-height: 84rpx;
  color: #f1b400;
  background: #fff;
  padding: 0rpx;
  border: 1rpx solid #f1b400;
}
.tig{
  font-size: 28rpx;
  color: #848484;
  margin: 20rpx 0rpx 60rpx;
}

.cell{
  font-size: 30rpx;
  margin: 0rpx 40rpx;
  border-bottom: 1rpx solid #EFEFEF;
  padding: 40rpx 0rpx;
  overflow: hidden;
  text-align: left;
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