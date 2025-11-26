<template>
<!--pages/coupon/couponHistory/couponHistory.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="coupon-item-box use-box" :hidden="state.couponList.length === 0" v-if="state.type === 'DISCOUNT'">
  <view v-for="(item , index) in state.couponList" :key="index">
    <coupon-item @onClickCouponItem="clickCouponItem" :coupon="item" couponStatus="history"></coupon-item>
  </view>
</view>
<view class="coupon-item-box use-box" :hidden="state.couponList === 0" v-if="state.type === 'FREESHIP'">
  <view v-for="(item , index) in state.couponList" :key="index">
    <coupon-item @onClickCouponItem="clickCouponItem" :coupon="item" couponStatus="history"></coupon-item>
  </view>
</view>
<view class="no-data" :hidden="state.couponList.length == 0 ? false : true">
  <image :src="state.imagesPath.imgNoCoupon"></image>
  <button :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'" size="mini" @click="toCouponCenter">前往领券中心</button>
</view>
<view class="coupon-bottom-box" :hidden="!state.noCouponData || state.couponList.length == 0">
  <view class="coupon-data">没有更多数据</view>
</view>
<view class="loading" :hidden="!state.load">正在加载...</view>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsCouponHandler from "@/utils/newretail/couponHandler";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import couponItem from '@/pages-sub/newretail/components/coupon/coupon-item4/coupon-item.vue';
const app = getApp();

// pages/coupon/couponHistory/couponHistory.js
const couponService = _apiCouponServiceJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const couponHandler = _utilsCouponHandler;
const themeManager = _utilsThemeManagerJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "历史优惠券",
  imagesPath: IMGAGESPATH,
  type: 'DISCOUNT',
  couponList: [],
  allCouponsList: [],
  page: 1,
  externalPage: 1,
  pageSize: 10,
  member: {},
  noCouponData: false,
  load: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  externalPageCount: 1
});
function toHome() {
  NAVPAGE.toHome();
}
function toCouponCenter() {
  NAVPAGE.toCouponCenter();
}
function clickCouponItem(e) {
  toCouponDetails(e.detail);
}
function toCouponDetails(val) {
  console.log(val.activityid, val.type);
  const isExternal = val.external;
  const couponActivityId = val.activityid;
  const type = val.type;
  const couponsList = state.allCouponsList;
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
function queryHistoryCoupons(page, pageSize, memberMobile, functionEquals) {
  const that = this;
  let postData = {
    page: page,
    pageSize: pageSize,
    memberMobileEquals: memberMobile,
    statusEquals: 'HISTORY',
    searchCount: true,
    orderDirection: 'desc',
    orderField: 'assign_time'
  };
  if (functionEquals === 'FREESHIP') {
    postData = {
      ...postData,
      functionEquals: functionEquals
    };
  } else {
    postData = {
      ...postData,
      functionEquals: ['CASH', 'DISCOUNT']
    };
  }
  console.log(postData.functionEquals);
  let couponList = [];
  let tempList = couponService.query(postData).then(res => {
    if (res.records && res.records.length > 0) {
      state.couponsList = [];
      res.records.forEach(item => {
        let tempItem = {
          id: item.id,
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
          isExternal: false
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
        if (functionEquals === 'DISCOUNT') {
          if (item.function !== 'FREESHIP') {
            couponList.push(tempItem);
          }
        } else {
          couponList.push(tempItem);
        }
      });
      let tempCouponsList = [];
      tempCouponsList = [].concat(state.allCouponsList);
      tempCouponsList = tempCouponsList.concat(res.records);
      state.allCouponsList = tempCouponsList;
    }
    return couponList;
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
    return [];
  });
  return tempList;
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
function setCoupons(coupons) {
  const that = this;
  let tempCoupons = state.couponList;
  tempCoupons = tempCoupons.concat(coupons);
  state.couponList = tempCoupons;
  state.load = false;
}
function queryExternalCoupons() {
  const that = this;
  let tempList = [];
  let couponList = [];
  let tempPage = state.externalPage;
  let memberId = state.member.id;
  let pageSize = state.pageSize;
  let postData = {
    memberId: memberId,
    page: tempPage,
    pageSize: pageSize,
    state: 'HISTORY'
  };
  let listData = [];
  if (isUseExternalCoupon) {
    if (tempPage <= state.externalPageCount) {
      listData = couponService.queryExternalCoupons(postData).then(res => {
        uni.hideToast();
        console.log(res);
        if (res && res.records.length > 0) {
          let tempExternalList = [];
          res.records.forEach(item => {
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
              isExternal: true
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
            if (state.type === 'DISCOUNT') {
              if (item.function !== 'FREESHIP') {
                couponList.push(tempItem);
              }
            } else {
              // couponList.push(tempItem)
            }
          });
          let tempCouponsList = [];
          tempCouponsList = [].concat(state.allCouponsList);
          tempCouponsList = tempCouponsList.concat(tempExternalList);
          state.allCouponsList = tempCouponsList;
        }
        return couponList;
      }).catch(e => {
        uni.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000
        });
        return [];
      });
    }
  } else {
    console.log('未启用外部券的配置信息');
    uni.hideToast();
  }
  Promise.all([listData]).then(res => {
    console.log(res);
    if (res[0] && res[0].length > 0) {
      console.log(res[0]);
      setCoupons(res[0]);
      tempPage++;
      state.externalPage = tempPage;
    } else {
      state.load = false;
      state.noCouponData = true;
    }
  });
}
onLoad(function (options) {
  uni.hideShareMenu();
  const that = this;
  console.log(options);
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  if (options.type) {
    state.type = options.type;
  }
  // 是否启用外部券的配置信息：TRUE是、FALSE否，默认TRUE
  let _isUseExternalCoupon = false;
  // 查询系统配置项，根据系统配置项控制列表菜单显示
  let systemOptions = app.globalData.configureInfo;
  systemOptions.forEach(item => {
    // 是否启用外部券的配置信息：TRUE是、FALSE否，默认TRUE
    if (item.key === 'isUseExternalCoupon' && item.value != null) {
      item.value == 'TRUE' ? _isUseExternalCoupon = true : _isUseExternalCoupon = false;
    }
  });
  isUseExternalCoupon = _isUseExternalCoupon;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      let memberMobile = app.globalData.userInfo.member.mobile;
      state.member = app.globalData.userInfo.member;
      let functionEquals = state.type;
      let coupons = queryHistoryCoupons(1, 10, memberMobile, functionEquals);
      Promise.all([coupons]).then(res => {
        console.log(res[0]);
        if (res[0] && res[0].length > 0) {
          state.couponList = res[0];
          if (res[0].length < state.limit) {
            // 查询到的内部券数量不够一屏，查询外部券
            console.log('内部券数量不够，查询外部券');
            queryExternalCoupons();
          }
        } else {
          state.couponList = [];
          queryExternalCoupons();
        }
      });
    }
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {
  console.log("onPullDownRefresh");
  const that = this;
  state.page = 1;
  state.externalPage = 1;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      let memberMobile = app.globalData.userInfo.member.mobile;
      let functionEquals = state.type;
      let coupons = queryHistoryCoupons(1, 10, memberMobile, functionEquals);
      Promise.all([coupons]).then(res => {
        console.log(res[0]);
        if (res[0] && res[0].length > 0) {
          state.couponList = res[0];
          if (res[0].length < state.limit) {
            // 查询到的内部券数量不够一屏，查询外部券
            console.log('内部券数量不够，查询外部券');
            queryExternalCoupons();
          }
        } else {
          state.couponList = [];
          queryExternalCoupons();
        }
        uni.stopPullDownRefresh();
      });
    }
  }
});
onReachBottom(function () {
  console.log("onReachBottom");
  loadingCoupon();
});
function loadingCoupon() {
  const that = this;
  state.load = true;
  let index = state.page;
  index++;
  let functionEquals = state.type;
  let tempList = queryHistoryCoupons(index, state.pageSize, state.member.mobile, functionEquals);
  Promise.all([tempList]).then(res => {
    if (res[0] && res[0].length > 0) {
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
      console.log('123');
      queryExternalCoupons();
    }
    uni.stopPullDownRefresh();
  });
}
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/coupon/couponHistory/couponHistory.wxss */
page {
  height: 100%;
  width: 100%;
}

