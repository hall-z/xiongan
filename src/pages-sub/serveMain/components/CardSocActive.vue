<script lang="ts" setup>
import { cardSocialStart, getCardApplyUser, getCardBasicInfo2 } from '@/service/api/cardServe'
import { useUserStore } from '@/store/user'
import { useForm, useRequest } from 'alova/client'
import { useMessage } from 'wot-design-uni'
import { cardInfoProps, statusTisProps } from '../types/types'

import sbbhZwBg from '@/static/images/serve/sbbhZwBg.png'

import { dataDesensitization, routeTo } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
const message = useMessage()
const message2 = useMessage('wd-message-box-slot')
const { userInfo } = useUserStore()
const rules = {
  userName: [{ required: true, message: '请输入姓名' }],
  cardNumber: [{ required: true, message: '请输入证件号码' }],
  socialScCardNumber: [{ required: true, message: '请输入社会保障卡号' }],
  operator: [{ required: true, message: '请输入经办人' }],
}
const userCardStatus = ref('')
const enableName = ref('')
const enableList: any = ref([])
const serchData = ref({
  dbrZjhm: userInfo.idCardNumber,
  applyType: '2',
})
const form = ref(null)
const checked = ref<boolean>(false)
const visible = ref<boolean>(false)

function showKeyBoard() {
  visible.value = true
}

// 获取代办人信息查询
const {
  loading: loadingCardQuery,
  send: getCardQury,
  onSuccess: cardQuerySucess,
} = useRequest((data) => getCardApplyUser(data), {
  immediate: false,
  loading: false,
  initialData: {},
})
// 卡信息查询
const { loading: loadingCard, send: sendCard } = useRequest(
  (data) => getCardBasicInfo2<cardInfoProps>(data),
  {
    immediate: false,
    loading: false,
    initialData: {},
  },
)
// 社保卡启用
const { send: sendsocialsecardActive, form: model } = useForm(
  (formData) => {
    const params = {
      ...formData,
      userName: userInfo.cardName,
      cardNumber: userInfo.idCardNumber,
      socialScCardNumber:
        formData.socialScCardNumber === userInfo.socialCardTm
          ? userInfo.socialCard
          : formData.socialScCardNumber,
    }
    // 可以在此转换表单数据并提交
    return cardSocialStart(params)
  },

  {
    immediate: false,
    loading: false,
    initialData: {},
    resetAfterSubmiting: true,
    initialForm: {
      userName: userInfo.cardNameTm,
      cardNumber: userInfo.idCardNumberTm,
      socialScCardNumber: userInfo.socialCardTm,
      operator: userInfo.cardName,
    },
  },
)
const { send: sendsocialsecardActive2 } = useRequest((data) => cardSocialStart(data), {
  immediate: false,
  loading: false,
  initialForm: {},
})
// useRequest(
//   (formData) => {
//     const params = {
//       ...formData,
//       userName: userInfo.cardName,
//       cardNumber: userInfo.idCardNumber,
//       socialScCardNumber:
//         formData.socialScCardNumber === userInfo.socialCardTm
//           ? userInfo.socialCard
//           : formData.socialScCardNumber,
//     }
//     // 可以在此转换表单数据并提交
//     return cardSocialStart(params)
//   },

