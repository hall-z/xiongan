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
import { addOrUpdateUserBankcard, getUserBankcardList } from '@/service/api/userMessage'
import { changeDict, dataDesensitization, routeTo } from '@/utils'
import { useColPickerData } from '../hooks/useColPickerData'
import { bankType, cardType } from './types/dict'

import { useUserStore } from '@/store'
import { useForm } from 'alova/client'
import { useMessage, useToast } from 'wot-design-uni/index'

const rate = ref<number>(1)
const message2 = useMessage('wd-message-box-slot')

function withSlot() {
  message2.alert({
    title: '示例',
  })
}

const { colPickerData, findChildrenByCode } = useColPickerData()
const todo =
  'https://oss.xay.xacloudy.cn/images/2025-02/449bdcca-8e03-4949-894c-9c4715619215路径-4备份-3@2x.png'

const paging = ref(null)
const dataList = ref<any[]>([])

const value = ref<string[]>([])
const password = ref(false)
const area = ref<any[]>([
  colPickerData.map((item) => {
    return {
      value: item.value,
      label: item.text,
    }
  }),
])

const columnChange = ({ selectedItem, resolve, finish }) => {
  const areaData = findChildrenByCode(colPickerData, selectedItem.value)

  console.log('areaData', areaData[0].value)
  if (areaData && areaData.length && /[0-9]{4}00/.test(areaData[0].value)) {
    resolve(
      areaData.map((item) => {
        return {
          value: item.value,
          label: item.text,
        }
      }),
    )
  } else {
    finish()
  }
}

function handleConfirm({ value }) {
  console.log(value)
}

function toAdd(item) {
  routeTo({
    url: '/pages-sub/userManager/bankCard/addCard',
  })
}

function toDetial(item) {
  routeTo({
    url: '/pages-sub/userManager/bankCard/cardinfo',
    data: { ...item },
  })
}

const isclose = (item, index) => {
  dataList.value[index].iconColse = !dataList.value[index].iconColse
}
const changeData = (item) => {
  return item.map((item) => {
    return {
      ...item,
      iconColse: false,
    }
  })
}
const queryList = async (pageNo, pageSize) => {
  const params = {
    page: pageNo,
    size: pageSize,
  }
  // 调用接口获取数据
  try {
    const res = await getUserBankcardList(params)
    paging.value.complete(changeData(res))
  } catch (error) {
    paging.value.complete(false)
  }
}
onShow(() => {
  paging.value && paging.value.reload()
})

const { sendPhoneCode, countdown, sending } = usePhoneCode(1)

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
      bankCodeTemp: '',
      bankCode: '',
      // bankCode: userInfo.bankCard ? userInfo.bankCard : '',
      bankPhone: '',
      smsCode: '',
    },
  },
)
const rules = ref({
  username: [{ required: true, message: '请填写持卡人姓名' }],
  cardCode: [{ required: true, message: '请填写身份证号' }],
  cardType: [{ required: true, message: '请选择身份证类型' }],
  bankType: [{ required: true, message: '请选择卡类型' }],
  bankCodeTemp: [{ required: true, message: '请填写社保卡银行账户' }],
  bankPhone: [{ required: true, message: '请填写银行预留手机号' }],
  smsCode: [{ required: true, message: '请填写验证码' }],
})

const message = useMessage()

function showbuquan() {
  message
    .confirm({
      msg: '同意授权使用您的姓名、证件号查询您的社保卡银行账户卡号',
      title: '提示',
    })

    .then(() => {
      console.log('点击了确定按钮')
      password.value = true
      buquan()
    })
    .catch(() => {
      console.log('点击了取消按钮')
      password.value = false
    })
}

function handleAgree() {
  routeTo({
    url: '/pages-sub/webView/index',
    data: { type: '1901454417928921089', showTop: true, title: '快捷支付服务协议' },
  })
}

function handleQnA() {
  routeTo({
    url: '/pages-sub/webView/index',
    data: { type: '1901454261309415426', showTop: true, title: '绑定银行账户常见问题' },
  })
}

