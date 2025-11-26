<template>
<!-- pages/mallModule/activity/assistanceCoupon/assistanceCoupon.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="main">
  <view class="trapezoid">
    <image :src="state.imagesPath.assistanceCouponTitleBg" mode="heightFix"></image>
    <text v-if="state.showTime">剩余时间：{{state.timeList.day}}天 {{state.timeList.hou}}:{{state.timeList.min}}:{{state.timeList.sec}}</text>
    <text v-if="!state.showTime && !state.hasHelp && state.assistanceStatus == 'success'">领取成功</text>
  </view>
  <view class="propagate">
    <text v-if="state.assistanceStatus == 'start' && state.isMy && !state.hasHelp">
      大奖快到手啦，
      就差<text class="num">{{state.helperCount - state.helperJoinTotal}}</text>个好友神助攻咯！
    </text>
    <text v-if="state.assistanceStatus == 'start' && !state.isMy && !state.hasHelp">我正在免费领取优惠券
快帮我助力吧</text>
    <text v-else-if="state.assistanceStatus == 'success' && state.isMy">大奖到手啦
已经放入您的账号！</text>
    <text v-else-if="(state.assistanceStatus == 'success' || state.assistanceStatus == 'start') && !state.isMy && state.hasHelp">已帮好友助力成功</text>
    <text v-else-if="state.assistanceStatus == 'fail'">你来晚了
奖品已经发完了！</text>
    <text v-else-if="state.assistanceStatus == 'end'">你来晚了
活动已经结束了！</text>
    <text v-else-if="state.assistanceStatus == 'overrun'">您的次数已满
    不能再次参与活动哦</text>
  </view>
  <view class="coupon-box" v-if="state.assistanceStatus !== 'end'">
    <view class="coupon-item" :data-activityId="state.coupon.couponActivityId">
      <image class="coupon-item-bg" :src="state.imagesPath.assistanceCouponBg"></image>
      <view class="coupon-item-top">
        <!-- <image src="{{imagesPath.iconLogo}}" ></image> -->
        <view class="name">{{state.coupon.name}}</view>
        <!-- <text class="time" wx:if="{{coupon.effectiveTime!==''}}">有效使用期：{{coupon.effectiveTime}}</text> -->
      </view>
      <view class="coupon-item-bottom">
        <text class="time" v-if="state.coupon.effectiveTime">有效使用期：{{state.coupon.effectiveTime}}</text>
        <!-- <text class="condition">{{coupon.useRule}}</text> -->
      </view>
    </view>
    <text class="coupon-name">{{state.coupon.name}}</text>
  </view>
  <view class="friend-box" :style="state.assistanceStatus !== 'end' ? '' : 'margin-top: 360rpx;'">
    <view class="invite-title">好友助力</view>
    <view class="assistance-list">
      <view v-if="state.showAll">
        <view class="assistance-item" v-for="(item , index) in state.joinMbrs" :key="idx">
          <image :src="item.avatar"></image>
        </view>
        <view class="assistance-item" v-for="(item , index) in state.helperNum - state.helperJoinNum > 0 ? state.helperNum - state.helperJoinNum : 0" :key="idx">
          <image :src="state.themeManager.BASE_URL + '/iconPeopleItem.png'"></image>
        </view>
      </view>
      <view v-else>
        <view class="assistance-item" v-for="(item , index) in state.joinMbrs" :key="idx" v-if="state.helperNum > 11 ? index < 11 : index < state.helperJoinNum">
          <image :src="item.avatar"></image>
        </view>
        <view class="assistance-item" v-for="(item , index) in state.helperNum - state.helperJoinNum > 0 ? state.helperNum - state.helperJoinNum : 0" v-if="state.helperNum > 11 ? index < 11 - state.helperJoinNum : state.helperNum - state.helperJoinNum" :key="idx">
          <image :src="state.themeManager.BASE_URL + '/iconPeopleItem.png'"></image>
        </view>
      </view>
      <view class="assistance-item" v-if="state.helperNum > 11 && !state.showAll" @click="showAllJoinPeople">
        <image :src="state.themeManager.BASE_URL + '/iconCollageMore1.png'"></image>
      </view>
    </view>
    <view class="invite-bottom" :hidden="!state.showAll" @click="hiddenAllJoinPeople">收起</view>
  </view>
</view>
<view class="button-box" v-if="state.showButton">
  <button class="invite" v-if="state.assistanceStatus == 'start' && state.isMy" open-type="share">邀请好友来助力>></button>
  <button class="invite" v-if="state.assistanceStatus == 'start' && !state.isMy && !state.hasHelp" @click="helpFriend">帮好友助力</button>
  <button class="invite" v-if="state.assistanceStatus == 'start' && !state.isMy && state.hasHelp" @click="goCoupon">发起我的助力</button>
  <button class="toUse" v-else-if="state.assistanceStatus == 'success' && state.isMy && state.raleBalanceFlag" @click="confirmCreateAgain">再次发起>></button>
  <button class="toUse" v-else-if="state.assistanceStatus == 'success' && !state.isMy" @click="goCoupon">发起我的助力</button>
  <button class="toUse" v-else-if="state.assistanceStatus == 'end' || state.assistanceStatus == 'fail'" @click="toIndex">去商城逛逛</button>
</view>
<button class="back-mall-button" @click="toIndex" v-if="state.assistanceStatus !== 'fail' && state.assistanceStatus !== 'end' && !state.hasHelp">{{state.assistanceStatus == "success" ? "去商城使用>>" : "去商城逛逛"}}</button>
<view class="prompt-message" v-if="state.otherGetCoupon">点一点有惊喜，你也可以获得一张券噢~</view>
<view class="prompt-message" v-else>{{state.promptMessage}}</view>
<view class="rule-box">
  <view class="rule-title">
    <text class="line"></text>
    <text class="text">助力说明</text>
    <text class="line"></text>
  </view>
  <view class="rule-con">
    <view>
      <image :src="state.themeManager.BASE_URL + '/iconActivityItem.png'"></image>
      每个用户均可参与活动，助力人数达到要求可获得优惠券；
    </view>
    <view>
      <image :src="state.themeManager.BASE_URL + '/iconActivityItem.png'"></image>
      参与活动请关注助力的好友数量；
    </view>
    <view>
      <image :src="state.themeManager.BASE_URL + '/iconActivityItem.png'"></image>
      优惠券仅限本人使用，不可转赠;
    </view>
    <view v-if="state.onlyNewMbrJoin">
      <image :src="state.themeManager.BASE_URL + '/iconActivityItem.png'"></image>
      本活动仅限新用户参加;
    </view>
  </view>
