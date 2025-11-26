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
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { addressList } from '@/service/api/address'
import { useUserStore } from '@/store'
import { changeUrlJson, routeTo } from '@/utils'
import useInter from './utils/useInter'
import { useToast } from 'wot-design-uni/index'
const { sendExchangeGoods, sendInterProductInfo } = useInter()

const toast = useToast()

const userStore = useUserStore()

const shopAdsList = ref<any>({})
const receiveAddrId = ref<any>('')
const deliveryMode = ref<any>(0)
const orderNote = ref<any>('')
const show = ref(false)

const showPop = reactive({
  addList: false,
})
const getAdsList = async () => {
  shopAdsList.value = {}

  adsList.value = await addressList({})
  if (adsList.value.length > 0) {
    adsList.value.forEach((element) => {
      element.isCheck = !!element.isDefault
    })
    let obj = adsList.value.find((it) => it.isDefault)
    if (!obj) {
      obj = adsList.value[0]
    }

    shopAdsList.value = obj
    receiveAddrId.value = obj.id
  }
}

const handleChange = ({ value }, id) => {
  console.log(value, id)
  adsList.value.forEach((element) => {
    if (element.id === id) {
      element.isCheck = value
    } else {
      element.isCheck = !value
    }
  })
}
const checkAddress = () => {
  showPop.addList = true
}
const checkExtract = () => {
  const obj = adsList.value.find((it) => it.isCheck)
  shopAdsList.value = obj
  receiveAddrId.value = obj.id
  showPop.addList = false
}

const adsList = ref<any>([])
const actions = ref<Array<any>>([
  {
    name: '快递配送',
  },
])
const opData = ref()

const goAddress = (val: any) => {
  routeTo({
    url: '/pages-sub/userManager/address/list',
  })
}

const validator = (str) => {
  const regex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
  // 定义表情符号范围
  // 检查是否包含非法字符或表情符号
  return regex.test(str)
}

const operationLoading = ref(false)
const submitExchangeGoods = async () => {
  if (opData.value.goodSort === '2') {
    if (!receiveAddrId.value) {
      toast.show('请先添加收货地址!')
      return
    }
    if (!validator(shopAdsList.value.userAddress)) {
      toast.show('收货地址暂不支持表情及特殊字符，请先修改收货地址!')
      return
    }
  } else {
    // 虚拟商品不需要收货地址
    receiveAddrId.value = ''
  }

  operationLoading.value = true
  const params = {
    userDId: userStore.userInfo.userDId,
    goodId: opData.value.goodId,
    addressId: receiveAddrId.value,
    notes: orderNote.value,
  }
  try {
    const data = await sendExchangeGoods(params)
    console.log('兑换商品', data)
    show.value = true
    operationLoading.value = false
  } catch (error) {
    console.log('🍍[error]:', error)
    operationLoading.value = false
  }

  //
}

onLoad(async (option) => {
  opData.value = changeUrlJson(option)
  console.log('option', option)
})

