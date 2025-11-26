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
import qs from 'qs'
import { useMessage, useToast } from 'wot-design-uni'
import { calculateAgeByIdCard, routeTo, clearSpace, getBack } from '@/utils'
import { rulesOther, sendSaveCourseRegist, sendCetValByTypeCode } from '../hooks/useSchool'
import { useUserStore } from '@/store'

const courseList: any = ref([])
const courseNameList: any = ref([])
const message = useMessage()
const toast = useToast()
const navTitle = ref('')
const loading = ref(false)

const socTitle = ref(
  'https://oss.xay.xacloudy.cn/images/2025-06/5f31aa95-e5e3-455f-ac84-c54f9125c05abmTitle.png',
)
const socBanner = ref(
  'https://oss.xay.xacloudy.cn/images/2025-06/c3b7da19-5c41-4180-8f0b-f354d6acbb1fbmBanner.png',
)
const socIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-06/f439098d-ecb6-4355-a701-d5a6c91b47bdicon.png',
)
const tabIndex = ref(0)
const formSchool = ref(null)
const disabled = ref(true)
const { userInfo } = useUserStore()
// 报名信息提交
const modelOther = ref({
  courseTitle: '',
  courseUser: '',
  phone: '',
  age: null,
  sex: '',
  address: '',
  remark: '',
  createUserName: userInfo.cardName,
  createUserId: userInfo.userDId,
  registType: '1',
})
// 处理手机号码空格字符
const checkPhoneNum = ({ value }, model, attr) => {
  if (value) {
    model[attr] = clearSpace(value)
  }
}
function getSex() {
  let sex = ''
  if (userInfo) {
    if (userInfo.idCardNumber) {
      sex = Number(userInfo.idCardNumber.substring(16, 17)) % 2 === 1 ? '1' : '2'
    } else {
      sex = ''
    }
  } else {
    sex = ''
  }
  return sex
}
const tabChange = (index) => {
  tabIndex.value = index
  modelOther.value.courseTitle = ''
  modelOther.value.address = ''
  modelOther.value.remark = ''
  if (index === 0) {
    disabled.value = true
    modelOther.value.registType = '1'
    modelOther.value.courseUser = userInfo.cardName
    modelOther.value.phone = userInfo.userPhone
    modelOther.value.sex = getSex()
    modelOther.value.age = calculateAgeByIdCard(userInfo.idCardNumber)
  } else {
    disabled.value = false
    modelOther.value.courseUser = ''
    modelOther.value.phone = ''
    modelOther.value.sex = ''
    modelOther.value.age = null
    modelOther.value.registType = '2'
  }
}
const submitSchoolSign = async () => {
  if (modelOther.value.sex === '') {
    toast.show('请选择性别！')
    return false
  }
  if (modelOther.value.courseUser === userInfo.cardName && modelOther.value.registType === '2') {
    toast.show('请使用个人报名！')
    return false
  }
  const { valid } = await formSchool.value.validate()
  if (valid) {
    try {
      const resDate = await sendSaveCourseRegist(modelOther.value)
      if (resDate) {
        toast.show('报名成功！')
        modelOther.value.address = ''
        modelOther.value.courseTitle = ''
        modelOther.value.remark = ''
        if (modelOther.value.registType === '1') {
          disabled.value = true
          modelOther.value.courseUser = userInfo.cardName
          modelOther.value.phone = userInfo.userPhone
          modelOther.value.sex = getSex()
          modelOther.value.age = calculateAgeByIdCard(userInfo.idCardNumber)
        } else {
          disabled.value = false
          modelOther.value.courseUser = ''
          modelOther.value.phone = ''
          modelOther.value.sex = ''
          modelOther.value.age = null
        }
      }
    } catch (error) {
      toast.show('报名失败！')
    }
  } else {
    return false
  }
}
const getCourseList = async () => {
  try {
    const resDate: any = await sendCetValByTypeCode({ sysConfigTypeCode: 'courseRegist' })
    courseList.value = []
    courseNameList.value = []
    if (resDate && resDate.length > 0) {
      resDate.forEach((v) => {
        courseList.value.push(v.sysConfigValCode)
        courseNameList.value.push(v.sysConfigValName)
      })
    }
  } catch (error) {
    courseList.value = []
    courseNameList.value = []
  }
}

