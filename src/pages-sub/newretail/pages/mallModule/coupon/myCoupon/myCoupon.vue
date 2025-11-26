<template>
<!-- pages/myCoupon/myCoupon.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
  <view class="coupon-main" v-if="!state.loading" :style="'height:' + state.windowHeight + 'px;padding-top:110rpx'">
    <view class="coupon-nav" :style="'top:' + navHeight + 'px'">
      <view :class="state.type == 'DISCOUNT' ? 'selected' : 'select'" :style="'color: ' + (state.type === 'DISCOUNT' ? state.themeColor : '') + ';'" @click="clickCategory">
        <text>商品优惠券</text> 
        <view class="borderbox" :style="'background-color: ' + (state.type === 'DISCOUNT' ? state.themeColor : '') + ';'" v-if="state.type == 'DISCOUNT'"></view>
      </view>
      <view :class="state.type == 'FREESHIP' ? 'selected' : 'select'" :style="'color: ' + (state.type === 'FREESHIP' ? state.themeColor : '') + ';'" @click="clickCategory">
        <text>运费优惠券</text> 
        <view class="borderbox" :style="'background-color: ' + (state.type === 'FREESHIP' ? state.themeColor : '') + ';'" v-if="state.type == 'FREESHIP'"></view>
      </view>
    </view>
    <view class="coupon-item-box" :style="'min-height:' + state.couponBoxHeight + 'px;'">
      <view :class="'coupon-available ' + (state.type === 'DISCOUNT' ? 'show' : 'hidden')">
        <view v-for="(item , index) in state.discountCoupon" :key="index">
          <!-- <coupon-item bind:onClickCouponItem="clickCouponItem" coupon="{{item}}"></coupon-item> -->
          <coupon-receive :showUseBtn="state.useBtnShow" hideSignBtn="true" :coupon="item" :hasUserInfo="hasUserInfo" @assign="toUse" @getUserInfo.stop="onGetUserInfo" @showCode="showCouponCode"></coupon-receive>
        </view>
        <view class="no-data" :hidden="state.discountCoupon.length == 0 && state.discountCoupon.length == 0 ? false : true">
          <image :src="state.imagesPath.imgNoCoupon"></image>
          <button :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'" size="mini" @click="toCouponCenter">前往领券中心</button>
        </view>
      </view>
      <view :class="'coupon-used ' + (state.type === 'FREESHIP' ? 'show' : 'hidden')">
        <view v-for="(item , index) in state.freeshipCoupon" :key="index">
          <!-- <coupon-item bind:onClickCouponItem="clickCouponItem" coupon="{{item}}"></coupon-item> -->
          <coupon-receive :showUseBtn="state.useBtnShow" hideSignBtn="true" :coupon="item" :hasUserInfo="hasUserInfo" @assign="toUse" @getUserInfo.stop="onGetUserInfo" @showCode="showCouponCode"></coupon-receive>
        </view>
        <view class="no-data" :hidden="state.freeshipCoupon.length == 0 ? false : true">
          <image :src="state.imagesPath.imgNoCoupon"></image>
          <button :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'" size="mini" @click="toCouponCenter">前往领券中心</button>
        </view>
      </view>
    </view>
    <view class="coupon-bottom-box">
      <!-- <view class="coupon-data" hidden="{{!noCouponData}}">没有更多数据</view> -->
      <view class="coupon-history" :style="'color: ' + state.themeColor" @click="toCouponHistory" :data-type="state.type">查看历史优惠券<image :src="state.imagesPath.iconRight1" mode="widthFix"></image></view>
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
<image class="movable-view" v-if="state.homeBack" :src="state.imagesPath.toHome" @click="toHome"></image>
<popup :show="state.show.couponCode" position="middle" custom-class="middle" @close="toggleCouponCodePopup" @touchmove.stop="catchtouchmove">
  <view class="popup-coupon-code-box" @click="toggleCouponCodePopup">
    <view class="popup-top-info">
      <!-- <text>线上商城</text> -->
      <text class="popup-coupon-code-tips">请向店员出示券码进行核销</text>
    </view>
    <view class="popup-coupon-code-content">
      <view class="coupon-code-box" v-if="showCode">
        <view class="barcode-box">
          <canvas id="barcode" type="2d">
          <image :src="state.barcodeImageUrl" mode=""></image>
        </canvas></view>
        <text>{{state.codeText}}</text>
        <view class="qrcode-box">
          <canvas id="qrcode" type="2d" :hidden="canvasHidden">
        </canvas></view>
      </view>
    </view>
  </view>
