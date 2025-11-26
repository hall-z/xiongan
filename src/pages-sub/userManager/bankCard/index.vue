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
import { useUserStore } from '@/store/user'
import { routeTo } from '@/utils'
import { storeToRefs } from 'pinia'
import { useMessage, useToast } from 'wot-design-uni/index'
import changeBankPay from '../compoents/changeBankPay/index.vue'
import yhkgl from './../static/images/bank/icon_1.png'
import xgmm from './../static/images/bank/icon_2.png'
import wjmm from './../static/images/bank/icon_3.png'
import fksz from './../static/images/bank/icon_4.png'
import useCard from './utils/useCard'
const { isLogined, userInfo } = storeToRefs(useUserStore())
const authStore = useUserStore()
const toast = useToast()
const message = useMessage()
const { sedUserInfo, userInfoData, sendBankcardPayCode } = useCard()

const serveList = ref([
  {
    icon: yhkgl,
    title: '银行卡管理',
    path: '/pages-sub/userManager/bankCard/cardsList',
    islink: true,
    show: true,
  },
  {
    icon: xgmm,
    title: '设置支付密码',
    path: '/pages-sub/userManager/bankCard/changePW',
    islink: true,
    show: false,
    isPay: '0',
  },

  {
    icon: xgmm,
    title: '修改支付密码',
    path: '/pages-sub/userManager/bankCard/changePW',
    islink: true,
    show: true,
  },
  {
    icon: wjmm,
    title: '忘记支付密码',
    path: '/pages-sub/userManager/bankCard/resetPW',
    islink: true,
    show: true,
  },
  {
    icon: wjmm,
    title: '优先支付设置',
    path: '/pages-sub/userManager/bankCard/resetPW',
    islink: true,
    show: true,
    isPay: '2',
  },
  {
    icon: fksz,
    title: '付款码免密金额',
    path: '/pages-sub/webView/index',
    islink: true,
    value: '0',
    show: true,
    isPay: '1',
  },
])
const show = ref(false)
const close = () => {
  show.value = false
}
const showBank = ref(false)
const cBack = ref({})
const actions = ref([
  {
    title: '不设置免密金额',
    value: '0',
    label: '未设置',
  },
  {
    title: '100元/笔',
    value: '100',
    label: '100元/笔',
  },
  {
    title: '200元/笔',
    value: '200',
    label: '200元/笔',
  },
  {
    title: '500元/笔',
    value: '500',
    label: '500元/笔',
  },
  {
    title: '1000元/笔',
    value: '1000',
    label: '1000元/笔',
  },
])
const serveClick = (item) => {
  if (item.isPay === '0') {
    showPwd.value = true
    return
  }
  if (item.isPay === '1') {
    show.value = true
    return
  }
  if (item.isPay === '2') {
    showBank.value = true
    return
  }

  routeTo({
    url: item.path,
  })
}
const handleClick = async (i) => {
  if (i.title === '不设置免密金额') return toast.success('设置成功!')
  try {
    const data = await sendBankcardPayCode({
      payFeeLimit: i.value,
    })
    if (data) {
      toast.success('更新额度成功!')
      await upInfo()
    }
    show.value = false
  } catch (error) {
    message.alert({
      title: '提示',
      msg: error.data.msg || '更新额度失败',
    })
  }
}

const init = () => {
  if (userInfo.value.isPay === '0') {
    serveList.value.forEach((item, index) => {
      if (index > 1) {
        item.show = false
      } else {
        item.show = true
      }
    })
  } else {
    serveList.value.forEach((item, index) => {
      if (index === 1) {
        item.show = false
      } else {
        item.show = true
      }
    })
  }
  console.log('🥟', userInfo.value.payFeeLimit)
  if (userInfo.value.payFeeLimit > 0) {
    serveList.value.forEach((item) => {
      if (item.value) {
        item.value = actions.value.find(
          (item: any) => item.value * 1 === userInfo.value.payFeeLimit,
        ).label
      } else {
        item.value = '未设置'
      }
    })
  } else {
    serveList.value.forEach((item) => {
      if (item.value) {
        item.value = '未设置'
      }
    })
  }
}
const showPwd = ref(false)

const repeatNumber = ref(1)

const submit = async (data) => {
  try {
    const res = await sendBankcardPayCode({
      payCode: data,
    })
    if (res) {
      toast.success('设置密码成功')
      // 更新用户信息
      await upInfo()
    }
  } catch (error) {
    message.alert({
      title: '提示',
      msg: error.data.msg || '设置密码失败',
    })
  }
}
const upInfo = async () => {
  await sedUserInfo()
  authStore.setUserInfo(Object.assign(userInfo.value, userInfoData.value))
  init()
}
onShow(() => {
  init()
})
</script>
<template>
  <view>
    <dy-navbar leftTitle="银行卡" left isNavShow color="#000"></dy-navbar>
    <wd-gap bg-color="#F5f5f5" height="5px"></wd-gap>

    <view class="py-10px">
      <view class="">
        <wd-cell-group border>
          <template v-for="(item, index) in serveList" :key="index">
            <wd-cell
              :is-link="item.islink"
              custom-class="custom-class-mine-cell"
              v-if="item.show"
              clickable
              @click="serveClick(item)"
            >
              <template #icon>
                <wd-img :src="item.icon" width="28" height="28px"></wd-img>
              </template>
              <template #title>
                <view class="ml-10px">{{ item.title }}</view>
              </template>
              <view v-if="item.isPay === '1'" class="color-#999">
                {{ !item.value ? '未设置' : item.value }}
              </view>
            </wd-cell>
          </template>
        </wd-cell-group>
      </view>
    </view>
    <wd-popup
      v-model="show"
      position="bottom"
      @close="close"
      custom-class="rounded-t-10px pt-10px"
      :safe-area-inset-bottom="true"
    >
      <view class="rounded-10px overflow-hidden">
        <view class="text-center py-10px color-#999 font-size-12px bb-1px_#f5f5f5_solid">
          超过设置金额，付款时需要手动输入支付密码
        </view>
        <view class="rounded-10px overflow-hidden">
          <wd-cell-group border>
            <wd-cell
              custom-class="custom-class-mine-cell"
              v-for="(item, index) in actions"
              :key="index"
              clickable
              @click="handleClick(item)"
              title-width="100%"
            >
              <template #title>
                <view class="ml-10px text-center">{{ item.title }}</view>
              </template>
            </wd-cell>
          </wd-cell-group>
          <wd-gap bg-color="#F5f5f5" height="5px"></wd-gap>

          <view class="text-center py-10px" @click="close">取消</view>
        </view>
      </view>
    </wd-popup>

    <dy-password
      title="设置密码"
      v-model:showPwd="showPwd"
      @submit="submit"
      :repeat="repeatNumber"
    ></dy-password>
    <!-- 银行卡列表 -->
    <change-bank-pay v-model:showBank="showBank" v-model:bankInfo="cBack" />
  </view>
</template>