function handleConfirm({ value }) {
  modelOther.value.courseTitle = value
}

const goBack = () => {
  getBack()
}
const goCourseList = () => {
  routeTo({
    url: '/pages-sub/userManager/nightSchoolSign/courseList',
    data: { registType: modelOther.value.registType },
  })
}
onLoad(async (options) => {
  uni.showLoading({
    title: '加载中',
  })
  loading.value = true
  await getCourseList()
  navTitle.value = decodeURIComponent(options.title)
  modelOther.value.courseUser = userInfo.cardName
  modelOther.value.phone = userInfo.userPhone
  modelOther.value.sex = getSex()
  modelOther.value.age = calculateAgeByIdCard(userInfo.idCardNumber)
  loading.value = false
  uni.hideLoading()
})
</script>

<template>
  <view class="h-100vh box-border pt-40rpx dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <view class="flex justify-between items-center pl-45rpx pr-40rpx">
      <img :src="socTitle" alt="" class="w-182px h-72px" />
      <img :src="socBanner" alt="" class="w-150px h-122px" />
    </view>
    <view class="bg-#fff" style="min-height: 67%" v-if="!loading">
      <view
        class="flex box-border pos-relative h-107rpx pt-27rpx tab-bg"
        :class="{ right: tabIndex == 1 }"
      >
        <text
          class="w-50% h-42rpx lh-42rpx bg-transparent text-center font-size-30rpx color-#718191"
          :class="{ active: tabIndex == 0 }"
          @click="tabChange(0)"
        >
          个人报名
        </text>
        <text
          class="w-50% h-42rpx lh-42rpx bg-transparent text-center font-size-30rpx color-#718191"
          :class="{ active: tabIndex == 1 }"
          @click="tabChange(1)"
        >
          代他人报名
        </text>
        <view class="absolute bottom-5rpx w-42rpx h-10rpx bg-#2d69ef rounded-10rpx tab-line"></view>
      </view>
      <view class="pt-30rpx pr-40rpx pl-30rpx pb-120rpx">
        <wd-form ref="formSchool" :model="modelOther">
          <wd-cell-group border>
            <wd-picker
              :columns="courseNameList"
              label="课程名称"
              v-model="modelOther.courseTitle"
              :rules="rulesOther.courseTitle"
              prop="courseTitle"
              custom-value-class="custom-input-right"
              @confirm="handleConfirm"
            />
            <wd-input
              label="姓名"
              label-width="100px"
              type="text"
              v-model="modelOther.courseUser"
              placeholder="请输入姓名"
              :rules="rulesOther.courseUser"
              prop="courseUser"
              custom-input-class="custom-input-right"
              :maxlength="10"
              :readonly="disabled"
            />
            <wd-input
              label="手机号"
              label-width="100px"
              type="number"
              v-model="modelOther.phone"
              placeholder="请输入手机号"
              :rules="rulesOther.phone"
              prop="phone"
              custom-input-class="custom-input-right"
              :maxlength="11"
              @blur="checkPhoneNum($event, modelOther, 'phone')"
            />
            <wd-input
              label="年龄"
              label-width="100px"
              type="number"
              v-model="modelOther.age"
              placeholder="请输入年龄"
              :rules="rulesOther.age"
              prop="age"
              custom-input-class="custom-input-right"
              :maxlength="3"
              :readonly="disabled"
            />
            <view class="formLine">
              <view class="formLabel">性别</view>
              <wd-radio-group v-model="modelOther.sex" shape="dot" inline :disabled="disabled">
                <wd-radio value="1">男</wd-radio>
                <wd-radio value="2">女</wd-radio>
              </wd-radio-group>
            </view>
            <wd-input
              label="住址"
              label-width="100px"
              type="text"
              v-model="modelOther.address"
              placeholder="请输入住址"
              :rules="rulesOther.address"
              prop="address"
              custom-input-class="custom-input-right"
              :maxlength="20"
            />
            <view class="remarkLabel">备注</view>
            <wd-textarea
              clear-trigger="focus"
              placeholder="请输入备注内容"
              v-model="modelOther.remark"
              :maxlength="50"
              clearable
              show-word-limit
            />
          </wd-cell-group>
        </wd-form>
      </view>
      <view class="pt-30rpx pr-30rpx pb-30rpx pl-30rpx bottomBtuGroupBox">
        <view class="flex justify-around items-center">
          <wd-button :round="false" block custom-class="signBtu" @click="goCourseList">
            <img :src="socIcon" alt="" class="w-16px h-17px" />
            {{ modelOther.registType === '1' ? '查看个人报名信息' : '查看代他人报名信息' }}
          </wd-button>
          <wd-button :round="false" block custom-class="sBtu" @click="submitSchoolSign">
            提交
          </wd-button>
          <wd-button :round="false" block type="info" custom-class="sBtu" @click="goBack">
            返回
          </wd-button>
        </view>
      </view>
    </view>
  </view>
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
  background: url('https://oss.xay.xacloudy.cn/images/2025-07/7db258ac-cf96-4b19-b381-9c9c7231e615soc_tab_left.png')
    0 0 no-repeat;
  background-size: 100% 100%;
}

