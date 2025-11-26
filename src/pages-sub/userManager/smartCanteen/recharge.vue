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
import { openIdCode } from '@/service/api/auth'
import { appCanteenRecharge, canteenRecharge } from '@/service/api/cardServe'
import { getOrderInfo } from '@/service/api/shop'
import { useUserStore } from '@/store'
import { nameHide, routeTo } from '@/utils'
import { alPayMain, getLoginCode, openEmbeddedMiniProgram } from '@/utils/uniapi'
import { useMessage, useToast } from 'wot-design-uni'
import foodicon02 from '../static/images/smartCanteen/foodicon02.png'

const { VITE_HALF_APPID } = import.meta.env
const busy = ref(false)

const userStore = useUserStore()
const toast = useToast()
const message = useMessage()
const title = ref('智慧食堂充值')
const dataObj = ref({})
const orderId = ref('')
const moneyList = ref([
  {
    id: 1,
    money: 10,
  },
  {
    id: 2,
    money: 20,
  },
  {
    id: 3,
    money: 30,
  },
  {
    id: 4,
    money: 50,
  },
  {
    id: 5,
    money: 100,
  },
  {
    id: 6,
    money: '',
  },
])
const statusList = ref(['未支付', '支付成功', '充值失败', '充值成功'])
const activeNum = ref(1)
const timmer = ref(null)
const num = ref(0)
const payStatus = ref(null)

const userName = ref('')
const userPhone = ref('')
const maxAmount = ref(500)
const singleAmount = ref(500)
const times = ref(0)

const getPayStatus = () => {
  getOrderInfo({ orderId: orderId.value }).then((res: any) => {
    console.log('查询订单结果', res)
    num.value++
    if (res.settleStatus === 3) {
      times.value = 99
      clearInterval(timmer.value)
      uni.hideLoading()
      message
        .alert({
          msg: '充值成功',
          title: '提示',
        })
        .then((e) => {
          orderId.value = null
          uni.navigateBack()
        })
    } else if (res.settleStatus === 0) {
      times.value = times.value + 1
      console.log('已支付', res)
      if (times.value <= 3) {
        setTimeout(function () {
          getPayStatus()
        }, 1000)
      }

      // uni.showToast({
      //   title: '用户取消支付',
      //   icon: 'error',
      // })
      // clearInterval(timmer.value)
    } else {
      console.log('未支付', res)
      times.value = times.value + 1
      payStatus.value = res.settleStatus
      if (times.value <= 3) {
        setTimeout(function () {
          getPayStatus()
        }, 1000)
      }
    }
  })
}
const submit = async () => {
  if (!busy.value) {
    busy.value = true

    console.log('点击了充值按钮')
    const obj = moneyList.value.find((it) => it.id === activeNum.value)
    if (!obj.money) {
      busy.value = false
      return toast.error('请输入充值金额')
    } else if (!userStore.openid) {
      console.log('getLoginCode')
      const res: any = await getLoginCode()
      const { openId }: any = await openIdCode({ code: res })
      busy.value = false
      userStore.setOpenid(openId)
    } else {
      console.log('校验通过准备中')

      const my = obj.money.toString()
      if (my.match(/^(0|([1-9][0-9]*))((\.[0-9]|\.[0-9][0-9]){0,1})$/)) {
        if (Number(obj.money) < 1) {
          toast.error('金额不得小于1元')
          busy.value = false
        } else if (Number(obj.money) > singleAmount.value) {
          toast.error(`单次金额不得大于${singleAmount.value}元`)
          busy.value = false
        } else {
          const data = {
            totalAmount: obj.money, // 订单金额
            openId: userStore.openid, // 用户子标识
            userId: userStore.userInfo.userDId, // 用户ID
            userName: userStore.userInfo.userName, // 用户名
            merchantId: dataObj.value.merchantId,
            userPhone: userStore.userInfo.userPhone, // 用户电话号
            canteenName: dataObj.value.value, // 食堂
            personId: dataObj.value.personId,
            cardNo: userStore.userInfo.cardId,
            appKey: 'wx',
          }

          // #ifdef MP-WEIXIN

          const res: any = await canteenRecharge(data).catch((e) => {
            if (e.data.code === '500') {
              busy.value = false
            }
          })

          uni.hideLoading()
          console.log('canteenRecharge')
          const { encryptStr, mid, tid, merOrderId } = res
          console.log('食堂充值', merOrderId)
          orderId.value = merOrderId
          console.log('打开小程序')
          await openEmbeddedMiniProgram(
            `/pages/pay/wxMiniPay?encryptStr=${encryptStr}&mid=${mid}&tid=${tid}`,
          )
          // #endif
          // #ifdef MP-ALIPAY
          const {
            encryptStr: encryptStr1,
            mid: mid1,
            tid: tid1,
            merOrderId: merOrderId1,
            code: code1,
          } = (await canteenRecharge(data)) as any
          orderId.value = merOrderId1
          if (code1 === '500') {
            busy.value = false
          }
          const payFlog = await alPayMain({
            encryptStr: encryptStr1,
            mid: mid1,
            tid: tid1,
            openId: userStore.openid,
          })
          console.log('🍱[data]:', payFlog)
          setTimeout(() => {
            reloadInfo()
          }, 1000)

          // #endif

          // #ifdef APP-PLUS

          appCanteenRecharge({ ...data, payType: '1' }).then((res: any) => {
            console.log('准备支付', res)
            const { merOrderId } = res
            orderId.value = merOrderId
            plus.runtime.openURL(res.redirectUrl, (err) => {
              console.log('失败', err)
            })

            busy.value = false
          })

          // #endif
        }
      } else {
        busy.value = false
        toast.error('请输入正确金额')
      }
    }
  } else {
    console.log('重复打开')
  }
}

