<script lang="ts" setup>
import { appLoginByNumber } from '@/service/api/auth'
import sfz from '@/static/images/login/sfz.png'
import shuzi from '@/static/images/login/shuzi.png'
import yzms from '@/static/images/login/yzms.png'
import { useUserStore } from '@/store/user'
import store from '@/store'
import { useToast } from 'wot-design-uni'
import useLogin from '../utils/useLogin'

const { goSfzLogin, resultData, read, goPhoneLogin } = useLogin()
const toast = useToast()
const authStore = useUserStore(store)
const shuziLogin = () => {
  console.log('read.value', read.value, '====', authStore)
  if (read.value) {
    // console.log('authStore', authStore)
    // 插件未初始化成功就不让调
    if (authStore.pluginStatus) {
      authStore.realNamePlugin.doDigitalIdentityQuickLogin({ actionNumber: 2 }, (data) => {
        console.log('数字身份登录完毕', data)
        const { openId } = JSON.parse(data)
        authStore.realNamePlugin.getDataByAuth({ openId, ruleIds: 10306 }, (res) => {
          console.log('获取用户信息', res)
          const arr = Object.values(JSON.parse(res).getData)
          const param = {
            userPhone: arr[1],
            cardCode: arr[0],
            cardName: arr[3],
            numberOpenId: openId,
          }
          appLogin(param)
        })
      })
    } else {
      console.log('authStore ERRoR', authStore.pluginStatus)
    }
  } else {
    uni.showToast({
      title: '请勾选用户协议',
      icon: 'error',
    })
  }
}

const appLogin = (data) => {
  appLoginByNumber(data).then((res) => {
    console.log('更新实名认证', res)
    resultData(res)
  })
}
</script>

<template>
  <view class="left-0 right-0">
    <wd-divider>更多登录方式</wd-divider>
    <view class="flex justify-center items-center gap-20px mt-10px">
      <!-- #ifdef  MP-WEIXIN || MP-ALIPAY -->

      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN || MP-ALIPAY -->
      <view class="flex items-center">
        <view class="flex flex-col items-center" style="width: 100px">
          <wd-button @click="goPhoneLogin" type="text" size="large" custom-class="custom-class-ftn">
            <wd-img width="33" height="33" :src="yzms"></wd-img>
          </wd-button>
          <view class="font-size-12px mt-5px color-#666">短信验证码登录</view>
        </view>
        <view style="width: 20px; height: 100%"></view>

        <view class="flex flex-col items-center" style="width: 100px">
          <wd-button type="text" size="large" custom-class="custom-class-ftn" @click="goSfzLogin">
            <wd-img width="33" height="33" :src="sfz"></wd-img>
          </wd-button>
          <view class="font-size-12px mt-5px color-#666">身份证登录</view>
        </view>
      </view>
      <!-- #endif -->

      <!-- #ifdef APP-PLUS -->
      <view class="flex flex-col items-center">
        <wd-button type="text" size="large" custom-class="custom-class-ftn" @click="shuziLogin">
          <wd-img width="33" height="33" :src="shuzi"></wd-img>
        </wd-button>
        <view class="font-size-12px mt-5px color-#666">数字身份</view>
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
