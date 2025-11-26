<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
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
import { getRecommendProductList } from '@/service/api/shop'
import { routeTo } from '@/utils'
const indexbg1 = ref('https://oss.xay.xacloudy.cn/images/2025-01/66cbd6fc-3bf0-4d51-bb6e-e70de50f9b65shop_nav101.jpg')
const indexbg2 = ref('https://oss.xay.xacloudy.cn/images/2025-01/941d7208-262d-40ef-84de-56f8e9e7f426shop_nav102.jpg')
const indexbg3 = ref('https://oss.xay.xacloudy.cn/images/2025-01/f6bbb7dd-7840-4726-8f4f-4049b09a0ee5shop_nav103.jpg')
const indexbg4 = ref('https://oss.xay.xacloudy.cn/images/2025-01/305f9e2d-90d6-4b43-89c3-c2db0a6b512cshop_nav104.jpg')
const indexbg5 = ref('https://oss.xay.xacloudy.cn/images/2025-01/d2dfdf55-8982-46dc-9fe1-5f721fdc871ashop_nav105.jpg')
const indexbg6 = ref('https://oss.xay.xacloudy.cn/images/2025-01/a9d2808f-5711-4284-8b09-3d79e24e290eshop_nav106.jpg')
const indexbg7 = ref('https://oss.xay.xacloudy.cn/images/2025-01/e21a2d1c-9af0-4f11-bcac-e8acfd4b7135shop_nav107.jpg')
const indexbg8 = ref('https://oss.xay.xacloudy.cn/images/2025-01/04a5e029-a0ac-4de1-a153-50a8aef5950dshop_nav108.jpg')

const topbgBase64 = ref('')
const searchIcon = ref('')
const carIcon = ref('')
const paging = ref(null)
const goodList = ref([])
const isGrid = ref(true)
const sortIndex = ref(0)

const subjectType = ref(0)

const model = reactive({
  pullTimeOrder: '', // 上架时间排序
  priceOrder: '', // 价格排序
})
onLoad(async (e) => {
  if (e.type === '1') {
    // 热销商品
    topbgBase64.value = indexbg1.value
    subjectType.value = 1
  } else if (e.type === '2') {
    // 人气榜单

    topbgBase64.value = indexbg2.value
    subjectType.value = 2
  } else if (e.type === '3') {
    // 新品上市

    topbgBase64.value = indexbg3.value
    subjectType.value = 3
  } else if (e.type === '4') {
    // 推荐好物
    topbgBase64.value = indexbg4.value
    subjectType.value = 4
  } else if (e.type === '5') {
    // 平台自营
    topbgBase64.value = indexbg5.value

    subjectType.value = 5
  } else if (e.type === '6') {
    // 特惠福利
    topbgBase64.value = indexbg6.value
    subjectType.value = 6
  } else if (e.type === '7') {
    // 限时折扣
    topbgBase64.value = indexbg7.value
    subjectType.value = 7
  } else if (e.type === '8') {
    // 限时折扣
    topbgBase64.value = indexbg8.value
    subjectType.value = 8
  }
})
onShow(() => {})

const changeSort = (k) => {
  sortIndex.value = k
  switch (k) {
    case 0:
      model.pullTimeOrder = ''
      model.priceOrder = ' '
      break
    case 1:
      model.pullTimeOrder = model.pullTimeOrder === '' ? '1' : model.pullTimeOrder === '2' ? '1' : '2'
      model.priceOrder = ' '
      break
    case 2:
      model.pullTimeOrder = ''
      model.priceOrder = model.priceOrder === '' ? '1' : model.priceOrder === '2' ? '1' : '2'
      break
    default:
      break
  }
  paging.value.reload()
  // 重新排序
}

function changeGrid() {
  isGrid.value = !isGrid.value
}

const getLsit = async (pageNo: number, pageSize: number) => {
  try {
    const res: any = await getRecommendProductList({
      current: pageNo,
      size: pageSize,
      ...model,
      subjectType: subjectType.value,
    })
    console.log('商城列表', res)

    paging.value.complete(res.content)
  } catch {
    console.log('????')
    paging.value.complete(false)
  }
}
const getUrl = (str) => {
  console.log(str)
  if (str) {
    return JSON.parse(str)[0].data
  } else {
    return ''
  }
}

