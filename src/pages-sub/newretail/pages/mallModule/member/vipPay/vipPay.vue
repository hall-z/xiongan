<template>
<!--pages/mallModule/member/vipPay/vipPay.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="top-info">
  <view class="user-info">
    <image class="avatarUrl" :src="state.userInfo.avatarUrl"></image>
    <view class="info">
      <view class="nickName">
        <text>{{state.member.nickName ? state.member.nickName : state.userInfo.nickName}}</text>
        <view v-if="state.isVIP" class="member-nameplate">
          <image class="flower" :src="state.imagesPath.iconVIPFlower"></image>黑卡
        </view>
      </view>
      <view class="validity" v-if="!state.isVIP && state.isExpired">已过期</view>
      <view class="validity" v-else-if="!state.isVIP && !state.isExpired">未开通</view>
      <view class="validity" v-else>{{state.vipEndTime}}到期</view>
    </view>
  </view>
</view>
<view class="pay-box">
  <view class="pay-title">黑卡套餐</view>
  <scroll-view class="pay-list" scroll-x="">
    <view :class="'pay-item ' + (item.checked ? 'active' : '')" v-for="(item , index) in state.mealsList" :key="id" :data-id="item.id" @click="clickPayItem">
      <view class="name">{{item.name}}·{{item.validity}}天</view>
      <view class="desc">低至{{item.minPay}}元每天</view>
      <view class="price">￥
        <text>{{item.amount}}</text>
      </view>
      <view class="checked-box">
        <image :src="item.checked ? state.imagesPath.shoppingCartSelected : state.imagesPath.shoppingCartUnSelected"></image>
      </view>
    </view>
  </scroll-view>
</view>
<view class="pay-btn-box">
  <view class="pay-label" :hidden="amount === 0">
    <image :src="state.imagesPath.iconVipPayLabel"></image>
    <text>低至{{amount}}元/天</text>
  </view>
  <button class="pay-btn" @click="createOrder">{{!state.isVIP ? "立即购买" : "立即续费"}}</button>
</view>
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
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiOrderServiceJs from "@/service/api/newretail//orderService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _apiRequestJs from "@/service/api/newretail/request";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/mallModule/member/vipPay/vipPay.js
const REQUEST = _apiRequestJs;
const memberService = _apiMemberServiceJs;
const orderService = _apiOrderServiceJs;
const UTILS = _utilsUtilsJs;
const AUTHORIZE = _utilsAuthorizeJs;
const IMGAGESPATH = _utilsImagesPathJs;
const THEME = _utilsThemeManagerJs;
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

