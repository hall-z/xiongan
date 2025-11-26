<route lang="json5">
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
import { addOrUpdateUserBankcard } from '@/service/api/userMessage'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { useForm } from 'alova/client'
import { useMessage, useToast } from 'wot-design-uni/index'
import { bankType, cardType } from './types/dict'
const { sendPhoneCode, countdown, sending } = usePhoneCode(1)
const message = useMessage()
const codeMsgData = ref()

const toast = useToast()
const agree = ref(false)
const { userInfo } = useUserStore()
function handleChange1(e) {
  agree.value = e.value
}

const {
  loading: formLoading,
  send: sendAddOrUpdateUserBankcard,
  form: model,
} = useForm(
  (formData) => {
    console.log(formData)
    const data = {
      ...formData,
      username: formData.username === userInfo.cardNameTm ? userInfo.cardName : formData.username,
      cardCode:
        formData.cardCode === userInfo.idCardNumberTm ? userInfo.idCardNumber : formData.cardCode,
      cardName: userInfo.cardName,
      signMsgMerTranNo: codeMsgData.value?.signMsgMerTranNo,
      bankCode: formData.bankCode.replace(/\s+/g, ''),
    }

    return addOrUpdateUserBankcard(data)
  },
  {
    immediate: false,
    loading: false,
    // 初始化表单数据
    resetAfterSubmiting: true,
    initialForm: {
      username: userInfo.cardNameTm,
      cardCode: userInfo.idCardNumberTm,
      cardType: '1',
      bankType: '1',
      bankCode: '',
      bankPhone: userInfo.userPhone,
      smsCode: '',
    },
  },
)
const rules = ref({
  username: [{ required: true, message: '请填写持卡人姓名' }],
  cardCode: [{ required: true, message: '请填写身份证号' }],
  cardType: [{ required: true, message: '请选择身份证类型' }],
  bankType: [{ required: true, message: '请选择卡类型' }],
  bankCode: [{ required: true, message: '请填写银行卡号' }],
  bankPhone: [{ required: true, message: '请填写银行预留手机号' }],
  smsCode: [{ required: true, message: '请填写验证码' }],
})

function handleAgree() {
  routeTo({
    url: '/pages-sub/webView/index',
    data: { type: '1901454417928921089', showTop: true, title: '快捷支付服务协议' },
  })
}
const form = ref()
async function submitForm() {
  if (!agree.value) {
    message.alert({
      title: '提示',
      msg: '请阅读协议',
    })
    return
  }

  const { valid } = await form.value!.validate()
  if (valid) {
    try {
      const data: any = await sendAddOrUpdateUserBankcard()
      if (data?.code) {
        toast.success(data?.msg || '添加银行卡成功')
        setTimeout(() => {
          uni.navigateBack()
        }, 3000)
      }
    } catch (error) {
      message.alert({
        title: '提示',
        msg: error.data.msg || '添加银行卡失败',
      })
    }
  }
}

