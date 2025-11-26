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
import CardMessg from './components/CardMessg.vue'

const navTitle = ref('')
const baseCon = ref('')

onLoad((options: any) => {
  baseCon.value = options.base
  navTitle.value = decodeURIComponent(options.title)
})
</script>

<template>
  <view class="min-h-100vh bg-#F3F4F6">
    <dy-navbar :leftTitle="navTitle" center customClass="nav_bg"></dy-navbar>

    <!-- <dy-title :title="navTitle" customClass="custom-title"></dy-title> -->

    <!--卡基本信息 -->
    <Card-Messg v-if="baseCon === 'cardBaseInfo'" />
  </view>
</template>

<style lang="scss" scoped></style>
