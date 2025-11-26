<route lang="json5" type="page">
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
import {
  addUserShop,
  delUserShop,
  getSecondCategory,
  getfirstCategory,
  getShopGoods,
  getShopInfo,
} from '@/service/api/shop'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { useToPhone } from '@/utils/uniapi'
import { Modal } from '@/utils/uniapi/prompt'
import shopIcon from '../../static/images/shop/shop_nav20.png'
import shopIcon02 from './static/shopicon002.svg'
import shopIcon03 from './static/shopicon003.svg'

const userStore = useUserStore()
const isFollow = ref(false)
const topbgBase64 = ref('')
const searchData = ref('')
const paging = ref(null)
const shopDetails: any = ref({})
const goodList = ref([])
const sort = reactive({
  putPullTime: 1, // 上架时间排序
  salesVolume: 1, // 销量排序
  sellPrice: 1, // 价格排序
})
const model = reactive({
  putPullTime: '', // 上架时间排序
  salesVolume: '', // 销量排序
  sellPrice: '', // 价格排序
  shopId: '', // 店铺id
  spuName: '',
})
const fllowShop = () => {
  if (!userStore.isLogined) {
    Modal({ title: '提示', content: '您还没有登录，请先登录？' }).then((res: any) => {
      if (res.confirm) {
        routeTo({ url: '/pages/login/index' })
      }
    })
  } else {
    if (isFollow.value) {
      delUserShop({ idList: [model.shopId] }).then((res) => {
        console.log('取消关注店铺', res)
        getShopDetails()
      })
    } else {
      addUserShop({ shopId: model.shopId }).then((res) => {
        console.log('关注店铺', res)
        getShopDetails()
      })
    }
  }
}
const getShopDetails = () => {
  getShopInfo({ shopId: model.shopId }).then((res: any) => {
    shopDetails.value = res
    isFollow.value = res.operation === 1
  })
}
const getlocation = () => {
  const { latitude, longitude, name, shopDesc } = shopDetails.value
  uni.openLocation({
    latitude: Number(latitude),
    longitude: Number(longitude),
    name,
    address: shopDesc,
    success: function () {
      console.log('success')
    },
    fail: function (res) {
      console.log(res)
    },
  })
}
const call = () => {
  useToPhone(shopDetails.value.shopPhone)
}
const getLsit = async (pageNo: number, pageSize: number) => {
  try {
    const res: any = await getShopGoods({
      current: pageNo,
      size: pageSize,
      ...model,
    })
    res.content.forEach((el) => {
      el.saleUrl = JSON.parse(el.rotationUrl).data
    })
    paging.value.complete(res.content)
    // paging.value.complete([])
  } catch {
    paging.value.complete(false)
  }
}

function resetSeach() {
  model.putPullTime = ''
  model.salesVolume = ''
  model.sellPrice = ''
  sort.putPullTime = 1
  sort.salesVolume = 1
  sort.sellPrice = 1
}

function handleChange(val, type) {
  if (type === 'salesVolume' && sort.salesVolume === 2) {
    sort.salesVolume = 1
    model.salesVolume = ''
    paging.value.reload()
    return
  }

  resetSeach()

  if (type === 'salesVolume') {
    model.salesVolume = 'desc'
    sort.salesVolume = 2
  } else {
    model[type] = val.value === 1 ? 'asc' : 'desc'
    sort[type] = val.value
  }

  console.log('sort', sort)
  paging.value.reload()
}

// function getTagList() {
//   const taglist = ['五星好评', '即将售罄', '复购最高', '优惠降价', '本月畅销', '平台好店']
//   const r1 = Number((Math.random() * 10).toFixed(0))
//   const r2 = Number((Math.random() * 7.99).toFixed(0))
//   const r3 = Number((Math.random() * 7.99).toFixed(0))
//   const list = []
//   if (r1 % 2 === 0) {
//     list.push(taglist[r2])
//   } else {
//     list.push(taglist[r2])
//     if (r2 !== r3) {
//       list.push(taglist[r3])
//     }
//   }
//   return list
// }

