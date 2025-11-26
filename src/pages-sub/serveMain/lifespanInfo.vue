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
import { clearSpace, routeTo, isUnder16 } from '@/utils'
import { useMessage, useToast } from 'wot-design-uni'
import user from '@/static/images/login/user.png'
import { modelOther, rulesMe, rulesOther, sendtCardExpirationDate } from './hooks/lifespan'
import { applicantList3 } from './types/dict'
import useLogin from '../../pages/login/utils/useLogin'
import { useUserStore } from '@/store'
const { userInfo } = useUserStore()
const modelMe = reactive({
  cardName: userInfo.cardName,
  nameTm: userInfo.cardNameTm,
  cardCode: userInfo.idCardNumber,
  idCardNumberTm: userInfo.idCardNumberTm,
  applyType: '1',
})

const { getCodeUrl } = useLogin()
const message = useMessage()
const toast = useToast()

const navTitle = ref('')

const socTitle = ref(
  'https://oss.xay.xacloudy.cn/images/2025-07/3061138b-22ec-4815-8f27-5d1358d3bfb5yxq.png',
)
const lifesBanner = ref(
  'https://oss.xay.xacloudy.cn/images/2025-07/a2a73a01-ed3b-4905-8207-feba979fdb39gw.png',
)

const tabIndex = ref(0)
const formMe = ref(null)
const formOther = ref(null)

onShow(() => {
  uni.hideLoading()
  getCodeUrl()
})
const tabChange = (index) => {
  tabIndex.value = index
  if (index === 1) {
    modelOther.verifyCode = ''
    getCodeUrl()
  }
}
const getsex1 = (idCard) => {
  // 检查身份证号码长度
  if (!idCard || (idCard.length !== 15 && idCard.length !== 18)) {
    return '身份证号码长度不正确'
  }

  // 获取第17位数字（15位身份证取最后一位，18位身份证取第17位）
  const genderDigit = idCard.length === 15 ? idCard.charAt(14) : idCard.charAt(16)

  // 判断性别
  return parseInt(genderDigit, 10) % 2 === 1 ? '父' : '母'
}

const getsex2 = (idCard) => {
  // 检查身份证号码长度
  if (!idCard || (idCard.length !== 15 && idCard.length !== 18)) {
    return '身份证号码长度不正确'
  }

  // 获取第17位数字（15位身份证取最后一位，18位身份证取第17位）
  const genderDigit = idCard.length === 15 ? idCard.charAt(14) : idCard.charAt(16)

  // 判断性别
  return parseInt(genderDigit, 10) % 2 === 1 ? '子' : '女'
}

const checkCertRecordData = (data) => {
  console.log('CertRecordData', data)

  routeTo({
    url: '/pages-sub/serveMain/lifespanFoundation',
    data: {
      title: '基本信息',
      familyRelation: tabIndex.value === 0 ? '' : modelOther.familyRelation,
      applyType: tabIndex.value === 0 ? '1' : '2',
      expireDate: data.data.expireDate,
      issueDate: data.data.issueDate,
      xaCardType: data.data.xaCardType,
      daysUntilExpiration: data.data.daysUntilExpiration ? data.data.daysUntilExpiration : null,
    },
  })
}

const cardCodeblur = () => {
  if (
    !modelOther.cardCode ||
    (modelOther.cardCode.length !== 15 && modelOther.cardCode.length !== 18)
  ) {
    return ''
  } else {
    const sex1 = getsex1(modelMe.cardCode) === '父' ? '2' : '3'
    const sex2 = getsex2(modelOther.cardCode) === '子' ? '1' : '2'
    return sex1 + sex2
  }
}

const queryCertPlan = async () => {
  const params = {
    cardName: '',
    cardCode: '',
    verifyCode: '',
    UUID: '',
    applyType: '',
  }

  if (tabIndex.value === 0) {
    // 本人认证
    const { valid } = await formMe.value.validate()
    if (valid) {
      params.cardName = modelMe.cardName
      params.cardCode = modelMe.cardCode
      params.applyType = '1'
    } else {
      return false
    }
  } else {
    // 为他人认证
    const { valid } = await formOther.value.validate()
    if (valid) {
      const sex = cardCodeblur(modelOther.cardCode)
      console.log('modelOther---------', modelOther)
      console.log('sex', sex)

      // let a = {"21": "父子", "22": "父女", "31": "母子", "32": "母女", "0": "其他"}
      if (modelOther.familyRelation === '0' || modelOther.familyRelation === sex) {
        if (
          (modelOther.familyRelation !== '0' && isUnder16(modelOther.cardCode)) ||
          modelOther.familyRelation === '0'
        ) {
          params.cardName = modelOther.cardName
          params.cardCode = modelOther.cardCode
          params.verifyCode = modelOther.verifyCode
          params.UUID = modelOther.UUID
          params.applyType = '2'

          uni.showLoading({ title: '处理中' })
        } else {
          // getCodeUrl()
          toast.show('被查询人身份证年龄需小于16岁')
          return false
        }
      } else {
        // getCodeUrl()
        toast.show('请检查亲属关系')
        return false
      }
    } else {
      // getCodeUrl()
      return false
    }
  }

  sendtCardExpirationDate(params)
    .then((data) => {
      console.log('CertData', data)
      modelOther.verifyCode = ''
      checkCertRecordData(data)
    })
    .catch((err) => {
      uni.hideLoading()
      modelOther.verifyCode = ''

      console.log('err', err)
      toast.show(err.data.data)
    })
}

