<route lang="json5" type="page">
{
  layout: 'default',
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
import { updateNickAndAvatar } from '@/service/api/userMessage'
import anvter1 from '@/static/images/mine/anvter1.png'
import { useUserStore } from '@/store/user'
import { useForm } from 'alova/client'
import { storeToRefs } from 'pinia'
import { useToast } from 'wot-design-uni'
import caeama from '../static/images/caeama.png'

const toast = useToast()

const { userInfo } = storeToRefs(useUserStore())
const authStore = useUserStore()

const title = ref('个人信息')
const rules = {
  username: [{ required: true, message: '请输入昵称' }],
}
const avatarArr = ref(userInfo.value.userAvatar ?? anvter1)
const validator = (str) => {
  const regex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/

  return regex.test(str)
}

const lastStr = (file: any) => {
  model.value.userAvatar = file.url
}

const {
  loading,
  data: useInfoData,
  send: sendUseInfo,
  form: model,
} = useForm((formData) => updateNickAndAvatar(formData), {
  immediate: false,
  loading: false,
  // 初始化表单数据
  initialForm: {
    userName: userInfo.value.userName,
    userPhone: userInfo.value.userPhone,
    userAvatar: userInfo.value.userAvatar,
  },
})

const show = ref(false)
const footerBtns = ref([
  {
    text: '取消',
    type: 'info',
    size: 'medium',
    round: false,
    plain: true,
    index: 0,
    customClass: 'custom-class-mine-dyinfo',
  },
  {
    text: '保存',
    type: 'primary',
    size: 'medium',
    round: false,
    index: 1,
    customClass: '',
  },
])

const submit = async () => {
  try {
    const data: any = await sendUseInfo()
    show.value = false
    authStore.setUserInfo({ ...userInfo.value, ...data })
    avatarArr.value = data.userAvatar
  } catch (error) {
    console.log('🍉[error]:', error)
  }
}

const btnClick = async (item: any) => {
  if (item.index === 0) {
    show.value = false
    model.value.userName = userInfo.value.userName
  } else if (model.value.userName.length <= 0) {
    toast.show('请输入昵称!')
  } else {
    if (!validator(model.value.userName)) {
      toast.show('昵称不合法!')
    } else {
      // 提交数据
      submit()
    }
  }
}
</script>

<template>
  <view class="h-100vh bg-#F6F6F6">
    <dy-navbar :leftTitle="title" left isNavShow color="#000"></dy-navbar>

    <view class="px-15px">
      <view class="my-10px">
        <view class="rounded-8px my-10px">
          <view class="flex justify-center my-30px">
            <view class="bg-#fff relative rounded-full w-80px">
              <dy-upload
                v-model="avatarArr"
                :limit="20"
                :showFileList="true"
                @last="lastStr"
                @success="submit"
                :defaultAttrs="{
                  btn: true,
                  preview: true,
                  customClass: 'custom-class-upload',
                  customPreviewClass: 'custom-preview-class',
                }"
                :showFileDy="true"
              >
                <template #default>
                  <view class="absolute bottom-0 right-0">
                    <wd-img :width="27" :height="27" :src="caeama" />
                  </view>
                </template>
                <template #preview="{ index }">
                  <view v-if="index === 0">
                    <wd-img
                      :width="80"
                      :height="80"
                      :src="avatarArr"
                      round
                      :enable-preview="true"
                    />
                  </view>
                </template>
              </dy-upload>
            </view>
          </view>

          <wd-cell-group border>
            <wd-cell title="昵称" :value="model.userName" is-link @click="show = true" />
            <wd-cell title="账号" :value="model.userPhone" />
          </wd-cell-group>
        </view>
      </view>
    </view>

    <wd-popup
      v-model="show"
      custom-class="custom-class-popup"
      lock-scroll
      position="bottom"
      :safe-area-inset-bottom="true"
      :z-index="100"
      :close-on-click-modal="true"
    >
      <view class="rounded-t-10px overflow-hidden">
        <view class="py-10px px-20px bg-#fff py-20px">
          <view class="text-18px font-600">修改昵称</view>
          <view class="bg-#F2F3F7 px-10px py-5px my-10px">
            <wd-input
              type="text"
              v-model.trim="model.userName"
              :maxlength="10"
              clearable
              placeholder="请输入昵称"
              no-border
              custom-class="custom-input-class"
              :cursorSpacing="10"
              :rules="rules.username"
              prop="username"
            />
          </view>
          <view class="mt-10px mb-40px">
            <wd-icon name="info-circle" size="14px" color="#999"></wd-icon>
            <text class="color-#999 text-14px pl-5px">请设置在10个字以内，不可使用符号和表情</text>
          </view>
          <view>
            <view class="flex gap-15px mt-20px">
              <view class="flex-1" v-for="(item, index) in footerBtns" :key="index">
                <wd-button
                  :round="item.round"
                  :type="item.type"
                  block
                  @click="btnClick(item)"
                  :customClass="item!.customClass"
                >
                  {{ item.text }}
                </wd-button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<style lang="scss" scoped>
:deep(.wd-upload__close),
:deep(.wd-upload__status-content) {
  @apply hidden!;
}

:deep(.custom-class-upload) {
  @apply rounded-full! bg-#fff! wh-100%!;
}

:deep(.custom-preview-class:not(:first-child)) {
  @apply hidden!;
}

:deep(.custom-class-popup) {
  @apply overflow-hidden! rounded-t-20px;
}

:deep(.custom-input-class) {
  @apply bg-transparent!;
}
</style>
