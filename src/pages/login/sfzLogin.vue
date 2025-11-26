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
import sfz2 from '@/static/images/login/sfz2.png'
import user2 from '@/static/images/login/user2.png'
import logo from '@/static/images/logo.png'
import { useMessage } from 'wot-design-uni'
import ablist from './components/abList.vue'
import useLogin from './utils/useLogin'
const { Login, model, rules, read, submitPhoneLogin, toAgreement, loginUserList, ablistShow } =
  useLogin()
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
onUnload(() => {
  ablistShow.value = false
  read.value = false
  model.value = {
    username: '',
    password: '',
  }
})
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
    <view class="bg-cover relative bg-#fff" :style="`padding-top:${navTop}px`">
      <dy-navbar leftTitle="身份证登录" left></dy-navbar>
      <view class="flex justify-center">
        <wd-img :width="97" :height="97" :src="logo" round />
      </view>
      <view class="flex justify-center mt-20px">
        <wd-img :width="316" :height="54" :src="logoTitle" />
      </view>
    </view>

    <view class="mt-30px">
      <view class="px-30px">
        <wd-form ref="form" :model="model">
          <wd-cell-group>
            <wd-input
              label-width="100px"
              placeholder="请输入姓名"
              type="text"
              v-model="model.username"
              :rules="rules.username"
              prop="username"
              use-prefix-slot
              custom-class="custom-cell"
              no-border
              clearable
              :maxlength="11"
            >
              <template #prefix>
                <wd-img :src="user2" :width="32" :height="32"></wd-img>
              </template>
            </wd-input>

            <wd-input
              label-width="100px"
              type="text"
              v-model="model.password"
              placeholder="请输入身份证号"
              :rules="rules.password"
              prop="password"
              use-prefix-slot
              custom-class="custom-cell"
              no-border
              clearable
              :maxlength="18"
            >
              <template #prefix>
                <wd-img :src="sfz2" :width="32" :height="32"></wd-img>
              </template>
            </wd-input>
          </wd-cell-group>
        </wd-form>
        <view class="mt-15px">
          <wd-button block custom-class="custom-class-mine-login" @click="unifiedLogin(0)">
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
    <!-- 选择多个店铺的情况 -->
    <wd-overlay :show="ablistShow">
      <view class="bg-#F3F4F6 h-full w-full flex flex-col justify-center">
        <ablist :list="loginUserList"></ablist>
      </view>
    </wd-overlay>
  </view>
</template>
<style lang="scss" scoped>
:deep(.custom-cell) {
  @apply bg-#f7f7f7! py-5px! px-5px rounded-6px mb-10px;
}
</style>
