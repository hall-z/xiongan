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

import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import logo from '@/static/images/logo.png'
import { routeTo } from '@/utils'
import loginOuther from './components/loginOuther.vue'
import useLogin from './utils/useLogin'

const {
  Login,
  getWxCode,
  read,
  submitPhoneLogin,
  getphonenumberLogin,
  goPhoneLogin,
  toAgreement,
  getPhoneNumberAlipay,
} = useLogin()

const form = ref(null)
const form2 = ref(null)

const proupshow = ref(false)
const unifiedLogin = (type: number) => {
  if (read.value) {
    readChange(type)
  } else {
    proupshow.value = true
  }
}

const cancel = () => {
  // message.close()
  proupshow.value = false
}

const getphonenumber = (e) => {
  cancel()
  read.value = true
  // #ifdef MP-WEIXIN
  getphonenumberLogin(e)
  // #endif
  // #ifdef MP-ALIPAY
  getPhoneNumberAlipay(e)
  // #endif
}

const readChange = (type: number) => {
  if (type === 0) {
    Login(form.value)
  } else if (type === 1) {
    submitPhoneLogin(form2.value)
  } else if (type === 3) {
    console.log('🥔 wxchart')
  }
}

const handleBack = () => {
  uni.navigateBack()
}

const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}

const handleBackHome = () => {
  routeTo({
    url: '/pages/index/index',
    navType: NAVIGATE_TYPE.SWITCH_TAB,
  })
}
onLoad(() => {
  // #ifdef MP-WEIXIN
  // 获取微信登录code
  getWxCode()
  // #endif
})
onShow(() => {
  // #ifdef MP-WEIXIN
  // 获取微信登录code
  read.value = false
  getWxCode()
  // #endif
})
</script>
<template>
  <wd-navbar title="登录" left-arrow fixed safeAreaInsetTop :bordered="false">
    <template #capsule>
      <wd-navbar-capsule @back="handleBack" @back-home="handleBackHome" />
    </template>
  </wd-navbar>
  <view class="w-100vw h-100vh flex flex-col justify-around bg-#fff">
    <view class="mt-18%">
      <view class="flex justify-center">
        <wd-img :width="97" :height="97" :src="logo" round />
      </view>
      <view class="flex justify-center mt-20px">
        <wd-img :width="316" :height="54" :src="logoTitle" />
      </view>
      <view class="mt-30px">
        <!-- #ifdef  MP-WEIXIN -->
        <view class="px-10 mt-20px">
          <wd-button
            v-if="read"
            block
            open-type="getPhoneNumber"
            @getphonenumber="getphonenumber"
            custom-class="custom-class-mine-login"
          >
            手机号一键登录
          </wd-button>
          <wd-button v-else block custom-class="custom-class-mine-login" @click="unifiedLogin(3)">
            手机号一键登录
          </wd-button>
        </view>
        <!-- #endif -->
        <!-- #ifdef  MP-ALIPAY -->
        <view class="px-10 mt-20px">
          <wd-button
            v-if="read"
            block
            open-type="getAuthorize"
            scope="phoneNumber"
            @getphonenumber="getphonenumber"
            custom-class="custom-class-mine-login"
          >
            手机号一键登录
          </wd-button>
          <wd-button v-else block custom-class="custom-class-mine-login" @click="unifiedLogin(3)">
            手机号一键登录
          </wd-button>
        </view>
        <!-- #endif -->

        <view class="px-10 mt-20px">
          <!-- #ifndef  MP-WEIXIN || MP-ALIPAY -->
          <wd-button block @click="goPhoneLogin" custom-class="custom-class-mine-login">
            短信验证码登录
          </wd-button>
          <!-- #endif -->
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
    </view>

    <view class="FHcc" style="padding-right: 15px">
      <wd-button type="text" icon="poweroff" @click="goHome()">取消登录</wd-button>
    </view>

    <login-Outher></login-Outher>
  </view>
  <wd-popup v-model="proupshow" custom-class="w-70% px-20px rounded-10px">
    <view class="text-center py-10px">提示</view>
    <view class="text-left">
      我已阅读并同意
      <text class="color-#336EFD" @click.stop="toAgreement('1710488285782016005', '隐私政策')">
        《隐私政策》
      </text>
      <text class="color-#336EFD" @click.stop="toAgreement('1710488285782016006', '用户协议')">
        《用户协议》
      </text>
    </view>
    <view class="flex justify-around items-center py-20px">
      <view class="flex-1">
        <wd-button type="info" @click="cancel">取消</wd-button>
      </view>
      <view class="flex-1">
        <!-- #ifdef  MP-WEIXIN -->
        <wd-button open-type="getPhoneNumber" @getphonenumber="getphonenumber">我同意</wd-button>
        <!-- #endif -->
        <!-- #ifdef  MP-ALIPAY -->
        <wd-button open-type="getAuthorize" scope="phoneNumber" @getphonenumber="getphonenumber">
          我同意
        </wd-button>
        <!-- #endif -->
      </view>
    </view>
  </wd-popup>
</template>
<style lang="scss" scoped>
:deep(.label-class),
:deep(.text-btn) {
  font-size: 12px !important;
  color: #999 !important;
}

:deep(.wd-img) {
  vertical-align: middle !important;
}

:deep(.custom-class-ftn) {
  margin: 0 !important;
}
</style>
