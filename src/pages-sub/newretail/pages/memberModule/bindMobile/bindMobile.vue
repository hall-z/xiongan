<template>
<!-- pages/bindMobile/bindMobile.wxml -->
<form @submit="bindMobile" report-submit="true">
  <view class="mobile-input-box" @click.stop="bindbox">
    <image :src="state.imagesPath.iconMobile"></image>
    <input type="number" @input="bindMobileInput" placeholder="请输入手机号" auto-focus="" maxlength="11">
    <view class="get-code btn" @click.stop="getCaptcha" :style="'background: ' + state.getCodeBgColor">{{state.getCodeBtn}}</view>
  </view>
  <view class="code-input-box">
    <image :src="state.imagesPath.iconPassword"></image>
    <input type="password" @input="bindcaptchaInput" placeholder="请输入验证码" maxlength="6">
  </view>
  <!-- <view class="agreement">
    点击绑定表示您同意
    <text bindtap="toAdPage">《会员服务协议》</text>
  </view> -->
  <button form-type="submit" class="confirm-btn btn" :style="'background-color: ' + themeColor + ';'">确认绑定</button>
</form>
<verify class="vue-ref" :show="state.verifyShow" :imgSize="state.imgSize" mode="pop" captchaType="blockPuzzle" @success="handleSuccess" @error="handleError" @close="handleClose"></verify> 
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiSmsServiceJs from "@/service/api/newretail/smsService";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import verify from '@/pages-sub/newretail/components/verify/verify.vue';
const app = getApp();

