<script lang="ts" setup>
import store, { promotionDateStore, useUserStore } from '@/store'
import { clearSpace } from '@/utils'
import dayjs from 'dayjs'
import qs from 'qs'
import { useMessage } from 'wot-design-uni'
import useCardApply from '../hooks/useCardApply'
import { cardType, ethniCodeList, occupationList, regionList, sexList } from '../types/dict'

import { Toast } from '@/utils/uniapi/prompt'
import isObject from 'lodash/isObject'
import { storeToRefs } from 'pinia'
import useCardBhk from '../hooks/useCardBhk'
import { carmeraUrl } from '../types/l-painter/carmera'
import CardUpload from './CardUpload.vue'
import CardPreview from './cardPreview.vue'
import ClaimResults from './claimResults.vue'
const { promotionDate } = storeToRefs(promotionDateStore())
const minDate = dayjs('19100101').valueOf()
const maxDate = dayjs('20991225').valueOf()

const formPhoto = ref(null)

const curYear = ref(dayjs().year() + '')
const curMonth = ref(dayjs().month() + 1 >= 10 ? dayjs().month() + 1 : '0' + (dayjs().month() + 1))
const curDay = ref(dayjs().date() + '')
const maxCurrentDate = dayjs(curYear.value + curMonth.value + curDay.value).valueOf()
const defaultDate = ref<number>(Date.now())
const card3 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/ad13d3be-a03d-4cdb-b7ee-0a9ef026ac156tZl9vb9FE0W57b73f4247285f581851faeb5752a9b2.png',
)

// 提取生份证号信息
const getIdCardInfo = (data, sex?: string, birthday?: string) => {
  if (data.value.length === 18) {
    if (sex) {
      model.value[sex] = data.value.substr(16, 1) % 2 === 1 ? '1' : '2'
    }
    if (birthday) {
      model.value[birthday] = new Date(
        data.value.substr(6, 4) + '-' + data.value.substr(10, 2) + '-' + data.value.substr(12, 2),
      ).getTime()
    }
  } else {
    message.alert({
      msg: '检查身份证号码是否正确！',
      title: '提示',
      closeOnClickModal: false,
    })
  }
}

const message = useMessage()
const {
  modelPhoto,
  model,
  rules,
  modelId,
  applyType,
  steep,
  batchNumber,
  submitCard,
  submitStepCard,
  submitStatus,
  statusDel,
  sendApplyInfo,
  sedBankCodeById,
  promoteInfo,
  bankLabelList,
} = useCardApply()
const { sendBranches } = useCardBhk()
const userStore = useUserStore(store)
const { userInfo } = storeToRefs(userStore)

const cardUrl1 = ref()
const cardUrl2 = ref()
const cardUrl0 = ref()

const visible = ref<boolean>(false)

function showKeyBoard() {
  visible.value = true
}

const collectionList = ref([
  { label: '现场领取', value: '0' },
  { label: '邮寄', value: '1' },
])

// 选择邮寄方式
const chooseCollect = (item) => {
  model.value.isPostcard = item.value
}

// 处理picker中命题过长
const onChangeDistrict = (pickerView, value, columnIndex, resolve) => {
  if (value.label.length > 20) {
    Toast(value.label)
  }
}

const form = ref(null)

// 错误提示
watchEffect(() => {
  if (submitStatus.value) {
    message
      .alert({
        closeOnClickModal: false,
        msg: statusDel.value?.message ? statusDel.value.message : '提交成功',
        title: '提示',
        confirmButtonText: statusDel.value?.message ? '确定' : '返回',
      })
      .then(() => {
        if (!statusDel.value?.message) {
          uni.switchTab({
            url: '/pages/index/index',
          })
        }
        submitStatus.value = false
      })
  }
})
async function upload(photoType: string, type: string) {
  const data = { photoType, type, zjhm: userInfo.value.idCardNumber }
  const queryStr = qs.stringify(data)
  uni.navigateTo({
    url: `${carmeraUrl()}?${queryStr}`,
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      camera: function (data) {
        // 处理回传数据
        changeCamearData(data.cameraData)
      },
      hkbInfo: function (data) {
        console.log('监听到hkb数据回传', data.hkbInfo)
        // 处理回传数据
        changeHkbInfo(data.hkbInfo)
      },
    },
  })
}

