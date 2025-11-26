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
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { useToPhone } from '@/utils/uniapi'
import { useMessage } from 'wot-design-uni'
import { changeStatusText } from './utils'
import orderInter from './utils/orderInter'
const message = useMessage()
const userStore = useUserStore()
const showBtns = ref(false)

const { sendOrderList, updateOrderBeanStatusById, sendOrderInterfereStatus } = orderInter()
const paging = ref(null)

const queryList = async (pageNo: number, pageSize: number) => {
  const params = {
    page: pageNo,
    size: pageSize,
    statusStr: tabsVal.value === '-1' ? '' : tabsVal.value,
    orderFlag: 1,
    loginUserId: userStore.userInfo.userDId,
  }
  // 调用接口获取数据
  try {
    const data: any = (await sendOrderList(params)) as any
    paging.value.complete(data.records)
  } catch (error) {
    paging.value.complete(false)
  }
}
const title = ref('订单列表')
const tabsVal = ref('')
const tabslist = ref([
  { name: '全部', value: '-1' },
  { name: '待付款', value: '1' },
  { name: '待发货', value: '10' },
  { name: '待收货', value: '11' },
  { name: '已完成', value: '2' },
  { name: '退款/售后', value: '20,21,22,23,24,25,26' },
])
const list = ref([])

const changeTab = (e) => {
  tabsVal.value = e.name
  paging.value.reload()
}

const goShop = (shopId) => {
  routeTo({ url: '/pages-sub/shopManager/shopHome', data: { id: shopId } })
}

function goInfo(orderId, item?) {
  if (item) {
    const url = changeStatusText(item).url
    if (url) {
      routeTo({ url, data: { orderId } })
    } else {
      routeTo({ url: '/pages-sub/order/orderInfo', data: { id: orderId } })
    }
  } else {
    routeTo({ url: '/pages-sub/order/orderInfo', data: { id: orderId } })
  }
}

const goLogistics = (orderId) => {
  routeTo({ url: '/pages-sub/order/logistics', data: { id: orderId } })
}

const goRefund = (orderId) => {
  routeTo({ url: '/pages-sub/AfterSalesService/ReturnForm/index', data: { orderId } })
}

const gotickets2 = async (e) => {
  try {
    const res: any = await sendOrderInterfereStatus({ orderId: e.orderId })
    if (res?.handleStatus >= 0) {
      routeTo({ url: '/pages-sub/userManager/tickets/ticketsInfoDetil', data: { id: e.orderId } })
    } else {
      showBtns.value = false
      routeTo({ url: '/pages-sub/userManager/tickets/ticketsInfo', data: { id: e.orderId } })
    }
  } catch (error) {
    if (!error.data?.code) {
      showBtns.value = false
      routeTo({ url: '/pages-sub/userManager/tickets/ticketsInfo', data: { id: e.orderId } })
    }
  }
}

const goInfoQX = (orderId) => {
  routeTo({ url: '/pages-sub/order/orderInfo', data: { id: orderId, showPop: true } })
}

