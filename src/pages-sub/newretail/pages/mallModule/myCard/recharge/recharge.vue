<template>
<!--pages/recharge/recharge.wxml-->
<view> 
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<movable-area>
  <view class="balance-box">
    <view class="blance-block">
      <view>
        储值余额
        <view :style="'margin-top: 6rpx;color:' + state.themeColor + ';'"><text class="balance-number" :style="'font-size:' + (state.memberAccountShowGiftBalance ? '50rpx' : '50rpx')">{{state.balance}}</text> 元</view>
      </view>
    </view>
    <view class="handle-block">
      <view @click="toResetPassword" v-if="state.showPassFlag">
        <image :src="state.imagesPath.iconRechargePassword"></image>密码设置
      </view>
      <view @click="toBalance">
        <image :src="state.imagesPath.iconRechargeDetails"></image>交易记录
      </view>
    </view>
  </view>
  <view class="balance-btm" :style="!state.memberAccountShowGiftBalance ? 'padding: 0;' : ''">
    <view style="margin-right:70rpx;" v-if="state.memberAccountShowGiftBalance">
      实充余额：<text class="balance-number" :style="'font-size:' + (state.memberAccountShowGiftBalance ? '28rpx' : '50rpx')">{{state.solidMoney}}</text> 元
    </view>
    <view v-if="state.memberAccountShowGiftBalance">
      赠送余额：<text class="balance-number" :style="'font-size:' + (state.memberAccountShowGiftBalance ? '28rpx' : '50rpx')">{{state.giftBalance}}</text> 元
    </view>
  </view>
  <view class="recharge-box">
    <scroll-view class="recharge-body" scroll-y="">
      <view class="recharge-content">
        <view :class="'recharge-item ' + (item.type === 'FIXED' ? 'recharge-item-fixed' : '') + ' ' + (item.type === 'CUSTOMIZE' ? 'recharge-item-cutom' : '') + ' ' + (currentItem == item.rechangeMoneyId ? 'active' : '')" v-for="(item , index) in state.rechargeList" :key="idx" :data-id="item.rechangeMoneyId" :data-type="item.type" @click="rechargeClick">
          <image class="isChecked" :src="state.imagesPath.iconRechargeChecked" v-if="item.isChecked"></image>
          <view v-if="item.type !== 'CUSTOMIZE'">
            <view class="top">
              <view><text class="recharge-num">{{item.amount}}</text> 元</view>
            </view>
            <view class="bottom" :hidden="item.discountMessage && item.donationAmount <= 0" v-if="item.type !== 'FIXED'">
              <view class="recharge-gift" v-if="item.type === 'GIFT'">
                <image :src="state.imagesPath.iconRechargeGift"></image>
              </view>
              <view class="recharge-desc">
                <text class="recharge-message" v-if="item.discountMessage">{{item.discountMessage}}</text>
                <text class="recharge-donate" v-if="item.donationAmount > 0">赠<text class="color-ff8561">{{item.donationAmount}}</text>元</text>
                <text class="recharge-donate" v-if="item.type === 'DISCOUNT'">减<text class="color-ff8561">{{item.discountAmount}}</text>元</text>
              </view>
            </view>
          </view>
          <view v-else>
            <view v-if="state.rechargeItem.type !== 'CUSTOMIZE'">
              自定义金额
            </view>
            <view class="custom-input" v-if="state.rechargeItem.type === 'CUSTOMIZE'">
              <input type="number" :value="state.customMoney" @input="changeCustomMoney" :placeholder="state.rechargeItem.baseNumber + '的整倍数金额'" placeholder-style="font-weight: 400;font-size: 32rpx;color: #D6D6D6;">
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="recharge-describe" v-if="state.rechargeItem.discountMessage">
      <image :src="state.imagesPath.iconLuckDrawItem"></image>
      <text>{{state.rechargeItem.discountMessage}}</text>
    </view>
    
    <button v-if="!state.hasUserInfo" :style="'background:' + state.themeColor + ';'" class="recharge-btn" @click="getUserInfo">立即支付 <text v-if="state.rechargeItem.amount">{{state.rechargeItem.amount}} 元</text></button>
    <button v-else class="recharge-btn" :style="'background:' + state.themeColor + ';'" :disabled="disabled" @click="toPayRecharge">立即支付 <text v-if="state.rechargeItem.amount">{{filters.toFix(state.rechargeItem.amount - state.rechargeItem.discountAmount)}} 元</text> </button>
  </view>
  <view class="recharge-tips">
    <view>{{state.hintTitle}}</view>
    <view v-for="(item , index) in state.hintData" :key="index">
      <text>· {{item}}\n</text>
    </view>
    <!-- <text>· 可到线下门店消费抵扣;\n</text>
    <text>· 如有疑问请致电{{state.serviceTel}};\n</text>
    <text>· 新用户充值后需设置储值卡支付密码。\n</text> -->
  </view>
  <movable-view :x="state.x" :y="state.y" direction="all" v-if="state.homeBack">
    <image class="movable-view" :src="state.imagesPath.toHome" @click="toHome"></image>
  </movable-view>
