<script lang="ts" setup>
// #ifdef MP-WEIXIN
import { getShowTopGZH } from '@/service/api/source'
import logo from '@/static/images/logo.png'
import { useUserStore } from '@/store/user'
import { routeTo } from '@/utils'
import { useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
const props = defineProps({
  customStyle: {
    type: String,
    default: '',
  },
  customClass: {
    type: String,
    default: '',
  },
  gap: {
    type: Boolean,
    default: true,
  },
})
const { isLogined, userInfo } = storeToRefs(useUserStore())
const closeAdFlog = ref(true)
const closeAd = () => {
  closeAdFlog.value = false
}
const showGHZ = ref(0)
const toWxChart = () => {
  // routeTo({
  //   url: '/pages-sub/webView/index',
  //   data: {
  //     showType: 'webView',
  //     url: 'https://mp.weixin.qq.com/s?__biz=MzkyOTYzOTg3NQ==&mid=2247483688&idx=1&sn=af447ae94177b1e42fe3b9622d5cde13&chksm=c2073d84f570b492da13ec97251dfe7a4fbefb0ba238cf10001ea375cad6bf36943e9f705011#rd',
  //   },
  // })

  routeTo({
    url: '/pages-sub/webView/index',
    data: {
      type: 30772,
      showType: 'banner',
      url: '',
    },
  })
}
const { loading, send: showTopGZH } = useRequest(getShowTopGZH, {
  immediate: false,
  loading: false,
})
onShow(async () => {
  if (isLogined.value) {
    const data: any = await showTopGZH()
    console.log('🥒[data]:', data, closeAdFlog.value, data * 1 === 0 && closeAdFlog.value)
    showGHZ.value = Number(data)
  }
})
// #endif
</script>

<template>
  <!-- #ifdef MP-WEIXIN -->
  <view v-if="closeAdFlog && showGHZ * 1 === 0">
    <wd-gap height="10" bg-color="#F2F3F7" v-if="props.gap"></wd-gap>
    <view :class="props.customClass">
      <view
        class="flex justify-between items-center px-10px py-5px bd-1px_solid_#F7F7F7 relative rounded-4px gap-10px pr-30px"
      >
        <view>
          <wd-img :src="logo" height="40" width="40"></wd-img>
        </view>
        <view class="flex-1">
          <view class="text-14px">关注雄安一卡通公众号</view>
          <view class="color-#B1B1B1 text-12px mt-1px">雄安新区社会保障卡一卡通服务</view>
        </view>
        <view
          class="px-10px py-3px color-#fff text-12px bg-#2D69EF rounded-1000"
          @click="toWxChart"
        >
          立即关注
        </view>
        <view class="absolute top-3px right-3px" @click="closeAd">
          <wd-icon name="close" size="13px" color="#C6C9CA"></wd-icon>
        </view>
      </view>
    </view>
  </view>
  <!-- #endif -->
</template>

<style lang="scss" scoped></style>
