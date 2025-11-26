<template>
<!--pages/mallModule/coupon/choiceCouponMore/choiceCouponMore.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="choice-coupon-main" v-if="!state.loading">
  <view class="coupon-box" :hidden="state.allFreeship.length === 0" v-if="state.couponType === 'freeship'">
    <view class="coupon-title">
        <view>
            <text>运费券</text>
            <text class="tips">(可与其他优惠券叠加使用)</text>
        </view>
    </view>
    <view v-for="(item , i) in state.freeshipCoupon" :key="id">
      <coupon-item @onClickCouponItem="clickCouponItem" :coupon="item.coupon" :selected="item.isChecked" couponStatus="enable"></coupon-item>
      <view class="bianju"></view>
    </view>
    <view class="coupon-title" v-if="state.unableFreeshipCoupon.length > 0">不可用运费券</view>
    <view v-for="(item , i) in state.unableFreeshipCoupon" :key="id">
      <coupon-item @onClickCouponItem="clickCouponItem" :coupon="item.coupon" couponStatus="unable"></coupon-item>
    </view>
  </view>
  <view class="coupon-box" :hidden="state.allDiscount.length === 0" v-if="state.couponType === 'discount'">
    <view class="coupon-title">
        <view>
            <text>优惠券</text>
            <text class="tips">(可与其他优惠券叠加使用)</text>
        </view>
        <!-- <view class="use-more" bind:tap="useDiscounts">使用推荐优惠</view> -->
    </view>
    <view v-for="(item , i) in state.couponList" :key="id">
      <!-- <coupon-item bind:onClickCouponItem="clickCouponItem" coupon="{{item.coupon}}" selected="{{currentItem}}" couponStatus="enable"></coupon-item> -->
      <coupon-item @onClickCouponItem="clickCouponItem" :coupon="item.coupon" :selected="item.isChecked" couponStatus="enable"></coupon-item>
      <view class="bianju"></view>
    </view>
    <view class="coupon-title" v-if="state.unableCouponList.length > 0">不可用优惠券</view>
    <view v-for="(item , i) in state.unableCouponList" :key="id">
      <coupon-item @onClickCouponItem="clickCouponItem" :coupon="item.coupon" couponStatus="unable"></coupon-item>
    </view>
  </view>
  <view class="no-data" :hidden="state.allFreeship.length > 0 ? true : false" v-if="state.couponType === 'freeship'">
    <image :src="state.imagesPath.imgNoCoupon"></image>
  </view>
  <view class="no-data" :hidden="state.allDiscount.length > 0 ? true : false" v-if="state.couponType === 'discount'">
    <image :src="state.imagesPath.imgNoCoupon"></image>
  </view>
  <view class="bottom-box">
    <button class="btn" :style="'background: ' + state.themeColor" @click="toPerfectOrder">确认</button>
  </view>
</view>
<view class="content" v-if="state.loading">
  <view class="spinner">
    <view class="rect1" :style="'background-color: ' + state.themeColor + ';'"></view>
    <view class="rect2" :style="'background-color: ' + state.themeColor + ';'"></view>
    <view class="rect3" :style="'background-color: ' + state.themeColor + ';'"></view>
    <view class="rect4" :style="'background-color: ' + state.themeColor + ';'"></view>
    <view class="rect5" :style="'background-color: ' + state.themeColor + ';'"></view>
  </view>
</view>
</template>
<script setup>
import _utilsCouponHandler from "@/utils/newretail/couponHandler";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import couponItem from '@/pages-sub/newretail/components/coupon/coupon-item4/coupon-item.vue';
const app = getApp();

// pages/choiceCouponMore/choiceCouponMore.js
const couponService = _apiCouponServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;

