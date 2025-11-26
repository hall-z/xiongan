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
import { changeUrlJson, routeTo } from '@/utils'
import quanbg from '../../static/images/integral/quanbg.png'
import youhui from '../../static/images/integral/youhui.png'
import useInter from './utils/useInter'

const title = ref('积分兑换')
const show = ref(false)
const { sendInterProductInfo, sendInterInfo, sendExchangeGoods } = useInter()
const gopath = (data) => {
  routeTo({
    url: '/pages-sub/marketManager/IntegralMarket/IntegralMarket/virtualResult',
    data: { ...changeUrlJson(data) },
  })
}
const opData = ref()

const goodsInfoData = ref({})

const operationLoading = ref(false)
const submit = async () => {
  operationLoading.value = true
  const params = {
    goodId: opData.value.goodId,
  }
  try {
    const data = await sendExchangeGoods(params)
    console.log('兑换商品', data)
    gopath({ ...goodsInfoData.value, ...data })
    operationLoading.value = false
  } catch (error) {
    console.log('🍍[error]:', error)
    operationLoading.value = false
  }
}
onLoad(async (option) => {
  opData.value = option

  const params = {
    goodId: option.goodId,
  }
  try {
    const data = await sendInterProductInfo(params)
    goodsInfoData.value = { ...data, sellOut: opData.value.sellOut }
    console.log('🥕[ goodsInfoData.value]:', goodsInfoData.value)
  } catch (error) {
    console.log('🥠[error]:', error)
  }
})
</script>