</view>
<view v-if="state.otherActivities.length > 0">
  <view class="rule-box">
    <view class="rule-title">
      <text class="line"></text>
      <text class="text">其他精彩活动</text>
      <text class="line"></text>
    </view>
  </view>
  <!-- 轮播图模块 -->
  <view class="banner-box">
    <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" circular="true">
      <view v-for="(item , index) in state.otherActivities" :key="index">
        <swiper-item class="swiper-item" :data-id="item.id" @click="bannerJumping">
          <image :src="item.pictureUrl" class="slide-image"></image>
        </swiper-item>
      </view>
    </swiper>
  </view>
  <view style="height:100rpx;"></view>
</view>
<popup :show="state.show.middle" position="middle" custom-class="middle" @close="toggleMiddlePopup">
  <view class="popup-box">
    <view class="popup-close-box" @click="toggleMiddlePopup">
      <image :src="state.imagesPath.iconRedPacketClose"></image>
    </view>
    <view class="popup-trapezoid">
      <image :src="state.imagesPath.assistanceCouponTitleBg" mode="heightFix"></image>
      <text>{{state.assistanceStatusText}}</text>
    </view>
    <view class="receive-message" v-if="state.assistanceStatus !== 'fail' && state.assistanceStatus !== 'end' && state.assistanceStatus !== 'success'">{{state.receiveMessage}}</view>
    <view class="receive-message" v-if="state.assistanceStatus !== 'fail' && state.assistanceStatus !== 'end' && state.assistanceStatus === 'success' && state.isMy">{{state.receiveMessage}}</view>
    <view class="popup-coupon-box" v-if="state.assistanceStatus !== 'fail' && state.assistanceStatus !== 'end' && state.assistanceStatus !== 'success' && memberStatus === 'oldMember' && state.otherGetCoupon && !state.isMy">
      <view class="coupon-item" :data-activityId="state.helperData.couponActivityId">
        <image class="coupon-item-bg" :src="state.imagesPath.assistanceCouponBg"></image>
        <view class="coupon-item-top">
          <!-- <image src="{{imagesPath.iconLogo}}" ></image> -->
          <view class="name">{{state.helperData.name}}</view>
          <!-- <text class="time" wx:if="{{helperData.effectiveTime!==''}}">有效使用期：{{helperData.effectiveTime}}</text> -->
        </view>
        <view class="coupon-item-bottom">
          <text class="time" v-if="state.helperData.effectiveTime">有效使用期：{{state.helperData.effectiveTime}}</text>
          <!-- <text class="condition">{{helperData.condition}}</text> -->
        </view>
      </view>
    </view>
    <view class="popup-coupon-box" v-if="state.assistanceStatus !== 'fail' && state.assistanceStatus !== 'end' && state.assistanceStatus !== 'success' && memberStatus === 'oldMember' && !state.otherGetCoupon && !state.isMy">
      <view class="coupon-item" :data-activityId="state.coupon.couponActivityId">
        <image class="coupon-item-bg" :src="state.imagesPath.assistanceCouponBg"></image>
        <view class="coupon-item-top">
          <!-- <image src="{{imagesPath.iconLogo}}" ></image> -->
          <view class="name">{{state.coupon.name}}</view>
          <!-- <text class="time" wx:if="{{coupon.effectiveTime!==''}}">有效使用期：{{coupon.effectiveTime}}</text> -->
        </view>
        <view class="coupon-item-bottom">
          <text class="time" v-if="state.coupon.effectiveTime">有效使用期：{{state.coupon.effectiveTime}}</text>
          <!-- <text class="condition">{{coupon.condition}}</text> -->
        </view>
      </view>
    </view>
    <view class="popup-coupon-box" v-if="state.assistanceStatus !== 'fail' && state.assistanceStatus !== 'end' && state.isMy">
      <view class="coupon-item" :data-activityId="state.coupon.couponActivityId">
        <image class="coupon-item-bg" :src="state.imagesPath.assistanceCouponBg"></image>
        <view class="coupon-item-top">
          <!-- <image src="{{imagesPath.iconLogo}}" ></image> -->
          <view class="name">{{state.coupon.name}}</view>
          <!-- <text class="time" wx:if="{{coupon.effectiveTime!==''}}">有效使用期：{{coupon.effectiveTime}}</text> -->
        </view>
        <view class="coupon-item-bottom">
          <text class="time" v-if="state.coupon.effectiveTime">有效使用期：{{state.coupon.effectiveTime}}</text>
          <!-- <text class="condition">{{coupon.condition}}</text> -->
        </view>
      </view>
    </view>
    <image class="new-coupon" v-if="state.assistanceStatus !== 'fail' && state.assistanceStatus !== 'end' && state.assistanceStatus !== 'success' && memberStatus === 'newMember'" :src="state.imagesPath.iconNewUserCoupon"></image>
    <view class="activity-state-box" v-if="state.assistanceStatus === 'end' || state.assistanceStatus === 'fail'">
      <text>{{state.receiveMessage}}</text>
    </view>
    <view class="activity-state-box" v-if="state.assistanceStatus === 'success' && !state.isMy">
      <text>{{state.receiveMessage}}</text>
    </view>
    <view class="popup-button-box">
      <button v-if="memberStatus === 'oldMember' && state.assistanceStatus !== 'fail' && state.assistanceStatus !== 'end' && state.assistanceStatus !== 'success'" @click="goCoupon">发起我的助力</button>
      <button v-else-if="state.assistanceStatus === 'end' || state.assistanceStatus === 'fail'" @click="toIndex">去商城逛逛</button>
      <button v-else-if="state.assistanceStatus === 'success' && state.isMy" @click="toIndex">去商城使用>></button>
      <button v-else-if="state.assistanceStatus === 'success' && !state.isMy" @click="goCoupon">发起我的助力</button>
      <button @click="toAuthorization" v-else>立即使用</button>
    </view>
    <view class="popup-tips" v-if="memberStatus === 'newMember' && state.assistanceStatus !== 'fail' && state.assistanceStatus !== 'end'">优惠券已放入您的账户</view>
    <view class="popup-tips" v-if="state.assistanceStatus === 'end' || state.assistanceStatus === 'fail'">更多优惠请前往商城查看~</view>
  </view>
