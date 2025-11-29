<template>
<!--pages/mallModule/recommend/square/square.wxml-->
<view>
<navigationBar title="种草广场"></navigationBar>
<view class="square-page">
  <view class="banner-box">
    <swiper class="swiper" autoplay="true" :interval="rotationSpeed || 3000" circular="true" :current="swiperCurrent" v-if="state.bannerList.length > 0">
      <!-- <block wx:for="{{bannersA}}" wx:key="index"> -->
      <swiper-item v-for="(item , index) in state.bannerList" :key="index" class="swiper-item" :data-item="item" :data-id="item.id" @click="bannerJumping">
        <image mode="widthFix" :src="item.pictureUrl" class="slide-image"></image>
      </swiper-item>
    </swiper>
  </view>
  <view class="fixed-top" style="top:160rpx">
    <view class="filter-tab-list">
      <view class="filter-tab-item" @click="changeTabFilter" data-id="new">
        最新
        <image v-if="state.currentFieldValue === 'new'" :src="state.imagesPath.square_filter_active" mode="widthFix"></image>
      </view>
      <view class="filter-tab-item" @click="changeTabFilter" data-id="hot">
        最热
        <image v-if="state.currentFieldValue === 'hot'" :src="state.imagesPath.square_filter_active" mode="widthFix"></image>
      </view>
      <view class="filter-my" @click="toMy">
        <image :src="state.imagesPath.square_my_icon" mode="widthFix"></image>
        <view>我的</view>
      </view>
    </view>
    <view class="topic-list">
      <scroll-view scroll-x="" style="display:flex;white-space: nowrap;width: 100%;" @scrolltolower="onTopicReachBottom">
        <view class="topic-item" v-for="(item , index) in state.topicList" :key="index" :data-id="item.id" :style="getStyle(state.selectedTopicIds, item.id, state.themeColor)" @click="handleTopicTap">
          #{{item.name}}
        </view>
      </scroll-view>
    </view>
  </view>
  <scroll-view scroll-y="" style="width: 100%; height: 100%;padding: 0 20rpx 60rpx;box-sizing: border-box;" type="custom" @scrolltolower="onEssayListReachBottom" v-if="state.myRecommend.length > 0">
    <grid-view type="masonry" cross-axis-count="2" cross-axis-gap="10" main-axis-gap="10" style="width: 100%;">
      <view v-for="(item , index) in state.myRecommend">
        <view class="essay-item" :data-index="index" @click="toDetails" :data-row="item">
          <view class="essay-pic">
            <video v-if="isMp4(item.imgUrlList[0])" id="myVideo" class="myVideo" :src="item.imgUrlList[0]" :controls="false" :show-center-play-btn="false" :show-play-btn="false" :show-mute-btn="false" :picture-in-picture-mode="['push', 'pop']"></video>
            <image v-else :src="item.imgUrlList[0]" mode="widthFix"></image>
          </view>
          <view class="essay-title">{{item.title}}</view>
          <view class="essay-info">
            <view class="essay-info-lt">
              <image class="essay-info-lt-avatar" :src="item.memberAvatar ? item.memberAvatar : state.imagesPath.square_default_avatar" mode="widthFix"></image>
              <view class="essay-info-lt-name">{{item.memberNickname}}</view>
            </view>
            <view class="essay-info-rt" @click.stop="handleLike" :data-index="index">
              <image class="essay-info-rt-like" v-if="item.isLiked" :src="state.imagesPath.is_like_icon" mode="widthFix"></image>
              <image class="essay-info-rt-like" v-else :src="state.imagesPath.is_no_like_icon" mode="widthFix"></image>
              <view class="essay-info-lt-num">{{item.numberLikes}}</view>
            </view>
          </view>
        </view>
      </view>
    </grid-view>
  </scroll-view>
  <!-- <view class="essay-list" wx:if="{{state.myRecommend.length > 0}}">
    <view class="essay-item" wx:for="{{state.myRecommend}}" data-index="{{index}}" bindtap="toDetails" data-row="{{item}}">
      <view class="essay-pic">
        <video wx:if="{{isMp4(item.imgUrlList[0])}}" id="myVideo" class="myVideo" src="{{item.imgUrlList[0]}}"
          controls="{{false}}" show-center-play-btn='{{false}}' show-play-btn="{{false}}" show-mute-btn="{{false}}"
          picture-in-picture-mode="{{['push', 'pop']}}"></video>
        <image wx:else src="{{item.imgUrlList[0]}}" mode="widthFix" ></image>
      </view>
      <view class="essay-title">{{item.title}}</view>
      <view class="essay-info">
        <view class="essay-info-lt">
          <image class="essay-info-lt-avatar"
            src="{{item.memberAvatar ? item.memberAvatar : state.imagesPath.square_default_avatar}}" mode="widthFix" />
          <view class="essay-info-lt-name">{{item.memberNickname}}</view>
        </view>
        <view class="essay-info-rt" catchtap="handleLike" data-index="{{index}}">
          <image class="essay-info-rt-like" wx:if="{{item.isLiked}}" src="{{state.imagesPath.is_like_icon}}"
            mode="widthFix" />
          <image class="essay-info-rt-like" wx:else src="{{state.imagesPath.is_no_like_icon}}" mode="widthFix" ></image>
          <view class="essay-info-lt-num">{{item.numberLikes}}</view>
        </view>
      </view>
    </view>
  </view> -->
  <view class="no-data" v-else>
    <image :src="state.imagesPath.recommend_nonodata" mode="widthFix"></image>
    <view class="no-data-tips">快来发布种草作品吧！</view>
    <view class="no-data-btn" @click="toRelease" :style="'background-color: ' + state.themeColor + ';'">立即发布</view>
  </view>
  <image class="recommend-release" :src="state.imagesPath.recommend_release_icon" @click="toRelease" mode="widthFix"></image>
  
  <image class="scroll-top" v-if="state.showScrollTop" :src="state.imagesPath.scrollTop" @click="handleScrollTop"></image>
  <!-- <button >我的</button> -->
  <!-- <button bindtap="toRelease">发布</button> -->
