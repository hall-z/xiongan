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
import { appPay, getShopDetail, queryOrder, xcxPay } from '@/service/api/shop'
import { getPayCouponUserPhone } from '@/service/api/userMessage'
import { useUserStore } from '@/store'
import { alPayMain, openEmbeddedMiniProgram } from '@/utils/uniapi'
import { useRequest } from 'alova/client'
import currency from 'currency.js'
import { useMessage, useToast } from 'wot-design-uni'
import { couponProps, shopDetilProps } from './utils/types'

const userStore = useUserStore()
const OrderId = ref('')
const message = useMessage()
const inValue = ref<any>() // 输入框的值
const visible = ref(false)
const maxlength = ref(6)
const type = ref('digit')
const actualPrice = ref(0)
const toast = useToast()
const onInput = (key: string) => {
  const val = key.toString()
  inValue.value = inValue.value?.toString()
  if (inValue.value && inValue.value?.length > maxlength.value) {
    return
  }
  const reg = /^[0-9]+(.[0-9]{1,2})?$/
  const len1 = val.length - 1
  const len2 = val.length - 2

  if (val) {
    // 当输入了值
    if (!reg.test(val)) {
      // 并且值不合法

      if (reg.test(val.substr(0, len1))) {
        // 如果除去最后一位前面的合法
        if (val.charAt(len1) === '.' && val.indexOf('.') === len1) {
          // 当最后一位为小数点并且值中只有一个小数点，则保留值
          inValue.value = val
        } else {
          // 否则去掉最后一位
          inValue.value = val.substr(0, len1)
        }
        // 如果除去最后两位前面的合法并且最后两位都是小数点，就去掉最后一位
      } else if (
        reg.test(val.substr(0, len2)) &&
        val.charAt(len1) === '.' &&
        val.indexOf('.') === len2
      ) {
        inValue.value = val.substr(0, len1)
        // 否则
      } else {
        if (val === '.' && inValue.value.indexOf('.') > 0) return
        // 如果值只有一位且是小数点，或者值有两位且是‘0.’，则把值置为‘0.’
        if (val === '.' || val.substr(0, len1) === '0.') {
          console.log('🥞====')
          inValue.value = inValue.value ? `${inValue.value}${val}` : '0.'
        }
      }
    } else {
      // 值合法的时候
      // 如果第一位为0且第二位存在且第二位不是小数点，提示并清空值

      if (val.charAt(0) === '0' && val.charAt(1) && val.charAt(1) !== '.') {
        toast.error('请输入正确的数值')
        setTimeout(() => {
          inValue.value = ''
        }, 2000)
      } else {
        if (inValue.value && inValue.value.indexOf('.') > 0) {
          const parts = inValue.value.split('.')
          console.log('🍆[parts]:', parts)
          if (parts.length > 2) {
            inValue.value = `${parts[0]}.${parts[1].slice(0, 2)}`
          }
          if (parts[1].length < 2) {
            console.log('🌯', parts[1])
            inValue.value = `${inValue.value}${val}`
          } else {
            console.log('🍞', parts[1].slice(0, 2))
            inValue.value = `${parts[0]}.${parts[1].slice(0, 2)}`
          }
        } else {
          inValue.value = inValue.value ? `${inValue.value}${val}` : val
        }
        // 否则保留值
      }
    }
  }
}

const onDelete = () => {
  inValue.value = inValue.value.slice(0, -1)
  if (yhList.value && yhList.value.length) {
    activeIndex.value = -1
    cyhqje.value = ''
    actualPrice.value = inValue.value * 1
    sjyhje.value = 0
  }
}
function goback() {
  uni.navigateBack()
}
// 查询可用优惠券
const { send: sendYhq, data: yhList } = useRequest(
  (data) => getPayCouponUserPhone<couponProps[]>(data),
  {
    immediate: false,
    loading: false,
    initialData: [],
  },
)

const closeText = computed(() => {
  return inValue.value && inValue.value > 0 ? '付款' : '关闭'
})
const show = ref(false)
const onClose = async () => {
  console.log('🦐')
  if (inValue.value && inValue.value > 0) {
    const parts = inValue.value.split('.')
    if (!parts[1]?.length) {
      inValue.value = `${inValue.value * 1}.00`
    }
    console.log('🌽', inValue.value)
    show.value = true
    // TODO:  查询后台当前金额可以用的优惠券
    const params = {
      orderAmount: inValue.value * 1,
    }
    console.log('🍦[params]:', params)
    try {
      const data = await sendYhq(params)
      if (!yhList && !yhList.value.length) {
        console.log('????')
        goPay()
      }
      yhList.value = data
      itmeClick(yhList.value[0], 0)
    } catch (error) {
      yhList.value = []
      actualPrice.value = inValue.value
      goPay()
    }
  }
}

