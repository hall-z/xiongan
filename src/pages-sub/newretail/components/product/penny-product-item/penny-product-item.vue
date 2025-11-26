<template>
<!--components/product/penny-product-item/penny-product-item.wxml-->
<view class="penny-item" :data-id="penny.id" @click="clickItem">
  <view class="penny-item-img">
    <image :src="penny.activityImageUrl || penny.productImage" mode="widthFix"></image>
    <image class="no-balance" :src="imagesPath.soldOutIcon" v-if="balance <= 0"></image>
  </view>
  <view class="penny-item-info">
    <view class="name">{{penny.name}}</view>
    <view class="progress">
      <progress :percent="progress" active="" stroke-width="6" border-radius="2" activeColor="#FF9F43" backgroundColor="#E0E0E0"></progress>
      <text v-if="time.day !== '00' && time.day !== 0">剩{{time.day}}天开奖</text>
      <text v-else-if="time.hou !== '00' && time.hou !== 0">剩{{time.hou}}小时开奖</text>
      <text v-else-if="time.min !== '00' && time.min !== 0">剩{{time.min}}分钟开奖</text>
      <text v-else-if="time.sec !== '00' && time.sec !== 0">剩{{time.sec}}秒开奖</text>
      <text v-else>已开奖</text>
    </view>
    <view class="price">
      <view class="now-price">￥
        <text>{{penny.actualPrice}}</text>
      </view>
      <view :class="'buy ' + (balance === 0 ? 'no-balance' : '')">
        <image :src="imagesPath.iconPenneryHand" mode="widthFix" lazy-load="false"></image> 抢
      </view>
    </view>
  </view>
</view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiProductServiceJs from "@/service/api/newretail/productService";
// import { detached } from "@dcloudio/uni-app";
import { reactive , watch} from "vue";
const app = getApp();
// components/product/penny-product-item/penny-product-item.js
const productService = _apiProductServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const UTILS = _utilsUtilsJs;
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  penny: null,
  time: null,
  progress: 0,
  balance: 999
});
const props = defineProps({
  productData: {
    // 商品数据
    type: Object,
    value: null
  },
  storeId: String
});
function clickItem(e) {
  if (state.time && state.time.day === "00" && state.time.hou === "00" && state.time.min === "00" && state.time.sec === "00") {
    UTILS.showToast("活动已结束~");
  } else {
    state.time ? triggerEvent('click', e.currentTarget.dataset) : UTILS.showToast("活动还未开始~");
  }
}
function handlePennyData(res) {
  if (!res) {
    return;
  }
  // 查询商品库存
  queryProduct(res.productId);
  const that = this;
  // 处理购物抽奖活动倒计时
  const startDate = res.startTime; // 活动创建时间
  const endDate = res.endTime; // 活动结束时间
  const startTimeStamp = new Date(res.startTime.replace(/-/g, '/')).getTime(); // 开始时间时间戳
  const endTimeStamp = new Date(res.endTime.replace(/-/g, '/')).getTime(); // 开始时间时间戳
  const duration = (endTimeStamp - startTimeStamp) / 1000 > 0 ? parseInt((endTimeStamp - startTimeStamp) / 1000) : 0; // 活动持续时间
  console.log(duration);
  // 设置进度
  const progress = getProgress();
  state.progress = progress;
  if (duration > 0) {
    countDown();
  }
  // 执行倒计时函数
  function countDown() {
    clearTimeout(state.pennyTimeId);
    // 获取倒计时
    let timeInfo = [];
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    timeInfo.push({
      openTeamTime: startDate,
      duration: duration
    });
    let countDownArr = UTILS.countDownDay(timeInfo, false);
    // 设置进度
    const progress = getProgress();
    state.time = countDownArr[0];
    state.progress = progress;
    if (countDownArr[0].day === "00" && countDownArr[0].hou === "00" && countDownArr[0].min === "00" && countDownArr[0].sec === "00") {} else {
      let time = setTimeout(function () {
        countDown();
      }, 1000);
      state.pennyTimeId = time;
    }
  }
  // 设置进度条
  function getProgress() {
    const now = new UTILS.ResponseDate().getTime();
    const timeElapsed = (now - startTimeStamp) / 1000 > 0 ? parseInt((now - startTimeStamp) / 1000) : 0;
    const progress = timeElapsed / duration > 0 ? parseInt(timeElapsed / duration * 100) : 0;
    return progress;
  }
}
function queryProduct(productId) {
  if (state.storeId === "") {
    return;
  }
  productService.getDetails(state.storeId, productId).then(res => {
    let balance = 0;
    if (res && res.storeProductState === "ON") {
      balance = res.balance;
    }
    state.balance = balance;
  }).catch(err => {
    state.balance = 0;
  });
}
detached(function () {
  clearTimeout(state.pennyTimeId);
});

// Watch listeners converted from observers
watch(() => props.productData, (newVal, oldVal) => {
  // 属性值变化时执行
        if (newVal) {
          state.penny = newVal;
        }
        handlePennyData(newVal);
});

</script>
<style scoped>
/* components/product/penny-product-item/penny-product-item.wxss */
.penny-item {
  width: 348rpx;
  height: 530rpx;
  border-radius: 6rpx;
  background: #fff;
  margin-bottom: 15rpx;
}
.penny-item-img {
  position: relative;
  width: 348rpx;
  height: 348rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.penny-item-img image {
  width: 348rpx;
  height: 348rpx;
}
.penny-item-img image.no-balance {
  position: absolute;
  left: 0;
  top: 0;
}
.penny-item-info {
  color: #333;
  padding: 9rpx 7rpx 0 13px;
}
.penny-item-info .name {
  font-size: 28rpx;
  line-height: 48rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.penny-item-info .progress,
.penny-item-info .price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 36rpx;
}
.penny-item-info .progress {
  line-height: 36rpx;
}
.penny-item-info .progress progress {
  width: 144rpx;
  height: 12rpx;
}
.penny-item-info .progress text {
  color: #131313;
  font-size: 20rpx;
}
.penny-item-info .price {
  font-size: 24rpx;
  color: #f23428;
  margin-top: 12rpx;
}
.penny-item-info .price text {
  font-size: 48rpx;
}
.penny-item-info .price .buy {
  width: 103rpx;
  height: 57rpx;
  background: #e02e24;
  border-radius: 29rpx;
  font-size: 36rpx;
  color: #fff;
  display: flex;
  align-items: center;
}
.penny-item-info .price .buy.no-balance {
  background: #D8D8D8;
}
.penny-item-info .price .buy image {
  width: 32rpx;
  height: 25rpx;
  margin-left: 9rpx;
  margin-right: 10rpx;
}
</style>