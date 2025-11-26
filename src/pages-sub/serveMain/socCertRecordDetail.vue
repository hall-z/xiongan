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
import { dataDesensitization } from '@/utils'
import dayjs from 'dayjs'
import { CERT_STATE } from './hooks/useSocCert'
// const toast = useToast()

const navTitle = ref('认证详情')

// const idCardNum = ref('')
// const recordId = ref('')

const recordDetail = ref({
  name: '-',
  idCardNumTm: '-',
  certDate: '-',
  id: '-',
})

onLoad((options) => {
  recordDetail.value.name = decodeURIComponent(options.name)
  recordDetail.value.idCardNumTm = decodeURIComponent(options.idCardNumTm)
  recordDetail.value.id = decodeURIComponent(options.recordId)
  recordDetail.value.certDate = decodeURIComponent(options.idDate)
})
</script>

<template>
  <view class="h-100vh box-border pt-40rpx dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <view class="pr-32rpx pb-40rpx pl-32rpx">
      <view class="p-36rpx rounded-20rpx bg-#fff">
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">认证结果</text>
          <text class="text-right color-#19a52b">
            {{ CERT_STATE['state_1'] }}
          </text>
          <!-- <text class="text-right color-#e13232" v-else>
            {{ CERT_STATE['state_' + recordDetail.state] }}
          </text> -->
        </view>
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">姓名</text>
          <text class="text-right color-#000">
            {{ dataDesensitization(recordDetail.name, false, 'userName') }}
          </text>
        </view>
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">身份证号</text>
          <text class="text-right color-#000">{{ recordDetail.idCardNumTm }}</text>
        </view>
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">认证时间</text>
          <text class="text-right color-#000">
            {{ dayjs(recordDetail.certDate).format('YYYY-MM-DD HH:mm:ss') }}
          </text>
        </view>
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">认证记录编号</text>
          <text class="text-right color-#000">{{ recordDetail.id }}</text>
        </view>
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">识别方法</text>
          <text class="text-right color-#000">人脸识别</text>
          <!-- <text class="text-right color-#000">{{ recordDetail.certMethod }}</text> -->
        </view>
        <view class="flex justify-between lh-76rpx font-size-27rpx">
          <text class="w-200rpx color-#777">认证服务提供方</text>
          <!-- <text class="text-right color-#000">{{ recordDetail.certProvider }}</text> -->
          <text class="text-right color-#000">雄安一卡通</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
