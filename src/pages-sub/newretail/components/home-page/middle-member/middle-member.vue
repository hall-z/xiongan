<template>
<!--components/home-page/middle-member/middle-member.wxml-->
<view>
<view class="member-box-loading" :hidden="loaded">
  <view></view>
</view>
<view :class="'memmber-box ' + (banners.length > 0 ? '' : 'member-before')" :hidden="!loaded">
  <view class="info-box">
    <view class="user-info">
      <view class="user-info-content">
        <button v-if="!hasUserInfo" @click="getUserInfo"></button>
        <image lazy-load="" v-else class="avatarUrl" :src="userInfo.member ? userInfo.member.avatar : userInfo.avatarUrl"></image>
        <view class="name-mobile">
          <text v-if="!hasUserInfo" class="nike-name no-userInfo">点击头像授权登录</text>
          <text v-else class="nike-name ">{{member.nickName ? member.nickName : userInfo.nickName}}</text>
          <text>{{filtMobile(member.mobile)}}</text>
        </view>
      </view>
      <view class="recharge-pay">
        <button v-if="!hasUserInfo" class="authorization" @click="getUserInfo"></button>
        <view class="item" @click="memberFunctionEntryJump" v-for="(item , index) in memberInfoFunctionEntry" :data-route="item.route" :key="entry">
          <image lazy-load="" :hidden="item.modelUrl" :src="item.modelUrl"></image>
          <text>{{item.text}}</text>
        </view>
      </view>
    </view>
    <view class="member-card">
      <view v-if="isMember">
        <canvas canvas-id="indexQrcode" :style="qrcodeLeft" @click="toMemberCard">
        <image lazy-load="" v-if="qrcodeImageUrl" :src="qrcodeImageUrl" @click="toMemberCard"></image>
        <image lazy-load="" v-else class="bg-img" :src="imagesPath.iconQrcode"></image>
      </canvas></view>
      <view v-else>
        <image lazy-load="" class="bg-img" :src="imagesPath.iconQrcode"></image>
        <button v-if="!hasUserInfo" class="bind-phone" :style="'color: ' + themeColor" @click="getUserInfo">点击获取会员码</button>
        <button v-if="hasUserInfo && !isMember" class="bind-phone" :style="'color: ' + themeColor" @click="toAuthorize">点击获取会员码</button>
        <!-- <view class="bind-phone" bindtap="handlePopupPhone">点击获取会员码</view> -->
      </view>
    </view>
  </view>
</view></view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _homePageCommonBehaviorJs from "../homePageCommonBehavior";
import _lazyLoadPageLazyLoadBaseJs from "../../lazy-load-page/lazy-load-base";
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
// import { ready } from "@dcloudio/uni-app";
import { reactive , watch} from "vue";
const app = getApp();
// components/home-page/middle-member/middle-member.js
const IMGAGESPATH = _utilsImagesPathJs;
const THEME = _utilsThemeManagerJs;
const NAVPAGE = _utilsNavPageJs;
const AUTHORIZE = _utilsAuthorizeJs;
const wxbarcode = _utilsSelfJs;
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs;
const homePageCommonBehavior = _homePageCommonBehaviorJs;
const utils = _utilsUtilsJs;
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //  处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')';
  } else {
    return sColor;
  }
};
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  theme: THEME,
  themeColor: THEME.color,
  loaded: false,
  qrcodeImageUrl: "",
  qrcodeLeft: "",
  userInfo: {},
  member: {},
  memberEntrance: {},
  hasUserInfo: false,
  isMember: false,
  memberCode: "",
  payCode: ""
});
const props = defineProps({
  banners: Array,
  memberInfoFunctionEntry: Array,
  show: {
    // 属性名
    type: String,
    value: Boolean
  },
  pageScrollData: {
    // 属性名
    type: Object,
    value: {}
  },
  refreshType: {
    // 属性名
    type: String,
    value: ""
  }
});
function attached() {
  state.theme = {
    color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + app.globalData.uiconfig.themeColor + ';' : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background: ' + app.globalData.uiconfig.themeColor + ';' : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';' : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" ? 'background: linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' : "background: linear-gradient(-270deg, #FF9F43, #F13327);",
    mainColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : "border-color:rgba(255,159,67, 0.4);",
    mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) : 'rgba(255,159,67, 0.2)',
    BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' : "background-color:rgba(255,159,67, 0.1);"
  };
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
}
function moved() {}
function detached() {}
ready(function () {
  checkUserInfo();
  reload();
});
function reload() {
  const that = this;
  if (!state.loaded) {
    lazyLoadBase.determineComponentInVisibleArea(".member-box-loading", that).then(res => {
      if (res) {
        state.loaded = true;
      }
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }
}
function setCanvas(code) {
  const that = this;
  wxbarcode.qrcode('indexQrcode', code, 210, 210, that);
  console.log("pixelRatio:", app.globalData.systemInfo.pixelRatio);
  const pixelRatio = app.globalData.systemInfo ? app.globalData.systemInfo.pixelRatio : 2;
  setTimeout(() => {
    uni.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 210,
      height: 210,
      destWidth: 210 * pixelRatio,
      destHeight: 210 * pixelRatio,
      canvasId: 'indexQrcode',
      success(res) {
        console.log(res.tempFilePath);
        state.qrcodeImageUrl = res.tempFilePath;
      },
      fail(err) {
        console.log(err);
      }
    }, that);
  }, 1000);
}
function toAuthorize() {
  NAVPAGE.toAuthorize();
}
function toMemberCard(e) {
  if (state.hasUserInfo && state.isMember) {
    //如果首页开启付款码，则不到会员码页面，点击直接跳转付款码页面
    if (state.uiconfig.isHomePayCodeEnabled) {
      NAVPAGE.toPayCode();
    } else {
      NAVPAGE.toMemberCard();
    }
  } else {
    NAVPAGE.toAuthorize();
  }
}
function onGetUserInfo(e) {
  getUserInfo(e.detail);
}
function memberFunctionEntryJump(val) {
  uni.navigateTo({
    url: val.currentTarget.dataset.route
  });
}
function checkUserInfo() {
  console.log("checkUserInfo=============================================");
  console.log(app.globalData.userInfo);
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    state.userInfo = {
      ...app.globalData.userInfo,
      ...app.globalData.userInfo.wxaUser
    };
    if (app.globalData.userInfo.member) {
      const res = app.globalData.userInfo;
      let isExpired = false;
      let isVIP = false;
      const now = new utils.ResponseDate().getTime();
      let vipEndTimeStamp = now + 1000;
      let vipEndTime = "";
      if (res.member.vipEndTime) {
        vipEndTimeStamp = new Date(res.member.vipEndTime.replace(/-/g, '/')).getTime();
        vipEndTime = res.member.vipEndTime.split(" ")[0].replace(/-/g, '.');
      }
      if (now > vipEndTimeStamp) {
        isExpired = true;
      }
      if (res.member.vipEndTime && now < vipEndTimeStamp) {
        isVIP = true;
        app.globalData.userInfo.member.vip = true;
      }
      state.isMember = true;
      state.member = res.member;
      state.isVIP = isVIP;
      state.isExpired = isExpired;
      state.vipEndTime = vipEndTime;
      getMemberUserInfo();
    }
  } else {
    state.hasUserInfo = false;
    state.isMember = false;
    state.member = null;
    state.userInfo = null;
  }
}
function getMemberUserInfo() {
  const that = this;
  const user = app.globalData.userInfo;
  console.log('当前用户信息----------------');
  console.log(user);
  if (user) {
    state.userInfo = {
      ...state.userInfo,
      ...user.wxaUser
    };
    if (user.member) {
      state.hasUserInfo = true;
      state.isMember = true;
      state.member = {
        ...state.member,
        ...user.member
      };
      getMbrCode();
    }
  }
}

