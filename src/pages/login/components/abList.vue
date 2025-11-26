<script lang="ts" setup>
import anvter1 from '@/static/images/mine/anvter1.png'
import { loginListProps } from '../utils/types'
import useLogin from '../utils/useLogin'
const { userLogin } = useLogin()
const props = defineProps({
  list: {
    type: Object as PropType<loginListProps[]>,
    default: () => ({}),
  },
})
</script>
<template>
  <view class="text-center font-bold text-20px py-20px">轻触选择登录账户</view>
  <view class="w-100% mt-10px">
    <view class="px-20px">
      <view
        class="rounded-8px bg-#fff flex gap-10px my-10px p-10px"
        v-for="(item, index) in props.list"
        :key="index"
        @click="userLogin(item, 2)"
      >
        <view>
          <wd-img :width="60" :height="60" :src="anvter1" />
        </view>
        <view class="flex flex-col justify-around">
          <view class="text-16px">{{ item.userName }}</view>
          <view class="text-16px color-#999">{{ item.userPhone }}</view>
        </view>
      </view>
    </view>
  </view>
</template>