</view></view>
</template>
<script setup>
import _apiBannerServiceJs from "@/service/api/newretail/bannerService";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _apiRecommendServiceJs from "@/service/api/newretail/recommendService";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onPageScroll } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/recommend/square/square.js
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const recommendService = _apiRecommendServiceJs;
const themeManager = _utilsThemeManagerJs;
const bannerService = _apiBannerServiceJs;
const state = reactive({
  windowWidth: 0,
  // 屏幕宽度
  layoutItems: [],
  // 存储所有项的布局
  imagesPath: IMGAGESPATH,
  isSearchFixed: false,
  showScrollTop: false,
  filterVo: {
    statuses: ["APPROVED"],
    page: 1,
    pageSize: 15,
    parts: 'member'
  },
  myRecommend: [],
  currentFieldValue: 'new',
  topicList: [],
  topicPage: 1,
  topicPageSize: 15,
  topicHasMore: true,
  topicLoading: false,
  selectedTopicIds: [],
  themeColor: app.globalData && app.globalData.uiconfig ? app.globalData.uiconfig.themeColor : '',
  recommendHasMore: true,
  recommendLoading: false,
  topHeight: 0,
  bannerList: [],
  memberInfo: {}
});
function bannerJumping(e) {
  console.log(e);
  const that = this;
  let bannerId = e.currentTarget.dataset.id;
  let dataItem = e.currentTarget.dataset.item;
  const bannerList = state.bannerList;
  let advertisementInfo = null;
  bannerList.forEach(item => {
    if (item.id === bannerId) {
      advertisementInfo = item;
    }
  });
  toAdPage(dataItem || advertisementInfo, 'banner');
}
function toAdPage(pageInfo, pageType, data) {
  const that = this;
  console.log(pageInfo.linkType, 'pageInfo.linkType');
  if (pageInfo.linkType === 'APP') {
    // 应用
    // 判断跳转模块
    if (pageInfo.appReturnType === "PRODUCT_MENU") {
      //跳转商品分类页面
      NAVPAGE.toCategory("?categoryId=" + pageInfo.productMenuId + '&shipmentTypes=' + pageInfo.shipmentTypes);
    } else if (pageInfo.appReturnType === 'MIAOSHA') {
      if (data) {
        NAVPAGE.toSeckill('?grabActivityIdList=' + data);
      } else {
        NAVPAGE.toSeckill();
      }
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
    } else if (pageInfo.appReturnType === "NEW_GOODS") {
      // 新品
      NAVPAGE.toNewGoods();
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
      if (state.uiconfig.isHomePayCodeEnabled) {
        NAVPAGE.toPayCode();
      } else {
        NAVPAGE.toMemberCard();
      }
    } else if (pageInfo.appReturnType === "MY_COUPON") {
      // 我的优惠券
      NAVPAGE.toMyCoupon();
    } else if (pageInfo.appReturnType === "NEWMBR") {
      // 新用户专享
      NAVPAGE.toNewmbrActivity();
    } else if (pageInfo.appReturnType === 'GIFTCARD') {
      // 如果跳转类型是礼品卡，跳转到礼品卡界面
      NAVPAGE.toGiftCardCenter();
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
    } else if (pageInfo.appReturnType === "LIVEROOM") {
      NAVPAGE.toLivePlayerCenter();
    } else if (pageInfo.appReturnType === "SOLITAIRE") {
      NAVPAGE.toSolitaireList();
    } else if (pageInfo.appReturnType === "SIGN_IN") {
      console.log(pageInfo);
      memberSignInByActivity();
    } else if (pageInfo.appReturnType === "PACKAGING") {
      // 打包一口价
      if (pageInfo.packagingId != null) {
        let opts = "?packagingId=" + pageInfo.packagingId;
        NAVPAGE.toPackaging(opts);
      }
    } else if (pageInfo.appReturnType === 'SELFDELIVERY') {
      NAVPAGE.toSefl();
    } else if (pageInfo.appReturnType === 'CYCLE') {
      uni.navigateTo({
        url: '/pages-sub/newretail/pages/mallModule/activity/cycle/cycle'
      });
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
    let opts = '?productId=' + pageInfo.grabProductId + '&storeId=' + app.globalData.storeInfo.id + '&activityId=' + pageInfo.grabActivityId + '&type=secondkill';
    NAVPAGE.toGoodsDetails(opts);
  } else if (pageInfo.linkType === 'PRODUCT') {
    verifyGoods(app.globalData.storeInfo.id, pageInfo.productId, 'normal');
    // 商品 
    // let opts = '?productId=' + pageInfo.productId + '&storeId=' + app.globalData.storeInfo.id + '&type=normal'
    // NAVPAGE.toGoodsDetails(opts)
  } else if (pageInfo.linkType === 'TEAMPRODUCT') {
    // 拼团商品 
    let opts = '?productId=' + pageInfo.teamActivityId + '&storeId=' + app.globalData.storeInfo.id + '&type=group';
    NAVPAGE.toGoodsDetails(opts);
  } else if (pageInfo.linkType === "GIFTCARDACTIVITYDETAILS") {
    // 如果跳转类型是礼品卡详情，根据giftcardActivityId跳转到礼品卡详情页
    let opts = '?giftCardActivityId=' + pageInfo.giftcardActivityId;
    NAVPAGE.toGiftCardBuy(opts);
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
    let url = pageInfo.link;
    // if (pageType === 'activity') {
    //   url = pageInfo.linkUrl
    // } else if (pageType === 'banner') {
    //   url = pageInfo.link
    // }
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
    console.log(webUrl, urlData);
    let jsonUrl = JSON.stringify(urlData);
    let opts = '?webUrl=' + jsonUrl;
    NAVPAGE.toAdvertising(opts);
  } else if (pageInfo.linkType === "SCORE_RAFFLE") {
    if (pageInfo.raffleActivityId) {
      let opts = '?raffleActivityId=' + pageInfo.raffleActivityId;
      NAVPAGE.toRaffle(opts);
    }
  } else if (pageInfo.linkType === "WX_APP") {
    uni.navigateToMiniProgram({
      appId: 'wxe6afc8564bc6f7de',
      path: 'pages/mallModule/index/index/index'
    });
  } else if (pageInfo.linkType === "SIGN_IN") {
    // that.setData({
    //     signShow: true
    //   })
    NAVPAGE.toSign();
  } else if (pageInfo.linkType === "BENEFIT_PLAN") {
    NAVPAGE.toBenefitPlan();
  } else if (pageInfo.linkType === "MEITUAN_XIAOXIANG") {
    NAVPAGE.toMeituan();
  } else if (pageInfo.linkType === "TOURISM_PLAN") {
    let opts = '?id=' + pageInfo.tourismPlanId;
    NAVPAGE.toTourismPlan(opts);
  } else if (pageInfo.linkType === 'SCOREMALL' || pageInfo.linkType === 'SCORECOUPON' || pageInfo.linkType === 'SCOREGOODS' || pageInfo.linkType === 'THIRDPARTYCOUPIN') {
    let linkType = {
      'SCOREMALL': 'score_mall',
      'SCORECOUPON': 'score_coupon',
      'SCOREGOODS': 'score_goods',
      'THIRDPARTYCOUPIN': 'thirdParty_coupon'
    };
    let opts = '?link=' + linkType[pageInfo.linkType];
    NAVPAGE.toScoreMall(opts);
  } else if (pageInfo.linkType == 'SCANCODEBUY') {
    scanProductCode();
  } else if (pageInfo.linkType === 'BACKCASHPRODUCT') {
    if (app.globalData.isShoppingGuide) {
      NAVPAGE.toGuideGoods();
    } else {
      NAVPAGE.toGuideApplyInfo();
    }
  } else if (pageInfo.linkType === 'CARDRECHARGE') {
    uni.navigateToMiniProgram({
      appId: pageInfo.appid,
      path: `${pageInfo.jumpPage}?${pageInfo.jumpParameter}`,
      success(res) {
        console.log('跳转成功');
      },
      fail() {
        console.log('跳转失败');
      }
    });
  } else if (pageInfo.pageUrl) {
    uni.navigateTo({
      url: pageInfo.pageUrl
    });
  }
}
function getBanner() {
  let that = this;
  bannerService.getBannerList('RECOMMEND').then(res => {
    if (res && res.length > 0) {
      state.bannerList = res;
    }
  });
}
onLoad(function (options) {
  if (app.globalData.userInfo) {
    state.memberInfo = app.globalData.userInfo.member;
    state.themeColor = app.globalData.uiconfig.themeColor;
  }
  state.myRecommend = [];
  getMyRecommend(true);
  topicQuery();
  getBanner();
  // this.getMyRecommend();
  // this.topicQuery();
  // this.getBanner();
  // 动态计算顶部高度
  const menuButton = uni.getMenuButtonBoundingClientRect();
  uni.getSystemInfo({
    success: res => {
      const statusBarHeight = res.statusBarHeight;
      const navBarHeight = menuButton.top - res.statusBarHeight + menuButton.height + (menuButton.top - res.statusBarHeight);
      const customHeaderHeight = 520; // rpx
      const windowWidth = res.windowWidth;
      const pxPerRpx = windowWidth / 750;
      const topHeight = statusBarHeight + navBarHeight + customHeaderHeight * pxPerRpx;
      state.topHeight = topHeight;
    }
  });

  //   如果是详情话题点击过来的数据
  if (options.topicId) {
    let obj = {
      currentTarget: {
        dataset: {
          id: options.topicId
        }
      }
    };
    handleTopicTap(obj);
  }
});
onReady(function () {});
onShow(function () {
  if (app.globalData.userInfo) {
    state.memberInfo = app.globalData.userInfo.member;
  }
  state.themeColor = app.globalData.uiconfig.themeColor;
  console.log('进入了show');
});
function toMy() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    NAVPAGE.toRecommendMy();
  } else {
    NAVPAGE.toAuthorize();
  }
  // NAVPAGE.toRecommendMy()
}
function toRelease() {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    NAVPAGE.toRecommendRelease();
  } else {
    NAVPAGE.toAuthorize();
  }
}
function toDetails(e) {
  let item = state.myRecommend[e.currentTarget.dataset.index];
  if (item.status === 'PENDING' || item.status === 'REJECTED') {
    NAVPAGE.toRecommendRelease('?id=' + item.id);
  } else {
    NAVPAGE.toRecommendDetails('?id=' + item.id);
  }
}
function handleScrollTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  });
}
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {
  // 判断是否还有更多，防止重复加载
  if (state.recommendLoading || !state.recommendHasMore) return;
  state.recommendLoading = true;
  let page = state.filterVo.page + 1;
  let params = Object.assign({}, state.filterVo, {
    page
  });
  if (state.selectedTopicIds && state.selectedTopicIds.length > 0) {
    params.topicIds = state.selectedTopicIds;
  }
  recommendService.query(params).then(res => {
    let recommendArr = state.myRecommend;
    let hasMore = true;
    if (res.records && res.records.length > 0) {
      let newArr = handlerDataSort(res.records);
      recommendArr = recommendArr.concat(newArr);
      hasMore = res.records.length === state.filterVo.pageSize;
    } else {
      hasMore = false;
    }
    state.myRecommend = recommendArr;
    state.filterVo.page = page;
    state.recommendHasMore = hasMore;
    state.recommendLoading = false;
  }).catch(() => {
    state.recommendLoading = false;
  });
});
onShareAppMessage(function () {});
onPageScroll(function (e) {
  // const searchHeight = 88 * app.globalData.systemInfo.windowWidth / 750;
  // if (e.scrollTop > 0 && !this.data.isSearchFixed) {
  //   this.setData({
  //   })
  // } else if (e.scrollTop === 0 && this.data.isSearchFixed) {
  //   this.setData({
  //     isSearchFixed: false
  //   })
  // }
  if (e.scrollTop >= app.globalData.systemInfo.screenHeight / 2 && !state.showScrollTop) {
    state.showScrollTop = true;
    state.isSearchFixed = true;
  } else if (e.scrollTop < app.globalData.systemInfo.screenHeight / 2 && state.showScrollTop) {
    state.showScrollTop = false;
    state.isSearchFixed = false;
  }
});
function changeTabFilter(e) {
  let id = e.currentTarget.dataset.id;
  if (id === 'new') {
    setFormValue('orderField', 'approved_time');
    state.currentFieldValue = id;
  } else if (id === 'hot') {
    setFormValue('orderField', 'number_likes');
    state.currentFieldValue = id;
  }
  getMyRecommend(true);
}
function handleTopicTap(e) {
  const id = e.currentTarget.dataset.id;
  let selected = state.selectedTopicIds.slice();
  const idx = selected.indexOf(id);
  if (idx > -1) {
    selected.splice(idx, 1);
  } else {
    selected.push(id);
  }
  state.selectedTopicIds = selected;
}
function getMyRecommend(raload = false, topicIds = null) {
  let that = this;
  if (raload) {
    setFormValue('page', 1);
    state.myRecommend = [];
    state.recommendHasMore = true;
    state.recommendLoading = false;
  }
  uni.showLoading({});
  let params = Object.assign({}, state.filterVo);
  if (topicIds && topicIds.length > 0) {
    params.topicIds = topicIds;
  } else if (state.selectedTopicIds && state.selectedTopicIds.length > 0) {
    params.topicIds = state.selectedTopicIds;
  }
  if (state.currentFieldValue === 'hot') {
    params.orderField = 'number_likes';
  } else {
    params.orderField = 'approved_time';
  }
  if (state.memberInfo && state.memberInfo.id) {
    // params.recommendLike = true
    params.currentMemberId = state.memberInfo.id;
  }
  recommendService.query(params).then(res => {
    let recommendArr = state.myRecommend;
    let hasMore = true;
    if (res.records && res.records.length > 0) {
      let newArr = handlerDataSort(res.records);
      recommendArr.push(...newArr);
      hasMore = res.records.length === state.filterVo.pageSize;
    } else {
      hasMore = false;
    }
    state.myRecommend = recommendArr;
    state.recommendHasMore = hasMore;
    uni.hideLoading();
  }).catch(err => {
    uni.hideLoading();
  });
}
function handlerDataSort(arr) {
  let oneArr = [];
  let twoArr = [];
  arr.forEach((val, idx) => {
    if ((idx + 1) % 2 != 0) oneArr.push({
      ...val
    });
    if ((idx + 1) % 2 == 0) twoArr.push({
      ...val
    });
  });
  // return oneArr.concat(twoArr)
  return arr;
}
function topicQuery(isLoadMore = false) {
  let that = this;
  if (state.topicLoading || !state.topicHasMore) return;
  state.topicLoading = true;
  let page = isLoadMore ? state.topicPage : 1;
  let postData = {
    page: page,
    pageSize: state.topicPageSize,
    statuses: ['ENABLED']
  };
  recommendService.topicQuery(postData).then(res => {
    let topicArr = isLoadMore ? state.topicList : [];
    let hasMore = true;
    if (res.records && res.records.length > 0) {
      topicArr = topicArr.concat(res.records);
      hasMore = res.records.length === state.topicPageSize;
    } else {
      hasMore = false;
    }
    state.topicList = topicArr;
    state.topicPage = hasMore ? page + 1 : page;
    state.topicHasMore = hasMore;
    state.topicLoading = false;
  }).catch(() => {
    state.topicLoading = false;
  });
}
function setFormValue(name, value) {
  if (!name) return;
  state[`filterVo.${name}`] = value;
}
function onEssayListReachBottom() {
  if (state.recommendLoading || !state.recommendHasMore) return;
  state.recommendLoading = true;
  let page = state.filterVo.page + 1;
  let params = Object.assign({}, state.filterVo, {
    page
  });
  if (state.selectedTopicIds && state.selectedTopicIds.length > 0) {
    params.topicIds = state.selectedTopicIds;
  }
  recommendService.query(params).then(res => {
    let recommendArr = state.myRecommend;
    let hasMore = true;
    if (res.records && res.records.length > 0) {
      let newArr = handlerDataSort(res.records);
      recommendArr = recommendArr.concat(newArr);
      hasMore = res.records.length === state.filterVo.pageSize;
    } else {
      hasMore = false;
    }
    state.myRecommend = recommendArr;
    state.filterVo.page = page;
    state.recommendHasMore = hasMore;
    state.recommendLoading = false;
  }).catch(() => {
    state.recommendLoading = false;
  });
}
function handleLike(e) {
  let that = this;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    console.log(e, 'eeeeee');
    uni.showLoading({});
    const index = e.currentTarget.dataset.index;
    const item = state.myRecommend[index];
    const id = item.id;
    console.log(item, 'item');
    let postData = {
      id,
      isLike: !item.isLiked,
      memberId: state.memberInfo.id
    };
    recommendService.like(postData).then(() => {
      const isLiked = !item.isLiked;
      const key = `myRecommend[${index}].isLiked`;
      const numKey = `myRecommend[${index}].numberLikes`;
      state.key = isLiked;
      state.numKey = isLiked ? item.numberLikes + 1 : item.numberLikes - 1;
      uni.hideLoading();
    }).catch(err => {
      uni.hideLoading();
    });
  } else {
    NAVPAGE.toAuthorize();
  }
}
</script>
<style scoped>
/* pages/mallModule/recommend/square/square.wxss */

