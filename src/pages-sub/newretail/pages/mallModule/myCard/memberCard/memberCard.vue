<template>
<!-- pages/memberCard/memberCard.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content" :style="'padding-bottom: ' + (state.qrpay ? 70 : 0) + 'rpx;'">
  <view class="card-box">
    <view class="member-card">
      <image mode="widthFix" :src="state.memberGrade.gradePicture ? state.memberGrade.gradePicture : state.imagesPath.memberCard"></image>
    </view>
    <view class="member-code-box" v-if="state.isMember">
      <text>{{state.codeType == 'BARCODE' ? '向收银员出示会员码' : '向收银员出示会员码付款'}}</text>
      <view class="barcode-box" v-if="state.codeType == 'BARCODE'">
        <canvas id="mbrbarcode" type="2d" :hidden="state.canvasHidden">
      </canvas></view>
      <view class="qrcode-box" v-else-if="state.codeType != 'BARCODE'">
        <canvas id="mbrqrcode" type="2d" :hidden="state.canvasHidden">
      </canvas></view>
      <text :style="'margin-top:' + (state.codeType == 'BARCODE' ? '25rpx' : '20rpx')">{{state.memberId}}</text>
      <view class="refresh" @click="refreshMbrCode" v-if="state.codeType != 'BARCODE'">
        <image :src="state.imagesPath.iconRefresh2"></image>
        会员码将在{{state.updateTimeText}}后自动刷新
      </view>
    </view>
    <view class="pay-btn" @click="toPayCode" v-if="state.qrpay">去付款</view>
    <!-- <view class="bind-card-tip">绑卡立得50元优惠券</view> -->
    <view class="other-pay" v-if="state.showPayType && !state.qrpay && state.codeType == 'BARCODE' && (state.isBlancePay || state.isScorePay || state.isWxPay)">使用其他方式付款</view>
    <view class="pay-box" v-if="state.showPayType && !state.qrpay">
      <view class="pay-item" @click="tobalancePay" v-if="state.codeType == 'BARCODE' && state.isBlancePay">
        <image :src="state.imagesPath.iconBalancePay"></image>
        <text>储值支付</text>
      </view>
      <view class="pay-item" @click="toMyGiftCard">
        <image :src="state.imagesPath.iconMemberQRPay"></image>
        <text>礼品卡支付</text>
      </view>
      <view class="pay-item" @click="toWeixinPay" v-if="state.isWxPay">
        <image :src="state.imagesPath.iconWeixinPay"></image>
        <text>微信支付</text>
      </view>
    </view>
  </view>
  <button v-if="!state.hasUserInfo" class="authorization" @click="getUserInfo"></button>
  <button v-else-if="!state.isMember" class="authorization" @click="toAuthorize"></button>
</view>
<image class="movable-view" v-if="state.homeBack" :src="state.imagesPath.toHome" @click="toHome"></image>
<view class="block"></view>
<view class="banner-box" v-if="state.banners.length > 0">
  <view class="banner-wrap">
    <swiper class="swiper" autoplay="true" interval="5000" circular="true">
      <view v-for="(item , index) in state.banners" :key="index">
        <swiper-item class="swiper-item" :data-id="item.id" @click="bannerJumping">
          <image :src="item.pictureUrl" class="slide-image"></image>
        </swiper-item>
      </view>
    </swiper>
  </view>
</view>
<popup :show="state.show.middle" position="middle" custom-class="middle" @close="toggleMiddlePopup">
  <view :class="'popup-content ' + (state.redPacket ? 'received' : 'open')" v-if="state.redPacket">
    <image class="redPacket-bg" :src="state.imagesPath.iconRedPacket2"></image>
    <view class="popup-content-box">
      <image class="popup-content-open" :animation="state.animationRotate" :src="state.imagesPath.iconDismantling" @click="openRedPacket"></image>
      <text class="popup-content-tips">恭喜您，收到一个神秘红包！</text>
    </view>
  </view>
  <view :class="'popup-content ' + (state.redPacket ? 'received' : 'open')" v-if="!state.redPacket">
    <image class="redPacket-bg" :src="state.imagesPath.iconRedPacketTop" mode="widthFix"></image>
    <view class="popup-content-top" :animation="state.animationData" :hidden="state.popupTop">
      <image class="popup-content-top-bg" :src="state.imagesPath.iconRedPacketTop2"></image>
      <view class="title">
        <image :src="state.imagesPath.iconRedPacketSpot"></image>
        <text>恭喜您获得</text>
        <image :src="state.imagesPath.iconRedPacketSpot"></image>
      </view>
      <view class="total">
        <text>{{state.moneyAmount}}</text>
        元
      </view>
      <text class="tips">仅限当天使用</text>
      <image class="red-packet-member" :src="state.imagesPath.iconRedPacketMember" mode="widthFix"></image>
    </view>
    <view class="popup-content-bottom">
      <image class="popup-bottom-bg" :src="state.imagesPath.iconRedPacketBottom"></image>
      <button open-type="share">通知亲朋好友</button>
      <view @click="toRedPacket">红包记录</view>
    </view>
  </view>
