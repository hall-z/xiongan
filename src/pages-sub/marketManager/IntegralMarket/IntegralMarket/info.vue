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
import { goodsInfoProps } from './utils/types'
import useInter from './utils/useInter'

const title = ref('商品详情')
const step = ref([
  {
    text: '选择商品',
    icon: 'https://oss.xay.xacloudy.cn/images/2025-04/5945d734-3b2c-49cc-a3af-50b68783dc5f1.png',
  },
  {
    text: '填写收货信息',
    icon: 'https://oss.xay.xacloudy.cn/images/2025-04/8e2a81c7-36b1-47f4-9fe9-69ae2a869e942.png',
  },
  {
    text: '积分支付',
    icon: 'https://oss.xay.xacloudy.cn/images/2025-04/0ca1e5be-d534-4482-9a71-45293241ced53.png',
  },
  {
    text: '等待发货',
    icon: 'https://oss.xay.xacloudy.cn/images/2025-04/efea1e95-3d62-478f-957d-1c170c28a7fb4.png',
  },
])
const { sendInterProductInfo, sendInterInfo } = useInter()
const gopath = () => {
  routeTo({
    url: '/pages-sub/marketManager/IntegralMarket/IntegralMarket/buyOrder',
    data: { ...changeUrlJson(goodsInfoData.value) },
  })
}
const opData = ref()
const url = ref(
  'https://oss.xay.xacloudy.cn/images/2024-09/5066fcb4-00df-4f6a-8641-3bba21c8b824jifenbg.png',
)
const goodsInfoData = ref<goodsInfoProps>({
  goodImg: '',
  coinPrice: 0,
  goodName: '',
  goodSort: 0,
  createTime: '',
  exchangeLevel: null,
  exchangeNotes: '',
  isSale: null,
  updateTime: '',
  goodId: null,
  stock: null,
  purchaseLimit: null,
  sellOut: null,
})
onShow(async () => {
  try {
    const data: any = await sendInterInfo()
    opData.value.surplusIntegral = data.surplusIntegral ?? 0
  } catch (error) {
    opData.value.surplusIntegral = 0
  }
})
onLoad(async (option) => {
  opData.value = option
  const params = {
    goodId: option.goodId,
  }
  try {
    const data = await sendInterProductInfo(params)
    goodsInfoData.value = { ...data, sellOut: opData.value.sellOut }
  } catch (error) {
    console.log('🥠[error]:', error)
  }
})
</script>

<template>
  <view class="min-h-100vh bg-#f3f4f6">
    <view class="h-300px">
      <dy-navbar :leftTitle="title" left isNavShow :placeholder="false"></dy-navbar>
      <wd-img :src="goodsInfoData.goodImg ?? url" width="100%" height="300"></wd-img>
    </view>
    <view class="flex justify-between items-center navbg w-screen h-90px">
      <view class="flex justify-left items-start flex-col">
        <view class="text-base text-white mb-1">我的积分</view>
        <view class="text-xs text-slate-100 opacity-60">积分可兑换商品，避免失效请尽快使用</view>
      </view>
      <view class="text-2xl text-white">
        {{ opData ? opData.surplusIntegral : '0' }}
        <wd-text text="积分" :lines="1" size="12px" color="#fff" custom-class="ml-1"></wd-text>
      </view>
    </view>

    <view class="cardtop"></view>
    <view class="bg-white w-screen p4 box-border pt-0 absolute contentBox">
      <view class="flex justify-between items-center w-full mb-2">
        <view class="flex justify-left items-center">
          <wd-text
            :text="goodsInfoData.coinPrice + ''"
            :lines="1"
            size="24px"
            color="#FB2549"
            custom-class="font-bold"
          ></wd-text>
          <wd-text
            text=" 积分"
            :lines="1"
            size="12px"
            color="#FB2549"
            custom-class="ml-1"
          ></wd-text>
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

      <view class="p-10px box-border bg-#F7F7F7 border-rd-6px">
        <wd-text text="兑换流程" bold size="16px" color="#000"></wd-text>

        <view class="w-full mt-10px">
          <wd-steps :active="0" align-center>
            <wd-step v-for="it in step" :key="it.icon">
              <template #icon>
                <wd-img :src="it.icon" width="22" height="22" mode="aspectFit"></wd-img>
              </template>
              <template #title>
                <wd-text
                  :text="it.text"
                  size="14px"
                  color="#999999"
                  custom-class="mt-5px "
                ></wd-text>
              </template>
            </wd-step>
          </wd-steps>
        </view>
      </view>

      <view class="mt-2 mb-1">
        <wd-text
          text="商品详情"
          :lines="1"
          size="18px"
          color="#000000"
          custom-class="font-bold"
        ></wd-text>
        <view>
          <!-- <template v-if="details && details.remarkUrl">
            <wd-img
              width="100%"
              mode="widthFix"
              v-for="i in details.remarkUrl"
              :src="i"
              :key="i"
            ></wd-img>
          </template> -->
          <wd-img :src="goodsInfoData.goodImg" mode="widthFix" width="100%"></wd-img>
        </view>
      </view>
    </view>

    <view
      v-if="goodsInfoData.stock > 0"
      class="z-10 px-4 py-2 shadow bg-white fixed b0 w-full box-border pb-20px"
      style="bottom: 0px"
    >
      <wd-text text="温馨提示" size="18px" color="#000000" bold></wd-text>
      <wd-text
        text="积分商品一旦兑换不支持退换！"
        size="16px"
        color="#F44D24"
        custom-class="block mt-5px mb-10px"
      ></wd-text>
      <wd-button block custom-class="duihuanBtn" :round="false" @click="gopath()">
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
  <!-- </view> -->
</template>
<style lang="scss" scoped>
.navbg {
  box-sizing: border-box;
  padding: 0px 30px 20px 30px;
  background-image: url('https://oss.xay.xacloudy.cn/images/2024-09/5066fcb4-00df-4f6a-8641-3bba21c8b824jifenbg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

:deep(.wd-step__icon) {
  background-color: #f7f7f7 !important;
}

:deep(.wd-navbar) {
  width: 100%;
  color: #ffffff !important;
  background-color: transparent !important;
}

:deep(.wd-navbar__title) {
  color: #ffffff !important;
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
  min-height: calc(100vh - 390px);
  padding-bottom: 125px;
}
</style>
