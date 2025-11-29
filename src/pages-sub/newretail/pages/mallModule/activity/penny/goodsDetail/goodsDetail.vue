<template>
<!--pages/mallModule/activity/penny/goodsDetail/goodsDetail.wxml-->
<view>
<!-- <navigationBar title="{{navigationBarTitle}}"></navigationBar> -->
<navigationBar id="navigation" :title="state.productPlacedAtTheTop ? ' ' : state.navigationBarTitle" :background="state.productPlacedAtTheTop ? 'color: rgba(0,0,0,0)' : ''" :style="state.productPlacedAtTheTop ? 'position: absolute;top: 0;' : ''"></navigationBar>  
<!-- 商品图片轮播 -->
<view class="swiperContainer" :id="'products-' + goodsId">
  <swiper class="swiper" @change="swiperChange" autoplay="true" interval="5000" circular="true">
    <view v-for="(item , index) in state.productPictures" :key="index">
      <swiper-item class="swiper-item">
        <image :src="item.url" class="slide-image" width="355" height="150"></image>
      </swiper-item>
    </view>
  </swiper>
  <view class="imageCount">{{state.current}}/{{state.productPictures.length}}</view>
  <view class="panny-rules" @click="togglePennyRulesPopup">
    <image :src="state.imagesPath.iconPenneryRules" mode="widthFix" lazy-load="false"></image>
  </view>
</view>
<!-- 购物抽奖 -->
<view class="penny-box" :style="state.theme.mainBgGradient">
  <view class="price">
    <view class="activity-price">￥
      <text>{{state.pennyDetail.activityPrice ? filtToFix(state.pennyDetail.actualPrice) : ""}}</text>
    </view>
    <view class="old-price">{{"￥" + filtToFix(state.pennyDetail.activityPrice)}} </view>
  </view>
  <view class="number">共抽{{state.pennyDetail.prizeQuantity}}件</view>
</view>
<!-- 商品名称价格等 -->
<view class="goods-info-box">
  <view class="goods-name">{{state.pennyDetail.name}}</view>
  <view class="goods-progress">
    <view class="progress-info">
      <view>活动进度
        <text>{{state.progress}}%</text>
      </view>
      <view v-if="state.time.day !== '00' && state.time.day !== 0">仅剩{{state.time.day}}天开奖</view>
      <view v-else-if="state.time.hou !== '00' && state.time.hou !== 0">仅剩{{state.time.hou}}小时开奖</view>
      <view v-else-if="state.time.min !== '00' && state.time.min !== 0">仅剩{{state.time.min}}分钟开奖</view>
      <view v-else-if="state.time.sec !== '00' && state.time.sec !== 0">仅剩{{state.time.sec}}秒开奖</view>
      <view v-else>已开奖</view>
    </view>
    <progress :percent="state.progress" active="" border-radius="12" :activeColor="state.theme.color" backgroundColor="#E4E4E4"></progress>
  </view>
</view>
<!-- 图文详情 -->
<view class="goods-imgtext" :hidden="state.productDetails.length === 0 ? true : false">
  <text>商品详情</text>
  <image v-for="(item , index) in state.productDetails" :key="index" :src="item.url" mode="widthFix"></image>
</view>
<view class="button-box">
  <button v-if="balance === 0" class="authorization">
    <text class="look">当前门店没有库存，请切换门店</text>
  </button>
  <button v-else-if="!state.hasUserInfo" class="authorization" @click="getUserInfo">
    <!-- <text class="left">{{pennyDetail.activityPrice ? filtToFix(pennyDetail.activityPrice) + "元" : ""}}参与抽奖</text> -->
    <text class="right">{{state.pennyDetail.activityPrice ? filtToFix(state.pennyDetail.actualPrice) + "元" : ""}}马上抢</text>
  </button>
  <button v-else-if="state.hasPenny" class="authorization" @click="toMyHelpPennyDetails">
    <text class="look">查看我的抽奖</text>
  </button>
  <button v-else-if="state.userNoCoupon" class="authorization" @click="toPennyList">
    <text class="look">去抢其他好货</text>
  </button>
  <button v-else class="authorization" @click="confirmInformation">
    <text class="look">{{state.pennyDetail.activityPrice ? filtToFix(state.pennyDetail.actualPrice) + "元" : ""}}马上抢</text>
  </button>
</view>
<!-- 付款超时弹窗 -->
<popup :show="state.show.timeOut" position="middle" custom-class="middle" @close="toggleTimeOutPopup">
  <view class="popup-content">
    <view class="popup-content-box">
      <image :src="state.imagesPath.iconNetworkTimeout" mode="widthFix"></image>
    </view>
    <view class="button" :style="state.theme.mainBgColor" @click="toggleTimeOutPopup">我知道了</view>
  </view>
</popup>
<popup :show="state.show.pennyRules" position="middle" custom-class="middle" @close="togglePennyRulesPopup">
  <view class="penny-rules-box">
    <view class="penny-rules-popup">
      <view class="title">
        <image class="left-icon" :src="state.imagesPath.iconPeneryLine"></image>
        <text>活动规则</text>
        <image class="right-icon" :src="state.imagesPath.iconPeneryLine"></image>
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
<!-- 用户没有获得券弹窗 -->
<popup :show="state.show.unCoupon" position="middle" custom-class="middle" @close="toggleUnCouponPopup">
  <view class="penny-prompt-popup">
    <view class="title">温馨提示</view>
    <view class="close">
      <image :src="state.imagesPath.iconCloseImg2" @click="toggleUnCouponPopup"></image>
    </view>
    <view class="prompt-content">该活动参与火爆，排队中，建议您参与其他活动！</view>
    <view class="prompt-button-box" @click="toPennyList">去抢其他好货</view>
  </view>
