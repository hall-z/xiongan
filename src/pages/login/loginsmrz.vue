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
import { appUpdateRealName } from '@/service/api/auth'
import { useUserStore } from '@/store/user'
import store from '@/store'

import { dataDesensitization } from '@/utils/index'
import { storeToRefs } from 'pinia'
import useLogin from './utils/useLogin'

const { isLogined, userInfo, realNamePlugin, pluginStatus, isRealSataus } = storeToRefs(
  useUserStore(store),
)
const { Login, model, rules, resultData } = useLogin()
const form = ref(null)

function handleClickLeft() {
  uni.navigateBack()
}

const data = ref([])
const iconColse = ref(false)
const isRealSataus2 = ref(false)

onShow(() => {
  // #ifdef APP-PLUS
  isRealSataus2.value =
    userInfo.value.idCardNumber && userInfo.value.cardId && userInfo.value.isReal === '1'
  // #endif
})

onLoad(() => {
  console.log('🥛', userInfo.value, isRealSataus2.value)

  // #ifdef APP-PLUS
  isRealSataus2.value =
    userInfo.value.idCardNumber && userInfo.value.cardId && userInfo.value.isReal === '1'
  if (!userInfo.value?.idCardNumber) {
    // 插件未初始化成功就不让调
    if (pluginStatus.value) {
      realName()
    }
  }
  // #endif
})
const realName = () => {
  realNamePlugin.value.doDigitalIdentityQuickLogin({ actionNumber: 2 }, (data) => {
    console.log('数字身份登录完毕', data)
    const { openId } = JSON.parse(data)
    realNamePlugin.value.getDataByAuth({ openId, ruleIds: 10306 }, (res) => {
      console.log('获取用户信息', res)
      const arr = Object.values(JSON.parse(res).getData)
      const param = {
        userPhone: arr[1],
        cardCode: arr[0],
        cardName: arr[3],
        numberOpenId: openId,
      }
      updateRealName(param)
    })
  })
}
const updateRealName = (data) => {
  appUpdateRealName(data).then(async (res) => {
    console.log('更新实名认证', res)
    if (res) {
      const newData = {
        idCardNumber: data.cardCode,
        cardName: data.cardName,
        cardId: res,
      }
      uni.showLoading({ title: '认证成功' })
      await resultData({ ...userInfo.value, ...newData }, 0)
    }
  })
}
</script>
<template>
  <dy-navbar leftTitle="实名认证" center customClass="nav_bg"></dy-navbar>
  <wd-gap bg-color="#F5f5f5"></wd-gap>
  <!-- #ifdef MP-WEIXIN || MP-ALIPAY -->
  <view class="px-10px py-5px" v-if="!isRealSataus">
    <!-- #ifdef MP-WEIXIN || MP-ALIPAY -->
    <wd-form ref="form" :model="model">
      <view class="py-10px mb-10px">
        <view class="my-8px">真实姓名</view>
        <view class="p-10px bg-#fff rounded-4px">
          <wd-input
            type="text"
            v-model="model.username"
            placeholder="请输入真实姓名"
            :rules="rules.username"
            prop="username"
            no-border
            :maxlength="20"
          />
        </view>
      </view>
      <view class="py-10px mb-10px">
        <view class="my-8px">身份证号</view>
        <view class="p-10px bg-#fff rounded-4px">
          <wd-input
            type="text"
            v-model="model.password"
            placeholder="请输入身份证号"
            :rules="rules.password"
            prop="password"
            no-border
            :maxlength="18"
          />
        </view>
      </view>
    </wd-form>
    <view class="mt-40px">
      <wd-button type="primary" size="medium" :round="false" @click="Login(form, 0, 2)" block>
        去 认 证
      </wd-button>
    </view>
    <!-- #endif -->

    <!-- #ifdef APP-PLUS -->
    <view class="mt-60vh">
      <wd-button type="primary" size="medium" :round="false" @click="realName" block>
        去 认 证
      </wd-button>
    </view>
    <!-- #endif -->
  </view>
  <!--    #endif-->

  <!--    #ifdef APP-PLUS-->
  <view class="px-10px py-5px" v-if="!isRealSataus2">
    <!-- #ifdef MP-WEIXIN || MP-ALIPAY -->
    <wd-form ref="form" :model="model">
      <view class="py-10px mb-10px">
        <view class="my-8px">真实姓名</view>
        <view class="p-10px bg-#fff rounded-4px">
          <wd-input
            type="text"
            v-model="model.username"
            placeholder="请输入真实姓名"
            :rules="rules.username"
            prop="username"
            no-border
            :maxlength="20"
          />
        </view>
      </view>
      <view class="py-10px mb-10px">
        <view class="my-8px">身份证号</view>
        <view class="p-10px bg-#fff rounded-4px">
          <wd-input
            type="text"
            v-model="model.password"
            placeholder="请输入身份证号"
            :rules="rules.password"
            prop="password"
            no-border
            :maxlength="18"
          />
        </view>
      </view>
    </wd-form>
    <view class="mt-40px">
      <wd-button type="primary" size="medium" :round="false" @click="Login(form, 0, 2)" block>
        去 认 证
      </wd-button>
    </view>
    <!-- #endif -->

    <!-- #ifdef APP-PLUS -->
    <view class="mt-60vh">
      <wd-button type="primary" size="medium" :round="false" @click="realName" block>
        去 认 证
      </wd-button>
    </view>
    <!-- #endif -->
  </view>
  <!--    #endif-->
  <view class="px-10px py-5px" v-else>
    <view class="rounded-10px overflow-hidden bg-#fff">
      <wd-cell-group title="基本信息">
        <template #value>
          <view @click="iconColse = !iconColse">
            <wd-icon
              :name="iconColse ? 'view' : 'eye-close'"
              size="20px"
              :color="iconColse ? '#666' : '#2D69EF'"
            ></wd-icon>
          </view>
        </template>
        <wd-cell
          title="姓名"
          :value="dataDesensitization(userInfo.cardName, iconColse, 'userName')"
          border
        ></wd-cell>
        <wd-cell title="证件类型" value="身份证" border></wd-cell>
        <wd-cell
          title="身份证号"
          :value="dataDesensitization(userInfo.idCardNumber, iconColse, 'last')"
          border
        ></wd-cell>
      </wd-cell-group>
    </view>
    <view class="mt-20px">
      <wd-button type="primary" :round="false" size="medium" block @click="handleClickLeft">
        返 回
      </wd-button>
    </view>
  </view>
</template>
<style>
page {
  background: #f5f5f5;
}
</style>
<style lang="scss" scoped>
:deep(.label-class),
:deep(.text-btn) {
  font-size: 12px !important;
  color: #999 !important;
}
</style>
