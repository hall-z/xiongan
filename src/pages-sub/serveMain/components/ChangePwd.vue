<script lang="ts" setup>
import { routeTo } from '@/utils'
import { useMessage } from 'wot-design-uni'
import useChangePwd from '../hooks/useChangePwd'

// 表单数据回显
import { useUserStore } from '@/store/user'
import { onMounted } from 'vue'

const { submitPasswoed, model, rules, loading, submitStatus, statusDel } = useChangePwd()

const message = useMessage()
const form = ref(null)

const visible = ref<boolean>(false)

const Passreset = function () {
  routeTo({
    url: '/pages-sub/serveMain/cardFromType',
    data: { base: 'servepassreset', title: '服务密码重置' },
  })
}

function showKeyBoard() {
  visible.value = true
}

watchEffect(() => {
  if (submitStatus.value) {
    message
      .alert({
        closeOnClickModal: false,
        msg: statusDel.value?.msg ? statusDel.value.msg : '提交成功',
        title: '提示',
        confirmButtonText: statusDel.value?.msg ? '确定' : '返回',
      })
      .then(() => {
        if (!statusDel.value?.msg) {
          uni.navigateBack()
        }
        submitStatus.value = false
      })
  }
})

const { userInfo } = useUserStore()
onMounted(() => {
  model.value.shbzkh = userInfo.socialCardTm
  model.value.xm = userInfo.cardNameTm
  model.value.zjhm = userInfo.idCardNumberTm
  model.value.oldPwd = ''
  model.value.newPwd = ''
  model.value.newPwdTwo = ''
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
            label="证件号码:"
            label-width="100px"
            type="text"
            v-model="model.zjhm"
            placeholder="请输入证件号码"
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
            v-model="model.shbzkh"
            placeholder="请输入社会保障卡号"
            :rules="rules.shbzkh"
            prop="shbzkh"
            custom-input-class="custom-input-right"
          />
          <wd-input
            label="旧密码:"
            label-width="100px"
            type="text"
            v-model="model.oldPwd"
            placeholder="请输入旧密码"
            :rules="rules.oldPwd"
            prop="oldPwd"
            custom-input-class="custom-input-right"
            showPassword
          />
          <wd-input
            label="新密码:"
            label-width="100px"
            type="text"
            v-model="model.newPwd"
            placeholder="请输入新密码"
            :rules="rules.newPwd"
            prop="newPwd"
            custom-input-class="custom-input-right"
            showPassword
          />
          <wd-input
            label="确认密码:"
            label-width="100px"
            type="text"
            v-model="model.newPwdTwo"
            placeholder="请输入确认密码"
            :rules="rules.newPwdTwo"
            prop="newPwdTwo"
            custom-input-class="custom-input-right"
            showPassword
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
        @click="submitPasswoed(form)"
        block
        :loading="loading"
      >
        提 交
      </wd-button>
    </view>
    <view class="flex justify-center mt-10px">
      <wd-button type="text" @click="Passreset">服务密码重置</wd-button>
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
