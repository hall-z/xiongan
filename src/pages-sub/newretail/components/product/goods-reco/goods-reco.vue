<template>
<!--components/product/goods-reco/goods-reco.wxml-->
<view class="reco-goods-item" :data-productId="goods.id" :data-type="goodsType" @click="clickGoodsItem">
  <view class="reco-img-box">
    <!-- <view wx:if="{{goods.isTeam}}" class="group-icon">{{goods.memberCount}}人团</view> -->
    <image :src="goods.productUrl" mode="aspectFit"></image>
    <image class="no-balance" mode="widthFix" :src="imagesPath.soldOutIcon" v-if="goods.productBalance <= 0 && goods.business !== 'DISTRIBUTION' && goods.storeStatus !== 'OFF'"></image>
    <image class="no-balance" mode="widthFix" :src="imagesPath.iconLowerShelf" v-if="goods.storeStatus === 'OFF'"></image>
  </view>
  <view class="reco-goods-info">
    <text class="reco-goods-name">{{goods.name}}</text>
    <view class="reco-goods-price">
      <view v-if="goods.isTeam">
        <text class="reco-sell-price"><text style="font-size: 24rpx;">￥</text>{{goods.teamLeaderPrice}}</text>
        <text class="reco-old-price" v-if="goods.sellPrice && goods.teamLeaderPrice < goods.sellPrice">￥{{goods.sellPrice}}</text>
      </view>
      <view v-else>
        <text class="grrecooup-sell-price"><text style="font-size: 24rpx;">￥</text>{{goods.sellPrice}}</text>
        <text class="reco-old-price" v-if="goods.originalPrice && goods.sellPrice < goods.originalPrice">￥{{goods.originalPrice}}</text>
      </view>
    </view>
    <!-- <view class="reco-button-box">{{goods.isTeam?'立即开团>':'立即购买>'}}</view> -->
  </view>
</view>
</template>
<script setup>
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import { reactive } from "vue";
// components/product/goods-reco/goods-reco.js
const themeManager = _utilsThemeManagerJs;
const IMGAGESPATH = _utilsImagesPathJs;
const state = reactive({
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  imagesPath: IMGAGESPATH
});
const props = defineProps({
  goods: Object,
  //产品数据
  goodsType: {
    // 商品类型
    type: String,
    value: 'normal' //group,normal 拼图商品 普通商品
  }
});
function attached() {
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
}
function moved() {}
function detached() {}
function clickGoodsItem(e) {
  triggerEvent('onClickGoods', e.currentTarget.dataset);
}
</script>
<style scoped>
/* components/product/goods-reco/goods-reco.wxss */
.reco-goods-item {
    width: 25vw;
    height: 210rpx;
    /* border: 1rpx solid #e6e6e6; */
    border-radius: 10rpx;
    position: relative;
    flex: 0;
    background: #fff;
    margin-right: 26rpx;
    display: inline-block;
}

.reco-goods-item .reco-img-box {
    width: 100%;
    height: 210rpx;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.reco-goods-item .reco-img-box image {
    width: 100%;
    height: 210rpx;
}

.reco-goods-item .reco-img-box .no-balance {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
}

.reco-goods-item .reco-img-box .group-icon {
    background: #009f55;
    font-size: 26rpx;
    color: #fff;
    height: 40rpx;
    border-top-left-radius: 10rpx;
    border-bottom-right-radius: 10rpx;
    padding: 0 12rpx 0 14rpx;
    position: absolute;
    left: 0;
    top: 0;
}

.reco-goods-info {
    width: 100%;
}

.reco-goods-name {
    font-size: 24rpx;
    line-height: 48rpx;
    color: #333;
    /* padding: 0 16rpx; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
}

.reco-goods-price {
    font-size: 20rpx;
    color: #494949;
    line-height: 44rpx;
    /* margin-left: 16rpx;
    margin-top: 11rpx; */
}

.reco-sell-price {
    font-size: 32rpx;
    color: #EE5253;
    margin-right: 7rpx;
}


.reco-old-price {
    text-decoration: line-through;
}

.reco-button-box {
    width: 100rpx;
    height: 22rpx;
    line-height: 22rpx;
    /* background: #009f55; */
    /* box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 159, 85, 0.2); */
    /* border-radius: 4rpx; */
    font-size: 20rpx;
    color: #EE5253;
    /* font-weight: bold; */
    /* text-align: center; */
    /* line-height: 44rpx; */
    position: absolute;
    bottom: -80rpx;
    right: 0rpx;
}
</style>