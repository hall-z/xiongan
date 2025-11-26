<template>
<!--pages/resetPassword/resetPassword.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content">
    <view class="top-info">
        设置支付密码后可以通过余额支付
  
    </view>
    <view class="mobile-input-box">
        <!-- <image src="{{imagesPath.iconMobile}}"></image> -->
        <input type="number" :disabled="!state.mobileEditFlag" :value="state.mobile" @input="bindMobileInput" placeholder="请输入手机号" maxlength="11">
        <view class="get-code btnA" @click.stop="getCaptcha">{{state.getCodeBtn}}</view>
    </view>
    <view class="code-input-box">
        <!-- <image src="{{imagesPath.iconPassword}}"></image> -->
        <input type="password" :value="state.captcha" @input="bindcaptchaInput" placeholder="请输入验证码" maxlength="6">
    </view>
    <view class="section">
        <view class="section-title">请输入您的密码</view>
        <password-input @valueSix="valueSix" @valueNow="handleNewPassword" :input_value="state.newPasswordInput.input_value" :value_length="state.newPasswordInput.value_length" :isNext="state.newPasswordInput.isNext" :get_focus="state.newPasswordInput.get_focus" :focus_class="state.newPasswordInput.focus_class" :value_num="state.newPasswordInput.value_num" :height="state.newPasswordInput.height" :width="state.newPasswordInput.width" :see="state.newPasswordInput.see" :interval="state.newPasswordInput.interval">></password-input>
        <!-- <input password placeholder="请输入新密码" name="newPassword" value="{{newPassword}}" maxlength="10" bindinput="handleNewPassword" /> -->
    </view>
    <view class="section" style="padding-bottom: 40rpx;">
        <view class="section-title">请再次输入密码</view>
        <password-input @valueSix="valueSix" @valueNow="handleConfirmPassword" :input_value="state.confirmPasswordInput.input_value" :value_length="state.confirmPasswordInput.value_length" :isNext="state.confirmPasswordInput.isNext" :get_focus="state.confirmPasswordInput.get_focus" :focus_class="state.confirmPasswordInput.focus_class" :value_num="state.confirmPasswordInput.value_num" :height="state.confirmPasswordInput.height" :width="state.confirmPasswordInput.width" :see="state.confirmPasswordInput.see" :interval="state.confirmPasswordInput.interval">></password-input>
        <!-- <input password placeholder="再次输入确认" name="confirmPassword" value="{{confirmPassword}}" maxlength="10" bindinput="handleConfirmPassword" /> -->
    </view>
    <view class="btn">
        <button type="primary" :style="state.disabled ? '' : state.theme.mainBgColor" :class="state.disabled ? 'disabled' : ''" hover-class="none" @click="handleConfirmOld">确认修改</button>
    </view>
</view>
<verify class="vue-ref" :show="state.verifyShow" :imgSize="state.imgSize" mode="pop" captchaType="blockPuzzle" @success="handleSuccess" @error="handleError" @close="handleClose"></verify> 
</template>
<script setup>
import _apiSmsServiceJs from "@/service/api/newretail/smsService";
import _utilsThemeManagerJs2 from "@/utils/newretail/themeManager";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import passwordInput from '@/pages-sub/newretail/components/password-input/password-input.vue';
import verify from '@/pages-sub/newretail/components/verify/verify.vue';
const app = getApp();