function handleChange(val, type) {
  model[type] = val === 1 ? 1 : 2
  paging.value.reload()
}
</script>
<template>
  <view
    class="box-border w-full h-205px fixed pos-top-none bg-no-repeat bg-cover z-999"
    :style="` background-image: url(${topbgBase64});background-size: 100% 99%`"
  >
    <dy-navbar custom-class="nav_custom" left isNavShow></dy-navbar>
    <!--    <view class="w-full h-full mt&#45;&#45;90px flex justify-around items-center">-->
    <!--      <wd-img :width="129" :height="48" :src="titleIcon" custom-class="mt-10px" />-->
    <!--      <wd-img :width="222" :height="148" :src="titleBgIcon" custom-class="mb-30px" />-->
    <!--    </view>-->
  </view>

  <view
    class="w-full box-border flex pos-fixed z-999 pos-top-184px overflow-hidden"
    style="border-radius: 15px 15px 0 0"
  >
    <view style="display: flex; flex: 1; height: 48px; text-align: center; background: #fff">
      <view
        style="flex: 1"
        class="flex items-center justify-center"
        :class="sortIndex === 0 ? 'color-#F44D24' : 'color-#6C6C6C'"
        @click="changeSort(0)"
      >
        <view>综合</view>
      </view>
      <view
        style="flex: 1"
        class="flex items-center justify-center color-#6C6C6C"
        @click="changeSort(1)"
        :class="sortIndex === 1 ? 'color-#F44D24' : 'color-#6C6C6C'"
      >
        <view>上架时间</view>
        <view class="flex flex-col items-center justify-center ml-4px">
          <wd-icon name="arrow-up" size="10px" :color="model.pullTimeOrder === '1' ? '#F44D24' : '#6C6C6C'"></wd-icon>
          <wd-icon name="arrow-down" size="10px" :color="model.pullTimeOrder == '2' ? '#F44D24' : '#6C6C6C'"></wd-icon>
        </view>
      </view>
      <view
        style="flex: 1"
        class="flex items-center justify-center color-#6C6C6C"
        @click="changeSort(2)"
        :class="sortIndex === 2 ? 'color-#F44D24' : 'color-#6C6C6C'"
      >
        <view>价格</view>
        <view class="flex flex-col items-center justify-center ml-4px">
          <wd-icon name="arrow-up" size="10px" :color="model.priceOrder === '1' ? '#F44D24' : '#6C6C6C'"></wd-icon>
          <wd-icon name="arrow-down" size="10px" :color="model.priceOrder == '2' ? '#F44D24' : '#6C6C6C'"></wd-icon>
        </view>
      </view>
    </view>
    <view class="right flex items-center ml--1px px-10px bg-white z-999">
      <wd-icon name="bulletpoint" size="22px" v-if="isGrid" @click="changeGrid"></wd-icon>
      <wd-icon name="app" size="22px" v-else @click="changeGrid"></wd-icon>
    </view>
  </view>
  <!-- 商品列表 -->
  <z-paging
    ref="paging"
    v-model="goodList"
    @query="getLsit"
    :paging-style="{
      'min-height': 'calc(100vh - 201px)',
      background: '#fff',
      'margin-top': '231px',
      'z-index': '999',
    }"
  >
    <view v-if="isGrid" class="pt-15px grid grid-cols-2 gap-row-15px gap-col-13px px-15px box-border">
      <view
        class="flex flex-col border-rd-6px overflow-hidden w-175px bg-white pb-5px"
        v-for="item in goodList"
        :key="item.spuId"
        @click="routeTo({ url: '/pages-sub/homeManager/shopInfo', data: { id: item.spuId } })"
      >
        <wd-img :width="175" :height="160" :src="getUrl(item.remarkUrl)" />
        <view class="w-155px name mt-10px mb-5px m-auto">
          {{ item.spuName }}
        </view>
        <view class="w-full flex mb-10px">
          <view class="bg-#FFF0EC border-rd-3px px-5px color-#DF7D65 font-size-10px line-height-15px mr-4px">
            复购第一
          </view>
        </view>
        <view>
          <text style="margin-left: 10px; font-size: 12px; color: #f44d24">￥</text>
          <text style="font-size: 18px; font-weight: 600; color: #f44d24">
            {{ item.sellPrice }}
          </text>
          <text style="margin-left: 8px; font-size: 12px; color: #999999">已售{{ item.frequently }}件</text>
        </view>
      </view>
    </view>

    <view v-else class="w-full p-14px box-border">
      <view
        class="flex w-full p-10px box-border mb-10px bg-#F7F7F7 border-rd-6px"
        v-for="item in goodList"
        :key="item.spuId"
        @click="routeTo({ url: '/pages-sub/homeManager/shopInfo', data: { id: item.spuId } })"
      >
        <wd-img :width="86" :height="86" :src="getUrl(item.remarkUrl)" />
        <div class="flex-1 ml-15px flex flex-col justify-between">
          <view class="w-full name">
            {{ item.spuName }}
          </view>
          <view class="w-full flex items-center">
            <view class="tag color-#F44D24 font-size-10px line-height-17px px-3px mr-4px">清肺止咳</view>
          </view>
          <view class="flex justify-between">
            <view>
              <text style="font-size: 12px; color: #f44d24">￥</text>
              <text style="font-size: 18px; font-weight: 600; color: #f44d24">
                {{ item.sellPrice }}
              </text>

              <wd-text
                text="￥22"
                size="12px"
                color="#999999"
                decoration="line-through"
                custom-class="ml-10px"
              ></wd-text>
            </view>
            <view class="w-23px h-23px bg-#FFECE8 flex items-center justify-center border-rd-50px">
              <wd-icon name="cart" size="16px" color="#F44D24"></wd-icon>
            </view>
          </view>
        </div>
      </view>
    </view>
  </z-paging>
