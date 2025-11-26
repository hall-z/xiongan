<route lang="json5" type="page">
{
  layout: 'default',
  realNameAuthentication: true,
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
      showBackButton: 'false',
    },
  },
}
</route>

<script lang="ts" setup>
import { getUserCardDetail } from '@/service/api/userMessage'
import { useUserStore } from '@/store'
import { changeDict, dataDesensitization, routeTo } from '@/utils/index'
import { useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
import { dataListProp } from './utils/types'
import userCardSev from './utils/userCardSev'
const { statusList } = userCardSev()
const { isLogined, userInfo } = storeToRefs(useUserStore())
const title = ref('我的社保')
// 查询详情
const {
  send: sendCardDetail,
  data: cardDetailData,
  loading,
} = useRequest((data) => getUserCardDetail(data), {
  immediate: false,
  loading: false,
  initialData: [],
})

const dataList = ref<dataListProp[]>([
  {
    title: '姓名',
    props: 'cardName',
  },
  {
    title: '社会保障卡号码',
    props: 'cardCode',
    isAes: true,
  },
  {
    title: '社会保障卡号',
    props: 'socialCardNum',
    isAes: true,
    aesType: 'socialCard',
  },
  {
    title: '社保卡银行账户发卡行',
    props: 'bankCode',
    dict: true,
  },
  {
    title: '社保卡银行卡号',
    props: 'bankCard',
    isbangk: true,
    isAes: true,
  },
  {
    title: '交通卡号 ',
    props: 'trafficNumber',
    isAes: true,
  },
  {
    title: ' 京雄通号',
    props: 'jingxiongNumber',
  },
  {
    title: ' 社保卡状态',
    props: 'cardStatus',
    isStatus: true,
  },
  // {
  //   title: '发卡地',
  //   props: 'cardIssueOrg',
  // },
  // {
  //   title: '参保地',
  //   props: 'cardIssueOrsdg',
  // },
])
const privacyStatus = ref(false)

const status = ref(true)
const bkdict = {
  '102': '工商银行',
  '103': '农业银行',
  '104': '中国银行',
  '105': '建设银行',
  '301': '交通银行',
  '302': '中信银行',
  '303': '光大银行',
  '402': '河北农信社',
}
const toShebao = () => {
  routeTo({
    url: '/pages-sub/serveMain/cardApplyType',
    data: { base: 'shebaoksl', title: '社保卡申领' },
  })
}
onLoad(async () => {
  try {
    await sendCardDetail({ cardId: userInfo.value.cardId })
  } catch (error) {
    console.log('🍡[error]:', error)
    status.value = false
  }
})
</script>

<template>
  <view class="w-100vw h-100vh dy-blue-bg box-border overflow-y-auto pb-100px">
    <dy-navbar :leftTitle="title" left isNavShow color="#000"></dy-navbar>
    <view class="p-15px">
      <view v-if="cardDetailData && !loading && status">
        <wd-cell-group>
          <wd-cell title-width="80%" clickable custom-class="custom-class-cell">
            <template #title>
              <view class="truncate-1 text-16px font-600">
                {{
                  dataDesensitization(cardDetailData[dataList[0].props], privacyStatus, 'userName')
                }}
              </view>
            </template>
            <template #label>
              <view class="flex gap-20px color-#888 text-14px mt-10px">
                社会保障号码:
                {{
                  dataDesensitization(
                    cardDetailData[dataList[1].props],
                    privacyStatus,
                    dataList[1].aesType,
                  )
                }}
              </view>
            </template>
            <view class="flex">
              <view class="relative w-60px h-50px">
                <view
                  class="absolute top-[-16px] right-[-6px] px-15px py-3px text-12px rounded-lb-15px"
                  :style="changeDict(statusList, cardDetailData[dataList[7].props], 'bg', 'label')"
                >
                  {{ cardDetailData[dataList[7].props] }}
                </view>
              </view>
            </view>
          </wd-cell>
        </wd-cell-group>
        <view class="bg-#fff pt-40px pb-5px rounded-6px">
          <view class="mt-[-20px]" v-for="item in dataList.slice(2)" :key="item.props">
            <wd-cell-group>
              <wd-cell clickable custom-class="custom-class-cell">
                <template #label>
                  <view class="flex gap-20px color-#999 text-14px">{{ item.title }}</view>
                </template>
                <view class="flex items-center gap-10px justify-end">
                  <template v-if="item.showeys">
                    <view class="text-right color-#000">{{ cardDetailData[item.props] }}</view>
                    <!-- <wd-icon
                      :name="privacyStatus ? 'view' : 'eye-close'"
                      size="22px"
                      @click="privacyStatus = !privacyStatus"
                    ></wd-icon> -->
                  </template>
                  <template v-else-if="item.isStatus">
                    <view
                      class="px-10px"
                      :style="changeDict(statusList, cardDetailData[item.props], 'bg', 'label')"
                    >
                      {{ cardDetailData[item.props] }}
                    </view>
                  </template>
                  <template v-else-if="item.dict">
                    <view>{{ bkdict[cardDetailData[item.props]] }}</view>
                  </template>
                  <template v-else-if="item.isAes">
                    {{
                      dataDesensitization(cardDetailData[item.props], privacyStatus, item.aesType)
                    }}
                  </template>
                  <template v-else>
                    <view>{{ cardDetailData[item.props] }}</view>
                    <!-- FIX:暂时注释 -->
                    <!-- <view v-if="item.isbangk" class="color-#4077F2">(已绑卡)</view> -->
                  </template>
                </view>
              </wd-cell>
            </wd-cell-group>
          </view>
        </view>
      </view>
      <template v-else>
        <view class="bg-#fff py-20px rounded-6px">
          <wd-status-tip image="search" />
          <view>
            <view class="text-12px text-center">暂无社保卡相关信息！</view>
          </view>
        </view>
      </template>
    </view>
    <view></view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.wd-cell-group),
:deep(.wd-cell-group__body) {
  @apply bg-transparent!;
}
:deep(.custom-class-cell) {
  @apply rounded-6px! mb-10px! overflow-hidden!;
}
:deep(.wd-cell__wrapper) {
  @apply items-center! overflow-hidden!;
}
</style>
