<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      defaultTitle: '',
      titlePenetrate: 'NO',
      backButtonIcon: null,
    },
  },
}
</route>

<script lang="ts" setup>
import { applyForAfterSalesService } from '@/service/api/aftersalesservice'
import { routeTo } from '@/utils'
import { useForm } from 'alova/client'
import { omit } from 'lodash-es'
import { useToast } from 'wot-design-uni'
import SelectPicker from '../components/selectPicker.vue'
import { refundReListList } from '../dict'

const toast = useToast()
interface Model {
  reason: string
  userPhone: string
}

const form = ref()
const pickerShow = ref(false)
const handleSelect = () => {
  pickerShow.value = true
}
const confirmSelect = (val) => {
  model.value.reason = val.label
  model.value.reasonCode = val.label
}
const {
  // 提交状态
  loading: submiting,
  form: model,
  send: formSubmit,
} = useForm(
  (formData) => {
    const params = omit(formData, ['reason'])
    return applyForAfterSalesService(params)
  },
  {
    initialForm: {
      reason: '',
      reasonCode: '',
      userPhone: '',
      orderId: '',
    },
    resetAfterSubmiting: true,
  },
)
const submit = () => {
  if (!model.value.reasonCode) {
    toast.show('请选择退款原因!')
    return
  }
  form.value.validate().then(({ valid }) => {
    if (valid) {
      routeTo({
        url: '/pages-sub/AfterSalesService/ReturnForm/index',
        data: {
          orderId: model.value.orderId,
          reason: model.value.reason,
          reasonCode: model.value.reasonCode,
          userPhone: model.value.userPhone,
        },
      })
    }
  })
}
onLoad(({ orderId }) => {
  model.value.orderId = orderId
})
</script>

<template>
  <dy-content customClassCenter="bg-#f5f5f5 p-15px">
    <template #top>
      <dy-navbar leftTitle="申请售后" left></dy-navbar>
    </template>
    <view class="rounded-10px overflow-hidden">
      <wd-form ref="form" :model="model" errorType="toast">
        <wd-cell-group border>
          <wd-cell
            title="退款原因"
            required
            is-link
            @click="handleSelect"
            custom-value-class="w-200px!"
          >
            <view v-if="model.reason">
              {{ model.reason }}
            </view>
            <view v-else class="color-#bfbfbf">请选择退款原因</view>
          </wd-cell>
          <view></view>
          <wd-input
            label="联系方式"
            label-width="100px"
            prop="userPhone"
            v-model="model.userPhone"
            placeholder="请输入联系方式"
            align-right
            :rules="[
              { required: true, message: '请填写联系方式' },
              {
                required: true,
                pattern: /^1[3456789]\d{9}$/,
                message: '请输入正确的手机号',
              },
            ]"
          />
        </wd-cell-group>
      </wd-form>
      <Select-Picker
        title="退款原因"
        v-model:pickerShow="pickerShow"
        confirmButtonText="确认选择"
        :columns="refundReListList"
        @confirm="confirmSelect"
      ></Select-Picker>
    </view>
    <template #bottom>
      <view class="px-15px py-20px bg-white">
        <wd-button
          block
          :round="false"
          type="error"
          @click="submit"
          :loading="submiting"
          custom-class="bg-#F44D24!  color-#FFF!"
        >
          申请售后
        </wd-button>
      </view>
    </template>
  </dy-content>
</template>

<style lang="scss" scoped>
//
</style>
