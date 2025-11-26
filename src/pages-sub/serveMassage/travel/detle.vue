<route lang="json5">
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
import { formatHTML } from '@/utils/index'
import useTravel from './utils/useTravel'

import { get8serviceByid } from '@/service/api/source'
import { useBaseStore } from '@/store'
import { getLocation, useToLocation } from '@/utils/uniapi'
import dizhi from '../static/images/travel/dzl.png'

onMounted(async () => {
  location()
})

const baseStore = useBaseStore()
const { list } = useTravel()
const index = ref(0)
const content = ref('')
const ArrImg = ref([])
const data = ref<any>()
onLoad(async (options) => {
  await get8serviceByid({
    latitude: baseStore.userLocation.latitude ? baseStore.userLocation.latitude : '',
    longitude: baseStore.userLocation.longitude ? baseStore.userLocation.longitude : '',
    sceneType: 3,
    id: options.index,
  }).then((res) => {
    data.value = res

    console.log(JSON.parse(data.value.scenicImg))
    data.value.scenicImg = JSON.parse(data.value.scenicImg)

    ArrImg.value = []
    data.value.scenicImg.forEach((e) => {
      ArrImg.value.push(e.url)
    })

    content.value = formatHTML(data.value.sectorContent)

    console.log('content', content)
  })
})
const location = async () => {
  try {
    const location = await getLocation()
    await baseStore.setLocation(location)
  } catch (error) {
    console.log('🥜[error]:', error)
    // uni.showToast({ title: '定位失败', icon: 'none' })
  }
}
</script>

<template>
  <dy-content customClass="z-paging-content">
    <template #top>
      <dy-navbar leftTitle="详情" left color="#000" :placeholder="false"></dy-navbar>
    </template>
    <wd-swiper
      :list="ArrImg"
      :autoplay="true"
      :current="0"
      :height="300"
      custom-indicator-class="custom-indicator-class"
      customClass="custom-class-swiper"
      imageMode="scaleToFill"
      indicatorPosition="bottom-right"
    ></wd-swiper>

    <view class="bg-#fff rounded-t-10px relative z-index-99 p-20px">
      <view>
        <view class="flex justify-between items-center">
          <view class="text-20px font-600" v-if="data.name">{{ data.name }}</view>
          <view class="text-14px color-#F44D24" v-if="data.level">{{ data.level }} 景区</view>
        </view>
        <view class="flex justify-between items-start my-10px">
          <view class="text-14px color-#999 line-height-20px mt-5px">
            <view class="">地址: {{ data.address }}</view>
            <view>距您: {{ data.distance.toFixed(2) }}km</view>
          </view>
          <view @click="useToLocation(data)" class="ml-10px mt-5px">
            <wd-img :src="dizhi" width="16" height="18"></wd-img>
          </view>
        </view>
        <view class="tags FHcl mb-10px">
          <view
            class="tagitem FHcl"
            style="padding: 3px 7px; margin: 0 10px 0 0; background: #f0f5fe; border-radius: 3px"
            v-if="data.card === '1'"
          >
            <view
              class="tagicon"
              style="
                width: 14px;
                height: 14px;
                margin-right: 5px;
                line-height: 14px;
                color: #fff;
                text-align: center;
                background: #3e82f6;
                border-radius: 10px;
              "
            >
              <wd-icon name="check-bold" size="12px"></wd-icon>
            </view>
            <view style="font-size: 12px; color: #3e82f6">实体社保卡</view>
          </view>

          <view
            class="tagitem FHcl"
            style="padding: 3px 7px; margin: 0 10px 0 0; background: #edf7f6; border-radius: 3px"
            v-if="data.socialCard === '1'"
          >
            <view
              class="tagicon"
              style="
                width: 14px;
                height: 14px;
                margin-right: 5px;
                line-height: 14px;
                color: #fff;
                text-align: center;
                background: #539587;
                border-radius: 10px;
              "
            >
              <wd-icon name="check-bold" size="12px"></wd-icon>
            </view>
            <view style="font-size: 12px; color: #539587">电子社保卡</view>
          </view>
        </view>
        <view class="text-14px color-#333" v-if="data.opennessTime">开放时间</view>
        <view class="text-14px color-#999 mt-10px" v-if="data.opennessTime">
          <view>{{ data.opennessTime }}</view>
        </view>
        <view class="bb-1px_#ECECEC_dashed my-20px"></view>
      </view>
      <view>
        <view class="text-16px font-600 mb-15px">景区简介</view>

        <rich-text :nodes="content" class="sectorContent"></rich-text>
      </view>
    </view>
  </dy-content>
</template>

<style lang="scss" scoped>
:deep(.z-paging-content) {
  background: linear-gradient(180deg, #d6eafe 0%, #f3f4f6 40%, #f2f3f7 100%) !important;
}

:deep(.custom-class-swiper) {
  @apply rounded-0!;
}

:deep(.wd-swiper__track) {
  @apply rounded-0!;
}

.sectorContent {
  position: relative;
  margin-top: 15px;
  font-family: 'San Francisco', Rotobo, arial, 'PingFang SC', 'Noto SansCJK', 'Microsoft Yahei',
    sans-serif;
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}
</style>
