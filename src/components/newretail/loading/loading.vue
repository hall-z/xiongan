<template>
  <view class="spinner">
    <view class="rect1" :style="theme.mainBgColor"></view>
    <view class="rect2" :style="theme.mainBgColor"></view>
    <view class="rect3" :style="theme.mainBgColor"></view>
    <view class="rect4" :style="theme.mainBgColor"></view>
    <view class="rect5" :style="theme.mainBgColor"></view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const colorRgba = (sHex: string, alpha: number = 1): string => {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  let sColor = sHex.toLowerCase()

  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }

    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  }
  return sColor
}

export default defineComponent({
  name: 'Loading',
  setup() {
    const store = useStore()
    const theme = ref({
      color: '#FF9F43',
      mainColor: 'color: #FF9F43;',
      mainBgColor: 'background: #FF9F43;',
      borderColor: 'border-color: #FF9F43;',
      mainBgGradient: 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
      mainColorRgb: 'color: rgba(255,159,67, 0.4);',
      borderColorRgb: 'border-color: rgba(255,159,67, 0.4);',
      mainColorRgb02: 'rgba(255,159,67, 0.2)',
      BgColorRgb01: 'background-color: rgba(255,159,67, 0.1);',
    })

    onMounted(() => {
      const uiConfig = store.state.uiConfig
      const themeColor = uiConfig?.themeColor || '#FF9F43'

      theme.value = {
        color: themeColor,
        mainColor: `color: ${themeColor};`,
        mainBgColor: `background: ${themeColor};`,
        borderColor: `border-color: ${themeColor};`,
        mainBgGradient: `background: linear-gradient(-270deg, ${themeColor}, ${themeColor});`,
        mainColorRgb: `color: ${colorRgba(themeColor, 0.4)};`,
        borderColorRgb: `border-color: ${colorRgba(themeColor, 0.4)};`,
        mainColorRgb02: colorRgba(themeColor, 0.2),
        BgColorRgb01: `background-color: ${colorRgba(themeColor, 0.1)};`,
      }
    })

    return {
      theme,
    }
  },
})
</script>

<style scoped>
.spinner {
  width: 240rpx;
  height: 100rpx;
  text-align: center;
  font-size: 10rpx;
}

.spinner > view {
  height: 100%;
  width: 8rpx;
  margin: 0 3rpx;
  display: inline-block;
  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}
</style>
