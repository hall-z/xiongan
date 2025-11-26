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
import { getCardApplyUser, getCardBasicInfo2, getCardTypeInfo } from '@/service/api/cardServe'
import { getCardInfo, getUserCardDetail } from '@/service/api/userMessage'
import { useUserStore } from '@/store'
import { dataDesensitization, routeTo } from '@/utils'
import { useRequest } from 'alova/client'
import currency from 'currency.js'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import {
  CardApplyInfo,
  cardDate,
  CardInfo,
  getBankName,
  getCardStatusText,
  getXaCardTypeText,
  SocialCardInfo,
} from './types/cardManagerTypes'
const { userInfo } = storeToRefs(useUserStore())

const navTitle = ref('卡管理')
const goList = () => {
  routeTo({
    url: '/pages-sub/serveMain/cardApplyType',
    data: { base: 'shebaoksl', title: '社保卡申领信息' },
  })
}
const goDaiBan = () => {
  routeTo({
    url: '/pages-sub/serveMain/cardApplyType',
    data: { base: 'xinshenersl', title: '代未成年人申领' },
  })
}
const goBhList = () => {
  routeTo({
    url: '/pages-sub/serveMain/cardApplyType',
    data: { base: 'shebaokbh', title: '社保卡补换' },
  })
}
const jhImg = ref(
  'https://oss.xay.xacloudy.cn/images/2025-06/f22c76d6-76ef-44b2-85c6-9e908aa020caxhmEnVohKjUBe5564d3d1de1d8073dbaa505f5d27a4f.png',
)
// 我的社保卡
const {
  send: sendCardDetail,
  data: cardInfo,
  loading: cardInfoLoading,
} = useRequest((data) => getUserCardDetail<CardInfo>(data), {
  immediate: false,
  loading: false,
  initialData: {},
}).onSuccess(async (res) => {
  if (res.data.trafficNumber) {
    // 公交
    sendBusInfo({ cardno: userInfo.value.trafficNumber })
  }
  if (res.data.cardName) {
    const res2 = await sendCard({
      xm: userInfo.value.cardName,
      zjhm: userInfo.value.idCardNumber,
      shbzhm: '',
    })
    const res3: any = await sendCardType({
      xm: userInfo.value.cardName,
      zjhm: userInfo.value.idCardNumber,
    })
    cardInfo.value.cardStatus = res2.data.cardStatus ?? '0'
    cardInfo.value.xaCardType = res3.data.xaCardType
    cardInfo.value.expireDate = res3.data.expireDate
    cardInfo.value.issueDate = res3.data.issueDate
    // 代办
    getCardApplyInfo({ dbrZjhm: userInfo.value.idCardNumber, applyType: '2' })
  }
})
// 公交卡信息
const { send: sendBusInfo } = useRequest((data) => getCardInfo(data), {
  immediate: false,
  loading: false,
  initialData: {},
}).onSuccess((res: any) => {
  cardInfo.value.cardbal = res.data.data.data.cardbal ?? 0
})

// 查询代办
const {
  loading: cardApplyInfoLoading,
  data: cardApplyInfo,
  send: getCardApplyInfo,
} = useRequest((data) => getCardApplyUser<CardApplyInfo[]>(data), {
  immediate: false,
  loading: false,
  initialData: {},
}).onSuccess((res) => {
  if (res.data?.length > 0) {
    cardApplyInfo.value.forEach(async (item) => {
      const res = await sendCard({ xm: item.name, zjhm: item.idCardNumber, shbzhm: '' })
      const resType: any = await sendCardType({ xm: item.name, zjhm: item.idCardNumber })
      console.log('resType', resType)
      item.socialCard = res.data.zhbzkh
      item.cardStatus = res.data.cardStatus
      item.xaCardType = resType.data.xaCardType
      item.isShow = !!res.data.zjhm
      item.issueDate = resType.data.issueDate
      item.expireDate = resType.data.expireDate
    })
  }
})

// 卡信息查询
const { loading: loadingCard, send: sendCard } = useRequest(
  (data) => getCardBasicInfo2<SocialCardInfo>(data),
  {
    immediate: false,
    loading: false,
    initialData: {},
  },
)
// 卡类型查询
const { send: sendCardType } = useRequest((data) => getCardTypeInfo<SocialCardInfo>(data), {
  immediate: false,
  loading: false,
  initialData: {},
})
onShow((options) => {
  if (userInfo.value.isReal === '1') {
    sendCardDetail({ cardId: userInfo.value.cardId })
  }
})
</script>

