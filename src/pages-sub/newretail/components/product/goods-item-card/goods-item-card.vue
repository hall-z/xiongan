<template>
  <!--components/product/goods-item-card/goods-item-card.wxml-->
  <view
    :class="
      state.goods1.style === 'SPEC_PARENT' && showSpecParent
        ? 'gm-small-goods-item'
        : 'gm-small-goods-item gm-small-two-goods-item'
    "
    :style="isCoupon ? 'width: 344rpx;height: 513rpx;background: #fff;' : ''"
    :data-productId="props.goods.id"
    :id="'products-' + props.goods.id"
    data-type="normal"
    :data-easyScene="props.goods.easyScene != null ? props.goods.easyScene : 'none'"
    @click="clickGoodsItem"
  >
    <view
      class="gm-small-goods-img-box"
      :style="isCoupon ? 'width: 344rpx;height: 344rpx;background: #fff;' : ''"
    >
      <image
        :src="state.imageUrl"
        mode="aspectFit"
        class="gm-small-goods-img"
        :data-img-url="state.imageUrl"
      ></image>
      <image
        class="no-balance"
        :src="state.imagesPath.soldOutIcon"
        v-if="props.goods.balance <= 0"
        mode="widthFix"
      ></image>
      <image
        class="has-member"
        :src="state.imagesPath.memberIcon"
        v-if="
          (props.goods.memberPrice &&
            props.goods.memberPrice < props.goods.sellPrice &&
            !props.goods.promotionPrice) ||
          (props.goods.memberPrice &&
            props.goods.promotionPrice &&
            props.goods.memberPrice < props.goods.promotionPrice)
        "
      ></image>
    </view>
    <view
      class="gm-small-goods-info"
      :style="isCoupon ? 'padding: 0 10rpx;box-sizing:border-box;' : ''"
    >
      <view class="gm-small-goods-name">{{ props.goods.name ? props.goods.name : '' }}</view>
      <text class="gm-small-goods-desc" v-if="props.goods.description">
        {{ props.goods.description ? props.goods.description : '' }}
      </text>
      <view v-if="state.goods1.style === 'SPEC_PARENT' && showSpecParent" class="spec-parent-box">
        <view v-for="(item, index) in state.goods1.specDetailsNameDTO.specDetailsJson" :key="index">
          <view class="spec-parent-item" v-if="index < 3 && item.imageUrl">
            <image v-if="item.imageUrl" :src="item.imageUrl" mode="widthFix"></image>
            <image v-else-if="item[0]" :src="item[0].imageUrl" mode="widthFix"></image>
          </view>
        </view>
        <view class="spec-parent-sum">
          共{{ state.goods1.specDetailsNameDTO.specDetailsJson.length }}款
        </view>
      </view>
      <view style="display: flex; align-items: center; justify-content: space-between">
        <view class="gm-small-goods-price">
          <view
            v-if="
              props.goods.promotionPrice != null &&
              props.goods.promotionPrice < props.goods.sellPrice &&
              (!props.goods.memberPrice || props.goods.promotionPrice < props.goods.memberPrice)
            "
          >
            <text class="nowPrice">
              <text style="font-size: 20rpx">￥</text>
              {{ props.goods.promotionPrice }}
              <text
                style="font-size: 20rpx; margin-left: 4rpx"
                v-if="props.goods.style == 'SPEC_PARENT'"
              >
                起
              </text>
            </text>
            <view
              class="vip-price"
              v-if="
                state.goods1.memberPrice && state.goods1.memberPrice < state.goods1.promotionPrice
              "
            >
              <view class="vip-label">
                <image :src="state.imagesPath.iconVipLabel"></image>
                <text>{{ vipGradeConfig.priceLabel }}</text>
                <!-- <text>会员价</text> -->
              </view>
            </view>
            <text
              class="oldPrice"
              v-if="
                props.goods.sellPrice > props.goods.promotionPrice ||
                props.goods.originalPrice > props.goods.promotionPrice
              "
            >
              ￥{{
                props.goods.originalPrice > props.goods.sellPrice
                  ? props.goods.originalPrice
                  : props.goods.sellPrice
              }}
            </text>
          </view>
          <view
            v-else-if="
              props.goods.memberPrice != null && props.goods.memberPrice < props.goods.sellPrice
            "
          >
            <text class="nowPrice">
              <text style="font-size: 20rpx">￥</text>
              {{ props.goods.memberPrice }}
              <text
                style="font-size: 20rpx; margin-left: 4rpx"
                v-if="props.goods.style == 'SPEC_PARENT'"
              >
                起
              </text>
            </text>
            <text
              class="oldPrice"
              v-if="
                props.goods.sellPrice > props.goods.memberPrice ||
                props.goods.originalPrice > props.goods.memberPrice
              "
            >
              ￥{{
                props.goods.originalPrice > props.goods.sellPrice
                  ? props.goods.originalPrice
                  : props.goods.sellPrice
              }}
            </text>
          </view>
          <view v-else>
            <text class="nowPrice">
              <text style="font-size: 20rpx" v-if="props.goods.sellPrice">￥</text>
              {{ props.goods.sellPrice ? props.goods.sellPrice : '' }}
              <text
                style="font-size: 20rpx; margin-left: 4rpx"
                v-if="props.goods.style == 'SPEC_PARENT' && props.goods.sellPrice"
              >
                起
              </text>
            </text>
            <view
              class="vip-price"
              v-if="
                state.goods1.memberPrice && state.goods1.memberPrice < state.goods1.promotionPrice
              "
            >
              <view class="vip-label">
                <image :src="state.imagesPath.iconVipLabel"></image>
                <text>{{ state.vipGradeConfig.priceLabel }}</text>
                <!-- <text>会员价</text> -->
              </view>
            </view>
            <text
              class="oldPrice"
              v-if="
                props.goods.originalPrice != null &&
                props.goods.sellPrice < props.goods.originalPrice
              "
            >
              ￥{{ props.goods.originalPrice }}
            </text>
          </view>
        </view>
        <form @submit.stop="addToCart" @click.stop="noop">
          <view class="add-box" :style="'background-color: ' + state.themeColor + ';'">
            <button v-if="!props.hasUserInfo" @click="getUserInfo"></button>
            <button
              v-else
              form-type="submit"
              data-addType="three"
              :data-index="i"
              :data-id="props.goods.id"
              :data-style="props.goods.style"
              :data-balance="props.goods.balance"
              :data-business="props.goods.business"
              :data-initialpurchasenumber="props.goods.initialPurchaseNumber"
              :data-traceId="props.goods.traceId"
            ></button>
            <image class="add-img" :src="state.addImage"></image>
            <text class="cart-count" v-if="props.shopCart[props.goods.id]">
              {{ props.shopCart[props.goods.id] ? props.shopCart[props.goods.id] : '' }}
            </text>
            <!-- <button wx:if="{{!hasUserInfo}}" bindtap="getUserInfo"></button>
          <button wx:else form-type="submit" data-addType='three' data-index="{{i}}" data-id="{{props.goods.id}}" data-style="{{props.goods.style}}" data-balance="{{props.goods.balance}}" data-business="{{props.goods.business}}"  data-initialpurchasenumber="{{props.goods.initialPurchaseNumber}}" data-traceId="{{props.goods.traceId}}"></button>
          <image class="add-img" src='{{state.imagesPath.iconNewAdd}}'></image> -->
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
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsFlyJs from '@/utils/newretail/fly'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiShopcartServiceJs from '@/service/api/newretail/shopcartService'
// import { attached, ready, detached } from "@dcloudio/uni-app";
import { reactive, watch, onBeforeMount, onMounted, onUnmounted } from 'vue'
const app = getApp()
// components/product/goods-item-card/goods-item-card.js
const shopcartService = _apiShopcartServiceJs
const productService = _apiProductServiceJs
const NAVPAGE = _utilsNavPageJs
const FLY = _utilsFlyJs
const util = _utilsUtilsJs
const AUTHORIZE = _utilsAuthorizeJs
const IMGAGESPATH = _utilsImagesPathJs
const self = _utilsSelfJs
const themeManager = _utilsThemeManagerJs
// 获取应用实例
const state = reactive({
  goods1: {},
  imagesPath: IMGAGESPATH,
  vipGradeConfig: null,
  themeColor: uni.getStorageSync('themeColor'),
  // themeColor: themeManager ? themeManager.color : wx.getStorageSync('themeColor'),
  hasEasyRecPlugins: false,
})
const emit = defineEmits([
  'onClickGoods',
  'addToCart',
  'decrease',
  'subscribeArrivalRemind',
  'noop',
  'getUserInfo',
])
const props = defineProps({
  showSpecParent: Boolean,
  isCoupon: Boolean,
  // 是否是在可用券商品列表展示
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
  goodsWidth: {
    type: String,
    value: '',
  },
  goodsHeight: {
    type: String,
    value: '',
  },
  hasUserInfo: Boolean,
})
onBeforeMount(() => {
  // 在组件实例进入页面节点树时执行
  if (props.addImage === '' && props.reduceImage === '') {
    state.addImage = state.imagesPath.shopping_icon_list
    state.reduceImage = state.imagesPath.iconMinus
  }
})
onMounted(function () {
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
onUnmounted(function () {
  // 在组件实例进入页面节点树时执行
  if (state.addImage === '' && state.reduceImage === '') {
    state.addImage = state.imagesPath.shopping_icon_list
    state.reduceImage = state.imagesPath.iconMinus
  }
})
function clickGoodsItem(e) {
  emit('onClickGoods', e.currentTarget.dataset)
}
function addToCart(e) {
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
    // console.log('newVal.imageUrl',newVal)
    state.imageUrl = newVal.categoryImageUrl ? newVal.categoryImageUrl : newVal.imageUrl
    //    await self.getTemporaryUrl(newVal.imageUrl)
    //       .then (res=>{
    //        this.setData({
    //           imageUrl:res
    //        })
    //       })
    state.goods1 = newVal
  },
)
</script>
<style scoped>
/* components/product/goods-item-card/goods-item-card.wxss */
.gm-small-goods-item {
  float: left;
  width: 256rpx;
  /* height: 467rpx; */
  vertical-align: top;
  margin-bottom: 20rpx;
}
.gm-small-two-goods-item {
  float: left;
  width: 256rpx;
  height: auto;
  min-height: 367rpx;
  vertical-align: top;
  margin-bottom: 20rpx;
}
.gm-small-goods-img-box {
  width: 258rpx;
  height: 258rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-radius: 10rpx;
}
.gm-small-goods-img-box image {
  width: 100%;
  height: 100%;
}
.gm-small-goods-img-box .no-balance {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.gm-small-goods-img-box .has-member {
  width: 78rpx;
  height: 31rpx;
  position: absolute;
  top: 0;
  right: 0;
}
.gm-small-goods-info {
  position: relative;
  width: 100%;
  min-height: 110rpx;
}
.gm-small-goods-info > text {
  display: block;
  color: #999999;
}
.gm-small-goods-name {
  font-size: 23rpx;
  color: #333333;
  font-weight: 400;
  line-height: 26rpx;
  max-height: 52rpx;
  margin-top: 12rpx;
  margin-bottom: 8rpx;
  font-weight: 700;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
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
  font-size: 18rpx;
  line-height: 32rpx;
  height: 32rpx;
  margin-bottom: 15rpx;
  color: #999999;
}
.gm-small-goods-price {
  /* position: absolute; */
  /* bottom: -4rpx; */
  /* left: 16rpx; */
  /* left: 0; */
  font-size: 22rpx;
  line-height: 36rpx;
  height: 36rpx;
  display: flex;
  /* align-items: flex-end; */
  align-items: center;
}
.gm-small-goods-price .nowPrice {
  font-size: 30rpx;
  color: #fe8661;
  font-weight: 700;
}
.gm-small-goods-price .oldPrice {
  font-size: 20rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 4rpx;
}
.gm-small-goods-info .add-box {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  padding: 0;
  position: relative;
  /* right: 10rpx; */
  /* bottom: -4rpx; */
  background-color: #ff8425;
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
  width: 22rpx;
  height: 20rpx;
  padding: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.gm-small-goods-item .add-box .cart-count {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  font-size: 18rpx;
  background-color: #ff2000;
  color: #fff;
  height: 24rpx;
  min-width: 13rpx;
  border-radius: 50%;
  text-align: center;
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
.spec-parent-box {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 14rpx;
}
.spec-parent-item {
  width: 50rpx;
  height: 50rpx;
  margin-right: 7rpx;
}
.spec-parent-item image {
  width: 100%;
  height: auto;
}
.spec-parent-sum {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 20rpx;
  color: #a1a1a1;
}
</style>
