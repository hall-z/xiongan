<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
      showBackButton: 'false',
    },
  },
}
</route>

<script lang="ts" setup>
import { getSignParam, getSignValid } from '@/service/api/cardServe'
import { useUserStore } from '@/store'
import { useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
import { useMessage } from 'wot-design-uni'
onMounted(async () => {
  sendSignValidFun()
})
const message = useMessage()
const webUrl = ref('')
const { userInfo } = storeToRefs(useUserStore())

// 查卡

const { send: sendSignValid, loading: LoadingValid } = useRequest((data) => getSignValid(data), {
  immediate: false,
  loading: false,
})

const sendSignValidFun = async () => {
  const params = {
    channelNo: '1331000204', // 前端可不传
    signNo: '', // 渠道号
    aac002: userInfo.value.idCardNumber,
    aac003: userInfo.value.cardName,
    aab301: '',
    isWeb: '1', // 默认1
    isWebView: '',
    isIndep: '',
    aac067: '',
    openId: '',
    isAuthFace: '',
    isChannelScan: '',
    bankMsg: '',
    operatingSystemVersion: '',
    equipmentNumber: '',
    uuid: '',
    devicMAC: '',
    netReach: '',
    root: '',
    type: 'main', // main：申领   cardInfo：电子社保卡首页   paymentCode：二维码
  }
  const data: any = await sendSignValid(params)
  console.log('🌮[data]:', data.data)
  if (!data.data.canSignFlag) {
    message
      .alert({
        msg: data.data.canNotSignMsg,
        title: '提示',
      })
      .then(() => {
        uni.navigateBack()
      })
  } else if (data.data.canSignFlag) {
    getSignValidH5(data.data)
  }
}

// 社保卡展示链接
const { send: sendSignParam, loading: LoadingParams } = useRequest((data) => getSignParam(data), {
  immediate: false,
  loading: false,
})

const getSignValidH5 = async (data) => {
  let params = {}
  if (data.signFlag === '1') {
    // 获取
    params = {
      channelNo: '1331000204', // 前端可不传
      signNo: data.signNo, // 渠道号
      aac002: userInfo.value.idCardNumber,
      aac003: userInfo.value.cardName,
      aab301: '',
      isWeb: '1', // 默认1
      isWebView: '',
      isIndep: '',
      aac067: '',
      openId: '',
      isAuthFace: '',
      isChannelScan: '',
      bankMsg: '',
      operatingSystemVersion: '',
      equipmentNumber: '',
      uuid: '',
      devicMAC: '',
      netReach: '',
      root: '',
      type: 'paymentCode',
      returlUrl: '/page/index/index',
    }
  } else {
    // 申领
    params = {
      channelNo: '1331000204', // 前端可不传
      signNo: '', // 渠道号
      aac002: userInfo.value.idCardNumber,
      aac003: userInfo.value.cardName,
      aab301: '',
      isWeb: '1', // 默认1
      isWebView: '',
      isIndep: '',
      aac067: '',
      openId: '',
      isAuthFace: '',
      isChannelScan: '',
      bankMsg: '',
      operatingSystemVersion: '',
      equipmentNumber: '',
      uuid: '',
      devicMAC: '',
      netReach: '',
      root: '',
      type: 'main',
    }
  }
  try {
    const rData: any = await sendSignParam(params)
    webUrl.value = rData.data
  } catch (error) {
    console.log('🍏[error]:', error)
  }
}
</script>

<template>
  <web-view :src="webUrl"></web-view>
</template>

<style>
page {
  background: #f7f7f7;
}
</style>
<style lang="scss" scoped></style>
