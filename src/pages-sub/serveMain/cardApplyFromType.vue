<route lang="json5" type="page">
{
  layout: 'default',
  // needLogin: true,
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
import CardApplyFrom from './components/cardApplyFrom.vue'
import CardBhkFrom from './components/cardBhkFrom.vue'
import CardJuven from './components/CardJuven.vue'
import CardJuvenBhk from './components/CardJuvenBhk.vue'

const navTitle = ref('')
const baseCon = ref('')
onLoad((options) => {
  console.log('🌯=======>>>>[options]:', options)
  baseCon.value = options.base
  navTitle.value = decodeURIComponent(options.title)
})

const handleBack = (e) => {
  uni.showModal({
    title: '提示',
    content: '确定要返回吗？未保存的数据将丢失',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack() // 用户确认后手动返回
      }
    },
  })
}
</script>

<template>
  <view class="h-100vh">
    <dy-navbar
      :leftTitle="navTitle"
      :back="false"
      center
      customClass="nav_bg"
      @back="handleBack"
    ></dy-navbar>

    <!-- 社保卡申领 -->
    <Card-ApplyFrom v-if="baseCon === 'shebaoksl'" />
    <!-- 补卡换卡 -->
    <Card-BhkFrom v-if="baseCon === 'shebaokbh'" />
    <!--未成年人申领 -->
    <Card-Juven v-if="baseCon === 'xinshenersl'" />
    <!--未成年人补换 -->
    <Card-JuvenBhk v-if="baseCon === 'xinshenerbh'" />
  </view>
</template>

<style lang="scss" scoped></style>
