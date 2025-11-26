<template>
  <!--components/recommend/recommend-item/recommend-item.wxml-->
  <view>
    <view class="recommend-goods-item" @click="clickItem">
      <view class="recommend-goods-img">
        <image mode="widthFix" :src="goodsData.productImage" v-if="goodsData.isBargain"></image>
        <image mode="widthFix" :src="goodsData.picture" v-else-if="goodsData.isTeam"></image>
        <image mode="widthFix" :src="goodsData.imageUrl" v-else></image>
        <image
          class="no-balance"
          :src="imagesPath.soldOutIcon"
          v-if="goodsData.balance <= 0"
        ></image>
      </view>
      <view class="recommend-goods-info">
        <view class="goods-name">{{ goodsData.name }}</view>
        <view class="old-price">
          <view v-if="goodsData.isBargain">原价：￥{{ goodsData.originalPrice }}</view>
          <view class="group-num" v-else-if="goodsData.isTeam">
            <image class="group-bg" :src="imagesPath.iconRecommendGroup"></image>
            <text>{{ goodsData.memberCount }}人团</text>
            <view class="bg"></view>
          </view>
          <view v-else-if="goodsData.promotionPrice != null">
            原价：￥{{ goodsData.sellPrice }}
          </view>
          <view v-else>原价：￥{{ goodsData.originalPrice }}</view>
        </view>
        <view class="activity-price" v-if="goodsData.isBargain">
          最低可砍至￥
          <text>{{ goodsData.lowerPrice }}</text>
        </view>
        <view class="activity-price" v-else-if="goodsData.isTeam">
          拼团价:￥
          <text>{{ goodsData.teamLeaderPrice }}</text>
        </view>
        <view class="activity-price" v-else>
          ￥
          <text v-if="goodsData.promotionPrice != null">
            {{ filters.filtToFix(goodsData.promotionPrice) }}
          </text>
          <text v-else>{{ filters.filtToFix(goodsData.sellPrice) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import { reactive, watch } from 'vue'
const app = getApp()

// components/recommend/recommend-item/recommend-item.js
const productService = _apiProductServiceJs
const IMGAGESPATH = _utilsImagesPathJs
const UTILS = _utilsUtilsJs
const selfA = _utilsSelfJs
// 获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  isTeam: false,
  hasEasyRecPlugins: false,
})
const props = defineProps({
  goods: {
    // 商品数据
    type: Object,
    value: null,
  },
})
// Watch listeners converted from observers
watch(
  () => props.goods,
  (newVal, oldVal) => {
    state.goodsData = newVal
  },
)
function attached() {
  state.hasEasyRecPlugins = app.globalData.hasEasyRecPlugins
}
function detached() {
  // 在组件实例被从页面节点树移除时执行
}
function clickItem(e) {
  triggerEvent('click', {
    ...props.goods,
  })
}
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
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 32rpx;
  margin-top: 15rpx;
  height: 64rpx;
}

.recommend-goods-info .old-price {
  color: #999;
  display: flex;
  align-items: center;
  margin-top: 18rpx;
  height: 21rpx;
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
  color: #ee5253;
  font-weight: 500;
  margin-top: 6rpx;
}

.recommend-goods-info .activity-price text {
  font-size: 36rpx;
  font-weight: bold;
}
</style>
