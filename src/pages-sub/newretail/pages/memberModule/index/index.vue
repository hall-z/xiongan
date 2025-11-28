<template>
<!--index.wxml-->
<view>

<view class="banner-box" v-if="state.banners.length > 0">
  <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" circular="true">
    <view v-for="(item , index) in state.banners" :key="index">
      <swiper-item class="swiper-item" :data-id="item.id" @click="handelBannerClick">
        <image :src="item.pictureUrl" class="slide-image"></image>
      </swiper-item>
    </view>
  </swiper>
</view>
<view class="info-box">
  <view class="user-info">
    <image :src="state.userInfo.avatarUrl"></image>
      <button :hidden="state.hasUserInfo" @click="getUserInfo"></button>
    
    <view class="name-mobile">
      <text class="member-name">{{state.userInfo.nickName}}</text>
      <text class="member-mobile" :hidden="!state.mobile">{{filtMobile(state.mobile)}}</text>
    </view>
  </view>
  <view class="member-qr-box" @click="toMyCard">
    <image :src="state.imagesPath.iconMemberQR"></image>
    <text>会员码</text>
  </view>
  <!--<template is="couponBalanceScore" :data="state.couponCount, state.storedValue, state.score"></template>-->
</view>
<view class="content-box">
  <view class="col-one">
    <!-- <navigator target="miniProgram" open-type="navigate" app-id="wxb34bc4be8e276ed8" path="pages/index/index" extra-data="" version="release">
    </navigator> -->
    <view class="online-mall" @click="toMallModule">
      <image :src="state.imagesPath.iconOnlineMall"></image>
      <text>线上商城</text>
    </view>
    <view class="recharge-center" @click="toStoredValue">
      <image :src="state.imagesPath.iconRechargeCenter"></image>
      <text>充值中心</text>
    </view>
  </view>
  <view class="col-two">
    <view class="coupon-center" @click="toCouponCenter">
      <image :src="state.imagesPath.iconCouponCenter"></image>
      <text>领券中心</text>
    </view>
    <view class="gift-box" @click="toGiftCard">
      <image :src="state.imagesPath.iconGiftCard"></image>
      <text>礼品卡</text>
    </view>
    <view class="score-mall" @click="toScoreMall">
      <image :src="state.imagesPath.iconScoreMall"></image>
      <text>积分商城</text>
    </view>
  </view>
</view>

<authorize @login="handleUserLogin" @tabBar="handleTabbar"></authorize></view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _apiBannerServiceJs from "@/service/api/newretail/bannerService";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
// import { onLoad, onPullDownRefresh, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

