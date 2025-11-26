<template>
<!--pages/mallModule/order/moneyGoing/moneyGoing.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view v-for="(refund , index) in state.refundPayments" :key="id">
    <view class="content" v-for="(item , index) in refund.payments" :key="id">
      <view class="refund-info">
        <text>退款金额</text>
        <view class="amount pass">￥
          <text>{{item.refundTotal}}</text>
        </view>
        <text :class="'status ' + (item.refunded ? 'pass' : 'inRefund')">{{item.refunded ? '已退款' : '退款中'}}</text>
      </view>
      <view class="details-list">
        <view>
            <view>商品信息</view>
        </view>
      </view>
      <view class="commodity-list">
          <view class="commodity-item" v-for="(goods , index) in refund.refundDetails" :key="orderProductId">
            <view class="commodity-name">
                {{goods.productName}}
            </view>
            <view class="commodity-number">
                x{{goods.quantity}}
            </view>
            <view class="commodity-money">
                ￥{{goods.price}}
            </view>
        </view>
      </view>
      <view class="details-list">
        <view>
          <view>退款时间</view>
          <view>{{item.createTime}}</view>
        </view>
        <view>
          <view>退款方式</view>
          <view>{{item.payMethod}}</view>
        </view>
        <view>
          <view>退款单号</view>
          <view>{{item.refundId}}</view>
        </view>
        <!-- <view>
          <view>预计到账时间</view>
          <view>{{item.arrivalTime}}</view>
        </view> -->
      </view>
    </view>

</view>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/order/moneyGoing/moneyGoing.js
const orderService = _apiOrderServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const UTILS = _utilsUtilsJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "钱款去向",
  refundPayments: []
});
onLoad(function (options) {
  uni.hideShareMenu();
  if (options.orderId != null) {
    getRefundPayment(options.orderId);
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function getRefundPayment(orderId) {
  const that = this;
  orderService.getRefundPaymentV2(orderId).then(res => {
    let tempList = [];
    if (res && res.length > 0) {
      res.forEach(item => {
        //   const time = new Date(item.payTime.replace(/\-/g, '/')).getTime();
        //   const newTime = this.addDay(time, 3)
        //   const formatTime = UTILS.formatTime(newTime)
        //   const arrivalTime = formatTime.replace(/\//g, '.');
        let tempItem = {
          ...item,
          // payTime: item.payTime.replace(/\-/g, '.'),
          payMethod: handlePayment(item.payMethod)
          // arrivalTime: arrivalTime
        };
        if (item.payments) {
          item.payments.forEach(item1 => {
            item1.payMethod = handlePayment(item1.payMethod);
          });
        }
        tempList.push(tempItem);
      });
    }
    state.refundPayments = tempList;
  }).catch(err => {
    UTILS.showToast(err.message);
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
  } else if (val === 'WX_MINI_APP') {
    res = "微信";
  } else if (val === 'WECHATH5') {
    res = "微信";
  } else if (val === 'ALIPAYH5') {
    res = "支付宝";
  } else if (val === 'MSP_ACCOUNT_PAY') {
    res = "余额";
  }
  return res;
}
function addDay(curDate, days) {
  return new Date((curDate / 1000 + 86400 * days) * 1000);
}
</script>
<style scoped>
/* pages/mallModule/order/moneyGoing/moneyGoing.wxss */

page {
  background: #f4f4f4;
}

.content {
  background: #fff;
  width: 690rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
  margin: 20rpx auto;
  font-size: 28rpx;
  line-height: 32rpx;
  color: #151515;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.refund-info {
  padding: 32rpx 0;
}

.refund-info .amount {
  font-weight: bold;
  margin-left: -30rpx;
}

.refund-info .amount text {
  font-size: 60rpx;
  line-height: 90rpx;
}

.refund-info .status {
  margin-top: 12rpx;
}

.refund-info .status.pass {
  color: #3ec32e;
}

.refund-info .status.inRefund {
  color: #fb2f35;
}

.details-list {
  border-top: 1px solid #f3f3f3;
}

.details-list {
  width: 100%;
  padding: 16rpx 0 22rpx;
}

.details-list>view {
  display: flex;
  line-height: 36rpx;
  padding: 3rpx 0;
  min-height: 42rpx;
}

.details-list>view view:first-of-type {
  color: #a2a2a2;
  width: 190rpx;
  flex-shrink: 0;
}
.commodity-list {
    width: 100%;
    padding: 0 0 22rpx;
}
.commodity-item {
    display: flex;
    width: 100%;
    align-items: center;
}
.commodity-item>view {
    flex: 0 0 auto;
    padding: 0 10rpx;
}
.commodity-item>.commodity-name {
    flex: 1 0 auto;
    max-width: 500rpx;
    padding: 0;
    word-wrap: break-word;
    word-break: break-all;
}

.details-list>view view:last-of-type {}
</style>