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
import { changeUrlJson, removeT, routeTo } from '@/utils'

const chooseIndex = ref(-1)

const title = ref('兑换详情')

const orderInfo = ref({})

const showPop = ref(false)
const orderID = ref('')

function closePop() {
  showPop.value = false
}

function Choose(index) {
  chooseIndex.value = index
  // console.log('chooseIndex', index)
  // skuInfo.value = skuList.value[index]
  closePop()
}

const gopath = function (url, e) {
  routeTo({
    url,
    data: e,
  })
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

onLoad((options) => {
  console.log('options', options)
  orderInfo.value = changeUrlJson(options)
  showPop.value = options.showPop?.showPop || false
  orderID.value = options.id

  // getInfo(options.id)
})

onShow((options) => {})
</script>

<template>
  <dy-content>
    <template #top>
      <dy-navbar :leftTitle="title" left></dy-navbar>
    </template>
    <view class="flex justify-center items-center flex-col my-10px">
      <wd-text
        text="兑换成功"
        size="20px"
        color="#f44d24"
        custom-class="my-1 text-center font-bold"
      ></wd-text>
    </view>

    <wd-card class="cardno">
      <view class="flex justify-between items-center py-2">
        <view class="flex justify-left items-center">
          <wd-icon name="location" size="22px"></wd-icon>
          <view class="flex justify-left items-start flex-col ml-1">
            <wd-text
              :text="orderInfo.userName + ' ' + orderInfo.userPhone"
              size="16px"
              color="#333333"
              custom-class="font-bold"
            ></wd-text>
            <wd-text
              :text="orderInfo.province + orderInfo.city + orderInfo.area + orderInfo.userAddress"
              size="16px"
              color="#777777"
              custom-class="mt-1"
            ></wd-text>
          </view>
        </view>
      </view>
    </wd-card>

    <wd-card>
      <view
        class="flex my-2"
        @click="
          gopath('/pages-sub/IntegralMarket/IntegralMarket/info', { goodId: orderInfo.goodId })
        "
      >
        <wd-img :width="100" :height="100" radius="7" :src="orderInfo.goodImg" mode="aspectFill" />
        <view class="ml-2 flex-1 flex flex-col justify-between">
          <wd-text
            :text="orderInfo.goodName"
            :lines="2"
            size="16px"
            color="#000000"
            custom-class="font-bold"
          ></wd-text>
          <!-- <wd-text
              :text="showSKU(JSON.parse(it.skuName))"
              :lines="1"
              size="14px"
              color="#757575"
              class="mt-1"
            ></wd-text> -->
          <view class="flex justify-between items-center">
            <wd-text :text="orderInfo.coinPrice + '积分'" size="16px" color="#000000"></wd-text>
            <wd-text text="x1" size="14px" color="#777777" custom-class="ml-1"></wd-text>
          </view>
        </view>
      </view>
    </wd-card>

    <wd-card class="cardno">
      <view class="flex justify-left items-center">
        <wd-text text="订单备注" size="14px" color="#777777" custom-class="tit"></wd-text>
        <wd-text
          :text="orderInfo.orderNote ? orderInfo.orderNote : '无备注'"
          size="14px"
          color="#333333"
          custom-class="ml-2"
        ></wd-text>
      </view>
    </wd-card>
    <wd-card class="cardno">
      <view class="py-2">
        <view class="flex justify-between items-center mb-1">
          <view class="flex justify-left items-center" style="width: calc(100% - 35px)">
            <wd-text text="订单编号" size="14px" color="#777777" custom-class="tit"></wd-text>
            <view class="ml-2 overs over1 text-right">{{ orderInfo.orderNo }}</view>
          </view>
          <view class="tit2" @click="copy(orderInfo.orderNo)">复制</view>
        </view>
        <view class="flex justify-left items-center mb-1">
          <wd-text text="下单时间" size="14px" color="#777777" custom-class="tit"></wd-text>
          <wd-text
            :text="removeT(orderInfo.orderTime)"
            size="14px"
            color="#333333"
            custom-class="ml-2"
          ></wd-text>
        </view>
        <view class="flex justify-left items-center">
          <wd-text text="配送方式" size="14px" color="#777777" custom-class="tit"></wd-text>
          <wd-text
            v-if="orderInfo.deliveryMode === '0'"
            text="快递配送"
            size="14px"
            color="#333333"
            custom-class="ml-2"
          ></wd-text>
          <!-- <wd-text
              v-if="orderInfo.deliveryMode === 1"
              text="上门自提"
              size="14px"
              color="#333333"
              custom-class="ml-2"
            ></wd-text>
            <wd-text
              v-if="orderInfo.deliveryMode === 2"
              text="同城配送"
              size="14px"
              color="#333333"
              custom-class="ml-2"
            ></wd-text> -->
        </view>
      </view>
    </wd-card>
  </dy-content>
  <wd-action-sheet
    v-model="showPop"
    @close="closePop"
    title="取消订单"
    safe-area-inset-bottom
    :zIndex="99"
  >
    <!--  <wd-popup v-model="showPop" position="bottom" closable @close="closePop">-->
    <view class="px-4">
      <view class="pb-4">
        <wd-text text="请选择取消原因" size="14px" color="#777777"></wd-text>
      </view>

      <wd-radio-group v-model="chooseIndex" shape="dot" @change="Choose" checked-color="#f44d24">
        <wd-radio :value="1">不想要了</wd-radio>
        <wd-radio :value="2">信息填错，重新下单</wd-radio>
        <wd-radio :value="3">卖家缺货</wd-radio>
        <wd-radio :value="4">物流原因</wd-radio>
        <wd-radio :value="5">其他原因</wd-radio>
      </wd-radio-group>

      <wd-button type="warning" custom-class="duihuanBtn   mt-4 " @click="closePop">确定</wd-button>
    </view>

    <!--  </wd-popup>-->
  </wd-action-sheet>
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

:deep(.duihuanBtn) {
  width: 100% !important;
  color: #ffffff;
  background: #f44d24 !important;
}

:deep(.is-checked .wd-radio__shape) {
  background-color: #f44d24 !important;
  border-color: #f44d24 !important;
}

:deep(.time) {
  font-size: 14px;
  color: #e3832a !important;
}

:deep(.tit) {
  width: 4rem;
  margin-right: 5px;
}

:deep(.tit2) {
  width: 30px;
  margin-left: 5px;
  font-size: 14px;
  color: #777777;
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
</style>
