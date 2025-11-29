<template>
  <!-- components/coupon/coupon-receive/coupon-receive.wxml -->
  <view>
    <view class="coupon-item" :data-couponId="coupon.id" @click="clickItem">
      <view class="main-coupon">
        <view
          class="main-coupon-code"
          v-if="showUseBtn && coupon.function !== 'FREESHIP'"
          :data-couponId="coupon.id"
          @click.stop="showCouponCode"
        >
          <image :src="imagesPath.iconCouponQRCode" mode="widthFix" lazy-load="false"></image>
        </view>
        <view class="main-coupon-function">
          <view
            class="main-coupon-num"
            style="display: flex; flex-direction: column; align-items: center"
          >
            <view class="coupon-head-info">
              <view
                :style="'font-size:36rpx; ' + theme.mainColor"
                :hidden="
                  coupon.function !== 'CASH' &&
                  !(coupon.function === 'FREESHIP' && coupon.faceValue)
                "
              >
                ￥
              </view>
              <view
                v-if="
                  coupon.function === 'CASH' || (coupon.function === 'FREESHIP' && coupon.faceValue)
                "
                :style="
                  'margin-left:-8rpx;letter-spacing:-12rpx;' +
                  (coupon.function === 'CASH' ||
                  coupon.function === 'DISCOUNT' ||
                  (coupon.function === 'FREESHIP' && coupon.faceValue)
                    ? 'font-size:100rpx;'
                    : '') +
                  theme.mainColor
                "
              >
                {{ coupon.nr_headInfo }}
              </view>
              <view
                v-else
                :style="
                  (coupon.function === 'CASH' ||
                  coupon.function === 'DISCOUNT' ||
                  (coupon.function === 'FREESHIP' && coupon.faceValue)
                    ? 'font-size:100rpx;'
                    : '') + theme.mainColor
                "
              >
                {{ coupon.nr_headInfo }}
              </view>
              <view
                :style="'font-size:36rpx;margin-left:6rpx;' + theme.mainColor"
                :hidden="coupon.function !== 'DISCOUNT'"
              >
                折
              </view>
            </view>
          </view>
        </view>
        <view class="main-coupon-detail">
          <text class="main-coupon-detail-title">{{ coupon.name }}</text>
          <view
            class="coupon-time-label"
            :hidden="coupon.function !== 'CASH' || !coupon.useAmountLimit"
          >
            满{{ coupon.useAmountLimit }}可用
          </view>
          <text>{{ coupon.nr_condition }}</text>
          <view class="mini-function">{{ coupon.nr_function }}</view>
        </view>
        <!-- 领取按钮 -->
        <view v-if="hideSignBtn !== true">
          <view v-if="coupon.balance > 0 || coupon.balance == null">
            <view v-if="!hasUserInfo">
              <button
                v-if="coupon.price && coupon.score"
                :class="'sign-btn ' + (coupon.function == 'PACKAGE' ? 'bold' : '')"
                @click="getUserInfo"
                @click.stop="catchCoupon"
                :style="theme.mainBgColor"
              >
                {{ '￥' + coupon.price + '+' + coupon.score + ' 分' }}
              </button>
              <button
                v-else-if="coupon.score"
                :class="'sign-btn ' + (coupon.function == 'PACKAGE' ? 'bold' : '')"
                @click="getUserInfo"
                @click.stop="catchCoupon"
                :style="theme.mainBgColor"
              >
                {{ coupon.score + ' 积分购' }}
              </button>
              <button
                v-else-if="coupon.price"
                :class="'sign-btn ' + (coupon.function == 'PACKAGE' ? 'bold' : '')"
                @click="getUserInfo"
                @click.stop="catchCoupon"
                :style="theme.mainBgColor"
              >
                {{ coupon.price + ' 元购' }}
              </button>
              <button
                v-else
                :class="'sign-btn ' + (coupon.function == 'PACKAGE' ? 'bold' : '')"
                @click="getUserInfo"
                @click.stop="catchCoupon"
                :style="theme.mainBgColor"
              >
                立即领取
              </button>
            </view>
            <view v-else>
              <button
                v-if="coupon.price && coupon.score"
                :class="'sign-btn ' + (coupon.function == 'PACKAGE' ? 'bold' : '')"
                :hidden="coupon.balance <= 0"
                :data-couponid="coupon.id"
                @click.stop="assign"
                :style="theme.mainBgColor"
              >
                {{ '￥' + coupon.price + '+' + coupon.score + ' 分' }}
              </button>
              <button
                v-else-if="coupon.score"
                :class="'sign-btn ' + (coupon.function == 'PACKAGE' ? 'bold' : '')"
                :hidden="coupon.balance <= 0"
                :data-couponid="coupon.id"
                @click.stop="assign"
                :style="theme.mainBgColor"
              >
                {{ coupon.score + ' 积分购' }}
              </button>
              <button
                v-else-if="coupon.price"
                :class="'sign-btn ' + (coupon.function == 'PACKAGE' ? 'bold' : '')"
                :hidden="coupon.balance <= 0"
                :data-couponid="coupon.id"
                @click.stop="assign"
                :style="theme.mainBgColor"
              >
                {{ coupon.price + ' 元购' }}
              </button>
              <button
                v-else
                :class="'sign-btn ' + (coupon.function == 'PACKAGE' ? 'bold' : '')"
                :hidden="coupon.balance <= 0"
                :data-couponid="coupon.id"
                @click.stop="assign"
                :style="theme.mainBgColor"
              >
                立即领取
              </button>
            </view>
          </view>
          <view v-if="coupon.balance <= 0">
            <button class="sign-unable-btn" :data-couponid="coupon.id" @click.stop="assign">
              已领完
            </button>
          </view>
        </view>
        <view v-if="showUseBtn">
          <view class="use-btn" @click.stop="assign" :data-coupon="coupon">立即使用</view>
        </view>
        <view class="main-coupon-seperator">
          <image :src="pinkline"></image>
        </view>
      </view>
      <!-- 分割线 -->
      <view class="coupon-seperator">
        <view class="line"></view>
      </view>
      <!-- <image class="coupon-seperator" mode="widthFix" style="width:100%;" src="../../../utils/image/pinkline.png" ></image> -->
      <view class="coupon-time-expand-board">
        <view class="coupon-time-board">
          <image class="coupon-time-icon" :src="dateicon" mode="widthFix"></image>
          <text class="coupon-time-label" v-if="coupon.effectiveTime">
            有效期：{{ coupon.effectiveTime }}
          </text>
          <text class="coupon-time-label" v-else>
            抢券时间：{{ filtDateHead(coupon.startDate) }}~{{
              filtDateHead(coupon.endDate)
            }}
          </text>
        </view>
        <text class="coupon-time-label" @click.stop="actionExpand">
          | 使用规则{{ isExpand ? '▲' : '▼' }}
        </text>
      </view>
      <view
        class="coupon-time-expand-board"
        style="border-bottom-left-radius: 15rpx; border-bottom-right-radius: 15rpx"
      >
        <text
          v-if="isExpand && coupon.service !== 'ZJIAN'"
          class="coupon-time-label"
          style="padding-top: 20rpx"
        >
          {{ coupon.description }}
        </text>
        <text
          v-if="isExpand && coupon.service === 'ZJIAN'"
          class="coupon-time-label"
          style="padding-top: 20rpx"
        >
          {{ coupon.useRule }}
        </text>
      </view>
      <!-- <image class="coupon-bg" src="{{imagesPath.ticket2}}" ></image>
  <image class="coupon-logo" src="{{imagesPath.iconLogo}}" ></image>
  <view class='coupon-info name'>{{coupon.name}}</view>
  <view class='coupon-info desc'>{{coupon.description}}</view>
  <view class='coupon-bottom'>
    <text>抢券时间：{{filtDateHead(coupon.startDate)}}~{{filtDateHead(coupon.endDate)}}</text>
    <text class='remain-count' wx:if="{{coupon.balance}}">剩余<text>{{coupon.balance}}</text>张</text>
  </view>
  <block wx:if="{{coupon.balance > 0 || coupon.balance == null}}">
    <button wx:if="{{!hasUserInfo}}" class="sign-btn {{coupon.function == 'PACKAGE' ? 'bold' : ''}}" bindtap="getUserInfo" catchtap='catchCoupon'>{{coupon.function == 'PACKAGE' && coupon.price ? '￥' + coupon.price + ' 购买' : '立即领取'}}</button>
    <button wx:else class="sign-btn {{coupon.function == 'PACKAGE' ? 'bold' : ''}}" hidden="{{coupon.balance <= 0}}" data-couponid="{{coupon.id}}" catchtap="assign">{{coupon.function == 'PACKAGE' && coupon.price ? '￥' + coupon.price + ' 购买' : '立即领取'}}</button>
  </block>
  <block wx:if="{{coupon.balance <= 0}}">
    <button class='sign-unable-btn' data-couponid="{{coupon.id}}" catchtap="assign">已领完</button>
  </block> -->
    </view>
  </view>
