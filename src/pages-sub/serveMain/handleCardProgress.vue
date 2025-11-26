<route lang="json5" type="page">
{
  layout: 'default',
  realNameAuthentication: true,
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

<script lang="ts" setup>
import {
  getCardPaymentInfo,
  getCardScheduleInfo,
  getSmsAndStationProgress,
  getsmsCardProgress,
} from '@/service/api/cardServe'
import { dataDesensitization } from '@/utils'
import dayjs from 'dayjs'
import useCardpress from './hooks/useCardpress'

const { sendCardMail } = useCardpress()
const baseInfo: any = ref({})
const navTitle = ref('制卡进度查询')
const phone = ref('')
const wdName = ref('')
const btnloading = ref(false)
const sendsms = ref(false)
const type = ref('')
const sms = ref(false)

const cardBgImg = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/d91897c6-b0a0-4db3-9e3e-461d6166f42ecardBgImg.png',
)

const isAudit = ref(false)
const scheduleList = ref([])
const processing = ref('')

const cardInfo = ref([
  {
    zkjd: '待审核',
    date: '',
    shyy: '',
    wdName: '',
    lqqd: '',
  },
  {
    zkjd: '已审核，正在制卡',
    date: '',
    shyy: '',
    wdName: '',
    lqqd: '',
  },
  {
    zkjd: '制卡完成',
    date: '',
    shyy: '',
    wdName: '',
    lqqd: '',
  },
])
const len = ref(0)
const getCardInfo = async () => {
  const params = {
    xm: baseInfo.value.xm,
    zjhm: baseInfo.value.zjhm,
  }
  try {
    const res: any = await getCardScheduleInfo(params)
    // const res: any = {
    //   data: [
    //     {
    //       date: '20250829',
    //       shyy: '',
    //       zkjd: '待审核',
    //     },
    //     {
    //       date: '20250831',
    //       shyy: '',
    //       zkjd: '已审核,正在制卡',
    //     },
    //   ]
    // }
    if (res.data) {
      sendsms.value = true
      const data = res.data
      len.value = data.length

      cardInfo.value.forEach((item, index) => {
        const _item = data[index]
        if (_item) {
          if (_item.zkjd === '审核未通过') {
            isAudit.value = true
            scheduleList.value = [
              {
                zkjd: '审核未通过',
                shyy: _item.shyy,
                date: _item.date,
              },
            ]
          } else {
            cardInfo.value[index] = _item
          }
        }
      })

      if (len.value > 0) {
        processing.value = data[data.length - 1].zkjd

        console.log(' processing.value ----------', data[data.length - 1])
        if (data[data.length - 1].zkjd !== '制卡完成') {
          sms.value = isMoreThanTwoDays(data[data.length - 1].date)
        } else {
          sms.value = false
        }
      } else {
        sms.value = false
      }
    }
  } catch (error) {
    sendsms.value = false
    console.log('error', error)
  }
}

function isMoreThanTwoDays(inputDate) {
  // 获取当前日期
  const currentDate = new Date()

  // 解析输入日期（yyyymmdd格式）
  const year = parseInt(inputDate.substring(0, 4))
  const month = parseInt(inputDate.substring(4, 6)) - 1
  const day = parseInt(inputDate.substring(6, 8))
  const targetDate = new Date(year, month, day)

  // 计算时间差（毫秒）
  const timeDiff = currentDate - targetDate

  // 转换为天数（1天=86400000毫秒）
  const dayDiff = timeDiff / (1000 * 60 * 60 * 24)

  // 返回比较结果

  console.log('dayDiff----------', dayDiff)
  return dayDiff > 2
}

const phonecall = (phone) => {
  uni.makePhoneCall({
    phoneNumber: phone,
  })
}

