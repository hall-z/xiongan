<route lang="json5" type="page">
{
  layout: 'default',
  realNameAuthentication: true,
  style: {
    navigationBarTitleText: '条形码',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  },
}
</route>

<script lang="ts" setup>
const show = ref(true)
const opts = ref({
  lineColor: '#000000',
  fontSize: 20,
  width: 2,
  textMargin: 0,
  text: '121',
  value: '1212',
  displayValue: false,
  orientation: 'vertical', // 生成横向条形码
})

const barcodeBack = () => {
  uni.navigateBack()
}
onLoad((options) => {
  opts.value.text = options.text
  opts.value.value = options.value
})
</script>

<template>
  <!-- 横屏显示 -->
  <view class="w-100vw h-100vh fixed top-0 left-0 right-0 z-99999" v-if="show" @click="barcodeBack">
    <view class="size-full flex flex-col justify-center items-center bg-#fff relative z-99">
      <view>
        <dy-barcode :width="636" :option="opts"></dy-barcode>
        <view class="color-#999 text-14px mt-[-5px] text-center">
          {{ opts.value }}
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
