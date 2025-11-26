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
import vkDataGoodsSkuPopup from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup.vue'
import {
  getGoodList,
  getGoodType,
  addCart,
  getPickUpStoreByMerchantId,
  getGoodDetails,
} from '@/service/api/shop'
import { addressList, getCouponList } from '@/service/api/address'
import { useUserStore, useBaseStore } from '@/store'
import { routeTo } from '@/utils'
import { storeToRefs } from 'pinia'
import { Modal, Toast } from '@/utils/uniapi/prompt'
import { getRect, isArray } from '../../../node_modules/wot-design-uni/components/common/util'
onMounted(() => {
  getRect('.category', true).then((rects) => {
    if (isArray(rects)) {
      itemScrollTop.value = rects.map((item) => item.top || 0)
      scrollTop.value = rects[active.value].top || 0
    }
  })
})

const userStore = useUserStore()

const active = ref<number>(0)
const scrollTop = ref<number>(0)
const itemScrollTop = ref<number[]>([])
const TypeList = ref([])

function gopath(url, e) {
  routeTo({
    url,
    data: e,
  })
}

const getUrl = (str) => {
  if (str) {
    if (typeof str === 'string') {
      return JSON.parse(str)[0].data
    } else {
      return str[0]
    }
  } else {
    return ''
  }
}

async function getTypeLsit(Code) {
  const res: any = await getGoodList({
    page: 1,
    size: 5,
    status: 1,
    firstCategoryId: Code,
  })

  TypeList.value = res.content
}

const categories = ref([])

