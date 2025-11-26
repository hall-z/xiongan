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
import logoTitle from '@/static/images/login/logoTitle.png'
import phone from '@/static/images/login/phone.png'
import user from '@/static/images/login/user.png'
import yzm from '@/static/images/login/yzm.png'
import logo from '@/static/images/logo.png'
import { useMessage } from 'wot-design-uni'
// import loginOuther from './components/loginOuther.vue'
import useLogin from './utils/useLogin'
onMounted(() => {
  getCodeUrl()
})
const {
  Login,
  read,
  model2,
  rules2,
  getCodeUrl,
  submitPhoneCode,
  countdown,
  sending,
  submitPhoneLogin,
  toAgreement,
} = useLogin()
const form = ref(null)
const form2 = ref(null)
const { navTop } = useNav()

const message = useMessage('wd-message-box-slot')
const unifiedLogin = (type: number, $event?: any) => {
  if (read.value) {
    readChange(type)
  } else {
    message
      .confirm({
        title: '提示',
      })
      .then(() => {
        read.value = true
        readChange(type)
      })
      .catch((error) => {
        console.log(error)
        read.value = false
      })
  }
}
const readChange = (type: number) => {
  if (type === 0) {
    Login(form.value)
  } else if (type === 1) {
    submitPhoneLogin(form2.value)
  }
}
</script>
<template>
  <view class="bg-#fff min-h-100vh">
    <view class="bg-cover relative bg-#fff" :style="`padding-top:${navTop - 10}px`">
      <dy-navbar leftTitle="手机号登录" left></dy-navbar>
      <view class="flex justify-center">
        <wd-img :width="97" :height="97" :src="logo" round />
      </view>
      <view class="flex justify-center mt-20px">
        <wd-img :width="316" :height="54" :src="logoTitle" />
      </view>
    </view>

    <view class="mt-30px">
      <view class="px-30px">
        <wd-form ref="form2" :model="model2">
          <wd-cell-group>
            <wd-input
              label-width="100px"
              placeholder="请输入手机号码"
              type="text"
              v-model="model2.phone"
              :rules="rules2.phone"
              prop="phone"
              use-prefix-slot
              custom-class="custom-cell"
              no-border
              clearable
              :maxlength="11"
            >
              <template #prefix>
                <wd-img :src="phone" :width="32" :height="32"></wd-img>
              </template>
            </wd-input>

            <wd-input
              label-width="100px"
              type="text"
              v-model="model2.imgcode"
              placeholder="请输入图形码"
              :rules="rules2.imgcode"
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
              v-model="model2.code"
              placeholder="请输入手机验证码"
              :rules="rules2.code"
              prop="code"
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
                  @click="submitPhoneCode(form2, model2)"
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
          <wd-button block custom-class="custom-class-mine-login" @click="unifiedLogin(1)">
            登录
          </wd-button>
        </view>
      </view>
      <view class="px-10 mt-15px">
        <view class="flex gap-10px">
          <wd-checkbox v-model="read" prop="read" custom-label-class="label-class"></wd-checkbox>
          <view class="text-12px color-#A6A6A6">
            <text @click="read = !read">未注册账号验证后自动注册并登录，登录即表示同意</text>
            <text
              class="color-#336EFD"
              @click.stop="toAgreement('1710488285782016005', '隐私政策')"
            >
              《隐私政策》、
            </text>
            <text
              class="color-#336EFD"
              @click.stop="toAgreement('1710488285782016006', '用户协议')"
            >
              《用户协议》
            </text>
          </view>
        </view>
      </view>
    </view>
    <wd-message-box selector="wd-message-box-slot">
      <view class="text-left">
        我已阅读并同意
        <text class="color-#336EFD" @click.stop="toAgreement('1710488285782016005', '隐私政策')">
          《隐私政策》
        </text>
        <text class="color-#336EFD" @click.stop="toAgreement('1710488285782016006', '用户协议')">
          《用户协议》
        </text>
      </view>
    </wd-message-box>
  </view>
</template>
<style lang="scss" scoped>
:deep(.custom-cell) {
  @apply bg-#f7f7f7! py-5px! px-5px rounded-6px mb-10px;
}
</style>
