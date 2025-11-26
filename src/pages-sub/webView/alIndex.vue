<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationBarTitleText: '支付',
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
const webUrl = ref('')
const webViewContext = ref(null)

onLoad((options) => {
  webViewContext.value = my.createWebViewContext('web-view-1')
  webUrl.value = options.url
})

const test = (e) => {
  console.log('🍱[e]:', e)

  webViewContext.value.postMessage({ sendToWebView: '1' })
}
</script>

<template>
  <web-view id="web-view-1" :src="webUrl" @message="test"></web-view>
</template>
