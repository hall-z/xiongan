<route lang="json5" type="home">
{
  layout: 'default',
  needLogin: true,
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
import bszlicon from '@/static/images/index/bszlicon.png'
import fwwdicon from '@/static/images/index/fwwdicon.png'

import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { useBaseStore } from '@/store'
import { useUserStore } from '@/store/user'
import { loginModal, routeTo, sceneResult } from '@/utils'
import { openWxChart, useScancode } from '@/utils/uniapi'
import { storeToRefs } from 'pinia'

import { isRouterCheckd } from '@/interceptors/route'
import { useMessage, useToast } from 'wot-design-uni/index'
import { messProps } from './utils/types'
import useIndex from './utils/useIndex'

import { getSignParam } from '@/service/api/auth'

const swiperAuto = ref(true)
const { isLogined, userInfo, isRealSataus } = storeToRefs(useUserStore())
const authStore = useUserStore()
const message = useMessage()
defineOptions({
  name: 'Index',
})

const { VITE_APP_LOGOTITLE } = import.meta.env

const basestore = useBaseStore()
const toast = useToast()

const {
  messageClick,
  sendMessageList,
  messageData,
  messageLoading,
  serviceArea,
  topAction,
  specialTypeskeleton,
  sendGetSpecialTypeList,
  specialTypeList,
  specialTypeLoading,
  sendSwiperList,
  swiperListData,
  sendGetThirdPartyId,
  thirdPartyId,
  bglist,
  sedUserInfo,
  userInfoData,
} = useIndex()

async function actionTop2(item: any) {
  console.log(item)
  if (item.specialJump.indexOf('XXX') > 0) {
    if (isLogined.value) {
      item.specialJump = item.specialJump.replace('XXX', thirdPartyId.value)
    } else {
      loginModal()
      return
    }
    if (!isRealSataus.value) {
      isRouterCheckd({})
      return
    }
    routeTo({
      url: '/pages-sub/webView/index',
      data: {
        showType: 'webView',
        url: item.specialJump,
      },
    })
    return
  }
  if (item.specialJumpType === 'WX') {
    openWxChart(item.appId, item.path)
  } else if (item.specialJumpType === 'H5') {
    if (!item.specialJump) {
      toast.show('功能开发中，敬请期待!...')
    } else {
      if (item.specialJump.indexOf('/pages/serve/index') > -1) {
        return routeTo({
          url: item.specialJump,
          navType: NAVIGATE_TYPE.SWITCH_TAB,
        })
      }
      if (item.specialName === '子女代办') {
        const base = 'xinshenersl'
        const title = '代未成年人申领'
        routeTo({ url: '/pages-sub/serveMain/cardApplyType', data: { base, title } })
      } else if (item.specialName === '社保卡补换') {
        const base = 'shebaokbh'
        const title = '社保卡补换'
        routeTo({ url: '/pages-sub/serveMain/cardApplyType', data: { base, title } })
      } else {
        return routeTo({
          url: item.specialJump,
          data: item,
          navType: NAVIGATE_TYPE.NAVIGATE_TO,
        })
      }
    }
  }
}

function actionTop3(item) {
  routeTo({
    url: item.path,
    data: item.data,
  })
}

async function actionTop(item: any) {
  if (item.type === 'sacn') {
    const resData: any = await useScancode({ onlyFromCamera: true })
    const { status, url, type, data } = sceneResult(resData)

    if (status) {
      if (type === 'LOGINPC') {
        routeTo({
          url,
          data,
        })
      } else if (type === 'xaCardBusniess') {
        routeTo({
          url: '/pages/pay/index',
          data,
        })
      } else if (type === 'socialCard') {
        routeTo({
          url: '/pages/pay/sacnResult',
          data: { url, actionType: type },
        })
      }
    } else {
      message.alert({
        msg: '未识别到二维码内容',
        title: '提示',
      })
    }
  } else if (item.type === 'wxChart') {
    openWxChart(item.appId, item.path)
  } else if (item.type === 'switchTab') {
    basestore.setActive(item.active)
    routeTo({
      url: item.path,
      navType: NAVIGATE_TYPE.SWITCH_TAB,
    })
  } else if (item.type === 'router') {
    routeTo({
      url: item.path,
    })
  } else {
    toast.show('功能开发中，敬请期待!...')
  }
}

function swiperClick(data) {
  console.log(data)

  const { item } = data

  if (item.shopHdType === 1) {
    routeTo({ url: item.appUrl, data: { ...item.data } })
  } else if (item.shopHdType === 3) {
    routeTo({ url: item.shopHdSketch })
  } else if (item.shopHdType === 0) {
    routeTo({
      url: '/pages-sub/webView/index',
      data: {
        type: item.shopHdId,
        showType: 'banner',
        url: item.linkUrl,
      },
    })
  } else if (item.shopHdType === 4) {
    // H5
    routeTo({
      url: '/pages-sub/webView/index',
      data: {
        type: item.shopHdId,
        showType: 'webView',
        url: item.linkUrl,
      },
    })
  } else {
    // #ifndef APP-PLUS
    routeTo({
      url: '/pages-sub/homeManager/action',
      data: {
        id: item.itemId,
      },
    })
    // #endif
    // #ifdef APP-PLUS
    if (item.shopHdTitle === '雄安一卡通优惠享不停') {
      routeTo({
        url: '/pages-sub/homeManager/action',
        data: {
          id: item.itemId,
        },
      })
    } else {
      uni.showModal({
        title: '提示',
        content: '请前往' + VITE_APP_LOGOTITLE + '微信小程序端参加活动！',
        showCancel: false,
      })
    }
    // #endif
  }
}

function serveClick(item) {
  routeTo({
    url: item.path,
    data: { type: item.id, title: item.title },
  })
}

function serveGuild() {
  routeTo({ url: '/pages-sub/serveMassage/workGuide/index' })
}

const toServhFor = (type) => {
  routeTo({ url: '/pages-sub/serveMassage/serchFor/index', data: { type } })
}

function toBusinessOutlets() {
  routeTo({ url: '/pages-sub/serveMassage/businessOutlets/index' })
}

function toMessage() {
  routeTo({ url: '/pages-sub/serveMassage/messageList/index' })
}

// function toMessageItem(e) {
//   const { index } = e
//   messageClick(mess1.value[index])
// }

const toServhFor2 = (type) => {
  routeTo({ url: '/pages-sub/serveMassage/serchFor/index2', data: { type } })
}

function toCard() {
  routeTo({
    url: '/pages-sub/serveMain/cardApplyType',
    data: { base: 'shebaoksl', title: '社保卡申领' },
  })
}

const mess1 = ref<messProps[]>([])

const topbgBase64 = ref(
  'https://oss.xay.xacloudy.cn/images/2024-10/3ce4fcc4-5f4e-4acd-a3e5-238085a09388j95TiPFo8STT8ed4b7daa361d320ff446f49a4aa7467.png',
)

const serverBg = ref(
  'https://oss.xay.xacloudy.cn/images/2025-03/110f8c56-211c-42a0-8b9e-863cb266a412bg.png',
)
const serverBg2 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-08/6fdd20d3-1252-49bc-883b-1c12786b5d50%E7%BB%84%2047237@2x.png',
)