function handleClick(e) {
  if (e.inde === 0) {
    paging.value.reload()
  }
}

async function secondCategory(e) {
  const res: any = await getSecondCategory({
    shopId: model.shopId,
    pcode: e || categories.value[activeCategory.value].code,
  })
  categories.value[activeCategory.value].items = res
}

async function firstCategory() {
  const res: any = await getfirstCategory({
    shopId: model.shopId,
    type: '1',
  })

  categories.value = res

  if (res[0]) {
    if (categories.value[activeCategory.value].items === undefined) {
      secondCategory(categories.value[activeCategory.value].code)
    }
  }
}

function CategoryhandleChange({ value }) {
  activeCategory.value = value
  secondCategory(categories.value[activeCategory.value].code)
}

function gopath(url, e) {
  routeTo({
    url,
    data: e,
  })
}

const categories = ref([])
const activeCategory = ref<number>(0)
const LabelList = ref([
  { name: '商品', code: 1 },
  { name: '分类', code: 2 },
])
const navActive = ref<number>(0)
const searchGoods = () => {
  console.log('索索')
  model.spuName = searchData.value
  paging.value.reload()
}
const type = ref(1)
const changeType = () => {
  type.value = type.value === 1 ? 2 : 1
}
const noHistory = ref(false)
// 跳转商品详情
const toShopInfo = (item) => {
  if (noHistory.value) {
    uni.navigateBack()
  } else {
    routeTo({ url: '/pages-sub/homeManager/shopInfo', data: { id: item.spuId, noHistory: false } })
  }
}
onLoad(async (options) => {
  model.shopId = options.id
  console.log('model', model)
  noHistory.value = options.noHistory
  getShopDetails()
  firstCategory()

  // 设置背景图片
})
</script>
<template>
  <view>
    <view v-if="navActive === 0">
      <z-paging ref="paging" v-model="goodList" @query="getLsit" class="w-screen h-screen">
        <template #top>
          <view class="bgs">
            <dy-navbar leftTitle="店铺" left isNavShow></dy-navbar>

            <view class="w-full p-15px box-border">
              <view class="w-full box-border bg-#3A3A3A border-rd-10px overflow-hidden">
                <view class="flex justify-between items-center pl-2 pr-4 py-2">
                  <view class="pr-4 box-border">
                    <view
                      style="
                        height: 25px;
                        padding: 0px 15px;
                        line-height: 25px;
                        color: #bfbfbf;
                        background: #575757;
                        border-radius: 23px 23px 23px 23px;
                      "
                      class="bg-#575757 rounded-3xl px-4 text-left overflow-hidden flex justify-left items-center"
                    >
                      <wd-input
                        v-model="searchData"
                        type="text"
                        placeholderClass="placeholderClass color-#bfbfbf"
                        suffix-icon="search"
                        @confirm="searchGoods"
                        @clicksuffixicon="searchGoods"
                        placeholder="请输入搜索关键词"
                        confirm-type="search"
                      />
                      <!-- <input
                        v-model="searchData"
                        class="text-14px flex"
                        style="flex: 1"
                        @input="onKeyInput"
                        confirm-type="search"
                        placeholder="请输入搜索关键词"
                      />
                      <wd-icon
                        name="search"
                        size="16px"
                        custom-class="ml-1 "
                        @click="searchGoods"
                        color="#777777"
                      ></wd-icon> -->
                    </view>
                  </view>

                  <view class="flex justify-right items-center" @click="call">
                    <view class="color-#FFDEB2 mr-1" style="font-size: 14px">客服</view>
                    <wd-img :width="20" :height="20" :src="shopIcon" mode="aspectFit" />
                  </view>
                </view>
                <view
                  class="pos-relative flex items-center justify-between w-full p-15px box-border bg-white border-rd-8px overflow-hidden"
                >
                  <view class="flex items-center justify-left flex-1 pr-3">
                    <view>
                      <wd-img
                        :width="57"
                        :height="57"
                        :src="shopDetails.shopAvatar"
                        round
                        mode="aspectFit"
                      />
                    </view>
                    <view
                      class="ml-10px flex flex-col items-start justify-center flex-1 overflow-hidden"
                    >
                      <view class="font-size-18px color-#000 font-600 text-left mb-1 over2">
                        {{ shopDetails.name }}
                      </view>
                      <view class="flex justify-left items-center" @click="getlocation">
                        <wd-img
                          :src="shopIcon03"
                          :width="12"
                          :height="14"
                          mode="aspectFit"
                        ></wd-img>
                        <view
                          class="inline font-14px ml-2px color-#666666 line2"
                          style="font-size: 12px"
                        >
                          {{ shopDetails.address }}
                        </view>
                      </view>
                    </view>
                  </view>
                  <view>
                    <view v-if="!isFollow" class="guanzhu" @click="fllowShop">+关注</view>
                    <view v-else class="quxiao" @click="fllowShop">已关注</view>
                  </view>
                  <view class="fans flex items-center">
                    <view class="mr-5px">粉丝：{{ shopDetails.shopFansCount }}</view>
                  </view>
                </view>
              </view>
            </view>
            <view class="w-100vw box-border bg-white">
              <view class="px-15px box-border">
                <wd-tabs v-model="navActive" swipeable @click="handleClick" lineWidth="40vw">
                  <block v-for="(item, index) in LabelList" :key="index">
                    <wd-tab :title="item.name"></wd-tab>
                  </block>
                </wd-tabs>
              </view>
            </view>
            <view
              v-if="navActive === 0"
              class="flex items-center justify-between bg-#fff px-4 overflow-hidden"
              style="
                position: relative;
                z-index: 9;
                height: 40px;
                box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
              "
            >
              <view class="flex items-center justify-left">
                <view class="px-2">
                  <view
                    class="sort-sale"
                    :class="{ active: sort.salesVolume === 2 }"
                    @click="handleChange(2, 'salesVolume')"
                  >
                    销量
                  </view>
                </view>
                <view class="px-2">
                  <wd-sort-button
                    v-model="sort.putPullTime"
                    title="上架时间"
                    @change="handleChange($event, 'putPullTime')"
                  />
                </view>
                <view class="px-2">
                  <wd-sort-button
                    v-model="sort.sellPrice"
                    title="价格"
                    @change="handleChange($event, 'sellPrice')"
                  />
                </view>
              </view>
              <view class="flex justify-right font-size-14px color-#6C6C6C">
                <wd-img :src="shopIcon02" :width="20" :height="20" @click="changeType"></wd-img>
                <!-- <view style="padding-left: 5px; border-left: 1px solid #aaa">筛选</view>
                <wd-img :src="shopIcon01" :width="20" :height="20"></wd-img> -->
              </view>
            </view>
          </view>
        </template>

        <view class="overflow-hidden p-10px box-border" v-if="type === 1">
          <view
            class="flex w-1/2 px-5px py-2 box-border border-rd-6px float-left overflow-hidden"
            @click="toShopInfo(item)"
            v-for="item in goodList"
            :key="item.spuId"
          >
            <view class="bg-white w-100% border-rd-6px overflow-hidden">
              <wd-img width="100%" height="42vw" :src="item.saleUrl" radius="5px" />

              <view
                class="flex-1 px-2 pb-2 pt-1 flex flex-col justify-between overflow-hidden box-border"
              >
                <view>
                  <view class="w-full name">
                    {{ item.spuName }}
                  </view>
                </view>

                <view class="flex justify-between">
                  <view>
                    <text style="font-size: 12px; color: #f44d24">￥</text>
                    <text style="font-size: 18px; font-weight: 600; color: #f44d24">
                      {{ item.sellPrice }}
                    </text>
                  </view>
                  <text
                    style="margin-left: 8px; font-size: 12px; color: #999999"
                    v-if="item.salesVolume > 0"
                  >
                    已售{{ item.salesVolume }}件
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="pt-10px" v-if="type === 2">
          <view
            class="mb-10px px-10px"
            @click="
              routeTo({
                url: '/pages-sub/homeManager/shopInfo',
                data: { id: item.spuId, routeForm: 'shop' },
              })
            "
            v-for="item in goodList"
            :key="item.spuId"
          >
            <view class="flex gap-10px bg-#fff rounded-8px overflow-hidden p-10px">
              <view>
                <wd-img width="95" height="95" :src="item.saleUrl"></wd-img>
              </view>
              <view class="flex-1 overflow-hidden flex flex-col justify-between">
                <view class="font-size-16px color-#000 line-height-24px">
                  {{ item.spuName }}
                </view>
                <view class="flex justify-between">
                  <view>
                    <text class="font-size-12px color-#f44d24">￥</text>
                    <text class="font-size-18px font-600 color-#f44d24">
                      {{ item.sellPrice }}
                    </text>
                  </view>
                  <text class="ml-8px; font-size-12px; color-#999999" v-if="item.salesVolume > 0">
                    已售{{ item.salesVolume }}件
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </z-paging>
    </view>
    <view
      v-if="navActive === 1"
      class="FHct pos-relative"
      style="display: flex; flex-direction: column; min-height: 100vh"
    >
      <view class="bgs">
        <dy-navbar leftTitle="店铺" left isNavShow></dy-navbar>

        <view class="w-full p-15px box-border">
          <view class="w-full box-border bg-#3A3A3A border-rd-10px overflow-hidden">
            <view class="flex justify-between items-center pl-2 pr-4 py-2">
              <view class="pr-4 box-border">
                <view
                  style="
                    height: 25px;
                    padding: 0px 15px;
                    line-height: 25px;
                    color: #bfbfbf;
                    background: #575757;
                    border-radius: 23px 23px 23px 23px;
                  "
                  class="bg-#575757 rounded-3xl px-4 text-left overflow-hidden flex justify-left items-center"
                >
                  <wd-input
                    v-model="searchData"
                    type="text"
                    placeholderClass="placeholderClass color-#bfbfbf"
                    suffix-icon="search"
                    @confirm="searchGoods"
                    @clicksuffixicon="searchGoods"
                    placeholder="请输入搜索关键词"
                    confirm-type="search"
                  />
                  <!-- <input
                    v-model="searchData"
                    class="text-14px flex"
                    style="flex: 1"
                    @input="onKeyInput"
                    confirm-type="search"
                    placeholder="请输入搜索关键词"
                  />
                  <wd-icon
                    name="search"
                    size="16px"
                    custom-class="ml-1 "
                    @click="searchGoods"
                    color="#777777"
                  ></wd-icon> -->
                </view>
              </view>

              <view class="flex justify-right items-center" @click="call">
                <view class="color-#FFDEB2 mr-1" style="font-size: 14px">客服</view>
                <wd-img :width="20" :height="20" :src="shopIcon" mode="aspectFit" />
              </view>
            </view>
            <view
              class="pos-relative flex items-center justify-between w-full p-15px box-border bg-white border-rd-8px overflow-hidden"
            >
              <view class="flex items-center justify-left flex-1 pr-3">
                <view>
                  <wd-img
                    :width="57"
                    :height="57"
                    :src="shopDetails.shopAvatar"
                    round
                    mode="aspectFit"
                  />
                </view>
                <view
                  class="ml-10px flex flex-col items-start justify-center flex-1 overflow-hidden"
                >
                  <view class="font-size-18px color-#000 font-600 text-left mb-1 over2">
                    {{ shopDetails.name }}
                  </view>
                  <view class="flex justify-left items-center" @click="getlocation">
                    <wd-img :src="shopIcon03" :width="12" :height="14" mode="aspectFit"></wd-img>
                    <view
                      class="inline font-14px ml-2px color-#666666 line2"
                      style="font-size: 12px"
                    >
                      {{ shopDetails.address }}
                    </view>
                  </view>
                </view>
              </view>
              <view>
                <view v-if="!isFollow" class="guanzhu" @click="fllowShop">+关注</view>
                <view v-else class="quxiao" @click="fllowShop">已关注</view>
              </view>
              <view class="fans flex items-center">
                <view class="mr-5px">粉丝：{{ shopDetails.shopFansCount }}</view>
              </view>
            </view>
          </view>
        </view>
        <view class="w-100vw box-border bg-white z-10 shadow">
          <view class="px-15px box-border">
            <wd-tabs v-model="navActive" swipeable @click="handleClick" lineWidth="40vw">
              <block v-for="(item, index) in LabelList" :key="index">
                <wd-tab :title="item.name"></wd-tab>
              </block>
            </wd-tabs>
          </view>
        </view>
        <view
          v-if="navActive === 0"
          class="flex items-center justify-between bg-#fff px-4 overflow-hidden"
          style="
            position: relative;
            z-index: 9;
            height: 40px;
            box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
          "
        >
          <view class="flex items-center justify-left">
            <view class="px-2">
              <view
                class="sort-sale"
                :class="{ active: sort.salesVolume === 2 }"
                @click="handleChange(2, 'salesVolume')"
              >
                销量
              </view>
            </view>
            <view class="px-2">
              <wd-sort-button
                v-model="sort.putPullTime"
                title="上架时间"
                @change="handleChange($event, 'putPullTime')"
              />
            </view>
            <view class="px-2">
              <wd-sort-button
                v-model="sort.sellPrice"
                title="价格"
                @change="handleChange($event, 'sellPrice')"
              />
            </view>
          </view>
          <view class="flex justify-right font-size-14px color-#6C6C6C">
            <wd-img :src="shopIcon02" :width="20" :height="20" @click="changeType"></wd-img>
            <!-- <view style="padding-left: 5px; border-left: 1px solid #aaa">筛选</view>
            <wd-img :src="shopIcon01" :width="20" :height="20"></wd-img> -->
          </view>
        </view>
      </view>

      <view
        class="wraper F1 pos-relative FHtl bg-white"
        style="flex: 1; width: 100%; height: 100%; border-top: 1px solid #f8f8f8"
      >
        <view
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 104px;
            height: 100%;
            background: #f7f8fa;
          "
        ></view>
        <view>
          <wd-sidebar v-model="activeCategory" @change="CategoryhandleChange">
            <wd-sidebar-item
              v-for="(item, index) in categories"
              :key="index"
              :value="index"
              :label="item.name"
            />
          </wd-sidebar>
        </view>
        <view class="F1">
          <view
            class="category"
            v-if="categories[activeCategory].items && categories[activeCategory].items.length > 0"
          >
            <wd-grid :column="3" custom-class="mb-4" clickable>
              <template v-for="(cell, ind) in categories[activeCategory].items" :key="ind">
                <wd-grid-item
                  use-icon-slot
                  :text="cell.name"
                  icon-size="50px"
                  @itemclick="
                    gopath(
                      '/pages/shop/shopSearch?shopId=' +
                        model.shopId +
                        '&firstCategoryId=' +
                        categories[activeCategory].code +
                        '&secondCategoryId=' +
                        cell.code +
                        '&title=' +
                        cell.name,
                    )
                  "
                >
                  <template #icon>
                    <wd-img width="50" height="50" :src="cell.bannerPic" radius="5" />
                  </template>
                </wd-grid-item>
              </template>
            </wd-grid>
          </view>
          <view v-else class="p-4 flex justify-between box-border items-center empty">
            暂无分类
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.wd-input) {
  width: 100%;
}

