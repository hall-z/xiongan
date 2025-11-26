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
import logoTitle from '@/static/images/login/buchong.png'
import phone from '@/static/images/login/phone.png'
import user from '@/static/images/login/user.png'
import yzm from '@/static/images/login/yzm.png'
import logo from '@/static/images/logo.png'
// import loginOuther from './components/loginOuther.vue'
import useLogin from './utils/useLogin'
onMounted(() => {
  getCodeUrl()
})
const { model3, rules2, getCodeUrl, submitPhoneCode, countdown, sending, submitUpRealName } =
  useLogin()
const form = ref(null)
const form2 = ref(null)
const { navTop } = useNav()
onLoad((options) => {
  console.log('🥒[options]:', options)
  model3.value.userName = options.cardName
  model3.value.userCardCode = options.userCardCode
  model3.value.userId = options.userId
})
</script>
<template>
  <view class="bg-#fff min-h-100vh">
    <view class="bg-cover relative bg-#fff" :style="`padding-top:${navTop - 10}px`">
      <dy-navbar leftTitle="完善手机号" left></dy-navbar>
      <view class="flex justify-center">
        <wd-img :width="97" :height="97" :src="logo" round />
      </view>
      <view class="flex justify-center mt-20px">
        <wd-img :width="217" :height="54" :src="logoTitle" />
      </view>
    </view>

    <view class="mt-30px">
      <view class="px-30px">
        <wd-form ref="form2" :model="model3">
          <wd-cell-group>
            <wd-input
              label-width="100px"
              placeholder="请输入手机号码"
              type="text"
              v-model="model3.phone"
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
              v-model="model3.imgcode"
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
              v-model="model3.code"
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
                  @click="submitPhoneCode(form2, model3)"
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
            custom-class="custom-class-mine-login"
            @click="submitUpRealName(form2, 3)"
          >
            完 成
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
