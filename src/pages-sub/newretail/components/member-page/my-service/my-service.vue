<template>
<!--components/member-page/my-service/my-service.wxml-->
<view class="fun-list" v-if="configData && configData.imageItems.length > 0" :style="'background-color: ' + (configData.backGroundType == 'backgroundColor' ? configData.backGroundColor : 'transparent') + ';width: calc(100% - ' + configData.pageMargin * 2 + 'px);margin: ' + (configData.moduleSpacing || 0) + 'px ' + (configData.pageMargin || 0) + 'px;border-radius:' + configData.fillet + 'px'">
  <image v-if="configData.backGroundType == 'backgroundImage' && configData.backGroundImgObj" class="bg" mode="widthFix" :src="configData.backGroundImgObj ? configData.backGroundImgObj.imageUrl : ''"></image>
  <view class="fun-list-title">我的服务</view>
  <view class="fun-list-main">
      <view v-for="(item , index) in configData.imageItems" :key="index">
          <view :style="'background-color: ' + configData.iconBackGroundColor" v-if="(item.imageUrl || item.modelName) && item.linkModel !== 'applyDistributor'" @click="isOpenCustomerService  ? '' : 'toOtherPage'" :data-info="item" :data-link="item.linkModel">
              <image :src="item.imageUrl" mode="widthFix"></image>
              <text>{{item.modelName}}</text>
              <button v-if="!hasUserInfo" class="authorization" @click="getUserInfo"></button>
          </view>
      </view>
  </view>
</view>
</template>
<script setup>
import _apiCouponServiceJs from "@/service/api/newretail/couponService";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import { reactive } from "vue";
const app = getApp();

