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
import { useBaseStore } from '@/store'
import { routeTo } from '@/utils'
import { getLocation, useToLocation } from '@/utils/uniapi'
import { useToast } from 'wot-design-uni'

import { get8service } from '@/service/api/source'
import bgimg from '../static/images/yiyao/bgimg.png'
import title from '../static/images/yiyao/title.png'
import icon from '../static/images/yiyao/yyicon.png'
import dizhi from '../static/images/zhenwu/dizhi.png'
import useYiyao from './utils/useYiyao'

onMounted(async () => {
  location()
})
const baseStore = useBaseStore()

const { list } = useYiyao()
const tab = ref('3')
const tablist = ref([
  {
    index: '3',
    title: '就医购药',
  },
  {
    index: '4',
    title: '体检机构',
  },
])

const toast = useToast()

function toDetil(item) {
  routeTo({
    url: '/pages-sub/userManager/suggest/suggestDetil',
    data: { id: item.adviceId },
  })
}

const paging = ref(null)
const dataList = ref([])
const queryList = async (pageNo, pageSize) => {
  const params = {
    page: pageNo,
    size: pageSize,
    latitude: baseStore.userLocation.latitude ? baseStore.userLocation.latitude : '',
    longitude: baseStore.userLocation.longitude ? baseStore.userLocation.longitude : '',
    sceneType: 5,
    areaCode: areaCode.value ? areaCode.value.join(',') : '',
    name: name.value,
  }
  // 调用接口获取数据
  try {
    const res: any = await get8service(params)
    paging.value.complete(res.content)
  } catch (error) {
    paging.value.complete(false)
  }
}
const timeShow = ref(false)

function timeclose(e) {
  timeShow.value = false
}
const areaCode = ref([])
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

async function btnClick(item) {
  toast.show('功能开发中，敬请期待!...')
}

const show = ref(false)
const searchArea = ref([])
const name = ref('')
const handleOpen = () => {
  show.value = true
}
const handleClose = () => {
  show.value = false
  handleReset()
}
const handleReset = () => {
  areaCode.value = []
  name.value = ''
}
const handleConfirms = () => {
  show.value = false

  paging.value.reload()
}
const search = () => {
  paging.value.reload()
}
const searchchange = ({ value }) => {
  if (value === '') {
    handleChange()
  }
}
const handleChange = () => {
  paging.value.reload()
}
const url0 = 'https://oss.xay.xacloudy.cn/images/2025-04/e8880306-1cc3-4efc-b8aa-3435bf231ecf1.png'
const url1 = 'https://oss.xay.xacloudy.cn/images/2025-04/1d76074c-55ed-4c7c-b0ec-1ac7251b56ae2.png'
const curl = ref(`url(${url0})`)
const changeTab = (e) => {
  curl.value = e.index === 0 ? `url(${url0})` : `url(${url1})`
  tab.value = e.name
  areaCode.value = []
  paging.value.reload()
}
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
</script>
<template>
  <view class="size-100% fixed top-0 right-0 left-0 bottom-0 bg-no-repeat z-[-1] dy-blue-bg"></view>
  <z-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    :auto-show-system-loading="true"
    :safe-area-inset-bottom="true"
    :loading-more-enabled="false"
  >
    <template #top>
      <!-- 顶部 -->
      <dy-navbar leftTitle="" left isNavShow color="#000"></dy-navbar>
      <view class="flex justify-around items-center px-10px">
        <wd-img :src="title" width="187" height="81"></wd-img>
        <wd-img :src="bgimg" width="174" height="174"></wd-img>
      </view>
      <wd-tabs v-model="tab" @change="changeTab">
        <block v-for="item in tablist" :key="item.index">
          <wd-tab :title="item.title" :name="item.index"></wd-tab>
        </block>
      </wd-tabs>
      <view class="">
        <view class="px-10px py-15px FHcs bg-#fff">
          <wd-input
            no-border
            v-model.trim="name"
            custom-class="searchBox"
            placeholder="请输入搜索关键词"
            @input="searchchange"
            :paging-style="{
              flex: 1,
            }"
          >
            <template #suffix>
              <view class="searchBtn" @click="search">
                <wd-icon name="search" size="14px"></wd-icon>
              </view>
              <!--            <view class="searchBtn" @click="search"></view>-->
            </template>
          </wd-input>
          <view class="searchBtn2 FHcr" @click="search" @click.stop="handleOpen">
            筛选
            <wd-icon name="caret-down-small" size="22px"></wd-icon>
          </view>
        </view>
        <view class="tagsBox" v-show="areaList && areaList.length > 0">
          <template v-for="(it, index) in areaList" :key="index">
            <wd-tag type="primary" custom-class="tag" plain v-if="areaCode.includes(it.value)">
              {{ it.title }}
            </wd-tag>
          </template>
        </view>
      </view>

      <wd-popup
        v-model="show"
        position="right"
        custom-style="width: 250px;"
        @close="handleClose"
        custom-class="popup-class"
      >
        <view class="p-10px pr-0" style="padding-top: 85px">
          <view class="text-14px color-#333 mt-20px mb-0px">区域</view>
          <view>
            <wd-checkbox-group v-model="areaCode" shape="button" max-width="10">
              <wd-checkbox :modelValue="item.value" v-for="(item, index) in areaList" :key="index">
                {{ item.title }}
              </wd-checkbox>
            </wd-checkbox-group>
          </view>
          <view class="absolute bottom-10px left-0 right-0 p-10px p-20px">
            <view class="flex justify-around gap-10px">
              <view class="flex-1">
                <wd-button size="small" plain @click="handleReset" block :round="false">
                  重置
                </wd-button>
              </view>
              <view class="flex-1">
                <wd-button size="small" type="primary" @click="handleConfirms" block :round="false">
                  确定
                </wd-button>
              </view>
            </view>
          </view>
        </view>
      </wd-popup>
    </template>
    <view class="px-15px">
      <template v-for="(item, index) in dataList" :key="index">
        <view class="px-10px py-3px bg-#f7f7f7 rounded-5px mb-10px" v-show="item.position === tab">
          <view class="flex justify-between items-center pt-10px">
            <view class="flex items-center gap-5px">
              <wd-img :src="icon" width="18" height="18"></wd-img>
              <view class="text-16px font-600">{{ item.name }}</view>
            </view>
          </view>
          <view
            class="flex justify-between items-center py-7px bb-1px_#ECECEC_dashed ml-20px pr-10px text-14px color-#999"
          >
            <view @click="useToLocation(item)">地址: {{ item.address }}</view>
            <view></view>
          </view>
          <view
            class="flex justify-between items-center py-8px ml-20px pr-10px text-14px color-#999"
          >
            <!-- haversineDistance(item.distance) -->
            <view>距你: {{ item.distance.toFixed(2) }}公里</view>
            <view @click="useToLocation(item)">
              <wd-img :src="dizhi" width="16" height="18"></wd-img>
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
      </template>
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
</template>

