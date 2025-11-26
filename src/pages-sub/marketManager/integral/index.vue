<route lang="json5" type="page">
{
  layout: 'default',
  realNameAuthentication: true,
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
import { useUserStore } from '@/store/user'
import { getBack, routeTo } from '@/utils'
import { useMessage } from 'wot-design-uni'
import jifen from '../static/images/integral/jifen.png'
import jinbi from '../static/images/integral/jinbi.png'
import jinb2 from '../static/images/integral/jinbi2.png'
import quanbg from '../static/images/integral/quanbg.png'
import { signInFoProps, signMess } from './utils/types'
import useInter from './utils/useInter'
const message = useMessage()
const userStore = useUserStore()
const { sendInterInfo, sendSign, sendInterProductList } = useInter()
const topbgBase64 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-01/500a698f-6b5b-4507-842f-8f40ed6f600ftopbg.png',
)
const title = ref('积分')
const list = ref([])
const toMingxi = () => {
  routeTo({ url: '/pages-sub/marketManager/integral/interList' })
}
const toAgreement = () => {
  routeTo({
    url: '/pages-sub/webView/index',
    data: { type: '19aer903e4u90', showTop: true, title: '积分规则' },
  })
}

const getProductList = async () => {
  const params = {
    page: 1,
    size: 4,
  }
  // 调用接口获取数据
  try {
    const data: any = await sendInterProductList(params)
    list.value = data.content
  } catch (error) {
    console.log(error)
  }
}
const tips = ref(false)
const qiandaoMsg = ref<signMess>({
  signIn: null,
  msg: '',
})
const qiandao = async () => {
  if (infoData.value.today) return
  try {
    const data: any = await sendSign()
    qiandaoMsg.value = data
    if (qiandaoMsg.value.msg === '签到成功') {
      tips.value = true
      getInterInfo()
      userStore.setTntegralSataus(true)
    } else {
      message.alert({ msg: qiandaoMsg.value.msg, title: '提示' })
    }
  } catch (error) {
    console.log('error', error)
  }
}
const gopath = (e) => {
  let url = '/pages-sub/marketManager/IntegralMarket/IntegralMarket/info'
  if (e.goodSort === 4) {
    url = '/pages-sub/marketManager/IntegralMarket/IntegralMarket/virtualGoods'
  }
  routeTo({
    url,
    data: { goodId: e.goodId },
  })
}
const infoData = ref<signInFoProps>({
  totalSignInDay: '',
  todayIntegral: '',
  totalIntegral: '',
  surplusIntegral: '',
  lxSignInDay: '',
  stageList: [],
  today: false,
})
const getInterInfo = async () => {
  try {
    const data: any = await sendInterInfo()
    infoData.value = data
  } catch (error) {
    console.log('🍪[error]:', error)
  }
}
// const isToDay = computed(() => {
//   return infoData.value.stageList.find((item) => item.isToday).isToday ?? false
// })
onShow(() => {
  getProductList()
})
onLoad(async () => {
  getInterInfo()
})
// 正常情况下，导航栏背景色为透明，滚动距离超过50px时，导航栏背景色变为自生
const navbg = ref('nav_show')
onPageScroll((e) => {
  if (e.scrollTop > 30) {
    navbg.value = 'nav_hide'
  } else {
    navbg.value = 'nav_show'
  }
})
</script>