// components/member-page/my-service/my-service.js
const NAVPAGE = _utilsNavPageJs;
const IMGAGESPATH = _utilsImagesPathJs;
const couponService = _apiCouponServiceJs;
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH
});
const props = defineProps({
  configData: {
    // 配置项数据
    type: Object,
    value: {}
  },
  isOpenCustomerService: {
    type: Boolean,
    value: true
  }
});
function getUserInfo() {
  triggerEvent('getUserInfo');
}
function toOtherPage(e) {
  let type = e.currentTarget.dataset.link;
  if (type === "shopcart") {
    NAVPAGE.toShopcart();
  } else if (type === "giftcard") {
    NAVPAGE.toGiftCardCenter();
  } else if (type === "myBargain") {
    NAVPAGE.toMyBargain();
  } else if (type === "myTourism") {
    NAVPAGE.toMyTourism();
  } else if (type === "applyDistributor") {
    NAVPAGE.toApplyDistributor();
  } else if (type === "pickup") {
    NAVPAGE.toPickUp();
  } else if (type === "invite") {
    NAVPAGE.toInvite();
  } else if (type === "redpacket") {
    NAVPAGE.toRedPacket();
  } else if (type === "address") {
    NAVPAGE.toAddressList();
  } else if (type === "comment") {
    NAVPAGE.toGoodsComment();
  } else if (type === "couponCenter") {
    NAVPAGE.toCouponCenter();
  } else if (type === "feedback") {
    NAVPAGE.toFeedback();
  } else if (type === "balance") {
    NAVPAGE.toRecharge();
  } else if (type === "mbrInfo") {
    NAVPAGE.toMemberInfo();
  } else if (type === "system") {
    NAVPAGE.toSystem();
  } else if (type === "creditCard") {
    NAVPAGE.toCreditCard();
  } else if (type === "onlineTopUp") {
    NAVPAGE.toTopUp();
  } else if (type === "scoreCoupon") {
    const link = '?link=score_coupon';
    NAVPAGE.toScoreMall(link);
  } else if (type === "scoreGoods") {
    const link = '?link=score_goods';
    NAVPAGE.toScoreMall(link);
  } else if (type === "thirdPartyCoupon") {
    const link = '?link=thirdParty_coupon';
    NAVPAGE.toScoreMall(link);
  } else if (type === 'customService') {
    // wx.navigateTo({
    //   url: '/pages-sub/newretail/pages/mallModule/order/qiyu/index',
    // })
    let storeInfo = app.globalData.storeInfo || uni.getStorageSync('storeIdactive');
    NAVPAGE.toCustomService('', storeInfo.id);
  } else if (type === "checkCode") {
    NAVPAGE.toMyThirdCoupon();
  } else if (type === "scoreMall") {
    const link = '?link=score_mall';
    NAVPAGE.toScoreMall(link);
  } else if (type === "my_recharge_draw") {
    NAVPAGE.toMyLottery();
  } else if (type === "exchangeCoupon") {
    NAVPAGE.toExchabgeCoupon();
  } else if (type === "score_raffle") {
    if (e.currentTarget.dataset.info.raffleActivityId) {
      let opts = '?raffleActivityId=' + e.currentTarget.dataset.info.raffleActivityId;
      NAVPAGE.toRaffle(opts);
    }
  } else if (type === "back_cash_product") {
    if (app.globalData.isShoppingGuide) {
      NAVPAGE.toGuideGoods();
    } else {
      NAVPAGE.toApplyShoppingGuide();
    }
  } else if (type === "subscribe_messages") {
    triggerEvent('clickSubscribe');
  } else if (type === 'mealCard') {
    let tempList = [];
    let postData = {
      page: '1',
      pageSize: '100',
      memberId: app.globalData.userInfo.member.id
    };
    couponService.queryMspAccountList(postData).then(res => {
      if (res.records && res.records.length > 0) {
        tempList = res.records;
        tempList.sort(function (a, b) {
          return Number(b.balance) - Number(a.balance);
        });
        state.reserveBalance = tempList[0].balance.toFixed(2);
        if (state.reserveBalance) {
          uni.navigateTo({
            url: '/pages-sub/newretail/pages/mallModule/member/mealCard/mealCard'
          });
        } else {
          uni.navigateTo({
            url: '/pages-sub/newretail/pages/mallModule/member/mealCardDetails/mealCardDetails'
          });
        }
      }
    }).catch(e => {
      uni.navigateTo({
        url: '/pages-sub/newretail/pages/mallModule/member/mealCardDetails/mealCardDetails'
      });
    });
  } else if (type === 'Invitation_Code') {
    uni.navigateTo({
      url: '/pages-sub/newretail/pages/mallModule/member/share/share'
    });
  } else if (type === 'meituan_xiaoxiang') {
    uni.navigateTo({
      url: '/pages-sub/newretail/pages/mallModule/order/meituan/orderMeituan'
    });
  } else if (type === 'meituan_xiaoxiang_h5') {
    NAVPAGE.toMeituan();
  }
}
</script>
<style scoped>
/* components/member-page/my-service/my-service.wxss */

.fun-list {
  width: 100%;
  background: transparent;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
}
.bg {
  position: absolute;
  left: 0;
  top: 0;
  /* z-index: -1; */
  width: 100%;
}
.fun-list > view {
  position: relative;
}
.fun-list-title {
  height: 94rpx;
  line-height: 94rpx;
  border-bottom: 1rpx solid #dedede;
  font-size: 28rpx;
  color: #232323;
  padding: 0 30rpx;
}

.fun-list-main {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 20rpx 0;
  padding-bottom: 0;
  box-sizing: border-box;
}

.fun-list-main view {
  width: 25%;
  height: 150rpx;
  display: flex;
  flex-direction: column;
  color: #4b4b4b;
  font-size: 22rpx;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 20rpx; */
  margin: 0 0 20rpx;
  /* margin: 0 auto 20rpx; */
  padding: 20rpx 0;
  box-sizing: border-box;
  position: relative;
}

.fun-list-main view .customService {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  position: absolute;
  left: 0;
  top: 0;
}

.fun-list-main view button::after {
  border: none;
}

.fun-list-main view image {
  width: 62rpx;
  height: 62rpx;
  margin-bottom: 10rpx;
}

.fun-list-main view text {
  display: block;
  width: 100%;
  text-align: center;
  /* position: absolute;
  bottom: 0; */
}

</style>