const fwwdbg = ref(
  'https://oss.xay.xacloudy.cn/images/2024-10/f04c66e4-56d5-4d4b-95dd-dac4135de0c3fwwdbg.png',
)
const cjwtbg = ref(
  'https://oss.xay.xacloudy.cn/images/2025-09/2291df9d-b414-4277-a13a-408fdf8fcfd0ww.png',
)
const tzxxbg = ref(
  'https://oss.xay.xacloudy.cn/images/2025-03/f97e29ae-315c-4ccf-802f-b6e8e7597f53tzxx_bg@2x.png',
)
const tzxxlb = ref(
  'https://oss.xay.xacloudy.cn/images/2025-03/2b5c9a94-b683-4217-b25f-b37babdab692%E7%BB%84%2047109@2x.png',
)
const rmfubgt = ref(
  'https://oss.xay.xacloudy.cn/images/2025-03/48c2ca22-60aa-4507-a582-38632c9392f0%E7%83%AD%E9%97%A8%E6%9C%8D%E5%8A%A1@2x.png',
)
const rmfwbg = ref(
  'https://oss.xay.xacloudy.cn/images/2025-03/fd1e5c41-2132-41bd-94cf-d25e74fc1ef9%E8%92%99%E7%89%88%E7%BB%84%206@2x.png',
)
const fwzqbgt = ref(
  'https://oss.xay.xacloudy.cn/images/2025-09/dd338db6-43c2-4546-9e88-1ee46e1d82a312345.png',
)
const bgtop2 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-03/ae93d3f2-a7fb-40f5-9a50-1582e22850af%E7%BB%84%2047103@2x.png',
)
const cardT = ref(
  'https://oss.xay.xacloudy.cn/images/2025-02/57ee38cc-44a0-476e-8e78-650123a9e977%E5%8D%A1%E7%89%87.png',
)
const bszlbg = ref(
  'https://oss.xay.xacloudy.cn/images/2024-10/7042a1ab-7ecd-4d04-b133-318373b867f1bslbg.png',
)
const sweepIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-09/b9e4b10a-68b1-461a-b6f5-e82ace2bd92cTFv6UycF7aX1c57c85e6c0d066d2f76f7ca28a849b65.png',
)
const cjwticon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-09/06187384-51f7-4f37-9617-9fc3a50b6a89icon_3@2x.png',
)
const cjwtArrowIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-09/7d494228-b6a3-42bf-9d23-d1a1eb53f92farray.png',
)
const rmfwIndex = ref(0)
const topAction2 = ref<any>([])
const topAction3 = ref<any>([])
const topAction4 = ref<any>([])

