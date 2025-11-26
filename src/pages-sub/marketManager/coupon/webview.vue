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
    },
  },
}
</route>

<script lang="ts" setup>
const state = ref('')
const title = ref('微信代金券')

onLoad(async (e) => {
  state.value = e.state
})
</script>

<template>
  <view>
    <web-view :src="'https://ykt.xionganbc.com/wxcard/?state=' + state"></web-view>
  </view>
</template>
<style lang="scss" scoped>
.bg {
  background: #feb329;
  border: 0.9px solid rgba(255, 255, 255, 0.51);
  border-radius: 1000px;
}
</style>