const gocuiban = async () => {
  btnloading.value = true
  if (processing.value === '待审核') {
    await getsmsCardProgress({
      cardName: baseInfo.value.xm,
      processingNode: processing.value,
      wdName: wdName.value,
    })
      .then((res) => {
        if (res.code === '200') {
          uni.showToast({ title: '催办成功', icon: 'success' })
        } else {
          uni.showToast({ title: res.msg, icon: 'none' })
        }
        btnloading.value = false
      })
      .catch((err) => {
        console.log('err', err)
        btnloading.value = false
        // uni.showToast({title: err.data.msg, icon: 'none'})
      })
  } else if (processing.value === '已审核,正在制卡') {
    await getSmsAndStationProgress({
      cardName: baseInfo.value.xm,
      processingNode: processing.value,
      wdName: wdName.value,
    })
      .then((res) => {
        if (res.code === '200') {
          uni.showToast({ title: '催办成功', icon: 'success' })
        } else {
          uni.showToast({ title: res.msg, icon: 'none' })
        }
        btnloading.value = false
      })
      .catch((err) => {
        console.log('err', err)
        btnloading.value = false
        // uni.showToast({title: err.data.msg, icon: 'none'})
      })
  }
  btnloading.value = false
}

// 邮寄进度
const getCardMailInfo = async () => {
  scheduleList.value = []
  try {
    const params = {
      xm: baseInfo.value.xm,
      zjhm: baseInfo.value.zjhm,
    }
    // const res: any = await sendCardMail(params)
    const res: any = await getCardPaymentInfo(params)

    if (res.data) {
      type.value = res.data.lqqd
    }

    if (res.data && res.data.wdPhone) {
      phone.value = res.data.wdPhone
    }

    if (res.data && res.data.wdName) {
      wdName.value = res.data.wdName
    }

    cardInfo.value.forEach((item) => {
      const data = res.data

      if (item.zkjd === '已审核,正在制卡') {
        item.wdName = data.wdName
        item.lqqd = data.lqqd
      }
      scheduleList.value.push(item)
    })
  } catch (error) {
    console.log('error', error)
    scheduleList.value = cardInfo.value
  }
}

const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}
onLoad((options: any) => {
  baseInfo.value = options
  baseInfo.value.xm = decodeURIComponent(baseInfo.value.xm)
})
onMounted(async () => {
  await getCardInfo()
  // await getCardMailInfo()
  if (!isAudit.value) {
    await getCardMailInfo()
  }
})
</script>
<template>
  <view class="h-100vh box-border dy-blue-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <view class="cardInfo">
      <view class="textInfo">
        <view class="cardName">{{ dataDesensitization(baseInfo.xm, false, 'userName') }}</view>
        <view class="cardNumber">{{ dataDesensitization(baseInfo.zjhm, false, 'right') }}</view>
      </view>
      <view
        class="cardImg"
        :style="`background-image: url(${cardBgImg});background-size:100% 100%`"
      ></view>
    </view>
    <view class="viewCon" v-if="sendsms">
      <view class="scheduleCon">
        <view
          class="scheduleItem"
          :class="{ defaultItem: index + 1 > len, redItem: item.zkjd === '审核未通过' }"
          v-for="(item, index) in scheduleList"
          :key="index"
        >
          <view class="scheduleMain">
            <view class="scheduleIcon"></view>
            <view class="scheduleName">{{ item.zkjd }}</view>
            <view class="scheduleInfo" v-if="item.wdName">
              <text class="infoLabel">网点名称：</text>
              <text class="infoVal">{{ item.wdName }}</text>
            </view>
            <view class="scheduleInfo" v-if="item.lqqd">
              <text class="infoLabel">领取渠道：</text>
              <text class="infoVal">{{ item.lqqd }}</text>
            </view>
            <view class="scheduleInfo" v-if="item.zkjd === '审核未通过' && item.shyy">
              <text class="infoLabel">原因：</text>
              <text class="infoVal">{{ item.shyy }}</text>
            </view>
            <view class="scheduleInfo" v-if="item.date">
              <text class="infoLabel">更新时间：</text>
              <text class="infoVal">
                {{ dayjs(item.date).format('YYYY-MM-DD') }}
              </text>
            </view>
          </view>
        </view>
        <view v-if="processing === '制卡完成'" class="tips">
          <view v-if="type === '线下领取'">
            您申请的雄安一卡通社保卡已制卡完成请您携带有效证件到办理网点领取!
          </view>
          <view v-if="type !== '线下领取'">
            您申请的雄安一卡通社保卡已制卡完成请您注意查收快递!
          </view>
        </view>
      </view>
    </view>

    <view class="bottomBtn" v-if="(!sendsms && phone == '') || isAudit">
      <wd-button type="primary" :round="false" size="medium" block @click="goHome">
        返回首页
      </wd-button>
    </view>

    <view class="bottomBtn FHcs">
      <wd-button
        v-if="sendsms && processing !== '制卡完成' && !isAudit && sms"
        type="primary"
        :round="false"
        size="medium"
        @click="gocuiban('phone')"
        custom-class="custom-btn1 F1"
        :loading="btnloading"
      >
        我要催办
      </wd-button>
      <wd-button
        v-if="phone !== ''"
        type="primary"
        plain
        hairline
        :round="false"
        size="medium"
        icon="call"
        @click="phonecall(phone)"
        custom-class="custom-btn2 F1"
      >
        咨询网点
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cardInfo {
  position: relative;
  padding: 20px 30px 18px 30px;

  .textInfo {
    position: relative;
    z-index: 10;

    .cardName {
      font-size: 30px;
      font-weight: 600;
      line-height: 42px;
      color: #2d69ef;
    }

    .cardNumber {
      margin-top: 4px;
      font-size: 18px;
      line-height: 24px;
      color: #859ed4;
    }
  }

  .cardImg {
    position: absolute;
    top: -11px;
    right: 30px;
    z-index: 1;
    width: 119px;
    height: 119px;
  }
}

