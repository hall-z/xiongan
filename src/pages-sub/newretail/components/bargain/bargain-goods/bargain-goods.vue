<template>
<!--components/bargain/bargain-goods/bargain-goods.wxml-->
<view>
<view class="bargain-item">
  <view class="goods-img">
    <image :src="imageUrl"></image>
    <image class="no-balance" :src="imagesPath.soldOutIcon" v-if="balance <= 0"></image>
  </view>
  <view class="goods-info">
    <view class="goods-name">{{bargain.name}}</view>
    <view class="goods-desc">{{bargain.description}}</view>
    <view class="goods-balance">剩余 {{balance}} 件</view>
    <view class="price-time">
      <view class="original-price" v-if="bargain.price">原价：￥{{bargain.price}}</view>
      <view class="bargain-price">最低可砍至￥
        <text>{{bargain.lowerPrice}}</text>
      </view>
    </view>
  </view>
</view>
<view class="bargain-time" v-if="status === 'START'">
  <text>{{time.day}}</text>天
  <text>{{time.hou}}</text>:
  <text>{{time.min}}</text>:
  <text>{{time.sec}}</text>后结束
</view></view>
</template>
<script setup>
import _utilsSelfJs from "@/utils/newretail/self";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiBargainService from "@/service/api/newretail/bargainService";
// import { ready, detached } from "@dcloudio/uni-app";
import { reactive , watch} from "vue";
const app = getApp();
// components/bargain/bargain-goods/bargain-goods.js
const bargainService = _apiBargainService;
const IMGAGESPATH = _utilsImagesPathJs;
const UTILS = _utilsUtilsJs;
const themeManager = _utilsThemeManagerJs;
const selfA = _utilsSelfJs;
//获取应用实例
const state = reactive({
  bargain: {},
  imagesPath: IMGAGESPATH,
  type: "MY",
  // BUY,MY
  status: "START",
  //SUCCESS,START,FAIL 
  time: {
    day: "00",
    hou: "00",
    min: "00",
    sec: "00"
  },
  // 活动时间倒计时
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor')
});
const props = defineProps({
  balance: {
    type: Number
  },
  bargainData: {
    type: Object,
    value: null
  }
});
ready(function () {
  state.themeColor = app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor ? app.globalData.uiconfig.themeColor : uni.getStorageSync('themeColor');
});
function handleBargainData(res) {
  if (!res) {
    return;
  }
  state.bargain = res;
  console.log(res);
  const that = this;
  // 处理砍价活动倒计时
  let startDate = res.startDate; // 活动开始时间
  let duration = 0;
  // 实例
  if (res.isInstance) {
    startDate = res.createTime;
    duration = res.duration; // 活动持续时间
    if (res.availableStockAmount > 0 && res.status === "CREATE") {
      countDown();
    } else {
      state.status = "SUCCESS";
    }
  } else {
    const startDateTimeStamp = new Date(res.startDate.replace(/-/g, '/')).getTime(); // 活动开始时间时间戳
    const endDateTimeStamp = new Date(res.endDate.replace(/-/g, '/')).getTime(); // 活动结束时间时间戳
    duration = (endDateTimeStamp - startDateTimeStamp) / 1000; // 活动持续时间
    countDown();
  }
  // 执行倒计时函数
  function countDown() {
    clearTimeout(state.bargainTimeId);
    // 获取倒计时
    let timeInfo = [];
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    timeInfo.push({
      openTeamTime: startDate,
      duration: duration
    });
    let countDownArr = UTILS.countDownDay(timeInfo);
    state.time = countDownArr[0];
    if (countDownArr[0].day === "00" && countDownArr[0].hou === "00" && countDownArr[0].min === "00" && countDownArr[0].sec === "00") {
      if (res.isInstance) {
        getInstanceDetails(res.id);
      } else {
        if (!queryActivity == null) {
          getBargainActivity(res.id);
        }
      }
    } else {
      let time = setTimeout(function () {
        countDown();
      }, 1000);
      state.bargainTimeId = time;
    }
  }
}
function getBargainActivity(id) {
  const self = this;
  queryActivity = true;
  bargainService.getDetails(id, app.globalData.storeInfo.id).then(res => {
    state.bargain = res;
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
function getInstanceDetails(id) {
  const self = this;
  bargainService.getInstanceDetails(id).then(res => {
    state.bargain = {
      ...state.bargain,
      ...res
    };
    state.status = "SUCCESS";
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
detached(function () {
  clearTimeout(state.bargainTimeId);
});

// Watch listeners converted from observers
watch(() => props.bargainData, (newVal, oldVal) => {
  //     await selfA.getTemporaryUrl(newVal.productImage)
        //     .then (res=>{
        //      this.setData({
        //         imageUrl:res
        //      })
        //  })
        // 属性值变化时执行
        state.imageUrl = newVal && newVal.productImage;
        handleBargainData(newVal);
});

</script>
<style scoped>
/* components/bargain/bargain-goods/bargain-goods.wxss */
.bargain-item {
  width: 710rpx;
  /* height: 240rpx; */
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20rpx;
  box-sizing: border-box;
  background: #fff;
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
  border-radius: 4rpx;
}
.goods-img image.no-balance {
  position: absolute;
  left: 0;
  top: 0;
}
.goods-balance {
  width: 120rpx;
  height: 30rpx;
  border-radius: 6rpx;
  font-size: 20rpx;
  line-height: 30rpx;
  color: #FF7103;
  text-align: center;
  border: 1px solid #FF7103;
}
.goods-info {
  width: calc(100% - 276rpx);
  font-size: 24rpx;
  line-height: 36rpx;
  padding-top: 7rpx;
  min-height: 256rpx;
  box-sizing: border-box;
  position: relative;
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
  /* display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden; */
}
.goods-desc {
    font-size: 26rpx;
    line-height: 32rpx;
    color: #333;
    font-family: SourceHanSansCN-Medium;
    font-weight: 400; 
    margin: 20rpx 0;
}
.goods-info .original-price {
  color: #333;
  font-size: 20rpx;
  margin-bottom: 10rpx;
}
.goods-info .bargain-price {
  color: #FF7103;
  line-height: 30rpx;
  font-size: 20rpx;
}
.goods-info .bargain-price text {
  font-size: 30rpx;
  font-weight: bold;
}
.bargain-time {
  margin: 20rpx 0;
  color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bargain-time text {
  display: inline-block;
  text-align: center;
  background: #FF7103;
  color: #fff;
  width: 34rpx;
  height: 34rpx;
  font-size: 24rpx;
  line-height: 34rpx;
  margin: 0 6rpx;
  border-radius: 4rpx;
}
</style>