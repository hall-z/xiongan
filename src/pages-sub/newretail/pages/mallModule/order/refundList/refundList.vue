<template>
<!--pages/mallModule/order/refundList/refundList.wxml-->
<view>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="loading-box" :hidden="state.pageShow">
	<loading></loading>
</view>
<view class="content" :hidden="!state.pageShow">
  <view class="refund-item" v-for="(item , index) in state.refundList" :key="index" :data-id="item.id" @click="toRefundDetails">
    <view class="refund-title">
      <view class="name"><image :src="state.imagesPath.iconRefundMoney" mode="widthFix"></image>退款</view>
      <text v-if="item.status === 'CREATED'" class="color-2DBE1B">{{filtRefundStatus(item.status)}}</text>
      <text v-else-if="item.status === 'FINISHED'" class="color-FF8105">{{filtRefundStatus(item.status)}}</text>
      <text v-else-if="item.status === 'REJECTED'" class="color-FF3333">{{filtRefundStatus(item.status)}}</text>
      <text v-else class="text">{{filtRefundStatus(item.status)}}</text>
    </view>
    <view class="refund-goods">
      <view class="goods-box" v-for="(item , index) in item.refundDetails" :key="idx" v-if="index < 4">
        <image :src="item.url"></image>
      </view>
      <image class="right-point" :src="state.imagesPath.iconRight2"></image>
    </view>
    <view class="refund-time"><text>申请时间：{{item.applyTime}}</text></view>
  </view>
    <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
  <view class="order-end" :hidden="!state.noMore">~我也是有底线的~</view>
  <view class="no-data" :hidden="state.refundList.length > 0">
    <image :src="state.imagesPath.imgNoData"></image>
    <button :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'" @click="toIndex">随便逛逛</button>
  </view>
</view></view>
</template>
<script setup>
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import loading from '@/pages-sub/newretail/components/loading/loading.vue';
const app = getApp();

// pages/mallModule/order/refundList/refundList.js
const orderService = _apiOrderServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const utils = _utilsUtilsJs;
const themeManager = _utilsThemeManagerJs;
const NAVPAGE = _utilsNavPageJs;
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
//获取应用实例
const state = reactive({
  navigationBarTitle: "订单售后",
  imagesPath: IMGAGESPATH,
  refundList: [],
  pageShow: false,
  theme: themeManager,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  page: 1,
  pageSize: 10,
  pageCount: 1,
  noMore: false,
  loading: false
});
let customData = {
  query: false
};
onLoad(function (options) {
  uni.hideShareMenu();
  queryRefundOrder(1);
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
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
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {
  state.page = 1;
  state.pageCount = 1;
  state.noMore = false;
  state.refundList = [];
  queryRefundOrder(1);
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true;
    let page = state.page;
    ++page;
    queryRefundOrder(page);
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.solitaireList.length > 0) {
      state.noMore = true;
    } else {
      uni.showToast({
        title: '没有更多数据~',
        icon: 'none',
        duration: 2000
      });
    }
  }
});
onShareAppMessage(function () {});
function queryRefundOrder(page = 1) {
  const self = this;
  const opts = {
    memberId: app.globalData.userInfo.member.id
  };
  if (customData.query) {
    console.log("已经在查询中~");
    return;
  }
  customData.query = true;
  orderService.queryRefund(page, state.pageSize, opts).then(res => {
    customData.query = false;
    if (res && res.records && res.records.length > 0) {
      let tempList = [];
      res.records.forEach(item => {
        let tempItem = item;
        if (item.productDescription != null && item.productDescription != '') {
          let productDescription = JSON.parse(item.productDescription);
          let array = [];
          if (productDescription.length > 0) {
            productDescription.forEach(ele => {
              array.push(ele);
            });
          }
          tempItem = {
            ...tempItem,
            refundDetails: array
          };
        }
        tempList.push(tempItem);
      });
      let refundList = state.refundList;
      refundList = refundList.concat(tempList);
      let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
      state.refundList = refundList;
      state.page = res.page;
      state.pageCount = pageCount;
    } else {}
    if (state.loading) {
      state.loading = false;
    }
    if (!state.pageShow) {
      state.pageShow = true;
    }
  }).catch(err => {
    customData.query = false;
    if (!state.pageShow) {
      state.pageShow = true;
    }
    if (state.loading) {
      state.loading = false;
    }
    utils.showToast(err.message);
  });
}
function toRefundDetails(e) {
  const refundId = e.currentTarget.dataset.id;
  let refundInfo = null;
  state.refundList.forEach(ele => {
    if (refundId === ele.id) {
      refundInfo = ele;
    }
  });
  const opts = "?refundInfo=" + encodeURIComponent(JSON.stringify(refundInfo));
  NAVPAGE.toRefundDetails(opts);
}
</script>
<style scoped>
/* pages/mallModule/order/refundList/refundList.wxss */
/* @import "../../../../common/common.wxss"; */

page {
  background: #f1f1f1;
}

.refund-item {
  width: 660rpx;
  margin: 20rpx auto;
  background: #fff;
  margin-bottom: 20rpx;
  padding: 0 20rpx;
  border-radius: 14rpx;
}

.refund-title {
  height: 83rpx;
  font-size: 28rpx;
  line-height: 70rpx;
  display: flex;
  justify-content: space-between;
  border-bottom: 1rpx solid #f1f1f1;
}

.refund-title .name {
  font-size: 28rpx;
  color: #010101;
  display: flex;
  align-items: center;
}

.refund-title .name image {
  width: 38rpx;
  height: 35rpx;
  margin-right: 9rpx;
}

.refund-title .text {
  color: #808080;
}

.color-2DBE1B {
  color: #2DBE1B;
}

.color-FF8105 {
  color: #FF8105;
}

.color-FF3333 {
  color: #FF3333;
}

.refunding {
  color: #f66;
}

.refund-goods {
  padding: 10rpx 0;
  display: flex;
  flex-wrap: wrap;
  width: calc(100%);
  position: relative;
}

.goods-box {
  width: 109rpx;
  height: 109rpx;
  border-radius: 6rpx;
  margin: 29rpx 26rpx 15rpx 0;
}

.goods-box image {
  width: 109rpx;
  height: 109rpx;
  border-radius: 6rpx;
  background: #f1f1f1;
}


.right-point {
  width: 12rpx;
  height: 23rpx;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -12rpx;
}

.refund-reason {
  padding: 2rpx 0 0 0;
}

.refund-reason text {
  font-size: 24rpx;
  color: #454545;
  display: block;
  line-height: 42rpx;
}

.refund-img-box {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 30rpx);
}

.refund-img-box image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 6rpx;
  margin: 10rpx 20rpx 10rpx 0;
  background: #f1f1f1;
}

.refund-time {
  font-size: 26rpx;
  line-height: 82rpx;
  color: #808080;
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
  margin-top: 30%;
  width: 242rpx;
  height: 261rpx;
}

.no-data button {
  color: #009F55;
  border: 1rpx solid #009F55;
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: transparent;
  font-size: 24rpx;
  line-height: 60rpx;
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
  color: #009136;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
}
</style>