page {
  background-color: #f2f2f2;
  /* height: 100vh; */
  /* height: 100vh;
  display: flex;
  flex-direction: column; */
}
.fixed-top {
    width: 100%;
    position: sticky;
    z-index: 100;
}
.banner-box {
  width: 100%;
}

.slide-image {
  width: 100%;
}

.swiper {
  height: 400rpx;
}

.filter-tab-list {
  width: 100%;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
  margin-top: -33rpx;
}

.filter-tab-item {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  padding: 0 20rpx;
  position: relative;
}

.filter-tab-list .filter-tab-item:nth-of-type(2) {
  border-left: 1px solid #E2E2E2;
}

.filter-tab-item image {
  position: absolute;
  left: 50%;
  bottom: -19rpx;
  width: 24rpx;
  height: 13rpx;
  transform: translateX(-50%);
}

.filter-my {
  position: absolute;
  right: 22rpx;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
}

.filter-my image {
  width: 18rpx;
  margin-right: 16rpx;
}

.topic-list {
  padding: 23rpx 0 21rpx 20rpx;
  /* border-bottom: 1px solid #F3F3F3; */
  background-color: #f2f2f2;
  margin-top: -1px;
}

.topic-list .topic-item {
  display: inline-block;
  padding: 10rpx 18rpx;
  border-radius: 10rpx;
  border: 1px solid #E2E2E2;
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
  background: #FFFFFF;
  margin-right: 14rpx;
}