const form = ref()

function buquan() {
  model.value.bankCodeTemp = userInfo.bankCard.substring(4, userInfo.bankCard.length - 4)
}

async function submitFormDefault() {
  if (!agree.value) {
    message.alert({
      title: '提示',
      msg: '请阅读协议',
    })
    return
  }

  const { valid } = await form.value!.validate()
  if (valid) {
    if (model.value.bankCodeTemp !== userInfo.bankCard.substring(4, userInfo.bankCard.length - 4)) {
      message.alert({
        title: '提示',
        msg: '社保卡银行账户填写有误',
      })
    } else {
      try {
        const prefix = userInfo.bankCard.substring(0, 4)
        const suffix = userInfo.bankCard.substring(
          userInfo.bankCard.length - 4,
          userInfo.bankCard.length,
        )
        model.value.bankCard = prefix + model.value.bankCodeTemp + suffix

        const data: any = await sendAddOrUpdateUserBankcard()
        if (data?.code) {
          toast.success(data?.msg || '添加银行卡成功')
          setTimeout(() => {
            uni.redirectTo({
              url: '/pages-sub/userManager/bankCard/cardsList',
            })
          }, 1000)
        }
      } catch (error) {
        message.alert({
          title: '提示',
          msg: error.data.msg || '添加银行卡失败',
        })
      }
    }
  }
}

async function submitPhoneCode() {
  const keys = Object.keys(model.value).filter((key) => !['smsCode'].includes(key))
  const { valid, errors } = await form.value!.validate(keys)

  if (valid) {
    if (model.value.bankCodeTemp !== userInfo.bankCard.substring(4, userInfo.bankCard.length - 4)) {
      message.alert({
        title: '提示',
        msg: '社保卡银行账户填写有误',
      })
    } else {
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
          msg: '银行预留手机号有误！',
        })
      }
    }
  } else {
    console.log('校验不通过', errors)
  }
}

