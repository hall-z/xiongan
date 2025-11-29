<template>
<!--pages/mallModule/order/refundAddDetails/refundAddDetails.wxml-->
<!--pages/refund/refund.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view>
<view class="refund-main">
    <view class="refund-order">
      <view class="order-number">
        <text>订单号：{{state.orderId}}</text>
        <!-- <view wx:if="{{refundDetail.status === 'CREATED'}}">待审核</view> -->
        <view class="refund-status gray-color" v-if="state.refundDetail.status === 'FINISHED'">完成退款</view>
        <!-- 退款 -->
        <view class="refund-status gray-color" v-if="state.refundDetail.status === 'FAILED'">退款失败</view>
        <view class="refund-status" v-if="state.refundDetail.status === 'CREATED'">待审核</view>
        <view class="refund-status gray-color" v-if="state.refundDetail.status === 'RETURNING'">退换货中</view>
        <view class="refund-status gray-color" v-if="state.refundDetail.status === 'PARTREJECTED'">部分退款</view>
        <view class="refund-status gray-color" v-if="state.refundDetail.status === 'REJECTED'">已拒绝</view>
        <view class="refund-status gray-color" v-if="state.refundDetail.status === 'REFUND_WAITRECEIVER'">商家待收货</view>
      </view>
      <view class="goods-box portion-refund">
        <checkbox-group @change="checkboxChange">
          <view class="goods-item-box" v-for="(item , index) in state.refundDetail.refundDetails" :key="index">
            <view class="goods-item">
              <!-- <checkbox disabled="{{packagingId || orderType === 'COMPOSE' || item.productNum === 0 || orderType === 'CYCLE'}}" value="{{item.id}}" checked="{{item.checked}}" /> -->
              <image :src="item.url"></image>
              <view class="goods-info">
                <view class="goods-name">{{item.productName}}</view>
                <view class="goods-count">
                  <text class="nowPrice" v-if="!item.giftProduct">￥{{item.price}}</text>
                  <text v-if="state.orderType !== 'CYCLE' && state.refundDetail.refundType != 'CUSTOMTOTAL'">x{{item.quantity}}</text>
                  <text v-else-if="!state.refundDetail || state.refundDetail.refundType != 'CUSTOMTOTAL'">x{{item.quantity}}</text>
                  <text class="refund-num" v-if="item.total && state.refundDetail.refundType == 'CUSTOMTOTAL'">已退￥{{item.total}}</text>
                </view>
                <view class="price-number">
                  <view class="count-box" v-if="item.quantity > 0">
                    <view :data-id="item.id" @click.stop="handleReduce" style="color:#BBBBBC">-</view>
                    <text :data-id="item.id">{{item.quantity}}</text>
                    <view style="color:#BBBBBC" :data-id="item.id">+</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </checkbox-group>
      </view>
      <view class="order-info">
        <view class="goods-count">退款金额：¥{{toFix(refundTotal - (state.refundDetail.shipmentTotal || 0))}} <text v-if="state.refundDetail.shipmentTotal">（含运费¥{{toFix(state.refundDetail.shipmentTotal)}}）</text></view>
      </view>
    </view>
    <view class="refund-box">
      <view class="refund-title">退款原因</view>
      <view class="redund-explain">
        <!-- <view class="redund-labels">
          <text wx:for="{{state.labels}}" class="{{item.select ? 'select' : ''}}" style="background: {{item.select ? state.themeColor : ''}};border: 1rpx solid {{item.select ? state.themeColor : ''}};" data-id="{{item.id}}" wx:key="index" bindtap="clickLabels">{{item.text}}</text>
        </view> -->
        <textarea :value="state.refundDetail.applyReason" disabled="" class="redund-explain-con" id="explain-con" maxlength="200" auto-height="true"></textarea>
        <view class="refund-image">
          <image @click="reviewImg" :data-url="item" v-for="(item , index) in state.refundDetail.descriptionImageUrlsArr" :key="unique" :src="item"></image>
        </view>
      </view>
    </view>
    <view class="refund-box" v-if="state.refundDetail.rejectReason">
      <view class="refund-title">审批意见</view>
      <view class="redund-explain">
        <textarea :value="state.refundDetail.rejectReason" disabled="" class="redund-explain-con" id="explain-con" maxlength="200" auto-height="true"></textarea>
      </view>
    </view>
    <!-- <view class="bottom-box">
      <view class="order-price" wx:if="{{state.supportPartReturn || state.orderType === 'CYCLE'}}"></view>
      <view class="order-price" wx:else>￥{{cashTotal}}
        <text>按原路退回</text>
      </view>
      <button bindtap="refundSubmit" class="btn" style="background-color: {{state.themeColor}}">提交申请</button>
    </view> -->
