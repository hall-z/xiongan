<script lang="ts" setup>
const props = defineProps({
  customStyle: {
    type: String,
    default: '',
  },
  customClass: {
    type: String,
    default: '',
  },
  customClassCenter: {
    type: String,
    default: '',
  },
  customstyleCenter: {
    type: String,
    default: '',
  },
})
</script>
<template>
  <view class="page-container" :style="props.customStyle" :class="props.customClass">
    <!-- 顶部插槽 -->
    <view class="top-slot">
      <slot name="top"></slot>
    </view>
    <!-- 中间可滚动内容区域 -->
    <scroll-view
      scroll-y
      class="content-area"
      :class="props.customClassCenter"
      :style="`${props.customstyleCenter}`"
    >
      <slot></slot>
    </scroll-view>

    <!-- 底部插槽 -->
    <view class="bottom-slot safe-area-after">
      <slot name="bottom"></slot>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.page-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: auto;
  height: auto;
}

.top-slot {
  flex-shrink: 0; // 防止被压缩
}

.content-area {
  position: relative;
  box-sizing: border-box;
  flex: 1;
  overflow: hidden;
}

.bottom-slot {
  flex-shrink: 0; // 防止被压缩
  width: 100%;
}
</style>