// 处理优惠券显示
const remarks = ref('')
const messData = ref([
  {
    title: '优惠金额',
    isLink: true,
    value: 0,
  },
])

const collapse = ref(true)

const openYh = () => {
  collapse.value = !collapse.value
}

const activeIndex = ref<number>()
const cyhqje = ref() //  优惠金额
const sjyhje = ref(0) // 实际优惠金额

function itmeClick(item: couponProps, index) {
  if (activeIndex.value === index) {
    activeIndex.value = -1
    cyhqje.value = ''
    actualPrice.value = inValue.value * 1
    sjyhje.value = 0
  } else {
    activeIndex.value = index
    // cyhqje.value = yhList.value[activeIndex.value].value
    cyhqje.value = item.couponName
    if (item.couponType === 1) {
      sjyhje.value = currency(item.couponPrice).value
      const value = currency(inValue.value).subtract(item.couponPrice).value
      actualPrice.value = value < 0 ? 0 : value
    }
    if (item.couponType === 3) {
      const zhe = currency(inValue.value).multiply(currency(item.couponPrice).divide(10)).value
      const lastZhe = currency(inValue.value).subtract(zhe).value
      console.log('🧀[lastZhe]:', lastZhe)
      const maxDiscountAmount = currency(item.maxDiscountAmount).value
      sjyhje.value = lastZhe > maxDiscountAmount ? maxDiscountAmount : lastZhe
      actualPrice.value = currency(inValue.value).subtract(sjyhje.value).value
    }
  }

  // 根据index  做优惠计算
}

const popClose = () => {
  activeIndex.value = -1
}
//  查询商户信息
const { send: sendShopDetail, data: shopMessage } = useRequest(
  (data) => getShopDetail<shopDetilProps>(data),
  {
    immediate: false,
    loading: false,
    initialData: [],
  },
)
async function goPay() {
  if (inValue.value * 1 <= 0) {
    message.alert({
      msg: '金额不能小于或等于0',
      title: '提示',
      closeOnClickModal: false,
    })
    return
  }

  const data = {
    totalAmount: inValue.value * 1, // 订单金额
    actualAmount: actualPrice.value, // 实付金额
    merchantId: shopMessage.value.merchantId, // 商户Id
    openId: userStore.openid, // 用户子标识
    couponId: yhList.value[activeIndex.value]?.couponId ?? '', // 优惠券ID
    receiveId: yhList.value[activeIndex.value]?.receiveId ?? '', // 领取ID
    userId: userStore.userInfo.userDId, // 用户ID
    userName: userStore.userInfo.userName, // 用户名
  }

  console.log('web参数', data)
  // #ifdef MP-WEIXIN
  xcxPay(data).then(async (res: any) => {
    const { encryptStr, mid, tid, merOrderId } = res
    OrderId.value = merOrderId
    await openEmbeddedMiniProgram(
      `/pages/pay/wxMiniPay?encryptStr=${encryptStr}&mid=${mid}&tid=${tid}`,
    )
  })
  // #endif
  // #ifdef MP-ALIPAY
  const { encryptStr, mid, tid } = (await xcxPay(data)) as any
  const payFlog = await alPayMain({ encryptStr, mid, tid, openId: userStore.openid })
  console.log('🍱[payFlog]:', payFlog)
  if (payFlog) {
    uni.navigateBack()
  }

  // #endif
  // #ifdef APP-PLUS
  const params = { ...data, payType: '1', userPhone: userStore.userInfo.userPhone }
  appPay(params).then(async (res: any) => {
    const { redirecturl, merOrderId } = res
    OrderId.value = merOrderId
    plus.runtime.openURL(res.redirectUrl, (err) => {
      console.log('失败', err)
    })
  })
  // #endif
}

