<route lang="json5">
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
import useShopServe from '@/pages-sub/shopManager/utils/useShopServe'
import { orderPayBToC } from '@/service/api/shop'
import { nameHide, removeT, sceneResult } from '@/utils'
import { useScancode } from '@/utils/uniapi'
import { Toast } from '@/utils/uniapi/prompt'
import { useMessage } from 'wot-design-uni/index'

const { sendOrderIdByShop, shopPayList } = useShopServe()

const message = useMessage()

const poatD = ref()

const num = ref('')
const time = ref()
const Data = ref()

// onUnmounted(() => {
//   clearInterval(time.value)
// })
onUnload(() => {
  clearInterval(time.value)
})

function getList() {
  time.value = setInterval(function () {
    sendOrderIdByShop({})
  }, 3000)
}

onLoad(() => {
  sendOrderIdByShop({})
  getList()
})

async function getorderstatus(e) {
  const res: any = await orderPayBToC(e)
  console.log('res---------------', res)

  if (res.errorCode * 1 === 200) {
    message
      .alert({
        title: '提示',
        msg: '成功收款 ' + num.value + '元',
      })
      .then(() => {
        num.value = '0'
        uni.navigateBack()
      })
  } else if (res.errorCode === 500) {
    message.alert({
      title: '提示',
      msg: '此订单顾客输入密码支付，请注意核实',
    })
  } else {
    message.alert({
      title: '提示',
      msg: res.msg ? res.msg : '收款失败',
    })
  }
}

async function submitForm(item) {
  if (/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(num.value) && Number(num.value) < 9999) {
    const resData: any = await useScancode({ onlyFromCamera: true })

    Data.value = decodeURIComponent(sceneResult(resData, true).url)
    console.log('Data.value-----------------', Data.value)

    if (Data.value) {
      poatD.value = {
        amount: num.value,
        QrCodeDesReqVo: {
          qrCode: Data.value,
          regionCode: '',
          scene: '',
          scanCode: '',
        },
      }
      getorderstatus(poatD.value)
    } else {
      Toast('识别失败')
    }
  } else {
    message.alert({
      title: '提示',
      msg: '请输入正确的金额',
    })
  }
}
</script>
<template>
  <view
    class="size-100% fixed flex flex-col overflow-hidden top-0 right-0 left-0 bottom-0 bg-no-repeat z-[-1]"
  >
    <dy-navbar leftTitle="设置收款金额" left isNavShow color="#000"></dy-navbar>
    <view class="px-15px flex flex-1 flex-col pt-10px box-border overflow-hidden">
      <view class="font-size-16px py-20px px-15px">收款金额</view>

      <view class="inputs">
        <view class="font-size-30px color-#000 pr-10px">￥</view>

        <wd-input
          no-border
          inputmode="numeric"
          v-model.trim="num"
          placeholder=""
          custom-input-class="numinput font-size-26px! font-bold"
        />
      </view>
      <view class="px-0px py-25px">
        <wd-button
          block
          :round="false"
          @click="submitForm"
          :disabled="Number(num) <= 0 || !num"
          custom-class="bg-#2D69EF"
        >
          确定
        </wd-button>
      </view>

      <view
        class="flex-1 flex flex-col flex-col overflow-hidden infos"
        v-if="shopPayList.respVoList && shopPayList.respVoList.length > 0"
      >
        <view class="FHcs px-15px">
          <view class="font-size-20px color-#000">近期收款记录</view>
          <!--          <view class="font-size-14px color-#999">-->
          <!--            查看更多-->
          <!--            <wd-icon name="arrow-right" size="14px" color="#999"></wd-icon>-->
          <!--          </view>-->
        </view>
        <view class="flex-1 flex flex-col overflow-y-auto p-15px">
          <view
            class="border-box bg-white p-15px FHcs mb-15px border-rd-6px"
            v-for="(item, index) in shopPayList.respVoList"
            :key="index"
          >
            <template>
              <view class="FScl">
                <view class="font-size-16px color-#000">{{ nameHide(item.userName) }}</view>
                <view class="font-size-12px color-#999">{{ removeT(item.payMentTime) }}</view>
              </view>
              <view class="font-size-18px color-#FF6600">+ {{ item.orderActualAmount }}</view>
            </template>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.inputs {
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 5px 15px;
  line-height: 38px;
  border-bottom: 1px solid rgba(112, 112, 112, 0.12);
}

.infos {
  box-sizing: border-box;
  padding: 15px 0;
  background: linear-gradient(180deg, #e9f1fc 0%, #fafafa 100%);
  border-radius: 6px 6px 6px 6px;
}

.numinput {
  font-size: 30px !important;
  font-weight: bold;
}
</style>
