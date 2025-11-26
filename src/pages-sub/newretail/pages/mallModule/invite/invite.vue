<template>
<!--pages/mallModule/invite/invite.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="page" :style="'height:calc(100% - ' + state.navHeight + 'px);' + pageBg">
  <view class="activity-top">
    <view class="activity-logo"></view>
    <view class="activity-rule" @click="clickActivity">
      <image :src="state.activityRulesBtn"></image>
    </view>
  </view>
  <view class="activity-title">
    <view class="activity-title-img">
      <image :src="state.inviterActivityTitle" v-if="state.entrance === 'inviter'" mode="widthFix"></image>
      <image :src="state.inviteeActivityTitle" v-if="state.entrance === 'invitee'" mode="widthFix"></image>
      <image :src="state.receiveActivityTitle" v-if="state.entrance === 'success'" mode="widthFix"></image>
    </view>
    <!-- <view class='activity-text' wx:if="{{entrance === 'inviter'}}">同享5折券</view> -->
  </view>
  <view class="activity-body inviter" v-if="state.entrance === 'inviter'">
    <image :src="state.inviterActivityPrize" mode="widthFix"></image>
  </view>
  <view class="activity-body invitee" v-if="state.entrance === 'invitee' || state.entrance === 'success'">
    <image class="invitee-info-input-bg" :src="state.inviteeInfoInputBg" mode="widthFix" v-if="state.entrance === 'invitee'"></image>
    <image class="invitee-info-input-bg" :src="state.receiveShowPrizeBg" mode="widthFix" v-if="state.entrance === 'success'"></image>
    <!-- <view class="mobile-box" wx:if="{{state.inviteStatus !== 'success'}}">
      <view class='section'>
        <input type="number" bindinput="bindMobileInput" bindfocus="handleBindFocus" bindblur="handleBindBlur" placeholder="请输入手机号码" cursor-spacing="86px" focus maxlength="11"></input>
        <label catchtap="getCaptcha" style="background: {{state.getCodeBgColor}}">{{state.getCodeBtn}}</label>
      </view>
      <view class='section'>
        <input type="password" cursor-spacing="10px" bindinput="bindcaptchaInput" bindfocus="handleBindFocus" bindblur="handleBindBlur" placeholder="请输入验证码" maxlength="6"></input>
      </view>
    </view> -->
    <view class="voucher" v-if="state.inviteStatus !== 'success'">
      <image :src="state.receiveImmediateUseBtn" mode="widthFix" v-if="state.entrance === 'success'"></image>
      <image :src="state.inviteeReceiveBtn" mode="widthFix" v-else></image>
      <button class="authorization" @click="getUserInfo"></button>
    </view>
    <view class="voucher" :hidden="state.inviteStatus !== 'success'" @click="toIndex">
      <image :src="state.receiveImmediateUseBtn" mode="widthFix"></image>
    </view>
  </view>
  <button class="activity-btn" v-if="state.entrance === 'inviter' && state.hasUserInfo" open-type="share">
    <image :src="state.inviterShareBtn" mode="widthFix"></image>
  </button>
  <button class="activity-btn" v-if="state.entrance === 'inviter' && !state.hasUserInfo" @click="toShare">
    <image :src="state.inviterShareBtn" mode="widthFix"></image>
  </button>
</view>
<view class="modal-box" :hidden="!state.modal" @click="clickActivity">
  <view class="modal-body" @click.stop="clickActivityBody">
    <view class="modal-content" @click.stop="clickActivity">
      <image class="activity-rules-bg" :src="state.activityRulesBg" mode="widthFix"></image>
    </view>
  </view>
</view>
<view class="prompt-box" :hidden="!state.prompt" @click="clickPrompt">
  <view class="prompt-body" @click.stop="clickPromptBody">
    <view class="prompt-content 'normal'}}" :style="promptBg">
      <view class="prompt-text">您已经是会员了，快去下单吧~</view>
      <view class="prompt-btn" @click="toIndex" v-if="state.entrance !== 'success'">去商城逛逛吧~</view>
      <view class="prompt-btn" @click="toIndex" v-else>去小程序使用</view>
    </view>
  </view>