<template>
  <view
    class="bg-no-repeat flex flex-col min-h-100vh bg-#f5f5f5"
    :style="`background-image: url(${topbgBase64}); background-size: 100% 240px`"
  >
    <wd-navbar
      safeAreaInsetTop
      placeholder
      :custom-class="navbg"
      fixed
      :bordered="false"
      :leftArrow="true"
    >
      <template #left>
        <!-- #ifndef MP-ALIPAY -->
        <wd-icon name="thin-arrow-left" size="36rpx" color="#fff" @click="getBack"></wd-icon>
        <!-- #endif -->
      </template>
      <template #title>
        <text class="line-height-88rpx text-36rpx mt-10rpx color-#fff">{{ title }}</text>
      </template>
    </wd-navbar>
    <view class="flex justify-between items-center mt-5px pl-25px pr-10px">
      <view class="flex justify-between flex-col w-72%">
        <view class="text-14px font-500 color-#fff">可用积分</view>
        <view class="text-28px font-500 color-#fff my-10px">
          <!-- <wd-count-to
            :endVal="infoData.curScore || 0"
            separator=""
            :fontSize="36"
            color="#fff"
          ></wd-count-to> -->
          {{ infoData.surplusIntegral }}
        </view>
        <!--        <view class="text-13px font-500 color-#fff">
          累计获得积分
          <text>{{ infoData.totalIntegral }}</text>
          ,已使用积分
          <text>{{ Number(infoData.totalIntegral) - Number(infoData.surplusIntegral) }}</text>
        </view>-->
        <view class="text-11px font-500 color-#fff">
          同一证件实名的不同账号视为同一用户。若已用其他绑定账号完成签到，请勿重复操作，感谢配合。
        </view>
      </view>
      <view class="flex justify-between flex-col items-end w-28%">
        <!-- <view class="text-12px font-500 color-#fff" @click="toAgreement">
          <wd-icon name="info-circle" size="14px"></wd-icon>
          积分规则
        </view> -->
        <view class="text-12px font-500 color-#fff px-10px py-5px bg" @click="toMingxi">
          积分明细
        </view>
      </view>
    </view>

    <view class="px-8px mt-15px">
      <view class="bg-#fff px-4px py-10px rounded-md">
        <view class="flex justify-between">
          <view class="text-14px">
            您已连续签到
            <text class="color-#ff4920 text-16px">{{ infoData.lxSignInDay }}</text>
            天
          </view>
          <view
            class="px-15px text-12px line-height-22px rounded-full"
            :class="infoData.today ? 'color-#B0B0B0 bg-#ECECEC ' : 'color-#fff bg-#FF7433'"
            @click="qiandao"
          >
            {{ infoData.today ? '已签到' : '签到' }}
          </view>
        </view>

        <view class="mt-10px">
          <view class="grid grid-cols-7 gap-5px">
            <view
              class="text-center rounded-md p-4px flex flex-col h-120rpx justify-around"
              :class="item.highlight == 1 ? 'bg-#FFE3CB' : 'bg-#FFF6EA'"
              v-for="(item, index) in infoData.stageList ?? []"
              :key="index"
            >
              <view class="text-12px">第{{ item.signInDay }}天</view>
              <!-- my-5px -->
              <view class="relative">
                <!--                <image
                  v-if="index === 6"
                  class="w-43px h-43px absolute right-0 top-[-30rpx]"
                  :src="jinbi"
                  mode="aspectFit"
                ></image>-->
                <image class="w-16px h-16px" :src="jinbi" mode="aspectFit"></image>
              </view>
              <view class="color-#999 jfBox">+{{ item.signIntegral }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- #ifndef MP-ALIPAY -->
    <!-- 推荐商品 -->
    <wd-cell
      value="查看更多"
      is-link
      to="/pages-sub/marketManager/IntegralMarket/IntegralMarket/list"
    >
      <template #icon>
        <wd-img :src="jifen" :width="24" :height="24"></wd-img>
      </template>
      <template #title>
        <wd-text
          text="积分兑换好物"
          size="18px"
          bold
          color="#000000"
          custom-class="ml-5px"
        ></wd-text>
      </template>
    </wd-cell>
    <!-- #endif -->
    <view class="p2 pageBoxBg">
      <view v-for="(item, index) in list" class="p2 float-left w-1/2 box-border" :key="index">
        <view class="bg-white rounded-md p-8px">
          <view class="w-full h-135px pos-relative" v-if="item.goodSort === 4">
            <wd-img width="100%" :height="135" :src="quanbg" />
            <view
              class="w-full h-full pos-absolute pos-top-none pos-left-none flex flex-col justify-center items-center"
            >
              <view class="flex items-center justify-center">
                <wd-text
                  :text="item.couponPrice + ' '"
                  size="40px"
                  custom-class="mr-1"
                  color="#ff4345"
                ></wd-text>
                <wd-text
                  :text="item.couponType === '3' ? '折' : '￥'"
                  size="16px"
                  color="#ff4345"
                ></wd-text>
              </view>
              <wd-text
                :text="'满' + item.couponFillPrice + '元可用'"
                size="16px"
                color="#ff4345"
                custom-class="mb-2"
              ></wd-text>
            </view>
          </view>
          <wd-img width="100%" :height="135" :src="item.goodImg" v-else />
          <view class="min-h-44px truncate-2 line-height-22px color-#999">
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
              :disabled="infoData.surplusIntegral < item.coinPrice"
            >
              {{ infoData.surplusIntegral < item.coinPrice ? '积分不足' : '去兑换' }}
            </wd-button>
            <wd-button v-if="item.stock <= 0" size="small" disabled type="info">暂无货</wd-button>
          </view>
        </view>
      </view>
    </view>
  </view>
  <wd-popup v-model="tips" custom-class="custom-class-pop w-80%  rounded-10px">
    <view>
      <view class="flex justify-center items-center bg2">
        <view>
          <wd-img :src="jinb2" width="52" height="52"></wd-img>
        </view>
        <view class="color-#fff text-18px font-semibold">签到赢积分</view>
      </view>
      <view class="flex flex-col justify-center items-center py-20px">
        <view class="color-#000 text-18px font-semibold mb-10px">签到成功，再接再厉</view>
        <view class="color-#666 text-14px">
          获得
          <text class="color-#E95433">{{ qiandaoMsg.signIn }}</text>
          积分
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
:deep(.nav_show) {
  @apply bg-transparent!;
}

:deep(.nav_hide) {
  @apply bg-#ff454d! color-#fff!;
}
.jfBox {
  // font-size: 15px;
}
.pageBoxBg {
  padding-top: 0;
}
:deep(.duihuanBtn) {
  background: #f44d24 !important;
}
:deep(.wd-cell__value) {
  color: #888888;
}
.bg {
  background: #feb329;
  border: 0.9px solid rgba(255, 255, 255, 0.51);
  border-radius: 1000px;
}
.bg2 {
  background: linear-gradient(127deg, #ea5233 0%, #eb8935 100%);
}

:deep(.wd-cell) {
  margin: 5px 0 0;
  background-color: transparent !important;
}
</style>
