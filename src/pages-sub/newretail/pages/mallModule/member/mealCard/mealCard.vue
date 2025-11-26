<template>
<!-- pages/myCoupon/myCoupon.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="coupon-main" v-if="!state.loading">
    <view class="coupon-item-box" :style="'min-height:' + state.couponBoxHeight + 'px;'">
        <view :class="'coupon-available ' + (state.type === 'DISCOUNT' ? 'show' : 'hidden')">
            <view v-for="(item , index) in tempList" :key="index">
                <!-- <coupon-item bind:onClickCouponItem="clickCouponItem" coupon="{{item}}"></coupon-item> -->
                <!-- components/coupon/coupon-receive/coupon-receive.wxml -->
                <view class="coupon-item" :data-cardno="item.cardNo" @click="clickItem">
                    <view class="main-coupon">
        
                        <view class="main-coupon-function">
                            <view>
                               {{item.companyName}}
                            </view>
                        </view>
                        <view class="main-coupon-detail">
                            <text class="main-coupon-detail-title">{{item.cardNoA}}</text>
                            <!-- <view class="coupon-time-label"
                                hidden="{{item.function !== 'CASH' || !item.useAmountLimit}}">
                                满{{item.useAmountLimit}}可用</view>
                            <text>{{item.nr_condition}}</text> -->
                            <!-- <view class="mini-function">{{coupon.nr_function}}</view> -->
                        </view>
                        <view>
                            <text>{{item.memberName}}</text> <text> | </text> <text>卡余额：￥{{item.balance}}</text>
                        </view>
                    </view>
                </view>
            </view>

        </view>

    </view>
    <view class="coupon-bottom-box">
        <!-- <view class="coupon-data" hidden="{{!noCouponData}}">没有更多数据</view> -->
    </view>
    <view class="loading" :hidden="!state.load">{{state.loadingText}}</view>
</view>
<view class="content" v-if="state.loading">
    <view class="spinner">
        <view class="rect1" :style="'background-color: ' + state.themeColor"></view>
        <view class="rect2" :style="'background-color: ' + state.themeColor"></view>
        <view class="rect3" :style="'background-color: ' + state.themeColor"></view>
        <view class="rect4" :style="'background-color: ' + state.themeColor"></view>
        <view class="rect5" :style="'background-color: ' + state.themeColor"></view>
    </view>
</view>

</template>
<script setup>
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsCouponHandler from "@/utils/newretail/couponHandler";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
// import { onPageScroll, onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import couponItem from '@/pages-sub/newretail/components/coupon/coupon-item4/coupon-item.vue';
const app = getApp();

