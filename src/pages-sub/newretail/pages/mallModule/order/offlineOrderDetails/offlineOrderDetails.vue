<template>
  <!--pages/mallModule/order/offlineOrderDetails/offlineOrderDetails.wxml-->
  <view>
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <view class="order">
      <view class="top-info">
        <view class="order-status" :style="'background: ' + state.themeColor">
          <view>
            已完成
            <image class="right-icon" :src="state.imagesPath.iconPointRightWhite"></image>
          </view>
        </view>
        <view class="top-tips">
          <view class="top">
            <text>感谢您对我们的信任</text>
          </view>
          <text class="bottom">期待您再次光临。</text>
        </view>
      </view>
      <view class="goods-box">
        <view class="store-info">
          <view class="store-name">{{ state.order.storeName }}</view>
        </view>
        <view class="goods-list">
          <view class="goods-item-box" v-for="(item, index) in state.goodsList" :key="index">
            <view class="goods-item">
              <view class="goods-info">
                <view class="goods-left">
                  <text class="goods-name">{{ item.name }}</text>
                </view>
                <view class="goods-right">
                  <view class="goods-count">x{{ item.productNum }}</view>
                  <view class="goods-price">
                    <text class="nowPrice">￥{{ item.price }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="bill-details">
        <view></view>
        <view class="balance-accounts">
          实付金额：
          <text>￥{{ state.order.total }}</text>
        </view>
      </view>
      <view class="order-box">
        <view class="title">订单信息</view>
        <view class="section-box">
          <text class="color-454545">订 单 号：</text>
          <text selectable="true">{{ state.order.xid }}</text>
        </view>
        <view class="section-box">
          <text class="color-454545">下单时间：</text>
          <text>{{ state.order.tranTime }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiOfflineOrderServciceJs from '@/service/api/newretail/offlineOrderService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/mallModule/order/offlineOrderDetails/offlineOrderDetails.js
const offlineOrderServcice = _apiOfflineOrderServciceJs
const IMGAGESPATH = _utilsImagesPathJs
const ANALYSIS = _utilsAnalysisJs
const utils = _utilsUtilsJs
const themeManager = _utilsThemeManagerJs
const state = reactive({
  navigationBarTitle: '订单详情',
  imagesPath: IMGAGESPATH,
  order: {},
  goodsList: [],
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
})
function getOrderDetails() {
  const orderId = options.orderId
  offlineOrderServcice
    .getDetailsById(orderId)
    .then((res) => {
      if (res) {
        const tempData = {
          ...res,
          xid: res.xid || res.id,
          amount: res.amount ? res.amount.toFixed(2) : '0.00',
          total: res.total ? res.total.toFixed(2) : '0.00',
        }
        state.order = tempData
        state.goodsList = res.products
      }
      if (state.onLoad) {
        state.onLoad = false
      }
    })
    .then((res) => {
      self.getStoreById(res.storeId)
    })
    .catch((e) => {
      utils.showToast(e.message)
    })
}
function getStoreById(id) {
  const self = this
  let storeInfo = {
    tel: '',
  }
  storeService
    .getById(id)
    .then((res) => {
      storeInfo = res
      state.storeInfo = storeInfo
      state.order.storeName = res.name
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: none,
        duration: 2000,
      })
    })
}
onLoad(function (options) {
  uni.hideShareMenu()
  state.onLoad = true
  state.themeColor = app.globalData.uiconfig.themeColor
  if (options.orderId) {
    getOrderDetails()
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
})
onReady(function () {})
onShow(function () {
  if (state.orderId) {
    getOrderDetails()
  }
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function (res) {})
</script>
<style scoped>
/* pages/mallModule/order/offlineOrderDetails/offlineOrderDetails.wxss */

.order {
  overflow-x: hidden;
  position: relative;
}

.color-454545 {
  color: #454545;
}

.color-009F55 {
  color: #009f55;
}

.color-f9a72a {
  color: #f9a72a;
}

.color-ff7171 {
  color: #ff7171;
}

.color-5a5a5a {
  color: #5a5a5a;
}

.color-999999 {
  color: #999;
}

.price-detail-item-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #454545;
  overflow: hidden;
}

.price-detail-item-value {
  color: #ff7171;
  flex-shrink: 0;
}

.top-info {
  padding: 34rpx 40rpx 0 40rpx;
  border-bottom: 20rpx solid #f1f1f1;
}

.order-status {
  color: #fff;
  width: 100%;
  height: 120rpx;
  border-radius: 6rpx;
  background: #009f55;
  font-size: 32rpx;
  line-height: 120rpx;
  font-weight: bold;
  padding-left: 38rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-status image.right-icon {
  margin-left: 22rpx;
  width: 12rpx;
  height: 24rpx;
}

.order-status .countdown {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 28rpx;
  font-weight: normal;
  margin-right: 65rpx;
}

.order-status .countdown image {
  width: 31rpx;
  height: 35rpx;
  margin-right: 8rpx;
}

.top-tips {
  font-size: 20rpx;
  line-height: 40rpx;
  color: #454545;
  display: flex;
  flex-direction: column;
  padding-top: 42rpx;
  padding-bottom: 18rpx;
}

.top-tips view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40rpx;
  margin-bottom: 4rpx;
}

.top-tips view text:first-of-type {
  font-size: 28rpx;
  font-weight: bold;
}

.top-tips view text.distribution {
  font-size: 24rpx;
  color: #096;
  font-weight: normal;
}

.top-button-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 108rpx;
  border-top: 1rpx solid #f1f1f1;
}

