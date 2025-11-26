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
import { Constant } from '@/enums/constant'
import { mainTypeEmums } from '@/enums/mainTypeEmum'
import { isRouterCheckd } from '@/interceptors/route'
import morentouxiang from '@/pages-sub/shopManager/static/shoukuanma.png'
import { addressList, getgoodsCoupon } from '@/service/api/address'
import {
  addCart,
  favoritesList,
  getGoodDetails,
  getPickUpStoreByMerchantId,
  unUserFavorites,
  userFavorites,
} from '@/service/api/shop'
import fenxiang from '@/static/images/shop/fenxiang.png'
import gouwuche from '@/static/images/shop/gouwuche.png'
import kefu from '@/static/images/shop/kefu.png'
import shangdian from '@/static/images/shop/shangdian.png'
import shoucang from '@/static/images/shop/shoucang.png'
import shoucang1 from '@/static/images/shop/shoucang1.png'
import { useBaseStore, useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { getLocation, useToPhone } from '@/utils/uniapi'
import { Modal, Toast } from '@/utils/uniapi/prompt'
import dayjs from 'dayjs'

import { testUserName } from '@/utils/validate'

import { receiveCoupon } from '@/service/api/userMessage'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import { storeToRefs } from 'pinia'
import get = Reflect.get

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(relativeTime)

const { isRealSataus, userInfo, isLogined } = storeToRefs(useUserStore())
const productId = ref('')
const current = ref<number>(0)
const title = ref('商品详情')
const isFavor = ref(false)
const details = reactive<any>({})
const favorList = ref([])
// 是否打开SKU弹窗
const skuKey = ref(false)
// SKU弹窗模式
const skuMode = ref(1)

const baseStore = useBaseStore()
const location = async () => {
  try {
    if (!isRealSataus || baseStore.userLocation.latitude) {
      return
    }
    const locations = await getLocation()
    await baseStore.setLocation(locations)
    getinfos()
  } catch (error) {
    console.log('🍺[error]:', error)
  }
}
onMounted(async () => {
  location()
})

/// ////////物流模式

function goAddress(val: any) {
  routeTo({
    url: '/pages-sub/userManager/address/list',
  })
}

function getUrl(str) {
  if (str) {
    return str[0]
  } else {
    return ''
  }
}

const couponList = ref<any>([])

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
const pointLists = ref([])
const addressLists = ref([])

const deliveryMode = ref(0) // 1自提 0快递
const pickUpPoint = ref('') // 自提点位置json
const receiveAddrId = ref('') // 1自提点ID 0快递地址ID
const receiverName = ref(userInfo.value.cardName) // 自提人姓名
const receiverTel = ref(userInfo.value.userPhone) // 自提人电话

const deliveryInx = ref(0) // 配送方式index
const pointInx = ref(0) // 自提index
const addressInx = ref(0) // 快递index

const showAddress = ref(false) // 收货地址
const showMode = ref(false) // 配送方式
const showPoint = ref(false) // 自提点

function closePops() {
  showAddress.value = false
  showMode.value = false
  showPoint.value = false
}

function showPops(type) {
  closePops()
  if (type === 'showAddress') {
    showAddress.value = true
  }
  if (type === 'showMode') {
    showMode.value = true
  }
  if (type === 'showPoint') {
    showPoint.value = true
  }
}

function changePops(type, e, index) {
  if (type === 'showAddress') {
    receiveAddrId.value = e.id
    addressInx.value = index
    pickUpPoint.value = JSON.stringify(e)
  }
  if (type === 'showMode') {
    if (e.show) {
      deliveryInx.value = index
      deliveryMode.value = e.value
      receiverName.value = userInfo.value.cardName
      receiverTel.value = userInfo.value.userPhone
      receiveAddrId.value = ''
      pointInx.value = 0
      addressInx.value = 0
      pickUpPoint.value = ''
    }
  }
  if (type === 'showPoint') {
    receiveAddrId.value = ''
    pointInx.value = index
    pickUpPoint.value = JSON.stringify(e)
  }
}

async function getinfos() {
  showAddress.value = false
  showMode.value = false
  showPoint.value = false
  if (isRealSataus.value) {
    addressLists.value = await addressList({})
  } else {
    addressLists.value = []
  }

  pointLists.value = await getPickUpStoreByMerchantId({
    shopId: details.shopId,
    latitude: baseStore.userLocation.latitude ? baseStore.userLocation.latitude : '',
    longitude: baseStore.userLocation.longitude ? baseStore.userLocation.longitude : '',
  })

  if (details.logisticsType.indexOf('0') < 0) {
    deliveryLists.value[0].show = false
    deliveryMode.value = 1
    deliveryInx.value = 1
  }

  if (details.logisticsType.indexOf('1') < 0) {
    deliveryLists.value[1].show = false
    deliveryMode.value = 0
    deliveryInx.value = 0
  }

  if (pointLists.value.length === 0) {
    deliveryLists.value[1].show = false
    deliveryMode.value = 0
    deliveryInx.value = 0
  }

  if (pointLists.value.length === 0 && details.logisticsType.indexOf('0') < 0) {
    deliveryMode.value = null
  }
}

function getcuoInfo(info, total) {
  if (info) {
    if (info.couponType === 1) {
      return {
        name: '满' + info.couponFillPrice + '元 减' + info.couponPrice + '',
        money: info.couponPrice,
      }
    } else if (info.couponType === 3) {
      return {
        name: '满' + info.couponFillPrice + '元 打' + info.couponPrice + '折',
        money:
          total - total * info.couponPrice * 0.1 > info.maxDiscountAmount
            ? info.maxDiscountAmount
            : (total - (total * info.couponPrice * 0.1).toFixed(2)).toFixed(2),
      }
    }
  } else {
    return { name: '', money: 0 }
  }
}

const nums = ref(1)

async function getCouponLists(e?) {
  if (isRealSataus.value) {
    if (e) {
      nums.value = e.buy_num
      details.skuList[0].sellPrice = e.price
      couponList.value = await getgoodsCoupon({
        shopId: details.shopId,
        productsList: [
          {
            num: 1,
            price: e.price,
            productId: e.goods_id,
          },
        ],
      })
    } else {
      couponList.value = await getgoodsCoupon({
        shopId: details.shopId,
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
}

function getElected(key, index) {
  if (key === index) {
    return true
  } else {
    return false
  }
}

function checkform(name, phone) {
  let fl = false

  if (!name) {
    Toast('请填写提货人姓名')
    fl = false
    closePops()
  } else if (!testUserName(name)) {
    Toast('提货人姓名不能包含特殊字符，长度为2-20')
    fl = false
    closePops()
  } else if (!phone) {
    Toast('请填写提货人手机号')
    fl = false
    closePops()
  } else if (!/^1[3-9]\d{9}$/.test(phone)) {
    Toast('请输入正确的手机号')
    fl = false
    closePops()
  } else {
    fl = true
  }

  if (deliveryMode.value === null) {
    fl = false
  }

  return fl
}

/// ////////物流模式

// 后端返回的商品信息
let goodsInfo = reactive<any>({})

const showSku = (val: number) => {
  if (!isLogined.value) {
    Modal({ title: '提示', content: '您还没有登录，请先登录？' }).then((res: any) => {
      if (res.confirm) {
        routeTo({ url: '/pages/login/index' })
      }
    })
    return
  }
  if (!isRealSataus.value) {
    isRouterCheckd({})
    return
  }

  if (deliveryMode.value === 1 && !checkform(receiverName.value, receiverTel.value)) {
    return false
  }
  skuKey.value = true
  skuMode.value = val
}

const skuId = ref('')

const service = () => {
  useToPhone(details.shopPhone)
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
  console.log('goodsInfo', goodsInfo)
  defaultSelect.value = {
    sku: goodsInfo.sku_list[0].sku_name_arr,
    num: 1,
  }
}
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
      el.userNickName = el.userNickName || '匿名用户'
      el.evaluationContent = el.evaluationContent || '该用户没有填写评价'
    })
    maxBuyNum.value = res?.purchLimitNum * 1 || 0
    Object.assign(details, res)
    if (isRealSataus.value) {
      getinfos() // 获取要用的弹窗信息
    }

    console.log('res', res)

    formatGoodsInfo(res.skuList)

    getCouponLists()
  })
}
const foverGoods = async () => {
  if (!isRealSataus.value) {
    Modal({ title: '提示', content: '您还没有登录，请先登录？' }).then((res: any) => {
      if (res.confirm) {
        routeTo({ url: '/pages/login/index' })
      }
    })
  } else {
    if (isFavor.value) {
      const res = await unUserFavorites({
        productSpuIds: details.spuId,
      })
      Toast('取消收藏成功')
      console.log('取消收藏', res)
    } else {
      const res = await userFavorites({
        productSpuId: details.spuId,
      })
      console.log('收藏', res)
      Toast('收藏成功')
    }
    getFavoritesList()
  }
}
// 收藏接口
const getFavoritesList = async () => {
  const res: any = await favoritesList({
    current: 1,
    size: 9999,
  })
  favorList.value = res.content.map((i) => i.spuId)
  isFavor.value = favorList.value.includes(details.spuId)
  console.log('收藏列表', res, favorList.value)
}

