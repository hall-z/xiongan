<route lang="json5" type="page">
{
  needLogin: true,
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<script lang="ts" setup>
import { updateBankcardPayCode } from '@/service/api/userMessage'
import { useForm } from 'alova/client'
import { md5 } from 'js-md5'
import { useMessage } from 'wot-design-uni'
import useCard from './utils/useCard'
const { sendPayCode } = useCard()

const message = useMessage()
const form = ref()
const rules = ref({
  newPs: [{ required: true, message: '请输入旧密码' }],
  confirmPs: [
    {
      required: true,
      message: '请输入确认密码',
      validator: (val: any) => {
        if (val === model.value.newPs) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('两次新密输入不一致'))
        }
      },
    },
  ],
})
const uuid = ref('')
const {
  loading,
  send: sendChangeCardPwd,
  form: model,
} = useForm(
  (formData) => {
    // 密码要加密传输====
    const params = {
      newPs: md5(formData.newPs),
      confirmPs: md5(formData.confirmPs),
      uuid: uuid.value,
    }
    console.log('🧀', params)
    return updateBankcardPayCode(params)
  },
  {
    immediate: false,
    loading: false,
    // 初始化表单数据
    resetAfterSubmiting: true,
    initialForm: {
      newPs: '',
      confirmPs: '',
    },
  },
)
const submitPasswoed = (form) => {
  if (flog.value) {
    message
      .alert({
        title: '提示',
        msg: '验证身份失败,请重新验证',
        closeOnClickModal: false,
      })
      .then(() => {
        flog.value = false
        showPwd.value = true
      })

    return
  }
  form.validate().then(async ({ valid, errors }) => {
    if (valid) {
      try {
        console.log('数据校验成功')
        const data: any = await sendChangeCardPwd()

        if (data) {
          message.alert({
            title: '提示',
            msg: '修改成功,即将返回!',
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 3000)
        } else {
          message.alert({
            title: '提示',
            msg: '修改失败',
          })
        }
      } catch (error) {
        console.log('🍜[error]:', error)
        message.alert({
          title: '提示',
          msg: '数据校验失败',
        })
        showPwd.value = true
      }
    }
  })
}
const title = ref('修改支付密码')

const flog = ref(false)
const submit = async (value) => {
  console.log(value)
  try {
    const data = (await sendPayCode({
      payCode: value,
    })) as string
    if (data) {
      // 可以修改
      flog.value = false
      showPwd.value = false
      uuid.value = data ?? ''
    }
  } catch (error) {
    console.log('🍜[error]:', error)
    message.alert({
      title: '提示',
      msg: error.data.msg,
    })
  }
}
const showPwd = ref(true)
</script>
<template>
  <dy-content>
    <template #top>
      <dy-navbar :leftTitle="title" left></dy-navbar>
    </template>
    <view class="pb-15px">
      <wd-gap bg-color="#F5f5f5" height="5px"></wd-gap>
      <view class="overflow-hidden bg-#fff px-15px">
        <wd-form ref="form" :model="model">
          <wd-cell-group>
            <wd-input
              label="新密码"
              label-width="100px"
              type="text"
              v-model="model.newPs"
              placeholder="请输入新密码"
              :rules="rules.newPs"
              prop="newPs"
              showPassword
              :maxlength="6"
              custom-class="bb-1px_#ccc_dashed! "
            />
            <wd-input
              label="确认新密码"
              label-width="100px"
              type="text"
              v-model="model.confirmPs"
              placeholder="请确认新密码"
              :rules="rules.confirmPs"
              prop="confirmPs"
              showPassword
              :maxlength="6"
              custom-class="bb-1px_#ccc_dashed! "
            />
          </wd-cell-group>
        </wd-form>
      </view>
    </view>
    <!-- <wd-button @click="a">点击</wd-button> -->
    <template #bottom>
      <view class="p-15px bg-#fff">
        <wd-button
          type="primary"
          :round="false"
          size="medium"
          @click="submitPasswoed(form)"
          block
          :loading="loading"
        >
          提 交
        </wd-button>
      </view>
    </template>
    <dy-password
      title="修改密码"
      decoration="请输入原密码，以验证身份"
      v-model:showPwd="showPwd"
      @submit="submit"
      :mask="false"
      warp-style="h-450px"
      :repeat="1"
    />
  </dy-content>
</template>
