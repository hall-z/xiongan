<template>
<!-- pages/bindMobile/bindMobile.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
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
  <view class="agreement">
    点击登录表示您同意
    <text @click="toAdPage">《线上商城服务协议》</text>
  </view>
  <button form-type="submit" class="confirm-btn btn" :style="'background-color: ' + state.mainColor" :disabled="state.loading" :loading="state.loading">确认绑定</button>
</form>
<verify class="vue-ref" :show="state.verifyShow" :imgSize="state.imgSize" mode="pop" captchaType="blockPuzzle" @success="handleSuccess" @error="handleError" @close="handleClose"></verify> 
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiSmsServiceJs from "@/service/api/newretail/smsService";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/bindMobile/bindMobile.js
const wxaUserService = _apiWxaUserServiceJs;
const smsService = _apiSmsServiceJs;
const systemService = _apiSystemServiceJs;
const storeService = _apiStoreServiceJs;
const memberService = _apiMemberServiceJs;
const auth = _utilsAuthJs;
const utils = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const ADDRESS = _utilsAddressJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
import bus from 'iny-bus';
import verify from '@/pages-sub/newretail/components/verify/verify.vue';

//获取应用实例
const state = reactive({
  judgeVerify: false,
  navigationBarTitle: "绑定手机号",
  imagesPath: IMGAGESPATH,
  mobile: '',
  captcha: '',
  getCodeBtn: "获取验证码",
  getCodeBgColor: themeManager.color,
  loading: false,
  mainColor: themeManager.color,
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
function getCaptcha(isCheck) {
  if (checkMobile() && state.getCodeBtn === '获取验证码') {
    //   if (isCheck !== true) {
    //     this.setData({
    //       captchaVerification: ""
    //     })
    //   }
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
    if (app.globalData.TENANT && webUrl.indexOf("tenant") < 0) {
      webUrl = webUrl + '?tenant=' + app.globalData.TENANT;
    }
    uni.setStorageSync('webUrl', webUrl);
  } catch (e) {}
  let opts = '?from=bindMobile';
  NAVPAGE.toAdvertising(opts);
}
function bindbox() {}
function bindMobile(val) {
  const that = this;
  const loginStatus = checkAuth();
  // if (loginStatus) {
  if (checkMobile() && checkCaptcha() && state.getCodeBgColor !== themeManager.color) {
    let storeId = '';
    let storeIdactive = uni.getStorageSync('storeIdactive');
    if (storeIdactive && storeIdactive.id) {
      storeId = storeIdactive.id;
    }
    if (app.globalData.storeInfo) {
      if (app.globalData.systemConfigure.memberAscriptionStoreDistance && app.globalData.storeInfo.distance) {
        let distance = app.globalData.storeInfo.distance;
        distance = parseFloat(distance * 1000);
        if (distance < app.globalData.systemConfigure.memberAscriptionStoreDistance) {
          storeId = app.globalData.storeInfo.id;
        }
      }
    } else {}
    if (!state.loading) {
      state.loading = true;
      console.log(state.loading);
      if (state.inviteInfo) {
        state.inviteInfo.inviteeMobile = state.mobile;
      }
      let params = {
        mobile: state.mobile,
        captcha: state.captcha,
        registerSourceType: 'WXAPP',
        registerStoreId: storeId,
        invitation: state.inviteInfo,
        channel: app.globalData.channel
      };
      wxaUserService.bindMobile(params).then(res => {
        console.log(res);
        if (state.inviteInfo) {
          //标记邀请好友注册完成
          uni.setStorageSync('wj_invite_registed', true);
        }
        state.loading = false;
        if (utils.isHideLoading()) {
          utils.setHideLoading(false);
        }
        if (res.member) {
          bus.emit('getRelatedCoupon', true);
          auth.setUser(res);
          auth.bindDistribution();
          uni.showToast({
            title: '绑定成功',
            icon: 'none',
            duration: 2000
          });
          app.globalData.userInfo = res && res.member ? res : null;
          try {
            uni.setStorageSync('wj_member', res.member);
          } catch (e) {}
          // 如果绑定成功记录会员访问门店
          if (app.globalData.storeInfo) {
            recordVisitStore(app.globalData.storeInfo.id);
          }
        } else {
          uni.showToast({
            title: '绑定失败',
            icon: 'none',
            duration: 2000
          });
        }
        setTimeout(() => {
          if (options.from === 'authorize') {
            // 从授权页过来绑定手机号返回授权页上一页面
            uni.navigateBack({
              delta: 2
            });
          } else {
            uni.navigateBack({
              delta: 1
            });
          }
        }, 2000);
      }).catch(err => {
        state.loading = false;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    } else {
      uni.showToast({
        title: '正在绑定手机号，请稍等~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    if (state.getCodeBgColor === themeManager.color) {
      uni.showToast({
        title: '请获取验证码！',
        icon: 'none',
        duration: 2000
      });
    }
  }
  // } else {
  //   wx.showToast({
  //     title: '您还未授权登陆，请登陆后绑定手机号哦~',
  //     icon: 'none',
  //     duration: 2000
  //   })
  // }
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false;
  } else {
    return true;
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
onLoad(function (options) {
  getJudge();
  //代表从邀请好友进入
  if (options.inviteInfo != null) {
    let inviteInfo = JSON.parse(options.inviteInfo);
    state.inviteInfo = inviteInfo;
  }
  state.getCodeBgColor = app.globalData.uiconfig.themeColor;
  state.mainColor = app.globalData.uiconfig.themeColor;
  uni.hideShareMenu();
  getMemberUserInfo();
  const self = this;
  if (app.globalData.storeInfo) {
    console.log(app.globalData.storeInfo, '1');
    // 统计PV
    if (app.globalData.storeInfo) {
      ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
    }
    calcStoreDistance(app.globalData.storeInfo, app.globalData.storeInfo.userLatitude, app.globalData.storeInfo.userLongitude);
  } else {
    ADDRESS.getLocation().then(res => {
      app.globalData.storeInfo = res;
      console.log(app.globalData.storeInfo, "2");
      // 统计PV
      if (app.globalData.storeInfo) {
        ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
      }
      // 计算当前门店经纬度到用户位置的直线距离
      calcStoreDistance(res, res.userLatitude, res.userLongitude);
    }).catch(err => {
      console.log(err);
    });
  }
  // ADDRESS.getLocation().then(res => {
  //     app.globalData.storeInfo = res
  //     console.log(app.globalData.storeInfo, "2");
  //     // 统计PV
  //     if (app.globalData.storeInfo) {
  //         ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  //     }
  //     // 计算当前门店经纬度到用户位置的直线距离
  //     self.calcStoreDistance(res, res.userLatitude, res.userLongitude)
  // }).catch(err => {
  //     console.log(err);
  //   })
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
function calcStoreDistance(stores, latitude, longitude) {
  let dis = utils.distance(latitude, longitude, stores.latitude, stores.longitude);
  let store = {
    ...stores,
    distance: dis
  };
  app.globalData.storeInfo = store;
  state.storeInfo = store;
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function recordVisitStore(storeId) {
  if (app.globalData.systemConfigure.enableRecordVisitStore) {
    memberService.visitStore(storeId).then(res => {
      console.log(res);
    }).catch(e => {
      console.log(e.message);
    });
  }
}
function showVerify() {
  state.verifyShow = true;
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
function handleClose(e) {
  state.verifyShow = false;
}
</script>
<style scoped>
/* pages/bindMobile/bindMobile.wxss */
page {
    background: url("https://app-1256684088.cos.ap-beijing.myqcloud.com/wujieImages/bgLogin.png") no-repeat center;
    background-size: 100% 100%;
}

image {
    float: left;
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
    margin-top: 34rpx;
}

.btn {
    background-color: #009F55;
    /* position: unset; */
    color: #fff;
    border-radius: 6rpx;
    text-align: center;
}

.get-code {
    width: 208rpx;
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 24rpx;
    float: right;
    font-size: 28rpx;
}

.mobile-input-box,
.code-input-box {
    margin: 0rpx 30rpx;
    height: 100rpx;
    border-bottom: 2rpx solid #eee;
    overflow: hidden;
    line-height: 100rpx;
}

view input {
    float: left;
    width: 380rpx;
    margin-top: 28rpx;
}

.agreement {
    margin: 0rpx 30rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 26rpx;
}

.agreement text {
    color: #0198ff;
}

.confirm-btn {
    width: 690rpx;
    height: 90rpx;
    line-height: 90rpx;
    margin: 0 auto;
}

button[disabled]:not([type]) {
    background: rgba(0, 159, 85, 0.4)
}
</style>