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
      showBackButton: 'false',
    },
  },
}
</route>

<script lang="ts" setup>
import tmQrcode from '@/components/dy-qrcode/dy-qrcode.vue'
import { Constant } from '@/enums/constant'
import { changeOrderStatus } from '@/service/api/shop'
import { passwordPayBToC, queryBToCOrder } from '@/service/api/userMessage'
import logo from '@/static/images/logo.png'
import sblogo from '@/static/images/sblogo.png'
import { useUserStore } from '@/store'
import { dataDesensitization, routeTo } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import { useMessage } from 'wot-design-uni'
import changeBankPay from '../compoents/changeBankPay/index.vue'
import stkts from '../static/images/sbkts.png'
import todo from '../static/images/todo.png'
import useCodeServe from './utils/useCodeServe'

const { sendSignValid, sendGenerate, sendGetStdTDCode } = useCodeServe()
const cfig = ref({
  logoImage: logo,
  str: '',
  logoWidth: 50,
  logoHeight: 50,
  size: 440,
  ecc: '',
})
const message = useMessage()
const { VITE_SERVER_BASEURL } = import.meta.env
const status = ref(false)
const { userInfo } = useUserStore()
const opts = ref({
  lineColor: '#000000',
  fontSize: 20,
  width: 2,
  textMargin: 0,
  text: 'xa',
  value: '01',
  displayValue: false,
  ecc: '',
})

const logcation = ref('')
const qrcode = ref<InstanceType<typeof tmQrcode> | null>(null)
const tabs = ref([
  {
    name: '一卡通',
    cardLabel: '身份号码',
    value: '1',
    logo,
  },
  {
    name: '电子社保卡',
    value: '2',
    cardLabel: '社会保障卡号',
    logo: sblogo,
  },
])
const active = ref(0)

function changeClick(index) {
  cfig.value.str = ''
  if (index === 1) {
    opts.value.ecc = 'H'
    cfig.value.ecc = 'H'
  }
  if (index === 0) {
    opts.value.ecc = 'M'
    cfig.value.ecc = 'M'
  }
  active.value = index
  privacyStatus.value = false
  currentShow()
}

const show = ref(false)
const textArr = ref([
  '电子社保卡二维码用于身份认证和支付',
  '结算时向商家出示',
  '请不要将二维码及数字发送给他人',
])

const privacyStatus = ref(false)
const generateXaCode = async () => {
  countdown.resetTimer()
  const params = {
    appId: 'KB23GNsIXC',
    paramData: {
      publicKey:
        '3059301306072a8648ce3d020106082a811ccf5501822d03420004bad31a84302aeeb8918e75cbc2c6ee6405597ab1793008374a7e9c40894ab682e80cf91b5a1b12d3264e4b69851041aeeaf5ec3d4efe96ce0ff0a47373d9b839',
      xm: userInfo.cardName,
      card: userInfo.cardId,
      term: 'wx',
      userId: userInfo.userDId,
    },
    appSign: '一卡通个人码',
  }
  try {
    const { data } = (await sendGetStdTDCode(params)) as any
    cardinfo.value = data.qrCode

    status.value = true
    const qrcodeData = {
      qrCode: cardinfo.value,
      qrCodeType: Constant.QR_CODE_FLAG,
      actionType: Constant.QR_CODE_CARD,
      socialCard: 'yktCard',
    }

    countdown.startTimer()
    cfig.value.logoImage = tabs.value[active.value].logo

    cfig.value.str = cardinfo.value // `${VITE_SERVER_BASEURL}?${qs.stringify(qrcodeData)}`
    console.log('一卡通码', cfig.value.str)
  } catch (error) {
    status.value = false
    errorText.value = error?.msg ?? error?.message ?? '服务异常!'
  }
}

// 倒计时
const countdown = useCountdown(
  60,
  (remainingSeconds) => {
    if (remainingSeconds === 0) {
      currentShow()
    }
  },
  false,
)

