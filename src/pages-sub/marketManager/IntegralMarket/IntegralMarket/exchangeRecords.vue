<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<script lang="ts" setup>
import { changeUrlJson, routeTo } from '@/utils'
import quanbg from '../../static/images/integral/quanbg.png'
import wxquanbg from '../../static/images/integral/wxquanbg.png'
import useInter from './utils/useInter'

const wxicon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-03/cdf119a8-3e7c-4acc-b376-43e4aca818d1wx.png',
)
const title = ref('积分兑换记录')
const dataList = ref([])
const { sendPointsInfoRecordPage } = useInter()
const paging = ref(null)

async function queryList(pageNo, pageSize) {
  const params = {
    page: pageNo,
    size: pageSize,
  }
  // 调用接口获取数据
  try {
    const data: any = await sendPointsInfoRecordPage(params)
    console.log('兑换列表', data)
    paging.value.complete(data.content)
  } catch (error) {
    paging.value.complete(false)
  }
}

function gopage(it) {
  const da = JSON.parse(JSON.stringify(it))
  routeTo({
    url: '/pages-sub/marketManager/IntegralMarket/IntegralMarket/virtualResult',
    data: { ...changeUrlJson(da) },
  })
}
</script>

<template>
  <view class="min-h-100vh bg-#f3f4f6">
    <z-paging ref="paging" v-model="dataList" @query="queryList">
      <template #top>
        <dy-navbar :leftTitle="title" left></dy-navbar>
      </template>
      <view class="px-15px mt-10px">
        <view
          class="bg-white border-rd-6px p-12px box-border mb-10px flex pos-relative"
          v-for="it in dataList"
          :key="it.id"
          @click="gopage(it)"
        >
          <view class="w-83px">
            <view class="pos-relative" v-if="it.goodSort === 4">
              <wd-img :width="83" :height="75" :src="wxquanbg" v-if="it.type === '4'"></wd-img>
              <wd-img :width="83" :height="75" :src="quanbg" v-if="it.type !== '4'"></wd-img>
              <view
                v-if="it.type === '4'"
                class="absolute right-0 top-0 color-#22A540 font-size-12px px-10px py-5px rounded-bl-10px"
              >
                <wd-img :src="wxicon" width="18" height="18"></wd-img>
              </view>
            </view>
            <wd-img :width="83" :height="75" :src="it.goodImg" v-else></wd-img>
          </view>
          <view class="ml-10px flex-1 flex flex-col justify-between">
            <wd-text :text="it.goodName" bold :lines="2" color="#000" size="16px"></wd-text>
            <view class="flex-1 flex items-center">
              <wd-text
                :text="it.exchangeNotes"
                :color="it.type === '4' ? '#22A540' : '#ff4345'"
                size="14px"
              ></wd-text>
            </view>
            <view class="w-full flex justify-between">
              <wd-text :text="it.exchangeTime" color="#999" size="12px"></wd-text>
              <view>
                <wd-text :text="it.coinPrice" color="#FF4345" bold size="18px"></wd-text>
                <wd-text text="积分 " color="#FF4345" size="12px"></wd-text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped></style>
