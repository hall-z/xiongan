<template>
<!--pages/mallModule/activity/lottery/lotteryIndex/lotteryIndex.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="top-info">
  <image class="top-bg" :src="state.imagesPath.iconLotteryTopBg20191106" mode="widthFix" lazy-load="false"></image>
  <view class="panny-rules" @click="togglePennyRulesPopup">
    <image :src="state.imagesPath.iconPenneryRules" mode="widthFix" lazy-load="false"></image>
  </view>
</view>
<view class="lottery-recharge-box">
  <view v-if="state.rechargeList.length == 0" class="no-data">
    <image :src="state.imagesPath.imgNoData"></image>
  </view>
  <view v-if="state.rechargeList.length > 0">
    <scroll-view class="recharge-body" scroll-y="">
      <view class="recharge-content">
        <view class="recharge-item" :style="currentItem == item.rechangeMoneyId ? state.theme.borderColor : ''" v-for="(item , index) in state.rechargeList" :key="idx" :data-id="item.rechangeMoneyId" @click="rechargeClick">
          <image class="isChecked" :src="state.imagesPath.iconRechargeChecked" v-if="item.isChecked"></image>
          <view class="top">
            <view>
              <text class="recharge-num">{{item.rechargeMoney}}</text> 元</view>
          </view>
          <view class="bottom" :hidden="item.description">
            <view class="recharge-gift">
              <image :src="state.imagesPath.iconRechargeGift"></image>
            </view>
            <view class="recharge-desc">
              <text class="recharge-message" v-if="item.description">{{item.description}}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="recharge-describe" v-if="state.rechargeItem.description">
      <image :src="state.imagesPath.iconLuckDrawItem"></image>
      <text>{{state.rechargeItem.description}}</text>
    </view>
    <button v-if="!state.hasUserInfo" :tyle="state.theme.mainBgColor" class="recharge-btn" @click="getUserInfo">立即支付
      <text v-if="state.rechargeItem.money">{{state.rechargeItem.money}} 元</text>
    </button>
    <view v-else>
      <form @submit="toPayRecharge">
        <button class="recharge-btn" form-type="submit" :style="state.theme.mainBgColor">
          立即支付<text v-if="state.rechargeItem.money">{{state.rechargeItem.money}} 元</text> 
        </button>
      </form>
    </view>
  </view>
  <text class="recharge-btn-tips" :style="state.theme.mainColor" @click="toMyLottery">查看我的抽奖</text>
</view>
<popup :show="state.show.pennyRules" position="middle" custom-class="middle" @close="togglePennyRulesPopup">
  <view class="penny-rules-box">
    <view class="penny-rules-popup">
      <view class="title">
        <image class="left-icon" :src="state.imagesPath.iconPeneryLine" mode="widthFix"></image>
        <text>活动规则</text>
        <image class="right-icon" :src="state.imagesPath.iconPeneryLine" mode="widthFix"></image>
      </view>
      <view class="close">
        <image :src="state.imagesPath.iconCloseImg2" @click="togglePennyRulesPopup"></image>
      </view>
      <scroll-view class="rules-content-box" scroll-y="">
        <text>1.选择充值活动支付对应金额进行充值，支付时会自动抵扣抽奖券，充值完填写奖品收货地址即可参与抽奖，邀请规定数量好友帮忙助力即可获得抽奖资格。助力点=助力总人数*充值总金额，助力好友越多/充值金额越大，获奖的概率越大，助力点第1名必中（助力点相同，达成时间最早者中）</text>
        <text>2.同一用户可以参加多种充值活动，助力人数和充值金额会累计到助力点，每天每人最多助力3次。</text>
        <text>3.开奖及退款规则如下：</text>
        <text>当活动时间结束后，活动开奖。中奖者奖品将会根据参与抽奖时所填收货地址1-3天内寄出，遇节假日顺延；如果未填收货地址或者所填信息错误导致无法收货，则取消活动中奖资格；由于充值的特殊性，充值金额仅用于小程序购物，不支持退款。</text>
        <text>4.对于同一中奖用户（包括但不限于同一手机号、手机设备等）只能参与一次，否则视为无效。</text>
        <text>5.严禁用户使用任何不正当手段或作弊行为参与本活动。一经发现，主办方有权取消该用户的所有中奖资格，情节严重的，我们将依法保留诉讼权利。</text>
      </scroll-view>
    </view>
  </view>
