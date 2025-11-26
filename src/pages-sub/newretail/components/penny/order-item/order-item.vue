<template>
<!--components/penny/order-item/order-item.wxml-->
<view class="order-item" :data-id="order.id" @click="clickItem">
  <view class="goods-info">
    <view class="goods-info-img">
      <image :src="order.activityImageUrl || order.productImage" mode="widthFix"></image>
    </view>
    <view>
      <text class="name">{{order.activityName}}</text>
      <view class="progress-box" v-if="order.status === 'CREATE'">
        <progress :percent="progress" stroke-width="12" active="" border-radius="9" activeColor="#ef2630" backgroundColor="#e0e0e0"></progress>
        <text class="progress-text">{{progress}}%</text>
        <text v-if="time.day !== '00' && time.day !== 0">{{time.day}}天</text>
        <text v-else-if="time.hou !== '00' && time.hou !== 0">{{time.hou}}小时</text>
        <text v-else-if="time.min !== '00' && time.min !== 0">{{time.min}}分钟</text>
        <text v-else-if="time.sec !== '00' && time.sec !== 0">{{time.sec}}秒</text>
        <text v-else>{{isInTheOpeningAward ? "开奖中" : "已开奖"}}</text>
      </view>
      <view class="progress-box" v-else></view>
      <text class="join-num">助力人数：{{order.helperNumber}}人</text>
    </view>
  </view>
  <view class="button-box">
    <text v-if="isInTheOpeningAward">开奖中</text>
    <text v-else-if="order.status === 'CREATE' && order.helperNumber < order.minHelpNumber">暂无中奖资格，待分享</text>
    <text v-else-if="order.status === 'CREATE' && order.helperNumber >= order.minHelpNumber">已获得获奖资格
    邀请更多好友助力提高中奖概率</text>
    <text v-else-if="order.status === 'NOPRIZE'">很遗憾，未中奖</text>
    <text v-else>恭喜您中奖啦</text>
    <view v-if="!isInTheOpeningAward">
      <button class="share-btn" open-type="share" @click.stop="catchShare" :data-id="order.id" v-if="order.status === 'CREATE'">去分享</button>
      <view v-else-if="order.status === 'NOPRIZE'">
        <button class="btn" :data-id="order.id" @click.stop="clickItem">中奖结果</button>
        <button class="again" @click.stop="clickAgain">再试一次</button>
      </view>
      <view v-else>
        <button class="btn" :data-id="order.id" @click.stop="clickItem">中奖结果</button>
        <button class="btn" :data-id="order.orderId" @click.stop="toOrderDetails">查看订单</button>
      </view>
    </view>
  </view>
