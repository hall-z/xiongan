<route lang="json5">
{
  layout: 'default',
  needLogin: true,
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
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { userLogout } from '@/service/api/auth'
import phone from '@/static/images/login/phone.png'
import user from '@/static/images/login/user.png'
import yzm from '@/static/images/login/yzm.png'
import logo from '@/static/images/logo.png'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import { useForm } from 'alova/client'
import isBoolean from 'lodash/isBoolean'
import { storeToRefs } from 'pinia'
import { useMessage } from 'wot-design-uni'
import { FormInstance } from 'wot-design-uni/components/wd-form/types'
import logoTitle from '../static/images/zxyz.png'
const { navTop } = useNav()
const message = useMessage()
// 获取验证码
const { getCodeUrl, codeflog } = useImageVerify()
const { sendPhoneCode, countdown, sending } = usePhoneCode()
const form = ref<FormInstance>()
const { userInfo } = storeToRefs(useUserStore())
const authStore = useUserStore()

const rules = {
  phone: [{ required: true, message: '请输入手机号' }],
  imgcode: [{ required: true, message: '请输入图形验证码' }],
  phoneCode: [{ required: true, message: '请输入验证码' }],
}

const {
  loading: formLoading,
  send: sendUserLogout,
  form: model,
} = useForm((formData) => userLogout(formData), {
  // 设置这个参数为true即可在提交完成后自动重置表单数据
  resetAfterSubmiting: true,
  immediate: false,
  loading: false,
  // 初始化表单数据
  initialForm: {
    imgcode: '',
    phone: userInfo.value.userPhone,
    phoneCode: '',
  },
})
// 发送图形验证码
const submitPhoneCode = async () => {
  const { valid } = await form.value!.validate(['imgcode', 'phone'])
  if (!valid) return
  try {
    const params = {
      phone: model.value.phone,
      code: model.value.imgcode,
      uuid: codeflog.value,
      type: 'loginOff',
    }
    const data: any = await sendPhoneCode(params)
    if (data.errorCode === 0) {
      Toast('验证码发送成功')
    }
  } catch (error) {
    getCodeUrl()
  }
}
// 注销
const alMassage = ref('账号注销成功,请确定返回首页!')

const submitCance = async () => {
  const { valid } = await form.value!.validate()
  if (!valid) return
  try {
    const res: any = await sendUserLogout()
    if (isBoolean(res) && res === true) {
      message
        .alert({
          title: '提示',
          msg: alMassage.value,
          closeOnClickModal: false,
        })
        .then(() => {
          LogOut()
        })
      authStore.clearUserInfo()
    } else {
      getCodeUrl()
      console.log('🍔====')
      alMassage.value = res?.data?.msg ?? '注销失败了！'
      message.alert({
        title: '提示',
        msg: alMassage.value,
        closeOnClickModal: false,
      })
    }
  } catch (error) {
    getCodeUrl()
    console.log('🥒[error]:', error)
    alMassage.value = error?.data?.msg ?? '注销失败了！'
    message.alert({
      title: '提示',
      msg: alMassage.value,
      closeOnClickModal: false,
    })
  }
}
const LogOut = async () => {
  // TODO: 清除用户信息
  routeTo({ url: '/pages/index/index', navType: NAVIGATE_TYPE.SWITCH_TAB })
}
// #ifdef MP-ALIPAY
const top = ref(40)
// #endif

onLoad(() => {
  getCodeUrl()
})
</script>
<template>
  <view class="bg-#fff min-h-100vh">
    <view class="relative bg-#fff" :style="`padding-top:${navTop ?? 40 - 10}px`">
      <dy-navbar leftTitle="账户验证" left></dy-navbar>
      <view class="flex justify-center">
        <wd-img :width="97" :height="97" :src="logo" round />
      </view>
      <view class="flex justify-center">
        <wd-img :width="173" :height="54" :src="logoTitle" />
      </view>
    </view>
    <view class="mt-30px">
      <view class="px-30px">
        <wd-form ref="form" :model="model">
          <wd-cell-group>
            <wd-input
              label-width="100px"
              placeholder="请输入手机号码"
              type="text"
              v-model="model.phone"
              :rules="rules.phone"
              prop="phone"
              use-prefix-slot
              custom-class="custom-cell"
              no-border
              clearable
              :maxlength="11"
              disabled
            >
              <template #prefix>
                <wd-img :src="phone" :width="32" :height="32"></wd-img>
              </template>
            </wd-input>

            <wd-input
              label-width="100px"
              type="text"
              v-model="model.imgcode"
              placeholder="请输入图形码"
              :rules="rules.imgcode"
              prop="imgcode"
              use-prefix-slot
              use-suffix-slot
              custom-class="custom-cell"
              no-border
              clearable
              :maxlength="4"
            >
              <template #prefix>
                <wd-img :src="user" :width="32" :height="32"></wd-img>
              </template>

              <template #suffix>
                <dy-verify />
              </template>
            </wd-input>
            <wd-input
              label-width="100px"
              type="text"
              v-model="model.phoneCode"
              placeholder="请输入手机验证码"
              :rules="rules.phoneCode"
              prop="phoneCode"
              use-prefix-slot
              use-suffix-slot
              custom-class="custom-cell"
              no-border
              clearable
              :maxlength="6"
            >
              <template #prefix>
                <wd-img :src="yzm" :width="32" :height="32"></wd-img>
              </template>
              <template #suffix>
                <wd-button
                  size="small"
                  plain
                  custom-class="button"
                  @click="submitPhoneCode"
                  :loading="sending"
                  :disabled="sending || countdown > 0"
                >
                  {{ sending ? '发送中...' : countdown > 0 ? `${countdown}S后获取` : '获取验证码' }}
                </wd-button>
              </template>
            </wd-input>
          </wd-cell-group>
        </wd-form>
        <view class="mt-15px">
          <wd-button
            block
            :disabled="formLoading"
            custom-class="custom-class-mine-login"
            @click="submitCance"
          >
            确认注销
          </wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.custom-cell) {
  @apply bg-#f7f7f7! py-5px! px-5px rounded-6px mb-10px;
}
</style>