</template>
<script setup>
import pinkline from '@/utils/newretail/image/pinkline.png'
import dateicon from '@/utils/newretail/image/dateicon.png'
import _utilsThemeManager from '@/utils/newretail/themeManager'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
// import { attached, ready } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// components/coupon/coupon-receive/coupon-receive.js
const IMAGESPATH = _utilsImagesPathJs
const THEME = _utilsThemeManager

// 获取应用实例
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
const state = reactive({
  imagesPath: IMAGESPATH,
  theme: THEME,
})
const props = defineProps({
  coupon: Object,
  hasUserInfo: Boolean,
  hideSignBtn: Boolean,
  // 隐藏领取按钮
  showUseBtn: Boolean, // 隐藏使用按钮
})
attached(function () {})
ready(function () {
  state.theme = {
    color:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? app.globalData.uiconfig.themeColor
        : uni.getStorageSync('themeColor') || '#FF9F43',
    mainColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color:' + app.globalData.uiconfig.themeColor + ';'
        : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background:' + app.globalData.uiconfig.themeColor + ';'
        : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    borderColor:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color:' + app.globalData.uiconfig.themeColor + ';'
        : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
    mainBgGradient:
      app.globalData.uiconfig &&
      app.globalData.uiconfig.themeColor != null &&
      app.globalData.uiconfig.themeColor !== '#FF9F43'
        ? 'background: linear-gradient(-270deg, ' +
          app.globalData.uiconfig.themeColor +
          ', ' +
          app.globalData.uiconfig.themeColor +
          ');'
        : 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
    mainColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'color:' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'color:rgba(255,159,67, 0.4);',
    borderColorRgb:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'border-color:' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
        : 'border-color:rgba(255,159,67, 0.4);',
    mainColorRgb02:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? colorRgba(app.globalData.uiconfig.themeColor, 0.4)
        : 'rgba(255,159,67, 0.2)',
    BgColorRgb01:
      app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
        ? 'background-color:' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';'
        : 'background-color:rgba(255,159,67, 0.1);',
  }
})
function clickItem(e) {
  triggerEvent('couponClick', e.currentTarget.dataset)
}
function getUserInfo(e) {
  console.log(e)
  triggerEvent('getUserInfo', e)
}
function catchCoupon() {}
function assign(e) {
  triggerEvent('assign', e.currentTarget.dataset)
}
function actionExpand(e) {
  state.isExpand = !state.isExpand
}
function showCouponCode(e) {
  triggerEvent('showCode', e.currentTarget.dataset)
}
</script>
<style scoped>
/* components/coupon/coupon-receive/coupon-receive.wxss */

