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
import { getCardInfo2, getInfoId, getInfoList } from '@/service/api/userMessage'
import { useUserStore } from '@/store'
import { nameHide, routeTo } from '@/utils'
import { Modal } from '@/utils/uniapi/prompt'
import { storeToRefs } from 'pinia'
import { useMessage, useToast } from 'wot-design-uni'
import foodicon01 from '../static/images/smartCanteen/foodicon01.png'
import foodicon02 from '../static/images/smartCanteen/foodicon02.png'
import foodicon03 from '../static/images/smartCanteen/foodicon03.png'
import logo from '../static/images/smartCanteen/logo.png'
import qiehuan from '../static/images/smartCanteen/qiehuan.png'

// realNameAuthentication: true,
const userStore = useUserStore()

const canteenNameList = {
  // JT2: {
  //   name: '集团食堂(待启用)',
  //   value: 'JT2',
  //   mid: '2411250913509978',
  //   tid: '087481292',
  //   merchantId: '1835238852856737794',
  //   isShow: false,
  // },
  B5: {
    name: '华望城食堂B5/C5',
    value: 'B5',
    mid: '2411250913405161',
    tid: '087526887',
    merchantId: '1863183900566712322',
    isShow: false,
  },
  B7: {
    name: '华望城食堂B7',
    value: 'B7',
    mid: '2411250913149466',
    tid: '087526888',
    merchantId: '1862084318529114113',
    isShow: false,
  },
}
const cardIf = ref({})
const userPhone = ref('')
const radioValue = ref('')
const restaurant = ref('')
const toast = useToast()
const title = ref('智慧食堂')
const personId: any = ref('')
const info: any = ref({})
const name: any = ref('')
const money: any = ref(0)
const lists: any = ref([])
const message = useMessage()
const show = ref(false)
const maxAmount = ref(500)
const singleAmount = ref(500)
const { isLogined } = storeToRefs(useUserStore())
const GInfoId = () => {
  show.value = false
  personId.value = ''
  info.value = {}
  name.value = ''
  money.value = 0
  lists.value = []
  getInfoId({
    pageNo: 1,
    pageSize: 10,
    phone: userStore.userInfo.userPhone,
    certificateNo: userStore.userInfo.idCardNumber,
  }).then((res: any) => {
    console.log('卡信息', res)
    const len5 = res.data.data.B5 ? res.data.data.B5.list.length : 0
    const len7 = res.data.data.B7 ? res.data.data.B7.list.length : 0
    // const lenJT2 = res.data.data.JT2 ? res.data.data.JT2.list.length : 0

    if (len5 > 0 || len7 > 0) {
      // if (lenJT2 > 0) {
      //   canteenNameList.JT2.isShow = true
      //   !restaurant.value && (restaurant.value = 'JT2')
      // }
      if (len5 > 0) {
        canteenNameList.B5.isShow = true
        !restaurant.value && (restaurant.value = 'B5')
      }
      if (len7 > 0) {
        canteenNameList.B7.isShow = true
        !restaurant.value && (restaurant.value = 'B7')
      }

      info.value = res.data.data[restaurant.value].list[0]
      if (!info.value) {
        info.value = ''
        message
          .alert({
            msg: '未查询到您的食堂卡号！',
            title: '提示',
          })
          .then((e) => {
            uni.switchTab({
              url: '/pages/index/index',
            })
          })

        return
      }
      if (!radioValue.value) {
        radioValue.value = restaurant.value
      }

      name.value = info.value.personName
      personId.value = info.value.personId
      userPhone.value = info.value.phoneNo
      console.log(info.value)
      Gcardinfo()
      GinfoList()
    } else {
      info.value = ''
      message
        .alert({
          msg: '未查询到您的食堂卡号！',
          title: '提示',
        })
        .then((e) => {
          uni.navigateBack()
        })
    }
  })
}

function Gcardinfo() {
  getCardInfo2({
    personId: personId.value,
    canteenName: canteenNameList[restaurant.value].value,
  }).then((res: any) => {
    console.log('卡余额', res)
    cardIf.value = res.data.data
    money.value = res.data.data.totalAccount ? (res.data.data.totalAccount / 100).toFixed(2) : 0
    maxAmount.value = res.data.data.maxAmount ?? 500
    singleAmount.value = res.data.data.singleAmount ?? 500
  })
}

function GinfoList() {
  getInfoList({
    personId: personId.value,
    pageNo: 1,
    pageSize: 20,
    transactionTypes: '1,5',

    canteenName: canteenNameList[restaurant.value].value,
    endTime:
      new Date(new Date().getTime() + 1000 * 60 * 60 * 8).toISOString().slice(0, 19) + '+08:00',
    startTime:
      new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 60 * 8)
        .toISOString()
        .slice(0, 19) + '+08:00',
  }).then((res: any) => {
    console.log('列表', res)
    lists.value = res.data.data.rows
  })
}