onLoad((options) => {
  dataObj.value = JSON.parse(options.item)
  console.log('dataObj', dataObj.value)
  userName.value = nameHide(dataObj.value.names)
  userPhone.value = dataObj.value.phones
  maxAmount.value = dataObj.value.maxAmount
  singleAmount.value = dataObj.value.singleAmount
  console.log('dataObj.value', dataObj.value, options)
})

const reloadInfo = () => {
  // 0-未支付，1-支付成功，2-充值失败，3-充值成功
  busy.value = false
  if (orderId.value) {
    // uni.showLoading({
    //   title: '充值中...',
    // })

    if (timmer.value && times.value > 3) {
      // clearInterval(timmer.value)
    } else {
      getPayStatus()
    }
  }
}
onShow(() => {
  times.value = 0
  reloadInfo()
})
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

      <view class="topbg flex flex-col">
        <view class="flex-1 flex items-center ml-20px">
          <wd-text
            :text="userPhone"
            mode="phone"
            :format="true"
            size="26px"
            color="#fff"
            bold
          ></wd-text>
        </view>
        <view
          class="w-full h-36px line-height-38px px-20px box-border flex justify-between"
          style="background: rgba(19, 35, 187, 0.3)"
        >
          <wd-text :text="dataObj.name" size="16px" color="#A5D8FF" bold></wd-text>
          <wd-text :text="userName" size="16px" color="#94C1E3" bold></wd-text>
        </view>
      </view>
      <view class="px-15px mb-10px">
        <wd-notice-bar
          :text="`【单笔最大充值金额为 ${singleAmount}元，食堂账户储值总金额最大为 ${maxAmount} 元】`"
          prefix="warn-bold"
          type="info"
          custom-class="space"
        />
      </view>
      <!-- 充值 -->
      <view class="bg-white mx-15px border-rd-5px p-15px box-border">
        <view class="w-full flex">
          <wd-img :src="foodicon02" :width="22" :height="22"></wd-img>
          <wd-text text="选择面额" color="#000" size="16px" custom-class="ml-8px"></wd-text>
        </view>
        <view class="grid list mt-21px">
          <view
            class="border-solid border-1px border-#E5E5E5 border-rd-5px flex justify-center items-center overflow-hidden"
            :class="it.id === activeNum ? 'active' : ''"
            v-for="it in moneyList"
            :key="it.id"
            @click="activeNum = it.id"
          >
            <wd-text v-if="it.id !== 6" :text="it.money + '元'" color="#000" size="20px"></wd-text>

            <wd-text
              v-if="it.id === 6 && activeNum !== 6"
              text="自定义金额"
              color="moneyList"
              size="16px"
            ></wd-text>

            <wd-input
              v-if="activeNum === 6 && it.id === 6"
              type="number"
              v-model="it.money"
              :focus="activeNum === 6"
              no-border
              placeholder=""
              size="large"
              custom-input-class="text-center"
              custom-class=" h-60px w-full box-border flex items-center"
            />
          </view>
        </view>
      </view>

      <!-- 按钮 -->
      <view class="w-full pos-fixed flex flex-col items-center pos-bottom-44px">
        <view
          class="w-337px h-40px border-rd-6px bg-#2D69EF text-center line-height-40px color-white mb-22px"
          @tap.stop="!busy ? submit() : ''"
        >
          立即充值
        </view>
        <view class="FHcc" style="justify-content: space-evenly; width: 100%">
          <view
            class="color-#2D69EF"
            @click="
              routeTo({
                url: '/pages-sub/userManager/smartCanteen/index',
              })
            "
          >
            充值记录
          </view>

          <view
            class="color-#2D69EF"
            @click="
              routeTo({
                url: '/pages-sub/userManager/smartCanteen/searchD?item=' + JSON.stringify(dataObj),
              })
            "
          >
            代他人充值
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.custom-cell-picker) {
  @apply bg-#fff;

  .wd-picker__arrow {
    @apply hidden;
  }
}

.active {
  color: #2d69ef;
  background: #e4edff;
  border: 1px solid #b8d6f6;
  border-radius: 5px 5px 5px 5px;
}

.list {
  grid-template-rows: repeat(2, 60px);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.topbg {
  width: calc(100% - 30px);
  height: 100px;
  margin: 15px auto;
  overflow: hidden;
  background: linear-gradient(132deg, #2bc5ff 0%, #1d4adc 100%);
  border-radius: 6px 6px 6px 6px;
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

function sendOpenIdCode(arg0: { code: any }): any { throw new Error('Function not implemented.') }
function sendOpenIdCode(arg0: { code: any }): any { throw new Error('Function not implemented.') }
