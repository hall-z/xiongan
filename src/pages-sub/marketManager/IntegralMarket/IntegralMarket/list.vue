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
import { routeTo } from '@/utils'
import quanbg from '../../static/images/integral/quanbg.png'
import wxquanbg from '../../static/images/integral/wxquanbg.png'
import { ExchangeGoodsListProps } from './utils/types'
import useInter from './utils/useInter'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

const wxicon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-03/cdf119a8-3e7c-4acc-b376-43e4aca818d1wx.png',
)
const title = ref('积分商城')
const paging = ref(null)
const { sendInterProductList, sendInterInfo } = useInter()

async function queryList(pageNo: number, pageSize: number) {
  const params = {
    page: pageNo,
    size: pageSize,
    goodSort: active.value,
  }
  // 调用接口获取数据
  try {
    const data: any = (await sendInterProductList(params)) as ExchangeGoodsListProps[]
    // list.value = data.content
    paging.value.complete(data.content)
  } catch (error) {
    paging.value.complete(false)
  }
}

const active = ref<any>(null)

const list = ref([])

function changeTab(e) {
  active.value = e
  paging.value.reload()
}

const { userInfo } = storeToRefs(useUserStore())

function gopath(e) {
  if (e.type === '4') {
    routeTo({
      url:
        '/pages-sub/marketManager/coupon/exchangewebview?state=' +
        e.couponId +
        'W' +
        userInfo.value.userDId +
        'W' +
        userInfo.value.cardId +
        'W' +
        e.goodId,
    })
  } else {
    let url = '/pages-sub/marketManager/IntegralMarket/IntegralMarket/info'
    if (e.goodSort === 4) {
      url = '/pages-sub/marketManager/IntegralMarket/IntegralMarket/virtualGoods'
    }
    routeTo({
      url,
      data: { goodId: e.goodId, surplusIntegral: surplusIntegral.value, sellOut: e.sellOut },
    })
  }
}

onShow(async () => {
  try {
    const data: any = await sendInterInfo()
    surplusIntegral.value = data.surplusIntegral ?? 0
  } catch (error) {
    surplusIntegral.value = 0
  }
  console.log('paging.value', paging.value)
  await nextTick()
  paging.value && paging.value.reload()
})
const surplusIntegral = ref(0)
</script>

