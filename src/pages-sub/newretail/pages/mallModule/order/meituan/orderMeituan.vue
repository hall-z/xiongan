<template>
<!-- pages/mallModule/order/order/order.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<!--  -->
<view class="order-box">
  <scroll-view class="top-tab" scroll-x="" :style="'width: 100%;' + (state.showOfflineOrders ? 'top:' + navHeightTop + 'rpx' : 'top:' + navHeight + 'px')" :hidden="state.orderTab == 1">
    <view :class="'tab-item ' + (state.tabSelected == idx ? 'active' : '')" :style="'color: ' + (state.tabSelected == idx ? state.themeColor : '') + ';border-color: ' + (state.tabSelected == idx ? state.themeColor : '') + ';'" v-for="(item , idx) in state.tabType" :data-idx="idx" :key="index" @click="switchTab">{{item}}</view>
  </scroll-view>
  <view :class="'order-list ' + (state.showOfflineOrders ? 'show-offline-orders' : '')" :hidden="state.orderTab == 1">
    <!-- 全部订单 -->
    <view class="order-content">
      <view class="order-item-box" v-for="(item , index) in state.allOrders" :key="id">
        <!-- <!--<template is="orderItem" data="{{item}}"></template>--> -->
            <view class="order-item">
                <view class="item-top">
                    <text class="order-num">美团订单号:{{item.sqtBizOrderId}}</text>
                    <text v-if="item.status == '待付款' || item.status == '待付尾款'" class="order-status" style="color:#ff1818">{{item.status}}</text>
                    <text v-if="item.status != '待付款' && item.status != '待付尾款' && item.status != '待开奖'" class="order-status" style="color:#f3b610">{{item.status}}</text>    
                    <text v-if="item.status == '已付尾款'" class="order-status" :style="'color: ' + state.themeColor">{{item.status}}</text>
                    <text v-if="item.status == '待开奖'" class="order-status" style="color:#ff4a1d">{{item.status}}</text>
                </view>
                <scroll-view class="item-middle" scroll-x="" style="width: 100%">
                    <view class="goods-item-imgA">
                        <view>
                            商品名称： {{item.goodsName}}
                        </view>
                    </view>
                </scroll-view>
                <view class="item-total">
                    合计:
                    <text class="total-price" :hidden="item.tradeAmount && item.tradeAmount !== undefined ? false : true">￥{{item.tradeAmount}} </text>
                </view>
            </view>
      </view>
      <view class="no-data" :hidden="state.allOrders.length == 0 ? false : true">
        <image :src="state.imagesPath.imgNoOrders"></image>
      </view>
    </view>
  </view>
  <view class="offline-order-list" :hidden="state.orderTab == 0">
    <!-- 线下订单 -->
    <view class="order-item-box" v-for="(item , index) in state.offlineOrders" :key="id">
      <!--<template is="offlineOrderItem" :data="item"></template>-->
    </view>
    <view class="no-data" :hidden="state.offlineOrders.length == 0 ? false : true">
      <image :src="state.imagesPath.imgNoOrders"></image>
    </view>
  </view>
  
  <button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
  <view class="order-end" :style="state.theme.mainColor" :hidden="!state.noMore">~我也是有底线的~</view>
