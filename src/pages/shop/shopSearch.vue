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
  getShopGoods,
  getGoodListSP,
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
    const res: any = await getGoodListSP({
      current: pageNo,
      size: pageSize,
      secondCategoryId: secondCategoryId.value,
      firstCategoryId: firstCategoryId.value,
      shopId: shopId.value,
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
  console.log(e)
  console.log(navActive)
}
// /product/manage/itemCategory/categoryList
const getUrl = (str) => {
  if (str) {
    return JSON.parse(str)[0].data
  } else {
    return ''
  }
}

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

const shopId = ref('')
const title = ref('')
const secondCategoryId = ref('')
const firstCategoryId = ref('')
onLoad(async (options) => {
  shopId.value = options.shopId
  title.value = options.title
  secondCategoryId.value = options.secondCategoryId
  firstCategoryId.value = options.firstCategoryId
  console.log('options', options)

  // getLsit()

  // 设置背景图片
})
</script>
<template>
  <z-paging ref="paging" v-model="goodList" @query="getLsit" class="w-screen h-screen">
    <template #top>
      <dy-navbar :leftTitle="title" left isNavShow color="#000"></dy-navbar>
    </template>
    <view class="overflow-hidden p-10px box-border">
      <view
        class="flex w-1/2 px-5px py-2 box-border border-rd-6px float-left overflow-hidden"
        @click="toShopInfo(item)"
        v-for="item in goodList"
        :key="item.spuId"
      >
        <view class="bg-white w-100% border-rd-6px overflow-hidden">
          <wd-img width="100%" height="42vw" :src="getUrl(item.rotationUrl)" radius="5px" />

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
  </z-paging>
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
</style>
