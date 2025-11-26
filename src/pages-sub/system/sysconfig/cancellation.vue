<route lang="json5" type="page">
{
  layout: 'default',
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
import anvter1 from '@/static/images/mine/anvter1.png'
import { useUserStore } from '@/store/user'
import { routeTo } from '@/utils'
import { storeToRefs } from 'pinia'
import { useMessage } from 'wot-design-uni'
const { isLogined, userInfo } = storeToRefs(useUserStore())
const message = useMessage()
const title = ref('账号注销')
const list = ref([
  '历史订单数据将无法查看。',
  '交易数据将无法查看。',
  '优惠券、积分和权益将被清空 。',
  '历史办事记录将无法查看 。',
  '注销账户后，若再次使用该手机号登录，系统将会为你生成一个全新的账户，无法查看历史数据。',
])
const btnClick = () => {
  if (userInfo.value.merchantId) {
    message.alert({
      title: '提示',
      msg: '此账户为商家账户，不支持自行注销。如有需求，请联系平台管理人员。',
      closeOnClickModal: false,
    })
  } else {
    // TODO: 注销验证
    routeTo({
      url: '/pages-sub/system/sysconfig/cancePhone',
    })
  }
}
</script>

<template>
  <view class="h-100vh bg-#F6F6F6">
    <dy-navbar :leftTitle="title" left isNavShow color="#000"></dy-navbar>
    <view class="text-20px color-#000 font-600 text-center my-20px">请确认注销的账号及影响</view>
    <view class="px-15px">
      <view class="text-16px color-#333 font-600 my-16px">即将注销的账号</view>
      <view class="my-10px">
        <view class="rounded-8px bg-#fff flex gap-10px my-10px p-10px">
          <view>
            <wd-img :width="60" :height="60" :src="userInfo.userAvatar ?? anvter1" />
          </view>
          <view class="flex flex-col justify-around">
            <view class="text-16px">{{ userInfo.userName }}</view>
            <view class="text-16px color-#999">{{ userInfo.userPhone }}</view>
          </view>
        </view>
      </view>
      <view class="text-16px color-#333 font-600 my-16px">请注意，注销后你将</view>
      <view class="p-15px bg-#fff rounded-6px">
        <view class="color-#888888 text-16px py-5px" v-for="(item, index) in list" :key="index">
          {{ index + 1 }}、{{ item }}
        </view>
      </view>
    </view>
    <view class="px-10px py-10px fixed bottom-0 left-0 right-0 bg-#fff safe-area-after">
      <view class="flex gap-15px">
        <view class="flex-1">
          <wd-button :round="false" block type="primary" @click="btnClick">
            我已确认，继续注销
          </wd-button>
        </view>
      </view>
    </view>

    <view></view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