// pages/resetPassword/resetPassword.js
const memberService = _apiMemberServiceJs;
const wxaUserService = _apiWxaUserServiceJs;
const systemService = _apiSystemServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const THEME = _utilsThemeManagerJs;
const themeManager = _utilsThemeManagerJs2;
const smsService = _apiSmsServiceJs;
//获取应用实例
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
const state = reactive({
  mobileEditFlag: true,
  navigationBarTitle: "修改支付密码",
  imagesPath: IMGAGESPATH,
  getCodeBgColor: themeManager.color,
  theme: THEME,
  newPassword: '',
  mobile: null,
  captcha: null,
  active: false,
  getCodeBtn: '获取验证',
  confirmPassword: '',
  oldPassword: '',
  disabled: true,
  mermber: app.globalData.userInfo.member,
  // 输入框参数设置
  newPasswordInput: {
    input_value: "",
    //输入框的初始内容
    value_length: 0,
    //输入框密码位数
    isNext: false,
    //是否有下一步的按钮
    get_focus: true,
    //输入框的聚焦状态
    focus_class: true,
    //输入框聚焦样式
    value_num: [1, 2, 3, 4, 5, 6],
    //输入框格子数
    height: "92rpx",
    //输入框高度
    width: "604rpx",
    //输入框宽度
    see: false,
    //是否明文展示
    interval: true //是否显示间隔格子
  },
  confirmPasswordInput: {
    input_value: "",
    //输入框的初始内容
    value_length: 0,
    //输入框密码位数
    isNext: false,
    //是否有下一步的按钮
    get_focus: false,
    //输入框的聚焦状态
    focus_class: false,
    //输入框聚焦样式
    value_num: [1, 2, 3, 4, 5, 6],
    //输入框格子数
    height: "92rpx",
    //输入框高度
    width: "604rpx",
    //输入框宽度
    see: false,
    //是否明文展示
    interval: true //是否显示间隔格子
  },
  judgeVerify: false,
  verifyShow: false,
  imgSize: {
    width: "310px",
    height: "155px"
  },
  captchaVerification: ""
});
function handleNewPassword(e) {
  state.newPassword = e.detail;
  if (e.detail.length < 6) {
    state.disabled = true;
  }
  if (e.detail.length === 6 && state.confirmPassword.length < 6) {
    state.confirmPasswordInput.get_focus = true;
    state.confirmPasswordInput.focus_class = true;
  }
}
function handleConfirmPassword(e) {
  state.confirmPassword = e.detail;
  if (e.detail.length < 6) {
    state.disabled = true;
  }
  if (e.detail.length === 6 && state.newPassword.length < 6) {
    state.newPasswordInput.get_focus = true;
    state.newPasswordInput.focus_class = true;
  }
}
function valueSix(e) {
  console.log(state.confirmPassword.length, state.newPassword.length);
  if (state.confirmPassword.length === 6 && state.newPassword.length === 6) {
    state.disabled = false;
  }
}
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
function handleConfirm() {
  const that = this;
  const login = checkAuth();
  const reg = new RegExp(/^[0-9A-Za-z]+$/);
  if (login) {
    if (!state.newPassword) {
      uni.showToast({
        title: "请输入新密码",
        icon: 'none',
        duration: 2000
      });
    } else if (!state.confirmPassword) {
      uni.showToast({
        title: "请再次输入确认",
        icon: 'none',
        duration: 2000
      });
    } else if (!reg.test(state.newPassword) || !reg.test(state.confirmPassword)) {
      uni.showToast({
        title: '请输入6位密码~',
        icon: 'none',
        duration: 2000
      });
    } else {
      smsService.validate2({
        captcha: state.captcha,
        mobile: state.mobile
      }).then(res => {
        if (res) {
          if (state.newPassword.length > 3 && state.confirmPassword.length > 3) {
            // 验证两次输入的密码是否相同
            if (state.newPassword === state.confirmPassword) {
              let postData = {
                memberId: state.mermber.id,
                password: state.active ? '' : state.newPassword,
                newPassword: !state.active ? '' : state.newPassword,
                isMspPassword: true
              };
              smsService.setMspPassword(postData).then(res => {
                uni.showToast({
                  title: '修改成功',
                  icon: 'none',
                  duration: 2000
                });
                setTimeout(() => {
                  uni.navigateBack({
                    delta: 1
                  });
                }, 2000);
              }).catch(error => {
                uni.showToast({
                  title: error.message,
                  icon: 'none',
                  duration: 2000
                });
                console.log(error.message);
              });
            } else {
              uni.showToast({
                title: '两次输入的密码不一致，请重新输入~',
                icon: 'none',
                duration: 2000
              });
            }
          } else {
            uni.showToast({
              title: '密码长度应为6位数字~',
              icon: 'none',
              duration: 2000
            });
          }
        }
      }).catch(err => {
        uni.showToast({
          icon: 'none',
          title: err.message
        });
      });
    }
  } else {
    uni.showToast({
      title: '请登录后再设置密码~',
      icon: 'none',
      duration: 2000
    });
  }
}
function handleConfirmOld() {
  const that = this;
  const login = checkAuth();
  const reg = new RegExp(/^[0-9A-Za-z]+$/);
  if (login) {
    if (!state.newPassword) {
      uni.showToast({
        title: "请输入新密码",
        icon: 'none',
        duration: 2000
      });
    } else if (!state.confirmPassword) {
      uni.showToast({
        title: "请再次输入确认",
        icon: 'none',
        duration: 2000
      });
    } else if (!reg.test(state.newPassword) || !reg.test(state.confirmPassword)) {
      uni.showToast({
        title: '请输入6位密码~',
        icon: 'none',
        duration: 2000
      });
    } else {
      if (state.newPassword.length > 3 && state.confirmPassword.length > 3) {
        // 验证两次输入的密码是否相同
        if (state.newPassword === state.confirmPassword) {
          let postData = {
            newPassword: state.newPassword,
            oldPassword: state.oldPassword
          };
          memberService.resetCardPassword(postData).then(res => {
            console.log(res);
            uni.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            });
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              });
            }, 2000);
          }).catch(error => {
            uni.showToast({
              title: error.message,
              icon: 'none',
              duration: 2000
            });
            console.log(error.message);
          });
        } else {
          uni.showToast({
            title: '两次输入的密码不一致，请重新输入~',
            icon: 'none',
            duration: 2000
          });
        }
      } else {
        uni.showToast({
          title: '密码长度应为6位数字~',
          icon: 'none',
          duration: 2000
        });
      }
    }
  } else {
    uni.showToast({
      title: '请登录后再设置密码~',
      icon: 'none',
      duration: 2000
    });
  }
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false;
  } else {
    return true;
  }
}
onLoad(function (options) {
  getJudge();
  if (options.active) {
    state.active = true;
  }
  if (options.type) {
    state.navigationBarTitle = '设置支付密码';
  } else {
    state.navigationBarTitle = '修改支付密码';
  }
  console.log(app.globalData.mermber, 'dlkasjdlkasj');
  uni.hideShareMenu();
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
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
});
onReady(function () {});
onShow(function () {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.mobile = app.globalData.userInfo.member.mobile;
    state.mobileEditFlag = false;
  } else {
    state.mobileEditFlag = true;
  }
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/resetPassword/resetPassword.wxss */

page {
    background-color: rgb(246, 246, 246);
}

.mobile-input-box,
.code-input-box {
    padding: 0 73rpx;
    /* margin: 0rpx 30rpx; */
    height: 100rpx;
    border-bottom: 2rpx solid #eee;
    overflow: hidden;
    line-height: 100rpx;
    box-sizing: border-box;
    background-color: #fff;
}

view input {
    float: left;
    width: 380rpx;
    height: 100%;
    /* margin-top: 28rpx; */
}
.get-code{
    /* width: 208rpx; */
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 24rpx;
    float: right;
    font-size: 28rpx;
    color: #b22b2c;
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
image{
    float: left;
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
    margin-top: 34rpx;
}
/* .content {
    margin-top: 28rpx;
} */

.top-info {
    height: 100rpx;
    padding-left: 73rpx;
    display: flex;
    align-items: center;

    color: #999999;
    /* line-height: 100rpx; */
    /* color: #cccccc; */
    /* text-align: center; */
    /* margin-bottom: 20rpx; */
    font-size: 26rpx;
}

.top-info>view {
    line-height: 48rpx;
}

.top-info .title {
    /* font-size: 36rpx;
    font-weight: bold;
    color: #000;
    margin-bottom: 24rpx; */
}

.top-info .tips {
    font-size: 24rpx;
    color: #868686;
}

.content .btn {
    padding: 0 38rpx;
    margin-top: 42rpx;
}

.content button {
    width: 600rpx;
    height: 98rpx;
    border-radius: 6rpx;
    font-size: 32rpx;
    line-height: 98rpx;
}

.content button.disabled {
    background: #f2f2f2;
    color: #adadad;
}

.content .section {
    padding: 0 73rpx;
    background: #fff;
    overflow: hidden;
    font-weight: 700;
}

.content .section .section-title {
    font-size: 24rpx;
    line-height: 48rpx;
    height: 48rpx;
    color: #cfcfcf;
}
</style>