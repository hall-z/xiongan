<template>
<!-- pages/refund/refundDetails/refundDetails.wxml -->
<view>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="refund-progress">
  <view class="title-box">
    <view>退款进度</view>
    <view class="service" @click="toService">
      <image :src="state.imagesPath.iconToCustomerService" mode="widthFix"></image>联系客服
    </view>
  </view>
  <view class="progress-box">
    <view class="progress-item" v-if="refundInfo.status !== 'CREATED'">
      <view class="left">
        <view class="spot-box" :style="true ? 'opacity: 0.3;' + state.theme.mainBgColor : ''"></view>
        <view class="spot" :style="true ? 'opacity: 0.8;' + state.theme.mainBgColor : ''"></view>
        <view class="line"></view>
      </view>
      <view class="info" v-if="refundInfo.status === 'FINISHED'">
        <view class="title" :style="true ? state.theme.mainColor : ''">退款成功</view>
        <view class="desc">您的退款申请已审批通过，待退款到账</view>
        <view class="time">{{refundInfo.updateTime}}</view>
      </view>
      <view class="info" v-else-if="refundInfo.status === 'REJECTED'">
        <view class="title" :style="true ? state.theme.mainColor : ''">退款失败</view>
        <view class="desc">您的退款申请不符合退款条件，已被驳回</view>
        <view class="time">{{refundInfo.updateTime}}</view>
      </view>
      <view class="info" v-else>
        <view class="title" :style="true ? state.theme.mainColor : ''">退款取消</view>
        <view class="desc">您的退款申请已取消</view>
        <view class="time">{{refundInfo.updateTime}}</view>
      </view>
    </view>
    <view class="progress-item">
      <view class="left">
        <view class="spot" :style="refundInfo.status === 'CREATED' ? 'opacity: 0.8;' + state.theme.mainBgColor : ''"></view>
      </view>
      <view class="info">
        <view class="title" :style="refundInfo.status === 'CREATED' ? state.theme.mainColor : ''">提交申请</view>
        <view class="desc">您的退款已申请成功，待客服审核中</view>
        <view class="time">{{refundInfo.createTime}}</view>
      </view>
    </view>
  </view>
