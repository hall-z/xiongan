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
import { get8service } from '@/service/api/source'
import { routeTo } from '@/utils'
import { getLocation, useToLocation, useToPhone } from '@/utils/uniapi'
import { useToast } from 'wot-design-uni'

import { useBaseStore } from '@/store'
import dizhi from '../static/images/zhenwu/dizhi.png'
import phone from '../static/images/zhenwu/phone.png'
import time from '../static/images/zhenwu/time.png'
import zhenwu from '../static/images/zhenwu/zhenwu.png'
import zhenwuTitle from '../static/images/zhenwu/zhenwuTitle.png'
import zhenwuicon from '../static/images/zhenwu/zhenwuicon.png'
const baseStore = useBaseStore()

// import SugItem from './components/SugItem.vue'
// import useSuggest from './utils/useSuggest'
const toast = useToast()

onMounted(async () => {
  location()
})
function toDetil(item) {
  routeTo({
    url: '/pages-sub/userManager/suggest/suggestDetil',
    data: { id: item.adviceId },
  })
  const areaCode = ref([])
}
const areaList = ref([
  {
    title: '雄县',
    value: '130638',
    select: false,
  },
  {
    title: '容城县',
    value: '130629',
    select: false,
  },
  {
    title: '安新县',
    value: '130632',
    select: false,
  },
])

const paging = ref(null)
const dataList = ref([])
const queryList = async (pageNo, pageSize) => {
  const params = {
    page: pageNo,
    size: pageSize,
    latitude: baseStore.userLocation.latitude ? baseStore.userLocation.latitude : '',
    longitude: baseStore.userLocation.longitude ? baseStore.userLocation.longitude : '',
    sceneType: 1,
  }
  // 调用接口获取数据
  try {
    await get8service(params).then((res) => {
      console.log('resresresresresres', res)
      dataList.value = res!.content as any
      paging.value.complete(dataList.value)
    })
  } catch (error) {
    paging.value.complete(false)
  }
}
const timeShow = ref(false)
const currentData = ref()

function timeClick(item) {
  currentData.value = item
  timeShow.value = true
}

function timeclose(e) {
  timeShow.value = false
}

const footerBtns2 = ref([
  {
    text: '办事预约',
    size: 'medium',
    round: false,
    plain: true,
    type: 'primary',
    action: 'continue',
    customClass: 'btn-class',
  },
  {
    text: '预约记录',
    size: 'medium',
    round: false,
    plain: true,
    type: 'primary',
    customClass: 'custom-class-mine-dyinfo',
    action: 'over',
  },
])
const location = async () => {
  try {
    if (baseStore.userLocation.latitude) {
      return
    }
    const location = await getLocation()
    await baseStore.setLocation(location)
    paging.value.reload()
  } catch (error) {
    console.log('🍺[error]:', error)
  }
}

async function btnClick(item) {
  toast.show('功能开发中，敬请期待!...')
}
</script>
<template>
  <view class="size-100% fixed top-0 right-0 left-0 bottom-0 bg-no-repeat z-[-1] dy-blue-bg"></view>
  <z-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    :auto-show-system-loading="true"
    :safe-area-inset-bottom="true"
  >
    <template #top>
      <!-- 顶部 -->
      <dy-navbar leftTitle="" left isNavShow color="#000"></dy-navbar>
      <view class="flex justify-around items-center px-10px">
        <wd-img :src="zhenwuTitle" width="187" height="81"></wd-img>
        <wd-img :src="zhenwu" width="174" height="174"></wd-img>
      </view>
    </template>
    <view class="px-10px pt-10px">
      <view
        class="px-10px py-3px bg-#fff rounded-5px mb-10px"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <view class="flex justify-between items-center py-10px">
          <view class="flex items-center gap-5px">
            <wd-img :src="zhenwuicon" width="18" height="18"></wd-img>
            <view class="text-16px font-600">{{ item.name }}</view>
          </view>
          <view class="flex items-center gap-5px" @click="timeClick(item)">
            <wd-img :src="time" width="18" height="18"></wd-img>
            <view class="text-12px color-#2D69EF">办理时间</view>
          </view>
        </view>
        <view
          class="flex justify-between items-center py-10px bb-1px_#ECECEC_dashed ml-20px pr-10px text-14px color-#999"
          @click="useToLocation(item)"
        >
          <view>地址: {{ item.address }}</view>
          <view>
            <wd-img :src="dizhi" width="16" height="18"></wd-img>
          </view>
        </view>
        <view
          class="flex justify-between items-center py-10px ml-20px pr-10px text-14px color-#999"
          @click="useToPhone(item.phone)"
        >
          <view>电话: {{ item.phone }}</view>
          <view>
            <wd-img :src="phone" width="16" height="16"></wd-img>
          </view>
        </view>

        <view class="tags FHcl mb-10px pl-20px">
          <view
            class="tagitem FHcl"
            style="padding: 3px 7px; margin: 0 10px 0 0; background: #f0f5fe; border-radius: 3px"
            v-if="item.card === '1'"
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
            v-if="item.socialCard === '1'"
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
      </view>
    </view>
    <!-- <template #bottom>
      <!~~ 底部 ~~>
      <view class="p-10px bg-#fff">
        <view class="flex gap-15px">
          <view class="flex-1" v-for="(item, index) in footerBtns2" :key="index">
            <wd-button
              :round="item.round"
              block
              :size="item.size"
              :type="item.type"
              :customClass="item.customClass"
              @click="btnClick(item)"
            >
              {{ item.text }}
            </wd-button>
          </view>
        </view>
      </view>
    </template>-->
  </z-paging>
  <wd-popup
    v-model="timeShow"
    custom-style=""
    @close="timeShow = false"
    custom-class="custom-class-pop"
  >
    <view class="bg-#fff rounded-5px p-10px pb-30px relative">
      <view class="text-center text-18px font-600 py-10px">办理时间</view>
      <view class="absolute top-20px right-20px" @click="timeShow = false">
        <wd-icon name="close" size="18px" color="#000"></wd-icon>
      </view>

      <view
        class="py-5px color-#555 text-16px px-15px"
        v-if="currentData && currentData.opennessTime"
      >
        {{ currentData.opennessTime }}
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
:deep(.z-paging-content) {
  background: linear-gradient(180deg, #d6eafe 0%, #f3f4f6 40%, #f2f3f7 100%) !important;
}

:deep(.custom-class-pop) {
  @apply w-80%  rounded-10px;
}
</style>
