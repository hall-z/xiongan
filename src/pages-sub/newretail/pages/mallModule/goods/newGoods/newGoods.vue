<template>

<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="search" :style="state.isSearchFixed ? 'position: fixed;z-index:2;top:' + navHeight + 'px;' : 'position: relative;'">
  <!--<template is="searchTemplate" :data="state.searchLabelShow, state.searchFocus, state.searchItem, state.searchText, state.placeholderText"></template>-->
  <button class="search-btn" :style="'background: ' + state.themeColor" @click="toSearch">搜索</button>
</view>
<view class="content">
  <view class="ad-box" v-if="state.banners.length > 0">
    <!-- <image class="ad-img" src="{{pictureUrl}}" mode="aspectFit|aspectFill|widthFix" ></image> -->
    <swiper class="swiper" autoplay="true" interval="5000" circular="true">
      <view v-for="(item , index) in state.banners" :key="index">
        <swiper-item class="swiper-item" :data-id="item.id" @click="bannerJumping">
          <image :src="item.pictureUrl" class="slide-image" mode="widthFix"></image>
        </swiper-item>
      </view>
    </swiper>
  </view>
  <view class="goods-box">
    <view v-for="(item , index) in state.fineQualityGoodsList" :key="index">
      <coupon-good :goods="item" @click="toGoodsDetail" @addShopCart="addShopCart"></coupon-good>
    </view>
  </view>
</view>
<button class="loading-btn" :loading="state.loading" :hidden="!state.loading">正在加载...</button>
<view class="order-end" :hidden="!state.noMore">~我也是有底线的~</view>
<view class="no-data" :style="'color: ' + state.themeColor + ';'" :hidden="state.fineQualityGoodsList.length > 0">
  <image :src="state.imagesPath.imgNoData"></image>
  <button @click="toIndex" :style="'color: ' + state.themeColor + ';border: 1rpx solid ' + state.themeColor + ';'">随便逛逛</button>
</view>
<!-- 加入购物车图片 -->
<view class="good_box" :hidden="hide_good_box" :animation="animation" :style="'left:' + bus_x + 'px;top:' + bus_y + 'px;'">
  <image :src="goodsBoxImage" mode="aspectFit"></image>
</view>
<view class="flow-car" @click="toShopCar">
  <image :src="state.imagesPath.flowCart"></image>
  <view class="red-hint" :hidden="!(state.cartCount > 0)">{{state.cartCount}}</view>
</view>
<image class="scroll-top" v-if="state.showScrollTop" :src="state.imagesPath.scrollTop" @click="handleScrollTop"></image>
</template>
<script setup>
import _apiNewGoodsServiceJs from "@/service/api/newretail/newGoodsService";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsAuthorizeJs from "@/utils/newretail/authorize";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
import _apiShopcartServiceJs from "@/service/api/newretail/shopcartService";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import _apiBannerServiceJs from "@/service/api/newretail/bannerService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onPageScroll } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/goods/newGoods/newGoods.js
const bannerService = _apiBannerServiceJs;
const productService = _apiProductServiceJs;
const shopcartService = _apiShopcartServiceJs;
const couponService = _apiCouponServiceJs;
const util = _utilsUtilsJs;
const NAVPAGE = _utilsNavPageJs;
const ADDRESS = _utilsAddressJs;
const AUTHORIZE = _utilsAuthorizeJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const themeManager = _utilsThemeManagerJs;
const newGoodsService = _apiNewGoodsServiceJs;
import bus from 'iny-bus';