const gosure = (orderId, merchantId, status = 2) => {
  uni.showModal({
    title: '收货确认',
    content: '您确定要收货吗',
    success: async function (res) {
      if (res.confirm) {
        const data = { orderId, merchantId, status }
        updateOrderBeanStatusById(data).then((res) => {
          if (res) {
            uni.showToast({ title: '收货成功', icon: 'none' })
            setTimeout(() => {
              routeTo({
                url: '/pages-sub/order/orderList',
                data: {
                  tabsVal: tabsVal.value,
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

const calculatedAmount = computed(() => {
  return (item) => {
    let sum = 0
    item.forEach((ele) => {
      sum += Number(ele.productSkuCount)
    })
    return sum
  }
})

onShow(async () => {
  console.log('paging.value', paging.value)
  await nextTick()
  paging.value.reload()
})
onLoad((options) => {
  tabsVal.value = options.tabsVal ? options.tabsVal : ''
})
</script>

<template>
  <z-paging
    ref="paging"
    v-model="list"
    @query="queryList"
    :auto="false"
    :auto-show-system-loading="false"
    :content-z-index="9999"
    class="w-screen h-screen"
  >
    <template #top>
      <view class="tabTool w-screen">
        <wd-navbar safeAreaInsetTop placeholder :bordered="false">
          <template #left>
            <dy-navbar :leftTitle="title" left isNavShow color="#000"></dy-navbar>
          </template>
        </wd-navbar>

        <wd-tabs
          v-model="tabsVal"
          swipeable
          custom-class="tabsBox"
          :slidable-num="4"
          @change="changeTab"
        >
          <block v-for="item in tabslist" :key="item.value">
            <wd-tab :title="item.name" :name="item.value"></wd-tab>
          </block>
        </wd-tabs>
      </view>
    </template>
    <view class="pt-2 overflow-hidden ListBox pageBoxBg overflow-hidden">
      <view v-for="(item, index) in list" class="float-left w-full box-border" :key="index">
        <wd-card>
          <template #title>
            <view class="flex justify-between items-center" @click="goShop(item.shopId)">
              <view class="flex justify-left items-center">
                <wd-img :width="30" :height="30" round :src="item.shopAvatar" mode="aspectFill" />
                <wd-text
                  :text="item.shopName"
                  size="16px"
                  color="#777777"
                  custom-class="ml-1"
                  custom-style="display: block;max-width: 400rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                ></wd-text>
                <wd-icon name="arrow-right" size="16px" class="ml-1" color="#777777"></wd-icon>
              </view>
              <wd-text
                :text="changeStatusText(item).text"
                size="14px"
                color="#e3832a"
                class=""
              ></wd-text>
            </view>
          </template>

          <view v-for="(it, ind) in item.sysOrderItemBeans" :key="ind">
            <view class="flex justify-between items-center mt-2 mb-4" @click="goInfo(item.orderId)">
              <wd-img
                :width="100"
                :height="100"
                radius="7"
                :src="JSON.parse(it.skuUrl)[0].data"
                mode="aspectFill"
              />
              <view class="ml-2! flex-1">
                <wd-text
                  :text="it.productName"
                  :lines="2"
                  size="16px"
                  color="#000000"
                  custom-class="font-bold"
                ></wd-text>
                <wd-text
                  :text="item.skuName"
                  :lines="1"
                  size="14px"
                  color="#757575"
                  custom-class="mt-1"
                ></wd-text>
                <view class="flex justify-between items-center mt-4">
                  <wd-text
                    :text="`￥${it.skuSellingPrice?.toFixed(2)}`"
                    size="16px"
                    color="#000000"
                  ></wd-text>
                  <wd-text
                    :text="`x${it.productSkuCount}`"
                    size="14px"
                    color="#777777"
                    custom-class="ml-1"
                  ></wd-text>
                </view>
              </view>
            </view>
          </view>
          <view class="flex justify-end items-center my-3">
            <template v-if="item.sysOrderItemBeans">
              <wd-text
                :text="`共${calculatedAmount(item.sysOrderItemBeans)}件 金额：`"
                size="14px"
                color="#000000"
              ></wd-text>
            </template>
            <wd-text text="￥" size="14px" font-bold color="#d04b55" custom-class="ml-1"></wd-text>
            <wd-text
              :text="item.orderActualAmount"
              size="18px"
              font-bold
              color="#d04b55"
              class=""
            ></wd-text>
          </view>
          <template #footer>
            <view class="flex justify-between items-center">
              <wd-popover
                use-content-slot
                :placement="index + 1 === list.length ? 'top' : 'bottom'"
                :offset="100"
              >
                <template #content>
                  <view class="w-100px px-10px box-border">
                    <view @click="useToPhone(item.shopPhone)" class="py-10px itbor">联系商家</view>
                    <template v-if="item.status === 10 || item.status === 11">
                      <view @click="gotickets2(item)" class="py-10px itbor">平台介入</view>
                    </template>
                    <template v-if="item.isAfterSales === 1">
                      <view @click="goRefund(item.orderId)" class="py-10px itbor">申请退款</view>
                    </template>
                  </view>
                </template>
                <view class="color-#9f9f9f btn px-10px py-5px">更多</view>
              </wd-popover>
              <view class="flex justify-right items-center">
                <template v-if="item.status === 1">
                  <wd-button
                    size="small"
                    plain
                    type="info"
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    @click="goInfoQX(item.orderId)"
                  >
                    取消订单
                  </wd-button>
                  <wd-button
                    size="small"
                    plain
                    type="warning"
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    @click="goInfo(item.orderId)"
                  >
                    去支付
                  </wd-button>
                </template>
                <template v-else-if="item.status === 2">
                  <wd-button
                    size="small"
                    plain
                    type="warning"
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    v-if="item.isEvaluatio === '0'"
                    @click="
                      routeTo({
                        url: '/pages-sub/shopManager/addEvaluate',
                        data: { orderId: item.orderId },
                      })
                    "
                  >
                    评价
                  </wd-button>
                </template>

                <template v-else-if="item.status === 11">
                  <wd-button
                    v-if="item.deliveryMode !== 1"
                    size="small"
                    plain
                    type="info"
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    @click="goLogistics(item.orderId)"
                  >
                    查看物流
                  </wd-button>
                  <wd-button
                    v-if="item.deliveryMode !== 1"
                    size="small"
                    plain
                    type="warning"
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    @click="gosure(item.orderId, item.merchantId)"
                  >
                    确认收货
                  </wd-button>
                  <wd-button
                    v-if="item.deliveryMode === 1"
                    size="small"
                    plain
                    type="warning"
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    @click="goInfo(item.orderId)"
                  >
                    去使用
                  </wd-button>
                </template>
                <template v-else>
                  <wd-button
                    size="small"
                    plain
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    @click="goInfo(item.orderId, item)"
                  >
                    查看详情
                  </wd-button>
                </template>
              </view>
            </view>
          </template>
        </wd-card>
      </view>
    </view>
  </z-paging>
</template>
<style lang="scss" scoped>
.pageBoxBg {
  overflow: hidden;
  background: #f3f4f6;
}
.bef {
  box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
}
.bef::before {
  position: absolute;
  top: -20px;
  left: 15px;
  content: '';
  //border: 1px solid rgba($color: #000000, $alpha: 0.1);
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
  border-left: 10px solid transparent;
}
.itbor {
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
}
:deep(.wd-card__footer) {
  padding-top: 6px;
}

:deep(.wd-card__title-content) {
  padding-bottom: 6px;
}

:deep(.wd-input) {
  background: #f6f6f6;
}

:deep(.z-paging-content) {
  background: #f3f4f6;
}
</style>
