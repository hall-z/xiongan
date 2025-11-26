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
import { delUserBankcard } from '@/service/api/userMessage'
import { useUserStore } from '@/store'
import { changeDict, dataDesensitization } from '@/utils'
import { useMessage, useToast } from 'wot-design-uni'
import otherlogo from '../static/images/bank/outher2.png'
import jslogo from './svg/js.svg'
import nylogo from './svg/ny.svg'
import zslogo from './svg/zs.svg'
import { bankType } from './types/dict'
import useCard from './utils/useCard'

const { userInfo } = useUserStore()
const message = useMessage()
const toast = useToast()
const { sendPayCode } = useCard()
const showPwd = ref(false)
function unbind(item) {
  console.log('🌶[item]:', item)

  if (userInfo.isPay === 0 || userInfo.isPay === '0') {
    message.alert({
      title: '提示',
      msg: '请先设置密码',
    })
  } else {
    showPwd.value = true
    tab.value = 1
  }
}
const cardtypeList = {
  zs: {
    color: '#C7162E',
    bgcolor: '#D19CA3',
    logo: zslogo,
    name: '招商银行',
  },
  js: {
    color: '#003A90',
    bgcolor: '#527EBE',
    logo: jslogo,
    name: '建设银行',
  },
  ny: {
    color: '#2F856D',
    bgcolor: '#7BAFA1',
    logo: nylogo,
    name: '农业银行',
  },
  other: {
    color: '#003a90',
    bgcolor: '#cce7fe',
    logo: otherlogo,
    name: '其他银行',
  },
}
const iconColse = ref(false)
const cadata = ref()
const cardtype = ref('other')
const uuid = ref('')
const flog = ref(false)
const tab = ref(0)
async function submit(value) {
  // 开始密码校验
  try {
    const data = (await sendPayCode({
      payCode: value,
    })) as string
    if (data) {
      // 可以修改
      flog.value = true
      uuid.value = data ?? ''
      if (tab.value === 1) {
        delCard()
      }
      if (tab.value === 2) {
        iconColse.value = true
      }
    }
  } catch (error) {
    message.alert({
      title: '提示',
      msg: error.data.msg,
    })
  }
}
async function showCard() {
  if (!iconColse.value) {
    showPwd.value = true
    tab.value = 2
  }
}
async function delCard() {
  try {
    const data = await delUserBankcard({
      bankId: cadata.value.bankId,
      uuid: uuid.value,
    })
    if (data) {
      toast.success('解绑成功')
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    } else {
      toast.error('解绑失败')
    }
  } catch (error) {
    message.alert({
      title: '提示',
      msg: error.data.msg,
    })
  } finally {
    tab.value = 0
  }
}
onLoad((option) => {
  console.log(option)
  cadata.value = option
  console.log('🌮[cadata.value]:', cadata.value)
})
</script>
<template>
  <view
    class="size-100% fixed top-0 right-0 left-0 bottom-0 bg-no-repeat z-[-1]"
    :style="
      'background: linear-gradient(180deg,' +
      cardtypeList[cardtype].bgcolor +
      '  0%, #fff 40%, #fff 100%) !important;'
    "
  ></view>
  <dy-content>
    <template #top>
      <!-- 顶部 -->
      <dy-navbar leftTitle="银行卡" left isNavShow color="#000"></dy-navbar>
    </template>
    <view class="px-15px pt-100px box-border dy-blue-bg2 text-center">
      <img class="logo" :src="cardtypeList[cardtype].logo" />

      <view class="line2" :style="'color:' + cardtypeList[cardtype].color">
        {{ changeDict(bankType, cadata.bankType) }}
      </view>
      <view class="line3" :style="'color:' + cardtypeList[cardtype].color">
        {{ dataDesensitization(cadata.bankCode, iconColse, 'last') }}
      </view>

      <view class="show" @click="showCard">
        <wd-icon
          name="browse"
          size="16px"
          color="#7B7B7B"
          custom-style="margin-right:5px"
        ></wd-icon>
        查看完整卡号
      </view>
    </view>

    <template #bottom>
      <!-- 底部 -->
      <view class="px-15px py-21px box-border">
        <view
          @click="unbind"
          class="btns"
          :style="'background-color:' + cardtypeList[cardtype].color"
        >
          解除绑定
        </view>
        <dy-password
          :title="tab === 1 ? '解绑银行卡' : '查看完整卡号'"
          decoration="请输入支付密码，以验证身份"
          v-model:showPwd="showPwd"
          @submit="submit"
          warp-style="h-450px"
        ></dy-password>
      </view>
    </template>
  </dy-content>
</template>

<style lang="scss" scoped>
:deep(.z-paging-content) {
  background: linear-gradient(180deg, #d6eafe 0%, #f3f4f6 40%, #f2f3f7 100%) !important;
}

:deep(.btns) {
  display: block;
  width: 100%;
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  border-radius: 6px 6px 6px 6px;
}

.logo {
  display: inline-block;
  width: 50px;
  height: 50px;
  margin-right: 5px;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: 5px solid #fff;
  border-radius: 100%;
}

.line2 {
  margin: 10px 0;
  margin-bottom: 20px;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 26px;
  text-align: center;
  text-transform: none;
}

.line3 {
  padding-left: 22px;
  font-size: 20px;
  font-weight: 300;
  line-height: 22px;
  text-align: center;
}

.show {
  display: inline-flex;
  align-items: center;
  height: 35px;
  padding: 0 10px;
  margin: 20px 0;
  font-size: 14px;
  line-height: 35px;
  color: #000000;
  text-align: center;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 5px 5px 5px 5px;
}
</style>
