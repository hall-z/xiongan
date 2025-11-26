<template>
<!--pages/mallModule/activity/lottery/myLottery/myLottery.wxml-->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="content-box my-order">
  <view class="order-title">全部订单记录</view>
  <view class="order-list">
    <lottery-order-item v-for="(item , index) in state.orderList" :key="id" :orderData="item" @click="toHelpLottery" @share="userShare" @again="doItAgain" @order="toOrderDetails"></lottery-order-item>
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

</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiLotteryServiceJs from "@/service/api/newretail/lotteryService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import lotteryOrderItem from '@/pages-sub/newretail/components/penny/lottery-order-item/lottery-order-item.vue';
import recommendList from '@/pages-sub/newretail/components/recommend/recommend-list-two/recommend-list.vue';
const app = getApp();

// pages/mallModule/activity/lottery/myLottery/myLottery.js
const lotteryService = _apiLotteryServiceJs;
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
  navigationBarTitle: "我的抽奖",
  imagesPath: IMGAGESPATH,
  theme: THEME,
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    pennyRules: false
  },
  orderList: [],
  mobile: '',
  page: 1,
  pageSize: 10,
  pageCount: 1,
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
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    queryOrderList(state.page);
  } else {
    uni.showModal({
      title: '温馨提示',
      content: '您还不是会员，请绑定手机号成为会员~',
      success(res) {
        if (res.confirm) {
          NAVPAGE.toAuthorize();
        } else if (res.cancel) {}
      }
    });
  }
}
onLoad(function (options) {
  uni.hideShareMenu();
  pageOnLoad = true;
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
  that.setData({
    theme: {
      color: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor') || '#FF9F43',
      mainColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + app.globalData.uiconfig.themeColor + ';' : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
      mainBgColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background: ' + app.globalData.uiconfig.themeColor + ';' : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
      borderColor: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';' : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
      mainBgGradient: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null && app.globalData.uiconfig.themeColor !== "#FF9F43" ? 'background: linear-gradient(-270deg, ' + app.globalData.uiconfig.themeColor + ', ' + app.globalData.uiconfig.themeColor + ');' : "background: linear-gradient(-270deg, #FF9F43, #F13327);",
      mainColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : 'color:rgba(255,159,67, 0.4);',
      borderColorRgb: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';' : "border-color:rgba(255,159,67, 0.4);",
      mainColorRgb02: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? colorRgba(app.globalData.uiconfig.themeColor, 0.4) : 'rgba(255,159,67, 0.2)',
      BgColorRgb01: app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';' : "background-color:rgba(255,159,67, 0.1);"
    }
  });
});
onReady(function () {});
onShow(function () {
  if (!pageOnLoad) {
    initPage(); // 初始化页面内容
  }
});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {
  state.orderList = [];
  state.mobile = '';
  state.page = 1;
  state.pageCount = 1;
  state.noMore = false;
  onLoad(options);
  setTimeout(() => {
    // 特别处理iOS下有loading时下拉刷新秒回弹的问题
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true;
    let page = state.page;
    ++page;
    // 查询活动
    // 查询订单
    queryOrderList(page);
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.orderList.length > 0) {
      state.noMore = true;
    } else {
      UTILS.showToast("没有更多数据~");
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
        name = item.activityName;
      }
    });
    return {
      title: '麻烦点一下，只差一个人就拿到' + name + '了～',
      path: '/pages-sub/newretail/pages/mallModule/activity/lottery/helpLottery/helpLottery?instanceId=' + instanceId,
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
    statusIn: ["JOINED", "PRIZED", "NOPRIZED"],
    searchCount: true
  };
  lotteryService.queryInstance(postData).then(res => {
    if (res && res.records && res.records.length >= 0) {
      let tempOrderList = state.orderList;
      if (page === 1) {
        tempOrderList = [];
      }
      res.records.forEach(item => {
        tempOrderList.push(item);
      });
      let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
      state.page = res.page;
      state.pageCount = pageCount;
      state.orderList = tempOrderList;
    }
    if (state.loading) {
      state.loading = false;
    }
    if (pageOnLoad) {
      pageOnLoad = false;
    }
  }).catch(err => {
    console.log(err.message);
    UTILS.showToast(err.message);
    if (state.loading) {
      state.loading = false;
    }
    if (pageOnLoad) {
      pageOnLoad = false;
    }
  });
}
function addDay(curDate, days) {
  return new Date((curDate / 1000 + 86400 * days) * 1000);
}
function toHome() {
  NAVPAGE.toHome();
}
function toHelpLottery(e) {
  const opts = "?instanceId=" + e.detail.id;
  NAVPAGE.toHelpLottery(opts);
}
function userShare(e) {
  instanceId = e.detail.id;
}
function doItAgain(e) {
  let currentPages = getCurrentPages();
  let pagePath = "";
  if (currentPages.length > 1) {
    let _this = currentPages[currentPages.length - 2];
    pagePath = _this.route;
    pagePath.indexOf('/') != 0 && (pagePath = '/' + pagePath);
  }
  if (pagePath === '/pages-sub/newretail/pages/mallModule/activity/lottery/lotteryIndex/lotteryIndex') {
    uni.navigateBack({
      delta: 1
    });
  } else {
    NAVPAGE.toLotteryIndex();
  }
}
function toOrderDetails(e) {
  // 订单详情
}
function toSelectStore() {
  NAVPAGE.toSelectStore();
}
</script>
<style scoped>
/* pages/mallModule/activity/lottery/myLottery/myLottery.wxss */

page {
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
  background: #fff;
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
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
  width: 100%;
}

/* .button-hover {
  background: #fff !important;
} */

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
  color: #2f2f2f;
  margin-left: 6rpx;
}

</style>