</popup>
<!-- 用户没有获得券弹窗 -->
<popup :show="state.show.unCoupon" position="middle" custom-class="middle" @close="toggleUnCouponPopup">
  <view class="penny-prompt-popup">
    <view class="title">温馨提示</view>
    <view class="close">
      <image :src="state.imagesPath.iconCloseImg2" @click="toggleUnCouponPopup"></image>
    </view>
    <view class="prompt-content">该活动参与火爆，排队中，建议您参与其他活动！</view>
    <view class="prompt-button-box" @click="toggleUnCouponPopup">确认</view>
  </view>
</popup>
<!-- 付款超时弹窗 -->
<popup :show="state.show.timeOut" position="middle" custom-class="middle" @close="toggleTimeOutPopup">
  <view class="popup-content">
    <view class="popup-content-box">
      <image :src="state.imagesPath.iconNetworkTimeout" mode="widthFix"></image>
    </view>
    <view class="button" :style="state.theme.mainBgColor" @click="toggleTimeOutPopup">我知道了</view>
  </view>
</popup>
</template>
<script setup>
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiRechargeServiceJs from "@/service/api/newretail/rechargeService";
import _apiLotteryServiceJs from "@/service/api/newretail/lotteryService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/mallModule/activity/lottery/lotteryIndex/lotteryIndex.js
const lotteryService = _apiLotteryServiceJs;
const rechargeService = _apiRechargeServiceJs;
const request = _apiRequestJs;
const wxaUserService = _apiWxaUserServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const ANALYSIS = _utilsAnalysisJs;
const ADDRESS = _utilsAddressJs;
const NAVPAGE = _utilsNavPageJs;
const UTILS = _utilsUtilsJs;
const THEME = _utilsThemeManagerJs;
const AUTHORIZE = _utilsAuthorizeJs;
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
  navigationBarTitle: "充值抽奖",
  imagesPath: IMGAGESPATH,
  theme: THEME,
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    pennyRules: false
  },
  rechargeList: [],
  storeInfo: {
    name: "未获取到当前门店"
  },
  homeBack: false,
  hasUserInfo: false,
  isMember: false,
  rechargeItem: {
    description: ""
  }
});
let customData = {};
function initPage() {
  const self = this;
  state.storeId = app.globalData.storeInfo.id;
  state.storeInfo = app.globalData.storeInfo;
  getRechargeDrawActivity();
}
onLoad(function (options) {
  uni.hideShareMenu();
  const that = this;
  canRechange = true;
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
    checkScene();
    initPage(); // 初始化页面内容
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation().then(res => {
      app.globalData.storeInfo = res;
      checkScene();
      // 统计PV
      ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
      initPage(); // 初始化页面内容
    }).catch(err => {
      console.log(err);
    });
  }
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
  function checkScene() {
    let tempAllStores = uni.getStorageSync('wj_allStores'); // 获取缓存的所有门店
    // 判断options.scene中是否有值,如果有值，说明是扫码进来
    if (options.scene != null) {
      let scene = decodeURIComponent(options.scene);
      // 判断options.scene是否全部是数字
      let reg = /^\d+$/; // 正则校验表达式，判断是否为纯数字
      // 如果是纯数字，说明是门店id，从当前缓存的所有门店选出对应的门店
      if (reg.test(scene)) {
        if (tempAllStores) {
          // 如果匹配到一样的门店，使用匹配到的门店，如果没有匹配到，则使用最近的门店
          tempAllStores.forEach(item => {
            if (item.id === scene) {
              let tempStore = item;
              // 更新当前全局的门店参数
              app.globalData.storeInfo = tempStore;
            }
          });
        }
        state.sceneType = 'underLineQrcode';
      }
    }
  }
});
onReady(function () {});
onShow(function () {
  checkUserInfo();
  if (app.globalData.storeInfo && app.globalData.storeInfo.id !== state.storeId) {
    initPage(); // 初始化页面内容
  }
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {
  onLoad(options);
  setTimeout(() => {
    // 特别处理iOS下有loading时下拉刷新秒回弹的问题
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(function () {});
onShareAppMessage(function (res) {
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res);
    const instanceId = res.target.dataset.id;
    let imgUrl = "";
    let name = "";
    state.orderList.forEach(item => {
      if (item.id === instanceId) {
        imgUrl = item.shareImageUrl;
        name = item.productName;
      }
    });
    return {
      title: '麻烦点一下，只差一个人就拿到' + name + '了～',
      path: '/pages-sub/newretail/pages/mallModule/activity/penny/helpPenny/helpPenny?instanceId=' + instanceId,
      imageUrl: imgUrl,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true
        });
      }
    };
  }
});
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    if (app.globalData.userInfo.member) {
      state.isMember = true;
      state.member = app.globalData.userInfo.member;
      state.userInfo = app.globalData.userInfo.wxaUser;
      sendCoupon();
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
      state.isMember = true;
      state.member = res.member;
      state.userInfo = res.wxaUser;
      sendCoupon();
      toPayRecharge();
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
function toMyLottery() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    NAVPAGE.toMyLottery();
  } else {
    NAVPAGE.toAuthorize();
  }
}
function toggleBargainRulesPopup() {
  toggle('middle');
}
function togglePennyRulesPopup() {
  toggle('pennyRules');
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function getRechargeDrawActivity() {
  const that = this;
  lotteryService.getOnline().then(res => {
    if (res && res.length > 0) {
      let rechargeMoneys = JSON.parse(res[0].rechargeMoneys);
      let tempList = [];
      rechargeMoneys.forEach((item, index) => {
        tempList.push({
          ...item,
          rechargeMoney: item.money,
          rechangeMoneyId: index
        });
      });
      state.rechargeDrawActivity = res[0];
      state.rechargeList = tempList;
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        sendCoupon();
      }
    }
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
function rechargeClick(val) {
  let that = this;
  let id = val.currentTarget.dataset.id;
  let tempData = null;
  state.rechargeList.forEach(item => {
    item.isChecked = false;
    if (item.rechangeMoneyId === id) {
      item.isChecked = true;
      tempData = item;
      return;
    }
  });
  //设置当前样式
  state.currentItem = id;
  state.rechargeItem = tempData;
  state.rechargeList = state.rechargeList;
}
function toHome() {
  NAVPAGE.toHome();
}
function toggleUnCouponPopup() {
  toggle('unCoupon');
}
function sendCoupon() {
  const that = this;
  if (state.rechargeDrawActivity && state.rechargeDrawActivity.stockId != null && state.rechargeDrawActivity.stockId !== "") {
    wxaUserService.commonSendCoupon(false, state.rechargeDrawActivity.stockId).then(res => {
      console.log("发券成功");
    }).catch(err => {
      console.log(err.message);
    });
  }
}
function toPayRecharge(e) {
  console.log(e);
  const that = this;
  let rechangeMoneyId = state.currentItem;
  if (!canRechange) {
    console.log(canRechange);
    // 当前已经在充值中
    return;
  }
  if (rechangeMoneyId !== '' && rechangeMoneyId != null) {
    canRechange = false;
    if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
      canRechange = true;
      NAVPAGE.toAuthorize();
      return;
    }
    let rechargeItem = null;
    state.rechargeList.forEach(item => {
      if (item.rechangeMoneyId === rechangeMoneyId) {
        rechargeItem = item;
      }
    });
    if (rechargeItem) {
      confirmInformation(rechargeItem);
    } else {
      canRechange = true;
      uni.showToast({
        title: '请选择充值金额~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    uni.showToast({
      title: '请选择充值金额~',
      icon: 'none',
      duration: 2000
    });
  }
}
function confirmInformation(rechargeItem) {
  const that = this;
  if (state.rechargeDrawActivity.stockId) {
    wxaUserService.isSend(state.rechargeDrawActivity.stockId).then(res => {
      if (res) {
        createLotteryOrder(rechargeItem);
      } else {
        canRechange = true;
        state.userNoCoupon = true;
        toggleUnCouponPopup();
      }
    }).catch(err => {
      console.log("查询券失败：", err.message);
      state.userNoCoupon = true;
      canRechange = true;
      toggleUnCouponPopup();
    });
  } else {
    canRechange = true;
    state.userNoCoupon = true;
    toggleUnCouponPopup();
  }
}
function createLotteryOrder(rechargeItem) {
  const that = this;
  let postData = {
    lotteryId: state.rechargeDrawActivity.lotteryId,
    openId: state.userInfo.openId,
    payMethod: app.globalData.paymentMethod || request.PAYMETHOD,
    sceneType: "RECHARGE_DRAW",
    sourceStoreId: state.storeId,
    sourceType: "WX_XCX",
    total: rechargeItem.rechargeMoney
  };
  console.log(postData);
  lotteryService.createRechargeDrawOrder(postData).then(res => {
    order = res;
    // 微信支付（正式用）
    if (res.paySign) {
      const data = {
        orderId: res.rechargeOrderId,
        payMethod: app.globalData.paymentMethod || request.PAYMETHOD
      };
      wxPay(res.paySign, data);
    }
  }).catch(err => {
    canRechange = true;
    UTILS.showToast(err.message);
  });
}
function wxPay(paySign, postData) {
  const self = this;
  let sign = JSON.parse(paySign);
  let packageValue = '';
  if (postData.payMethod === 'SWIFTPASS' || postData.payMethod === 'DINGFUTONG') {
    packageValue = sign.package;
  } else if (postData.payMethod === 'WX_MINI_APP' || postData.payMethod === 'WXA_ISV_PAY') {
    packageValue = sign.packageValue;
  }
  uni.requestPayment({
    'timeStamp': sign.timeStamp,
    'nonceStr': sign.nonceStr,
    'package': packageValue,
    'signType': sign.signType,
    'paySign': sign.paySign,
    'success': function (res) {
      let order = {
        id: postData.orderId
      };
      getOrderStatusById(postData.orderId, self);
    },
    'fail': function (res) {
      console.log('支付失败');
      console.log(res);
      canRechange = true;
      if (res.errMsg.indexOf("cancel") >= 0) {
        UTILS.showToast("您取消了支付~");
      } else {
        UTILS.showToast(res.errMsg);
      }
    }
  });
}
function handleGetOrderStatusById(orderId, amount, self) {
  uni.showLoading({
    title: '支付中'
  });
  lotteryService.getInstanceId(orderId).then(res => {
    console.log('查询交易结果-------------');
    console.log(res);
    amount++;
    console.log(amount);
    if (amount > 40) {
      UTILS.setHideLoading(false);
      uni.hideLoading();
      // 弹出支付超时
      self.toggle('timeOut');
      self.canRechange = true;
      return;
    }
    if (res) {
      self.canRechange = true;
      UTILS.setHideLoading(false);
      uni.hideLoading();
      UTILS.showToast("支付成功");
      const opts = '?instanceId=' + res + "&isCreate=true";
      NAVPAGE.toHelpLottery(opts);
    } else {
      let orderTimeId = setTimeout(() => {
        UTILS.setHideLoading(true);
        // 如果没有成功，调用函数本身，实现重复查询
        self.handleGetOrderStatusById(orderId, amount, self);
      }, 2000);
      self.setData({
        orderTimeId: orderTimeId
      });
    }
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
function getOrderStatusById(orderId, self) {
  let amount = 0;
  // self.handleGetOrderStatusById(orderId, amount, self);
  setTimeout(() => {
    self.handleGetOrderStatusById(orderId, amount, self);
  }, 1000);
}
function toggleTimeOutPopup() {
  toggle('timeOut');
}
</script>
<style scoped>
/* pages/mallModule/activity/lottery/lotteryIndex/lotteryIndex.wxss */

page {
}

.top-info {
  width: 750prx;
  height: 361rpx;
  position: relative;
}

.top-info .top-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.panny-rules {
  width: 74rpx;
  height: 36rpx;
  position: absolute;
  right: 0;
  top: 13rpx;
}

.panny-rules image {
  width: 74rpx;
  height: 36rpx;
}

.goods-list {
  background: #f4f4f4;
  min-height: calc(100vh - 108rpx);
}

.penny-list {
  padding: 18rpx 19rpx;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}

.bottom-info {
  width: 100%;
  height: 98rpx;
  background: #fff;
  font-size: 28rpx;
  line-height: 98rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #9c9c9c;
  position: fixed;
  bottom: 0;
  left: 0;
}

.bottom-info view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-info view.active {
  color: #e02e24;
}

.bottom-info view image {
  width: 30rpx;
  height: 30rpx;
  margin-right: 12rpx;
}

/* 规则弹窗 */

.penny-rules-box {
  padding: 30rpx;
}

.penny-rules-popup {
  width: 500rpx;
  padding: 24rpx 40rpx;
  background: #fff;
  color: #626262;
  border-radius: 16rpx;
  font-size: 28rpx;
  line-height: 45rpx;
  position: relative;
}

.penny-rules-popup .title {
  font-size: 32rpx;
  line-height: 48rpx;
  width: 100%;
  text-align: center;
  margin-bottom: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #eb3728;
}

.penny-rules-popup .title image {
  width: 166rpx;
  height: 4rpx;
}

.penny-rules-popup .title image.left-icon {
  transform: rotate(180deg);
  margin-right: 18rpx;
}

.penny-rules-popup .title image.right-icon {
  margin-left: 18rpx;
}

.penny-rules-popup text {
  display: block;
  margin-bottom: 12rpx;
}

.penny-rules-popup .close {
  width: 58rpx;
  height: 58rpx;
  position: absolute;
  right: -29rpx;
  top: -29rpx;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.penny-rules-popup .close image {
  width: 40rpx;
  height: 40rpx;
}

.rules-content-box {
  height: 580rpx;
}

.no-data {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
  margin-top: 200rpx;
}

.no-data button {
  border: 1rpx solid;
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: #fff;
}

/* 充值相关 */

.lottery-recharge-box {
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60rpx 40rpx;
}

.lottery-recharge-box .recharge-top {
  height: 86rpx;
  color: #777;
  position: relative;
  border-bottom: 1px solid #f1f1f1;
  display: flex;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 30rpx;
}

.lottery-recharge-box .recharge-top>text.top-text {
  text-align-last: left;
  display: block;
  font-size: 28rpx;
  color: #1b1b1d;
  line-height: 86rpx;
}

.lottery-recharge-box .recharge-top .top-line {
  width: 184rpx;
  height: 2rpx;
  background: #b6b6b6;
  display: block;
}

.lottery-recharge-box .recharge-body {
  margin-bottom: 60rpx;
}

.lottery-recharge-box .recharge-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: calc(335rpx*2);
  box-sizing: border-box;
  justify-content: flex-start;
}

.lottery-recharge-box .recharge-content .space {
  width: 1rpx;
  height: 100%;
  float: left;
}

.lottery-recharge-box .recharge-item {
  width: calc((100% - 24rpx) / 2);
  height: 188rpx;
  padding: 24rpx 0;
  border-radius: 6rpx;
  border: 1px solid #454545;
  position: relative;
  /* margin-bottom: 21rpx; *//* margin-right: 19rpx; */
  box-sizing: border-box;
  text-align: center;
  margin: 15rpx 12rpx;
  /* display: flex; */
}

.lottery-recharge-box .recharge-item:nth-child(odd) {
  margin-left: 0;
}

.lottery-recharge-box .recharge-item:nth-child(even) {
  margin-right: 0;
}

.lottery-recharge-box .recharge-item.active {
  border: 3rpx solid #ff8105;
}

.lottery-recharge-box .recharge-item:nth-of-type(3n) {
  /* margin-right: 0; */
}

.lottery-recharge-box .recharge-item .top {
  height: 82rpx;
  line-height: 82rpx;
  color: #454545;
  /* line-height: 100rpx; */
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.lottery-recharge-box .recharge-item .top .recharge-num {
  font-size: 50rpx;
}

.lottery-recharge-box .recharge-item .isChecked {
  position: absolute;
  right: -1rpx;
  top: -1rpx;
  width: 46rpx;
  height: 46rpx;
}

.lottery-recharge-box .recharge-item .top>text:first-of-type {
  line-height: 60rpx;
}

/* .recharge-item .top text:last-of-type {
  font-size: 24rpx;
  font-weight: normal;
} */

.lottery-recharge-box .recharge-item .top text:last-of-type>text {
  color: #009f55;
}

.lottery-recharge-box .recharge-item .bottom {
  height: 82rpx;
  font-size: 24rpx;
  line-height: 41rpx;
  color: #454545;
  display: flex;
  flex-direction: row;
  /* border-top: 1px solid #dcdcdc; */
  justify-content: center;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 12rpx;
}

.lottery-recharge-box .recharge-item .bottom .recharge-gift {
  width: 48rpx;
  height: 38rpx;
  margin-right: 8rpx;
}

.lottery-recharge-box .recharge-item .bottom .recharge-gift image {
  width: 48rpx;
  height: 38rpx;
}

.lottery-recharge-box .recharge-item .bottom .recharge-desc {
  flex: 1;
  width: 80%;
}

.lottery-recharge-box .recharge-desc .recharge-message {
  color: #ff8561;
  display: block;
  width: 100%;
  text-align: left;
}

.lottery-recharge-box .recharge-desc .recharge-donate {
  font-size: 32rpx;
  width: 100%;
}

.lottery-recharge-box .recharge-item .bottom text {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lottery-recharge-box .recharge-btn {
  width: 670rpx;
  height: 100rpx;
  background: #ff8105;
  line-height: 100rpx;
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
  margin-bottom: 40rpx;
}

.lottery-recharge-box  .recharge-btn-tips {
}

.lottery-recharge-box .recharge-btn::after {
  border: 0;
}

.lottery-recharge-box .recharge-describe {
  width: 100%;
  font-size: 28rpx;
  line-height: 42rpx;
  color: #454545;
  margin-bottom: 24rpx;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.lottery-recharge-box .recharge-describe image {
  width: 18rpx;
  height: 24rpx;
  margin-right: 8rpx;
  margin-top: 10rpx;
}

button:disabled {
  opacity: 0.5;
}


/* 温馨提示弹窗 */

.penny-prompt-popup {
  background: #fff;
  width: 542rpx;
  min-height: 305rpx;
  border-radius: 10rpx;
  position: relative;
  padding: 0 24rpx 28rpx 24rpx;
}

.penny-prompt-popup .title {
  font-size: 36rpx;
  line-height: 72rpx;
  color: #000;
  width: 100%;
  text-align: center;
  padding-top: 14rpx;
  padding-bottom: 22rpx;
}

.penny-prompt-popup .close {
  will-change: 80rpx;
  height: 80rpx;
  position: absolute;
  right: 20rpx;
  top: 36rpx;
}

.penny-prompt-popup image {
  width: 40rpx;
  height: 40rpx;
}

.penny-prompt-popup .prompt-content {
  font-size: 28rpx;
  line-height: 48rpx;
  padding: 12rpx 0;
  text-align: left;
  text-indent: 2em;
}

.penny-prompt-popup .prompt-button-box {
  width: 480rpx;
  height: 84rpx;
  font-size: 32rpx;
  line-height: 84rpx;
  color: #fff;
  background: #eb3728;
  text-align: center;
  border-radius: 9rpx;
  margin: 24rpx auto 0 auto;
}

.popup-content {
  width: 670rpx;
  height: 500rpx;
  background: #fff;
  border-radius: 6rpx;
  position: relative;
}

.popup-content-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400rpx;
}

.popup-content-box image {
  width: 410rpx;
  height: 421rpx;
}

.popup-content .button {
  height: 100rpx;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 100rpx;
  width: 100%;
  color: #fff;
  text-align: center;
  border-bottom-left-radius: 6rpx;
  border-bottom-right-radius: 6rpx;
  position: absolute;
  bottom: 0;
  left: 0;
}

.no-data {
  width: 100%;
  height: calc(100vh - 650rpx);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
}
</style>