.coupon-item {
  width: 700rpx;
  /* height: 330rpx; */
  overflow: hidden;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 15rpx 0rpx;
  font-size: 24rpx;
  color: #8b8b8c;
  position: relative;
  display: flex;
  flex-direction: column;
}

.coupon-item .coupon-bg {
  width: 708rpx;
  height: 338rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.coupon-item image.coupon-logo {
  width: 89rpx;
  height: 58rpx;
  margin-top: 10rpx;
  position: relative;
}

.coupon-item button {
  width: 160rpx;
  height: 60rpx;
  background: #ff762a;
  color: #fff;
  font-size: 26rpx;
  border: none;
  padding: 0rpx;
  line-height: 60rpx;
  position: absolute;
  right: 40rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  border-radius: 30rpx;
}

.use-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff7121;
  width: 160rpx;
  height: 50rpx;
  color: #ff762a;
  font-size: 26rpx;
  color: #fff;
  padding: 0rpx;
  position: absolute;
  right: 40rpx;
  top: 50%;
  border: 2rpx solid #ff762a;
  z-index: 1;
  transform: translateY(-50%);
  border-radius: 25rpx;
}

.coupon-item .sign-unable-btn {
  background: #e6e6e6;
}

.coupon-item .coupon-info {
  width: 450rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
}