// Watch listeners converted from observers
watch(() => props.show, (newVal, oldVal) => {
  // 属性值变化时执行
        reload(true);
});

watch(() => props.value, (newVal, oldVal) => {
  // 属性值变化时执行
        reload();
});

watch(() => props.refreshType, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal !== "" && newVal !== "USER") {
          reload(true);
        } else if (newVal === "USER") {
          // 刷新会员数据
          checkUserInfo();
        }
});

</script>
<style scoped>
/* components/home-page/middle-member/middle-member.wxss */
/* loading */
.member-box-loading {
  position: relative;
  padding-top: 41rpx;
  width: 100%;
  padding-bottom: 10rpx;
  overflow: hidden;
}
.member-box-loading>view {
  width: 670rpx;
  height: 254rpx;
  background: #EFEFEF;
  border-radius: 6px;
  margin: 0 43rpx 0 37rpx;
}
/* 会员信息 */
.memmber-box {
  position: relative;
  padding-top: 41rpx;
  width: 100%;
  padding-bottom: 30rpx;
  overflow: hidden;
  background-color: #fff;
  border-radius: 0 0 20rpx 20rpx;
}
.member-before::before {
  content: '';
  width: 130%;
  height: 238rpx;
  position: absolute;
  background: #ffa300;
  top: 0;
  margin-left: -15%;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  z-index: 0;
}
.info-box {
  width: 670rpx;
  height: 254rpx;
  background: #fff;
  border-radius: 6px;
  margin: 0 43rpx 0 37rpx;
  position: relative;
  box-shadow: 1px 2px 5px 0px #dedede;
  display: flex;
  justify-content: space-between;
}
.info-box .avatarUrl {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  float: left;
  margin: 0 33rpx 0 30rpx;
}
.user-info {
  width: 405rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.user-info .user-info-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 158rpx;
  width: 100%;
}
.user-info .user-info-content button {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  float: left;
  margin: 0 33rpx 0 30rpx;
}
.user-info .user-info-content button::after {
  border: none;
}
.user-info view .name-mobile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-size: 30rpx;
  color: #333;
  line-height: 48rpx;
  width: calc(100% - 153rpx);
}
.nike-name {
  font-size: 36rpx;
  color: #000;
  margin-bottom: 4rpx;
  max-width: 360rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.no-userInfo {
  font-size: 30rpx;
}
.recharge-pay {
  width: 100%;
  border-top: 1rpx solid #ebeff7;
  height: 95rpx;
  display: flex;
  align-items: center;
  position: relative;
}
.recharge-pay .item {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #0a0a0a;
}
.recharge-pay .item:first-of-type:after {
  content: '';
  position: absolute;
  height: 40rpx;
  width: 1px;
  background: #ebeff7;
  right: 0;
  top: 50%;
  margin-top: -20rpx;
}
.recharge-pay image {
  width: 50rpx;
  height: 50rpx;
  margin-right: 6rpx;
}
.member-card {
  width: 264rpx;
  padding-left: 10rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1rpx solid #ebeff7;
  position: relative;
  /* z-index: 1; */
}
.member-card canvas {
  width: 210rpx;
  height: 210rpx;
  position: absolute;
  left: -9999rpx;
}
.member-card image {
  width: 210rpx;
  height: 210rpx;
}
.member-card .bg-img,
.top-member-card .bg-img {
  filter: blur(2px);
}
.bind-phone {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(250, 250, 250, 0.4);
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #009f55;
  font-weight: bold;
}
</style>