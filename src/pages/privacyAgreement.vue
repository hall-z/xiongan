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

<script setup lang="ts">
import { ref } from 'vue'

import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import useIndex from '@/pages/index/utils/useIndex'

const { sendGetThirdPartyId, thirdPartyId } = useIndex()
const { userInfo } = storeToRefs(useUserStore())
const loading = ref(true)
const data = ref({})
const src = ref(
  'https://ykt.xionganbc.com/card-gather/app/pages/privacyAgreement/privacyAgreement?code=XXX',
)

onLoad(async (e) => {
  uni.showLoading({
    title: '加载中',
  })

  await sendGetThirdPartyId()

  src.value = src.value.replace('XXX', thirdPartyId.value)

  if (e.data) {
    data.value = JSON.parse(e.data)
    src.value = src.value + '&bank=' + data.value.bank
  }

  console.log('src.value--------------', src.value)
  loading.value = false
  uni.hideLoading()
})
</script>

<template>
  <dy-navbar leftTitle="采集服务" left isNavShow color="#000"></dy-navbar>
  <web-view v-if="!loading" :src="src"></web-view>
</template>

<style lang="scss" scoped></style>
