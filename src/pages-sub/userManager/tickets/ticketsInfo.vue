<route lang="json5" type="page">
{
  layout: 'default',
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

<script lang="ts" setup>
import { useMessage } from 'wot-design-uni'
import useSuggest from './utils/useSuggest'
const { adviceType, model, reset, rules, submit, submitStatus } = useSuggest()
const message = useMessage()
const title = ref('平台介入')
const form = ref()

// 错误提示
watchEffect(() => {
  if (submitStatus.value) {
    message
      .alert({
        closeOnClickModal: false,
        msg: '感谢您的反馈!',
        title: '提示',
        confirmButtonText: '确定',
      })
      .then(() => {
        uni.navigateBack()
      })
  }
})
onLoad((option: any) => {
  model.value.orderId = option.id
})

onUnload(() => {
  submitStatus.value = false
  reset()
})
</script>

<template>
  <view class="w-100vw h-100vh dy-blue-bg box-border overflow-y-auto pb-100px">
    <dy-navbar :leftTitle="title" left isNavShow color="#000"></dy-navbar>
    <view class="p-15px">
      <view class="rounded-8px overflow-hidden">
        <wd-form ref="form" :model="model">
          <wd-cell-group border>
            <view class="pt-10px px-15px color-#000 font-600 text-14px box-border">
              <text class="color-red">*</text>
              反馈类型
            </view>
            <view class="mt-16px mb-20px w-full flex items-center pl-15px box-border">
              <view
                v-for="(item, index) in adviceType"
                :key="index"
                @click="model.reasonType = item.value"
                class="w-78px h-30px line-height-30px text-center rounded-3px bg-#EFF4FF color-#2D69EF mr-7px box-border font-size-14px"
                :class="item.value === model.reasonType ? 'active' : ''"
              >
                {{ item.label }}
              </view>
            </view>

            <view class="px-15px color-#000 font-600 text-14px box-border">
              <text class="color-red">*</text>
              反馈内容
            </view>
            <wd-textarea
              v-model="model.interfereContent"
              placeholder="请输入您要建议/反馈的内容（必填，300字以内）"
              prop="interfereContent"
              :rules="rules.interfereContent"
              :maxlength="300"
              clearable
              show-word-limit
            />

            <wd-cell title="反馈截图" title-width="70px">
              <dy-upload v-model="model.voucherUrl"></dy-upload>
            </wd-cell>

            <wd-input
              label="联系电话"
              :maxlength="11"
              label-width="70px"
              prop="createPhone"
              :rules="rules.createPhone"
              custom-label-class="font-600"
              clearable
              v-model="model.createPhone"
              placeholder="请输入联系电话"
            />
          </wd-cell-group>
        </wd-form>
      </view>
    </view>

    <view class="px-35px py-21px box-border fixed bottom-0 left-0 right-0 bg-#fff safe-area-after">
      <wd-button block :round="false" @click="submit(form)" custom-class="bg-#2D69EF">
        提 交
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.active {
  color: #fff;
  background-color: #2d69ef;
}
:deep(.wd-cell__title) {
  @apply font-600!;
}
</style>
