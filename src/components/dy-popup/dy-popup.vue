<script setup lang="ts">
import store, { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
const { showGlobalDialog } = storeToRefs(useUserStore())
const authStore = useUserStore(store)
const topbgBase64 = ref(
  'https://oss.xay.xacloudy.cn/images/2024-12/1c5dba94-a6a9-416b-8cfd-841b7b02f37e%E6%9C%AA%E6%A0%87%E9%A2%98-2.png',
)
const tips2 = ref(
  'https://oss.xay.xacloudy.cn/images/2024-12/1a3e56a9-dfe4-44fc-ab82-b9d57fed5b57777.png',
)

const handleClose = () => {
  authStore.setShowGlobalDialog(false, { showTps: 2 })
}
const loginRoute = '/pages/login/index'
const feaceRouter = '/pages/login/loginsmrz'
const handSure = () => {
  const { url, flog } = authStore.showGlobalDialogData

  const router = feaceRouter
  const redirectRoute = `${router}?redirect=${encodeURIComponent(url)}`
  uni.navigateTo({ url: redirectRoute })
  authStore.setShowGlobalDialog(false, { showTps: 2 })
}
</script>
<template>
  <page-meta :page-style="`overflow:${showGlobalDialog ? 'hidden' : 'visible'};`"></page-meta>

  <wd-popup
    v-model="showGlobalDialog"
    custom-style="border-radius: 10px;"
    @close="handleClose"
    :safe-area-inset-bottom="true"
    :z-index="9999"
  >
    <view class="bg-transparent rounded-10px overflow-hidden w-320px">
      <view
        class="h-180px relative bg-no-repeat bg-#4178FC"
        :style="` background-image: url(${topbgBase64});background-size: cover`"
      >
        <view class="text-center color-#fff text-18px font-600 py-15px">身份认证</view>
        <view class="px-20px mt-30px">
          <text
            class="text-18px line-height-32px color-#fff"
            v-if="authStore.showGlobalDialogData?.showTps == 1"
          >
            完成实名认证后 \n 将享受更多服务
          </text>
          <text class="text-18px line-height-32px color-#fff" v-else>
            需要完善实名信息 \n 才能继续操作
          </text>
        </view>
        <view class="absolute bottom-10px right-10px">
          <wd-img :src="tips2" width="133px" height="110px"></wd-img>
        </view>
        <view class="absolute top-15px right-15px">
          <wd-icon name="close" size="22px" color="#fff" @click="handleClose"></wd-icon>
        </view>
      </view>
      <view class="px-30px pt-20px pb-5px box-border bg-#fff">
        <view class="my-10px">
          <wd-button block @click="handSure">立即认证</wd-button>
        </view>
        <view class="my-10px">
          <wd-button block type="text" custom-class="color-#000! opacity-50" @click="handleClose">
            暂不认证
          </wd-button>
        </view>
      </view>
    </view>
  </wd-popup>
</template>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>
<style lang="scss" scoped>
:deep(.wd-icon),
:deep(.wd-popup__close),
:deep(.wd-icon-add) {
  color: #fff !important;
}
</style>
