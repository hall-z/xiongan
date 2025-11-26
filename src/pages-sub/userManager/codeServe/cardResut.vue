<route lang="json5" type="page">
{
  layout: 'default',
  realNameAuthentication: true,
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      defaultTitle: '',
      titlePenetrate: 'NO',
      backButtonIcon: null,
    },
  },
}
</route>

<script lang="ts" setup>
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import qs from 'qs'
import { useMessage } from 'wot-design-uni'
import useCodeServe from './utils/useCodeServe'
const { sendAllCodeInfo, allCodeInfo } = useCodeServe()
const userStore = useUserStore()

const message = useMessage()
interface UrlData {
  qrCode: string
  socialCard: string
}
const urlData = ref()
onLoad(async (options) => {
  console.log('🍊[options]:', options)
  urlData.value = qs.parse(decodeURIComponent(options.url) || options.url)
  try {
    await sendAllCodeInfo({
      qrCode: urlData.value.qrCode,
      scanCode: urlData.value.socialCard,
    })
  } catch (error) {
    message
      .alert({
        msg: '查询数据异常!',
        title: '提示',
        closeOnClickModal: false,
      })
      .then((res) => {
        routeTo({ url: '/pages/index/index', navType: NAVIGATE_TYPE.SWITCH_TAB })
      })
  }

  // 获取到进入页面的所有信息
})
</script>

<template>
  <dy-navbar leftTitle="社保卡扫码结果" left isNavShow color="#000"></dy-navbar>
  <view class="p-20px">
    {{ allCodeInfo!.data }}
  </view>
</template>

<style lang="scss" scoped></style>
