<route lang="json5" type="page">
{
  layout: 'default-newretail',
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
    },
  },
}
</route>
<template>
  <view>
    <view class="header">
      <navigationBar title="签到"></navigationBar>
      <view class="score-desc">
        <view>
          <text>{{ state.getSignInfo.count }}</text>
          <text>签到总次数</text>
        </view>
        <view>
          <text>{{ state.getSignInfo.daysCount }}</text>
          <text>连续签到</text>
        </view>
        <view>
          <text>{{ state.getSignInfo.integral }}</text>
          <text>签到积分</text>
        </view>
      </view>
    </view>
    <view class="calendar">
      <view class="header">
        <!-- <text decode="true" class="button" data-change-type="last" @click="monthChange">&lt;</text> -->
        <text>{{ state.year }}年{{ state.month }}月</text>
        <!-- <text decode="true" class="button" data-change-type="next" @click="monthChange">&gt;</text> -->
      </view>
      <view class="content">
        <view class="week">
          <text>周一</text>
          <text>周二</text>
          <text>周三</text>
          <text>周四</text>
          <text>周五</text>
          <text>周六</text>
          <text>周日</text>
        </view>
        <view class="date">
          <view
            v-for="(item, index) in state.calendarInfo"
            :key="index"
            :class="item.isTag ? 'sign-background' : ''"
          >
            {{ item.date }}
          </view>
        </view>
      </view>
    </view>
    <view class="button-area">
      <view class="theme-background" @click="signIn" :disabled="state.whetherSignIn">签 到</view>
    </view>
  </view>
</template>
<script setup>
import _utilsUtilsJs from '@/utils/newretail/utils'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const memberService = _apiMemberServiceJs
const utils = _utilsUtilsJs