</view>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _apiPennyServiceJs from "@/service/api/newretail/pennyService";
// import { detached } from "@dcloudio/uni-app";
import { reactive , watch} from "vue";
const app = getApp();
// components/penny/order-item/order-item.js
const pennyService = _apiPennyServiceJs;
const IMGAGESPATH = _utilsImagesPathJs;
const UTILS = _utilsUtilsJs;
//获取应用实例
const state = reactive({
  imagesPath: IMGAGESPATH,
  order: null,
  time: null,
  progress: 0,
  isInTheOpeningAward: false
});
const props = defineProps({
  orderData: {
    // 商品数据
    type: Object,
    value: null
  }
});
function clickItem(e) {
  triggerEvent('click', e.currentTarget.dataset);
}
function clickShare(e) {
  triggerEvent('share', e.currentTarget.dataset);
}
function clickAgain(e) {
  triggerEvent('again', e.currentTarget.dataset);
}
function toOrderDetails(e) {
  triggerEvent('order', e.currentTarget.dataset);
}
function catchShare(e) {}
function handleOrderData(res) {
  if (!res) {
    return;
  }
  state.order = res;
  if (res.status === "CREATE") {
    // 查询活动
    getPennyDetails(res.activityId);
  }
}
function getPennyDetails(activityId) {
  const self = this;
  const postData = {
    page: 1,
    pageSize: 10,
    activityIdEquals: activityId
  };
  pennyService.query(postData).then(res => {
    if (!res || !res.records || res.records.length === 0) {
      // 没有查到抽奖数据
      return;
    }
    const data = res.records[0];
    state.pennyDetail = data;
    if (data.status !== "SUBMIT") {
      if (state.order.status !== "PRIZED") {
        state.order.status = "NOPRIZE";
      }
      return;
    }
    // 处理购物抽奖活动倒计时
    const startDate = data.startTime; // 活动创建时间
    const endDate = data.endTime; // 活动结束时间
    const startTimeStamp = new Date(data.startTime.replace(/-/g, '/')).getTime(); // 开始时间时间戳
    const endTimeStamp = new Date(data.endTime.replace(/-/g, '/')).getTime(); // 开始时间时间戳
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
      clearTimeout(state.orderTimeId);
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
      if (countDownArr[0].day === "00" && countDownArr[0].hou === "00" && countDownArr[0].min === "00" && countDownArr[0].sec === "00") {
        if (queryInstance == null) {
          getInstanceDetails(state.order.id);
        }
      } else {
        let time = setTimeout(function () {
          countDown();
        }, 1000);
        state.orderTimeId = time;
      }
    }
    // 设置进度条
    function getProgress() {
      const now = new UTILS.ResponseDate().getTime();
      const timeElapsed = (now - startTimeStamp) / 1000 > 0 ? parseInt((now - startTimeStamp) / 1000) : 0;
      const progress = timeElapsed / duration > 0 ? parseInt(timeElapsed / duration * 100) : 0;
      return progress;
    }
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
function getInstanceDetails(id) {
  const self = this;
  queryInstance = true;
  pennyService.getInstanceById(id).then(res => {
    if (!res) {
      return;
    }
    state.order = {
      ...res,
      productImage: res.productImage ? res.productImage : ""
    };
    state.isInTheOpeningAward = res.status === "CREATE" ? true : false;
  }).catch(err => {
    UTILS.showToast(err.message);
  });
}
detached(function () {
  clearTimeout(state.orderTimeId);
});

// Watch listeners converted from observers
watch(() => props.orderData, (newVal, oldVal) => {
  // 属性值变化时执行
        console.log(newVal);
        if (newVal) {
          state.order = newVal;
        }
        handleOrderData(newVal);
});

</script>
<style scoped>
/* components/penny/order-item/order-item.wxss */
.order-item {
  min-height: 270rpx;
  background: #fff;
  margin-bottom: 16rpx;
  padding: 0 24rpx;
}
.order-item .goods-info {
  border-bottom: 2rpx solid #f3f3f3;
  padding-top: 22rpx;
  padding-bottom: 20rpx;
  color: #151515;
  display: flex;
}
.order-item .goods-info .goods-info-img {
  width: 144rpx;
  height: 144rpx;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.order-item .goods-info image {
  width: 100%;
  height: 100%;
  margin-right: 6rpx;
}
.order-item .goods-info .name {
  font-size: 30rpx;
  line-height: 42rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 530rpx;
}
.order-item .goods-info .progress-box {
  font-size: 22rpx;
  color: #595a5d;
  line-height: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  margin-top: 27rpx;
  position: relative;
}
.order-item .goods-info .progress-box progress {
  width: 136rpx;
  height: 24rpx;
  margin-right: 16rpx;
}
.order-item .goods-info .progress-box .progress-text {
  font-size: 16rpx;
  position: absolute;
  width: 136rpx;
  height: 24rpx;
  line-height: 24rpx;
  text-align: center;
  display: block;
  color: #fff;
}
.order-item .goods-info .join-num {
  font-size: 24rpx;
  line-height: 48rpx;
  color: #000;
  margin-top: 9rpx;
  display: block;
}
.button-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 26rpx;
  min-height: 56rpx;
  padding: 10rpx 0 18rpx 0;
  color: #555558;
}
.button-box button {
  width: 142rpx;
  height: 56rpx;
  border: 2rpx solid #de312d;
  font-size: 22rpx;
  line-height: 52rpx;
  color: #de312d;
  text-align: center;
  padding: 0;
  position: relative;
  margin-left: 14rpx;
  overflow: inherit;
}
.button-box view {
  display: flex;
}
.button-box button::after {
  border: 0;
}
.button-box button.share-btn,
.button-box button.again {
  background: #de312d;
  color: #fff;
}
.button-box button.share-btn::before {
  display: block;
  content: "";
  width: 14rpx !important;
  height: 14rpx !important;
  border-radius: 50% !important;
  background: #de312d;
  border: 2rpx solid #fff;
  position: absolute;
  right: -8rpx;
  top: -8rpx;
}
</style>