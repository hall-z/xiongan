<template>
<!-- pages/scoreOrder/scoreOrder.wxml -->

<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="score-product-item" v-for="(item , index) in state.orderList" :key="id" @click="toDetail" :data-status="data.status" :data-id="item.id">
    <image :src="item.type === 'SCORE_PRODUCT_PRODUCT' ? item.scoreProduct.product.imageUrl : state.imagesPath.scoreOrderCoupon"></image>
    <view class="score-product-info">
        <view>
            <text class="item-good-name" v-if="item.type === 'SCORE_PRODUCT_PRODUCT'">{{item.scoreProduct.product.name}}</text>
            <text class="item-good-name" v-if="item.type === 'SCORE_PRODUCT_COUPON'">{{item.scoreProduct.couponActivity.name || item.scoreProduct.couponActivity.couponTypeName}}</text>
            <text class="item-good-name" v-if="item.type === 'SCORE_PRODUCT_THIRDCOUPONCODE'">{{item.scoreProduct.name}}</text>
            <text class="item-good-statu" v-if="item.status === 'CASHED'">兑换成功</text>
            <text class="item-good-statu" v-else-if="item.status === 'CREATED'">未兑换</text>
            <text class="item-good-statu" v-else style="color: red;">兑换失败</text>
        </view>
        <view>
            <text class="item-good-score">{{item.score + '积分'}}{{item.total ? '+' + item.total + '元' : ''}}</text>
            <text class="item-good-time">兑换时间：{{item.createTime}}</text>
        </view>
    </view>
</view>
<view class="no-data" :hidden="state.orderList.length == 0 ? false : true">
    <image :src="state.imagesPath.imgNoOrders"></image>
</view>
<button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
<view class="order-end" :hidden="!state.noMore">~我也是有底线的~</view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _apiScoreProductService from "@/service/api/newretail/scoreProductService";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/scoreOrder/scoreOrder.js
const orderService = _apiOrderServiceJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const scoreProductService = _apiScoreProductService;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const state = reactive({
  navigationBarTitle: "兑换记录",
  imagesPath: IMGAGESPATH,
  orderList: [],
  member: {},
  noMore: false,
  loading: false,
  page: 1,
  pageSize: 15,
  pageCount: 1
});
function toOrderDetails(val) {
  console.log(val);
  let orderId = val.currentTarget.dataset.id;
  let opts = '?orderId=' + orderId;
  NAVPAGE.toOrderDetails(opts);
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
}
onLoad(function (options) {
  uni.hideShareMenu();
  // if (app.globalData.userInfo) {
  //   console.log(app.globalData.userInfo)
  //   if (app.globalData.userInfo.member) {
  //     this.setData({
  //       member: app.globalData.userInfo.member
  //     })
  //     this.getOrderData(this.data.page)
  //   }
  // }
});
onReady(function () {});
onShow(function () {
  state.orderList = [];
  state.member = {};
  state.page = 1;
  state.pageCount = 1;
  state.noMore = false;
  if (app.globalData.userInfo) {
    console.log(app.globalData.userInfo);
    if (app.globalData.userInfo.member) {
      state.member = app.globalData.userInfo.member;
      getOrderData(state.page);
    }
  }
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {
  state.orderList = [];
  state.member = {};
  state.page = 1;
  state.pageCount = 1;
  state.noMore = false;
  onShow();
  uni.stopPullDownRefresh();
});
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true;
    let page = state.page;
    ++page;
    getOrderData(page);
  } else {
    // 没有下一页，提示已经查询完毕
    state.noMore = true;
  }
});
onShareAppMessage(function () {});
function getOrderData(page) {
  const that = this;
  let postData = {
    page: page,
    pageSize: state.pageSize,
    searchCount: true
  };
  scoreProductService.queryScoreOrder(postData).then(res => {
    console.log(res);
    let tempList = state.orderList;
    if (res && res.records && res.records.length > 0) {
      let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
      if (res.recordCount % res.pageSize === 0) {
        pageCount = parseInt(res.recordCount / res.pageSize);
      }
      state.page = res.page;
      state.pageCount = pageCount;
      state.orderList = tempList.concat(res.records);
    }
    if (state.loading) {
      state.loading = false;
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
    if (state.loading) {
      state.loading = false;
    }
  });
}
function toDetail(e) {
  let record = state.orderList.filter(res => {
    return res.id == e.currentTarget.dataset.id;
  })[0];
  if (record.type === "SCORE_PRODUCT_COUPON") {
    //券类型直接跳转我的优惠券列表
    NAVPAGE.toMyCoupon();
    return;
  }
  if (record.type === "SCORE_PRODUCT_THIRDCOUPONCODE") {
    NAVPAGE.toMyThirdCoupon();
    return;
  }
  //判断 只有商品类型才执行后面的代码
  if (record.type !== "SCORE_PRODUCT_PRODUCT") {
    console.log("不是商品类型");
    return;
  }
  if (record.orderId == null || record.orderId === "") {
    console.log("订单id为空");
    return;
  }
  let status = record.status;
  let orderId = status == 'CREATED' ? record.orderId : record.childOrderId;
  let opts = '?orderId=' + orderId + (status == 'CREATED' ? '' : '&status=' + status);
  NAVPAGE.toOrderDetails(opts);
}
</script>
<style scoped>
/* pages/scoreOrder/scoreOrder.wxss */
/* @import "./orderItem/orderItem.wxss"; */

page {
  height: 100%;
  width: 100%;
  border-top: 1rpx solid #f1f1f1;
}

.score-product-item {
  border: 20rpx solid #f3f7fa;
  border-bottom: 0;
  display: flex;
  flex-direction: row;
  /* margin: 0rpx 40rpx; */
  padding: 0 10rpx;
  height: 140rpx;
  align-items: center;  
}

.score-product-item image {
  height: 120rpx;
  width: 120rpx;
}

.score-product-info {
  flex-direction: column;
  height: 80rpx;
  width: calc(100vw - 160rpx - 20rpx);
  margin-left: 20rpx;
}

.score-product-info view {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.item-good-name {
  width: 400rpx;
  font-weight: bold;
  font-size: 32rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-good-statu {
  font-size: 28rpx;
}

.item-good-score {
  color: #fe845f;
  font-weight: bold;
  font-size: 25rpx;
}

.item-good-time {
  color: #c2c5c6;
  font-size: 25rpx;
}

.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
  /* margin-top: 40%; */
}

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #fff;
  border-radius: 0;
}

.loading-btn::after {
  border: 0;
}

.order-end {
  color: #009f55;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
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

.spinner > view {
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
  0%, 40%, 100% {
    -webkit-transform: scaleY(0.4);
  }

  20% {
    -webkit-transform: scaleY(1.0);
  }
}

@keyframes stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}

</style>