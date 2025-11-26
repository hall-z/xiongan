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
import { getFilterCondition, goodsSearch } from '@/service/api/shop'
import matrix from '@/static/images/shop/matrix.png'
import screen from '@/static/images/shop/screen.png'
import { routeTo } from '@/utils'

const searchIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-01/e3d95688-3fa5-4fc5-b665-1e681248a6d2search.png',
)
const { VITE_APP_LOGOTITLE } = import.meta.env
const topbgBase64 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-01/0259a4e6-d346-4822-9405-e403d0066ab6navbg.png',
)
const carIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-01/7c650342-3e52-4785-965b-1373a4f9dbb9shopcar.png',
)

const paging = ref(null)
const filterList = reactive<any>({})
const goodList = ref([])
const isGrid = ref(true)
const showSearch = ref(false)
const sort = reactive({
  pullTimeOrder: 0, // 上架时间排序
  salesVolumeOrder: 0, // 销量排序
  priceOrder: 0, // 价格排序
})
const model: any = reactive({
  pullTimeOrder: 1, // 上架时间排序
  salesVolumeOrder: 1, // 销量排序
  priceOrder: 1, // 价格排序
  brandId: '', // 品牌id
  shopId: '', // 店铺id
  spuName: '', // 商品名称
  sellPriceMin: '', // 价格1
  sellPriceMax: '', // 价格2
  secondCategoryId: '', // 二级分类id
})
const sortFilter = reactive({
  brand: 1,
  brandVisible: true,
  brandTitle: '展开',
  category: 1,
  categoryVisible: true,
  categoryTitle: '展开',
  shop: 1,
  shopVisible: true,
  shopTitle: '展开',
})

onShow(() => {
  getFilterData()
})

function handleSearch() {
  paging.value.reload()
}

function changeGrid() {
  isGrid.value = !isGrid.value
}

const reset = () => {
  Object.assign(model, {
    pullTimeOrder: 1, // 上架时间排序
    salesVolumeOrder: 1, // 销量排序
    priceOrder: 1, // 价格排序
    brandId: '', // 品牌id
    shopId: '', // 店铺id
    spuName: '', // 商品名称
    sellPriceMin: '', // 价格1
    sellPriceMax: '', // 价格2
    secondCategoryId: '', // 二级分类id
  })
  showSearch.value = false
  paging.value.reload()
}
const changeType = (type, id) => {
  if (model[type] === id) {
    model[type] = ''
  } else {
    model[type] = id
  }
}
const getFilterData = () => {
  getFilterCondition({}).then((res: any) => {
    res.categoryList = res.categoryList.reduce((a, b) => {
      return a.concat(b.pCodeList)
    }, [])

    res.brandVisible = true
    if (res.brandList.length > 9) {
      sortFilter.brand = 1
      sortFilter.brandVisible = true
      sortFilter.brandTitle = '展开'
      res.brandListShow = res.brandList.slice(0, 9)
    } else if (res.brandList.length > 0) {
      sortFilter.brandVisible = false
      res.brandListShow = res.brandList
    } else {
      res.brandVisible = false
    }

    res.categoryVisible = true
    if (res.categoryList.length > 9) {
      sortFilter.category = 1
      sortFilter.categoryVisible = true
      sortFilter.categoryTitle = '展开'
      res.categoryListShow = res.categoryList.slice(0, 9)
    } else if (res.categoryList.length > 0) {
      sortFilter.categoryVisible = false
      res.categoryListShow = res.categoryList
    } else {
      res.categoryVisible = false
    }

    res.shopVisible = true
    if (res.shopList.length > 9) {
      sortFilter.shop = 1
      sortFilter.shopVisible = true
      sortFilter.shopTitle = '展开'
      res.shopListShow = res.shopList.slice(0, 9)
    } else if (res.showList.length > 0) {
      sortFilter.shopVisible = false
      res.shopListShow = res.shopList
    } else {
      res.shopVisible = false
    }

    Object.assign(filterList, res)
  })
}