const buyNow = async (val: any) => {
  if (
    (deliveryMode.value === 1 && checkform(receiverName.value, receiverTel.value)) ||
    deliveryMode.value === 0
  ) {
    const { shopId, shopName, shopAvatar } = details
    const obj = [
      {
        shopId,
        shopName,
        shopAvatar,
        merchantId: details.merchantId,
        orderResource: 2, //  订单来源 1web  2 小程序
        payShopListReqVo: [
          {
            spuId: val.goods_id,
            skuId: val._id,
            image: getUrl(details.rotationUrl),
            skuName: val.sku_name_arr.join(','),
            spuNum: val.buy_num,
            spuName: val.goods_name,
            price: val.price,
            stock: val.stock,
            maxBuyNum: val.maxBuyNum,
            spuType: details.spuType,

            buy_num: val.buy_num,
            goods_id: val.goods_id,

            couponInfo: couponList.value[0],
            deliveryMode: deliveryMode.value,
            pointList: pointLists.value,
            pointInx: pointInx.value,
            deliveryInx: deliveryInx.value,
            addressInx: addressInx.value,
            logisticsType: details.logisticsType, // 配送方式  0: 快递配送 ,1: 上门自提 ,2: 同城配送
            receiveAddrId: receiveAddrId.value,
            receiverName: receiverName.value,
            receiverTel: receiverTel.value,
            deliveryAmount: details.deliveryAmount,
            orderNote: '',
          },
        ],
      },
    ]
    if (
      couponList.value.length > 0 &&
      couponList.value[0].couponId &&
      couponList.value[0].isReceive === 0
    ) {
      const params = {
        couponId: couponList.value[0].couponId,
      }
      try {
        const receiveData: any = await receiveCoupon(params)
        console.log('🍼️[receiveData]:', receiveData)
        if (receiveData.couponCode) {
          uni.showToast({
            title: '领取成功',
          })
        }
      } catch (error) {
        console.log('error', error)
      }
    }
    setTimeout(
      () => {
        routeTo({
          url: '/pages-sub/homeManager/order?obj=' + JSON.stringify(obj),
        })
      },
      couponList.value.length && couponList.value[0].isReceive === 0 ? 1500 : 0,
    )
  }
}

