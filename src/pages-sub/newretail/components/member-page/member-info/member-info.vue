<template>
<!--components/member-page/member-info/member-info.wxml-->
<view class="top-info" :style="'border-radius: ' + (configData.fillet || 0) + 'px;height: ' + (configData.backGroundType == 'backgroundImage' && configData.backGroundImgObj ? configData.backGroundImgObj.imageHeight + 'rpx' : '300rpx') + ';background-color: ' + (configData.backGroundType == 'backgroundColor' ? configData.backGroundColor : '') + ';width: calc(100% - ' + configData.pageMargin * 2 + 'px);margin: ' + (configData.moduleSpacing || 0) + 'px ' + (configData.pageMargin || 0) + 'px'">
  <image :style="'border-radius: ' + (configData.fillet || 0) + 'px;'" v-if="configData.backGroundType == 'backgroundImage' && configData.backGroundImgObj" class="bg" mode="widthFix" :src="configData.backGroundImgObj ? configData.backGroundImgObj.imageUrl : ''"></image>
  <view class="user-info">
      <button class="user-portrait-button" v-if="!hasUserInfo" @click="getUserInfo"></button>
      <image v-else class="user-portrait" :src="member.avatar1 || member.avatar" @click="toMemberInfo"></image>
      <view class="user-grade" @click="toVipPrivilege">
          <view :class="'nickName-box ' + (hasUserInfo ? '' : 'no-userInfo')">
              <view class="nickName" v-if="isMemberLogin">{{member.nickName}}</view>
              <view class="nickName" v-else>{{hasUserInfo ? userInfo.nickName : "点击头像授权登录"}}</view>
              <view v-if="isVIP" class="member-nameplate">
                  <image class="flower" :src="imagesPath.iconVIPFlower"></image>
                  {{systemOptions.vipGradeConfig.name}}
              </view>
              <view class="user-sync-box" v-if="isMemberLogin">
                  <button class="user-sync-button" open-type="chooseAvatar" @chooseavatar="refreshAvatarA">
                      <image class="user-sync-image" :src="imagesPath.iconUserRefresh" mode="widthFix"></image>
                      <text class="user-sync-text">同步头像与昵称</text>
                  </button>
              </view>
          </view>
          <view class="interests_box">
            <view class="vip-nameplate" v-if="member.gradeName">
              <image v-if="memberGrade && memberGrade.gradeLablePicture" class="vip-nameplate-img" :src="memberGrade.gradeLablePicture"></image>
              <text>{{member.gradeName ? member.gradeName : ''}}</text>
            </view>
            <view class="interests" @click="toBenefits" v-if="configData.isInterests">会员权益 ></view>
          </view>
      </view>
      <view class="sign-box">
          <form @submit="toMemberCard">
              <view class="MbrQrcodeBox">
                  <image :src="imagesPath.iconNewMyCard" class="member-card"></image>
                  <button v-if="!hasUserInfo" class="MbrQrcodeBoxBtn" @click="getUserInfo"></button>
                  <button v-else class="MbrQrcodeBoxBtn" form-type="submit"></button>
              </view>
          </form>
          <view class="sign" @click="goToSign" v-if="configData.isShowSignIn">
            <text>签到 ></text>
          </view>
        </view>
  </view>
  <view class="my-info">
      <view v-for="(item , index) in configData.assetSetting" :key="index">
          <view class="my-info-item balance" @click="toRecharge" v-if="item === 'BALANCE'">
              <view class="num">{{hasUserInfo ? reserveBalance : "***"}}</view>
              <view class="name">储值余额</view>
          </view>
          <view class="my-info-item score" @click="toScore" v-if="item === 'SCORE'">
              <view class="num">{{hasUserInfo ? memberScoreBalance : "***"}}</view>
              <view class="name">我的积分</view>
          </view>
          <view class="my-info-item coupon" @click="toCoupon" v-if="item === 'COUPON'">
              <view class="num">{{hasUserInfo ? member.couponNum : "*"}}</view>
              <view class="name">优惠券</view>
          </view>
          <view class="my-info-item giftCard" @click="toMyGiftCard" v-if="item === 'GIFT_CARD'">
              <view class="num">{{hasUserInfo ? giftcardNum : "***"}}</view>
              <view class="name">礼品卡</view>
          </view>
      </view>
      <button v-if="!hasUserInfo" class="authorization" @click="getUserInfo"></button>
  </view>
