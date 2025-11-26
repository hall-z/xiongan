<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      defaultTitle: '',
      titlePenetrate: 'NO',
      backButtonIcon: null,
    },
  },
}
</route>

<script lang="ts" setup>
import { removeT, routeTo, nameHide } from '@/utils'
import dayjs from 'dayjs'
import todayImg from './static/payLog.png'
import useShopServe from './utils/useShopServe'
const title = ref('商户收款记录')
const { sendOrderIdByShop, shopPayList } = useShopServe()
const maxDate = dayjs().valueOf()
const cday = Date.now()
const timer = ref<number>(Date.now())
const timerShow = ref('')
timerShow.value = dayjs(timer.value).format('YYYY-MM-DD')

async function handleConfirm({ value }) {
  timerShow.value = dayjs(value).format('YYYY-MM-DD')
  await sendOrderIdByShop({ payMentTime: timerShow.value })
}
function toMingxi(item) {
  routeTo({
    url: '/pages-sub/shopManager/shopPayMingxi',
    data: item,
  })
}
onLoad(async () => {
  await sendOrderIdByShop({ payMentTime: timerShow.value })
})
const isNone = computed(() => {
  return cday === dayjs(timer.value).valueOf() && !shopPayList.value.respVoList?.length
})
</script>

<template>
  <dy-navbar :leftTitle="title" left></dy-navbar>
  <view class="mt-20px p-10px" v-if="isNone">
    <wd-status-tip
      :image="todayImg"
      :image-size="{
        height: 95,
        width: 165,
      }"
    />
    <view class="font-bold text-20px py-10px text-center">今天暂无收款记录</view>
    <view class="text-#999999 text-14px text-center">快去开启你的收款吧！</view>
  </view>
  <view class="mt-10px px-10px">
    <view class="p-15px px-10px bg-list rounded-10px">
      <view class="flex justify-between items-center">
        <view>
          <view class="py-10px">总收入</view>
          <view class="color-#2D69EF text-20px font-600 py-10px">
            {{ shopPayList.orderPaymentSum ? '￥' + shopPayList.orderPaymentSum : '--' }}
          </view>
        </view>
        <view>
          <wd-datetime-picker
            v-model="timer"
            placeholder="请选择日期"
            @confirm="handleConfirm"
            use-default-slot
            type="date"
            :maxDate="maxDate"
          >
            <view class="flex justify-between items-center p-10px px-20px color-#666 text-14px">
              <view class="text-16px">
                {{ timerShow }}
                <wd-icon name="caret-down-small" size="14px"></wd-icon>
              </view>
            </view>
          </wd-datetime-picker>
          <view
            class="bg-#2D69EF color-#fff text-14px py-5px px-3px rounded-full text-center mx-auto"
          >
            <view>共计: {{ shopPayList.orderPaymentCount }} 笔</view>
          </view>
        </view>
      </view>
      <view
        class="rounded-4px overflow-hidden my-10px bg-#fff h-68px"
        v-for="(item, index) in shopPayList.respVoList"
        :key="index"
        @click="toMingxi(item)"
      >
        <view class="px-20px flex justify-between relative items-center">
          <view>
            <view class="text-16px py-10px">{{ nameHide(item.userName) }}</view>
            <view class="text-12px color-#999 py-3px">
              {{ removeT(item.payMentTime).substring(0, 19) }}
            </view>
          </view>

          <view class="color-#FF6600 text-18px py-10px">+￥{{ item.orderActualAmount }}</view>
          <!--
          <view
            v-if="item.isYouhui"
            class="absolute right-0 bottom-[-6px] py-5px px-20px bg-#FFF6F0 rounded-tl-30px"
          >
            <view class="flex items-center gap-5px">
              <wd-img :src="iconyhq" width="13" height="13"></wd-img>
              <view class="color-#FF9047 text-12px">优惠: {{ item.yhje }}</view>
            </view>
          </view> -->
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.bg-list {
  background: linear-gradient(180deg, #e9f1fc 0%, #fafafa 100%);
}
</style>