<template>
  <z-paging
    ref="paging"
    v-model="list"
    @query="queryList"
    :auto-show-system-loading="true"
    style="background: #f3f4f6"
  >
    <template #top>
      <dy-navbar :leftTitle="title" left></dy-navbar>
      <view class="flex justify-between items-center navbg w-screen h-80px">
        <view class="flex justify-left items-start flex-col">
          <view class="text-base text-white mb-1">
            <wd-text :text="surplusIntegral" size="28px" color="#fff"></wd-text>
            <wd-text text=" 积分" size="12px" color="#fff"></wd-text>
          </view>
          <view class="text-xs text-slate-100 opacity-60">积分可兑换商品，避免失效请尽快使用</view>
        </view>
        <view
          class="font-size-14px text-#F44D24 bg-white px-20px py-5px border-rd-50px"
          @click="
            routeTo({
              url: '/pages-sub/marketManager/IntegralMarket/IntegralMarket/exchangeRecords',
            })
          "
        >
          兑换记录
        </view>
      </view>
      <view class="w-full flex items-center px-25px pt-15px pb-10px">
        <view :class="active === null ? 'text-#F44D24' : 'color-#888888'" @click="changeTab(null)">
          全部
        </view>
        <view
          :class="active === 2 ? 'text-#F44D24' : 'color-#888888'"
          class="ml-20px"
          @click="changeTab(2)"
        >
          商品
        </view>
        <view
          :class="active === 4 ? 'text-#F44D24' : 'color-#888888'"
          class="ml-20px"
          @click="changeTab(4)"
        >
          优惠券
        </view>
      </view>
    </template>
    <view class="p2 pageBoxBg">
      <view v-for="(item, index) in list" class="p2 float-left w-1/2 box-border" :key="index">
        <view class="bg-white rounded-md p-8px relative box-border">
          <view class="flex items-center justify-center mb-2">
            <view class="w-full h-135px pos-relative" v-if="item.goodSort === 4">
              <wd-img width="100%" :height="135" :src="wxquanbg" v-if="item.type === '4'" />
              <wd-img width="100%" :height="135" :src="quanbg" v-if="item.type !== '4'" />
              <view
                v-if="item.type === '4'"
                class="absolute right-0 top-0 color-#22A540 font-size-12px px-10px py-5px rounded-bl-10px"
              >
                <wd-img :src="wxicon" width="18" height="18"></wd-img>
              </view>
              <view
                class="w-full h-full pos-absolute pos-top-none pos-left-none flex flex-col justify-center items-center"
              >
                <view class="flex items-center justify-center">
                  <wd-text
                    :text="item.couponPrice + ' '"
                    bold
                    size="36px"
                    custom-class="mr-1"
                    :color="item.type === '4' ? '#22A540' : '#ff4345'"
                  ></wd-text>
                  <wd-text
                    :text="item.couponType === '3' ? '折' : '￥'"
                    size="16px"
                    :color="item.type === '4' ? '#22A540' : '#ff4345'"
                  ></wd-text>
                </view>
                <wd-text
                  :text="'满' + item.couponFillPrice + '元可用'"
                  size="16px"
                  :color="item.type === '4' ? '#22A540' : '#ff4345'"
                  custom-class="mb-2"
                ></wd-text>

                <!-- <view class="mt-20px">
                  <wd-text text="100" size="42px" bold color="#ff4345"></wd-text>
                  <wd-text text="￥" size="20px" bold color="#ff4345"></wd-text>
                </view> -->
              </view>
            </view>
            <wd-img width="100%" :height="135" :src="item.goodImg" v-else />
          </view>
          <view class="min-h-44px truncate-2 line-height-22px color-#000" style="font-size: 14px">
            {{ item.goodName }}
          </view>

          <view class="flex justify-between items-center">
            <view class="flex justify-left items-start flex-col">
              <view class="flex justify-left items-center">
                <wd-text
                  :text="item.coinPrice.toString()"
                  :lines="2"
                  size="18px"
                  color="#F44D24"
                  class="font-bold"
                ></wd-text>
                <wd-text text="积分" :lines="2" size="12px" color="#F44D24" class="ml-1"></wd-text>
              </view>
              <wd-text
                :text="'已兑' + item.sellOut + '件'"
                :lines="1"
                size="12px"
                color="#999999"
              ></wd-text>
            </view>
            <wd-button
              v-if="item.stock > 0"
              size="small"
              custom-class="duihuanBtn m0"
              @click="gopath(item)"
              :disabled="surplusIntegral < item.coinPrice"
            >
              {{ surplusIntegral < item.coinPrice ? '积分不足' : '去兑换' }}
            </wd-button>
            <wd-button v-if="item.stock <= 0" size="small" disabled type="info">暂无货</wd-button>
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>
<style lang="scss" scoped>
.pageBoxBg {
  padding-top: 0 !important;
  overflow: hidden;
  background: #f3f4f6;
}

.navbg {
  box-sizing: border-box;
  padding: 0px 30px;
  background-image: url('https://oss.xay.xacloudy.cn/images/2024-09/5066fcb4-00df-4f6a-8641-3bba21c8b824jifenbg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

:deep(.z-paging-content) {
  background: #f3f4f6;
}

.tabsBox {
  background: transparent !important;
}

:deep(.duihuanBtn) {
  background: #f44d24 !important;
}

:deep(.wd-button) {
  margin: 0;
}

.tabTool {
  z-index: 10;
  width: 100vw;
  background: #f3f4f6;
}

.ListBox {
  height: auto;
  padding-bottom: 60px;
  margin-top: 114px;
  background: #f3f4f6;
}
</style>
