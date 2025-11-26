<template>
<!--pages/mallModule/distribution/apply/apply.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<movable-area>
  <image class="page-bg" :src="state.imagesPath.applyDistributionBg"></image>
  <view class="apply-title">
    <view>申请成为合伙人</view>
    <view>新零售模式——等的就是你</view>
  </view>
  <view class="apply">
    <view class="section">
      <input placeholder="请填写您的真实姓名,用于结算" placeholder-class="placeholder-class" @input="handleNameInput">
    </view>
    <view class="section">
      <input placeholder="请填写您的手机号码,方便联系" placeholder-class="placeholder-class" @input="handlePhoneInput">
    </view>
    <view class="section">
      <picker mode="selector" @change="handleSexChange" :value="state.sexIndex" :range="state.sexArray">
        <view class="picker">
          {{state.sex ? state.sex : "请选择您的性别"}}
        </view>
      </picker>
    </view>
    <button v-if="!state.hasUserInfo" class="apply-btn" @click="getUserInfo">申请成为合伙人</button>
    <button v-else class="apply-btn" @click="apply">申请成为合伙人</button>
  </view>
  <movable-view :x="state.x" :y="state.y" direction="all" v-if="state.homeBack">
    <image class="movable-view" :src="state.imagesPath.toHome" @click="toHome"></image>
  </movable-view>
</movable-area>
<authorize @login="handleUserLogin"></authorize>
</template>
<script setup>
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiDistributionServiceJs from "@/service/api/newretail/distributionService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
const app = getApp();

// pages/mallModule/distribution/apply/apply.js
const distributionService = _apiDistributionServiceJs;
const UTILS = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const AUTHORIZE = _utilsAuthorizeJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "加入合伙人",
  imagesPath: IMGAGESPATH,
  name: "",
  mobile: "",
  sexArray: ["男", "女"],
  sexIndex: 0,
  sex: "",
  date: "",
  endDate: "",
  hasUserInfo: false,
  isMember: false,
  x: 750,
  y: 450,
  scale: 2,
  homeBack: false
});
onLoad(function (options) {
  let pageStack = getCurrentPages();
  console.log(pageStack);
  if (pageStack.length === 1) {
    state.homeBack = true;
  }
  let date = new UTILS.ResponseDate();
  let now = UTILS.formatTime(date);
  let newTime = now.replace(/\//g, '-');
  let data = newTime.split(' ')[0];
  // 统计PV
  state.endDate = data;
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  getSharePictures();
  hasApply = false;
});
onReady(function () {});
onShow(function () {
  checkUserInfo();
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let sharePictures = state.sharePictures;
  let path = UTILS.getSharePath();
  console.log(path);
  return {
    path: path,
    imageUrl: sharePictures
  };
});
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures;
  }
}
function handleNameInput(val) {
  state.name = val.detail.value;
}
function handlePhoneInput(val) {
  state.mobile = val.detail.value;
}
function handleSexChange(val) {
  console.log(val);
  state.sex = state.sexArray[val.detail.value];
  state.sexIndex = val.detail.value;
}
function handleBirthdayChange(val) {
  state.date = val.detail.value;
}
function apply() {
  const self = this;
  if (hasApply) {
    console.log("已经在提交了");
    return;
  }
  hasApply = true;
  if (!state.isMember) {
    hasApply = false;
    NAVPAGE.toAuthorize();
    return;
  }
  if (!state.name) {
    hasApply = false;
    uni.showToast({
      title: "请填写您的真实姓名",
      icon: 'none',
      duration: 2000
    });
  } else if (!checkMobile()) {
    hasApply = false;
    // 手机号错误
  } else {
    let gender = "UNKNOWN"; // 默认未知
    if (state.sex !== "") {
      if (state.sexIndex === 0 || state.sexIndex === "0") {
        gender = "MALE";
      } else if (state.sexIndex === 1 || state.sexIndex === "1") {
        gender = "FEMALE";
      } else {
        gender = "UNKNOWN";
      }
    }
    const postData = {
      // birthday: self.data.date + " 00:00:00",
      mobile: state.mobile,
      name: state.name,
      gender: gender
    };
    distributionService.apply(postData).then(res => {
      hasApply = false;
      uni.showToast({
        title: '您的申请已提交，请耐心等待工作人员审核~',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        uni.navigateBack({
          delta: 1
        });
      }, 2000);
    }).catch(err => {
      hasApply = false;
      uni.showToast({
        title: err.message,
        icon: "none",
        duration: 2000
      });
    });
  }
}
function checkMobile() {
  const reg = /^[1]([3-9])[0-9]{9}$/;
  if (!state.mobile) {
    uni.showToast({
      title: "请填写您的手机号码",
      icon: 'none',
      duration: 2000
    });
    return false;
  } else if (!reg.test(state.mobile)) {
    uni.showToast({
      title: "请填写正确的手机号码",
      icon: 'none',
      duration: 2000
    });
    return false;
  } else {
    return true;
  }
}
function handleUserLogin() {
  console.log(app.globalData.userInfo);
  const self = this;
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo;
    if (app.globalData.userInfo.member) {
      getRechargeList();
      getBalance();
    } else {
      NAVPAGE.toAuthorize();
    }
  }
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    if (app.globalData.userInfo.member) {
      state.isMember = true;
    }
  } else {
    state.hasUserInfo = false;
    state.isMember = false;
    state.member = null;
    state.userInfo = null;
  }
}
function getUserInfo(e) {
  AUTHORIZE.login(e).then(res => {
    state.hasUserInfo = true;
    if (res.member) {
      // 是会员提交申请信息
      state.isMember = true;
      apply();
    } else {
      NAVPAGE.toAuthorize();
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toHome() {
  NAVPAGE.toHome();
}
</script>
<style scoped>
/* pages/mallModule/distribution/apply/apply.wxss */

page {
  position: relative;
  overflow-y: hidden;
}

.page-bg {
  width: 750rpx;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}

.apply-title {
  color: #ff0080;
  text-align: center;
  font-size: 36rpx;
  padding-top: 195rpx;
}

.apply-title>view:first-of-type {
  font-size: 80rpx;
  font-weight: bold;
  line-height: 100rpx;
}

.apply-title>view:last-of-type {
  line-height: 56rpx;
}

.apply {
  width: 590rpx;
  margin: 62rpx auto 0 auto;
}

.section {
  width: 588rpx;
  height: 82rpx;
  border: 1px solid #e5e3df;
  font-size: 28rpx;
  line-height: 82rpx;
  color: #bfbfbf;
  margin-bottom: 39rpx;
}

.placeholder-class {
  color: #bfbfbf;
}

.section .picker {}

.section input,
.section .picker {
  width: 100%;
  height: 100%;
  padding: 0 28rpx;
}

.apply-btn {
  width: 592rpx;
  height: 88rpx;
  background: #ff0080;
  box-shadow: 0px 5rpx 10rpx 0rpx rgba(255, 0, 128, 0.5);
  border-radius: 44rpx;
  font-size: 36rpx;
  font-family: SourceHanSansCN-Bold;
  font-weight: bold;
  line-height: 88rpx;
  color: #fff;
  margin-top: 84rpx;
}

movable-area {
  height: 100vh;
  width: 100%;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
}

movable-view {
  width: 120rpx;
  height: 120rpx;
}
</style>