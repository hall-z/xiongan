<template>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="container" v-if="!state.loading">
  <image class="guide-task-bg" :src="state.themeManager.BASE_URL + '/guideTaskPageBg.png'"></image>
  <image class="guide-task-title-bg" :src="state.themeManager.BASE_URL + '/guideTaskPageTitleBg.png'"></image>
  <view class="guide-task-title">
    <image :src="state.themeManager.BASE_URL + '/guideTaskPageTitle.png'"></image>
    <text>任务中心</text>
  </view>
  <view class="guide-task-box">
    <view class="guide-task-item">
      <image mode="widthFix" :src="state.themeManager.BASE_URL + '/iconGuideTaskConsume.png'"></image>
      <view class="task-desc">
        <text>累计消费满{{state.task.orderTotal}}元</text>
        <text>当前已消费：{{state.orderTotal}}元</text>
      </view>
      <view :class="'complete-btn ' + (state.orderTotal >= state.task.orderTotal ? 'isComputed-task' : '')" @click="toComputedOrder">
        {{state.orderTotal >= state.task.orderTotal ? '已完成' : '去完成'}}
      </view>
    </view>
    <view class="guide-task-item">
      <image mode="widthFix" :src="state.themeManager.BASE_URL + '/iconGuideTaskInvate.png'"></image>
      <view class="task-desc">
        <text>邀请{{state.task.invitationCount}}名新用户注册并下单</text>
        <text>还需邀请{{state.invitationCount >= state.task.invitationCount ? 0 : state.task.invitationCount - state.invitationCount}}人</text>
      </view>
      <view :class="'complete-btn ' + (state.invitationCount >= state.task.invitationCount ? 'isComputed-task' : '')" @click="toComputedInvited">
        {{state.invitationCount >= state.task.invitationCount ? '已完成' : '去完成'}}
      </view>
    </view>
    <view class="guide-task-item">
      <image mode="widthFix" :src="state.themeManager.BASE_URL + '/iconGuideTaskApplyInfo.png'"></image>
      <view class="task-desc">
        <text>申请信息填写</text>
      </view>
      <view :class="'complete-btn ' + (state.apply !== null ? 'isComputed-task' : '')" @click="toApplyInfo">
        {{state.apply !== null ? '已完成' : '去完成'}}
      </view>
    </view>
    <view :class="'apply-to-guide ' + ((state.orderTotal >= state.task.orderTotal || state.invitationCount >= state.task.invitationCount) && state.apply !== null ? 'isComputed-all-task' : '')" @click="applyToGuide">
      申请成为带货达人
    </view>
  </view>
  <view class="to-guide-tips">
    累计消费满{{state.task.orderTotal}}元或者邀请{{state.task.invitationCount}}名新用户注册并下单，任意满足其中一条，就可申请成为带货达人！                     
  </view>
</view>
<view class="content-box" v-if="state.loading">
  <view class="spinner">
    <view class="rect1" :style="state.theme.mainBgColor"></view>
    <view class="rect2" :style="state.theme.mainBgColor"></view>
    <view class="rect3" :style="state.theme.mainBgColor"></view>
    <view class="rect4" :style="state.theme.mainBgColor"></view>
    <view class="rect5" :style="state.theme.mainBgColor"></view>
  </view>
</view>
<popup :show="state.show.middle" position="middle" custom-class="middle">
  <view class="popup-content">
    <view class="popup-content-box">
      <image :src="state.themeManager.BASE_URL + '/applyGuideSuccess.png'"></image>
      <view style="line-height: 53rpx; font-size: 50rpx; color: #333;">带货达人申请成功</view>
      <view class="result">快去开启您的赚钱之旅！</view>
      <view class="btn" @click="toMemberCenter">现在开启</view>
    </view>
  </view>
</popup>