function changeHkbInfo(hkbInfo) {
  if (hkbInfo.type === 0) {
    cardUrl0.value = hkbInfo.url
    model.value.photoId = hkbInfo.id
    Toast('头像上传成功')
  }
}

const birthdate = ref('')
const nation: any = ref('')
const idCardOfPhoto = ref('')

function changeCamearData(cameraData) {
  console.log(cameraData.type)
  if (cameraData.type === 2) {
    cardUrl2.value = cameraData.url
    model.value.idCardBackPhotoId = cameraData.id
    const { words_result: wordsResult }: any = cameraData.data
    // model.value.name = wordsResult['姓名'].words
    // model.value.sex = changeDict(sexList, wordsResult['性别'].words, 'value', 'label') ? changeDict(sexList, wordsResult['性别'].words, 'value', 'label') : '9'
    // model.value.idCardNumber = wordsResult['公民身份号码'].words
    idCardOfPhoto.value = wordsResult['公民身份号码'].words
    model.value.address = wordsResult['住址'].words

    // 生日、民族信息填充表单
    // birthdate.value = wordsResult['出生'].words
    // model.value.birthdate = birthdate.value ? dayjs(birthdate.value).valueOf() : null
    const nac = wordsResult['民族'].words
    const filteredPeople = ethniCodeList.filter((person) =>
      person.label.toLowerCase().includes(nac.toLowerCase()),
    )
    nation.value = filteredPeople[0].value ? filteredPeople[0].value : '99'
    model.value.nation = nation.value ? nation.value : ''
  }
  if (cameraData.type === 1) {
    cardUrl1.value = cameraData.url
    const { words_result: wordsResult }: any = cameraData.data
    model.value.idCardFrontPhotoId = cameraData.id
    model.value.startDate = dayjs(wordsResult['签发日期'].words).valueOf()
    model.value.endDate = dayjs(wordsResult['失效日期'].words).valueOf()
  }
  if (cameraData.type === 0) {
    cardUrl0.value = cameraData.url
    model.value.photoId = cameraData.id
  }
}

// 处理手机号码空格字符
const checkPhoneNum = ({ value }, attr) => {
  if (value) {
    model.value[attr] = clearSpace(value)
  }
}

// 限制身份证有效时间
const checkStartDate = ({ value }) => {
  if (model.value.endDate && value >= model.value.endDate) {
    model.value.startDate = null
    message.alert({
      msg: '身份证有效起始日期不能等于或晚于结束日期',
      title: '提示',
      closeOnClickModal: false,
    })

    return false
  }
}

const checkEndDate = ({ value }) => {
  if (model.value.startDate && value <= model.value.startDate) {
    model.value.endDate = null
    message.alert({
      msg: '身份证有效结束日期不能等于或早于起始日期',
      title: '提示',
      closeOnClickModal: false,
    })

    return false
  }
}
const backName = ref('')
const bankCodeList = ref([])
const bankBranchList = ref([])
const areaCodeList = ref([])