//获取应用实例
const couponHandler = _utilsCouponHandler;
const state = reactive({
  clickFlag: true,
  selectedCoupons: [],
  navigationBarTitle: "选择优惠券",
  imagesPath: IMGAGESPATH,
  couponList: [],
  unableCouponList: [],
  allCouponList: [],
  freeshipCoupon: [],
  unableFreeshipCoupon: [],
  allDiscount: [],
  allFreeship: [],
  loading: true,
  couponType: 'discount',
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor')
});
function clickCouponItem(val) {
  console.log(val.detail);
  uni.showLoading();
  let _data = {
    currentTarget: {
      dataset: {}
    }
  };
  _data.currentTarget.dataset = val.detail;
  // 如果操作的是不可选中的券，不进行券试算
  let unUseFlag = state.unableCouponList.some(item => item.coupon.cardNum === val.detail.id);
  if (unUseFlag || !state.clickFlag) {
    uni.hideLoading();
    return;
  }
  state.clickFlag = false;
  couponClick(_data, true);
}
function couponClick(val, isCheckedChangeFlag) {
  uni.showLoading();
  let that = this;
  let cardNum = val.currentTarget.dataset.id;
  console.log(cardNum);
  if (isCheckedChangeFlag) {
    state.couponList.forEach(item => {
      if (item.coupon.cardNum === cardNum) {
        item.isChecked = !item.isChecked;
      }
    });
  }
  let cardNumArr = [];
  let ids = [];
  // 处理选中券cardNum数据
  state.couponList.filter(item => {
    if (item.isChecked) {
      cardNumArr.push(item.coupon.cardNum);
      ids.push(item.coupon.id);
    }
  });
  let postData = {
    order: options.orderData
  };
  // 如果存在选中的券 则进行试算传递 externalCouponNumbers
  if (cardNumArr.length > 0) {
    postData.externalCouponNumbers = cardNumArr;
  }
  let isQrPay = null;
  const orderType = options.orderType;
  if (orderType == 'qrpay') {
    isQrPay = 'qrpay';
  }
  couponService.getAvailableCoupon(isQrPay, postData).then(res => {
    console.log(res);
    uni.hideLoading();
    // 获取试算返回可用的券
    state.clickFlag = true;
    let abledIds = [];
    res.forEach(it => {
      if (it.usable) abledIds.push(it.coupon.id);
    });

    // 从所有券数据中处理可用和不可用的数据
    let couponList = [];
    let unableCouponList = [];
    let tempFreeshipCoupon = [];
    let tempUnableFreeshipCoupon = [];
    state.allCouponList.forEach(item => {
      let flag = true;
      abledIds.forEach(abledId => {
        // 如果当前的数据和试算返回的一致，则（可用当前券）
        if (item.coupon.id === abledId) {
          flag = false;
          item.usable = true;
        }
      });
      item.isChecked = false;
      cardNumArr.forEach(checledItem => {
        // 之前操作选中的那张继续选中并展示可用
        if (checledItem === item.coupon.cardNum) {
          flag = false;
          item.usable = true;
        }
      });
      if (item.coupon.function === "FREESHIP") {
        if (flag || !item.usable) {
          tempUnableFreeshipCoupon.push(item);
        } else if (item.usable) {
          cardNumArr.forEach(checledItem => {
            // 之前操作选中的那张才选中
            if (checledItem === item.coupon.cardNum) {
              item.isChecked = true;
            }
          });
          tempFreeshipCoupon.push(item);
        }
      } else {
        if (flag || !item.usable) {
          unableCouponList.push(item);
        } else {
          cardNumArr.forEach(checledItem => {
            // 之前操作选中的那张才选中
            if (checledItem === item.coupon.cardNum) {
              item.isChecked = true;
            }
          });
          couponList.push(item);
        }
      }
    });
    state.couponList = couponList;
    state.unableCouponList = unableCouponList;
    state.freeshipCoupon = tempFreeshipCoupon;
    state.unableFreeshipCoupon = tempUnableFreeshipCoupon;
  }).catch(err => {
    state.clickFlag = true;
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function toPerfectOrder() {
  const that = this;
  // let couponId = this.data.currentItem
  // let freeshipId = this.data.current
  let chooseCouponData = [];
  // let typeData = JSON.stringify(this.options.type);
  console.log(state.couponList);
  state.couponList.forEach(ele => {
    if (ele.isChecked) {
      chooseCouponData.push(ele);
    }
  });
  state.freeshipCoupon.forEach(ele => {
    if (ele.isChecked) {
      chooseCouponData.push(ele);
    }
  });
  console.log(chooseCouponData);
  if (chooseCouponData) {
    try {
      let tempData = {
        coupons: chooseCouponData,
        couponType: state.couponType
      };
      uni.setStorageSync('wj_chooseCoupon', tempData);
    } catch (e) {}
    uni.navigateBack({
      delta: 1
    });
  } else {
    uni.navigateBack({
      delta: 1
    });
  }
}
function getAvailableCoupon(data) {
  const that = this;
  let postData = {};
  let isQrPay = null;
  const orderType = options.orderType;
  if (orderType == 'qrpay') {
    postData = data;
    isQrPay = 'qrpay';
  } else if (orderType === 'normal') {
    postData = {
      order: data
    };
  } else if (orderType === 'secondkill') {
    postData = {
      grabOrder: data
    };
  } else if (orderType === 'advanceSell') {
    postData = {
      order: data
    };
  } else if (orderType === 'group') {
    postData = {
      teamOrder: data
    };
  } else {
    postData = {
      order: data
    };
  }
  // 如果存在选中的券 则进行试算传递 externalCouponNumbers
  // if(this.data.selectedCoupons && this.data.selectedCoupons.length > 0) {
  //     postData.externalCouponNumbers = this.data.selectedCoupons
  // }
  // console.log(postData)
  couponService.getAvailableCoupon(isQrPay, postData).then(res => {
    console.log(res);
    uni.hideLoading();
    let tempAllCouponList = [];
    let tempCouponList = [];
    let tempUnableCouponList = [];
    let tempFreeshipCoupon = [];
    let tempUnableFreeshipCoupon = [];
    let tempAllFreeship = [];
    let tempAllDiscount = [];
    res.forEach(ele => {
      //   设置未选中
      ele.isChecked = false;
      // if(postData.externalCouponNumbers) {
      //   postData.externalCouponNumbers.forEach(checledItem => {
      //     // 之前操作选中的那张继续选中并展示可用
      //     if(checledItem === ele.coupon.cardNum) {
      //         ele.usable = true
      //         ele.isChecked = true
      //     }
      //   })
      // }
      ele.coupon = {
        ...ele.coupon,
        name: ele.coupon.couponTypeName ? ele.coupon.couponTypeName : ele.coupon.couponActivityName
      };
      if (ele.coupon.bytimeStart) {
        let startTime = ele.coupon.bytimeStart.split(" ")[0] + ' ' + ele.coupon.bytimeStart.split(" ")[1].slice(0, 5);
        let endTime = ele.coupon.bytimeEnd.split(" ")[0] + ' ' + ele.coupon.bytimeEnd.split(" ")[1].slice(0, 5);
        // let effectiveTime = startTime + ' 至 ' + endTime
        // let startTime = ele.bytimeStart.slice(0, 16)
        // let endTime = ele.bytimeEnd.slice(0, 16)
        let effectiveTime = startTime + ' ~ ' + endTime;
        ele.coupon = {
          ...ele.coupon,
          effectiveTime: effectiveTime
        };
      } else {
        ele.coupon = {
          ...ele.coupon,
          effectiveTime: ''
        };
      }
      couponHandler.handleCouponFunction(ele.coupon);
      if (ele.coupon.function === "FREESHIP") {
        if (ele.usable) {
          tempFreeshipCoupon.push(ele);
        } else {
          tempUnableFreeshipCoupon.push(ele);
        }
        tempAllFreeship.push(ele);
      } else {
        if (ele.usable) {
          tempCouponList.push(ele);
        } else {
          tempUnableCouponList.push(ele);
        }
        tempAllDiscount.push(ele);
      }
      tempAllCouponList.push(ele);
    });
    // let tempAllCoupons = [].concat(tempCouponList, tempFreeshipCoupon)
    state.allCouponList = tempAllCouponList;
    state.couponList = tempCouponList;
    state.unableCouponList = tempUnableCouponList;
    state.freeshipCoupon = tempFreeshipCoupon;
    state.unableFreeshipCoupon = tempUnableFreeshipCoupon;
    state.allDiscount = tempAllDiscount;
    state.allFreeship = tempAllFreeship;
    state.loading = false;
    if (data.couponIds && data.couponIds.length > 0) {
      data.couponIds.forEach(it => {
        // 优惠券
        tempCouponList.forEach(ele => {
          ele.isChecked = false;
          if (ele.coupon.id === it) {
            ele.isChecked = true;
          }
        });
      });
    }
    if (state.couponList && state.couponList.length > 0) {
      state.couponList.forEach(ele => {
        if (state.selectedCoupons && state.selectedCoupons.length > 0 && state.selectedCoupons.indexOf(ele.coupon.cardNum) > -1) {
          ele.isChecked = true;
        }
      });
    }
    state.couponList = state.couponList;
    if (state.selectedCoupons && state.selectedCoupons.length > 0) {
      // 之前存在选中券数据，再次调用试算接口获取对应数据
      couponClick({
        currentTarget: {
          dataset: {
            id: state.selectedCoupons[0]
          }
        }
      });
    }
    //   let currentDiscountCoupon = "";
    //   let currentFreeshipCoupon = "";
    //   let tempAllCoupons = [].concat(tempCouponList, tempFreeshipCoupon)
    //   if (data.couponIds && data.couponIds.length > 0) {
    //     data.couponIds.forEach(it => {
    //       tempAllCoupons.forEach(ele => {
    //         if (ele.coupon.id === it) {
    //           if (ele.coupon.function !== "FREESHIP") {
    //             // 优惠券
    //             currentDiscountCoupon = it
    //           } else {
    //             // 运费券
    //             currentFreeshipCoupon = it
    //           }
    //         }
    //       })
    //     })
    //   }
    //   // 已选择的券可能是外部券
    //   if (data.externalCouponNumber) {
    //     tempAllCoupons.forEach(ele => {
    //       if (ele.coupon.id === data.externalCouponNumber) {
    //         if (ele.coupon.function !== "FREESHIP") {
    //           // 优惠券
    //           currentDiscountCoupon = data.externalCouponNumber
    //         } else {
    //           // 运费券
    //           currentFreeshipCoupon = data.externalCouponNumber
    //         }
    //       }
    //     })
    //   }
    //   currentDiscountCoupon = currentDiscountCoupon != null ? currentDiscountCoupon : "";
    //   currentFreeshipCoupon = currentFreeshipCoupon != null ? currentFreeshipCoupon : "";
    //   this.setData({
    //     currentItem: currentDiscountCoupon,
    //     current: currentFreeshipCoupon
    //   })
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function useDiscounts() {
  let postData = options.orderData;
  postData = {
    order: postData
  };
  couponService.bestDiscounts(postData).then(res => {
    // console.log(res)
    uni.hideLoading();
    // 标记已经选择的优惠券 --- 改为当前对象增加选中属性
    if (res && res.length > 0) {
      // 可用id
      let abledIds = [];
      res.forEach(it => {
        abledIds.push(it.coupon.id);
      });

      // 从所有券数据中处理可用和不可用的数据
      let couponList = [];
      let unableCouponList = [];
      state.allCouponList.forEach(item => {
        let flag = true;
        abledIds.forEach(abledId => {
          // 如果当前的数据和试算返回的抑制，则选中当前券
          if (item.coupon.id === abledId) {
            flag = false;
          }
        });
        if (flag) {
          unableCouponList.push(item);
        } else {
          item.isChecked = true;
          couponList.push(item);
        }
      });
      state.couponList = couponList;
      state.unableCouponList = unableCouponList;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
onLoad(function (_options) {
  uni.hideShareMenu();
  console.log(options);
  let postData = app.globalData && app.globalData.couponOrderData ? app.globalData.couponOrderData : JSON.parse(options.orderData);
  options.orderData = postData;
  // let postData = JSON.parse(this.options.orderData)
  let couponType = options.couponType;
  state.source = options.source;
  state.selectedCoupons = uni.getStorageSync('selectedCoupons') || [];
  state.couponType = couponType;
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  getAvailableCoupon(postData);
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {
  if (app && app.globalData && app.globalData.couponOrderData) {
    app.globalData.couponOrderData = null;
  }
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/mallModule/coupon/choiceCouponMore/choiceCouponMore.wxss */
page {
    background: #fff;
    height: 100%;
  }
  
  .choice-coupon-main {
    width: 100%;
    padding-bottom: 141rpx;
  }
  .bianju {
    width: 100%;
    height: 10rpx;
  }
  .coupon-box {
    /* border-top: 1rpx solid #e3e3e3; */
    padding: 24rpx 20rpx 58rpx 20rpx;
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
    margin: 46rpx 0 0 0;
    position: relative;
  }
  
  .coupon-top image {
    width: 89rpx;
    height: 58rpx;
  }
  
  .coupon-top>text {
    display: block;
    position: relative;
    z-index: 1;
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
    /* border-bottom: 1rpx solid #dcdcdc; */
    margin-bottom: 11rpx;
    margin-right: 19rpx;
    margin-left: 19rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .coupon-title .tips {
    font-size: 20rpx;
    color: #666;
  }
  .coupon-title .use-more {
    padding: 0rpx 15rpx;
    /* background: #f00; */
    color: #fc6700;
    border-radius: 20rpx;
    font-weight: 700;
    line-height: 50rpx;
  }
  
  .unable .coupon-top .name,
  .unable .coupon-top .name>text {
    color: #8b8b8c;
  }
  
  .unable .coupon-bottom .use {
    background: transparent;
    padding-right: 0;
    color: #8b8b8c;
  }
  
  .bottom-box {
    position: fixed;
    bottom: 30rpx;
    width: 100%;
    padding: 0 40rpx;
    box-sizing: border-box;
    height: 140rpx;
    border-top: 1rpx solid #dcdcdc;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    z-index: 999;
    /* padding-bottom: 60rpx; */
  }
  
  .bottom-box button.btn {
    height: 100rpx;
    width: 100%;
    background: #009f55;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    line-height: 100rpx;
    border-radius: 60rpx;
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
    margin-top: 40%;
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
    background-color: #009F55;
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
      -webkit-transform: scaleY(0.4)
    }
  
    20% {
      -webkit-transform: scaleY(1.0)
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
</style>