const { isRealSataus, userInfo } = storeToRefs(useUserStore())
const deliveryMode = ref(0) // 1自提 0快递
// 是否打开SKU弹窗
const skuKey = ref(false)
// SKU弹窗模式
const skuMode = ref(2)
let goodsInfo = reactive<any>({})
const details = reactive<any>({})
// 点击购物车图标
const showSku = (item) => {
  details.value = item
  getinfos()
  getDetails(item.spuId)
}
// 商品详情信息
const defaultSelect = ref({})
const maxBuyNum = ref(0)
const getDetails = async (spuId: number) => {
  getGoodDetails({
    spuId,
  }).then((res: any) => {
    res.rotationUrl = JSON.parse(res.rotationUrl).map((item) => item.data)
    res.remarkUrl = JSON.parse(res.remarkUrl).map((item) => item.data)
    res.skuUrl = JSON.parse(res.skuUrl).map((item) => item.data)
    res.logisticsType = res.logisticsType.split(',')
    res.evaList.forEach((el) => {
      el.userNickname = el.userNickname || '匿名用户'
      el.evaluationContent = el.evaluationContent || '该用户没有填写评价'
    })
    maxBuyNum.value = res?.purchLimitNum * 1 || 0
    Object.assign(details, res)
    if (isRealSataus.value) {
      getinfos() // 获取要用的弹窗信息
    }

    formatGoodsInfo(res.skuList)

    getCouponLists(null)
  })
}
const formatGoodsInfo = (arr: Array<any>) => {
  const obj = JSON.parse(arr[0].skuName)
  const specList = Object.keys(obj)
  let specLists = []
  if (arr.length === 1) {
    specLists = specList.map((it, idx) => {
      return {
        name: it, // 规格名称
        list: arr.map((item) => {
          return {
            name: JSON.parse(item.skuName)[it],
          }
        }),
      }
    })
  } else {
    specLists = []
    specList.forEach((it, idx) => {
      const array = []
      const str = []

      arr.forEach((e, id) => {
        if (str.indexOf(JSON.parse(e.skuName)[it]) === -1) {
          array.push({
            name: JSON.parse(e.skuName)[it],
          })
          str.push(JSON.parse(e.skuName)[it])
        }
      })

      specLists.push({ name: it, list: array })
    })
  }

  goodsInfo = {
    _id: details.spuId,
    name: details.spuName,
    goods_thumb: JSON.parse(details.saleUrl)[0].data,
    sku_list: arr.map((item, index) => {
      return {
        _id: item.id, // SKU ID
        goods_id: details.spuId, // 商品ID
        goods_name: details.spuName, // 商品名称
        // SKU头像
        image: details.skuUrl[0],
        // TODO
        price: item.sellPrice, // SKU 价格
        sku_name_arr: Object.values(JSON.parse(item.skuName)), // 该SKU由哪些规格组成（规格是有顺序的，需要与specList的数组顺序对应）
        stock: item.stock,
        maxBuyNum: item?.purchLimitNum * 1 || 0, // 限购商品数据量
      }
    }),

    specList: specLists,
  }
  defaultSelect.value = {
    sku: goodsInfo.sku_list[0].sku_name_arr,
    num: 1,
  }
}
// 获取优惠券信息
const nums = ref(1)
const couponList = ref([])
async function getCouponLists(e) {
  if (isRealSataus.value) {
    if (e) {
      nums.value = e.buy_num
      details.skuList[0].sellPrice = e.price
      couponList.value = await getCouponList({
        shopId: details.value.shopId,
        productsList: [
          {
            num: 1,
            price: e.price,
            productId: e.goods_id,
          },
        ],
      })
    } else {
      couponList.value = await getCouponList({
        shopId: details.value.shopId,
        productsList: [
          {
            num: 1,
            price: goodsInfo.sku_list[0].price,
            productId: goodsInfo.sku_list[0].goods_id,
          },
        ],
      })
    }
  } else {
    couponList.value = []
  }

  skuKey.value = true
}
// 获取地址
const baseStore = useBaseStore()
const pointLists = ref([])
const addressLists = ref([])
const receiveAddrId = ref('')
const receiverName = ref('') // 自提人姓名
const receiverTel = ref('') // 自提人电话
const deliveryLists = ref([
  {
    value: 0,
    name: '快递配送',
    show: true,
  },
  {
    value: 1,
    name: '上门自提',
    show: true,
  },
])
const deliveryInx = ref(0)
async function getinfos() {
  if (isRealSataus.value) {
    addressLists.value = await addressList({})
  } else {
    addressLists.value = []
  }
  pointLists.value = await getPickUpStoreByMerchantId({
    shopId: details.value.shopId,
    latitude: baseStore.userLocation.latitude ? baseStore.userLocation.latitude : '',
    longitude: baseStore.userLocation.longitude ? baseStore.userLocation.longitude : '',
  })

  if (details.value.logisticsType.indexOf('0') < 0) {
    deliveryLists.value[0].show = false
    deliveryMode.value = 1
    deliveryInx.value = 1
  }

  if (details.value.logisticsType.indexOf('1') < 0) {
    deliveryLists.value[1].show = false
    deliveryMode.value = 0
    deliveryInx.value = 0
  }

  if (pointLists.value.length === 0) {
    deliveryLists.value[1].show = false
    deliveryMode.value = 0
    deliveryInx.value = 0
  }

  if (pointLists.value.length === 0 && details.value.logisticsType.indexOf('0') < 0) {
    deliveryMode.value = null
  }
}
// 立即购买
const pointInx = ref(0)
const addressInx = ref(0)
const buyNow = (val: any) => {
  const { shopId, shopName, shopAvatar } = details.value

  const obj = [
    {
      shopId,
      shopName,
      shopAvatar,
      merchantId: details.value.merchantId,
      orderResource: 2, //  订单来源 1web  2 小程序
      payShopListReqVo: [
        {
          spuId: val.goods_id,
          skuId: val._id,
          image: getUrl(details.value.rotationUrl),
          skuName: val.sku_name_arr.join(','),
          spuNum: val.buy_num,
          spuName: val.goods_name,
          price: val.price,
          stock: val.stock,
          maxBuyNum: val.maxBuyNum,
          spuType: details.value.spuType,

          buy_num: val.buy_num,
          goods_id: val.goods_id,

          couponInfo: couponList.value[0],
          deliveryMode: deliveryMode.value,
          pointList: pointLists.value,
          pointInx: pointInx.value,
          deliveryInx: deliveryInx.value,
          addressInx: addressInx.value,
          logisticsType: details.value.logisticsType, // 配送方式  0: 快递配送 ,1: 上门自提 ,2: 同城配送
          receiveAddrId: receiveAddrId.value,
          receiverName: receiverName.value,
          receiverTel: receiverTel.value,
          deliveryAmount: details.value.deliveryAmount,
          orderNote: '',
        },
      ],
    },
  ]

  routeTo({
    url: '/pages-sub/homeManager/order?obj=' + JSON.stringify(obj),
  })
}

// 加入购物车
const addCar = (val: any) => {
  if (isRealSataus.value) {
    const { shopId, shopName, shopAvatar } = details.value
    const objs = {
      shopId,
      shopName,
      shopAvatar,
      merchantId: details.value.merchantId,
      orderResource: 2, //  订单来源 1web  2 小程序

      spuId: val.goods_id,
      skuId: val._id,
      // image: val.image,
      image: getUrl(details.value.rotationUrl),
      buy_num: val.buy_num,
      goods_id: val.goods_id,

      skuName: val.sku_name_arr.join(','),
      spuNum: val.buy_num,
      spuName: val.goods_name,
      price: val.price,
      stock: val.stock,
      spuType: details.value.spuType,
      couponInfo: couponList.value[0],
      deliveryMode: deliveryMode.value,
      pointList: pointLists.value,
      pointInx: pointInx.value ? pointInx.value : 0,
      deliveryInx: deliveryInx.value ? deliveryInx.value : 0,
      addressInx: addressInx.value ? addressInx.value : 0,
      logisticsType: details.value.logisticsType, // 配送方式  0: 快递配送 ,1: 上门自提 ,2: 同城配送
      receiveAddrId: receiveAddrId.value,
      receiverName: receiverName.value,
      receiverTel: receiverTel.value,
      deliveryAmount: details.value.deliveryAmount,
      orderNote: '',
    }

    const obj = {
      customerId: userInfo.value.userDId,
      shopId: details.value.shopId,
      skuId: val._id,
      itemNum: val.buy_num,
      spuType: details.value.spuType,
      spuId: val.goods_id,
      shopAvatar: details.value.shopAvatar,
      buy_num: val.buy_num,
      goods_id: val.goods_id,
      cartData: JSON.stringify(objs),
      merchantId: details.value.merchantId,
    }
    addCart(obj).then((res) => {
      Toast('添加购物车成功')
      skuKey.value = false
    })
  } else {
    Modal({ title: '提示', content: '您还没有登录，请先登录？' }).then((res: any) => {
      if (res.confirm) {
        routeTo({ url: '/pages/login/index' })
      }
    })
  }
}