const handleChange1 = async () => {
  model.value.bankCode = ''
  await handleChange()
  if (
    isObject(promotionDate.value) &&
    Object.values(promotionDate.value).length !== 0 &&
    promotionDate.value.promoterType === '2' &&
    promotionDate.value.isPromotion
  ) {
    await getBankCodeByIdDate()
    console.log('getPromoterById', promoteInfo.value)
    // model.value.bankCode = getLabelByLabel(bankCodeList.value, promoteInfo.value.bankName)
    model.value.bankCode = promoteInfo.value.bankCode
    if (model.value.bankCode) {
      await handleChange()
    } else {
      Toast('当前区域没有查询到可支持线上申领的银行！')
      model.value.bankBranchCode = ''
      bankBranchList.value = []
    }
    console.log(' model.value.bankCode', model.value.bankCode)
  }
}
// 查询邮寄银行网点
const handleChange = async () => {
  model.value.bankBranchCode = ''
  try {
    const params = {
      yhdm: model.value.bankCode,
      areaCode: model.value.areaCode,
      isMail: model.value.isPostcard,
    }

    const res: any = await sendBranches(params)
    if (res.code === '200') {
      const data = res.data.dataList
      bankCodeList.value = res.data.dict ? res.data.dict : []
      bankLabelList.value = res.data.dict ? res.data.dict : []
      bankBranchList.value = data?.length
        ? data.map((v) => {
            return { value: v.wdCode, label: v.name }
          })
        : []
    }
    bankCodeList.value.forEach((item) => {
      if (item.value === model.value.bankCode) {
        backName.value = item.label
      }
    })
  } catch (error) {
    bankBranchList.value = []
  }
}
// 查询申领地区
const handleChangeArea = async () => {
  if (
    isObject(promotionDate.value) &&
    Object.values(promotionDate.value).length !== 0 &&
    promotionDate.value.promoterType === '2' &&
    promotionDate.value.isPromotion
  ) {
    await getBankCodeByIdDate()
    console.log('getPromoterById', promoteInfo.value)
    model.value.bankCode = promoteInfo.value.bankCode
    try {
      const params = {
        // yhdm: model.value.bankCode,
        areaCode: '',
        yhdm: model.value.bankCode ? model.value.bankCode : '',
        isMail: model.value.isPostcard,
      }

      const res: any = await sendBranches(params)
      if (res.code === '200') {
        areaCodeList.value = res.data.dict ? res.data.dict : []
        console.log('handleChangeArea', res)
      }
    } catch (error) {
      areaCodeList.value = []
    }
  } else {
    try {
      const params = {
        areaCode: '',
        yhdm: '',
        isMail: model.value.isPostcard,
      }

      const res: any = await sendBranches(params)
      if (res.code === '200') {
        areaCodeList.value = res.data.dict ? res.data.dict : []
        console.log('handleChangeArea', res)
      }
    } catch (error) {
      areaCodeList.value = []
    }
  }
}

// 回显字典值
const getLabelByValue = (list, value) => {
  const item = list.find((item) => item.value === value)
  return item ? item.label : '' // 如果找到对应的项，返回label，否则返回空字符串
}
// 回显label值
const getLabelByLabel = (list, label) => {
  const item = list.find((item) => item.label === label)
  return item ? item.value : '' // 如果找到对应的项，返回label，否则返回空字符串
}
// 日期回显
const getDateShow = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}
function change(e) {
  model.value.areaCode = ''
  model.value.bankCode = ''
  model.value.bankBranchCode = ''
  bankCodeList.value = []
  bankBranchList.value = []
  areaCodeList.value = []
  handleChangeArea()
}
// 上一步下一步（step为目标步骤；type：1为下一步，2为上一步）
const nextStep = (step, type) => {
  if (step === 1 && type === '2') {
    steep.value = step
  } else if (step === 2) {
    if (type === '1') {
      if (
        model.value.idCardFrontPhotoId &&
        model.value.idCardBackPhotoId &&
        cardUrl1.value &&
        cardUrl2.value
      ) {
        if (idCardOfPhoto.value === userInfo.value.idCardNumber) {
          steep.value = step
        } else {
          message.alert({
            msg: '非本人身份信息，请重新上传身份证！',
            title: '提示',
            closeOnClickModal: false,
          })
        }
      } else {
        message.alert({
          msg: '请先上传身份证证件照',
          title: '提示',
          closeOnClickModal: false,
        })
      }
    } else {
      steep.value = step
    }
  } else if (step === 3) {
    if (type === '1') {
      if (model.value.idCardNumber !== userInfo.value.idCardNumber) {
        message.alert({
          msg: '非本人身份信息，请检查身份证号的正确性！',
          title: '提示',
          closeOnClickModal: false,
        })
      } else {
        handleChangeArea()
        submitStepCard(form.value, step)
      }
    } else {
      steep.value = step
    }
  } else if (step === 4 && type === '2') {
    steep.value = step
  } else if (step === 5) {
    steep.value = step
  } else if (step === 6 && type === '1') {
    //  steep.value = step
    if (model.value.photoId && cardUrl0.value) {
      steep.value = step
    } else {
      message.alert({
        msg: '请先上传人像照片',
        title: '提示',
        closeOnClickModal: false,
      })
    }
  } else {
    if (step === 4 && model.value.isPostcard === '0') {
      model.value.postcardName = ''
      model.value.postcardPhone = ''
      model.value.postcardAddress = ''
    }
    submitStepCard(form.value, step)
  }
}

