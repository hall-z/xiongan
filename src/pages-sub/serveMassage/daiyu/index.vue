<route lang="json5">
{
  layout: 'default',
  needLogin: true,
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
import { dataDesensitization } from '@/utils'
import dayjs from 'dayjs'
import bgimg from '../static/images/daiyu/bgimg.png'
import title from '../static/images/daiyu/title.png'
import kong from '../static/images/kong.png'
import useDaiyu from './utils/useDaiyu'
const { list, baseData, labelList } = useDaiyu()
const maxDate = dayjs().valueOf()

const timer = ref<number[]>([Date.now(), dayjs().valueOf()])
const timerShow = ref(['', ''])

const dateList = ref([
  {
    label: '近三个月',
    value: 1,
    date: dayjs().subtract(3, 'month'),
  },
  {
    label: '近半年',
    value: 2,
    date: dayjs().subtract(6, 'month'),
  },

  {
    label: '近一年',
    value: 3,
    date: dayjs().subtract(12, 'month'),
  },
])
const cTime = ref(1)
const cDate = computed(() => {
  return dateList.value.find((item) => item.value === cTime.value)?.date
})

function changeDate(data) {
  timerShow.value[0] = dayjs(cDate.value.valueOf()).format('YYYY-MM-DD')
  timerShow.value[1] = dayjs(maxDate).format('YYYY-MM-DD')
  timer.value = [cDate.value.valueOf(), maxDate]
  queryList()
}
function handleConfirm({ value }) {
  timerShow.value[0] = dayjs(value[0]).format('YYYY-MM-DD')
  timerShow.value[1] = dayjs(value[1]).format('YYYY-MM-DD')
  timer.value = value
  queryList()
}
function getRandomBinary() {
  return Math.random() < 0.5 ? 0 : 1
}
const cList = ref([])
async function queryList() {
  const params = {
    createStartTime: timerShow.value[0],
    createEndTime: timerShow.value[1],
  }
  // 调用接口获取数据
  try {
    uni.showLoading({
      title: '加载中',
    })
    // 0 和 1 的随机数据
    const a = getRandomBinary()

    setTimeout(() => {
      uni.hideLoading()
      if (a === 0) {
        cList.value = []
      } else {
        cList.value = list
      }
    }, 3000)
  } catch (error) {
    console.log('🍕')
  }
}
const footerBtns2 = ref([
  {
    text: '查询',
    size: 'medium',
    round: false,
    plain: true,
    type: 'primary',
    action: 'continue',
    customClass: 'btn-class',
  },
  {
    text: '重置',
    size: 'medium',
    round: false,
    plain: true,
    type: 'primary',
    customClass: 'custom-class-mine-dyinfo',
    action: 'over',
  },
])

function btnClick() {
  queryList()
}
</script>

<template>
  <view class="size-100% fixed top-0 right-0 left-0 bottom-0 bg-no-repeat z-[-1] dy-blue-bg"></view>
  <dy-content customClass="z-paging-content">
    <template #top>
      <dy-navbar leftTitle="" left isNavShow color="#000"></dy-navbar>
      <view class="flex justify-around items-center px-10px">
        <wd-img :src="title" width="187" height="81"></wd-img>
        <wd-img :src="bgimg" width="174" height="174"></wd-img>
      </view>
    </template>
    <view class="rounded-t-10px relative z-index-99 p-10px">
      <view class="px-10px py-3px rounded-5px mb-10px bg-#fff">
        <view class="flex justify-between items-center py-10px">
          <view class="flex items-center gap-5px">
            <view class="text-16px font-600">基本信息</view>
          </view>
        </view>
        <view
          class="flex justify-between items-center py-10px bb-1px_#ECECEC_dashed pr-10px text-14px color-#999"
        >
          <view>姓名:</view>
          <view>{{ dataDesensitization(baseData.name, false, 'first') }}</view>
        </view>
        <view class="flex justify-between items-center py-10px pr-10px text-14px color-#999">
          <view>社会保障号码:</view>
          <view>{{ dataDesensitization(baseData.idCardNumber, false, 'last') }}</view>
        </view>
      </view>
      <view class="p-10px rounded-5px bg-#fff">
        <view class="text-16px font-600">选择查询时间</view>
        <view>
          <wd-radio-group
            v-model="cTime"
            cell
            shape="button"
            checked-color="#1890ff"
            @change="changeDate"
          >
            <wd-radio :value="item.value" v-for="(item, index) in dateList" :key="index">
              {{ item.label }}
            </wd-radio>
          </wd-radio-group>
        </view>
        <view class="">
          <wd-datetime-picker
            v-model="timer"
            placeholder="请选择日期"
            @confirm="handleConfirm"
            custom-value-class="custom-view-picker"
            custom-cell-class="custom-cell-picker"
            use-default-slot
            :maxDate="maxDate"
            type="date"
          >
            <view
              class="flex justify-between items-center p-10px px-20px color-#666 bg-#F3F4F6 text-14px"
            >
              <view>
                {{ timerShow[0] ? timerShow[0] : '开始时间' }}
                <wd-icon name="arrow-down" size="12px"></wd-icon>
              </view>

              <view>至</view>
              <view>
                {{ timerShow[1] ? timerShow[1] : '结束时间' }}
                <wd-icon name="arrow-down" size="12px"></wd-icon>
              </view>
            </view>
          </wd-datetime-picker>
        </view>

        <view class="px-15% bg-#fff mt-20px">
          <view class="flex gap-15px">
            <view class="flex-1" v-for="(item, index) in footerBtns2" :key="index">
              <wd-button
                :round="item.round"
                block
                :size="item.size"
                :type="item.type"
                :customClass="item.customClass"
                @click="btnClick()"
              >
                {{ item.text }}
              </wd-button>
            </view>
          </view>
        </view>
      </view>
      <view>
        <view class="p-10px rounded-5px bg-#fff mt-10px">
          <view class="text-16px font-600">查询结果</view>
          <template v-if="cList.length > 0">
            <view
              class="rounded-5px bg-#F7F7F7 px-10px my-10px py-10px"
              v-for="(item, index) in cList"
              :key="index"
            >
              <view class="text-16px font-600 bb-1px_#ECECEC_dashed py-10px">
                {{ item.name }}
              </view>
              <view
                v-for="(item2, index2) in labelList.slice(2)"
                :key="index2"
                class="flex items-center color-#999999 text-12px line-height-24px gap-5px"
              >
                <view>{{ item2.label }}:</view>
                <view :style="`color:${item2.color}`">
                  <text v-if="item2.color">¥</text>
                  {{ item[item2.prop] }}
                </view>
              </view>
            </view>
          </template>
          <template v-else>
            <wd-status-tip
              :image="kong"
              :image-size="{
                height: 107,
                width: 190,
              }"
              tip="暂未查到您的待遇发放记录！"
            />
          </template>
        </view>
      </view>
    </view>
  </dy-content>
</template>

<style lang="scss" scoped>
:deep(.z-paging-content) {
  background: linear-gradient(180deg, #d6eafe 0%, #f3f4f6 40%, #f2f3f7 100%) !important;
}
:deep(.custom-cell-picker) {
  @apply bg-#F3F4F6;

  .wd-picker__arrow {
    @apply hidden!;
  }
}

:deep(.custom-view-picker) {
  @apply flex justify-between items-center;
}
</style>
