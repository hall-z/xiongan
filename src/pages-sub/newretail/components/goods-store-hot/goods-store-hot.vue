<template>
  <!--components/goods-item-small/goods-item-small.wxml-->
  <view>
    <view
      :class="'gm-small-goods-item gm-small-goods-item' + (idx === 0 || idx ? idx : '')"
      :data-productId="goodsData.id"
      :data-storeId="goodsData.storeId"
      :data-easyScene="goodsData.easyScene != null ? goodsData.easyScene : 'none'"
      :id="'products-' + goodsData.id"
      data-type="normal"
      @click="clickGoodsItem"
    >
      <view class="gm-small-goods-img-box">
        <image
          :src="imageUrl"
          mode="aspectFit"
          class="gm-small-goods-img"
          :data-img-url="imageUrl"
        ></image>
        <image
          class="no-balance"
          :src="imagesPath.soldOutIcon"
          v-if="goodsData.balance <= 0 && goodsData.business !== 'DISTRIBUTION'"
          mode="widthFix"
        ></image>
      </view>
      <view class="gm-small-goods-info">
        <text class="gm-small-goods-name">{{ goodsData.name ? goodsData.name : '' }}</text>
        <view style="height: 36rpx" v-if="!recommed">
          <view v-if="goodsData.labels && goodsData.labels.length > 0">
            <view v-for="(item, index) in goodsData.labels" :key="index" v-if="index < 2">
              <view
                class="promotions"
                v-if="item.labelName && !item.imageUrl"
                :style="
                  'background-color: rgb(' +
                  item.color +
                  ');border-color:rgb(' +
                  item.color +
                  ');color: #fff;border-radius: 10rpx'
                "
              >
                {{ item.labelName }}
              </view>
              <image
                style="height: 100%"
                mode="heightFix"
                :src="item.imageUrl"
                v-else-if="item.imageUrl"
              ></image>
            </view>
          </view>
        </view>
        <view class="gm-small-goods-price">
          <view v-if="goodsData.promotionPrice != null">
            <text class="nowPrice">
              <text style="font-size: 20rpx">￥</text>
              {{ filters.filtToFix(goodsData.promotionPrice) }}
            </text>
            <text
              style="font-size: 20rpx; margin-left: 4rpx"
              v-if="goodsData.style == 'SPEC_PARENT'"
            >
              起
            </text>
            <view style="display: flex; align-items: center">
              <text style="text-decoration: line-through; color: #999; margin-left: 10rpx">
                ￥{{
                  goodsData.originalPrice > goodsData.sellPrice
                    ? filters.filtToFix(goodsData.originalPrice)
                    : filters.filtToFix(goodsData.sellPrice)
                }}
              </text>
            </view>
          </view>
          <view v-else>
            <view style="display: flex" v-if="goodsData.memberPrice">
              <view class="nowPrice">
                <view>
                  <text style="font-size: 20rpx">￥</text>
                  {{ filters.filtToFix(goodsData.memberPrice) }}
                  <text
                    style="font-size: 20rpx; margin-left: 4rpx"
                    v-if="goodsData.style == 'SPEC_PARENT'"
                  >
                    起
                  </text>
                </view>
                <view
                  v-if="goodsData.memberPrice && isMember"
                  style="text-decoration: line-through; color: #999; font-size: 20rpx"
                >
                  ￥{{
                    goodsData.originalPrice > goodsData.sellPrice
                      ? filters.filtToFix(goodsData.originalPrice)
                      : filters.filtToFix(goodsData.sellPrice)
                  }}
                </view>
              </view>
              <view
                v-if="goodsData.memberPrice && isMember"
                style="display: flex; padding-top: 10rpx"
              >
                <view class="vipBtn">{{ vipGradeConfig.priceLabel }}</view>
                <!-- <text style="text-decoration:line-through;color: #999;margin-left: 10rpx;">
              ￥{{filters.filtToFix(goodsData.sellPrice)}}
            </text> -->
              </view>
            </view>
            <view style="display: flex" v-else>
              <view class="nowPrice">
                <view>
                  <!-- goodsData.originalPrice > goodsData.sellPrice ? filters.filtToFix(goodsData.originalPrice) :  -->
                  <text style="font-size: 20rpx">￥</text>
                  {{ filters.filtToFix(goodsData.sellPrice) }}
                  <text
                    style="font-size: 20rpx; margin-left: 4rpx"
                    v-if="goodsData.style == 'SPEC_PARENT'"
                  >
                    起
                  </text>
                </view>
                <view
                  v-if="goodsData.memberPrice && isMember"
                  style="text-decoration: line-through; color: #999; font-size: 20rpx"
                >
                  ￥{{ filters.filtToFix(goodsData.memberPrice) }}
                </view>
              </view>
              <view
                v-if="goodsData.memberPrice && isMember"
                style="display: flex; padding-top: 10rpx"
              >
                <view class="vipBtn">{{ vipGradeConfig.priceLabel }}</view>
                <!-- <text style="text-decoration:line-through;color: #999;margin-left: 10rpx;">
              ￥{{filters.filtToFix(goodsData.memberPrice)}}
            </text> -->
              </view>
            </view>
          </view>
          <form @submit.stop="addToCart" @click.stop="noop">
            <view class="add-box" :style="'background-color: ' + themeColor + ';'">
              <button v-if="!hasUserInfo" @click="getUserInfo"></button>
              <button
                v-else
                form-type="submit"
                data-addType="three"
                :data-index="i"
                :data-storeId="goodsData.storeId"
                :data-id="goodsData.id"
                :data-style="goodsData.style"
                :data-balance="goodsData.balance"
                :data-business="goodsData.business"
                :data-initialpurchasenumber="goodsData.initialPurchaseNumber"
                :data-traceId="goodsData.traceId"
              ></button>
              <text class="cart-count" v-if="shopCart[goodsData.id]">
                {{ shopCart[goodsData.id] ? shopCart[goodsData.id] : '' }}
              </text>
              <image class="add-img" :src="gouwuche"></image>
            </view>
          </form>
        </view>
        <!-- <view> <text class="labelsActive" style="margin-right: 10rpx;" wx:for="{{goodsData.labels}}" wx:key="index"  wx:if="{{index<2}}">{{item.labelName}}</text> </view>     -->
        <!-- <form  catch:submit="addToCart" catch:tap="noop">
      <view class="add-box">
        <button wx:if="{{!hasUserInfo}}" bindtap="getUserInfo"></button>
        <button wx:else form-type="submit" data-addType='three' data-index="{{i}}" data-id="{{goodsData.id}}" data-style="{{goodsData.style}}" data-balance="{{goodsData.balance}}" data-business="{{goodsData.business}}" data-traceId="{{goodsData.traceId}}"></button>
        <image class="add-img" src='{{imagesPath.iconNewAdd}}'></image>
      </view>
    </form> -->
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsFlyJs from '@/utils/newretail/fly'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiShopcartServiceJs from '@/service/api/newretail/shopcartService'
import gouwuche from '@/utils/newretail/image/gouwuche.png'
// import { attached, ready, detached } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// components/goods-item-small/goods-item-small.js
const shopcartService = _apiShopcartServiceJs
const productService = _apiProductServiceJs
const NAVPAGE = _utilsNavPageJs
const FLY = _utilsFlyJs
const util = _utilsUtilsJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const selfA = _utilsSelfJs
// 获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  vipGradeConfig: null,
  hasEasyRecPlugins: false,
  isMember: false,
  themeColor: null,
  goodsData: {},
})
const props = defineProps({
  goods: {
    // 商品信息
    type: Object,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    value: null,
  },
  addImage: {
    // 加入购物车图片
    type: String,
    value: '',
  },
  reduceImage: {
    // 减少购物车图片
    type: String,
    value: '',
  },
  goodsType: {
    // 商品类型
    type: String,
    value: 'normal',
  },
  shopCart: {
    // 购物车数据
    type: Object,
    value: {},
  },
  hasAnimation: {
    // 加入购物车动画
    type: Boolean,
    value: false,
  },
  idx: {
    type: String,
    value: '',
  },
  goodsWidth: {
    type: String,
    value: '',
  },
  goodsHeight: {
    type: String,
    value: '',
  },
  hasUserInfo: Boolean,
  recommed: Boolean,
})
watch(
  () => props.goods,
  (newVal, oldVal) => {
    state.goodsData = newVal
    if (newVal != null) {
      state.imageUrl = newVal.categoryImageUrl ? newVal.categoryImageUrl : newVal.imageUrl
    }
  },
)