.tab-bg.right {
  background-image: url('https://oss.xay.xacloudy.cn/images/2025-07/eca68184-5cfe-407b-9ee8-acb50fe479e9soc_tab_right.png');
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
.bottomBtuGroupBox {
  position: fixed;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background: #fff;
  box-shadow: 0px 0px 20px 1px rgba(232, 232, 232, 1);
}

:deep(.signBtu) {
  color: #2d69ef !important;
  background-color: #eff4ff !important;
  border: 1px solid #c7d9ff;

  .wd-button__text {
    display: flex;
    align-items: center;
  }
}

.sBtu {
  width: 65px !important;
}

:deep(.wd-button) {
  min-width: 65px !important;
}

.formLine {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;

  ::after {
    position: absolute;
    top: 0;
    left: var(--wot-input-cell-padding, 10px);
    display: block;
    width: calc(100% - var(--wot-input-cell-padding, 10px));
    height: 1px;
    content: '';
    background: rgba(232, 232, 232, 0.2);
    transform: scaleY(0.5);
  }

  .formLabel {
    position: relative;
    padding-left: 12px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);

    &:before {
      position: absolute;
      top: 50%;
      left: 0;
      display: inline-block;
      font-size: 18px;
      color: #fa4350;
      content: '*';
      transform: translateY(-50%);
    }
  }
}

.remarkLabel {
  position: relative;
  display: flex;
  padding-top: 10px;
  padding-left: 9px;
  margin-left: 11px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  border-top: 1px solid rgba(232, 232, 232, 0.5);
}

:deep(.wd-textarea) {
  height: 100px !important;
}

:deep(.wd-textarea__value) {
  height: 100px !important;
  padding: 10px 15px;
  border: #d6d6d6 solid 1px;
  border-radius: 6px;

  .wd-textarea__count {
    right: 15px;
  }

  .wd-textarea__inner {
    height: 100px !important;
    padding: 10px;
  }
}
:deep(.is-checked.is-disabled) {
  .wd-radio__shape {
    background: var(--wot-radio-dot-disabled-bg, #2d69ef) !important;
    border-color: var(--wot-radio-dot-disabled-border, #2d69ef) !important;
  }
}
:deep(.is-disabled) {
  .wd-radio__shape {
    background: var(--wot-radio-dot-disabled-bg, #fff) !important;
    border-color: var(--wot-radio-dot-disabled-border, #d9d9d9) !important;
  }
}
</style>
