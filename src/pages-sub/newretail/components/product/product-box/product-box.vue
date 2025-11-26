<template>
<!-- components/product/product-box/product-box.wxml -->
<view @click="bannerJumping" v-if="bannerJson && bannerJson.imageItems && bannerJson.imageItems[0].imageUrl && isNew === '1'" :key="index" :data-item="item" :data-id="item.id" style="width: 100%;">
  <image v-for="(item , index) in bannerJson.imageItems" :src="item.imageUrl" mode="widthFix" style="width: 100%;"></image>
</view>
<view :class="'goods-content ' + externalClass" v-if="show && !zhiti">
  <view :class="'goods-con-box ' + (proShowType === 'card' ? 'goods-con-box-card' : '')">
    <view v-if="goodsList.length > 0 && proShowType === 'list'" v-for="(item , index) in goodsList" :key="idx">
      <product-item :goods="item" :showSpecParent="showSpecParent" :shopCart="shopCart" :hasUserInfo="hasUserInfo" @onClickGoods="clickGoodsItem" @addToCart="addToCart" @noop="noop" @getUserInfo="onGetUserInfo"></product-item>
    </view>
    <view v-if="goodsList.length > 0 && proShowType === 'card'" v-for="(item , index) in goodsList" :key="idx">
      <product-item-card :goods="item" :showSpecParent="showSpecParent" :shopCart="shopCart" :hasUserInfo="hasUserInfo" @onClickGoods="clickGoodsItem" @addToCart="addToCart" @noop="noop" @getUserInfo="onGetUserInfo"></product-item-card>
    </view>
  </view>
  <view v-if="goodsList.length == 0" class="no-data">
    <image :src="imagesPath.imgNoData"></image>
  </view>
  <button class="loading-btn" :loading="showLoading" v-if="showLoading">正在加载...</button>
  <text class="no-more-goods" v-if="noMore">~去看看其他分类吧~</text>
</view>
<view :class="'goods-content ' + externalClass" v-if="show && zhiti">
    <view :class="'goods-con-box ' + (proShowType === 'card' ? 'goods-con-box-cardA' : '')">
      <view v-if="goodsList.length > 0 && proShowType === 'list'" v-for="(item , index) in goodsList" :key="idx">
        <product-item :goods="item" :showSpecParent="showSpecParent" :shopCart="shopCart" :hasUserInfo="hasUserInfo" @onClickGoods="clickGoodsItem" @addToCart="addToCart" @noop="noop" @getUserInfo="onGetUserInfo"></product-item>
      </view>
      <view v-if="goodsList.length > 0 && proShowType === 'card'" v-for="(item , index) in goodsList" :key="idx">
        <product-item-card :goods="item" :showSpecParent="showSpecParent" :shopCart="shopCart" :hasUserInfo="hasUserInfo" @onClickGoods="clickGoodsItem" @addToCart="addToCart" @noop="noop" @getUserInfo="onGetUserInfo"></product-item-card>
      </view>
    </view>
    <view v-if="goodsList.length == 0" class="no-data">
      <image :src="imagesPath.imgNoData"></image>
    </view>
    <button class="loading-btn" :loading="showLoading" v-if="showLoading">正在加载...</button>
    <text class="no-more-goods" v-if="noMore">~去看看其他分类吧~</text>
  </view>
</template>
<script setup>
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsImagesPath from "@/utils/newretail/imagesPath";
// import { ready } from "@dcloudio/uni-app";
import { reactive , watch} from "vue";
const app = getApp();
// components/product/product-box/product-box.js
//获取应用实例
const IMAGESPATH = _utilsImagesPath;
const NAVPAGE = _utilsNavPageJs;
// const self = require("../../../utils/self")
const state = reactive({
  goodsList: [],
  imagesPath: IMAGESPATH,
  zhiti: null
});
const props = defineProps({
  hasUserInfo: Boolean,
  isNew: String,
  showSpecParent: Boolean,
  bannerJson: Object,
  loading: {
    type: Boolean,
    value: false
  },
  show: {
    type: Boolean,
    value: false
  },
  zhiti: {
    type: Boolean,
    value: false
  },
  noMore: Boolean,
  shopCart: Object,
  externalClass: String,
  item: Number,
  loadingBtn: {
    type: Boolean,
    value: false
  },
  scrollTop: {
    type: Number,
    value: 0
  },
  proShowType: String
});
ready(function () {});
function bannerJumping(e) {
  console.log(e);
  const that = this;
  let bannerId = e.currentTarget.dataset.id;
  let dataItem = e.currentTarget.dataset.item;
  const bannerList = state.bannerJson.imageItems;
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
  console.log(pageInfo, 'pageInfopageInfopageInfo');
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
    } else if (pageInfo.appReturnType === "SERVICEPRODUCT" || pageInfo.appReturnType === "SERVICESTAFF") {
      // 服务相关页面
      NAVPAGE.toServiceList(pageInfo.appReturnType);
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
    let url = pageInfo.linkUrl;
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
function setListData() {
  const that = this;
  console.log(app.globalData.goodsList);
  state.showLoading = true;
  let goodsList = app.globalData.goodsList;
  console.log(goodsList, 'goodsListgoodsListgoodsList');
  state.goodsList = goodsList;
  readyEnd(true);
}
function clickGoodsItem(e) {
  triggerEvent('onClickGoods', e.detail);
}
function onClickGoods(e) {
  triggerEvent('onClickGoods', e.detail);
}
function readyEnd(val) {
  triggerEvent('onReadyEnd', val);
}
function addToCart(e) {
  triggerEvent("addToCart", {
    dataset: e.currentTarget.dataset,
    context: this,
    detail: e.detail
  });
}
function decrease(e) {
  triggerEvent("decrease", e.currentTarget.dataset);
}
function subscribeArrivalRemind(e) {
  triggerEvent("subscribeArrivalRemind", e.currentTarget.dataset);
}
function noop(e) {
  triggerEvent("noop", e);
}
function onGetUserInfo(e) {
  triggerEvent("getUserInfo", e);
}
function bindscrolltolower(e) {
  console.log(e);
}

// Watch listeners converted from observers
watch(() => props.loading, (n, o) => {
  if (n) {
          setListData();
        }
});

watch(() => props.show, (n, o) => {
  console.log(n, o);
        if (n) {
          setListData();
        }
});

watch(() => props.zhiti, (n, o) => {
  if (n) {
          state.zhiti = n;
        }
});

watch(() => props.loadingBtn, (n, o) => {
  if (n) {
          console.log("loadingBtn", n);
          state.showLoading = true;
        }
});

</script>
<style scoped>
/* components/product/product-box/product-box.wxss */
.goods-content {
  background: #fff;
  padding-bottom: 78rpx;
  box-sizing: border-box;
}
.goods-con-box {}
.goods-con-box-card {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 20rpx;
}
.goods-con-box-cardA{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 60rpx;
}
.no-data {
  width: 100%;
  height: calc(100vh - 708rpx);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
}
.no-data image {
  width: 242rpx;
  height: 261rpx;
}
.no-more-goods {
  display: block;
  width: 100%;
  text-align: center;
  color: #999999;
  font-size: 28rpx;
  line-height: 60rpx;
  height: 60rpx;
  background: #ffffff;
  padding: 20rpx 0;
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
</style>