</popup>
</template>
<script setup>
import _apiBannerServiceJs from "@/service/api/newretail/bannerService";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsSelfJs from "@/utils/newretail/self";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _apiRedPacketServiceJs from "@/service/api/newretail/redPacketService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/memberCard/memberCard.js
const redPacketService = _apiRedPacketServiceJs;
const NavigationBar = _componentsNavigationBarNavigationBarJs;
const memberService = _apiMemberServiceJs;
const orderService = _apiOrderServiceJs;
const storeService = _apiStoreServiceJs;
const productService = _apiProductServiceJs;
const wxbarcode = _utilsSelfJs;
const util = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const AUTHORIZE = _utilsAuthorizeJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const bannerService = _apiBannerServiceJs;
const state = reactive({
  skipPage: false,
  showPayType: false,
  navigationBarTitle: "会员码",
  imagesPath: IMGAGESPATH,
  memberId: '',
  memberCode: "",
  codeWidth: 586,
  codeHeight: 174,
  hasUserInfo: false,
  isMember: false,
  time: '',
  codeType: 'BARCODE',
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false
  },
  redPacket: true,
  animationData: {},
  animationRotate: {},
  moneyAmount: '0.00',
  homeBack: false,
  popupTop: true,
  phone: false,
  qrpay: false,
  systemOptions: {},
  orderTimer: 0,
  isScorePay: false,
  isBlancePay: false,
  isWxPay: false.allPrice,
  userInfo: null,
  member: null,
  isVIP: false,
  vipGradeConfig: null,
  memberGrade: null,
  canvasHidden: false,
  banners: [],
  storeId: "",
  oldUpdateTime: null,
  updateTime: null,
  updateTimeText: ''
});
function toHome() {
  NAVPAGE.toHome();
}
function toPayCode() {
  NAVPAGE.toPayCode();
}
function getTimeFn(newVal) {
  if (newVal && state.updateTime) {
    state.oldUpdateTime += 1000;
    if (state.updateTime < newVal) {
      state.updateTimeText = '';
    } else {
      let diff = state.updateTime - state.oldUpdateTime;
      const date = new Date(diff);
      const H = Math.floor(diff / 1000 / 3600);
      const M = date.getUTCMinutes();
      const S = date.getUTCSeconds();
      state.updateTimeText = (H ? H + '小时' : '') + M + '分' + S + '秒';
    }
  }
}
function refreshMbrCode() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    if (state.codeType !== 'BARCODE') {
      getMbrCode();
      state.oldUpdateTime += 1000;
      state.updateTimeText = '';
    }
  } else {
    console.log();
    uni.showToast({
      title: '您还没有登陆哦~',
      icon: 'none',
      duration: 2000
    });
  }
}
function getMbrCode() {
  const that = this;
  clearTimeout(state.time);
  if (!state.memberGrade) {
    getMemberGrade();
  }
  memberService.getMbrCode().then(res => {
    console.log(res);
    res.code = res.code ? res.code : app.globalData.userInfo.member.mobile;
    let codeType = state.codeType;
    if (res.expiresInSeconds && codeType === 'BARCODE') {
      codeType = "PAYCODE";
    }
    if (res.expiresInSeconds) {
      let time = new Date().getTime();
      state.oldUpdateTime = time;
      state.updateTime = time ? time + res.expiresInSeconds * 1000 : null;
    }
    if (codeType === 'BARCODE') {
      state.memberId = res.code;
      state.memberCode = res.code;
      state.codeType = codeType;
    } else {
      state.memberId = res.code;
      state.memberCode = res.code;
      state.codeType = codeType;
    }
    if (codeType === 'BARCODE') {
      setTimeout(() => {
        wxbarcode.barcode('mbrbarcode', res.code, state.codeWidth, state.codeHeight);
      }, 1000);
    } else {
      wxbarcode.qrcode('mbrqrcode', res.code, 280, 280);
    }
    state.memberId = phoneSeparated(res.code);
    if (state.codeType !== 'BARCODE' && res.expiresInSeconds) {
      let expiresInSecondsTime = res.expiresInSeconds * 1000;
      let now = new util.ResponseDate().getTime();
      let expiresInSeconds = now + res.expiresInSeconds * 1000;
      let data = {
        code: res.code,
        expiresInSeconds: expiresInSeconds
      };
      try {
        uni.setStorageSync('wj_payCodeTime', data);
      } catch (e) {}
      let time = setTimeout(() => {
        getMbrCode();
        console.log('刷新了');
      }, expiresInSecondsTime);
      state.time = time;
    }
    getCacheOrder();
    return res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getBannersList(storeId) {
  // MEMBER_CENTER
  bannerService.getStoreBannerList('MEMBER_CODE_PAGE ', storeId).then(res => {
    if (res) {
      state.banners = res;
    }
  }).catch(err => {
    console.log("获取图片失败");
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function bannerJumping(e) {
  const that = this;
  let bannerId = e.currentTarget.dataset.id;
  const bannerList = state.banners;
  let advertisementInfo = null;
  bannerList.forEach(item => {
    if (item.id === bannerId) {
      advertisementInfo = item;
    }
  });
  toAdPage(advertisementInfo, 'banner');
}
function toAdPage(pageInfo, pageType) {
  const that = this;
  if (pageInfo.linkType === 'APP') {
    // 应用
    // 判断跳转模块
    if (pageInfo.appReturnType === "PRODUCT_MENU") {
      //跳转商品分类页面
      NAVPAGE.toCategory("?categoryId=" + pageInfo.productMenuId);
    } else if (pageInfo.appReturnType === 'MIAOSHA') {
      NAVPAGE.toSeckill();
    } else if (pageInfo.appReturnType === "RECHARGE") {
      NAVPAGE.toRecharge();
    } else if (pageInfo.appReturnType === "MEAL") {
      //  餐饮
    } else if (pageInfo.appReturnType === "RECEIVECOUPON") {
      // 领券中心
      NAVPAGE.toCouponCenter();
    } else if (pageInfo.appReturnType === "ADVANCE_SELL_PRODUCT") {
      // 预售商品
      if (pageInfo.activityId) {
        let opts = '?productId=' + pageInfo.productId + '&advanceId=' + pageInfo.activityId + '&type=advanceSell';
        NAVPAGE.toGoodsDetails(opts);
      } else {
        NAVPAGE.toAdvanceSell();
      }
    } else if (pageInfo.appReturnType === "TEAM_BUYING") {
      // 团购
      NAVPAGE.toFightGroup();
    } else if (pageInfo.appReturnType === "SCOREMALL") {
      // 积分商场
      NAVPAGE.toScoreMall();
    } else if (pageInfo.appReturnType === "INVITE_MEMBER") {
      // 邀请好友
      NAVPAGE.toInvite();
    } else if (pageInfo.appReturnType === "MEMBER_CARD") {
      // 会员卡
      //如果首页开启付款码，则不到会员码页面，点击直接跳转付款码页面
      if (state.uiconfig.isHomePayCodeEnabled) {
        NAVPAGE.toPayCode();
      } else {
        NAVPAGE.toMemberCard();
      }
    } else if (pageInfo.appReturnType === "MY_COUPON") {
      // 我的优惠券
      NAVPAGE.toMyCoupon();
    } else if (pageInfo.appReturnType === "NEWMBR") {
      // 新用户专享
      NAVPAGE.toNewmbrActivity();
    } else if (pageInfo.appReturnType === 'GIFTCARD') {
      // 如果跳转类型是礼品卡，跳转到礼品卡界面
      NAVPAGE.toGiftCardCenter();
    } else if (pageInfo.appReturnType === "HELP_COUPON") {
      // 助力送券
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        if (pageInfo.helpActivityId != null) {
          helpActivityService.getHelpActivityById(pageInfo.helpActivityId).then(res => {
            if (res.status === "SUBMITED") {
              let opts = "?helpActivityId=" + pageInfo.helpActivityId;
              NAVPAGE.toAssistanceCoupon(opts);
            } else if (res.status === "FINISHED") {
              uni.showToast({
                title: '您来晚了，助力活动已结束~',
                icon: 'none'
              });
            } else if (res.status === "CREATED") {
              uni.showToast({
                title: '助力活动还没有开始哦~',
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: '当前助力活动不在进行中~',
                icon: 'none'
              });
            }
          }).catch(err => {
            console.log("查询进行中的助力送券活动出错：" + err.message);
            uni.showToast({
              title: '当前没有正在进行中的活动哦~',
              icon: 'none'
            });
          });
        }
      } else {
        uni.showToast({
          title: '您还不是会员，请绑定手机号成为会员~',
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          NAVPAGE.toAuthorize();
        }, 2000);
      }
    } else if (pageInfo.appReturnType === "CREDIT_CARD") {
      // 申请办卡
      NAVPAGE.toCreditCard();
    } else if (pageInfo.appReturnType === "BARGAIN") {
      // 砍价模块
      NAVPAGE.toBargainList();
    } else if (pageInfo.appReturnType === "PENNY") {
      // 购物抽奖
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toPennyList();
      } else {
        NAVPAGE.toAuthorize();
      }
    } else if (pageInfo.appReturnType === "RECHARGE_DRAW") {
      // 充值抽奖
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toLotteryIndex();
      } else {
        NAVPAGE.toAuthorize();
      }
    } else if (pageInfo.appReturnType === "NOTICE") {
      // 系统公告
      NAVPAGE.toSysNotice();
    } else if (pageInfo.pageUrl) {
      uni.navigateTo({
        url: pageInfo.pageUrl
      });
    }
  } else if (pageInfo.linkType === "FEEDBACK") {
    //跳转意见反馈页面
    NAVPAGE.toFeedback();
  } else if (pageInfo.linkType === 'GRADPRODUCT') {
    // 秒杀商品
    let opts = '?productId=' + pageInfo.productId + '&storeId=' + app.globalData.storeInfo.id + '&activityId=' + pageInfo.grabActivityId + '&type=secondkill';
    NAVPAGE.toGoodsDetails(opts);
  } else if (pageInfo.linkType === 'PRODUCT') {
    // 商品 
    let opts = '?productId=' + pageInfo.productId + '&storeId=' + app.globalData.storeInfo.id + '&type=normal';
    NAVPAGE.toGoodsDetails(opts);
  } else if (pageInfo.linkType === 'TEAMPRODUCT') {
    // 拼团商品 
    let opts = '?productId=' + pageInfo.teamActivityId + '&storeId=' + app.globalData.storeInfo.id + '&type=group';
    NAVPAGE.toGoodsDetails(opts);
  } else if (pageInfo.linkType === "GIFTCARDACTIVITYDETAILS") {
    // 如果跳转类型是礼品卡详情，根据giftcardActivityId跳转到礼品卡详情页
    let opts = '?giftCardActivityId=' + pageInfo.giftcardActivityId;
    NAVPAGE.toGiftCardBuy(opts);
  } else if (pageInfo.linkType === 'COUPONACTIVITYDETAILS') {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        let opts = '?couponActivityId=' + pageInfo.couponActivityId + '&type=assign&isExternal=false';
        NAVPAGE.toCouponDetails(opts);
      } else {
        uni.showToast({
          title: '您还不是会员，请绑定手机号成为会员~',
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          NAVPAGE.toAuthorize();
        }, 2000);
      }
    } else {
      NAVPAGE.toAuthorize();
    }
  } else if (pageInfo.linkType === 'URL') {
    // 链接
    let url = pageInfo.linkUrl;
    if (!url) {
      return false;
    }
    let index = '?';
    let webUrl = url;
    if (url.indexOf(index) > -1) {
      webUrl = webUrl + '&storeId=' + state.storeId + '&type=normal';
      if (app.globalData.TENANT && webUrl.indexOf("tenant") < 0) {
        webUrl = webUrl + '&tenant=' + app.globalData.TENANT;
      }
    }
    let urlData = {
      url: encodeURIComponent(webUrl)
    };
    console.log(webUrl, urlData);
    let jsonUrl = JSON.stringify(urlData);
    let opts = '?webUrl=' + jsonUrl;
    NAVPAGE.toAdvertising(opts);
  } else if (pageInfo.pageUrl) {
    uni.navigateTo({
      url: pageInfo.pageUrl
    });
  } else {}
}
function setMbrCode(res) {
  const that = this;
  console.log(res);
  res.code = res.code ? res.code : app.globalData.userInfo.member.mobile;
  let codeType = state.codeType;
  if (res.expiresInSeconds && codeType === 'BARCODE') {
    codeType = "PAYCODE";
  }
  if (codeType === 'BARCODE') {
    state.memberId = res.code;
    state.memberCode = res.code;
    state.codeType = codeType;
  } else {
    state.memberId = res.code;
    state.memberCode = res.code;
    state.codeType = codeType;
  }
  if (codeType === 'BARCODE') {
    setTimeout(() => {
      wxbarcode.barcode('mbrbarcode', res.code, state.codeWidth, state.codeHeight);
    }, 1000);
  } else {
    wxbarcode.qrcode('mbrqrcode', res.code, 280, 280);
  }
  state.memberId = phoneSeparated(res.code);
}
onLoad(function (options) {
  // wx.hideShareMenu()
  const that = this;
  // 查询系统配置项，根据系统配置项控制列表菜单显示
  let systemOptions = app.globalData.configureInfo;
  let configures = {
    hasRedPacket: false
  };
  let isScorePay = false;
  let isWxPay = false;
  let isBlancePay = false;
  systemOptions.forEach(item => {
    // 根据配置项配置红包功能
    if (item.key === 'hasRedPacket' && item.value != null) {
      item.value === 'TRUE' ? configures.hasRedPacket = true : configures.hasRedPacket = false;
    } else if (item.key === "memberCodeDisplayPayMethod" && item.value != null && item.value !== "") {
      // 会员码展示的付款方式 积分支付：SCOREPAY 微信支付：WXPAY 余额支付：BLANCEPAY(多个以英文逗号分隔)
      const memberCodeDisplayPayMethod = item.value;
      const payMethods = memberCodeDisplayPayMethod.split(",");
      if (payMethods && payMethods.length > 0) {
        payMethods.forEach(it => {
          if (it.indexOf("SCOREPAY") > -1) {
            if (!app.globalData.systemConfigure.showScorePayCode) {
              isScorePay = false;
            } else {
              isScorePay = true;
            }
          } else if (it.indexOf("WXPAY") > -1) {
            isWxPay = true;
          } else if (it.indexOf("BLANCEPAY") > -1) {
            isBlancePay = true;
          }
        });
      }
    }
  });
  state.systemOptions = configures;
  state.isScorePay = isScorePay;
  state.isWxPay = isWxPay;
  state.isBlancePay = isBlancePay;
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig;
  console.log(configures);
  let pageStack = getCurrentPages();
  if (pageStack.length === 1) {
    state.homeBack = true;
  }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    try {
      const payCode = uni.getStorageSync('wj_payCodeTime');
      let now = new util.ResponseDate().getTime();
      if (payCode && now < payCode.expiresInSeconds) {
        setMbrCode(payCode);
        let expiresInSecondsTime = payCode.expiresInSeconds - now;
        console.log(expiresInSecondsTime);
        setTimeout(() => {
          getMbrCode();
        }, expiresInSecondsTime);
      } else {
        getMbrCode();
      }
    } catch (e) {
      console.log(e);
      // Do something when catch error
      // that.getMbrCode()
    }
    state.hasUserInfo = true;
    if (state.systemOptions.hasRedPacket) {
      redPacketService.checkCanJoin().then(res => {
        console.log(res);
        if (res.canJoin) {
          state.acyivityId = res.acyivityId;
          toggleMiddlePopup();
        } else {
          getCacheOrder();
        }
      }).catch(err => {
        console.log(err.message);
        if (err.message !== '您还没有登录哦~') {
          getCacheOrder();
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        }
      });
      let animation = uni.createAnimation({
        duration: 1000
      });
      animation = animation;
    } else {
      getCacheOrder();
    }
  } else {
    state.hasUserInfo = false;
  }
  // 获取当前页面分享图
  getSharePictures();
  // 统计PV
  if (app.globalData.storeInfo) {
    if (app.globalData.storeInfo.id) {
      state.storeId = app.globalData.storeInfo.id;
      getBannersList(state.storeId);
    }
  }
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  if (app.globalData.uiconfig && app.globalData.uiconfig.isHomePayCodeEnabled) {
    state.qrpay = true;
  }
});
function codeTextPartition(val) {
  val = val.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
  return val;
}
function phoneSeparated(phoneNumber) {
  let tel = trim(phoneNumber, 'g');
  if (isPhone(tel)) {
    tel = tel.substring(0, 3) + ' ' + tel.substring(3, 7) + ' ' + tel.substring(7, 11);
  } else {
    tel = codeTextPartition(tel);
  }
  return tel;
  // 去掉字符串中所有空格(包括中间空格,需要设置第2个参数为:g)
  function trim(str, is_global) {
    let result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global && is_global.toLowerCase() == "g") {
      result = result.replace(/\s/g, "");
    }
    return result;
  }
  // 判断是否是手机号码格式
  function isPhone(str) {
    let reg = /^1(3|4|5|7|8)\d{9}$/;
    return reg.test(trim(str, 'g'));
  }
}
function checkAuth(e) {
  console.log(e);
  if (!app.globalData.userInfo) {
    return false;
  } else {
    return true;
  }
}
function toWeixinPay() {
  memberService.getOfflinePaySign().then(res => {
    let sign = JSON.parse(res);
    console.log(sign);
    uni.openOfflinePayView({
      'appId': sign.appId,
      'timeStamp': sign.timeStamp,
      'nonceStr': sign.nonceStr,
      'package': sign.packageValue,
      'signType': 'MD5',
      'paySign': sign.paySign,
      success: function (res) {
        console.log(res.data);
      },
      fail: function (res) {
        console.log(res);
      }
    });
  }).catch(error => {
    console.log(error);
  });
}
function tobalancePay() {
  const that = this;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      // NAVPAGE.toBalancePay();
      uni.navigateTo({
        url: '/pages-sub/newretail/pages/mallModule/member/payment/payment'
      });
    } else {
      uni.showToast({
        title: '您还不是会员，请绑定手机号成为会员~',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        NAVPAGE.toAuthorize();
      }, 2000);
    }
  } else {
    uni.showToast({
      title: '您还没有登录哦~',
      icon: 'icon',
      duration: 2000
    });
  }
}
function toScorePay() {
  const that = this;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      const opts = "?type=score";
      NAVPAGE.toBalancePay(opts);
    } else {
      uni.showToast({
        title: '您还不是会员，请绑定手机号成为会员~',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        NAVPAGE.toAuthorize();
      }, 2000);
    }
  } else {
    uni.showToast({
      title: '您还没有登录哦~',
      icon: 'icon',
      duration: 2000
    });
  }
}
onReady(function () {});
onShow(function () {
  // 判断用户是否授权
  checkUserInfo();
  if (state.orderTimer !== 0) {
    console.log("onShow  getCacheOrder");
    console.log(state.orderTimer);
    getCacheOrder();
  }
  getMbrCode();
});
onHide(function () {
  console.log("onHide");
  clearTimeout(state.orderTimer);
  state.skipPage = false;
});
onUnload(function () {
  console.log("onUnload");
  clearTimeout(state.time);
  clearTimeout(state.orderTimer);
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function (res) {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let sharePictures = state.sharePictures;
  let path = util.getSharePath();
  if (res.from === 'button') {
    // 来自页面内转发按钮
    return {
      title: '现金红包大派送',
      path: path,
      imageUrl: sharePictures,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true
        });
      }
    };
  } else {
    return {
      title: '会员码',
      imageUrl: sharePictures,
      path: path
    };
  }
});
function getSharePictures() {
  util.getSharePictures('RED_PACKATE').then(res => {
    state.sharePictures = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toggleMiddlePopup() {
  toggle('middle');
}
function toggle(type) {
  if (!state.show[type]) {
    // 打开
    setTimeout(() => {
      state.canvasHidden = true;
    }, 100);
     state[`show.${type}`] = !state.show[type];
  } else {
    // 关闭
     state[`show.${type}`] = !state.show[type];
    setTimeout(() => {
      state.canvasHidden = false;
      getCacheOrder();
    }, 100);
  }
}
function toggleNextStep() {
  state.step = 'second';
}
function openRedPacket() {
  redPacketService.openRedPacket(state.acyivityId).then(res => {
    state.moneyAmount = res;
    animation.rotate3d(0, 180, 0, 360).step({
      duration: 1000
    });
    state.animationRotate = animation.export();
    setTimeout(() => {
      state.redPacket = false;
      setTimeout(() => {
        state.popupTop = false;
        animation.currentTransform = [];
        let y = 382 / 750 * {
          // ...wx.getSystemInfoSync(),
          ...uni.getSystemSetting(),
          ...uni.getAppAuthorizeSetting(),
          ...uni.getDeviceInfo(),
          ...uni.getWindowInfo(),
          ...uni.getAppBaseInfo()
        }.windowWidth;
        animation.translate(0, -y).step({
          duration: 1000
        });
        state.animationData = animation.export();
      }, 100);
    }, 1000);
  }).catch(err => {
    if (err.code == '38003') {
      toggleMiddlePopup('middle');
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    } else {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    }
  });
}
function toRedPacket() {
  NAVPAGE.toRedPacket();
}
function handleUserLogin() {
  console.log(app.globalData.userInfo);
  const self = this;
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo;
    state.userInfo = {
      ...user.wxaUser
    };
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true;
      state.isMember = true;
      getMbrCode();
    } else {
      state.hasUserInfo = false;
      handlePopupPhone();
    }
  }
}
function handlePopupPhone() {
  if (!app.globalData.userInfo.member) {
    state.phone = true;
  } else {
    state.phone = false;
    state.hasUserInfo = true;
    getMbrCode();
  }
}
function handleBindPhone(e) {
  console.log(e.detail);
  if (e.detail.bindMobile === true) {
    handlePopupPhone();
  }
}
function checkUserInfo() {
  if (app && app.globalData && app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    state.userInfo = app.globalData.userInfo.wxaUser;
    if (app.globalData.userInfo.member) {
      const res = app.globalData.userInfo;
      let isExpired = false;
      let isVIP = false;
      const now = new util.ResponseDate().getTime();
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
        getMbrCode();
    } else {
      if (state.skipPage) return false;
      state.skipPage = true;
      NAVPAGE.toAuthorize();
    }
  } else {
    state.hasUserInfo = false;
    state.isMember = false;
    state.member = null;
    state.userInfo = null;
    if (state.skipPage) return false;
    state.skipPage = true;
    NAVPAGE.toAuthorize();
  }
}
function getUserInfo(e) {
  AUTHORIZE.login(e).then(res => {
    state.hasUserInfo = true;
    if (res.member) {
      state.isMember = true;
      getMbrCode();
    } else {
      // onLoad = false;
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
function toAuthorize() {
  NAVPAGE.toAuthorize();
}
function getCacheOrder() {
  const that = this;
  clearTimeout(state.orderTimer);
  uni.hideLoading();
  util.setHideLoading(true);
  orderService.getCacheOrder(state.memberCode).then(res => {
    if (res && res.products.length > 0) {
      // 将缓存订单传到下单页面
      const orderJSON = JSON.stringify(res);
      // 添加购物车
      const storeId = res.storeId;
      if (app.globalData.storeInfo && app.globalData.storeInfo.id === res.storeId) {
        orderJump();
      } else if (app.globalData.storeInfo && app.globalData.storeInfo.id !== res.storeId) {
        // 当前门店与APP添加商品的门店不同切换当前门店为APP门店
        storeService.getById(res.storeId).then(res => {
          if (res) {
            app.globalData.storeInfo = res;
            orderJump();
          }
        }).catch(err => {
          console.log("------------查询门店报错");
          console.log(err.message);
        });
      } else {
        storeService.getById(res.storeId).then(res => {
          if (res) {
            app.globalData.storeInfo = res;
            orderJump();
          }
        }).catch(err => {
          console.log("------------查询门店报错");
          console.log(err.message);
        });
      }
      /**
       * 下单跳转
       * 1、添加购物车
       * 2、查询购物车
       * 3、跳转下单页面
       */
      function orderJump() {
        let allPrice = 0;
        const cacheOrderId = res.cacheOrderId;
        let discount = 0;
        let tempList = [];
        let isFictitiousProduct = false; // 是否虚拟商品
        res.products.forEach(item => {
          let tempItem = {
            ...item
          };
          if (res.productDetails && res.productDetails.length > 0) {
            res.productDetails.forEach(ele => {
              if (item.productId === ele.id) {
                tempItem = {
                  ...tempItem,
                  ...ele,
                  sellPrice: ele.sellPrice || ele.originalPrice
                };
                if (state.isVIP && state.vipGradeConfig.openMemberPrice && ele.memberPrice && Number(ele.memberPrice) < Number(ele.sellPrice)) {
                  tempItem.sellPrice = ele.memberPrice;
                  tempItem.useMemberPrice = true;
                }
                if (ele.promotionPrice && Number(ele.promotionPrice) < Number(tempItem.sellPrice)) {
                  tempItem = {
                    ...tempItem,
                    sellPrice: ele.promotionPrice,
                    usePromotionPrice: true,
                    useMemberPrice: false
                  };
                }
                allPrice = allPrice + parseFloat((Number(tempItem.sellPrice) * Number(tempItem.productNum)).toFixed(2));
                tempList.push(tempItem);
              }
            });
          } else {
            if (app.globalData.systemConfigure.fictitiousProductId && item.productId === app.globalData.systemConfigure.fictitiousProductId) {
              isFictitiousProduct = true;
              tempItem = {
                ...tempItem,
                name: "无码商品",
                imageUrl: state.imagesPath.iconOffLine,
                sellPrice: res.allPrice || 0
              };
            }
            tempList.push(tempItem);
            allPrice = res.allPrice || 0;
          }
        });
        try {
          let shopcart = {
            allPrice: allPrice.toFixed(2),
            goodsList: tempList,
            giftProducts: [],
            orderType: 'normal',
            storeId: storeId,
            discount: parseFloat(discount),
            scource: res.scource,
            cacheOrderId: cacheOrderId,
            // 缓存订单id
            type: res.type,
            offlinType: isFictitiousProduct ? "cashReceipt" : "normal",
            inputAmount: res.inputAmount || 0
          };
          uni.setStorageSync('wj_shopcart', shopcart);
          if (res.allPrice >= 0) {
            const opts = "?cacheOrder=" + orderJSON;
            NAVPAGE.toPerfectOrder(opts);
          }
        } catch (e) {
          console.log(e.message);
        }
      }
    } else {
      let orderTimer = setTimeout(() => {
        console.log("轮询缓存订单");
        let page = util.utilGetCurrentPage();
        if (page == that) {
          getCacheOrder();
        } else {
          console.log("当前显示的页面不是index，不调用");
        }
      }, 1000);
      state.orderTimer = orderTimer;
      getTimeFn(new Date().getTime());
    }
  }).catch(err => {
    uni.hideLoading();
    util.setHideLoading(false);
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getMemberGrade() {
  const that = this;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const member = app.globalData.userInfo.member;
    if (app.globalData.memberGrade) {
      state.memberGrade = app.globalData.memberGrade;
    } else {
      if (member.gradeId) {
        memberService.getGradeById(member.gradeId).then(res => {
          app.globalData.memberGrade = res;
          state.memberGrade = res;
        }).catch(err => {
          util.showToast(err.message);
        });
      }
    }
  }
}
</script>
<style scoped>
/* pages/memberCard/memberCard.wxss */

page {
  background: #f3f6ff;
  padding: 56rpx 0;
}

.movable-view {
  width: 120rpx;
  height: 120rpx;
  position: fixed;
  right: 0;
  bottom: 120rpx;
}

.content {
  background: #fff;
  width: 700rpx;
  padding: 60rpx 60rpx 0 60rpx;
  box-sizing: border-box;
  margin: 0 auto;
  box-shadow: 4rpx 6rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pay-btn {
  width: 200rpx;
  height: 70rpx;
  border: 2rpx solid #ff7200;
  color: #ff7200;
  font-size: 30rpx;
  line-height: 70rpx;
  text-align: center;
}

/* 绑卡提示 */
.bind-card-tip {
  color: #ff7200;
  margin: 20rpx 0rpx;
  font-size: 29rpx;
}

.member-card {
  width: 586rpx;
  height: 346rpx;
  border-radius: 14rpx;
  box-sizing: border-box;
  display: flex;
}

.member-card image {
  width: 100%;
  height: 100%;
}

.card-img-box {
  width: 86rpx;
  height: 86rpx;
  background-color: transparent;
  border-radius: 50%;
  vertical-align: top;
  margin-right: 24rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-img {
  width: 76rpx;
  vertical-align: middle;
}

.card-text {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  line-height: 36rpx;
}

.card-text>text {
  color: #fff;
}

.card-text>text:first-of-type {
  font-size: 26rpx;
  margin-bottom: 6rpx;
  margin-top: 4rpx;
}

.card-text>text:last-of-type {
  font-size: 28rpx;
}

.member-code-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.member-code-box .barcode-box {
  width: 586rpx;
  height: 174rpx;
}

.member-code-box .barcode-box canvas {
  width: 586rpx;
  height: 174rpx;
}

.qrcode-box {
  width: 280rpx;
  height: 280rpx;
  /* display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative; */
}

.qrcode-box canvas {
  width: 280rpx;
  height: 280rpx;
}

.member-code-box>text {
  font-size: 28rpx;
  color: #727272;
  line-height: 36rpx;
}

.member-code-box>text:first-of-type {
  margin-top: 30rpx;
  margin-bottom: 24rpx;
}

.member-code-box>text:last-of-type {
  font-size: 36rpx;
  line-height: 42rpx;
  color: #333;
  margin-top: 25rpx;
  margin-bottom: 28rpx;
}

.member-code-box .refresh {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #bcbcbc;
  margin-top: -20rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
}

.member-code-box .refresh image {
  width: 28rpx;
  height: 28rpx;
  margin-right: 12rpx;
}

.card-box {
  width: 700rpx;
  padding: 60rpx 60rpx 70rpx 60rpx;
  box-sizing: border-box;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.other-pay {
  font-size: 28rpx;
  line-height: 36rpx;
  position: relative;
  color: #949494;
  padding: 0 20rpx;
  display: inline-block;
  margin-top: 30rpx;
}

.other-pay::after {
  content: '';
  position: absolute;
  width: 154rpx;
  height: 1px;
  background: #949494;
  right: -154rpx;
  top: 18rpx;
}

.other-pay::before {
  content: '';
  position: absolute;
  width: 154rpx;
  height: 1px;
  background: #949494;
  left: -154rpx;
  top: 18rpx;
}

.pay-box {
  margin-top: 70rpx;
  display: flex;
  justify-content: center;
  width: 100%;
}

.pay-item {
  height: 50rpx;
  line-height: 50rpx;
  border-right: 1rpx solid #fdf0db;
  padding: 0 16rpx;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.pay-item:first-of-type {
  padding-left: 0;
}

.pay-item:last-of-type {
  border: none;
  padding-right: 0;
}

.pay-item image {
  width: 50rpx;
  height: 50rpx;
  margin-right: 9rpx;
  vertical-align: middle;
}

.pay-item text {
  font-size: 28rpx;
  color: #313131;
}

.popup-content {
  position: relative;
  width: 613rpx;
}

.popup-content-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

.popup-content-open {
  width: 167rpx;
  height: 167rpx;
  margin-top: 222rpx;
}

.popup-content-box .popup-content-tips {
  color: #e4d999;
  font-size: 33rpx;
  line-height: 40rpx;
  margin-top: 145rpx;
}

.received {
  height: 712rpx;
}

.open {
  height: 779rpx;
}

.redPacket-bg {
  width: 100%;
  height: 712rpx;
  position: absolute;
  left: 0;
  top: 0;
}

.open .redPacket-bg {
  height: 375rpx;
  top: 28rpx;
}

.popup-content-top {
  width: 529rpx;
  height: 439rpx;
  position: absolute;
  top: 382rpx;
  left: 50%;
  margin-left: -264rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 0;
}

.popup-content-top-bg {
  width: 100%;
  height: 439rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.popup-content-top .title {
  font-size: 34rpx;
  line-height: 48rpx;
  color: #b88154;
  position: relative;
  margin-top: 35rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popup-content-top .title text {
  margin: 0 34rpx;
}

.popup-content-top .title image {
  width: 19rpx;
  height: 19rpx;
}

.popup-content-top .total {
  color: #f15f50;
  font-size: 42rpx;
  line-height: 76rpx;
  height: 76rpx;
  display: flex;
  align-items: baseline;
  margin: 52rpx 0 3rpx 0;
  position: relative;
}

.popup-content-top .total text {
  font-size: 76rpx;
  font-weight: bold;
  color: #f15f50;
}

.popup-content-top .tips {
  color: #f15f50;
  font-size: 32rpx;
  line-height: 48rpx;
  margin-bottom: 34rpx;
  position: relative;
}

.red-packet-member {
  width: 160rpx;
  height: 51rpx;
  position: relative;
}

.popup-content-bottom {
  width: 613rpx;
  height: 519rpx;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 9;
}

.popup-bottom-bg {
  width: 100%;
  height: 519rpx;
  position: absolute;
  left: 0;
  top: 0;
}

.popup-content-bottom button {
  color: #e4da99;
  border: 3rpx solid #e4da99;
  background: transparent;
  border-radius: 45rpx;
  width: 474rpx;
  height: 90rpx;
  margin-top: 277rpx;
  font-size: 34rpx;
  line-height: 90rpx;
}

.popup-content-bottom view {
  color: #e4d999;
  font-size: 34rpx;
  line-height: 48rpx;
  margin-top: 72rpx;
  position: relative;
}

button.authorization {
  width: 100% !important;
  height: 100% !important;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
}

button.authorization::after {
  border: none;
}

.block {
  width: 100%;
  height: 50rpx;
}

.banner-box {
  background: #fff;
  width: 700rpx;
  margin: 0 auto;
  box-shadow: 4rpx 6rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
}

.banner-box .banner-wrap {
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
}

.banner-box .swiper {
  border-radius: 18rpx;
  overflow: hidden;
}

.banner-box .swiper-item image {
  width: 100%;
  height: 100%;
}
</style>