onLoad((options) => {
  navTitle.value = decodeURIComponent(options.title)
})
onMounted(() => {})
</script>

<template>
  <view class="h-100vh box-border dy-blue-deep-bg2">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <view class="flex justify-between items-center h-232rpx pl-45rpx pr-40rpx">
      <img :src="socTitle" alt="社保待遇资格认证" class="w-427rpx h-134rpx" />
      <img :src="lifesBanner" alt="社保待遇资格认证" class="w-300rpx h-232rpx" />
    </view>
    <view class="bg-#fff" style="min-height: 70vh">
      <view
        class="flex box-border pos-relative h-107rpx pt-27rpx tab-bg"
        :class="{ right: tabIndex === 1 }"
      >
        <text
          class="w-50% h-42rpx lh-42rpx bg-transparent text-center font-size-30rpx color-#718191"
          :class="{ active: tabIndex === 0 }"
          @click="tabChange(0)"
        >
          本人查询
        </text>
        <text
          class="w-50% h-42rpx lh-42rpx bg-transparent text-center font-size-30rpx color-#718191"
          :class="{ active: tabIndex === 1 }"
          @click="tabChange(1)"
        >
          代他人查询
        </text>
        <view class="absolute bottom-5rpx w-42rpx h-10rpx bg-#2d69ef rounded-10rpx tab-line"></view>
      </view>
      <view class="pt-10rpx pr-40rpx pl-30rpx" v-if="tabIndex === 0">
        <wd-form ref="formMe" :model="modelMe">
          <wd-cell-group border>
            <wd-input
              label="姓名"
              label-width="100px"
              type="text"
              v-model="modelMe.nameTm"
              placeholder="请输入姓名"
              prop="name"
              custom-input-class="custom-input-right"
              readonly
            />
            <wd-input
              label="身份证号"
              label-width="100px"
              type="text"
              v-model="modelMe.idCardNumberTm"
              prop="idCardNumberTm"
              custom-input-class="custom-input-right"
              readonly
            />
          </wd-cell-group>
        </wd-form>
      </view>
      <view class="pt-10rpx pr-40rpx pl-30rpx" v-else>
        <wd-form ref="formOther" :model="modelOther">
          <wd-cell-group border>
            <wd-input
              label="姓名"
              label-width="100px"
              type="text"
              v-model="modelOther.cardName"
              placeholder="请输入姓名"
              :rules="rulesOther.cardName"
              prop="cardName"
              custom-input-class="custom-input-right"
              :maxlength="20"
            />
            <wd-input
              label="身份证号"
              label-width="100px"
              type="text"
              v-model="modelOther.cardCode"
              placeholder="请输入身份证号"
              :rules="rulesOther.cardCode"
              prop="cardCode"
              custom-input-class="custom-input-right"
              :maxlength="18"
              :mixlength="16"
            />

            <!--            <wd-input-->
            <!--              label="亲属关系"-->
            <!--              label-width="100px"-->
            <!--              type="text"-->
            <!--              v-model="modelOther.familyRelation"-->
            <!--              :rules="rulesOther.familyRelation"-->
            <!--              prop="familyRelation"-->
            <!--              custom-input-class="custom-input-right"-->
            <!--              disabled-->
            <!--            />-->
            <wd-picker
              :columns="applicantList3"
              label="亲属关系"
              v-model="modelOther.familyRelation"
              :rules="rulesOther.familyRelation"
              prop="familyRelation"
              custom-value-class="custom-input-right"
            />

            <wd-input
              label-width="100px"
              type="text"
              v-model="modelOther.verifyCode"
              label="验证码"
              placeholder="请输入图形码"
              :rules="rulesOther.verifyCode"
              prop="verifyCode"
              use-suffix-slot
              custom-class="custom-cell"
              no-border
              clearable
              :maxlength="4"
            >
              <!-- <template #prefix>
                <wd-img :src="user" :width="32" :height="32"></wd-img>
              </template> -->

              <template #suffix>
                <dy-verify />
              </template>
            </wd-input>
          </wd-cell-group>
        </wd-form>
      </view>
      <view class="mt-80rpx pr-40rpx pb-40rpx pl-40rpx botBox">
        <view>
          <wd-button :round="false" block @click="queryCertPlan">查询</wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.custom-cell) {
  align-items: flex-start !important;

  .wd-input__label-inner {
    line-height: 34px;
  }

  .wd-input__label.is-required::after {
    top: 5px !important;
  }
}

:deep(.wd-picker__error-message),
:deep(.wd-input__error-message) {
  @apply text-right !;
}

:deep(.custom-input-right) {
  @apply text-right ! color-#999999 ! truncate-1;
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
  font-size: 34 rpx;
  font-weight: bold;
  color: #000;
  // background-color: #fff;
}

.botBox {
  position: fixed;
  bottom: 20px;
  width: calc(100% - 2.5rem);
}
</style>