</view>
<view class="refund-box">
  <view class="title-box">
    <view>退款详情</view>
  </view>
  <view class="goods-box">
    <view class="goods-item-box" v-for="(item , index) in refundInfo.refundDetails" :key="index">
      <view class="goods-item">
        <view class="goods-img">
          <image :src="item.url" mode="widthFix"></image>
        </view>
        <view class="goods-info">
          <view class="goods-name">{{item.productName}}</view>
          <view class="goods-desc">{{item.specs}}</view>
          <view class="number-price">
            <view class="goods-count">x{{item.productAmount}}</view>
            <view class="goods-price">
              <text class="nowPrice">￥{{item.quantity}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view class="row">
    <view>实际退款金额</view>
    <view>￥{{refundInfo.total}}<image v-if="refundInfo.status === 'FINISHED'" @click="lookRefundDetails" class="icon-order-tips" :src="state.imagesPath.iconOrderTips"></image></view>
  </view>
  <view class="row">
    <view>退款单号</view>
    <view>{{refundInfo.id}}</view>
  </view>
  <view class="refund-reason">
    <view>退款原因</view>
    <view>
      <text>{{refundInfo.applyReason}}</text>
      <view class="refund-img-box">
        <image v-for="(item , index) in refundInfo.descriptionImageUrlsArray" :key="idx" :src="item"></image>
      </view>
    </view>
  </view>
</view>
<popup :show="state.show.middle" position="middle" custom-class="middle" @close="toggleMiddlePopup">
  <view class="popup-content">
    <view class="title">退款明细</view>
    <view class="popup-content-box">
      <view class="price-detail">
        <view v-for="(item , index) in refundPayments" :key="i">
          <text class="color-454545">{{item.payMethod}}</text>
          <text class="color-ff7171">￥{{filters.toFix(item.refundTotal)}}</text>
        </view>
      </view>
    </view>
    <view class="button" :style="state.theme.mainBgColor" @click="toggleMiddlePopup">确 定</view>
  </view>
</popup></view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/refund/refundDetails/refundDetails.js
const orderService = _apiOrderServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const utils = _utilsUtilsJs;

//获取应用实例
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
const state = reactive({
  navigationBarTitle: "退款详情",
  imagesPath: IMGAGESPATH,
  refundList: [],
  page: 1,
  pageSize: 10,
  theme: themeManager,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  show: {
    middle: false
  }
});
onLoad(function (options) {
  uni.hideShareMenu();
  if (options.refundInfo) {
    const refundInfo = JSON.parse(decodeURIComponent(options.refundInfo));
    handleRefundDetails(refundInfo);
  }
  // 统计PV
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
  state.themeColor = app.globalData.uiconfig.themeColor;
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
onShareAppMessage(function () {});
function handleRefundDetails(refundInfo) {
  const self = this;
  if (refundInfo != null) {
    orderService.getRefundDetailsById(refundInfo.id).then(res => {
      let tempData = {
        ...res
      };
      if (res.descriptionImageUrls != null && res.descriptionImageUrls != '') {
        let array = item.descriptionImageUrls.split(",");
        tempData = {
          ...tempData,
          descriptionImageUrlsArray: array
        };
      }
      state.refundInfo = res;
    }).catch(err => {
      utils.showToast(err.message);
    });
  }
}
function toService() {
  let storeInfo = app.globalData.storeInfo ? app.globalData.storeInfo : null;
  let tel = '';
  if (storeInfo && storeInfo.tel != null && storeInfo.tel != '') {
    // 判断订单中门店是否有电话
    tel = storeInfo.tel;
  } else {
    // 门店无电话使用公司服务电话
    tel = app.globalData.servicePhone;
  }
  if (tel !== '') {
    uni.showModal({
      title: '提示',
      content: '确定要拨打以下电话' + tel,
      confirmText: '拨打',
      success: function (res) {
        if (res.confirm) {
          uni.makePhoneCall({
            phoneNumber: tel
          });
        }
        if (res.cancel) {}
      }
    });
  }
}
function lookRefundDetails() {
  const orderId = state.refundInfo.orderId;
  orderService.getRefundPayment(orderId).then(res => {
    let tempList = [];
    if (res && res.length > 0) {
      res.forEach(item => {
        if (item.refundId === state.refundInfo.id) {
          let tempItem = {
            ...item,
            createTime: item.createTime.replace(/\-/g, '.'),
            payMethod: handlePayment(item.payMethod)
          };
          tempList.push(tempItem);
        }
      });
    }
    state.refundPayments = tempList;
    toggleMiddlePopup();
  }).catch(err => {
    utils.showToast(err.message);
  });
}
function handlePayment(val) {
  let res = "";
  if (val === "ALIPAY") {
    res = "支付宝";
  } else if (val === "WXPAY") {
    res = "微信";
  } else if (val === "COUPONPAY") {
    res = "券优惠";
  } else if (val === "SCOREPAY") {
    res = "积分优惠";
  } else if (val === "CARDPAY") {
    res = "储值";
  } else if (val === "GIFTCARDPAY") {
    res = "礼品卡";
  } else if (val === "SCOREPAY") {
    res = "积分优惠";
  }
  return res;
}
function toggleMiddlePopup() {
  toggle('middle');
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
</script>
<style scoped>
/* pages/refund/refundDetails/refundDetails.wxss */

page {
  background: #F5F5F5;
}

.refund-progress {
  width: 712rpx;
  padding: 0 25rpx;
  box-sizing: border-box;
  min-height: 287rpx;
  background: #ffffff;
  border-radius: 14rpx;
  margin: 20rpx auto;
}

.title-box {
  height: 83rpx;
  font-size: 28rpx;
  color: #010101;
  border-bottom: 1px solid #F0F0F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service {
  font-size: 26rpx;
  display: flex;
  align-items: center;
}

.service image {
  width: 36rpx;
  height: 34rpx;
  margin-right: 12rpx;
}

.progress-box {
  padding: 16rpx 0 28rpx 0;
}

.progress-item {
  padding: 20rpx 0;
  display: flex;
}

.progress-item .left {
  width: 80rpx;
  position: relative;
}

.progress-item .spot-box {
  width: 28rpx;
  height: 28rpx;
  background: transparent;
  opacity: 1;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 20rpx;
  top: 4rpx;
  z-index: 2;
}

.progress-item .spot {
  width: 16rpx;
  height: 16rpx;
  background: #B4B4B4;
  opacity: 0.8;
  border-radius: 50%;
  position: absolute;
  left: 26rpx;
  top: 10rpx;
  z-index: 2;
}

.progress-item .line {
  width: 2rpx;
  height: 176rpx;
  background: #B4B4B4;
  position: absolute;
  left: 33rpx;
  top: 32rpx;
}

.progress-item .info {
  font-size: 26rpx;
  line-height: 36rpx;
}

.progress-item .info .title {
  font-size: 30rpx;
  margin-bottom: 12rpx;
  color: #333333;
}

.progress-item .info .desc {
  color: #565656;
  margin-bottom: 10rpx;
}

.progress-item .info .time {
  color: #949494;
}

.progress-item:first-of-type {
  margin-bottom: 27rpx;
}

.active {}

.refund-box {
  width: 712rpx;
  padding: 0 20rpx 78rpx 20rpx;
  box-sizing: border-box;

  background: #ffffff;
  border-radius: 14rpx;
  margin: 20rpx auto;
}

.goods-box {}

.goods-item-box {
  display: flex;
  flex-direction: column;
}



.goods-item {
  padding: 27rpx 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ECECEC;
}

.goods-item .goods-img {
  width: 108rpx;
  height: 108rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.goods-item .goods-img image {
  width: 100%;
  height: 100%;
}

.goods-item .goods-img .seckill-icon {
  position: absolute;
  width: 69rpx;
  height: 13rpx;
  top: 0;
  left: 0;
}

.goods-item .goods-info {
  height: 108rpx;
  width: calc(100% - 128rpx);
  position: relative;
}

.goods-info .goods-name,
.goods-info .goods-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  line-height: 40rpx;
}

.goods-info .goods-name {
  font-size: 32rpx;
  line-height: 38rpx;
  height: 38rpx;
  color: #333;
  margin-top: 2rpx;
  font-weight: 400;
}

.goods-info .goods-desc {
  font-size: 22rpx;
  line-height: 36rpx;
  height: 36rpx;
  color: #999;
}

.goods-info .number-price {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.goods-info .goods-count {
  font-size: 24rpx;
  color: #666666;
  font-weight: bold;
}

.goods-price {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #333;
}

.goods-price .nowPrice {
  font-weight: bold;
}

.goods-price .oldPrice {
  font-size: 20rpx;
  color: #454545;
  margin-left: 18rpx;
  text-decoration: line-through;
}

.row {
  font-size: 28rpx;
  height: 93rpx;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ECECEC;
}

.row view:last-of-type {
  font-weight: bold;
}

.refund-reason {
  font-size: 28rpx;
  color: #333333;
  display: flex;
}

.refund-reason view:first-of-type {
  width: 224rpx;
  line-height: 93rpx;
}

.refund-reason view:last-of-type {
  display: flex;
  flex-direction: column;
  padding-top: 32rpx;
}

.refund-reason text {
  font-size: 28rpx;
  color: #333333;
  display: block;
  line-height: 30rpx;
}

.refund-img-box {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 30rpx);
  padding-top: 29rpx;
}

.refund-img-box image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 6rpx;
  margin: 10rpx 32rpx 10rpx 0;
  background: #f1f1f1;
}

.refund-img-box image:nth-child(3) {
  margin-right: 0;
}

.icon-order-tips {
  width: 23rpx;
  height: 23rpx;
  margin-left: 12rpx;
}

.popup-content {
  width: 600rpx;
  border-radius: 6rpx;
  background: #fff;
  overflow: hidden;
  padding-top: 12rpx;
}

.popup-content .title {
  font-size: 32rpx;
  color: #454545;
  line-height: 80rpx;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
}

.popup-content-box {
  color: #454545;
}

.price-detail {
  padding: 0 32rpx;
  font-size: 30rpx;
  line-height: 90rpx;
  border-bottom: 1px solid #f1f1f1;
}

.price-detail view {
  border-bottom: 1px solid #f1f1f1;
  height: 90rpx;
}

.price-detail view text:last-of-type {
  float: right;
  color: #ff7171;
  border-bottom: none;
}

.color-454545 {
  color: #454545;
}

.popup-content .button {
  font-size: 28rpx;
  color: #fff;
  line-height: 84rpx;
  height: 84rpx;
  font-weight: bold;
  text-align: center;
}
</style>