</view>
</template>
<script setup>
import _apiRequestJs from "@/service/api/newretail/request";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
import _apiGiftCardServiceJs from "@/service/api/newretail/giftCardService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import { reactive , watch} from "vue";
// components/member-page/member-info/member-info.js
const wxaUserService = _apiWxaUserServiceJs;
const auth = _utilsAuthJs;
const utils = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const memberService = _apiMemberServiceJs;
const giftCardService = _apiGiftCardServiceJs;
const couponService = _apiCouponServiceJs;
const request = _apiRequestJs;
const state = reactive({
  clickFlag: true,
  themeColor: '',
  hasUserInfo: false,
  isMember: false,
  member: {
    couponNum: 0
  },
  userInfo: {},
  isVIP: false,
  imagesPath: IMGAGESPATH,
  systemOptions: {},
  memberGrade: null,
  reserveBalance: 0,
  memberScoreBalance: '0',
  giftcardNum: 0
});
const props = defineProps({
  isMemberLogin: {
    // 是否会员
    type: Boolean,
    value: false
  },
  configData: {
    // 配置项数据
    type: Object,
    value: {}
  },
  hasUserInfo: {
    type: Boolean,
    value: false
  },
  memberNew: {
    // 配置项数据
    type: Object,
    value: {}
  }
});
function attached() {
  // 组件初始化时获取全局用户信息
  checkUserInfo();
}
function onShow() {
  // 每次页面显示时检查用户信息
  checkUserInfo();
}
function toBenefits() {
  NAVPAGE.toBenefits();
}
function checkUserInfo() {
  const app = getApp();
  if (app.globalData.userInfo) {
    updateUserInfo(app.globalData.userInfo);
  }
}
function updateUserInfo(userInfo) {
  if (!userInfo) return;
  const app = getApp();
  let isVIP = false;
  const now = new utils.ResponseDate().getTime();
  let vipEndTimeStamp = now + 1000;
  if (userInfo.member && userInfo.member.vipEndTime) {
    vipEndTimeStamp = new Date(userInfo.member.vipEndTime.replace(/-/g, '/')).getTime();
    if (now < vipEndTimeStamp) {
      isVIP = true;
      app.globalData.userInfo.member.vip = true;
    }
  }
  state.memberGrade = app && app.globalData ? app.globalData.memberGrade : null;
  state.hasUserInfo = userInfo.member ? true : false;
  state.isMember = !!userInfo.member;
  state.member = userInfo.member ? {
    ...state.member,
    ...userInfo.member,
    nickName: userInfo.member.nickName || userInfo.wxaUser.nickName
  } : {
    couponNum: 0
  };
  state.userInfo = userInfo.wxaUser;
  state.isVIP = isVIP;
  if (userInfo.member) {
    // 同步资产数据
    queryBalance();
    queryScore();
    queryGiftCard();
    queryCoupon();
  }
}
function getUserInfo(e) {
  triggerEvent('getUserInfo');
  // const that = this
  // wxaUserService.login(true).then(res => {
  //   auth.setUser(res)
  //   getApp().globalData.userInfo = res
  //   this.updateUserInfo(res)
  //   // if (!res.member) {
  //   //   NAVPAGE.toAuthorize()
  //   // }
  // }).catch(err => {
  //   that.setData({
  //     isMember: false,
  //     hasUserInfo: false
  //   })
  //   wx.showToast({
  //     title: '登陆失败，请点击头像重新登录~',
  //     icon: 'none',
  //     duration: 2000
  //   })
  // })
}
function queryBalance() {
  memberService.getMbrBalance().then(res => {
    state.reserveBalance = res ? res.toFixed(2) : '0.00';
  });
}
function queryScore() {
  if (!state.member || !state.member.mobile) return;
  memberService.getBalance(state.member.mobile).then(res => {
    state.memberScoreBalance = res || '0';
  });
}
function queryGiftCard() {
  if (!state.member || !state.member.id) return;
  giftCardService.queryMyGiftCard(state.member.id, "ACTIVED").then(res => {
    state.giftcardNum = res ? res.length : 0;
  });
}
function queryCoupon() {
  couponService.getMbrUnUseCouponCount().then(res => {
    let tempMember = state.member;
    tempMember = {
      ...tempMember,
      couponNum: res
    };
    state.member = tempMember;
  });
}
function toMemberInfo() {
  if (!state.clickFlag) return;
  state.clickFlag = false;
  if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
    NAVPAGE.toMemberInfo();
    state.clickFlag = true;
  } else {
    state.clickFlag = true;
    uni.showToast({
      title: '您还不是会员，请绑定手机号成为会员',
      icon: 'none',
      duration: 2000
    });
  }
}
function toVipPrivilege() {
  if (state.hasUserInfo && state.isMember) {
    if (state.isVIP) {
      NAVPAGE.toVIPMember();
    }
  } else {
    getUserInfo();
  }
}
function refreshAvatarA(e) {
  let that = this;
  let {
    avatarUrl
  } = e.detail;
  let userInfo = {
    avatarUrl
  };
  uni.uploadFile({
    url: request.BASE_URL + '/newretail/api/dfs/upload',
    filePath: avatarUrl,
    name: 'file',
    formData: {
      'user': 'test'
    },
    header: {
      'wxa-appid': request.APP_ID
    },
    success(res) {
      if (res && res.data != null && res.statusCode >= 200 && res.statusCode <= 300) {
        userInfo.avatarUrl = JSON.parse(res.data).data.url;
        wxaUserService.refreshAvatar(userInfo).then(res => {
          return wxaUserService.login();
        }).then(res => {
          auth.setUser(res);
          getApp().globalData.userInfo = res;
          if (res && res.member) {
            // 同步资产数据
            state.member = {
              ...state.member,
              ...res.member,
              nickName: res.member.nickName ? res.member.nickName : res.wxaUser.nickName
            };
            state.isMember = true;
            state.userInfo = {
              ...userInfo
            };
            state.hasUserInfo = true;
            queryBalance();
            queryScore();
            queryGiftCard();
            queryCoupon();
          } else {
            state.isMember = false;
          }
          utils.showToast('同步成功！');
        }).catch(err => {
          state.isMember = false;
          utils.showToast(err.message);
        });
      }
    },
    fail(e) {
      state.isMember = false;
      console.log(e);
    }
  });
}
function toRecharge() {
  NAVPAGE.toRecharge();
}
function toScore() {
  if (state.hasUserInfo) {
    NAVPAGE.toScoreDetails();
  }
}
function toCoupon() {
  if (state.hasUserInfo) {
    NAVPAGE.toMyCoupon();
  }
}
function toMyGiftCard() {
  if (state.hasUserInfo) {
    NAVPAGE.toBuyHistory();
  }
}
function toMemberCard() {
  if (getApp().globalData.uiconfig && getApp().globalData.uiconfig.isHomePayCodeEnabled) {
    NAVPAGE.toPayCode();
  } else {
    NAVPAGE.toMemberCard();
  }
}
function goToSign() {
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/mallModule/member/sign/index'
  });
}