async function submitPhoneCode() {
  const keys = Object.keys(model.value).filter((key) => !['smsCode'].includes(key))
  const { valid, errors } = await form.value!.validate(keys)
  if (valid) {
    try {
      const params = {
        accountName:
          model.value.username === userInfo.cardNameTm ? userInfo.cardName : model.value.username,
        certNo:
          model.value.cardCode === userInfo.idCardNumberTm
            ? userInfo.idCardNumber
            : model.value.cardCode,
        mobileNo: model.value.bankPhone,
        accountNo: model.value.bankCode.replace(/\s+/g, ''),
      }
      const res: any = await sendPhoneCode(params)
      if (res) {
        toast.success('发送验证码成功')
        codeMsgData.value = res
      }
    } catch (error) {
      message.alert({
        title: '提示',
        msg: error.data.msg || '银行反馈信息错误！',
      })
    }
  } else {
    console.log('校验不通过', errors)
  }
}
</script>
<template>
  <dy-content customClass="dy-blue-bg px-15px box-border">
    <template #top>
      <dy-navbar leftTitle="添加银行卡" left isNavShow color="#000"></dy-navbar>
    </template>
    <view class="p-15px bg-#fff rounded-4px">
      <wd-form ref="form" :model="model">
        <view class="pb-10px">
          <view class="color-#666 font-size-14px mb-2px px-5px">持卡人</view>
          <view class="py-5px bg-#fff rounded-4px">
            <wd-input
              type="text"
              v-model.trim="model.username"
              placeholder="请输入持卡人姓名"
              :rules="rules.username"
              prop="username"
              custom-class="custom-input"
              clearable
              no-border
            />
          </view>
        </view>
        <view class="pb-10px">
          <view class="color-#666 font-size-14px mb-2px px-5px">身份证类型</view>
          <view class="py-5px bg-#fff rounded-4px">
            <wd-picker
              :columns="cardType"
              v-model.trim="model.cardType"
              :rules="rules.cardType"
              custom-class="bd-1px_#ddd_solid! px-10px py-5px! rounded-4px!"
              prop="cardType"
              no-border
              clearable
              placeholder="请选择身份证类型"
            />
          </view>
        </view>
        <view class="pb-10px">
          <view class="color-#666 font-size-14px mb-2px px-5px">身份证号</view>
          <view class="py-5px bg-#fff rounded-4px">
            <wd-input
              type="text"
              v-model.trim="model.cardCode"
              placeholder="请输入身份证号"
              :rules="rules.cardCode"
              prop="cardCode"
              no-border
              :maxlength="18"
              custom-class="custom-input"
              clearable
            />
          </view>
        </view>
        <view class="pb-10px">
          <view class="color-#666 font-size-14px mb-2px px-5px">卡类型</view>
          <view class="py-5px bg-#fff rounded-4px">
            <wd-radio-group
              v-model.trim="model.bankType"
              shape="dot"
              inline
              custom-class="p-10px flexgap-10px"
              :rules="rules.bankType"
              prop="bankType"
            >
              <wd-radio v-for="item in bankType" :key="item.value" :value="item.value">
                {{ item.label }}
              </wd-radio>
            </wd-radio-group>
          </view>
        </view>
        <view class="pb-10px">
          <view class="color-#666 font-size-14px mb-2px px-5px">银行卡号</view>
          <view class="py-5px bg-#fff rounded-4px">
            <wd-input
              type="text"
              v-model.trim="model.bankCode"
              placeholder="请输入银行卡号"
              :rules="rules.bankCode"
              prop="bankCode"
              no-border
              :maxlength="30"
              custom-class="custom-input"
              clearable
            />
          </view>
        </view>
        <view class="pb-10px">
          <view class="color-#666 font-size-14px mb-2px px-5px">银行预留手机号</view>
          <view class="py-5px bg-#fff rounded-4px">
            <wd-input
              type="text"
              v-model.trim="model.bankPhone"
              placeholder="请输入银行预留手机号"
              :rules="rules.bankPhone"
              prop="bankPhone"
              no-border
              :maxlength="11"
              custom-class="custom-input"
              clearable
            ></wd-input>
          </view>
        </view>
        <view class="pb-10px">
          <view class="color-#666 font-size-14px mb-2px px-5px">验证码</view>
          <view class="py-5px bg-#fff rounded-4px">
            <wd-input
              type="text"
              v-model.trim="model.smsCode"
              placeholder="请输入验证码"
              :rules="rules.smsCode"
              prop="smsCode"
              no-border
              :maxlength="6"
              custom-class="custom-input"
              clearable
            >
              <template #suffix>
                <wd-button
                  size="small"
                  plain
                  custom-class="color-#1890ff! font-size-12px! border-none!"
                  :loading="sending"
                  :disabled="sending || countdown > 0"
                  @click="submitPhoneCode"
                >
                  {{ sending ? '发送中...' : countdown > 0 ? `${countdown}S后获取` : '获取验证码' }}
                </wd-button>
              </template>
            </wd-input>
          </view>
        </view>
        <view class="font-size-10px mt-4">
          <wd-checkbox
            v-model="agree"
            custom-class="flex! justify-start"
            custom-label-class="color-#666! mt-[-2px] font-size-12px!"
            shape="square"
            @change="handleChange1"
          >
            阅读并同意
            <text class="color-#4B78DC" @click.stop="handleAgree">
              《绑定银行账户并开通快捷支付服务协议》
            </text>
          </wd-checkbox>
        </view>
        <view class="px-0 py-20px box-border">
          <wd-button
            block
            :round="false"
            :loading="formLoading"
            @click="submitForm"
            custom-class="bg-#2D69EF"
          >
            添加银行卡
          </wd-button>
        </view>
      </wd-form>
    </view>
  </dy-content>
</template>

<style lang="scss" scoped>
:deep(.wd-input),
.custom-input {
  padding: 5px 10px !important;
  border: 1px solid #ddd !important;
  border-radius: 4px !important;
}
:deep(.wd-picker__cell) {
  @apply p-0!;
}
::v-deep .wd-checkbox__txt {
  white-space: break-spaces !important;
}

::v-deep .wd-checkbox__label {
  flex: 1;
}
</style>