</popup>
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
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
// import { onPageScroll, onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import couponItem from '@/pages-sub/newretail/components/coupon/coupon-item4/coupon-item.vue';
import couponReceive from '@/pages-sub/newretail/components/coupon/coupon-receive/coupon-receive.vue';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/myCoupon/myCoupon.js
const couponService = _apiCouponServiceJs;
const sysService = _apiSystemServiceJs;
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
  useBtnShow: false,
  // 立即使用按钮展示
  navigationBarTitle: "我的优惠券",
  imagesPath: IMGAGESPATH,
  userInfo: {},
  type: 'DISCOUNT',
  page: 1,
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
  couponBoxHeight: 667,
  barcodeImageUrl: ""
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
function getUseKey() {
  sysService.query('couponEnableUseNow').then(res => {
    if (res && res.length > 0 && res[0].value != null) {
      // console.log(res[0].value,233333)
      if (res[0].value === 'TRUE') {
        state.useBtnShow = true;
      }
    }
  }).catch(err => {
    console.log(err);
  });
}
function getCouponList(page, pageSize, searchCount, memberId) {
  let tempList = [];
  // 优惠券
  let tempDiscountCoupon = [];
  // 运费券
  let tempFreeshipCoupon = [];
  let memberMobile = state.member.mobile;
  let postData = {
    page: page,
    pageSize: pageSize,
    searchCount: searchCount,
    memberIdEquals: memberId,
    memberMobileEquals: memberMobile,
    orderDirection: 'desc',
    orderField: 'assign_time',
    statusEquals: 'OPEN'
  };
  let listData = couponService.queryCoupon(postData).then(res => {
    uni.hideToast();
    state.pageCount = res.pageCount;
    const that = this;
    console.log(res);
    if (res.records && res.records.length > 0) {
      //读券
      let ids = res.records.map(function (item) {
        return item.id;
      });
      couponService.visited(ids).then(res => {});

      //显示券
      res.records.forEach(item => {
        let tempItem = {
          id: item.id,
          faceValue: item.faceValue,
          balance: item.balance,
          allProduct: item.allProduct,
          couponTypeName: item.couponTypeName,
          couponActivityName: item.couponActivityName,
          bytimeStart: item.bytimeStart,
          bytimeEnd: item.bytimeEnd,
          status: item.status,
          statusDesc: handleCouponStatus(item.status),
          rate: item.rate || item.rate === 0 ? (item.rate * 10).toFixed(1) : '',
          function: item.function,
          name: item.couponActivityName,
          couponActivityId: item.couponActivityId,
          isExternal: false,
          description: item.activityRemark,
          useAmountLimit: item.useAmountLimit,
          cardNum: item.cardNum
        };
        if (item.bytimeStart) {
          // let startTime = item.bytimeStart.split(' ')[0]
          // let endTime = item.bytimeEnd.split(' ')[0]
          let startTime = item.bytimeStart.slice(0, 16);
          let endTime = item.bytimeEnd.slice(0, 16);
          let effectiveTime = startTime + ' ~ ' + endTime;
          tempItem = {
            ...tempItem,
            effectiveTime: effectiveTime
          };
        } else {
          tempItem = {
            ...tempItem,
            effectiveTime: ''
          };
        }
        couponHandler.handleCouponFunction(tempItem);
        if (item.function === 'FREESHIP') {
          tempFreeshipCoupon.push(tempItem);
        } else {
          tempDiscountCoupon.push(tempItem);
        }
      });
      let tempCouponsList = [];
      tempCouponsList = [].concat(_data.couponsList);
      tempCouponsList = tempCouponsList.concat(res.records);
      _data.couponsList = tempCouponsList;
      state.couponsList = tempCouponsList;
    }
    tempList.push(tempDiscountCoupon, tempFreeshipCoupon);
    return tempList;
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
    tempList.push(tempDiscountCoupon, tempFreeshipCoupon);
    return tempList;
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
  console.log(e.detail.coupon);
  if (!e.detail.coupon || !e.detail.coupon.couponActivityId) {
    return;
  }
  let postFunc = couponService.queryByCouponActivityId;
  if (e.detail.coupon.couponServiceType === 'HDCRM') {
    postFunc = couponService.queryByHdCrmCode;
  }
  postFunc(1, 10, e.detail.coupon.couponServiceType === 'HDCRM' ? e.detail.coupon.templateNumber : e.detail.coupon.couponActivityId, state.storeId).then(res => {
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
      if (e.detail.coupon.couponServiceType === 'HDCRM') {
        opts = "?templateNumber=" + e.detail.coupon.templateNumber + "&couponName=" + e.detail.coupon.name;
      }
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
function queryExternalCoupons() {
  const that = this;
  let tempList = [];
  // 优惠券
  let tempDiscountCoupon = [];
  // 运费券
  let tempFreeshipCoupon = [];
  let tempPage = state.externalPage;
  let memberId = state.member.id;
  let pageSize = state.pageSize;
  let postData = {
    memberId: memberId,
    page: tempPage,
    pageSize: pageSize,
    state: 'OPEN'
  };
  let listData = [[], []];
  if (isUseExternalCoupon) {
    //   if (tempPage <= this.data.externalPageCount) {
    listData = couponService.queryExternalCoupons(postData).then(res => {
      uni.hideToast();
      console.log(res);
      if (res && res.records.length > 0) {
        state.externalPageCount = res.pageCount;
        let tempExternalList = [];
        res.records.forEach(item => {
          if (item.status === 'OPEN') {
            tempExternalList.push(item);
            let tempItem = {
              id: item.externalCardNum,
              faceValue: item.faceValue,
              balance: item.balance,
              couponTypeName: item.couponTypeName,
              couponActivityName: item.couponActivityName,
              bytimeStart: item.bytimeStart,
              bytimeEnd: item.bytimeEnd,
              status: item.status,
              statusDesc: handleCouponStatus(item.status),
              rate: item.rate || item.rate === 0 ? (item.rate * 10).toFixed(1) : '',
              function: item.function,
              name: item.couponActivityName,
              couponActivityId: item.couponActivityId,
              isExternal: true,
              description: item.useRule,
              externalCardNum: item.externalCardNum,
              templateNumber: item.templateNumber,
              couponServiceType: item.couponServiceType
            };
            if (item.bytimeStart) {
              let startTime = item.bytimeStart.split(' ')[0];
              let endTime = item.bytimeEnd.split(' ')[0];
              let effectiveTime = startTime + ' 至 ' + endTime;
              tempItem = {
                ...tempItem,
                effectiveTime: effectiveTime
              };
            } else {
              tempItem = {
                ...tempItem,
                effectiveTime: ''
              };
            }
            couponHandler.handleCouponFunction(tempItem);
            if (item.function === 'FREESHIP') {
              tempFreeshipCoupon.push(tempItem);
            } else {
              tempDiscountCoupon.push(tempItem);
            }
          }
        });
        console.log(state.couponsList);
        let tempCouponsList = [];
        tempCouponsList = [].concat(_data.couponsList);
        tempCouponsList = tempCouponsList.concat(tempExternalList);
        state.couponsList = tempCouponsList;
      }
      tempList.push(tempDiscountCoupon, tempFreeshipCoupon);
      return tempList;
    }).catch(e => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
      tempList.push(tempDiscountCoupon, tempFreeshipCoupon);
      return tempList;
    });
    //   }
  } else {
    console.log('未启用外部券的配置信息');
    uni.hideToast();
  }
  Promise.all([listData]).then(res => {
    console.log(res);
    if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
      console.log(res[0]);
      setCoupons(res[0]);
      tempPage++;
      state.externalPage = tempPage;
    } else {
      state.load = false;
      state.noCouponData = true;
    }
    uni.hideLoading();
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
      let listData = getCouponList(state.page, state.pageSize, state.searchCount, memberInfo.id);
      Promise.all([listData]).then(res => {
        console.log(res);
        if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
          _data.discountCoupon = res[0][0]; // 优惠券
          _data.freeshipCoupon = res[0][1]; // 运费券
          state.discountCoupon = res[0][0];
          state.freeshipCoupon = res[0][1];
          if (res[0][0] && res[0][0].length < state.limit) {
            queryExternalCoupons();
          }
        } else {
          queryExternalCoupons();
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
      const memberInfo = app.globalData.userInfo.member;
      state.member = memberInfo;
    }
  }
  getUseKey();
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
    let tempList = getCouponList(1, state.pageSize, state.searchCount, state.member.id);
    Promise.all([tempList]).then(res => {
      console.log(res[0]);
      if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
        _data.discountCoupon = res[0][0]; // 优惠券
        _data.freeshipCoupon = res[0][1]; // 运费券
        state.discountCoupon = res[0][0];
        state.freeshipCoupon = res[0][1];
        if (res[0][0] && res[0][0].length < state.limit) {
          queryExternalCoupons();
        }
      } else {
        queryExternalCoupons();
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
  loadingCoupon();
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
  let tempList = getCouponList(index, state.pageSize, state.searchCount, state.member.id);
  Promise.all([tempList]).then(res => {
    if (res[0] && (res[0][0].length > 0 || res[0][1].length > 0)) {
      console.log(res[0]);
      setCoupons(res[0]);
      state.page = index;
      if (res[0].length < state.limit) {
        // 查询到的内部券数量不够一屏，查询外部券
        console.log('内部券数量不够，查询外部券');
        queryExternalCoupons();
      }
    } else {
      // 内部券加载完开始查询外部券
      queryExternalCoupons();
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
      toggleCouponCodePopup();
      showCode(coupon.externalCardNum);
    } else if (!coupon.isExternal && coupon.cardNum) {
      // 内部券
      const cardNum = app.globalData.systemConfigure.externalCouponPrefix + coupon.cardNum;
      toggleCouponCodePopup();
      showCode(cardNum);
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
  let that = this;
  state.codeText = codeTextPartition(codeText);
  state.showCode = true;
  wxbarcode.barcode('barcode', codeText, 629, 166, this);
  wxbarcode.qrcode('qrcode', codeText, 290, 290, this);
  const pixelRatio = app.globalData.systemInfo ? app.globalData.systemInfo.pixelRatio : 2;
  setTimeout(() => {
    uni.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 640,
      height: 120,
      destWidth: 640 * pixelRatio,
      destHeight: 120 * pixelRatio,
      canvasId: 'qrcode',
      success(res) {
        console.log(res, 'res');
        state.barcodeImageUrl = res.tempFilePath;
      },
      fail(err) {
        console.log(err);
      }
    }, that);
  }, 1000);
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
  background-color: #f3f2f6;
  height: 100%;
  width: 100%;
}

.coupon-main {
  width: 100%;
  /* height: calc(100% - 130rpx); */
  background-color: #fff;
}

.coupon-nav {
  overflow: hidden;
  height: 80rpx;
  width: 100%;
  line-height: 80rpx;
  display: flex;
  border-top: 2rpx solid #e6e6e6;
  background: #fff;
  color: #333333;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  font-weight: bold;
}

.coupon-nav>view {
  font-size: 32rpx;
}

.selected {
  position: relative;
  flex: 1;
  color: #009f55;
  border-bottom: 5rpx solid transparent;
  text-align: center;
}
.borderbox{
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 70rpx;
  height: 5rpx;
  transform: translateX(-50%);
  background-color: #FB5606;
}
.select {
  flex: 1;
  text-align: center;
}

/*券列表  */

.show {
  display: block;
  background-color: #fff;
}

.hidden {
  display: none;
  background-color: #f3f2f6;
}

.coupon-item-box {
  padding: 21rpx 21rpx 122rpx 21rpx;
  /* margin-top: 110rpx; */
  background: #fff;
  /* border-top: 20rpx solid #f1f1f1; */
  min-height: 100%;
  background-color: #fff;
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
  background-color: #f3f2f6;
  z-index: 10;
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
  background: #eee;
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
  max-height: 900rpx;
  border-radius: 10rpx;
  padding-bottom: 100rpx;
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