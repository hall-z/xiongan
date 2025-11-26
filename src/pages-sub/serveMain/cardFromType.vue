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
import CardChange from '@/pages-sub/serveMain/components/CardChange.vue'
import CardLoss from '@/pages-sub/serveMain/components/CardLoss.vue'
import ChangePwd from '@/pages-sub/serveMain/components/ChangePwd.vue'
import CardProgressInQuiry from './components/CardProgressInQuiry.vue'
import CardSocActive from './components/CardSocActive.vue'
import ServePassRest from './components/ServePassRest.vue'
import UnboxingInfo from './components/UnboxingInfo.vue'

const navTitle = ref('')
const baseCon = ref('')

onLoad((options: any) => {
  console.log('🌯[options]:', options)
  baseCon.value = options.base
  navTitle.value = decodeURIComponent(options.title)
})
</script>

<template>
  <view class="min-h-100vh pt-40rpx dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" :customClass="'bgCard'" center color="#000"></dy-navbar>

    <!-- <dy-title :title="navTitle" customClass="custom-title"></dy-title> -->
    <view class="h-100%">
      <!-- 动态加载类型对应的组件 -->
      <!--  卡进度查询-->
      <Card-ProgressInQuiry v-if="baseCon === 'kajindu'" />

      <!-- 卡信息变更 -->
      <Card-Change v-if="baseCon === 'cardChange'" />

      <!-- 服务密码重置 -->
      <Serve-PassRest v-if="baseCon === 'servepassreset'" />

      <!--服务密码修改 -->
      <Change-Pwd v-if="baseCon === 'changeCardPwd'" />

      <!--社保卡挂失 -->
      <Card-Loss v-if="baseCon === 'cardLoss'" />

      <!-- 社保卡启用 -->
      <Card-SocActive v-if="baseCon === 'cardSocialActive'" />

      <!-- 社保卡解挂 -->
      <Unboxing-info v-if="baseCon === 'unboxingInfo'" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.custom-title) {
  @apply px-20px! pt-20px!;
}
</style>