//获取应用实例
const state = reactive({
  navigationBarTitle: "黑金PLUS会员",
  imagesPath: IMGAGESPATH,
  hasUserInfo: false,
  isMember: false,
  member: null,
  userInfo: null,
  isVIP: false,
  isExpired: false,
  mealsList: [],
  canBuy: true,
  vipEndTime: "",
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    timeOut: false
  },
  theme: THEME
});
onLoad(function (options) {
  uni.hideShareMenu({});
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
  if (app.globalData.storeInfo) {
    state.storeId = app.globalData.storeInfo.id;
  }
  getVipMemberConfig();
});
onReady(function () {});
onShow(function () {
  checkUserInfo();
});
onHide(function () {});
onUnload(function () {
  clearTimeout(state.orderTimeId);
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    state.userInfo = app.globalData.userInfo.wxaUser;
    if (app.globalData.userInfo.member) {
      const res = app.globalData.userInfo;
      let isExpired = false;
      let isVIP = false;
      const now = new UTILS.ResponseDate().getTime();
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
    }
  } else {
    state.hasUserInfo = false;
    state.isMember = false;
    state.member = null;
    state.userInfo = null;
  }
}
function getVipMemberConfig() {
  memberService.getVipMemberGradeConfig().then(res => {
    if (res && res.meals && res.meals.length > 0) {
      let tempList = [];
      res.meals.forEach((item, index) => {
        const minPay = (item.amount / item.validity).toFixed(2);
        tempList.push({
          ...item,
          minPay: minPay,
          checked: index === 0 ? true : false
        });
      });
      let current = tempList[0];
      state.mealsList = tempList;
      state.amount = parseFloat(current.minPay);
    }
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
function clickPayItem(e) {
  const id = e.currentTarget.dataset.id;
  let tempList = state.mealsList;
  let amount = 0;
  tempList.forEach(it => {
    if (it.id === id) {
      it.checked = !it.checked;
      amount = it.checked ? it.minPay : 0;
    } else {
      it.checked = false;
    }
  });
  state.mealsList = tempList;
  state.amount = parseFloat(amount);
}
function createOrder() {
  const that = this;
  if (!state.canBuy) {
    return;
  }
  state.canBuy = false;
  let vipMealId = "";
  vipMeal = null;
  state.mealsList.forEach(ele => {
    if (ele.checked) {
      vipMealId = ele.id;
      vipMeal = ele;
    }
  });
  if (vipMealId === "") {
    UTILS.showToast("请选择套餐");
    state.canBuy = true;
    return;
  }
  const postData = {
    sourceStoreId: state.storeId !== "" ? state.storeId : null,
    vipMealId: vipMealId
  };
  memberService.createOrder(postData).then(res => {
    let tempData = {
      orderId: res,
      payMethod: app.globalData.paymentMethod || REQUEST.PAYMETHOD,
      entry: "VIP_GRADE",
      total: vipMeal.amount
      // payMethod: "CARDPAY",
      // cardPayPassword: "123456"
    };
    orderService.getCashPaySign(tempData).then(res => {
      if (tempData.payMethod === "CARDPAY") {
        // 轮询订单
        getOrderStatusById(tempData.orderId, that);
        return;
      }
      let resData = JSON.parse(res);
      let sign = JSON.parse(resData.sign);
      let packageValue = '';
      if (tempData.payMethod === 'SWIFTPASS' || tempData.payMethod === 'DINGFUTONG') {
        packageValue = sign.package;
      } else if (tempData.payMethod === 'WX_MINI_APP' || tempData.payMethod === 'WXA_ISV_PAY') {
        packageValue = sign.packageValue;
      }
      uni.requestPayment({
        'timeStamp': sign.timeStamp,
        'nonceStr': sign.nonceStr,
        'package': packageValue,
        'signType': sign.signType,
        'paySign': sign.paySign,
        'success': function (res) {
          // 轮询订单
          getOrderStatusById(tempData.orderId, that);
        },
        'fail': function (res) {
          console.log('支付失败');
          console.log(res);
          this.setData({
            canBuy: true
          });
          if (res.errMsg.indexOf("cancel") >= 0) {
            uni.showToast({
              title: '您取消了支付~',
              icon: 'none',
              duration: 2000
            });
          } else {
            UTILS.showToast(res.errMsg);
          }
        }
      });
    }).catch(err => {
      state.canBuy = true;
      UTILS.showToast(err.message);
    });
  }).catch(err => {
    state.canBuy = true;
    UTILS.showToast(err.message);
  });
}
function handleGetOrderStatusById(orderId, amount, self) {
  uni.showLoading({
    title: '支付中'
  });
  memberService.getStatus(orderId).then(result => {
    console.log('查询交易结果-------------');
    console.log(result);
    amount++;
    console.log(amount);
    if (amount > 40) {
      UTILS.setHideLoading(false);
      self.setData({
        canBuy: true
      });
      uni.hideLoading();
      // 弹出支付超时
      self.toggle('timeOut');
      return;
    }
    if (result === 'SUCCESS') {
      UTILS.setHideLoading(false);
      uni.hideLoading();
      // 跳转到成功页面
      self.setData({
        canBuy: true
      });
      uni.showToast({
        title: '开通' + self.vipMeal.name + "成功！",
        icon: 'none',
        duration: 2000
      });
      memberService.getLoginMember().then(res => {
        app.globalData.userInfo.member = {
          ...app.globalData.userInfo.member,
          ...res
        };
        uni.navigateBack({
          delta: 1
        });
      }).catch(err => {
        UTILS.showToast(err.message);
      });
    } else {
      let orderTimeId = setTimeout(() => {
        UTILS.setHideLoading(true);
        // 如果没有成功，调用函数本身，实现重复查询
        self.handleGetOrderStatusById(orderId, amount, self);
      }, 2000);
      state.orderTimeId = orderTimeId;
    }
  }).catch(err => {
    self.setData({
      canBuy: true
    });
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
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function toggleTimeOutPopup() {
  toggle('timeOut');
}
</script>
<style scoped>
/* pages/mallModule/member/vipPay/vipPay.wxss */

.top-info {
  width: 100%;
  height: 151rpx;
  background: #30374a;
}

.top-info .user-info {
  display: flex;
  position: relative;
  color: #f5f7fa;
  padding: 21rpx 0 0 30rpx;
}

.top-info .user-info .avatarUrl {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.top-info .user-info .info {
  display: flex;
  flex-direction: column;
  margin-left: 20rpx;
  justify-content: center;
}

.top-info .user-info .info .nickName {
  font-size: 32rpx;
  line-height: 48rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
  display: flex;
  align-items: center;
}

.top-info .user-info .info .member-nameplate {
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

.top-info .user-info .info .member-nameplate .flower {
  width: 21rpx;
  height: 23rpx;
  margin-right: 7rpx;
}

.top-info .user-info .info .status {
  width: 94rpx;
  height: 36rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 18rpx;
  font-size: 24rpx;
  color: #f5f7fa;
  text-align: center;
  line-height: 36rpx;
}

.top-info .user-info .info .validity {
  font-size: 24rpx;
  line-height: 26rpx;
}

.pay-box {
  padding: 0 0 0 28rpx;
}

.pay-box .pay-title {
  font-size: 34rpx;
  height: 94rpx;
  line-height: 94rpx;
  color: #2b2c3c;
  font-weight: bold;
  margin-top: 11rpx;
}

.pay-box .pay-list {
  width: 694rpx;
  height: 252rpx;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  display: flex;
  align-items: center;
}

.pay-box .pay-item {
  width: 229rpx;
  height: 226rpx;
  background: #f7f5f6;
  margin-right: 28rpx;
  position: relative;
  line-height: 48rpx;
  padding: 26rpx 0 0 31rpx;
  display: inline-block;
  vertical-align: middle;
}

.pay-box .pay-item.active {
  background: rgba(237, 182, 55, 0.1);
}

.pay-box .pay-item .name {
  color: #000;
  font-size: 30rpx;
  width: 150rpx;
  line-height: 36rpx;
  margin: 6rpx 0;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.pay-box .pay-item .desc {
  font-size: 22rpx;
  color: #666;
  margin-top: 2rpx;
}

.pay-box .pay-item .price {
  font-size: 28rpx;
  color: #f33;
  position: absolute;
  bottom: 28rpx;
  left: 31rpx;
}

.pay-box .pay-item .price text {
  font-size: 60rpx;
  font-weight: 400;
}

.pay-box .pay-item .checked-box {
  position: absolute;
  right: 18rpx;
  top: 19rpx;
  width: 42rpx;
  height: 42rpx;
}

.pay-box .pay-item .checked-box image {
  width: 100%;
  height: 100%;
}

.pay-btn-box {
  padding-top: 80rpx;
  position: relative;
}

.pay-btn-box .pay-btn {
  width: 500rpx;
  height: 92rpx;
  background: #3d3d43;
  border-radius: 46rpx;
  font-size: 34rpx;
  color: #ffdc8a;
  font-weight: bold;
  line-height: 92rpx;
  text-align: center;
  position: relative;
}

.pay-btn-box .pay-label {
  position: absolute;
  width: 150rpx;
  height: 54rpx;
  z-index: 1;
  left: 469rpx;
  top: 55rpx;
}

.pay-btn-box .pay-label image {
  width: 150rpx;
  height: 54rpx;
}

.pay-btn-box .pay-label text {
  min-width: 100%;
  padding-right: 12rpx;
  display: block;
  padding-left: 12rpx;
  font-size: 24rpx;
  line-height: 42rpx;
  color: #fff;
  background: #F41800;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  white-space: nowrap;
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
</style>