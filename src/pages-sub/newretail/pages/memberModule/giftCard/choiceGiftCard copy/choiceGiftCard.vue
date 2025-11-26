<template>
<!--pages/memberModule/giftCard/choiceGiftCard/choiceGiftCard.wxml-->
<view>
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view :class="'card-item ' + (!item.useable ? 'unavailable' : '')" v-for="(item , idx) in state.giftCardList" :key="cardId" :data-cardid="item.cardId" :data-index="idx" @click="toCardBuyResult">
  <image :src="item.imageUrl"></image>
  <view class="card-info">
    <view class="name-box">
      <text class="card-name">{{item.name}}</text>
    </view>
    <view class="price-box">
      余额：
      <text>￥{{item.balance}}</text>
    </view>
    <view class="buy-time" v-if="item.useable">
      本单最大可用金额：￥{{filters.filtToFix(item.maxUseTotal)}}
    </view>
    <view class="buy-time" v-else>
      {{item.reason}}
    </view>
    <image class="checked-icon" :src="item.isChecked ? state.imagesPath.iconChecked1 : state.imagesPath.iconUnchecked1"></image>
  </view>
</view>
<view class="bottom-box">
  <button class="btn" @click="toPerfectOrder">确认</button>
</view>
<view v-if="state.giftCardList.length === 0" class="no-data">
  <image :src="state.imagesPath.imgNoGiftCardUsed"></image>
</view></view>
</template>
<script setup>
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/memberModule/giftCard/choiceGiftCard/choiceGiftCard.js
const orderService = _apiOrderServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "选择礼品卡",
  imagesPath: IMGAGESPATH,
  giftCardList: [],
  card: {}
});
onLoad(function (options) {
  console.log(options);
  uni.hideShareMenu();
  const productData = decodeURIComponent(options.productData);
  let productList = JSON.parse(productData);
  let cardId = null;
  if (options.cardId != null) {
    cardId = options.cardId;
  }
  if (productList.length > 0) {
    let tempList = [];
    productList.forEach(item => {
      let tempItem = {
        productId: item.productId,
        productNum: item.productNum
      };
      tempList.push(tempItem);
    });
    let postData = {
      productIds: tempList,
      storeId: options.storeId,
      memberId: uni.getStorageSync('__user__').member.id
    };
    orderService.calculateCard(postData).then(res => {
      let tempList = [];
      let unUseCardList = [];
      if (res && res.length > 0) {
        res.forEach(item => {
          let tempItem = {
            ...item,
            isChecked: false
          };
          if (cardId && item.cardId === cardId) {
            tempItem.isChecked = true;
          }
          if (item.useable) {
            tempList.push(tempItem);
          } else {
            unUseCardList.pop(tempItem);
          }
        });
      }
      tempList = tempList.concat(unUseCardList);
      state.giftCardList = tempList;
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function toCardBuyResult(e) {
  const cardId = e.currentTarget.dataset.cardid;
  let tempList = state.giftCardList;
  let card = null;
  tempList.forEach(item => {
    if (item.cardId === cardId) {
      item.isChecked = !item.isChecked;
      card = item.isChecked ? item : null;
    } else {
      item.isChecked = false;
    }
  });
  state.giftCardList = tempList;
  if (card) {
    console.log(card);
    if (card.useable) {
      state.card = card;
    } else {
      uni.showToast({
        title: card.reason,
        icon: 'none',
        duration: 2000
      });
    }
  } else {}
}
function toPerfectOrder() {
  const card = state.card;
  if (card.cardId != null) {
    console.log(card);
    if (card.useable) {
      try {
        uni.setStorageSync('wj_chooseCard', card);
      } catch (e) {}
      uni.navigateBack({
        delta: 1
      });
    } else {
      uni.showToast({
        title: card.reason,
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    try {
      uni.setStorageSync('wj_chooseCard', null);
    } catch (e) {}
    uni.navigateBack({
      delta: 1
    });
  }
}
</script>
<style scoped>
/* pages/memberModule/giftCard/choiceGiftCard/choiceGiftCard.wxss */

page {
  background: #f3f4f6;
  padding-top: 7rpx;
  padding-bottom: 120rpx;
}

.card-item {
  width: 678rpx;
  margin: 7rpx auto;
  padding: 40rpx 14rpx;
  overflow: hidden;
  border-bottom: 1rpx solid #ebeff7;
  background: #fff;
  border-radius: 10rpx;
}

.card-item image {
  width: 220rpx;
  height: 140rpx;
  float: left;
}

.card-info {
  float: right;
  width: 430rpx;
  font-size: 24rpx;
  position: relative;
}

.card-info .name-box {
  margin-bottom: 20rpx;
  overflow: hidden;
}

.card-info .name-box text {
  float: right;
}

.card-info .name-box .card-name {
  font-size: 30rpx;
  float: left;
}

.card-info .name-box .card-no {
  font-size: 26rpx;
  float: left;
}

.card-info .price-box {
  margin-bottom: 10rpx;
  color: #333;
}

.card-info .price-box text {
  color: #f1b400;
}

.card-info .buy-time {
  color: #666;
}

.unavailable .card-info .buy-time {
  color: #ff6664;
}

.card-info .checked-icon {
  position: absolute;
  right: 42rpx;
  width: 38rpx;
  height: 38rpx;
  top: 50%;
  margin-top: -19rpx;
}

.no-data image {
  width: 242rpx;
  height: 261rpx;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-45%) translateY(-60%);
}

.card-title {
  font-size: 24rpx;
  color: #1b1b1d;
  padding-top: 22rpx;
  line-height: 62rpx;
  height: 62rpx;
  border-bottom: 1rpx solid #dcdcdc;
  margin-bottom: 24rpx;
  margin-right: 19rpx;
  margin-left: 19rpx;
}

.card-title text {
  font-size: 20rpx;
  color: #666;
}

.bottom-box {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 0 40rpx;
  box-sizing: border-box;
  height: 120rpx;
  border-top: 1rpx solid #dcdcdc;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 999;
}

.bottom-box button.btn {
  height: 100rpx;
  width: 100%;
  background: #ff7200;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 100rpx;
  border-radius: 6rpx;
}
</style>