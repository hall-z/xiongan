<template>
  <view class="claimResults">
    <view class="viewCon">
      <view class="resultsInfo">
        <view class="successImg">
          <wd-img :src="successIcon" width="60" height="60"></wd-img>
        </view>
        <view class="desText1">申请已受理！</view>
        <view class="desText2">您的社保卡申领信息已成功提交</view>
      </view>
      <view class="personInfo">
        <view class="infoTitle">申请人信息摘要</view>
        <view class="infoLine">
          <view class="infoLabel">申请人</view>
          <view class="infoVal">{{ props.personName }}</view>
        </view>
        <view class="infoLine">
          <view class="infoLabel">身份证号</view>
          <view class="infoVal">{{ props.idCardNumber }}</view>
        </view>
        <!-- <view class="infoLine">
          <view class="infoLabel">申请编号</view>
          <view class="infoVal flexVal">
            <text>{{ props.batchNumber }}</text>
            <view class="copyImg" @click="copyText(props.batchNumber)">
              <wd-img :src="copyIcon" width="12" height="14"></wd-img>
            </view>
          </view>
        </view> -->
        <view class="timeTip">
          <view class="successTime">{{ formattedCurrentTime }} 申请提交成功</view>
          <view class="finishTime">预计{{ formattedSixDaysLater }}前完成审核</view>
        </view>
      </view>
      <view class="handleProgress">
        <view class="infoTitle">办理进度</view>
        <view class="progressLine">
          <view class="progressItem" v-for="(item, index) in scheduleList" :key="index">
            <view class="stepNum">
              <wd-img v-if="index === 0" :src="successIcon" width="26" height="26"></wd-img>
              <view v-else>{{ index + 1 }}</view>
            </view>
            <view class="stepName" :class="{ blueColor: index === 0 }">{{ item }}</view>
          </view>
        </view>
        <view class="finishInfo">
          <view class="finishIcon">
            <wd-img :src="waitIcon" width="12" height="14"></wd-img>
          </view>
          <text>预计5个工作日内完成审核</text>
        </view>
      </view>
    </view>
    <view class="bottomBtn">
      <wd-button type="primary" :round="false" size="medium" block @click="goHome">
        返回首页
      </wd-button>
    </view>
  </view>
</template>
<script lang="ts" setup>
import successIcon from '../../../static/images/serve/successIcon.png'
import waitIcon from '../../../static/images/serve/waitIcon.png'

const props = defineProps({
  personName: {
    type: String,
    default: '',
  },
  idCardNumber: {
    type: String,
    default: '',
  },
  batchNumber: {
    type: String,
    default: '',
  },
})

const scheduleList = ref(['申请成功', '审核中', '制卡完成'])

/**
 * 格式化日期为 yyyy-mm-dd hh:MM 形式
 * @param {Date} date - 要格式化的日期对象
 * @returns {string} 格式化后的日期时间字符串
 */
function formatDateTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，补零
  const day = String(date.getDate()).padStart(2, '0') // 日期补零
  const hours = String(date.getHours()).padStart(2, '0') // 小时补零
  const minutes = String(date.getMinutes()).padStart(2, '0') // 分钟补零

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 格式化日期为 yyyy-mm-dd 形式
 * @param {Date} date - 要格式化的日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// 获取当前时间并格式化
const currentTime = new Date()
const formattedCurrentTime = formatDateTime(currentTime)
console.log('当前时间:', formattedCurrentTime) // 例如: 2023-11-15 14:30

// 计算6天后的时间并格式化
const sixDaysLater = new Date(currentTime)
sixDaysLater.setDate(currentTime.getDate() + 6) // 增加6天
const formattedSixDaysLater = formatDate(sixDaysLater)
console.log('6天后的日期:', formattedSixDaysLater) // 例如: 2023-11-21

// 点击复制
const copyText = (text) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'none',
      })
    },
  })
}

const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}
</script>
<style lang="scss" scoped>
.claimResults {
  height: calc(100vh - 44px);
  background: linear-gradient(to bottom, #d6e8fd, #f1f2f5 30%);
}
.viewCon {
  box-sizing: border-box;
  height: calc(100vh - 108px);
  padding: 40px 15px 24px;
  overflow-y: auto;
}
.resultsInfo {
  .successImg {
    width: 60px;
    height: 60px;
    margin: 0 auto;
  }
  .desText1 {
    margin: 24px 0 4px;
    font-size: 20px;
    font-weight: 600;
    color: #000000;
    text-align: center;
  }
  .desText2 {
    font-size: 16px;
    font-weight: 400;
    color: #8d9cb0;
    text-align: center;
  }
}
.infoTitle {
  padding-left: 5px;
  margin-bottom: 18px;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}
.personInfo {
  padding: 16px 12px;
  margin: 30px 0 12px;
  background: #ffffff;
  border-radius: 5px;
  .infoLine {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    margin-bottom: 18px;
  }
  .infoLabel {
    font-size: 14px;
    color: #777777;
  }
  .infoVal {
    font-size: 14px;
    color: #000;
  }
  .flexVal {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .copyImg {
      margin-left: 6px;
    }
  }
  .timeTip {
    padding: 8px 12px 8px 36px;
    background: #f2f7fd;
    border-radius: 5px;
    .successTime {
      position: relative;
      font-size: 14px;
      line-height: 35px;
      color: #000000;
      &::after {
        position: absolute;
        top: 50%;
        left: -18px;
        display: inline-block;
        width: 7px;
        height: 7px;
        content: '';
        background: #2d69ef;
        border-radius: 4px;
        transform: translateY(-50%);
      }
    }
    .finishTime {
      font-size: 12px;
      color: #999999;
    }
  }
}
.handleProgress {
  padding: 16px 12px;
  margin: 30px 0 12px;
  background: #ffffff;
  border-radius: 5px;
  .progressLine {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 12px;
    &::after {
      position: absolute;
      top: 12px;
      right: 52px;
      left: 52px;
      z-index: 1;
      display: inline-block;
      content: '';
      border-top: 1px dashed #b8b8b8;
    }
    .stepNum {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      margin: 0 auto;
      font-size: 14px;
      color: #333333;
      background: #e8e8e8;
      border-radius: 26px;
    }
    .stepName {
      margin-top: 12px;
      font-size: 14px;
      color: #333333;
    }
    .blueColor {
      color: #2d69ef;
    }
  }
  .finishInfo {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 12px 15px;
    margin-top: 18px;
    background: #f2f7fd;
    border-radius: 5px;
    .finishIcon {
      margin-right: 10px;
    }
    text {
      font-size: 12px;
      color: #2d69ef;
    }
  }
}
.bottomBtn {
  position: fixed;
  right: 22px;
  bottom: 24px;
  left: 22px;
  :deep(.wd-button) {
    height: 40px;
  }
}
</style>
