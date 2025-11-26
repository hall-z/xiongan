<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationBarTitleText: '支付宝测试支付',
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
import { safeParseWechatPayJSON } from '@/utils'
import { useMessage } from 'wot-design-uni'
const message = useMessage()
const tradeNO = ref('201711152100110410533667792')
const payParams = ref('')
const result = ref()
const sedPay = () => {
  if (!payParams.value) {
    message.alert({
      msg: '请输入支付参数',
      title: '提示',
    })
    return
  }

  uni.showLoading({
    title: '加载中',
  })

  try {
    const params = safeParseWechatPayJSON(payParams.value)
    my.tradePay({
      // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号 trade_no
      tradeNO: tradeNO.value,
      ...params,
      success: (res) => {
        result.value = JSON.stringify(res)
      },
      fail: (error) => {
        console.error('调用 my.tradePay 失败: ', JSON.stringify(error))
        result.value = JSON.stringify(error)
      },
    })
  } finally {
    uni.hideLoading()
  }
}
</script>
<template>
  <view class="mt-100px text-center p-10px">支付宝测试支付</view>
  <view class="p-20px">
    <view>JSON 数据</view>
    <view class="my-10px">
      <wd-textarea
        v-model="payParams"
        placeholder='请输入支付参数(json格式)如下：  { "tradeNO": "wx1234567890", ,。。。。。 }'
        type="textarea"
        rows="10"
        required
        custom-class="bd-1px_solid_#ccc"
      ></wd-textarea>
    </view>
    <wd-button @click="sedPay" block>开始支付</wd-button>
    <view>
      显示支付结果
      <view>{{ result }}</view>
    </view>
  </view>
</template>
