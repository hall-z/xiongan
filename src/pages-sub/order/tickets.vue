'
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
import { removeT, routeTo } from '@/utils'
import { useMessage, useToast } from 'wot-design-uni/index'
import orderInter from './utils/orderInter'

const toast = useToast()

const { submitTickets, sendOrderInfo } = orderInter()

const title = ref('平台介入')

const orderInfo = ref({})
const orderID = ref('')
const type = ref(0)

const ticketsInfo = ref({
  reason: '',
  reasonInd: null,
  description: '',
  imageListstr: '',
  phone: '',
})

const userStore = useUserStore()
const imageList = ref([])
const time = ref<number>(108000)
const reasonList = [
  { value: 1, label: '虚假发货' },
  { value: 2, label: '卖家拒绝开发票' },
  { value: 3, label: '不发货/拒绝发货' },
  {
    value: 4,
    label: '其他',
  },
]

const message = useMessage()

function submit() {
  if (ticketsInfo.value.reason === '' || ticketsInfo.value.reasonInd === null) {
    uni.showToast({
      title: '请填写申请原因',
      duration: 2000,
      icon: 'none',
    })
  } else if (ticketsInfo.value.description === '') {
    uni.showToast({
      title: '请填写问题描述',
      duration: 2000,
      icon: 'none',
    })
  } else if (ticketsInfo.value.imageListstr === '') {
    uni.showToast({
      title: '请上传凭证',
      duration: 2000,
      icon: 'none',
    })
  } else if (ticketsInfo.value.phone === '') {
    uni.showToast({
      title: '请填写联系方式',
      duration: 2000,
      icon: 'none',
    })
  } else {
    const da = {
      orderId: orderID.value,
      reasonType: ticketsInfo.value.reasonInd,
      interfereContent: ticketsInfo.value.description,
      voucherUrl: ticketsInfo.value.imageListstr ? [ticketsInfo.value.imageListstr] : [],
      createPhone: ticketsInfo.value.phone,
      userId: userStore.userInfo.userDId,
    }

    submitTickets(da).then((res) => {
      message
        .alert({
          msg: '已收到您的反馈，平台将在1-3工作日联系您!',
          title: '提示',
        })
        .then(() => {
          uni.redirectTo({ url: '/pages-sub/order/orderList?tabsVal=' + orderInfo.value.status })
        })
        .catch((error) => {
          console.log(error)
        })
    })
  }
}

const showSKU = function (obj) {
  const SKU = []
  Object.values(obj).map((i) => SKU.push(i))

  return SKU.join(',')
}

async function getInfo(id: any) {
  // 这里是请求数据
  const da = { orderId: id }
  orderInfo.value = await sendOrderInfo(da)
  if (orderInfo.value.orderInterfereList && orderInfo.value.orderInterfereList[0]) {
    type.value = orderInfo.value.orderInterfereList[0].ticketStatus
    ticketsInfo.value = orderInfo.value.orderInterfereList[0]
    ticketsInfo.value.voucherUrl = JSON.parse(orderInfo.value.orderInterfereList[0].voucherUrl)
  } else {
    type.value = 0
  }

  ticketsInfo.value.phone = userStore.userInfo.userPhone
}

const gopath = function (url, e) {
  routeTo({
    url,
    data: e,
  })
}

function goback(url, e) {
  uni.navigateBack()
}

function handleConfirm(e) {
  ticketsInfo.value.reasonInd = e.value
}

onLoad(async (options) => {
  orderID.value = options.id
  if (orderID.value) {
    await getInfo(orderID.value)
    // if () {
    //   message.alert({
    //     msg: '已收到您的反馈，平台将在1-3工作日联系您!',
    //     title: '提示'
    //   })
    // } else if () {
    //   message.alert({
    //     msg: '您有一条平台介入工单正在处理中，我们会全力加快处理进度。',
    //     title: '提示'
    //   })
    // }
  }
})
</script>