.coupon-item .name {
  font-size: 32rpx;
  color: #454545;
  font-weight: bold;
  margin: 10rpx 0rpx 20rpx 0;
  position: relative;
}

.coupon-item .name text {
  color: #ff8561;
  font-size: 36rpx;
  font-style: oblique;
  margin: 0rpx 10rpx;
}

.coupon-item .coupon-bottom {
  position: absolute;
  bottom: 40rpx;
  left: 50rpx;
  width: 600rpx;
}

.coupon-item .coupon-bottom .remain-count {
  float: right;
}

.coupon-item .coupon-bottom .remain-count text {
  color: #ff8561;
}

.coupon-price {
  color: #ffbf00;
  font-size: 28rpx;
  line-height: 188rpx;
  width: 165rpx;
  text-align: center;
}

.coupon-price text {
  font-size: 48rpx;
  font-weight: bold;
}

.coupon-price.discount text {
  font-size: 36rpx;
}

.coupon-price.freeship text {
  font-size: 36rpx;
}

.coupon-middle {
  width: calc(100% - 165rpx);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.coupon-middle .name {
  font-size: 32rpx;
  color: #020202;
  line-height: 36rpx;
  margin-bottom: 30rpx;
  margin-top: 9rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coupon-middle .condition {
  font-size: 24rpx;
  line-height: 36rpx;
  color: #686868;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.main-coupon {
  position: relative;
  display: flex;
  background-color: #fff4ef;
  width: 700rpx;
  min-height: 185rpx;
  border-top-left-radius: 15rpx;
  border-top-right-radius: 15rpx;
  position: relative;
}
.main-coupon .main-coupon-seperator {
  position: absolute;
  display: inline-block;
  top: 40rpx;
  width: 100%;
  height: 39rpx;
  background-color: aliceblue;
}
.main-coupon .main-coupon-seperator image {
  width: 100%;
  height: 100%;
}
.main-coupon-code {
  position: absolute;
  right: 0;
  top: 0;
  width: 50rpx;
  height: 50rpx;
  z-index: 1;
}

.main-coupon-code image {
  width: 50rpx;
  height: 50rpx;
}

.main-coupon-function {
  width: 232rpx;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 45rpx;
  font-weight: Medium;
  padding-top: 20rpx;
  font-family: SourceHanSansCN-Medium;
  z-index: 1;
  /* padding-left: 24rpx;
  box-sizing: border-box;*/
}
.main-coupon-num {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150rpx;
  height: 130rpx;
  background-color: #fff;
}
.main-coupon-detail {
  width: calc(100% - 252rpx);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20rpx 0rpx;
  justify-content: space-around;
  color: #fb5606;
  z-index: 1;
}

.main-coupon-detail-title {
  font-size: 32rpx;
  color: #fb5606;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.mini-function {
  font-size: 20rpx;
  background-color: #fb5606;
  width: 80rpx;
  height: 30rpx;
  border-radius: 15rpx;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
}

.coupon-time-expand-board {
  width: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff4ef;
  padding: 10rpx 20rpx;
}

.coupon-time-baord {
  display: flex;
}

.coupon-time-icon {
  width: 24rpx;
  margin-right: 15rpx;
}

.coupon-time-label {
  font-size: 22rpx;
  color: #fb5606;
}

.coupon-rule-btn {
  width: 100rpx;
  height: 30rpx;
  font-size: 26rpx;
}

.coupon-head-info {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
}

.coupon-seperator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 42rpx;
  background-color: #fff4ef;
}
.coupon-seperator .line {
  width: 633rpx;
  height: 0rpx;
  border: 1px dashed #ffb38e;
}
</style>
