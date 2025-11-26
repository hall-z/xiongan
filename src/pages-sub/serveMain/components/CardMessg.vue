<script lang="ts" setup>
import { changeDict, dataDesensitization } from '@/utils'
import sortBy from 'lodash-es/sortBy'
import useCardMessage from '../hooks/useCardMessage'
import {
  bankCodeList,
  cardType,
  ethniCodeList,
  occupationList,
  regionList,
  sexList,
  socialSecurity,
} from '../types/dict'

interface dataType {
  title: string
  value: string
  prop: string
  type?: string
  options?: any[]
  isDesensitization?: boolean
  aesType?: 'centerString' | 'phoneString' | 'areaString'
  sort?: number
}

const { getCadInfo, loading } = useCardMessage()

const back = () => {
  uni.navigateBack()
}

const data = ref<dataType[]>([
  {
    title: '姓名',
    value: '',
    prop: 'xm',
    sort: 1,
  },
  {
    title: '证件号码',
    value: '',
    prop: 'zjhm',
    sort: 2,
  },
  {
    title: '证件有效期限',
    value: '',
    prop: 'zjyxq',
    sort: 3,
  },
  {
    title: '证件类型',
    value: '',
    prop: 'zjlx',
    type: 'dict',
    options: cardType,
    sort: 4,
  },
  {
    title: '性别',
    value: '',
    prop: 'xb',
    type: 'dict',
    options: sexList,
    sort: 5,
  },
  {
    title: '出生日期',
    value: '',
    prop: 'csrq',
    sort: 6,
  },
  {
    title: '国籍/地区',
    value: '',
    prop: 'gj',
    type: 'dict',
    options: regionList,
    sort: 7,
  },
  {
    title: '民族',
    value: '',
    prop: 'mz',
    type: 'dict',
    options: ethniCodeList,
    sort: 8,
  },
  {
    title: '职业',
    value: '',
    prop: 'zy',
    type: 'dict',
    options: occupationList,
    sort: 9,
  },
  // {
  //   title: '区域代码',
  //   value: '',
  //   prop: 'areaCode',
  // },
  {
    title: '常住所在地地址',
    value: '',
    prop: 'address',
    isDesensitization: true,
    aesType: 'areaString',
    sort: 10,
  },
  {
    title: '社会保障卡号',
    value: '',
    prop: 'zhbzkh',
    isDesensitization: true,
    aesType: 'centerString',
    sort: 11,
  },
  {
    title: '银行名称',
    value: '',
    prop: 'yhhh',
    type: 'dict',
    options: bankCodeList,
    sort: 12,
  },
  {
    title: '银行卡号',
    value: '',
    prop: 'yhkh',
    sort: 13,
  },
  {
    title: '联系电话',
    value: '',
    prop: 'phone',
    isDesensitization: true,
    aesType: 'phoneString',
    sort: 14,
  },
  {
    title: '卡应用状态',
    value: '',
    prop: 'cardStatus',
    type: 'dict',
    options: socialSecurity,
    sort: 15,
  },
])
const cardInfoData = ref<any[]>([])
const errotText = ref<string>('没有查询到该信息')
onMounted(async () => {
  try {
    const res: any = await getCadInfo()
    Object.keys(res.data).forEach((key) => {
      data.value.forEach((item, index) => {
        if (item.prop === key) {
          item.value = res.data[key] ?? ''

          cardInfoData.value.push(item)
        }
      })
    })
    cardInfoData.value = sortBy(cardInfoData.value, ['sort'])
    console.log('🌭', cardInfoData.value)
  } catch (error) {
    errotText.value = error?.data?.message
    console.log('🧀[error]:', error)
  }
})
onUnmounted(() => {
  cardInfoData.value = null
})
</script>
<template>
  <view class="p-15px">
    <view class="rounded-10px overflow-hidden bg-#fff pb-10px">
      <template v-if="cardInfoData.length === 0 && !loading">
        <wd-status-tip image="search" :tip="errotText" />
      </template>
      <template v-else>
        <wd-cell-group title="基本信息" border>
          <wd-cell :title="item.title" border v-for="(item, index) in cardInfoData" :key="index">
            <view v-if="item.type === 'dict'">
              {{ changeDict(item.options, item.value) }}
            </view>
            <view v-else-if="item.isDesensitization">
              {{ dataDesensitization(item.value, false, item.aesType) }}
            </view>
            <view v-else>
              {{ item.value }}
            </view>
          </wd-cell>
        </wd-cell-group>
      </template>
    </view>
    <view class="mt-20px">
      <wd-button type="primary" :round="false" size="medium" @click="back" block>返 回</wd-button>
    </view>
  </view>
</template>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>
<style lang="scss" scoped>
:deep(.wd-input__error-message),
:deep(.custom-input-right) {
  @apply text-right! color-#999999!;
}
</style>
