<template>
  <!--components/timer-picker/index.wxml-->
  <!--component/time-picker/index.wxml-->
  <view>sdflsjdfkkfjfjsdjf</view>
  <view class="select-date">
    <view class="inner-box">
      <view class="time-title">
        <text>选择{{ props.title }}</text>
        <view @click="closePopup" class="close-btn">x</view>
      </view>
      <view class="select-day">
        <view
          class="day"
          v-for="(item, index) in state.selfData"
          :key="index"
          @click="getnowDay"
          :data-index="index"
        >
          {{ item }}
        </view>
      </view>
      <view class="select-time">
        <!-- <view v-for="(item,index) in deliveryTimeList" :key="index"> -->
        <view v-if="state.nowDay === 0">
          <view v-if="state.deliveryTimeList[state.nowDay].timeList.length > 0">
            <view
              :class="
                index === selectTimeIndex && state.nowDay === state.selectDay
                  ? 'select-time-item select'
                  : 'select-time-item'
              "
              v-for="(item, index) in state.deliveryTimeList[state.nowDay].timeList"
              @click="clickTime"
              :key="index"
              :data-index="index"
            >
              {{ item }}
            </view>
          </view>
          <view v-else class="time-title">抱歉，没有可选{{ title }}</view>
        </view>
        <view v-if="state.nowDay !== 0">
          <view
            :class="
              index === selectTimeIndex && state.nowDay === state.selectDay
                ? 'select-time-item select'
                : 'select-time-item'
            "
            v-for="(item, index) in state.deliveryTimeList[state.nowDay].timeList"
            @click="clickTime"
            :key="index"
            :data-index="index"
          >
            {{ item }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsUtilsJs from '@/utils/newretail/utils'
import { reactive, watch } from 'vue'
const app = getApp()
// components/timer-picker/index.js
const utils = _utilsUtilsJs
const state = reactive({
  deliveryTime: '',
  selfData: [],
  // 自提日期
  showDelivery: false,
  deliveryTimeList: [
    {
      day: '',
      timeList: '',
    },
  ],
  nowDay: 0,
  selectTime: '',
  selectTimeIndex: '',
  selectDay: 0,
})
const props = defineProps({
  deliveryTimeData: {
    type: Array,
  },
  title: {
    type: String,
    default: '自提时间',
  },
})
function getnowDay(e) {
  state.nowDay = e.currentTarget.dataset.index
}
function clickTime(e) {
  const selfData = state.selfData[state.nowDay]
  const index = e.currentTarget.dataset.index
  const selectTime = state.deliveryTimeList[state.nowDay].timeList[index]
  const deliveryTime = selfData + ' ' + selectTime
  const nowDay = state.nowDay
  state.selectTimeIndex = index
  state.selectTime = selectTime
  state.deliveryTime = deliveryTime
  state.selectDay = nowDay
  triggerEvent('selectTime', {
    deliveryTime: state.deliveryTime,
  })
}
function closePopup() {
  triggerEvent('onClose')
}
function getDliveryTime(newVal) {
  const deliveryTimeList = []
  newVal.forEach((item) => {
    const timeList = []
    item.timeList.filter((timeItem) => {
      if (timeItem.optional) {
        timeList.push(timeItem.time)
      }
    })
    deliveryTimeList.push({
      day: item.day,
      timeList,
    })
  })
  state.deliveryTimeList = deliveryTimeList
  state.selfData = []
  state.deliveryTimeList.forEach((item) => {
    state.selfData.push(item.day)
  })
  state.deliveryTime = ''
  state.nowDay = 0
  state.selectTime = ''
  state.selectTimeIndex = ''
  state.selectDay = 0
}

// Watch listeners converted from observers
watch(
  () => props.deliveryTimeData,
  (newVal, oldVal) => {
    getDliveryTime(newVal)
  },
)
</script>
<style scoped>
/* components/timer-picker/index.wxss */
/* component/time-picker/index.wxss */
.time-title {
  font-family: PingFangSC;
  color: #000;
  font-size: 32rpx;
  margin: 40rpx 20rpx 20rpx 20rpx;
  text-align: center;
  position: relative;
  line-height: 80rpx;
}
.close-btn {
  position: absolute;
  right: 0;
  text-align: center;
  top: -5rpx;
  width: 80rpx;
  height: 60rpx;
  color: #999999;
  font-size: 40rpx;
}
.select-date {
  height: 672rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
}
.inner-box {
  position: relative;
  bottom: 30rpx;
}
.select-day {
  float: left;
  width: 285rpx;
  height: 556rpx;
  background: #f3f3f3;
  overflow-y: auto;
}
.day {
  font-size: 30rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  /* font-weight: 500; */
}
.day.active {
  background-color: #fff;
}
/* .select-time {
    height: 100%;
    margin-left: 330rpx;
    background-color: #fff;
    overflow-y: auto;
  } */
.select-time-item {
  width: 385rpx;
  height: 100rpx;
  border-bottom: 1px solid #ddd;
  font-size: 30rpx;
  line-height: 100rpx;
  color: #111;
}
.select-time-item.select {
  color: #ff4a00;
}
/* .time {
    line-height: 80rpx;
    border-bottom: 2px solid #eee;
  } */
i {
  float: right;
  font-size: 30rpx;
  color: #ff4a00;
  margin-top: 26rpx;
}
No newline at end of file
/* components/timer-picker/index.wxss */
/* component/time-picker/index.wxss */
.time-title {
  font-family: PingFangSC;
  color: #000;
  font-size: 32rpx;
  margin: 40rpx 20rpx 20rpx 20rpx;
  text-align: center;
  position: relative;
  line-height: 50rpx;
}
.close-btn {
  position: absolute;
  right: 0;
  text-align: center;
  top: -5rpx;
  width: 80rpx;
  height: 60rpx;
  color: #999999;
  font-size: 40rpx;
}
.select-date {
  height: 715rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
}
.select-day {
  float: left;
  width: 285rpx;
  height: 608rpx;
  background: #f3f3f3;
}
.day {
  font-size: 30rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  /* font-weight: 500; */
}
.day.active {
  background-color: #fff;
}
.select-time {
  height: 545rpx;
  margin-left: 330rpx;
  background-color: #fff;
  overflow-y: auto;
}
.select-time-item {
  width: 385rpx;
  height: 100rpx;
  border-bottom: 1px solid #ddd;
  font-size: 30rpx;
  line-height: 100rpx;
  color: #111;
}
.select-time-item.select {
  color: #ff4a00;
}
/* .time {
    line-height: 80rpx;
    border-bottom: 2px solid #eee;
  } */
i {
  float: right;
  font-size: 30rpx;
  color: #ff4a00;
  margin-top: 26rpx;
}
</style>