:deep(.z-paging-content) {
  background: #f3f4f6;
}

.bgs {
  background-image: url('https://oss.xay.xacloudy.cn/images/2025-02/55e3f83e-c64a-422e-bb61-213ca524e0ffbg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.quxiao {
  width: 70px;
  height: 25px;
  margin: 20px 5px 0 5px;
  font-size: 14px;
  line-height: 25px;

  color: #b0b0b0;
  text-align: center;
  background: #ececec;
  border-radius: 13px;
}

.guanzhu {
  width: 70px;
  height: 25px;
  margin: 20px 5px 0 5px;
  font-size: 14px;
  line-height: 25px;
  color: #fff;
  text-align: center;
  background: #f44d24;
  border-radius: 13px;
}

.fans {
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px 5px 3px 15px;
  font-size: 12px;
  color: #f44d24;
  background: rgba(244, 77, 36, 0.15);
  border-radius: 0px 10px 0px 24px;
}

.name {
  display: -webkit-box; /* 必须设置，用于多行溢出 */
  width: 100%;
  height: 44px;
  margin-bottom: 5px;
  overflow: hidden; /* 隐藏超出的内容 */
  line-height: 22px;
  //font-weight: 600;
  color: #333333;
  -webkit-box-orient: vertical; /* 设置盒子排列方向为垂直 */
  -webkit-line-clamp: 2; /* 限制显示的行数，例如显示3行 */
  //text-overflow: ellipsis;
  //white-space: nowrap;
}

.line2 {
  display: -webkit-box; /* 必须设置，用于多行溢出 */
  width: 100%;
  overflow: hidden;
  -webkit-box-orient: vertical; /* 设置盒子排列方向为垂直 */
  -webkit-line-clamp: 2; /* 限制显示的行数，例如显示3行 */
}

:deep(.is-active::after) {
  display: none;
}

:deep(.wd-sort-button__wrapper) {
  color: rgb(108, 108, 108);
}

.ZYtag {
  position: relative;
}

.ZYtag:after {
  position: absolute;
  bottom: 0;
  left: 15%;
  z-index: 10;
  display: inline-block;
  width: 70%;
  padding: 2px 0px;
  margin-top: -1px;
  margin-right: 5px;
  overflow: hidden;
  font-size: 12px;
  line-height: 16px;
  color: #f54e24;
  text-align: center;
  content: '自营';
  background: #ffdad3;
  border-radius: 5px;
  opacity: 0.95;
}

.sort-sale {
  height: 20px;
  font-size: 14px;
  line-height: 20px;
  color: #333;

  &.active {
    font-weight: bold;
    color: #000;
  }
}

:deep(.wd-input__inner) {
  height: 25px;
  line-height: 25px;
  color: #bfbfbf !important;

  background: transparent !important;
  border: none !important;
}

:deep(.wd-input__suffix) {
  height: 25px;
  line-height: 25px;
  color: #bfbfbf !important;
  background: transparent !important;
  border: none !important;
}

:deep(.wd-input__icon) {
  height: 25px;
  line-height: 25px;
  color: #bfbfbf !important;
  background: transparent !important;
  border: none !important;
}

:deep(.wd-input:after) {
  display: none;
}

:deep(.wd-input) {
  background: transparent !important;
}

:deep(.wd-tabs__line) {
  bottom: 0 !important;
  background: rgb(87, 87, 87) !important;
}

:deep(.wd-sidebar-item) {
  font-size: 14px !important;
}

:deep(.wd-sidebar-item--active) {
  font-size: 16px !important;
  font-weight: normal !important;
}

:deep(.wd-cell-group__left:before) {
  display: inline-block;
  width: 15px;
  margin-right: 5px;
  font-family: 'wd-icons' !important;
  color: #7f7f7f !important;
  text-align: left;
  content: '\e6bc';
}

.listname {
  height: 48px;
  line-height: 24px;
}

.caricon {
  position: relative;
  margin-left: 16px;
}

.name {
  display: -webkit-box;
  overflow: hidden;
  font-size: 14px;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.ZYtag {
  padding: 2px 5px;
  margin-top: -1px;
  margin-right: 5px;
  overflow: hidden;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
  background: #f54e24;
  border-radius: 3px;
}

:deep(.wd-cell__wrapper) {
  margin-left: 20px !important;
}

:deep(.wd-cell-group__title) {
  font-size: 14px !important;
  color: #7f7f7f !important;
}

.empty {
  display: block;
  width: 100%;
  padding-top: 50px;
  font-size: 14px;
  color: #cecece;
  text-align: center;
}

:deep(.wraper) {
  height: 100% !important;
}
</style>
