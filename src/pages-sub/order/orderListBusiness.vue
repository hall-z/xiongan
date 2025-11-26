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
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import orderInter from './utils/orderInter'

const userStore = useUserStore()

const {
  sendOrderInfo,
  sendOrderList,
  updateOrderBeanStatusById,
  sendRefund,
  sendRefundReview,
  sendchangeOrderStatus,
} = orderInter()
const paging = ref(null)

async function queryList(pageNo: number, pageSize: number) {
  const params = {
    page: pageNo,
    size: pageSize,
    statusStr: tabsVal.value === '-1' ? '' : tabsVal.value,
    orderFlag: 2,
    loginUserId: userStore.userInfo.userDId,
  }
  // 调用接口获取数据
  try {
    const data: any = await sendOrderList(params)

    // list.value = data.records as any
    paging.value.complete(data.records)
    // paging.value.complete([])
  } catch (error) {
    paging.value.complete(false)
  }
}

const title = ref('商家订单')
const tabsVal = ref('')
const tabslist = ref([
  { name: '全部订单', value: '-1' },
  { name: '待付款', value: '1' },
  { name: '待发货', value: '10' },
  { name: '待收货', value: '11' },
  { name: '已完成', value: '2' },
  { name: '退款/售后', value: '20,21,22,23,25,26' },
])
const list = ref([])

const goback = function (url, e) {
  const pageList = getCurrentPages()
  if (pageList.length <= 1) {
    routeTo({ url: '/pages/index/index', navType: NAVIGATE_TYPE.SWITCH_TAB })
  } else {
    uni.navigateBack()
  }
}

function changeTab(e) {
  tabsVal.value = e.name
  paging.value.reload()
}

const gopath = function (url, e) {
  routeTo({
    url,
    data: e,
  })
}

function goShop(shopId) {
  routeTo({ url: '/pages-sub/shopManager/shopHome', data: { id: shopId } })
}

function goInfo(orderId) {
  routeTo({ url: '/pages-sub/order/orderInfoBusiness', data: { id: orderId } })
}

function goLogistics(orderId) {
  routeTo({ url: '/pages-sub/order/logistics', data: { id: orderId } })
}

function goEvaluate(orderId) {
  routeTo({ url: '/pages-sub/shopManager/addEvaluate', data: { id: orderId } })
}