onShow(async (options) => {
  // 获取地址列表
  getAdsList()
})
</script>
<template>
  <view class="min-h-100vh bg-#f3f4f6">
    <dy-navbar leftTitle="确认兑换" left></dy-navbar>
    <view class="list">
      <view class="border-rd-5px mb-20px">
        <template v-if="opData.goodSort === '2'">
          <view
            class="bg-white border-rd-7px bg-white p-13px box-border mb-13px"
            v-if="deliveryMode !== 1 && adsList.length > 0"
            @click="checkAddress"
          >
            <view
              style="width: 100%; font-size: 14px; color: #888888"
              class="add-detail"
              v-if="shopAdsList"
            >
              {{ shopAdsList.province }} {{ shopAdsList.city }} {{ shopAdsList.area }}
            </view>
            <view class="w-full flex items-center justify-between my-3px" v-if="shopAdsList">
              <view class="flex-1 add-detail">
                {{ shopAdsList.userAddress }}
              </view>
              <wd-icon name="arrow-right" size="22px" color="#000"></wd-icon>
            </view>
            <view style="margin-top: 5px; font-size: 14px" v-if="shopAdsList">
              {{ shopAdsList.userName }} {{ shopAdsList.userPhone }}
            </view>
          </view>

          <view
            class="bg-white border-rd-7px bg-white p-13px box-border mb-13px"
            v-if="adsList && adsList.length <= 0"
          >
            <view class="w-full flex items-center justify-between my-3px">
              <wd-text text=" 暂无地址"></wd-text>

              <view class="flex items-center justify-right">
                <wd-button type="warning" @click="goAddress" size="small">去新增</wd-button>
                <wd-icon name="arrow-right" size="22px" color="#000"></wd-icon>
              </view>
            </view>
          </view>
        </template>
        <view class="bg-white border-rd-10px p-15px box-border w-full">
          <view class="w-full flex">
            <wd-img :width="105" :height="105" :src="opData.goodImg" custom-image="img" />
            <view class="ml-15px flex-1 flex flex-col justify-between overflow-hidden">
              <view class="w-210px name">{{ opData.goodName }}</view>

              <view class="w-full flex justify-between">
                <view class="flex items-center" style="font-weight: 600">
                  <text style="font-size: 18px" class="color-#F44D24">
                    {{ opData.coinPrice }}积分
                  </text>
                </view>
                <view class="num">x1</view>
              </view>
            </view>
          </view>
          <!--          <view class="w-full flex justify-between items-center mt-15px">-->
          <!--            <view class="mr-50px">优惠券</view>-->
          <!--            <view style="color: #777777">暂无可用优惠券</view>-->
          <!--          </view>-->
          <!--          <view class="w-full flex justify-between items-center mt-15px">-->
          <!--            <view class="mr-50px">实际支付</view>-->
          <!--            <view class="color-#F44D24" style="font-size: 16px">-->
          <!--              <text>￥{{ item.deliveryAmount }}</text>-->
          <!--            </view>-->
          <!--          </view>-->
          <view
            class="w-full flex justify-between items-center mt-15px"
            v-if="opData.goodSort === '2'"
          >
            <view class="mr-50px text-#999999">订单运费</view>
            <view class="flex items-center">
              <text class="mr-5px">包邮</text>
            </view>
          </view>

          <view class="w-full flex justify-between items-center mt-15px">
            <view class="mr-50px text-#999999">所需积分</view>
            <view class="flex items-center">
              <text class="mr-5px">{{ opData.coinPrice }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="p4 fixed pos-bottom-none w-full box-border flex justify-between bg-white">
      <view class="flex items-baseline pt-5px">
        <wd-text text="合计积分：" color="#666666" size="16px"></wd-text>
        <wd-text :text="opData.coinPrice" color="#F44D24" bold size="24px"></wd-text>
        <wd-text text=" 积分" color="#F44D24" size="12px"></wd-text>
      </view>
      <!-- <view
        class="bg-#F44D24 text-white w-103px line-height-40px border-rd-6px text-center"
        @click="submitExchangeGoods"
      >
        兑换
      </view> -->
      <view class="custom-btn">
        <wd-button :loading="operationLoading" @click="submitExchangeGoods">兑换</wd-button>
      </view>
    </view>

    <!-- 兑换成功 -->
    <wd-popup
      v-model="show"
      custom-style="border-radius:10px;width:309px;height:325px;"
      custom-class="flex flex-col items-center justify-center"
    >
      <view class="w-60px h-60px bg-#F44D24 border-rd-50px flex items-center justify-center">
        <wd-icon name="check" size="30px" color="#fff"></wd-icon>
      </view>
      <wd-text text="兑换成功" color="#000" bold size="20px" custom-class="my-20px"></wd-text>
      <wd-text
        :text="
          opData.goodSort === '2'
            ? '我们会尽快给您寄出，请耐心等待'
            : '您的虚拟商品兑换申请已成功提交，请您耐心等待'
        "
        color="#999999"
        size="14px"
        custom-class="mb-30px text-wrap px-20px"
      ></wd-text>
      <view
        class="color-white bg-#F44D24 w-170px line-height-35px border-rd-6px text-center"
        @click="
          routeTo({
            url: '/pages-sub/marketManager/IntegralMarket/IntegralMarket/list',
            navType: NAVIGATE_TYPE.REDIRECT_TO,
          })
        "
      >
        返回积分商城
      </view>
    </wd-popup>
    <!--  收货地址 -->

    <wd-popup
      v-model="showPop.addList"
      lock-scroll
      position="bottom"
      custom-style="padding:18px 15px;box-sizing:border-box;border-radius:20px 20px 0 0;"
    >
      <view class="font-600 mb-20px">选择收货地址</view>
      <view style="width: 100%; max-height: 60vh; overflow-y: auto">
        <view class="flex w-full mb-15px" v-for="it in adsList" :key="it.id">
          <view style="align-self: center">
            <wd-checkbox v-model="it.isCheck" @change="handleChange($event, it.id)"></wd-checkbox>
          </view>
          <view class="flex-1 overflow-hidden">
            <view style="width: 100%; font-size: 14px; color: #888888" class="add-detail">
              {{ it.province }} {{ it.city }} {{ it.area }}
            </view>
            <view class="w-full flex items-center justify-between my-3px">
              <view class="flex-1 add-detail">
                {{ it.userAddress }}
              </view>
            </view>
            <view style="margin-top: 5px; font-size: 14px">
              {{ it.userName }} {{ it.userPhone }}
            </view>
          </view>
        </view>
      </view>

      <view class="address-submit" @click="checkExtract()">确定</view>
    </wd-popup>
  </view>
</template>

<style lang="scss" scoped>
.address {
  box-sizing: border-box;
  padding: 14px;
  background-color: #f3f4f6;
}

.add-detail {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.address-submit {
  width: 343px;
  margin: 20px auto;
  line-height: 40px;
  color: #fff;
  text-align: center;
  background: #f44d24;
  border-radius: 5px 5px 5px 5px;
}

.submit {
  width: 103px;
  margin-left: 20px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  background: #f44d24;
  border-radius: 6px 6px 6px 6px;
}

.inp {
  text-align: right !important;
}

.mingxi {
  font-size: 12px;
  color: #f44d24;
}

.list {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 15px 90px;
  overflow-y: auto;
  background-color: #f5f6f8;
}

.quan {
  box-sizing: border-box;
  width: 90px;
  padding: 4px;
  margin-left: 5px;
  color: #f44d24;
  text-align: center;
  background: #ffece8;
  border-radius: 2px 2px 2px 2px;
}

.img {
  overflow: hidden;
  border-radius: 5px;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.num {
  width: 25px;
  line-height: 25px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #999999;
  border-radius: 5px 5px 5px 5px;
}

.jian {
  width: 67px;
  height: 20px;
  font-size: 10px;
  color: #f44d24;
  background: #ffece8;
  border-radius: 2px 2px 2px 2px;
}
.custom-btn {
  :deep(.wd-button) {
    color: #fff !important;
    background: #f44d24 !important;
    border-radius: 5px !important;
  }
}
/* 已有的换行样式 */
.text-wrap {
  max-width: 100%;
  word-wrap: break-word;
  white-space: normal;
}
/* 左右边距样式 */
.px-20px {
  padding-right: 20px; /* 右边距 */
  padding-left: 20px; /* 左边距 */
}
</style>