const state = reactive({
  memberInfo: '',
  // 会员信息
  year: '',
  // 当前年份
  month: '',
  // 当前月份
  date: '',
  // 当前日期
  calendarInfo: [],
  // 日历信息
  signLog: [],
  // 签到日期
  getSignInfo: {},
  // 签到信息
  whetherSignIn: false,
  // 当天是否签到
  signTextCustomize: '', // 签到提示信息
})
function toScoreExchangePage() {
  // 前往积分兑换页面
  uni.navigateTo({
    url: '/pages-sub/newretail/pages/score/mall/index',
  })
}
function getMemberInfo() {
  // 获得会员信息
  memberService
    .getMemberInfo()
    .then((resObj) => {
      state.memberInfo = resObj
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
      })
    })
}
function getYearMonth() {
  // 获得当前年月
  const newDate = new Date()
  const year = newDate.getFullYear()
  const month = newDate.getMonth() + 1
  const date = newDate.getDate()
  state.year = year
  state.month = month
  state.date = date
}
function getSignLog() {
  // 获得签到记录
  const getData = {
    month: `${state.year}-${utils.timeFormat(state.month)}`,
  }
  memberService
    .getSigninLog(getData)
    .then((resObj) => {
      if (resObj.length > 0) {
        resObj = resObj.map((item) => {
          const time = item.signinTime ? item.signinTime.replace(/-/g, '/') : '' // 对ios做处理
          const dateObj = new Date(time)
          const year = dateObj.getFullYear()
          const month = dateObj.getMonth() + 1
          const date = dateObj.getDate()
          return `${year}/${month}/${date}`
        })
        // 判断当天是否有签到
        state.signLog = resObj
        const dateNow = new Date()
        const year = dateNow.getFullYear()
        const month = dateNow.getMonth() + 1
        const date = dateNow.getDate()
        const sign = `${year}/${month}/${date}`
        state.signLog.forEach((time) => {
          if (time === sign) {
            state.whetherSignIn = true
          }
        })

        // 对签到日期打标签（isTag:true）
        const calendarInfo = state.calendarInfo.map((date) => {
          state.signLog.forEach((log) => {
            const logArr = log.split('/')
            if (
              date.year === parseInt(logArr[0]) &&
              date.month === parseInt(logArr[1]) &&
              date.date === parseInt(logArr[2])
            ) {
              date = {
                ...date,
                isTag: true,
              }
            }
          })
          return date
        })
        state.calendarInfo = calendarInfo
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
      })
    })
}
function signIn() {
  // 签到
  memberService
    .signLn()
    .then((res) => {
      uni.showToast({
        title: '签到成功',
        icon: 'none',
        mask: true,
        success() {
          setTimeout(() => {
            // 重新调用会员接口，进行积分变动
            getMemberInfo()
            // 重新调用签到接口，渲染日历
            getSignLog()
            // 获得签到相关信息
            getSignInfo()
          }, 2000)
        },
      })
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        mask: true,
      })
    })
  state.whetherSignIn = true
}
function getSignInfo() {
  // 获得签到相关信息
  memberService
    .getSignInfo()
    .then((res) => {
      state.getSignInfo = res
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
      })
    })
}
function monthChange(e) {
  /**
   * 月份变化
   * 如果changeType为last代表翻到上一月
   * 如果changeType为next代表翻到下一月
   */
  const changeType = e.target.dataset.changeType
  if (changeType === 'last') {
    // 翻到上一月
    dateCompute('last')
  } else {
    // 翻到下一月
    dateCompute('next')
  }
  // 重绘日历
  getCalendar()
  // 获得该月签到信息
  getSignLog()
}
function dateCompute(type) {
  // 日期计算
  let newYear, newMonth
  if (type === 'last') {
    if (parseInt(state.month) === 1) {
      newYear = state.year - 1
      newMonth = 12
    } else {
      newYear = state.year
      newMonth = state.month - 1
    }
  } else {
    if (parseInt(state.month) === 12) {
      newYear = state.year + 1
      newMonth = 1
    } else {
      newYear = state.year
      newMonth = state.month + 1
    }
  }
  state.year = newYear
  state.month = newMonth
}
function getCalendar() {
  /**
   * 绘制日历calendarInfo
   * 一年有12月
   * 31天月份：1,3,5,7,8,10,12
   * 2月平年28天，闰年29天
   * 其余月份30天
   * 能被4整除且不能被100整除的为闰年
   */

  // 计算当前是否是闰年
  const isLeapYear = state.year % 4 === 0 && state.year % 100 !== 0
  // 获得当年月份的天数
  const feb = isLeapYear ? 29 : 28
  const monthDateNum = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  // 获得当前月份一号周几
  let day = new Date(`${state.year}/${state.month}/1`).getDay()
  // 第一周，一号周几前补空格
  if (day === 0) {
    day = 7
  }
  const calendarInfo = []
  for (let i = day; i > 1; --i) {
    calendarInfo.push({
      year: '',
      month: '',
      date: '',
      isTag: false,
    })
  }
  // 依据月份天数填充后面天数
  monthDateNum.forEach((num, index) => {
    if (index + 1 === state.month) {
      for (let i = 1; i <= num; i++) {
        calendarInfo.push({
          year: state.year,
          month: state.month,
          date: i,
          isTag: false,
        })
      }
    }
  })

  // 绘制日历
  state.calendarInfo = calendarInfo
}
function configGetSignTextCustomize() {
  memberService
    .configGetSignTextCustomize()
    .then((resObj) => {
      state.signTextCustomize = resObj || ''
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
      })
    })
}
onLoad(function (options) {
  getYearMonth()
  getCalendar()
  getMemberInfo()
  getSignInfo()
  getSignLog()
  configGetSignTextCustomize()
})
onReady(function () {})
onShow(function () {})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {})
</script>
<style scoped>
page {
  background: #f7f8fb;
  padding-bottom: 120rpx;
}
.header {
  background: white;
}
.header .personal-msg {
  display: flex;
  width: 90%;
  margin: 0 auto;
  padding: 40rpx 0;
}
.header .personal-msg image {
  flex-grow: 1;
  width: 154rpx;
  height: 154rpx;
}
.header .personal-msg view {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.header .personal-msg view text:first-of-type {
  font-size: 34rpx;
}
.header .personal-msg view text:last-of-type {
  font-size: 30rpx;
  margin-top: 20rpx;
}
.header .personal-msg .button-area {
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
}
.header .personal-msg button {
  height: 44rpx;
  width: 154rpx;
  font-size: 24rpx;
  color: black;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header .score-button {
  display: flex;
  justify-content: space-between;
  padding: 30rpx 0;
  border-bottom: 2rpx solid #f1f1f1;
}
.header .score-button .my-sign {
  display: flex;
  margin-left: 5%;
}
.header .score-button .my-sign image {
  width: 40rpx;
  height: 40rpx;
  margin-right: 30rpx;
}
.header .score-button .my-sign text {
  font-size: 30rpx;
}
.header .score-button .score-exchange {
  display: flex;
  margin-right: 5%;
}
.header .score-button .score-exchange image {
  width: 40rpx;
  height: 40rpx;
  margin-right: 30rpx;
}
.header .score-button .score-exchange text {
  font-size: 30rpx;
}
.header .score-desc {
  width: 100%;
  height: 184rpx;
  margin: 8rpx auto 0;
  display: flex;
  padding: 10rpx 0;
}
.header .score-desc view {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.header .score-desc view text {
  font-size: 24rpx;
}
.header .score-desc view text:first-of-type {
  margin-bottom: 20rpx;
  font-size: 48rpx;
  color: #5e4e92;
}
.description {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  font-size: 30rpx;
  padding: 40rpx 0;
}
.description text:first-of-type {
  margin-bottom: 10rpx;
}
.calendar {
  width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 10rpx;
  padding-top: 20rpx;
  margin-top: 8rpx;
}
.calendar .header {
  height: 100rpx;
  border-radius: 10rpx;
  display: flex;
  padding: 0 5%;
  justify-content: space-between;
  align-items: center;
  font-size: 36rpx;
}
.calendar .header .button {
  /* background: #C5A55C; */
  width: 90rpx;
  height: 58rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15rpx;
  color: #b8becc;
}
.calendar .content {
  padding: 20rpx;
}
.calendar .content .week {
  height: 80rpx;
  display: flex;
  /* justify-content: space-between; */
  padding: 0 30rpx 0;
}
.calendar .content .week text {
  width: calc((100% - 126rpx) / 7);
  height: 80rpx;
  margin: 0 9rpx;
  /* box-shadow: 0 0 2rpx #eee; */
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.calendar .content .date {
  /* padding-bottom: 20rpx; */
  display: flex;
  flex-wrap: wrap;
  padding: 0 30rpx 20rpx;
}
.calendar .content .date view {
  height: 80rpx;
  /* width: 78rpx; */
  width: calc((100% - 126rpx) / 7);
  /* box-shadow: 0 0 2rpx #eee; */
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40rpx 9rpx;
  border-radius: 50%;
}
.sign-background {
  background-color: #eceafb;
  /* background: url(https://gomore-wxmall.oss-cn-shanghai.aliyuncs.com/miniapp/hangzhouwanke/mbr/sign/icon-signed.png) no-repeat left bottom; */
  /* background-size: 50rpx 50rpx; */
}
.button-area {
  width: 100%;
}
.button-area .theme-background {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #e23333;
  height: 110rpx;
  color: #fff;
  font-size: 34rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
}
</style>