</view>
<verify class="vue-ref" :show="state.verifyShow" :imgSize="state.imgSize" mode="pop" captchaType="blockPuzzle" @success="handleSuccess" @error="handleError" @close="handleClose"></verify> 
</template>
<script setup>
import _apiSystemServiceJs2 from "@/service/api/newretail/systemService";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsAuthJs from "@/utils/newretail/auth";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _apiSmsServiceJs from "@/service/api/newretail/smsService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import verify from '@/pages-sub/newretail/components/verify/verify.vue';
const app = getApp();

// pages/mallModule/invite/invite.js
const memberService = _apiMemberServiceJs;
const smsService = _apiSmsServiceJs;
const storeService = _apiStoreServiceJs;
const wxaUserService = _apiWxaUserServiceJs;
const sysService = _apiSystemServiceJs;
const auth = _utilsAuthJs;
const util = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const systemService = _apiSystemServiceJs2;

//获取应用实例
const state = reactive({
  navigationBarTitle: "",
  imagesPath: IMGAGESPATH,
  modal: false,
  mobile: '',
  captcha: '',
  getCodeBtn: "获取验证码",
  getCodeBgColor: '#d0aa86',
  prompt: false,
  entrance: 'inviter',
  //inviter 邀请人 invitee 被邀请人  success 
  inviteStatus: 'new',
  //  fail new again success 二次进入
  marginTop: '270rpx',
  marginBottom: '0rpx',
  paddingBottom: '0',
  hasUserInfo: false,
  sceneArray: [],
  userInfo: {},
  canIUse: uni.canIUse('button.open-type.getUserInfo'),
  member: {},
  stores: {},
  activityBg: "",
  activityRulesBg: "",
  activityRulesBtn: "",
  inviteeActivityTitle: "",
  inviteeInfoInputBg: "",
  inviteeReceiveBtn: "",
  inviterActivityPrize: "",
  inviterActivityTitle: "",
  inviterCoupon: "",
  inviterShareBtn: "",
  receiveActivityTitle: "",
  receiveImmediateUseBtn: "",
  receiveShowPrizeBg: "",
  getCodeColor: '#d0aa86',
  isMember: false,
  navHeight: 0,
  verifyShow: false,
  imgSize: {
    width: "310px",
    height: "155px"
  },
  captchaVerification: ""
});
function clickActivity() {
  if (state.modal) {
    state.modal = false;
  } else {
    state.modal = true;
  }
}
function clickActivityBody() {}
function clickPrompt() {
  if (state.prompt) {
    state.prompt = false;
  } else {
    state.prompt = true;
    state.entrance = 'success';
  }
}
function clickPromptBody() {}
function bindMobileInput(e) {
  state.mobile = e.detail.value;
}
function bindcaptchaInput(e) {
  state.captcha = e.detail.value;
}
function handleBindFocus() {
  state.marginBottom = '-336rpx';
}
function handleBindBlur() {
  state.marginBottom = '0';
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
function bindMobile() {
  if (!app.globalData.userInfo) {
    console.log("未登录");
  }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.prompt = true;
    return;
  }
  const that = this;
  const shareArray = state.sceneArray;
  let postData = {
    inviteeMobile: state.mobile,
    sourceType: 'WX_XCX'
  };
  if (options.type === 'member') {
    postData = {
      ...postData,
      introducerId: options.shareId
    };
  } else if (options.type === 'user') {
    postData = {
      ...postData,
      introduceUserId: options.shareId
    };
  } else if (options.scene) {
    if (shareArray[0] === 'user') {
      postData = {
        ...postData,
        introduceUserId: shareArray[1],
        introduceStoreId: state.stores.id
      };
    } else if (shareArray[0] === 'member') {
      postData = {
        ...postData,
        introducerId: shareArray[1]
      };
    } else if (shareArray[0] === 'store') {
      postData = {
        ...postData,
        introduceStoreId: shareArray[1]
      };
    } else {
      if (state.stores.id) {
        postData = {
          ...postData,
          introduceStoreId: state.stores.id
        };
      }
    }
  }
  let inviteInfo = JSON.stringify(postData);
  NAVPAGE.toAuthorize("?inviteInfo=" + inviteInfo);
}
function getUserInfo(e) {
  console.log(e);
  //如果是
  if (state.entrance == 'success') {
    NAVPAGE.toHome();
    // NAVPAGE.toMyCoupon();
    return;
  }
  const that = this;
  wxaUserService.login(true).then(res => {
    console.log(res);
    auth.setUser(res);
    app.globalData.userInfo = res && res.member ? res : null;
    if (res.member) {
      //记录一下是会员，用于判断注册领券
      state.isMember = true;
      auth.getDistributor();
      uni.setStorage({
        key: "wj_member",
        data: res.member
      });
    }
    bindMobile();
  });
}
function toIndex() {
  NAVPAGE.toHome();
}
function toMyCoupon() {
  NAVPAGE.toMyCoupon();
}
function checkAuth() {
  if (!app.globalData.userInfo) {
    return false;
  } else {
    return true;
  }
}
onLoad(function (_options) {
  const that = this;
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  getUiConfig();
  getJudge();
  state.navHeight = app.globalData.navHeight;
  state.pageBg = "background:url('" + state.imagesPath.activityBg + "') no-repeat center;background-size:100% 100%;";
  state.redPackageBg = "background:url('" + state.imagesPath.redPackage + "') no-repeat center;background-size:100% 100%;";
  state.promptBg = "background: #fff url('" + state.imagesPath.VIP + "') no-repeat top center;background-size: contain;";
  state.activityBg = IMGAGESPATH.activityBg;
  state.activityRulesBg = IMGAGESPATH.activityRulesBg;
  state.activityRulesBtn = IMGAGESPATH.activityRulesBtn;
  state.inviteeActivityTitle = IMGAGESPATH.inviteeActivityTitle;
  state.inviteeInfoInputBg = IMGAGESPATH.inviteeInfoInputBg;
  state.inviteeReceiveBtn = IMGAGESPATH.inviteeReceiveBtn;
  state.inviterActivityPrize = 'https://gomore-newretail.oss-cn-shanghai.aliyuncs.com/miniapp/UI/standard/inviterActivityPrize-new.png';
  state.inviterActivityTitle = IMGAGESPATH.inviterActivityTitle;
  state.inviterCoupon = IMGAGESPATH.inviterCoupon;
  state.inviterShareBtn = IMGAGESPATH.inviterShareBtn;
  state.receiveActivityTitle = IMGAGESPATH.receiveActivityTitle;
  state.receiveImmediateUseBtn = IMGAGESPATH.receiveImmediateUseBtn;
  state.receiveShowPrizeBg = IMGAGESPATH.receiveShowPrizeBg;
  if (_options.type) {
    state.entrance = 'invitee';
    state.marginTop = '360rpx';
  } else if (_options.scene) {
    let scene = decodeURIComponent(_options.scene);
    if (scene.indexOf("gmparam:") >= 0) {
      let sceneArr = scene.split('gmparam:');
      const _sceneId = sceneArr[1];
      sceneId = _sceneId != null ? _sceneId : null;
      getSceneById(sceneId);
      return;
    } else if (scene.indexOf(',') > 0) {
      let sceneArray = scene.split(',');
      console.log(sceneArray);
      state.entrance = 'invitee';
      state.sceneArray = sceneArray;
    } else {
      // 查询所有门店判断当前scene数据是否是门店id，当前门店列表中是否有当前门店
      storeService.queryList().then(res => {
        console.log(res);
        let stores = null;
        let allStores = [];
        if (res && res.length > 0) {
          res.forEach(item => {
            if (item.id === scene) {
              stores = item;
              app.globalData.storeInfo = item;
            }
            if (item.status === 'OPEN') {
              allStores.push(item);
            }
          });
          try {
            uni.setStorageSync('wj_allStores', allStores);
          } catch (e) {
            console.log(e);
          }
          if (stores) {
            // 统计PV
            state.stores = stores;
            state.entrance = 'invitee';
            ANALYSIS.PVStatistics(stores.id);
          } else {
            // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
            uni.getLocation({
              type: 'gcj02',
              success: function (res) {
                let latitude = res.latitude;
                let longitude = res.longitude;
                if (allStores.length > 0) {
                  // Do something with return value
                  let tempIndex = getNearestStore(allStores, latitude, longitude);
                  app.globalData.storeInfo = allStores[tempIndex];
                  // 统计PV
                  ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
                  state.entrance = 'invitee';
                }
              }
            });
          }
        }
      }).catch(err => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    }
  } else {
    if (app.globalData.userInfo) {
      state.hasUserInfo = true;
      if (!app.globalData.userInfo.member) {
        state.hasUserInfo = false;
      } else {
        state.member = app.globalData.userInfo.member;
      }
    }
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId;
    try {
      uni.setStorageSync('wj_sharingId', shareId);
    } catch (e) {}
    // 分享信息打开统计
    ANALYSIS.ShareOpenAnalysis();
  }
  // 获取当前页面分享图
  getSharePictures();
});
function getNearestStore(allStores, latitude, longitude) {
  let distanceArr = [];
  allStores.forEach(item => {
    let dis = util.distance(latitude, longitude, item.latitude, item.longitude);
    distanceArr.push(dis);
  });
  // 计算最小值
  const minN = Math.min.apply(Math, distanceArr);
  let tempIndex = 0;
  for (let i = 0; i < distanceArr.length; i++) {
    if (minN === distanceArr[i]) {
      tempIndex = i;
      break;
    }
  }
  state.stores = allStores[tempIndex];
  return tempIndex;
}
onReady(function () {});
onShow(function () {
  //注册成功回来
  if (uni.getStorageSync('wj_invite_registed')) {
    uni.setStorageSync('wj_invite_registed', false);
    //进入页面时是非会员，又有会员信息，说明当前用户是注册完了回来的新会员
    if (app.globalData.userInfo && app.globalData.userInfo.member && !state.isMember) {
      state.isMember = true;
      state.entrance = 'success';
    }
  }
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
function toShare() {
  if (!app.globalData.userInfo) {
    uni.showToast({
      title: '您还未授权登陆，请登陆后再邀请好友哦~',
      icon: 'none',
      duration: 2000
    });
  } else {
    if (!app.globalData.userInfo.member) {
      uni.showToast({
        title: '您还不是会员，请先绑定手机号码成为会员~',
        icon: 'none',
        duration: 2000
      });
    }
  }
}
onShareAppMessage(function (res) {
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  const login = checkAuth();
  let sharePictures = state.sharePictures;
  let storeId = '';
  if (app.globalData.storeInfo) {
    storeId = app.globalData.storeInfo.id;
  }
  if (login) {
    let shareId = '';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
      shareId = state.member.id;
    }
    return {
      title: app.globalData.systemConfigure.miniprogramSharingName,
      imageUrl: sharePictures,
      path: '/pages-sub/newretail/pages/mallModule/invite/invite?type=member&shareId=' + shareId + '&shareId=' + shareId + '&storeId=' + storeId
    };
  } else {
    return {
      title: app.globalData.systemConfigure.miniprogramSharingName,
      imageUrl: sharePictures,
      path: '/pages-sub/newretail/pages/mallModule/index/index/index?storeId=' + storeId
    };
  }
});
function getSharePictures() {
  util.getSharePictures('INVITE_MEMBER').then(res => {
    state.sharePictures = res;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getUiConfig() {
  sysService.query("pullNewDTO").then(response => {
    if (response.length > 0 && response[0].value != null && response[0].value !== "") {
      let res = response[0].value;
      let data = JSON.parse(res);
      if (data) {
        if (data.activityBg && data.activityBg !== "活动背景图") {
          state.pageBg = "background:url('" + data.activityBg + "') no-repeat center;background-size:100% 100%;";
          state.activityBg = data.activityBg;
        }
        if (data.activityRulesBg && data.activityRulesBg !== "活动规则图") {
          state.activityRulesBg = data.activityRulesBg;
        }
        if (data.activityRulesBtn && data.activityRulesBtn !== "活动规则按钮") {
          state.activityRulesBtn = data.activityRulesBtn;
        }
        if (data.invitee.activityTitle && data.invitee.activityTitle !== "活动标题区图片") {
          state.inviteeActivityTitle = data.invitee.activityTitle;
        }
        const reg = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
        if (data.invitee.getCodeColor && reg.test(data.invitee.getCodeColor)) {
          state.getCodeBgColor = data.invitee.getCodeColor;
          state.getCodeColor = data.invitee.getCodeColor;
        }
        if (data.invitee.infoInputBg && data.invitee.infoInputBg !== "信息录入背景") {
          state.inviteeInfoInputBg = data.invitee.infoInputBg;
        }
        if (data.invitee.receiveBtn && data.invitee.receiveBtn !== "领取按钮") {
          state.inviteeReceiveBtn = data.invitee.receiveBtn;
        }
        if (data.inviter.activityPrize && data.inviter.activityPrize !== "活动奖品区") {
          console.log(data.inviter.activityPrize, 'data.inviter.activityPrizedata.inviter.activityPrize');
          state.inviterActivityPrize = data.inviter.activityPrize;
        }
        if (data.inviter.activityTitle && data.inviter.activityTitle !== "活动标题区图片") {
          state.inviterActivityTitle = data.inviter.activityTitle;
        }
        if (data.inviter.shareBtn && data.inviter.shareBtn !== "分享按钮") {
          state.inviterShareBtn = data.inviter.shareBtn;
        }
        if (data.receive.activityTitle && data.receive.activityTitle !== "活动标题区图片") {
          state.receiveActivityTitle = data.receive.activityTitle;
        }
        if (data.receive.immediateUseBtn && data.receive.immediateUseBtn !== "立即使用") {
          state.receiveImmediateUseBtn = data.receive.immediateUseBtn;
        }
        if (data.receive.showPrizeBg && data.receive.showPrizeBg !== "奖品展示背景") {
          state.receiveShowPrizeBg = data.receive.showPrizeBg;
        }
      }
    }
  });
}
function getSceneById(id) {
  const self = this;
  wxaUserService.getSceneById(id).then(res => {
    function urlToObj(str) {
      let obj = {};
      let arr = str.split("&");
      for (let i = 0; i < arr.length; i++) {
        let ele = arr[i].split("=");
        obj[ele[0]] = ele[1];
      }
      return obj;
    }
    const _options2 = urlToObj(res);
    options = _options2;
    options.scene = id;
    state.entrance = 'invitee';
    state.sceneArray = ["user", _options2.shareId];
    if (_options2.shareId) {
      try {
        uni.setStorageSync('wj_sharingId', _options2.shareId);
      } catch (e) {}
      // 分享信息打开统计
      ANALYSIS.ShareOpenAnalysis();
    }
  }).catch(err => {
    util.showToast(err.message);
  });
}
</script>
<style scoped>
/* pages/mallModule/invite/invite.wxss */

page {
  width: 100%;
  height: 100vh;
}

.page {
  width: 100%;
  height: 100%;
  position: relative;
}

.activity-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.activity-rule {
  width: 142rpx;
  height: 58rpx;
  margin-top: 27rpx;
}

button.authorization {
  width: 100%;
  height: 100%;
  background: transparent;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
}

.activity-rule image {
  width: 100%;
  height: 100%;
}

.activity-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.activity-title-img {
  width: 600rpx;
  height: 224rpx;
}

.activity-title image {
  width: 600rpx;
}

.activity-text {
  width: 280rpx;
  height: 70rpx;
  background: #8abc43;
  border-radius: 35rpx;
  font-size: 44rpx;
  color: #fff;
  line-height: 70rpx;
  text-align: center;
  font-weight: bold;
  margin-top: -20rpx;
}

.activity-body {
  width: 645rpx;
  height: 444rpx;
  margin: 270rpx auto 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  bottom: 10%;
  left: 50%;
  margin-left: -320rpx;
}

/* 邀请人 */

.inviter image {
  width: 100%;
  height: 100%;
}

/* 被邀请人 */

.invitee {
  position: relative;
  margin-top: 440rpx;
}

.invitee  .invitee-info-input-bg {
  position: absolute;
  top: 0;
}

.invitee>text {
  font-size: 32rpx;
  line-height: 42rpx;
  color: #9d7754;
  font-weight: bold;
}

.invitee .mobile-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 124rpx;
}

.invitee .section {
  width: 430rpx;
  height: 70rpx;
  border: 1rpx solid #cecece;
  border-radius: 38rpx;
  position: relative;
}

.invitee .section input {
  font-size: 24rpx;
  line-height: 70rpx;
  height: 70rpx;
  padding-left: 25rpx;
}

.invitee .section label {
  width: 178rpx;
  height: 70rpx;
  background: #d0aa86;
  border-radius: 38rpx;
  position: absolute;
  right: 0;
  top: 0;
  font-size: 24rpx;
  line-height: 70rpx;
  color: #fff;
  text-align: center;
}

.invitee .section:first-of-type {
  margin-bottom: 27rpx;
}

.invitee .section:first-of-type input {
  width: 250rpx;
}

.invitee .coupon-box {
  width: 346rpx;
  height: 156rpx;
  margin-top: 36rpx;
}

.invitee .coupon-box image {
  width: 100%;
}

.activity-btn {
  height: 112rpx;
  font-size: 38rpx;
  line-height: 112rpx;
  background: transparent;
  padding: 0;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-radius: 0;
}

.activity-btn image {
  width: 100%;
  height: 100%;
}

button::after {
  border: none;
  border-radius: 0;
}

.voucher {
  width: 476rpx;
  height: 70rpx;
  background: transparent;
  text-align: center;
  position: absolute;
  padding: 0;
  bottom: 8rpx;
  left: 50%;
  margin-left: -238rpx;
}

.voucher image {
  width: 100%;
  height: 100%;
}

.modal-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}

.modal-body {
  position: relative;
}

.modal-content {
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  margin: 20% auto;
  position: relative;
  width: 645rpx;
  min-height: 857rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.modal-content .activity-rules-bg {
  width: 645rpx;
  height: 857rpx;
}

.rule-top {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 36rpx;
}

.rule-top .rule-img {
  width: 326rpx;
}

.rule-top .close {
  height: 28rpx;
  width: 28rpx;
  position: absolute;
  top: 28rpx;
  right: 28rpx;
}

.rule-content {
  width: 645rpx;
  min-height: 857rpx;
  border-radius: 16rpx;
  background: #fff;
  margin-top: 9rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
}

.rule-content image {
  width: 514rpx;
}

.rule-content-img {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 34rpx 0 34rpx 0;
}

.rule-content text {
  font-size: 26rpx;
  line-height: 36rpx;
  color: #545454;
  margin-bottom: 28rpx;
  text-align: justify;
}

.rule-tips {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #fff;
  text-align: center;
  width: 100%;
  margin-top: 20rpx;
}

/* 二次进入 */

.prompt-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 20;
}

.prompt-body {
  position: relative;
}

.prompt-content {
  box-sizing: border-box;
  border-radius: 18rpx;
  overflow: hidden;
  margin: 40% auto;
  position: relative;
  width: 610rpx;
  padding: 0 25rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background: #fff;
}

.again {
  height: 576rpx;
  background-size: contain;
}

.normal {
  height: 576rpx;
  background: #fff;
}

.prompt-text {
  font-size: 36rpx;
  color: #3b3b3b;
}

.prompt-btn {
  width: 376rpx;
  height: 70rpx;
  border-radius: 36rpx;
  font-size: 34rpx;
  line-height: 70rpx;
  background: #ffd670;
  color: #fe6a57;
  font-weight: bold;
  text-align: center;
  margin: 80rpx 0 36rpx 0;
}

.alreadyMember {
  position: absolute;
  width: 400rpx;
  left: 0rpx;
  top: 0rpx;
  
}
</style>