</popup>
<authorize @login="handleUserLogin"></authorize>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _apiCouponService from "@/service/api/newretail/couponService";
import _apiBannerServiceJs from "@/service/api/newretail/bannerService";
import _utilsCouponHandler from "@/utils/newretail/couponHandler";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiHelpActivityServiceJs from "@/service/api/newretail/helpActivityService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
const app = getApp();

// pages/mallModule/activity/assistanceCoupon/assistanceCoupon.js
const helpActivityService = _apiHelpActivityServiceJs;
const UTILS = _utilsUtilsJs;
const IMAGESPATH = _utilsImagesPathJs;
const NAVPAGE = _utilsNavPageJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const couponHandler = _utilsCouponHandler;
const bannerService = _apiBannerServiceJs;
const couponService = _apiCouponService;
const themeManager = _utilsThemeManagerJs;
const state = reactive({
  isReadFlag: false,
  raleBalanceFlag: true,
  themeManager,
  navigationBarTitle: "",
  imagesPath: IMAGESPATH,
  coupon: {},
  showTime: true,
  showButton: true,
  timeList: {
    day: '00',
    hou: '00',
    min: '00',
    sec: '00'
  },
  externalStyle: 'transform: scale(0.8);margin-left: -82rpx;margin-top: -36rpx;',
  externalStyle1: "transform: scale(0.6);margin-left: -136rpx;margin-top: -70rpx;",
  promptMessage: '邀请12位好友助力,助力成功后即可领取！',
  receiveMessage: '好友离奖品更近一步啦，快来一起参与~',
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false
  },
  assistanceStatus: 'start',
  //start,success,fail,end
  assistanceStatusText: '助力成功啦！',
  helperCount: 0,
  helperJoinTotal: 0,
  helperNum: 0,
  helperJoinNum: 0,
  joinMbrs: [],
  canShare: true,
  title: '好友助力，领三折神券',
  onlyNewMbrJoin: false,
  // 是否仅限新会员参加
  isMy: false,
  showAll: false,
  // 展示所有参与人员
  hasHelp: false,
  otherActivities: [],
  //其它精彩活动,
  otherGetCoupon: false,
  helperData: {}
});
onLoad(function (options) {
  // id  助力送券实例id  
  if (options.id != null) {
    // 参数中包含助力送券实例ID,根据该实例ID查询对应的助力送券实例（分享）
    getById(options.id);
    helpActivityInstanceId = options.id;
  } else if (options.helpActivityId != null) {
    console.log(options.helpActivityId);
    // 查询当前正在进行中的助力送券活动
    getActivityById(options.helpActivityId);
    getOtherActivityBanner(options.helpActivityId);
  } else {
    uni.showModal({
      title: '提示',
      content: '当前没有正在进行中的活动哦~',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          NAVPAGE.toHome();
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  }
  // 获取当前页面分享图
  getSharePictures();
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
  console.log(helpActivityInstanceId);
  const that = this;
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let sharePictures = state.sharePictures;
  const shareImageUrl = state.shareImageUrl;
  if (shareImageUrl != null && shareImageUrl !== "") {
    sharePictures = shareImageUrl;
  }
  if (res.from === 'button') {
    // 邀请好友助力送券
  }
  let path = '/pages-sub/newretail/pages/mallModule/activity/assistanceCoupon/assistanceCoupon';
  path = helpActivityInstanceId != null ? path + '?id=' + helpActivityInstanceId : path;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    let memberId = app.globalData.userInfo.member.id;
    if (path.indexOf("?") > 0) {
      path = path + "&shareId=" + memberId;
    } else {
      path = path + "?shareId=" + memberId;
    }
  }
  console.log(path);
  return {
    title: state.title,
    path: path,
    imageUrl: sharePictures
  };
});
function toIndex() {
  NAVPAGE.toHome();
}
function goCoupon() {
  const self = this;
  //   console.log(self.helpActivityId)
  let opts = "?helpActivityId=" + helpActivityId;
  NAVPAGE.toAssistanceCoupon(opts);
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function toggleMiddlePopup() {
  toggle('middle');
}
function getActivityById(helpActivityId) {
  const self = this;
  helpActivityService.getHelpActivityById(helpActivityId).then(res => {
    if (res) {
      // 保存助力送券活动id
      helpActivityId = res.id;
      if (res.shareImageUrl) {
        state.shareImageUrl = res.shareImageUrl;
      }
      if (res.couponActivity != null) {
        setCouponActivity(res.couponActivity);
      }
      state.isMy = true;
      state.title = res.name;
      state.helperCount = res.helperCount;
      state.onlyNewMbrJoin = res.onlyNewMbrJoin;
      state.helperNum = res.helperCount > 12 ? 12 : res.helperCount;
      state.promptMessage = '邀请' + res.helperCount + '位好友助力,助力成功后即可领取！';
      // 设置活动倒计时
      state.navigationBarTitle = res.name;
      let startTime = new Date(res.startTime.replace(/-/g, '/')).getTime();
      let endTime = new Date(res.endTime.replace(/-/g, '/')).getTime();
      // 设置活动倒计时
      countDown();
      function countDown() {
        let now = UTILS.timestampToTime(new UTILS.ResponseDate().getTime());
        if (new UTILS.ResponseDate().getTime() <= endTime && new UTILS.ResponseDate().getTime() >= startTime) {
          // 当前时间在活动时间内
          clearTimeout(acTime);
          let duration = endTime - new UTILS.ResponseDate().getTime();
          let list = [{
            openTeamTime: now,
            duration: duration / 1000
          }];
          let timeArr = UTILS.countDownDay(list);
          state.timeList = timeArr[0];
          let acTime = setTimeout(() => {
            countDown();
          }, 1000);
          state.acTime = acTime;
        } else {
          // 活动未开始或活动已结束，统一显示活动已结束
          console.log("活动未开始或活动已结束，统一显示活动已结束");
          handleActivityEnd(self);
        }
      }

      // 只有会员才能发起助力送券
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        // 创建助力送券实例
        if (res.status === "SUBMITED") {
          // 保存助力送券活动id
          getInstanceOnline(res.id);
        } else if (res.status === "FINISHED") {
          handleActivityEnd(self);
          return;
        } else if (res.status === "CREATED") {
          handleActivityEnd(self);
          return;
        } else {
          handleActivityEnd(self);
          return;
        }
      }
    } else {
      // 没有正在进行中的助力送券活动，抛出活动已结束
      console.log("活动未开始或活动已结束，统一显示活动已结束");
      handleActivityEnd(self);
    }
  }).catch(err => {
    console.log("查询进行中的助力送券活动出错：" + err.message);
    uni.showToast({
      title: '当前没有正在进行中的活动哦~',
      icon: 'none'
    });
  });
}
function getOnline(helpActivityId) {
  const self = this;
  helpActivityService.getOnline(helpActivityId).then(res => {
    if (res) {
      // 保存助力送券活动id
      helpActivityId = res.id;
      if (res.couponActivity != null) {
        setCouponActivity(res.couponActivity);
      }
      // 只有会员才能发起助力送券
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        // 创建助力送券实例
        getInstanceOnline(res.id);
      }
      state.isMy = true;
      state.title = res.name;
      state.helperCount = res.helperCount;
      state.onlyNewMbrJoin = res.onlyNewMbrJoin;
      state.helperNum = res.helperCount > 12 ? 12 : res.helperCount;
      state.promptMessage = '邀请' + res.helperCount + '位好友助力,助力成功后即可领取！';
      // 设置活动倒计时
      state.navigationBarTitle = res.name;
      let startTime = new Date(res.startTime.replace(/-/g, '/')).getTime();
      let endTime = new Date(res.endTime.replace(/-/g, '/')).getTime();
      // 设置活动倒计时
      setTimeout(() => {
        // 延迟1000毫秒开始倒计时，防止当前时间小于开始时间
        countDown();
      }, 1000);
      function countDown() {
        let now = UTILS.timestampToTime(new UTILS.ResponseDate().getTime());
        if (new UTILS.ResponseDate().getTime() <= endTime && new UTILS.ResponseDate().getTime() >= startTime) {
          // 当前时间在活动时间内
          clearTimeout(acTime);
          let duration = endTime - new UTILS.ResponseDate().getTime();
          let list = [{
            openTeamTime: now,
            duration: duration / 1000
          }];
          let timeArr = UTILS.countDownDay(list);
          state.timeList = timeArr[0];
          let acTime = setTimeout(() => {
            countDown();
          }, 1000);
          state.acTime = acTime;
        } else {
          // 活动未开始或活动已结束，统一显示活动已结束
          console.log("活动未开始或活动已结束，统一显示活动已结束");
          handleActivityEnd(self);
        }
      }
    } else {
      // 没有正在进行中的助力送券活动，抛出活动已结束
      console.log("活动未开始或活动已结束，统一显示活动已结束");
      handleActivityEnd(self);
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 1000
    });
  });
}
function setCouponActivity(couponActivity) {
  if (couponActivity) {
    let tempData = {
      ...couponActivity
    };
    if (couponActivity.startDate) {
      let startTime = couponActivity.startDate.slice(0, 16);
      let endTime = couponActivity.endDate.slice(0, 16);
      let effectiveTime = startTime + ' ~ ' + endTime;
      let validityTime = startTime + ' —— ' + endTime;
      let couponStatus = couponActivity.status;
      tempData = {
        ...tempData,
        effectiveTime: effectiveTime,
        validityTime: validityTime,
        status: couponStatus
      };
    } else {
      tempData = {
        ...tempData,
        effectiveTime: '',
        validityTime: ''
      };
    }
    couponHandler.handleCouponFunction(tempData);
    state.coupon = tempData;
  }
}
function getInstanceOnline(id) {
  const self = this;
  helpActivityService.getInstanceOnline(id).then(res => {
    if (res) {
      state.raleBalanceFlag = res.raleBalance > 0;
      state.isReadFlag = res.isRead;
      if (createAgain != null && createAgain && res.helpActivity.helperCount === res.helperJoinTotal && res.status === "FINISH") {
        create(helpActivityId);
      } else {
        // 再次发起时不渲染当前页面
        state.title = res.helpActivity.name;
        state.isMy = true;
        // 当前用户存在已经创建的助力送券实例
        state.navigationBarTitle = res.helpActivity.name;
        helpActivityInstanceId = res.id;
        handleInstanceData(self, res);
        // 查询记录
        getRecord(res.id);
      }
    } else {
      // 不存在，创建新的助力活动实例
      create(id);
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 1000
    });
  });
}
function handleInstanceData(self, res) {
  if (res.helpActivity) {
    // 助力送券活动信息
    if (res.helpActivity.couponActivity != null) {
      // 券活动信息
      setCouponActivity(res.helpActivity.couponActivity);
    }
  }
  self.setData({
    title: res.helpActivity.name,
    promptMessage: '邀请' + res.helpActivity.helperCount + '位好友助力,助力成功后即可领取！'
  });
  self.setData({
    navigationBarTitle: res.helpActivity.name
  });
  self.helpActivityInstance = res;
  // 判断当前活动是否在有效期内
  let startTime = new Date(res.startTime.replace(/-/g, '/')).getTime();
  let endTime = new Date(res.endTime.replace(/-/g, '/')).getTime();
  if (new UTILS.ResponseDate().getTime() <= endTime) {
    // 在有效期内可以进行下一步操作
    // 人数信息
    self.setData({
      helperCount: res.helpActivity.helperCount,
      onlyNewMbrJoin: res.helpActivity.onlyNewMbrJoin,
      helperJoinTotal: res.helperJoinTotal,
      helperNum: res.helpActivity.helperCount > 12 ? 12 : res.helpActivity.helperCount,
      helperJoinNum: res.helperJoinTotal > 12 ? 12 : res.helperJoinTotal
    });
    // 判断当前用户是否新人
    let users = 'oldMember'; //newMember,oldMember
    // 判断是否可以参加助力
    if (res.helpActivity.helperCount === res.helperJoinTotal && res.status === "FINISH") {
      // 助力已成功
      self.setData({
        promptMessage: '优惠券已放入您的账户'
      });
      // 弹窗提示已成功
      if (!self.data.show.middle && !self.data.isReadFlag) {
        self.setData({
          isReadFlag: true
        });
        self.handleReceiveSuccess(self);
        helpActivityService.instanceRead(self.helpActivityInstance.id).then(res => {});
      }
    } else if (res.helpActivity.helperCount > res.helperJoinTotal) {
      self.setData({
        assistanceStatus: 'start'
      });
      // 清除之前的倒计时
      clearTimeout(self.data.acTime);
      // 设置活动倒计时
      let now = UTILS.timestampToTime(new UTILS.ResponseDate().getTime());
      console.log("当前时间：" + UTILS.timestampToTime(now));
      console.log("开始时间：" + res.startTime);
      console.log("结束时间：" + res.endTime);
      setTimeout(() => {
        // 延迟3000毫秒开始倒计时，防止当前时间小于开始时间
        countDown();
      }, 3000);
    }
    self.setData({
      memberStatus: users
    });
  } else {
    // 活动已过期，提示活动已结束
    console.log(res.startTime, startTime, res.endTime, endTime, new UTILS.ResponseDate().getTime());
    console.log(self, res, "?????????????????????");
    self.handleActivityEnd(self);
  }
  function countDown() {
    let now = UTILS.timestampToTime(new UTILS.ResponseDate().getTime());
    if (new UTILS.ResponseDate().getTime() <= endTime && new UTILS.ResponseDate().getTime() >= startTime) {
      // 当前时间在活动时间内
      clearTimeout(acTimen);
      let duration = endTime - new UTILS.ResponseDate().getTime();
      let list = [{
        openTeamTime: now,
        duration: duration / 1000
      }];
      let timeArr = UTILS.countDownDay(list);
      self.setData({
        timeList: timeArr[0]
      });
      let acTimen = setTimeout(() => {
        countDown();
      }, 1000);
      self.setData({
        acTimen: acTimen
      });
    } else {
      // 活动未开始或活动已结束，统一显示活动已结束
      console.log("活动未开始或活动已结束，统一显示活动已结束");
      console.log("当前时间：" + UTILS.timestampToTime(now));
      console.log("开始时间：" + res.startTime);
      console.log("结束时间：" + res.endTime);
      self.handleActivityEnd(self);
    }
  }
}
function create(id) {
  const self = this;
  helpActivityService.create(id).then(res => {
    helpActivityInstanceId = res; //助力送券实例id
    // 查询重新创建的助力送券实例
    getInstanceOnline(helpActivityId);
    state.isMy = true;
  }).catch(err => {
    if (err.code === 47009) {
      if (isOpenOther != null && isOpenOther) {
        errMessage = err;
        state.canShare = false;
      }
      handleActivityCreateFail(self);
    } else if (err.code === 47011) {
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 1000
        });
      }, 100);
    } else {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 1000
      });
    }
  });
}
function getRecord(id) {
  const self = this;
  helpActivityService.getRecord(id).then(res => {
    let tempList = [];
    let n = 0;
    if (res && res.length > 0) {
      res.forEach(item => {
        n++;
        tempList.push({
          ...item,
          avatar: item.avatar ? item.avatar : state.imagesPath.userPortrait
        });
      });
    }
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      let hasHelp = false;
      for (let i = 0; i < res.length; i++) {
        const ele = res[i];
        if (ele.memberId === app.globalData.userInfo.member.id) {
          // 会员已参与助力
          hasHelp = true;
          break;
        }
      }
      state.hasHelp = hasHelp;
    }
    if (state.assistanceStatus === 'overrun') {
      // 超过次数
      state.joinMbrs = [];
    } else {
      state.helperJoinNum = n > 12 ? 12 : n;
      state.helperJoinTotal = n;
      state.joinMbrs = tempList;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 1000
    });
  });
}
function getById(id) {
  const self = this;
  helpActivityService.getById(id).then(res => {
    console.log(res, '77777777');
    if (res) {
      if (res.helpActivity) {
        // 助力送券活动信息
        helpActivityId = res.helpActivity.id;
        if (res.helpActivity.couponActivity != null) {
          // 券活动信息
          setCouponActivity(res.helpActivity.couponActivity);
        }
        if (res.helpActivity.shareImageUrl) {
          state.shareImageUrl = res.helpActivity.shareImageUrl;
        }
        if (res.helpActivity.helperCouponActivityId != null) {
          let helperCouponActivityId = res.helpActivity.helperCouponActivityId;
          couponService.getById(helperCouponActivityId).then(res => {
            let helperData = {};
            if (res) {
              helperData = {
                ...res
              };
              if (res.startDate) {
                let startTime = res.startDate.slice(0, 16);
                let endTime = res.endDate.slice(0, 16);
                let effectiveTime = startTime + ' ~ ' + endTime;
                let validityTime = startTime + ' —— ' + endTime;
                let couponStatus = res.status;
                helperData = {
                  ...helperData,
                  effectiveTime: effectiveTime,
                  validityTime: validityTime,
                  status: couponStatus
                };
              } else {
                helperData = {
                  ...helperData,
                  effectiveTime: '',
                  validityTime: ''
                };
              }
            }
            state.helperData = helperData;
            state.otherGetCoupon = true;
            state.receiveMessage = "万分感谢，送您一张优惠券！";
          }).catch(err => {
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 1000
            });
          });
          // self.setData({
          //   otherGetCoupon: true
          // })
        }
      }
      state.title = res.helpActivity.name;
      state.promptMessage = '邀请' + res.helpActivity.helperCount + '位好友助力,助力成功后即可领取！';
      state.navigationBarTitle = res.helpActivity.name;
    }
    helpActivityInstance = res;
    return helpActivityService.getRecord(id);
  }).then(res => {
    let tempList = [];
    if (res && res.length > 0) {
      res.forEach(item => {
        tempList.push({
          ...item,
          avatar: item.avatar ? item.avatar : state.imagesPath.userPortrait
        });
      });
    }
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      let hasHelp = false;
      for (let i = 0; i < res.length; i++) {
        const ele = res[i];
        if (ele.memberId === app.globalData.userInfo.member.id) {
          // 会员已参与助力
          hasHelp = true;
          break;
        }
      }
      state.hasHelp = hasHelp;
    }
    if (state.assistanceStatus === 'overrun') {
      // 超过次数
      state.joinMbrs = [];
    } else {
      state.joinMbrs = tempList;
    }
    // 获取实例信息
    const _data = helpActivityInstance;
    // 判断当前活动是否在有效期内
    let startTime = new Date(_data.startTime.replace(/-/g, '/')).getTime();
    let endTime = new Date(_data.endTime.replace(/-/g, '/')).getTime();
    if (new UTILS.ResponseDate().getTime() <= endTime) {
      // 在有效期内可以进行下一步操作
      // 人数信息
      // 判断当前用户是否新人
      state.helperCount = _data.helpActivity.helperCount;
      state.onlyNewMbrJoin = _data.helpActivity.onlyNewMbrJoin;
      state.helperJoinTotal = _data.helperJoinTotal;
      state.helperNum = _data.helpActivity.helperCount > 12 ? 12 : _data.helpActivity.helperCount;
      state.helperJoinNum = _data.helperJoinTotal > 12 ? 12 : _data.helperJoinTotal;
      let users = 'oldMember'; //newMember,oldMember
      let canHelp = false;
      // 判断是否可以参加助力
      if (_data.helpActivity.helperCount === _data.helperJoinTotal) {
        // 助力已成功
        if (app.globalData.userInfo) {
          if (app.globalData.userInfo.member) {
            if (app.globalData.userInfo.member.id === _data.initiatorId) {
              // 当前登录用户是发起者
              // 弹窗提示已成功
              state.promptMessage = '优惠券已放入您的账户';
              state.isMy = true;
              if (!state.show.middle && !state.isReadFlag) {
                state.isReadFlag = true;
                handleReceiveSuccess(self);
                helpActivityService.instanceRead(id).then(res => {});
              }
            } else {
              // 标记是从他人链接打开
              isOpenOther = true;
              // 老用户，当前用户不是发起人，可以创建助力实例
              // 实例需用户手动创建
              if (!state.show.middle) {
                handleSuccess(self);
              }
            }
          }
        }
      } else if (_data.helperJoinTotal < _data.helpActivity.helperCount) {
        // 可以参加助力
        if (app.globalData.userInfo) {
          if (app.globalData.userInfo.member != null) {
            // 是会员
            if (app.globalData.userInfo.member.id !== _data.initiatorId) {
              // 标记是从他人链接打开
              isOpenOther = true;
              // 用户可以创建助力实例，实例需用户手动创建
              canHelp = true;
            } else {
              state.isMy = true;
            }
          } else {
            // 新会员
            users = 'newMember';
            canHelp = true;
          }
        }
      }
      state.memberStatus = users;
      if (_data.status === "CREATE") {
        // 只有进行中的才可以参加助力
        if (canHelp) {
          // self.help(data.id)
        }
      } else {
        if (_data.helpActivity.helperCount === _data.helperJoinTotal) {
          // 已成功的
        } else {
          // 活动已过期，提示活动已结束
          console.log("活动已过期，提示活动已结束");
          clearTimeout(state.acTime);
          handleActivityEnd(self);
        }
      }
    } else {
      // 活动已过期，提示活动已结束
      console.log("活动已过期，提示活动已结束");
      handleActivityEnd(self);
    }
    // 设置活动倒计时
    if (_data.status === "CREATE" || _data.helpActivity.helperCount === _data.helperJoinTotal && !state.isMy) {
      // 只有进行中的才显示倒计时
      // 设置活动倒计时
      setTimeout(() => {
        // 延迟1000毫秒开始倒计时，防止当前时间小于开始时间
        countDown();
      }, 1000);
    }
    function countDown() {
      let now = UTILS.timestampToTime(new UTILS.ResponseDate().getTime());
      if (new UTILS.ResponseDate().getTime() <= endTime && new UTILS.ResponseDate().getTime() >= startTime) {
        // 当前时间在活动时间内
        clearTimeout(acTime);
        let duration = endTime - new UTILS.ResponseDate().getTime();
        let list = [{
          openTeamTime: now,
          duration: duration / 1000
        }];
        let timeArr = UTILS.countDownDay(list);
        state.timeList = timeArr[0];
        let acTime = setTimeout(() => {
          countDown();
        }, 1000);
        state.acTime = acTime;
      } else {
        // 活动未开始或活动已结束，统一显示活动已结束
        handleActivityEnd(self);
      }
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 1000
    });
  });
}
function help(id) {
  const self = this;
  if (!app.globalData.userInfo) {
    NAVPAGE.toAuthorize();
    return;
  }
  helpActivityService.help(id).then(res => {
    // 助力成功刷新当前页面信息，弹出助力成功提示框
    handleaAtivitySuccess(self);
  }).catch(err => {
    if (err.code === 47005 || err.code === 47006 || err.code === 47007 || err.code === 47008 || err.code === 47015 || err.code === 47016 || err.code === 41016) {
      // 助力活动状态非法提示活动已结束
      // 助力活动结束或奖品不足都提示已结束
      handleActivityEnd(self);
    } else if (err.code === 47013) {
      // 已助力成功, 不可重复助力
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 1000
      });
    } else {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 1000
      });
    }

    // else if (err.code === 47008) {
    //   // 当前活动奖品已发完
    //   self.handleActivityFail(self)
    // }
  });
}
function handleActivityEnd(self) {
  // 操作活动状态
  self.setData({
    assistanceStatus: 'end',
    promptMessage: '更多优惠请前往商城查看~',
    assistanceStatusText: '活动已结束！',
    receiveMessage: '您来晚了\n活动已经结束了！',
    timeList: {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    }
  });
  if (self.data.acTime != null) {
    clearTimeout(self.data.acTime);
  }
  // 弹出提示框
  self.toggleMiddlePopup();
}
function handleActivityFail(self) {
  // 操作活动状态
  self.setData({
    assistanceStatus: 'fail',
    promptMessage: '更多优惠请前往商城查看~',
    assistanceStatusText: '奖品已发完！',
    receiveMessage: '您来晚了\n奖品已经发完了！',
    timeList: {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    }
  });
  // 弹出提示框
  self.toggleMiddlePopup();
}
function handleActivityCreateFail(self) {
  // 操作活动状态
  clearTimeout(self.data.acTime);
  clearTimeout(self.data.acTimen);
  self.setData({
    showTime: false,
    showButton: false,
    assistanceStatus: 'overrun',
    promptMessage: '更多优惠请前往商城查看~',
    timeList: {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    },
    joinMbrs: [],
    helperJoinTotal: 0,
    helperJoinNum: 0
  });
}
function handleaAtivitySuccess(self) {
  // 助力成功更新当前页面信息
  // self.getById(self.options.id)
  self.getRecord(self.options.id);
  /**
   * 助力成功需要根据会员状态给与不同提示
   */
  let helperJoinTotal = parseInt(self.data.helperJoinTotal) + 1;
  let message = '好友离奖品更近一步啦，快来一起参与~';
  if (self.data.memberStatus === 'newMember') {
    message = '万分感谢，好友送你一张新人专享券~';
  } else if (helperJoinTotal >= self.data.helperCount) {
    message = '好友已成功领取\n快来一起发起助力吧';
  }
  // 操作活动状态
  self.setData({
    assistanceStatus: 'start',
    //start,success,fail,end
    promptMessage: '邀请' + self.data.helperCount + '位好友助力,助力成功后即可领取！',
    assistanceStatusText: '助力成功啦！',
    receiveMessage: message,
    hasHelp: true,
    isMy: false
  });
  // 弹出提示框
  self.toggleMiddlePopup();
}
function handleReceiveSuccess(self) {
  // 操作活动状态
  // 操作活动状态
  self.setData({
    assistanceStatus: 'success',
    //start,success,fail,end
    // promptMessage: '邀请' + self.data.helperCount + '位好友助力,助力成功后即可领取！',
    assistanceStatusText: '领取成功！',
    receiveMessage: '好友太给力了，优惠券已经放入您的账户',
    showTime: false
  });
  // 弹出提示框
  self.toggleMiddlePopup();
}
function handleSuccess(self) {
  // 操作活动状态
  // 操作活动状态
  self.setData({
    assistanceStatus: 'success',
    //start,success,fail,end
    // promptMessage: '邀请' + self.data.helperCount + '位好友助力,助力成功后即可领取！',
    assistanceStatusText: '好友助力完成！',
    receiveMessage: '好友已成功领取\n快来一起发起助力吧',
    hasHelp: true
  });
  // 弹出提示框
  self.toggleMiddlePopup();
}
function handleUserLogin() {
  const self = this;
  let userInfo = app.globalData.userInfo;
  if (userInfo) {
    // 用户已登录
    if (options.id) {
      getById(options.id);
    } else {
      getInstanceOnline(helpActivityId);
    }
  }
}
function confirmCreate() {
  const self = this;
  if (helpActivityId != null) {
    // 查询当前用户是否有进行中的实例
    getInstanceOnline(helpActivityId);
  }
  toggleMiddlePopup();
}
function confirmCreateAgain() {
  const self = this;
  if (helpActivityId != null) {
    // 查询当前用户是否有进行中的实例
    createAgain = true;
    getInstanceOnline(helpActivityId);
  }
}
function getSharePictures() {
  UTILS.getSharePictures('HELP_COUPON').then(res => {
    state.sharePictures = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function showAllJoinPeople() {
  console.log(state.showAll);
  const self = this;
  state.showAll = true;
  state.helperNum = state.helperCount;
  state.helperJoinNum = state.helperJoinTotal;
}
function hiddenAllJoinPeople() {
  console.log(state.showAll);
  const self = this;
  state.showAll = false;
}
function helpFriend() {
  const self = this;
  if (helpActivityInstance.status === "CREATE") {
    // 只有进行中的才可以参加助力
    help(helpActivityInstance.id);
  } else {
    // 活动已过期，提示活动已结束
    console.log("活动已过期，提示活动已结束");
    handleActivityEnd(self);
  }
}
function toAuthorization() {
  let opts = "?from=index";
  NAVPAGE.toAuthorize(opts);
}
function getOtherActivityBanner(helpActivityId) {
  const that = this;
  let params = {
    bannerType: 'HELP_ACTIVITY',
    helpActivityId: helpActivityId,
    storeId: app.globalData.storeInfo.id
  };
  bannerService.unifiedGetBannerList(params).then(res => {
    if (!res) {
      return;
    }
    state.otherActivities = res;
  });
}
function bannerJumping(e) {
  const that = this;
  let bannerId = e.currentTarget.dataset.id;
  const bannerList = state.otherActivities;
  let advertisementInfo = bannerList.filter(value => value.id === bannerId)[0];
  console.log(advertisementInfo);
  NAVPAGE.toAdPage(advertisementInfo, 'banner');
}
</script>
<style scoped>
/* pages/mallModule/activity/assistanceCoupon/assistanceCoupon.wxss */

page {
  background: #faefd8;
  padding-top: 70rpx;
}

.main {
  width: 700rpx;
  min-height: 886rpx;
  background: #fff;
  border-radius: 20rpx;
  margin: 0 auto 28rpx auto;
  padding-bottom: 32rpx;
  position: relative;
  z-index: 0;
}

.trapezoid {
  width: 480rpx;
  height: 80rpx;
  margin: 0 auto;
  position: relative;
  font-size: 34rpx;
  color: #fff;
  line-height: 80rpx;
  text-align: center;
  /* overflow: hidden; */
}
.trapezoid image {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  height: 80rpx;
}
.trapezoid text {
  position: relative;
}
/* .trapezoid::before {
  content: '';
  background: #ffb24c;
  position: absolute;
  display: block;
  width: 410rpx;
  height: 74rpx;
  left: 19rpx;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  border-radius: 0 0 24rpx 24rpx;
  transform: scaleY(1.3) perspective(36rpx) rotateX(-5deg);
} */

.propagate {
  font-size: 44rpx;
  line-height: 50rpx;
  color: #444;
  text-align: center;
  margin: 42rpx 0 33rpx 0;
}

.propagate .num {
  color: #f00;
}

.coupon-box {
  /* width: 480rpx; */
  width: 626rpx;
  height: 338rpx;
  margin: 0 auto;
  position: relative;
}

.coupon-box .coupon-name {
  font-size: 30rpx;
  line-height: 40rpx;
  color: #fda029;
  display: block;
  width: 100%;
  text-align: center;
  margin: 15rpx 0;
}

.friend-box {
  width: 626rpx;
  min-height: 232rpx;
  background: rgba(250, 239, 216, 0.8);
  border-radius: 10rpx;
  margin: 0 auto;
  padding-bottom: 30rpx;
}

.friend-box .invite-title {
  font-size: 30rpx;
  color: #fda029;
  text-align: center;
  line-height: 42rpx;
  padding: 16rpx 0 10rpx 0;
}

.friend-box .invite-bottom {
  font-size: 30rpx;
  color: #fda029;
  text-align: center;
  line-height: 42rpx;
  padding: 14rpx 0 11rpx 0;
}

.assistance-list {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
}

.assistance-item {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin: 13rpx 18rpx;
}

.assistance-item image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.button-box {
  width: 626rpx;
  min-height: 20rpx;
  margin: 0 auto;
}

.button-box button {
  height: 100%;
  height: 90rpx;
  background: transparent;
  font-size: 38rpx;
  color: #fff;
  line-height: 90rpx;
  background: linear-gradient(0deg, rgba(251, 171, 69, 1), rgba(255, 108, 0, 1));
  box-shadow: 0 4rpx 6rpx 0rpx rgba(255, 143, 0, 0.3);
  border-radius: 45rpx;
}

.back-mall-button {
  width: 626rpx;
  height: 88rpx;
  border: 2rpx solid #ff8f00;
  border-radius: 44rpx;
  margin: 28rpx auto 0;
  background: transparent;
  font-size: 38rpx;
  line-height: 88rpx;
  color: #ff8f00;
}

.button-box button::after,
.back-mall-button::after {
  border: none;
}

.prompt-message {
  font-size: 30rpx;
  line-height: 48rpx;
  margin-top: 30rpx;
  color: #676767;
  text-align: center;
}

.rule-box {
  margin-top: 44rpx;
}

.rule-title {
  font-size: 36rpx;
  line-height: 48rpx;
  color: #ff7200;
  padding: 0 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rule-title .line {
  display: block;
  width: 108rpx;
  height: 2rpx;
  background: #ff7200;
}

.rule-title .text {
  margin: 0 24rpx;
}

.rule-con {
  padding: 20rpx 50rpx 8rpx;
}

.rule-con view {
  font-size: 24rpx;
  line-height: 48rpx;
  color: #333;
  padding-left: 37rpx;
  position: relative;
  display: block;
}

.rule-con image {
  width: 18rpx;
  height: 24rpx;
  position: absolute;
  left: 0;
  top: 12rpx;
}

/* 助力成功弹窗 */

.popup-box {
  width: 670rpx;
  height: 586rpx;
  background: #fff;
  border-radius: 20rpx;
  position: relative;
}

.popup-close-box {
  position: absolute;
  right: 13rpx;
  top: 17rpx;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.popup-close-box image {
  width: 24rpx;
  height: 24rpx;
}

.popup-trapezoid {
  width: 670rpx;
  height: 87rpx;
  margin: 0 auto;
  position: relative;
  font-size: 40rpx;
  color: #fff;
  line-height: 80rpx;
  text-align: center;
  /* overflow: hidden; */
}

.popup-trapezoid image {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  height: 80rpx;
}
/* .popup-trapezoid::before {
  content: '';
  background: #ffb24c;
  position: absolute;
  display: block;
  width: 332rpx;
  height: 80rpx;
  left: 19rpx;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 0 0 24rpx 24rpx;
  transform: scaleY(1.3) perspective(36rpx) rotateX(-5deg);
} */

.popup-trapezoid text {
  position: relative;
  font-weight: bold;
}

.receive-message {
  font-size: 28rpx;
  line-height: 48rpx;
  margin: 46rpx auto 20rpx;
  text-align: center;
  max-width: 100%;
}

.activity-state-box {
  font-size: 44rpx;
  line-height: 50rpx;
  width: 90%;
  color: #121212;
  text-align: center;
  margin: 134rpx auto 107rpx auto;
}

.popup-coupon-box {
  width: 625rpx;
  height: 248rpx;
  margin: 0 auto;
  position: relative;
}

.new-coupon {
  width: 332rpx;
  height: 211rpx;
  margin: 0 auto;
  position: relative;
  display: block;
}

.popup-button-box {
  margin-top: 30rpx;
}

.popup-button-box button {
  width: 439rpx;
  height: 88rpx;
  background: linear-gradient(0deg, rgba(251, 171, 69, 1), rgba(255, 108, 0, 1));
  box-shadow: 0 4rpx 6rpx 0 rgba(255, 143, 0, 0.3);
  border-radius: 44rpx;
  color: #fff;
  font-size: 38rpx;
  line-height: 88rpx;
}

.popup-button-box button::after {
  background: transparent;
  border: none;
}

.popup-tips {
  font-size: 28rpx;
  line-height: 48rpx;
  margin-top: 15rpx;
  color: #666666;
  text-align: center;
}

/* 券样式 */
.coupon-item {
  width: 626rpx;
  height: 240rpx;
  padding: 19rpx;
  box-sizing: border-box;
  position: relative;
  text-align: center
}

.coupon-item .coupon-item-bg {
  width: 626rpx;
  height: 240rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.coupon-item-top {
  position: relative;
  height: 140rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.coupon-item-top image {
  width: 70rpx;
  height: 46rpx;
  margin-top: 10rpx;
}

.coupon-item-top>text {
  display: block;
  position: relative;
}

.coupon-item-top .name {
  font-size: 32rpx;
  line-height: 42rpx;
  color: #454545;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  font-size: 22rpx;
  /* line-height: 26rpx; */
  color: #8b8b8c;
  margin-top: 8rpx;
}

.coupon-item-bottom {
  position: absolute;
  height: 65rpx;
  line-height: 54rpx;
  bottom: 20rpx;
  left: 40rpx;
  width: 550rpx;
}

.coupon-item-bottom .condition {
  font-size: 20rpx;
  line-height: 54rpx;
  display: inline-block;
  color: #8b8b8c;
  width: 400rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popup-coupon-box .coupon-item {
  width: 625rpx;
  height: 244rpx;
  /* padding: 12rpx 12rpx 12rpx 30rpx; */
  padding: 12rpx;
}

.popup-coupon-box .coupon-item-top image {
  width: 58rpx;
  height: 46rpx;
  margin-top: 10rpx;
}

.popup-coupon-box .coupon-item .coupon-item-bg {
  width: 625rpx;
  height: 244rpx;
}

.popup-coupon-box .coupon-item-top .name {
  font-size: 32rpx;
}

.popup-coupon-box .coupon-item-top .time {
  font-size: 15rpx;
}

.popup-coupon-box .coupon-item-bottom {
  left: 30rpx;
}

.popup-coupon-box .coupon-item-bottom .condition {
  width: 320rpx;
  font-size: 16rpx;
}


.banner-box {
  width: 100%;
  padding: 0 40rpx;
  box-sizing: border-box;
  margin-top: 30rpx;
}

.swiper {
  width: 100%;
  height: 360rpx;
}

.swiper-item {
  width: 100%;
  height: 360rpx;
  margin-right: 40rpx;
}

/* .swiper .wx-swiper-dot-active {
  width: 24rpx;
  border-radius: 6rpx;
  background: #FF7E00;
}

.swiper .wx-swiper-dot-active::before {
  background: #FF7E00;
} */

.banner-box image {
  width: 100%;
  height: 360rpx;
  display: block;
}

/* 弹框券样式 */

</style>