// pages/bindMobile/bindMobile.js
const wxaUserService = _apiWxaUserServiceJs;
const smsService = _apiSmsServiceJs;
const systemService = _apiSystemServiceJs;
const auth = _utilsAuthJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "绑定手机号",
  imagesPath: IMGAGESPATH,
  mobile: '',
  captcha: '',
  getCodeBtn: "获取验证码",
  getCodeBgColor: themeManager.color,
  judgeVerify: false,
  verifyShow: false,
  imgSize: {
    width: "310px",
    height: "155px"
  },
  captchaVerification: ""
});
function bindMobileInput(e) {
  state.mobile = e.detail.value;
}
function bindcaptchaInput(e) {
  state.captcha = e.detail.value;
}
function handleSuccess(e) {
  if (e.detail.captchaVerification != null) {
    state.captchaVerification = e.detail.captchaVerification;
  }
  handleClose();
  getCaptcha(true);
}
function handleError(e) {
  state.captchaVerification = "";
}
function getCaptcha(isCheck) {
  if (checkMobile() && state.getCodeBgColor === themeManager.color) {
    if (state.captchaVerification !== "" || !state.judgeVerify) {
      let seconds = 60;
      let self = this;
      state.getCodeBgColor = '#bbb';
      state.getCodeBtn = seconds + 's';
      let time = setInterval(function () {
        seconds--;
        self.setData({
          getCodeBtn: seconds + 's'
        });
        if (seconds <= 0) {
          self.setData({
            getCodeBtn: '获取验证码',
            getCodeBgColor: themeManager.color
          });
          clearInterval(time);
        }
      }, 1000);
      smsService.sendSms(state.mobile, state.captchaVerification).then(res => {
        console.log(res);
        state.captchaVerification = "";
      }).catch(err => {
        state.captchaVerification = "";
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    } else {
      showVerify();
    }
  }
}
function getJudge() {
  state.judgeVerify = false;
  systemService.query('use_sms_captcha').then(res => {
    if (res && res.length > 0 && (res[0].value === 'TRUE' || res[0].value === true)) {
      state.judgeVerify = true;
    }
  });
}
function showVerify() {
  state.verifyShow = true;
}
function handleClose(e) {
  state.verifyShow = false;
}
function checkMobile() {
  let reg = /^[1]([3-9])[0-9]{9}$/;
  if (!state.mobile) {
    uni.showToast({
      title: "请填写手机号",
      icon: 'none',
      duration: 2000
    });
    return false;
  } else if (!reg.test(state.mobile)) {
    uni.showToast({
      title: "请填写正确的手机号",
      icon: 'none',
      duration: 2000
    });
    return false;
  } else {
    return true;
  }
}
function checkCaptcha() {
  if (!state.captcha) {
    uni.showToast({
      title: "请填写验证码",
      icon: 'none',
      duration: 2000
    });
    return false;
  } else {
    return true;
  }
}
function toAdPage(e) {
  // 链接
  const url = 'https://xianfengxcx.gomoretech.com/newretail-admin/#/xfAgreement';
  try {
    // let webUrl = url + '&storeId=' + this.data.storeId + '&type=normal'
    let webUrl = url;
    uni.setStorageSync('webUrl', webUrl);
  } catch (e) {}
  uni.navigateTo({
    url: '../advertising/advertising?from=bindMobile'
  });
}
function bindMobile(val) {
  console.log(val);
  const that = this;
  const loginStatus = checkAuth();
  if (loginStatus) {
    if (checkMobile() && checkCaptcha() && state.getCodeBgColor !== themeManager.color) {
      let params = {
        mobile: state.mobile,
        captcha: state.captcha,
        registerSourceType: null,
        channel: app.globalData.channel
      };
      wxaUserService.bindMobile(params).then(res => {
        console.log(res);
        getLoginInfo();
      }).catch(err => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    } else {
      if (state.getCodeBgColor === themeManager.color) {
        uni.showToast({
          title: '请获取验证码！',
          icon: 'none',
          duration: 2000
        });
      }
    }
  } else {
    uni.showToast({
      title: '您还未授权登陆，请登陆后绑定手机号哦~',
      icon: 'none',
      duration: 2000
    });
  }
}
function getLoginInfo() {
  const that = this;
  wxaUserService.login().then(res => {
    console.log(res);
    if (res.member) {
      auth.setUser(res);
      uni.showToast({
        title: '绑定成功',
        icon: 'none',
        duration: 2000
      });
      app.globalData.userInfo = res && res.member ? res : null;
      auth.getDistributor();
      auth.bindDistribution();
    } else {
      uni.showToast({
        title: '绑定失败',
        icon: 'none',
        duration: 2000
      });
    }
    setTimeout(() => {
      uni.navigateTo({
        url: '../index/index'
      });
    }, 2000);
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false;
  } else {
    return true;
  }
}
onLoad(function (options) {
  uni.hideShareMenu();
  getMemberUserInfo();
  getJudge();
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  state.getCodeBgColor = app.globalData.uiconfig.themeColor;
});
function getMemberUserInfo() {
  if (!app.globalData.userInfo) {
    uni.showToast({
      title: "您还未授权，请登陆授权",
      icon: 'none',
      duration: 2000
    });
  } else {}
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/bindMobile/bindMobile.wxss */
page{
    background: url("https://app-1256684088.cos.ap-beijing.myqcloud.com/wujieImages/bgLogin.png") no-repeat center; 
    background-size: 100% 100%; 
}

image{
    float: left;
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
    margin-top: 34rpx;
}
.btn{
    background-color: #009f55;
    color: #fff;
    border-radius: 6rpx;
    text-align: center;
}

.get-code{
    width: 208rpx;
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 24rpx;
    float: right;
    font-size: 28rpx;
}
.mobile-input-box, .code-input-box{
    margin: 0rpx 30rpx;
    height: 100rpx;
    border-bottom: 2rpx solid #eee;
    overflow: hidden;
    line-height: 100rpx;
}
view input{
    float: left;
    width: 380rpx;
    margin-top: 28rpx;
}
.agreement{
    margin: 0rpx 30rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 26rpx;
}
.agreement text{
    color: #0198ff;
}
.confirm-btn{
    width: 690rpx;
    height: 90rpx;
    line-height: 90rpx;
    margin: 0 auto;
}
</style>