function change() {
  restaurant.value = radioValue.value
  GInfoId()
}

const formatTimeA = (val) => {
  return val.slice(0, 10)
}
const formatTimeB = (val) => {
  return val.slice(11, 19)
}
onShow(() => {
  isLogined.value && GInfoId()
})

onLoad((options) => {
  console.log('options', options)
  restaurant.value = options.value ? options.value : ''
  if (!isLogined.value) {
    Modal({
      title: '提示',
      content: '您还没有登录,请先登录？',
      showCancel: true,
    }).then((res: any) => {
      if (res.confirm) {
        // 重定向
        const router = '/pages/login/index'
        const redirectRoute = `${router}?redirect=${encodeURIComponent(
          `pages-sub/userManager/smartCanteen/index?value=${options.value}`,
        )}`
        uni.navigateTo({ url: redirectRoute })
      }
    })
  }
})
const goReacharge = () => {
  console.log('cardIf.value', cardIf.value)
  const item = JSON.stringify({
    names: name.value,
    phones: userPhone.value,
    ...canteenNameList[restaurant.value],
    personId: info.value.personId,
    maxAmount: maxAmount.value,
    singleAmount: singleAmount.value,
  })
  routeTo({
    url: '/pages-sub/userManager/smartCanteen/recharge?item=' + item,
  })
}
</script>

