<route lang="json5" type="page">
{
  layout: 'default',
  needLoginPages: true,
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
import { Constant } from '@/enums/constant'
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { useUserStore } from '@/store/user'
import { routeTo } from '@/utils'
import { Modal } from '@/utils/uniapi/prompt'
import { storeToRefs } from 'pinia'
import qs from 'qs'
import { useMessage } from 'wot-design-uni'

const message = useMessage()
const { isLogined, userInfo } = storeToRefs(useUserStore())

const urlData = ref()
onLoad(async (options) => {
  console.log('🍥[options]:', options)
  const loginRoute = '/pages/login/index'
  if (!isLogined.value) {
    Modal({
      title: '提示',
      content: '您还没有登录,请先登录？',
      showCancel: true,
    }).then((res: any) => {
      if (res.confirm) {
        // 重定向
        const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent('/page/pay/scanResult')}`
        uni.navigateTo({ url: redirectRoute })
      } else {
        routeTo({ url: '/pages/index/index', navType: NAVIGATE_TYPE.SWITCH_TAB })
      }
    })
  } else {
    urlData.value = qs.parse(decodeURIComponent(options.url) || options.url)
    console.log('🌽[ urlData.value]:', urlData.value)
    if (
      urlData.value.actionType === Constant.QR_CODE_CARD ||
      options.actionType === Constant.QR_CODE_CARD
    ) {
      routeTo({
        url: '/pages-sub/userManager/codeServe/cardResut',
        data: { url: qs.stringify(urlData.value) },
        navType: NAVIGATE_TYPE.REDIRECT_TO,
      })
    } else if (urlData.value.type === Constant.QR_CODE_OFF) {
      routeTo({
        url: '/pages-sub/marketManager/coupon/writeOffCoup',
        data: { url: qs.stringify(urlData.value) },
        navType: NAVIGATE_TYPE.REDIRECT_TO,
      })
    } else {
      routeTo({
        url: '/pages/pay/index',
        data: { url: qs.stringify(urlData.value) },
        navType: NAVIGATE_TYPE.REDIRECT_TO,
      })
    }
  }
})
onLaunch((options) => {
  console.log(options)
})
</script>
<template>
  <dy-navbar leftTitle="页面加载中..." left></dy-navbar>
</template>