const addCar = (val: any) => {
  if (isRealSataus.value) {
    if (
      (deliveryMode.value === 1 && checkform(receiverName.value, receiverTel.value)) ||
      deliveryMode.value === 0
    ) {
      const { shopId, shopName, shopAvatar } = details
      const objs = {
        shopId,
        shopName,
        shopAvatar,
        merchantId: details.merchantId,
        orderResource: 2, //  订单来源 1web  2 小程序

        spuId: val.goods_id,
        skuId: val._id,
        // image: val.image,
        image: getUrl(details.rotationUrl),
        buy_num: val.buy_num,
        goods_id: val.goods_id,

        skuName: val.sku_name_arr.join(','),
        spuNum: val.buy_num,
        spuName: val.goods_name,
        price: val.price,
        stock: val.stock,
        spuType: details.spuType,
        couponInfo: couponList.value[0],
        deliveryMode: deliveryMode.value,
        pointList: pointLists.value,
        pointInx: pointInx.value ? pointInx.value : 0,
        deliveryInx: deliveryInx.value ? deliveryInx.value : 0,
        addressInx: addressInx.value ? addressInx.value : 0,
        logisticsType: details.logisticsType, // 配送方式  0: 快递配送 ,1: 上门自提 ,2: 同城配送
        receiveAddrId: receiveAddrId.value,
        receiverName: receiverName.value,
        receiverTel: receiverTel.value,
        deliveryAmount: details.deliveryAmount,
        orderNote: '',
      }

      const obj = {
        customerId: userInfo.value.userDId,
        shopId: details.shopId,
        skuId: val._id,
        itemNum: val.buy_num,
        spuType: details.spuType,
        spuId: val.goods_id,
        shopAvatar: details.shopAvatar,
        buy_num: val.buy_num,
        goods_id: val.goods_id,
        cartData: JSON.stringify(objs),
        merchantId: details.merchantId,
      }
      addCart(obj).then((res) => {
        console.log('添加购物车', res)
        Toast('添加购物车成功')
        skuKey.value = false
      })
    }
  } else {
    Modal({ title: '提示', content: '您还没有登录，请先登录？' }).then((res: any) => {
      if (res.confirm) {
        routeTo({ url: '/pages/login/index' })
      }
    })
  }
}