//index.js
const wxaUserService = _apiWxaUserServiceJs;
const bannerService = _apiBannerServiceJs;
const memberService = _apiMemberServiceJs;
const couponService = _apiCouponServiceJs;
const auth = _utilsAuthJs;
const utils = _utilsUtilsJs;
const IMGAGESPATH = _utilsImagesPathJs;
const NAVPAGE = _utilsNavPageJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  userInfo: {},
  hasUserInfo: false,
  showModel: false,
  canIUse: uni.canIUse('button.open-type.getUserInfo'),
  mobile: '',
  bindMobile: '',
  memberId: '',
  couponCount: '*',
  // 券数量
  storedValue: '*',
  // 储值余额
  score: '*',
  // 积分
  banners: [],
  encryptedData: "",
  iv: '',
  showPhone: false
});
onLoad(function () {
  /**
   * 先获取本地数据，查看是否有用户信息数据，
   * 如果有，直接那本地数据初始化界面，
   * 否则，提示用户手动授权登录，获取信息
   */
  try {
    let _userInfo = auth.getUser();
    if (_userInfo) {
      console.log(_userInfo);
      // Do something with return value
      state.userInfo = _userInfo.wxaUser;
      state.hasUserInfo = true;
      state.mobile = _userInfo.member.mobile;
      state.memberId = _userInfo.member.id;
      if (state.memberId) {
        queryCoupon(1, 0, state.memberId);
        getMbrBalance();
        queryScore();
      }
    }
  } catch (e) {
    // Do something when catch error
  }
  // 获取banner
  getBanners();
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
function getBanners() {
  bannerService.getBannerList('WXAPPHOME').then(res => {
    state.banners = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function queryCoupon(page, pageSize, memberId) {
  let tempAllCouponCount = 0;
  // 查询内部券，将查到的券相加
  couponService.queryCoupon(page, pageSize, memberId).then(res => {
    // console.log(res)
    if (res.records && res.records.length > 0) {
      let count = 0;
      res.records.forEach(item => {
        if (item.status === 'OPEN') count++;
      });
      tempAllCouponCount += count;
    }
    let couponData = {
      memberId: memberId
    };
    // 查询外部券
    return couponService.queryExternalCoupons(couponData);
  }).then(res => {
    // console.log(res)
    if (res && res.records.length > 0) {
      let count = 0;
      res.records.forEach(item => {
        if (item.status === 'OPEN') count++;
      });
      tempAllCouponCount += count;
      state.couponCount = tempAllCouponCount;
    } else {
      state.couponCount = '*';
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
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
function queryScore() {
  memberService.getBalance(state.mobile).then(res => {
    state.score = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function checkAuthor() {
  if (state.hasUserInfo) {
    return true;
  } else {
    uni.showToast({
      title: "点击头像授权登录后才能查看哦~",
      icon: 'none',
      duration: 2000
    });
    return false;
  }
}
function toMallModule() {
  uni.switchTab({
    url: '/pages-sub/newretail/pages/mallModule/index/index/index'
  });
}
function toStoredValue() {
  if (checkAuthor()) {
    uni.navigateTo({
      url: '../balance/storedValue/storedValue'
    });
  }
}
function toMyCoupon() {
  if (checkAuthor()) {
    uni.navigateTo({
      url: '../coupon/myCoupon/myCoupon'
    });
  }
}
function toCouponCenter() {
  // wx.showToast({
  //   title: '该功能暂未开放，敬请期待',
  //   icon: 'none',
  //   duration: 2000
  // })
  if (checkAuthor()) {
    uni.navigateTo({
      url: '../coupon/couponCenter/couponCenter'
    });
  }
}
function toScore() {
  if (checkAuthor()) {
    uni.navigateTo({
      url: '../score/score'
    });
  }
}
function toMyCard() {
  if (checkAuthor()) {
    uni.navigateTo({
      url: '../myCard/myCard'
    });
  }
}
function toGiftCard() {
  if (checkAuthor()) {
    uni.navigateTo({
      url: '../giftCard/giftCard/giftCard'
    });
  }
}
function toScoreMall() {
  // wx.showToast({
  //   title: '该功能暂未开放，敬请期待',
  //   icon: 'none',
  //   duration: 2000
  // })
  if (checkAuthor()) {
    uni.navigateTo({
      url: '../scoreMall/scoreMall/scoreMall'
    });
  }
}
onPullDownRefresh(function () {
  state.userInfo = {};
  state.mobile = '';
  state.couponCount = 0;
  state.storedValue = 0;
  state.score = 0;
  state.hasUserInfo = false;
  onLoad();
  uni.stopPullDownRefresh();
});
onShareAppMessage(function () {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
});
function handelBannerClick(e) {
  let clickItem = '';
  state.banners.forEach(item => {
    if (item.id === e.currentTarget.dataset.id) {
      console.log(item);
      clickItem = item;
    }
  });
  // 授权登录后才能根据banner 的跳转类型进行跳转
  if (checkAuthor()) {
    // 只跳转应用内模块，不跳转链接，商品等
    if (clickItem.linkType === 'APP') {
      if (clickItem.appReturnType === 'MEMBER_CARD') {
        // 如果跳转类型是会员卡，跳转到会员码页面
        uni.navigateTo({
          url: '../myCard/myCard'
        });
      } else if (clickItem.appReturnType === 'RECHARGE') {
        // 如果跳转类型是充值，跳转到储值充值界面
        uni.navigateTo({
          url: '../balance/storedValue/storedValue'
        });
      } else if (clickItem.appReturnType === 'GIFTCARD') {
        // 如果跳转类型是礼品卡，跳转到礼品卡界面
        uni.navigateTo({
          url: '../giftCard/giftCard/giftCard'
        });
      } else if (clickItem.pageUrl) {
        uni.navigateTo({
          url: clickItem.pageUrl
        });
      }
    } else if (clickItem.linkType === "FEEDBACK") {
      //跳转意见反馈页面
      NAVPAGE.toFeedback();
    } else if (clickItem.linkType === "GIFTCARDACTIVITYDETAILS") {
      // 如果跳转类型是礼品卡详情，根据giftcardActivityId跳转到礼品卡详情页
      uni.navigateTo({
        url: '../giftCard/giftCardBuy/giftCardBuy?giftCardActivityId=' + clickItem.giftcardActivityId
      });
    } else if (clickItem.linkType === "BENEFIT_PLAN") {
      NAVPAGE.toBenefitPlan();
    } else if (clickItem.linkType === "MEITUAN_XIAOXIANG") {
      NAVPAGE.toMeituan();
    } else if (clickItem.linkType === "TOURISM_PLAN") {
      let opts = '?id=' + clickItem.tourismPlanId;
      NAVPAGE.toTourismPlan(opts);
    } else if (clickItem.pageUrl) {
      uni.navigateTo({
        url: clickItem.pageUrl
      });
    }
  }
}
function handleUserLogin() {
  let userInfo = app.globalData.userInfo;
  console.log(userInfo);
  const self = this;
  if (userInfo) {
    state.userInfo = {
      ...userInfo.wxaUser
    };
    if (userInfo.member) {
      // 如果会员信息存在，填充页面会员信息，查询储值余额，积分，优惠券等
      state.hasUserInfo = true;
      state.mobile = userInfo.member.mobile;
      state.memberId = userInfo.member.id;
      queryCoupon(1, 0, userInfo.member.id);
      getMbrBalance();
      queryScore();
    } else {
      state.userInfo = userInfo.wxaUser;
      state.hasUserInfo = true;
      NAVPAGE.toAuthorize();
    }
  }
}
function handleTabbar(e) {
  console.log(e.detail);
  if (e.detail.showTabbar === true) {
    state.showTabbar = e.detail.showTabbar;
  } else {
    state.showTabbar = e.detail.showTabbar;
  }
}
function handlePopupPhone() {
  if (!app.globalData.userInfo.member) {
    state.showPhone = true;
  } else {
    state.showPhone = false;
  }
}
function handleBindPhone(e) {
  if (e.detail.bindMobile === true) {
    handlePopupPhone();
  }
}
</script>
<style scoped>
/**index.wxss**/
/* @import "../template/couponBalanceScore.wxss"; */

.banner-box {
  width: 100%;
  height: 375rpx;
  margin: 0 auto;
  margin-bottom: 20rpx;
}

.banner-box .swiper {
  width: 100%;
  height: 100%;
}

.banner-box .swiper-item {
  width: 100%;
  height: 100%;
}

.banner-box image {
  width: 100%;
  height: 100%;
}

.info-box, .online-mall, .recharge-center, .coupon-center, .gift-box,
.score-mall {
  box-shadow: 1px 2px 5px 0px #dedede;
  border-radius: 10rpx;
  overflow: hidden;
}

.info-box {
  width: 670rpx;
  height: 290rpx;
  margin: 0 auto;
  margin-bottom: 30rpx;
  overflow: hidden;
}

.user-info {
  overflow: hidden;
  width: 370rpx;
  float: left;
  margin-top: 45rpx;
  margin-left: 30rpx;
}

.user-info image {
  float: left;
  width: 100rpx;
  height: 100rpx;
  margin-right: 10rpx;
  position: relative;
  background: #eee;
  border-radius: 50%;
  overflow: hidden;
}

.user-info image button {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}

.user-info .name-mobile {
  float: left;
  width: 260rpx;
  height: 100rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 50rpx;
}

.name-mobile .member-name {
  font-size: 32rpx;
  display: block;
}

.name-mobile .member-mobile {
  font-size: 28rpx;
  color: #333;
}

.member-qr-box {
  width: 130rpx;
  height: 130rpx;
  margin-top: 30rpx;
  margin-right: 30rpx;
  background: #f1b400;
  border-radius: 10rpx;
  float: right;
  color: #fff;
  font-size: 22rpx;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.member-qr-box image {
  width: 58rpx;
  height: 58rpx;
  margin-bottom: 4rpx;
}

.content-box {
  margin: 0 auto;
  margin-bottom: 40rpx;
  width: 670rpx;
}

.content-box >view {
  display: flex;
  justify-content: space-between;
}

.online-mall {
  width: 440rpx;
  height: 210rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
  float: left;
  color: #454545;
}

.online-mall image {
  width: 73rpx;
  height: 65rpx;
  margin-right: 40rpx;
}

.recharge-center, .coupon-center, .gift-box, .score-mall {
  width: 210rpx;
  height: 210rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  float: left;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #454545;
}

.recharge-center image {
  width: 69rpx;
  height: 69rpx;
  margin-bottom: 20rpx;
}

.coupon-center image {
  width: 78rpx;
  height: 65rpx;
  margin-bottom: 20rpx;
}

.gift-box image {
  width: 78rpx;
  height: 65rpx;
  margin-bottom: 20rpx;
}

.score-mall image {
  width: 65rpx;
  height: 65rpx;
  margin-bottom: 20rpx;
}

.online-mall:active, .recharge-center:active, .coupon-center:active,
.gift-box:active, .score-mall:active {
  background: #ececec;
}

</style>