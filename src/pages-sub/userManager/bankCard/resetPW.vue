<route lang="json5" type="page">
{
  needLogin: true,
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<script lang="ts" setup>
import { toVerifySmsCode } from '@/service/api/userMessage'
import { useUserStore } from '@/store/user'
import { useForm } from 'alova/client'
import { useMessage, useToast } from 'wot-design-uni'
import useCard from './utils/useCard'
const { sendPhoneCode, countdown, sending } = usePhoneCode(2)
const userStore = useUserStore()
const { userInfo } = userStore
const toast = useToast()
const message = useMessage()
const { sendBankcardPayCode } = useCard()

const form = ref()
const rules = ref({
  bankPhone: [{ required: true, message: '请输入已绑定手机号' }],
  smsCode: [{ required: true, message: '请输入验证码' }],
})

const {
  loading,
  send: sendVerifySmsCode,
  form: model,
} = useForm(
  (formData) => {
    return toVerifySmsCode(formData)
  },
  {
    immediate: false,
    loading: false,
    // 初始化表单数据
    resetAfterSubmiting: true,
    initialForm: {
      bankPhone: userInfo.userPhone,
      smsCode: '',
    },
  },
)
const submitPasswoed = async () => {
  console.log(model.value)
  const { valid, errors } = await form.value!.validate()
  if (valid) {
    try {
      const data: any = await sendVerifySmsCode()
      if (data) {
        showPwd.value = true
      }
    } catch (error) {
      message.alert({
        title: '提示',
        msg: error.data.msg || '重置密码失败',
      })
    }
  }
}
const title = ref('忘记支付密码')
const showPwd = ref(false)
const submit = async (value) => {
  // 提交密码的
  try {
    const data = await sendBankcardPayCode({
      payCode: value,
    })
    if (data) {
      toast.success('重置密码成功')
      setTimeout(() => {
        uni.navigateBack()
      }, 3000)
    }
  } catch (error) {
    message.alert({
      title: '提示',
      msg: error.data?.msg || '重置密码失败',
    })
  }
}
async function submitPhoneCode() {
  const { valid, errors } = await form.value!.validate(['bankPhone'])
  if (valid) {
    try {
      const res = await sendPhoneCode({
        bankPhone: model.value.bankPhone,
      })
      if (res) {
        toast.success('发送验证码成功')
      }
    } catch (error) {
      message.alert({
        title: '提示',
        msg: error.data?.msg || '发送验证码失败',
      })
    }
  } else {
    console.log('校验不通过', errors)
  }
}
</script>
<template>
  <dy-content>
    <template #top>
      <dy-navbar :leftTitle="title" left></dy-navbar>
    </template>
    <view class="pb-15px">
      <wd-gap bg-color="#F5f5f5" height="5px"></wd-gap>
      <view class="overflow-hidden bg-#fff">
        <wd-form ref="form" :model="model">
          <wd-cell-group border>
            <wd-input
              label="已绑定手机号:"
              label-width="100px"
              type="text"
              v-model="model.bankPhone"
              placeholder="请输入已绑定手机号"
              :rules="rules.bankPhone"
              prop="bankPhone"
              custom-class="bb-1px_#ccc_dashed! "
              :maxlength="11"
            />
            <wd-input
              label="验证码:"
              label-width="100px"
              type="text"
              v-model="model.smsCode"
              placeholder="请输入验证码"
              :rules="rules.smsCode"
              prop="smsCode"
              custom-class="bb-1px_#ccc_dashed! "
              :maxlength="6"
            >
              <!--  -->
              <template #suffix>
                <wd-button
                  size="small"
                  plain
                  custom-class="color-#1890ff! font-size-12px! border-none!"
                  :loading="sending"
                  :disabled="sending || countdown > 0"
                  @click="submitPhoneCode"
                >
                  {{ sending ? '发送中...' : countdown > 0 ? `${countdown}S后获取` : '获取验证码' }}
                </wd-button>
              </template>
            </wd-input>
          </wd-cell-group>
        </wd-form>
      </view>
    </view>
    <template #bottom>
      <view class="p-15px bg-#fff">
        <wd-button
          type="primary"
          :round="false"
          size="medium"
          @click="submitPasswoed"
          block
          :loading="loading"
        >
          提 交
        </wd-button>
      </view>
    </template>
    <!-- 需要密码 -->
    <dy-password title="重置密码" decoration="" v-model:showPwd="showPwd" @submit="submit" />
  </dy-content>
</template>
