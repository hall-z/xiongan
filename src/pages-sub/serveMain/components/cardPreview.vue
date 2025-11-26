<template>
  <view class="cardPreview">
    <view class="pageTitle">您的雄安社保一卡通预览如下</view>
    <view
      class="cardFront"
      :style="`background-image: url(${cardFront});background-size:100% 100%`"
    >
      <view class="userImg">
        <wd-img
          :src="props.photoUrl ? props.photoUrl : defaultPhoto"
          width="83"
          height="107"
        ></wd-img>
      </view>
      <view class="userName">{{ props.personName }}</view>
      <view class="cardId">{{ props.idCardNumber }}</view>
      <view class="servePhone">
        服务电话(人力资源社会保障：12333&nbsp;&nbsp;&nbsp;合作银行：88888)
      </view>
    </view>
    <view
      class="cardBack"
      :style="`background-image: url(${cardBack});background-size:100% 100%`"
    ></view>
  </view>
</template>
<script lang="ts" setup>
const cardFront = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/d734d64d-874e-44e2-9f1a-5b2f9d1372efcardFront.png',
)
const cardBack = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/de75ffb2-d22f-45be-90af-6dba3f29adc8cardBack.png',
)

const defaultBoy = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/a3dd77e7-1212-43fc-b0b5-2a13ee6be1afboy.jpeg',
)
const defaultGirl = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/c376059d-d7ab-4f5c-91ec-0e9900704376girl.jpeg',
)

const defaultPhoto = ref('')

const props = defineProps({
  photoUrl: {
    type: String,
    default: '',
  },
  personName: {
    type: String,
    default: '',
  },
  idCardNumber: {
    type: String,
    default: '',
  },
  backName: {
    type: String,
    default: '',
  },
})

const bankPhone = ref([
  { name: '工商银行', phone: '95588' },
  { name: '农业银行', phone: '95599' },
  { name: '中国银行', phone: '95566' },
  { name: '建设银行', phone: '95533' },
  { name: '交通银行', phone: '95559' },
  { name: '中信银行', phone: '95558' },
  { name: '光大银行', phone: '95595' },
  { name: '河北省农信社', phone: '0311-96369' },
])

const wdPhone = ref('')

bankPhone.value.forEach((item) => {
  if (item.name === props.backName) {
    wdPhone.value = item.phone
  }
})

watch(
  () => props.idCardNumber,
  () => {
    const age = getAgeByIdCard(props.idCardNumber)
    if (!props.photoUrl && age <= 6) {
      const userSex = Number(props.idCardNumber.substring(16, 17)) % 2 === 1 ? '1' : '2'
      if (userSex === '1') {
        defaultPhoto.value = defaultBoy.value
      } else if (userSex === '2') {
        defaultPhoto.value = defaultGirl.value
      }
    }
  },
  { immediate: true },
)

function getAgeByIdCard(idCard) {
  // 校验身份证格式（简单校验）
  if (!/^\d{17}[\dXx]$/.test(idCard)) {
    throw new Error('身份证号码格式不正确')
  }

  // 提取出生年月日
  let birthDateStr
  if (idCard.length === 18) {
    birthDateStr = idCard.substring(6, 14) // 18位身份证取第7-14位
  } else {
    birthDateStr = '19' + idCard.substring(6, 12) // 15位身份证补全年份
  }

  // 解析出生日期
  const birthYear = parseInt(birthDateStr.substring(0, 4))
  const birthMonth = parseInt(birthDateStr.substring(4, 6)) - 1 // 月份从0开始
  const birthDay = parseInt(birthDateStr.substring(6, 8))

  const birthDate = new Date(birthYear, birthMonth, birthDay)
  const currentDate = new Date()

  // 计算年龄
  let age = currentDate.getFullYear() - birthDate.getFullYear()

  // 处理未到生日的情况
  const currentMonth = currentDate.getMonth()
  const currentDay = currentDate.getDate()

  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--
  }

  return age
}
</script>
<style lang="scss" scoped>
.cardPreview {
  .pageTitle {
    margin: 20px 0;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    text-align: center;
  }
  .cardFront,
  .cardBack {
    width: 696.56rpx;
    height: 441.17rpx;
    margin: 0 auto 32.44rpx;
  }
  .cardFront {
    position: relative;
    font-family: fangsong;
    font-size: 22rpx;
    font-weight: 600;
    color: #000;
    .userImg {
      position: absolute;
      top: 83.24rpx;
      left: 32.44rpx;
      width: 166.03rpx;
      height: 204.65rpx;
    }
    .userName {
      position: absolute;
      top: 116.41rpx;
      left: 284.35rpx;
    }
    .cardId {
      position: absolute;
      top: 152.67rpx;
      left: 379.77rpx;
    }
    .servePhone {
      position: absolute;
      bottom: 13.36rpx;
      left: 26.72rpx;
      font-size: 20rpx;
    }
  }
}
</style>