//   {
//     immediate: false,
//     loading: false,
//     initialData: {},
//     resetAfterSubmiting: true,
//     initialForm: {
//       userName: userInfo.cardNameTm,
//       cardNumber: userInfo.idCardNumberTm,
//       socialScCardNumber: userInfo.socialCardTm,
//       operator: userInfo.cardName,
//     },
//   },
// )
const statusDel = ref<statusTisProps>()
async function submitCardSocialActive(type: any, enDate: any) {
  console.log('model.value', model.value)
  console.log('enDate', enDate)
  let date: any = {}
  if (type === '1') {
    date = {
      cardNumber: userInfo.idCardNumber,
      socialScCardNumber: userInfo.socialCard,
      operator: userInfo.cardName,
      userName: userInfo.cardName,
    }
  } else {
    date = {
      cardNumber: enDate.idCardNumber,
      socialScCardNumber: enDate.socialScCardNumberTm
        ? enDate.socialScCardNumberTm
        : enDate.socialScCardNumber,
      operator: enDate.name,
      userName: enDate.name,
    }
  }
  try {
    const data: any = await sendsocialsecardActive2(date)
    statusDel.value = data
    if (type === '1') {
      checked.value = false
    } else {
      enDate.checked = false
    }
    message
      .alert({
        closeOnClickModal: false,
        msg: statusDel.value?.message ? statusDel.value.message : '提交成功',
        title: '提示',
        confirmButtonText: statusDel.value?.message ? '确定' : '返回',
      })

      .then(() => {
        if (type === '1') {
          checked.value = true
        } else {
          enDate.checked = true
        }
        if (!statusDel.value?.message) {
          uni.navigateBack({
            delta: 2,
          })
        }
      })
  } catch (error) {
    if (type === '1') {
      checked.value = false
    } else {
      enDate.checked = false
    }
    console.log('数据校验失败')
  }
}
const isEnable = (type, e) => {
  console.log('e', e)
  enableName.value = e.name
  if (e.socialScCardNumber === '') {
    if (type === '1') {
      checked.value = false
    } else {
      e.checked = false
    }
    Toast('请输入社会保障卡号！')
  } else {
    message2
      .confirm({
        title: '提示',
        confirmButtonText: '确认启用',
      })
      .then(() => {
        submitCardSocialActive(type, e)
        console.log('点击了确定按钮')
      })
      .catch(() => {
        if (type === '1') {
          checked.value = false
        } else {
          e.checked = false
        }
        console.log('点击了取消按钮')
      })
  }
}
const goList = () => {
  routeTo({
    url: '/pages-sub/serveMain/cardApplyType',
    data: { base: 'shebaoksl', title: '社保卡申领信息' },
  })
}
const getCardQuryDataFun = async () => {
  try {
    const res: any = await getCardQury(serchData.value)
    console.log('getCardQuryDataFun', res)
    enableList.value = res
    const info: any = await sendCard({
      xm: userInfo.cardName,
      zjhm: userInfo.idCardNumber,
      shbzhm: '',
    })
    userCardStatus.value = info.data.cardStatus
    enableList.value.forEach(async (item: any) => {
      item.cardStatus = ''
      item.socialScCardNumber = ''
      item.socialScCardNumberTm = ''
      item.checked = false
      const res: any = await sendCard({ xm: item.name, zjhm: item.idCardNumber, shbzhm: '' })
      console.log('res', res)
      item.cardStatus = res.data.cardStatus
      item.isShow = !!res.data.zjhm
      if (res.data.zhbzkh) {
        item.socialScCardNumberTm = res.data.zhbzkh
        item.socialScCardNumber = dataDesensitization(res.data.zhbzkh, false, 'centerString')
      } else {
        item.socialScCardNumberTm = ''
        item.socialScCardNumber = ''
      }
    })
  } catch (error) {
    console.log(error)
  }
}
onLoad(async () => {})
onMounted(async () => {
  getCardQuryDataFun()
})
</script>
<template>
  <view class="p-15px">
    <view class="enableTitleBox">本人社保卡启用</view>
    <view class="enableCardBox rounded-10px overflow-hidden bg-#fff">
      <view v-if="userCardStatus === ''" class="tag tag2">未启用</view>
      <view v-else class="tag tag1">
        {{
          userCardStatus === '0'
            ? '封存'
            : userCardStatus === '1'
              ? '正常'
              : userCardStatus === '2'
                ? '正式挂失'
                : userCardStatus === '3'
                  ? '应用锁定'
                  : userCardStatus === '4'
                    ? '临时挂失'
                    : '其他状态'
        }}
      </view>
      <view class="topBox">
        {{ model.userName }}
      </view>
      <view class="enableBottom">
        <view>
          <view class="txt">身份证号：{{ model.cardNumber }}</view>
          <view class="txt">
            <wd-input
              label="社会保障卡号："
              label-width="100px"
              type="text"
              readonly
              v-model="model.socialScCardNumber"
              placeholder="请输入社会保障卡号"
              prop="socialScCardNumber"
              custom-class="sbCardBox"
            />
          </view>
        </view>
        <view v-if="userCardStatus === ''">
          <wd-switch v-model="checked" @change="isEnable('1', model)" />
        </view>
      </view>
    </view>
    <view class="enableTitleBox" style="margin-top: 15px">
      代办社保卡启用
      <text v-if="enableList?.length > 0">
        ({{ enableList?.filter((i) => i.isShow).length }}张)
      </text>
    </view>
    <view v-if="enableList.length > 0">
      <template v-for="(item, index) in enableList" :key="index">
        <view
          class="enableCardBox enableCardBox2 rounded-10px overflow-hidden bg-#fff"
          v-if="item.isShow"
        >
          <view v-if="item.cardStatus === ''" class="tag tag2">未启用</view>
          <view v-else class="tag tag1">
            {{
              item.cardStatus === '0'
                ? '封存'
                : item.cardStatus === '1'
                  ? '正常'
                  : item.cardStatus === '2'
                    ? '正式挂失'
                    : item.cardStatus === '3'
                      ? '应用锁定'
                      : item.cardStatus === '4'
                        ? '临时挂失'
                        : '其他状态'
            }}
          </view>
          <view class="topBox">
            {{ dataDesensitization(item.name, false, 'userName') }}
          </view>
          <view class="enableBottom">
            <view>
              <view class="txt">
                身份证号：{{ dataDesensitization(item.idCardNumber, false, 'right') }}
              </view>
              <view class="txt">
                <wd-input
                  label="社会保障卡号："
                  label-width="100px"
                  type="text"
                  :readonly="item.socialScCardNumberTm ? true : false"
                  v-model="item.socialScCardNumber"
                  placeholder="请输入社会保障卡号"
                  prop="socialScCardNumber"
                />
              </view>
            </view>
            <view v-if="item.cardStatus === ''">
              <wd-switch v-model="item.checked" @change="isEnable('2', item)" />
            </view>
          </view>
        </view>
      </template>
    </view>
    <view class="enableZwBox" v-else>
      <wd-img style="margin-top: 20px" width="160" height="90" :src="sbbhZwBg"></wd-img>
      <view class="zwText">您暂无代办社保卡</view>
      <view class="goDb" @click="goList">【如需代办请点击这里】</view>
    </view>
    <!-- <view class="mt-20px">
      <wd-button
        type="primary"
        :round="false"
        size="medium"
        @click="submitCardSocialActive(form)"
        block
        :loading="loading"
      >
        启用
      </wd-button>
    </view> -->
  </view>
  <wd-message-box selector="wd-message-box-slot">
    <view class="tsBox">
      确认启用{{
        enableName ? dataDesensitization(enableName, false, 'userName') : model.userName
      }}社保卡，启用后可正常使用。
    </view>
  </wd-message-box>
