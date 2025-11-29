<template>
  <!--components/goods-item-small/goods-item-small.wxml-->

  <view>
    <!-- <view class="gm-small-goods-item {{idx ? 'nomargin' : ''}} {{styleType}}" style="{{backGroundType == 'color' ? ('background-color: ' + backGroundColor) : ('background-image: url(' + (backGroundImgObj ? backGroundImgObj.imageUrl : '') + ')')}};width: calc({{goodsWidth}} - {{(modelMargin ? modelMargin * 2 : 2)}}px); height: calc({{goodsHeight }} + 1px);margin: {{modelMargin || -1}}px;font-weight: {{textStyle}};text-align: {{alignStyle}};border-radius: {{fillet}}px"  data-productId="{{goodsData.id}}" id="products-{{goodsData.id}}" data-type="normal" data-easyScene="{{goodsData.easyScene != null ? goodsData.easyScene :'none'}}" bindtap="clickGoodsItem"> -->
    <view
      :class="'gm-small-goods-item ' + (idx ? 'nomargin' : '') + ' ' + styleType"
      :style="
        (backGroundType == 'color'
          ? 'background-color: ' + backGroundColor
          : 'background-image: url(' + (backGroundImgObj ? backGroundImgObj.imageUrl : '') + ')') +
        ';width: calc(' +
        goodsWidth +
        ' - ' +
        (modelMargin ? modelMargin * 2 : 2) +
        'px);margin: ' +
        (modelMargin || -1) +
        'px;font-weight: ' +
        textStyle +
        ';text-align: ' +
        alignStyle +
        ';border-radius: ' +
        fillet +
        'px'
      "
      :data-productId="goodsData.id"
      :data-storeId="goodsData.storeId"
      :id="'products-' + goodsData.id"
      data-type="normal"
      :data-easyScene="goodsData.easyScene != null ? goodsData.easyScene : 'none'"
      @click="clickGoodsItem"
    >
      <view class="gm-small-goods-img-box" :style="'height: ' + imageHeight">
        <image
          :src="imageUrl"
          mode="aspectFill"
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
        <view class="gm-small-goods-name">
          <view>{{ goodsData.name ? goodsData.name : '' }}</view>
        </view>
        <!-- <view wx:if="{{!goodsData.close}}" class="promotions" style="{{goodsData.promotions.length > 0 ? 'border: 1rpx solid #ff8561;' : ''}};border-color:rgb({{goodsData.promotions[0].color}})">{{goodsData.promotions[0].labelName}}</view> -->
        <view
          v-if="!goodsData.close"
          class="promotions"
          :style="
            (goodsData.labels.length > 0 && goodsData.labels[0].labelName ? '' : '') +
            '; margin: 20rpx 0;'
          "
        >
          <!-- {{goodsData.labels.lngth > 0 && goodsData.labels[0].labelName? 'border: 1rpx solid #ff8561;' : ''}}; -->
          <text
            v-if="goodsData.labels[0].labelName && !goodsData.labels[0].imageUrl"
            :style="
              'background-color: rgb(' +
              goodsData.labels[0].color +
              ');border-color:rgb(' +
              goodsData.labels[0].color +
              ');color: #fff;border-radius: 10rpx'
            "
          >
            {{ goodsData.labels[0].labelName }}
          </text>
          <image
            style="height: 100%"
            mode="heightFix"
            :src="goodsData.labels[0].imageUrl"
            v-else-if="goodsData.labels[0].imageUrl"
          ></image>
        </view>
        <view
          class="gm-small-goods-price"
          :style="alignStyle == 'center' ? 'justify-content: center;' : ''"
        >
          <view v-if="goodsData.promotionPrice != null">
            <text class="nowPrice" :style="'color: ' + activityColor">
              <text style="font-size: 20rpx">￥</text>
              {{ goodsData.promotionPrice }}
              <text
                style="font-size: 20rpx; margin-left: 4rpx"
                v-if="goodsData.style == 'SPEC_PARENT'"
              >
                起
              </text>
            </text>
            <text
              class="oldPrice"
              v-if="goodsData.sellPrice > goodsData.promotionPrice && underlinePriceShow != 'FALSE'"
            >
              ￥{{
                goodsData.originalPrice > goodsData.sellPrice
                  ? filtToFix(goodsData.originalPrice)
                  : filtToFix(goodsData.sellPrice)
              }}
            </text>
          </view>
          <view v-else>
            <text class="nowPrice" :style="'color: ' + activityColor">
              <text style="font-size: 20rpx">￥</text>
              {{
                goodsData.sellPrice
                  ? filtToFix(goodsData.sellPrice)
                  : goodsData.price
                    ? goodsData.price
                    : '0'
              }}
              <text
                style="font-size: 20rpx; margin-left: 4rpx"
                v-if="goodsData.style == 'SPEC_PARENT'"
              >
                起
              </text>
            </text>
            <text
              class="oldPrice"
              v-if="
                goodsData.originalPrice != null &&
                goodsData.sellPrice < goodsData.originalPrice &&
                underlinePriceShow != 'FALSE'
              "
            >
              ￥{{ goodsData.originalPrice }}
            </text>
          </view>
          <form @submit.stop="addToCart" @click.stop="noop">
            <!-- <view class="add-box" style="background-color: {{themeColor}};">
          <button wx:if="{{!hasUserInfo}}" bindtap="getUserInfo"></button>
          <button wx:else form-type="submit" data-addType='three' data-index="{{i}}" data-id="{{goodsData.id}}" data-style="{{goodsData.style}}" data-balance="{{goodsData.balance}}" data-business="{{goodsData.business}}"  data-initialpurchasenumber="{{goodsData.initialPurchaseNumber}}" data-traceId="{{goodsData.traceId}}"></button>
          <text class="cart-count" wx:if="{{shopCart[goodsData.id]}}">{{shopCart[goodsData.id] ? shopCart[goodsData.id] : ''}}</text>
          <image class="add-img" src='../../utils/image/gouwuche.png'></image>
        </view> -->
            <view
              v-if="shopCarType == 'car'"
              class="add-box"
              :style="
                'background-color: ' +
                (shopCarType != 'hollow' ? themeColor : '#fff') +
                ';border: 1px solid ' +
                themeColor +
                '; color: ' +
                (shopCarType != 'hollow' ? '#fff' : themeColor)
              "
            >
              <button v-if="!hasUserInfo" @click="getUserInfo"></button>
              <button
                v-else
                form-type="submit"
                data-addType="three"
                :data-index="i"
                :data-id="goodsData.id"
                :data-style="goodsData.style"
                :data-balance="goodsData.balance"
                :data-business="goodsData.business"
                :data-initialpurchasenumber="goodsData.initialPurchaseNumber"
                :data-traceId="goodsData.traceId"
              ></button>
              <image
                v-if="!shopCarType || shopCarType == 'car'"
                class="add-img"
                :src="addImage"
              ></image>
            </view>
            <view
              v-else-if="shopCarType != 'empty'"
              class="add-box add-box1"
              :style="'color: ' + themeColor"
            >
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
              <text
                :class="
                  'add_text iconfont ' +
                  (shopCarType != 'hollow' ? 'icon-jiahao2fill' : 'icon-jiahao')
                "
              ></text>
            </view>
          </form>
        </view>
        <!-- <view class="vip-price" wx:if="{{goodsData.memberPrice}}">
      <text>￥{{goodsData.memberPrice}}</text>
      <view class="vip-label">
        <image src="{{imagesPath.iconVipLabel}}"></image>
        <text>{{vipGradeConfig.priceLabel}}</text>
      </view>
    </view> -->
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
import { reactive, watch } from 'vue'
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
  themeColor: null,
  goodsData: {},
})
const props = defineProps({
  goods: {
    // 商品信息
    type: Object,
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
  textStyle: {
    type: String,
    value: 'normal',
  },
  styleType: {
    type: String,
    value: 'borderless',
  },
  alignStyle: {
    type: String,
    value: 'left',
  },
  modelMargin: {
    type: Number,
    value: 0,
  },
  fillet: {
    type: Number,
    value: 0,
  },
  shopCarType: {
    // 购物车样式
    type: String,
    value: 'car',
  },
  underlinePriceShow: {
    // 划线价是否显示
    type: String,
    value: 'TRUE',
  },
  goodsHeight: {
    type: String,
    value: '',
  },
  idx: {
    type: Number,
    value: null,
  },
  imageHeight: {
    type: String,
    value: '240rpx',
  },
  backGroundType: {
    // 背景类型
    type: String,
    value: 'color',
  },
  backGroundColor: {
    type: String,
    value: '#fff',
  },
  activityColor: {
    type: String,
    value: '#FF7121',
  },
  backGroundImgObj: {
    type: Object,
    value: {},
  },
  hasUserInfo: Boolean,
})
// Watch listeners converted from observers
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
  // 在组件实例进入页面节点树时执行
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig
  state.hasEasyRecPlugins = app.globalData.hasEasyRecPlugins
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
  if (state.addImage === '' && state.reduceImage === '') {
    state.addImage = gouwuche
    state.reduceImage = state.imagesPath.iconMinus
  }
  const query = createSelectorQuery()
  query
    .select('.gm-small-goods-item')
    .boundingClientRect((rect) => {
      // console.log(rect.width,'rect.width') // 元素宽度（单位px）
      state.imageHeight = rect.width + 'px'
    })
    .exec()
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
    state.addImage = gouwuche
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
/* @import '../../app.wxss'; */
.gm-small-goods-item {
  /* flex: 1; */
  /* display: inline-block; */
  float: left;
  width: 25vw;
  vertical-align: top;
  margin: 0 1%;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding-bottom: 15rpx;
  overflow: hidden;
  box-sizing: border-box;
}
.nomargin {
  margin: 0;
  margin-bottom: 20rpx;
}

.projection {
  box-shadow: rgba(100, 101, 102, 0.12) 0px 2px 12px;
}
.stroke {
  border: 1px solid #ebedf0;
  box-sizing: border-box;
}
.gm-small-goods-img-box {
  min-height: 210rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.gm-small-goods-img-box image {
  width: 100%;
  height: 100%;
  /* height: 210rpx; */
  background-size: #f1f1f1;
  /* max-width: 100%;
  max-height: 100%; */
}

.gm-small-goods-img-box .no-balance {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.gm-small-goods-info {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 10rpx 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.gm-small-goods-name {
  word-break: break-all;
  word-wrap: break-world;
  white-space: wrap !important;
  font-size: 24rpx;
  /* font-weight: bold; */
  /* line-height: 36rpx; */
  margin-top: 12rpx;
  margin-bottom: 8rpx;
  height: 56rpx;
}
.gm-small-goods-name > view {
  white-space: normal !important;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.promotions {
  position: relative;
  bottom: 8rpx;
  height: 30rpx;
  /* padding: 0 6rpx; */
  border-radius: 5rpx;
  font-size: 18rpx;
  line-height: 30rpx;
  color: #ff8561;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 8rpx;
  font-weight: normal;
  box-sizing: border-box;
  flex-shrink: 0;
}
.promotions text {
  padding: 0 6rpx;
}
.promotions image {
  height: auto;
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
  font-size: 20rpx;
  line-height: 32rpx;
  height: 32rpx;
  margin-bottom: 15rpx;
}

.gm-small-goods-price {
  display: flex;
  width: 100%;
  /* justify-content: space-between; */
  font-size: 18rpx;
  line-height: 36rpx;
  height: 36rpx;
  align-items: center;
}
.gm-small-goods-price .nowPrice {
  font-size: 30rpx;
  color: #ee5253;
  /* font-weight: 700; */
}

.gm-small-goods-price .oldPrice {
  color: #999;
  text-decoration: line-through;
  font-weight: 400;
  margin-left: 6rpx;
}

.gm-small-goods-info .add-box,
.gm-small-goods-info .add-box1 {
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
  position: absolute;
  right: 20rpx;
  bottom: 10rpx;
}
.gm-small-goods-info .add-box1 {
  color: #ff8425;
  background-color: transparent;
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
.gm-small-goods-info .add-box .add_text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -65%);
  font-size: 45rpx;
  line-height: 30rpx;
  /* color: #fff; */
}
.add-box .cart-count {
  position: absolute;
  top: -10rpx;
  right: -8rpx;
  font-size: 18rpx;
  background-color: #ff2000;
  color: #fff;
  height: 20rpx;
  min-width: 20rpx;
  border-radius: 50%;
  line-height: 20rpx;
  padding: 6rpx;
  text-align: center;
  z-index: 1;
}

.gm-small-goods-introduce {
  font-size: 22rpx;
  color: #009136;
  height: 30rpx;
  line-height: 30rpx;
  /* font-weight: bold; */
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
</style>