<template>
  <view class="min-h-100vh bg-#f3f4f6">
    <view class="top-bg">
      <dy-navbar :leftTitle="title" left></dy-navbar>
      <!-- <view class="w-full h-200px flex justify-between items-baseline px-20px box-border pt-70px"> -->
      <view class="w-full h-150px flex justify-between items-center px-20px box-border">
        <!--        <wd-text :text="goodsInfoData.exchangeNotes" size="28px" bold color="#FF4345"></wd-text>-->
        <view class="w-full flex justify-between items-baseline">
          <view class="flex items-center justify-center">
            <wd-text
              :text="goodsInfoData.couponPrice"
              size="68px"
              custom-class="mr-1"
              color="#ff4345"
            ></wd-text>
            <wd-text
              :text="goodsInfoData.couponType === '3' ? '折' : '￥'"
              size="20px"
              color="#ff4345"
            ></wd-text>
          </view>
          <wd-text
            :text="'满' + goodsInfoData.couponFillPrice + '元可用'"
            size="16px"
            color="#ff4345"
            custom-class="mb-2"
          ></wd-text>
        </view>
        <!-- <view>
          <wd-text text="2000" size="68px" bold color="#FF4345"></wd-text>
          <wd-text text="￥" size="28px" bold color="#FF4345"></wd-text>
        </view>
        <view>
          <wd-text text="满100元可用" size="21px" color="#FF4345"></wd-text>
        </view> -->
      </view>
    </view>

    <view class="cardtop"></view>
    <view class="bg-white w-screen p4 box-border pt-0 absolute contentBox">
      <view class="flex justify-between items-center w-full mb-2">
        <view class="flex justify-left items-center">
          <wd-text
            :text="goodsInfoData.coinPrice"
            :lines="1"
            size="24px"
            color="#FB2549"
            custom-class="font-bold"
          ></wd-text>
          <wd-text text="积分" :lines="1" size="12px" color="#FB2549" custom-class="ml-1"></wd-text>
        </view>

        <wd-text
          :text="`已兑 ${goodsInfoData.sellOut ?? 0} 件`"
          :lines="1"
          size="12px"
          color="#999999"
          custom-class="ml-1"
        ></wd-text>
      </view>
      <wd-text
        :text="goodsInfoData?.goodName"
        :lines="2"
        size="18px"
        color="#000000"
        custom-class="font-bold mb-2"
      ></wd-text>
      <view class="p-15px box-border bg-#F7F7F7 border-rd-6px">
        <wd-text text="使用方法" bold size="16px" color="#000"></wd-text>
        <view class="w-full flex justify-between items-center mt-10px">
          <view class="flex flex-col items-center">
            <wd-img :src="youhui" width="23px" height="20px"></wd-img>
            <wd-text text="兑换优惠券" size="14px" color="#999999" custom-class="mt-5px "></wd-text>
          </view>
          <view class="flex flex-col items-center">
            <wd-icon name="creditcard" size="22px" color="#999999"></wd-icon>
            <wd-text
              text="使用雄安一卡通支付"
              size="14px"
              color="#999999"
              custom-class="mt-5px "
            ></wd-text>
          </view>
          <view class="flex flex-col items-center">
            <wd-icon name="check-outline" size="22px" color="#999999"></wd-icon>
            <wd-text
              text="优惠券使用成功"
              size="14px"
              color="#999999"
              custom-class="mt-5px "
            ></wd-text>
          </view>
        </view>
      </view>

      <view class="p-15px box-border bg-#F7F7F7 border-rd-6px">
        <wd-text text="兑换说明" bold size="16px" color="#000"></wd-text>
        <view class="w-full flex flex-col mt-10px">
          <wd-text
            text="  1、本券不兑现、不找零、不可分享。"
            size="14px"
            color="#777777"
            custom-class="mt-5px "
          ></wd-text>
          <wd-text
            text=" 2、该优惠券每次仅支持使用一张。"
            size="14px"
            color="#777777"
            custom-class="mt-5px "
          ></wd-text>
          <wd-text
            text=" 3、优惠券一经兑换无法退回，请谨慎兑换。"
            size="14px"
            color="#777777"
            custom-class="mt-5px "
          ></wd-text>
          <!--          <wd-text-->
          <!--            text="4.本券限购买全场商品单笔折后满100元使用1张"-->
          <!--            size="14px"-->
          <!--            color="#777777"-->
          <!--            custom-class="mt-5px "-->
          <!--          ></wd-text>-->
          <!--          <wd-text-->
          <!--            text="5.本券领取次日起7日内有效"-->
          <!--            size="14px"-->
          <!--            color="#777777"-->
          <!--            custom-class="mt-5px "-->
          <!--          ></wd-text>-->
          <!--          <wd-text-->
          <!--            text="6.优惠券一经兑换无法退回，请谨慎兑换"-->
          <!--            size="14px"-->
          <!--            color="#777777"-->
          <!--            custom-class="mt-5px "-->
          <!--          ></wd-text>-->
          <!--          <wd-text text="*每日可兑1次" size="14px" color="#F44D24" custom-class="mt-5px "></wd-text>-->
        </view>
      </view>
    </view>

    <view
      v-if="goodsInfoData.stock > 0"
      class="z-10 px-4 py-2 shadow bg-white fixed b0 w-full box-border pb-20px"
      style="bottom: 0px"
    >
      <wd-button block custom-class="duihuanBtn" :round="false" @click="show = true">
        立即兑换
      </wd-button>
    </view>
    <view
      v-else
      class="z-10 px-4 py-2 shadow bg-white fixed b0 w-full box-border"
      style="bottom: 0px"
    >
      <wd-button block type="info" :round="false" disabled>暂时缺货</wd-button>
    </view>
  </view>
  <!-- 兑换优惠券 -->
  <wd-popup
    v-model="show"
    position="bottom"
    custom-style="height: 390px;border-radius:10px 10px 0 0;padding:20px;box-border:border-box; "
  >
    <wd-text text="订单确认" bold size="18px" color="#000"></wd-text>
    <view class="w-full mt-30px flex">
      <view class="pos-relative">
        <wd-img :src="quanbg" :width="90" :height="70"></wd-img>
        <view
          class="pos-absolute w-full h-full pos-top-none flex flex-col items-center justify-center"
        >
          <wd-text
            :text="`满${goodsInfoData.couponFillPrice}可用`"
            size="8px"
            color="#FF4345"
          ></wd-text>
          <view class="mt-10px">
            <wd-text :text="goodsInfoData.couponPrice" bold size="28px" color="#FF4345"></wd-text>
            <wd-text
              :text="goodsInfoData.couponType === '3' ? '折' : '￥'"
              bold
              size="12px"
              color="#FF4345"
            ></wd-text>
          </view>
        </view>
      </view>
      <view class="flex-1 ml-10px flex flex-col justify-between">
        <wd-text
          :text="goodsInfoData.goodName"
          :lines="1"
          bold
          size="16px"
          color="#000000"
        ></wd-text>
        <view class="w-full flex justify-between">
          <view>
            <wd-text :text="goodsInfoData.coinPrice" bold size="16px" color="#F44D24"></wd-text>
            <wd-text text=" 积分" size="12px" color="#F44D24"></wd-text>
          </view>

          <wd-text text="x1" size="18px" color="#757575"></wd-text>
        </view>
      </view>
    </view>

    <!-- <view
      class="w-360px line-height-40px text-white bg-#F44D24 text-center border-rd-5px pos-fixed pos-bottom-20px pos-left-1/2"
      style="transform: translate(-50%, 0)"
      @click="submit"
    >
      确认兑换
    </view> -->

    <view class="custom-btn">
      <wd-button :loading="operationLoading" @click="submit">确认兑换</wd-button>
    </view>
  </wd-popup>
</template>
<style lang="scss" scoped>
.top-bg {
  //background-image: url(../../static/images/integral/quanbg.png);
  background: linear-gradient(200deg, #ffdfdf, #fff3e6);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 120% 100%;
}

:deep(.wd-navbar) {
  width: 100%;
  background-color: transparent !important;
}

.cardtop {
  position: relative;
  top: -14px;
  z-index: 2;
  float: left;
  width: 100vw;
  height: 15px;
  background: #ffffff;
  border-radius: 15px 15px 0 0;
}

:deep(.duihuanBtn) {
  background: #f44d24 !important;
}

.borders {
  border-top: 1px dotted #e4e7ec;
  border-bottom: 1px dotted #e4e7ec;
}

.contentBox {
  box-sizing: border-box;
  min-height: calc(100vh - 200px);
  padding-bottom: 80px;
}

.custom-btn {
  :deep(.wd-button) {
    position: fixed !important;
    bottom: 20px !important;
    left: 50% !important;
    width: 360px !important;
    line-height: 40px !important;
    color: white !important;
    background-color: #f44d24 !important;
    border-radius: 5px !important;
    transform: translate(-50%, 0) !important;
  }
}
</style>
