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
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { applyForAfterSalesService } from '@/service/api/aftersalesservice'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { useForm } from 'alova/client'
// import { omit } from 'lodash-es'
import { omit } from 'lodash'
import { storeToRefs } from 'pinia'
import { useToast } from 'wot-design-uni'
import SelectPicker from '../components/selectPicker.vue'
import { refundReListList } from '../dict'
const { userInfo } = storeToRefs(useUserStore())
const form = ref()
const toast = useToast()
const pickerShow = ref(false)
const handleSelect = () => {
  pickerShow.value = true
}

const {
  loading: submiting,
  form: model,
  send: formSubmit,
} = useForm(
  (formData) => {
    const params = omit(formData, ['reasonCode'])
    return applyForAfterSalesService(params)
  },
  {
    initialForm: {
      refundReason: '',
      reasonCode: '',
      userPhone: userInfo.value.userPhone,
      refundDescription: '',
      refundVoucher: '',
      orderId: '',
      // afterSalesType: 1,
    },
  },
).onSuccess((res) => {
  toast.show('提交成功!')
  routeTo({
    url: '/pages-sub/AfterSalesService/SalesDetil/index',
    data: {
      orderId: model.value.orderId,
    },
    navType: NAVIGATE_TYPE.REDIRECT_TO,
  })
})
const submit = () => {
  if (!model.value.reasonCode) {
    toast.show('请选择退款原因!')
    return
  }
  // if (!model.value.refundVoucher) {
  //   toast.show('请上传凭证!')
  //   return
  // }
  form.value.validate().then(({ valid }) => {
    if (valid) {
      formSubmit()
    }
  })
}
const confirmSelect = (val) => {
  model.value.refundReason = val.label
  model.value.reasonCode = val.label
}
onLoad((options) => {
  model.value = { ...model.value, ...options }
})
</script>

<template>
  <dy-content customClassCenter="bg-#f5f5f5 p-15px">
    <template #top>
      <dy-navbar leftTitle="填写退货原因" left></dy-navbar>
    </template>
    <view class="rounded-10px overflow-hidden">
      <wd-form ref="form" :model="model" errorType="toast">
        <wd-cell-group border custom-class="py-10px!">
          <wd-cell title="退款原因" required is-link @click="handleSelect">
            <view v-if="model.refundReason">
              {{ model.refundReason }}
            </view>
            <view v-else class="color-#bfbfbf">请选择退款原因</view>
          </wd-cell>
          <wd-cell title="问题描述" required title-width="100%">
            <template #label>
              <view class="">
                <wd-textarea
                  v-model="model.refundDescription"
                  placeholder="请填问题描述"
                  custom-class="px-0!"
                  custom-textarea-container-class="px-10px! py-5px!  rounded-4px bg-#f5f5f5!"
                  :maxlength="120"
                  clearable
                  show-word-limit
                />
              </view>
            </template>
          </wd-cell>
          <wd-cell title="凭证上传" title-width="100%">
            <template #label>
              <view class="py-10px">
                <dy-upload v-model="model.refundVoucher" :limit="9" :multiple="true"></dy-upload>
                <view class="font-size-12px color-#999">
                  支持格式: PNG、JPG, 单个文件不超过10M，最多9张
                </view>
              </view>
            </template>
          </wd-cell>

          <wd-input
            label="联系方式"
            label-width="100px"
            prop="userPhone"
            v-model="model.userPhone"
            placeholder="请输入用户名"
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
    </view>
    <template #bottom>
      <view class="px-15px py-20px bg-white">
        <wd-button block :round="false" type="error" @click="submit" :loading="submiting">
          确认提交
        </wd-button>
      </view>
    </template>
  </dy-content>
  <Select-Picker
    title="退款原因"
    v-model:pickerShow="pickerShow"
    confirmButtonText="确认选择"
    :columns="refundReListList"
    @confirm="confirmSelect"
  ></Select-Picker>
</template>

<style lang="scss" scoped>
//
</style>
