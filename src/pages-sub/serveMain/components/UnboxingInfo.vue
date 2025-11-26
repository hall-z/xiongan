<script lang="ts" setup>
import { getUnboxingInfo } from '@/service/api/cardServe'
import { useUserStore } from '@/store/user'
import { useMessage } from 'wot-design-uni'

import { useForm } from 'alova/client'
import { storeToRefs } from 'pinia'
import { statusTisProps } from '../types/types'
const message = useMessage()
const { userInfo } = storeToRefs(useUserStore())

const rules = {
  xm: [{ required: true, message: '请输入姓名' }],
  zjhm: [{ required: true, message: '请输入证件号码' }],
  zhbzkh: [
    { required: true, message: '请输入社会保障卡号' },
    // {
    //   pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,10}$/,
    //   message: '社会保障卡号必须为5~10位数字和字母',
    // },
  ],
  jbr: [{ required: true, message: '请输入经办人' }],
}
const statusDel = ref<statusTisProps>()
const submitStatus = ref(false)

// 社保卡解挂
const {
  loading,
  send: sendUnboxingInfo,
  form: model,
} = useForm(
  (formData) => {
    const params = {
      ...formData,
      xm: userInfo.value.cardName,
      zjhm: userInfo.value.idCardNumber,
      zhbzkh:
        formData.zhbzkh === userInfo.value.socialCardTm
          ? userInfo.value.socialCard
          : formData.zhbzkh,
    }
    // 可以在此转换表单数据并提交
    return getUnboxingInfo(params)
  },

  {
    immediate: false,
    loading: false,
    resetAfterSubmiting: true,
    initialForm: {
      xm: userInfo.value.cardNameTm,
      zjhm: userInfo.value.idCardNumberTm,
      zhbzkh: userInfo.value.socialCardTm,
      jbr: userInfo.value.cardName,
    },
  },
)

const submitUnboxingInfo = async (form) => {
  form.validate().then(async ({ valid }) => {
    if (valid) {
      try {
        const params = {
          jbr: userInfo.value.cardName,
          xm: userInfo.value.cardName,
          zjhm: userInfo.value.idCardNumber,
          zhbzkh: userInfo.value.socialCard,
        }
        const data: any = await sendUnboxingInfo(params)
        submitStatus.value = true
        statusDel.value = data
      } catch (error) {
        console.log('数据校验失败')
      }
    }
  })
}

const form = ref(null)

const visible = ref<boolean>(false)

function showKeyBoard() {
  visible.value = true
}

watchEffect(() => {
  if (submitStatus.value) {
    // msg: statusDel.value?.message ? statusDel.value.message : '提交成功',
    let msg = ''
    if (statusDel.value && statusDel.value && statusDel.value.message) {
      if (statusDel.value.message === '服务器异常，请联系管理员') {
        msg = '提交成功'
      } else {
        msg = statusDel.value.message
      }
    } else {
      msg = '提交成功'
    }

    message
      .alert({
        closeOnClickModal: false,
        msg,
        title: '提示',
        confirmButtonText: statusDel.value?.message ? '确定' : '返回',
      })
      .then(() => {
        if (msg === '提交成功') {
          uni.navigateBack()
        }
        // if (!statusDel.value?.message) {
        //   uni.navigateBack()
        // }
        submitStatus.value = false
      })
  }
})
</script>
<template>
  <view class="p-15px">
    <view class="rounded-10px overflow-hidden bg-#fff">
      <wd-form ref="form" :model="model">
        <wd-cell-group border>
          <wd-input
            label="姓名:"
            label-width="100px"
            type="text"
            v-model="model.xm"
            placeholder="请输入姓名"
            :rules="rules.xm"
            prop="xm"
            disabled
            custom-input-class="custom-input-right"
          />
          <wd-input
            label="身份证号码:"
            label-width="100px"
            type="text"
            v-model="model.zjhm"
            placeholder="请输入身份证号码"
            :rules="rules.zjhm"
            prop="zjhm"
            custom-input-class="custom-input-right"
            disabled
            @click="showKeyBoard"
            :maxlength="18"
            :mixlength="16"
          />
          <wd-number-keyboard
            v-model:visible="visible"
            v-model="model.zjhm"
            :maxlength="18"
            extra-key="X"
            close-text="完成"
          ></wd-number-keyboard>
          <wd-input
            label="社会保障卡号:"
            label-width="100px"
            type="text"
            v-model="model.zhbzkh"
            placeholder="请输入社会保障卡号"
            :rules="rules.zhbzkh"
            prop="zhbzkh"
            custom-input-class="custom-input-right"
          />
          <!-- <wd-input
            label="经办人:"
            label-width="100px"
            type="text"
            v-model="model.jbr"
            placeholder="请输入经办人"
            :rules="rules.jbr"
            prop="jbr"
            custom-input-class="custom-input-right"
          /> -->
        </wd-cell-group>
      </wd-form>
    </view>
    <view class="mt-20px">
      <wd-button
        type="primary"
        :round="false"
        size="medium"
        @click="submitUnboxingInfo(form)"
        block
        :loading="loading"
      >
        提 交
      </wd-button>
    </view>
  </view>
  <wd-message-box></wd-message-box>
</template>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>
<style lang="scss" scoped>
:deep(.wd-input__error-message) {
  @apply text-right!;
}
:deep(.custom-input-right) {
  @apply text-right! color-#999999!;
}
</style>
