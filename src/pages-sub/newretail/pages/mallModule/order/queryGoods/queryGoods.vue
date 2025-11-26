<template>
<!-- pages/mallModule/order/queryGoods/queryGoods.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<view class="goods-box">
		<view class="goods-list" @click="toPennyDetails">
				<view class="goods-item-box" v-for="(item , index) in goodsList" :key="index">
						<view class="goods-item" v-if="!item.giftProduct">
								<view class="goods-img">
										<image :src="item.imageUrl" mode="widthFix"></image>
										<image class="seckill-icon" mode="widthFix" v-if="item.grabActivityId" :src="imagesPath.iconSeckillSeat"></image>
								</view>
								<view class="goods-info">
										<view class="goods-left">
												<text class="goods-name">{{item.name}}</text>
												<text class="goods-desc">{{item.specs}}</text>
										</view>
										<view class="goods-right">
												<view class="goods-count">x{{item.productNum}}</view>
												<view class="goods-price" v-if="order.business === 'SCORE'">
														<text class="nowPrice">￥{{item.exchangeScores}}</text>
														积分
												</view>
												<view class="goods-price" v-else>
														<text class="nowPrice">￥{{item.price}}</text>
												</view>
										</view>
								</view>
						</view>
						<view class="gift-box" v-if="item.giftProduct">
								<view class="gift-title">赠品:</view>
								<view class="gift-item-box">
										<view class="gift-item">
												<view>
														<view class="gift-img-box">
																<image :src="item.imageUrl"></image>
														</view>
														<text>{{item.name}}</text>
												</view>
												<view class="gift-num">x{{item.productNum}}</view>
										</view>
								</view>
						</view>
				</view>
		</view>
</view>
</template>
<script setup>
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsNavPageJs from "@/utils/newretail/navPage";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/mallModule/order/queryGoods/queryGoods.js
const orderService = _apiOrderServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const NAVPAGE = _utilsNavPageJs;
const selfA = _utilsSelfJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "查看商品"
});
function initPage(e) {
  const self = this;
  orderService.getProductsByOrderId(e).then(res => {
    console.log(res, "商品信息");
    let arr = res;
    //   arr.forEach(async (item)=>{
    //     await selfA.getTemporaryUrl(item.imageUrl).then((res1)=>{
    //         item.imageUrl = res1.data
    //     })
    //   })
    state.goodsList = arr;
  });
}
onLoad(function (options) {
  if (options.orderId) {
    initPage(options.orderId);
  }
});
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
function toPennyDetails() {}
</script>
<style scoped>
.goods-box {
    padding: 0 40rpx;
    background-color: #fff;
  }
  
  .store-info {
    height: 72rpx;
    padding-top: 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #f1f1f1;
  }
  
  .store-info .store-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #454545;
  }
  
  .store-info .color-009F55 {
    font-size: 24rpx;
  }
  
  .goods-item-box {
    display: flex;
    flex-direction: column;
  }
  
  .goods-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f1f1f1;
    display: flex;
    justify-content: space-between;
  }
  
  .goods-item .goods-img {
    width: 80rpx;
    height: 80rpx;
    border-radius: 6rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
  }
  
  .goods-item .goods-img image {
    width: 80rpx;
    height: 80rpx;
  }
  
  .goods-item .goods-img .seckill-icon {
    position: absolute;
    width: 69rpx;
    height: 13rpx;
    top: 0;
    left: 0;
  }
  
  .goods-item .goods-info {
    height: 80rpx;
    width: calc(100% - 109rpx);
    position: relative;
    display: flex;
    justify-content: space-between;
  }
  
  .goods-info .goods-left {
    width: 219rpx;
  }
  
  .goods-info .goods-right {
    display: flex;
    justify-content: flex-start;
  }
  
  .goods-info .goods-name,
  .goods-info .goods-desc {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 219rpx;
    display: block;
    line-height: 40rpx;
  }
  
  .goods-info .goods-name {
    font-size: 28rpx;
    line-height: 40rpx;
    height: 40rpx;
    color: #454545;
    margin-top: 2rpx;
    font-weight: 400;
  }
  
  .goods-info .goods-desc {
    font-size: 20rpx;
    margin-top: 8rpx;
  }
  
  .goods-info .goods-count {
    font-size: 24rpx;
    color: #454545;
    line-height: 80rpx;
    font-weight: bold;
  }
  
  .goods-price {
    font-size: 30rpx;
    line-height: 80rpx;
    color: #454545;
    margin-left: 95rpx;
  }
  
  .goods-price .nowPrice {
    color: #f9a72a;
    font-weight: bold;
  }
  
</style>