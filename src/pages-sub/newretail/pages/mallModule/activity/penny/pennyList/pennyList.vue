<template>
<!--pages/mallModule/activity/penny/pennyList/pennyList.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content-box goods-list" :hidden="state.tabType !== 'LIST'">
  <view class="top-info">
    <image class="top-bg" :src="state.imagesPath.iconPenneryTopBg20190924" mode="widthFix" lazy-load="false"></image>
    <view class="panny-rules" @click="togglePennyRulesPopup">
      <image :src="state.imagesPath.iconPenneryRules" mode="widthFix" lazy-load="false"></image>
    </view>
  </view>
  <view class="store-box" @click="toSelectStore">
    <text>当前门店：{{state.storeInfo.name}}</text>
    <text class="right-icon">▼</text>      
  </view>
  <view class="penny-list">
    <product-item v-for="(item , index) in state.pennyList" :key="id" :product-data="item" :storeId="storeId" @click="toPennyDetail"></product-item>
    <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
    <view class="order-end" :style="state.theme.mainColor" :hidden="!state.noMore">~我也是有底线的~</view>
  </view>
  <view class="no-data" :hidden="state.pennyList.length == 0 ? false : true">
    <image :src="state.imagesPath.imgNoData"></image>
    <button size="mini" :style="state.theme.mainColor + state.theme.borderColor" @click="toHome">随便逛逛</button>
  </view>
</view>
<view class="content-box my-order" :hidden="state.tabType !== 'MY'">
  <view class="order-title">全部订单记录</view>
  <view class="order-list">
    <order-item v-for="(item , index) in state.orderList" :key="id" :orderData="item" @click="toHelpPenny" @share="userShare" @again="doItAgain" @order="toOrderDetails"></order-item>
    <view class="no-data" :hidden="state.orderList.length == 0 ? false : true">
      <image :src="state.imagesPath.imgNoOrders"></image>
    </view>
  </view>
  <view class="order-tips">
    <view class="title">只显示近两周内的抽奖订单</view>
    <view>更多订单可以在“我的订单”中查询</view>
  </view>
  <recommend-list :storeId="storeId"></recommend-list>
</view>
<view class="bottom-info">
  <view :class="state.tabType === 'LIST' ? 'active' : ''" data-type="LIST" @click="clickTab">
    <image :src="state.tabType === 'LIST' ? state.imagesPath.iconPenneryListActive : state.imagesPath.iconPenneryList" mode="widthFix" lazy-load="false"></image>商品列表</view>
  <view :class="state.tabType === 'MY' ? 'active' : ''" data-type="MY" @click="clickTab">
    <image :src="state.tabType === 'MY' ? state.imagesPath.iconPenneryMyActive : state.imagesPath.iconPenneryMy" mode="widthFix" lazy-load="false"></image>我的抽奖</view>
</view>
<popup :show="state.show.pennyRules" position="middle" custom-class="middle" @close="togglePennyRulesPopup">
  <view class="penny-rules-box">
    <view class="penny-rules-popup">
      <view class="title">
        <image class="left-icon" :src="state.imagesPath.iconPeneryLine" mode="widthFix"></image>
        <text>活动规则</text>
        <image class="right-icon" :src="state.imagesPath.iconPeneryLine" mode="widthFix"></image>
      </view>
      <view class="close">
        <image :src="state.imagesPath.iconCloseImg2" @click="togglePennyRulesPopup"></image>
      </view>
      <scroll-view class="rules-content-box" scroll-y="">
        <text>1.购买相关商品，支付页面所示活动价参与抽奖活动，支付完成后邀请规定数量好友帮忙助力即可获得抽奖资格。助力好友越多，获奖的概率越大，助力第1名必中（助力点相同，达成时间最早者中）。</text>
        <text>2.同一个商品活动，每个用户只能参加一次，每天每人最多助力3次；可参加多个购物抽奖活动。</text>
        <text>3.开奖及退款规则如下：</text>
        <text>当活动时间结束后，活动开奖。中奖者奖品将会根据参与抽奖时所填收货地址1-3天内寄出，遇节假日顺延；如果未填收货地址或者所填信息错误导致无法收货，则取消活动中奖资格；开奖前取消订单退款的，中奖资格随之取消。</text>
        <text>4.对于同一商品，同一中奖用户（包括但不限于同一手机号、手机设备等）只能参与一次，否则视为无效。</text>
        <text>5.严禁用户使用任何不正当手段或作弊行为参与本活动。一经发现，美食林有权取消该用户的所有中奖资格，情节严重的，我们将依法保留诉讼权利。</text>
      </scroll-view>
    </view>
  </view>
