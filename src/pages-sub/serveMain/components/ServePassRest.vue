<script lang="ts" setup>
import { useMessage } from 'wot-design-uni'
import usePassword from '../hooks/usePassword'
import { statusTisProps } from '../types/types'
import { useUserStore } from '@/store/user'

// 表单数据回显
import { onMounted } from 'vue'
const message = useMessage()
const { model, rules, sendCardPassword, loading } = usePassword()
const { userInfo } = useUserStore()

const form = ref(null)
const visible = ref<boolean>(false)

function showKeyBoard() {
  visible.value = true
}

const statusDel = ref<statusTisProps>()

function submitPasswoed(form) {
  form.validate().then(async ({ valid, errors }) => {
    if (valid) {
      try {
        const params = {
          userName: userInfo.cardNameTm,
          cardNumber: userInfo.idCardNumberTm,
          socialScCardNumber: userInfo.socialCardTm,
          resetPassword: model.value.resetPassword,
          operator: userInfo.cardName,
          resetPasswordTwo: model.value.resetPasswordTwo,
        }
        const data: any = await sendCardPassword(params)
        console.log('🥪[data]:', data)
        statusDel.value = data
        message
          .alert({
            closeOnClickModal: false,
            msg: statusDel.value?.message ? statusDel.value.message : '提交成功',
            title: '提示',
            confirmButtonText: statusDel.value?.message ? '确定' : '返回',
          })
          .then(() => {
            if (!statusDel.value?.message) {
              uni.navigateBack({
                delta: 2,
              })
            }
          })
      } catch (error) {
        console.log('数据校验失败')
      }
    }
  })
}
// import { useUserStore } from '@/store/user'
// const { userInfo } = useUserStore()
onMounted(() => {
  console.log('.....')
  model.value.cardNumber = userInfo.idCardNumberTm
  model.value.socialScCardNumber = userInfo.socialCardTm
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
            v-model="model.userName"
            placeholder="请输入姓名"
            :rules="rules.userName"
            prop="userName"
            custom-input-class="custom-input-right"
            disabled
          />
          <wd-input
            label="身份证号码:"
            label-width="100px"
            type="text"
            v-model="model.cardNumber"
            placeholder="请输入身份证号码"
            :rules="rules.cardNumber"
            prop="cardNumber"
            custom-input-class="custom-input-right"
            disabled
            @click="showKeyBoard"
            :maxlength="18"
            :mixlength="16"
          />
          <wd-number-keyboard
            v-model:visible="visible"
            v-model="model.cardNumber"
            :maxlength="18"
            extra-key="X"
            close-text="完成"
          ></wd-number-keyboard>
          <wd-input
            label="社会保障卡号:"
            label-width="100px"
            type="text"
            v-model="model.socialScCardNumber"
            placeholder="请输入社会保障卡号"
            :rules="rules.socialScCardNumber"
            prop="socialScCardNumber"
            custom-input-class="custom-input-right"
          />
          <wd-input
            label="新密码:"
            label-width="100px"
            type="text"
            v-model="model.resetPassword"
            placeholder="请输入新密码"
            :rules="rules.resetPassword"
            prop="resetPassword"
            custom-input-class="custom-input-right"
            showPassword
          />
          <wd-input
            label="确认密码:"
            label-width="100px"
            type="text"
            v-model="model.resetPasswordTwo"
            placeholder="请输入确认密码"
            :rules="rules.resetPasswordTwo"
            prop="resetPasswordTwo"
            custom-input-class="custom-input-right"
            showPassword
          />

          <!-- <wd-input
            label="经办人:"
            label-width="100px"
            type="text"
            v-model="model.operator"
            placeholder="请输入经办人"
            :rules="rules.operator"
            prop="operator"
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
        @click="submitPasswoed(form)"
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
