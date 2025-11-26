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
    },
  },
}
</route>

<script lang="ts" setup>
import { getInfoList } from '@/service/api/userMessage'
import type { CalendarInstance } from '@/uni_modules/wot-design-uni/components/wd-calendar/types'

import { ref } from 'vue'
import { useToast } from 'wot-design-uni/index'
import foodicon02 from '../static/images/smartCanteen/foodicon02.png'
import { nameHide, routeTo } from '@/utils'

const toast = useToast()
const title = ref('食堂充值记录')

const endTime = ref(
  new Date(new Date().getTime() + 1000 * 60 * 60 * 8).toISOString().slice(0, 19) + '+08:00',
)
const startTime = ref(
  new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 60 * 8)
    .toISOString()
    .slice(0, 19) + '+08:00',
)

const list = ref([])
const option = ref({})

const calendar = ref<CalendarInstance>()
const value = ref<number[]>([])

function openCalendar() {
  calendar.value?.open()
}

function closeCalendar() {
  calendar.value?.close()
}

function handleConfirm({ value }) {
  value.value = value

  startTime.value =
    new Date(value.value[0] + 1000 * 60 * 60 * 8).toISOString().slice(0, 19) + '+08:00'
  endTime.value =
    new Date(value.value[1] + 1000 * 60 * 60 * 8).toISOString().slice(0, 19) + '+08:00'
  GinfoList()
}

function fmtTime(date) {
  const da = new Date(date)
  const Y = da.getFullYear() + '-'
  const M = (da.getMonth() + 1 < 10 ? '0' + (da.getMonth() + 1) : da.getMonth() + 1) + '-'
  const D = (da.getDate() < 10 ? '0' + da.getDate() : da.getDate()) + ' '

  // var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
  // var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
  // var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
  const strDate = Y + M + D
  return strDate
}

function formatTimeA(val) {
  return val.slice(0, 10)
}

function formatTimeB(val) {
  return val.slice(11, 19)
}

function GinfoList() {
  getInfoList({
    personId: option.value.personId,
    pageNo: 1,
    pageSize: 20,
    transactionTypes: '1',
    canteenName: option.value.canteenName,
    endTime: endTime.value,

    startTime: startTime.value,
  }).then((res: any) => {
    console.log('列表', res)
    list.value = res.data.data.rows
  })
}

onLoad((options) => {
  option.value = JSON.parse(options.item)
  console.log('options', option.value)

  GinfoList()
})
</script>

<template>
  <view class="flex flex-col bg-no-repeat dy-blue-bg2" style="height: 100vh">
    <view>
      <dy-navbar
        :leftTitle="title"
        left
        color="#000"
        custom-style="background: transparent;position: relative;"
      ></dy-navbar>
      <view @click="openCalendar" class="times">
        {{
          !value[0] ? fmtTime(new Date().getTime()) : fmtTime(value[0]) + '~' + fmtTime(value[1])
        }}
        <wd-icon name="fill-arrow-down" size="22px"></wd-icon>
      </view>
    </view>

    <view class="topbg pos-relative" style="position: relative; flex: 1; overflow: auto">
      <view class="list">
        <view v-if="list.length > 0">
          <view v-for="(it, ind) in list" :key="ind">
            <view
              @click="
                routeTo({
                  url:
                    '/pages-sub/userManager/smartCanteen/payInfo?item=' +
                    JSON.stringify(it) +
                    '&phone=' +
                    option.phones,
                })
              "
              class="py-15px bg-#fff box-border w-full flex justify-between items-center"
            >
              <view class="flex items-center justify-left">
                <wd-img :width="36" :height="36" :src="foodicon02" custom-class="mr-10px"></wd-img>
                <view class="">
                  <view class="mb-5px flex items-center justify-left">
                    <wd-text :text="nameHide(option.name)" size="16px" color="#000"></wd-text>
                  </view>
                  <view class="flex items-center justify-left">
                    <wd-text
                      :text="formatTimeA(it.debitTime)"
                      size="14px"
                      color="#999"
                      custom-class="mr-10px"
                    ></wd-text>
                    <wd-text :text="formatTimeB(it.debitTime)" size="12px" color="#999"></wd-text>
                  </view>
                </view>
              </view>
              <view>
                <wd-text
                  :text="it.deduction / 100"
                  size="16px"
                  color="#f28b89"
                  mode="price"
                  suffix="元"
                ></wd-text>
              </view>
            </view>
          </view>
        </view>

        <wd-status-tip image="content" tip="暂无数据" v-else />
      </view>
      <wd-calendar
        ref="calendar"
        :with-cell="false"
        v-model="value"
        type="daterange"
        @confirm="handleConfirm"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.topbg {
  box-sizing: border-box;

  overflow: hidden;
}

.box-border {
  border-bottom: 1px solid #e5e5e5;
}

.times {
  width: 100%;
  padding: 10px 15px;
  background: rgba(248, 248, 248, 1);
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}

.list {
  box-sizing: border-box;
  padding: 0px 19px 45px 19px;
}
</style>
