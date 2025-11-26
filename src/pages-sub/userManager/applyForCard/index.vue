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
import { isValidAddress, isValidChinaID, routeTo, isUnder18 } from '@/utils'

import { sendApplyForCard } from '@/service/api/userMessage'

import { useUserStore } from '@/store'
import { NAVIGATE_TYPE } from '@/enums/routerEnum'

const courseList: any = ref([])
const courseNameList: any = ref([])
const message = useMessage()
const shangpinID = ref()

const toast = useToast()
const navTitle = ref('')
const loading = ref(false)

const socTitle = ref(
  'https://oss.xay.xacloudy.cn/images/2025-09/4f60bf89-baad-4945-aa2f-2df966c90adetitles.png',
)
const socIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-09/7d9b03d7-be8e-41db-9c9c-9921ac31309ebgs.png',
)
const socBanner = ref(
  'https://oss.xay.xacloudy.cn/images/2025-09/cc83c063-158d-4341-a838-d60e2ae9cce7bgicon.png',
)
const tabIndex = ref(0)
const formSchool = ref(null)
const disabled = ref(true)
const { userInfo } = useUserStore()
// 报名信息提交
const modelOther = ref({
  name: '',
  IDcode: '',
})
const rulesOther = {
  name: [
    { required: true, message: '请输入学生姓名' },
    {
      pattern: /^(?:[\u4e00-\u9fa5]{2,20}|[\u4e00-\u9fa5]+·[\u4e00-\u9fa5]+)$/,
      message: '请输入正确的姓名',
      trigger: 'blur',
    },
  ],
  IDcode: [
    { required: true, message: '请输入学生身份证号码' },
    {
      required: true,
      message: '请输入正确的身份证号码',
      validator: (val) => {
        if (!isValidChinaID(val)) {
          return Promise.reject(new Error('请输入正确的身份证号码'))
        } else {
          return Promise.resolve()
        }
      },
    },
  ],
}
const submit = async () => {
  const { valid } = await formSchool.value.validate()
  // const valid = true
  if (valid) {
    if (isUnder18(modelOther.value.IDcode)) {
      try {
        const resDate: any = await sendApplyForCard({
          type: '1', // 1-小程序 2-录入
          userId: userInfo.userDId,
          userName: userInfo.cardName,
          userPhone: userInfo.userPhone,
          studentCardId: modelOther.value.IDcode,
          studentName: modelOther.value.name,
        })

        console.log(resDate, 'resDate')

        if (resDate.data && resDate.data.code === 200) {
          routeTo({
            navType: NAVIGATE_TYPE.REDIRECT_TO,
            url: '/pages-sub/homeManager/shopInfo?id=' + shangpinID.value,
          })
        } else if (resDate.data.msg && resDate.data.code === 544) {
          message
            .alert({
              msg: resDate.data.msg,
              confirmButtonText: '立即办理',
            })
            .then(() => {
              routeTo({
                navType: NAVIGATE_TYPE.REDIRECT_TO,
                url: '/pages-sub/serveMain/cardApplyType',
                data: { base: 'shebaoksl', title: '社保卡申领' },
              })
            })
            .catch(() => {
              console.log('点击了取消按钮')
            })
        } else {
          message.alert(resDate.data.msg)
        }
      } catch (error) {
        console.log(error, 'error')
      }
    } else {
      message.alert('该学生年龄不符合规则,请确认!')
    }
  }
}

const goList = () => {
  routeTo({
    url: '/pages-sub/userManager/applyForCard/list',
  })
}
onShow(() => {
  // shangpinID.value = '1350790'

  // '正式环境------------1230803'
  shangpinID.value = '1230803'
  // '正式环境------------1230803'
})

onLoad(async (options) => {
  uni.showLoading({
    title: '加载中',
  })
  loading.value = true
  // await getCourseList()
  // navTitle.value = options.title?decodeURIComponent(options.title):''
  // modelOther.value.courseUser = userInfo.cardName
  // modelOther.value.phone = userInfo.userPhone
  // modelOther.value.sex = getSex()
  // modelOther.value.age = calculateAgeByIdCard(userInfo.idCardNumber)
  loading.value = false
  uni.hideLoading()
})
</script>

<template>
  <view class="h-100vh FStc box-border pt-40rpx dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <view class="flex justify-between items-center pl-45rpx pr-40rpx">
      <img :src="socTitle" alt="" class="w-182px h-97px" />
      <img :src="socBanner" alt="" class="w-150px h-150px" />
    </view>
    <view
      class="bg-#fff F1 w-100vw"
      v-if="!loading"
      style="position: relative; border-radius: 10px 10px 0 0"
    >
      <view class="pt-0rpx pr-30rpx pl-30rpx pb-30rpx h-100%" style="box-sizing: border-box">
        <view class="contit">信息采集</view>

        <wd-form ref="formSchool" :model="modelOther">
          <wd-cell-group border>
            <wd-input
              label="学生姓名"
              label-width="100px"
              type="text"
              v-model="modelOther.name"
              placeholder="请输入学生姓名"
              :rules="rulesOther.name"
              prop="name"
              custom-input-class="custom-input-right"
              :maxlength="10"
            />
            <wd-input
              label="学生身份证号"
              label-width="100px"
              v-model="modelOther.IDcode"
              placeholder="请输入学生身份证号"
              :rules="rulesOther.IDcode"
              prop="IDcode"
              custom-input-class="custom-input-right"
            />
          </wd-cell-group>
        </wd-form>
        <view
          style="
            position: absolute;
            bottom: 20px;
            box-sizing: border-box;
            width: calc(100% - 60rpx);
          "
        >
          <wd-button :round="false" block @click="submit" custom-class="mb-10px">
            领取权益
          </wd-button>
          <wd-button :round="false" type="text" block @click="goList">领取记录查询</wd-button>
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

.bottomBtuGroupBox {
  width: 100%;
}

:deep(.signBtu) {
  width: 90%;
  height: 36px;
  margin-bottom: 10px;
  line-height: 36px;
  color: #fff;
  text-align: center;
  background: #2d69ef;
  border: 1px solid #c7d9ff;
  border-radius: 5px;

  .wd-button__text {
    display: flex;
    align-items: center;
    color: #fff;
  }
}

.sBtu {
  width: 90%;
  height: 36px;
  line-height: 36px;
  color: #2d69ef;
  text-align: center;
  background: transparent;
  border: 1px solid #c7d9ff;
  border-radius: 5px;
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

.contit {
  width: 127px;
  height: 32px;
  margin: 0 auto 20px auto;
  font-size: 16px;
  font-weight: 600;
  line-height: 32px;
  color: #000000;
  text-align: center;
  background: #d1e8ff;
  border-radius: 0px 0px 14px 14px;
  //position: absolute;
  //top: 0;
  //left: 50%;
  //transform: translateX(-50%);
}
</style>