// 获取信息详情
const getDetailInfo = async () => {
  model.value.areaCode = ''
  model.value.bankCode = ''
  model.value.bankBranchCode = ''
  const returnData: Record<string, any> = await sendApplyInfo({
    idCardNumber: userInfo.value.idCardNumber,
    applyType: '1',
  })
  for (const key in returnData) {
    if (Object.prototype.hasOwnProperty.call(model.value, key) && returnData[key]) {
      // 如果存在，则更新属性值
      if (returnData[key]) {
        model.value[key] = returnData[key]
      }
    }
  }
  model.value.areaCode = ''
  model.value.bankCode = ''
  model.value.bankBranchCode = ''
  model.value.isPostcard = '0'
  // if (model.value.areaCode && model.value.bankCode) {
  //   await handleChange()
  //   if (promoterId.value) {
  //     await getPromoterById()
  //     console.log('getPromoterById', promoteInfo.value)
  //     if (promoteInfo.value.attribute === 1) {
  //       model.value.bankCode = getLabelByLabel(bankCodeList.value, promoteInfo.value.bankName)
  //       if (model.value.bankCode) {
  //         await handleChange()
  //       } else {
  //         Toast('当前区域没有查询到可支持线上申领的银行！')
  //         model.value.bankBranchCode = ''
  //         bankBranchList.value = []
  //       }
  //       console.log(' model.value.bankCode', model.value.bankCode)
  //     }
  //   }
  // }
  model.value.birthdate = dayjs(returnData.birthdate).valueOf()
  model.value.startDate = dayjs(returnData.startDate).valueOf()
  model.value.endDate = dayjs(returnData.endDate).valueOf()
  model.value.bankBranchCode = returnData.bankBranchCode
  model.value.idCardFrontPhotoId = ''
  model.value.idCardBackPhotoId = ''
  model.value.photoId = ''
  modelId.value = returnData.id
  applyType.value = returnData.applyType
  getIdCardInfo(userInfo.value.idCardNumber, 'sex', 'birthdate')
  model.value.areaCode = ''
  model.value.bankCode = ''
  model.value.bankBranchCode = ''
}
// 根据当前用户id 查询推广人信息
// const getPromoterById = async () => {
//   const params = {
//     id: promotionDate.value.promoterType,
//   }
//   const returnData: any = await sedGetPromoterById(params)
//   promoteInfo.value = returnData
//   console.log('sedGetPromoterByIdreturnData', returnData)
// }

// 根据id获取推广码详情
const getBankCodeByIdDate = async () => {
  const params = {
    id: promotionDate.value.bankCodeId,
  }
  const returnData: any = await sedBankCodeById(params)
  promoteInfo.value = returnData
  console.log('sedGetPromoterByIdreturnData', returnData)
}

