<template>
  <!--components/bargain/bargain-item/bargain-item.wxml-->
  <view>
    <view class="bargain-item" :data-id="bargain.id" @click="clickItem">
      <view class="goods-img">
        <image :src="imageUrl"></image>
        <image class="no-balance" :src="imagesPath.soldOutIcon" v-if="bargain.balance <= 0"></image>
      </view>
      <view class="goods-info">
        <view class="goods-name" v-if="bargainType === 'BUY'">{{ bargain.name }}</view>
        <view class="goods-name" v-if="bargainType === 'MY'">{{ bargain.productName }}</view>
        <view class="goods-desc">{{ bargain.description }}</view>
        <view class="goods-balance">剩余 {{ bargain.balance }} 件</view>
        <view class="price-time">
          <view v-if="bargainType === 'BUY'">
            <view class="original-price" v-if="bargain.originalPrice">
              原价：￥{{ bargain.originalPrice }}
            </view>
            <view class="bargain-price">
              最低可砍至￥
              <text>{{ bargain.lowerPrice }}</text>
            </view>
          </view>
          <view v-if="bargainType === 'MY'">
            <view class="bargain-price">
              已砍至￥
              <text>{{ bargain.finalPrice }}</text>
            </view>
            <view class="bargain-time" v-if="bargain.status === 'CREATE'">
              <text v-if="time.day > 0" class="timeInfo">{{ time.day }}</text>
              <text v-if="time.day > 0">天</text>
              <text class="timeInfo">{{ time.hou }}</text>
              :
              <text class="timeInfo">{{ time.min }}</text>
              :
              <text class="timeInfo">{{ time.sec }}</text>
              后结束
            </view>
            <view :class="'bargain-status ' + (bargain.status === 'FAILED' ? 'fail' : '')" v-else>
              {{ filters.filtBargainStatus(bargain.status) }}
            </view>
          </view>
        </view>
        <button class="bargain-button" v-if="bargainType === 'BUY'">去砍价</button>
        <button class="bargain-button" v-else-if="bargainType === 'MY'">查看详情</button>
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiStoreServiceJs from '@/service/api/newretail/storeService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiBargainServiceJs from '@/service/api/newretail/bargainService'
import { reactive, watch } from 'vue'
const app = getApp()

// components/bargain/bargain-item/bargain-item.js
const bargainService = _apiBargainServiceJs
const productService = _apiProductServiceJs
const storeService = _apiStoreServiceJs
const IMGAGESPATH = _utilsImagesPathJs
const UTILS = _utilsUtilsJs
const themeManager = _utilsThemeManagerJs
const ADDRESS = _utilsAddressJs
const selfA = _utilsSelfJs
// 获取应用实例
const state = reactive({
  bargain: {},
  imagesPath: IMGAGESPATH,
  type: 'MY',
  // BUY,MY
  status: 'START',
  // SUCCESS,START,FAIL
  queryProduct: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
})
const props = defineProps({
  bargainData: {
    type: Object,
    value: null,
  },
  bargainType: String,
})