</popup>
<!-- 选择自提时间下单弹窗 -->
<popup :show="state.show.selfTime" position="bottom" custom-class="bottom" @close="toggleSelfTimePopup">
  <view class="penny-selfTime-popup">
    <view class="shipping-method">
      <view class="title">确认信息</view>
      <view class="selftake-box">
        <picker mode="multiSelector" @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange" :value="state.multiIndex" :range="state.multiArray">
          <view class="select-item picker time-picker">
            <view>
              <image class="left-icon" :src="state.imagesPath.iconBargainTime"></image>
              <text class="color-454545"> 选择自提时间</text>
            </view>
            <view class="color-009F55">
              {{selfTimeDate}} {{state.multiArray[1][state.multiIndex[1]]}}
              <image class="right-point" :src="state.imagesPath.iconBargainRight"></image>
            </view>
          </view>
        </picker>
        <view class="select-item select-store" @click="toSelectStore">
          <view>
            <image class="left-icon" :src="state.imagesPath.iconBargainStore"></image>
            <text class="color-454545"> 提货门店</text>
          </view>
          <view>
            {{storeInfo.name}}
            <image class="right-point" :src="state.imagesPath.iconBargainRight"></image>
          </view>
        </view>
      </view>
    </view>
    <view class="selfTime-button-box">
      <button v-if="balance === 0" class="authorization" @click="toPennyList">
        <text class="look">当前门店没有库存，请切换门店</text>
      </button>
      <button v-else-if="!state.hasUserInfo" class="authorization" @click="getUserInfo">
        <!-- <text class="left">{{pennyDetail.activityPrice ? filtToFix(pennyDetail.activityPrice) + "元" : ""}}参与抽奖</text> -->
        <text class="right">{{state.pennyDetail.activityPrice ? filtToFix(state.pennyDetail.actualPrice) + "元" : ""}}马上抢</text>
      </button>
      <button v-else-if="state.hasPenny" class="authorization" @click="toMyHelpPennyDetails">
        <text class="look">查看我的抽奖</text>
      </button>
      <button v-else-if="state.userNoCoupon" class="authorization" @click="toPennyList">
        <text class="look">去抢其他好货</text>
      </button>
      <form v-else @submit="createOrder">
        <button form-type="submit">
          <!-- <text class="left">{{pennyDetail.activityPrice ? filtToFix(pennyDetail.activityPrice) + "元" : ""}}参与抽奖</text> -->
          <text class="right">{{state.pennyDetail.activityPrice ? filtToFix(state.pennyDetail.actualPrice) + "元" : ""}}马上抢</text>
        </button>
      </form>
    </view>
  </view>
</popup></view>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiWxaUserServiceJs from "@/service/api/newretail/wxaUserService";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _apiPennyServiceJs from "@/service/api/newretail/pennyService";
import _apiRequestJs from "@/service/api/newretail/request";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
import popup from '@/pages-sub/newretail/components/popup/popup.vue';
const app = getApp();