function goInfoQX(orderId, note = '') {
  uni.showModal({
    title: '取消确认',
    content: '您确定要取消订单吗',
    success: async function (res) {
      if (res.confirm) {
        const da = {
          orderId,
          note,
        }
        const date = await sendchangeOrderStatus(da)

        if (date) {
          routeTo({ url: '/pages-sub/order/orderInfoBusiness', data: { id: orderId } })
        } else {
          uni.showToast({
            title: date.errMsg,
            duration: 2000,
          })
        }
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    },
  })
}

function goTk(orderId) {
  uni.showModal({
    title: '退款确认',
    content: '您确定要退款吗',
    success: async function (res) {
      if (res.confirm) {
        const da = {
          orderId,
          auditStatus: 1,
          auditNote: '同意',
        }
        const date: any = await sendRefundReview(da)
        if (date.errCode === 'SUCCESS') {
          const da2 = {
            orderId,
            note: '',
          }
          await sendRefund(da2)
          uni.showToast({
            title: '退款成功！',
            duration: 2000,
          })
        } else {
          uni.showToast({
            title: date.errMsg,
            duration: 2000,
          })
        }
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    },
  })
}

function gosure(orderId, status = 2) {
  const data = { orderId, status }
  updateOrderBeanStatusById(data).then((res) => {
    uni.redirectTo({ url: '/pages-sub/order/orderList', tabsVal: tabsVal.value })
  })
}

function getPayStrByStatus(val) {
  if (val === 1 || val === 3) {
    return '待付款'
  } else if (val === 2 || val === 10 || val === 11 || val === 12 || val === 20 || val === 25) {
    return '已付款'
  } else if (val === 22) {
    return '已退款'
  }
}

onLoad((options) => {
  tabsVal.value = options.tabsVal ? options.tabsVal : ''
})

onShow(async (options) => {
  if (paging.value) {
    paging.value.reload()
  }
  // 获取地址列表
})
</script>

<template>
  <!--  <view class="pageBoxBg w-screen h-screen">-->
  <z-paging
    ref="paging"
    v-model="list"
    @query="queryList"
    :auto-show-system-loading="false"
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
            <view class="flex justify-between items-center">
              <wd-text
                :text="
                  '下单时间：' + item.orderTime.slice(0, 10) + ' ' + item.orderTime.slice(11, 19)
                "
                size="14px"
                color="#999999"
              ></wd-text>

              <wd-text
                v-if="item.status === 1"
                text="待付款"
                size="14px"
                color="#000000"
                class=""
              ></wd-text>
              <wd-text
                v-else-if="item.status === 10"
                text="待发货"
                size="14px"
                color="#000000"
                class=""
              ></wd-text>
              <wd-text
                v-else-if="item.status === 11"
                :text="item.deliveryMode === 1 ? '待使用' : '待收货'"
                size="14px"
                color="#000000"
                class=""
              ></wd-text>
              <wd-text
                v-else-if="item.status === 25 || item.status === 20"
                text="申请仅退款"
                size="14px"
                color="#000000"
                class=""
              ></wd-text>
              <wd-text
                v-else-if="item.status === 23"
                text="退款失败"
                size="14px"
                color="#e3832a"
                class=""
              ></wd-text>
              <wd-text
                v-else-if="item.status === 22"
                text="退款成功"
                size="14px"
                color="#e3832a"
                class=""
              ></wd-text>
              <wd-text
                v-else-if="item.status === 2"
                text="已完成"
                size="14px"
                color="#000000"
                class=""
              ></wd-text>
              <wd-text
                v-else-if="item.status === 3"
                text="已取消"
                size="14px"
                color="#e3832a"
                class=""
              ></wd-text>
              <wd-text v-else text="已完成" size="14px" color="#000000" class=""></wd-text>
            </view>
          </template>
          <view class="bottomline topline">
            <view v-for="(it, ind) in item.sysOrderItemBeans" :key="ind">
              <view
                class="flex justify-between items-center mt-2 mb-4"
                @click="goInfo(item.orderId)"
              >
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
                    size="14px"
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
                      color="#F44D24"
                    ></wd-text>
                    <wd-text
                      :text="`x${it.productSkuCount}`"
                      size="14px"
                      color="#000000"
                      custom-class="ml-1 nums"
                    ></wd-text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <template #footer>
            <view class="flex justify-between items-center">
              <view>
                <view class="flex justify-end items-center">
                  <wd-text
                    v-if="item.sysOrderItemBeans"
                    :text="`共${item.sysOrderItemBeans[0].productSkuCount}件   ${getPayStrByStatus(item.status)}:`"
                    size="12px"
                    color="#999999"
                  ></wd-text>
                  <wd-text text="￥" size="12px" font-bold color="#F44D24"></wd-text>
                  <wd-text
                    :text="item.orderActualAmount"
                    size="18px"
                    custom-class="font-bold"
                    color="#F44D24"
                  ></wd-text>
                </view>
              </view>
              <view class="flex justify-right items-center">
                <!--                <template v-if="item.status === 1 && item.orderType === 0">
                  <wd-button
                    size="small"
                    plain
                    :round="false"
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    @click="goInfoQX(item.orderId)"
                  >
                    取消订单
                  </wd-button>
                </template>-->

                <template v-if="item.status === 2">
                  <wd-button
                    size="small"
                    plain
                    :round="false"
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    @click="goInfo(item.orderId)"
                  >
                    查看详情
                  </wd-button>
                </template>

                <template v-else-if="item.status === 10">
                  <!--                  <wd-button-->
                  <!--                    size="small"-->
                  <!--                    plain-->
                  <!--                    :round="false"-->
                  <!--                    custom-class="inline-block ml-2!"-->
                  <!--                    style="width: 5rem"-->
                  <!--                    @click="goInfoQX(item.orderId)"-->
                  <!--                  >-->
                  <!--                    取消订单-->
                  <!--                  </wd-button>-->
                  <wd-button
                    size="small"
                    :round="false"
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    @click="goInfo(item.orderId)"
                  >
                    去发货
                  </wd-button>
                </template>
                <template v-else-if="item.status === 11">
                  <!--                  <wd-button-->
                  <!--                    size="small"-->
                  <!--                    plain-->
                  <!--                    :round="false"-->
                  <!--                    custom-class="inline-block ml-2!"-->
                  <!--                    style="width: 5rem"-->
                  <!--                    @click="goInfoQX(item.orderId)"-->
                  <!--                  >-->
                  <!--                    取消订单-->
                  <!--                  </wd-button>-->
                  <wd-button
                    v-if="item.deliveryMode !== 1"
                    size="small"
                    :round="false"
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    @click="goLogistics(item.orderId)"
                  >
                    查看物流
                  </wd-button>
                </template>
                <template v-else-if="item.status === 25 || item.status === 20">
                  <wd-button
                    size="small"
                    plain
                    :round="false"
                    custom-class="inline-block ml-2!"
                    style="width: 5rem"
                    @click="goInfo(item.orderId)"
                  >
                    售后处理
                  </wd-button>
                  <!--                  <wd-button-->
                  <!--                    v-if="item.deliveryMode !== 1"-->
                  <!--                    size="small"-->
                  <!--                    :round="false"-->
                  <!--                    custom-class="inline-block ml-2!"-->
                  <!--                    style="width: 5rem"-->
                  <!--                    @click="goLogistics(item.orderId)"-->
                  <!--                  >-->
                  <!--                    查看物流-->
                  <!--                  </wd-button>-->
                </template>
                <template v-else></template>
              </view>
            </view>
          </template>
        </wd-card>
      </view>
      <!--      <wd-loadmore custom-class="loadmore" state="loading"/>-->
    </view>
  </z-paging>
  <!--  </view>-->
  <!-- </view> -->
</template>
<style lang="scss" scoped>
.pageBoxBg {
  overflow: hidden;
  background: #f3f4f6;
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

.bottomline {
  border-bottom: 1px solid #efefef;
}

.topline {
  border-top: 1px solid #efefef;
}

:deep(.nums) {
  padding: 3px 5px;
  font-weight: bold;
  border: 1px solid #999;
  border-radius: 4px;
}
</style>