onShow(() => {
  getFavoritesList()
  skuKey.value = false
  getDetails(productId.value)
  // if (isRealSataus.value && productId.value) {
  //   getinfos()
  //
  // }
})
const goList = () => {
  if (details.evaList.length <= 3) {
    routeTo({ url: `/pages-sub/shopManager/evaluateList?details=${details.spuId}` })
  }
}

const defaultSelect = ref({})

const noHistory = ref(false)
onLoad(async (options) => {
  // await getList()
  console.log('options', options)
  productId.value = options.id
  noHistory.value = options.noHistory
  onShareAppMessage((res) => {
    if (res.from === 'button') {
      const path =
        Constant.MAIN_PAGE +
        `?type=${mainTypeEmums.SHARE_PROUDUCT}&shareUserId=${userInfo.value.userDId}&id=${productId.value}`
      const shareData = {
        title: details.spuName ? details.spuName : '商品',
        path,
        imageUrl: details.rotationUrl[0],
        complete: () => {
          // 分享记录
          useShare(path)
        },
      }
      console.log('🍢', shareData)
      return shareData
    }
  })
  onShareTimeline(() => {
    const path =
      Constant.MAIN_PAGE +
      `?type=${mainTypeEmums.SHARE_PROUDUCT}&shareUserId=${userInfo.value.userDId}&id=${productId.value}`
    return {
      title: details.spuName ? details.spuName : '商品',
      path,
      imageUrl: details.rotationUrl[0],
      complete: () => {
        // 分享记录
        useShare(path)
      },
    }
  })
})
const isNavShow = ref(true)
onPageScroll((e) => {
  if (e.scrollTop > 30) {
    isNavShow.value = false
  } else {
    isNavShow.value = true
  }
})
// 跳转商铺
const toShop = () => {
  // 判断如果是从商铺进入的详情页，则详情页不再进入历史栈
  if (noHistory.value) {
    uni.navigateBack()
  } else {
    routeTo({ url: '/pages-sub/shopManager/shopHome', data: { id: details.shopId } })
  }
}

const buyText = computed(() => {
  // 0未领取 1已领取
  return (couponList.value && couponList.value.length > 0 && couponList.value[0].isReceive === 1) ||
    !couponList.value.length
    ? '立即购买'
    : '领券购买'
})
</script>