</view>
<image class="movable-view" v-if="state.homeBack" :src="state.imagesPath.toHome" @click="toHome"></image>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiRequestJs from "@/service/api/newretail/request";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onPageScroll } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/order/order/order.js
const orderService = _apiOrderServiceJs;
const request = _apiRequestJs;
const util = _utilsUtilsJs;
const selfA = _utilsSelfJs;
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
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
  isOpenCustomerService: false,
  navigationBarTitle: "我的订单",
  imagesPath: IMGAGESPATH,
  tabType: ["全部", '待支付', '支付成功', '支付失败', '支付超时关单', '部分退款', '全额退款'],
  //全部是固定都有的
  tabSelected: 0,
  orderTab: 0,
  allOrders: [],
  unPayedTailOrders: [],
  swiperHeight: 0,
  serviceTel: '',
  type: 'normal',
  pageIndex: 1,
  onlineCount: 1,
  pageSize: 50,
  pageCount: 1,
  allOrdersList: [],
  noMore: false,
  loading: false,
  homeBack: false,
  //要显示的订单状态
  orderStatusEntrance: [],
  // 线下订单
  offlineOrders: [],
  page: 1,
  showOfflineOrders: false,
  order: null,
  // 订单数据 
  payType: "normal",
  // normal,payTail
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  theme: themeManager,
  floorstatus: false,
  afterShow: false,
  // 售后弹层显示隐藏
  afteRorderId: '' // 订单id
});
onLoad(function (options) {
  uni.hideShareMenu();
  autoCancelPeriod = 0;
  const navHeight = app.globalData.navHeight;
  if (app.globalData.uiconfig) {
    state.isOpenCustomerService = app.globalData.uiconfig.isOpenCustomerService;
  }
  state.serviceTel = app.globalData.servicePhone;
  state.navHeight = navHeight;
  state.navHeightTop = navHeight * 750 / app.globalData.systemInfo.windowWidth + 102;
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
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  getMemberUserInfo();
  if (options.selected) {
    state.tabSelected = parseInt(options.selected);
  }
  if (options.type) {
    state.type = options.type;
  }
  let pageStack = getCurrentPages();
  if (pageStack.length === 1) {
    state.homeBack = true;
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  generateTabType();
});
function generateTabType() {
  const that = this;
  console.log(app.globalData.uiconfig.orderStatusEntrance);
  // && value.orderEntranceStatus != 'WAITSHIPPED'
  // && value.orderEntranceStatus != 'CREATED'
  state.orderStatusEntrance = [{
    name: '待支付',
    orderEntranceStatus: 'CREATED'
  }, {
    name: '支付成功',
    orderEntranceStatus: 'PAID'
  }, {
    name: '支付失败',
    orderEntranceStatus: 'PAYFAILED'
  }, {
    name: '支付超时关单',
    orderEntranceStatus: 'CLOSED'
  }, {
    name: '部分退款',
    orderEntranceStatus: 'REFUND_PARTIAL'
  }, {
    name: '全额退款',
    orderEntranceStatus: 'REFUND_ALL'
  }];
  // this.data.orderStatusEntrance = app.globalData.uiconfig.orderStatusEntrance;
  //匹配状态对应的文字
  state.tabType = state.tabType;
}
onReady(function () {
  let that = this;
  uni.getSystemInfo({
    success: function (res) {
      console.log(res);
      state.swiperHeight = res.windowHeight + 10;
    }
  });
});
onShow(function () {
  const that = this;
  const login = checkAuth();
  if (login) {
    if (app.globalData.userInfo.member) {
      getOrderData(state.tabSelected);
    } else {
      uni.showToast({
        title: '您还不是会员，请先绑定手机号码成为会员',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    console.log("56");
  }
  if (app.globalData.uiconfig) {
    state.isOpenCustomerService = app.globalData.uiconfig.isOpenCustomerService;
  }
});
onHide(function () {
  uni.hideLoading();
});
onUnload(function () {
  uni.hideLoading();
});
onPullDownRefresh(function () {
  state.allOrders = [];
  state.pageIndex = 1;
  state.onlineCount = 1;
  state.noMore = false;
  getOrderData(state.tabSelected);
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});
onReachBottom(function () {
  if (state.pageIndex < state.onlineCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true;
    let page = state.pageIndex;
    ++page;
    loadOrderList(page);
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.allOrders.length > 0) {
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
onShareAppMessage(function (res) {
  const that = this;
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let imgUrl = null;
  let storeId = '';
  if (app.globalData.storeInfo) {
    storeId = app.globalData.storeInfo.id;
  }
  return {
    title: app.globalData.systemConfigure.miniprogramSharingName,
    path: '/pages-sub/newretail/pages/mallModule/index/index/index?storeId=' + storeId,
    imageUrl: imgUrl,
    success(e) {
      uni.showShareMenu({
        withShareTicket: true
      });
    }
  };
});
function checkAuth() {
  try {
    if (!app.globalData.userInfo) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    // Do something when catch error
  }
}
function getMemberUserInfo() {
  if (!app.globalData.userInfo) {
    uni.showToast({
      title: "您还未授权，请登陆授权",
      icon: 'none',
      duration: 2000
    });
  } else {}
}
onPageScroll(function (e) {
  if (e.scrollTop > 0) {
    state.floorstatus = true;
  }
});
function switchTab(e) {
  //如果需要加载数据
  state.tabSelected = e.currentTarget.dataset.idx;
  state.loading = false;
  state.noMore = false;
  state.allOrders = [];
  const login = checkAuth();
  if (login) {
    getOrderData(e.currentTarget.dataset.idx);
  }
  if (uni.pageScrollTo && state.floorstatus) {
    uni.pageScrollTo({
      scrollTop: 0
    });
  }
}
function getOrderData(tabSelected) {
  const that = this;
  state.pageIndex = 1;
  state.loading = false;
  if (autoCancelPeriod) {
    let tempData = queryOrderList(1, 50);
    Promise.all([tempData]).then(res => {
      handleOrderData(res);
    });
  } else {
    orderService.getAutoCancelPeriod().then(res => {
      autoCancelPeriod = parseFloat(res);
      let tempData = queryOrderList(1, 50);
      return Promise.all([tempData]);
    }).then(res => {
      handleOrderData(res);
    }).catch(e => {
      uni.showToast({
        title: e.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
  function handleOrderData(res) {
    console.log(res[0]);
    const tabNum = tabSelected;
    if (res[0].length) {
      state.allOrders = res[0];
    } else {
      state.allOrders = [];
    }
  }
}
function queryOrderList(page, pageSize) {
  const that = this;
  const tabNum = state.tabSelected;
  let status = '';
  if (tabNum == '0') {
    status = '';
  } else {
    status = state.orderStatusEntrance[tabNum - 1].orderEntranceStatus;
  }
  let postData = {
    page: page,
    pageSize: pageSize,
    statusEquals: status,
    searchCount: true
  };
  let tempList = [];
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    postData.staffPhone = app.globalData.userInfo.member.mobile;
    tempList = orderService.mtOrderQuery(postData).then(res => {
      console.log(res);
      let tempOrderList = res.records;
      tempOrderList.forEach(item => {
        item.status = handleOrderStatus(item.status);
      });
      let pageCount = parseInt(res.recordCount / res.pageSize) + 1;
      state.pageIndex = res.page;
      state.onlineCount = pageCount;
      return tempOrderList;
    }).catch(e => {
      util.showToast(e.message);
    });
  } else {}
  return tempList;
}
function handleOrderStatus(status) {
  if (status === "CREATED") {
    return "待支付";
  } else if (status === "PAID") {
    return "支付成功";
  } else if (status === "PAYFAILED") {
    return "支付失败";
  } else if (status === "CLOSED") {
    return "支付超时关单";
  } else if (status === "REFUND_PARTIAL") {
    return "部分退款";
  } else if (status === "REFUND_ALL") {
    return "全额退款";
  } else {
    return status;
  }
}
function toHome() {
  NAVPAGE.toHome();
}
function loadOrderList(page) {
  const that = this;
  const pageSize = state.pageSize;
  const tabNum = state.tabSelected;
  state.loading = true;
  let tempData = queryOrderList(page, pageSize);
  Promise.all([tempData]).then(res => {
    // if (res[0].length > 0) {
    const allOrders = state.allOrders;
    console.log(allOrders);
    let tempArray = allOrders.concat(res[0]);
    state.allOrders = tempArray;
    state.loading = false;
  });
}
function handleSwitchOrder(e) {
  const that = this;
  // 线上订单
  state.orderTab = e.currentTarget.dataset.idx;
  state.pageIndex = 1;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      getOrderData(state.tabSelected);
    } else {
      uni.showToast({
        title: '您还不是会员，请先绑定手机号码成为会员',
        icon: 'none',
        duration: 2000
      });
    }
  }
}
</script>
<style scoped>
/* pages/mallModule/order/order/order.wxss */
/* @import "./orderItem/orderItem.wxss"; */
page {
    background-color: #f1f3f6;
    height: 100%;
    width: 100%;
}


.order-box {
    width: 100%;
    height: 100%;
    /* overflow: scroll; */
}

.movable-view {
    width: 120rpx;
    height: 120rpx;
    position: fixed;
    right: 0;
    bottom: 240rpx;
}

.order-tab-box {
    width: 100%;
    padding: 20rpx 0;
    display: flex;
    justify-content: center;
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
}

.order-tab-box .order-tab-item {
    min-width: 240rpx;
    max-width: 300rpx;
    height: 60rpx;
    font-size: 30rpx;
    line-height: 60rpx;
    color: #009f55;
    text-align: center;
    margin: 0;
    border: 2rpx solid #009f55;
    border-left: 0;
    border-right: 0;
}

.order-tab-box .order-tab-item:first-of-type {
    border-top-left-radius: 6rpx;
    border-bottom-left-radius: 6rpx;
    border-left: 2rpx solid #009f55;
}

.order-tab-box .order-tab-item:last-of-type {
    border-top-right-radius: 6rpx;
    border-bottom-right-radius: 6rpx;
    border-right: 2rpx solid #009f55;
}

.order-tab-box .active {
    background: #009f55;
    color: #fff;
}

.top-tab {
    /* overflow: hidden;
  width: 100%; */
    height: 80rpx;
    white-space: nowrap;
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
}

.top-tab.show-offline-orders {
    top: 104rpx;
}

.tab-item {
    display: inline-block;
    width: 24%;
    height: 100%;
    border-bottom: 4rpx solid transparent;
    text-align: center;
    line-height: 80rpx;
    font-size: 28rpx;
    box-sizing: border-box;
}

.tab-item.active {
    color: #009f55;
    border-color: #009f55;
}

.order-list {
    margin-top: 100rpx;
    min-height: calc(100% - 100rpx);
}

.order-list.show-offline-orders {
    margin-top: 204rpx;
    min-height: calc(100% - 204rpx);
}

/* 线下订单 */
.offline-order-list {
    margin-top: 124rpx;
    min-height: calc(100% - 124rpx);
}

.swiper {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: hidden;
    display: block;
    margin-top: 80rpx;
}

.swiper swiper-item scroll-view {
    white-space: nowrap;
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

.loading-btn {
    color: #454545;
    font-size: 28rpx;
    line-height: 80rpx;
    height: 80rpx;
    width: 100%;
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
.mantle {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(10, 10, 10,.6);
    z-index: 999;
}
.shouhouBox {
    width: 100%;
    height: 450rpx;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    padding: 0 30rpx;
    font-size: 31rpx;
    font-weight: 500;
    color: #404040;
    border-radius: 25rpx 25rpx;
    box-sizing: border-box;
}
.shouhouBox>text {
    display: inline-block;
    width: 100%;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 36rpx;
}
.shouhouBox-active {
    width: 100%;
    height: 350rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.active-a {
    position: relative;
    width: 100%;
    font-size: 27rpx;
}

.active-a>view>image {
    width: 40rpx;
    height: 40rpx;
}
.active-one {
    height: 40rpx;
    line-height: 40rpx;
    display: flex;
}
.active-one text {
    margin-left: 20rpx;
}
.Noreceived,.received {
    width: 100%;
    padding-left: 60rpx;
    box-sizing: border-box;
    color: #9AA6BA;
}
.arrow {
    width: 15rpx;
    height: 40rpx;
    position: absolute;
    top: 50%;
    right: 30rpx;
    transform: translateY(-50%);
}
</style>