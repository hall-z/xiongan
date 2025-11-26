<script setup lang="ts">
import { changeUploadUrl, rightFileUrl } from '@/utils/file'
import { FilesList, uploadProps } from './types'

defineOptions({
  name: 'dy-upload',
})

const props = defineProps(uploadProps)

onMounted(async () => {
  await initModelValues()
})
// 额外参数
const defaultFormDarta = {
  appId: '',
}

const emit = defineEmits<{
  (e: 'submit', value: any): void
  (e: 'update:modelValue', value: any): string
  (e: 'last', value: any): string // 最后一个数据
  (e: 'success'): void
}>()

const fileList = ref<FilesList[]>([])
const curFileList = ref<FilesList[]>([])

// 初始化文件信息
const initModelValues = () => {
  if (props.modelValue) {
    const arr = Array.isArray(props.modelValue) ? props.modelValue : props.modelValue.split(',')
    let narr = []
    narr = arr.map((item) => {
      return {
        url: rightFileUrl(item),
        name: item,
        meta: { url: item, name: item },
      }
    })

    // 重新解析数据
    if (props.isAes) {
      narr.forEach(async (item) => {
        item.url = await useFilePase(item.name).fileData
      })
      fileList.value = narr
    } else {
      fileList.value = narr
      emit('last', narr[narr.length - 1])
    }
  }
}
// 初始化监听数据
watch(
  () => props.modelValue,
  () => {
    initModelValues()
  },
  { deep: true },
)

const beforeUpload = ({ files, resolve }) => {
  const file = files[0]
  if (file.size / 1024 > props.maxSize) {
    uni.showToast({ title: `文件大小超过${props.maxSize / 1024}MB，请重新上传!`, icon: 'none' })
    resolve(false)
  } else {
    resolve(true)
  }
}

// 上传成功后 返回新的地址
const handleChange = (e: any) => {
  const str = changeUploadUrl(e.fileList, 'data')
  emit('update:modelValue', str)
  emit('success')
}

/* *
 * 构建 formData
 * @param {Object} { file, formData, resolve }
 * @return {Object} formData
 * */
const buildFormData = ({ file, formData, resolve }) => {
  let imageName = file.url.substring(file.url.lastIndexOf('/') + 1) // 从图片路径中截取图片名称
  // #ifdef H5
  // h5端url中不包含扩展名，可以拼接一下name
  imageName = imageName + file.name
  // #endif

  formData = {
    ...formData,
  }

  resolve(formData) // 组装成功后返回 formData，必须返回
}
//    :formData="{ ...defaultFormDarta, ...props.formData }"
</script>
<template>
  <wd-upload
    v-bind="props.defaultAttrs"
    :file-list="fileList"
    :image-mode="props.imageMode"
    :limit="props.limit"
    :multiple="props.multiple"
    :disabled="props.disabled"
    :name="props.name"
    :show-limit-num="props.showFileList"
    :action="props.action"
    :header="props.header"
    @change="handleChange"
    :build-form-data="buildFormData"
    :size-type="['compressed']"
    v-if="props.showFileDy"
  >
    <template #default v-if="props.defaultAttrs.btn">
      <slot></slot>
    </template>
    <template #preview-cover="{ file, index }" v-if="props.defaultAttrs.preview">
      <!-- 小程序拿不到文件 -->
      <slot name="preview" :file="file" :index="index"></slot>
    </template>
  </wd-upload>
  <wd-upload
    v-bind="props.defaultAttrs"
    :file-list="fileList"
    :image-mode="props.imageMode"
    :limit="props.limit"
    :multiple="props.multiple"
    :disabled="props.disabled"
    :name="props.name"
    :show-limit-num="props.showFileList"
    :action="props.action"
    :header="props.header"
    :before-upload="beforeUpload"
    @change="handleChange"
    :size-type="['compressed']"
    :build-form-data="buildFormData"
    v-else
  ></wd-upload>
</template>
<style lang="scss" scoped></style>