const toCardManage = () => {
  if (isLogined.value && userInfo.value.isReal === '1') {
    routeTo({ url: '/pages-sub/serveMain/cardUserManager' })
  }
}

const getApiSign = async () => {
  console.log('---------插件初始化开始，调用getSignParam（）-------')
  const res: any = await getSignParam({})
  console.log('APP参数', res)
  const {
    appId,
    orgId,
    signUrl: signServerUrl,
    verifySignUrl: verifyServerUrl,
    Des3Key: des3Key,
  } = res

  console.log('---------插件初始化请求成功res-------', res)
  const params = { appId, orgId, signServerUrl, verifyServerUrl, isDebug: true, des3Key }
  authStore.realNamePlugin.initSDK(params, (data: any) => {
    // test.value = data.code
    console.log('插件初始化', data)
    authStore.setPluginStatus(true)
  })
}

// 获取消息
onShow(async () => {
  // #ifdef APP-PLUS
  const data = uni.getStorageSync('userInfo')
  console.log('🥘[data]:========>>>>', data)
  if (data) {
    authStore.setUserInfo(data)
  }
  const plugin = uni.requireNativePlugin('test-plugin')
  console.log('🥠[plugin]====>:', plugin)
  authStore.setRealNamePlugin(plugin)

  // #endif
  await sendGetSpecialTypeList()
  topAction2.value = specialTypeList.value.top
  topAction3.value = specialTypeList.value.center
  topAction4.value = specialTypeList.value.bottom
  basestore.setServiceList(specialTypeList.value.center)
  // await sendMessageList({
  //   page: 1,
  //   size: 50,
  // })
  await sendSwiperList({
    page: 1,
    size: 10,
    location: 1,
    shopHdState: 0,
  })
  // mess1.value = messageData.value.content.filter((i) => i.articleType === '0').slice(0, 5)
  await sendGetThirdPartyId()
  basestore.setThirdPartyId(thirdPartyId.value)
  // 主动更新个人信息
  if (isLogined.value) {
    await sedUserInfo()
    authStore.setUserInfo(Object.assign(userInfo.value, userInfoData.value))
  }

  // #ifdef APP-PLUS
  await getApiSign()
  // #endif
})