// pages/myCoupon/myCoupon.js
const couponService = _apiCouponServiceJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const couponHandler = _utilsCouponHandler;
const wxbarcode = _utilsSelfJs;
const themeManager = _utilsThemeManagerJs;
const ADDRESS = _utilsAddressJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "余额",
  imagesPath: IMGAGESPATH,
  userInfo: {},
  type: 'DISCOUNT',
  page: 1,
  active: false,
  pageSize: 10,
  externalPage: 1,
  limit: 10,
  available: true,
  searchCount: true,
  pageCount: 1,
  couponsList: [],
  discountCoupon: [],
  // 优惠券
  freeshipCoupon: [],
  // 运费券
  x: 0,
  y: 60,
  scale: 2,
  homeBack: false,
  loading: true,
  member: {},
  load: false,
  loadingText: '正在加载...',
  noCouponData: false,
  codeText: '',
  //弹窗控制
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    couponCode: false
  },
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  externalPageCount: 1,
  floorstatus: false,
  windowHeight: 667,
  couponBoxHeight: 667
});
let _data = {
  couponsList: [],
  discountCoupon: [],
  // 优惠券
  freeshipCoupon: [] // 运费券
};
onPageScroll(function (e) {
  if (e.scrollTop > 0) {
    state.floorstatus = true;
  }
});
function clickCategory() {
  if (state.type === 'DISCOUNT') {
    state.type = 'FREESHIP';
  } else {
    state.type = 'DISCOUNT';
  }
  if (uni.pageScrollTo && state.floorstatus) {
    uni.pageScrollTo({
      scrollTop: 0
    });
  }
}
function clickCouponItem(e) {
  toCouponDetails(e.detail);
}
function toCouponDetails(val) {
  const isExternal = val.external;
  const couponActivityId = val.activityid;
  const type = val.type;
  const couponsList = state.couponsList;
  const id = val.id;
  if (!isExternal) {
    let opts = '?couponActivityId=' + couponActivityId + '&type=' + type + '&couponId=' + id + '&isExternal=' + isExternal;
    NAVPAGE.toCouponDetails(opts);
  } else {
    // 外部券详情跳转
    let tempCoupons = null;
    couponsList.forEach(item => {
      if (item.externalCardNum === id) {
        tempCoupons = item;
      }
    });
    let coupon = JSON.stringify(tempCoupons);
    let opts = '?couponActivityId=' + couponActivityId + '&type=' + type + '&couponId=' + id + '&isExternal=' + isExternal + '&coupon=' + coupon;
    NAVPAGE.toCouponDetails(opts);
  }
}
function toCouponHistory(val) {
  let opts = '?type=' + val.currentTarget.dataset.type;
  NAVPAGE.toCouponHistory(opts);
}
function clickItem(val) {
  let cardno = val.currentTarget.dataset.cardno;
  if (state.active) {
    uni.setStorageSync('wj_cardno', cardno);
    uni.navigateBack({
      delta: '-1'
    });
  } else {
    uni.navigateTo({
      url: '../mealCardDetails/mealCardDetails?cardno=' + cardno
    });
  }
}
function getCouponList(page, pageSize, memberId) {
  let tempList = [];
  let postData = {
    page: page,
    pageSize: pageSize,
    memberId: memberId
  };
  let listData = couponService.queryMspAccountList(postData).then(res => {
    uni.hideToast();
    state.pageCount = res.pageCount;
    const that = this;
    if (res.records && res.records.length > 0) {
      res.records.forEach(item => {
        item.cardNoA = codeTextPartition(item.cardNo);
      });
      tempList = res.records;
    }
    state.tempList = tempList;
  }).catch(e => {
    // wx.showToast({
    //     title: e.message,
    //     icon: 'none',
    //     duration: 2000
    // })
  });
  return listData;
}
function handleCouponName(name) {
  if (name === 'FREESHIP') {
    return '运费券';
  } else if (name === 'DISCOUNT') {
    return '折扣券';
  } else if (name === 'CASH') {
    return '满减券';
  } else if (name === 'GIFT') {
    return '礼品券';
  } else {
    return '优惠券';
  }
}
function handleCouponStatus(status) {
  if (status === 'OPEN') {
    return '已发放';
  } else if (status === 'USED') {
    return '已使用';
  } else if (status === 'EXPIRE') {
    return '已过期';
  } else if (status === 'CANCEL') {
    return '已作废';
  } else if (status === 'MADE') {
    return '已生成';
  } else {
    return '已领取';
  }
}
function toUse(e) {
  console.log(e.detail.coupon.couponActivityId);
  if (!e.detail.coupon || !e.detail.coupon.couponActivityId) {
    return;
  }
  couponService.queryByCouponActivityId(1, 10, e.detail.coupon.couponActivityId, state.storeId).then(res => {
    console.log(res);
    if (!res || !res.records || res.records.length === 0) {
      uni.showToast({
        title: "商品已下架~",
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (res.records.length === 1) {
      let goodsType = 'normal';
      let productId = res.records[0].id;
      const business = res.records[0].business;
      if (business === 'RETAIL' || business === 'CATERING' || business === 'RETAIL_CATERING') {
        goodsType = 'normal';
      } else if (business === 'SCORE') {
        goodsType = 'score';
      } else if (business === 'ADVANCE_SELL') {
        goodsType = 'advanceSell';
      }
      const opts = '?productId=' + productId + '&type=' + goodsType;
      NAVPAGE.toGoodsDetails(opts);
    } else {
      let opts = "?couponActivityId=" + e.detail.coupon.couponActivityId + "&couponName=" + e.detail.coupon.name;
      NAVPAGE.toGoodsList(opts);
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toHome() {
  NAVPAGE.toHome();
}
function toCouponCenter() {
  NAVPAGE.toCouponCenter();
}
function initPage() {
  const self = this;
  state.storeId = app.globalData.storeInfo.id;
  state.storeInfo = app.globalData.storeInfo;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      const memberInfo = app.globalData.userInfo.member;
      state.member = memberInfo;
      let listData = getCouponList(state.page, state.pageSize, memberInfo.id);
      Promise.all([listData]).then(res => {
        console.log(res);
        if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
          _data.discountCoupon = res[0][0]; // 优惠券
          state.discountCoupon = res[0][0];
        }
        state.loading = false;
      });
    } else {
      uni.showToast({
        title: '您还不是会员，请先绑定手机号码成为会员',
        icon: 'none',
        duration: 500
      });
      setTimeout(() => {
        NAVPAGE.toAuthorize();
      }, 500);
      state.loading = false;
    }
  } else {
    uni.showToast({
      title: '您还未授权，请点击允许授权',
      icon: 'none',
      duration: 500
    });
    setTimeout(() => {
      NAVPAGE.toAuthorize();
    }, 500);
    state.loading = false;
  }
}
onLoad(function (options) {
  if (options.active) {
    state.active = true;
  }
  uni.hideShareMenu();
  const self = this;
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  let pageStack = getCurrentPages();
  console.log(pageStack);
  if (pageStack.length === 1) {
    state.homeBack = true;
  }
  const navHeight = app.globalData.navHeight;
  // 是否启用外部券的配置信息：TRUE是、FALSE否，默认TRUE
  state.navHeight = navHeight;
  state.windowHeight = app.globalData.systemInfo.windowHeight - navHeight - 110 * app.globalData.systemInfo.windowWidth / 750;
  state.couponBoxHeight = app.globalData.systemInfo.windowHeight - navHeight - 110 * app.globalData.systemInfo.windowWidth / 750 - 143 * app.globalData.systemInfo.windowWidth / 750;
  let _isUseExternalCoupon = true;
  // 查询系统配置项，根据系统配置项控制列表菜单显示
  let systemOptions = app.globalData.configureInfo;
  systemOptions.forEach(item => {
    // 是否启用外部券的配置信息：TRUE是、FALSE否，默认TRU
    if (item.key === 'isUseExternalCoupon' && item.value != null) {
      item.value == 'TRUE' ? _isUseExternalCoupon = true : _isUseExternalCoupon = false;
    }
  });
  isUseExternalCoupon = _isUseExternalCoupon;
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
    initPage(); // 初始化页面内容
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation().then(res => {
      app.globalData.storeInfo = res;
      // 统计PV
      ANALYSIS.PVStatistics(res.id);
      initPage(); // 初始化页面内容
    }).catch(err => {
      console.log(err);
    });
  }
});
onReady(function () {});
onShow(function () {
  const self = this;
  console.log(app.globalData.userInfo);
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      initPage();
      const memberInfo = app.globalData.userInfo.member;
      state.member = memberInfo;
    }
  }
});
onHide(function () {
  uni.hideLoading();
});
onUnload(function () {
  uni.hideLoading();
});
onPullDownRefresh(function () {
  console.log("onPullDownRefresh");
  const that = this;
  state.page = 1;
  state.externalPage = 1;
  state.couponsList = [];
  state.externalPageCount = 1;
  _data.couponsList = [];
  _data.discountCoupon = [];
  _data.freeshipCoupon = [];
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    let tempList = getCouponList(1, state.pageSize, state.member.id);
    Promise.all([tempList]).then(res => {
      console.log(res[0]);
      if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
        _data.discountCoupon = res[0][0]; // 优惠券
        state.discountCoupon = res[0][0];
      }
      uni.stopPullDownRefresh();
    });
  } else {
    uni.showToast({
      title: '您还不是会员，请绑定手机号成为会员~',
      icon: 'none',
      duration: 2000
    });
  }
});
onReachBottom(function () {
  console.log("onReachBottom");
  // this.loadingCoupon()
});
function loadingCoupon() {
  const that = this;
  state.load = true;
  uni.showLoading({
    title: "加载中",
    mask: true
  });
  _data.couponsList = state.couponsList;
  _data.discountCoupon = state.discountCoupon;
  _data.freeshipCoupon = state.freeshipCoupon;
  let index = state.page;
  const memberId = state.member.id;
  index++;
  let tempList = getCouponList(index, state.pageSize, state.member.id);
  Promise.all([tempList]).then(res => {
    if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
      console.log(res[0]);
      setCoupons(res[0]);
      state.page = index;
      if (res[0].length < state.limit) {}
    } else {
      // 内部券加载完开始查询外部券
    }
    uni.stopPullDownRefresh();
  });
}
function setCoupons(coupons) {
  const that = this;
  let tempDiscountCoupon = _data.discountCoupon;
  let tempFreeshipCoupon = _data.freeshipCoupon;
  tempDiscountCoupon = tempDiscountCoupon.concat(coupons[0]);
  tempFreeshipCoupon = tempFreeshipCoupon.concat(coupons[1]);
  state.discountCoupon = tempDiscountCoupon;
  state.freeshipCoupon = tempFreeshipCoupon;
  state.load = false;
}
onShareAppMessage(function () {});
function showCouponCode(e) {
  const that = this;
  const couponId = e.detail.couponid;
  const couponsList = state.discountCoupon; // 折扣券有券码
  let coupon = null;
  for (let i = 0; i < couponsList.length; i++) {
    const ele = couponsList[i];
    if (ele.id === couponId) {
      coupon = ele;
    }
  }
  if (coupon) {
    if (coupon.isExternal && coupon.externalCardNum) {
      // 外部券
      showCode(coupon.externalCardNum);
      toggleCouponCodePopup();
    } else if (!coupon.isExternal && coupon.cardNum) {
      // 内部券
      const cardNum = app.globalData.systemConfigure.externalCouponPrefix + coupon.cardNum;
      showCode(cardNum);
      toggleCouponCodePopup();
    }
  }
}
function toggleCouponCodePopup() {
  toggle('couponCode');
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function catchtouchmove() {}
function showCode(codeText) {
  wxbarcode.barcode('barcode', codeText, 629, 166);
  wxbarcode.qrcode('qrcode', codeText, 290, 290);
  state.codeText = codeTextPartition(codeText);
  state.showCode = true;
}
function codeTextPartition(val) {
  console.log(val);
  val = val.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
  console.log(val);
  return val;
}
</script>
<style scoped>
/* pages/myCoupon/myCoupon.wxss */

page {
    /* background-color: #f3f2f6; */
    height: 100%;
    width: 100%;
}

.coupon-main {
    width: 100%;
    /* height: calc(100% - 130rpx); */
    /* background-color: #f3f2f6; */
}

.coupon-nav {
    overflow: hidden;
    height: 108rpx;
    width: 100%;
    line-height: 108rpx;
    display: flex;
    border-top: 2rpx solid #e6e6e6;
    background: #fff;
    color: #8b8b8c;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
}

.coupon-nav>view {
    font-size: 32rpx;
}

.selected {
    flex: 1;
    color: #009f55;
    border-bottom: 5rpx solid #009f55;
    text-align: center;
}

.select {
    flex: 1;
    text-align: center;
}

/*券列表  */

.show {
    display: block;
    margin-top: 30rpx;
    /* background-color: #f3f2f6; */
}

.hidden {
    display: none;
    background-color: #f3f2f6;
}

.coupon-item-box {
  
}

coupon-item:last-of-type {
    margin-bottom: 0;
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
    color: #009f55;
    border: 1rpx solid #009f55;
    margin-top: 50rpx;
    width: 242rpx;
    height: 60rpx;
    background: #fff;
}

.coupon-bottom-box {
    width: 100%;
    height: 122rpx;
    margin-top: 24rpx;
    font-size: 24rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    /* background-color: #f3f2f6; */
}

.coupon-bottom-box view {
    height: 36rpx;
    padding: 0 30rpx;
}

.coupon-data {
    border-right: 1rpx solid #f0f0f0;
    color: #8b8b8c;
}

.coupon-history {
    font-size: 24rpx;
    color: #009f55;
    display: flex;
    justify-content: center;
    align-items: center;
}

.coupon-history image {
    width: 11rpx;
    height: 20rpx;
    margin-left: 8rpx;
    margin-top: 2rpx
}

.loading {
    color: #999;
    font-size: 28rpx;
    line-height: 80rpx;
    height: 80rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    /* background: #eee; */
}

movable-area {
    height: 100%;
    width: 100%;
}

.movable-view {
    width: 120rpx;
    height: 120rpx;
    position: fixed;
    right: 0;
    bottom: 120rpx;
}

movable-view {
    width: 120rpx;
    height: 120rpx;
}

.content {
    width: 100%;
    height: 100%;
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
    background-color: #009f55;
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

.popup-coupon-code-box {
    background: #ffffff;
    width: 708rpx;
    height: 900rpx;
    border-radius: 10rpx;
}

.popup-top-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    padding-top: 22rpx;
    margin-bottom: 12rpx;
}

.popup-top-info text {
    font-size: 30rpx;
    color: #000000;
    line-height: 50rpx;
    margin-top: 6rpx;
    margin-bottom: 36rpx;
}

.popup-top-info .popup-coupon-code-tips {
    color: #B0B0B0;
    margin: 0;
}

.popup-top-info .logo {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
}

.coupon-code-box {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.coupon-code {
    width: 629rpx;
    height: 166rpx;
}

.barcode-box {
    width: 629rpx;
    height: 166rpx;
    margin: 0 auto;
}

.barcode-box canvas {
    width: 629rpx;
    height: 166rpx;
    margin: 0 auto;
}

/* components/coupon/coupon-receive/coupon-receive.wxss */

.coupon-item {
    width: 670rpx;
    min-height: 249rpx;
    padding-bottom: 20rpx;
    overflow: hidden;
    margin: 0 auto;
    box-sizing: border-box;
    /* padding: 15rpx 0rpx; */
    font-size: 24rpx;
    color: #8b8b8c;
    position: relative;
    display: flex;
    flex-direction: column;
    margin-bottom: 34rpx;
}

.coupon-item .coupon-bg {
    width: 708rpx;
    height: 338rpx;
    position: absolute;
    top: 0;
    left: 0;
}

.coupon-item image.coupon-logo {
    width: 89rpx;
    height: 58rpx;
    margin-top: 10rpx;
    position: relative;
}

.coupon-item button {
    width: 160rpx;
    height: 60rpx;
    background: #ff762a;
    color: #fff;
    font-size: 26rpx;
    border: none;
    padding: 0rpx;
    line-height: 60rpx;
    position: absolute;
    right: 40rpx;
    bottom: 0rpx;
}

.use-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FF7121;
    border-radius: 4rpx;
    width: 160rpx;
    height: 50rpx;
    color: #ff762a;
    font-size: 26rpx;
    color: #fff;
    padding: 0rpx;
    position: absolute;
    right: 40rpx;
    bottom: 0rpx;
    border: 2rpx solid #ff762a;
}

.coupon-item .sign-unable-btn {
    background: #e6e6e6;
}

.coupon-item .coupon-info {
    width: 450rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
}

.coupon-item .name {
    font-size: 32rpx;
    color: #454545;
    font-weight: bold;
    margin: 10rpx 0rpx 20rpx 0;
    position: relative;
}

.coupon-item .name text {
    color: #ff8561;
    font-size: 36rpx;
    font-style: oblique;
    margin: 0rpx 10rpx;
}

.coupon-item .coupon-bottom {
    position: absolute;
    bottom: 40rpx;
    left: 50rpx;
    width: 600rpx;
}

.coupon-item .coupon-bottom .remain-count {
    float: right;
}

.coupon-item .coupon-bottom .remain-count text {
    color: #ff8561;
}

.coupon-price {
    color: #ffbf00;
    font-size: 28rpx;
    line-height: 188rpx;
    width: 165rpx;
    text-align: center;
}

.coupon-price text {
    font-size: 48rpx;
    font-weight: bold;
}

.coupon-price.discount text {
    font-size: 36rpx;
}

.coupon-price.freeship text {
    font-size: 36rpx;
}

.coupon-middle {
    width: calc(100% - 165rpx);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.coupon-middle .name {
    font-size: 32rpx;
    color: #020202;
    line-height: 36rpx;
    margin-bottom: 30rpx;
    margin-top: 9rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.coupon-middle .condition {
    font-size: 24rpx;
    line-height: 36rpx;
    color: #686868;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.main-coupon {
    position: relative;
    background-color: #FD8514;
    width: 670rpx;
    height: 100%;
    border-radius: 20rpx;

    position: relative;
    color: #fff;
    padding: 0rpx 30rpx 20rpx;
    box-sizing: border-box;
}

.main-coupon-code {
    position: absolute;
    right: 0;
    top: 0;
    width: 50rpx;
    height: 50rpx;
}

.main-coupon-code image {
    width: 50rpx;
    height: 50rpx;
}

.main-coupon-function {
    /* width: 232rpx; */
    /* height: 150rpx; */
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: center; */
    font-size: 33rpx;
    font-weight: Medium;
    padding-top: 20rpx;
    font-family: SourceHanSansCN-Medium;
    /* padding-left: 24rpx;
    box-sizing: border-box;*/
}

.main-coupon-detail {
    /* width: calc(100% - 252rpx); */
    /* display: flex; */
    /* flex-direction: column; */
    /* align-items: flex-start; */
    margin: 20rpx 0rpx;
    justify-content: space-around;
    color: #666666;
}

.main-coupon-detail-title {
    font-size: 67rpx;
    color: #fff;
    /* color: #3e3e3e; */
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.mini-function {
    font-size: 20rpx;
    background-color: #ededed;
    width: 80rpx;
    height: 30rpx;
    border-radius: 15rpx;
    color: #999999;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20rpx;
}

.coupon-time-expand-board {
    width: auto;
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding: 10rpx 20rpx;
}

.coupon-time-baord {
    display: flex;
}

.coupon-time-icon {
    width: 20rpx;
    height: 20rpx;
}

.coupon-time-label {
    font-size: 22rpx;
    color: #666666;
}

.coupon-rule-btn {
    width: 100rpx;
    height: 30rpx;
    font-size: 26rpx;
}

.coupon-head-info {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
}

.coupon-seperator {}

.qrcode-box {
    margin-top: 28rpx;
    width: 290rpx;
    height: 290rpx;
}

.qrcode-box canvas {
    width: 290rpx;
    height: 290rpx;
}

.coupon-code-box text {
    width: 100%;
    display: block;
    font-size: 34rpx;
    color: #333333;
    line-height: 42rpx;
    margin-top: 19rpx;
    text-align: center;
}
</style>