.coupon-item-box {
  padding: 21rpx 21rpx 0;
  background: #fff;
}

.coupon-item {
  height: 300rpx;
  width: 629rpx;
  padding: 19rpx 19rpx 19rpx 60rpx;
  position: relative;
}

.coupon-item .coupon-bg {
  width: 708rpx;
  height: 338rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.coupon-item:last-of-type {
  margin-bottom: 0;
}

.coupon-top {
  margin: 22rpx 0 0 0;
  position: relative;
}

.coupon-top image {
  width: 89rpx;
  height: 58rpx;
}

.coupon-top>text {
  display: block;
  position: relative;
}

.coupon-top .name {
  font-size: 32rpx;
  line-height: 42rpx;
  color: #454545;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 14rpx;
}

.coupon-top .name text {
  color: #ff8561;
  font-size: 40rpx;
  margin-right: 10rpx;
  font-style: italic;
}

.coupon-top .time {
  font-size: 20rpx;
  line-height: 26rpx;
  color: #8b8b8c;
  line-height: 36rpx;
  margin-top: 19rpx;
}

.coupon-bottom {
  position: absolute;
  height: 70rpx;
  line-height: 70rpx;
  bottom: 24rpx;
  left: 60rpx;
  width: 629rpx;
}

.coupon-bottom .condition {
  font-size: 20rpx;
  line-height: 70rpx;
  display: inline-block;
  color: #8b8b8c;
  width: 408rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coupon-bottom .use {
  margin-right: 42rpx;
  padding-right: 27rpx;
  font-size: 24rpx;
  float: right;
  color: #009f55;
  position: relative;
}

.coupon-bottom .use .coupon-right-point {
  width: 12rpx;
  height: 21rpx;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -11.5rpx;
}

.coupon-title {
  font-size: 24rpx;
  color: #1b1b1d;
  padding-top: 22rpx;
  line-height: 62rpx;
  height: 62rpx;
  border-bottom: 1rpx solid #dcdcdc;
  margin-bottom: 11rpx;
  margin-right: 19rpx;
  margin-left: 19rpx;
}

.use-box .coupon-item-top .name,
.use-box .coupon-item-top .name>text {
  color: #8b8b8c;
}

.use-box .coupon-item-bottom .use {
  background: transparent;
  padding-right: 0;
  color: #8b8b8c;
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
  height: 122rpx;
  margin-top: 24rpx;
  font-size: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.coupon-bottom-box view {
  color: #8b8b8c;
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
</style>