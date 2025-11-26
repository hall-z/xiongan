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
import { removeT } from '@/utils'
import useSuggest from './utils/useSuggest'

const { sendDetail, detilData, checkStatus, checkType } = useSuggest()
const title = ref('投诉与建议')
const state = ref(0)
const status = () => {
  const { feedbackStatus, isSwitch } = detilData.value
  if (feedbackStatus === 1 && isSwitch === 0) {
    state.value = 1
  }
  if (feedbackStatus === 1 && isSwitch === 1) {
    state.value = 2
  }
  if (feedbackStatus === 2 && isSwitch === 0) {
    state.value = 2
  }
  if (feedbackStatus === 2) {
    state.value = 3
  }
}
// 重新查询数据
const detilId = ref('')

onLoad(async (option: any) => {
  detilId.value = option.id
  await sendDetail({ feedbackId: detilId.value })
  await nextTick()
  status()
  console.log('detilData.value+++++++++++++++', detilData.value, state.value)
})
</script>

<template>
  <dy-content customClass="dy-blue-bg px-15px box-border">
    <template #top>
      <dy-navbar :leftTitle="title" left isNavShow color="#000"></dy-navbar>
    </template>

    <view class="w-full h-90vh flex items-center justify-center" v-if="!detilData">
      <wd-loading type="ring" size="50px" />
    </view>

    <view v-else>
      <view class="w-full px-19px py-16px box-border pos-relative bg-white rounded-5px my-13px">
        <view class="mb-5px">
          <wd-text text="反馈类型：" size="16px" color="#000000" bold></wd-text>
          <wd-text
            :text="checkType(detilData.feedbackType)"
            size="16px"
            color="#000000"
            bold
          ></wd-text>
        </view>
        <wd-text text="联系电话：" color="#888888" size="14px"></wd-text>
        <wd-text :text="detilData.feedbackPhone" color="#888888" size="14px"></wd-text>
        <view
          :style="checkStatus(detilData, 'style')"
          class="pos-absolute pos-right-none pos-top-none w-76px line-height-32px pl-20px box-border color-#4EA833 font-size-14px bg-#F0F9ED brge"
        >
          {{ checkStatus(detilData, 'text') }}
        </view>
      </view>
      <view class="bg-white rounded-5px px-10px py-15px box-border">
        <view class="mb-14px pl-5px">
          <wd-text text="处理流程" size="16px" color="#000000" bold></wd-text>
        </view>
        <wd-steps :active="state" vertical>
          <wd-step v-if="detilData.feedbackStatus === 2">
            <template #description>
              <view class="flex">
                <view class="w-72px h-68px mr-12px" v-if="detilData.replyImg">
                  <wd-img
                    :width="72"
                    :height="68"
                    radius="5px"
                    :src="detilData.replyImg"
                    :enable-preview="true"
                  />
                </view>
                <view class="text-content">{{ detilData.replyContent }}</view>
              </view>
            </template>
            <template #title>
              <view class="flex justify-between items-center w-full">
                <wd-text text="已办结" size="16px" color="#2D69EF" bold></wd-text>
                <wd-text
                  :text="removeT(detilData.finishTime)"
                  color="#999999"
                  size="14px"
                ></wd-text>
              </view>
            </template>
            <template #icon>
              <view
                class="w-14px h-14px rounded-50px bg-white box-border inline-block"
                style="border: 3px solid #2d69ef"
              ></view>
            </template>
          </wd-step>
          <wd-step
            v-if="
              (detilData.feedbackStatus === 1 || detilData.feedbackStatus === 2) &&
              detilData.isSwitch === 1
            "
          >
            <template
              #description
              v-if="detilData.feedbackStatus === 1 && detilData.isSwitch === 1"
            >
              <wd-text text="正在紧急处理中，请耐心等待！" size="14px" color="#333333"></wd-text>
            </template>
            <template #title>
              <view class="flex justify-between items-center w-full">
                <wd-text text="专席处理" size="16px" color="#2D69EF" bold></wd-text>
                <wd-text
                  :text="removeT(detilData.switchTime)"
                  color="#999999"
                  size="14px"
                ></wd-text>
              </view>
            </template>
            <template #icon>
              <view
                class="w-14px h-14px rounded-50px bg-white box-border inline-block"
                style="border: 3px solid #2d69ef"
              ></view>
            </template>
          </wd-step>
          <wd-step v-if="detilData.feedbackStatus === 1 || detilData.feedbackStatus === 2">
            <template #description v-if="detilData.isSwitch === 0">
              <wd-text text="正在紧急处理中，请耐心等待！" size="14px" color="#333333"></wd-text>
            </template>
            <template #title>
              <view class="flex justify-between items-center w-full">
                <wd-text text="客服处理" size="16px" color="#2D69EF" bold></wd-text>
                <wd-text
                  :text="removeT(detilData.receiveTime)"
                  color="#999999"
                  size="14px"
                ></wd-text>
              </view>
            </template>
            <template #icon>
              <view
                class="w-14px h-14px rounded-50px bg-white box-border inline-block"
                style="border: 3px solid #2d69ef"
              ></view>
            </template>
          </wd-step>
          <wd-step>
            <template #description>
              <view class="flex">
                <view class="w-72px h-68px mr-12px" v-if="detilData.feedbackImg">
                  <wd-img
                    :width="72"
                    :height="68"
                    radius="5px"
                    :src="detilData.feedbackImg"
                    :enable-preview="true"
                  />
                </view>
                <view class="text-content">{{ detilData.feedbackContent }}</view>
              </view>
            </template>
            <template #title>
              <view class="flex justify-between items-center w-full">
                <wd-text text="用户提交待处理" size="16px" color="#2D69EF" bold></wd-text>
                <wd-text
                  :text="removeT(detilData.createTime)"
                  color="#999999"
                  size="14px"
                ></wd-text>
              </view>
            </template>
            <template #icon>
              <view
                class="w-14px h-14px rounded-50px bg-white box-border inline-block"
                style="border: 3px solid #2d69ef"
              ></view>
            </template>
          </wd-step>
        </wd-steps>
      </view>
    </view>
  </dy-content>
</template>

<style lang="scss" scoped>
:deep(.uni-scroll-view) {
  height: auto !important;
}

:deep(.page-container) {
  height: auto !important;
}

.brge {
  border-radius: 0px 5px 0px 25px;
}

.text-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  word-break: normal;
  word-wrap: break-word;
  white-space: break-spaces;
}
</style>