// Watch listeners converted from observers
watch(
  () => props.bargainData,
  (newVal, oldVal) => {
    // 属性值变化时执行
    if (newVal != null) {
      state.imageUrl = newVal.productImage
      state.bargain = newVal
    }
    if (state.type === 'MY') {
      handleBargainData(newVal)
    }
  },
)
function attached() {
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
}
function moved() {}
function detached() {}
function clickItem(e) {
  triggerEvent('click', e.currentTarget.dataset)
}
function handleBargainData(res) {
  if (!res) {
    return
  }
  const that = this
  // 处理砍价活动倒计时
  const startDate = res.createTime // 实例创建时间
  const duration = res.duration // 实例持续时间
  if (
    state.bargainType === 'BUY' &&
    !state.queryProduct &&
    app.globalData.storeInfo &&
    app.globalData.storeInfo.id
  ) {
    getProductDetails(app.globalData.storeInfo.id)
  } else {
    if (!res.balance) {
      state.bargain = {
        ...state.bargain,
        balance: state.bargain.availableStockAmount,
      }
    }
  }
  if (res.status === 'CREATE') {
    if (state.bargainType === 'MY') {
      if (state.bargain.balance === 0) {
        state.bargain.status = 'FAILED'
      } else {
        countDown()
      }
    } else {
      countDown()
    }
  }
  // 执行倒计时函数
  function countDown() {
    clearTimeout(state.bargainTimeId)
    // 获取倒计时
    const timeInfo = []
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    timeInfo.push({
      openTeamTime: startDate,
      duration,
    })
    const countDownArr = UTILS.countDownDay(timeInfo)
    state.time = countDownArr[0]
    if (
      countDownArr[0].day === '00' &&
      countDownArr[0].hou === '00' &&
      countDownArr[0].min === '00' &&
      countDownArr[0].sec === '00'
    ) {
      if (queryInstance == null) {
        getInstanceDetails(res.id)
      }
    } else {
      if (state.bargainType === 'MY' && state.bargain.balance === 0) {
        state.bargain.status = 'FAILED'
      } else {
        const time = setTimeout(function () {
          countDown()
        }, 1000)
        state.bargainTimeId = time
      }
    }
  }
}
function getInstanceDetails(id) {
  const self = this
  queryInstance = true
  bargainService
    .getInstanceDetails(id)
    .then((res) => {
      state.bargain = {
        ...res,
        productImage: res.imageUrl ? res.imageUrl : '',
      }
    })
    .catch((err) => {
      UTILS.showToast(err.message)
    })
}
function getProductDetails(storeId) {
  const that = this
  state.queryProduct = true
  productService
    .getDetails(storeId, state.bargain.productId)
    .then((res) => {
      if (!res) {
        return
      }
      // 将砍价商品的原价重置为商品在门店中的售价
      const balance =
        res.balance > state.bargain.availableStockAmount
          ? state.bargain.availableStockAmount
          : res.balance
      console.log('balanceaaa', balance, res.balance, state.bargain.availableStockAmount)
      state.bargain = {
        ...state.bargain,
        originalPrice: res.sellPrice,
        balance,
      }
      console.log('balancbbbb', state.bargain.balance)
    })
    .catch((err) => {
      if (err.code === 16015) {
        if (app.globalData.storeInfo.id === storeId) {
          ADDRESS.getDistributionStore()
            .then((res) => {
              if (res) {
                getProductDetails(res.id)
              }
            })
            .catch((err) => {
              console.log(err.message)
            })
        }
      } else {
        UTILS.showToast(err.message)
      }
    })
}
</script>
<style scoped>
/* components/bargain/bargain-item/bargain-item.wxss */

.bargain-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background-color: #fff;
  padding: 20rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
}

.goods-img {
  width: 256rpx;
  height: 256rpx;
  position: relative;
}

.goods-img image {
  width: 100%;
  height: 100%;
  border-radius: 6rpx;
}

.goods-img image.no-balance {
  position: absolute;
  left: 0;
  top: 0;
}

.goods-balance {
  width: 116rpx;
  height: 32rpx;
  border-radius: 6rpx;
  font-size: 20rpx;
  line-height: 32rpx;
  color: #ff7103;
  text-align: center;
  border: 1px solid #ff7103;
}

.goods-info {
  width: calc(100% - 276rpx);
  font-size: 24rpx;
  line-height: 36rpx;
  height: 256rpx;
  padding-bottom: 5rpx;
  box-sizing: border-box;
  position: relative;
  /* border-bottom: 1px solid #dcdcdc; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-info .goods-name {
  font-size: 30rpx;
  line-height: 32rpx;
  color: #333;
  font-family: SourceHanSansCN-Medium;
  font-weight: bold;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.goods-info .goods-desc {
  font-size: 26rpx;
  line-height: 32rpx;
  color: #333;
  font-family: SourceHanSansCN-Medium;
  font-weight: 400;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.goods-info .original-price {
  color: #333;
  margin-bottom: 12rpx;
  font-size: 20rpx;
}

.goods-info .bargain-price {
  color: #ff7103;
  line-height: 36rpx;
  margin-bottom: 5rpx;
  font-size: 20rpx;
}

.goods-info .bargain-price text {
  font-size: 30rpx;
  font-weight: bold;
}

.goods-info .bargain-button {
  width: 158rpx;
  height: 60rpx;
  font-size: 24rpx;
  line-height: 60rpx;
  padding: 0;
  background: linear-gradient(90deg, #ff9f43, #ee5253);
  border-radius: 30rpx;
  font-weight: bold;
  color: #fff;
  position: absolute;
  right: 0;
  bottom: 2rpx;
}

button::after {
  border: 0;
}

.fail {
  color: #ee5253;
}

.bargain-status {
  margin-top: 19rpx;
  margin-bottom: 2rpx;
  color: #666;
}

.bargain-time {
  margin-top: 22rpx;
  margin-bottom: 10rpx;
  color: #999;
}

.bargain-time .timeInfo {
  display: inline-block;
  text-align: center;
  background: rgba(252, 88, 13, 0.7);
  color: #fff;
  width: 30rpx;
  height: 30rpx;
  font-size: 20rpx;
  line-height: 30rpx;
  margin: 0 6rpx 0 0;
}
</style>