</movable-area>
<authorize @login="handleUserLogin"></authorize></view>
</template>
<script setup>
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _apiMemberServiceJs from "@/service/api/newretail/memberService";
import _apiRechargeServiceJs from "@/service/api/newretail/rechargeService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import authorize from '@/pages-sub/newretail/components/authorize/authorize.vue';
const app = getApp();

// pages/recharge/recharge.js
const rechargeService = _apiRechargeServiceJs;
const memberService = _apiMemberServiceJs;
const storeService = _apiStoreServiceJs;
const request = _apiRequestJs;
const util = _utilsUtilsJs;
const address = _utilsAddressJs;
const NAVPAGE = _utilsNavPageJs;
const AUTHORIZE = _utilsAuthorizeJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const sysService = _apiSystemServiceJs;

//获取应用实例
const state = reactive({
  showPassFlag: false,
  navigationBarTitle: "余额充值",
  imagesPath: IMGAGESPATH,
  rechargeList: [],
  balance: 0.00,
  serviceTel: '',
  phone: false,
  sceneType: 'normal',
  stores: {
    id: ''
  },
  x: 750,
  y: 450,
  scale: 2,
  homeBack: false,
  hasUserInfo: false,
  isMember: false,
  rechargeItem: {
    discountMessage: ""
  },
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  hintTitle: "",
  hintData: [],
  customMoney: '',
  // 自定义充值金额
  memberAccountShowGiftBalance: false,
  solidMoney: 0,
  // 实充余额
  giftBalance: 0 //返现余额
});
function toHome() {
  NAVPAGE.toHome();
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
  console.log(tempData, 'tempData');
  //设置当前样式
  state.currentItem = id;
  state.rechargeItem = tempData;
  state.rechargeList = state.rechargeList;
}
function checkAuth() {
  try {
    if (!app.globalData.userInfo) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    // Do something when catch error
  }
}
function getRechargeList() {
  rechargeService.query().then(res => {
    console.log(res);
    let tempList = [];
    res.forEach(item => {
      let tempItem = {
        amount: item.amount,
        discountAmount: item.discountAmount,
        discountMessage: item.discountMessage ? item.discountMessage : '',
        donationAmount: item.donationAmount,
        rechangeMoneyId: item.rechangeMoneyId,
        baseNumber: item.baseNumber,
        type: item.type,
        isChecked: false
      };
      tempList.push(tempItem);
    });
    state.rechargeList = tempList;
  });
}
function changeCustomMoney(e) {
  state.customMoney = e.detail.value;
}
function toPayRecharge() {
  const that = this;
  let rechangeMoneyId = state.currentItem;
  if (!canRechange) {
    // 当前已经在充值中
    return;
  }
  if (rechangeMoneyId !== '' && rechangeMoneyId !== undefined) {
    canRechange = false;
    let postData = {
      rechangeMoneyId: rechangeMoneyId,
      sourceType: 'WX_XCX',
      sourceStoreId: state.stores.id
    };
    if (state.rechargeItem.type === 'CUSTOMIZE') {
      if (state.customMoney > 0) {
        let isInteger = parseFloat(state.customMoney) * 100 % (state.rechargeItem.baseNumber * 100);
        if (isInteger !== 0) {
          canRechange = true;
          return uni.showToast({
            title: `请输入${state.rechargeItem.baseNumber}的整倍数金额`,
            icon: 'none',
            duration: 2000
          });
        }
        postData = {
          ...postData,
          customizeAmount: parseFloat(state.customMoney)
        };
      } else {
        canRechange = true;
        return uni.showToast({
          title: '充值金额必须大于0',
          icon: 'none',
          duration: 2000
        });
      }
    }
    if (state.sceneType == 'underLineQrcode') {
      postData = {
        ...postData,
        sceneType: 'UNDER_LINE_QRCODE'
        // sourceStoreId: that.data.stores.id,
      };
    }
    rechargeService.createOrder(postData).then(res => {
      let orderId = res.id;
      let tempData = {
        orderId: orderId,
        payMethod: app.globalData.paymentMethod || request.PAYMETHOD
      };
      rechargeService.getPaySign(tempData).then(res => {
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
            canRechange = true;
            getBalance();
            uni.showToast({
              title: '充值成功',
              icon: 'none',
              duration: 2000
            });
          },
          'fail': function (res) {
            console.log('支付失败');
            console.log(res);
            canRechange = true;
            if (res.errMsg.indexOf("cancel") >= 0) {
              uni.showToast({
                title: '您取消了支付~',
                icon: 'none',
                duration: 2000
              });
            } else {
              uni.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              });
            }
          }
        });
      }).catch(err => {
        canRechange = true;
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    }).catch(e => {
      canRechange = true;
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    });
  } else {
    uni.showToast({
      title: '请选择充值金额~',
      icon: 'none',
      duration: 2000
    });
  }
}
function toBalance() {
  if (state.hasUserInfo) {
    if (state.isMember) {
      NAVPAGE.toBalance();
    } else {
      NAVPAGE.toAuthorize();
    }
  }
}
function toResetPassword() {
  if (state.hasUserInfo) {
    if (state.isMember) {
      NAVPAGE.toResetPassword();
    } else {
      NAVPAGE.toAuthorize();
    }
  }
}
function getBalance() {
  let self = this;
  let keyArr = ['memberAccountShowGiftBalance'];
  const keys = keyArr.join(",");
  sysService.query(keys).then(res => {
    if (res) {
      res.forEach(val => {
        if (val.key === 'memberAccountShowGiftBalance') {
          state.memberAccountShowGiftBalance = val.value === 'TRUE';
        }
      });
      if (state.memberAccountShowGiftBalance) {
        let postData = {
          memberId: app.globalData.userInfo.member.id
          // memberId: '1920322267577856001'
        };
        memberService.getMbrBalanceSplit(postData).then(res => {
          const data = res;
          if (res && data && JSON.stringify(data) !== '{}') {
            let balance = parseFloat(parseFloat(data.balance) + parseFloat(data.giftBalance)).toFixed(2);
            state.balance = balance;
            state.solidMoney = data.balance;
            state.giftBalance = data.giftBalance;
          } else {
            state.balance = 0;
            state.solidMoney = 0;
            state.giftBalance = 0;
          }
        }).catch(e => {
          uni.showToast({
            title: e.message,
            icon: 'none',
            duration: 2000
          });
        });
      } else {
        memberService.getMbrBalance().then(res => {
          state.balance = res;
        }).catch(e => {
          uni.showToast({
            title: e.message,
            icon: 'none',
            duration: 2000
          });
        });
      }
    }
  });
  // if()
}
function getHint() {}
onLoad(function (options) {
  const that = this;
  sysService.query("cardReminder").then(res => {
    if (res !== null && res.length > 0 && res[0].value != null && res[0].value !== "") {
      res = res[0].value;
      const reg = new RegExp("<br>", "g");
      let data = res.replace(reg, "\n");
      data = data.split(/\s+/);
      for (let i = 0; i < data.length; i++) {
        if (data[i] == "" || data[i] == null || typeof data[i] == "undefined") {
          data.splice(i, 1);
          i = i - 1;
        }
      }
      const hintTitle = data.slice(0, 1);
      const cardReminder = data.slice(1);
      state.hintTitle = hintTitle;
      state.hintData = cardReminder;
      console.log(data);
    }
  });
  uni.hideShareMenu();
  canRechange = true;
  state.serviceTel = app.globalData.servicePhone;
  state.themeColor = app.globalData.uiconfig.themeColor;
  let pageStack = getCurrentPages();
  console.log(pageStack);
  if (pageStack.length === 1) {
    state.homeBack = true;
  }
  getRechargeList();
  const loginStatus = checkAuth();
  if (loginStatus) {
    if (app.globalData.userInfo.member) {
      getBalance();
    } else {
      uni.showToast({
        title: '您还不是会员，请先绑定手机号码成为会员',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        handlePopupPhone();
      }, 2000);
    }
  } else {}
  if (options.scene) {
    let scene = decodeURIComponent(options.scene);
    if (scene.indexOf(',') > 0) {
      // 统计PV
      if (app.globalData.storeInfo) {
        ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
      }
    } else {
      // 查询所有门店判断当前scene数据是否是门店id，当前门店列表中是否有当前门店
      storeService.queryList().then(res => {
        console.log(res);
        let stores = null;
        let allStores = [];
        if (res && res.length > 0) {
          res.forEach(item => {
            if (item.status === 'OPEN') {
              if (item.id === scene) {
                stores = item;
                app.globalData.storeInfo = item;
              }
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
            state.sceneType = 'underLineQrcode';
            ANALYSIS.PVStatistics(state.stores.id);
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
                  if (app.globalData.storeInfo) {
                    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
                  }
                  state.sceneType = 'underLineQrcode';
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
    // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
    if (app.globalData.storeInfo) {
      // 统计PV
      state.stores = app.globalData.storeInfo;
      ANALYSIS.PVStatistics(state.stores.id);
    } else {
      address.getLocation().then(res => {
        console.log(res);
        app.globalData.storeInfo = res;
        // 统计PV
        state.stores = res;
        ANALYSIS.PVStatistics(state.stores.id);
      });
    }
  }
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
  // 判断用户是否授权
  state.showPassFlag = app.globalData.systemConfigure.isRechargePasswordShow;
  checkUserInfo();
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function handleUserLogin() {
  console.log(app.globalData.userInfo);
  const self = this;
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo;
    if (app.globalData.userInfo.member) {
      getBalance();
    } else {
      NAVPAGE.toAuthorize();
    }
  }
}
function handlePopupPhone() {
  if (!app.globalData.userInfo.member) {
    state.phone = true;
  } else {
    state.phone = false;
    getBalance();
  }
}
function handleBindPhone(e) {
  console.log(e.detail);
  if (e.detail.bindMobile === true) {
    handlePopupPhone();
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
      state.isMember = true;
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
</script>
<style scoped>
/* pages/recharge/recharge.wxss */

page {
  background: #f1f1f1;
}

.color-ff8561 {
  color: #ff8561;
}

.balance-box {
  /* height: 186rpx; */
  /* width: 100%; */
  /* margin-bottom: 3rpx; */
  background: #fff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 29rpx 40rpx 0;
}

.balance-btm {
  padding: 0 40rpx 46rpx;
  background: #fff;
  margin-bottom: 3rpx;
  font-size: 28rpx;
}

.balance-btm {
  display: flex;
  align-items: center;
}

.balance-box .blance-block{
  flex: 1;
  /* height: 140rpx; */
  /* line-height: 140rpx; */
  font-size: 32rpx;
  font-weight: bold;
}
.blance-block .balance-number{
  font-size: 50rpx;
}
.balance-box .handle-block{
  width: 146rpx;
  font-size: 26rpx;
}
.handle-block view{
  height: 70rpx;
  line-height: 70rpx;
}
.handle-block image{
  width: 24rpx;
  height: 30rpx;
  margin-right: 16rpx;
  vertical-align:middle;
}
.balance-box .reset-password {
  position: absolute;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #009f55;
  right: 40rpx;
  top: 40rpx;
  padding-left: 48rpx;
}

.balance-num {
  color: #ff8561;
  font-size: 48rpx;
  font-weight: bold;
  line-height: 108rpx;
}

.balance-tips {
  font-size: 24rpx;
  color: #454545;
  line-height: 26rpx;
  /* margin-bottom: 16rpx; */
}

.balance-more {
  font-size: 24rpx;
  color: #009f55;
  text-align: center;
  line-height: 27rpx;
  height: 27rpx;
  padding: 16rpx;
  position: relative;
}

.balance-more image {
  width: 24rpx;
  height: 27rpx;
  margin-right: 4rpx;
  vertical-align: top;
}

.recharge-box {
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 60rpx 40rpx;
}

.recharge-top {
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

.recharge-top>text.top-text {
  text-align-last: left;
  display: block;
  font-size: 28rpx;
  color: #1b1b1d;
  line-height: 86rpx;
}

.recharge-top .top-line {
  width: 184rpx;
  height: 2rpx;
  background: #b6b6b6;
  display: block;
}

.recharge-body {
  margin-bottom: 60rpx;
}

.recharge-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: calc(335rpx*2);
  box-sizing: border-box;
  justify-content: flex-start;
}

.recharge-content .space {
  width: 1rpx;
  height: 100%;
  float: left;
}

.recharge-item {
  width: calc( (100% - 24rpx) / 2 );
  height: 188rpx;
  padding: 24rpx 0;
  border-radius: 6rpx;
  border: 1px solid #454545;
  position: relative;
  /* margin-bottom: 21rpx; */
  /* margin-right: 19rpx; */
  box-sizing: border-box;
  text-align: center;
  margin: 15rpx 12rpx;
  /* display: flex; */
}

.recharge-item-cutom {
  /* width: 100%;
  height: 100%; */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #454545;
  font-weight: bold;
}

.recharge-item-fixed {
  display: flex;
  align-items: center;
  justify-content: center;
}

.recharge-item-cutom input{
  /* width: 100%;
  height: 100%; */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #EB702D;
  font-weight: bold;
  font-size: 44rpx;
}

.recharge-item:nth-child(odd){
  margin-left: 0;
}
.recharge-item:nth-child(even){
  margin-right: 0;
}

.recharge-item.active {
  border: 3rpx solid #FF8105;
}

.recharge-item:nth-of-type(3n) {
  /* margin-right: 0; */
}

.recharge-item .top {
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

.recharge-item .top .recharge-num{
  font-size: 50rpx;
}

.recharge-item .isChecked{
  position: absolute;
  right: -1rpx;
  top: -1rpx;
  width: 46rpx;
  height: 46rpx;
}

.recharge-item .top>text:first-of-type {
  line-height: 60rpx;
}

/* .recharge-item .top text:last-of-type {
  font-size: 24rpx;
  font-weight: normal;
} */

.recharge-item .top text:last-of-type>text {
  color: #009f55;
}

.recharge-item .bottom {
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

.recharge-item .bottom .recharge-gift{
  width: 48rpx;
  height: 38rpx;
  margin-right: 8rpx;
}
.recharge-item .bottom .recharge-gift image{
  width: 48rpx;
  height: 38rpx;
}

.recharge-item .bottom .recharge-desc{
  flex: 1;
  width: 80%;
}

.recharge-desc .recharge-message{
  color: #ff8561;
  display: block;
  width: 100%;
  text-align: left;
}

.recharge-desc .recharge-donate{
  font-size: 32rpx;
  width: 100%;
}

.recharge-item .bottom text {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recharge-btn {
  width: 670rpx;
  height: 100rpx;
  background: #FF8105;
  line-height: 100rpx;
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
  margin-bottom: 40rpx;
  border-radius: 54rpx;
}

.recharge-btn::after {
  border: 0;
}

.recharge-tips {
  font-size: 26rpx;
  line-height: 38rpx;
  color: #8b8b8c;
  padding: 25rpx 40rpx 48rpx 40rpx;
  background: #fff;
}

.recharge-tips>view:first-of-type {
  margin-bottom: 11rpx;
  font-size: 28rpx;
}

movable-area {
  height: 100%;
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

.recharge-describe {
  width: 100%;
  font-size: 28rpx;
  line-height: 42rpx;
  color: #454545;
  margin-bottom: 24rpx;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.recharge-describe image {
  width: 18rpx;
  height: 24rpx;
  margin-right: 8rpx;
  margin-top: 10rpx;
}

.custom-input {
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  /* margin-bottom: 40rpx; */
  /* border: 1px solid #FF8105; */
  border-radius: 40rpx;
  padding-left: 10rpx;
  box-sizing: border-box;
}
</style>