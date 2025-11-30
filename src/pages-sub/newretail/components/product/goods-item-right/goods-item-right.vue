<template>
  <!--components/product/goods-item-right/goods-item-right.wxml-->
  <view
    class="wm-goods-item"
    :data-productId="state.goods1.id"
    :id="'products-' + state.goods1.id"
    :data-type="props.goodsType"
    :data-easyScene="state.goods1.easyScene != null ? state.goods1.easyScene : 'none'"
    @click="clickGoodsItem"
  >
    <!-- {{ JSON.stringify(state.goods1) }} -->
    <view class="wm-goods-img-box">
      <image
        class="wm-goods-img"
        :src="state.imageUrl"
        :data-img-url="state.imageUrl"
        lazy-load="true"
        mode="aspectFit"
      ></image>
      <image
        class="no-balance"
        :src="state.imagesPath.soldOutIcon"
        v-if="state.goods1.balance <= 0"
      ></image>
      <image
        class="has-member"
        :src="state.imagesPath.memberIcon"
        v-if="
          (state.goods1.memberPrice &&
            state.goods1.memberPrice < state.goods1.sellPrice &&
            !state.goods1.promotionPrice) ||
          (state.goods1.memberPrice &&
            state.goods1.promotionPrice &&
            state.goods1.memberPrice < state.goods1.promotionPrice)
        "
      ></image>
    </view>
    <view class="wm-goods-info">
      <view class="wm-goods-top">
        <view class="wm-goods-name">
          <!-- <text wx:for="{{state.goods1.produtlabel}}" wx:key="index" wx:if="{{index<3}}" style="background-color:rgb({{item.color}})">{{item.labelName}}</text> -->
          <view>{{ state.goods1.name }}</view>
        </view>
        <text class="wm-goods-desc" v-if="state.goods1.description">
          {{ state.goods1.description ? state.goods1.description : '' }}
        </text>
        <view v-if="state.goods1.style === 'SPEC_PARENT' && showSpecParent" class="spec-parent-box">
          <view
            v-for="(item, index) in state.goods1.specDetailsNameDTO.specDetailsJson"
            :key="index"
          >
            <view class="spec-parent-item" v-if="index < 4 && item.imageUrl">
              <image :src="item.imageUrl" mode="widthFix"></image>
            </view>
          </view>
          <view class="spec-parent-sum">
            共{{ state.goods1.specDetailsNameDTO.specDetailsJson.length }}款
          </view>
        </view>
        <view class="wm-goods-name label-text">
          <view v-for="(item, index) in state.goods1.produtlabel" :key="index" v-show="index < 3">
            <text
              v-if="item.type != 'PROMOTIONLABEL' && item.labelName && !item.imageUrl"
              :style="'background-color:rgb(' + item.color + ')'"
            >
              {{ item.labelName }}
            </text>
            <image
              style="height: 100%"
              mode="heightFix"
              :src="item.imageUrl"
              v-else-if="item.imageUrl"
            ></image>
          </view>
        </view>
        <!-- <text class="wm-goods-sold">已售 {{state.goods1.soldCount}}</text> -->
        <view class="wm-goods-labels" v-if="state.promotionsLabels">
          <view
            v-for="(item, index) in state.goods1.promotions"
            :key="index"
            :data-id="index"
            v-show="index < 3"
          >
            <view
              v-if="item.type != 'PROMOTIONLABEL'"
              :style="'border-color:rgb(' + item.color + ')'"
            >
              {{ item.labelName }}
            </view>
          </view>
        </view>
        <view class="labels-board" v-if="state.goods1.promotions?.length > 0">
          <!-- <view class="labels-title">促销:</view> -->
          <view class="labels-content-board">
            <view v-for="(item, index) in state.goods1.promotions" :key="index">
              <view class="labels-content" v-if="item.type == 'PROMOTIONLABEL'">
                <view class="labels-tag">{{ item.labelName }}</view>
                <text class="labels-content">{{ item.labelDetails }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="wm-goods-bottom">
        <view class="wm-goods-price" v-if="state.goods1.sellPrice != null">
          ￥
          <view v-if="state.goods1.promotionPrice != null">
            <text class="nowPrice">
              {{
                state.goods1.sellPrice && state.goods1.sellPrice < state.goods1.promotionPrice
                  ? state.goods1.memberPrice && state.goods1.memberPrice < state.goods1.sellPrice
                    ? state.goods1.memberPrice
                    : state.goods1.sellPrice
                  : state.goods1.memberPrice &&
                      state.goods1.memberPrice < state.goods1.promotionPrice
                    ? state.goods1.memberPrice
                    : state.goods1.promotionPrice
              }}
            </text>
            <text style="font-size: 20rpx" v-if="state.goods1.style == 'SPEC_PARENT'">起</text>
            <!-- <view class="vip-price" wx:if="{{state.goods1.memberPrice && state.goods1.memberPrice < state.goods1.promotionPrice}}">
                <view class="vip-label">
                  <image src="{{state.imagesPath.iconVipLabel}}"></image>
                  <text>{{vipGradeConfig.priceLabel}}</text>
                </view>
              </view> -->
            <text class="oldPrice">
              ￥{{
                state.goods1.originalPrice > state.goods1.sellPrice
                  ? state.goods1.originalPrice
                  : state.goods1.sellPrice
              }}
            </text>
          </view>
          <view v-else>
            <text class="nowPrice">
              {{
                state.goods1.memberPrice && state.goods1.memberPrice < state.goods1.sellPrice
                  ? state.goods1.memberPrice
                  : state.goods1.sellPrice
                    ? state.goods1.sellPrice
                    : state.goods1.originalPrice
              }}
            </text>
            <text style="font-size: 20rpx" v-if="state.goods1.style == 'SPEC_PARENT'">起</text>
            <!-- <view class="vip-price" wx:if="{{state.goods1.memberPrice && state.goods1.memberPrice < state.goods1.sellPrice}}">
                <text class="oldPrice" wx:if="{{state.goods1.originalPrice && state.goods1.memberPrice < state.goods1.originalPrice}}">￥{{state.goods1.originalPrice}}</text>
                <view class="vip-label">
                  <image src="{{state.imagesPath.iconVipLabel}}"></image>
                  <text>{{vipGradeConfig.priceLabel}}</text>
                </view>
              </view> -->
            <text
              class="oldPrice"
              v-else-if="
                state.goods1.originalPrice != null &&
                state.goods1.sellPrice < state.goods1.originalPrice
              "
            >
              ￥{{ state.goods1.originalPrice }}
            </text>
          </view>
        </view>
        <form @submit.stop="addToCart" @click.stop="noop">
          <view
            class="wm-cart-control"
            :hidden="state.goods1.balance <= 0 && state.goods1.business !== 'DISTRIBUTION'"
          >
            <view v-if="state.goods1.style !== 'MEALS'">
              <!-- <view class="reduce-box" hidden="{{(!shopCart[state.goods1.id])}}" style="margin-left: {{(state.goods1.promotionPrice != null && state.goods1.memberPrice && state.goods1.memberPrice < state.goods1.promotionPrice && state.goods1.memberPrice < state.goods1.sellPrice) || (state.goods1.promotionPrice == null && state.goods1.memberPrice && state.goods1.memberPrice < state.goods1.sellPrice) ? 58 : ''}}rpx"> -->
              <!-- <view class="reduce-box" hidden="{{!shopCart[state.goods1.id]}}">
                    <button form-type="submit" data-balance="{{state.goods1.balance}}" data-style="{{state.goods1.style}}" data-type="reduce" data-id="{{state.goods1.id}}"  data-initialpurchasenumber="{{state.goods1.initialPurchaseNumber}}" data-business="{{state.goods1.business}}" data-traceId="{{state.goods1.traceId}}"></button>
                    <image class="reduce-img" src='{{reduceImage}}'></image>
                </view> -->
            </view>
            <view class="add-box" :style="'background-color: ' + state.themeColor + ';'">
              <button v-if="!state.hasUserInfo" @click="getUserInfo"></button>
              <button
                v-else
                form-type="submit"
                data-addType="normal"
                :data-balance="state.goods1.balance"
                :data-style="state.goods1.style"
                data-type="add"
                :data-initialpurchasenumber="state.goods1.initialPurchaseNumber"
                :data-id="state.goods1.id"
                :data-business="state.goods1.business"
                :data-traceId="state.goods1.traceId"
              ></button>
              <image class="add-img" :src="addImageIcon"></image>
              <text class="cart-count" v-if="props.shopCart && props.shopCart[state.goods1.id]">
                {{ props.shopCart[state.goods1.id] ? props.shopCart[state.goods1.id] : '' }}
              </text>
            </view>
          </view>
        </form>
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import { reactive, watch, onBeforeMount } from 'vue'
const app = getApp()
// components/product/goods-item-right/goods-item-right.js
const IMGAGESPATH = _utilsImagesPathJs
const self = _utilsSelfJs
const themeManager = _utilsThemeManagerJs
// 获取应用实例
const state = reactive({
  promotionsLabels: false,
  goods1: {},
  imagesPath: IMGAGESPATH,
  shopCartGoodsId: [],
  vipGradeConfig: null,
  hasUserInfo: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  hasEasyRecPlugins: false,
})
const props = defineProps({
  goods: {
    // 商品信息
    type: Object,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
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
  // hasUserInfo: Boolean,
  showSpecParent: Boolean,
})
let addImageIcon = state.imagesPath.shopping_icon_list
onBeforeMount(() => {
  // 在组件实例进入页面节点树时执行
  if (app.globalData.userInfo) {
    state.hasUserInfo = true
  }
  addImageIcon = props.addImage
  if (props.addImage === '' && state.reduceImage === '') {
    addImageIcon = state.imagesPath.shopping_icon_list
    state.reduceImage = state.imagesPath.iconMinus
  }
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig
  state.hasEasyRecPlugins = app.globalData.hasEasyRecPlugins
  state.themeColor = themeManager ? themeManager.color : uni.getStorageSync('themeColor')
  // 基础库2.23以上触发
  // state.themeColor = themeManager ? themeManager.color : uni.getStorageSync('themeColor')
})

const emit = defineEmits([
  'onClickGoods',
  'addToCart',
  'decrease',
  'subscribeArrivalRemind',
  'noop',
  'getUserInfo',
])
function clickGoodsItem(e) {
  emit('onClickGoods', e.currentTarget.dataset)
}
function addToCart(e) {
  console.log('用户点击了：', e)
  emit('addToCart', {
    dataset: e.currentTarget.dataset,
    context: this,
    detail: e.detail,
  })
}
function decrease(e) {
  emit('decrease', e.currentTarget.dataset)
}
function subscribeArrivalRemind(e) {
  emit('subscribeArrivalRemind', e.currentTarget.dataset)
}
function noop(e) {
  emit('noop', e.currentTarget.dataset)
}
function getUserInfo(e) {
  emit('getUserInfo', e)
}

// Watch listeners converted from observers
watch(
  () => props.goods,
  (newVal, oldVal) => {
    //  await self.getTemporaryUrl(newVal.imageUrl)
    // .then (res=>{

    // })
    if (newVal.promotionPrice) {
      newVal.promotionPrice = parseFloat(newVal.promotionPrice.toFixed(2))
    }
    if (newVal.sellPrice) {
      newVal.sellPrice = parseFloat(newVal.sellPrice.toFixed(2))
    }
    if (newVal.memberPrice) {
      newVal.memberPrice = parseFloat(newVal.memberPrice.toFixed(2))
    }
    if (newVal.originalPrice) {
      newVal.originalPrice = parseFloat(newVal.originalPrice.toFixed(2))
    }
    if (
      newVal.style === 'SPEC_PARENT' &&
      newVal.specDetailsNameDTO &&
      newVal.specDetailsNameDTO.specDetailsJson
    ) {
      newVal.specDetailsNameDTO.specDetailsJson = JSON.parse(
        newVal.specDetailsNameDTO.specDetailsJson,
      )
      const newImageList = []
      deconstruction(newVal.specDetailsNameDTO.specDetailsJson)
      function deconstruction(list) {
        if (Array.isArray(list)) {
          list.forEach((listItem) => {
            deconstruction(listItem)
          })
        } else if (list.status == 'ON') {
          newImageList.push(list)
        }
      }
      newVal.specDetailsNameDTO.specDetailsJson = newImageList
    }
    if (
      newVal.promotions &&
      newVal.promotions.length > 0 &&
      newVal.promotions.some((item) => item.type != 'PROMOTIONLABEL')
    ) {
      state.promotionsLabels = true
    }
    state.imageUrl = newVal.categoryImageUrl ? newVal.categoryImageUrl : newVal.imageUrl
    state.goods1 = newVal
  },
  { immediate: true },
)
</script>
<style scoped>
/* components/product/goods-item-right/goods-item-right.wxss */
.wm-goods-item {
  min-height: 180rpx;
  /* border-bottom: 1rpx solid #f0f0f0; */
  padding: 10rpx 30rpx 10rpx 18rpx;
  display: flex;
  justify-content: space-between;
  /* overflow: hidden; */
}
.wm-goods-box .wm-goods-item:last-of-type {
  border-bottom: none;
}
.wm-goods-img-box {
  /* width: 164rpx;
  height: 164rpx; */
  width: 246rpx;
  height: 246rpx;
  overflow: hidden;
  float: left;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10rpx;
}
.wm-goods-img-box image {
  width: 100%;
  height: 100%;
}
.wm-goods-img-box .no-balance {
  position: absolute;
  top: 0;
  left: 0;
}
.wm-goods-img-box .has-member {
  width: 78rpx;
  height: 31rpx;
  position: absolute;
  top: 0;
  right: 0;
}
.wm-goods-info {
  width: calc(100% - 246rpx - 18rpx);
  flex: 1;
  /* min-height: 184rpx; */
  min-height: 250rpx;
  /* padding-top: 9rpx; */
  position: relative;
  float: right;
  margin-left: 18rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #dddddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.wm-goods-info .wm-goods-introduce {
  font-size: 22rpx;
  color: #009136;
  height: 30rpx;
  line-height: 30rpx;
  font-weight: bold;
}
.wm-goods-info .wm-goods-introduce > text {
  padding: 0 10rpx;
  height: 30rpx;
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
.wm-goods-info .wm-goods-desc,
.wm-goods-info .wm-goods-sold {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wm-goods-info .wm-goods-name {
  color: #333;
  font-size: 24rpx;
  line-height: 28rpx;
  /* line-height: 42rpx;
  height: 42rpx; */
  font-weight: bold;
  margin: 0 0 5rpx 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
}
.wm-goods-info .wm-goods-name text {
  min-height: 30rpx;
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
  flex-shrink: 0;
}
.wm-goods-info .wm-goods-name view {
  /* width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: Medium; */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.wm-goods-info .label-text text {
  font-size: 14rpx;
}
.wm-goods-info .wm-goods-labels {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30rpx;
  margin: 6rpx 0 5rpx 0;
  font-size: 20rpx;
}
.wm-goods-info .wm-goods-labels view {
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
.wm-goods-info .wm-goods-desc,
.wm-goods-info .wm-goods-sold {
  color: #454545;
  height: 27rpx;
  font-size: 20rpx;
}
.wm-goods-info .wm-goods-desc {
  margin-bottom: 10rpx;
  color: #999999;
}
.wm-goods-info .wm-goods-sold {
  margin-top: 5rpx;
}
.tag-box {
  min-height: 40rpx;
  line-height: 40rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}
.tag-box view {
  display: inline-block;
  height: 24rpx;
  line-height: 24rpx;
  font-size: 22rpx;
  padding: 2rpx 10rpx;
  border: 1px solid #f00;
  border-radius: 14rpx;
  margin-right: 10rpx;
  vertical-align: middle;
}
.wm-goods-top {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.wm-goods-bottom {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  /* margin-top: 30rpx; */
}
.wm-goods-price {
  /* padding-top: 25rpx; */
  position: relative;
  color: #ff8561;
  font-size: 22rpx;
  /* margin-top: 16rpx; */
  line-height: 40rpx;
  display: flex;
}
.wm-goods-price .nowPrice {
  font-size: 30rpx;
  font-weight: 800;
  margin-left: -4rpx;
  margin-right: 4rpx;
}
.wm-goods-price .oldPrice {
  font-size: 22rpx;
  color: #999;
  text-decoration: line-through;
}
.wm-goods-item .wm-cart-control {
  position: absolute;
  right: 0;
  bottom: 0rpx;
  width: 140rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  line-height: 80rpx;
  text-align: center;
}
.wm-goods-item .add-box,
.wm-goods-item .reduce-box {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  padding: 0;
}
.wm-goods-item .add-box {
  position: absolute;
  right: 0;
  background-color: #ff8425;
}
.wm-goods-item .reduce-box {
  position: absolute;
  left: 0;
}
.wm-goods-item .add-box button,
.wm-goods-item .reduce-box button {
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1;
  padding: 0;
}
.wm-goods-item .add-box button::after,
.wm-goods-item .reduce-box button::after {
  border: 0;
}
.wm-goods-item .add-box .cart-count {
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
.add-img,
.reduce-img {
  width: 29rpx;
  height: 27rpx;
  padding: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* margin-top: -20rpx;
  margin-left: -10rpx; */
}
.wm-cart-control .cart-count {
  font-size: 28rpx;
  color: #454545;
  height: 40rpx;
  line-height: 40rpx;
}
button.button-hover {
  color: transparent;
  background-color: transparent;
  border: none;
}
.wm-goods-item button::after {
  border: 0;
}
.vip-price {
  font-size: 24rpx;
  line-height: 36rpx;
  color: #171613;
  display: inline-flex;
  align-items: center;
}
.vip-price text {
  flex-shrink: 0;
}
.vip-price .vip-label {
  position: absolute;
  top: 0;
  left: 0;
  /* position: relative; */
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
.labels-board {
  font-size: 28rpx;
  line-height: 48rpx;
  color: #454545;
  background: #fff;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  /* border-top: 1px solid #F1F1F1; */
}
.labels-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
.labels-tag {
  border: 1rpx solid #ff7200;
  color: #ff7200;
  font-size: 18rpx;
  height: 28rpx;
  line-height: 28rpx;
  padding: 0rpx 8rpx;
  flex-shrink: 0;
  margin-top: 2rpx;
  /* margin-left: 10rpx; */
  margin-right: 10rpx;
}
.labels-content {
  color: #ff7200;
  font-size: 18rpx;
  height: 28rpx;
  line-height: 28rpx;
  flex-shrink: 0;
  margin-top: 2rpx;
  display: flex;
  align-items: center;
}
.labels-title {
  flex-shrink: 0;
}
.spec-parent-box {
  width: 100%;
  display: flex;
  align-items: center;
}
.spec-parent-item {
  width: 50rpx;
  height: 50rpx;
  margin-right: 7rpx;
  border-radius: 5rpx;
  overflow: hidden;
}
.spec-parent-item image {
  width: 100%;
}
.spec-parent-sum {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 20rpx;
  color: #a1a1a1;
}
</style>