.viewCon {
  box-sizing: border-box;
  height: calc(100vh - 200px);
  padding: 35px 30px 80px 30px;
  background: #ffffff;
  border-radius: 15px 15px 0px 0px;
}

.scheduleCon {
  height: 100%;
  overflow: auto;
}

.tips {
  margin-top: 30px;
  font-size: 14px;
  line-height: 22px;
  color: #2d69ef;
}

.scheduleItem {
  position: relative;
  z-index: 10;
  padding-left: 7px;

  &::before {
    position: absolute;
    top: 10px;
    bottom: 0;
    left: 7px;
    width: 2px;
    content: ' ';
    border-left: 1px dashed #b0b0b0;
  }

  .scheduleMain {
    position: relative;
    z-index: 20;
    padding: 0 0 26px 22px;
  }

  .scheduleIcon {
    position: absolute;
    top: 2px;
    left: -7px;
    width: 15px;
    height: 15px;
    background: rgba(45, 105, 239, 0.18);
    border-radius: 50%;

    &::before {
      position: absolute;
      top: 4px;
      left: 4px;
      width: 7px;
      height: 7px;
      content: ' ';
      background: #2d69ef;
      border-radius: 50%;
    }
  }

  .scheduleName {
    position: relative;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #2d69ef;
  }

  .scheduleInfo {
    display: flex;
    margin-top: 8px;
    font-size: 12px;
    line-height: 20px;
    color: #999;

    .infoLabel {
      width: 60px;
      text-align: right;
    }

    .infoVal {
      flex: 1;
    }
  }
}

.redItem {
  .scheduleIcon {
    background: rgba(255, 0, 0, 0.18);

    &::before {
      background: #ff0000;
    }
  }

  .scheduleName {
    color: #ff0000;
  }
}

.defaultItem {
  .scheduleIcon {
    background: rgba(153, 153, 153, 0.18);

    &::before {
      background: #999;
    }
  }

  .scheduleName {
    color: #999;
  }
}

.bottomBtn {
  position: fixed;
  right: 11px;
  bottom: 24px;
  left: 11px;

  :deep(.wd-button) {
    height: 40px;
    margin: 0 11px;
  }
}
</style>
