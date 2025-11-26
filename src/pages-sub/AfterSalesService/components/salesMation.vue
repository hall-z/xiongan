import { reason } from '../../serveMain/types/dict';
<script lang="ts" setup>
import { useToPhone } from '@/utils/uniapi'
import { AfertSalesDetail } from '../dict/types'
import kefu2 from '../static/kefu2.png'
const props = defineProps({
  title: {
    type: String,
  },
  showBtn: {
    type: Boolean,
    default: false,
  },
  detail: {
    type: Object as PropType<AfertSalesDetail>,
  },
})
const close = ref(false)
const showbtnbox = () => {
  close.value = !close.value
}
</script>

<template>
  <view class="bg-#fff rounded-10px overflow-hidden px-15px py-10px">
    <view v-if="props.title" class="font-size-16px mb-5px color-#333 font-600">
      {{ props.title }}
    </view>
    <view class="my-10px p-10px bg-#FFF4F1 rounded-10px" v-if="!props.showBtn">
      <view class="flex items-center justify-between gap-10px" @click="showbtnbox">
        <text class="font-size-14px">对审核结果不满意</text>
        <view class="w-30px text-right">
          <wd-icon :name="!close ? 'arrow-right' : 'arrow-down'" size="14px"></wd-icon>
        </view>
      </view>
    </view>
    <view class="p-10px" v-if="close || props.showBtn">
      <view class="flex items-center justify-between gap-10px">
        <!-- <view class="w-100%">
          <wd-button
            block
            :round="false"
            custom-class="bg-#FFF4F1! bd-#FFDCD4! color-#F44D24!"
            plain
            @click="useToPhone(1212121)"
          >
            <view class="flex items-center gap-5px">
              <wd-img :src="kefu" width="20px" height="20px"></wd-img>
              <text>平台客服</text>
            </view>
          </wd-button>
        </view> -->
        <view class="w-100%">
          <wd-button
            block
            :round="false"
            custom-class="bg-#F44D24!  color-#FFF!"
            @click="useToPhone(props.detail?.shopPhone)"
          >
            <view class="flex items-center gap-5px">
              <wd-img :src="kefu2" width="20px" height="20px"></wd-img>
              <text>商家客服</text>
            </view>
          </wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