console.log('🥩', isLogined.value, userInfo.value.socialCardType, userInfo.value.isReal)

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
  <view class="box-border relative bg-no-repeat bg-cover">
    <wd-navbar safeAreaInsetTop placeholder :custom-class="navbg" fixed :bordered="false">
      <template #left>
        <view class="flex gap-20rpx items-center">
          <text class="line-height-88rpx text-36rpx mt-10rpx al-Left">
            {{ VITE_APP_LOGOTITLE }}
          </text>
        </view>
      </template>
    </wd-navbar>
    <view class="px-20rpx mt-40rpx relative">
      <view
        class="absolute right-60rpx top-20rpx px-10px color-#2D69EF z-99 text-size-24rpx"
        @click="toCardManage"
      >
        {{
          isLogined
            ? userInfo.socialCardType === '1' && userInfo.isReal === '1'
              ? '卡管理'
              : '卡管理'
            : '未登录'
        }}
      </view>

      <view class="absolute bottom-0px left-0 right-0 top-0 z-98 px-40rpx h-160rpx">
        <view
          class="flex gap-40rpx items-center pb-40rpx pt-60rpx bb-1px_#fff_dashed border-[rgba(255,255,255,0.4)]!"
        >
          <view
            class="w-480rpx flex items-center justify-between gap-4rpx box-border ml-[-20rpx]"
            @click="toServhFor(0)"
          >
            <view class="flex-1 px-20rpx">
              <view
                class="flex justify-between items-center serch-bg px-20rpx py-15rpx color-#fff opacity-80 rounded-60rpx!"
              >
                <wd-icon name="search" size="32rpx"></wd-icon>
                <view class="text-left text-28rpx flex-1 px-20rpx">请输入搜索关键词</view>
                <view class="text-28rpx relative search-type">搜索</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view
        class="absolute right-50rpx top-90rpx px-10px color-#FFFFFF z-99 font-size-15px flex"
        style="align-items: center"
        v-if="isLogined && userInfo.socialCardType == '1' && userInfo.isReal == '1'"
        @click="actionTop({ type: 'sacn' })"
      >
        <wd-img
          width="14px"
          height="14px"
          :src="sweepIcon"
          custom-class="pr-5px"
          mode="aspectFit"
        />
        扫一扫
      </view>
      <view
        class="absolute bottom-50rpx left-0 right-0 z-99"
        v-if="isLogined && userInfo.socialCardType == '1' && userInfo.isReal == '1'"
      >
        <view class="grid grid-cols-4 gap-20rpx px-40rpx">
          <view
            v-for="(item, index) in topAction"
            :key="index"
            class="text-center color-#fff"
            @click="actionTop(item)"
          >
            <!--            <wd-img v-if="index===0" width="105rpx" height="105rpx" :src="item.icon" mode="aspectFit"/>-->
            <wd-img
              width="76rpx"
              height="76rpx"
              custom-class="pt-20px"
              :src="item.icon"
              mode="aspectFit"
            />
            <view
              class="FScc"
              style="display: flex; height: 32px; font-size: 14px; line-height: 16px"
            >
              {{ item.text }}
            </view>
          </view>
        </view>
      </view>

      <view class="absolute bottom-50rpx left-0 right-0 px-55rpx z-99" v-else>
        <wd-button plain block color="#2D69EF" custom-class="bg-#fff/30" @click="toCard">
          申请本人社会保障卡
        </wd-button>
      </view>

      <wd-img :src="bgtop2" width="100%" height="368rpx">
        <template #loading>
          <wd-skeleton :row-col="[{ height: '100%' }]" />
        </template>
      </wd-img>
    </view>
  </view>
  <!--  <wd-gap height="10rpx" bg-color="#F2F3F7"></wd-gap>-->
  <!--  快捷应用 -->
  <view class="px-20rpx">
    <view
      style="font-size: 16px; font-weight: bold; line-height: 26px; color: #000"
      class="px-24rpx mt-20rpx mb-20rpx"
    >
      一卡通申领专区
    </view>
    <wd-skeleton
      :row-col="specialTypeskeleton"
      :loading="topAction2!.length < 1"
      animation="flashed"
    >
      <view class="grid grid-cols-3 gap-16rpx">
        <template v-for="(item, index) in topAction2.slice(0, 6)" :key="index">
          <!-- <view
            class="row-span-2 flex flex-col items-center justify-center py-10px px-5px gap-30px rounded-4px bg-no-repeat"
            v-if="index === 0"
            :key="index"
            @click="actionTop2(item)"
            :style="`background-image: url(${bglist[index % 5]}); background-size: 100% 100%`"
          >
            <view class="text-28rpx mt-10% mb-5% text-center" style="white-space: pre-line">
              {{ item.specialName }}
            </view>
            <view>
              <wd-img
                :src="item.specialIcon"
                width="135rpx"
                height="110rpx"
                mode="aspectFit"
              ></wd-img>
            </view>
          </view> -->
          <view
            class="flex flex-col items-center justify-center py-10px px-5px rounded-4px bg-no-repeat h-140rpx box-border"
            @click="actionTop2(item)"
            :style="`background-image: url(${bglist[index % 6]}); background-size: 100% 100% `"
          >
            <view>
              <wd-img
                :src="item.specialIcon"
                width="75rpx"
                height="52rpx"
                mode="aspectFit"
              ></wd-img>
            </view>
            <view class="text-28rpx mt-1% text-center" style="white-space: pre-line">
              {{ item.specialName }}
            </view>
          </view>
        </template>
      </view>
    </wd-skeleton>
  </view>

  <!-- 消息 -->

  <!-- <wd-gap height="20rpx" bg-color="#F2F3F7"></wd-gap>
  <view class="px-20rpx">
    <view class="h-80rpx bg-#fff rounded-12rpx flex items-center overflow-hidden pr-20rpx relative">
      <view class="flex box-border pl-20rpx">
        <wd-badge :is-dot="false">
          <view
            class="w-128rpx h-52rpx text-#2D69EF text-24rpx box-border px-10rpx py-4rpx rounded-8rpx flex justify-center gap-10rpx items-center"
            :style="`background-image: url(${tzxxbg}); background-size: 100%`"
          >
            <wd-img :src="tzxxlb" width="30rpx" height="24rpx" mode="aspectFit"></wd-img>
            <view>公告</view>
          </view>
        </wd-badge>
      </view>
      <view class="flex-1 pl-20rpx">
        <wd-skeleton
          animation="flashed"
          :loading="mess1.length < 1"
          :row-col="[{ width: '80%', height: '20px' }]"
        >
          <wd-notice-bar
            custom-class="custom-class-noticebar"
            direction="vertical"
            :delay="3"
            @click="toMessageItem"
            :text="
              mess1.map((item) =>
                item.articleTitle.length > 15
                  ? item.articleTitle.slice(0, 15) + '...'
                  : item.articleTitle,
              )
            "
          />
        </wd-skeleton>
      </view>

      <view
        @click.stop="toMessage"
        class="absolute right-0 top-0 h-100% flex justify-center items-center w-60rpx"
      >
        <wd-icon name="arrow-right" size="16px" color="#888"></wd-icon>
      </view>
    </view>
  </view> -->

  <!-- 广告位 -->
  <wd-gap height="20rpx" bg-color="#F2F3F7"></wd-gap>
  <view class="px-20rpx">
    <view class="swiper bg-#fff">
      <wd-skeleton
        animation="flashed"
        :row-col="[{ width: '100%', height: '130px' }]"
        :loading="!swiperListData!.content"
      >
        <wd-swiper
          :list="swiperListData!.content"
          :autoplay="swiperAuto"
          :current="0"
          height="210rpx"
          @click="swiperClick"
          :indicator="{ type: 'dots-bar' }"
          custom-indicator-class="custom-indicator-class"
          customClass="rounded-4px! overflow-hidden!"
          value-key="shopHdBanner"
          imageMode="scaleToFill"
        ></wd-swiper>
      </wd-skeleton>
    </view>
  </view>

  <!-- 热门服务 -->
  <wd-gap height="20rpx" bg-color="#F2F3F7"></wd-gap>
  <view class="px-20rpx">
    <view class="pt-24rpx rounded-12rpx rmfw">
      <view :style="`background-image: url(${rmfwbg}); background-size:100%`">
        <view class="px-24rpx mb-20rpx">
          <!--          <wd-img :src="rmfubgt" width="148rpx" height="52rpx" mode="aspectFit"></wd-img>-->
          <view style="font-size: 16px; font-weight: bold; line-height: 26px; color: #000">
            特色服务专区
          </view>
        </view>
        <wd-skeleton
          :row-col="specialTypeskeleton.slice(0, 4)"
          :loading="topAction3!.length < 1"
          animation="flashed"
        >
          <swiper
            circular
            :indicator-dots="true"
            :autoplay="false"
            :interval="5000"
            :duration="500"
            indicator-active-color="#2D69EF"
            indicator-color="#f5f5f5"
            :current="rmfwIndex"
            :class="topAction3[rmfwIndex]?.length > 4 ? 'h-400rpx' : 'h-200rpx'"
          >
            <swiper-item
              v-for="(sItem, index) in topAction3"
              :key="index"
              class="min-h-200rpx max-h-400rpx"
            >
              <view class="grid grid-cols-4 gap-y-12px">
                <view
                  class="flex flex-col items-center py-6px"
                  v-for="(item, index) in sItem"
                  :key="index"
                  @click="actionTop2(item)"
                >
                  <view>
                    <wd-img
                      :src="item.specialIcon"
                      width="90rpx"
                      height="90rpx"
                      mode="aspectFit"
                    ></wd-img>
                  </view>
                  <view class="text-24rpx mt-6px text-center truncate-1">
                    {{ item.specialName }}
                  </view>
                </view>
              </view>
            </swiper-item>
          </swiper>
        </wd-skeleton>
      </view>
    </view>
  </view>

  <wd-gap height="20rpx" bg-color="#F2F3F7"></wd-gap>
  <view class="px-20rpx">
    <view class="pt-24rpx rounded-12rpx rmfw">
      <view :style="`background-image: url(${rmfwbg}); background-size:100%`">
        <view class="px-24rpx mb-20rpx">
          <!--          <wd-img :src="rmfubgt" width="148rpx" height="52rpx" mode="aspectFit"></wd-img>-->
          <view style="font-size: 16px; font-weight: bold; line-height: 26px; color: #000">
            生活服务专区
          </view>
        </view>
        <wd-skeleton
          :row-col="specialTypeskeleton.slice(0, 4)"
          :loading="topAction4!.length < 1"
          animation="flashed"
        >
          <swiper
            circular
            :indicator-dots="true"
            :autoplay="false"
            :interval="5000"
            :duration="500"
            indicator-active-color="#2D69EF"
            indicator-color="#f5f5f5"
            :current="rmfwIndex"
            :class="topAction4[rmfwIndex]?.length > 4 ? 'h-400rpx' : 'h-200rpx'"
          >
            <swiper-item
              v-for="(sItem, index) in topAction4"
              :key="index"
              class="min-h-200rpx max-h-400rpx"
            >
              <view class="grid grid-cols-4 gap-y-12px">
                <view
                  class="flex flex-col items-center py-6px"
                  v-for="(item, index) in sItem"
                  :key="index"
                  @click="actionTop2(item)"
                >
                  <view>
                    <wd-img
                      :src="item.specialIcon"
                      width="90rpx"
                      height="90rpx"
                      mode="aspectFit"
                    ></wd-img>
                  </view>
                  <view class="text-24rpx mt-6px text-center truncate-1">
                    {{ item.specialName }}
                  </view>
                </view>
              </view>
            </swiper-item>
          </swiper>
        </wd-skeleton>
      </view>
    </view>
  </view>

  <!-- 服务专区 -->
  <wd-gap height="20rpx" bg-color="#F2F3F7"></wd-gap>
  <view class="px-20rpx">
    <view class="pt-24rpx pb-6rpx bg-#fff rounded-12rpx">
      <!--      <view class="px-24rpx mb-10rpx">-->
      <!--        <wd-img :src="fwzqbgt" width="162px" height="25px"></wd-img>-->
      <!--      </view>-->
      <view class="px-24rpx mb-0rpx">
        <!--          <wd-img :src="rmfubgt" width="148rpx" height="52rpx" mode="aspectFit"></wd-img>-->
        <view style="font-size: 16px; font-weight: bold; line-height: 26px; color: #000">
          一卡通场景联动导航
        </view>
      </view>
      <view class="grid grid-cols-2 gap-20rpx px-20rpx py-20rpx">
        <template v-for="(item, index) in serviceArea" :key="index">
          <view
            class="col-span-full bg-no-repeat box-border h-140rpx relative rounded-4px bg-#EAF3FE"
            @click="serveClick(item)"
            :style="`background-image: url(${serverBg2});background-size:98% 100%`"
            v-if="index === serviceArea.length - 1"
          >
            <view class="pl-5% text-32rpx line-height-140rpx color-#000">
              {{ item.title }}
            </view>

            <view class="absolute right-0 bottom-2px">
              <wd-img :src="item.iconImg" width="100px" height="62px" mode="aspectFit"></wd-img>
            </view>
          </view>
          <view
            class="bg-no-repeat box-border h-140rpx relative rounded-4px bg-#EAF3FE"
            @click="serveClick(item)"
            :style="`background-image: url(${serverBg});background-size:98% 100%`"
            v-else
          >
            <view class="pl-10% text-32rpx line-height-140rpx color-#000">
              {{ item.title }}
            </view>

            <view class="absolute right-10% bottom-2px">
              <wd-img :src="item.iconImg" width="92rpx" height="92rpx" mode="aspectFit"></wd-img>
            </view>
          </view>
        </template>
      </view>
    </view>
  </view>

  <wd-gap height="20rpx" bg-color="#F2F3F7"></wd-gap>
  <view class="px-20rpx">
    <!-- <view class="p-20rpx rounded-12rpx bg-#fff">
      <view class="flex gap-20rpx justify-between"> -->
    <!-- <view
          class="w-40% box-border px-20rpx py-15px bg-no-repeat box-border h-336rpx"
          @click="serveGuild"
          :style="`background-image: url(${bszlbg}); background-size: 100% ;border-radius: 3px;`"
        >
          <view class="text-32rpx font-600 color-#374A7B">办事指南</view>
          <view class="color-#859ABE text-20rpx my-10rpx">
            如何快速了解一卡通,如何申领,如何使用
          </view>
          <view class="bb-2px_#374A7B w-60rpx mt-20rpx"></view>

          <view class="mt-20rpx flex justify-end">
            <wd-img :src="bszlicon" width="120rpx" height="120rpx"></wd-img>
          </view>
        </view> -->
    <!-- <view class="w-100% flex flex-col justify-between h-54px"> -->
    <!-- <view
            class="bg-no-repeat box-border py-15px pl-20rpx flex justify-between h-160rpx"
            :style="`background-image: url(${fwwdbg}); background-size: 100% 110%;border-radius: 3px;`"
            @click="toBusinessOutlets"
          >
            <view>
              <view class="text-32rpx font-600 color-#DF3636">网点查询</view>
              <view class="color-#C9AAAA text-20rpx line-height-36rpx">
                查询附近社保业务办理网点
              </view>
              <view class="bb-2px_#DF3636 w-60rpx mt-10rpx"></view>
            </view>

            <view class="self-end mt-auto">
              <wd-img :src="fwwdicon" width="120rpx" height="120rpx"></wd-img>
            </view>
          </view> -->
    <!-- <view
            class="bg-no-repeat box-border pl-20rpx pr-20rpx flex h-54px justify-between"
            :style="`background-image: url(${cjwtbg}); background-size: 100% 110%;border-radius: 3px;align-items:center;`"
            @click="toServhFor2(7)"
          >
            <view class="flex" style="align-items: center">
              <wd-img :src="cjwticon" width="32px" height="32px" custom-class="pt-5px"></wd-img>
              <view class="text-32rpx font-600 color-#EC5E0C">常见问题</view>
              <view class="color-#D2B783 text-20rpx line-height-30rpx mt-5px ml-5px">
                /快速答疑
              </view>
            </view>
            <view class>
              <wd-img :src="cjwtArrowIcon" width="7px" height="13px"></wd-img>
            </view>
          </view> -->
    <!-- </view> -->
    <!-- </view>
    </view> -->
  </view>
  <wd-gap height="10" bg-color="#F2F3F7"></wd-gap>
