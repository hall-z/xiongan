<route lang="json5" type="page">
{
  needLogin: true,
  style: {
    navigationBarTitleText: '网点查询',
    backgroundColor: '#fff',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  },
}
</route>

<script lang="ts" setup>
import defaultImg from '@/static/images/sblogo.png'
import { useBaseStore } from '@/store'
import { getLocation, useToPhone } from '@/utils/uniapi'
import axls from '../static/images/businessOutlets/axls.png'
import gdyh from '../static/images/businessOutlets/gdyh.png'
import gsyh from '../static/images/businessOutlets/gsyh.png'
import jsyh from '../static/images/businessOutlets/jsyh.png'
import jtyh from '../static/images/businessOutlets/jtyh.png'
import nyyh from '../static/images/businessOutlets/nyyh.png'
import zgyh from '../static/images/businessOutlets/zgyh.png'
import zxyh from '../static/images/businessOutlets/zxyh.png'
import useBusinessOutlets from './hooks/businessOutlets'
onMounted(async () => {
  location()
})
const baseStore = useBaseStore()
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

const bankLogoList = ref([
  {
    logo: gsyh,
    title: '工商银行',
    value: '102',
    select: false,
  },
  {
    logo: nyyh,
    title: '农业银行',
    value: '103',
    select: false,
  },
  {
    logo: zgyh,
    title: '中国银行',
    value: '104',
    select: false,
  },
  {
    logo: jsyh,
    title: '建设银行',
    value: '105',
    select: false,
  },
  {
    logo: jtyh,
    title: '交通银行',
    value: '301',
    select: false,
  },
  // {
  //   logo: gdyh,
  //   title: '招商银行',
  //   value: '302',
  // },

  {
    logo: zxyh,
    title: '中信银行',
    value: '302',
    select: false,
  },
  {
    logo: gdyh,
    title: '光大银行',
    value: '303',
    select: false,
  },
  {
    logo: axls,
    title: '河北农信社',
    value: '402',
    select: false,
  },
  // {
  //   logo: '',
  //   title: '浦发银行',
  // },
  // {
  //   logo: '',
  //   title: '邮政储蓄银行',
  // },
  // {
  //   logo: '',
  //   title: '民生银行',
  // },
])
const wangDianList = ref([
  {
    title: '人社网点',
    value: '999',
    select: false,
  },
])

function getLogo(data: string) {
  return bankLogoList.value.find((item) => data === item.value)?.logo ?? defaultImg
}

const { sendbranchesInfo, loading, cardInfoData } = useBusinessOutlets()

function toPhone(e) {
  useToPhone(e.phone)
}

function toLocation(e) {
  uni.openLocation({
    latitude: e.dimension * 1,
    longitude: e.longitude * 1,
    name: e.name,
    address: e.address,
  })
}

const paging = ref(null)
const dataList = ref([])
const location = async () => {
  try {
    const location = await getLocation()
    await baseStore.setLocation(location)
    paging.value.reload()
  } catch (error) {
    uni.showToast({ title: '定位失败', icon: 'none' })
    paging.value.reload()
  }
}

const queryList = async (pageNo, pageSize) => {
  // 调用接口获取数据
  try {
    const params = {
      number: pageNo,
      size: pageSize,
      yhdm: '',
      areaCode: '',
      isMail: '',
      wdName: wdName.value ? wdName.value : '',
      backCodeList: backCodeList.value ? backCodeList.value : '',
      areaCodeList: areaCodeList.value ? areaCodeList.value : '',
      longitude: baseStore.userLocation?.longitude?.toString(),
      dimension: baseStore.userLocation?.latitude?.toString(),
    }
    await sendbranchesInfo(params)
    paging.value.complete(cardInfoData.value.content)
  } catch (error) {
    console.log('🥒[error]:', error)
    paging.value.complete(false)
  }
}
const changeDe = (data) => {
  const company = 'km'
  let num = '0'
  num = (data / 1000).toFixed(1)
  return num + company
}

const searchBack1 = ref([])
const searchBack2 = ref([])
const backCodeList = ref([])
const areaCodeList = ref([])
const wdName = ref('')
const searchArea = ref([])