// Watch listeners converted from observers
watch(() => props.value, (newVal, oldVal) => {
  if (newVal) {
          state.member = {
            ...state.member,
            ...newVal
          };
          checkUserInfo();
        }
});

</script>
<style scoped>
/* pages/my/my.wxss */
page {
  background-color: #f5f5f5;
  padding-bottom: 128rpx;
}
.page_bg_color,
.page_bg_image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.iphoneX-height {
  height: 50rpx;
  width: 100%;
}
.top-info {
  width: 100%;
  height: 300rpx;
  padding: 50rpx 30rpx 25rpx 30rpx;
  box-sizing: border-box;
  /* 这里需要改成主题色 */
  /* background: #80BD01; */
  text-align: center;
  font-size: 32rpx;
  position: relative;
  overflow: hidden;
}
.bg {
  position: absolute;
  left: 0;
  top: 0;
  /* z-index: -1; */
  width: 100%;
}
.top-bg {
  /* background: #009f55; */
  width: 100%;
  height: 100rpx;
  position: absolute;
  top: 0;
  left: 0;
}
.vip-bg {
  width: 750rpx;
  height: 380rpx;
  position: absolute;
  top: 0;
  left: 0;
}
.user-info {
  display: flex;
  height: 100rpx;
  width: 100%;
  margin-bottom: 46rpx;
  position: relative;
}
.user-info .user-grade {
  height: 100rpx;
  margin-left: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.user-info .user-grade .nickName-box {
  display: flex;
  align-items: center;
  height: 42rpx;
  margin-bottom: 10rpx;
}
.user-info .user-grade view.nickName {
  font-size: 32rpx;
  line-height: 42rpx;
  color: #fff;
  display: block;
  max-width: 360rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
.user-info .user-grade view.no-userInfo {
  font-size: 28rpx;
  color: #8b8b8c;
  line-height: 28rpx;
}
.top-info .user-info .member-nameplate {
  min-width: 65rpx;
  height: 30rpx;
  padding: 0 10rpx;
  background: linear-gradient(-60deg, #4e4f54, #3f3d3d);
  border-radius: 6rpx;
  font-size: 24rpx;
  color: #ffeba5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  margin-left: 13rpx;
}
.top-info .user-info .member-nameplate .flower {
  width: 21rpx;
  height: 23rpx;
  margin-right: 7rpx;
}
.top-info .user-info .vip-nameplate {
  min-width: 91rpx;
  height: 40rpx;
  padding: 0 21rpx 0 21rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20rpx;
  font-size: 20rpx;
  color: #3f3d3d;
  text-align: center;
  line-height: 40rpx;
  color: #666666;
  position: relative;
  overflow: hidden;
}
.vip-nameplate image.vip-nameplate-img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}
.vip-nameplate text {
  position: relative;
}
.top-info button.user-portrait-button {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin: 0 0 0 0;
  margin-bottom: 15rpx;
  overflow: hidden;
  z-index: 10;
  background: #ff8561;
}
.top-info image.user-portrait {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  /* border: 15rpx solid #80cdc1; */
  margin-bottom: 15rpx;
  overflow: hidden;
  z-index: 10;
}
.top-info .MbrQrcodeBox {
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  /* right: 40rpx; */
  /* top: 3%; */
  right: 20rpx;
  /* padding: 20rpx; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.MbrQrcodeBox button {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  left: 0;
  top: 0;
}
.MbrQrcodeBox button::after {
  border: none;
}
.top-info .sign-box {
   position: position;
   right: 30rpx;
}
.top-info .sign{
    position: absolute;
    right:0;
    top: 20rpx;
    width:135rpx;
    height:50rpx;
    line-height: 50rpx;
    background:linear-gradient(180deg,rgba(198,141,40,1) 0%,rgba(167,113,17,1) 100%);
    border-radius:27rpx;
    font-size: 26rpx;
    color: #FFEACC;
    text-align: center;
    margin-top: 60rpx;
}
.top-info .member-card {
  width: 50rpx;
  height: 50rpx;
  border-radius: 0;
  border: 0;
  margin-bottom: 0;
}
.top-info text {
  position: relative;
  z-index: 10;
  color: #fff;
  margin-bottom: 32rpx;
}
.my-info {
  width: 100%;
  /* height: 160rpx; */
  /* border-radius: 10rpx; */
  /* background: #fff;
  box-shadow: 5rpx 10rpx 20rpx 10rpx rgba(241, 241, 241, 1); */
  /* bottom: 16rpx; */
  z-index: 5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
}
.my-info .my-info-item:first-of-type {
  /* margin-left: 46rpx; */
}
.my-info .my-info-item {
  width: 220rpx;
  height: 80rpx;
  /* margin-top: 47rpx; */
  /* border-left: 1rpx solid #f1f1f1; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /* padding-left: 24rpx; */
  box-sizing: border-box;
}
.my-info .my-info-item text {
  display: block;
  margin-bottom: 0;
}
.my-info-item .num {
  color: #fff;
  font-size: 32rpx;
  line-height: 36rpx;
  height: 36rpx;
  margin-bottom: 12rpx;
  width: 100%;
  text-align: center;
}
/* .my-info-item.balance .num {
  color: #fff;
}
.my-info-item.coupon .num {
  color: #fff;
}
.my-info-item.score .num {
  color: #fff;
} */
.my-info-item .name {
  color: #fff;
  font-size: 20rpx;
  line-height: 28rpx;
  width: 100%;
  text-align: center;
}
.my-info .my-info-item:last-of-type {
  float: right;
  font-size: 32rpx;
}
.sales-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 140rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
  border-bottom: 20rpx solid #f1f1f1;
  position: relative;
}
.sales-center>view {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.sales-center image.left-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}
.sales-center text {
  font-size: 32rpx;
  color: #1b1b1d;
  font-weight: Medium;
}
.sales-center .right-icon {
  width: 12rpx;
  height: 23rpx;
}
.memberFeatures {
  padding: 0 30rpx 22rpx 30rpx;
  position: relative;
  margin: 0 auto 40rpx;
}
.order-type-box,
.fun-list {
  width: 100%;
  background: #fff;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
}
.order-type-box {
  /* padding-top: 36rpx; */
  /* border-bottom: 20rpx solid #fff; */
  border-radius: 6rpx;
  margin-bottom: 20rpx;
}
.order-type-box .all-order {
  line-height: 100rpx;
  overflow: hidden;
  border-bottom: 1rpx solid #dedede;
  padding: 0 30rpx;
}
.order-type-box .all-order image {
  height: 35rpx;
  vertical-align: middle;
  margin-top: -6rpx;
}
.order-type-box .all-order view:first-of-type {
  float: left;
  font-size: 28rpx;
}
.order-type-box .all-order view:first-of-type image {
  width: 38rpx;
  margin-right: 20rpx;
}
.order-type-box .all-order view:last-of-type {
  float: right;
  font-size: 24rpx;
  color: #8b8b8c;
}
.order-type-box .all-order view:last-of-type image {
  width: 12rpx;
  height: 23rpx;
  vertical-align: middle;
  margin-left: 8rpx;
}
.order-type-box .order-type-list {
  height: 177rpx;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.order-type-box .order-type-list>view {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 22rpx;
  line-height: 36rpx;
  color: #4b4b4b;
  position: relative;
}
.order-type-box .order-type-list>view image {
  width: 48rpx;
  height: 48rpx;
  position: relative;
  margin-bottom: 18rpx;
}
.order-type-box .order-type-list>view .badge {
  position: absolute;
  right: -10rpx;
  top: -10rpx;
  width: 32rpx;
  height: 32rpx;
  text-align: center;
  line-height: 32rpx;
  font-size: 24rpx;
  color: #fff;
  background: #ff5601;
  border-radius: 16rpx;
}
.order-type-box .order-type-list>view:last-of-type .badge {
  right: -3rpx;
}
.order-type-box .shopping-guide-box {
  padding: 0 30rpx;
}
.order-type-box .shopping-guide-box .shopping-guide-item {
  display: flex;
  justify-content: space-between;
  line-height: 60rpx;
  text-align: center;
  padding: 20rpx 0
}
.order-type-box .shopping-guide-box .shopping-guide-item>view text:first-of-type {
  font-size: 24rpx;
  color: #999;
}
.order-type-box .shopping-guide-box .shopping-guide-item>view text:last-of-type {
  font-size: 40rpx;
  color: #000;
}
.shopping-guide-box .shopping-guide-item .item {
  display: flex;
  flex-direction: column;
}
.order-type-box .shopping-guide-box .exchange-btn button {
  background: #FF9F43;
  width: 100%;
  height: 78rpx;
  line-height: 78rpx;
  color: #fff;
  text-align: center;
  /* box-shadow: 0px 5px 8px 0px rgba(255,140,106,0.4); */
  border-radius: 10px;
  font-size: 30rpx;
}
.order-type-box .shopping-guide-box .exchange-tips {
  line-height: 75rpx;
  text-align: center;
  color: #FF9F43;
  font-size: 26rpx;
}
.fun-list {
  margin-bottom: 20rpx;
  /* padding-bottom: 32rpx; */
}
.fun-list-title {
  height: 94rpx;
  line-height: 94rpx;
  border-bottom: 1rpx solid #dedede;
  font-size: 28rpx;
  color: #232323;
  padding: 0 30rpx;
}
.fun-list-main {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 60rpx 40rpx;
  padding-bottom: 0;
  box-sizing: border-box;
}
.fun-list-main view {
  width: 25%;
  height: 102rpx;
  display: flex;
  flex-direction: column;
  color: #4b4b4b;
  font-size: 22rpx;
  align-items: center;
  margin-bottom: 60rpx;
  position: relative;
}
.fun-list-main view .customService {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  position: absolute;
  left: 0;
  top: 0;
}
.fun-list-main view button::after {
  border: none;
}
.fun-list-main view image {
  width: 62rpx;
  height: 62rpx;
  margin-bottom: 20rpx;
}
.fun-list-main view text {
  display: block;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0;
}
/* .fun-list view {
  height: 90rpx;
  line-height: 90rpx;
  border-bottom: 1rpx solid #f1f1f1;
  text-align: left;
  font-size: 32rpx;
  color: #1b1b1d;
  position: relative;
}
.fun-list view:last-of-type {
  border: none;
}
.fun-list view image.right-icon {
  float: right;
  width: 16rpx;
  height: 32rpx;
  margin-top: 26rpx;
} */
.tel {
  font-size: 28rpx;
  line-height: 90rpx;
  color: #313131;
  text-decoration: underline;
  float: right;
  margin-right: 36rpx;
}
.balance {
  font-size: 32rpx;
  line-height: 90rpx;
  color: #ff8561;
  float: right;
  /* margin-right: 36rpx; */
}
.edition-info {
  margin-top: 72rpx;
  font-size: 28rpx;
  color: #d9dbe0;
  line-height: 36rpx;
  width: 100%;
  text-align: center;
}
.popup-content {
  /* height: 264rpx; */
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
  width: 255rpx;
}
button.authorization {
  width: 100%;
  height: 100%;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
}
button.authorization::after {
  border: none;
}
.official-account {
  width: 670rpx;
  margin: 0 auto;
}
.banner-box {
  margin-bottom: 20rpx;
  border-radius: 6rpx;
}
.banner-box .banner-wrap {
  padding: 20rpx;
  background: #fff;
}
.banner-box .swiper {
  border-radius: 18rpx;
  overflow: hidden;
}
.banner-box .swiper-item image {
  width: 100%;
  height: 100%;
}
.page-content {
  background-color: #f5f5f5;
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
/* VIP会员相关 */
.vip-memmber-entrance {
  width: 692rpx;
  height: 124rpx;
  border-radius: 10rpx;
  position: relative;
  margin-bottom: 20rpx;
}
.vip-memmber-entrance image.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.vip-memmber-entrance view.block {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}
.vip-memmber-entrance image.crown {
  width: 55rpx;
  height: 47rpx;
  margin-left: 23rpx;
  margin-right: 6rpx;
}
.vip-memmber-entrance .text {
  width: 438rpx;
}
.vip-memmber-entrance .text .name {
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: bold;
  color: #ffeba5;
}
.vip-memmber-entrance .text .name text {
  color: #fff;
}
.vip-memmber-entrance .text .desc {
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #fff;
  font-style: italic;
  font-size: 22rpx;
  line-height: 42rpx;
}
.vip-memmber-entrance view .button {
  width: 145rpx;
  height: 45rpx;
  background: #ffeba5;
  border-radius: 23rpx;
  font-size: 24rpx;
  color: #201f1f;
  text-align: center;
  line-height: 45rpx;
  font-weight: bold;
  margin-right: 14rpx;
  margin-left: 11rpx;
}
.user-sync-button {
  padding: 0 12rpx;
  margin-left: 12rpx;
  color: #fff;
  height: 38rpx;
  border: 2rpx solid #ffffff;
  border-radius: 21rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}
.user-sync-button::after {
  border: none;
}
.user-sync-image {
  width: 20rpx;
  height: 20rpx;
  margin-right: 12rpx;
}
.user-sync-text {
  font-size: 20rpx;
  line-height: 42rpx;
  margin-bottom: 0 !important;
}
.interests_box {
  display: flex;
  font-size: 22rpx;
  align-items: center;
}
.interests_box .interests {
  margin-left: 15rpx;
  color: #fff;
}
</style>