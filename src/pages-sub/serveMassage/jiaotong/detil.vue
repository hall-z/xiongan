<route lang="json5" type="home">
{
  layout: 'default',
  needLogin: true,
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
const url = ref('https://oss.xay.xacloudy.cn/images/2024-10/b2e11e7e-97ef-4e95-bca6-6bdfcb96f3a6chongzhijiaofei.jpg')
</script>

<template>
  <view class="min-h-100vh">
    <dy-navbar leftTitle="" left isNavShow :placeholder="false" color="#000"></dy-navbar>
    <image :src="url" mode="widthFix" class="w-100% h-100%" lazy-load></image>
  </view>
</template>