const cardinfo = ref('')
const errorText = ref('')
const isNeedPwdValid = ref(false)
const model = ref({
  aac002: userInfo.idCardNumber,
  aac003: userInfo.cardName,
  deviceId: '',
})
const generateCode = async () => {
  countdown.resetTimer()
  try {
    const data1: any = await sendSignValid(model.value)
    if (data1?.isNeedPwdValid === '0') {
      status.value = true
      isNeedPwdValid.value = true
      countdown.startTimer()
      const data: any = await sendGenerate(model.value)
      const qrcodeData = {
        qrCode: data.qrCode,
        qrCodeType: Constant.QR_CODE_FLAG,
        actionType: Constant.QR_CODE_CARD,
        socialCard: 'socialCard',
      }
      cfig.value.str = data.qrCode // `${VITE_SERVER_BASEURL}?${qs.stringify(qrcodeData)}`
      cfig.value.logoImage = tabs.value[active.value].logo
      logcation.value = data.siRegionName
      opts.value.value = data.qrCode
      opts.value.text = data.qrCode
    } else {
      message
        .alert({
          title: '提示',
          msg: data1?.msg,
          closeOnClickModal: false,
        })
        .then((res) => {})
    }
  } catch (error) {
    status.value = false
    errorText.value = error?.msg ?? error?.message ?? '服务异常!'
  }
}

// 执行显示当前
async function currentShow() {
  if (active.value === 0) {
    generateXaCode()
  } else if (active.value === 1) {
    generateCode()
  }
}

const cBack = ref()
const showBank = ref(false)
const showPwd = ref(false)
currentShow()

const barodeClick = () => {
  show.value = !show.value
}
const closePwd = async (value) => {
  console.log('关掉密码键盘>====')
  // false 调用取消订单
  if (!value) {
    message
      .confirm({
        msg: '是否取消支付',
        title: '提示',
        confirmButtonText: '取消支付',
        cancelButtonText: '继续支付',
        closeOnClickModal: false,
      })
      .then(async () => {
        try {
          await changeOrderStatus({ orderId: autoApiData.value.orderId, note: '取消付款' })
          setIsPauseTrue()
          uni.navigateBack()
        } catch (error) {
          Toast('取消支付失败')
          console.log('🍎====>', error)
        }
      })
      .catch(() => {
        console.log('点击了取消按钮')
        setIsPauseFalse()
      })
  } else {
    setIsPauseFalse()
  }
}

// 提交密码
const submit = async (value) => {
  try {
    const params: any = {
      ...autoApiData.value,
      password: value,
    }
    // 可能需要订单 传到支付
    const data = await passwordPayBToC(params)
    if (data) {
      payResult(true)
    }
  } catch (error) {
    payResult(false, { msg: '未开通支付功能！' })
  }
}
const isShow = async () => {
  routeTo({
    url: '/pages-sub/userManager/SocialSecurityCard/barcode',
    data: { isNeedPwdValid: isNeedPwdValid.value, text: opts.value.text, value: opts.value.value },
  })
  show.value = !show.value
}
const barCodeDemo = ref(
  'https://oss.xay.xacloudy.cn/images/2025-01/8c76f2d9-df52-4bc8-aa0c-c3d39cc33ca4barCodedemo.png',
)
// ====== 轮询获取是否有支付信息======
const { autoApiData, setIsPauseFalse, setIsPauseTrue } = useAutoApi(
  (params) => queryBToCOrder(params),
  (data) => {
    if (data?.status === 1 && cBack.value) {
      setIsPauseTrue()
      showPwd.value = true
    } else if (data?.status === 2) {
      payResult(data)
    } else {
      console.log('🥫,无任何状态===')
    }
  },
  false,
)