</template>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>
<style lang="scss" scoped>
:deep(.wd-input__error-message) {
  @apply text-right!;
}
:deep(.custom-input-right) {
  @apply text-right! color-#999999!;
}
.enableTitleBox {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 700;
  color: #2d69ef;
  &::before {
    display: block;
    width: 10px;
    height: 10px;
    margin-right: 8px;
    content: '';
    border: 2px solid #2d69ef;
    border-radius: 50%;
  }
}
.enableCardBox {
  position: relative;
  padding: 15px;
  :deep(.wd-input) {
    padding: 0px !important;
    padding-right: 45px !important;
    .wd-input__label {
      margin-right: 0px !important;
    }
    .wd-input__label-inner {
      font-size: 14px !important;
      color: #888888 !important;
    }
    .wd-input__inner {
      color: #888888 !important;
    }
  }

  .topBox {
    padding-bottom: 10px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px dashed #bdbdbd;
  }
  .txt {
    margin-top: 11px;
    font-size: 14px;
    color: #888888;
  }
  .tag {
    position: absolute;
    top: 0;
    right: 0;
    width: 68px;
    height: 28px;
    font-size: 14px;
    line-height: 28px;
    text-align: center;
    border-radius: 0pt 5px 0pt 15px;
  }
  .tag1 {
    color: #fff;
    background-color: #2d69ef;
  }
  .tag2 {
    color: #7d7d7d;
    background-color: #e2e3e4;
  }
  .enableBottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.enableCardBox2 {
  margin-top: 15px;
}
.enableZwBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  .zwText {
    margin: 8px 0px;
    color: #333333;
  }
  .goDb {
    color: #2d69ef;
    cursor: pointer;
  }
}
.tsBox {
  padding: 15px;
  background-color: #f2f3f7;
  border-radius: 5px;
}
</style>
