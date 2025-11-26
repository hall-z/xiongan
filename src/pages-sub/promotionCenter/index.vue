<route lang="json5" type="page">
{
  layout: 'default',
  realNameAuthentication: true,
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
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { checkBankPromoterByUserId, saveOrUpdatePromoter } from '@/service/api/system'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { useForm, useRequest } from 'alova/client'
import { useMessage } from 'wot-design-uni'
import PromotionSuccessful from './components/PromotionSuccessful.vue'
import Promotion from './utils/promotion'
import { activationResult, ICheckBankPromoterByUserIdData } from './utils/types'
const message = useMessage()

const { userInfo } = useUserStore()
const { rules } = Promotion()
const title = ref('')
const topbgBase64 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-05/b1520b1e-4139-452b-8787-ddee045cd5bfY4yT1VrZrR7Lc5b449ac46876db734f53a0586c18ec7.png',
)
const topImg = ref(
  'https://oss.xay.xacloudy.cn/images/2025-06/b5dfa0ba-64e7-4c77-af18-3c34dff4f7d7f6e41c13-c5c1-4081-9eb0-ab756ad5ddf5AVhqgxVNGv983aa6a0356e9dbccf33170f0264a9c2a0.png',
) // 'https://oss.xay.xacloudy.cn/images/2025-05/f6e41c13-c5c1-4081-9eb0-ab756ad5ddf5AVhqgxVNGv983aa6a0356e9dbccf33170f0264a9c2a0.png',
const topImg2 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-05/2b743b68-2b68-4fc5-9751-ff6dcb2e529dnV5xyDc43qHY22b4353c724eb63e4a1f3aec10fb9456.png',
)
const form = ref()
const imgType = ref('1')
const successfulRef = ref()
const {
  send: senDcheckBankPromoterByUserId,
  data: checkBankPromoterByUserIdData,
  loading: checkBankPromoterByUserIdLoading,
} = useRequest((data) => checkBankPromoterByUserId<ICheckBankPromoterByUserIdData>(data), {
  immediate: false,
  loading: false,
}).onSuccess((res) => {
  if (res.data?.promoter) {
    goPromotionDetail()
  } else {
    console.log('res.data?.promoter', res.data?.promoter)
  }
})

const {
  send: sendSaveOrUpdatePromoter,
  form: model,
  loading: submitLoading,
} = useForm((data) => saveOrUpdatePromoter<activationResult>(data), {
  immediate: false,
  loading: false,
  resetAfterSubmiting: true,
  initialForm: {
    name: userInfo.cardName,
    phone: userInfo.userPhone,
    userId: userInfo.userDId,
    cardId: userInfo.cardId,
    attribute: checkBankPromoterByUserIdData.value?.apply ? '1' : '2',
  },
}).onSuccess((res) => {
  if (res.data.id) {
    imgType.value = '2'
    // 调用码子接口
    successfulRef.value?.sendUnlimitedQRCodeFun({ id: res.data.id })
  }
})
const submit = async () => {
  const { valid } = await form.value.validate()

  if (valid) {
    sendSaveOrUpdatePromoter()
  }
}
const goPromotionDetail = () => {
  routeTo({
    url: '/pages-sub/promotionCenter/promotionDetail',
    navType: NAVIGATE_TYPE.REDIRECT_TO,
  })
}
onLoad(async (options) => {
  title.value = decodeURIComponent(options.title)
})

onShow(async () => {
  senDcheckBankPromoterByUserId({ id: userInfo.userDId })
})
const showType = computed(() => {
  return !checkBankPromoterByUserIdData.value?.promoter && imgType.value === '1'
})
</script>

<template>
  <template v-if="checkBankPromoterByUserIdLoading || checkBankPromoterByUserIdData?.promoter">
    <view class="flex h-100vh flex-col justify-center items-center"></view>
  </template>

  <template v-else>
    <dy-content
      :customStyle="`background-image: url(${topbgBase64}); background-size: 100% 345px;`"
      customClass="relative bg-no-repeat"
    >
      <template #top>
        <dy-navbar :leftTitle="title" left isNavShow></dy-navbar>
        <view class="pl-8% mt-10px">
          <!--  -->
          <wd-img
            width="90%"
            :height="showType ? '142px' : '90px'"
            :src="showType ? topImg : topImg2"
          />
        </view>
      </template>
      <view class="bg-#fff rounded-t-15px overflow-hidden">
        <view class="flex flex-col px-10px py-20px" v-show="showType">
          <wd-form ref="form" :model="model" errorType="toast">
            <wd-input
              label="姓名"
              :maxlength="11"
              label-width="70px"
              prop="name"
              :rules="rules.name"
              custom-label-class="font-600"
              custom-class="promotInput"
              v-model="model.name"
              placeholder="请输入姓名"
              readonly
              required
            />
            <wd-input
              label="手机号"
              :maxlength="11"
              label-width="70px"
              prop="phone"
              :rules="rules.phone"
              custom-label-class="font-600"
              custom-class="promotInput"
              v-model="model.phone"
              placeholder="请输入手机号"
              readonly
              required
            />
          </wd-form>
          <view class="mt-30px p-10px"></view>
        </view>
        <view v-show="!showType">
          <PromotionSuccessful ref="successfulRef" />
        </view>
      </view>
      <wd-gap bg-color="#FFFFFF" heght="20px"></wd-gap>

      <template #bottom>
        <view class="p-15px bg-#fff">
          <wd-button @click="submit" block :round="false" :loading="submitLoading" v-if="showType">
            确认激活
          </wd-button>
          <wd-button @click="goPromotionDetail" block :round="false" v-else>查看推广中心</wd-button>
        </view>
      </template>
    </dy-content>
  </template>
</template>
<style lang="scss" scoped>
:deep(.wd-input) {
  flex-direction: column;
  .wd-input__body {
    width: 90%;
  }
  .wd-input__value {
    width: 107%;
    padding: 8px;
    margin-top: 10px;
    border: 1px solid #dddddd;
    border-radius: 6px;
  }
}
</style>
