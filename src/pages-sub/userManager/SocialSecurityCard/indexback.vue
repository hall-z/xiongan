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
      showBackButton: 'false',
    },
  },
}
</route>

<script lang="ts" setup>
import tmQrcode from '@/components/dy-qrcode/dy-qrcode.vue'
import { getGenerate, getQrcodelnit } from '@/service/api/cardServe'
import logo from '@/static/images/sblogo.png'
import { useUserStore } from '@/store'
import { dataDesensitization, getBack, routeTo } from '@/utils'
import { useRequest } from 'alova/client'
import { useMessage } from 'wot-design-uni'
import stkts from '../static/images/sbkts.png'
import todo from '../static/images/todo.png'

const { userInfo } = useUserStore()
const message = useMessage()

const opts = ref({
  lineColor: '#000000',
  fontSize: 20,
  width: 2,
  textMargin: 0,
  text: '121',
  value: '1212',
  displayValue: false,
  orientation: 'vertical', // 生成横向条形码
})

const qrcode = ref<InstanceType<typeof tmQrcode> | null>(null)
const qrCodeImg = ref('')
const isNeedPwdValid = ref(false)

const cfig = ref()
cfig.value = {
  logoImage: logo,
  str: '',
  logoWidth: 60,
  logoHeight: 60,
  size: 440,
}

const logcation = ref('')
const user = ref({
  name: userInfo.cardName,
  shbzkh: userInfo.idCardNumber,
})
const show = ref(false)
const textArr = ref([
  '电子社保卡二维码用于身份认证和支付',
  '结算时向商家出示',
  '请不要将二维码及数字发送给他人',
])

const isShow = async () => {
  console.log('🥗')
  routeTo({
    url: '/pages-sub/userManager/SocialSecurityCard/barcode',
    data: { isNeedPwdValid: isNeedPwdValid.value, text: opts.value.text, value: opts.value.value },
  })
  show.value = false
}

const model = ref({
  // aac002: '321087197912280054',
  // aac003: '王冬',
  // deviceId: '',
  aac002: userInfo.idCardNumber,
  aac003: userInfo.cardName,
  deviceId: '',
})

//  验证是否有码
const { send: sendSignValid, loading: LoadingValid } = useRequest((data) => getQrcodelnit(data), {
  immediate: false,
  loading: false,
})
const { send: sendGenerate } = useRequest((data) => getGenerate(data), {
  immediate: false,
  loading: false,
})
const generateCode = async () => {
  countdown.resetTimer()
  try {
    const data: any = await sendGenerate(model.value)
    cfig.value.str = data.qrCode
    logcation.value = data.siRegionName
    opts.value.value = data.qrCode
    opts.value.text = data.qrCode
  } catch (error) {
    console.log('🦑[error]:', error)
  }
}

const countdown = useCountdown(
  60,
  (remainingSeconds) => {
    if (remainingSeconds === 0) {
      generateCode()
    }
  },
  false,
)

const status = ref(false)
const errorText = ref('数据处理中...')
const barCodeShow = ref(true)
onShow(async () => {
  try {
    const data: any = await sendSignValid(model.value)

    if (data?.isNeedPwdValid === '0') {
      status.value = true
      isNeedPwdValid.value = true
      // 调用二维码展示
      countdown.startTimer()
      await generateCode()
      setTimeout(() => {
        barCodeShow.value = false
      }, 2000)
    } else {
      message
        .alert({
          title: '提示',
          msg: data?.msg,
          closeOnClickModal: false,
        })
        .then((res) => {
          getBack()
        })
    }
  } catch (error) {
    status.value = false
    errorText.value = error?.msg ?? error?.message ?? '服务异常!'
  }
})

function barodeClick() {
  // #ifndef MP-ALIPAY
  show.value = true
  // #endif
}

const barCodeDemo = ref(
  'https://oss.xay.xacloudy.cn/images/2025-01/8c76f2d9-df52-4bc8-aa0c-c3d39cc33ca4barCodedemo.png',
)
</script>

<template>
  <view v-if="!show">
    <view class="back">
      <dy-navbar leftTitle="电子社保卡二维码" left isNavShow></dy-navbar>
      <view class="flex gap-5px items-center justify-center mt-15px">
        <view>
          <wd-img :src="logo" :width="38" :height="38"></wd-img>
        </view>
        <view class="color-#fff font-600">电子社保卡</view>
      </view>

      <view class="px-10px">
        <template v-if="status">
          <view class="color-#fff mt-10px px-20px line-height-30px">
            <view>姓名:{{ dataDesensitization(user.name, false, 'first') }}</view>
            <view>社会保障号码:{{ dataDesensitization(user.shbzkh, false, 'last') }}</view>
          </view>
          <view class="mt-10px mb-20px px-15px mx-[-15px]">
            <view class="bg-#fff pt-20px pb-5px rounded-10px overflow-hidden">
              <view class="flex justify-center flex-col items-center h-120px" @click="barodeClick">
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

              <view class="flex justify-center mt-10px flex-col items-center">
                <dy-qrcode ref="qrcode" :option="cfig"></dy-qrcode>
                <view class="flex justify-center gap-10px items-center mt-10px">
                  <view class="text-#999999 text-14px">{{ countdown.seconds }}秒自动刷新</view>
                  <view class="text-#4d80f0 text-14px" @click="generateCode">手动刷新</view>
                </view>
              </view>

              <view
                class="flex justify-between items-center text-14px color-#555 bt-1px_dashed_#E2E2E2 py-10px px-15px mt-20px"
              >
                <view>参保地</view>
                <view>
                  {{ logcation }}
                </view>
              </view>
            </view>
          </view>
        </template>
        <template v-else>
          <view
            class="h-300px mt-15px p-20px flex flex-col justify-center items-center rounded-5px bg-#fff shadow-lg shadow-blue-500/50"
          >
            <wd-status-tip
              :image="todo"
              :image-size="{
                height: 132,
                width: 224,
              }"
              :tip="errorText"
            />
          </view>
        </template>
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
</template>

<style lang="scss" scoped>
.back {
  background: linear-gradient(to bottom, #2d69ef 40%, transparent 40%);
}
</style>
