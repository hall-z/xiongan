<template>
<!-- pages/search/search.wxml -->
<navigationBar :storeId="storeData && storeData.id" :isShowAddressText="state.showStore" :isShowAddress="state.showStore" :storeTypeText="state.storeType && state.storeType.name ? state.storeType.name : ''" :title="state.navigationBarTitle"></navigationBar>
<!--  -->
<view>
<!-- <view class="search search-page-box" style="{{state.isSearchFixed ? 'position: fixed;z-index:4;top:' + navHeight + 'px;' : 'position: relative;'}}">
  <template is="searchTemplate" data="{{state.searchLabelShow, state.searchFocus, state.searchItem, state.searchText, state.placeholderText}}"></template>
  <image src='{{state.imagesPath.iconCloseImg}}' bindtap="clearSearch" class="clear-img" mode="widthFix"></image>
  <button class="search-btn" style="background: {{state.themeColor}}" bindtap="toSearch">搜索</button>
</view> -->
<custom-loading v-if="!state.dataLoading"></custom-loading>
<view class="search search-page-box" :style="state.isSearchFixed ? 'position: fixed;z-index:4;top:' + navHeight + 'px;' : 'position: relative;'">
  <view class="topHandleView" :style="'border-color: ' + state.themeColor" @click="handleConfirm">
    <image lazy-load="" style="width:26rpx;height:26rpx" :src="state.imagesPath.newSearchIcon"></image>
    <!-- <view>请输入关键词搜索</view> -->
    <input confirm-type="search" :focus="state.searchFocus" :placeholder="state.placeholderText || state.searchText" :value="state.searchItem" @confirm="handleConfirm" @focus="handleInputFocus" @blur="handleBlur" @input="handleInput">
    <image :src="state.imagesPath.iconCloseImg" @click.stop="clearSearch" class="clear-img" mode="widthFix"></image>
    <view :style="'background-color: ' + state.themeColor + ';'" @click.stop="toSearch" class="search-btn">搜索</view>
  </view>
  <view class="order-box" @click.stop="goOrderList">
    <image :src="state.imagesPath.newHomeOrderIcon" mode="widthFix"></image>
    订单
  </view>
</view>
<view class="top-search-block" :hidden="!state.isSearchFixed"></view>
<view class="history" :hidden="state.goodsList.length > 0 || state.storeList.length > 0">
  <view class="title">历史记录
    <text hidden="searchHistory==0" @click="clearSearchHistory">清除历史记录</text>
  </view>
  <text class="history-item" v-for="(searchHistoryItem , index) in state.searchHistory" :key="id" :data-value="searchHistoryItem" @click="clickSearchItem">{{searchHistoryItem}}</text>
</view>
<!-- banner 图片 -->
<view class="banner-box" v-if="state.banners.length > 0 && state.goodsList.length < 1 && state.storeList.length < 1">
    <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" circular="true">
      <view v-for="(item , index) in state.banners" :key="index">
        <swiper-item class="swiper-item" :data-id="item.id" @click="bannerJumping">
          <image :src="item.pictureUrl" class="slide-image"></image>
        </swiper-item>
      </view>
    </swiper>
  </view>
<!-- <view class="microphone-tips" hidden="{{state.goodsList.length > 0}}">
  <view>你来说，我来做</view>
  <view>把你最喜欢的带给你</view>
</view>
<view class="microphone-box" hidden="{{state.goodsList.length > 0}}" style="bottom:{{state.keyboardHeight}}px">
  <view class="microphone-btn" bindtouchstart="recorderStart" bindtouchmove="recorderMove" bindtouchcancel="recorderCancel" bindtouchend="recorderEnd">
    <image src="{{state.imagesPath.iconMicrophoneBlack}}" ></image>
  按住说我要
  </view>
</view> -->
<!-- bindscrolltoupper="handlescrolltoupper" -->
<scroll-view class="goods-box recommend-store" scroll-y="" @scroll="scrollFn" :style="'height: ' + windowHeight + 'px;'" :scroll-top="scrollTop" @scrolltolower="handleScrolltolower" scroll-with-animation="" v-if="state.showStore">
  <view v-for="(item , index) in state.storeList" :key="index" class="store-box" @click="goDetail" :data-idx="index" :data-id="item.id">
    <view class="recommend-store-msg">
      <view class="store-img">
        <image :src="item.imageUrl" mode="widthFix"></image>
      </view>
      <view class="store-msg">
        <view class="store-msg-name">{{item.name}}</view>
        <view class="store-detail-box">
          <view class="store-detail">
            <view style="background-color: #F34C23;color: #fff;" class="detail-item">{{item.rating || '-'}}分</view>
            <view style="border: 1px solid #F34C23;color: #F34C23;" class="detail-item" v-if="item.selfFlag">自提</view>
            <view style="border: 1px solid #23C257;color: #23C257;" class="detail-item" v-if="item.expressFlag">外送</view>
            <view>已售 {{item.soldCount}}</view>
            <!-- {{item.soldCount > 1000 ? '+' : ''}} -->
          </view>
          <view v-if="item.distance">
            {{item.distance}}km
          </view>
        </view>
      </view>
    </view>
    <scroll-view v-if="item.productList && item.productList.length > 0" enable-flex="" class="scroll-view_H" scroll-x="true" style="width: 100%">
      <view v-for="(item , index) in item.productList" class="scroll-product">
        <view class="product-img">
          <image :src="item.imageUrl" mode="widthFix"></image>
        </view>
        <view class="product-name">
          {{item.name}}
        </view>
        <view class="gm-goods-price" :hidden="item.sellPrice != null ? false : true">
          <view>
            <text class="nowPrice" :style="'color: ' + activityColor"><text style="font-size: 20rpx;">￥</text>{{item.memberPrice && item.memberPrice < item.sellPrice ? filters.filtToFix(item.memberPrice) : item.sellPrice ? filters.filtToFix(item.sellPrice) : filters.filtToFix(item.originalPrice)}}<text style="font-size: 20rpx;" v-if="item.style == 'SPEC_PARENT'">起</text></text>
            <text class="oldPrice" v-if="item.sellPrice < 1000 && item.originalPrice && item.sellPrice < item.originalPrice"><text style="font-size: 20rpx;">￥</text>{{filters.filtToFix(item.originalPrice)}}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</scroll-view>
