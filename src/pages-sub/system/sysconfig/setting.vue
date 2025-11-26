<route lang="json5" type="page">
{
  needLogin: true,
  style: {
    navigationBarTitleText: '免密登录设置',
    backgroundColor: '#fff',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  },
}
</route>

<script lang="ts" setup>
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
const { noLoginRequired } = storeToRefs(useUserStore())
const { setNoLoginRequired } = useUserStore()
const value = ref('')
function handleClickLeft() {
  uni.navigateBack()
}
const date = ref('30')
const save = () => {
  uni.showToast({
    title: '修改成功',
    icon: 'none',
  })
  setNoLoginRequired(date.value)
  useTimeLogin()
}
onLoad(() => {
  date.value = noLoginRequired.value
})
</script>

<template>
  <view class="py-20px px-10px">
    <view class="bg-#fff">
      <wd-radio-group v-model="date" shape="dot" cell>
        <wd-radio value="30">30天免登录</wd-radio>
        <wd-radio value="7">7天免登录</wd-radio>
        <wd-radio value="3">3天免登录</wd-radio>
      </wd-radio-group>
    </view>
    <view class="text-14px m-10px">
      <wd-text type="error" text="* 退出后需要重新登录"></wd-text>
    </view>

    <view class="p-10px mt-20px">
      <wd-button block @click="save">修改</wd-button>
    </view>
  </view>
</template>
<style>
page {
  background: #f5f5f5;
}
</style>
<style lang="scss" scoped>
:deep(.nav_bg) {
  background-color: var(--color-nav-bg);
  .wd-navbar__title {
    color: var(--color-nav-text);
  }
  .wd-navbar__left {
    color: var(--color-nav-text);
  }
}
</style>