attached(function () {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.isMember = true
  }
  // 在组件实例进入页面节点树时执行
  if (state.addImage === '' && state.reduceImage === '') {
    state.addImage = state.imagesPath.iconJoin
    state.reduceImage = state.imagesPath.iconMinus
  }
})
ready(function () {
  if (app.globalData.userInfo) {
    state.hasUserInfo = true
  }
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig
  state.hasEasyRecPlugins = app.globalData.hasEasyRecPlugins
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
})
detached(function () {
  // 在组件实例进入页面节点树时执行
  if (state.addImage === '' && state.reduceImage === '') {
    state.addImage = state.imagesPath.iconJoin
    state.reduceImage = state.imagesPath.iconMinus
  }
})
function clickGoodsItem(e) {
  triggerEvent('onClickGoods', e.currentTarget.dataset)
}
function addToCart(e) {
  triggerEvent('addToCart', {
    dataset: e.currentTarget.dataset,
    context: this,
    detail: e.detail,
  })
}
function decrease(e) {
  triggerEvent('decrease', e.currentTarget.dataset)
}
function subscribeArrivalRemind(e) {
  triggerEvent('subscribeArrivalRemind', e.currentTarget.dataset)
}
function noop(e) {
  triggerEvent('noop', e.currentTarget.dataset)
}
function getUserInfo(e) {
  triggerEvent('getUserInfo', e)
}
</script>
<style scoped>
/* components/goods-item-small/goods-item-small.wxss */