<scroll-view class="goods-box" scroll-y="" @scroll="scrollFn" :style="'height: ' + windowHeight + 'px;'" :scroll-top="scrollTop" @scrolltolower="handleScrolltolower" scroll-with-animation="" v-else>
  <view class="goods-item" v-for="(item , index) in state.goodsList" :key="idx" :data-productId="item.productId || item.id" :data-activeId="item.id" :data-type="item.type" :id="'products-' + item.id" @click="toGoodsDetail">
    <view class="goods-img-box">
      <image :src="item.imageUrl" mode="aspectFit"></image>
      <image class="no-balance" :src="state.imagesPath.soldOutIcon" v-if="item.balance <= 0"></image>
    </view>
    <view class="goods-info">
      <view class="goods-name">
        <!-- <text wx:for="{{item.produtlabel}}" wx:key="index" wx:if="{{index<3}}" style="background-color:rgb({{item.color}})">{{item.labelName}}</text> -->
        <view>{{item.name}}</view>
      </view>
      <text class="goods-desc" v-if="item.type != 'ADVANCE_SELL'">{{item.description ? item.description : ''}}</text>
      <view class="goods-name" v-if="item.type != 'ADVANCE_SELL'">
        <view v-for="(item , index) in item.produtlabel" :key="index" v-if="index < 3">
          <text :style="'background-color:rgb(' + item.color + ')'" v-if="item.type != 'PROMOTIONLABEL' && item.labelName && !item.imageUrl">{{item.labelName}}</text>
          <image :src="item.imageUrl" v-else-if="item.imageUrl" style="height: 100%" mode="heightFix"></image>
        </view>
      </view>
      <!-- style="height: auto;" -->
      <!-- <text class="goods-sold">已售 {{item.soldCount}}</text> -->
      <view class="goods-labels" v-if="item.type != 'ADVANCE_SELL'">
        <view v-for="(item , index) in item.promotions" :key="index" :data-id="index" v-if="index < 3">
          <view :style="'border-color:rgb(' + item.color + ')'" v-if="item.type != 'PROMOTIONLABEL'">{{item.labelName}} </view>
        </view>
      </view>
      <view class="labels-board" :hidden="item.type == 'ADVANCE_SELL'">
        <!-- <view class="labels-title">促销:</view> -->
        <view class="labels-content-board">
          <view v-for="(item , index) in item.promotions" :key="index">
            <view class="labels-content" v-if="item.type == 'PROMOTIONLABEL'">
              <view class="labels-tag">{{item.labelName}}</view>
              <text>{{item.labelDetails}}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="advance-time" v-if="item.type == 'ADVANCE_SELL'">
        <text>预售时间：{{item.advanceSellDate}}</text>
        <view v-if="item.payType === 'PARTIAL'">
          <!-- <text>尾款支付时间：{{item.balanceDate}}</text> -->
          <text>提货时间：预售活动结束后即可提货</text>
        </view>
        <text v-else>{{item.shipmentType === 'SELF' ? '提货/发货时间' : '配送时间'}}：{{item.orderSelfTime !== "" ? item.orderSelfTime : "预售活动结束" + item.deliveryTime + "天后"}}</text>
      </view>
      <view class="goods-price" style="margin-top: 40rpx;" v-if="item.type == 'ADVANCE_SELL'">
        <view class="vip-price">
          <view class="vip-label">
            <image :src="state.imagesPath.iconVipLabel"></image>
            <text>预售</text>
          </view>
        </view>
        <view class="price-item">
          预售价<text class="nowPrice" :hidden="item.sellPrice ? false : true"><text>￥</text>{{item.sellPrice}}</text>
        </view>
        <view class="price-item front-money" v-if="item.payType === 'PARTIAL'">
          定金
          <text class="nowPrice" :hidden="item.frontPrice ? false : true"><text>￥</text>{{item.frontPrice}}</text>
        </view>
      </view>
      <view class="goods-price" v-else-if="item.type == 'CYCLE'">
        ￥ <text class="nowPrice">{{filters.filtToFix(item.sellPrice || 0)}}</text><text class="rise" v-if="item.style == 'SPEC_PARENT'">起</text>
        <view class="vip-price">
          <text class="oldPrice" v-if="item.originalPrice && item.sellPrice < item.originalPrice">￥{{filters.filtToFix(item.originalPrice)}}</text>
          <view class="vip-label">
            <image :src="state.imagesPath.iconVipLabel"></image>
            <text>周期购</text>
          </view>
        </view>
      </view>
      <view class="goods-price" v-else :hidden="item.sellPrice && item.sellPrice !== undefined ? false : true">
        ￥
        <view v-if="item.promotionPrice != null">
          <text class="nowPrice">{{item.sellPrice && item.sellPrice < item.promotionPrice ? item.memberPrice && item.memberPrice < item.sellPrice ? filters.filtToFix(item.memberPrice) : filters.filtToFix(item.sellPrice) : item.memberPrice && item.memberPrice < item.promotionPrice ? filters.filtToFix(item.memberPrice) : filters.filtToFix(item.promotionPrice)}}</text><text class="rise" v-if="item.style == 'SPEC_PARENT'">起</text>
          <view class="vip-price" v-if="item.memberPrice && item.memberPrice < item.promotionPrice && (!item.sellPrice || item.memberPrice < item.sellPrice)">
            <!-- <text class="oldPrice">￥{{item.originalPrice ? filters.filtToFix(item.originalPrice): filters.filtToFix(item.sellPrice)}}</text> -->
            <view class="vip-label">
              <image :src="state.imagesPath.iconVipLabel"></image>
              <text>{{state.vipGradeConfig.priceLabel}}</text>
            </view>
          </view>
          <text class="oldPrice">￥{{item.originalPrice > item.sellPrice ? filters.filtToFix(item.originalPrice) : filters.filtToFix(item.sellPrice)}}</text>
        </view>
        <view v-else>
          <text class="nowPrice">{{item.memberPrice && item.memberPrice < item.sellPrice ? filters.filtToFix(item.memberPrice) : item.sellPrice ? filters.filtToFix(item.sellPrice) : filters.filtToFix(item.originalPrice)}}</text><text class="rise" v-if="item.style == 'SPEC_PARENT'">起</text>
          <view class="vip-price" v-if="item.memberPrice && item.memberPrice < item.sellPrice">
            <text class="oldPrice" v-if="item.originalPrice && item.memberPrice < item.originalPrice">￥{{filters.filtToFix(item.originalPrice)}}</text>
            <view class="vip-label">
              <image :src="state.imagesPath.iconVipLabel"></image>
              <text>{{state.vipGradeConfig.priceLabel}}</text>
            </view>
          </view>
          <text class="oldPrice" v-else-if="item.originalPrice && item.sellPrice < item.originalPrice">￥{{filters.filtToFix(item.originalPrice)}}</text>
        </view>
      </view>
      <form @submit="addShopcart" @click.stop="addShopcartCatch" v-if="item.type != 'ADVANCE_SELL' && item.type != 'CYCLE'">
        <view class="cart-control">
          <!-- <block wx:if="{{item.style !== 'MEALS'}}">
            <view class="reduce-box" hidden="{{!shopCart[item.id]}}">
              <button form-type="submit" data-balance="{{item.balance}}" data-style="{{item.style}}" data-type="reduce" data-id="{{item.id}}" data-business="{{item.business}}" data-traceId="{{item.traceId}}"></button>
              <image class="reduce-img" src='{{state.imagesPath.iconMinus}}'></image>
            </view>
            <text class="cart-count">{{shopCart[item.id] ? shopCart[item.id] : ''}}</text>
          </block> -->
          <view class="add-box" :style="'background-color: ' + state.themeColor + ';'">
            <button v-if="!state.hasUserInfo" @click="getUserInfo"></button>
            <button v-else form-type="submit" data-addType="normal" :data-balance="item.balance" :data-initialpurchasenumber="item.initialPurchaseNumber" :data-style="item.style" data-type="add" :data-id="item.id" :data-business="item.business" :hidden="item.balance <= 0 && item.business !== 'DISTRIBUTION'" :data-traceId="item.traceId"></button>
            <image class="add-img" :src="state.imagesPath.shopping_icon_list"></image>
            <!-- <image class="add-img" src='{{imagesPath.iconJoin}}'></image> -->
            <text class="cart-count" v-if="shopCart[item.id]">{{shopCart[item.id] ? shopCart[item.id] : ''}}</text>
          </view>
        </view>
      </form>
    </view>
  </view>
</scroll-view>
<view class="hud-container" v-if="state.toast.show">
  <image :src="state.toast.image" mode="widthFix"></image>
  <text>{{state.toast.title}}</text>
</view>
<!-- 选择餐饮套餐弹窗 -->
<!-- <setMeal show="{{meals.show}}" productId="{{meals.productId}}" storeId="{{meals.storeId}}" bind:outcome="chooseOutcome"></setMeal> -->
<!--加入购物车图片-->
<!-- <view class="good_box" hidden="{{hide_good_box}}" animation="{{animation}}" style="left:{{bus_x}}px;top:{{bus_y}}px;">
  <image src="{{goodsBoxImage}}" mode="aspectFit" ></image>
</view> -->
<image class="scroll-top" v-if="state.showScrollTop" :src="state.imagesPath.scrollTop" @click="handleScrollTop"></image>
<authorize @login="handleUserLogin"></authorize></view>
</template>
<script setup>
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiBannerServiceJs from "@/service/api/newretail/bannerService";
import _apiShopcartServiceJs from "@/service/api/newretail/shopcartService";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _apiStoreServiceJs from "@/service/api/newretail/storeService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onPageScroll } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/search/search.js
const storeService = _apiStoreServiceJs;
const productService = _apiProductServiceJs;
const shopcartService = _apiShopcartServiceJs;
const bannerService = _apiBannerServiceJs;
const util = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const ADDRESS = _utilsAddressJs;
const AUTHORIZE = _utilsAuthorizeJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const utilsSelf = _utilsSelfJs;
const themeManager = _utilsThemeManagerJs;
import bus from 'iny-bus';