.top-button-box button {
  background: #fff;
  height: 48rpx;
  padding: 0 20rpx;
  border: 2rpx solid #8b8b8c;
  color: #454545;
  font-size: 24rpx;
  line-height: 48rpx;
  margin: 0 30rpx 0 0;
}

.top-button-box button.payment,
.top-button-box button.to-invitation {
  color: #009f55;
  border: 2rpx solid #009f55;
}

.top-button-box button::after {
  border: 0;
}

.right-point {
  width: 15rpx;
  height: 26rpx;
  margin-right: 32rpx;
  vertical-align: middle;
  margin-top: -6rpx;
  margin-left: 10rpx;
}

/* .top-info {
  width: 100%;
  height: 98rpx;
  line-height: 98rpx;
  border-bottom: 1rpx solid #dadada;
  font-size: 40rpx;
  padding: 0 40rpx;
  background: #ff918f;
  color: #fff;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}

.top-info image {
  width: 40rpx;
  height: 36rpx;
  vertical-align: middle;
  margin-top: -6rpx;
  margin-right: 10rpx;
} */

.waitpayTail image {
  width: 38rpx;
  height: 41rpx;
}

.waitpay .time {
  float: right;
  font-size: 28rpx;
}

.finish {
  background: #ccc;
}

.dispatching {
  background: #f2cb61;
}

.selftake {
  background: #f2cb61;
}

.refunded {
  background: #ccc;
}

.share {
  background: #f4ca5c;
}

.payed {
  background: #5cb0ec;
}

.invite-join {
  background: #fff;
  padding: 0 38rpx 40rpx 38rpx;
  border-bottom: 20rpx solid #f1f1f1;
}

.group-title {
  display: flex;
  height: 82rpx;
  line-height: 82rpx;
  font-size: 24rpx;
  color: #454545;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f1f1f1;
}

.group-title text {
  font-weight: bold;
}

.group-people-list {
  padding: 30rpx 0;
  min-height: 105rpx;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border-bottom: 1rpx solid #f1f1f1;
  margin-bottom: 30rpx;
}

.group-share-text {
  font-size: 26rpx;
  color: #454545;
  line-height: 36rpx;
  margin: 15rpx 0 0 0;
  text-align: center;
  width: 100%;
}

.people-item {
  margin: 10rpx 15rpx;
  width: 101rpx;
  height: 101rpx;
  border-radius: 50%;
  border: 2rpx dashed #adadad;
  position: relative;
  display: flex;
  float: left;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
}

.group-people-list .leader {
  border: 2rpx solid #ff6b09;
}

.people-item .leader-label {
  position: absolute;
  left: 10rpx;
  top: 82rpx;
  z-index: 1;
}

.people-item image {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
}

.people-item text {
  font-size: 32rpx;
  line-height: 101rpx;
  color: #999;
}