<template>
  <view class="pageBoxBg w-screen" style="min-height: 100vh">
    <view class="tabTool w-screen">
      <dy-navbar
        :leftTitle="title"
        left
        custom-style="background: transparent;position: relative;"
      ></dy-navbar>

      <view class="border-box">
        <wd-card class="border-box cardno" v-if="type === 0">
          <view style="font-size: 16px; color: #000" class="my-2">待处理</view>
        </wd-card>
        <wd-card class="border-box cardno" v-if="type === 1 || type === 2">
          <view style="font-size: 16px; color: #000" class="my-2">处理中</view>
        </wd-card>
        <wd-card class="border-box cardno" v-if="type === 3">
          <view style="font-size: 16px; color: #000" class="my-2">已处理</view>
        </wd-card>

        <wd-card class="cardno" v-if="ticketsInfo.replyContent && type === 3">
          <view class="my-2">
            <view class="mb-1">
              <wd-text text="处理结果" color="#333" size="16" bold></wd-text>
            </view>
            <view>
              <wd-cell-group>
                <view>{{ ticketsInfo.replyContent }}</view>
              </wd-cell-group>
            </view>
          </view>
        </wd-card>

        <wd-card class="cardno">
          <view class="my-2" v-if="ticketsInfo.id && type !== 0">
            <view class="mb-1">
              <wd-text text="工单编号" color="#333" size="16" bold></wd-text>
            </view>
            <view>
              <wd-cell-group>
                <view>{{ ticketsInfo.id }}</view>
              </wd-cell-group>
            </view>
          </view>
          <view class="my-2" v-if="ticketsInfo.createTime && type !== 0">
            <view class="mb-1">
              <wd-text text="提交时间" color="#333" size="16" bold></wd-text>
            </view>
            <view>
              <wd-cell-group>
                <view>{{ removeT(ticketsInfo.createTime) }}</view>
              </wd-cell-group>
            </view>
          </view>

          <view class="my-2">
            <view class="mb-1">
              <wd-text text="关联订单" color="#333" size="16" bold></wd-text>
            </view>
            <view>
              <view v-for="(it, ind) in orderInfo.sysOrderItemBeans" :key="ind">
                <view
                  class="flex justify-between items-center mt-2 mb-4"
                  @click="gopath('/pages-sub/homeManager/shopInfo', { id: it.productSpuId })"
                >
                  <wd-img
                    :width="100"
                    :height="100"
                    radius="7"
                    :src="JSON.parse(it.skuUrl)[0].data"
                  />
                  <view class="ml-2 flex-1 flex flex-col justify-between h-100px">
                    <view class="w-full flex justify-between items-center">
                      <wd-text
                        :text="it.productName"
                        :lines="1"
                        size="16px"
                        color="#000000"
                        custom-class="font-bold mr-10px"
                      ></wd-text>
                      <wd-text
                        v-if="orderInfo.status === 1"
                        text="待付款"
                        size="14px"
                        color="#e3832a"
                        class=""
                      ></wd-text>
                      <wd-text
                        v-else-if="orderInfo.status === 10"
                        text="待发货"
                        size="14px"
                        color="#e3832a"
                        class=""
                      ></wd-text>
                      <wd-text
                        v-else-if="orderInfo.status === 11"
                        text="待收货"
                        size="14px"
                        color="#e3832a"
                        class=""
                      ></wd-text>
                      <wd-text
                        v-else-if="orderInfo.status === 25 || orderInfo.status === 20"
                        text="退款中"
                        size="14px"
                        color="#e3832a"
                        class=""
                      ></wd-text>
                      <wd-text
                        v-else-if="orderInfo.status === 2"
                        text="已完成"
                        size="14px"
                        color="#e3832a"
                        class=""
                      ></wd-text>
                      <wd-text
                        v-else-if="orderInfo.status === 3"
                        text="已取消"
                        size="14px"
                        color="#e3832a"
                        class=""
                      ></wd-text>
                      <wd-text
                        v-else-if="orderInfo.status === 23"
                        text="退款失败"
                        size="14px"
                        color="#e3832a"
                        class=""
                      ></wd-text>
                      <wd-text
                        v-else-if="orderInfo.status === 22"
                        text="退款成功"
                        size="14px"
                        color="#e3832a"
                        class=""
                      ></wd-text>
                      <wd-text v-else text="已完成" size="14px" color="#e3832a" class=""></wd-text>
                    </view>

                    <view class="flex justify-between items-center">
                      <wd-text
                        :text="showSKU(JSON.parse(it.skuName))"
                        :lines="1"
                        size="14px"
                        color="#757575"
                        class="mt-1"
                      ></wd-text>
                      <wd-text
                        :text="'x' + it.productSkuCount"
                        size="14px"
                        color="#777777"
                        custom-class="ml-1"
                      ></wd-text>
                    </view>
                    <view class="flex justify-end">
                      <wd-text
                        text="实付："
                        size="14px"
                        color="#777777"
                        custom-class="ml-1"
                      ></wd-text>
                      <wd-text
                        :text="orderInfo.orderActualAmount"
                        size="14px"
                        color="#F44D24"
                        custom-class="ml-1"
                      ></wd-text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="border"></view>

          <view class="my-2">
            <view class="mb-1">
              <wd-text text="申请原因" color="#333" size="16" bold></wd-text>
              <wd-text text="*" color="red" size="16" custom-class="ml-2px"></wd-text>
            </view>
            <view>
              <wd-cell-group>
                <wd-picker
                  custom-style="padding:0"
                  :columns="reasonList"
                  v-model="ticketsInfo.reason"
                  @confirm="handleConfirm"
                  v-if="type === 0"
                />

                <view v-else>{{ reasonList[ticketsInfo.reasonType - 1].label }}</view>
              </wd-cell-group>
            </view>
          </view>
          <view class="border"></view>
          <view class="my-2">
            <view class="mb-1">
              <wd-text text="问题描述" color="#333" size="16" bold></wd-text>
              <wd-text text="*" color="red" size="16" custom-class="ml-2px"></wd-text>
            </view>
            <view>
              <wd-cell-group>
                <wd-textarea
                  custom-style="padding:0"
                  v-model.trim="ticketsInfo.description"
                  placeholder="请填写问题描述"
                  v-if="type === 0"
                />
                <view v-else>{{ ticketsInfo.interfereContent }}</view>
              </wd-cell-group>
            </view>
          </view>
          <view class="border"></view>
          <view class="my-2" v-if="type === 0 || (type !== 0 && ticketsInfo.voucherUrl[0])">
            <view class="mb-1">
              <wd-text text="上传凭证" color="#333" size="16" bold></wd-text>
              <wd-text text="*" color="red" size="16" custom-class="ml-2px"></wd-text>
            </view>
            <view>
              <dy-upload v-if="type === 0" v-model="ticketsInfo.imageListstr"></dy-upload>
              <wd-img
                :width="100"
                :height="100"
                radius="7"
                :src="ticketsInfo.voucherUrl[0]"
                mode="aspectFit"
                v-else
              />
            </view>
          </view>
          <view class="border"></view>
          <view class="my-2">
            <view class="mb-1">
              <wd-text text="联系方式" color="#333" size="16" bold></wd-text>
              <wd-text text="*" color="red" size="16" custom-class="ml-2px"></wd-text>
            </view>
            <view>
              <wd-cell-group>
                <wd-input
                  v-if="type === 0"
                  v-model.trim="ticketsInfo.phone"
                  placeholder="请填写联系方式"
                  no-border
                />
                <view v-else>{{ ticketsInfo.phone }}</view>
              </wd-cell-group>
            </view>
          </view>
        </wd-card>
      </view>
    </view>

    <view
      class="px-10px py-10px fixed bottom-0 left-0 right-0 bg-#fff safe-area-after"
      style="z-index: 10"
      v-if="type === 0"
    >
      <wd-button block :round="false" @click="submit(ticketsInfo)">提 交</wd-button>
    </view>
    <view
      class="px-10px py-10px fixed bottom-0 left-0 right-0 bg-#fff safe-area-after"
      style="z-index: 10"
      v-if="type === 3"
    >
      <wd-button block :round="false" @click="type = 0">再次申请</wd-button>
    </view>

    <wd-message-box />
  </view>
  <!-- </view> -->
</template>
<style lang="scss" scoped>
.pageBoxBg {
  position: relative;
  background-image: linear-gradient(#daebfd, #f3f4f6);
}

.con {
  background: #fff;
  border-radius: 5px;
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

:deep(.wd-picker__cell) {
  padding: 0px !important;
}

.border {
  width: 100%;
  height: 1px;
  margin: 15px 0;
  background: #fdfdfd;
}

.tabTool {
  padding-bottom: 120px;
}
</style>
