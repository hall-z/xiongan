<script lang="ts" setup>
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'
import { htmlProps } from './types'
const props = defineProps(htmlProps)
</script>

<template>
  <view class="p-2">
    <template v-if="html">
      <!-- #ifndef APP-PLUS -->
      <mp-html :content="html" />

      <!-- #endif -->

      <!-- #ifdef APP-PLUS -->

      <rich-text :nodes="html" style="width: 100%"></rich-text>
      <!-- #endif -->
    </template>
    <view :class="props.dyHeight ? props.dyHeight : 'mt-30'" v-else>
      <wd-status-tip image="content" tip="当前该内容生效中......" />
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