//获取应用实例
let canAddToCart = true;
const state = reactive({
  navigationBarTitle: "新品专区",
  imagesPath: IMGAGESPATH,
  userInfo: {},
  storeId: '',
  store: '',
  searchCount: true,
  searchLabelShow: false,
  searchFocus: false,
  searchText: '请输入搜索内容',
  searchItem: "",
  fineQualityGoodsList: [],
  searchHistory: [],
  nameLikes: '',
  placeholderText: '',
  keyboardHeight: 0,
  phone: false,
  meals: {
    show: false,
    productId: '',
    storeId: ''
  },
  hasUserInfo: false,
  page: 1,
  pageSize: 10,
  pageCount: 1,
  noMore: false,
  loading: false,
  cartCount: 0,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  vipGradeConfig: null,
  searchHeight: 44,
  isSearchFixed: false,
  showScrollTop: false,
  fineQualityGoodsList: [],
  banners: [] // 广告图
});
function handleFocus(e) {
  state.searchLabelShow = true;
  state.searchItem = state.nameLikes;
  keywordLikes = state.nameLikes;
}
function handleInputFocus(e) {
  console.log(e.detail);
  state.keyboardHeight = e.detail.height;
}
function handleBlur(e) {
  if (!e.detail.value) {
    state.searchLabelShow = false;
    state.keyboardHeight = 0;
    state.placeholderText = '';
    keywordLikes = "";
  } else {
    state.keyboardHeight = 0;
  }
}
function handleInput(e) {
  state.nameLikes = e.detail.value;
  state.placeholderText = '';
}
function toSearch() {
  const that = this;
  let nameLikes = state.nameLikes;
  if (!nameLikes) {
    uni.showToast({
      title: '请输入您想搜索的商品名称！',
      icon: "none",
      duration: 2000
    });
  } else {
    nameLikes = nameLikes.replace(/(^\s*)|(\s*$)/g, "");
    state.searchItem = nameLikes;
    state.searchLabelShow = true;
  }
  getSearchProduct(nameLikes);
}
function handleConfirm(e) {
  console.log(e);
  if (!e.detail.value) {
    state.searchLabelShow = false;
    state.keyboardHeight = 0;
    uni.showToast({
      title: '请输入您想搜索的商品名称！',
      icon: "none",
      duration: 2000
    });
    getSearchProduct('');
  } else {
    let nameLikes = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
    getSearchProduct(nameLikes);
  }
}
function getSearchProduct(_keywordLikes) {
  const that = this;
  if (_keywordLikes.indexOf("，")) {
    let keywords = _keywordLikes.split("，");
    _keywordLikes = "";
    keywords.forEach(item => {
      _keywordLikes = _keywordLikes + item + ",";
    });
    _keywordLikes = _keywordLikes.substring(0, _keywordLikes.length - 1);
  }
  keywordLikes = _keywordLikes;
  state.page = 1;
  state.pageCount = 1;
  state.noMore = false;
  state.fineQualityGoodsList = [];
  handleQuery(state.page);
}
function toGoodsDetail(e) {
  let res = e.detail;
  let opts = '?productId=' + res.id + '&storeId=' + state.storeId + '&type=normal';
  NAVPAGE.toGoodsDetails(opts);
}
function getShopCart(storeId) {
  const self = this;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    const localShopingCart = uni.getStorageSync('wj_shopCartStorage');
    state.shopCart = localShopingCart.items;
    state.shopCartGoodsId = localShopingCart.goodsId;
    let localProductCount = uni.getStorageSync('wj_userProductsCount');
    let counts = String(localProductCount);
    if (counts) {
      app.setTabBarBadge('shopping_cart', counts);
    }
    shopcartService.getProductsCount().then(res => {
      let count = String(res);
      app.setTabBarBadge('shopping_cart', String(res));
      state.cartCount = count;
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
  }
}
function toShopCar() {
  NAVPAGE.toShopcart();
}
function toIndex() {
  NAVPAGE.toHome();
}
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
  toAdPage(advertisementInfo, 'banner');
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
onLoad(function (_options) {
  const self = this;
  eventId = bus.on('userShopCartChange', () => {
    if (app.globalData.storeInfo) {
      getShopCart(app.globalData.storeInfo.id);
    }
  });
  // 判断globalData.storeInfo有没有数据，有数据，则使用选择的门店数据，没有，则根据当前地理位置获取最近门店
  state.navHeight = app.globalData.navHeight;
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig;
  state.themeColor = app.globalData.uiconfig.themeColor;
  if (app.globalData.storeInfo && app.globalData.storeId === '') {
    initPage();
    getShopCart(state.storeId);
    // 统计PV
    ANALYSIS.PVStatistics(state.storeId);
  } else {
    // 获取当前地理位置，然后筛选出最近的门店，根据当前门店获取门店的商品
    ADDRESS.getLocation().then(res => {
      app.globalData.storeInfo = res;
      initPage();
      getShopCart(res.id);
      // 统计PV
      ANALYSIS.PVStatistics(res.id);
    }).catch(err => {
      console.log(err);
    });
  }
  if (options.shareId && options.shareId != '' && options.shareId != undefined) {
    const shareId = options.shareId;
    try {
      uni.setStorageSync('wj_sharingId', shareId);
    } catch (e) {}
  }
  // 获取当前页面分享图
  getSharePictures();

  // 获取用户信息
  checkUserInfo();

  // 获取广告图
  getBannerList(state.storeId);
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {
  bus.remove('userShopCartChange', eventId);
});
onPullDownRefresh(function () {
  state.fineQualityGoodsList = [];
  state.page = 1;
  state.pageCount = 1;
  state.noMore = false;
  onLoad(options);
  uni.stopPullDownRefresh();
});
onReachBottom(function () {
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true;
    let page = state.page;
    ++page;
    handleQuery(page);
  } else {
    // 没有下一页，提示已经查询完毕
    if (state.fineQualityGoodsList.length > 0) {
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
function initPage() {
  // 更新页面门店相关数据，显示当前门店
  state.store = app.globalData.storeInfo.name;
  state.storeId = app.globalData.storeInfo.id;
  handleQuery(state.page);
}
function addShopCart(val) {
  if (!canAddToCart) {
    console.log("==============================正在加入购物车");
    return;
  }
  canAddToCart = false;
  const that = this;
  if (canAddToCart === false) {
    let productId = val.detail.id;
    let business = val.detail.business;
    let balance = val.detail.balance;
    let style = val.detail.style;
    let hasSharingPersonId = false;
    const mode = val.detail.type;
    let storeId = '';
    let loginStatus = checkAuth();
    if (style !== 'SPEC_PARENT' && style !== 'MEALS2') {
      if (loginStatus) {
        if (business === "DISTRIBUTION") {
          try {
            let data = uni.getStorageSync('wj_distributionStore');
            if (data) {
              storeId = data.id;
            }
          } catch (e) {}
        } else {
          storeId = app.globalData.storeInfo.id;
        }
        let postData = {
          storeId: storeId,
          lists: [{
            count: 1,
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
              count: -1,
              productId: productId
            }]
          };
        }
        if (business === 'DISTRIBUTION') {
          balance = 0;
          productService.getDetails(storeId, productId).then(res => {
            if (res) {
              balance = res.balance;
            }
            if (style === 'MEALS') {
              getCateringDetailsById(productId, storeId);
            } else {
              addShopcart(balance);
            }
          }).catch(err => {
            canAddToCart = true;
          });
        } else if ((business === 'CATERING' || business === 'DISTRIBUTION') && style === 'MEALS') {
          getCateringDetailsById(productId, storeId);
        } else {
          addShopcart(balance);
        }
        function getCateringDetailsById(productId, storeId) {
          productService.getCateringDetailsById(productId, storeId).then(res => {
            const self = this;
            let cateringGroupProducts = res.cateringGroupProducts;
            let productId = res.id;
            let goodsList = [];
            let mealCanBuy = true;
            let unBuyGoods = null;
            let unChoiceGroup = null;
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
        function addShopcart(balance) {
          if (app.globalData.userInfo.member) {
            if (balance === 0 || balance === null || balance === '') {
              uni.showToast({
                title: '门店中该商品库存不足，请选购其他商品~',
                icon: 'none',
                duration: 2000
              });
              canAddToCart = true;
            } else {
              shopcartService.cateringAdd(postData).then(res => {
                let opts = {
                  products: [{
                    productId: productId
                  }]
                };
                canAddToCart = true;
                app.globalData.storeIdentification = business === 'DISTRIBUTION' ? 'distribution' : 'normal';
                app.globalData.isShopCartChange = true;
                uni.showToast({
                  title: '添加购物车成功~',
                  icon: 'none',
                  duration: 2000
                });
                if (app.globalData.isShoppingGuidanceRecordGoods && hasSharingPersonId) {
                  util.removeSharingPersonInfo();
                }
                // if (mode === 'reduce') {
                //   that.reduceLocalGoods(productId)
                // } else {
                //   that.handleTouchOnGoods(that.addShopCartData)
                // }
                getProductsCount();
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
            NAVPAGE.toAuthorize();
          }
        }
      } else {
        canAddToCart = true;
        uni.showToast({
          title: '请先授权登录后添加哦~',
          icon: 'none',
          duration: 2000
        });
      }
    } else {
      canAddToCart = true;
      // 多规格商品跳转商品详情
      let opts = '?productId=' + productId + '&storeId=' + state.storeId + '&type=normal&source=addshopcart';
      NAVPAGE.toGoodsDetails(opts);
    }
  } else {
    canAddToCart = true;
  }
}
function getProductsCount() {
  const that = this;
  shopcartService.getProductsCount().then(res => {
    let count = String(res);
    state.cartCount = count;
  }).catch(err => {
    uni.showToast({
      title: err.message,
      icon: 'none',
      duration: 2000
    });
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
function handleUserLogin() {
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
function handleQuery(page) {
  const self = this;
  let storeIdIn = [state.storeId];
  ADDRESS.getDistributionStore().then(res => {
    if (res) {
      storeIdIn.push(res.id);
    }
    handleQueryNewGoods(page, storeIdIn);
  }).catch(err => {
    handleQueryNewGoods(page, storeIdIn);
  });
}
function handleQueryNewGoods(page, storeIdIn) {
  const self = this;
  let opts = {
    page: page,
    pageSize: 10,
    storeIdIn: storeIdIn.join(","),
    nameLikes: keywordLikes != null ? keywordLikes : ""
  };
  newGoodsService.query(opts).then(res => {
    let tempList = state.fineQualityGoodsList;
    tempList = tempList.concat(res.records);
    state.fineQualityGoodsList = tempList;
    state.pageCount = res.pageCount;
    state.page = page;
    state.loading = false;
  }).catch(error => {
    uni.showToast({
      title: error.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function getBannerList(storeId) {
  bannerService.getStoreBannerList('NEW_GOODS', storeId).then(res => {
    state.banners = res;
    if (res && res.length > 0) {
      // 如果设置了banner图，等banner查询后设置加载结束
      state.loading = false;
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
function handleScrollTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  });
}
</script>
<style scoped>
/* pages/mallModule/goods/newGoods/newGoods.wxss */
page {
  background-color: #F8F6F9;
}

.search {
  display: flex;
  align-items: center;
  padding-right: 40rpx;
  position: relative;
  background: #fff;
  width: 750rpx;
  box-sizing: border-box;
  z-index: 99;
}

.top-search-block {
  width: 100%;
  height: 82rpx;
}

.search .search-box {
  width: 560rpx;
  padding-right: 20rpx;
}

.search .search-btn {
  width: 110rpx;
  height: 60rpx;
  padding: 0;
  font-size: 28rpx;
  line-height: 60rpx;
  background: #FE8800;
  color: #fff;
  border-radius: 10rpx;
}

.search .search-btn::after {
  border: 0;
  border-radius: 0;
}

.content {
	width: 100%;
  height: 100%;
	background-color: #F8F6F9;
}

.content .ad-box {
  width: 100%;
  height: 275rpx;
  padding: 25rpx 29rpx 0 29rpx;
  box-sizing: border-box;
}
/* .content .ad-box .ad-img {
	width: 100%;
  height: 250rpx;
  border-radius: 20rpx;
} */

.content .ad-box .swiper {
  width: 100%;
  height: 250rpx;
  border-radius: 18rpx;
  overflow: hidden;
}

.content .ad-box .swiper .swiper-item {
  width: 100%;
  height: 100%;
}
.content .ad-box .swiper .swiper-item .slide-image {
  width: 100%;
  height: 100%;
  margin-right: 40rpx;
}

.goods-box {
  width: 100%;
  min-height: 100%;
	display: flex;
	margin-top: 33rpx;
  padding: 0 19rpx 0 19rpx;
  box-sizing: border-box;
  justify-content: space-between;
  flex-wrap: wrap;
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
  color: #FE8800;
  font-size: 28rpx;
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
  background-color: #F8F6F9;
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

.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #F8F6F9;
}

.no-data image {
  margin-top: 30%;
  width: 242rpx;
  height: 261rpx;
}

.no-data button {
  color: #009f55;
  border: 1rpx solid #009f55;
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

.flow-car {
  position: fixed;
  left: 40rpx;
  bottom: 200rpx;
  width: 120rpx;
  height: 120rpx;
  z-index: 7;
}

.red-hint {
  position: absolute;
  top: 25rpx;
  right: 25rpx;
  background-color: red;
  color: white;
  font-size: 30rpx;
  height: 40rpx;
  width: 40rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-car image {
  width: 120rpx;
  height: 120rpx;
}

.scroll-top {
  width: 92rpx;
  height: 92rpx;
  position: fixed;
  right: 20rpx;
  bottom: 20%;
  z-index: 6;
}
</style>