<style lang="scss" scoped>
:deep(.z-paging-content) {
  background: linear-gradient(180deg, #d6eafe 0%, #fff 40%, #fff 100%) !important;
}
:deep(.wd-tabs) {
  @apply rounded-10px! h-52px!;
}
:deep(.wd-tabs__nav) {
  @apply h-100%!;
}

:deep(.wd-tabs__nav-item) {
  @apply bg-#D1E8FF!  line-height-52px! h-100%!;
}

:deep(.is-active) {
  background-color: #fff;
  background-image: v-bind(curl);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

:deep(.searchBox) {
  box-sizing: border-box;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 10px 10px 5px 10px;
  background: rgba(199, 199, 199, 0.18) !important;
  border: none;
  border-radius: 6px 6px 6px 6px;

  .wd-icon-search {
    background: transparent !important;
  }

  .searchBtn {
    display: inline-block;
    height: 16px;
    padding: 0 5px;
    margin: 0;
    font-size: 14px;
    line-height: 16px;
    color: #a7a7a7;
  }
}

.searchBtn2 {
  height: 30px;
  padding-left: 10px;
  margin-right: -12px;

  font-size: 14px;
  line-height: 30px;
  color: #000000;
  text-align: center;
}
:deep(.popup-class) {
  /* #ifdef H5 */
  @apply pt-44px!;
  /* #endif */
}
:deep(.wd-icon.wd-checkbox__btn-check) {
  display: none;
  padding: 0;
  margin: 0;
}

:deep(.wd-checkbox.is-button-box) {
  box-sizing: border-box !important;
  display: inline-flex;
  width: 48% !important;
  padding: 6px !important;
  margin: 0 !important;
}

.tagsBox {
  padding-bottom: 0px;
  overflow: hidden;
  white-space: nowrap;
  background: #fff;

  :deep(.tag) {
    @apply ml-10px  mb-10px;
    &:first-child {
      margin-left: 20px;
    }
  }
}
</style>