onMounted(() => {
  steep.value = 1
  getDetailInfo()
  promoteInfo.value = null
})
</script>
<template>
  <view class="p-10px formCon" v-if="steep === 1">
    <view class="formView">
      <view class="uploadTip">
        <view class="tipH6">请上传二代身份证</view>
        <view class="tipP">确保证件清晰完整</view>
      </view>
      <view class="pt-20px">
        <wd-form ref="formPhoto" :model="modelPhoto">
          <view class="mb-20px" @click="upload('1', '1')">
            <Card-Upload :type="1" :imgUrl="cardUrl1" />
          </view>
          <view @click="upload('2', '1')">
            <Card-Upload :type="2" :imgUrl="cardUrl2" />
          </view>
        </wd-form>
      </view>
    </view>
    <view class="bottomBtn longBottom">
      <wd-button
        style="width: 100%"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(2, '1')"
        block
      >
        下一步
      </wd-button>
    </view>
  </view>
  <view class="py-20px formCon" v-if="steep === 2">
    <view class="rounded-10px overflow-hidden bg-#fff formView">
      <view class="partTitle">
        <text>基本信息</text>
      </view>
      <wd-form ref="form" :model="model">
        <wd-cell-group border>
          <wd-input
            label="姓名:"
            label-width="100px"
            type="text"
            v-model.trim="model.name"
            placeholder="请输入姓名"
            :rules="rules.name"
            prop="name"
            :maxlength="20"
            readonly
            custom-input-class="custom-input-right"
          />
          <wd-input
            label="身份证号码:"
            label-width="100px"
            type="text"
            v-model="model.idCardNumber"
            placeholder="请输入身份证号码"
            :rules="rules.idCardNumber"
            prop="idCardNumber"
            custom-input-class="custom-input-right"
            :maxlength="18"
            :mixlength="16"
            readonly
            @blur="getIdCardInfo($event, 'sex', 'birthdate')"
          />
          <wd-number-keyboard
            v-model:visible="visible"
            v-model="model.idCardNumber"
            :maxlength="18"
            extra-key="X"
            close-text="完成"
          ></wd-number-keyboard>
          <wd-picker
            :columns="cardType"
            custom-value-class="custom-input-right"
            label="证件类型:"
            v-model="model.idCardType"
            :rules="rules.idCardType"
            prop="idCardType"
          />
          <wd-picker
            :columns="sexList"
            custom-value-class="custom-input-right"
            label="性别:"
            v-model="model.sex"
            :rules="rules.sex"
            readonly
            prop="sex"
          />
          <wd-input
            label="手机号码:"
            label-width="100px"
            type="text"
            v-model="model.phoneNumber"
            placeholder="请输入手机号码"
            :rules="rules.phoneNumber"
            prop="phoneNumber"
            custom-input-class="custom-input-right"
            :maxlength="14"
            @blur="checkPhoneNum($event, 'phoneNumber')"
          />
          <wd-datetime-picker
            type="date"
            label-width="150"
            custom-value-class="custom-input-right"
            align-right
            label="出生日期:"
            v-model="model.birthdate"
            :rules="rules.birthdate"
            prop="birthdate"
            :maxDate="maxCurrentDate"
            :minDate="minDate"
            :default-value="defaultDate"
            readonly
          />
          <wd-picker
            :columns="regionList"
            custom-value-class="custom-input-right"
            label="国籍/地区:"
            v-model="model.nationality"
            :rules="rules.nationality"
            prop="nationality"
            readonly
          />
          <wd-picker
            :columns="ethniCodeList"
            custom-value-class="custom-input-right"
            label="民族:"
            v-model="model.nation"
            :rules="rules.nation"
            prop="nation"
          />
          <wd-datetime-picker
            type="date"
            label-width="150px"
            custom-value-class="custom-input-right"
            label="证件有效起始日期:"
            v-model="model.startDate"
            :rules="rules.startDate"
            prop="startDate"
            align-right
            :maxDate="maxCurrentDate"
            :minDate="minDate"
            :default-value="defaultDate"
            @confirm="checkStartDate"
          />
          <wd-datetime-picker
            type="date"
            label-width="150px"
            custom-value-class="custom-input-right"
            label="证件有效结束日期:"
            v-model="model.endDate"
            :rules="rules.endDate"
            prop="endDate"
            align-right
            :maxDate="maxDate"
            :minDate="minDate"
            :default-value="defaultDate"
            @confirm="checkEndDate"
          />
          <wd-input
            label="家庭住址:"
            v-model="model.address"
            :rules="rules.address"
            :maxlength="70"
            prop="address"
            label-width="100px"
            type="text"
            placeholder="请输入家庭住址"
            custom-input-class="custom-input-right"
          />
          <wd-picker
            :columns="occupationList"
            custom-class="hasBg"
            custom-value-class="custom-input-right"
            label="职业:"
            v-model="model.work"
            :rules="rules.work"
            prop="work"
          />
        </wd-cell-group>
      </wd-form>
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(1, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(3, '1')" block>
        下一步
      </wd-button>
    </view>
  </view>
  <view class="formCon" v-if="steep === 3">
    <view class="py-20px rounded-10px overflow-hidden bg-#fff formView">
      <view class="partTitle">
        <text>领取方式</text>
      </view>
      <wd-form ref="form" :model="model">
        <wd-cell-group border>
          <view class="formLine">
            <view class="formLabel">领取方式:</view>
            <wd-radio-group shape="dot" v-model="model.isPostcard" inline @change="change">
              <wd-radio :value="item.value" v-for="item in collectionList" :key="item.label">
                {{ item.label }}
              </wd-radio>
            </wd-radio-group>
          </view>
          <wd-picker
            :columns="areaCodeList"
            custom-value-class="custom-input-right"
            label="申领地区:"
            v-model="model.areaCode"
            :rules="rules.areaCode"
            prop="areaCode"
            @confirm="handleChange1"
          />
          <wd-picker
            :columns="bankCodeList"
            custom-value-class="custom-input-right"
            label="申领银行:"
            v-model="model.bankCode"
            :rules="rules.bankCode"
            prop="bankCode"
            :disabled="
              promotionDate && promotionDate.isPromotion && promotionDate.promoterType === '2'
            "
            @confirm="handleChange"
          />
          <wd-picker
            :columns="bankBranchList"
            custom-value-class="custom-input-right"
            label="申领网点:"
            v-model="model.bankBranchCode"
            :rules="rules.bankBranchCode"
            prop="bankBranchCode"
            :disabled="!model.areaCode && !model.isPostcard && !model.bankCode"
            :column-change="onChangeDistrict"
          />
        </wd-cell-group>
        <template v-if="model.isPostcard === '1'">
          <wd-cell-group border>
            <wd-input
              custom-class="hasBg"
              label="收件人姓名:"
              v-model.trim="model.postcardName"
              :rules="rules.postcardName"
              prop="postcardName"
              label-width="100px"
              type="text"
              placeholder="请输入收件人姓名"
              :maxlength="20"
              custom-input-class="custom-input-right"
              @blur="checkPhoneNum($event, 'postcardName')"
            />
            <wd-input
              custom-class="hasBg"
              label="收件人手机号:"
              v-model.trim="model.postcardPhone"
              :rules="rules.postcardPhone"
              prop="postcardPhone"
              label-width="100px"
              type="text"
              placeholder="请输入收件人手机号"
              :maxlength="14"
              custom-input-class="custom-input-right"
              @blur="checkPhoneNum($event, 'postcardPhone')"
            />
            <wd-input
              custom-class="hasBg"
              label="收件地址:"
              v-model="model.postcardAddress"
              :rules="rules.postcardAddress"
              prop="postcardAddress"
              label-width="100px"
              type="text"
              :maxlength="70"
              placeholder="请输入收件地址"
              custom-input-class="custom-input-right"
            />
          </wd-cell-group>
        </template>
      </wd-form>
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(2, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(4, '1')" block>
        下一步
      </wd-button>
    </view>
  </view>
  <view class="formCon" v-if="steep === 4">
    <view class="py-20px rounded-10px overflow-hidden bg-#fff formView">
      <view class="partTitle">
        <text>确认信息</text>
      </view>
      <wd-form ref="form" :model="model">
        <wd-cell-group border>
          <wd-cell required title="姓名:" :value="model.name" />
          <wd-cell required title="身份证号码:" :value="model.idCardNumber" />
          <wd-cell
            required
            title="证件类型:"
            :value="getLabelByValue(cardType, model.idCardType)"
          />
          <wd-cell required title="性别:" :value="getLabelByValue(sexList, model.sex)" />
          <wd-cell required title="手机号码:" :value="model.phoneNumber" />
          <wd-cell required title="出生日期:" :value="getDateShow(model.birthdate)" />
          <wd-cell
            required
            title="国籍/地区:"
            :value="getLabelByValue(regionList, model.nationality)"
          />
          <wd-cell required title="民族:" :value="getLabelByValue(ethniCodeList, model.nation)" />
          <wd-cell required title="证件有效起始日期:" :value="getDateShow(model.startDate)" />
          <wd-cell required title="证件有效结束日期:" :value="getDateShow(model.endDate)" />
          <wd-cell required title="家庭住址:" :value="model.address" />
          <wd-cell required title="职业:" :value="getLabelByValue(occupationList, model.work)" />
          <wd-cell
            required
            title="领取方式:"
            :value="getLabelByValue(collectionList, model.isPostcard)"
          />
          <wd-cell
            required
            title="申领地区:"
            :value="getLabelByValue(areaCodeList, model.areaCode)"
          />
          <wd-cell
            required
            title="申领银行:"
            :value="getLabelByValue(bankCodeList, model.bankCode)"
          />
          <wd-cell
            required
            title="申领网点:"
            :value="getLabelByValue(bankBranchList, model.bankBranchCode)"
          />
        </wd-cell-group>
        <template v-if="model.isPostcard === '1'">
          <wd-cell-group border>
            <wd-cell required title="收件人姓名:" :value="model.postcardName" />
            <wd-cell required title="收件人手机号:" :value="model.postcardPhone" />
            <wd-cell required title="收件地址:" :value="model.postcardAddress" />
          </wd-cell-group>
        </template>
      </wd-form>
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(3, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(5, '1')" block>
        下一步
      </wd-button>
    </view>
  </view>
  <view class="formCon" v-if="steep === 5">
    <view class="formView">
      <view class="photoRequire">
        <view class="desTitle" style="font-weight: bold">注意事项：</view>
        <view class="requireLine">
          七周岁以下持卡人申请，照片不需要上传，系统默认为卡通头像;七周岁及以上持卡人需要上传真人头像。
        </view>
        <view class="requireLine">
          社保卡电子照片要求:深色上衣，白色免冠1寸照片，照片尺寸358*441像素，分辨率350dpi。
        </view>
        <view class="requireLine">所有上传照片需清晰且未遮挡，请勿进行美化和修改。</view>
      </view>
      <view class="rounded-10px overflow-hidden bg-#fff uploadCon">
        <view class="imgFlex">
          <view class="photoExample">
            <view class="photoName">照片样例</view>
            <view
              class="exampleImg"
              :style="`background-image: url(${card3});background-size:100% 100%`"
            ></view>
          </view>
          <view class="photoExample">
            <view class="photoName">上传照片</view>
            <wd-form class="exampleImg" ref="formPhoto" :model="modelPhoto">
              <view>
                <view @click="upload('0', '1')">
                  <Card-Upload :type="0" :imgUrl="cardUrl0" />
                </view>
              </view>
            </wd-form>
          </view>
        </view>
        <view class="handleTip">
          <view class="desTitle">操作流程</view>
          <view class="requireLine">
            点击上传照片，审核通过后完成照片上传，若未通过审核则需根据提示重新上传。
          </view>
        </view>
        <view class="handleTip">
          <view class="desTitle">重要提示</view>
          <view class="requireLine">
            请确保上传照片符合照片要求，如遇平台审核照片不通过时，请务必检查照片是否符合要求！
          </view>
        </view>
      </view>
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(4, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(6, '1')" block>
        下一步
      </wd-button>
    </view>
  </view>
  <view class="formCon" v-if="steep === 6">
    <Card-Preview
      :photoUrl="cardUrl0"
      :personName="model.name"
      :idCardNumber="model.idCardNumber"
      :backName="backName"
    />
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(5, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="submitCard(form, 7)" block>
        确认提交
      </wd-button>
    </view>
  </view>
  <view class="formCon" v-if="steep === 7">
    <Claim-Results
      :personName="model.name"
      :idCardNumber="model.idCardNumber"
      :batchNumber="batchNumber"
    />
  </view>
  <wd-message-box></wd-message-box>
</template>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>
<style lang="scss" scoped>
:deep(.wd-picker__error-message),
:deep(.wd-input__error-message) {
  @apply text-right!;
}

:deep(.custom-input-right) {
  @apply text-right! color-#999999! truncate-1;
}

.formCon {
  :deep(.uni-input-input) {
    color: #333;
  }

  :deep(.wd-picker__value) {
    color: #333 !important;
  }

  :deep(.wd-picker__placeholder) {
    color: #999 !important;
  }

  .formLine {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;

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

  .formView {
    max-height: calc(100vh - 180px);
    overflow-y: auto;
  }

  .bottomBtn {
    position: fixed;
    right: 14px;
    bottom: 24px;
    left: 14px;
    display: flex;
    justify-content: space-between;
    background: #ffffff;

    :deep(.wd-button) {
      width: 47%;
      height: 40px;
    }
    .prevBtn {
      color: #2d69ef;
      background: #eff4ff;
      border: 1px solid #c7d9ff;
      border-radius: 6px 6px 6px 6px;
      :deep(.wd-button) {
        color: #2d69ef;
        background: #eff4ff;
        border: 1px solid #c7d9ff;
        border-radius: 6px 6px 6px 6px;
      }
    }
  }

  .longBottom {
    :deep(.wd-button) {
      width: 100%;
    }
  }

  .partTitle {
    padding-left: 15px;
    margin-bottom: 10px;

    text {
      display: inline-block;
      padding-left: 10px;
      font-size: 16px;
      line-height: 16px;
      border-left: 5px solid #2d69ef;
    }
  }

  .collectionMethod {
    display: flex;
    align-self: center;
    justify-content: space-around;
    padding: 0 20%;
    background: #f2f7fd;

    .methodItem {
      display: inline-block;
      width: 50%;
      height: 55px;
      font-size: 16px;
      line-height: 55px;
      color: #000;
      text-align: center;
    }

    .activeItem {
      position: relative;
      color: #2d69ef;

      &::after {
        position: absolute;
        bottom: 10px;
        left: 50%;
        width: 17px;
        height: 4px;
        content: '';
        background: #2d69ef;
        border-radius: 5px 5px 5px 5px;
        transform: translateX(-50%);
      }
    }
  }

  .uploadTip {
    margin-top: 30px;
    text-align: center;

    .tipH6 {
      font-size: 20px;
      font-weight: 600;
      color: #000000;
    }

    .tipP {
      margin: 8px auto 16px;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
    }
  }

  .photoRequire {
    padding: 20px 25px;
    background: #f2f7fd;
    border-bottom: 1px solid #dbe9fa;
  }

  .desTitle {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
  }

  .requireLine {
    font-size: 14px;
    font-weight: 400;
    line-height: 25px;
    color: #666666;
  }

  .uploadCon {
    padding: 35px calc((100% - 300px - 40rpx) / 2) 0;

    .imgFlex {
      display: flex;
      justify-content: space-between;
    }

    .photoExample {
      box-sizing: border-box;
      width: 150px;
      height: 206px;
      padding: 14px;
      background: #f2f7fd;
      border: 1px solid #dbe9fa;
      border-radius: 5px;
    }

    .photoName {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      text-align: center;
    }

    .exampleImg {
      width: 120px;
      height: 148px;
    }

    .handleTip {
      margin-top: 36px;
    }
  }
}
:deep(.hasBg) {
  background-color: #f2f7fd !important;
  border-top: 1px solid #f1f1f1;

  .wd-picker__cell {
    background-color: #f2f7fd !important;
    border-top: 1px solid #f1f1f1;
  }
}
.hasBg {
  background-color: #f2f7fd !important;
  border-top: 1px solid #f1f1f1;
}
</style>