.people-more {
  margin: 10rpx 16rpx;
  width: 101rpx;
  height: 101rpx;
  border-radius: 50%;
  position: relative;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.people-more image {
  width: 101rpx;
  height: 101rpx;
}

.leader .leader-label {
  width: 80rpx;
  height: 29rpx;
  border-radius: 12rpx;
  background-color: #ff6902;
  font-size: 18rpx;
  line-height: 29rpx;
  color: #fff;
  display: block;
  text-align: center;
}

.group-tips {
  font-size: 29rpx;
  height: 67rpx;
  line-height: 67rpx;
  width: 100%;
  display: block;
  text-align: center;
}

.join-group {
  border-radius: 6rpx;
  border: none;
  color: #fff;
  width: 670rpx;
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  font-weight: bold;
}

.usable {
  background-color: #009f55;
}

.unavailable {
  background-color: #cbcbcb;
}

.group-success {
  font-size: 28rpx;
  color: #454545;
  height: 70rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.group-success icon {
  margin-right: 25rpx;
}

.receive-box {
  min-height: 69rpx;
  border-bottom: 20rpx solid #f1f1f1;
  padding: 20rpx 40rpx 10rpx 40rpx;
  overflow: hidden;
}

.receive-box .icon-box {
  width: 46rpx;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  float: left;
}

.receive-box .icon-box image {
  width: 33rpx;
  height: 39rpx;
}

.receive-box .receive-info {
  width: 610rpx;
  height: 100%;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #454545;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.receive-box .receive-info view {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.receive-box .receive-info view:last-of-type {
  font-size: 24rpx;
  line-height: 40rpx;
}

.receive-box .receive-info view text {
  border-left: 1px solid #8b8b8c;
  padding-left: 22rpx;
  margin-left: 20rpx;
  height: 28rpx;
  line-height: 28rpx;
  display: block;
}

.num-time {
  background: #fff;
  font-size: 30rpx;
  text-indent: 40rpx;
  padding: 20rpx 0rpx;
  line-height: 56rpx;
  border-bottom: 1rpx solid #dadada;
}

.payment-remarks {
  background: #fff;
  font-size: 30rpx;
  margin-bottom: 20rpx;
}

.payment-method,
.remarks {
  min-height: 90rpx;
  line-height: 90rpx;
  padding: 0 40rpx;
}

.payment-method {
  border-bottom: 1rpx solid #dadada;
}

.payment-remarks .color-5a5a5a {
  display: block;
  float: left;
  width: 150rpx;
}

.payment-remarks .remarks {
  overflow: hidden;
}

.remarks .remarks-info {
  float: right;
  width: calc(100% - 150rpx);
  height: 100%;
  display: block;
  /* color: #9c9c9c; */
}

.bottom-box {
  width: 100%;
  height: 90rpx;
  overflow: hidden;
  font-size: 32rpx;
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  background: #fff;
  border-top: 1rpx solid #e0e0e0;
}

.bottom-box button::after {
  border: none;
}

.bottom-box .btn {
  float: right;
  width: 148rpx;
  height: 44rpx;
  border-radius: 10rpx;
  text-align: center;
  line-height: 44rpx;
  font-size: 28rpx;
  overflow: hidden;
  margin-right: 30rpx;
  margin-top: 23rpx;
  padding: 0;
}

.bottom-box .cancle {
  border: 1rpx solid #a0a0a0;
}

.bottom-box .to-pay,
.bottom-box .to-invitation {
  background: #ffbf00;
  border: 2rpx solid #ffbf00;
  color: #fff;
  box-sizing: content-box;
}

.bottom-box .confirm {
  background: #ff4b1b;
  border: 2rpx solid #ff4b1b;
  color: #fff;
}

.delivery-box {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 14rpx 0 10rpx 0;
  text-align: center;
}

.delivery-box .title {
  color: #646464;
  font-size: 32rpx;
  line-height: 56rpx;
  margin-bottom: 20rpx;
}

.tips {
  font-size: 32rpx;
  color: #606060;
  line-height: 56rpx;
}

.self-time {
  height: 86rpx;
  line-height: 86rpx;
  font-size: 32rpx;
  text-align: right;
  padding: 0 40rpx;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.self-time text {
  float: left;
  text-align: left;
  font-size: 30rpx;
}

.code-box {
  color: #454545;
  padding: 34rpx 0 30rpx 0;
  border-bottom: 20rpx solid #f1f1f1;
}

.code-box text {
  display: block;
  width: 100%;
}

.using-tips {
  text-align: center;
  font-size: 28rpx;
  line-height: 40rpx;
}

.selftake-store {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #454545;
  font-weight: bold;
  margin-top: 15rpx;
}

.selftake-store image {
  width: 40rpx;
  height: 37rpx;
  margin-right: 8rpx;
}

.barcode-box {
  margin-top: 30rpx;
  height: 122rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
}

.barcode-box canvas {
  height: 100%;
  width: 669rpx;
}

.barcode-box image {
  width: 669rpx;
  height: 100%;
}

.code-text {
  font-size: 28rpx;
  line-height: 48rpx;
  margin-top: 10rpx;
  text-align: center;
  letter-spacing: 8rpx;
}

.selfTime-text {
  font-size: 28rpx;
  line-height: 48rpx;
  margin-top: 30rpx;
  text-align: center;
  margin-bottom: 40rpx;
}

.button-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 40rpx;
  border-bottom: 20rpx solid #f1f1f1;
  height: 108rpx;
}

.button-box button {
  background: #fff;
  height: 48rpx;
  padding: 0 32rpx;
  border: 1rpx solid #8b8b8c;
  font-size: 24rpx;
  line-height: 48rpx;
  margin: 0 20rpx 0 0;
}

.button-box button.another {
  color: #009f55;
  border: 2rpx solid #009f55;
}

.button-box button::after {
  border: 0;
}

.selftake-time {
  height: 94rpx;
  border-bottom: 20rpx solid #f1f1f1;
  font-size: 28rpx;
  line-height: 94rpx;
  padding: 0 40rpx;
  display: flex;
  align-items: center;
}

.selftake-time image {
  width: 34rpx;
  height: 34rpx;
  margin-right: 24rpx;
}

.goods-box {
  padding: 0 40rpx;
  border-bottom: 20rpx solid #f1f1f1;
}

.store-info {
  height: 72rpx;
  padding-top: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f1f1f1;
}

.store-info .store-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #454545;
}

.store-info .color-009F55 {
  font-size: 24rpx;
}

.goods-item-box {
  display: flex;
  flex-direction: column;
}

.goods-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f1f1f1;
  display: flex;
  justify-content: space-between;
}