//获取应用实例
let canAddToCart = true;
const recorderManager = uni.getRecorderManager();
function sendRecord(src, storeId) {
  uni.showToast({
    icon: 'loading',
    title: '正在搜索...',
    duration: 20000
  });
  let obj = {
    //服务器地址
    url: "https://dev.gomoretech.com/demo/newretail-search/api/search/product/queryByVoice",
    filePath: src,
    name: "file",
    header: {
      'Content-Type': 'application/json'
    },
    formData: {
      'storeId': storeId
    },
    success: function (result) {
      // console.log(result)
      let data = JSON.parse(result.data);
      let page = getCurrentPages();
      let indexPage = null;
      page.forEach(item => {
        if (item.route === "pages/search/search") {
          indexPage = item;
        }
      });
      uni.hideToast();
      if (data.data) {
        indexPage.setProduct(data.data);
      } else {
        uni.showToast({
          title: '未检测到语音',
          icon: 'none',
          duration: 2000
        });
      }
      // setSearchData(data)
    },
    fail: function (err) {
      console.log(err);
      uni.hideToast();
    }
  };
  uni.uploadFile(obj);
}
recorderManager.onStart(() => {
  console.log('recorder start');
});
recorderManager.onPause(() => {
  console.log('recorder pause');
});
recorderManager.onStop(res => {
  console.log('recorder stop', res);
  const {
    tempFilePath
  } = res;
});
recorderManager.onFrameRecorded(res => {
  const {
    frameBuffer
  } = res;
  console.log('frameBuffer.byteLength', frameBuffer.byteLength);
});
recorderManager.onError(res => {
  console.log("error", res);
});
const state = reactive({
  storeList: [],
  showStore: true,
  storeType: {},
  dataLoading: true,
  pageCount: 10,
  inScrolltoupper: false,
  navigationBarTitle: "",
  imagesPath: IMGAGESPATH,
  userInfo: {},
  storeId: '',
  store: '',
  page: 1,
  offsetTop: 0,
  pageSize: 10,
  searchCount: true,
  searchLabelShow: true,
  searchStyle: {},
  searchFocus: false,
  searchText: '',
  searchItem: "",
  banners: [],
  goodsList: [],
  searchHistory: [],
  nameLikes: '',
  placeholderText: '请输入搜索内容',
  keyboardHeight: 0,
  recorderType: 'normal',
  //normal (正常) success (成功) fail (失败) cancel (取消)
  toast: {
    show: false,
    title: '向上滑动取消',
    image: '../../../../image/iconMicrophoneWhite.png'
  },
  phone: false,
  meals: {
    show: false,
    productId: '',
    storeId: ''
  },
  hasUserInfo: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  vipGradeConfig: null,
  searchHeight: 44,
  isSearchFixed: false,
  showScrollTop: false
});
function bannerJumping(e) {
  const that = this;
  let bannerId = e.currentTarget.dataset.id;
  const bannerList = state.banners;
  let advertisementInfo = null;
  bannerList.forEach(item => {
    if (item.id === bannerId) {
      advertisementInfo = item;
    }
  });
  console.log(advertisementInfo);
  toAdPage(advertisementInfo, 'banner');
}
function goDetail(e) {
  let id = e.currentTarget.dataset.id;
  let storeData = {
    ...state.storeList[e.currentTarget.dataset.idx]
  };
  delete storeData.productList;
  delete storeData.storeImages;
  delete storeData.consultImages;
  app.globalData.storeInfo = storeData;
  uni.setStorageSync('storeIdactive', app.globalData.storeInfo);
  NAVPAGE.toStoreDetail('?id=' + id);
}
function goOrderList() {
  NAVPAGE.toOrderList();
}
function toAdPage(pageInfo, pageType) {
  const that = this;
  if (pageInfo.linkType === 'APP') {
    // 应用
    // 判断跳转模块
    if (pageInfo.appReturnType === "PRODUCT_MENU") {
      //跳转商品分类页面
      NAVPAGE.toCategory("?categoryId=" + pageInfo.productMenuId);
    } else if (pageInfo.appReturnType === 'MIAOSHA') {
      NAVPAGE.toSeckill();
    } else if (pageInfo.appReturnType === "RECHARGE") {
      NAVPAGE.toRecharge();
    } else if (pageInfo.appReturnType === "MEAL") {
      //  餐饮
    } else if (pageInfo.appReturnType === "RECEIVECOUPON") {
      // 领券中心
      NAVPAGE.toCouponCenter();
    } else if (pageInfo.appReturnType === "ADVANCE_SELL_PRODUCT") {
      // 预售商品
      if (pageInfo.activityId) {
        let opts = '?productId=' + pageInfo.productId + '&advanceId=' + pageInfo.activityId + '&type=advanceSell';
        NAVPAGE.toGoodsDetails(opts);
      } else {
        NAVPAGE.toAdvanceSell();
      }
    } else if (pageInfo.appReturnType === "TEAM_BUYING") {
      // 团购
      NAVPAGE.toFightGroup();
    } else if (pageInfo.appReturnType === "SCOREMALL") {
      // 积分商场
      NAVPAGE.toScoreMall();
    } else if (pageInfo.appReturnType === "INVITE_MEMBER") {
      // 邀请好友
      NAVPAGE.toInvite();
    } else if (pageInfo.appReturnType === "MEMBER_CARD") {
      // 会员卡
      //如果首页开启付款码，则不到会员码页面，点击直接跳转付款码页面
      if (app.globalData.uiconfig.isHomePayCodeEnabled) {
        NAVPAGE.toPayCode();
      } else {
        NAVPAGE.toMemberCard();
      }
      ;
    } else if (pageInfo.appReturnType === "MY_COUPON") {
      // 我的优惠券
      NAVPAGE.toMyCoupon();
    } else if (pageInfo.appReturnType === "NEWMBR") {
      // 新用户专享
      NAVPAGE.toNewmbrActivity();
    } else if (pageInfo.appReturnType === "HELP_COUPON") {
      // 助力送券
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        if (pageInfo.helpActivityId != null) {
          helpActivityService.getHelpActivityById(pageInfo.helpActivityId).then(res => {
            if (res.status === "SUBMITED") {
              let opts = "?helpActivityId=" + pageInfo.helpActivityId;
              NAVPAGE.toAssistanceCoupon(opts);
            } else if (res.status === "FINISHED") {
              uni.showToast({
                title: '您来晚了，助力活动已结束~',
                icon: 'none'
              });
            } else if (res.status === "CREATED") {
              uni.showToast({
                title: '助力活动还没有开始哦~',
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: '当前助力活动不在进行中~',
                icon: 'none'
              });
            }
          }).catch(err => {
            console.log("查询进行中的助力送券活动出错：" + err.message);
            uni.showToast({
              title: '当前没有正在进行中的活动哦~',
              icon: 'none'
            });
          });
        }
      } else {
        uni.showToast({
          title: '您还不是会员，请绑定手机号成为会员~',
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          NAVPAGE.toAuthorize();
        }, 2000);
      }
    } else if (pageInfo.appReturnType === "CREDIT_CARD") {
      // 申请办卡
      NAVPAGE.toCreditCard();
    } else if (pageInfo.appReturnType === "BARGAIN") {
      // 砍价模块
      NAVPAGE.toBargainList();
    } else if (pageInfo.appReturnType === "PENNY") {
      // 购物抽奖
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toPennyList();
      } else {
        NAVPAGE.toAuthorize();
      }
    } else if (pageInfo.appReturnType === "RECHARGE_DRAW") {
      // 充值抽奖
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        NAVPAGE.toLotteryIndex();
      } else {
        NAVPAGE.toAuthorize();
      }
    } else if (pageInfo.appReturnType === "NOTICE") {
      // 系统公告
      NAVPAGE.toSysNotice();
    } else if (pageInfo.appReturnType === "SOLITAIRE") {
      NAVPAGE.toSolitaireList();
    } else if (pageInfo.appReturnType === "PACKAGING") {
      // 打包一口价
      if (pageInfo.packagingId != null) {
        let opts = "?packagingId=" + pageInfo.packagingId;
        NAVPAGE.toPackaging(opts);
      }
    } else if (pageInfo.pageUrl) {
      uni.navigateTo({
        url: pageInfo.pageUrl
      });
    }
  } else if (pageInfo.linkType === "FEEDBACK") {
    //跳转意见反馈页面
    NAVPAGE.toFeedback();
  } else if (pageInfo.linkType === 'GRADPRODUCT') {
    // 秒杀商品
    let opts = '?productId=' + pageInfo.productId + '&storeId=' + app.globalData.storeInfo.id + '&activityId=' + pageInfo.grabActivityId + '&type=secondkill';
    NAVPAGE.toGoodsDetails(opts);
  } else if (pageInfo.linkType === 'PRODUCT') {
    // 商品 
    let opts = '?productId=' + pageInfo.productId + '&storeId=' + app.globalData.storeInfo.id + '&type=normal';
    NAVPAGE.toGoodsDetails(opts);
  } else if (pageInfo.linkType === 'TEAMPRODUCT') {
    // 拼团商品 
    let opts = '?productId=' + pageInfo.teamActivityId + '&storeId=' + app.globalData.storeInfo.id + '&type=group';
    NAVPAGE.toGoodsDetails(opts);
  } else if (pageInfo.linkType === 'COUPONACTIVITYDETAILS') {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.member) {
        let opts = '?couponActivityId=' + pageInfo.couponActivityId + '&type=assign&isExternal=false';
        NAVPAGE.toCouponDetails(opts);
      } else {
        uni.showToast({
          title: '您还不是会员，请绑定手机号成为会员~',
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          NAVPAGE.toAuthorize();
        }, 2000);
      }
    } else {
      NAVPAGE.toAuthorize();
    }
  } else if (pageInfo.linkType === 'URL') {
    // 链接
    let url = pageInfo.linkUrl;
    if (!url) {
      return false;
    }
    let index = '?';
    let webUrl = url;
    if (url.indexOf(index) > -1) {
      webUrl = webUrl + '&storeId=' + state.storeId + '&type=normal';
      if (app.globalData.TENANT && webUrl.indexOf("tenant") < 0) {
        webUrl = webUrl + '&tenant=' + app.globalData.TENANT;
      }
    }
    let urlData = {
      url: encodeURIComponent(webUrl)
    };
    let jsonUrl = JSON.stringify(urlData);
    let opts = '?webUrl=' + jsonUrl;
    NAVPAGE.toAdvertising(opts);
  } else if (pageInfo.pageUrl) {
    uni.navigateTo({
      url: pageInfo.pageUrl
    });
  } else {}
}
function handleFocus(e) {
  state.searchLabelShow = true;
  state.goodsList = [];
  state.storeList = [];
  state.searchItem = state.nameLikes;
}
function handleInputFocus(e) {
  console.log(e.detail);
  state.keyboardHeight = e.detail.height;
}
function handleBlur(e) {
  if (!e.detail.value) {
    state.searchLabelShow = false;
    state.goodsList = [];
    state.storeList = [];
    state.keyboardHeight = 0;
  } else {
    state.keyboardHeight = 0;
  }
}
function handleInput(e) {
  state.nameLikes = e.detail.value;
}
function clearSearch() {
  state.searchItem = '';
  state.nameLikes = '';
  state.searchLabelShow = true;
}
function toSearch() {
  const that = this;
  let nameLikes = state.nameLikes;
  if (!nameLikes) {
    uni.showToast({
      title: state.showStore ? '请输入门店名称或商品名称!' : '请输入您想搜索的商品名称！',
      icon: "none",
      duration: 2000
    });
  } else {
    nameLikes = nameLikes.replace(/(^\s*)|(\s*$)/g, "");
    state.searchItem = nameLikes;
    state.goodsList = [];
    state.storeList = [];
    state.searchLabelShow = false;
    state.page = 1;
    if (!state.dataLoading) {
      return false;
    }
    // wx.showLoading({
    //   title: '查询中',
    // })
    state.dataLoading = false;
    getSearchProduct('', nameLikes);
  }
}
function handleConfirm(e) {
  console.log(e);
  if (!e.detail.value) {
    state.searchLabelShow = false;
    state.keyboardHeight = 0;
    uni.showToast({
      title: state.showStore ? '请输入门店名称或商品名称!' : '请输入您想搜索的商品名称！',
      icon: "none",
      duration: 2000
    });
  } else {
    state.goodsList = [];
    state.storeList = [];
    state.page = 1;
    let nameLikes = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
    if (!state.dataLoading) {
      return false;
    }
    // wx.showLoading({
    //   title: '查询中',
    // })
    state.dataLoading = false;
    getSearchProduct('', nameLikes);
  }
}
async function getSearchProduct(keywordLikes, nameLikes) {
  let storeId = state.storeId;
  const that = this;
  let page = state.page;
  let pageSize = state.pageSize;
  let searchCount = state.searchCount;
  if (keywordLikes.indexOf("，")) {
    let keywords = keywordLikes.split("，");
    keywordLikes = "";
    keywords.forEach(item => {
      keywordLikes = keywordLikes + item + ",";
    });
    keywordLikes = keywordLikes.substring(0, keywordLikes.length - 1);
  }
  let storeIdIn = storeId;
  // if (app.globalData.distributionStore) {
  //   const distributionStore = app.globalData.distributionStore;
  //   storeIdIn = storeIdIn + "," + distributionStore.id
  // }
  // if (app.globalData.nextDayStore) {
  //   const nextDayStore = app.globalData.nextDayStore;
  //   storeIdIn = storeIdIn + "," + nextDayStore.id
  // }
  console.log('进入', state.linktypea);
  if (state.linktypea == 'self') {
    storeIdIn = uni.getStorageSync('storeIdactive').id;
  }
  if (state.showStore) {
    let params = {
      keyword: nameLikes,
      page,
      pageSize,
      searchCount: true,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude
    };
    if (state.storeType && state.storeType.id) {
      params.storeTypeId = state.storeType.id;
    }
    await storeService.queryHomeProduct(params).then(res => {
      // wx.hideLoading();
      state.pageCount = res.totalCount;
      if (res.records && res.records.length > 0) {
        res.records.forEach(item => {
          let dis = util.distance(app.globalData.latitude, app.globalData.longitude, item.latitude, item.longitude);
          item.distance = dis;
        });
        state.storeList = [...state.storeList, ...res.records];
        state.searchLabelShow = true;
      } else {
        // wx.showToast({
        //   title: '没有您想搜索的商品！',
        //   icon: "none",
        //   duration: 2000
        // })
      }
      state.dataLoading = true;
    }).catch(() => {
      // wx.hideLoading();
      state.dataLoading = true;
    });
  } else {
    let params = {
      keyword: nameLikes,
      storeIdIn: storeIdIn.split(',')
    };
    Promise.allSettled([productService.getSearchProduct(storeIdIn, page, 0, keywordLikes, searchCount, "", nameLikes), productService.getSearchActiveProduct(params)]).then(res => {
      let tempList = [];
      uni.hideLoading();
      let resDataGoodList = [];
      if (res && res.length > 0) {
        res.forEach((item, index) => {
          if (item.status == "fulfilled" && item.value) {
            if (index == 0) {
              resDataGoodList = [...resDataGoodList, ...item.value.records];
            } else {
              resDataGoodList = [...resDataGoodList, ...item.value];
            }
          }
        });
      }
      if (res && res.length > 0) {
        // let goodsList = [...resData[0].records,...resData[1]]
        resDataGoodList.forEach(item => {
          let produtlabel = [];
          let promotions = [];
          let specifications = '';
          if (item.labels && item.labels.length > 0) {
            item.labels.forEach(ele => {
              if (ele.type === 'GOODSLABEL' && ele.color != null) {
                produtlabel.push(ele);
              } else if (ele.type === 'PROMOTIONLABEL') {
                promotions.push(ele);
              }
            });
          }
          if (item.productProperties && item.productProperties.length > 0) {
            for (let i = 0; i < item.productProperties.length; i++) {
              const ele = item.productProperties[i];
              if (ele.propertyName === '规格') {
                specifications = ele.propertyValue;
                break;
              }
            }
          }
          let tempItem = {
            ...item,
            produtlabel: produtlabel,
            promotions: promotions,
            specifications: specifications
          };
          function timeToArray(time) {
            const timeArray = time.split(' ');
            const timeList = timeArray[0].split('-');
            const newTime = timeList[1] + '月' + timeList[2] + '日';
            return newTime;
          }
          function timeDivision(time) {
            const timeArray = time.split(' ');
            const timeSlot = timeArray[1].slice(0, 5);
            return timeSlot;
          }
          if (item.type == 'ADVANCE_SELL') {
            let frontStartTime = timeToArray(item.frontStartTime);
            let frontEndTime = timeToArray(item.frontEndTime);
            let balanceStartTime = '';
            let balanceEndTime = '';
            let deliverTime = '';
            let balanceDate = '';
            if (item.payType === 'PARTIAL') {
              balanceStartTime = timeToArray(item.balanceStartTime);
              balanceEndTime = timeToArray(item.balanceEndTime);
              balanceDate = balanceStartTime + " " + timeDivision(item.balanceStartTime) + '~' + balanceEndTime + " " + timeDivision(item.balanceEndTime);
              if (balanceStartTime === balanceEndTime) {
                balanceDate = balanceStartTime + " " + timeDivision(item.balanceStartTime) + '~' + timeDivision(item.balanceEndTime);
              }
            }
            let orderSelfTime = "";
            // 预售自提固定时间
            if (item.selfTimeScope) {
              let selfStartTime = timeToArray(item.selfTimeScope.split("~")[0]);
              let selfEndTime = timeToArray(item.selfTimeScope.split("~")[1]);
              orderSelfTime = selfStartTime + " " + timeDivision(item.selfTimeScope.split("~")[0]) + '~' + selfEndTime + " " + timeDivision(item.selfTimeScope.split("~")[1]);
              if (selfStartTime === selfEndTime) {
                orderSelfTime = selfStartTime + " " + timeDivision(item.selfTimeScope.split("~")[0]) + '~' + timeDivision(item.selfTimeScope.split("~")[1]);
              }
            }
            let advanceSellDate = frontStartTime + " " + timeDivision(item.frontStartTime) + '~' + frontEndTime + " " + timeDivision(item.frontEndTime);
            if (frontStartTime === frontEndTime) {
              advanceSellDate = frontStartTime + " " + timeDivision(item.frontStartTime) + '~' + timeDivision(item.frontEndTime);
            }
            tempItem = {
              ...tempItem,
              balanceDate: balanceDate,
              advanceSellDate: advanceSellDate,
              deliverDate: deliverTime,
              orderSelfTime: orderSelfTime,
              balance: tempItem.balance || tempItem.balance === 0 ? item.balance : 999
            };
          }
          tempList.push(tempItem);
        });
        if (tempList && tempList.length > 0) {
          state.goodsList = [...tempList];
          state.searchLabelShow = true;
        } else {
          uni.showToast({
            title: state.showStore ? '没有您想搜索的门店或商品!' : '没有您想搜索的商品！',
            icon: "none",
            duration: 2000
          });
        }
        state.dataLoading = true;
      }
    }).catch(err => {
      // wx.hideLoading();
      state.dataLoading = true;
    });
  }
  // await productService.getSearchProduct(storeIdIn, page, pageSize, keywordLikes, searchCount, "", nameLikes).then(res => {
  //   console.log(res);
  //   let tempList = []
  //   // this.data.pageCount = res.totalCount;
  //   wx.hideLoading();
  //   if (res.records && res.records.length > 0) {
  //     res.records.forEach(item => {

  //       let produtlabel = []
  //       let promotions = []
  //       let specifications = ''
  //       if (item.labels && item.labels.length > 0) {
  //         item.labels.forEach(ele => {
  //           if (ele.type === 'GOODSLABEL' && ele.color != null) {
  //             produtlabel.push(ele)
  //           } else if (ele.type === 'PROMOTIONLABEL') {
  //             promotions.push(ele)
  //           }
  //         })
  //       }
  //       if (item.productProperties && item.productProperties.length > 0) {
  //         for (let i = 0; i < item.productProperties.length; i++) {
  //           const ele = item.productProperties[i];
  //           if (ele.propertyName === '规格') {
  //             specifications = ele.propertyValue
  //             break
  //           }
  //         }
  //       }
  //       let tempItem = {
  //         ...item,
  //         produtlabel: produtlabel,
  //         promotions: promotions,
  //         specifications: specifications
  //       }
  //       tempList.push(tempItem)
  //     })
  //     // tempList.forEach(arr=>{
  //     //     utilsSelf.getTemporaryUrl(arr.imageUrl)
  //     //     .then (res=>{
  //     //         arr.imageUrl = res;
  //     //         that.setData({
  //     //             goodsList: tempList,
  //     //             searchLabelShow: true
  //     //           })
  //     //     })
  //     // })
  //     that.setData({
  //         goodsList: [...that.data.goodsList,...tempList],
  //         searchLabelShow: true
  //       })
  //   } else {
  //     // wx.showToast({
  //     //   title: '没有您想搜索的商品！',
  //     //   icon: "none",
  //     //   duration: 2000
  //     // })
  //   }
  //   this.setData({
  //     dataLoading: true
  //   })
  // }).catch(() => {
  //   wx.hideLoading();
  //   this.setData({
  //     dataLoading: true
  //   })
  // })
  if (keywordLikes || nameLikes) {
    setSearchHistory(keywordLikes || nameLikes);
  }
}
function setSearchHistory(nameLikes) {
  let searchData = state.searchHistory;
  searchData.unshift(nameLikes);
  let newSetData = new Set(searchData);
  let newSearchData = Array.from(newSetData);
  uni.setStorageSync('searchDataLog', newSearchData);
  let SearchDataCache = newSearchData.slice(0, 10);
  state.searchHistory = SearchDataCache;
}
function toGoodsDetail(val, openFlag) {
  let type = val.currentTarget.dataset.type;
  if (type == 'CYCLE') {
    let opts = '?id=' + val.currentTarget.dataset.activeid;
    NAVPAGE.toCycleDetails(opts);
  } else if (type == 'ADVANCE_SELL') {
    let opts = '?productId=' + val.currentTarget.dataset.productid + '&advanceId=' + val.currentTarget.dataset.activeid + '&type=advanceSell';
    NAVPAGE.toGoodsDetails(opts);
  } else {
    if (state.linktypea == 'self') {
      let opts = '?productId=' + val.currentTarget.dataset.productid + '&storeId=' + state.storeId + '&type=normal' + '&zhiti=zhiti' + '&openFlag=' + openFlag;
      NAVPAGE.toGoodsDetails(opts);
    } else {
      let opts = '?productId=' + val.currentTarget.dataset.productid + '&storeId=' + state.storeId + '&type=normal' + '&openFlag=' + openFlag;
      NAVPAGE.toGoodsDetails(opts);
    }
  }
}
function clickSearchItem(e) {
  const that = this;
  if (!state.dataLoading) {
    return false;
  }
  // wx.showLoading({
  //   title: '查询中',
  // })
  state.dataLoading = false;
  handleFocus();
  state.searchItem = e.currentTarget.dataset.value;
  state.nameLikes = e.currentTarget.dataset.value;
  state.goodsList = [];
  state.storeList = [];
  state.page = 1;
  let nameLikes = state.searchItem;
  getSearchProduct('', nameLikes);
}
function clearSearchHistory() {
  const that = this;
  uni.removeStorageSync('searchDataLog');
  state.searchHistory = [];
}
function showGMToast({
  title: title,
  image: image
}) {
  const that = this;
  state.toast = {
    show: true,
    title: title,
    image: image
  };
}
function hideGMToast() {
  state.toast = {
    ...state.toast,
    show: false
  };
}
function setProduct(data) {
  const that = this;
  let tempList = [];
  if (data.voiceName) {
    state.searchItem = data.voiceName;
    state.nameLikes = data.voiceName;
    state.placeholderText = data.voiceName;
    state.searchLabelShow = true;
    state.searchFocus = false;
  }
  if (data.results.records && data.results.records.length > 0) {
    data.results.records.forEach(item => {
      let produtlabel = [];
      let promotions = [];
      let specifications = '';
      if (item.labels && item.labels.length > 0) {
        item.labels.forEach(ele => {
          if (ele.type === 'GOODSLABEL' && ele.color != null) {
            let tempData = {
              id: ele.product_id,
              color: ele.label_color,
              imageUrl: ele.image_url,
              labelDetails: ele.label_details,
              labelName: ele.label_name,
              pictureHeight: ele.picture_height,
              pictureWidth: ele.picture_width,
              type: ele.type
            };
            produtlabel.push(tempData);
          } else if (ele.type === 'PROMOTIONLABEL') {
            let tempData = {
              id: ele.product_id,
              color: ele.label_color,
              imageUrl: ele.image_url,
              labelDetails: ele.label_details,
              labelName: ele.label_name,
              pictureHeight: ele.picture_height,
              pictureWidth: ele.picture_width,
              type: ele.type
            };
            promotions.push(tempData);
          }
        });
      }
      if (item.productProperties && item.productProperties.length > 0) {
        for (let i = 0; i < item.productProperties.length; i++) {
          const ele = item.productProperties[i];
          if (ele.propertyName === '规格') {
            specifications = ele.propertyValue;
            break;
          }
        }
      }
      let tempItem = {
        ...item,
        id: item.product_id,
        soldCount: item.sold_count,
        sellPrice: item.sell_price,
        name: item.product_name,
        description: '',
        imageUrl: item.url,
        originalPrice: item.original_price,
        produtlabel: produtlabel,
        promotions: promotions,
        specifications: specifications
      };
      tempList.push(tempItem);
    });
    state.goodsList = [...state.goodsList, ...tempList];
    state.searchLabelShow = true;
    try {
      let value = uni.getStorageSync('wj_speechSearch');
      if (value) {
        uni.removeStorageSync('wj_speechSearch');
      }
    } catch (e) {
      // Do something when catch error
    }
  } else {
    // wx.showToast({
    //   title: '没有您想搜索的商品！',
    //   icon: "none",
    //   duration: 2000c
    // })
    getStoreProduct(state.storeId);
  }
}
function productsSort(array) {
  let balanceArray = [];
  let allArray = [];
  array.forEach(ele => {
    if (ele.balance <= 0) {
      balanceArray.push(ele);
    } else {
      allArray.push(ele);
    }
  });
  if (app.globalData.systemConfigure.storeProductBalanceIsZeroShow) {
    const tempArray = allArray.concat(balanceArray);
    return tempArray;
  } else {
    return allArray;
  }
}
function getStoreProduct(storeId) {
  const that = this;
  let page = 1;
  let pageSize = 0;
  let business = 'RETAIL';
  let hot = true;
  let storeIdIn = storeId;
  if (app.globalData.distributionStore) {
    const distributionStore = app.globalData.distributionStore;
    storeIdIn = storeIdIn + "," + distributionStore.id;
  }
  if (app.globalData.nextDayStore) {
    const nextDayStore = app.globalData.nextDayStore;
    storeIdIn = storeIdIn + "," + nextDayStore.id;
  }
  let postData = {
    page: page,
    pageSize: pageSize,
    hot: hot,
    storeIdIn: storeIdIn
    // business: business
  };
  productService.query(postData).then(res => {
    console.log(res);
    let tempList = [];
    if (res.records && res.records.length > 0) {
      res.records.forEach(item => {
        let produtlabel = [];
        let promotions = [];
        let specifications = '';
        if (item.labels && item.labels.length > 0) {
          item.labels.forEach(ele => {
            if (ele.type === 'GOODSLABEL' && ele.color != null) {
              produtlabel.push(ele);
            } else if (ele.type === 'PROMOTIONLABEL') {
              promotions.push(ele);
            }
          });
        }
        if (item.productProperties && item.productProperties.length > 0) {
          for (let i = 0; i < item.productProperties.length; i++) {
            const ele = item.productProperties[i];
            if (ele.propertyName === '规格') {
              specifications = ele.propertyValue;
              break;
            }
          }
        }
        let tempItem = {
          ...item,
          produtlabel: produtlabel,
          promotions: promotions,
          specifications: specifications
        };
        tempList.push(tempItem);
      });
      let newTempList = productsSort(tempList);
      state.goodsList = [...state.goodsList, ...newTempList];
      state.searchFocus = false;
    } else {
      state.goodsList = [...state.goodsList, ...tempList];
    }
  });
}
function recorderStart(e) {
  const that = this;
  let touchDotX = e.touches[0].pageX; // 获取触摸时的原点
  let touchDotY = e.touches[0].pageY;
  let time = 0;
  // 使用js计时器记录时间    
  let interval = setInterval(function () {
    time++;
  }, 100);
  state.touchDotX = touchDotX;
  state.touchDotY = touchDotY;
  state.interval = interval;
  state.time = time;
  showGMToast({
    title: '向上滑动取消',
    image: '../../../../image/iconMicrophoneWhite.png'
  });
  const options = {
    duration: 10000,
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 48000,
    format: 'aac',
    frameSize: 50
  };
  recorderManager.start(options);
  recorderManager.onStart(() => {
    console.log("录音开始");
    state.recorderType = 'success';
  });
}
function recorderCancel(e) {
  console.log('录音取消', e);
  hideGMToast();
  recorderManager.stop();
  that.setData({
    recorderType: 'cancel'
  });
}
function recorderMove(e) {
  const that = this;
  let touchDotX = state.touchDotX;
  let touchDotY = state.touchDotY;
  let interval = state.interval;
  let time = state.time;
  let touchMoveX = e.changedTouches[0].pageX;
  let touchMoveY = e.changedTouches[0].pageY;
  let tmX = touchMoveX - touchDotX;
  let tmY = touchMoveY - touchDotY;
  if (time < 20) {
    let absX = Math.abs(tmX);
    let absY = Math.abs(tmY);
    if (absX > 2 * absY) {
      if (tmX < 0) {
        console.log("左滑=====");
      } else {
        console.log("右滑=====");
      }
    }
    if (absY > absX * 2) {
      if (tmY < 0) {
        showGMToast({
          title: '取消发送',
          image: state.imagesPath.iconMicrophoneBack
        });
        recorderManager.pause();
        state.recorderType = 'cancel';
      } else {
        recorderManager.resume();
        showGMToast({
          title: '向上滑动取消',
          image: state.imagesPath.iconMicrophoneWhite
        });
        state.recorderType = 'success';
      }
    }
  }
  clearInterval(interval); // 清除setInterval
  state.time = 0;
}
function recorderEnd(e) {
  console.log("录音结束");
  const that = this;
  let recorderType = state.recorderType;
  hideGMToast();
  //结束录音  
  recorderManager.stop();
  if (recorderType === 'success') {
    console.log("success", recorderType);
    recorderManager.onStop(res => {
      const tempFilePath = res.tempFilePath;
      console.log(tempFilePath);
      sendRecord(tempFilePath, state.storeId);
    });
  } else {}
}
onLoad(function (_options) {
  if (_options.showType) {
    state.showStore = _options.showType == 'store';
  }
  if (_options.storeId) {
    state.storeId = _options.storeId;
  }
  if (_options.storeTypeName && _options.storeTypeId) {
    state.storeType.name = _options.storeTypeName;
    state.storeType.id = _options.storeTypeId;
    // wx.showLoading({
    //   title: '查询中',
    // })
    state.storeType = state.storeType;
    state.searchFocus = false;
    state.dataLoading = false;
    getSearchProduct('', '');
  } else {
    state.searchFocus = true;
  }
  let systemInfo = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo()
  }; //调用方法获取机型
  const tabbarHeight = app.globalData.isIphoneX ? 148 : 98;
  const navHeight = app.globalData.navHeight;
  const searchBarHeight = 30 * systemInfo.screenWidth / 750;
  const self = this;
  eventId = bus.on('userShopCartChange', () => {
    if (app.globalData.storeInfo) {
      getShopCart(app.globalData.storeInfo.id);
    }
  });
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    state.store = app.globalData.storeInfo.name;
    state.storeId = app.globalData.storeInfo.id;
    state.themeColor = app.globalData.uiconfig.themeColor;
    getBannerList(state.storeId);
    if (app.globalData.systemConfigure.showCartModule) {
      getShopCart(state.storeId);
    }
    // 统计PV
    ANALYSIS.PVStatistics(state.storeId);
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation().then(res => {
      app.globalData.storeInfo = res;
      state.store = res.name;
      state.storeId = res.id;
      if (app.globalData.systemConfigure.showCartModule) {
        getShopCart(res.id);
      }
      // 统计PV
      ANALYSIS.PVStatistics(res.id);
      getBannerList(state.storeId);
    }).catch(err => {
      console.log(err);
    });
  }
  state.navHeight = app.globalData.navHeight;
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig;
  state.windowHeight = systemInfo.screenHeight - tabbarHeight * systemInfo.screenWidth / 750 - navHeight - searchBarHeight;
  if (_options.keyword && _options.type === 'atOnce') {
    // self.handleFocus()
    if ("" != uni.getStorageSync('searchDataLog')) {
      state.searchHistory = uni.getStorageSync('searchDataLog').slice(0, 10);
      state.searchItem = _options.keyword;
      state.nameLikes = _options.keyword;
      state.placeholderText = _options.keyword;
      state.searchLabelShow = true;
      state.searchFocus = false;
    } else {}
    state.goodsList = [];
    state.storeList = [];
    state.page = 1;
    getSearchProduct(_options.keyword);
  } else if (_options.keyword && _options.type === 'wait') {
    handleFocus();
    if ("" != uni.getStorageSync('searchDataLog')) {
      state.searchHistory = uni.getStorageSync('searchDataLog').slice(0, 10);
    } else {}
    state.searchItem = _options.keyword;
    state.nameLikes = _options.keyword;
    state.placeholderText = _options.keyword;
  } else {
    handleFocus();
    if ("" != uni.getStorageSync('searchDataLog')) {
      state.searchHistory = uni.getStorageSync('searchDataLog').slice(0, 10);
    } else {}
  }
  try {
    let value = uni.getStorageSync('wj_speechSearch');
    if (value) {
      console.log(value);
      setProduct(value);
      // Do something with return value
      state.searchFocus = false;
    }
  } catch (e) {
    // Do something when catch error
  }
  if (options && options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId;
    try {
      uni.setStorageSync('wj_sharingId', shareId);
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures();

  // 获取用户信息
  checkUserInfo();
  console.log(_options, 'optionsoptionsoptions');
  if (_options.linktypea == 'self' && _options.linktypea) {
    state.linktypea = 'self';
  }
  if (_options.storeId) {
    state.storeId = _options.storeId;
  }
});
onReady(function () {});
onShow(function () {
  const self = this;
  if (state.phone === true) {
    handlePopupPhone();
  }
  if (state.storeId && state.storeId !== "" && app.globalData.userInfo && app.globalData.userInfo.member) {
    if (app.globalData.systemConfigure.showCartModule) {
      getShopCart(state.storeId);
    }
  }
});
onHide(function () {});
onUnload(function () {
  bus.remove('userShopCartChange', eventId);
});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {
  const self = this;
  // 分享信息统计
  ANALYSIS.ShareAnalysis();
  let sharePictures = state.sharePictures;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    let memberId = app.globalData.userInfo.member.id;
    return {
      title: '',
      path: '/pages-sub/newretail/pages/mallModule/goods/search/search?shareId=' + memberId + '&storeId=' + state.storeId,
      imageUrl: sharePictures,
      success(e) {}
    };
  } else {
    return {
      title: '',
      path: '/pages-sub/newretail/pages/mallModule/goods/search/search?storeId=' + state.storeId,
      imageUrl: sharePictures,
      success(e) {}
    };
  }
});
function getSharePictures() {
  if (app.globalData.sharePictures) {
    state.sharePictures = app.globalData.sharePictures;
  }
}
function getBannerList(storeId) {
  bannerService.getStoreBannerList('APPSEARCH', storeId).then(res => {
    console.log(res);
    state.banners = res;
  });
}
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
function addShopcartCatch(val) {
  addShopCartData = val;
}
function addShopcart(val) {
  const that = this;
  if (!canAddToCart) {
    console.log("==============================正在加入购物车");
    return;
  }
  canAddToCart = false;
  let productId = val.detail.target.dataset.id;
  let business = val.detail.target.dataset.business;
  let style = val.detail.target.dataset.style;
  const mode = val.detail.target.dataset.type;
  let storeId = '';
  let loginStatus = checkAuth();
  let balance = val.detail.target.dataset.balance;
  let hasSharingPersonId = false;
  console.log("==============================正在加入购物车");
  if (style !== 'SPEC_PARENT' && style !== 'MEALS2') {
    if (loginStatus) {
      if (business === "DISTRIBUTION") {
        try {
          let data = uni.getStorageSync('wj_distributionStore');
          if (data) {
            storeId = data.id;
          }
          console.log('是不是进入到了这里', storeId);
        } catch (e) {}
      } else if (business === "NEXT_DAY") {
        try {
          let data = uni.getStorageSync('wj_nextDayStore');
          if (data) {
            storeId = data.id;
          }
        } catch (e) {}
      } else {
        storeId = app.globalData.storeInfo.id;
      }
      if (state.linktypea == 'self') {
        storeId = state.storeId;
      }
      let localShopingCart = uni.getStorageSync('wj_shopCartStorage');
      let goodObj = null;
      let goodNum = 1;
      state.goodsList.some(item => {
        if (item.productId == productId || item.id == productId) {
          goodObj = {
            ...item
          };
          if (localShopingCart && localShopingCart.goodsId.indexOf(item.id) > -1) {
            goodNum = localShopingCart.items[item.id];
          }
        }
        return item.productId == productId || item.id == productId;
      });
      let postData = {
        storeId: storeId,
        lists: [{
          count: goodObj && goodObj.initialPurchaseNumber ? goodObj.initialPurchaseNumber : 1,
          productId: productId
        }]
      };
      if (app.globalData.isShoppingGuidanceRecordGoods) {
        // 获取分享人id
        const shareData = util.getSharingPersonInfo();
        if (shareData && shareData != null && shareData.productId === productId) {
          postData.lists[0].sharingPersonId = shareData.shareId;
          hasSharingPersonId = true;
        }
      }
      if (mode === 'reduce') {
        postData = {
          storeId: storeId,
          lists: [{
            count: goodNum && goodObj && goodObj.initialPurchaseNumber && goodNum <= goodObj.initialPurchaseNumber ? -goodObj.initialPurchaseNumber : -1,
            productId: productId
          }]
        };
      }
      console.log(postData, "modemode");
      if (business === 'DISTRIBUTION' || business === 'NEXT_DAY') {
        balance = 0;
        productService.getDetails(storeId, productId).then(res => {
          if (res) {
            balance = res.balance;
          }
          if (res.style === 'MEALS') {
            getCateringDetailsById(productId, storeId);
          } else {
            addShopcart(balance);
          }
        }).catch(err => {
          canAddToCart = true;
        });
      } else if (business === 'CATERING' && style === 'MEALS') {
        getCateringDetailsById(productId, storeId);
      } else if (business === 'CATERING' && style === 'MEALS2') {
        // 组合商品
        const obj = {
          currentTarget: {
            dataset: {
              productid: productId
            }
          }
        };
        toGoodsDetail(obj, 'open');
        canAddToCart = true;
      } else {
        addShopcart(balance);
      }
      function addShopcart(balance) {
        if (app.globalData.userInfo.member) {
          if (balance === 0 || balance === null || balance === '') {
            canAddToCart = true;
            uni.showToast({
              title: '门店中该商品库存不足，请选购其他商品~',
              icon: 'none',
              duration: 2000
            });
          } else {
            console.log("开始调用：" + new Date().getTime());
            shopcartService.cateringAdd(postData).then(res => {
              let opts = {
                products: [{
                  productId: productId
                }]
              };
              canAddToCart = true;
              app.globalData.storeIdentification = business === 'DISTRIBUTION' ? 'distribution' : business === 'NEXT_DAY' ? 'nextDay' : 'normal';
              app.globalData.isShopCartChange = true;
              console.log("添加成功了：" + new Date().getTime());
              if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
                util.removeSharingPersonInfo();
              }
              if (mode === 'reduce') {
                reduceLocalGoods(productId);
              } else {
                if (i && i !== void 0) {
                  addToCartAnimateTest(val);
                  addLocalGoods(productId);
                } else {
                  handleTouchOnGoods(addShopCartData);
                }
              }
            }).catch(err => {
              canAddToCart = true;
              uni.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000
              });
            });
          }
        } else {
          canAddToCart = true;
          NAVPAGE.toAuthorize();
        }
      }
      function getCateringDetailsById(productId, storeId) {
        productService.getCateringDetailsById(productId, storeId).then(res => {
          const self = this;
          let cateringGroupProducts = res.cateringGroupProducts;
          let productId = res.id;
          let goodsList = [];
          let mealCanBuy = true;
          let mealDetails = [];
          if (cateringGroupProducts && cateringGroupProducts.length > 0) {
            let groupProductList = [];
            for (let i = 0; i < cateringGroupProducts.length; i++) {
              const item = cateringGroupProducts[i];
              if (item.mealDetails && item.mealDetails.length > 0) {
                for (let j = 0; j < item.mealDetails.length; j++) {
                  const ele = item.mealDetails[j];
                  let tempData = {
                    "groupId": item.groupId,
                    "groupProductId": ele.productId,
                    "groupProductCount": ele.productCount
                  };
                  mealDetails.push(ele.productName);
                  groupProductList.push(tempData);
                }
              }
            }
            let tempData = {
              count: 1,
              lists: groupProductList,
              productId: productId
            };
            goodsList.push(tempData);
          }
          if (mealCanBuy) {
            postData = {
              lists: goodsList,
              storeId: storeId
            };
            addShopcart(balance);
          } else {
            canAddToCart = true;
          }
        }).catch(err => {
          canAddToCart = true;
          uni.showToast({
            title: err.message,
            icon: 'none'
          });
        });
      }
    } else {
      canAddToCart = true;
      uni.showToast({
        title: '请先点击头像授权登录后添加哦~',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    canAddToCart = true;
    // 多规格商品跳转商品详情
    let opts = '?productId=' + productId + '&storeId=' + state.storeId + '&source=addshopcart&type=normal';
    if (val.detail.target.dataset.easyscene != null) {
      opts = opts + '&easyScene=' + val.detail.target.dataset.easyscene;
    }
    NAVPAGE.toGoodsDetails(opts);
  }
}
function handleUserLogin() {
  console.log(app.globalData.userInfo);
  const that = this;
  if (app.globalData.userInfo) {
    const user = app.globalData.userInfo;
    state.userInfo = {
      ...user.wxaUser
    };
    if (app.globalData.userInfo.member) {
      state.hasUserInfo = true;
      state.isMember = true;
    } else {
      // 不是会员跳转授权页
      state.userInfo = user.wxaUser;
      state.hasUserInfo = true;
      state.isMember = false;
      NAVPAGE.toAuthorize();
    }
  }
}
function handlePopupPhone() {
  if (!app.globalData.userInfo.member) {
    state.phone = true;
  } else {
    state.phone = false;
  }
}
function handleBindPhone(e) {
  console.log(e.detail);
  if (e.detail.bindMobile === true) {
    handlePopupPhone();
  }
}
function chooseOutcome(e) {
  if (e.detail.outcome === true) {
    state.meals = {
      show: false,
      productId: '',
      storeId: ''
    };
    handleTouchOnGoods(addShopCartData);
  }
}
function getShopCart(storeId) {
  const self = this;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    try {
      const localShopingCart = uni.getStorageSync('wj_shopCartStorage');
      if (localShopingCart) {
        state.shopCart = localShopingCart.items;
        state.shopCartGoodsId = localShopingCart.goodsId;
      } else {
        shopcartService.getCatering(storeId).then(res => {
          let tempShopCart = {};
          let tempShopCartGoodsId = [];
          if (res.items && res.items.length > 0) {
            // 对购物车数据进行处理获得包含有商品productId及对应数量的购物车对象
            res.items.forEach(item => {
              if (!item.grabActivityId && !item.newmbrActivityId) {
                let index = -1;
                for (let i = 0; i < tempShopCartGoodsId.length; i++) {
                  if (item.productId == tempShopCartGoodsId[i]) {
                    index = i;
                  }
                }
                if (index > -1) {
                  tempShopCart[item.productId] = tempShopCart[item.productId] + item.productNum;
                } else {
                  tempShopCart[item.productId] = item.productNum;
                  tempShopCartGoodsId.push(item.productId);
                }
              }
            });
          }
          state.shopCart = tempShopCart;
          state.shopCartGoodsId = tempShopCartGoodsId;
          let localData = {
            goodsId: tempShopCartGoodsId,
            items: tempShopCart
          };
          try {
            uni.setStorageSync('wj_shopCartStorage', localData);
          } catch (e) {}
        }).catch(err => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      }
      let localProductCount = uni.getStorageSync('wj_userProductsCount');
      let counts = String(localProductCount);
      if (counts) {
        app.setTabBarBadge('shopping_cart', counts);
      }
      shopcartService.getProductsCount().then(res => {
        app.setTabBarBadge('shopping_cart', String(res));
        try {
          uni.setStorageSync('wj_userProductsCount', res);
        } catch (e) {}
      }).catch(err => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}
function addLocalGoods(id) {
  try {
    // 读取缓存的商品总量和购物车数据
    let localShopingCart = uni.getStorageSync('wj_shopCartStorage');
    let localProductCount = uni.getStorageSync('wj_userProductsCount');
    // 设置购物车中商品总数量
    localProductCount = Number(localProductCount);
    localProductCount++;
    localProductCount = String(localProductCount);
    app.setTabBarBadge('shopping_cart', localProductCount);
    if (localShopingCart) {
      // 如果存在本地购物车数据
      let shopCartGoodsId = localShopingCart.goodsId;
      let tempShopCart = localShopingCart.items;
      let tempShopCartGoodsId = [];
      let _id = id;
      let index = -1;
      let goodObj = null;
      state.goodsList.some(item => {
        if (item.productId == id || item.id == id) {
          goodObj = {
            ...item
          };
        }
        return item.productId == id || item.id == id;
      });
      if (shopCartGoodsId.length > 0) {
        for (let i = 0; i < shopCartGoodsId.length; i++) {
          tempShopCartGoodsId.push(shopCartGoodsId[i]);
          if (_id == shopCartGoodsId[i]) {
            index = i;
          }
        }
      }
      if (index > -1) {
        //已经存在购物车，只是数量变化
        tempShopCart[_id] = Number(tempShopCart[_id]) + 1;
      } else {
        //新增  
        tempShopCartGoodsId.push(_id);
        tempShopCart[_id] = goodObj && goodObj.initialPurchaseNumber ? goodObj.initialPurchaseNumber : 1;
      }
      state.shopCart = tempShopCart;
      state.shopCartGoodsId = tempShopCartGoodsId;
      let localData = {
        goodsId: tempShopCartGoodsId,
        items: tempShopCart
      };
      uni.setStorageSync('wj_shopCartStorage', localData);
    }
    uni.setStorageSync('wj_userProductsCount', localProductCount);
    // wx.setStorageSync('wj_shopCartStorage', tempShopCart)
  } catch (e) {
    // Do something when catch error
  }
  bus.emit('userShopCartChange', "update");
}
function reduceLocalGoods(id) {
  try {
    // 读取缓存的商品总量和购物车数据
    let localShopingCart = uni.getStorageSync('wj_shopCartStorage');
    let localProductCount = uni.getStorageSync('wj_userProductsCount');
    // 设置购物车中商品总数量
    localProductCount = Number(localProductCount);
    localProductCount--;
    localProductCount = String(localProductCount);
    app.setTabBarBadge('shopping_cart', localProductCount);
    if (localShopingCart) {
      // 如果存在本地购物车数据
      let shopCartGoodsId = localShopingCart.goodsId;
      let tempShopCart = localShopingCart.items;
      let tempShopCartGoodsId = [];
      let _id = id;
      let index = -1;
      if (shopCartGoodsId.length > 0) {
        for (let i = 0; i < shopCartGoodsId.length; i++) {
          tempShopCartGoodsId.push(shopCartGoodsId[i]);
          if (_id == shopCartGoodsId[i]) {
            index = i;
          }
        }
      }
      let goodObj = null;
      state.goodsList.some(item => {
        if (item.productId == id || item.id == id) {
          goodObj = {
            ...item
          };
        }
        return item.productId == id || item.id == id;
      });
      if (index > -1) {
        //已经存在购物车，只是数量变化
        tempShopCart[_id] = goodObj && goodObj.initialPurchaseNumber && goodObj.initialPurchaseNumber >= Number(tempShopCart[_id]) ? Number(tempShopCart[_id]) - goodObj.initialPurchaseNumber : Number(tempShopCart[_id]) - 1;
        if (tempShopCart[_id] <= 0) {
          tempShopCartGoodsId.splice(index, 1);
        }
      }
      state.shopCart = tempShopCart;
      state.shopCartGoodsId = tempShopCartGoodsId;
      let localData = {
        goodsId: tempShopCartGoodsId,
        items: tempShopCart
      };
      uni.setStorageSync('wj_shopCartStorage', localData);
    }
    uni.setStorageSync('wj_userProductsCount', localProductCount);
    // wx.setStorageSync('wj_shopCartStorage', tempShopCart)
  } catch (e) {
    // Do something when catch error
  }
  bus.emit('userShopCartChange', "update");
}
function handleTouchOnGoods(e) {
  const self = this;
  addLocalGoods(e.target.dataset.id);
}
function checkUserInfo() {
  if (app.globalData.userInfo) {
    // 判断用户是否是会员
    state.hasUserInfo = true;
    if (app.globalData.userInfo.member) {
      state.isMember = true;
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
    if (res.member) {
      state.isMember = true;
      if (state.storeId !== "") {
        if (app.globalData.systemConfigure.showCartModule) {
          getShopCart(state.storeId);
        }
      }
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
onPageScroll(function (e) {
  const searchHeight = 88 * app.globalData.systemInfo.windowWidth / 750;
  if (e.scrollTop > 0 && !state.isSearchFixed) {
    state.isSearchFixed = true;
  } else if (e.scrollTop === 0 && state.isSearchFixed) {
    state.isSearchFixed = false;
  }
  if (e.scrollTop >= app.globalData.systemInfo.screenHeight / 2 && !state.showScrollTop) {
    state.showScrollTop = true;
  } else if (e.scrollTop < app.globalData.systemInfo.screenHeight / 2 && state.showScrollTop) {
    state.showScrollTop = false;
  }
});
function scrollFn(e) {
  let scrollTop = e.detail.scrollTop;
  if (scrollTop > 50) {
    state.isSearchFixed = true;
    state.showScrollTop = true;
  } else {
    state.isSearchFixed = false;
    state.showScrollTop = false;
  }
}
function handleScrollTop() {
  // wx.pageScrollTo({
  //   scrollTop: 0,
  //   duration: 300
  // });
  state.scrollTop = 0;
}
function handleScrolltolower(e) {
  console.log(e);
  console.log(state.page, state.pageCount);
  if (state.page * state.pageSize < state.pageCount && state.showStore) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.page++;
    // 查询活动
    getSearchProduct('', state.nameLikes);
  }
}
</script>
<style scoped>
/* pages/search/search.wxss */
page {
  background: #F3F4F6;
}
.search {
  display: flex;
  align-items: center;
  padding: 0 20rpx 20rpx;
  position: relative;
  background: #fff;
  width: 750rpx;
  box-sizing: border-box;
}

.banner-box {
    width: 100%;
    padding: 0 40rpx;
    box-sizing: border-box;
}

.banner-box image {
    width: 100%;
    height: 100%;
    display: block;
}

.top-search-block {
  width: 100%;
  height: 82rpx;
}

.search .search-box {
  width: 560rpx;
  padding-right: 20rpx;
}

/* .search .search-btn {
  width: 110rpx;
  height: 60rpx;
  padding: 0;
  font-size: 28rpx;
  line-height: 60rpx;
  background: #009f55;
  color: #fff;
  border-radius: 10rpx;
}

.search .search-btn::after {
  border: 0;
  border-radius: 0;
} */

.history {
  padding: 0rpx 30rpx;
  font-size: 28rpx;
}

.history .title {
  height: 90rpx;
  line-height: 90rpx;
}

.history .title text {
  text-align: right;
  display: inline-block;
  float: right;
}

.history .history-item {
  display: inline-block;
  height: 60rpx;
  padding: 0rpx 40rpx;
  line-height: 60rpx;
  max-width: 100%;
  box-sizing: border-box;
  background: #e7e7e7;
  border-radius: 10rpx;
  margin-right: 40rpx;
  margin-bottom: 20rpx;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-box {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20rpx;
}

.goods-item {
  min-height: 180rpx;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 27rpx 0 28rpx 0;
  overflow: hidden;
}

.goods-img-box {
  width: 256rpx;
  height: 256rpx;
  overflow: hidden;
  float: left;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.goods-img-box image {
  width: 100%;
  height: 100%;
}

.goods-img-box .no-balance {
  position: absolute;
  top: 0;
  left: 0;
}

.goods-info {
  width: calc(100% - 285rpx);
  /* height: 100%; */
  min-height: 210rpx;
  position: relative;
  float: right;
}

.goods-info .goods-introduce {
  font-size: 22rpx;
  color: #009136;
  height: 30rpx;
  line-height: 30rpx;
  font-weight: bold;
}

.goods-info .goods-introduce>text {
  padding: 0 10rpx;
  height: 30rpx;
  border-radius: 6rpx;
  background: #009136;
  color: #fff;
  font-size: 20rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
}

.goods-info .goods-name text {
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 6rpx;
  background: #009136;
  color: #fff;
  font-size: 22rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
  flex-shrink: 0;
  
}

.goods-info .goods-desc,
.goods-info .goods-sold {
  display: block;
  width: 100%;
  overflow: hidden;
  word-break: keep-all;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.goods-info .goods-name {
  color: #333;
  font-size: 25rpx;
  line-height: 30rpx;
  height: 44rpx;
  font-weight: bold;
  margin: 10rpx 0 5rpx 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.goods-info .goods-name view {
  width: 100%;
  font-weight: Medium;
}
.goods-item .goods-info .goods-name view  {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}

.goods-info .goods-labels {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30rpx;
  margin: 10rpx 0 5rpx 0;
}

.goods-info .goods-labels view {
  /* width: 60rpx; */
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 5rpx;
  border: 1rpx solid #ff8561;
  font-size: 18rpx;
  line-height: 42rpx;
  color: #ff8561;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 8rpx;
  font-weight: normal;
  box-sizing: border-box;
  flex-shrink: 0;
}

.goods-info .goods-desc,
.goods-info .goods-sold {
  color: #999999;
  height: 32rpx;
  font-size: 20rpx;
}

.goods-info .goods-sold {
  margin-top: 5rpx;
}

.goods-price {
    padding-top: 25rpx;
    position: relative;
  color: #ff8561;
  font-size: 20rpx;
  margin-top: 22rpx;
  line-height: 40rpx;
}

.goods-price .nowPrice {
  font-size: 32rpx;
  font-weight: 800;
  margin-right: 16rpx;
}
.goods-price .rise {
  margin: 0 16rpx 0 -6rpx;
}

.goods-price .oldPrice {
  font-size: 22rpx;
  color: #999;
  text-decoration: line-through;
}

.vip-price {
  font-size: 24rpx;
  line-height: 36rpx;
  color: #171613;
  display: inline-flex;
  align-items: center;
}

.vip-price text {
  flex-shrink: 0;
}

.vip-price .vip-label {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 71rpx;
  height: 28rpx;
  flex-shrink: 0;
  margin-top: -4rpx;
}

.vip-price .vip-label image {
  width: 71rpx;
  height: 25rpx;
}

.vip-price .vip-label text {
  white-space: nowrap;
  min-width: calc(100% - 12rpx);
  height: 100%;
  padding: 0 6rpx;
  display: inline-block;
  font-size: 18rpx;
  line-height: 25rpx;
  text-align: center;
  color: #ffeba5;
  background: #403e3e;
  position: absolute;
  left: 6rpx;
  top: 2rpx;
  z-index: 2;
  border-radius: 4rpx;
}

.cart-control {
  position: absolute;
  right: -20rpx;
  bottom: -2rpx;
  width: 164rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 80rpx;
  text-align: center;
  transform: translateY(25%);
}

.add-box,
.reduce-box {
  /* width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  padding: 0; */
  
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  padding: 0;
  position: absolute;
  right: 30rpx;
  background-color: #FF8425;
}

/* .add-box {
  position: absolute;
  right: 0;
} */

.reduce-box {
  position: absolute;
  left: 0;
}

.add-box button,
.reduce-box button {
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1;
}

.add-box button::after,
.reduce-box button::after {
  border: 0;
}

.cart-control .cart-count {
  font-size: 28rpx;
  color: #454545;
  height: 100%;
}
.add-box .cart-count {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  font-size: 18rpx;
  background-color: #FF2000;
  color: #fff;
  height: 24rpx;
  border-radius: 12rpx;
  line-height: 24rpx;
  padding: 0 6rpx;
}
button.button-hover {
  color: transparent;
  background-color: transparent;
  border: none;
}

.add-img,
.reduce-img {
  width: 29rpx;
  height: 27rpx;
  padding: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* width: 40rpx;
  height: 40rpx;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -20rpx;
  margin-left: -20rpx; */
}

/* 语音 */

.microphone-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  position: fixed;
  padding-bottom: 24rpx;
}

.microphone-tips {
  width: 100%;
  font-size: 34rpx;
  line-height: 50rpx;
  color: #444;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 102rpx;
}

.microphone-tips text {
  display: block;
  width: 100%;
}

.microphone-btn {
  height: 90rpx;
  width: 618rpx;
  border-radius: 40rpx;
  background: #e5e5e5;
  color: #444;
  font-size: 36rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.microphone-btn image {
  width: 56rpx;
  height: 56rpx;
  margin-right: 30rpx;
}

.hud-container {
  position: fixed;
  width: 248rpx;
  height: 248rpx;
  left: 50%;
  top: 50%;
  margin-left: -124rpx;
  margin-top: -124rpx;
  z-index: 999;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hud-container image {
  width: 70rpx;
  margin-bottom: 16px;
}

.hud-container text {
  font-size: 28rpx;
  color: #fff;
}

/*抛物线动画*/

.good_box {
  width: 210rpx;
  height: 210rpx;
  position: fixed;
  overflow: hidden;
  left: 50%;
  top: 50%;
  z-index: +99;
  display: flex;
  justify-content: center;
  align-items: center;
}

.good_box image {
  width: 210rpx;
  height: 210rpx;
}

.scroll-top {
  width: 92rpx;
  height: 92rpx;
  position: fixed;
  right: 20rpx;
  bottom: 20%;
  z-index: 6;
}
.labels-board {
  font-size: 28rpx;
  line-height: 48rpx;
  color: #454545;
  background: #fff;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  /* border-top: 1px solid #F1F1F1; */
}
.labels-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
.labels-tag {
  border: 1rpx solid #ff7200;
  color: #ff7200;
  font-size: 18rpx;
  height: 28rpx;
  line-height: 28rpx;
  padding: 0rpx 8rpx;
  flex-shrink: 0;
  margin-top: 2rpx;
  margin-left: 10rpx;
  margin-right: 10rpx;
}
.labels-content {
  color: #ff7200;
  font-size: 18rpx;
  height: 28rpx;
  line-height: 28rpx;
  flex-shrink: 0;
  margin-top: 2rpx;
}
.labels-title{
  flex-shrink: 0;
}

.goods-price .price {
  color: #FF8425;
  font-size: 43rpx;
}

.goods-price .front-money {
  color: #FF8425;
  margin-left: 49rpx;
}

.goods-price .front-money .price {
  font-size: 43rpx;
  color: #FF8425;
}
.goods-price .price text,
.goods-price .front-money .price text {
  font-size: 25rpx;
  font-weight: 400;
}
.advance-time {
  font-size: 24rpx;
  color: #999;
  line-height: 32rpx;
  margin: 10rpx 0 5rpx 0;
}

.advance-time text {
  display: block;
}
.price-item {
  display: inline-block;
}
.search-page-box .search-main {
  background-color: transparent;
  color: rgb(37, 37, 37);
  border: 1px solid #e5e5e5;
  padding-right: 60rpx;
  box-sizing: border-box;
  /* border-radius: 30rpx; */
}
.search-page-box .search-main input {
  /* padding-right: 60rpx; */
  padding-left: 20rpx;
}
.search-page-box .search-main label {
  text-align: left;
  padding-left: 20rpx;
}
.topHandleView .clear-img {
  position: absolute;
  width: 30rpx;
  right: 120rpx;
  z-index: 100;
}
.topHandleView{
    position: relative;
    width: 600rpx;
    height: 70rpx;
    /* background-color: rgba(255,255,255,.9); */
    border-radius: 35rpx;
    /* justify-content: space-between; */
    /* margin: 0 auto; */
    border: 1px solid #ccc;
    display: flex;
    color: #A0A0A0;
    font-size: 28rpx;
    padding: 0 20rpx;
    align-items: center;
    box-sizing: border-box;
    /* margin: 0 auto; */
}
.topHandleView>image{
  width: 120rpx;
  height: 40rpx;
  margin-right: 22rpx;
}

.order-box image {
  width: 40rpx;
  max-height: 50rpx;
  margin-bottom: 8rpx;
}
.top-info {
    padding: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.order-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #333333;
  flex: 1 1 auto;
  padding: 4rpx 0;
}
.order-box image {
  width: 25rpx;
}
.search-btn {
  position: absolute;
  right: 4rpx;
  width: 120rpx;
  height: 60rpx;
  background: #F34C23;
  border-radius: 30rpx;
  font-size: 28rpx;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}



.recommend-store-loading {
  padding: 50rpx 40rpx 0 40rpx;
}

.recommend-store-loading .item-box {
  display: flex;
}

.recommend-store-loading .item-box .img-box {
  width: 210rpx;
  height: 210rpx;
  border-radius: 6rpx;
  background: #EFEFEF;
  margin-right: 27rpx;
  flex-shrink: 0;
}

.recommend-store-loading .item-box .info-box {
  width: calc(100% - 237rpx);
}

.recommend-store-loading .item-box .info-box .name {
  width: 365rpx;
  height: 39rpx;
  background: #EFEFEF;
  border-radius: 2rpx;
  margin-bottom: 20rpx;
}

.recommend-store-loading .item-box .info-box .desc {
  width: 336rpx;
  height: 26rpx;
  background: #EFEFEF;
  border-radius: 2rpx;
  margin-bottom: 20rpx;
}

.recommend-store-loading .item-box .info-box .price {
  width: 262rpx;
  height: 26rpx;
  background: #EFEFEF;
  border-radius: 2rpx;
}


.store-title {
  text-align: center;
  width: 400rpx;
  padding: 0 18rpx;
  min-height: 50rpx;
  /* background: #e5fffa; */
  border-radius: 25px;
  font-size: 28rx;
  line-height: 50rpx;
  color: #454545;
  font-weight: bold;
  margin: 30rpx auto 40rpx auto;
}
.store-title image {
  width: 100%;
}
.store-title>text {
  display: inline-block;
  position: relative;
  padding: 0 13rpx;
}

.store-title>text::before,
.store-title>text::after {
  content: '';
  width: 103rpx;
  height: 2rpx;
  background: #8b8b8c;
  position: absolute;
  top: 25rpx;
  display: block;
}

.store-title>text::before {
  left: -103rpx;
}

.store-title>text::after {
  right: -103rpx;
}

.goods-box {
  padding: 20rpx 20rpx 0 20rpx;
  /* display: flex; */
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: 50rpx;
}
.store-box {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
}
.recommend-store-msg {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}
.store-img {
  width: 108rpx;
  height: 108rpx;
  margin-right: 20rpx;
  flex: 0 0 auto;
}
.store-img image {
  width: 100%;
  max-height: 100%;
  max-width: 100%;
}
.store-msg {
  color: #000000;
  font-size: 32rpx;
}
.store-msg-name {
  margin-bottom: 20rpx;
  width: 520rpx;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
}
.store-detail-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #999999;
  font-size: 24rpx;
}
.store-detail {
  display: flex;
}
.detail-item {
  padding: 0 10rpx;
  height: 35rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  margin-right: 10rpx;
  box-sizing: border-box;
}
.product-img {
  width: 150rpx;
  height: 150rpx;
  margin-bottom: 10rpx;
}
.product-img image {
  width: 100%;
  max-height: 100%;
  border-radius: 20rpx;
}
.product-name {
  margin-bottom: 10rpx;
  width: 140rpx;
  font-size: 24rpx;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
}
.gm-goods-price {
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 28rpx;
  color: #F34C23;
}
.oldPrice {
  color: #999999;
  text-decoration-line: line-through;
  margin-left: 10rpx;
  font-size: 20rpx;
}
.recommend-store-end {
  width: 100%;
  height: 10rpx;
}
.scroll-view_H {
  display: flex;
  height: 250rpx;
}
.scroll-view_H > view {
  margin-right: 16rpx;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>