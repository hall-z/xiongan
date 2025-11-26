import { reason } from '../../serveMain/types/dict';
<script lang="ts" setup>
import { getPostList } from '@/service/api/shop'
import { useRequest } from 'alova/client'
import SelectPicker from '../components/selectPicker.vue'
interface LogisticsData {
  deliveryId: string
  createTime: number
  bizId: string
  id: number
  label: string
  value: string
}
const emit = defineEmits<{
  (e: 'confirm', value: any): void
  (e: 'update:disabled', value: boolean): boolean
}>()
const props = defineProps({
  title: {
    type: String,
    default: '填写物流单号',
  },
})
const model = reactive<{
  expressNumber: string
  expressCompany: string
  expressCompanyCode: string
}>({
  expressNumber: '',
  expressCompany: '',
  expressCompanyCode: '',
})
const { data: columnsData } = useRequest(() => getPostList<LogisticsData[]>(), {
  immediate: true,
  loading: false,
  async middleware(ctx, next) {
    const result = (await next()) as LogisticsData[]
    result.forEach((item) => {
      item.label = item.deliveryId
      item.value = item.bizId
    })
    return result
  },
})
const pickerShow = ref(false)
const confirmSelect = (e: any) => {
  console.log(e)
  model.expressCompany = e.label
  model.expressCompanyCode = e.value
}
const handleSelect = () => {
  pickerShow.value = true
}
watchEffect(() => {
  if (model.expressNumber && model.expressCompany) {
    emit('update:disabled', false)
  } else {
    emit('update:disabled', true)
  }
})
const form = ref(null)
const handleSubmit = () => {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        console.log('🥘')
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
defineExpose({
  handleSubmit,
  model,
})
</script>

<template>
  <view class="bg-#fff rounded-10px overflow-hidden px-15px py-10px">
    <view class="font-size-16px mb-5px color-#333 font-600">
      {{ props.title }}
    </view>
    <view class="py-10px">
      <wd-form ref="form" :model="model">
        <wd-input
          prop="expressNumber"
          clearable
          v-model="model.expressNumber"
          placeholder="请输入物流单号"
          no-border
          custom-class="bg-#F5F6F8! p-10px!  rounded-10px! mb-12px! "
          :rules="[
            { required: true, message: '请输入物流单号' },
            { required: true, pattern: /^[a-zA-Z0-9]+$/, message: '不允许有特殊字符' },
          ]"
        />
        <wd-input
          prop="expressCompany"
          clearable
          v-model="model.expressCompany"
          placeholder="选择快递公司"
          no-border
          :readonly="true"
          custom-class="bg-#F5F6F8! p-10px!  rounded-10px! "
          :rules="[{ required: true, message: '选择快递公司' }]"
          @click="handleSelect"
        >
          <template #suffix>
            <wd-icon name="arrow-right" size="14px"></wd-icon>
          </template>
        </wd-input>
      </wd-form>
    </view>
  </view>
  <Select-Picker
    title="快递公司"
    v-model:pickerShow="pickerShow"
    confirmButtonText="确认选择"
    :columns="columnsData"
    @confirm="confirmSelect"
  ></Select-Picker>
</template>

<style lang="scss" scoped></style>
