<template>
  <!--components/goods-item/goods-goods.wxml-->
  <view>
    <view
      :class="'gm-goods-item gm-goods-item' + (idx === 0 || idx ? idx : '') + ' ' + styleType"
      :data-productId="goods.id"
      :style="
        (backGroundType == 'color'
          ? 'background-color: ' + backGroundColor
          : 'background-image: url(' + (backGroundImgObj ? backGroundImgObj.imageUrl : '') + ')') +
        ';font-weight: ' +
        textStyle +
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
      :id="'products-' + goods.id"
      :data-type="goodsType"
      @click="clickGoodsItem"
    >
      <view class="gm-goods-img-box">
        <image
          class="gm-goods-img"
          :src="imageUrl"
          :data-img-url="imageUrl"
          lazy-load="true"
          mode="aspectFit"
        ></image>
        <image
          class="no-balance"
          :src="imagesPath.soldOutIcon"
          v-if="goods.balance <= 0 && goods.business !== 'DISTRIBUTION'"
        ></image>
      </view>
      <view
        class="gm-goods-info"
        :style="'align-items: ' + (alignStyle == 'center' ? 'center' : 'flex-start')"
      >
        <view
          class="gm-goods-name"
          :style="'justify-content: ' + (alignStyle == 'center' ? 'center' : 'flex-start')"
        >
          <!-- <text wx:for="{{goods.produtlabel}}" wx:key="index" wx:if="{{index<3}}" style="background-color:rgb({{item.color}})">{{item.labelName}}</text> -->
          <view>
            {{ goods.name }}
          </view>
        </view>
        <text class="gm-goods-desc">{{ goods.description ? goods.description : '' }}</text>
        <view style="display: flex; justify-content: flex-start; align-items: center">
          <view class="gm-goods-name">
            <view v-for="(item, index) in goods.produtlabel" :key="index" v-if="index < 3">
              <text
                :style="'background-color:rgb(' + item.color + ')'"
                v-if="item.labelName && !item.imageUrl"
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
          <view class="gm-goods-labels" v-if="!recommed">
            <view v-for="(item, index) in goods.promotions" :key="index" :data-id="index">
              <view :style="'border-color:rgb(' + item.color + ')'" class="items">
                {{ item.labelName }}
              </view>
              <text>{{ item.labelDetails }}</text>
            </view>
          </view>
        </view>
        <view class="gm-goods-price" :hidden="goods.sellPrice != null ? false : true">
          <view v-if="goods.promotionPrice != null">
            <text class="nowPrice" :style="'color: ' + activityColor">
              {{
                goods.sellPrice && goods.sellPrice < goods.promotionPrice
                  ? goods.memberPrice && goods.memberPrice < goods.sellPrice
                    ? filtToFix(goods.memberPrice)
                    : filtToFix(goods.sellPrice)
                  : goods.memberPrice && goods.memberPrice < goods.promotionPrice
                    ? filtToFix(goods.memberPrice)
                    : filtToFix(goods.promotionPrice)
              }}
              <text style="font-size: 20rpx" v-if="goods.style == 'SPEC_PARENT'">起</text>
            </text>
            <view
              class="vip-price"
              v-if="
                goods.memberPrice &&
                goods.memberPrice < goods.promotionPrice &&
                (!goods.sellPrice || goods.memberPrice < goods.sellPrice)
              "
            >
              <!-- <text class="oldPrice">￥{{goods.originalPrice ? filtToFix(goods.originalPrice): filtToFix(goods.sellPrice)}}</text> -->
              <view class="vip-label">
                <image :src="imagesPath.iconVipLabel"></image>
                <text>{{ vipGradeConfig.priceLabel }}</text>
              </view>
            </view>
            <!-- <text class="nowPrice"><text style="font-size: 24rpx;">￥</text>{{ goods.memberPrice && goods.memberPrice < goods.promotionPrice ? filtToFix(goods.memberPrice) : filtToFix(goods.promotionPrice)}}</text>  -->
            <view v-if="underlinePriceShow != 'FALSE'" style="display: flex; align-items: center">
              <text style="text-decoration: line-through">
                ￥{{
                  goods.originalPrice > goods.sellPrice
                    ? filtToFix(goods.originalPrice)
                    : filtToFix(goods.sellPrice)
                }}
              </text>
            </view>
          </view>
          <view v-else>
            <text class="nowPrice" :style="'color: ' + activityColor">
              {{
                goods.memberPrice && goods.memberPrice < goods.sellPrice
                  ? filtToFix(goods.memberPrice)
                  : goods.sellPrice
                    ? filtToFix(goods.sellPrice)
                    : filtToFix(goods.originalPrice)
              }}
              <text style="font-size: 20rpx" v-if="goods.style == 'SPEC_PARENT'">起</text>
            </text>
            <view class="vip-price" v-if="goods.memberPrice && goods.memberPrice < goods.sellPrice">
              <text
                class="oldPrice"
                v-if="
                  ((goods.originalPrice && goods.memberPrice < goods.originalPrice) ||
                    (goods.sellPrice && goods.memberPrice < goods.sellPrice)) &&
                  underlinePriceShow != 'FALSE'
                "
              >
                ￥{{
                  goods.originalPrice
                    ? filtToFix(goods.originalPrice)
                    : filtToFix(goods.sellPrice)
                }}
              </text>
              <view class="vip-label">
                <image :src="imagesPath.iconVipLabel"></image>
                <text>{{ vipGradeConfig.priceLabel }}</text>
              </view>
            </view>
            <text
              class="oldPrice"
              v-else-if="
                goods.originalPrice &&
                goods.sellPrice < goods.originalPrice &&
                underlinePriceShow != 'FALSE'
              "
            >
              ￥{{ filtToFix(goods.originalPrice) }}
            </text>
            <!-- <view style="display: flex;"  wx:if="{{goods.memberPrice}}"><text class="nowPrice"><text style="font-size: 24rpx;">￥</text>{{filtToFix(goods.memberPrice)}}</text><view wx:if="{{goods.memberPrice && isMember}}" style="display: flex; align-items: center;"> <view class="vipBtn">会员价</view><text style="text-decoration:line-through">￥{{filtToFix(goods.sellPrice)}}</text></view></view> 
       <view   style="display: flex;"  wx:else>  <text class="nowPrice"><text style="font-size: 24rpx;">￥</text>{{goods.sellPrice ? goods.sellPrice : ''}}</text><view wx:if="{{goods.memberPrice && isMember}}" style="display: flex; align-items: center;"><view class="vipBtn">会员价</view><text style="text-decoration:line-through">￥{{filtToFix(goods.memberPrice)}}</text></view></view>  -->
          </view>
          <!-- <block wx:else>
        <text class="nowPrice">{{goods.memberPrice && goods.memberPrice < goods.sellPrice ? goods.memberPrice : goods.sellPrice ? goods.sellPrice : goods.originalPrice}}</text>
        <view class="vip-price" wx:if="{{goods.memberPrice && goods.memberPrice < goods.sellPrice && vipGradeConfig.openMemberPrice && goods.memberPrice < goods.sellPrice}}">
          <text class="oldPrice" wx:if="{{goods.originalPrice != null && goods.memberPrice < goods.originalPrice}}">￥{{goods.originalPrice}}</text>
          <view class="vip-label">
            <image src="{{imagesPath.iconVipLabel}}"></image>
            <text>{{vipGradeConfig.priceLabel}}</text>
          </view>
        </view>
        <text class="oldPrice" wx:elif="{{goods.originalPrice != null && goods.sellPrice < goods.originalPrice}}">￥{{goods.originalPrice}}</text>
      </block> -->
        </view>
        <form @submit.stop="addToCart" @click.stop="noop">
          <view
            class="gm-cart-control"
            :hidden="goods.balance <= 0 && goods.business !== 'DISTRIBUTION'"
          >
            <!-- <block wx:if="{{goods.style !== 'MEALS'}}">
          <view class="reduce-box" hidden="{{!shopCart[goods.id]}}">
            <button form-type="submit" data-balance="{{goods.balance}}" data-initialpurchasenumber="{{goods.initialPurchaseNumber}}" data-traceId="{{goods.traceId}}" data-style="{{goods.style}}" data-type="reduce" data-id="{{goods.id}}" data-business="{{goods.business}}"></button>
            <image class="reduce-img" src='{{reduceImage}}'></image>
          </view>
          <text class="cart-count">{{shopCart[goods.id] ? shopCart[goods.id] : ''}}</text>
        </block> -->
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
                data-addType="normal"
                :data-balance="goods.balance"
                :data-initialpurchasenumber="goods.initialPurchaseNumber"
                :data-traceId="goods.traceId"
                :data-style="goods.style"
                data-type="add"
                :data-id="goods.id"
                :data-business="goods.business"
              ></button>
              <text class="cart-count" v-if="shopCart[goods.id]">
                {{ shopCart[goods.id] ? shopCart[goods.id] : '' }}
              </text>
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
                :data-id="goods.id"
                :data-style="goods.style"
                :data-balance="goods.balance"
                :data-business="goods.business"
                :data-initialpurchasenumber="goods.initialPurchaseNumber"
                :data-traceId="goods.traceId"
              ></button>
              <text class="cart-count" v-if="shopCart[goods.id]">
                {{ shopCart[goods.id] ? shopCart[goods.id] : '' }}
              </text>
              <text
                :class="
                  'add_text iconfont ' +
                  (shopCarType != 'hollow' ? 'icon-jiahao2fill' : 'icon-jiahao')
                "
              ></text>
            </view>
          </view>
        </form>
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import { reactive , watch} from 'vue'
import gouwuche from '@/utils/newretail/image/gouwuche.png'
const app = getApp()
// components/goods-item/goods-item.js
const IMGAGESPATH = _utilsImagesPathJs
const selfA = _utilsSelfJs
// 获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  shopCartGoodsId: [],
  vipGradeConfig: null,
  hasEasyRecPlugins: false,
  imageUrl: null,
  themeColor: null
})
const props = defineProps({
  goods: {
    // 商品信息
    type: Object,
    // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
  },
  idx: {
    type: String,
    value: ''
  },
  addImage: {
    // 加入购物车图片
    type: String,
    value: ''
  },
  reduceImage: {
    // 减少购物车图片
    type: String,
    value: ''
  },
  goodsWidth: {
    type: String,
    value: '100%'
  },
  goodsType: {
    // 商品类型
    type: String,
    value: 'normal'
  },
  textStyle: {
    type: String,
    value: 'normal'
  },
  styleType: {
    type: String,
    value: 'borderless'
  },
  alignStyle: {
    type: String,
    value: 'left'
  },
  modelMargin: {
    type: Number,
    value: 0
  },
  fillet: {
    type: Number,
    value: 0
  },
  shopCarType: {
    // 购物车样式
    type: String,
    value: 'car'
  },
  underlinePriceShow: {
    // 划线价是否显示
    type: String,
    value: 'TRUE'
  },
  shopCart: {
    // 购物车数据
    type: Object,
    value: {}
  },
  hasAnimation: {
    // 加入购物车动画
    type: Boolean,
    value: false
  },
  backGroundType: {
    // 背景类型
    type: String,
    value: 'color'
  },
  backGroundColor: {
    type: String,
    value: '#fff'
  },
  activityColor: {
    type: String,
    value: '#ee5253'
  },
  backGroundImgObj: {
    type: Object,
    value: {}
  },
  hasUserInfo: Boolean,
  recommed: Boolean
})
function attached() {
  // 在组件实例进入页面节点树时执行
  if (app.globalData.userInfo) {
    state.hasUserInfo = true
  }
  if (state.addImage === '' && state.reduceImage === '') {
    state.addImage = gouwuche
    state.reduceImage = state.imagesPath.iconMinus
  }
  state.vipGradeConfig = app.globalData.systemConfigure.vipGradeConfig
  state.hasEasyRecPlugins = app.globalData.hasEasyRecPlugins
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
}
function detached() {
  // 在组件实例被从页面节点树移除时执行
}
function clickGoodsItem(e) {
  triggerEvent('onClickGoods', e.currentTarget.dataset)
}
function addToCart(e) {
  triggerEvent('addToCart', {
    dataset: e.currentTarget.dataset,
    context: this,
    detail: e.detail
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

// Watch listeners converted from observers
watch(() => props.goods, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal != null) {
          // await selfA.getTemporaryUrl(newVal.imageUrl)
          //    .then (res=>{
          //     this.setData({
          //        imageUrl:res
          //     })
          // })
          state.imageUrl = newVal.imageUrl
        }
});

</script>
<style scoped>
/* components/goods-item/goods-item.wxss */
/* @import '../../app.wxss'; */
.gm-goods-item {
  min-height: 180rpx;
  /* border-bottom: 1rpx solid #f0f0f0; */
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  padding: 20rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  overflow: hidden;
}
.gm-goods-box .gm-goods-item:last-of-type {
  border-bottom: none;
}
.gm-goods-img-box {
  width: 247rpx;
  height: 247rpx;
  overflow: hidden;
  float: left;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gm-goods-img-box image {
  width: 100%;
  height: 100%;
}
.gm-goods-img-box .no-balance {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
.gm-goods-info {
  width: calc(100% - 285rpx);
  /* height: 100%; */
  min-height: 210rpx;
  position: relative;
  float: right;
}
.gm-goods-info .gm-goods-introduce {
  font-size: 22rpx;
  color: #009136;
  height: 30rpx;
  line-height: 30rpx;
  /* font-weight: bold; */
}
.gm-goods-info .gm-goods-introduce > text {
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
.gm-goods-info .gm-goods-desc,
.gm-goods-info .gm-goods-sold {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gm-goods-info .gm-goods-name {
  color: #333;
  font-size: 28rpx;
  /* line-height: 42rpx;
  height: 42rpx; */
  /* font-weight: bold; */
  margin: 10rpx 0 5rpx 0;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  width: 100%;
  word-break: break-all;
  word-wrap: break-world;
  white-space: wrap !important;
  flex: 1 1 auto;
}
.gm-goods-info .gm-goods-name text {
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 6rpx;
  background: #009136;
  color: #fff;
  font-size: 20rpx;
  line-height: 30rpx;
  /* font-weight: normal; */
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
  flex-shrink: 0;
}
.gm-goods-info .gm-goods-name > view {
  /* width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: Medium;  */
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 76rpx;
  line-height: 38rpx;
  word-break: break-all;
  white-space: normal;
}
.gm-goods-info {
  display: flex;
  justify-content: flex-start;
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
  /* height: 30rpx; */
  margin: 10rpx 0 5rpx 0;
  flex-direction: column;
}
.gm-goods-labels {
  /* display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; */
  min-height: 30rpx;
  margin: 10rpx 0 5rpx 0;
  flex: 1 0 auto;
  /* overflow: hidden; */
}
.gm-goods-info .gm-goods-labels > view {
  /* width: 60rpx; */
  font-size: 28rpx;
  line-height: 28rpx;
  color: #454545;
  /* background: #fff; */
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: start;
  /* border-top: 1px solid #F1F1F1; */
}
.gm-goods-info .gm-goods-labels .items {
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
  /* font-weight: normal; */
  box-sizing: border-box;
  flex-shrink: 0;
}
.gm-goods-info .gm-goods-desc,
.gm-goods-info .gm-goods-sold {
  color: #999;
  height: 36rpx;
  font-size: 20rpx;
}
.gm-goods-info .gm-goods-sold {
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
.gm-goods-price {
  padding-top: 25rpx;
  position: relative;
  margin-top: 22rpx;
  line-height: 40rpx;
  display: flex;
  font-size: 20rpx;
  flex: 1;
  align-items: flex-end;
}
.gm-goods-price .nowPrice {
  font-size: 34rpx;
  /* font-weight: 800; */
  margin-right: 16rpx;
  color: #ff8561;
  /* font-weight: 700; */
}
.gm-goods-price .oldPrice {
  font-size: 22rpx;
  color: #999;
  text-decoration: line-through;
  font-weight: 400;
}
.gm-goods-item .gm-cart-control {
  position: absolute;
  right: 0;
  bottom: -2rpx;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 80rpx;
  text-align: center;
}
.gm-goods-item .add-box,
.gm-goods-item .add-box1,
.gm-goods-item .reduce-box {
  /* width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  padding: 0; */
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  padding: 0;
  background-color: #ff8425;
  font-weight: 400;
}
.gm-small-goods-info .add-box1 {
  color: #ff8425;
  background-color: transparent;
}
.gm-goods-item .add-box {
  position: absolute;
  right: 20rpx;
  bottom: 0;
}
.gm-goods-item .reduce-box {
  position: absolute;
  left: 0;
}
.gm-goods-item .add-box button,
.gm-goods-item .reduce-box button {
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1;
}
.gm-goods-item .add-box button::after,
.gm-goods-item .reduce-box button::after {
  border: 0;
}
.gm-goods-item .add-box .add_text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  font-size: 45rpx;
  line-height: 30rpx;
}
.add-img,
.reduce-img {
  /* width: 40rpx;
  height: 40rpx;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -20rpx;
  margin-left: -20rpx; */
  width: 29rpx;
  height: 27rpx;
  padding: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.gm-cart-control .cart-count {
  font-size: 28rpx;
  color: #454545;
  height: 100%;
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
  z-index: 1;
}
button.button-hover {
  color: transparent;
  background-color: transparent;
  border: none;
}
.gm-goods-item button::after {
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
  min-width: 71rpx;
  height: 25rpx;
  flex-shrink: 0;
  margin-top: -4rpx;
  transform: translateY(25%);
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