const blur = () => {
  console.log('blur')
}
const search = () => {
  paging.value.reload()
}

const cancel = () => {
  paging.value.reload()
}

function fuzzyQuery(list, keyWord, key) {
  const arr = []
  for (let i = 0; i < list.length; i++) {
    if (list[i][key].indexOf(keyWord) >= 0) {
      arr.push(list[i])
    }
  }
  console.log(arr)
  return arr
}

const show = ref(false)
const handleOpen = () => {
  show.value = true
}
const handleClose = () => {
  show.value = false
  handleReset()
}
const handleReset = () => {
  searchBack1.value = []
  searchBack2.value = []
  searchArea.value = []
}
const handleConfirms = () => {
  show.value = false
  backCodeList.value = [...searchBack1.value, ...searchBack2.value]
  areaCodeList.value = searchArea.value
  wdName.value = ''
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
onLoad((options) => {
  uni.setNavigationBarTitle({
    title: options.title ? decodeURIComponent(options.title) : '网点查询',
  })
})
</script>

<template>
  <!-- <view v-if="!baseStore.userLocation.longitude">
    <wd-status-tip image="search" tip="暂无网点信息" />
  </view> -->

  <z-paging
    ref="paging"
    v-model="dataList"
    :refresher-enabled="false"
    :loading-more-enabled="false"
    :auto-show-system-loading="true"
    @query="queryList"
    :auto="false"
  >
    <template #top>
      <view style="padding: 15px 15px 5px 15px" class="FHcs">
        <wd-input
          no-border
          v-model="wdName"
          prefix-icon="search"
          custom-class="searchBox"
          placeholder="请输入网点名称"
          @input="searchchange"
          :paging-style="{
            flex: 1,
          }"
        >
          <template #suffix>
            <view class="searchBtn" @click="search">搜索</view>
          </template>
        </wd-input>
        <view class="searchBtn2 FHcr" @click="search" @click.stop="handleOpen">
          筛选
          <wd-icon name="caret-down-small" size="22px"></wd-icon>
        </view>
      </view>
      <view class="tagsBox overflow-x-auto!">
        <template v-for="(it, index) in areaList" :key="index">
          <wd-tag type="primary" custom-class="tag" plain v-if="searchArea.includes(it.value)">
            {{ it.title }}
          </wd-tag>
        </template>
        <template v-for="(it, index) in bankLogoList" :key="index">
          <wd-tag type="primary" custom-class="tag" plain v-if="searchBack1.includes(it.value)">
            {{ it.title }}
          </wd-tag>
        </template>
        <template v-for="(it, index) in wangDianList" :key="index">
          <wd-tag type="primary" custom-class="tag" plain v-if="searchBack2.includes(it.value)">
            {{ it.title }}
          </wd-tag>
        </template>
      </view>
      <wd-popup
        v-model="show"
        position="right"
        custom-style="width: 250px;"
        @close="handleClose"
        custom-class="popup-class"
      >
        <view class="p-10px pr-0" style="padding-top: 15px">
          <view class="text-14px color-#333 mt-20px mb-0px">区域</view>
          <view>
            <wd-checkbox-group v-model="searchArea" shape="button" max-width="10">
              <wd-checkbox :modelValue="item.value" v-for="(item, index) in areaList" :key="index">
                {{ item.title }}
              </wd-checkbox>
            </wd-checkbox-group>
          </view>
          <view class="text-14px color-#333 mt-20px mb-15px">银行网点</view>
          <view>
            <wd-checkbox-group v-model="searchBack1" shape="button" max-width="10">
              <wd-checkbox
                :modelValue="item.value"
                v-for="(item, index) in bankLogoList"
                :key="index"
              >
                {{ item.title }}
              </wd-checkbox>
            </wd-checkbox-group>
          </view>
          <view class="text-14px color-#333 mt-20px mb-15px">人社网点</view>
          <view>
            <wd-checkbox-group v-model="searchBack2" shape="button" max-width="10">
              <wd-checkbox
                :modelValue="item.value"
                v-for="(item, index) in wangDianList"
                :key="index"
              >
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
    <view>
      <wd-gap bg-color="#f5f5f5"></wd-gap>
      <view class="p-10px">
        <!-- <dy-title title="服务网点" class="py-10px"></dy-title> -->
        <wd-cell-group border>
          <view v-for="(item, index) in dataList" :key="index" :to="item.url">
            <wd-cell custom-class="cell-item" title-width="60%">
              <template #icon>
                <view class="mt-10px mr-10px flex flex-col items-center justify-center">
                  <wd-img :src="getLogo(item.backCode)" :width="30" :height="30"></wd-img>
                </view>
              </template>
              <template #title>
                <view class="truncate-2 color-#000">{{ item.name }}</view>
              </template>
              <template #label>
                <view class="color-#999 truncate-2" @click="toLocation(item)">
                  地址: {{ item.address }}
                </view>
              </template>

              <view class="pt-10px">
                <view class="color-#999" v-if="item.distance">
                  距离: {{ changeDe(item.distance) }}
                </view>
                <view class="flex gap-20px justify-end mt-4px">
                  <view class="flex flex-col items-center" @click="toLocation(item)">
                    <view class="i-carbon-location-heart-filled color-#999"></view>
                    <view class="text-center color-#999">导航</view>
                  </view>
                  <view class="flex flex-col items-center" @click="toPhone(item)">
                    <view class="i-carbon-phone-voice-filled color-#999"></view>
                    <view class="text-center color-#999">电话</view>
                  </view>
                </view>
              </view>
            </wd-cell>
            <view class="flex gap-5px flex-wrap pl-40px pb-10px">
              <view
                v-if="item.top === '3'"
                class="bg-#F7F7F7 px-10px rounded-4px color-#A6B2C0 text-10px mt-5px tag"
                style="border: 1px solid #d9dee6"
              >
                线下申领
              </view>
              <view
                v-if="item.line === '0'"
                class="bg-#E9F0FF px-10px rounded-4px color-#4E85FF bb-1px_#D5E3FF text-10px mt-5px tag"
              >
                线上申领
              </view>
              <view
                v-if="item.mail === '1'"
                class="bg-#FFF4E9 px-10px rounded-4px color-#FF8A24 bb-1px_#FFE8D1 text-10px mt-5px tag"
              >
                支持邮寄
              </view>
            </view>
          </view>
        </wd-cell-group>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