const payResult = (data, error?: any) => {
  if (data) {
    message.alert({
      title: '提示',
      msg: `成功支付 ${autoApiData.value.orderTotalFee} 元 ,即将返回!`,
      closeOnClickModal: false,
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } else {
    message.alert({
      title: '提示',
      msg: error?.msg ?? error?.message ?? '支付失败,请稍后等待支付!',
    })
  }
}
const goAddbank = () => {
  routeTo({
    url: '/pages-sub/userManager/bankCard/addCard',
  })
}
</script>

<template>
  <view v-if="!show" class="min-h-100vh bg-#F2F3F7">
    <view class="back">
      <dy-navbar leftTitle="一码办事" left isNavShow color="#000"></dy-navbar>
      <!-- 顶部切换 -->
      <view class="flex items-center justify-around gap-10px my-20px px-15px">
        <view
          class="flex flex-1 justify-center items-center gap-5px px-10px text-center bg-#fff rounded-full h-35px line-height-35px relative"
          :class="active === index ? 'active' : ''"
          v-for="(item, index) in tabs"
          :key="index"
          @click="changeClick(index)"
        >
          <wd-img :src="item.logo" width="24" height="24" v-if="item.logo"></wd-img>
          <view class="text-14px">{{ item.name }}</view>
          <view class="w-40px absolute left-50% bottom-[-30px] ml-[-20px]" v-if="active === index">
            <wd-icon name="fill-arrow-down" size="40px" color="#2D69EF"></wd-icon>
          </view>
        </view>
      </view>

      <!-- 中间内容 -->
      <view class="mt-20px px-15px">
        <view class="bg-#2D69EF color-#fff rounded-10px">
          <template v-if="status">
            <view class="relative p-10px">
              <view class="">
                <view class="text-14px py-5px">
                  姓名:
                  {{ dataDesensitization(userInfo.cardName, privacyStatus, 'userName') }}
                </view>
                <view class="text-14px py-5px">
                  {{ tabs[active].cardLabel }}:
                  {{ dataDesensitization(userInfo.idCardNumber, privacyStatus, 'last') }}
                </view>
              </view>
              <view class="absolute right-15px top-5px">
                <wd-icon
                  :name="privacyStatus ? 'view' : 'eye-close'"
                  size="22px"
                  @click="privacyStatus = !privacyStatus"
                ></wd-icon>
              </view>
            </view>
          </template>
          <template v-else>
            <view class="text-center py-30px color-#fff text-14px">
              <!-- 您尚未开通一卡通，立即开通享受一卡通服务！ -->
              {{ tabs[active].name }}服务功能暂未开放，敬请期待！
            </view>
          </template>

          <view class="bg-#fff py-20px rounded-10px overflow-hidden min-h-250px">
            <template v-if="status">
              <view class="flex justify-center 0 flex-col">
                <view class="flex justify-center flex-col items-center">
                  <view class="text-center color-#000 text-14px py-5px" v-if="active === 0">
                    {{ tabs[active].name }}二维码
                  </view>
                  <view
                    class="flex flex-col items-center h-120px"
                    @click="barodeClick"
                    v-if="active === 1"
                  >
                    <!--  #ifndef  MP-ALIPAY  -->
                    <dy-barcode :width="636" :option="opts"></dy-barcode>
                    <view class="color-#999 text-14px mt-[-16px]">
                      {{ dataDesensitization(opts.value, false, 'last') }}
                    </view>
                    <!--  #endif -->
                    <!--  #ifdef MP-ALIPAY  -->
                    <view class="mx-auto">
                      <wd-img :src="barCodeDemo" :width="310" :height="90"></wd-img>
                    </view>
                    <view class="color-#999 text-14px">
                      {{ dataDesensitization(opts.value, false, 'last') }}
                    </view>
                    <!--  #endif -->
                  </view>
                </view>

                <view class="flex justify-center mt-10px flex-col items-center">
                  <dy-qrcode ref="qrcode" :option="cfig"></dy-qrcode>
                  <view class="flex justify-center gap-10px items-center mt-10px">
                    <view class="text-#999999 text-14px">{{ countdown.seconds }}秒自动刷新</view>
                    <view class="text-#4d80f0 text-14px" @click="currentShow">手动刷新</view>
                  </view>
                </view>
                <!--                <view v-if="active === 0" class="py-10px px-15px mt-10px">-->
                <!--                  <view class="font-size-12px color-#999 text-center" v-if="!cBack">-->
                <!--                    绑定银行卡，即可开启便捷支付功能-->
                <!--                    <text class="color-#4d80f0" @click="goAddbank">【去绑卡】</text>-->
                <!--                  </view>-->
                <!--                  <view class="bt-1px_#E2E2E2_solid" v-else>-->
                <!--                    <view class="px-10px">-->
                <!--                      <view class="flex justify-between py-10px" @click="showBank = true">-->
                <!--                        <text class="color-#555 font-size-12px">优先付款银行卡</text>-->
                <!--                        <text class="color-#555 font-size-12px">-->
                <!--                          更改-->
                <!--                          <wd-icon name="arrow-right" size="12px"></wd-icon>-->
                <!--                        </text>-->
                <!--                      </view>-->
                <!--                      <view class="py-10px bg-#F4F4F7">-->
                <!--                        <view class="px-10px flex justify-between items-center rounded-4px">-->
                <!--                          <view class="flex items-center gap-10px">-->
                <!--                            <wd-img :src="yhlogo" width="20" height="20"></wd-img>-->
                <!--                            <view class="color-#000 font-size-16px">-->
                <!--                              {{ cBack.bankName || '银行卡号'-->
                <!--                              }}{{ changeDict(bankType, cBack.bankType) }} ({{-->
                <!--                                dataDesensitization(cBack.bankCode, false, 'lastFour')-->
                <!--                              }})-->
                <!--                            </view>-->
                <!--                          </view>-->
                <!--                          <view>-->
                <!--                            <wd-icon name="arrow-right" size="12px" color="#999"></wd-icon>-->
                <!--                          </view>-->
                <!--                        </view>-->
                <!--                      </view>-->
                <!--                    </view>-->
                <!--                  </view>-->
                <!--                </view>-->
                <view
                  v-if="active === 1"
                  class="flex justify-between items-center text-14px color-#555 bt-1px_dashed_#E2E2E2 py-10px px-15px mt-20px"
                >
                  <view>参保地</view>
                  <view>
                    {{ logcation }}
                  </view>
                </view>
              </view>
            </template>
            <template v-else>
              <view class="px-20px">
                <view class="flex justify-center py-35px">
                  <wd-status-tip
                    :image="todo"
                    :image-size="{
                      height: 132,
                      width: 200,
                    }"
                    :tip="errorText"
                  />
                </view>
              </view>
            </template>
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 提示信息 -->
  <wd-overlay :show="show">
    <view class="size-full flex flex-col justify-center items-center bg-#fff">
      <wd-status-tip
        :image="stkts"
        :image-size="{
          height: 132,
          width: 224,
        }"
      />
      <view class="mt-20px">
        <view class="mt-10px text-center" v-for="(item, index) in textArr" :key="index">
          <wd-text :text="item" color="#555"></wd-text>
        </view>
      </view>
      <view class="mt-20px w-100% px-40px box-border">
        <wd-button type="primary" :round="false" @click="isShow" color="#2D69EF" block>
          我知道了
        </wd-button>
      </view>
    </view>
  </wd-overlay>
  <!-- 银行卡列表 -->
  <change-bank-pay v-model:showBank="showBank" v-model:bankInfo="cBack" />
  <!-- 需要密码 -->
  <dy-password
    title="请输入支付密码"
    v-model:showPwd="showPwd"
    @submit="submit"
    @close="closePwd"
  />
</template>

<style lang="scss" scoped>
.back {
  background: linear-gradient(#d1e8fe, #f7f7f7);
}

//.tip {
//  display: flex;
//  padding-top: 66rpx;
//  padding-bottom: 54rpx;
//  font-size: 28rpx;
//  color: #999;
//
//  .a {
//    color: #2d69ef;
//  }
//}

.active {
  background: linear-gradient(144deg, #72c2fe 0%, #4055fe 100%);
  @apply color-#fff;
}
</style>