// 格式化方法
const displayFormat = (selectedItems: Record<string, any>[]) => {
  if (selectedItems.length > 1) {
    return (
      selectedItems[selectedItems.length - 2].label +
      ' - ' +
      selectedItems[selectedItems.length - 1].label
    )
  } else {
    return ''
  }
}
</script>
<template>
  <z-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    :auto-show-system-loading="true"
    class="bg-#f3f4f6"
  >
    <template #top>
      <!-- 顶部 -->
      <dy-navbar leftTitle="银行卡" left isNavShow color="#000"></dy-navbar>
    </template>

    <view class="px-15px pt-10px box-border dy-blue-bg2" v-if="dataList.length !== 0">
      <view class="box-border pos-relative mb-13px">
        <view class="c c4" v-for="item in dataList" :key="item.bankCode" @click="toDetial(item)">
          <view class="line1">
            <view class="logo"></view>
            <view class="name">{{ item.bankName || '银行卡号' }}</view>
            <!-- <view>
              <wd-icon
                name="browse"
                size="16px"
                color="#999"
                @click.stop="isclose(item, index)"
              ></wd-icon>
            </view> -->
          </view>
          <view class="line2">{{ changeDict(bankType, item.bankType) }}</view>
          <view class="line3">
            {{ dataDesensitization(item.bankCode, item.iconColse, 'last') }}
          </view>
        </view>
      </view>
    </view>
    <template #empty>
      <view :class="userInfo.bankCard ? 'F1' : ''">
        <view
          class="flex justify-center flex-col py-35px gap-10px"
          v-if="userInfo.socialCardType === '0' || !userInfo.bankCard"
        >
          <wd-status-tip
            :image="todo"
            :image-size="{
              height: 120,
              width: 240,
            }"
            image-mode="widthFix"
          />
          <view class="tips font-size-16px color-#000 text-center my-8 font-600">
            您还未添加银行卡
          </view>
          <view class="px-0px py-21px box-border">
            <wd-button block :round="false" @click="toAdd" custom-class="bg-#2D69EF">
              添加银行卡
            </wd-button>
          </view>
        </view>
        <view
          class="p-15px w-full box-border"
          style="flex: 1"
          v-if="userInfo.socialCardType === '1' && userInfo.bankCard"
        >
          <view class="p-15px bg-#fff rounded-4px">
            <wd-form ref="form" :model="model">
              <view class="pb-10px">
                <view class="color-#666 font-size-14px mb-2px px-5px">持卡人{{ show }}</view>
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
              <!--            <view class="pb-10px">-->
              <!--              <view class="color-#666 font-size-14px mb-2px px-5px">发卡地</view>-->
              <!--              <view class="py-5px bg-#fff rounded-4px">-->
              <!--                <wd-col-picker label="" v-model="value" :columns="area" :column-change="columnChange" @confirm="handleConfirm" :display-format="displayFormat"></wd-col-picker>-->
              <!--&lt;!&ndash;                <wd-col-picker  v-model="value11" :columns="areaData1" :column-change="columnChange1"   />&ndash;&gt;-->
              <!--              </view>-->
              <!--            </view>-->

              <view class="pb-10px">
                <view class="color-#666 font-size-14px mb-2px px-5px">社保卡银行账户</view>
                <view class="py-5px bg-#fff rounded-4px">
                  <view
                    v-if="password"
                    class="custom-input text-left"
                    style="font-family: UICTFontTextStyleBody; font-size: 14px"
                  >
                    {{
                      '*************' +
                      userInfo.bankCard.substring(
                        userInfo.bankCard.length - 4,
                        userInfo.bankCard.length,
                      )
                    }}
                  </view>

                  <wd-input
                    v-if="!password"
                    v-model.trim="model.bankCodeTemp"
                    placeholder="社保卡银行账户"
                    :rules="rules.bankCodeTemp"
                    prop="bankCodeTemp"
                    no-border
                    :maxlength="10"
                    custom-class="custom-input text-center"
                    custom-input-class=" text-center"
                  >
                    <template #prefix>
                      <view style="font-size: 14px; color: #666">
                        {{ userInfo.bankCard.substring(0, 4) }}
                      </view>
                    </template>
                    <template #suffix>
                      <view class="FHcs">
                        <view
                          style="
                            margin-right: 20px;
                            margin-left: 10px;
                            font-size: 14px;
                            color: #666;
                          "
                        >
                          {{
                            userInfo.bankCard.substring(
                              userInfo.bankCard.length - 4,
                              userInfo.bankCard.length,
                            )
                          }}
                        </view>
                        <view style="margin-right: -10px" class="FHcs">
                          <wd-button size="small" @click="showbuquan">自动补全</wd-button>
                        </view>
                      </view>
                    </template>
                  </wd-input>
                </view>

                <wd-icon name="warning" size="12px" color="#999"></wd-icon>
                <text style="font-size: 12px; color: #999" @click="withSlot">查看示例</text>
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
                        custom-class="color-#1890ff! font-size-12px! border-none! h-24px overflow-hidden"
                        :loading="sending"
                        :disabled="sending || countdown > 0"
                        @click="submitPhoneCode"
                      >
                        {{
                          sending
                            ? '发送中...'
                            : countdown > 0
                              ? `${countdown}S后获取`
                              : '获取验证码'
                        }}
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
                  :disabled="
                    !model.bankPhone ||
                    !model.smsCode ||
                    !model.cardCode ||
                    !model.username ||
                    !agree
                  "
                  @click="submitFormDefault"
                  custom-class="bg-#2D69EF mb-4"
                >
                  下一步
                </wd-button>

                <wd-button block :round="false" @click="toAdd" custom-class="bg-#2D69EF">
                  绑定其他银行卡
                </wd-button>
              </view>

              <view class="font-size-10px mt-4 text-center">
                <text class="color-#4B78DC" @click.stop="handleQnA">常见问题</text>
              </view>
            </wd-form>
          </view>
        </view>
      </view>
    </template>
    <template #bottom v-if="dataList.length !== 0">
      <!-- 底部 -->
      <view class="px-15px py-10px box-border bg-#fff">
        <wd-button block :round="false" @click="toAdd" custom-class="bg-#2D69EF">
          添加银行卡
        </wd-button>
      </view>
    </template>
    <wd-message-box selector="wd-message-box-slot" type="alert">
      <img
        src="https://oss.xay.xacloudy.cn/images/2025-03/ff0bf25d-6742-4e3a-88fe-7a757479f151微信图片_20250319175548.jpg"
        class="shili"
      />
    </wd-message-box>
  </z-paging>