// pages/mallModule/activity/penny/goodsDetail/goodsDetail.js
const REQUEST = _apiRequestJs;
const pennyService = _apiPennyServiceJs;
const productService = _apiProductServiceJs;
const storeService = _apiStoreServiceJs;
const orderService = _apiOrderServiceJs;
const wxaUserService = _apiWxaUserServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const ANALYSIS = _utilsAnalysisJs;
const ADDRESS = _utilsAddressJs;
const NAVPAGE = _utilsNavPageJs;
const UTILS = _utilsUtilsJs;
const AUTHORIZE = _utilsAuthorizeJs;
const themeManager = _utilsThemeManagerJs;

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
  productPlacedAtTheTop: false,
  navigationBarTitle: "购物抽奖",
  imagesPath: IMGAGESPATH,
  theme: themeManager,
  name: "",
  productPictures: [],
  productDetails: [],
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  progress: 0,
  current: 1,
  time: null,
  pennyDetail: null,
  // 购物抽奖详情
  show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
    timeOut: false,
    pennyRules: false,
    unCoupon: false,
    selfTime: false
  },
  canBuy: true,
  hasUserInfo: false,
  isMember: false,
  member: null,
  hasPenny: false,
  type: "selftake",
  canSelfmention: true,
  canDelivery: true,
  date: '2016-09-01',
  time: '12:01',
  multiArray: [['2018-06-01', '2018-06-02', '2018-06-03'], ['6:00-9:00', '9:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00']],
  multiIndex: [0, 0],
  addressInfo: '',
  // 收货地址信息
  isDistributionOrder: false,
  // 是否统配订单
  distributionStoreId: uni.getStorageSync('distributionStoreId'),
  userNoCoupon: false
});
let customData = {
  hasMyInstanceQueryCount: false,
  myInstanceId: ""
};
function initPage() {
  const self = this;
  state.storeId = app.globalData.storeInfo.id;
  state.storeInfo = app.globalData.storeInfo;
  if (options.scene) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    let scene = decodeURIComponent(options.scene);
    let sceneArr = scene.split(',');
    options.id = sceneArr[0];
    getPennyDetails(options.id);
    // 分享信息打开统计 扫码默认为分享
    ANALYSIS.ShareOpenAnalysis();
  }
  if (options.id != null) {
    getPennyDetails(options.id);
    // 处理自提时间段
    initializationTime();
  }
}
onLoad(function (options) {
  uni.hideShareMenu();

  // 查询配置项获取订单预约时间和订单自提开始时间和预约时间间隔
  let systemOptions = app.globalData.configureInfo;
  let configures = {
    orderChooseDateAllowDays: 3,
    orderChooseDateInterval: 10800000,
    daysOfSelfTimeDelay: 0
  };
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
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
  state.productPlacedAtTheTop = app && app.globalData ? app.globalData.productPlacedAtTheTop : false;
  systemOptions.forEach(item => {
    // 遍历配置项，获取订单预约时间和订单自提开始时间
    if (item.key === 'orderChooseDateAllowDays' && item.value != null && item.value !== '') {
      // 订单预约可以预约几天 （单位 天）
      configures.orderChooseDateAllowDays = parseInt(item.value);
    } else if (item.key === 'orderChooseDateInterval' && item.value != null && item.value !== '') {
      // 订单预约时间的间隔 （单位 毫秒）
      configures.orderChooseDateInterval = parseInt(item.value) * 1000;
    } else if (item.key === 'daysOfSelfTimeDelay' && item.value != null && item.value !== '') {
      configures.daysOfSelfTimeDelay = parseInt(item.value);
    }
  });
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  state.systemOptions = configures;
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
});
onReady(function () {});
onShow(function () {
  checkUserInfo();
  if (app.globalData.storeInfo && app.globalData.storeInfo.id !== state.storeId) {
    initPage(); // 初始化页面内容
  }
});
onHide(function () {
  clearTimeout(state.pennyTimeId);
});
onUnload(function () {
  clearTimeout(state.pennyTimeId);
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    state.userInfo = app.globalData.userInfo.wxaUser;
    if (app.globalData.userInfo.member) {
      state.isMember = true;
      state.member = app.globalData.userInfo.member;
      queryMyInstance();
    }
  } else {
    state.hasUserInfo = false;
    state.isMember = false;
    state.member = null;
    state.userInfo = null;
  }
}
function getUserInfo(e) {
  AUTHORIZE.login(e).then(res => {
    state.hasUserInfo = true;
    state.userInfo = res.wxaUser;
    if (res.member) {
      state.isMember = true;
      state.member = res.member;
      queryMyInstance();
    } else {
      NAVPAGE.toAuthorize();
    }
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getPennyDetails(activityId) {
  const self = this;
  const postData = {
    page: 1,
    pageSize: 10,
    activityIdEquals: activityId
  };
  pennyService.query(postData).then(res => {
    if (!res || !res.records || res.records.length === 0) {
      // 没有查到抽奖数据
      return;
    }
    const _data = res.records[0];
    // 处理购物抽奖活动倒计时
    state.pennyDetail = _data;
    const startDate = _data.startTime; // 活动创建时间
    const endDate = _data.endTime; // 活动结束时间
    const startTimeStamp = new Date(_data.startTime.replace(/-/g, '/')).getTime(); // 开始时间时间戳
    const endTimeStamp = new Date(_data.endTime.replace(/-/g, '/')).getTime(); // 开始时间时间戳
    const duration = (endTimeStamp - startTimeStamp) / 1000 > 0 ? parseInt((endTimeStamp - startTimeStamp) / 1000) : 0; // 活动持续时间
    console.log(duration);
    // 设置进度
    const progress = getProgress();
    state.progress = progress;
    if (duration > 0) {
      countDown();
    }
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      queryMyInstance();
    }
    // 执行倒计时函数
    function countDown() {
      clearTimeout(state.pennyTimeId);
      // 获取倒计时
      let timeInfo = [];
      // 将活动的结束时间参数提成一个单独的数组，方便操作
      timeInfo.push({
        openTeamTime: startDate,
        duration: duration
      });
      let countDownArr = UTILS.countDownDay(timeInfo, false);
      // 设置进度
      const progress = getProgress();
      state.time = countDownArr[0];
      state.progress = progress;
      if (countDownArr[0].day === "00" && countDownArr[0].hou === "00" && countDownArr[0].min === "00" && countDownArr[0].sec === "00") {} else {
        let time = setTimeout(function () {
          countDown();
        }, 1000);
        state.pennyTimeId = time;
      }
    }

    // 设置进度条
    function getProgress() {
      const now = new UTILS.ResponseDate().getTime();
      const timeElapsed = (now - startTimeStamp) / 1000 > 0 ? parseInt((now - startTimeStamp) / 1000) : 0;
      const progress = timeElapsed / duration > 0 ? parseInt(timeElapsed / duration * 100) : 0;
      return progress;
    }
    return productService.getDetails(state.storeId, _data.productId);
  }).then(res => {
    if (!res) {
      // 没有查到该商品数据
      return;
    }
    let productPictures = res.productPictures;
    if (state.pennyDetail.activityImageUrl) {
      productPictures.unshift({
        fileType: "PICTURE",
        height: 690,
        id: "0",
        orderNumber: 1,
        url: state.pennyDetail.activityImageUrl,
        width: 750
      });
    }
    let balance = 0;
    if (res.storeProductState === "ON") {
      balance = res.balance;
    }
    state.name = res.name;
    state.description = res.description ? res.description : '';
    state.soldCount = res.soldCount;
    state.promotionPrice = res.promotionPrice ? res.promotionPrice : null;
    state.sellPrice = res.sellPrice ? res.sellPrice : '';
    state.originalPrice = res.originalPrice ? res.originalPrice : '';
    state.labels = res.labels;
    state.productProperties = res.productProperties;
    state.productDetails = res.productDetails;
    state.productPictures = productPictures;
    state.goodsId = res.id;
    state.business = res.business;
    state.pdtDetail = res;
    state.balance = balance;
    console.log(res);
    // 判断统配商品
    if (res.business === "DISTRIBUTION") {
      if (app.globalData.distributionStore) {
        state.distributionStoreId = app.globalData.distributionStore.id;
        productService.getDetails(app.globalData.distributionStore.id, state.goodsId).then(res => {
          if (res) {
            let balance = 0;
            if (res.storeProductState === "ON") {
              balance = res.balance;
            }
            state.balance = balance;
          }
        }).catch(err => {
          console.log(err);
        });
      } else {
        storeService.getDistributionStore().then(res => {
          if (res) {
            state.distributionStoreId = res.id;
            return productService.getDetails(res.id, state.goodsId);
          }
        }).then(res => {
          if (res) {
            let balance = 0;
            if (res.storeProductState === "ON") {
              balance = res.balance;
            }
            state.balance = balance;
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
function swiperChange(e) {
  state.current = e.detail.current + 1;
}
function createOrder(e) {
  const self = this;
  if (state.type === "selftake" && state.multiArray[1][0] === '请选择其他时间' || state.multiArray[1][0] === '不能下单' || state.multiArray[1][0] === '无法预约自提时间') {
    UTILS.showToast("当前时间不能自提，请选择其他时间~");
    return;
  }
  if (!state.canBuy) {
    // 订单已经在支付中
    return;
  }
  state.canBuy = false;
  state.show.selfTime = false;
  let tempSelfTime = null;
  let shipmentType = 'SELF';
  if (state.type === 'dispatch') {
    if (state.storeInfo.shipmentTypes.indexOf('EXPRESS') >= 0) {
      shipmentType = 'EXPRESS';
    } else if (state.storeInfo.shipmentTypes.indexOf('LOGISTICAL') >= 0) {
      shipmentType = 'LOGISTICAL';
    }
  } else {
    shipmentType = 'SELF';
    // 自提时间格式为yyyy-mm-dd HH:mm:ss~yyyy-mm-dd HH:mm:ss
    let tempTime = state.multiArray[1][state.multiIndex[1]];
    let tempTimeArr = tempTime.split('-');
    tempSelfTime = state.multiArray[0][state.multiIndex[0]] + ' ' + tempTimeArr[0] + ':00' + '~' + state.multiArray[0][state.multiIndex[0]] + ' ' + tempTimeArr[1] + ':00';
  }
  const postData = {
    activityId: state.pennyDetail.id,
    memberId: state.member.id,
    openId: state.userInfo.openId,
    payMethod: app.globalData.paymentMethod || REQUEST.PAYMETHOD,
    // payMethod: "CARDPAY",
    receiverMobile: state.member.mobile,
    selfTimeScope: tempSelfTime,
    shipmentType: shipmentType,
    storeId: state.storeId
  };
  pennyService.create(postData).then(res => {
    order = res;
    // 储值支付（测试用）
    // self.getCardPay(res.orderId)
    // 微信支付（正式用）
    if (res.paySign) {
      const data = {
        orderId: res.orderId,
        payMethod: app.globalData.paymentMethod || REQUEST.PAYMETHOD
      };
      wxPay(res.paySign, data);
    }
  }).catch(err => {
    UTILS.showToast(err.message);
    state.canBuy = true;
  });
}
function getCardPay(orderId) {
  const self = this;
  let postData = {
    orderId: orderId
  };
  postData = {
    ...postData,
    password: "123"
  };
  const order = {
    id: orderId
  };
  orderService.cardPay(postData).then(res => {
    return orderService.orderLock(order.id);
  }).then(res => {
    getOrderStatusById(orderId, self);
  }).catch(e => {
    if (e.code === -1001) {
      // 请求超时
      orderLock(order);
      toggle('timeOut');
    } else {
      UTILS.showToast(e.message);
    }
  });
}
function orderLock(order) {
  orderService.orderLock(order.id).then(res => {
    console.log(res);
  });
}
function wxPay(paySign, postData) {
  const self = this;
  let sign = JSON.parse(paySign);
  let packageValue = '';
  if (postData.payMethod === 'SWIFTPASS' || postData.payMethod === 'DINGFUTONG') {
    packageValue = sign.package;
  } else if (postData.payMethod === 'WX_MINI_APP' || postData.payMethod === 'WXA_ISV_PAY') {
    packageValue = sign.packageValue;
  }
  uni.requestPayment({
    'timeStamp': sign.timeStamp,
    'nonceStr': sign.nonceStr,
    'package': packageValue,
    'signType': sign.signType,
    'paySign': sign.paySign,
    'success': function (res) {
      let order = {
        id: postData.orderId
      };
      orderLock(order);
      getOrderStatusById(postData.orderId, self);
    },
    'fail': function (res) {
      console.log('支付失败-----------------');
      if (res.errMsg.indexOf("cancel") >= 0) {
        // 取消订单
        UTILS.showToast('您取消了支付订单~');
        state.canBuy = true;
      } else {
        UTILS.showToast(res.errMsg);
      }
      uni.redirectTo({
        url: '/pages-sub/newretail/pages/mallModule/order/orderDetails/orderDetails?orderId=' + postData.orderId
      });
    }
  });
}
function handleGetOrderStatusById(orderId, amount, self) {
  uni.showLoading({
    title: '支付中'
  });
  orderService.getOrderStatusById(orderId).then(result => {
    console.log('查询交易结果-------------');
    console.log(result);
    amount++;
    console.log(amount);
    if (amount > 40) {
      UTILS.setHideLoading(false);
      uni.hideLoading();
      // 弹出支付超时
      self.toggle('timeOut');
      return;
    }
    if (result.status === 'PAID' || result.status === 'WAITPAYBALANCE' || result.status === 'PENDING' || result.status === 'WAITSHIPPED' || result.status === 'RECEIVED' || result.status === "SHIPPED") {
      UTILS.setHideLoading(false);
      uni.hideLoading();
      UTILS.showToast("支付成功");
      // 跳转到分享页面
      uni.redirectTo({
        url: '/pages-sub/newretail/pages/mallModule/activity/penny/helpPenny/helpPenny?instanceId=' + self.order.instanceId + "&isCreate=true"
      });
    } else {
      let orderTimeId = setTimeout(() => {
        UTILS.setHideLoading(true);
        // 如果没有成功，调用函数本身，实现重复查询
        self.handleGetOrderStatusById(orderId, amount, self);
      }, 2000);
      self.setData({
        orderTimeId: orderTimeId
      });
    }
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
function getOrderStatusById(orderId, self) {
  let amount = 0;
  // self.handleGetOrderStatusById(orderId, amount, self);
  setTimeout(() => {
    self.handleGetOrderStatusById(orderId, amount, self);
  }, 1000);
}
function toggleTimeOutPopup() {
  toggle('timeOut');
  uni.redirectTo({
    url: '/pages-sub/newretail/pages/mallModule/order/order/order'
  });
}
function togglePennyRulesPopup() {
  toggle('pennyRules');
}
function toggle(type) {
   state[`show.${type}`] = !state.show[type];
}
function queryMyInstance() {
  const that = this;
  if (!customData.hasMyInstanceQueryCount) {
    if (!state.pennyDetail) {
      return;
    }
    let postData = {
      page: 1,
      pageSize: 0,
      activityIdEquals: state.pennyDetail.id,
      memberIdEquals: app.globalData.userInfo.member.id,
      statusIn: ["CREATE", "PRIZED", "NOPRIZE"]
    };
    pennyService.queryInstance(postData).then(res => {
      if (!res || !res.records || res.records.length === 0) {
        return;
      }
      customData.hasMyInstanceQueryCount = true;
      if (res.records.length > 0) {
        const _data2 = res.records[0];
        // 判断活动是否在进行中
        const endTimeStamp = new Date(state.pennyDetail.endTime.replace(/-/g, '/')).getTime(); // 开始时间时间戳
        const nowTime = new UTILS.ResponseDate().getTime();
        if (_data2.status === "NOPRIZE" && nowTime < endTimeStamp) {
          // 进行中的活动实例状态为未中奖可以再次发起
        } else {
          customData.myInstanceId = _data2.id;
          state.hasPenny = true;
        }
      }
    }).catch(err => {
      UTILS.showToast(err.message);
    });
    if (state.pennyDetail.stockId) {
      wxaUserService.sendCoupon(state.pennyDetail.id, false, state.storeId).then(res => {
        console.log("发券成功");
      }).catch(err => {
        console.log(err.message);
      });
    }
  }
}
function toMyHelpPennyDetails() {
  if (options.back && JSON.parse(options.back)) {
    uni.navigateBack({
      delta: 1
    });
  } else {
    const opts = "?instanceId=" + customData.myInstanceId;
    NAVPAGE.toHelpPenny(opts);
  }
}
function confirmInformation() {
  if (state.pennyDetail.stockId) {
    wxaUserService.isSend(state.pennyDetail.stockId).then(res => {
      if (res) {
        toggleSelfTimePopup();
      } else {
        state.userNoCoupon = true;
        toggleUnCouponPopup();
      }
    }).catch(err => {
      console.log("查询券失败：", err.message);
      state.userNoCoupon = true;
      toggleUnCouponPopup();
    });
  } else {
    state.userNoCoupon = true;
    toggleUnCouponPopup();
  }
}
function toggleUnCouponPopup() {
  toggle('unCoupon');
}
function toggleSelfTimePopup() {
  toggle('selfTime');
}
function toPennyList() {
  let currentPages = getCurrentPages();
  let pagePath = "";
  if (currentPages.length > 1) {
    let _this = currentPages[currentPages.length - 2];
    pagePath = _this.route;
    pagePath.indexOf('/') != 0 && (pagePath = '/' + pagePath);
  }
  if (pagePath === '/pages-sub/newretail/pages/mallModule/activity/penny/pennyList/pennyList') {
    uni.navigateBack({
      delta: 1
    });
  } else {
    uni.redirectTo({
      url: '/pages-sub/newretail/pages/mallModule/activity/penny/pennyList/pennyList'
    });
  }
}
function initializationTime() {
  const self = this;
  const configure = state.systemOptions; // 获取订单相关的系统配置
  let now = new UTILS.ResponseDate();
  let daysNumber = configure.orderChooseDateAllowDays; // 订单预约可以预约几天 （单位 天）
  const orderAppointmentDate = configure.daysOfSelfTimeDelay; // 订单预约限定下单后第几天开始
  console.log("订单预约限定下单后第几天开始：", orderAppointmentDate);
  let newAppointmentDate = addDay(now, orderAppointmentDate); // 新的订单预约开始日期
  let tempTime = [[], []];
  console.log("订单预约开始时间：", UTILS.formatTime(newAppointmentDate).replace(/\//g, '-'));
  for (let i = 0; i < daysNumber; i++) {
    let date = addDay(newAppointmentDate, i);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let newDate = [year, month, day].map(UTILS.timeFormat).join('-');
    tempTime[0].push(newDate);
  }
  tempTime[1] = handleChooseTime();
  // 特别的处理日期显示
  state.multiArray = tempTime;
  let days = state.multiArray[0][state.multiIndex[0]];
  let daysArr = days.split("-");
  let date = daysArr[1] + '月' + daysArr[2] + '日';
  let selfTimeDate = date;
  state.selfTimeDate = selfTimeDate;
}
function handleChooseTime() {
  const self = this;
  const now = new UTILS.ResponseDate();
  let hour = now.getHours(); //小时数
  const minute = now.getMinutes(); //分钟数
  let time = [hour, minute].map(UTILS.timeFormat).join(':');
  const configure = state.systemOptions; //获取订单相关的系统配置
  let orderAppointmentDate = configure.daysOfSelfTimeDelay; //订单预约限定下单后第几天开始
  let storeTime = '00:00-23:59';
  let tempTime = [];
  let businessHours = [];
  // 处理经营时间
  if (state.storeInfo && state.storeInfo.storeHours && state.storeInfo.storeHours !== "") {
    storeTime = state.storeInfo.storeHours.split("-");
  }
  let tempStart = storeTime[0] + ':00';
  let tempEnd = storeTime[1] + ':00';
  let date = UTILS.formatTime(now).split(" ")[0];
  let nowTime = new Date(UTILS.formatTime(now)).getTime();
  if (state.type === "selftake" && orderAppointmentDate > 0) {
    let storeHours = storeTime[0].slice(0, 2);
    hour = Number(storeHours);
    time = storeTime[0];
    let newDate = addDay(now, orderAppointmentDate);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    date = [year, month, day].map(UTILS.timeFormat).join('/');
    let newTime = date + " " + tempStart;
    nowTime = new Date(newTime).getTime();
  }
  let startTimeDetails = new Date(date + " " + tempStart).getTime();
  let endTimeDetails = new Date(date + " " + tempEnd).getTime();
  businessHours = splitTime(date, date, state.systemOptions.orderChooseDateInterval, tempStart, tempEnd);
  let hourArray = []; //营业时间小时数组
  businessHours.forEach(ele => {
    hourArray.push(ele.slice(0, 2));
  });
  const hourArrayLength = hourArray.length;
  let chooseTime = [[], []];
  for (let j = 0; j < businessHours.length - 1; j++) {
    const eleStart = businessHours[j];
    const eleEnd = businessHours[j + 1];
    let tempData = eleStart + '-' + eleEnd;
    chooseTime[0].push(tempData);
  }
  for (let i = 0; i < hourArrayLength; i++) {
    if (hour >= hourArray[i] && hour < hourArray[i + 1]) {
      chooseTime[1].push(time + '-' + businessHours[i + 1]);
      for (let k = i + 1; k < businessHours.length - 1; k++) {
        const eleStart = businessHours[k];
        const eleEnd = businessHours[k + 1];
        let tempData = eleStart + '-' + eleEnd;
        chooseTime[1].push(tempData);
      }
    }
  }
  state.chooseTime = chooseTime;
  state.storeTime = storeTime;
  console.log(chooseTime);
  // 小时
  if (nowTime < startTimeDetails || nowTime < endTimeDetails) {
    tempTime = chooseTime[1];
  } else {
    if (state.multiIndex[0] === 0) {
      tempTime = ["无法预约自提时间"];
      state.chooseTime[1] = tempTime;
    } else {
      tempTime = chooseTime[0];
    }
  }
  return tempTime;
}
function splitTime(startDate, endDate, amount, timeStart, timeEnd) {
  let startTime = new Date(startDate + " " + timeStart);
  let endTime = new Date(endDate + " " + timeEnd);
  let gap = amount;
  let count = Math.ceil((endTime - startTime) / gap);
  let realCount = (endTime - startTime) / gap;
  let temp = [];
  let tempTime = [];
  if (count - realCount >= 0) {
    temp.push(UTILS.formatTime(startTime));
    for (let i = 1; i < count; i++) {
      startTime.setMilliseconds(startTime.getMilliseconds() + gap);
      temp[i] = UTILS.formatTime(new Date(startTime.getTime()));
    }
    temp.push(UTILS.formatTime(endTime));
  } else {
    temp.push(UTILS.formatTime(startTime));
    for (let i = 1; i < count; i++) {
      startTime.setMilliseconds(startTime.getMilliseconds() + gap);
      temp[i] = UTILS.formatTime(new Date(startTime.getTime()));
    }
  }
  temp.forEach(item => {
    let tempData = item.split(" ")[1].slice(0, 5);
    tempTime.push(tempData);
  });
  tempTime = Array.from(new Set(tempTime));
  return tempTime;
}
function addDay(curDate, days) {
  return new Date((curDate / 1000 + 86400 * days) * 1000);
}
function bindMultiPickerChange(e) {
  console.log('picker发送选择改变，携带值为', e.detail.value);
  state.multiIndex = e.detail.value;
}
function bindMultiPickerColumnChange(e) {
  console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  let _data3 = {
    multiArray: state.multiArray,
    multiIndex: state.multiIndex
  };
  _data3.multiIndex[e.detail.column] = e.detail.value;
  let now = new UTILS.ResponseDate();
  let tempStart = state.storeTime[0] + ':00';
  let tempEnd = state.storeTime[1] + ':00';
  let date = UTILS.formatTime(now).split(" ")[0];
  let startTimeDetails = new Date(date + " " + tempStart).getTime();
  let endTimeDetails = new Date(date + " " + tempEnd).getTime();
  let nowTime = new Date(UTILS.formatTime(now)).getTime();
  switch (_data3.multiIndex[0]) {
    case 0:
      if (nowTime > startTimeDetails) {
        _data3.multiArray[1] = state.chooseTime[1];
      } else {
        _data3.multiArray[1] = state.chooseTime[0];
      }
      break;
    case 1:
      _data3.multiArray[1] = state.chooseTime[0];
      break;
    case 2:
      _data3.multiArray[1] = state.chooseTime[0];
      break;
  }
  if (_data3.multiArray[1][0] === '请选择其他时间' || _data3.multiArray[1][0] === '不能下单' || _data3.multiArray[1][0] === '无法预约自提时间') {
    state.canBuy = false;
  } else {
    state.canBuy = true;
  }
  if (e.detail.column == 0) {
    // 特别的处理日期在完善订单页面的显示
    let days = _data3.multiArray[0][_data3.multiIndex[0]];
    let daysArr = days.split("-");
    let date = daysArr[1] + '月' + daysArr[2] + '日';
    let selfTimeDate = date;
    state.selfTimeDate = selfTimeDate;
  }
  Object.assign(state, _data3);
}
function toSelectStore() {
  if (state.distributionStoreId === "") {
    NAVPAGE.toSelectStore();
  }
}
function toChooseAddress() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    let opts = '?from=perfectOrder';
    NAVPAGE.toAddressList(opts);
  } else {
    NAVPAGE.toAuthorize();
  }
}
</script>
<style scoped>
/* pages/mallModule/activity/penny/goodsDetail/goodsDetail.wxss */

page {
  background: #f1f1f1;
  padding-bottom: 106rpx;
}

.swiperContainer {
  width: 100%;
  height: 750rpx;
  position: relative;
}

.swiper {
  width: 100%;
  height: 750rpx;
}

.swiper-item {
  width: 100%;
  height: 750rpx;
}

.swiper-item image {
  width: 100%;
  height: 750rpx;
}

.swiper-item .slide-presell {
  width: 152rpx;
  height: 145rpx;
  position: absolute;
  top: 26rpx;
  left: 60rpx;
  z-index: 10;
}

.imageCount {
  width: 72rpx;
  height: 36rpx;
  background: rgba(27, 27, 27, 0.5);
  font-size: 20rpx;
  text-align: center;
  line-height: 36rpx;
  color: #fff;
  border-radius: 6rpx;
  position: absolute;
  bottom: 40rpx;
  right: 40rpx;
}

.penny-box {
  width: 750rpx;
  height: 93rpx;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
  box-sizing: border-box
}

.penny-box .price {
  display: flex;
  align-items: baseline;
}

.penny-box .activity-price {
  font-size: 24rpx;
  font-family: SourceHanSansCN-Regular;
  font-weight: bold;
}

.penny-box .activity-price text {
  font-size: 60rpx;
}

.penny-box .old-price {
  width: 78rpx;
  height: 24rpx;
  font-size: 30rpx;
  font-family: SourceHanSansCN-Regular;
  font-weight: bold;
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 22rpx;
}

/*商品名称价格等  */

.goods-info-box {
  padding: 13rpx 28rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  position: relative;
}

.goods-info-box .goods-name {
  font-size: 36rpx;
  line-height: 48rpx;
  color: #333;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-progress {
  padding: 26rpx 0;
}

.goods-progress view.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  line-height: 44rpx;
  color: #333;
}

.goods-progress view text {
  color: #f22127;
}

.goods-progress progress {
  width: 700rpx;
  height: 24rpx;
}

/* 图文详情 */

.goods-imgtext {
  background-color: #fff;
}

.goods-imgtext>text {
  display: block;
  text-indent: 40rpx;
  font-size: 28rpx;
  height: 68rpx;
  line-height: 68rpx;
  padding-bottom: 8rpx;
}

.goods-imgtext image {
  width: 100%;
  display: block;
}

/* 参与抽奖按钮 */

.button-box {
  width: 100%;
  height: 96rpx;
  position: fixed;
  bottom: 0;
  left: 0;
}

.button-box button {
  border-radius: 0;
}

.button-box button {
  padding: 0;
  display: flex;
}

.button-box button text {
  display: block;
  color: #e02e24;
  font-size: 28rpx;
  line-height: 96rpx;
}

.button-box button .left {
  width: 290rpx;
}

.button-box button .right {
  width: 100%;
  background: #e02e24;
  color: #fff;
}

.button-box button .look {
  width: 100%;
  background: #e02e24;
  color: #fff;
}

.popup-content {
  width: 670rpx;
  height: 500rpx;
  background: #fff;
  border-radius: 6rpx;
  position: relative;
}

.popup-content-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400rpx;
}

.popup-content-box image {
  width: 410rpx;
  height: 421rpx;
}

.popup-content .button {
  height: 100rpx;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 100rpx;
  width: 100%;
  color: #fff;
  text-align: center;
  border-bottom-left-radius: 6rpx;
  border-bottom-right-radius: 6rpx;
  position: absolute;
  bottom: 0;
  left: 0;
}

.panny-rules {
  width: 74rpx;
  height: 36rpx;
  position: absolute;
  right: 0;
  top: 42rpx;
}

.panny-rules image {
  width: 74rpx;
  height: 36rpx;
}

/* 规则弹窗 */

.penny-rules-box {
  padding: 30rpx;
}

.penny-rules-popup {
  width: 500rpx;
  padding: 24rpx 40rpx 48rpx;
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
  color: #D57C00;
}

.penny-rules-popup .title text {
  margin-bottom: 0;
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

/* 温馨提示弹窗 */

.penny-prompt-popup {
  background: #fff;
  width: 542rpx;
  min-height: 305rpx;
  border-radius: 10rpx;
  position: relative;
  padding: 0 24rpx 28rpx 24rpx;
}

.penny-prompt-popup .title {
  font-size: 36rpx;
  line-height: 72rpx;
  color: #000;
  width: 100%;
  text-align: center;
  padding-top: 14rpx;
  padding-bottom: 22rpx;
}

.penny-prompt-popup .close {
  will-change: 80rpx;
  height: 80rpx;
  position: absolute;
  right: 20rpx;
  top: 36rpx;
}

.penny-prompt-popup image {
  width: 40rpx;
  height: 40rpx;
}

.penny-prompt-popup .prompt-content {
  font-size: 28rpx;
  line-height: 48rpx;
  padding: 12rpx 0;
  text-align: left;
  text-indent: 2em;
}

.penny-prompt-popup .prompt-button-box {
  width: 480rpx;
  height: 84rpx;
  font-size: 32rpx;
  line-height: 84rpx;
  color: #fff;
  background: #eb3728;
  text-align: center;
  border-radius: 9rpx;
  margin: 24rpx auto 0 auto;
}

/* 选择自提时间和门店弹窗 */
.penny-selfTime-popup {
  width: 750rpx;
  background: #ffffff;
  padding-bottom: 126rpx;
}

/* 配送方式 */

.shipping-method {
  width: 690rpx;
  padding: 13rpx 30rpx 30rpx 30rpx;
}

.shipping-method .title {
  font-size: 30rpx;
  line-height: 74rpx;
  height: 74rpx;
  color: #454545;
  text-align: center;
  padding-bottom: 14rpx;
}

.time-picker {
  width: 100%;
  background: #fff;
}

.select-item {
  height: 132rpx;
  line-height: 132rpx;
  font-size: 24rpx;
  border-top: 1rpx solid #f1f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #454545;
  text-align: right;
  position: relative;
}

.select-item:first-of-type {
  border-top: 0;
}

.select-item>view {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.select-item .left-icon {
  margin-right: 13rpx;
}

.time-picker .left-icon {
  width: 34rpx;
  height: 34rpx;
}

.select-store .left-icon {
  width: 35rpx;
  height: 32rpx;
}

.select-address .left-icon {
  width: 33rpx;
  height: 39rpx;
}

.right-point {
  width: 12rpx;
  height: 23rpx;
}

.select-item .right-point {
  margin-left: 10rpx;
}

.select-store {
  padding-bottom: 3rpx;
}

.select-address {
  padding-bottom: 8rpx;
  height: auto;
}

.receive-info {
  width: 560rpx;
  min-height: 40rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  padding: 27rpx 0;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  text-align: left
}

.receive-info .name-mobile text:first-of-type {
  margin-right: 22rpx;
  padding-right: 20rpx;
  position: relative;
}

.receive-info .name-mobile text:first-of-type::after {
  content: '';
  height: 20rpx;
  background: #8b8b8c;
  width: 1px;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -8rpx;
}

.receive-info .receive-address {
  font-size: 24rpx;
  color: #454545;
}

.receive-info .no-address {
  height: 100%;
  font-size: 24rpx;
}

/* 参与抽奖按钮 */

.selfTime-button-box {
  width: 100%;
  height: 96rpx;
  position: fixed;
  bottom: 0;
  left: 0;
}

.selfTime-button-box button {
  border-radius: 0;
}

.selfTime-button-box button {
  padding: 0;
  display: flex;
}

.selfTime-button-box button text {
  display: block;
  color: #e02e24;
  font-size: 28rpx;
  line-height: 96rpx;
}

.selfTime-button-box button .left {
  width: 290rpx;
}

.selfTime-button-box button .right {
  width: 100%;
  background: #e02e24;
  color: #fff;
}

.selfTime-button-box button .look {
  width: 100%;
  background: #e02e24;
  color: #fff;
}
</style>