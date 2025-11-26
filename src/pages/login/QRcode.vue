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
import { useUserStore } from '@/store/user'
import { routeTo } from '@/utils'
import { storeToRefs } from 'pinia'
import { useMessage } from 'wot-design-uni/index'
import { QRLogin } from '../../service/api/auth'
import bg from '../../static/images/login/img.png'

const { isLogined, userInfo, openid } = storeToRefs(useUserStore())
const message = useMessage()
const data = ref(null)
const logined = ref(false)

onLoad((options) => {
  console.log('🍖[options]:', options)
  data.value = options
})

// 获取微信登录code

function login() {
  // console.log('login login login login')
  if (isLogined.value) {
    const now = new Date().getTime()
    const codeTime = data.value ? data.value?.time || data.value?.t : 0
    console.log('---------------options', data.value)
    console.log('----------now', now)
    console.log('----------codeTime', codeTime)
    console.log('---------- now - codeTime', now - codeTime)

    if (now - codeTime < 1000 * 60 * 5.1) {
      QRLogin({
        scanCodeId: data.value?.data ?? data.value?.d,
        openId: openid.value,
        userId: userInfo.value.userDId,
        userAccount: userInfo.value.userPhone,
      }).then((res) => {
        console.log('res', res)
        if (res && res === (data.value?.data ?? data.value?.d)) {
          message.alert({
            msg: '登录成功！',
            title: '提示',
          })
          logined.value = true
          handleBackHome()
        } else {
          message.alert({
            msg: '登录失败，请重试！',
            title: '提示',
          })
          logined.value = false
        }
      })
      // doit
    } else {
      message.alert({
        msg: '二维码已过期，请重新扫码',
        title: '提示',
      })
    }
  } else {
    message.alert({
      msg: '请先完成小程序登录',
      title: '提示',
    })
  }
}

function handleBack() {
  uni.navigateBack()
}

function handleBackHome() {
  routeTo({
    url: '/pages/index/index',
    navType: NAVIGATE_TYPE.SWITCH_TAB,
  })
}
</script>
<template>
  <wd-navbar title="扫码登录" left-arrow fixed safeAreaInsetTop :bordered="false">
    <template #capsule>
      <wd-navbar-capsule @back="handleBack" @back-home="handleBackHome" />
    </template>
  </wd-navbar>
  <view class="w-100vw h-100vh p-20px flex flex-col FStc QRcode">
    <view class="FScc" style="width: 100%; padding-top: 100px">
      <wd-img :width="200" :height="200" mode="center" :src="bg" />
      <view class="tip">即将在电脑上登录</view>
      <view class="tip">请确认是否本人操作</view>
      <view class="FScc mt-6" style="width: 100%">
        <view class="btn" v-if="!logined">
          <wd-button block size="large" :round="false" @click="login">确认登录</wd-button>
        </view>
        <view class="btn" v-if="logined">
          <wd-button block size="large" :round="false" disabled>登录成功</wd-button>
        </view>
        <view class="btn">
          <wd-button block size="large" plain :round="false" @click="handleBack">
            {{ logined ? '返回' : '取消' }}
          </wd-button>
        </view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.QRcode {
  box-sizing: border-box;
  background: rgb(245, 244, 249);
}

.tip {
  font-size: 16px;
  line-height: 1.8;
  color: rgb(150, 150, 150);
}

.btn {
  width: 100%;
  margin: 10px 0;
}
</style>
