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
import { clearSpace, dataDesensitization, routeTo } from '@/utils'
import { useMessage, useToast } from 'wot-design-uni'
import {
  MSG_SCRIPT,
  modelOther,
  rulesMe,
  rulesOther,
  sendCertPlanData,
  sendCertRecordData,
} from './hooks/useSocCert'
import { applicantList2 } from './types/dict'
import { useUserStore } from '@/store'
const message = useMessage()
const toast = useToast()

const navTitle = ref('')

const socTitle = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/4817833a-b081-4f87-adc1-d914fba8483egeE5mBLZFAK74fd14c758b42e04d0b2fa92a8ec4837e.png',
)
const socBanner = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/c7c84d3a-b32b-4f0c-95da-26842218bb62g3zNhjst2UeR4c1738002afbc1da29830a8aba8e3442.png',
)
const socEmpty = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/6f214536-2534-4395-9a97-5abffba883d5VUTJl0TKXr3kf40cbd1ae05a14d51afc4b9f1ed14659.png',
)
const { userInfo } = useUserStore()
const modelMe = reactive({
  name: userInfo.cardName,
  nameTm: userInfo.cardNameTm,
  idCardNumber: userInfo.idCardNumber,
  idCardNumberTm: userInfo.idCardNumberTm,
  phoneNumber: userInfo.userPhone,
  phoneNumberTm: dataDesensitization(userInfo.userPhone, false, 'last'),
})
const tabIndex = ref(0)
const formMe = ref(null)
const formOther = ref(null)

const tabChange = (index) => {
  tabIndex.value = index
}

// 处理手机号码空格字符
const checkPhoneNum = ({ value }, model, attr) => {
  if (value) {
    model[attr] = clearSpace(value)
  }
}

const msgBoxEmpty = useMessage('box-empty')

const checkCertPlanData = (data) => {
  console.log('CertData', data)
  if (data.content.length === 0) {
    msgBoxEmpty.alert({
      title: '提示',
      closeOnClickModal: false,
      confirmButtonText: '返回',
      confirmButtonProps: {
        // round: false,
        // block: false,
      },
    })
  } else {
    routeTo({
      url: '/pages-sub/serveMain/socCertPlan',
      data: {
        name: tabIndex.value === 0 ? modelMe.name : modelOther.name,
        idCardNum: tabIndex.value === 0 ? modelMe.idCardNumber : modelOther.idCardNumber,
        type: tabIndex.value,
        phoneNumber: tabIndex.value === 0 ? modelMe.phoneNumber : modelOther.phoneNumber,
        familyRelation: tabIndex.value === 1 ? modelOther.familyRelation : '',
      },
    })
  }
}

const queryCertPlan = async () => {
  const params = {
    pageNo: 0,
    pageSize: 10,
    idcard: '',
    status: '0',
    // status: '1',
  }

  if (tabIndex.value === 0) {
    // 本人认证
    const { valid } = await formMe.value.validate()
    if (valid) {
      params.idcard = modelMe.idCardNumber
    } else {
      return false
    }
  } else {
    // 为他人认证
    const { valid } = await formOther.value.validate()
    if (valid) {
      params.idcard = modelOther.idCardNumber
    } else {
      return false
    }
  }

  sendCertPlanData(params)
    .then((data) => {
      checkCertPlanData(data)
    })
    .catch(() => {
      toast.show(MSG_SCRIPT.fail)
    })
}

const checkCertRecordData = (data) => {
  console.log('CertRecordData', data)
  if (data.content.length === 0) {
    message.alert({
      msg: '未查询到历史记录',
      title: '提示',
      closeOnClickModal: false,
      confirmButtonText: '返回',
    })
  } else {
    routeTo({
      url: '/pages-sub/serveMain/socCertRecord',
      data: {
        name: tabIndex.value === 0 ? modelMe.name : modelOther.name,
        idCardNum: tabIndex.value === 0 ? modelMe.idCardNumber : modelOther.idCardNumber,
      },
    })
  }
}

const queryCertRecord = async () => {
  const params = {
    pageNo: 0,
    pageSize: 10,
    idcard: '',
  }

  if (tabIndex.value === 0) {
    // 本人认证
    const { valid } = await formMe.value.validate()
    if (valid) {
      params.idcard = modelMe.idCardNumber
    } else {
      return false
    }
  } else {
    // 为他人认证
    const { valid } = await formOther.value.validate()
    if (valid) {
      params.idcard = modelOther.idCardNumber
    } else {
      return false
    }
  }

  sendCertRecordData(params)
    .then((data) => {
      checkCertRecordData(data)
    })
    .catch(() => {
      toast.show(MSG_SCRIPT.fail)
    })
}

onLoad((options) => {
  navTitle.value = decodeURIComponent(options.title)
})
</script>

