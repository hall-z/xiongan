<template>
  <!-- components/coupon/coupon-item/coupon-item.wxml -->
  <view
    :class="'coupon-item ' + (couponStatus === 'history' ? 'use-box' : couponStatus)"
    :style="externalStyle"
    :data-activityId="coupon.couponActivityId"
    :data-external="coupon.isExternal"
    :data-id="coupon.id"
    :data-type="coupon.function !== 'FREESHIP' ? 'discount' : 'freeship'"
    @click="clickCouponItem"
  >
    <image
      class="useicon"
      :src="useicon"
      v-if="selected !== coupon.id && coupon.statusDesc != '已过期'"
    ></image>
    <!-- <image class="coupon-item-bg" src="{{selected === coupon.id ? imagesPath.ticket1 : imagesPath.ticket2}}" ></image> -->
    <view class="coupon-item-bg">
      <image :src="selected === coupon.id ? cardbg3 : cardbg6" mode="widthFix"></image>
    </view>

    <view
      class="coupon-item-top"
      v-if="
        (coupon.status !== 'OPEN' &&
          type !== 'assign' &&
          type !== 'score' &&
          couponStatus !== 'enable') ||
        couponStatus === 'unable'
      "
    >
      <view class="main-coupon coupon-unabled">
        <view class="main-coupon-function">
          <view style="display: flex; flex-direction: column; align-items: center">
            <view class="coupon-head-info coupon-unabled">
              <view style="font-size: 23rpx" :hidden="coupon.function !== 'CASH'">￥</view>
              <view :style="coupon.function === 'CASH' ? 'font-size:50rpx;' : ''">
                {{ coupon.nr_headInfo }}
              </view>
              <view style="font-size: 23rpx" :hidden="coupon.function !== 'DISCOUNT'">折</view>
            </view>
            <view
              class="coupon-time-label"
              style="color: black"
              :hidden="coupon.function !== 'CASH' || !coupon.useAmountLimit"
            >
              满{{ coupon.useAmountLimit }}可用
            </view>
          </view>
        </view>
        <view class="main-coupon-detail coupon-unabled">
          <view class="main-coupon-detail-title coupon-unabled">{{ coupon.name }}</view>
          <view>{{ coupon.nr_condition }}</view>
          <view class="mini-function coupon-unabled">{{ coupon.nr_function }}</view>
        </view>
      </view>
    </view>
    <view class="coupon-item-top" v-else>
      <view class="main-coupon">
        <view class="main-coupon-function">
          <view style="display: flex; flex-direction: column; align-items: center">
            <view class="coupon-head-info">
              <view
                :style="'font-size:23rpx; ' + theme.mainColor"
                :hidden="coupon.function !== 'CASH'"
              >
                ￥
              </view>
              <view
                :style="(coupon.function === 'CASH' ? 'font-size:50rpx;' : '') + theme.mainColor"
              >
                {{ coupon.nr_headInfo }}
              </view>
              <view
                :style="'font-size:23rpx; ' + theme.mainColor"
                :hidden="coupon.function !== 'DISCOUNT'"
              >
                折
              </view>
            </view>
            <view
              class="coupon-time-label"
              style="color: black"
              :hidden="coupon.function !== 'CASH' || !coupon.useAmountLimit"
            >
              满{{ coupon.useAmountLimit }}可用
            </view>
          </view>
        </view>
        <view class="main-coupon-detail">
          <view class="main-coupon-detail-title">{{ coupon.name }}</view>
          <view>{{ coupon.nr_condition }}</view>
          <view class="mini-function">{{ coupon.nr_function }}</view>
        </view>
      </view>
    </view>
    <view class="coupon-seperator">
      <view class="line"></view>
    </view>
    <view class="coupon-item-bottom">
      <text class="condition">{{ coupon.nr_condition }}</text>
      <view
        class="use"
        :style="'color: ' + (couponStatus === 'history' ? '' : themeColor)"
        v-if="coupon.status !== 'OPEN'"
      >
        {{ coupon.statusDesc }}
      </view>
      <view
        class="use"
        :style="'color: ' + (couponStatus === 'history' ? '' : themeColor)"
        @click.stop="toUseCoupon"
        v-if="false"
      >
        <image class="coupon-item-right-point" :src="imagesPath.iconRight1"></image>
        去购物
      </view>
    </view>
  </view>