</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiBackCashServiceJs from "@/service/api/newretail/backCashService";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
// import { onLoad, onShow } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const backCashService = _apiBackCashServiceJs;
const optionsService = _apiSystemServiceJs;
const themeManager = _utilsThemeManagerJs;
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
let canApplyToGuide = true;
const state = reactive({
  navigationBarTitle: "带货任务",
  imagesPath: IMGAGESPATH,
  member: {},
  task: {
    invitationCount: 2,
    orderTotal: 50
  },
  invitationCount: 0,
  // 邀请人数
  orderTotal: 0,
  // 消费
  apply: null,
  show: {
    middle: false
  },
  loading: true,
  theme: themeManager,
  themeManager: themeManager
});
onLoad(function (options) {
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member;
    }
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
  state.themeColor = app.globalData.uiconfig.themeColor;
});
onShow(function () {
  queryInvateConf();
  queryOrderAmountConf();
  getTask();
});
function queryInvateConf() {
  optionsService.query('memberBackCashInvitationCount').then(res => {
    if (res && res[0]) {
      state.task.invitationCount = res[0].value;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function queryOrderAmountConf() {
  optionsService.query('memberBackCashOrderAmount').then(res => {
    if (res && res[0]) {
      state.task.orderTotal = res[0].value;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getTask() {
  backCashService.getTask(state.member.id).then(res => {
    state.loading = false;
    state.invitationCount = res.invitationCount;
    state.orderTotal = res.orderTotal;
    state.apply = res.apply ? res.apply : null;
  }).catch(err => {
    state.loading = false;
    console.log("查询导购任务出错：" + err.message);
  });
}
function toComputedOrder() {
  if (state.orderTotal < state.task.orderTotal) {
    NAVPAGE.toHome();
  }
}
function toComputedInvited() {
  if (state.invitationCount < state.task.invitationCount) {
    NAVPAGE.toInvite();
  }
}
function toApplyInfo() {
  if (!state.apply) {
    NAVPAGE.toGuideApplyInfo();
  }
}
function applyToGuide() {
  console.log(canApplyToGuide);
  if (!canApplyToGuide) {
    return false;
  }
  canApplyToGuide = false;
  if ((state.orderTotal >= state.task.orderTotal || state.invitationCount >= state.task.invitationCount) && state.apply !== null) {
    backCashService.submit(state.member.id).then(res => {
      console.log('申请成为导购：', res);
      toggle('middle');
      canApplyToGuide = true;
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
      canApplyToGuide = true;
    });
  } else {
    uni.showToast({
      title: '请先完成任务',
      icon: 'none',
      duration: 2000
    });
  }
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function toggleMiddlePopup() {
  toggle('middle');
}
function toMemberCenter() {
  toggle('middle');
  NAVPAGE.toMy();
}
</script>
<style scoped>
.container {
  width: 100vw;
}

.container .guide-task-bg {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  z-index: -99;
}

.container .guide-task-title-bg {
  width: 666rpx;
  height: 208rpx;
  position: absolute;
  left: 50%;
  margin-left: -333rpx;
  top: 300rpx;
  z-index: 1;
}

.container .guide-task-title {
  width: 380rpx;
  height: 90rpx;
  position: absolute;
  left: 50%;
  margin-left: -190rpx;
  top: 377rpx;
  z-index: 2;
}

.container .guide-task-title image {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
}

.container .guide-task-title text {
  position: absolute;
  left: 0;
  display: inline-block;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 80rpx;
  font-size: 38rpx;
  color: #fff;
}

.container .guide-task-box {
  width: 556rpx;
  height: 643rpx;
  background: #fff;
  position: absolute;
  left: 50%;
  margin-left: -318rpx;
  top: 387rpx;
  border-radius: 10rpx;
  padding: 140rpx 40rpx 20rpx 40rpx;
}

.container .guide-task-item {
  width: 100%;
  height: 106rpx;
  padding: 34rpx 0;
  display: flex;
  justify-content: space-between;
  border-top: 1rpx solid #dcdcdc;
  align-items: center;
}

.container .guide-task-item image {
  width: 106rpx;
  height: 106rpx;
}

.container .guide-task-item .task-desc {
  width: 232rpx;
  display: flex;
  flex-direction: column;
  margin-left: 46rpx;
  text-align: left;
}

.container .guide-task-item .task-desc text:last-of-type {
  font-size: 20rpx;
  color: #666;
  margin-top: 10rpx;
}

.container .guide-task-item .task-desc text:first-of-type {
  font-size: 26rpx;
  color: #333;
}

.container .guide-task-item .complete-btn {
  width: 123rpx;
  height: 51rpx;
  border: 1rpx solid #FFA146;
  border-radius: 50rpx;
  text-align: center;
  line-height: 51rpx;
  font-size: 24rpx;
  color: #FFA146;
}

.container .guide-task-box .apply-to-guide {
  width: 100%;
  height: 87rpx;
  border-radius: 44rpx;
  color: #fff;
  font-size: 28rpx;
  text-align: center;
  line-height: 87rpx;
  background: #cdcdcd;
}

.isComputed-task {
  background: #FFA146;
  color: #fff !important;
}

.isComputed-all-task {
  background: linear-gradient(90deg,rgba(236,124,72,1),rgba(232,80,133,1)) !important;
}

.to-guide-tips {
  width: 636rpx;
  color: #fff;
  font-size: 24rpx;
  position: absolute;
  left: 50%;
  bottom: 48rpx;
  margin-left: -318rpx;
  text-align: left;
}

.popup-content {
  width: 557rpx;
  height: 760rpx;
  background: #fff;
  border-radius: 20rpx;
  position: relative;
}


.popup-content-box {
  font-size: 34rpx;
  line-height: 50rpx;
  color: #444;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 80rpx;
}

.popup-content-box image {
  width: 557rpx;
  height: 457rpx;
}

.popup-content-box .result {
  font-size: 30rpx;
  color: #666;
  margin: 30rpx auto;
}

.popup-content-box .btn {
  width: 506rpx;
  height: 90rpx;
  background: rgba(255, 161, 70, 1);
  border-radius: 45px;
  line-height: 90rpx;
  text-align: center;
  color: #fff;
  font-size: 34rpx;
}

.content-box {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 240rpx;
  height: 100rpx;
  text-align: center;
  font-size: 10rpx;
}

.spinner>view {
  height: 100%;
  width: 8rpx;
  margin: 0 3rpx;
  display: inline-block;
  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {

  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }

  20% {
    -webkit-transform: scaleY(1.0);
  }
}

@keyframes stretchdelay {

  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
</style>