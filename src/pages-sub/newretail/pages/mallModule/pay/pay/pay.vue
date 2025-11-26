<template>
<!--pages/pay/pay.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
  <text class="pay-title">向商家付款</text>
  <view class="member-code-box" v-if="state.hasUserInfo">
    <view class="barcode-box">
      <canvas canvas-id="paybarcode">
    </canvas></view>
    <text>{{state.codeId}}</text>
  </view>
  <view class="pay-code-box" v-if="state.hasUserInfo">
    <view class="qrcode-box">
      <canvas canvas-id="payqrcode">
    </canvas></view>
    <!-- <text><image src="{{imagesPath.iconRefresh2}}" ></image>付款码每分钟自动刷新</text> -->
    <view class="refresh" @click="refreshPayCode">
      <image :src="state.imagesPath.iconRefresh2"></image> 点击刷新付款码
    </view>
  </view>
  <view class="card-balance">
    <view v-if="state.payType === 'balance'">      
      <view class="balance">储值余额：{{state.hasUserInfo ? '￥' + state.balance : '***'}}</view>
      <view class="recharge" @click="toRecharge">前往充值<image :src="state.imagesPath.iconRight2"></image></view>
    </view>
    <view v-if="state.payType === 'score'">      
      <view class="balance">当前积分：{{state.hasUserInfo ? state.scoreBalance : '***'}}</view>
    </view>
  </view>