<template>
  <view class="h-100vh box-border pt-40rpx dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <view class="flex justify-between items-center h-211rpx pl-45rpx pr-40rpx">
      <img :src="socTitle" alt="社保待遇资格认证" class="w-427rpx h-134rpx" />
      <img :src="socBanner" alt="社保待遇资格认证" class="w-221rpx h-211rpx" />
    </view>
    <view class="bg-#fff">
      <view
        class="flex box-border pos-relative h-107rpx pt-27rpx tab-bg"
        :class="{ right: tabIndex == 1 }"
      >
        <text
          class="w-50% h-42rpx lh-42rpx bg-transparent text-center font-size-30rpx color-#718191"
          :class="{ active: tabIndex == 0 }"
          @click="tabChange(0)"
        >
          本人认证
        </text>
        <text
          class="w-50% h-42rpx lh-42rpx bg-transparent text-center font-size-30rpx color-#718191"
          :class="{ active: tabIndex == 1 }"
          @click="tabChange(1)"
        >
          为他人认证
        </text>
        <view class="absolute bottom-5rpx w-42rpx h-10rpx bg-#2d69ef rounded-10rpx tab-line"></view>
      </view>
      <view class="pt-10rpx pr-40rpx pl-30rpx" v-if="tabIndex == 0">
        <wd-form ref="formMe" :model="modelMe">
          <wd-cell-group border>
            <wd-input
              label="姓名:"
              label-width="100px"
              type="text"
              v-model="modelMe.nameTm"
              placeholder="请输入姓名"
              prop="name"
              custom-input-class="custom-input-right"
              readonly
            />
            <wd-input
              label="身份证号:"
              label-width="100px"
              type="text"
              v-model="modelMe.idCardNumberTm"
              prop="idCardNumberTm"
              custom-input-class="custom-input-right"
              readonly
            />
            <wd-input
              label="联系电话:"
              label-width="100px"
              type="text"
              v-model="modelMe.phoneNumberTm"
              placeholder="请输入联系电话"
              :rules="rulesMe.phoneNumber"
              prop="phoneNumber"
              custom-input-class="custom-input-right"
              :maxlength="14"
              @blur="checkPhoneNum($event, modelMe, 'phoneNumber')"
            />
          </wd-cell-group>
        </wd-form>
      </view>
      <view class="pt-10rpx pr-40rpx pl-30rpx" v-else>
        <wd-form ref="formOther" :model="modelOther">
          <wd-cell-group border>
            <wd-input
              label="姓名:"
              label-width="100px"
              type="text"
              v-model="modelOther.name"
              placeholder="请输入姓名"
              :rules="rulesOther.name"
              prop="name"
              custom-input-class="custom-input-right"
              :maxlength="20"
            />
            <wd-input
              label="身份证号:"
              label-width="100px"
              type="text"
              v-model="modelOther.idCardNumber"
              placeholder="请输入身份证号"
              :rules="rulesOther.idCardNumber"
              prop="idCardNumber"
              custom-input-class="custom-input-right"
              :maxlength="18"
              :mixlength="16"
            />
            <wd-input
              label="联系电话:"
              label-width="100px"
              type="text"
              v-model="modelOther.phoneNumber"
              placeholder="请输入联系电话"
              :rules="rulesOther.phoneNumber"
              prop="phoneNumber"
              custom-input-class="custom-input-right"
              :maxlength="14"
              @blur="checkPhoneNum($event, modelOther, 'phoneNumber')"
            />
            <wd-picker
              :columns="applicantList2"
              label="与本人关系"
              v-model="modelOther.familyRelation"
              :rules="rulesOther.familyRelation"
              prop="familyRelation"
              custom-value-class="custom-input-right"
            />
          </wd-cell-group>
        </wd-form>
      </view>
      <view class="mt-80rpx pr-40rpx pb-40rpx pl-40rpx">
        <view>
          <wd-button :round="false" block @click="queryCertPlan">查询认证计划</wd-button>
        </view>
        <view class="mt-36rpx">
          <wd-button :round="false" plain block @click="queryCertRecord">查询认证记录</wd-button>
        </view>
      </view>
    </view>
  </view>
  <!-- 无数据弹层 -->
  <wd-message-box selector="box-empty" class="text-center">
    <view class="w-100% pt-50rpx">
      <view class="text-center">
        <img :src="socEmpty" class="w-246rpx h-138rpx" alt="暂无数据" />
      </view>
      <view class="mt-30rpx pb-40rpx lh-46rpx text-center font-size-30rpx color-#000">
        未查询到认证计划，无需认证!
      </view>
    </view>
  </wd-message-box>
</template>

<style lang="scss" scoped>
:deep(.wd-picker__error-message),
:deep(.wd-input__error-message) {
  @apply text-right!;
}
:deep(.custom-input-right) {
  @apply text-right! color-#999999! truncate-1;
}

.tab-bg {
  background: url(./static/images/soc_tab_left.png) 0 0 no-repeat;
  background-size: 100% 100%;
}

.tab-bg.right {
  background-image: url(./static/images/soc_tab_right.png);
}

.tab-line {
  left: calc(25% - 10rpx);
  transition: left 0.5s ease 0s;
}

.right .tab-line {
  left: calc(75% - 10rpx);
}

.active {
  /* stylelint-disable-next-line declaration-property-value-no-unknown */
  font-size: 34rpx;
  font-weight: bold;
  color: #000;
  // background-color: #fff;
}
</style>