:deep(.grid-item .wd-grid-item__wrapper) {
  @apply size-auto!;
}

:deep(.wd-cell__wrapper) {
  padding-bottom: 0 !important;
}

:deep(.cell-item) {
  @apply pl-0! b-b-amber! items-center;
}

:deep(.custom-class-serch) {
  // @apply bg-#fff!;
  // @apply p-0!;
  .wd-search__block {
    @apply rounded-0! w-60%!;
  }

  // .wd-search__cancel {
  //   @apply text-14px;
  // }
}

// .search-type::after {
//   position: absolute;
//   top: 2px;
//   bottom: 2px;
//   left: -5px;
//   width: 1px;
//   content: '';
//   background: #333;
// }
:deep(.popup-class) {
  /* #ifdef H5 */
  @apply pt-44px!;
  /* #endif */
}

:deep(.wd-radio-group) {
  @apply flex flex-wrap gap-10px! mt-10px!;
}

// :deep(.wd-radio.is-button .wd-radio__label) {
//   @apply rounded-4px! bg-#EFF4FF! color-#2D69EF!;
// }
// :deep(.wd-radio.is-button.is-checked .wd-radio__label) {
//   @apply bg-#2D69EF!  color-#fff!;
// }

:deep(.searchBox) {
  box-sizing: border-box;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 10px 0px 10px 10px;
  background: rgba(199, 199, 199, 0.18) !important;
  border: none;
  border-radius: 6px 6px 6px 6px;

  .wd-icon-search {
    background: transparent !important;
  }

  .searchBtn {
    height: 16px;
    padding: 0 15px;
    margin: 0;
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    border-left: 1px solid #000000;
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

:deep(.imgbg) {
  background: #f5f5f5;
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
  padding-bottom: 5px;
  overflow: hidden;
  white-space: nowrap;

  :deep(.tag) {
    @apply ml-10px;
    &:first-child {
      margin-left: 20px;
    }
  }
}
.tag {
  padding: 2px 4px;
}
</style>