</view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _utilsSelfJs from "@/utils/newretail/self";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/pay/pay.js
const wxbarcode = _utilsSelfJs;
const memberService = _apiMemberServiceJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const utils = _utilsUtilsJs;
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //  处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')';
  } else {
    return sColor;
  }
};
//获取应用实例
const state = reactive({
  navigationBarTitle: "余额支付",
  theme: themeManager,
  imagesPath: IMGAGESPATH,
  payType: "balance",
  // 支付类型 balance，score
  codeId: '',
  codeWidth: 586,
  codeHeight: 148,
  time: '',
  balance: 0,
  scoreBalance: 0,
  hasUserInfo: false,
  member: null
});
function codeTextPartition(val) {
  val = val.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
  return val;
}
function checkAuth(e) {
  console.log(e);
  if (!app.globalData.userInfo) {
    return false;
  } else {
    return true;
  }
}
function refreshPayCode() {
  if (app.globalData.userInfo) {
    getPayQrCode();
  } else {
    uni.showToast({
      title: '',
      icon: 'none',
      duration: 2000
    });
  }
}
function getPayQrCode() {
  const that = this;
  clearTimeout(state.time);
  if (state.payType === "balance") {
    memberService.getPayCode().then(res => {
      console.log(res);
      wxbarcode.barcode('paybarcode', res.code, state.codeWidth, state.codeHeight);
      wxbarcode.qrcode('payqrcode', res.code, 302, 302);
      state.codeId = codeTextPartition(res.code);
      let now = new utils.ResponseDate().getTime();
      let expiresInSeconds = now + res.expiresInSeconds * 1000;
      let _data = {
        code: res.code,
        expiresInSeconds: expiresInSeconds,
        payType: state.payType
      };
      try {
        uni.setStorageSync('wj_payCodeTimePay', _data);
      } catch (e) {}
    }).catch(e => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    });
  } else {
    memberService.getScorePayCode().then(res => {
      console.log(res);
      res = res || {};
      wxbarcode.barcode('paybarcode', res.authCode, state.codeWidth, state.codeHeight);
      wxbarcode.qrcode('payqrcode', res.authCode, 302, 302);
      state.codeId = codeTextPartition(res.authCode || '');
      let now = new utils.ResponseDate().getTime();
      let expiresIn = now + res.expiresIn * 1000;
      let _data2 = {
        code: res.authCode,
        expiresInSeconds: expiresIn,
        payType: state.payType
      };
      try {
        uni.setStorageSync('wj_payCodeTimePay', _data2);
      } catch (e) {}
    }).catch(e => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
  let time = setTimeout(() => {
    getPayQrCode();
    console.log('刷新了');
  }, 60000);
  state.time = time;
}
function getMbrBalance() {
  memberService.getMbrBalance().then(res => {
    if (res) {
      state.balance = res.toFixed(2);
    }
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getMbrScoreBalance() {
  const mobile = state.member.mobile;
  memberService.getBalance(mobile).then(res => {
    if (res) {
      state.scoreBalance = res;
    }
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toRecharge() {
  NAVPAGE.toRecharge();
}
onLoad(function (options) {
  uni.hideShareMenu();
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.hasUserInfo = true;
    state.member = app.globalData.userInfo.member;
  } else {
    state.hasUserInfo = false;
  }
  state.theme = {
    color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + app.globalData.uiconfig.themeColor + ';' : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background: ' + app.globalData.uiconfig.themeColor + ';' : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';' : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" ? 'background: linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' : "background: linear-gradient(-270deg, #FF9F43, #F13327);",
    mainColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : "border-color:rgba(255,159,67, 0.4);",
    mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) : 'rgba(255,159,67, 0.2)',
    BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' : "background-color:rgba(255,159,67, 0.1);"
  };
  const that = this;
  if (options.type != null) {
    state.payType = options.type;
  }
  try {
    const payCode = uni.getStorageSync('wj_payCodeTimePay');
    let now = new utils.ResponseDate().getTime();
    if (payCode && now < payCode.expiresInSeconds && payCode.payType && payCode.payType === state.payType) {
      let expiresInSecondsTime = payCode.expiresInSeconds - now;
      wxbarcode.barcode('paybarcode', payCode.code, state.codeWidth, state.codeHeight);
      wxbarcode.qrcode('payqrcode', payCode.code, 302, 302);
      state.codeId = codeTextPartition(payCode.code);
      setTimeout(() => {
        getPayQrCode();
      }, expiresInSecondsTime);
    } else {
      getPayQrCode();
    }
  } catch (e) {
    // Do something when catch error
    getPayQrCode();
  }
  if (state.hasUserInfo) {
    if (state.payType === "score") {
      getMbrScoreBalance();
      state.navigationBarTitle = "积分支付";
    } else {
      getMbrBalance();
    }
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {
  clearTimeout(state.time);
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/pay/pay.wxss */

page {
  background: #019f55;
}

.content {
  background: #fff;
  width: 688rpx;
  /* height: 696rpx; 
  padding-bottom: 32rpx; */
  border-radius: 10rpx;
  margin: 40rpx auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.pay-title {
  font-size: 36rpx;
  line-height: 90rpx;
  background: #f5f6f9;
  width: 100%;
  text-align: center;
  border-top-left-radius: 10rpx;
  border-top-right-radius: 10rpx;
  margin-bottom: 52rpx;
}

.member-code-box {
  text-align: center;
  height: 202rpx;
}

.member-code-box .barcode-box {
  width: 586rpx;
  height: 146rpx;
}

.member-code-box .barcode-box canvas {
  width: 586rpx;
  height: 146rpx;
}

.member-code-box>text {
  font-size: 30rpx;
  color: #727272;
  line-height: 36rpx;
  display: block;
  height: 36rpx;
}

.member-code-box>text:last-of-type {
  font-size: 36rpx;
  line-height: 42rpx;
  color: #333;
  margin-top: 21rpx;
}

.pay-code-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 26rpx;
  /* height: 360rpx; */
  width: 360rpx;
}

.qrcode-box {
  width: 302rpx;
  height: 302rpx;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
}

.qrcode-box canvas {
  width: 302rpx;
  height: 302rpx;
}

.pay-code-box text {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #bcbcbc;
}

.pay-code-box .refresh{
  font-size: 28rpx;
  line-height: 36rpx;
  color: #bcbcbc;
  height: 48rpx;
  display: flex;
  align-items: center;
  z-index: 99;
  margin-top: 28rpx;
}

.pay-code-box .refresh image{
  width: 34rpx;
  height: 34rpx;
  margin-right: 12rpx;
}

.card-balance{
  border-top: 1rpx dashed #d6d6d6;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100rpx;
  font-size: 28rpx;
  line-height: 100rpx;
  color: #313131;
  padding: 0 46rpx;
  box-sizing: border-box;
  margin-top: 34rpx;
}

.card-balance .recharge{
  color: #9b9b9b;
  padding-right: 22rpx;
  position: relative;
}

.card-balance .recharge image{
  width: 12rpx;
  height: 23rpx;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -11.5rpx;
}
</style>