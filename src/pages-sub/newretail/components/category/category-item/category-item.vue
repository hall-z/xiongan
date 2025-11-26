<template>
<!--components/category/category-item/category-item.wxml-->
  <!-- style="border-top-width:{{navHeightTop}}px" -->
<view :class="'goods-content ' + (cateData.id === 0 ? 'the-0' : '') + ' ' + externalClass" v-if="!loading" :id="'the-' + cateData.id" :hidden="cateData.id != tabSelected">
  <view class="goods-con-box" :style="'display: ' + (proShowType === 'card' ? 'flex' : '')">
    <view v-if="goodsList.length > 0 && proShowType === 'list'" v-for="(item , index) in goodsList" :key="idx">
      <goods-item :goods="item" :shopCart="shopCart" :hasUserInfo="hasUserInfo" @onClickGoods="clickGoodsItem" @addToCart="addToCart" @noop="noop" @getUserInfo="onGetUserInfo"></goods-item>
    </view>
    <view v-if="goodsList.length > 0 && proShowType === 'card'" v-for="(item , index) in goodsList" :key="idx">
      <goods-store-hot :goods="item" :shopCart="shopCart" :hasUserInfo="hasUserInfo" @onClickGoods="clickGoodsItem" @addToCart="addToCart" @noop="noop" @getUserInfo="onGetUserInfo"></goods-store-hot>
    </view>
  </view>
  <view v-if="goodsList.length == 0 && cateData.loading" class="no-data">
    <image :src="imagesPath.imgNoData"></image>
  </view>
  <view :class="'no-more-goods ' + (isIphoneX ? 'iphoneX-height' : '')" v-if="cateData.loading">~去看看其他分类吧~</view>
</view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
// import { attached, ready } from "@dcloudio/uni-app";
import { reactive , watch} from "vue";
import goodsItem from '../../goods-item/goods-item.vue';
import goodsStoreHot from '../../goods-store-hot/goods-store-hot.vue';
const app = getApp();
// components/category/category-item/category-item.js
const UTILS = _utilsUtilsJs;
//获取应用实例
const state = reactive({
  goodsList: [],
  isIphoneX: UTILS.isIphoneX()
});
const props = defineProps({
  hasUserInfo: Boolean,
  cateData: {
    type: Object,
    value: {}
  },
  loading: Boolean,
  shopCart: Object,
  externalClass: String,
  tabSelected: String,
  imagesPath: Object,
  proShowType: String
});
attached(function () {
  // 在组件实例进入页面节点树时执行
  state.navHeightTop = 180 * app.globalData.systemInfo.windowWidth / 750;
});
function setListData() {
  let that = this;
  if (state.cateData != null && state.cateData.loading) {
    state.goodsList = app.globalData.categoryList[state.cateData.id];
    readyEnd(true);
  }
}
function clickGoodsItem(e) {
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
function getUserInfo(e) {
  triggerEvent("getUserInfo", e);
}
ready(function () {
  setListData();
});

// Watch listeners converted from observers
watch(() => props.value, (newVal, oldVal) => {
  if (newVal != null && newVal.loading) {
          state.goodsList = app.globalData.categoryList[newVal.id];
        }
});

</script>
<style scoped>
/* components/category/category-item/category-item.wxss */
.goods-content {
  /* margin-top: 100rpx; */
  /* border-top: 100rpx solid #e9e9e9; */
  min-height: calc(100% - 100rpx);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
}
.goods-con-box {
  padding: 20rpx 40rpx 0 40rpx;
  /* display: flex; */
  justify-content: space-between;
  flex-wrap: wrap;
}
.no-data {
  width: 100%;
  height: calc(100vh - 308rpx);
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
  padding: 20rpx 0 128rpx 0;
}
.no-more-goods.iphoneX-height {
  padding: 20rpx 0 178rpx 0;
}
</style>