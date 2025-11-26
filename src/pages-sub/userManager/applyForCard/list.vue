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
import { useMessage, useToast } from 'wot-design-uni'

import { sendApplyForCard, sendApplyForCardList } from '@/service/api/userMessage'
import dayjs from 'dayjs'
import { useUserStore } from '@/store'
import sbbhZwBg from '@/static/images/serve/sbbhZwBg.png'

const toast = useToast()
const { userInfo } = useUserStore()
const navTitle = ref('领取记录')
const socIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-09/190510a7-65ef-485b-9e15-f5aa7566267b椭圆 11572@2x.png',
)
const listShow = ref(true)

const paging = ref(null)
const planList = ref([])
const registType = ref(null)

async function queryList() {
  // 调用接口获取数据
  try {
    const data: any = await sendApplyForCardList({ userId: userInfo.userDId })

    console.log('data.content', data)
    planList.value = data
  } catch (error) {
    planList.value = []
  }
}

onShow(async (options) => {
  queryList()
})
</script>

<template>
  <view class="box-border pt-40rpx dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <!-- 列表部分 -->
    <view class="h-100%" v-show="listShow">
      <view class="pt-30rpx pl-28rpx pr-28rpx pb-20rpx rounded-t-30rpx">
        <template v-if="planList.length > 0">
          <view
            class="w-100% mb-24rpx bg-#f5f9ff rounded-10rpx"
            v-for="(item, index) in planList"
            :key="index"
          >
            <view
              class="flex justify-between items-center pt-16rpx pr-20rpx pl-36rpx pb-16rpx border-b-2rpx border-b-solid border-color-#EAEAEA"
            >
              <view class="flex items-center">
                <img :src="socIcon" alt="" class="w-10px h-10px mr-10px" />
                <text
                  class="h-48rpx lh-48rpx font-bold font-size-16px color-#000000"
                  style="display: inline-flex"
                >
                  {{ item.studentName }}
                </text>
              </view>
              <text class="color-#729eff" style="font-size: 13px">已领取书包</text>
            </view>

            <view class="flex j items-center font-size-27rpx pt-16rpx pr-20rpx pl-36rpx pb-16rpx">
              <text class="w-144rpx text-right color-#999999">领取日期：</text>
              <text class="color-#999999">
                {{ dayjs(item.sendTime).format('YYYY-MM-DD HH:mm:ss') }}
              </text>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="enableZwBox">
            <wd-img style="margin-top: 20px" width="160" height="90" :src="sbbhZwBg"></wd-img>
            <view class="zwText">您暂无领取记录</view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.enableZwBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;

  .zwText {
    margin: 8px 0px;
    color: #333333;
  }

  .goDb {
    color: #2d69ef;
    cursor: pointer;
  }
}
</style>