.essay-list {
  width: 100%;
  padding: 0 20rpx 60rpx;
  box-sizing: border-box;
  /* display: flex;
  justify-content: space-between;
  flex-wrap: wrap; */
  columns: 2;
  column-gap: 20rpx;
  background-color: #f2f2f2;
  /* height: 100%; */
  margin-top: -1px;
}

.essay-item {
  width: 345rpx;
  border-radius: 10rpx;
  overflow: hidden;
  break-inside: avoid;
  margin-bottom: 20rpx;
}

.essay-pic {
  width: 100%;
}
.essay-pic video {
    width: 100%;
    display: block;
  }
.essay-pic image {
  width: 100%;
  display: block;
}

.essay-title {
  font-weight: 400;
  font-size: 26rpx;
  color: #333333;
  width: 100%;
  padding: 0 16rpx;
  box-sizing: border-box;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  padding-top: 19rpx;
  background-color: #fff;
}

.essay-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22rpx 16rpx 18rpx 16rpx;
  box-sizing: border-box;
  background-color: #fff;
}

.essay-info-lt,
.essay-info-rt {
  display: flex;
  align-items: center;
}

.essay-info-rt {
  height: 48rpx;
  padding-left: 20rpx;
}

.essay-info-lt-avatar {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-right: 11rpx;
}

.essay-info-lt-name {
  font-weight: 400;
  font-size: 20rpx;
  color: #999999;
}

.essay-info-rt-like {
  width: 28rpx;
  height: 24rpx;
  margin-right: 11rpx;
}

.essay-info-lt-num {
  font-weight: 400;
  font-size: 22rpx;
  color: #999999;
}

.scroll-top {
  width: 92rpx;
  height: 92rpx;
  position: fixed;
  right: 20rpx;
  bottom: 20%;
  z-index: 6;
}

.recommend-release {
  position: fixed;
  left: 50%;
  bottom: 6rpx;
  width: 132rpx;
  height: 132rpx;
  z-index: 6;
  transform: translateX(-50%);
}


/* .swiper-item {
  overflow: ;
} */

.no-data {
  width: 100%;
  height: 880rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
}

.no-data image {
  width: 198rpx;
  margin-top: 90rpx;
}

.no-data-tips {
  font-weight: 400;
  font-size: 28rpx;
  color: #999999;
  line-height: 42rpx;
  margin-top: 21rpx;
}

.no-data-btn {
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  color: #fff;
  text-align: center;
  border-radius: 90rpx;
  margin-top: 36rpx;
}

</style>