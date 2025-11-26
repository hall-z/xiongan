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
import { routeTo, sceneResult } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import { useMessage } from 'wot-design-uni'
import sucessImg from '../static/images/coupon/success.png'
import userCoupon from './utils/userCoupon'
const message = useMessage()
const { updateOrderBeanStatusById, sendOrderInfo } = userCoupon()
const title = ref('核销订单')
const serchValue = ref('')
const orderInfo = ref('')

const show = ref(false)
const sucessShow = ref(false)
const cameraContext = ref(null)

onMounted(async () => {
  if (uni.createCameraContext) {
    cameraContext.value = uni.createCameraContext()
  } else {
    Toast('当前版本过低，无法使用该功能，请升级到最新版本后重试。')
  }
})

function cameraError(e) {
  console.log(e)
}

const scancodeData = ref()

async function scancode(e) {
  const { orderId, type } = sceneResult(e.detail)

  scancodeData.value = orderId
  console.log('🌭[scancodeData.value]:', scancodeData.value)

  if (type === 'yktOrder') {
    getOrderDetil()
  } else {
    message.alert({ title: '提示', msg: '仅雄安一卡通平台订单可核销!' })
  }
}

async function getOrderDetil() {
  cameraShowfun(false)
  try {
    const da = { orderId: scancodeData.value }
    orderInfo.value = (await sendOrderInfo(da)) as any
    show.value = true
  } catch (error) {
    console.log('🍷[error]:', error)
    message
      .alert({
        title: '提示',
        msg: error.data.msg ?? '查询出错了！',
        closeOnClickModal: false,
      })
      .then((res) => {
        handleClose()
      })
  }
}

const showSKU = function (obj) {
  const SKU = []
  Object.values(obj).map((i) => SKU.push(i))

  return SKU.join(',')
}

function handleClose() {
  show.value = false
  scancodeData.value = { price: null, couponCode: null }
  cameraShowfun()
  sucessShow.value = false
  serchValue.value = ''
}

async function handleConfirm() {
  const da = { orderId: scancodeData.value, merchantId: orderInfo.value.merchantId, status: 2 }
  try {
    const rdata: any = await updateOrderBeanStatusById(da, { Loading: true, Tips: true })
    console.log('🍮[rdata]===>:', rdata)
    if (rdata) {
      sucessShow.value = true
    } else {
      handleClose()
      // message
      //   .alert({
      //     title: '提示',
      //     msg: rdata?.msg || rdata?.data?.msg || '该订单已核销或处于退款状态，请确认!',
      //     closeOnClickModal: false,
      //   })
      //   .then((res) => {
      //     handleClose()
      //   })
    }
  } catch (error) {
    message.alert({ title: '提示', msg: error.data.msg, closeOnClickModal: false }).then((res) => {
      handleClose()
    })
  } finally {
    show.value = false
  }
}

function toMingxi() {
  sucessShow.value = false
  routeTo({
    url: '/pages-sub/shopManager/index',
  })
}

const cameraShow = ref(true)
const cameraShowfun = (flog = true) => {
  if (!flog) {
    cameraContext.value = null
    cameraShow.value = false
  } else {
    cameraContext.value = uni.createCameraContext()
    cameraShow.value = true
  }
}