<template>
  <view class="flex flex-col bg-no-repeat dy-blue-bg2" style="min-height: 100vh">
    <view>
      <dy-navbar
        :leftTitle="title"
        left
        isNavShow
        color="#000"
        custom-style="background: transparent;position: relative;"
      ></dy-navbar>
      <view class="topbg pos-relative" v-if="personId">
        <view
          class="brge pos-absolute pos-top-none pos-right-none flex justify-center items-center"
          @click="show = true"
        >
          <wd-img :src="qiehuan" :width="13" :height="11" custom-class="mr-5px"></wd-img>
          <wd-text text="切换食堂" color="#A5D8FF" size="12px"></wd-text>
        </view>
        <view class="flex items-center">
          <wd-img :src="logo" :width="40" :height="40" custom-class="mr-11px"></wd-img>
          <wd-text
            :text="canteenNameList[restaurant].name"
            size="20px"
            color="#fff"
            lineHeight="28px"
          ></wd-text>
        </view>
        <!--        <view class="flex justify-end">-->
        <!--          <wd-text text="￥200" size="26px" color="#fff" bold></wd-text>-->
        <!--        </view>-->
        <view
          class="pos-absolute w-full pos-left-none pos-bottom-none h-38px line-height-38px px-20px box-border flex justify-between"
          style="background: rgba(19, 35, 187, 0.3)"
        >
          <wd-text :text="nameHide(name)" size="14px" color="#fff"></wd-text>

          <wd-text
            :text="userPhone"
            size="14px"
            color="#94C1E3"
            mode="phone"
            :format="true"
          ></wd-text>
        </view>
      </view>
    </view>
    <view class="px-15px box-border" v-if="personId">
      <view
        class="mb-10px p-15px bg-#fff rounded-6px box-border w-full flex justify-between items-center"
      >
        <view class="flex items-center justify-left">
          <wd-img :width="22" :height="22" :src="foodicon01" custom-class="mr-5px"></wd-img>
          <wd-text text="余额：" size="14px" color="#000" bold></wd-text>
          <wd-text
            :text="money"
            size="14px"
            color="#f80"
            mode="price"
            bold
            prefix="￥"
            suffix="元"
          ></wd-text>
        </view>

        <view>
          <wd-button size="small" custom-class="cz" @click="goReacharge">充值</wd-button>
        </view>
      </view>

      <wd-text text="近期交易记录" size="14px" color="#333" bold custom-class="py-2"></wd-text>
      <view v-if="lists.length > 0">
        <view v-for="(it, ind) in lists" :key="ind">
          <view
            v-if="it.transactionType === 1"
            class="my-10px p-15px bg-#fff rounded-6px box-border w-full flex justify-between items-center"
          >
            <view class="flex items-center justify-left">
              <view class="">
                <view class="mb-5px flex items-center justify-left">
                  <wd-img :width="22" :height="22" :src="foodicon02" custom-class="mr-5px"></wd-img>
                  <wd-text text="充值" size="14px" color="#000" bold></wd-text>
                </view>
                <view class="flex items-center justify-left">
                  <wd-text
                    :text="formatTimeA(it.debitTime)"
                    size="12px"
                    color="#999"
                    custom-class="mr-10px"
                  ></wd-text>
                  <wd-text :text="formatTimeB(it.debitTime)" size="12px" color="#999"></wd-text>
                </view>
              </view>
            </view>

            <view class="flex items-center justify-left">
              <view class="">
                <view class="mb-5px flex items-center justify-left">
                  <wd-text
                    :text="it.deduction / 100"
                    size="14px"
                    color="#49940f"
                    mode="price"
                    suffix="元"
                  ></wd-text>
                </view>
                <view class="flex items-center justify-left">
                  <wd-text text="余额" size="11px" color="#999" custom-class="mr-3px"></wd-text>
                  <wd-text
                    :text="it.balance / 100"
                    size="11px"
                    color="#999"
                    mode="price"
                    suffix="元"
                  ></wd-text>
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="it.transactionType === 5"
            class="my-10px p-15px bg-#fff rounded-6px box-border w-full flex justify-between items-center"
          >
            <view class="flex items-center justify-left">
              <view class="">
                <view class="mb-5px flex items-center justify-left">
                  <wd-img :width="22" :height="22" :src="foodicon03" custom-class="mr-5px"></wd-img>
                  <wd-text text="消费" size="14px" color="#000" bold></wd-text>
                </view>
                <view class="flex items-center justify-left">
                  <wd-text
                    :text="formatTimeA(it.debitTime)"
                    size="12px"
                    color="#999"
                    custom-class="mr-10px"
                  ></wd-text>
                  <wd-text :text="formatTimeB(it.debitTime)" size="12px" color="#999"></wd-text>
                </view>
              </view>
            </view>
            <view class="flex items-center justify-left">
              <view class="">
                <view class="mb-4px flex items-center justify-left">
                  <wd-text
                    :text="it.deduction / 100"
                    size="14px"
                    color="#f28b89"
                    mode="price"
                    suffix="元"
                  ></wd-text>
                </view>
                <view class="flex items-center justify-left">
                  <wd-text text="余额" size="11px" color="#999" custom-class="mr-3px"></wd-text>
                  <wd-text
                    :text="it.balance / 100"
                    size="11px"
                    color="#999"
                    mode="price"
                    suffix="元"
                  ></wd-text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <wd-status-tip image="content" tip="暂无数据" v-else />
    </view>
  </view>
  <wd-popup
    v-model="show"
    custom-style="height:440px;borderRadius:20px 20px 0 0 ;padding:15px 20px 25px 28px;box-sizing:border-box;display:flex;flex-direction: column;"
    position="bottom"
  >
    <view class="flex justify-center items-center pos-relative">
      <wd-text text="切换食堂"></wd-text>
      <view class="pos-absolute pos-right-5px pos-top-5spx" @click="show = false">
        <wd-icon name="close" size="12px" color="#C9C9C9"></wd-icon>
      </view>
    </view>
    <view class="flex-1 overflow-y-auto mt-30px">
      <wd-radio-group v-model="radioValue" inline shape="dot" checked-color="#F44D24">
        <view class="w-full mb-10px flex flex-col">
          <view v-for="it in canteenNameList" :key="it.mid" class="FHcl">
            <wd-radio :value="it.value" custom-class="mb-15px" :disabled="!it.isShow">
              <wd-text
                :text="it.name"
                size="16px"
                color="#000000"
                custom-class="ml-15px"
                custom-style="text-align: left;"
              ></wd-text>
            </wd-radio>
          </view>
        </view>
        <!-- <view class="w-full flex items-center mb-10px">
          <wd-radio value="B5" custom-class="mb-15px">
            <wd-text
              :text="'B5/C5 食堂'"
              size="16px"
              color="#000000"
              custom-class="ml-15px"
            ></wd-text>
          </wd-radio>
        </view> -->
      </wd-radio-group>
    </view>

    <view
      class="w-full h-40px flex justify-center items-center bg-#2D69EF color-#fff border-rd-6px mt-30px"
      @click="change"
    >
      确认切换
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
:deep(.custom-cell-picker) {
  @apply bg-#fff;

  .wd-picker__arrow {
    @apply hidden;
  }
}

.topbg {
  box-sizing: border-box;
  width: calc(100% - 30px);
  padding: 19px 19px 45px 19px;
  margin: 10px auto;
  overflow: hidden;
  background: linear-gradient(48deg, #2bc5ff 0%, #1d4adc 100%);
  border-radius: 8px 8px 8px 8px;

  .brge {
    width: 87px;
    height: 28px;
    background: rgba(35, 31, 150, 0.42);
    border-radius: 0px 8px 0px 25px;
  }
}

:deep(.custom-view-picker) {
  @apply flex justify-between items-center;
}

:deep(.cz) {
  width: 60px;
  color: #ff8800 !important;
  background-color: #feece7 !important;
}

.dy-blue-bg2 {
  background: linear-gradient(180deg, #d1e9fe, #f3f4f6, #f3f4f6, #f3f4f6) !important;
}
</style>