const back = () => {
  uni.navigateBack()
}
const searchSubmit = () => {
  if (Number(model.sellPriceMin) > Number(model.sellPriceMax)) {
    uni.showToast({
      title: '最低价不能大于最高价',
      icon: 'none',
    })
    return
  }
  showSearch.value = false
  paging.value.reload()
}
const getLsit = async (pageNo: number, pageSize: number) => {
  try {
    const res: any = await goodsSearch({
      current: pageNo,
      size: pageSize,
      ...model,
    })
    res.content.forEach((el) => {
      el.rotationUrl = JSON.parse(el.rotationUrl).map((item) => item.data)
    })
    console.log('商城列表', res.content)

    paging.value.complete(res.content)
  } catch {
    console.log('????')
    paging.value.complete(false)
  }
}
const getUrl = (str) => {
  // return JSON.parse(str)[0].data
}

function changeSearch() {
  showSearch.value = true
}

function input1(e) {
  const reg = /^[1-9]\d*$/
  if (!reg.test(e.value)) {
    uni.showToast({
      title: '请输入正整数',
      icon: 'none',
    })
    model.sellPriceMin = ''
  }
  if (model.sellPriceMin && model.sellPriceMax) {
    if (Number(model.sellPriceMin) > Number(model.sellPriceMax)) {
      model.sellPriceMin = ''
      uni.showToast({
        title: '最低价不能大于最高价',
        icon: 'none',
      })
    }
  }
}

function input2(e) {
  const reg = /^[1-9]\d*$/
  if (!reg.test(e.value)) {
    uni.showToast({
      title: '请输入正整数',
      icon: 'none',
    })
    model.sellPriceMax = ''
  }
  if (model.sellPriceMin && model.sellPriceMax) {
    if (Number(model.sellPriceMin) > Number(model.sellPriceMax)) {
      model.sellPriceMax = ''
      uni.showToast({
        title: '最高价不能小于最低价',
        icon: 'none',
      })
    }
  }
}

function handleChange(val, type) {
  if (type === 'salesVolumeOrder' && sort.salesVolumeOrder === 2) {
    return false
  }

  model.pullTimeOrder = '' // 上架时间排序
  model.salesVolumeOrder = '' // 销量排序
  model.priceOrder = ''

  sort.pullTimeOrder = 0
  sort.salesVolumeOrder = 0
  sort.priceOrder = 0

  if (type === 'salesVolumeOrder') {
    model.salesVolumeOrder = 2
    sort.salesVolumeOrder = 2
  } else {
    model[type] = val.value === 1 ? 2 : 1
    sort[type] = val.value === 1 ? 1 : -1
  }

  paging.value.reload()
}