onShow(() => {
  handleClose()
})
</script>
<template>
  <vie class="fixed top-0 left-0 right-0 bottom-0 z-9">
    <view class="relative w-100% h-100%">
      <camera
        mode="scanCode"
        device-position="back"
        flash="auto"
        class="absolute z-10 w-100% h-100%"
        binderror="cameraError"
        ref="camera"
        id="camera"
        @error="cameraError"
        @scancode="scancode"
        v-if="cameraShow"
      ></camera>
      <view class="absolute z-20 w-100% h-100% bg-#000/30">
        <dy-navbar :leftTitle="title" left isNavShow></dy-navbar>
        <!--  -->
        <view class="flex flex-col justify-between items-center h-85% py-20px">
          <!--  -->

          <view class="px-10px py-2px overflow-hidden w-85%">
            <!--            <wd-input-->
            <!--              v-model="serchValue"-->
            <!--              :maxlength="20"-->
            <!--              placeholder-left-->
            <!--              no-border-->
            <!--              placeholder="请输入取货码"-->
            <!--              custom-class="custom-class-input"-->
            <!--            >-->
            <!--              <template #suffix>-->
            <!--                <wd-button :round="false" @click="getOrderDetil" :disabled="!serchValue">核销</wd-button>-->
            <!--              </template>-->
            <!--            </wd-input>-->
          </view>
          <!-- 扫码框 -->
          <view v-if="cameraShow">
            <view class="w-250px h-250px bd-1px_#888 relative bg-transparent">
              <view class="absolute w-90% h-3px bg-green left-5% right-0 animation-to"></view>
            </view>
            <view class="text-center color-#fff mt-10px">将二维码放入框内，即可核销</view>
          </view>

          <!-- 底部 -->
          <!--          <view class="w-80%">-->
          <!--            <wd-button block :round="false" @click="toMingxi">查看核销记录</wd-button>-->
          <!--          </view>-->
          <!-- 核销框 -->
          <wd-popup
            v-model="show"
            position="center"
            custom-class="custom-class-popup"
            :close-on-click-modal="false"
          >
            <view class="text-center font-600 text-18px py-5px">订单核销</view>
            <wd-card>
              <view v-for="(it, ind) in orderInfo.sysOrderItemBeans" :key="ind">
                <view class="flex justify-between items-center mt-2 mb-4">
                  <wd-img
                    :width="100"
                    :height="100"
                    radius="7"
                    :src="JSON.parse(it.skuUrl)[0].data"
                  />
                  <view class="ml-2 flex-1">
                    <wd-text
                      :text="it.productName"
                      :lines="2"
                      size="16px"
                      color="#000000"
                      custom-class="font-bold"
                    ></wd-text>
                    <wd-text
                      :text="showSKU(JSON.parse(it.skuName))"
                      :lines="1"
                      size="14px"
                      color="#757575"
                      class="mt-1"
                    ></wd-text>
                    <view class="flex justify-between items-center mt-4">
                      <wd-text
                        :text="'￥' + it.skuSellingPrice"
                        size="16px"
                        color="#000000"
                      ></wd-text>
                      <wd-text
                        :text="'x' + it.productSkuCount"
                        size="14px"
                        color="#777777"
                        custom-class="ml-1 nums"
                      ></wd-text>
                    </view>
                  </view>
                </view>
              </view>
            </wd-card>

            <view class="bb-1px_#7594AC_dashed my-30px"></view>

            <view class="flex justify-between items-center py-10px gap-10px mb-15px">
              <view class="flex-1">
                <wd-button block :round="false" type="info" @click="handleClose">取 消</wd-button>
              </view>
              <view class="flex-1">
                <wd-button block :round="false" @click="handleConfirm">确认核销</wd-button>
              </view>
            </view>
          </wd-popup>
          <!-- 核销成功 -->
          <wd-overlay :show="sucessShow">
            <view class="size-full flex flex-col justify-start pt-100px items-center bg-#fff">
              <wd-transition :show="sucessShow" name="zoom-in">
                <wd-status-tip
                  :image="sucessImg"
                  :image-size="{
                    height: 81,
                    width: 81,
                  }"
                />
              </wd-transition>

              <view class="mt-40px w-100% px-40px box-border">
                <view class="mb-20px">
                  <wd-button
                    type="primary"
                    :round="false"
                    plain
                    hairline
                    block
                    @click="handleClose"
                  >
                    继续核销
                  </wd-button>
                </view>
                <!--                <view>-->
                <!--                  <wd-button type="primary" :round="false" color="#2D69EF" block @click="toMingxi">-->
                <!--                    查看核销记录-->
                <!--                  </wd-button>-->
                <!--                </view>-->
              </view>
            </view>
          </wd-overlay>
        </view>
      </view>
    </view>
  </vie>
</template>

<style lang="scss" scoped>
:deep(.custom-class-input) {
  @apply bg-transparent!;
}

.animation-to {
  animation: mymove 3s infinite;
}

@keyframes mymove {
  from {
    top: 0px;
  }

  to {
    top: 245px;
  }
}

:deep(.custom-class-popup) {
  @apply w-90% rounded-10px bg-#fff p-20px box-border overflow-hidden;
}

:deep(.nums) {
  padding: 3px 5px;
  font-weight: bold;
  border: 1px solid #999;
  border-radius: 4px;
}
</style>