const urlData = ref(null)
onLoad(async (options) => {
  console.log('🍣[options]:', options)
  urlData.value = options
  console.log('地址数据======', urlData.value)
  try {
    await sendShopDetail({
      // shopId: '1903723599172268034',
      shopId: urlData.value.merchantId, // '1835238852856737794',
    })
  } catch (error) {
    console.log('🍢[error]:', error)
    message
      .alert({
        msg: error?.data?.msg ?? '查询店铺数据异常,无法支付!',
        title: '提示',
        closeOnClickModal: false,
      })
      .then((res) => {
        uni.navigateBack()
      })
  }

  // 获取到进入页面的所有信息
})
onShow(async () => {
  actualPrice.value = inValue.value
  // #ifdef MP-WEIXIN
  const data = uni.getEnterOptionsSync()
  console.log('onShow进入获取数据[data]:', data)
  // // 2 可以继续支付
  // if (data.referrerInfo?.extraData?.back === 1) {
  //   console.log('🦐')
  //   //  上一个页面返回的 返回
  //   uni.navigateBack()
  // }
  // #endif

  // #ifdef APP-PLUS
  OrderId.value = '3AKE202412041632356141565240'
  if (OrderId.value) {
    queryOrder({ orderId: OrderId.value }).then((res: any) => {
      console.log('查询订单结果', res)
      if (res.errCode === 'SUCCESS') {
        uni.showToast({
          title: '支付成功',
          icon: 'success',
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      } else {
        uni.showToast({
          title: res.errMsg,
          icon: 'error',
        })
      }
    })
  }
  // #endif
})
</script>

<template>
  <dy-navbar leftTitle="付款" left></dy-navbar>
  <view class="px-10px py-20px bg-#f5f5f5">
    <view class="flex justify-between items-center">
      <view>
        <view class="text-18px color-#000">付款给商家</view>
        <view class="text-14px color-#999999 mt-4px">
          {{ shopMessage.merchantName }}
        </view>
      </view>

      <view>
        <wd-img width="58px" height="58px" radius="7px" :src="shopMessage.shopPicture"></wd-img>
      </view>
    </view>
  </view>

  <view class="pt-20px bg-#f5f5f5">
    <view class="bg-#fff rounded-t-30px overflow-hidden">
      <view class="px-20px pt-20px">
        <view class="my-10px text-18px">付款金额</view>
        <wd-input
          type="text"
          v-model="inValue"
          placeholder="请输入付款金额"
          use-prefix-slot
          size="large"
          @click="visible = true"
          readonly
          custom-input-class="custom-input-class"
          :maxlength="11"
        >
          <template #prefix>
            <view class="24px color-#000 font-semibold">￥</view>
          </template>
        </wd-input>

        <wd-number-keyboard
          v-model:visible="visible"
          mode="custom"
          extra-key="."
          :close-text="closeText"
          @close="onClose"
          @input="onInput"
          @delete="onDelete"
          :maxlength="maxlength"
        ></wd-number-keyboard>
        <!-- <view class="text-14px color-#2D69EF my-10px">备注</view>
      <wd-textarea v-model="remarks" placeholder="" /> -->
      </view>
      <view class="px-20px mt-20px" v-if="show">
        <view class="mt-10px max-height-200px overflow-hidden" v-if="yhList && yhList.length > 0">
          <wd-cell-group>
            <wd-cell
              v-for="(item, index) in messData"
              :key="index"
              title-width="20%"
              custom-class="custom-class-cell"
            >
              <template #title>
                <view class="text-#999 text-14px">
                  {{ item.title }}
                </view>
              </template>
              <view
                class="text-#FF0000 text-16px flex items-center justify-end gap-5px"
                v-if="item.isLink"
                @click="openYh"
              >
                <view v-if="cyhqje">¥</view>
                <text>{{ currency(sjyhje) }}</text>

                <view :class="collapse ? 'rotate-90' : ''">
                  <wd-icon name="arrow-right" size="14px" color="#999" />
                </view>
              </view>
              <view class="text-#000 text-14px" v-else>{{ item.value }}</view>
            </wd-cell>
          </wd-cell-group>
          <view v-if="collapse">
            <view
              class="flex justify-between items-center px-20px py-4px bg-#EEF7FF rounded-4px mb-6px"
              v-for="(item, index) in yhList"
              :key="index"
              @click="itmeClick(item, index)"
              :class="activeIndex == index ? 'bd-1px_#9FD2FF' : ''"
            >
              <view class="color-#7887A8 text-14px flex items-center gap-5px">
                <view class="w-20px">
                  <wd-icon
                    name="check-circle-filled"
                    size="18px"
                    v-if="activeIndex == index"
                    :color="activeIndex == index ? '#2D69EF' : ''"
                  ></wd-icon>
                </view>
                <view>
                  {{
                    item.couponName.length > 5
                      ? item.couponName.substring(0, 5) + '...'
                      : item.couponName
                  }}
                </view>
              </view>
              <view class="color-#2D69EF text-14px" v-if="item.couponType === 1">
                ¥ {{ item.couponPrice }}
              </view>
              <view class="color-#2D69EF text-14px" v-if="item.couponType === 3">
                {{ item.couponPrice }} 折 {{ `(最大优惠 ¥ ${item.maxDiscountAmount})` }}
              </view>
            </view>
          </view>
        </view>
        <view class="mt-8">
          <view class="mb-20px">
            <wd-button block :round="false" @click="goPay">立即支付</wd-button>
          </view>
          <view class="mb-10px">
            <wd-button type="text" block :round="false" plain hairline @click="goback">
              返回首页
            </wd-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
:deep(.custom-class-popup) {
  @apply overflow-hidden rounded-t-20px px-20px;
}
:deep(.custom-class-cell) {
  @apply mx-[-10px]!;
}
:deep(.custom-input-class) {
  @apply text-26px! font-600!;
}
</style>