</template>
<script setup>
import useicon from '@/utils/newretail/image/useicon.png'
import cardbg3 from '@/utils/newretail/image/cardbg3.png'
import cardbg6 from '@/utils/newretail/image/cardbg6.png'
import _utilsThemeManager from '@/utils/newretail/themeManager'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
// import { attached, ready } from "@dcloudio/uni-app";
import { reactive } from 'vue'
// components/coupon-item/coupon-item.js
const IMAGESPATH = _utilsImagesPathJs
const THEME = _utilsThemeManager
const state = reactive({
  imagesPath: IMAGESPATH,
  theme: THEME,
  themeColor: THEME.color,
})
const props = defineProps({
  coupon: Object,
  couponStatus: String,
  selected: String,
  // 当前选择的券（id）暂为字符串，计划改为数组
  externalStyle: String,
  type: String, // normal,assign
})
attached(function () {})
ready(function () {
  console.log(state.coupon)
})
function clickCouponItem(e) {
  triggerEvent('onClickCouponItem', e.currentTarget.dataset)
}
function toHome(e) {
  triggerEvent('toHome', e.currentTarget.dataset)
}
function toUseCoupon(e) {
  triggerEvent('toUseCoupon', e.currentTarget.dataset)
}
</script>
<style scoped>
/* components/coupon-item/coupon-item.wxss */
.coupon-item {
  position: relative;
  height: 300rpx;
  width: 710rpx;
  padding: 20rpx 36rpx 0rpx;
  margin-bottom: 20rpx;
  position: relative;
  background-color: #f7f7f7;
  box-sizing: border-box;
}
.useicon {
  position: absolute;
  top: 0;
  right: 0;
  width: 102rpx;
  height: 82rpx;
  z-index: 1;
}
.coupon-item .coupon-item-bg {
  width: 710rpx;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  height: 170rpx;
}
.coupon-item .coupon-item-bg image {
  width: 100%;
}
.coupon-seperator .line {
  width: 633rpx;
  height: 0rpx;
  border: 1px dashed #98a4b8;
  margin-top: 20rpx;
}
.coupon-item-top {
  position: relative;
  font-size: 24rpx;
  color: #8b8b8c;
}

.coupon-item-top image {
  width: 89rpx;
  height: 58rpx;
  margin-top: 10rpx;
}

.coupon-item-top > text {
  display: block;
  position: relative;
}

.coupon-item-top .name {
  font-size: 32rpx;
  line-height: 42rpx;
  color: #454545;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 14rpx;
}

.coupon-item-top .name text {
  color: #ff8561;
  font-size: 40rpx;
  margin-right: 10rpx;
  font-style: italic;
}

.coupon-item-top .time {
  font-size: 20rpx;
  line-height: 26rpx;
  color: #8b8b8c;
  margin-top: 19rpx;
}

.coupon-item-bottom {
  position: absolute;
  height: 70rpx;
  line-height: 70rpx;
  left: 60rpx;
  width: 629rpx;
}

.coupon-item-bottom .condition {
  font-size: 20rpx;
  line-height: 70rpx;
  display: inline-block;
  color: #636f83;
  width: 408rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coupon-item-bottom .use {
  margin-right: 42rpx;
  padding-right: 27rpx;
  font-size: 24rpx;
  float: right;
  color: #009f55;
  position: relative;
}

.coupon-item-bottom .use .coupon-item-right-point {
  width: 12rpx;
  height: 21rpx;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -11.5rpx;
}

.use-box .coupon-item-top .name,
.use-box .coupon-item-top .name > text,
.unable .coupon-item-top .name,
.unable .coupon-item-top .name > text {
  color: #8b8b8c;
}

.use-box .coupon-item-bottom .use,
.unable .coupon-item-bottom .use {
  background: transparent;
  padding-right: 0;
  color: #8b8b8c;
}
.main-coupon {
  display: flex;
  align-items: center;
  /* background-color: white; */
  border-top-left-radius: 15rpx;
  border-top-right-radius: 15rpx;
  width: calc(100% - 80rpx);
}

.main-coupon-function {
  width: 150rpx;
  height: 130rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff7120;
  font-size: 28rpx;
  font-weight: bolder;
  background-color: #fff;
  border-radius: 10rpx;
  flex-shrink: 0;
  margin-right: 50rpx;
}

.main-coupon-detail {
  width: calc(100% - 150rpx);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20rpx 0rpx;
  justify-content: space-around;
  font-size: 20rpx;
}

.main-coupon-detail-title {
  font-size: 30rpx;
  color: #020202;
  margin-bottom: 16rpx;
}

.mini-function {
  font-size: 20rpx;
  background-color: #636f83;
  width: 80rpx;
  height: 30rpx;
  line-height: 30rpx;
  border-radius: 15rpx;
  color: #fff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
}

.coupon-time-expand-board {
  width: auto;
  display: flex;
  justify-content: space-between;
  background-color: white;
  margin-top: -4rpx;
  padding: 10rpx 20rpx;
}

.coupon-time-baord {
  display: flex;
}

.coupon-time-icon {
  width: 20rpx;
  height: 20rpx;
}

.coupon-time-label {
  font-size: 26rpx;
  color: #a7a6a7;
  margin-left: 10rpx;
}

.coupon-rule-btn {
  width: 100rpx;
  height: 30rpx;
  font-size: 26rpx;
}

.coupon-head-info {
  display: flex;
  align-items: baseline;
}

.coupon-unabled {
  color: #636f83;
}
</style>