.goods-item .goods-info {
  height: 80rpx;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-info .goods-left {
  width: 219rpx;
}

.goods-info .goods-right {
  display: flex;
  justify-content: flex-start;
}

.goods-info .goods-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 219rpx;
  display: block;
  line-height: 40rpx;
}

.goods-info .goods-name {
  font-size: 28rpx;
  line-height: 40rpx;
  height: 40rpx;
  color: #454545;
  margin-top: 2rpx;
  font-weight: 400;
}

.goods-info .goods-count {
  font-size: 24rpx;
  color: #454545;
  line-height: 80rpx;
  font-weight: bold;
}

.goods-price {
  font-size: 30rpx;
  line-height: 80rpx;
  color: #454545;
  margin-left: 95rpx;
}

.goods-price .nowPrice {
  color: #f9a72a;
  font-weight: bold;
}

.goods-price .oldPrice {
  font-size: 20rpx;
  color: #454545;
  margin-left: 18rpx;
  text-decoration: line-through;
}

.section-box {
  height: 86rpx;
  font-size: 28rpx;
  line-height: 86rpx;
  border-bottom: 1rpx solid #f1f1f1;
  text-align: right;
  display: flex;
  justify-content: space-between;
}

.section-box view text {
  color: #f9a72a;
  font-weight: bold;
}

.bill-details {
  height: 80rpx;
  padding: 0 40rpx;
  border-bottom: 20rpx solid #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bill-details view:first-of-type {
  font-size: 24rpx;
  color: #8b8b8c;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  height: 100%;
  padding-right: 20rpx;
}

.bill-details view:first-of-type image {
  width: 23rpx;
  height: 23rpx;
  margin-left: 11rpx;
}

.balance-accounts {
  justify-content: flex-end;
  align-items: center;
  display: flex;
  font-size: 28rpx;
  color: #454545;
}

.balance-accounts text {
  font-size: 28rpx;
  color: #f9a72a;
  font-weight: bold;
  line-height: 86rpx;
}

.store-box {
  padding: 0 40rpx;
  border-bottom: 20rpx solid #f1f1f1;
}

.store-box .section-box {
  color: #8b8b8c;
  line-height: 86rpx;
  justify-content: flex-start;
}

.store-box .section-box:last-of-type {
  border-bottom: 0;
}

.store-box .section-box view {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 140rpx);
  text-align: left;
}

.store-box .title,
.order-box .title {
  font-size: 28rpx;
  color: #454545;
  font-weight: bold;
  height: 86rpx;
  line-height: 86rpx;
  border-bottom: 1rpx solid #f1f1f1;
}

.order-box {
  padding: 0 40rpx;
}

.order-box .section-box {
  color: #8b8b8c;
  line-height: 86rpx;
  justify-content: flex-start;
}

.order-box .section-box text:first-of-type {
  width: 142rpx;
  text-align: left;
}

.order-box .remarks {
  padding: 10rpx 0 38rpx 0;
  border-bottom: 0;
  height: auto;
}

.order-box .remarks .color-454545 {
  line-height: 48rpx;
}

.order-box .remarks > text:last-of-type {
  line-height: 48rpx;
  text-align: left;
}

.order-box .num-express {
  position: relative;
}

.order-box .num-express text.trackingDetails {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
