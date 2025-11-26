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
import { getsubmitTickets } from '@/service/api/shop'
import { removeT, routeTo } from '@/utils'
import { useMessage } from 'wot-design-uni'
import useSuggest from './utils/useSuggest'
const {
  sendOrderInterfereStatus,
  interfereStatuData,
  changeStatus,
  checkType,
  sendBusinessAdvice,
} = useSuggest()
const message = useMessage()
const title = ref('平台介入')
const state = ref(3)
const status = () => {
  state.value = interfereStatuData.ticketStatus
}
// 重新查询数据
const detilId = ref('')

function toList() {
  routeTo({
    url: '/pages-sub/userManager/tickets/list',
    data: { id: detilId.value },
  })
}

function toSuggest() {
  routeTo({
    url: '/pages-sub/userManager/tickets/ticketsInfo',
    data: { id: detilId.value },
  })
}

function toOver() {
  message
    .confirm({
      msg: '您确定问题已解决？',
      title: '提示',
      closeOnClickModal: false,
    })
    .then(async () => {
      const params = {
        reasonType: interfereStatuData.value.reasonType,
        interfereContent: interfereStatuData.value.reasonType,
        voucherUrl: interfereStatuData.value.voucherUrlList
          ? interfereStatuData.value.voucherUrlList
          : '',
        createPhone: interfereStatuData.value.createPhone,
        handleStatus: 3,
        orderId: detilId.value,
        id: interfereStatuData.value.id,
      }
      console.log('🍻', params)
      const data = await getsubmitTickets(params)
      console.log('🍭[data]:', data)
    })
    .catch((err) => {
      console.log('🍭[err]:', err)
      console.log('点击了取消按钮')
    })
}

function getVoucherUrl(val: string): string {
  if (val) {
    return val.split(',')[0]
  }
  return ''
}

onLoad(async (option: any) => {
  detilId.value = option.id
})
onShow(async (option: any) => {
  await sendOrderInterfereStatus({ orderId: detilId.value })
  status()
})
</script>

<template>
  <dy-content customClass="dy-blue-bg box-border px-15px">
    <template #top>
      <dy-navbar :leftTitle="title" left isNavShow color="#000"></dy-navbar>
    </template>

    <view class="w-full flex items-center justify-center px-15px" v-if="!interfereStatuData">
      <wd-loading type="ring" size="50px" />
    </view>

    <view v-else>
      <view class="w-full px-19px py-16px box-border pos-relative bg-white rounded-5px my-13px">
        <view class="mb-5px">
          <wd-text text="反馈类型：" size="16px" color="#000000" bold></wd-text>
          <wd-text
            :text="checkType(interfereStatuData.reasonType)"
            size="16px"
            color="#000000"
            bold
          ></wd-text>
        </view>
        <wd-text text="联系电话：" color="#888888" size="14px"></wd-text>
        <wd-text :text="interfereStatuData!.createPhone" color="#888888" size="14px"></wd-text>
        <view
          :style="changeStatus(interfereStatuData.ticketStatus).bg"
          class="pos-absolute pos-right-none pos-top-none w-76px line-height-32px pl-20px box-border color-#4EA833 font-size-14px bg-#F0F9ED brge"
        >
          {{ changeStatus(interfereStatuData.ticketStatus).label }}
        </view>
      </view>
      <view class="bg-white rounded-5px px-10px py-15px box-border">
        <view class="mb-14px pl-5px">
          <wd-text text="处理流程" size="16px" color="#000000" bold></wd-text>
        </view>
        <wd-steps :active="state" vertical>
          <wd-step v-if="interfereStatuData.specialIdReply">
            <template #description>
              <view class="flex">
                <view
                  class="w-72px h-68px mr-12px"
                  v-if="getVoucherUrl(interfereStatuData.specialIdReply.replyImg)"
                >
                  <wd-img
                    :width="72"
                    :height="68"
                    radius="5px"
                    :src="getVoucherUrl(interfereStatuData.specialIdReply.replyImg)"
                    :enable-preview="true"
                  />
                </view>
                <wd-text
                  :text="interfereStatuData.specialIdReply.replyContent"
                  size="14px"
                  color="#333333"
                ></wd-text>
              </view>
            </template>
            <template #title>
              <view class="flex justify-between items-center w-full">
                <wd-text text="专席人员处理" size="16px" color="#2D69EF" bold></wd-text>
                <wd-text
                  :text="removeT(interfereStatuData.receiveTime)"
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
          <wd-step v-if="interfereStatuData.customerIdReply">
            <template #description>
              <view class="flex">
                <view
                  class="w-72px h-68px mr-12px"
                  v-if="getVoucherUrl(interfereStatuData.customerIdReply.replyImg)"
                >
                  <wd-img
                    :width="72"
                    :height="68"
                    radius="5px"
                    :src="getVoucherUrl(interfereStatuData.customerIdReply.replyImg)"
                    :enable-preview="true"
                  />
                </view>
                <wd-text
                  :text="interfereStatuData.customerIdReply.replyContent"
                  size="14px"
                  color="#333333"
                ></wd-text>
              </view>
            </template>
            <template #title>
              <view class="flex justify-between items-center w-full">
                <wd-text text="客服处理" size="16px" color="#2D69EF" bold></wd-text>
                <wd-text
                  :text="removeT(interfereStatuData.receiveTime)"
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
                <view class="w-72px h-68px mr-12px" v-if="interfereStatuData.voucherUrlList[0]">
                  <wd-img
                    :width="72"
                    :height="68"
                    radius="5px"
                    :src="interfereStatuData.voucherUrlList[0]"
                    :enable-preview="true"
                  />
                </view>
                <wd-text
                  :text="interfereStatuData.interfereContent"
                  size="14px"
                  color="#333333"
                ></wd-text>
              </view>
            </template>
            <template #title>
              <view class="flex justify-between items-center w-full">
                <wd-text text="用户提交待处理" size="16px" color="#2D69EF" bold></wd-text>
                <wd-text
                  :text="removeT(interfereStatuData!.createTime)"
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
    <template #bottom>
      <view v-if="interfereStatuData.ticketStatus === 3" class="mx-[-10px]">
        <view class="flex items-center justify-between p-10px gap-10px bg-#fff">
          <view class="w-1/2">
            <wd-button block :round="false" @click="toSuggest">继续反馈</wd-button>
          </view>
          <view class="w-1/2">
            <!-- <wd-button
              block
              :round="false"
              @click="toOver"
              plain
              custom-class="custom-class-mine-dyplain"
            >
              问题已解决
            </wd-button> -->

            <wd-button
              block
              :round="false"
              @click="toList"
              plain
              custom-class="custom-class-mine-dyplain"
            >
              查看历史记录
            </wd-button>
          </view>
        </view>
      </view>
      <view v-else class="mx-[-10px]">
        <view class="flex items-center p-10px gap-10px bg-#fff">
          <view class="w-full">
            <wd-button block :round="false" @click="toList">查看历史记录</wd-button>
          </view>
        </view>
      </view>
    </template>
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
  word-break: normal;
  word-wrap: break-word;
  white-space: normal;
}
</style>
