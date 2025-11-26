<route lang="json5" type="page">
{
  layout: 'default',
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

import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import quanbg from '../../static/images/integral/quanbg.png'
const wxicon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-03/cdf119a8-3e7c-4acc-b376-43e4aca818d1wx.png',
)
const title = ref('积分兑换结果')
const description = ref('积分商品一旦兑换不支持退换')
const gopath = () => {
  routeTo({
    url: '/pages/shop/index',
    navType: NAVIGATE_TYPE.SWITCH_TAB,
  })
}
const opData = ref()

onLoad(async (option) => {
  console.log('opData', opData.value, option)
  opData.value = { ...changeUrlJson(option) }
  if (opData.value.goodSort === '4') {
    description.value = '优惠券一经兑换无法退回'
  }
})
</script>

<template>
  <view class="min-h-100vh bg-#f3f4f6">
    <view class="top-bg">
      <dy-navbar :leftTitle="title" left isNavShow :placeholder="false" color="#000"></dy-navbar>
      <view class="w-full h-200px flex flex-col justify-center items-center pt-90px">
        <view class="w-60px h-60px bg-#F44D24 border-rd-50px flex items-center justify-center">
          <wd-icon name="check" size="30px" color="#fff"></wd-icon>
        </view>
        <wd-text text="兑换成功" color="#000" bold size="20px" custom-class="my-20px"></wd-text>
      </view>
    </view>

    <view class="cardtop"></view>
    <view class="bg-white w-screen p4 box-border pt-0 absolute contentBox">
      <wd-cell-group class="cell-sty">
        <wd-cell
          title-width="58px"
          title="消耗积分"
          :value="(opData.consumePoints || opData.coinPrice) + ' 积分'"
        />
        <wd-cell title-width="58px" title="兑换单号" :value="opData.orderNo" />
        <wd-cell
          title-width="58px"
          title="兑换时间"
          :value="opData.createTime || opData.exchangeTime"
        />
        <wd-cell title-width="58px" title="特别说明" :value="opData.description || description" />
      </wd-cell-group>
      <!-- 优惠券 -->
      <view class="w-full mt-30px flex shdow p-10px box-border" v-if="opData.goodSort === '4'">
        <view>
          <view
            class="pos-relative w-120px h-80px flex flex-col items-center justify-center"
            :class="opData.type === '4' ? 'left-partwx' : 'left-part'"
          >
            <wd-text
              :text="opData.exchangeNotes"
              size="12px"
              :color="opData.type === '4' ? '#22A540' : '#ff4345'"
            ></wd-text>

            <view
              v-if="opData.type === '4'"
              class="absolute right-0 top-0 color-#22A540 font-size-12px px-10px py-5px rounded-bl-10px"
            >
              <wd-img :src="wxicon" width="18" height="18"></wd-img>
            </view>

            <!-- <wd-text text="满100可用" size="8px" color="#FF4345"></wd-text>
            <view class="mt-10px">
              <wd-text text="20" bold size="28px" color="#FF4345"></wd-text>
              <wd-text text="￥" bold size="12px" color="#FF4345"></wd-text>
            </view> -->
          </view>
        </view>
        <view class="flex-1 ml-10px flex flex-col justify-between">
          <wd-text :text="opData.goodName" :lines="1" bold size="16px" color="#000000"></wd-text>
          <wd-text
            text="仅雄安一卡通支付使用"
            v-if="opData.type !== '4'"
            size="12px"
            color="#999999"
          ></wd-text>
          <wd-text
            text="仅微信支付使用"
            v-if="opData.type === '4'"
            size="12px"
            color="#999999"
          ></wd-text>
          <!-- <view class="w-full flex justify-end">
            <view class="btn" @click="gopath">去使用</view>
          </view> -->
        </view>
      </view>
      <!-- 商品 -->
      <view class="w-full mt-30px flex shdow p-10px box-border" v-else>
        <view class="w-83px">
          <wd-img :width="83" :height="75" :src="opData.goodImg"></wd-img>
        </view>
        <view class="ml-10px flex-1 flex flex-col justify-between">
          <wd-text :text="opData.goodName" bold :lines="2" color="#000" size="16px"></wd-text>
          <view>
            <wd-text :text="opData.coinPrice" color="#FF4345" bold size="18px"></wd-text>
            <wd-text text="积分 " color="#FF4345" size="12px"></wd-text>
          </view>
        </view>
      </view>
    </view>

    <view
      class="z-10 px-4 py-2 shadow bg-white fixed b0 w-full box-border pb-20px flex justify-around"
      style="bottom: 0px"
      v-if="opData.createTime"
    >
      <view
        class="bg-#ffe7e1 color-#F44D24 w-157px line-height-40px text-center border-rd-5px"
        @click="
          routeTo({
            url: '/pages-sub/marketManager/IntegralMarket/IntegralMarket/list',
          })
        "
      >
        暂不使用
      </view>
      <view
        class="bg-#F44D24 color-#ffffff w-157px line-height-40px text-center border-rd-5px"
        @click="gopath"
      >
        立即使用
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.top-bg {
  background: #f5f6f8;
}

:deep(.wd-navbar) {
  width: 100%;
  color: #f5f6f8 !important;
  background-color: transparent !important;
}

:deep(.wd-navbar__title) {
  color: #ffffff !important;
}

.shdow {
  border-radius: 5px 5px 5px 5px;
  box-shadow: 4px 0px 10px 1px rgba(0, 0, 0, 0.09);
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
  width: 157px;
  line-height: 40px !important;
}

.borders {
  border-top: 1px dotted #e4e7ec;
  border-bottom: 1px dotted #e4e7ec;
}

.btn {
  width: 68px;
  font-size: 12px;
  line-height: 22px;
  color: #ff4345;
  text-align: center;
  border: 1px solid #ff4345;
  border-radius: 13px 13px 13px 13px;
}

.contentBox {
  box-sizing: border-box;
  min-height: calc(100vh - 290px);
  padding-bottom: 80px;
}

.left-part {
  padding: 4px 12px;
  background: url('../../static/images/integral/quanbg.png') no-repeat center / cover;
}
.left-partwx {
  padding: 4px 12px;
  background: url('../../static/images/integral/wxquanbg.png') no-repeat center / cover;
}
</style>