<template>
  <dy-content customClassCenter="bg-#f5f5f5 p-15px box-border">
    <template #top>
      <dy-navbar :leftTitle="navTitle" center customClass="nav_bg" color="#000"></dy-navbar>
    </template>
    <view class="">
      <view class="pt-20px pb-10px px-2px flex items-center gap-10px">
        <wd-icon name="circle1" size="14px" color="#2D69EF"></wd-icon>
        <text class="color-#2D69EF text-16px">本人卡</text>
      </view>
      <view class="px-10px py-15px rounded-5px bg-#fff relative">
        <wd-skeleton
          animation="gradient"
          theme="paragraph"
          :loading="cardInfoLoading"
          :row-col="[
            { width: '100%', height: '16px' },
            { width: '100%', height: '16px' },
            { width: '100%', height: '16px' },
            { width: '100%', height: '16px' },
            { width: '100%', height: '16px' },
          ]"
        >
          <template v-if="cardInfo.socialCard">
            <view
              class="absolute right-0 top-0 bg-#2D69EF text-#fff px-20px py-3px rounded-bl-20px text-center"
              :class="cardInfo.cardStatus === '1' ? 'bg-#2D69EF' : 'bg-#E2E3E4 color-#7D7D7D'"
            >
              {{ getCardStatusText(cardInfo.cardStatus) }}
            </view>
            <view class="">
              <view class="text-16px color-#333 line-height-35px bb-dashed_#BDBDBD mb-10px px-5px">
                {{ dataDesensitization(cardInfo.cardName, false, 'userName') }}
              </view>

              <view class="flex justify-between py-5px">
                <view class="text-14px color-#888">身份证号</view>
                <view class="text-14px color-#333">
                  {{ cardInfo.cardCode }}
                </view>
              </view>
              <view class="flex justify-between py-5px">
                <view class="text-14px color-#888">社会保障卡号</view>
                <view class="text-14px color-#333">{{ cardInfo.socialCard }}</view>
              </view>
              <view class="flex justify-between py-5px">
                <view class="text-14px color-#888">社保卡类型</view>
                <view class="text-14px color-#333">
                  {{ getXaCardTypeText(cardInfo.xaCardType) }}
                </view>
              </view>
              <view
                class="flex justify-between py-5px"
                v-if="cardDate(cardInfo.xaCardType, cardInfo.issueDate)"
              >
                <view class="text-14px color-#888">社保卡开卡时间</view>
                <view class="text-14px color-#333">
                  {{ cardDate(cardInfo.xaCardType, cardInfo.issueDate) }}
                </view>
              </view>
              <view
                class="flex justify-between py-5px"
                v-if="cardDate(cardInfo.xaCardType, cardInfo.expireDate)"
              >
                <view class="text-14px color-#888">社保卡到期时间</view>
                <view class="text-14px color-#333">
                  {{ cardDate(cardInfo.xaCardType, cardInfo.expireDate) }}
                </view>
              </view>
              <view class="flex justify-between py-5px">
                <view class="text-14px color-#888">社保卡金融账户银行</view>
                <view class="text-14px color-#333">{{ getBankName(cardInfo.bankCode) }}</view>
              </view>
              <view class="flex justify-between py-5px">
                <view class="text-14px color-#888">社保卡金融账户号</view>
                <view class="text-14px color-#333">{{ cardInfo.bankCard }}</view>
              </view>
              <view class="flex justify-between py-5px" v-if="cardInfo.xaCardType === '3'">
                <view class="text-14px color-#888">社保卡交通卡号</view>
                <view class="text-14px color-#333">{{ cardInfo.trafficNumber }}</view>
              </view>
              <view class="flex justify-between py-5px" v-if="cardInfo.xaCardType === '3'">
                <view class="text-14px color-#888">社保卡交通账户余额</view>
                <view class="text-14px color-#333">
                  {{ '¥' + currency(Number(cardInfo.cardbal || 0) / 100) || 0 }}
                </view>
              </view>
              <view class="mt-15px">
                <view
                  class="flex items-center color-#FD2D2D bg-#f5f5f5 py-5px px-10px gap-10px rounded-5px"
                  v-if="cardInfo.xaCardType === '1'"
                >
                  <view class="i-carbon:warning-alt-filled color-#FD2D2D font-size-40px" />
                  <view class="ml-8px font-size-12px" v-if="cardInfo.expireDate">
                    您的社保卡有效期至
                    {{
                      dayjs(cardInfo.expireDate).format('YYYY年MM月DD日')
                    }}，您可以点击下方按钮进行更换
                  </view>
                </view>
                <view
                  class="mt-15px"
                  v-if="
                    cardInfo.xaCardType === '1' ||
                    cardInfo.xaCardType === '2' ||
                    cardInfo.xaCardType === '0'
                  "
                >
                  <wd-button block type="primary" @click="goBhList">
                    <view class="flex items-center gap-1">
                      <wd-img width="17px" height="18px" :src="jhImg" />
                      <text>更换为雄安一卡通</text>
                    </view>
                  </wd-button>
                </view>
              </view>
            </view>
          </template>
          <template v-else>
            <view class="px-20px">
              <wd-button block type="primary" @click="goList">
                <view class="flex items-center gap-1">
                  <wd-icon name="error-fill" size="20px" custom-class="rotate-45"></wd-icon>
                  <text>申请本人社会保障卡</text>
                </view>
              </wd-button>
            </view>
          </template>
        </wd-skeleton>
      </view>
    </view>
    <view class="">
      <view class="pt-20px pb-10px px-2px flex items-center gap-10px">
        <wd-icon name="circle1" size="14px" color="#2D69EF"></wd-icon>
        <text class="color-#2D69EF text-16px">
          代办卡
          <text v-if="cardApplyInfo?.length > 0">
            ({{ cardApplyInfo?.filter((i) => i.isShow).length }}张)
          </text>
        </text>
      </view>
      <template v-if="cardApplyInfo?.length > 0">
        <template v-for="item in cardApplyInfo" :key="item.idCardNumber">
          <view class="px-10px py-15px rounded-5px bg-#fff relative mb-10px" v-if="item.isShow">
            <view
              class="absolute right-0 top-0 bg-#2D69EF text-#fff px-20px py-3px rounded-bl-20px text-center"
              :class="item.cardStatus === '1' ? 'bg-#2D69EF' : 'bg-#E2E3E4 color-#7D7D7D'"
            >
              {{ getCardStatusText(item.cardStatus) }}
            </view>
            <view class="">
              <view class="text-16px color-#333 line-height-35px bb-dashed_#BDBDBD mb-5px">
                {{ dataDesensitization(item.name, false, 'userName') }}
              </view>

              <view class="flex justify-between py-5px">
                <view class="text-14px color-#888">身份证号</view>
                <view class="text-14px color-#333">
                  {{ dataDesensitization(item.idCardNumber, false, 'last') }}
                </view>
              </view>
              <view class="flex justify-between py-5px">
                <view class="text-14px color-#888">社会保障卡号</view>
                <view class="text-14px color-#333">
                  {{ dataDesensitization(item.socialCard, false, 'socialCard') || '--' }}
                </view>
              </view>
              <view class="flex justify-between py-5px">
                <view class="text-14px color-#888">社保卡类型</view>
                <view class="text-14px color-#333">
                  {{ getXaCardTypeText(item.xaCardType) }}
                </view>
              </view>
              <view
                class="flex justify-between py-5px"
                v-if="cardDate(item.xaCardType, item.issueDate)"
              >
                <view class="text-14px color-#888">社保卡开卡时间</view>
                <view class="text-14px color-#333">
                  {{ cardDate(item.xaCardType, item.issueDate) }}
                </view>
              </view>
              <view
                class="flex justify-between py-5px"
                v-if="cardDate(item.xaCardType, item.expireDate)"
              >
                <view class="text-14px color-#888">社保卡到期时间</view>
                <view class="text-14px color-#333">
                  {{ cardDate(item.xaCardType, item.expireDate) }}
                </view>
              </view>
            </view>
          </view>
        </template>

        <view class="p-20px bg-#fff rounded-5px">
          <wd-button
            block
            plain
            type="primary"
            custom-class="bg-#ECF2FF! border-#96B6FF!"
            @click="goList"
          >
            <view class="flex items-center gap-1">
              <wd-icon name="error-fill" size="20px" custom-class="rotate-45"></wd-icon>
              <text>代办社会保障卡</text>
            </view>
          </wd-button>
        </view>
      </template>
      <view class="p-20px bg-#fff rounded-5px" v-else>
        <wd-button
          block
          plain
          type="primary"
          custom-class="bg-#ECF2FF! border-#96B6FF!"
          @click="goList"
        >
          <view class="flex items-center gap-1">
            <wd-icon name="error-fill" size="20px" custom-class="rotate-45"></wd-icon>
            <text>代办社会保障卡</text>
          </view>
        </wd-button>
      </view>
    </view>
  </dy-content>
</template>

<style lang="scss" scoped></style>