</popup>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiPennyServiceJs from "@/service/api/newretail/pennyService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import orderItem from '@/pages-sub/newretail/components/penny/order-item/order-item.vue';
import recommendList from '@/pages-sub/newretail/components/recommend/recommend-list-two/recommend-list.vue';
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/mallModule/activity/penny/pennyList/pennyList.js
// const weui = require('../../../../../miniprogram_npm/weui-wxss/index.js')
const pennyService = _apiPennyServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const ANALYSIS = _utilsAnalysisJs;
const ADDRESS = _utilsAddressJs;
const NAVPAGE = _utilsNavPageJs;
const UTILS = _utilsUtilsJs;
const THEME = _utilsThemeManagerJs;

//获取应用实例
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //  处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')';
  } else {
    return sColor;
  }
};
const state = reactive({
  navigationBarTitle: "购物抽奖",
  imagesPath: IMGAGESPATH,
  theme: THEME,
  tabType: "LIST",
  // LIST, MY
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    pennyRules: false
  },
  pennyList: [],
  orderList: [],
  mobile: '',
  page: 1,
  pageSize: 10,
  pageCount: 1,
  orderPage: 1,
  orderPageCount: 1,
  noMore: false,
  loading: false,
  storeInfo: {
    name: "未获取到当前门店"
  }
});
let customData = {
  isQueryPennyActivity: false
};
function initPage() {
  const self = this;
  state.storeId = app.globalData.storeInfo.id;
  state.storeInfo = app.globalData.storeInfo;
  if (state.tabType !== "MY") {
    queryPennyActivity();
  } else {
    // 查询订单
    queryOrderList(state.orderPage);
  }
}
onLoad(function (options) {
  uni.hideShareMenu();
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
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
  state.theme = {
    color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + app.globalData.uiconfig.themeColor + ';' : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background: ' + app.globalData.uiconfig.themeColor + ';' : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';' : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" ? 'background: linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' : "background: linear-gradient(-270deg, #FF9F43, #F13327);",
    mainColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : "border-color:rgba(255,159,67, 0.4);",
    mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) : 'rgba(255,159,67, 0.2)',
    BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' : "background-color:rgba(255,159,67, 0.1);"
  };
});
onReady(function () {});
onShow(function () {
  if (app.globalData.storeInfo && app.globalData.storeInfo.id !== state.storeId) {
    initPage(); // 初始化页面内容
  }
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {
  if (state.tabType !== "MY") {
    uni.stopPullDownRefresh();
  } else {
    state.orderList = [];
    state.mobile = '';
    state.orderPage = 1;
    state.orderPageCount = 1;
    state.noMore = false;
    onLoad();
  }
  setTimeout(() => {
    // 特别处理iOS下有loading时下拉刷新秒回弹的问题
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true;
    if (state.tabType !== "MY") {
      let page = state.page;
      ++page;
      // 查询活动
      // this.queryPennyActivity();
    } else {
      let page = state.orderPage;
      ++page;
      // 查询活动
      // 查询订单
      queryOrderList(page);
    }
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.tabType !== "MY") {
      if (state.pennyList.length > 0) {
        state.noMore = true;
      } else {
        UTILS.showToast("没有更多数据~");
      }
    } else {
      if (state.orderList.length > 0) {
        state.noMore = true;
      } else {
        UTILS.showToast("没有更多数据~");
      }
    }
  }
});
onShareAppMessage(function (res) {
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res);
    const instanceId = res.target.dataset.id;
    let imgUrl = "";
    let name = "";
    state.orderList.forEach(item => {
      if (item.id === instanceId) {
        imgUrl = item.shareImageUrl;
        name = item.productName;
      }
    });
    return {
      title: '麻烦点一下，只差一个人就拿到' + name + '了～',
      path: '/pages-sub/newretail/pages/mallModule/activity/penny/helpPenny/helpPenny?instanceId=' + instanceId,
      imageUrl: imgUrl,
      success(e) {
        uni.showShareMenu({
          withShareTicket: true
        });
      }
    };
  }
});
function toggleBargainRulesPopup() {
  toggle('middle');
}
function togglePennyRulesPopup() {
  toggle('pennyRules');
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function clickTab(e) {
  state.tabType = e.currentTarget.dataset.type;
  if (e.currentTarget.dataset.type === "MY") {
    state.orderPage = 1;
    state.orderPageCount = 1;
    queryOrderList(1);
  } else {
    queryPennyActivity();
  }
}
function queryPennyActivity() {
  const that = this;
  pennyService.getOnline().then(res => {
    if (res && res.length >= 0) {
      let tempPennyList = [];
      res.forEach(item => {
        tempPennyList.push({
          ...item
        });
      });
      state.pennyList = tempPennyList;
    }
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
function queryOrderList(page) {
  if (!app.globalData.userInfo && !app.globalData.userInfo.member) {
    // 没有会员信息
    return;
  }
  const that = this;
  let date = new UTILS.ResponseDate();
  let now = UTILS.formatTime(date);
  let twoWeeksAgo = addDay(new UTILS.ResponseDate().getTime(), -14);
  let twoWeeksAgoDate = UTILS.formatTime(twoWeeksAgo);
  let startDate = twoWeeksAgoDate.replace(/\//g, '-');
  let endDate = now.replace(/\//g, '-');
  const postData = {
    page: page,
    pageSize: 10,
    memberIdEquals: app.globalData.userInfo.member.id,
    startDate: startDate,
    endDate: endDate,
    statusIn: ["CREATE", "PRIZED", "NOPRIZE"],
    searchCount: true
  };
  pennyService.queryInstance(postData).then(res => {
    if (res && res.records && res.records.length >= 0) {
      let tempOrderList = state.orderList;
      if (page === 1) {
        tempOrderList = [];
      }
      res.records.forEach(item => {
        tempOrderList.push(item);
      });
      let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
      state.orderPage = res.page;
      state.orderPageCount = pageCount;
      state.orderList = tempOrderList;
    }
    if (state.loading) {
      state.loading = false;
    }
  }).catch(err => {
    console.log(err.message);
    UTILS.showToast(err.message);
    if (state.loading) {
      state.loading = false;
    }
  });
}
function addDay(curDate, days) {
  return new Date((curDate / 1000 + 86400 * days) * 1000);
}
function toHome() {
  NAVPAGE.toHome();
}
function toPennyDetail(e) {
  if (!app.globalData.userInfo || !app.globalData.userInfo.member) {
    NAVPAGE.toAuthorize();
    return;
  }
  const opts = "?id=" + e.detail.id;
  const postData = {
    page: 1,
    pageSize: 0,
    activityIdEquals: e.detail.id,
    memberIdEquals: app.globalData.userInfo.member.id,
    statusIn: ["CREATE", "PRIZED", "NOPRIZE"],
    searchCount: true
  };
  pennyService.queryInstance(postData).then(res => {
    if (res && res.records && res.records.length >= 0) {
      const data = res.records[0];
      const opts = "?instanceId=" + data.id;
      NAVPAGE.toHelpPenny(opts);
    } else {
      NAVPAGE.toPennyDetail(opts);
    }
  }).catch(err => {
    console.log(err.message);
    NAVPAGE.toPennyDetail(opts);
  });
}
function toHelpPenny(e) {
  const opts = "?instanceId=" + e.detail.id;
  NAVPAGE.toHelpPenny(opts);
}
function userShare(e) {
  instanceId = e.detail.id;
}
function doItAgain(e) {
  state.tabType = "LIST";
  queryPennyActivity();
}
function toOrderDetails(e) {
  const opts = "?orderId=" + e.detail.id;
  NAVPAGE.toOrderDetails(opts);
}
function toSelectStore() {
  NAVPAGE.toSelectStore();
}
</script>
<style scoped>
/* pages/mallModule/activity/penny/pennyList/pennyList.wxss */

page {
  padding-bottom: 108rpx;
}

.top-info {
  width: 750prx;
  height: 361rpx;
  position: relative;
}

.top-info .top-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.panny-rules {
  width: 74rpx;
  height: 36rpx;
  position: absolute;
  right: 0;
  top: 13rpx;
}

.panny-rules image {
  width: 74rpx;
  height: 36rpx;
}

.goods-list {
  background: #f4f4f4;
  min-height: calc(100vh - 108rpx);
}

.penny-list {
  padding: 18rpx 19rpx;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}

.bottom-info {
  width: 100%;
  height: 98rpx;
  background: #fff;
  font-size: 28rpx;
  line-height: 98rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #9c9c9c;
  position: fixed;
  bottom: 0;
  left: 0;
}

.bottom-info view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-info view.active {
  color: #e02e24;
}

.bottom-info view image {
  width: 30rpx;
  height: 30rpx;
  margin-right: 12rpx;
}

/* 规则弹窗 */

.penny-rules-box {
  padding: 30rpx;
}

.penny-rules-popup {
  width: 500rpx;
  padding: 24rpx 40rpx;
  background: #fff;
  color: #626262;
  border-radius: 16rpx;
  font-size: 28rpx;
  line-height: 45rpx;
  position: relative;
}

.penny-rules-popup .title {
  font-size: 32rpx;
  line-height: 48rpx;
  width: 100%;
  text-align: center;
  margin-bottom: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #eb3728;
}

.penny-rules-popup .title image {
  width: 166rpx;
  height: 4rpx;
}

.penny-rules-popup .title image.left-icon {
  transform: rotate(180deg);
  margin-right: 18rpx;
}

.penny-rules-popup .title image.right-icon {
  margin-left: 18rpx;
}

.penny-rules-popup text {
  display: block;
  margin-bottom: 12rpx;
}

.penny-rules-popup .close {
  width: 58rpx;
  height: 58rpx;
  position: absolute;
  right: -29rpx;
  top: -29rpx;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.penny-rules-popup .close image {
  width: 40rpx;
  height: 40rpx;
}

.rules-content-box {
  height: 580rpx;
}

.my-order {
  background: #f8f6f9;
  height: 100%;
}

.order-title {
  font-size: 30rpx;
  height: 72rpx;
  line-height: 72rpx;
  padding-left: 26rpx;
  color: #535459;
}

.my-order .order-tips {
  font-size: 24rpx;
  line-height: 48rpx;
  color: #bababa;
  padding-top: 21rpx;
  text-align: center;
}

.my-order .order-tips .title {
  font-size: 28rpx;
  line-height: 38rpx;
  color: #8d8d8d;
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
  border: 1rpx solid;
  margin-top: 50rpx;
  width: 202rpx;
  height: 60rpx;
  background: #ffffff;
}

.loading-btn {
  color: #454545;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  width: 100%;
  background: #ffffff;
  border-radius: 0
}

.loading-btn::after {
  border: 0;
}

.order-end {
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
  width: 100%;
}

.button-hover {
  background: #ffffff !important;
}

.store-box {
  height: 48rpx;
  padding: 14rpx 0 17rpx 0;
  font-size: 28rpx;
  line-height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.store-box .right-icon {
  font-size: 24rpx;
  color: #2F2F2F;
  margin-left: 6rpx;
}
</style>