</template>

<style lang="scss" scoped>
:deep(.wd-input),
.custom-input,
:deep(.wd-col-picker__cell) {
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

:deep(.z-paging-content) {
  background: linear-gradient(180deg, #d6eafe 0%, #f3f4f6 40%, #f2f3f7 100%) !important;
}

.brge {
  border-radius: 0px 5px 0px 25px;
}

.line1 {
  display: flex;
  align-items: center;
  justify-content: left;

  .logo {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border: 2px solid #fff;
    border-radius: 100%;
  }

  .name {
    margin-right: 15px;
    font-size: 16px;
    font-weight: 600;
    text-align: left;
  }
}

.line2 {
  padding-left: 22px;
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  line-height: 26px;
  text-align: left;
  text-transform: none;
}

.line3 {
  padding-left: 22px;
  font-size: 20px;
  font-weight: 300;
  line-height: 22px;
  text-align: left;
}

.c {
  position: relative;
  box-sizing: border-box;
  padding: 15px;
  margin-bottom: 15px;

  &:after {
    position: absolute;
    top: 0;
    right: 15px;
    width: 100px;
    height: 100px;
    content: '';
    background-repeat: no-repeat;
    background-position: center right;
    background-size: 60% 60%;

    opacity: 0.1;
  }
}

.c1 {
  position: relative;
  width: 100%;

  background: linear-gradient(134deg, #ffe9e9 0%, #f7f7f7 100%);
  border-radius: 5px 5px 5px 5px;

  &:after {
    background-image: url('./svg/zs.svg');
  }

  .logo {
    background-image: url('./svg/zs.svg');
  }

  .name {
    color: #c7162e;
  }

  .line2 {
    color: #d19ca3;
  }

  .line3 {
    color: #c7162e;
  }
}

.c2 {
  width: 100%;

  background: linear-gradient(134deg, #cce7fe 0%, #f7f7f7 100%);
  border-radius: 5px 5px 5px 5px;

  &:after {
    background-image: url('./svg/js.svg');
  }

  .logo {
    background-image: url('./svg/js.svg');
  }

  .name {
    color: #003a90;
  }

  .line2 {
    color: #527ebe;
  }

  .line3 {
    color: #003a90;
  }
}

.h-24px {
  height: 24px !important;
  line-height: 24px;
}

:deep(.wd-input__suffix) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px !important;
  line-height: 24px;
}

.c3 {
  width: 100%;

  background: linear-gradient(134deg, #cbe8e0 0%, #f7f7f7 100%);
  border-radius: 5px 5px 5px 5px;

  &:after {
    background-image: url('./svg/ny.svg');
  }

  .logo {
    background-image: url('./svg/ny.svg');
  }

  .name {
    color: #2f856d;
  }

  .line2 {
    color: #7bafa1;
  }

  .line3 {
    color: #2f856d;
  }
}

.c4 {
  width: 100%;
  background: linear-gradient(134deg, #cce7fe 0%, #f7f7f7 100%);
  border-radius: 5px 5px 5px 5px;

  &:after {
    background-image: url('../static/images/bank/outher2.png');
  }

  .logo {
    background-image: url('../static/images/bank/outher2.png');
  }

  .name {
    color: #003a90;
  }

  .line2 {
    color: #527ebe;
  }

  .line3 {
    color: #003a90;
  }
}

.shili {
  display: block;
  width: 100%;
  height: 40vw;
  object-fit: cover;
}
</style>