</template>

<style>
.main-title-color {
  color: #d14328;
}

.active {
  color: #f44d24;
}

.tag {
  border: 1px solid #f44d24;
  border-radius: 3px;
}

:deep(.nav_custom) {
  top: 0;
  left: 0;
  width: 100%;
  background-color: transparent !important;
}

.input-style {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 122px;
  height: 33px;
  padding: 0 10px !important;
  font-size: 12px;
  background: #f6f6f8 !important;
  border-radius: 17px !important;
}

.min-input {
  box-sizing: border-box;
  padding: 0 10px;
  font-size: 12px;
  text-align: center;
}

:deep(.wd-tabs__nav-item) {
  box-sizing: border-box;
  padding: 0 10px;
  font-size: 12px;
  text-align: center;
}

.search {
  box-sizing: border-box;
  width: 308px;
  height: 35px;
  background: #ffffff;
  border-radius: 20px 20px 20px 20px;
}

.searchbtn {
  width: 57px;
  line-height: 31px;
  color: #fff;
  text-align: center;
  background: #f44d24;
  border-radius: 20px 20px 20px 20px;
}

.caricon {
  position: relative;
  margin-left: 16px;
}

.name {
  display: -webkit-box;
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.right {
  color: #6c6c6c;
}
/*.caricon::after {*/
/*  position: absolute;*/
/*  top: 0;*/
/*  right: 0;*/
/*  width: 12px;*/
/*  height: 12px;*/
/*  content: '';*/
/*  background-color: #ff0707;*/
/*  border: 1px solid #ffffff;*/
/*  border-radius: 50px;*/
/*}*/

.title {
  font-size: 14px;
}
.listname {
  height: 48px;
  line-height: 24px;
}
.brand {
  box-sizing: border-box;
  padding: 0 10px;
  overflow: hidden;
  font-size: 12px;
  line-height: 33px;
  color: #999999;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: #f6f6f8;
}

.active {
  color: #f44d24;
  background: #fff1ed;
}

.reset,
.submit {
  width: 111px;
  line-height: 40px;
  text-align: center;
  border-radius: 6px 6px 6px 6px;
}

.reset {
  color: #f44d24;
  background: #fff1ed;
}

.submit {
  color: #fff;
  background: #f44d24;
}

:deep(.wd-tabs__nav) {
  color: #fff;
  background: transparent !important;
}

:deep(.is-active::after) {
  display: none;
}

:deep(.wd-input__inner) {
  font-size: 12px !important;
}
</style>
