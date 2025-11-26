<template>
<!--components/recommend/recommend-item/recommend-item.wxml-->
<view>
<view class="recommend-goods-item" @click="clickItem">
  <view class="recommend-goods-img">
    <image mode="widthFix" :src="goods.imageUrl"></image>
    <image class="no-balance" :src="imagesPath.soldOutIcon" v-if="goods.balance <= 0"></image>
  </view>
  <view class="recommend-goods-info">
    <view class="goods-name">{{goods.name}}</view>
    <view class="old-price">
      <view v-if="goods.isBargain">原价：￥{{goods.originalPrice}}</view>
      <view class="group-num" v-else-if="goods.isTeam">
        <image class="group-bg " :src="imagesPath.iconRecommendGroup"></image>
        <text>{{goods.memberCount}}人团</text>
        <view class="bg"></view>
      </view>
      <view v-else-if="goods.promotionPrice != null">原价：￥{{goods.sellPrice}}</view>
      <view v-else-if="goods.originalPrice != null">原价：￥{{goods.originalPrice}}</view>
      <view v-else></view> 
    </view>
    <view class="activity-price">￥
      <text v-if="goods.promotionPrice != null">{{filters.filtToFix(goods.promotionPrice)}}</text>
      <text v-else>{{filters.filtToFix(goods.sellPrice)}}</text>
    </view>
  </view>
  <image class="cart-img" :src="imagesPath.iconCouponListCart" mode="widthFix" lazy-load="false" @click.stop="clickShopCart"></image>
</view></view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiProductServiceJs from "@/service/api/newretail/productService";
import { reactive , watch} from "vue";
const app = getApp();
// components/recommend/recommend-item/recommend-item.js
const productService = _apiProductServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const UTILS = _utilsUtilsJs;
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  isTeam: false
});
const props = defineProps({
  goods: {
    // 商品数据
    type: Object,
    value: null
  }
});
function clickItem(e) {
  triggerEvent('click', {
    ...state.goods
  });
}
function clickShopCart(e) {
  triggerEvent('addShopCart', {
    ...state.goods
  });
}

// Watch listeners converted from observers
watch(() => props.goods, (newVal, oldVal) => {
  // 属性值变化时执行
});

</script>
<style scoped>
/* components/recommend/recommend-item/recommend-item.wxss */
.recommend-goods-item {
    position: relative;
    width: 344rpx;
    height: 530rpx;
    background: #fff;
    margin-bottom: 24rpx;
    font-size: 24rpx;
    line-height: 32rpx;
    color: #333;
  }
  .recommend-goods-img {
    width: 344rpx;
    height: 344rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
  }
  .recommend-goods-img image {
    width: 100%;
    height: 100%;
  }
  .recommend-goods-img image.no-balance {
    position: absolute;
    left: 0;
    top: 0;
  }
  .recommend-goods-info {
    padding: 0 18rpx;
  }
  .recommend-goods-info .goods-name {
    font-family:Source Han Sans CN;
    height: 56rpx;
    font-weight: 500;
    color:rgba(51,51,51,1);
    line-height:28rpx;
    margin-top: 19rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #333333;
    overflow:hidden; 
    text-overflow:ellipsis;
  }
  .recommend-goods-info .old-price {
    height: 24rpx;
    margin-top: 13rpx;
    font-size:24rpx;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(153,153,153,1);
  }
  .recommend-goods-info .old-price .group-num {
    position: relative;
    font-size: 16rpx;
    color: #fff;
    line-height: 21rpx;
    min-width: 58rpx;
    height: 21rpx;
    padding-right: 6rpx;
    margin-left: 4rpx;
  }
  .recommend-goods-info .old-price .group-num text {
    position: relative;
    z-index: 1;
    padding-left: 12rpx;
  }
  .recommend-goods-info .old-price .group-num .bg {
    height: 100%;
    width: calc(100% - 64rpx);
    background: #ee5253;
    position: absolute;
    right: 0;
    top: 0;
  }
  .recommend-goods-info .old-price .group-bg {
    position: absolute;
    width: 64rpx;
    height: 21rpx;
    z-index: 0;
  }
  .recommend-goods-info .activity-price {
    font-size:24rpx;
    font-family:Source Han Sans CN;
    font-weight:500;
    color: #EE5253;
    margin-top: 18rpx;
  }
  .recommend-goods-info .activity-price text {
    font-size: 36rpx;
  }
  .cart-img{
    position: absolute;
    width: 38rpx;
    height: 34rpx;
    right: 21rpx;
    bottom: 16rpx;
    z-index: 1;
  }
</style>