</view></view>
</template>
<script setup>
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsLogJs from "@/utils/newretail/log";
import _utilsSubscribeMessageJs from "@/utils/newretail/subscribeMessage";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiSystemServiceJs from "@/service/api/newretail/systemService";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/order/refundAddDetails/refundAddDetails.js
const orderService = _apiOrderServiceJs;
const sysService = _apiSystemServiceJs;
const request = _apiRequestJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const subscribeMessage = _utilsSubscribeMessageJs;
const log = _utilsLogJs;
const utils = _utilsUtilsJs;
const selfA = _utilsSelfJs;
const state = reactive({
  //   是否支持商品按数量退款 默认是
  isSupportPartReturn: null,
  navigationBarTitle: "退款详情",
  imagesPath: IMGAGESPATH,
  avatarUrl: null,
  imageUrls: [],
  goodsList: [],
  giftList: [],
  orderId: '',
  inputText: '',
  textAreaHidden: true,
  canRefund: true,
  refundNumber: 0,
  allRedund: false,
  labels: [{
    id: 0,
    text: '不想要了',
    select: false
  }, {
    id: 1,
    text: '购买的商品缺货',
    select: false
  }, {
    id: 2,
    text: '订单信息拍错（规格/尺码/颜色等）',
    select: false
  }, {
    id: 3,
    text: '商品破损',
    select: false
  }, {
    id: 4,
    text: '发货速度不满意',
    select: false
  }, {
    id: 5,
    text: '拍多了',
    select: false
  }, {
    id: 6,
    text: '其他',
    select: false
  }],
  type: 'submit',
  count: 5,
  supportPartReturn: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  isRefund: false,
  orderType: '',
  afterSaleType: '',
  // 退款类型
  packagingId: '',
  //是否一口价商品
  orderDetails: '',
  // 订单详情
  refundDetail: {},
  //退款详情
  currentValue: [],
  // 当前选择退款的订单
  refundAmount: 0,
  // 已退款数量
  isCheckGift: false // 是否退赠品
});
onLoad(function (options) {
  uni.hideShareMenu();
  if (options.orderId) {
    state.orderId = options.orderId;
    getByOrder(options.orderId);
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  state.themeColor = app.globalData.uiconfig.themeColor;
});
function getByOrder(orderId) {
  let that = this;
  orderService.getByOrderRefund({
    id: orderId
    // storeId:this.data.storeId
  }).then(res => {
    if (res) {
      console.log('进入到这里吗？', res);
      res.descriptionImageUrlsArr = res.descriptionImageUrls ? res.descriptionImageUrls.split(',') : [];
      state.refundDetail = res;
      state.refundTotal = res.total;
    }
  });
}
function reviewImg(e) {
  let url = e.currentTarget.dataset.url;
  uni.previewImage({
    current: url,
    // 当前显示图片的http链接
    urls: state.refundDetail.descriptionImageUrlsArr // 需要预览的图片http链接列表
  });
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {
  uni.hideLoading();
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/mallModule/order/refundAddDetails/refundAddDetails.wxss */
page {
    background-color: #fff;
  }
  
  .refund-main {
    width: 100%;
    padding-bottom: 200rpx;
  }
  
  .refund-order {
    width: 100%;
    background-color: #fff;
    border-top: 1rpx solid #e6e6e6;
    border-bottom: 20rpx solid#F1F1F1;
    color: #454545;
    padding-bottom: 35rpx;
  }
  
  .order-number {
    height: 80rpx;
    font-size: 28rpx;
    line-height: 80rpx;
    border-bottom: 1px solid #ebebeb;
    margin: 0 40rpx;
    color: #454545;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .order-number checkbox {
    line-height: 80rpx;
  }
  .order-number view {
      color: #999;
  }
  checkbox .wx-checkbox-input {
    border-radius: 50%;
    width: 32rpx;
    height: 32rpx;
  }
  
  checkbox .wx-checkbox-input.wx-checkbox-input-checked {
    border-color: #009136;
    background: #009136;
  }
  
  checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
    border-radius: 50%;
    width: 32rpx;
    height: 32rpx;
    line-height: 32rpx;
    text-align: center;
    font-size: 20rpx;
    color: #fff;
    background: transparent;
    transform: translate(-50%, -50%) scale(1);
    -webkit-transform: translate(-50%, -50%) scale(1);
  }
  
  .goods-box {
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    padding: 10rpx 40rpx 10rpx 40rpx;
    /* border-bottom: 1rpx solid #F1F1F1; */
  }
  
  .goods-box checkbox-group {
    width: 100%;
  }
  
  .goods-box.portion-refund .goods-item {
    width: 100%;
    height: 120rpx;
    margin: 10rpx 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: none;
  }
  
  .goods-box.portion-refund .goods-info {
    position: relative;
    width: calc(100% - 200rpx);
    font-size: 32rpx;
    height: 120rpx;
  }
  
  .goods-box .goods-item {
    width: 120rpx;
    height: 120rpx;
    margin: 0 8rpx 9rpx 0;
    border: 1rpx solid #f0f0f0;
  }
  
  .goods-box .goods-item:last-of-type {
    margin-right: 0;
  }
  
  .goods-box .goods-item>image {
    width: 120rpx;
    height: 120rpx;
  }
  
  .goods-box .goods-item checkbox {
    height: 120rpx;
    line-height: 120rpx;
  }
  
  .goods-box .goods-name,
  .goods-box .goods-desc {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .goods-box .goods-name {
    font-size: 32rpx;
    line-height: 36rpx;
    height: 36rpx;
    margin-top: 12rpx;
    margin-bottom: 32rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .goods-detail-info {
      display: flex;
      flex-direction: column;
      font-size: 20rpx;
      color: #999;
  }
  .goods-box .goods-name .name {
    width: calc(100% - 70rpx);
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .goods-box .label {
    width: 60rpx;
    height: 36rpx;
    font-size: 24rpx;
    line-height: 36rpx;
    margin-right: 10rpx;
    text-align: center;
    border-radius: 6rpx;
    background: #ff6131;
    display: block;
    color: #ffffff;
  }
  
  .goods-box .goods-desc {
    font-size: 26rpx;
    line-height: 36rpx;
    width: 70%;
  }
  
  .goods-box .price-number .count-box {
    width: 135rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 44rpx;
    height: 44rpx;
    border: 1rpx solid #f1f1f1;
    position: absolute;
    bottom: 0;
    right: 0;
  }
  
  .goods-box .price-number .count-box text {
    background: #fff;
    color: #454545;
    font-size: 24rpx;
    width: 43rpx;
    height: 100%;
    text-align: center;
    /* display: inline-block; */
  }
  
  .goods-box .price-number .count-box view {
    width: 46rpx;
    height: 46rpx;
    text-align: center;
    font-size: 40rpx;
    background: #f1f1f1;
    color: #009136;
    /* line-height: 44rpx; */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .order-info {
    font-size: 26rpx;
    height: 36rpx;
    line-height: 36rpx;
    width: 100%;
    margin-top: 26rpx;
    padding: 0 40rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
  }
  
  .order-info>view {
    display: inline-flex;
  }
  
  .order-info>view:last-of-type view {
    vertical-align: bottom;
  }
  
  .goods-info .nowPrice {
    font-size: 28rpx;
    line-height: 36rpx;
    font-weight: bold;
    color: #333;
    margin-right: 30rpx;
  }
  
  .goods-info .goods-count {
    font-size: 24rpx;
    color: #666666;
    font-weight: bold;
  }
  
  .goods-info .goods-count text:first-of-type {
    display: inline-block;
    min-width: 60rpx;
  }
  
  .goods-info .goods-count .refund-num {
    color: #FF4545;
    font-weight: 400;
    margin-left: 2rpx;
    float: right;
  }
  
  .order-price {
    color: #ff8561;
    font-size: 36rpx;
  }
  
  
  
  .freight-info {
    font-size: 26rpx;
    margin-left: 15rpx;
    line-height: 26rpx;
    margin-top: 10rpx;
  }
  
  .order-freight {
    font-size: 26rpx;
    color: #727272;
  }
  
  /* 退款原因 */
  
  .refund-box {
    background-color: #fff;
    padding: 0 40rpx 9rpx 40rpx;
    width: 100%;
    box-sizing: border-box;
  }
  
  .refund-title {
    padding-top: 12rpx;
    height: 84rpx;
    font-size: 32rpx;
    font-weight: bold;
    line-height: 84rpx;
    color: #454545;
    border-bottom: 1rpx solid #f1f1f1;
  }
  
  .redund-explain {
    padding: 0;
  }
  
  .redund-labels {
    padding: 20rpx 0;
  }
  
  .redund-labels text {
    font-size: 24rpx;
    line-height: 50rpx;
    height: 50rpx;
    color: #8b8b8c;
    box-sizing: border-box;
    padding: 0 38rpx;
    border: 1rpx solid #8b8b8c;
    display: inline-block;
    border-radius: 5rpx;
    margin: 10rpx 20rpx 10rpx 0;
  }
  
  .redund-labels text.select {
    background: #009f55;
    border: 1rpx solid #009f55;
    color: #fff;
  }
  
  .redund-explain-con {
    width: 598rpx;
    height: 192rpx;
    font-size: 28rpx;
    line-height: 32rpx;
    min-height: 192rpx;
    color: #8b8b8c;
    padding: 26rpx 36rpx;
    background: #f1f1f1;
    border-radius: 6rpx;
    /* overflow-y:auto; */
  }
  
  .refund-image {
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    margin-top: 20rpx;
  }
  
  .refund-image>image {
    min-width: 162rpx;
    width: 162rpx;
    height: 162rpx;
    margin-right: 5rpx;
    margin-bottom: 9rpx;
  }
  
  .refund-image>image:last-of-type {
    margin-right: 0;
  }
  
  .redund-explain .submit-img {
    width: 162rpx;
    height: 162rpx;
  }
  
  .bottom-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0 40rpx;
    box-sizing: border-box;
    height: 120rpx;
    border-top: 1rpx solid #dcdcdc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    z-index: 9;
  }
  
  .bottom-box .order-price {
    color: #ff8561;
    font-size: 36rpx;
    line-height: 120rpx;
    font-weight: bold;
  }
  
  .bottom-box .order-price text {
    font-size: 24rpx;
    color: #454545;
    font-weight: bold;
    line-height: 30rpx;
    padding-left: 22rpx;
    margin-left: 22rpx;
    border-left: 1px solid #8b8b8c;
  }
  
  .btn {
    font-size: 32rpx;
    line-height: 100rpx;
    font-weight: bold;
    height: 100rpx;
    width: 325rpx;
    color: #fff;
    border-radius: 6rpx;
    border: 0;
    margin: 0;
    background-color: #009f55;
  }
  
  .refund-success {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .success-img {
    width: 240rpx;
    height: 227rpx;
    margin-top: 280rpx;
  }
  
  .success-tips {
    font-size: 32rpx;
    line-height: 92rpx;
    color: #8b8b8c;
  }
  
  .retuen-btn {
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
    width: 325rpx;
    height: 100rpx;
    line-height: 100rpx;
    background: #009f55;
    border-radius: 6rpx;
  }
  
  /* 赠品相关 */
  
  .gift-box {
    background: #fff;
    min-height: 80rpx;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    color: #ff6131;
    padding: 0 40rpx;
    font-size: 24rpx;
    width: 100%;
    box-sizing: border-box;
    border-top: 1px dashed #ebebeb;
    border-bottom: 1px solid #ebebeb;
    margin: 10rpx auto;
  }
  
  .gift-bottom-box {
    width: 670rpx !important;
    margin: 10rpx 40rpx;
    padding: 0 !important;
    align-items: center;
  }
  
  .gift-box view {
    display: flex;
    align-items: center;
  }
  
  .gift-box .gift-title {
    margin-right: 5rpx;
    height: 80rpx;
    width: 60rpx;
  }
  
  .gift-box .gift-item-box {
    width: calc(100% - 80rpx);
    display: flex;
    flex-direction: column;
  }
  
  .gift-box .gift-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 80rpx;
  }
  
  .gift-box .gift-item text {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 380rpx;
  }
  
  .gift-bottom-box .gift-item-box {
    flex-direction: row !important;
  }
  
  .gift-bottom-box .gift-item {
    justify-content: flex-start !important;
  }
  
  .gift-img-box {
    width: 58rpx;
    height: 58rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    margin: 0 13rpx;
    border-radius: 6rpx;
    flex-shrink: 0;
  }
  
  .gift-img-box image {
    width: 100%;
    height: 100%;
  }
  
  .gift-box .gift-num {
    color: #ff3a00;
  }
  .delivery-list {
    padding: 0 20rpx;
  }
    
  .delivery-list .delivery-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 10rpx;
    margin-top: 20rpx;
    padding: 12rpx;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  .item-lt-box {
      display: flex;
      align-items: center;
  }
  
  .delivery-list .delivery-list-item .item-lt {
    display: flex;
    font-weight: 400;
    font-size: 24rpx;
    color: #000000;
    margin-left: 15rpx;
  }
  
  .delivery-list .delivery-list-item .item-lt view:nth-of-type(1) {
    margin-right: 30rpx;
  }
  
  .delivery-list .delivery-list-item .item-rt {
    width: 110rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 24rpx;
    text-align: center;
    color: #999999;
  }
  
  .delivery-list .delivery-list-item .edit {
    border-radius: 30rpx;
    border: 1px solid #EB702D;
    color: #EB702D;
  }
  
  .delivery-list .delivery-list-item .progress {
    color: #23C257;
  }
  
  .order-box {
    background: #fff;
    /* width: 674rpx; */
    width: 100%;
    padding: 0 20rpx 20rpx 20rpx;
    margin: 0 auto 18rpx auto;
    border-bottom: 20rpx solid#F1F1F1;
    box-sizing: border-box;
  }
  
  .order-box .title {
    display: flex;
    justify-content: space-between;
    font-size: 32rpx;
    color: #242424;
    font-family: Source Han Sans CN;
    font-weight: 500;
    height: 60rpx;
    line-height: 60rpx;
    padding-top: 15rpx;
    padding-left: 20rpx;
  }
  
  .goods-info .goods-desc {
    font-size: 22rpx;
    line-height: 36rpx;
    height: 36rpx;
    color: #999;
  }
</style>