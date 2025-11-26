<route lang="json5" type="page">
{
  layout: 'default',
  realNameAuthentication: true,
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
    },
  },
}
</route>

<script lang="ts" setup>
import { getCanteenOrderDetail } from '@/service/api/userMessage'
import { ref } from 'vue'
import { useToast } from 'wot-design-uni/index'
import foodicon02 from '../static/images/smartCanteen/foodicon02.png'
import { nameHide, routeTo } from '@/utils'
const toast = useToast()
const title = ref('充值详情')
const phone = ref('')

const info = ref({})
const option = ref({})

function fmtTime(date) {
  const da = new Date(date)
  const Y = da.getFullYear() + '-'
  const M = (da.getMonth() + 1 < 10 ? '0' + (da.getMonth() + 1) : da.getMonth() + 1) + '-'
  const D = (da.getDate() < 10 ? '0' + da.getDate() : da.getDate()) + ' '

  // var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
  // var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
  // var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
  const strDate = Y + M + D
  return strDate
}

const paymentType = ['微信', '支付宝', '云闪付']

function formatTimeA(val) {
  return val.slice(0, 10)
}

function formatTimeB(val) {
  return val.slice(11, 19)
}

function GinfoList(serialNo) {
  getCanteenOrderDetail({
    orderId: serialNo || option.value.serialNo,
    phoneNum: phone.value,
  }).then((res: any) => {
    console.log('详情', res)
    info.value = res
  })
}

//

const canteenNameList = {
  // JT2: {
  //   name: '集团食堂(待启用)',
  //   value: 'JT2',
  //   mid: '2411250913509978',
  //   tid: '087481292',
  //   merchantId: '1835238852856737794',
  //   isShow: false,
  // },
  B5: {
    name: '华望城食堂B5/C5',
    value: 'B5',
    mid: '2411250913405161',
    tid: '087526887',
    merchantId: '1863183900566712322',
    isShow: false,
  },
  B7: {
    name: '华望城食堂B7',
    value: 'B7',
    mid: '2411250913149466',
    tid: '087526888',
    merchantId: '1862084318529114113',
    isShow: false,
  },
}
onLoad((options) => {
  option.value = JSON.parse(options.item)
  phone.value = options.phone

  console.log('options1111111111111111111', options)

  GinfoList(option.value.serialNo)
  // GinfoList('3AKE202412121818249475834641')
})
</script>

<template>
  <view class="flex flex-col bg-no-repeat dy-blue-bg2" style="height: 100vh">
    <view>
      <dy-navbar
        :leftTitle="title"
        left
        color="#000"
        custom-style="background: transparent;position: relative;"
      ></dy-navbar>
    </view>

    <view class="topbg pos-relative" style="position: relative; flex: 1; overflow: auto">
      <view style="padding: 80px 0" class="FScc box-border">
        <wd-img :width="60" :height="60" :src="foodicon02"></wd-img>
        <view style="margin: 15px 0; font-size: 16px; color: #333">
          {{ canteenNameList[info.receiverAddress].name }}
          <!--          {{info.receiverAddress}}-->
        </view>
        <view bold style="margin: 0; font-size: 32px; font-weight: bold; color: #333">
          +{{ info.orderTotalFee }}
        </view>
      </view>

      <view class="list p-15px px-15px">
        <view class="py-15px bg-#fff w-full flex justify-left items-center">
          <view class="label" style="width: 100px; text-align: left">订单号</view>
          <view class="content" style="flex: 1">{{ info.orderId }}</view>
        </view>
        <view class="py-15px bg-#fff w-full flex justify-left items-center">
          <view class="label" style="width: 100px; text-align: left">支付方式</view>
          <view class="content" style="flex: 1">{{ paymentType[info.paymentType] }}</view>
        </view>
        <view class="py-15px bg-#fff w-full flex justify-left items-center">
          <view class="label" style="width: 100px; text-align: left">支付时间</view>
          <view class="content" style="flex: 1">{{ fmtTime(info.payMentTime) }}</view>
        </view>
        <view class="py-15px bg-#fff w-full flex justify-left items-center">
          <view class="label" style="width: 100px; text-align: left">应付金额</view>
          <view class="content" style="flex: 1">￥{{ info.orderActualAmount }}</view>
        </view>
        <view class="py-15px bg-#fff w-full flex justify-left items-center">
          <view class="label" style="width: 100px; text-align: left">优惠金额</view>
          <view class="content" style="flex: 1; color: #f80">￥{{ info.couponAmount }}</view>
        </view>
        <view class="py-15px bg-#fff w-full flex justify-left items-center">
          <view class="label" style="width: 100px; text-align: left">代他人充值</view>
          <view class="content" style="flex: 1" v-if="info.replaceRechargeState == 0">
            是
            <span class="link">({{ nameHide(info.cardName) + ' ' + info.userPhone }}）</span>
          </view>
          <view class="content" style="flex: 1" v-if="info.replaceRechargeState == 1">否</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.topbg {
  box-sizing: border-box;

  overflow: hidden;
}

.box-border {
  border-bottom: 1px solid #e5e5e5;
}

.times {
  width: 100%;
  padding: 10px 15px;
  background: rgba(248, 248, 248, 1);
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}

.list {
  box-sizing: border-box;
  padding: 0px 19px 45px 19px;
}

.link {
  font-size: 14px;
  color: #2b66ed;
}
</style>