</template>
<style>
page {
  background: linear-gradient(180deg, #d1e8ff, #f7f7f7, #f2f3f7);
  background-color: #f2f3f7;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
<style lang="scss" scoped>
:deep(.nav_show) {
  @apply bg-transparent !;
}

:deep(.nav_hide) {
  @apply bg-#2B66ED ! color-#fff !;
}

.serch-bg {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 6px 6px 6px 6px;
}

.search-type::after {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: -10px;
  width: 1px;
  content: '';
  background: rgba(255, 255, 255, 0.65);
}

.swiper {
  --wot-swiper-radius: 0;
  --wot-swiper-item-padding: 0 24 rpx;
  --wot-swiper-nav-dot-color: #fff;
  --wot-swiper-nav-dot-active-color: #4d80f0;
}

:deep(.custom-class-noticebar) {
  @apply p-0 ! bg-transparent ! color-#333 ! text-14px ! w-60vw overflow-hidden truncate-1 ! text-28rpx !;
  text-overflow: ellipsis;
}

.menuitem:first-child {
  margin-left: 10px !important;
}

.fwzq {
  margin-bottom: 10px;
}
/*  #ifdef  MP-ALIPAY  */
.al-Left {
  @apply pl-30px mt-[-2px];
}
/*  #endif  */

.rmfw {
  background: linear-gradient(180deg, #e0eeff 0%, #ffffff 100%);
}
.sweepBox {
  position: absolute;
  top: 20px;
  right: 30px;
  z-index: 99;
  font-size: 12px;
  color: #fff;
}
</style>
