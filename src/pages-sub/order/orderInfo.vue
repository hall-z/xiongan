<route lang="json5" type="page">
{
  layout: 'default',

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
import { appOrderPayone, getShopInfo, xcxNewPay } from '@/service/api/shop'
import { useUserStore } from '@/store'
import { removeT, routeTo } from '@/utils'
import { openEmbeddedMiniProgram, useToPhone } from '@/utils/uniapi'
import { useMessage } from 'wot-design-uni/index'
import orderInter from './utils/orderInter'
const message = useMessage()
const userStore = useUserStore()
const {
  sendOrderInfo,
  sendOrderList,
  sendchangeOrderStatus,
  updateOrderBeanStatusById,
  sendOrderUpdate,
  sendRefund,
  sendRefundRequest,
  sendRefundReview,
  sendOrderInterfereStatus,
} = orderInter()
const paging = ref(null)
const chooseIndex = ref<number>(0)
const chooseIndexTK = ref<number>(0)

const title = ref('订单详情')

const orderInfo = ref({})
const shopDetails = ref({})
const loading = ref(true)
const showPop = ref(false)
const showPopTK = ref(false)
const orderID = ref('')

const time = ref<number>(108000)
const dispay = ref(false)
const canList = ref(['不想要了', '信息填错，重新下单', '卖家缺货', '物流原因', '其他原因'])
const canListTK = ref(['不想要了', '信息填错，重新下单', '卖家缺货', '物流原因', '其他原因'])

function closePop() {
  showPop.value = false
}

function toLocation(e) {
  uni.openLocation({
    latitude: e.dimension * 1,
    longitude: e.longitude * 1,
    name: e.name,
    address: e.address,
  })
}

function closePopTK() {
  showPopTK.value = false
}

function Choose(index) {
  chooseIndex.value = index.value
}

function ChooseTK(index) {
  chooseIndexTK.value = index.value
}

function timefinish() {
  dispay.value = true
  uni.redirectTo({ url: '/pages-sub/order/orderInfo?id=' + orderInfo.value.orderId })
}

function cancal() {
  sendchangeOrderStatus({
    orderId: orderInfo.value.orderId,
    note: canList.value[chooseIndex.value],
  }).then((res) => {
    closePop()
    // uni.redirectTo({ url: '/pages-sub/order/orderList' })
    uni.redirectTo({ url: '/pages-sub/order/orderInfo?id=' + orderInfo.value.orderId })
  })
}

const payLoading = ref(false)
const goPay = async () => {
  payLoading.value = true
  uni.showLoading({
    title: '支付中...',
    mask: true,
  })
  clearInterval(Time.value)
  if (dispay.value) {
    uni.showToast({
      title: '订单已失效',
    })
  } else {
    try {
      let orders = JSON.parse(JSON.stringify(orderInfo.value))
      const sysOrderItemBeans = JSON.parse(JSON.stringify(orders.sysOrderItemBeans))
      orders = await sendOrderUpdate({ orderId: orders.orderId })
      orders.sysOrderItemBeans = sysOrderItemBeans
      orderID.value = orders.orderId
      // #ifdef APP-PLUS
      appOrderPayone({ orderId: orders.orderId, payType: 1 }).then((res: any) => {
        console.log('准备支付', res.redirectUrl)
        plus.runtime.openURL(res.redirectUrl, (err) => {
          console.log('失败', err)
        })
      })
      // #endif
      // #ifdef MP-WEIXIN
      xcxNewPay({ orderId: orders.orderId, openId: userStore.openid }).then(async (res: any) => {
        console.log(res)
        const { encryptStr, mid, tid, isZero } = res
        if (isZero === 0) {
          await openEmbeddedMiniProgram(
            `/pages/pay/wxMiniPay?encryptStr=${encryptStr}&mid=${mid}&tid=${tid}`,
            // `/pages/pay/wxMiniPay?encryptStr=${encryptStr}&mid=2411250913509978&tid=087481292`,
          )
        } else {
          reloadInfo()
        }
      })
      // #endif
    } catch (error) {
      console.log(error)
      payLoading.value = false
    } finally {
      payLoading.value = false
    }
  }
}
const goNext = (orderId, status = 2) => {
  uni.showModal({
    title: '收货确认',
    content: '您确定要收货吗',
    success: async function (res) {
      if (res.confirm) {
        const data = { orderId, status }
        updateOrderBeanStatusById(data).then((res) => {
          if (res) {
            uni.showToast({ title: '收货成功', icon: 'none' })
            setTimeout(() => {
              routeTo({
                url: '/pages-sub/order/orderList',
                data: {
                  tabsVal: '11',
                },
              })
            }, 2000)
          }
        })
      } else if (res.cancel) {
        console.log('用户取消')
      }
    },
  })
}
const getShopDetails = (shopId) => {
  getShopInfo({ shopId }).then((res) => {
    shopDetails.value = res
  })
}
const Time = ref(null)
const fst = ref(-1)

const getInfo = async (id: any) => {
  // 这里是请求数据
  const da = { orderId: id }
  orderInfo.value = await sendOrderInfo(da)

  Time.value = setInterval(async function () {
    orderInfo.value = await sendOrderInfo(da)
    if (fst.value === -1) {
      fst.value = orderInfo.value.status
    }
    if (fst.value !== orderInfo.value.status || orderInfo.value.status !== 1) {
      clearInterval(Time.value)
    }

    if (orderInfo.value.pickUpPoint) {
      orderInfo.value.pickUpPoint = JSON.parse(orderInfo.value.pickUpPoint)
      orderInfo.value.shopPhone = orderInfo.value.pickUpPoint.storePhone
    }

    loading.value = false

    time.value =
      new Date(orderInfo.value.orderTime).getTime() + 1000 * 60 * 30 - new Date().getTime()
    if (orderInfo.value.status === 1 && time.value <= 0) {
      // 修改订单状态
      await sendchangeOrderStatus({ orderId: id, note: '订单超时' }).then((res) => {
        uni.redirectTo({ url: '/pages-sub/order/orderList?tabsVal=-1' })
      })
    }

    if (orderInfo.value.shopId) {
      await getShopDetails(orderInfo.value.shopId)
    }
  }, 1000)

  setTimeout(function () {
    clearInterval(Time.value)
  }, 10000)
}

const gopath = function (url, e) {
  routeTo({
    url,
    data: e,
  })
}

const showSKU = function (obj) {
  const SKU = []
  Object.values(obj).map((i) => SKU.push(i))

  return SKU.join(',')
}

function goshop() {
  routeTo({ url: '/pages-sub/shopManager/shopHome', data: { id: orderInfo.value.shopId } })
}

const copy = function (data) {
  uni.setClipboardData({
    data,
    success: function () {
      uni.getClipboardData({
        success: function (res) {
          uni.showToast({
            title: '复制成功',
          })
        },
      })
    },
  })
}

function goEvaluate(orderId) {
  routeTo({ url: '/pages-sub/shopManager/addEvaluate', data: { id: orderId } })
}

function getRefundReason() {
  routeTo({
    url: '/pages-sub/AfterSalesService/ReturnForm/index',
    data: { orderId: orderInfo.value.orderId },
  })
}

function goRefund(orderId, type) {
  if (!JSON.stringify(chooseIndexTK.value)) {
    // chooseIndexTK.value默认为0，会进入判断，则改为字符串判断
    message.alert('请选择退款原因')
    return
  }
  routeTo({ url: '/pages-sub/AfterSalesService/ReturnForm/index', data: { orderId } })

  // uni.showModal({
  //   title: '退款确认',
  //   content: '您确定要申请退款吗',
  //   success: async function (res) {
  //     if (res.confirm) {
  //       const da = {
  //         orderId,
  //         note: canListTK.value[chooseIndexTK.value],
  //         refundMethod: 1,
  //       }
  //       const date = await sendRefundRequest(da)

  //       if (date) {
  //         showPopTK.value = false
  //         // routeTo({ url: '/pages-sub/order/orderInfo', data: { id: orderId } })
  //         uni.redirectTo({
  //           url: '/pages-sub/order/orderInfo?id=' + orderId,
  //         })
  //       } else {
  //         uni.showToast({
  //           title: '申请失败',
  //           duration: 2000,
  //         })
  //       }
  //     } else if (res.cancel) {
  //       console.log('用户点击取消')
  //     }
  //   },
  // })
}

async function gotickets(e) {
  try {
    const res: any = await sendOrderInterfereStatus({ orderId: e.orderId })
    console.log('🦑[res]:', res)
    if (res?.handleStatus >= 0) {
      routeTo({ url: '/pages-sub/userManager/tickets/ticketsInfoDetil', data: { id: e.orderId } })
    } else {
      routeTo({ url: '/pages-sub/userManager/tickets/ticketsInfo', data: { id: e.orderId } })
    }
  } catch (error) {
    if (!error.data?.code) {
      routeTo({ url: '/pages-sub/userManager/tickets/ticketsInfo', data: { id: e.orderId } })
    }
  }
}

function getlocation(latitude, longitude, name, shopDesc) {
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

function call(Phone) {
  useToPhone(Phone)
}

const reloadInfo = async () => {
  if (orderID.value) {
    clearInterval(Time.value)
    await getInfo(orderID.value)
    payLoading.value = false
    uni.hideLoading()
  }
}

const getOrderState = (state) => {
  let stateStr = ''

  if (orderInfo.value.status === 1) {
    stateStr = '待付款'
  } else if (orderInfo.value.status === 10) {
    stateStr = '待发货'
  } else if (orderInfo.value.status === 11) {
    stateStr = '待收货'
  } else if (orderInfo.value.status === 25 || orderInfo.value.status === 20) {
    stateStr = '申请仅退款'
  } else if (orderInfo.value.status === 23) {
    stateStr = '退款失败'
  } else if (orderInfo.value.status === 22) {
    stateStr = '退款成功'
  } else if (orderInfo.value.status === 2) {
    stateStr = '已完成'
  } else if (orderInfo.value.status === 3) {
    stateStr = '已取消'
  } else {
    stateStr = '已完成'
  }

  return stateStr
}

onUnload(() => {
  clearInterval(Time.value)
})
onHide(() => {
  clearInterval(Time.value)
})
onLoad(async (options) => {
  loading.value = true
  showPop.value = options.showPop ? options.showPop : false
  showPopTK.value = options.showPopTK ? options.showPopTK : false
  orderID.value = options.id
  console.log('传参', options)
  // getInfo(options.id)
})

onShow(async (options) => {
  loading.value = true

  reloadInfo()
})
</script>

<template>
  <dy-content>
    <template #top>
      <dy-navbar :leftTitle="title" left></dy-navbar>
    </template>
    <view class="w-full h-full flex items-center justify-center" v-if="loading">
      <wd-loading type="ring" size="50px" />
    </view>
    <view class="bg-#f5f5f5 border-box" v-else style="padding: 10px 15px 90px">
      <view class="flex justify-center items-center flex-col" v-if="orderInfo.status === 1">
        <wd-text
          text="等待付款"
          size="20px"
          color="#333333"
          custom-class="my-1 text-center font-bold"
        ></wd-text>
        <view class="flex justify-center items-center mt-1 mb-2">
          <wd-count-down
            :time="time"
            color="#f44d24"
            custom-class="mr-1 time font-size-14px"
            @finish="timefinish()"
          />

          <wd-text
            text="后订单将自动取消"
            size="14px"
            color="#777777"
            custom-class="ml-1"
          ></wd-text>
        </view>
      </view>
      <view
        v-else-if="orderInfo.status === 10 && orderInfo.deliveryMode !== 1"
        class="flex justify-center items-center flex-col"
      >
        <wd-text
          text="等待发货"
          size="20px"
          color="#333333"
          custom-class="my-1 text-center font-bold"
        ></wd-text>
        <view class="flex justify-center items-center mt-1 mb-2">
          <wd-text
            text="订单商品将尽快发出，请您耐心等待"
            size="14px"
            color="#777777"
            custom-class="ml-1"
          ></wd-text>
        </view>
      </view>

      <view
        v-else-if="
          (orderInfo.status === 10 || orderInfo.status === 11) && orderInfo.deliveryMode === 1
        "
        class="flex justify-center items-center flex-col"
      >
        <wd-text
          text="等待使用"
          size="20px"
          color="#333333"
          custom-class="my-1 text-center font-bold"
        ></wd-text>
        <dy-qrcode
          :option="{
            str: JSON.stringify({
              orderId: orderInfo.orderId,
              pickUpCode: orderInfo.pickUpCode,
              type: 'yktOrder',
            }),
          }"
        ></dy-qrcode>
        <view class="flex justify-center items-center mt-1 mb-2" style="width: 100%">
          提货码:{{ orderInfo.pickUpCode }}
          <view class="tit2" style="color: #f80" @click="copy(orderInfo.pickUpCode)">复制</view>
        </view>

        <view class="tagsBox">
          <wd-icon name="error-circle-filled" size="22px"></wd-icon>
          到店确认商品无误后将该码提供给商家
        </view>
      </view>

      <view
        v-else-if="orderInfo.status === 11 && orderInfo.deliveryMode !== 1"
        class="flex justify-center items-center flex-col"
      >
        <wd-text
          text="等待收货"
          size="20px"
          color="#333333"
          custom-class="my-1 text-center font-bold"
        ></wd-text>
        <view class="flex justify-center items-center mt-1 mb-2">
          <wd-text
            text="订单商品运输中，请您耐心等待"
            size="14px"
            color="#777777"
            custom-class="ml-1"
          ></wd-text>
        </view>
      </view>
      <view v-else-if="orderInfo.status === 2" class="flex justify-center items-center flex-col">
        <wd-text
          text="交易完成"
          size="20px"
          color="#333333"
          custom-class="my-1 text-center font-bold"
        ></wd-text>
      </view>
      <view v-else-if="orderInfo.status === 22" class="flex justify-center items-center flex-col">
        <wd-text
          text="退款成功"
          size="20px"
          color="#333333"
          custom-class="my-1 text-center font-bold"
        ></wd-text>
      </view>
      <view v-else-if="orderInfo.status === 23" class="flex justify-center items-center flex-col">
        <wd-text
          text="退款失败"
          size="20px"
          color="#333333"
          custom-class="my-1 text-center font-bold"
        ></wd-text>
      </view>
      <view v-else-if="orderInfo.status === 3" class="flex justify-center items-center flex-col">
        <wd-text
          text="订单取消"
          size="20px"
          color="#333333"
          custom-class="my-1 text-center font-bold"
        ></wd-text>
      </view>
      <view
        v-else-if="orderInfo.status === 25 || orderInfo.status === 20"
        class="flex justify-center items-center flex-col"
      >
        <wd-text
          text="申请仅退款"
          size="20px"
          color="#333333"
          custom-class="my-1 text-center font-bold"
        ></wd-text>
      </view>
      <view v-else class="flex justify-center items-center flex-col">
        <wd-text
          text="交易关闭"
          size="20px"
          color="#333333"
          custom-class="my-1 text-center font-bold"
        ></wd-text>
      </view>
      <view class="mt-10px mb-10px">
        <view class="bg-white border-rd-10px px-15px box-border w-full mb-10px">
          <view class="flex justify-between items-center py-2">
            <view class="flex justify-left items-center">
              <view
                v-if="orderInfo.deliveryMode !== 1"
                class="flex justify-left items-start flex-col ml-1"
              >
                <wd-text
                  :text="
                    orderInfo.receiverAddress.split(',')[0] +
                    ' ' +
                    orderInfo.receiverAddress.split(',')[1] +
                    ' ' +
                    orderInfo.receiverAddress.split(',')[2]
                  "
                  size="14px"
                  color="#777777"
                  custom-class="mb-1"
                ></wd-text>
                <wd-text
                  :text="orderInfo.receiverAddress.split(',')[3]"
                  size="16px"
                  color="#333333"
                  custom-class="font-bold"
                ></wd-text>
                <wd-text
                  :text="orderInfo.receiverName + ' ' + orderInfo.receiverTel"
                  size="14px"
                  color="#333333"
                  custom-class="mt-1"
                ></wd-text>
              </view>

              <view v-if="orderInfo.deliveryMode === 1" class="ml-1 py-3px">
                <view>
                  <wd-text
                    :text="'自提人：' + orderInfo.receiverName"
                    size="16px"
                    color="#333333"
                    custom-class=" mr-4 "
                  ></wd-text>
                </view>
                <view style="margin-top: 6px">
                  <wd-text
                    :text="'电话:' + orderInfo.receiverTel"
                    size="16px"
                    color="#333333"
                    custom-class=""
                  ></wd-text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="" v-if="orderInfo.deliveryMode === 1">
        <view class="bg-white border-rd-10px px-15px box-border w-full mb-10px">
          <view class="flex justify-between items-center py-2">
            <view class="flex justify-left items-center">
              <!--              <wd-icon name="location" size="22px"   ></wd-icon>-->

              <view class="flex justify-left items-start ml-1 flex-col">
                <view class="flex justify-left items-center">
                  <wd-text
                    :text="'自提点：' + orderInfo.pickUpPoint.storeName"
                    size="14px"
                    color="#333333"
                    custom-class=" mr-1 "
                  ></wd-text>

                  <wd-icon
                    name="call"
                    size="20px"
                    custom-class=" mr-2 "
                    @click="call(orderInfo.pickUpPoint.storePhone)"
                  ></wd-icon>

                  <!--                  <wd-icon name="location" size="22px" @click="toLocation({dimension:orderInfo.pickUpPoint.,longitude:orderInfo.pickUpPoint.,name:orderInfo.pickUpPoint.storeName,address:orderInfo.pickUpPoint.address-->
                  <!--                  })"></wd-icon>-->
                </view>

                <wd-text
                  :text="'地址：' + orderInfo.pickUpPoint.address"
                  size="14px"
                  color="#777777"
                  custom-class=" mr-1 "
                  @click="
                    orderInfo.pickUpPoint.latitude
                      ? getlocation(
                          orderInfo.pickUpPoint.latitude,
                          orderInfo.pickUpPoint.longitude,
                          orderInfo.pickUpPoint.storeName,
                          orderInfo.pickUpPoint.address,
                        )
                      : ''
                  "
                ></wd-text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="bg-white border-rd-10px px-15px py-10px box-border w-full mb-10px">
        <view class="order-shop">
          <view class="order-shop-main" @click="goshop">
            <view class="order-shop-img">
              <wd-img :width="30" :height="30" round :src="shopDetails.shopAvatar" />
            </view>
            <view class="order-shop-cont">
              <view class="order-shop-name">{{ shopDetails.name }}</view>
              <view class="order-shop-arrow">&gt;</view>
            </view>
          </view>
          <view class="order-shop-state">{{ getOrderState(orderInfo.status) }}</view>
        </view>

        <view v-for="(it, ind) in orderInfo.sysOrderItemBeans" :key="ind">
          <view
            class="flex justify-between items-center w-full mt-5px"
            @click="gopath('/pages-sub/homeManager/shopInfo', { id: it.productSpuId })"
          >
            <wd-img
              :width="90"
              :height="90"
              custom-image="rounded-8px"
              :src="JSON.parse(it.skuUrl)[0].data"
            />
            <view class="ml-15px flex-1 flex flex-col justify-between overflow-hidden">
              <view>
                <view
                  class="name over1"
                  style="
                    margin-bottom: 5px;
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 22px;
                    color: #000000;
                  "
                >
                  {{ it.productName }}
                </view>
                <view style="font-size: 14px; line-height: 20px; color: #757575">
                  {{ showSKU(JSON.parse(it.skuName)) }}
                </view>
              </view>

              <view class="w-full flex justify-between items-center">
                <view class="flex items-center" style="font-weight: 600">
                  <text
                    style="font-size: 14px; line-height: 36px; color: #f44d24; text-align: left"
                  >
                    ￥
                  </text>
                  <text
                    style="font-size: 20px; line-height: 36px; color: #f44d24; text-align: left"
                  >
                    {{ it.skuSellingPrice }}
                  </text>
                  <!-- <view class="quan">
                      <text style="margin-right: 5px; font-size: 10px">券后价</text>
                      <text style="font-size: 8px; font-weight: 600">￥</text>
                      <text style="font-size: 16px; font-weight: 600">19.9</text>
                    </view> -->
                </view>
                <view
                  class=""
                  style="
                    padding: 0px 4px;
                    color: #333;
                    border: 1px solid #999999;
                    border-radius: 5px 5px 5px 5px;
                  "
                >
                  {{ 'x' + it.productSkuCount }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="bg-white border-rd-10px px-15px box-border w-full mb-10px">
        <view class="flex justify-left items-center">
          <view class="mr-50px labels">订单备注</view>
          <view class="flex F1 justify-right items-center py-5px">
            <wd-text
              :text="orderInfo.orderNote ? orderInfo.orderNote : '无备注'"
              size="14px"
              :color="orderInfo.orderNote ? '#333333' : '#999999'"
              custom-class="ml-2 w-100% text-right"
            ></wd-text>
          </view>
        </view>
      </view>

      <view
        class="bg-white border-rd-10px px-15px box-border w-full mb-10px"
        v-if="orderInfo.merchantAuditStatus === '1'"
      >
        <view class="flex justify-left items-center">
          <view class="mr-50px labels">订单备注</view>
          <view class="flex F1 justify-right items-center">
            <wd-text
              text="申请拒绝"
              size="14px"
              color="#333333"
              custom-class="ml-2 w-100% text-right"
            ></wd-text>
          </view>
        </view>
        <view class="flex justify-left items-center">
          <view class="mr-50px labels">拒绝原因</view>
          <view class="flex F1 justify-right items-center">
            <wd-text
              :text="orderInfo.merchantAuditNote"
              size="14px"
              color="#333333"
              custom-class="ml-2 w-100% text-right"
            ></wd-text>
          </view>
        </view>
      </view>

      <view class="bg-white border-rd-10px px-15px box-border w-full mb-10px">
        <view class="flex justify-left items-center">
          <view class="mr-10px labels">订单号</view>
          <view class="F1 overflow-hidden">
            <view class="flex F1 justify-right items-center">
              <view class="ml-2 over1 overs text-right" style="width: calc(100% - 37px - 0.5rem)">
                {{ orderInfo.orderId }}
              </view>
              <view class="tit2 ml-2 w-100% text-right" @click="copy(orderInfo.orderId)">复制</view>
            </view>
          </view>
        </view>

        <view class="flex justify-left items-center">
          <view class="mr-50px labels">下单时间</view>
          <view class="flex F1 justify-right items-center">
            <wd-text
              :text="removeT(orderInfo.orderTime)"
              size="14px"
              color="#333333"
              custom-class="ml-2 w-100% text-right"
            ></wd-text>
          </view>
        </view>
        <view class="flex justify-left items-center">
          <view class="mr-50px labels">配送方式</view>
          <view class="flex F1 justify-right items-center">
            <wd-text
              v-if="orderInfo.deliveryMode === 0"
              text="快递配送"
              size="14px"
              color="#333333"
              custom-class="ml-2 w-100% text-right"
            ></wd-text>
            <wd-text
              v-if="orderInfo.deliveryMode === 1"
              text="上门自提"
              size="14px"
              color="#333333"
              custom-class="ml-2 w-100% text-right"
            ></wd-text>
            <wd-text
              v-if="orderInfo.deliveryMode === 2"
              text="同城配送"
              size="14px"
              color="#333333"
              custom-class="ml-2 w-100% text-right"
            ></wd-text>
          </view>
        </view>
      </view>

      <view class="bg-white border-rd-10px px-15px box-border w-full mb-10px">
        <view class="flex justify-left items-center">
          <view class="mr-50px labels">商品金额</view>
          <view class="flex F1 justify-right items-center">
            <wd-text
              :text="'￥' + (orderInfo.proTotalFee ? orderInfo.proTotalFee : 0)"
              size="14px"
              color="#333333"
              custom-class="ml-2 w-100% text-right"
            ></wd-text>
          </view>
        </view>
        <view class="flex justify-left items-center">
          <view class="mr-50px labels">运费</view>
          <view class="flex F1 justify-right items-center">
            <wd-text
              :text="'￥' + orderInfo.deliveryAmount"
              size="14px"
              color="#333333"
              custom-class="ml-2 w-100% text-right"
            ></wd-text>
          </view>
        </view>

        <view class="flex justify-left items-center">
          <view class="mr-50px labels">优惠金额</view>
          <view class="flex F1 justify-right items-center">
            <wd-text
              :text="'￥' + orderInfo.couponAmount"
              size="14px"
              color="#333333"
              custom-class="ml-2 w-100% text-right"
            ></wd-text>
          </view>
        </view>
        <view class="flex justify-left items-center">
          <view class="mr-50px labels">合计</view>
          <view class="flex F1 justify-right items-center">
            <view class="ml-1 w-100% text-right">
              <wd-text
                :text="'￥' + orderInfo.orderActualAmount"
                size="14px"
                color="#F44D24"
                custom-class="ml-2 w-100% text-right"
              ></wd-text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <template #bottom v-if="!showPop && !showPopTK">
      <view class="pt-10px pb-25px px-20px bg-#fff" v-if="!loading">
        <template v-if="orderInfo.status === 1">
          <view
            v-if="!dispay"
            class="bg-white pos-bottom-none flex justify-between box-border items-center"
          >
            <view class="flex flex-col">
              <view style="color: #f44d24" class="font-600">
                <text style="font-size: 14px">￥</text>
                <text style="font-size: 20px">
                  {{ orderInfo.orderActualAmount }}
                </text>
              </view>
            </view>
            <wd-button
              custom-class="submit"
              :round="false"
              @click="goPay"
              :disabled="dispay"
              :loading="payLoading"
            >
              立即支付
            </wd-button>
          </view>

          <wd-button block plain type="info" :round="false" v-else custom-class="duihuanBtn2">
            订单失效
          </wd-button>
        </template>
        <template v-else-if="orderInfo.status === 2">
          <wd-button
            :round="false"
            block
            type="info"
            custom-class="inline-block  mb-2"
            plain
            @click="call(shopDetails.shopPhone)"
          >
            联系商家
          </wd-button>
          <wd-button
            plain
            block
            :round="false"
            type="info"
            custom-class="inline-block  mb-2"
            @click="gotickets(orderInfo)"
          >
            平台介入
          </wd-button>
          <wd-button
            block
            :round="false"
            @click="goEvaluate(orderInfo.orderId)"
            custom-class="duihuanBtn  mb-2"
            v-if="orderInfo.isEvaluatio === '0'"
          >
            去评价
          </wd-button>
        </template>
        <template v-else-if="orderInfo.status === 10">
          <wd-button
            block
            plain
            type="info"
            custom-class="inline-block mb-2"
            @click="getRefundReason"
          >
            {{ orderInfo.merchantAuditStatus === '1' ? '再次申请退款' : '申请退款' }}
          </wd-button>
        </template>
        <template v-else-if="orderInfo.status === 11">
          <view v-if="orderInfo.deliveryMode === 1">
            <wd-button
              block
              custom-class="inline-block mb-2 bg-#F44D24!"
              @click="call(orderInfo.shopPhone)"
            >
              联系商家
            </wd-button>
          </view>
          <view v-if="orderInfo.deliveryMode !== 1">
            <wd-button block custom-class="inline-block mb-2" @click="goNext(orderInfo.orderId)">
              确认收货
            </wd-button>
          </view>
          <view>
            <wd-button
              block
              plain
              type="info"
              custom-class="inline-block mb-2"
              @click="getRefundReason"
            >
              {{ orderInfo.merchantAuditStatus === '1' ? '再次申请退款' : '申请退款' }}
            </wd-button>
          </view>
        </template>
        <template v-else></template>
      </view>
    </template>
  </dy-content>
  <wd-action-sheet
    v-model="showPop"
    @close="closePop"
    v-if="!loading"
    title="取消订单"
    safe-area-inset-bottom
    :zIndex="999"
  >
    <view class="px-4" v-if="!loading">
      <view class="pb-4">
        <wd-text text="请选择取消原因" size="14px" color="#777777"></wd-text>
      </view>

      <wd-radio-group v-model="chooseIndex" shape="dot" @change="Choose" checked-color="#f44d24">
        <wd-radio :value="index" v-for="(it, index) in canList" :key="index">{{ it }}</wd-radio>
      </wd-radio-group>

      <wd-button type="warning" custom-class="duihuanBtn   mt-4 " @click="cancal">确定</wd-button>
      <view class=""></view>
    </view>
  </wd-action-sheet>

  <wd-action-sheet
    v-if="!loading"
    v-model="showPopTK"
    @close="closePopTK"
    title="申请退款"
    safe-area-inset-bottom
    :zIndex="99"
  >
    <view class="px-4 tuikuan" v-if="!loading">
      <view class="pb-4">
        <wd-text text="请选择退款原因" size="14px" color="#777777"></wd-text>
      </view>

      <wd-radio-group v-model="chooseIndexTK" shape="dot" @change="Choose" checked-color="#f44d24">
        <wd-radio :value="index" v-for="(it, index) in canListTK" :key="index">{{ it }}</wd-radio>
      </wd-radio-group>

      <wd-button
        type="warning"
        custom-class="duihuanBtn   mt-4 "
        @click="goRefund(orderInfo.orderId)"
      >
        确定
      </wd-button>
    </view>
  </wd-action-sheet>
  <!-- </view> -->
</template>
<style lang="scss" scoped>
.pageBoxBg {
  position: relative;
  background: #f3f4f6;
}

:deep(.wd-card__footer) {
  padding-top: 6px;
}

:deep(.wd-card__title-content) {
  padding-bottom: 6px;
}

:deep(.wd-card__footer) {
  padding: 5px 0 !important;
}

:deep(.wd-card__title-content) {
  padding: 5px 0 !important;
}

.tuikuan {
  padding-bottom: 20px;
}

:deep(.duihuanBtn) {
  width: 100% !important;
  color: #ffffff;
  background: #f44d24 !important;
}

:deep(.duihuanBtn3) {
  padding: 0 30px;
  font-size: 16px;
  line-height: 38px;
  color: #ffffff;
  background: #f44d24 !important;
}

:deep(.duihuanBtn2) {
  width: 100% !important;
  color: #ffffff;
  background: #f44d24 !important;
  opacity: 0.5;
}

:deep(.is-checked .wd-radio__shape) {
  background-color: #f44d24 !important;
  border-color: #f44d24 !important;
}

:deep(.time) {
  font-size: 14px;
  color: #f44d24 !important;
}

:deep(.tit) {
  width: 5.5rem;
  margin-right: 5px;
}

:deep(.tit2) {
  width: 32px;
  margin-left: 5px;
  font-size: 14px;
  color: #f44d24 !important;
}

:deep(.overs) {
  flex: 1;
  width: 100%;
  overflow: hidden; //超出隐藏
  font-size: 14px;
  color: #333333;
  text-overflow: ellipsis; //溢出显示省略号
  white-space: nowrap; //不折行
}

:deep(.tabTool) {
  height: 100%;
  overflow: auto;
}

.tagsBox {
  padding: 10px;
  color: #ff8800;
  background-color: #fff1e2;
  border-color: #ffa946;
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
}

.labels {
  font-size: 14px;
  font-weight: 400;
  line-height: 44px;
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

:deep(.submit) {
  width: 103px !important;
  margin-left: 20px;
  line-height: 40px;
  color: #fff !important;
  text-align: center;
  background: #f44d24 !important;
  border-radius: 6px 6px 6px 6px;
}

.order-shop {
  display: flex;
  justify-content: space-between;
  line-height: 30px;
}

.order-shop-main {
  display: flex;
  flex: 1;
  height: 30px;
}

.order-shop-img {
  width: 30px;
  margin-right: 5px;
}

.order-shop-cont {
  display: flex;
  flex: 1;
  font-size: 16px;
  color: #777;
}

.order-shop-name {
  height: 30px;
  overflow: hidden;
  line-height: 30px;
}

.order-shop-arrow {
  margin-left: 5px;
  line-height: 30px;
}

.order-shop-state {
  margin-left: 15px;
  font-size: 14px;
  color: #f44d24;
  text-align: right;
}
</style>