.gm-small-goods-item {
  /* flex: 1; */
  /* display: inline-block; */
  float: left;
  width: 344rpx;
  vertical-align: top;
  /* margin: 0 1%; */
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  /* padding: 0 20rpx; */
  box-sizing: border-box;
  padding-bottom: 10rpx;
}

.labelsActive {
  color: #72db86;

  line-height: 24rpx;
  font-size: 24rpx;
}

.gm-small-goods-img-box {
  height: 344rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-radius: 10rpx 10rpx 0 0;
}

.gm-small-goods-img-box image {
  width: 100%;
  height: 100%;
  /* height: 210rpx; */
  background-size: #f1f1f1;
}

.gm-small-goods-img-box .no-balance {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.gm-small-goods-info {
  padding: 0 20rpx;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.gm-small-goods-info > text {
  display: block;
  color: #454545;
}

.gm-small-goods-name {
  font-size: 26rpx;
  font-weight: bold;
  line-height: 36rpx;
  margin-top: 12rpx;
  margin-bottom: 20rpx;
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 72rpx;
}

/* .gm-small-goods-info .gm-small-goods-name, */
.gm-small-goods-info .gm-small-goods-desc {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gm-small-goods-info .gm-small-goods-labels {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30rpx;
  margin: 0 0 18rpx 0;
}

.gm-small-goods-info .gm-small-goods-labels view {
  /* width: 60rpx; */
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 5rpx;
  border: 1rpx solid #ff8561;
  font-size: 18rpx;
  line-height: 42rpx;
  color: #ff8561;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 8rpx;
  font-weight: normal;
  box-sizing: border-box;
  flex-shrink: 0;
}

.gm-small-goods-desc {
  font-size: 20rpx;
  line-height: 32rpx;
  height: 32rpx;
  margin-bottom: 15rpx;
}

.gm-small-goods-price {
  font-size: 20rpx;
  line-height: 36rpx;
  height: 56rpx;
  display: flex;
  align-items: flex-end;
  margin-top: 20rpx;
  justify-content: space-between;
}

.vipBtn {
  font-size: 16rpx;
  font-family:
    PingFang SC-Regular,
    PingFang SC;
  font-weight: 400;
  color: #ffedbd;
  line-height: 18rpx;
  width: 54rpx;
  height: 20rpx;
  background: #1c1f21;
  border-radius: 4rpx;
  margin-left: 20rpx;
  margin-right: 10rpx;
}

.gm-small-goods-price .nowPrice {
  font-size: 30rpx;
  font-weight: bold;
  color: #ff7121;
}
.gm-small-goods-price .oldPrice {
  color: #999;
}

.gm-small-goods-info .add-box {
  /* width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    padding: 0;
    position: absolute;
    right: 0;
    bottom: -20rpx; */
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  padding: 0;
  background-color: #ff8425;
  position: relative;
  /* right: 20rpx;
    bottom: 20rpx; */
}

.gm-small-goods-info .add-box button {
  width: 100%;
  height: 100%;
  background: transparent;
  margin: 0;
  z-index: 1;
}

.gm-small-goods-info .add-box button::after {
  border: none;
}

.gm-small-goods-info .add-box .add-img {
  width: 29rpx;
  height: 27rpx;
  padding: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.add-box .cart-count {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  font-size: 18rpx;
  background-color: #ff2000;
  color: #fff;
  height: 24rpx;
  border-radius: 12rpx;
  line-height: 24rpx;
  padding: 0 6rpx;
}

.gm-small-goods-introduce {
  font-size: 22rpx;
  color: #009136;
  height: 30rpx;
  line-height: 30rpx;
  font-weight: bold;
}

.gm-small-goods-introduce text {
  /* width: 60rpx; */
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 6rpx;
  background: #009136;
  color: #fff;
  font-size: 20rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
}

button.button-hover {
  color: transparent;
  background-color: transparent;
  border: none;
}

.gm-small-goods-item button::after {
  border: 0;
}

.vip-price {
  font-size: 18rpx;
  line-height: 36rpx;
  color: #171613;
  display: inline-flex;
  align-items: center;
}

.vip-price text {
  flex-shrink: 0;
}

.vip-price .vip-label {
  position: relative;
  min-width: 71rpx;
  height: 25rpx;
  flex-shrink: 0;
  margin-top: -4rpx;
}

.vip-price .vip-label image {
  width: 71rpx;
  height: 25rpx;
}

.vip-price .vip-label text {
  white-space: nowrap;
  min-width: calc(100% - 12rpx);
  height: 100%;
  padding: 0 6rpx;
  display: inline-block;
  font-size: 18rpx;
  line-height: 25rpx;
  text-align: center;
  color: #ffeba5;
  background: #403e3e;
  position: absolute;
  left: 6rpx;
  top: 2rpx;
  z-index: 2;
  border-radius: 4rpx;
}

.promotions {
  position: relative;
  bottom: 8rpx;
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 5rpx;
  font-size: 18rpx;
  line-height: 30rpx;
  color: #ff8561;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 8rpx;
  font-weight: normal;
  box-sizing: border-box;
  flex-shrink: 0;
}
</style>
