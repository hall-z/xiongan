<template>
<!--pages/storedValue/storedValue.wxml-->
<view class="top-info">
  <view class="stored-pass-text" @click="toChangeBalancePass">
    <image :src="imagesPath.iconChuzhiPass"></image>
    储值密码</view>
  <view class="value-text">￥{{state.storedValue}}</view>
  <view class="current-text">当前余额/元</view>
  <view class="watch-detail" @click="toBalancePayList">
    <image :src="imagesPath.iconWatchDetails"></image>查看明细</view>
</view>
<view class="content">
  <view class="content-top-text">余额充值</view>
  <view class="price-box">
    <view :class="(item.active ? 'active' : '') + ' '" v-for="(item , index) in state.rechargeList" :key="index" :data-id="item.rechangeMoneyId" @click="clickCheckPrice">
      <view class="price-text ">
        <text>￥</text>{{item.amount}}</view>
      <view class="welfare" v-if="!item.discountMessage && item.discountAmount && item.discountAmount > 0">· 优惠<text>{{item.discountAmount}}</text>元 ·</view>
      <view class="welfare" v-if="!item.discountMessage && item.donationAmount && item.donationAmount > 0">· 送<text>{{item.donationAmount}}</text>元 ·</view>
      <view class="welfare" v-if="item.discountMessage">· {{item.discountMessage}} ·</view>
    </view>
  </view>
  <button class="confirm-btn" @click="handleRecharge">确认充值</button>
</view>
<view class="remain">
  <view>温馨提示</view>
  <view>· 余额不可提现；</view>
  <view>· 可到线下门店消费抵扣；</view>
  <view>· 如有疑问请致电400-881-9090；</view>
  <view>· 新用户充值后需设置储值卡支付密码。</view>
</view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _apiRechargeServiceJs from "@/service/api/newretail/rechargeService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/storedValue/storedValue.js
const rechargeService = _apiRechargeServiceJs;
const memberService = _apiMemberServiceJs;
const request = _apiRequestJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "储值余额",
  storedValue: 0,
  // 储值余额
  rechargeList: []
});
onLoad(function (options) {
  getMbrBalance();
  getRechargeList();
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
onShareAppMessage(function (res) {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  return {
    path: "/pages-sub/newretail/pages/index/index"
  };
});
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
function getRechargeList() {
  rechargeService.query().then(res => {
    // console.log(res)
    let tempArr = [];
    res.forEach(item => {
      tempArr.push({
        ...item,
        active: false
      });
    });
    state.rechargeList = tempArr;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function clickCheckPrice(e) {
  let tempList = state.rechargeList;
  tempList.forEach(item => {
    if (e.currentTarget.dataset.id === item.rechangeMoneyId) {
      item.active = !item.active;
    } else {
      item.active = false;
    }
  });
  state.rechargeList = tempList;
}
function handleRecharge() {
  let rechangeMoneyId = '';
  state.rechargeList.forEach(item => {
    if (item.active) {
      rechangeMoneyId = item.rechangeMoneyId;
    }
  });
  if (rechangeMoneyId) {
    // 创建充值订单
    rechargeService.createOrder(rechangeMoneyId).then(res => {
      // 根据当前的订单id获取支付签名
      let orderId = res.id;
      let payMethod = app.globalData.paymentMethod || request.PAYMETHOD; // WX_MINI_APP小程序 SWIFTPASS威富通
      rechargeService.getPaySign(orderId, payMethod).then(res => {
        // 解析拿到的签名等字段数据
        let resData = JSON.parse(res);
        let sign = JSON.parse(resData.sign);
        let packageValue = '';
        if (payMethod === 'SWIFTPASS') {
          packageValue = sign.package;
        } else if (payMethod === 'WX_MINI_APP' || payMethod === 'WXA_ISV_PAY') {
          packageValue = sign.packageValue;
        }
        // 调起微信支付
        uni.requestPayment({
          'timeStamp': sign.timeStamp,
          'nonceStr': sign.nonceStr,
          'package': packageValue,
          'signType': sign.signType,
          'paySign': sign.paySign,
          'success': function (res) {
            uni.showToast({
              title: '充值成功',
              icon: 'none',
              duration: 2000
            });
          },
          'fail': function (res) {
            console.log('支付失败----------');
            console.log(res);
            if (res.errMsg.indexOf("cancel") >= 0) {
              uni.showToast({
                title: '您取消了支付~',
                icon: 'none',
                duration: 2000
              });
            } else {
              uni.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              });
            }
          }
        });
      }).catch(err => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  } else {
    uni.showToast({
      title: "请选择要充值的金额",
      icon: 'none',
      duration: 2000
    });
  }
}
function toChangeBalancePass() {
  uni.navigateTo({
    url: '../changeBalancePass/changeBalancePass'
  });
}
function toBalancePayList() {
  uni.navigateTo({
    url: '../balancePayList/balancePayList'
  });
}
</script>
<style scoped>
/* pages/storedValue/storedValue.wxss */

.top-info {
  height: 240rpx;
  border-bottom: 20rpx solid #f1f1f1;
  text-align: center;
  overflow: hidden;
}

.stored-pass-text {
  text-align: right;
  font-size: 24rpx;
  color: #f1b400;
  height: 40rpx;
  line-height: 40rpx;
  margin-top: 20rpx;
  margin-right: 40rpx;
}

.stored-pass-text image {
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
  margin-top: -6rpx;
}

.value-text {
  color: #ff8561;
  font-size: 48rpx;
}

.current-text {
  color: #454545;
  font-size: 24rpx;
  margin-top: 10rpx;
  margin-bottom: 10rpx;
}

.watch-detail {
  color: #f1b400;
  font-size: 24rpx;
}

.watch-detail image {
  width: 24rpx;
  height: 27rpx;
  vertical-align: middle;
  margin-top: -6rpx;
  margin-right: 10rpx;
}

.content {
  padding: 0rpx 40rpx;
  box-sizing: border-box;
  border-bottom: 20rpx solid #f1f1f1;
}

.content .content-top-text {
  height: 90rpx;
  line-height: 90rpx;
  font-size: 28rpx;
  color: #1b1b1d;
  border-bottom: 1rpx solid #dcdcdc;
  margin-bottom: 30rpx;
}

.price-box {
  overflow: hidden;
}

.price-box >view {
  width: 210rpx;
  height: 160rpx;
  border: 1rpx solid #454545;
  border-radius: 10rpx;
  text-align: center;
  box-sizing: border-box;
  float: left;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  color: #454545;
  overflow: hidden;
}

.price-box >view:nth-of-type(3n+3) {
  margin-right: 0rpx;
}

.price-box >view.active {
  border: 4rpx solid #f1b400;
}

.price-box >view .price-text {
  height: 100rpx;
  line-height: 100rpx;
  border-bottom: 1rpx solid #ededed;
  font-size: 36rpx;
}

.price-box >view .price-text text {
  font-size: 24rpx;
}

.price-box >view .welfare {
  height: 59rpx;
  line-height: 59rpx;
  font-size: 24rpx;
}

.price-box >view .welfare text{
  color: #ffa300;
}

.confirm-btn {
  width: 100%;
  background: #f1b400;
  color: #fff;
  margin: 30rpx 0rpx;
}

.remain {
  padding: 30rpx 40rpx;
  font-size: 24rpx;
  color: #8b8b8c;
}

.remain >view:first-of-type {
  font-size: 28rpx;
}

</style>