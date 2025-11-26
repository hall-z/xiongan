<template>
  <!--components/recommend/recommend-list/recommend-list.wxml-->
  <view class="recommend-box" v-if="recommendingList.length > 0">
    <view class="recommend-title">
      <view>
        更多潮品等您抢鲜
        <image class="bg" :src="imagesPath.recommend_bg_url"></image>
      </view>
      <view class="all" @click="productList">全部潮品</view>
    </view>
    <scroll-view scroll-x="true" enable-flex="true" class="recommend-list">
      <view v-for="(item, index) in recommendingList" :key="index">
        <recommend-item :goods="item" @click="clickRecommendGoods"></recommend-item>
      </view>
    </scroll-view>
  </view>
</template>
<script setup>
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiWisdomServiceJs from '@/service/api/newretail/wisdomService'
import _apiHomepageServiceJs from '@/service/api/newretail/homepageService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import recommendItem from '../recommend-item/recommend-item.vue'
// import { attached } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// components/recommend/recommend-list/recommend-list.js
const productService = _apiProductServiceJs
const homepageService = _apiHomepageServiceJs
const wisdomService = _apiWisdomServiceJs
const IMGAGESPATH = _utilsImagesPathJs
const UTILS = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs

// 获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  recommendingList: [],
  storeId: '',
  pageType: 'normal',
  storeInfo: app.globalData.storeInfo,
})
const props = defineProps({
  dateCount: Number,
})
attached(function () {
  getRecommendingGoods()
})
function getRecommendingGoods() {
  const params = {
    storeIdEq:
      app.globalData.storeInfo && app.globalData.storeInfo.id
        ? app.globalData.storeInfo.id
        : state.storeInfo.id,
    dateCount: state.dateCount,
    searchCount: true,
  }
  productService.getStoreHotProduct(params).then((res) => {
    if (res && res.length > 0) {
      const newList = productsSort(res)
      newList.forEach((item) => {
        item.labels = item.labels.splice(0, 4)
      })
      state.recommendingList =
        newList.length > state.dateCount ? newList.slice(0, state.dateCount) : newList
    }
  })
}
function productList() {
  uni.switchTab({
    url: '/pages-sub/newretail/pages/mallModule/tabbar/category/category-list/category-list',
  })
}
function productsSort(array) {
  const balanceArray = []
  const allArray = []
  array.forEach((ele) => {
    ele.sellPrice = ele.sellPrice
      ? (ele.sellPrice + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
      : ''
    if (ele.balance <= 0) {
      balanceArray.push(ele)
    } else {
      allArray.push(ele)
    }
  })
  if (app.globalData.systemConfigure.storeProductBalanceIsZeroShow) {
    const tempArray = allArray.concat(balanceArray)
    return tempArray
  } else {
    return allArray
  }
}
function clickRecommendGoods(e) {
  if (e.detail) {
    const res = e.detail
    const opts = '?productId=' + res.id
    NAVPAGE.toGoodsDetails(opts)
    // if (this.data.pageType === "normal") {
    //   let opts = '?productId=' + res.id + '&storeId=' + this.data.storeId + '&type=normal';
    //   NAVPAGE.toGoodsDetails(opts)
    // } else if (this.data.pageType === "shopCart") {

    // } else {
    //   let opts = '?productId=' + res.id + '&storeId=' + this.data.storeId + '&type=normal';
    //   wx.redirectTo({
    //     url: '/pages-sub/newretail/pages/mallModule/goods/goodsDetail/goodsDetail' + opts
    //   })
    // }
  }
}
</script>
<style scoped>
/* components/recommend/recommend-list/recommend-list.wxss */

/* 推荐 */

.recommend-box {
  width: 100vw;
  /* margin-top: 56rpx; */
  padding-left: 25rpx;
  box-sizing: border-box;
  overflow: hidden;
  margin-bottom: 80rpx;
}

.recommend-box .recommend-title {
  position: relative;
  font-size: 42rpx;
  color: #040000;
  line-height: 65rpx;
  height: 65rpx;
  display: flex;
  width: calc(100vw - 50rpx);
  box-sizing: border-box;
  z-index: 1;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25rpx;
  font-family: SourceHanSerifCN-Regular, SourceHanSerifCN;
}
.recommend-box .recommend-title .all {
  font-size: 23rpx;
  border-bottom: 1px solid #000;
  height: 26rpx;
  line-height: 26rpx;
  font-family:
    PingFangSC-Regular,
    PingFang SC;
}
.bg {
  width: 108rpx;
  height: 65rpx;
  position: absolute;
  top: 0;
  left: 69rpx;
  z-index: -1;
}
.recommend-list {
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  height: 620rpx;
}
</style>