<template>
  <view class="pageBoxBg w-screen pos-relative">
    <dy-navbar
      :leftTitle="title"
      left
      :isNavShow="isNavShow"
      :placeholder="false"
      color="#000"
    ></dy-navbar>
    <wd-swiper
      :list="details.rotationUrl"
      value-key="data"
      autoplay
      v-model:current="current"
      height="100vw"
      custom-class="overflow-hidden"
      customItemClass="border0"
    ></wd-swiper>
    <view
      class="bg-#F5F6F8 relative mt-[-15px] p-15px pt-25px box-border overflow-hidden pb-100px rounded-t-20px"
    >
      <view class="FHcs">
        <view class="FHcl">
          <view
            style="
              margin-top: 10px;
              margin-right: 2px;
              font-size: 12px;
              font-weight: bold;
              color: #f44d24;
            "
          >
            ￥
          </view>
          <view style="margin-right: 10px; font-size: 34px; font-weight: bold; color: #f44d24">
            {{
              details.skuList
                ? (
                    Number(details.skuList[0].sellPrice) -
                    getcuoInfo(couponList[0], (details.skuList[0].sellPrice * 1).toFixed(2)).money
                  ).toFixed(2) > 0
                  ? (
                      Number(details.skuList[0].sellPrice) -
                      getcuoInfo(couponList[0], (details.skuList[0].sellPrice * 1).toFixed(2)).money
                    ).toFixed(2)
                  : '0.0'
                : '0.0'
            }}
          </view>
          <view
            style="
              padding: 0 5px;
              margin-right: 10px;
              font-size: 10px;
              line-height: 16px;
              color: #fff;
              background: #f44d24;
              border-radius: 3px 3px 3px 3px;
            "
            v-if="couponList.length > 0"
          >
            券后价
          </view>
          <view
            style="
              margin-right: 10px;
              font-size: 14px;
              color: #808080;
              text-decoration: line-through;
            "
            v-if="couponList.length > 0"
          >
            {{ details.skuList ? '￥' + details.skuList[0].sellPrice.toFixed(2) : '￥' + 0 }}
          </view>
        </view>
        <view style="font-size: 12px; color: #87868c; text-align: right">
          已售
          {{
            details && details.frequently
              ? details.frequently > 9999
                ? '9999+'
                : details.frequently
              : 0
          }}
        </view>
      </view>

      <view class="FHcl mt-5px mb-0px">
        <view
          style="
            padding: 0 8px;
            font-size: 12px;
            line-height: 18px;
            color: #f44d24;
            border: 1px solid #f44d24;
            border-radius: 5px 5px 5px 5px;
          "
          v-if="couponList.length > 0"
        >
          {{ getcuoInfo(couponList[0], (details.skuList[0].sellPrice * 1).toFixed(2)).name }}
        </view>

        <view class="flex gap-10px items-center ml-10px" v-if="isRealSataus">
          <view class="flex items-center gap-5px" @click="foverGoods">
            <wd-img v-if="!isFavor" :width="14" :height="14" :src="shoucang"></wd-img>
            <wd-img v-else :width="14" :height="14" :src="shoucang1"></wd-img>
            <view class="color-#999! font-size-14px">收藏</view>
          </view>

          <!-- #ifndef APP-PLUS -->
          <view class="color-#999" v-if="isRealSataus">|</view>
          <view v-if="isRealSataus">
            <wd-button type="text" open-type="share">
              <view class="flex items-center pt-5px gap-5px">
                <wd-img :width="12" :height="12" :src="fenxiang"></wd-img>
                <view class="color-#999! font-size-14px">分享</view>
              </view>
            </wd-button>
          </view>
          <!-- #endif -->
        </view>
      </view>
      <view class="text-cut-line2 mt-5px font-600 pl-4px pr-10px font-size-18px">
        {{ details.spuName }}
      </view>

      <view
        class="w-full bg-white py-5px px-15px box-border border-rd-10px mt-15px"
        v-if="details.evaList && isRealSataus"
      >
        <view
          class="w-full flex justify-between items-center py-5px"
          v-if="deliveryLists[deliveryInx]"
        >
          <view class="mr-50px labels">配送方式</view>

          <view v-if="deliveryLists[0].show && !deliveryLists[1].show">
            <text class="mr-5px font-bold" style="font-size: 14px; font-weight: 600">
              {{ deliveryLists[0].name }}
            </text>
          </view>
          <view v-else-if="deliveryLists[1].show && !deliveryLists[0].show">
            <text class="mr-5px font-bold" style="font-size: 14px; font-weight: 600">
              {{ deliveryLists[1].name }}
            </text>
          </view>

          <view v-else @click="showPops('showMode')" class="flex items-center">
            <text class="mr-5px font-bold" style="font-size: 14px; font-weight: 600">
              {{
                deliveryLists[deliveryInx].name ? deliveryLists[deliveryInx].name : '请选择自提点'
              }}
            </text>
            <wd-icon name="arrow-right" size="14px"></wd-icon>
          </view>
        </view>
        <view
          class="line"
          style="border-color: #707070; border-style: dashed; border-width: 1px; opacity: 0.2"
        ></view>
        <view
          class="w-full flex justify-between items-center pt-10px pb-10px"
          v-if="deliveryLists[deliveryInx] && deliveryLists[deliveryInx].value === 0"
        >
          <view class="label2s">配送地址</view>
          <view @click="showPops('showAddress')" class="flex items-center flex-shrink-1">
            <text
              class="mr-5px font-bold"
              style="max-width: 200px; font-size: 14px; font-weight: 600; overflow-wrap: break-word"
            >
              {{
                addressLists[addressInx] && addressLists[addressInx].userAddress
                  ? addressLists[addressInx].userAddress
                  : '请选择配送地址'
              }}
            </text>
            <wd-icon name="arrow-right" size="14px"></wd-icon>
          </view>
        </view>

        <view
          class="w-full flex justify-between items-center pt-10px"
          v-if="deliveryLists[deliveryInx] && deliveryLists[deliveryInx].value === 1"
        >
          <view class="label2s">自提点</view>
          <view @click="showPops('showPoint')" class="flex items-center">
            <!--                          <wd-icon name="location" size="16px" color="#999999"></wd-icon>-->
            <text class="mr-5px" style="font-size: 14px; font-weight: 600">
              {{ pointLists[pointInx].storeName ? pointLists[pointInx].storeName : '请选择自提点' }}
            </text>
            <wd-icon name="arrow-right" size="14px"></wd-icon>
          </view>
        </view>
        <view
          class="w-full flex justify-between items-center py-0px"
          v-if="deliveryLists[deliveryInx] && deliveryLists[deliveryInx].value === 1"
        >
          <view class="label2s">提货人姓名</view>
          <view style="font-size: 14px">
            <wd-input
              type="text "
              custom-input-class="text-right font-14px"
              no-border
              style="font-size: 14px"
              placeholder="请填写提货人姓名"
              prop="receiverName"
              clearable
              v-model.trim="receiverName"
            />
          </view>
        </view>
        <view
          class="w-full flex justify-between items-center pb-10px"
          v-if="deliveryLists[deliveryInx] && deliveryLists[deliveryInx].value === 1"
        >
          <view class="label2s">提货人手机号</view>
          <view style="font-size: 14px">
            <wd-input
              type="text  font-#666"
              custom-input-class="text-right font-14px"
              no-border
              placeholder="请填写提货人手机号"
              prop="receiverTel"
              clearable
              v-model.trim="receiverTel"
            />
          </view>
        </view>
      </view>
      <view class="w-full bg-white p-15px box-border border-rd-10px mt-10px" v-if="details.evaList">
        <view class="color-#333">
          评价
          <text class="color-#999 font-size-14px">
            （{{ details.evaList ? details.evaList.length : 0 }}）
          </text>
        </view>
        <!-- 只显示3条 截取评价列表数据3条就行 -->
        <view
          class="flex mt-10px mb-10px"
          v-for="i in details.evaList.slice(0, 3)"
          :key="i.id"
          @click="goList"
        >
          <wd-img :width="45" :height="45" :src="morentouxiang" round></wd-img>
          <view class="flex-1 overflow-hidden ml-10px">
            <view class="w-full">
              <view class="FHcs">
                <wd-text :text="i.userNickName" bold color="#333"></wd-text>
                <wd-text
                  :text="`${dayjs(i.evaluationTime).locale('zh-cn').fromNow()}`"
                  size="12px"
                  color="#999"
                ></wd-text>
              </view>
              <wd-text
                :text="i.specification"
                size="12px"
                color="#999"
                custom-class="over1"
              ></wd-text>
            </view>

            <view class="text">
              {{ i.evaluationContent }}
            </view>
            <view
              style="margin-top: 5px; font-size: 14px; color: #999"
              v-if="i.replyList && i.replyList.length > 0"
            >
              <view
                class="text"
                style="font-size: 14px; color: #999"
                v-for="(its, index) in i.replyList"
                :key="index"
              >
                {{ its.replyUserNick }}回复：{{ its.replyContent }}
              </view>
            </view>
          </view>
        </view>
        <view
          v-if="details.evaList.length > 3"
          class="color-#999 w-full pt-5px flex items-center justify-center mt-10px"
          style="border-top: 1px solid #eee"
          @click="routeTo({ url: `/pages-sub/shopManager/evaluateList?details=${details.spuId}` })"
        >
          <text class="color-#999">查看全部评价</text>
          <wd-icon name="arrow-right" size="20px"></wd-icon>
        </view>
      </view>

      <view class="bg-white p-15px box-border border-rd-10px mt-10px">
        <view class="font-600 mb-20px color-#333">商品详情</view>
        <template v-if="details && details.skuUrl">
          <wd-img
            width="100%"
            mode="widthFix"
            radius="7"
            v-for="i in details.skuUrl"
            :src="i"
            :key="i"
          ></wd-img>
        </template>
      </view>
    </view>

    <view
      class="w-full p-15px bg-white box-border flex items-center justify-between pos-fixed pos-bottom-none"
      v-if="details.shoppingCartMode === 1"
    >
      <view class="flex w-2/5 justify-between pl-10px">
        <view class="flex flex-col item-center justify-center" @click="toShop">
          <wd-img :width="30" height="30" :src="shangdian" mode="aspectFit"></wd-img>
          <wd-text text="进店" color="#666666" size="12px" custom-class="texts"></wd-text>
        </view>
        <view
          class="flex flex-col item-center justify-center"
          @click="service"
          v-if="details.shopPhone"
        >
          <wd-img :width="30" height="30" :src="kefu" mode="aspectFit"></wd-img>
          <wd-text text="客服" color="#666666" size="12px" custom-class="texts"></wd-text>
        </view>
        <view
          class="flex flex-col item-center justify-center"
          @click="routeTo({ url: '/pages-sub/homeManager/shopCar' })"
        >
          <wd-img :width="30" height="30" :src="gouwuche" mode="aspectFit"></wd-img>
          <wd-text text="购物车" color="#666666" size="12px" custom-class="texts"></wd-text>
        </view>
      </view>

      <view
        class="flex-1 flex items-center ml-10px line-height-40px border-rd-50px overflow-hidden"
      >
        <view
          class="w-full text-center bg-#FEF2F2 color-#F44D24 font-size-15px w-1/2"
          @click="showSku(2)"
        >
          加入购物车
        </view>
        <view
          class="w-full text-center bg-#F44D24 color-#FFFFFF font-size-15px w-1/2"
          @click="showSku(3)"
        >
          {{ buyText }}
        </view>
      </view>
    </view>

    <view
      class="w-full p-15px bg-white box-border flex items-center justify-between pos-fixed pos-bottom-none"
      v-else
    >
      <view
        class="flex w-2/5 pl-10px"
        style="box-sizing: border-box; justify-content: space-between; padding-right: 15%"
      >
        <view class="flex flex-col item-center justify-center" @click="toShop">
          <wd-img :width="30" height="30" :src="shangdian" mode="aspectFit"></wd-img>
          <wd-text text="进店" color="#666666" size="12px" custom-class="texts"></wd-text>
        </view>
        <view
          class="flex flex-col item-center justify-center"
          @click="service"
          v-if="details.shopPhone"
        >
          <wd-img :width="30" height="30" :src="kefu" mode="aspectFit"></wd-img>
          <wd-text text="客服" color="#666666" size="12px" custom-class="texts"></wd-text>
        </view>
      </view>

      <view
        class="flex-1 flex items-center ml-10px line-height-40px border-rd-50px overflow-hidden"
      >
        <view
          class="w-full text-center bg-#F44D24 color-#FFFFFF font-size-15px w-1/2"
          @click="showSku(3)"
        >
          {{ buyText }}
        </view>
      </view>
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

    <!--    //////////////////////-->
    <!--    //选择方式-->
    <wd-popup
      v-model="showMode"
      lock-scroll
      position="bottom"
      custom-class="pt-18px px-15px pb-25px box-border rounded-t-20px"
    >
      <view class="font-600 mb-20px px-15px">配送方式</view>

      <view class="overflow-y-auto max-h-60vh py-10px">
        <view
          class="flex py-10px"
          v-for="(key, ind) in deliveryLists"
          :key="ind"
          :style="deliveryInx === ind ? 'color:#f44d24' : 'color:#333'"
          @click="changePops('showMode', key, ind)"
        >
          <view class="flex-1 overflow-hidden">
            <view
              class="text-center w-full overflow-hidden font-size-16px line-height-36px"
              :style="!key.show ? ' opacity: 0.3;' : ''"
            >
              {{ key.name }}
            </view>
          </view>
        </view>
      </view>

      <view class="address-submit" @click="closePops()">确定</view>
    </wd-popup>
    <!--    //选择方式-->

    <!--    &lt;!&ndash; 提货 &ndash;&gt;-->
    <wd-popup
      v-model="showPoint"
      lock-scroll
      position="bottom"
      custom-class="pt-18px px-15px pb-25px box-border rounded-t-20px"
    >
      <view class="font-600 mb-20px px-15px">选择自提点</view>

      <view class="overflow-y-auto max-h-60vh py-10px pb-20px">
        <view
          class="flex pb-10px"
          v-for="(key, ind) in pointLists"
          :key="ind"
          @click="changePops('showPoint', key, ind)"
        >
          <view class="FHst">
            <view style="width: 30px; padding-left: 5px; margin-top: 1px; text-align: center">
              <view
                class="FScc"
                :style="
                  getElected(pointInx, ind)
                    ? 'width:15px;height:15px;border-radius:100%;background:#f44d24'
                    : 'width: 15px;height: 15px;border-radius:100%;background:#f44d24;border: 1px solid #999;'
                "
              >
                <wd-icon
                  name="check-bold"
                  size="12px"
                  custom-style="margin-top:1px"
                  color="#fff"
                  v-if="getElected(pointInx, ind)"
                ></wd-icon>
              </view>
            </view>
            <view class="flex-1 overflow-hidden">
              <view class="name w-full overflow-hidden" style="font-size: 16px; color: #000">
                {{ key.storeName }}
              </view>
              <view class="name w-full overflow-hidden mt-5px">
                <wd-icon name="location" size="12px" color="#999999"></wd-icon>
                <text style="margin-left: 2px; font-size: 12px; color: #999999">
                  {{ key.address }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="address-submit" @click="closePops()">确定</view>
    </wd-popup>
    <!-- 提货 -->
    <!-- 选择收货地址 -->
    <wd-popup
      v-model="showAddress"
      lock-scroll
      position="bottom"
      custom-class="pt-18px px-15px pb-25px box-border rounded-t-20px"
    >
      <view class="font-600 mb-10px">选择收货地址</view>
      <view class="FHcs mb-10px">
        <view class="mr-40px" style="font-size: 14px; color: #333">常用地址</view>
        <view class="mb-10px" @click="goAddress" style="font-size: 14px; color: #f44d24">
          +新建收货地址
        </view>
      </view>

      <view class="overflow-y-auto max-h-60vh py-10px pb-20px">
        <templete v-if="addressLists.length > 0">
          <view
            class="flex pb-10px mb-15px"
            v-for="(key, ind) in addressLists"
            style="
              padding: 15px;
              background: #f8f8f8;
              border: 1px solid #f0f0f0;
              border-radius: 7px 7px 7px 7px;
            "
            :key="ind"
            @click="changePops('showAddress', key, ind)"
          >
            <view class="FHst">
              <view style="width: 30px; padding-left: 5px; margin-top: 1px; text-align: center">
                <view
                  class="FScc"
                  :style="
                    getElected(addressInx, ind)
                      ? 'width: 15px;height: 15px;border-radius:100%;background:#f44d24;border: 1px solid #f44d24;'
                      : 'width: 15px;height: 15px;border-radius:100%;background:#fff;border: 1px solid #999;'
                  "
                >
                  <wd-icon
                    name="check-bold"
                    size="12px"
                    custom-style="margin-top:1px"
                    color="#fff"
                    v-if="getElected(addressInx, ind)"
                  ></wd-icon>
                </view>
              </view>
            </view>
            <view class="flex-1 overflow-hidden">
              <view
                style="width: 100%; margin-bottom: 5px; font-size: 14px; color: #888888"
                class="add-detail"
              >
                {{ key.province }} {{ key.city }} {{ key.area }}
              </view>
              <view class="w-full flex items-center justify-between py-5px">
                <view class="flex-1 add-detail" style="width: 100%; font-size: 16px; color: #000">
                  {{ key.userAddress }}
                </view>
              </view>
              <view style="margin-top: 5px; font-size: 14px; color: #000">
                {{ key.userName }} {{ key.userPhone }}
              </view>
            </view>
          </view>
        </templete>
        <wd-status-tip v-else image="content" tip="暂无内容" />
      </view>

      <view class="address-submit" @click="closePops()">确定</view>
    </wd-popup>
    <!-- 选择收货地址 -->

    <!--    //////////////////////-->
  </view>
</template>
<style lang="scss" scoped>
.pageBoxBg {
  min-height: 100vh;
  background: #f3f4f6;
}

.text-cut-line2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.text {
  overflow: hidden;
  color: #333333;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 16px;
  color: #777777;
}

:deep(.texts) {
  display: inline-block;
  min-width: 30px;
  text-align: center;
}

:deep(.wd-swiper__track) {
  border-radius: 0 !important;
}

.labels {
  font-size: 14px;
  font-weight: 400;
  line-height: 44px;
  color: #000000;
  text-align: left;
}

.label2s {
  font-size: 14px;
  font-weight: 400;
  line-height: 36px;
  color: #000000;
  text-align: left;
}

.vals {
  font-size: 14px;
  font-weight: 600;
  line-height: 44px;
  color: #000000;
  text-align: right;
}

.submit {
  width: 103px;
  margin-left: 20px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  background: #f44d24;
  border-radius: 6px 6px 6px 6px;
}

.address-submit {
  width: 100%;
  margin: 0px 0 20px 0;
  line-height: 40px;
  color: #fff;
  text-align: center;
  background: #f44d24;
  border-radius: 5px 5px 5px 5px;
}
</style>