onLoad(async () => {
  const res = await getGoodType()
  categories.value = res
  getTypeLsit(categories.value[0].label)
})

function handleChange({ value }) {
  active.value = value
  getTypeLsit(categories.value[active.value].label)
}

function onScroll(e) {
  const { scrollTop } = e.detail
  const threshold = 50 // 下一个标题与顶部的距离
  if (scrollTop < threshold) {
    active.value = 0
    return
  }
  const index = itemScrollTop.value.findIndex(
    (top) => top > scrollTop && top - scrollTop <= threshold,
  )
  if (index > -1) {
    active.value = index
  }
}
</script>
<template>
  <view class="flex flex-col justify-between" style="height: 100vh">
    <dy-navbar leftTitle="全部分类" left></dy-navbar>
    <view class="wraper" style="flex: 1">
      <wd-sidebar v-model="active" @change="handleChange">
        <wd-sidebar-item
          v-for="(item, index) in categories"
          :key="index"
          :value="index"
          :label="item.title"
        />
      </wd-sidebar>
      <scroll-view class="content" scroll-y scroll-with-animation :throttle="false">
        <view
          class="category"
          v-if="categories[active].items && categories[active].items.length > 0"
        >
          <wd-img
            width="100%"
            mode="widthFix"
            :src="categories[active].pic"
            radius="5"
            custom-style="max-height:22vw"
          />

          <wd-grid :column="3" custom-class="mb-4" clickable>
            <template v-for="(cell, ind) in categories[active].items" :key="ind">
              <wd-grid-item
                use-icon-slot
                :text="cell.name"
                icon-size="50px"
                @itemclick="gopath('/pages-sub/shopManager/shopList?type=8&code=' + cell.code)"
              >
                <template #icon>
                  <wd-img width="50" height="50" :src="cell.bannerPic" radius="5" />
                </template>
              </wd-grid-item>
            </template>
          </wd-grid>

          <wd-text text="热门推荐" custom-class="mx-2 mb-4" color="#333" size="16px"></wd-text>

          <view class="w-full box-border my-4">
            <view
              class="flex w-full px-10px box-border mb-10px bg-#fff border-rd-6px"
              v-for="item in TypeList"
              :key="item.spuId"
              @click="routeTo({ url: '/pages-sub/homeManager/shopInfo', data: { id: item.spuId } })"
            >
              <wd-img
                :width="86"
                :height="86"
                :src="getUrl(item.rotationUrl)"
                custom-style="border-radius: 5px ;overflow: hidden;"
              />
              <div class="flex-1 ml-15px flex flex-col justify-between">
                <view class="w-full name listname float-left">
                  <!--                  <text class="ZYtag" v-if="item.shopName === '数城科技'">自营</text>-->
                  {{ item.spuName }}
                </view>

                <view class="flex justify-between">
                  <view>
                    <text style="font-size: 12px; color: #f44d24">￥</text>
                    <text style="font-size: 16px; font-weight: 600; color: #f44d24">
                      {{ item.sellPrice }}
                    </text>
                  </view>

                  <view
                    class="w-23px h-23px bg-#FFECE8 flex items-center justify-center border-rd-50px mr-2"
                    @click.stop="showSku(item)"
                    v-if="item.shoppingCartMode === 1"
                  >
                    <wd-icon name="cart" size="16px" color="#F44D24"></wd-icon>
                  </view>
                </view>
              </div>
            </view>
          </view>
        </view>
        <view v-else class="p-4 flex justify-between box-border items-center empty">暂无分类</view>
      </scroll-view>
    </view>
    <vk-data-goods-sku-popup
      :amount-type="0"
      ref="skuPopup"
      v-model="skuKey"
      border-radius="20"
      :z-index="990"
      :localdata="goodsInfo"
      :mode="skuMode"
      @add-cart="addCar"
      @buy-now="buyNow"
      buyNowBackgroundColor="#F44D24"
      buyNowRounded="4px"
      :defaultSelect="defaultSelect"
      @buychange="getCouponLists"
      :couponList="couponList"
      :maxBuyNum="maxBuyNum"
      :img="getUrl(details.rotationUrl)"
    ></vk-data-goods-sku-popup>
  </view>
</template>

<style>
.content {
  flex: 1;
  background: #fff;
}

.wraper {
  display: flex;
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
  background: #f7f8fa;
}
</style>