function handleFilteChange(val, type) {
  if (val.value === 1) {
    sortFilter[type + 'Title'] = '展开'
    filterList[type + 'ListShow'] = filterList[type + 'List'].slice(0, 9)
  } else {
    sortFilter[type + 'Title'] = '收起'
    filterList[type + 'ListShow'] = filterList[type + 'List']
  }
}
</script>
<template>
  <view
    class="box-border h-153px fixed pos-top-none bg-no-repeat bg-cover z-999"
    :style="` background-image: url(${topbgBase64});background-size: 100% 99%`"
  >
    <dy-navbar :leftTitle="'商品搜索'" custom-class="nav_custom" left isNavShow></dy-navbar>
    <!--    <wd-navbar safeAreaInsetTop placeholder  :bordered="false">-->
    <!--      <template #left>-->
    <!--        <view class="flex gap-10px items-center">-->
    <!--          <wd-icon name="thin-arrow-left" size="22px" @click="back"></wd-icon>-->
    <!--          <text class="line-height-44px text-18px color-#fff mt-5px">商品搜索</text>-->
    <!--        </view>-->
    <!--      </template>-->
    <!--    </wd-navbar>-->

    <!-- <wd-sticky :offset-top="navTop"> -->
    <view class="w-100vw flex items-center justify-center gap-2px box-border m-t-10px">
      <view class="pl-10px pr-2px flex items-center search pos-relative">
        <wd-img :width="17" :height="18" :src="searchIcon" />
        <input
          class="uni-input m-l-10px flex-1"
          confirm-type="search"
          placeholder="请输入搜索关键词"
          v-model="model.spuName"
          @blur="handleSearch"
        />
        <view class="searchbtn" @click="paging.reload">搜索</view>
      </view>
      <view class="caricon" @click="routeTo({ url: '/pages-sub/homeManager/shopCar' })">
        <wd-img :width="30" :height="28" :src="carIcon" />
      </view>
    </view>
    <!-- </wd-sticky> -->
  </view>

  <view class="w-full box-border flex pos-fixed z-999 pos-top-151px">
    <view class="flex flex-1 items-center text-center bg-#fff">
      <view class="flex-1">
        <text
          class="sort-sale"
          :class="{ active: sort.salesVolumeOrder == 2 }"
          @click="handleChange(2, 'salesVolumeOrder')"
        >
          销量
        </text>
      </view>
      <view class="flex-1">
        <wd-sort-button
          v-model="sort.pullTimeOrder"
          title="上架时间"
          @change="handleChange($event, 'pullTimeOrder')"
        />
      </view>
      <view class="flex-1">
        <wd-sort-button
          v-model="sort.priceOrder"
          title="价格"
          @change="handleChange($event, 'priceOrder')"
        />
      </view>
    </view>
    <view class="flex items-center px-10px bg-white color-#6c6c6c z-999">
      <wd-img :width="23" :height="23" :src="matrix" @click="changeGrid" />
      <view class="inline-block flex ml-15px" @click="changeSearch">
        <view class="lh-24px font-size-14px">筛选</view>
        <wd-img :width="23" :height="23" :src="screen" />
      </view>
    </view>
  </view>
  <!-- 商品列表 -->
  <z-paging
    ref="paging"
    v-model="goodList"
    @query="getLsit"
    :paging-style="{
      'min-height': 'calc(100vh - 201px)',
      background: '#f7f7f7',
      'margin-top': '201px',
    }"
  >
    <view
      v-if="isGrid"
      class="w-full pt-15px grid grid-cols-2 gap-row-15px gap-col-13px px-15px box-border"
    >
      <view
        class="flex flex-col border-rd-6px overflow-hidden w-full bg-white pb-5px"
        v-for="item in goodList"
        :key="item.spuId"
        @click="routeTo({ url: '/pages-sub/homeManager/shopInfo', data: { id: item.spuId } })"
      >
        <wd-img width="100%" :height="160" :src="item.rotationUrl[0]" />
        <view class="w-155px name my-10px m-auto">
          {{ item.spuName }}
        </view>
        <view>
          <text style="margin-left: 10px; font-size: 12px; color: #f44d24">￥</text>
          <text style="font-size: 18px; font-weight: 600; color: #f44d24">
            {{ item.sellPrice }}
          </text>
          <text style="margin-left: 8px; font-size: 12px; color: #999999">
            已售{{ item.frequently }}件
          </text>
        </view>
      </view>
    </view>

    <view v-else class="w-full p-14px box-border">
      <view
        class="flex w-full p-10px box-border mb-10px bg-white border-rd-6px"
        v-for="item in goodList"
        :key="item.spuId"
        @click="routeTo({ url: '/pages-sub/homeManager/shopInfo', data: { id: item.spuId } })"
      >
        <wd-img :width="86" :height="86" :src="item.rotationUrl[0]" />
        <div class="flex-1 ml-15px flex flex-col justify-between">
          <view class="w-full name">
            {{ item.spuName }}
          </view>
          <view class="flex justify-between">
            <view>
              <text style="font-size: 12px; color: #f44d24">￥</text>
              <text style="font-size: 18px; font-weight: 600; color: #f44d24">
                {{ item.sellPrice }}
              </text>
            </view>
            <text style="margin-left: 8px; font-size: 12px; color: #999999">
              已售{{ item.salesVolume }}件
            </text>
          </view>
        </div>
      </view>
    </view>
  </z-paging>

  <!-- 筛选弹窗 -->
  <wd-popup
    v-model="showSearch"
    lock-scroll
    position="right"
    custom-style="width:307px;padding:215px 15px 15px;box-sizing:border-box;"
  >
    <view class="price">
      <div class="title">价格区间</div>
      <view class="flex items-center mt-20px">
        <wd-input
          type="number"
          size="large"
          v-model="model.sellPriceMin"
          placeholder="最低价"
          no-border
          style="font-size: 14px"
          custom-class="input-style"
          custom-input-class="min-input"
          :maxlength="7"
          @blur="input1"
        />
        <view class="h-full mx-10px">—</view>
        <wd-input
          type="number"
          size="large"
          v-model="model.sellPriceMax"
          placeholder="最高价"
          style="font-size: 14px"
          no-border
          custom-class="input-style"
          custom-input-class="min-input"
          :maxlength="7"
          @blur="input2"
        />
      </view>
    </view>
    <view class="mt-30px" v-if="filterList.brandVisible">
      <view class="flex items-center justify-between">
        <text class="font-size-14px">品牌</text>
        <wd-sort-button
          v-model="sortFilter.brand"
          :title="sortFilter.brandTitle"
          v-if="sortFilter.brandVisible"
          @change="handleFilteChange($event, 'brand')"
        />
      </view>
      <view class="mt-20px grid grid-cols-3 gap-row-9px gap-col-7px">
        <view
          class="w-86px border-rd-17px brand"
          :class="[model.brandId === it.code ? 'active' : '']"
          v-for="it in filterList.brandListShow"
          :key="it.code"
          @click="changeType('brandId', it.code)"
        >
          {{ it.name }}
        </view>
      </view>
    </view>
    <view class="mt-30px" v-if="filterList.categoryVisible">
      <view class="flex items-center justify-between">
        <text class="font-size-14px">分类</text>
        <wd-sort-button
          v-model="sortFilter.category"
          :title="sortFilter.categoryTitle"
          v-if="sortFilter.categoryVisible"
          @change="handleFilteChange($event, 'category')"
        />
      </view>
      <view class="mt-20px grid grid-cols-3 gap-row-9px gap-col-7px">
        <view
          class="w-86px border-rd-17px brand"
          :class="model.secondCategoryId === it.code ? 'active' : ''"
          v-for="it in filterList.categoryListShow"
          :key="it.id"
          @click="changeType('secondCategoryId', it.code)"
        >
          {{ it.name }}
        </view>
      </view>
    </view>
    <view class="mt-30px" v-if="filterList.shopVisible">
      <view class="flex items-center justify-between">
        <text class="font-size-14px">店铺</text>
        <wd-sort-button
          v-model="sortFilter.shop"
          :title="sortFilter.shopTitle"
          v-if="sortFilter.shopVisible"
          @change="handleFilteChange($event, 'shop')"
        />
      </view>
      <view class="mt-20px grid grid-cols-3 gap-row-9px gap-col-7px">
        <view
          class="w-86px border-rd-17px brand"
          :class="model.shopId === it.id ? 'active' : ''"
          v-for="it in filterList.shopListShow"
          :key="it.id"
          @click="changeType('shopId', it.id)"
        >
          {{ it.name }}
        </view>
      </view>
    </view>
    <view class="mt-50px flex items-center justify-center">
      <view class="reset" @click="reset">重置</view>
      <view class="submit ml-24px" @click="searchSubmit">确认</view>
    </view>
  </wd-popup>
</template>

<style>
.main-title-color {
  color: #d14328;
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

.sort-sale {
  height: 20px;
  font-size: 14px;
  line-height: 20px;
  color: #333;
}

.sort-sale.active {
  font-weight: bold;
  color: #000;
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
