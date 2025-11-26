<route lang="json5" type="page">
{
  layout: 'default',
  realNameAuthentication: true,
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      defaultTitle: '',
      titlePenetrate: 'NO',
      backButtonIcon: null,
    },
  },
}
</route>
<script lang="ts" setup>
import { addressList, getCouponList } from '@/service/api/address'
import { oldSubmitOrder } from '@/service/api/shop'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { getCurrentInstance } from 'vue'
import useOrder from './utils/userOrder'

import { Toast } from '@/utils/uniapi/prompt'
import { testUserName } from '@/utils/validate'
import { useRequest } from 'alova/client'

const userStore = useUserStore()
const {
  actions,
  showPop,
  checkDriver,
  select,
  deliveryIndex,
  orderDetails,
  isExtractList,
  shopExtractList,
  handleChange,
  checkExtract,
  getAdsList,
  adsList,
  shopAdsList,
  selfAdsList,
  submit,

  couponList,
} = useOrder()

const totalPrice = ref(0)

const model = reactive({
  value1: '',
  value2: '',
})
const temptotal = ref(0)
const actions1 = ref([])
const couponS = ref([])
const avtCcoupon = ref(0)
const disCount = ref(false)
const getCouponOver = ref(null)
const disCountInd = ref(0)
// const deliveryMode: any = ref([])
const instance = getCurrentInstance()
const cuopsCurrentIndex = ref(0)

const shangpinjinge = ref(0)
const youhuijinge = ref(0)
const yunfei = ref(0)
const shijizhifuzonge = ref(0)

function changenum(e, l1, l2) {
  console.log('spuNum,spuNum,spuNum，spuNum', e.value)
  orderDetails.value[l1].payShopListReqVo[l2].spuNum = e.value
  gettemptotal(l1, l2)
}
function blur(e, l1, l2) {
  const reg = /^[1-9][0-9]{0,3}$/
  if (!reg.test(e.value)) {
    orderDetails.value[l1].payShopListReqVo[l2].spuNum = 1
  }
  gettemptotal(l1, l2)
}

async function gettemptotal(l1 = 0, l2 = 0) {
  uni.showLoading()
  await getCouponLists(l1, l2)

  shangpinjinge.value = 0
  youhuijinge.value = 0
  yunfei.value = 0
  shijizhifuzonge.value = 0
  orderDetails.value.forEach((e) => {
    if (e.payShopListReqVo && e.payShopListReqVo.length > 0) {
      e.payShopListReqVo.forEach((it) => {
        if (it.price) {
          shangpinjinge.value = shangpinjinge.value + Number(it.price * it.spuNum)
        }
        if (it.couponInfo) {
          youhuijinge.value =
            youhuijinge.value + Number(getcuoInfo(it.couponInfo, Number(it.price * 1)).money)
        }
        if (it.deliveryMode === 0) {
          yunfei.value = yunfei.value + Number(it.deliveryAmount ? it.deliveryAmount : 0)
        }
        if (it.deliveryMode === 1) {
          yunfei.value = yunfei.value + 0
        }
        // shijizhifuzonge.value = shijizhifuzonge.value + shangpinjinge.value - youhuijinge.value + yunfei.value
      })
    }
  })
  shijizhifuzonge.value = shangpinjinge.value - youhuijinge.value + yunfei.value
  uni.hideLoading()
}

// //
// uni.$on('getParams', async function (data) {
//   console.log('datadatadatadatadatadatadatadatadatadatadatadatadata', data)
//   await getAdsListInd(data)
//
//
// })

function getAdsListInd(data) {
  if (addressLists.value.length > 0) {
    addressLists.value.forEach((it, index) => {
      if (it.id === data.id) {
        orderDetails.value[0].payShopListReqVo[0].addressInx = index
      }
    })
  }
}

/// ////////物流模式

function goAddress(val: any) {
  routeTo({
    url: '/pages-sub/userManager/address/list',
  })
}

const addressLists = ref([])
const pointLists = ref([])
const loading = ref(false)

const deliveryLists = ref([
  {
    value: 0,
    name: '快递配送',
    show: true,
  },
  {
    value: 1,
    name: '上门自提',
    show: true,
  },
])

async function getCouponLists(l1, l2) {
  if (orderDetails.value[l1].payShopListReqVo) {
    const a = await getCouponList({
      shopId: orderDetails.value[l1].shopId,
      productsList: [
        {
          num: 1,
          price: orderDetails.value[l1].payShopListReqVo[l2].price,
          productId: orderDetails.value[l1].payShopListReqVo[l2].goods_id,
        },
      ],
    })
    orderDetails.value[l1].payShopListReqVo[l2].couponInfo = a[0]
    orderDetails.value[l1].payShopListReqVo[l2].couponList = a
  }
}

function getcuoInfo(info, total) {
  if (info) {
    if (info.couponType === 1) {
      return {
        name: '满' + info.couponFillPrice + '元 减' + info.couponPrice + '',
        money: info.couponPrice,
      }
    } else if (info.couponType === 3) {
      return {
        name: '满' + info.couponFillPrice + '元 打' + info.couponPrice + '折',
        money:
          total - total * info.couponPrice * 0.1 > info.maxDiscountAmount
            ? info.maxDiscountAmount.toFixed(2)
            : (total - (total * info.couponPrice * 0.1).toFixed(2)).toFixed(2),
      }
    }
  } else {
    return { name: '', money: 0 }
  }
}

const deliveryInx = ref(0) // 配送方式index
const pointInx = ref(0) // 自提index
const addressInx = ref(0) // 快递index

const level1 = ref(0) // 快递index
const level2 = ref(0) // 快递index

const showAddress = ref(false) // 收货地址
const showMode = ref(false) // 配送方式
const showPoint = ref(false) // 自提点
const showQuan = ref(false) // 自提点

function closePops() {
  showAddress.value = false
  showMode.value = false
  showPoint.value = false
  showQuan.value = false
}

function showPops(type, l1, l2, e) {
  level1.value = l1
  level2.value = l2

  closePops()
  if (type === 'showAddress') {
    showAddress.value = true
  }
  if (type === 'showMode') {
    if (e.logisticsType.indexOf('0') < 0) {
      deliveryLists.value[0].show = false
    }
    if (e.logisticsType.indexOf('1') < 0) {
      deliveryLists.value[1].show = false
    }
    if (e.pointList.length === 0) {
      deliveryLists.value[1].show = false
    }

    if (e.pointList.length === 0 && e.logisticsType.indexOf('0') < 0) {
      e.deliveryMode.value = null
    }
    showMode.value = true
  }
  if (type === 'showPoint') {
    pointLists.value = []
    pointLists.value = orderDetails.value[level1.value].payShopListReqVo[level2.value].pointList
    showPoint.value = true
  }
  if (type === 'showQuan') {
    pointLists.value = []
    pointLists.value = orderDetails.value[level1.value].payShopListReqVo[level2.value].pointList
    showQuan.value = true
  }
}

function submitOrder() {
  console.log('orderDetails.value', orderDetails.value)
  console.log('JSONorderDetails.value', JSON.stringify(orderDetails.value))

  let fl0 = 0
  let fl1 = 0
  let fl2 = 0

  orderDetails.value.forEach((e) => {
    if (e.payShopListReqVo && e.payShopListReqVo.length > 0) {
      e.payShopListReqVo.forEach((it) => {
        if (it.deliveryMode === 0 && addressLists.value.length === 0) {
          fl0 = fl0 + 1
        }
        if (it.deliveryMode === 1 && (!it.receiverName || !it.receiverTel)) {
          fl1 = fl1 + 1
        }

        if (it.deliveryMode === 1 && !checkform(it.receiverName, it.receiverTel)) {
          fl2 = fl2 + 1
        }
      })
    }
  })

  if (fl0 > 0) {
    Toast('请添加收货地址')
  } else if (fl1 > 0) {
    Toast('请填写提货人姓名或提货人手机号')
  } else {
    const submitData = {
      shopCartIds: [],
      createOrderList: [],
      appKey: 'wx',
    }

    JSON.parse(JSON.stringify(orderDetails.value)).forEach((e, index) => {
      submitData.createOrderList.push({
        payShopListReqVo: [],
        merchantId: e.merchantId ? e.merchantId : '',
        shopId: e.shopId,
      })

      if (e.payShopListReqVo && e.payShopListReqVo.length > 0) {
        e.payShopListReqVo.forEach((it) => {
          if (it.shopCartId) {
            submitData.shopCartIds.push(it.shopCartId)
          }

          let receId = addressLists?.value[it.addressInx]?.id
          if (!receId) {
            receId = ''
          }
          submitData.createOrderList[index].payShopListReqVo.push({
            spuId: it.spuId,
            skuId: it.skuId,
            spuNum: it.spuNum,
            spuType: it.spuType,
            receiveAddrId: receId,
            deliveryMode: it.deliveryMode,
            receiverName: it.receiverName,
            receiverTel: it.receiverTel,
            receiveId: it.couponInfo ? it.couponInfo.receiveId : '',
            deliveryAmount: it.deliveryAmount,
            orderNote: it.orderNote,
            couponId: it.couponInfo ? it.couponInfo.couponId : '',
            shopownerRemarks: '',
            pickUpPoint: JSON.stringify(it.pointList[it.pointInx]),
          })
        })
      }
    })
    sendSubmitOrder(submitData)
  }
}
const { loading: submiting, send: sendSubmitOrder } = useRequest((data) => oldSubmitOrder(data), {
  immediate: false,
  loading: false,
}).onSuccess((res: any) => {
  uni.hideLoading()
  uni.redirectTo({
    url: '/pages-sub/order/orderInfo?id=' + res.data.bizOrderNo,
  })
})

function changePops(type, e, index) {
  if (type === 'showAddress') {
    orderDetails.value[level1.value].payShopListReqVo[level2.value].addressInx = index
    orderDetails.value[level1.value].payShopListReqVo[level2.value].receiveAddrId = e.value
  }
  if (type === 'showMode') {
    if (e.show) {
      orderDetails.value[level1.value].payShopListReqVo[level2.value].deliveryMode = e.value
      orderDetails.value[level1.value].payShopListReqVo[level2.value].deliveryInx = index
      orderDetails.value[level1.value].payShopListReqVo[level2.value].receiverName = ''
      orderDetails.value[level1.value].payShopListReqVo[level2.value].receiverTel = ''
      orderDetails.value[level1.value].payShopListReqVo[level2.value].receiveAddrId = ''
      orderDetails.value[level1.value].payShopListReqVo[level2.value].pointInx = 0
      orderDetails.value[level1.value].payShopListReqVo[level2.value].addressInx = 0
    }
    gettemptotal()
  }
  if (type === 'showPoint') {
    orderDetails.value[level1.value].payShopListReqVo[level2.value].receiveAddrId = e.value
    orderDetails.value[level1.value].payShopListReqVo[level2.value].pointInx = index
  }
}

async function getinfos() {
  showAddress.value = false
  showMode.value = false
  showPoint.value = false
  showQuan.value = false

  addressLists.value = await addressList({})
  await gettemptotal()

  pointLists.value = []

  loading.value = true
}

function getElected(key, index) {
  if (key === index) {
    return true
  } else {
    return false
  }
}

// 计算属性处理错误信息

function checkform(name, phone) {
  let fl = false

  if (!name) {
    Toast('请填写提货人姓名')
    fl = false
  } else if (!testUserName(name)) {
    Toast('提货人姓名不能包含特殊字符，长度为2-20')
    fl = false
  } else if (!phone) {
    Toast('请填写提货人手机号')
    fl = false
  } else if (!/^1[3-9]\d{9}$/.test(phone)) {
    Toast('请输入正确的手机号')
    fl = false
  } else {
    fl = true
  }

  return fl
}

function temp(input) {
  const output = JSON.parse(JSON.stringify(input))
  return output
}

/// ////////物流模式

onShow(async (options) => {
  getinfos()
})

onLoad(async (options) => {
  // orderDetails.value = JSON.parse(decodeURIComponent(options.obj))
  orderDetails.value = temp(JSON.parse(decodeURIComponent(options.obj)))

  getinfos()
  // 获取地址列表

  gettemptotal()

  // console.log('actions.value', deliveryMode.value, orderDetails.value)
})
</script>
<template>
  <view class="min-h-100vh bg-#f3f4f6">
    <dy-navbar leftTitle="确认订单" left></dy-navbar>

    <view class="list" v-if="orderDetails.length > 0">
      <view class="mb-10px" v-for="(item, idx) in orderDetails" :key="idx">
        <view class="bg-white border-rd-10px px-15px py-10px box-border w-full mb-10px">
          <div class="flex items-center">
            <wd-img :width="30" :height="30" round :src="item.shopAvatar" />
            <view class="ml-12px" style="color: #333333">{{ item.shopName }}</view>
            <wd-icon name="arrow-right" size="14px"></wd-icon>
          </div>

          <template v-for="(it, indx) in item.payShopListReqVo" :key="indx">
            <view class="w-full mt-15px flex" v-if="item.payShopListReqVo.length > 0">
              <wd-img :width="90" :height="90" :src="it.image" custom-image="rounded-8px" />
              <view class="ml-15px flex-1 flex flex-col justify-between overflow-hidden">
                <view>
                  <view
                    class="name over1"
                    style="
                      margin-bottom: 5px;
                      font-size: 16px;
                      font-weight: 600;
                      line-height: 22px;
                      color: #000000;
                    "
                  >
                    {{ it.spuName }}
                  </view>
                  <view class="over1" style="font-size: 14px; line-height: 20px; color: #757575">
                    {{ it.skuName }}
                  </view>
                </view>

                <view class="w-full flex justify-between items-center">
                  <view class="flex items-center" style="font-weight: 600">
                    <text
                      style="font-size: 14px; line-height: 36px; color: #f44d24; text-align: left"
                    >
                      ￥
                    </text>
                    <text
                      style="font-size: 20px; line-height: 36px; color: #f44d24; text-align: left"
                    >
                      {{ it.price }}
                    </text>
                  </view>
                  <view class="">
                    <wd-input-number
                      v-model="it.spuNum"
                      @change="changenum($event, idx, indx)"
                      step-strictly
                      :step="1"
                      :min="1"
                      :max="it.stock"
                      allow-null
                      @blur="blur($event, idx, indx)"
                    />
                  </view>
                </view>
              </view>
            </view>

            <view class="w-full flex justify-between items-center mt-0px" v-if="it.couponInfo">
              <view class="mr-50px labels">优惠券</view>
              <view class="red" style="font-size: 14px">
                <text class="red">
                  {{
                    getcuoInfo(it.couponInfo, it.price * 1).name
                      ? getcuoInfo(it.couponInfo, it.price * 1).name
                      : '无优惠券'
                  }}
                </text>
              </view>
            </view>
            <view class="w-full flex justify-between items-center mt-0px" v-if="it.couponInfo">
              <view class="mr-50px labels">优惠金额</view>
              <view class="red" style="font-size: 14px">
                <text class="red">￥{{ getcuoInfo(it.couponInfo, it.price * 1).money }}</text>
              </view>
            </view>
            <view class="w-full flex justify-between items-center mt-0px">
              <view class="mr-50px labels">商品金额</view>
              <view class="color-#333" style="font-size: 14px">
                <text>￥{{ (it.price * it.spuNum).toFixed(2) }}</text>
              </view>
            </view>
            <view
              class="w-full flex justify-between items-center mt-0px"
              v-if="it.deliveryMode === '0' || it.deliveryMode === 0"
            >
              <view class="mr-50px labels">运费</view>
              <view class="color-#333" style="font-size: 14px">
                <text>￥{{ it.deliveryAmount ? it.deliveryAmount.toFixed(2) : 0 }}</text>
              </view>
            </view>
            <view class="w-full flex justify-between items-center mt-0px">
              <view class="mr-50px labels">合计</view>
              <view class="red" style="font-size: 14px">
                <text v-if="it.deliveryMode === '0' || it.deliveryMode === 0">
                  ￥{{
                    (
                      it.price * it.spuNum +
                      Number(it.deliveryAmount ? it.deliveryAmount : 0) -
                      getcuoInfo(it.couponInfo, it.price * 1).money
                    ).toFixed(2)
                  }}
                </text>
                <text v-else>
                  ￥{{
                    (it.price * it.spuNum - getcuoInfo(it.couponInfo, it.price * 1).money).toFixed(
                      2,
                    )
                  }}
                </text>
              </view>
            </view>
            <view class="w-full flex justify-between items-center mt-0px">
              <view class="mr-50px labels">备注留言</view>
              <view class="color-#333 F1" style="font-size: 14px">
                <wd-input
                  type="text"
                  v-model.trim="it.orderNote"
                  :maxlength="20"
                  no-border
                  placeholder="输入备注（20字以内）"
                  custom-input-class=" text-right "
                  style="z-index: 1; flex: 1; font-size: 14px; text-align: right"
                />
              </view>
            </view>
          </template>
        </view>

        <view class="bg-white border-rd-10px px-15px py-10px box-border w-full mb-10px">
          <view class="w-full flex justify-between items-center mt-0px">
            <view class="mr-50px labels">配送方式</view>
            <view
              class="color-#333 FHcr text-14px"
              @click="showPops('showMode', 0, 0, orderDetails[0].payShopListReqVo[0])"
              v-if="loading"
            >
              <text>
                {{
                  deliveryLists &&
                  deliveryLists[orderDetails[0].payShopListReqVo[0].deliveryInx].name
                    ? deliveryLists[orderDetails[0].payShopListReqVo[0].deliveryInx].name
                    : '请选择配送方式'
                }}
              </text>
              <wd-icon name="arrow-right" size="14px"></wd-icon>
            </view>
          </view>

          <view
            class="w-full flex justify-between items-center mt-0px"
            v-if="
              orderDetails[0].payShopListReqVo[0].deliveryMode === '1' ||
              orderDetails[0].payShopListReqVo[0].deliveryMode === 1
            "
          >
            <view class="mr-50px labels">自提点</view>
            <view
              class="color-#333 FHcr"
              style="font-size: 14px"
              @click="showPops('showPoint', 0, 0, orderDetails[0].payShopListReqVo[0])"
            >
              <text>
                {{
                  orderDetails[0].payShopListReqVo[0].pointList &&
                  orderDetails[0].payShopListReqVo[0].pointList[
                    orderDetails[0].payShopListReqVo[0].pointInx
                  ].storeName
                    ? orderDetails[0].payShopListReqVo[0].pointList[
                        orderDetails[0].payShopListReqVo[0].pointInx
                      ].storeName
                    : '请选择自提点'
                }}
              </text>
              <wd-icon name="arrow-right" size="14px"></wd-icon>
            </view>
          </view>
        </view>
        <view class="bg-white border-rd-10px px-15px py-10px box-border w-full mb-10px">
          <view
            class="w-full flex justify-between items-center mt-0px"
            v-if="
              orderDetails[0].payShopListReqVo[0].deliveryMode === '0' ||
              orderDetails[0].payShopListReqVo[0].deliveryMode === 0
            "
          >
            <view
              class="bg-white border-rd-10px box-border w-full overflow-hidden"
              v-if="
                addressLists.length > 0 &&
                addressLists[orderDetails[0].payShopListReqVo[0].addressInx].userAddress
              "
              @click="showPops('showAddress', 0, 0, orderDetails[0].payShopListReqVo[0])"
            >
              <view style="width: 100%; font-size: 14px; color: #777777" class="add-detail mb-1">
                {{ addressLists[orderDetails[0].payShopListReqVo[0].addressInx].province }}
                {{ addressLists[orderDetails[0].payShopListReqVo[0].addressInx].city }}
                {{ addressLists[orderDetails[0].payShopListReqVo[0].addressInx].area }}
              </view>
              <view class="w-full flex items-center justify-between my-3px">
                <view
                  class="flex-1 add-detail"
                  style="width: 100%; font-size: 16px; font-weight: bold; color: #333"
                >
                  {{ addressLists[orderDetails[0].payShopListReqVo[0].addressInx].userAddress }}
                </view>
                <wd-icon name="arrow-right" size="22px" color="#000"></wd-icon>
              </view>
              <view style="width: 100%; font-size: 14px; color: #333" class="mt-1">
                {{ addressLists[orderDetails[0].payShopListReqVo[0].addressInx].userName }}
                {{ addressLists[orderDetails[0].payShopListReqVo[0].addressInx].userPhone }}
              </view>
            </view>

            <view v-else class="w-full flex justify-right items-center mt-0px text-right">
              <view
                class="w-full my-10px text-right text-14px"
                @click="showPops('showAddress', 0, 0, orderDetails[0].payShopListReqVo[0])"
              >
                请选择收货地址式
              </view>
              <wd-icon name="arrow-right" size="14px"></wd-icon>
            </view>
          </view>

          <view
            class="w-full flex justify-between items-center mt-0px"
            v-if="
              orderDetails[0].payShopListReqVo[0].deliveryMode === '1' ||
              orderDetails[0].payShopListReqVo[0].deliveryMode === 1
            "
          >
            <view class="labels">提货人姓名</view>
            <view class="color-#333" style="font-size: 14px">
              <view class="color-#333 F1" style="font-size: 14px">
                <wd-input
                  type="text"
                  v-model.trim="orderDetails[0].payShopListReqVo[0].receiverName"
                  :maxlength="20"
                  no-border
                  placeholder="提货人姓名"
                  custom-input-class="  text-right "
                  style="flex: 1; font-size: 14px; text-align: right"
                />
              </view>
            </view>
          </view>
          <view
            class="w-full flex justify-between items-center mt-0px"
            v-if="
              orderDetails[0].payShopListReqVo[0].deliveryMode === '1' ||
              orderDetails[0].payShopListReqVo[0].deliveryMode === 1
            "
          >
            <view class="labels">提货人手机号</view>
            <view class="color-#333" style="font-size: 14px">
              <view class="color-#333 F1" style="font-size: 14px">
                <wd-input
                  type="text"
                  v-model.trim="orderDetails[0].payShopListReqVo[0].receiverTel"
                  :maxlength="20"
                  no-border
                  placeholder="提货人手机号"
                  custom-input-class=" text-right "
                  style="flex: 1; font-size: 14px; text-align: right"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view
      class="pos-fixed pos-bottom-none flex w-full justify-between pt-10px pb-25px px-20px bg-#fff box-border items-center"
      :class="disCount ? 'z-999' : ''"
      style="z-index: 9"
    >
      <view class="flex flex-col">
        <view style="color: #f44d24" class="font-600">
          <text style="font-size: 14px">￥</text>
          {{ shijizhifuzonge.toFixed(2) }}
        </view>
      </view>
      <view>
        <wd-button
          @click="submitOrder"
          :round="false"
          custom-class="submit bg-#f44d24!"
          :loading="submiting"
        >
          提交订单
        </wd-button>
      </view>
    </view>

    <!--    //////////////////////-->
    <!--    //选择方式-->
    <wd-popup
      v-model="showMode"
      lock-scroll
      position="bottom"
      custom-class="pt-18px px-15px pb-25px box-border rounded-t-20px"
    >
      <view class="font-600 mb-20px px-15px">配送方式</view>

      <view class="overflow-y-auto max-h-60vh py-10px" v-if="orderDetails[level1]">
        <view
          class="flex py-10px"
          v-for="(key, ind) in deliveryLists"
          :key="ind"
          :style="
            getElected(orderDetails[level1].payShopListReqVo[level2].deliveryInx, ind)
              ? 'color:#f44d24'
              : 'color:#333'
          "
          @click="changePops('showMode', key, ind)"
        >
          <view class="flex-1 overflow-hidden">
            <view
              class="text-center w-full overflow-hidden font-size-16px line-height-36px"
              :style="!key.show ? ' opacity: 0.3;' : ''"
            >
              {{ key.name }}
            </view>
          </view>
        </view>
      </view>

      <view class="address-submit" @click="closePops()">确定</view>
    </wd-popup>
    <!--    //选择方式-->

    <!--    &lt;!&ndash; 提货 &ndash;&gt;-->
    <wd-popup
      v-model="showPoint"
      lock-scroll
      position="bottom"
      custom-class="pt-18px px-15px pb-25px box-border rounded-t-20px"
    >
      <view class="font-600 mb-20px px-15px">选择自提点</view>

      <view class="overflow-y-auto max-h-60vh py-10px pb-20px">
        <view
          class="flex pb-10px"
          v-for="(key, ind) in pointLists"
          :key="ind"
          @click="changePops('showPoint', key, ind)"
        >
          <view class="FHst">
            <view style="width: 30px; padding-left: 5px; margin-top: 1px; text-align: center">
              <view
                class="FScc"
                :style="
                  getElected(orderDetails[level1].payShopListReqVo[level2].pointInx, ind)
                    ? 'width:15px;height:15px;border-radius:100%;background:#f44d24'
                    : 'width: 15px;height: 15px;border-radius:100%;background:#f44d24;border: 1px solid #999;'
                "
              >
                <wd-icon
                  name="check-bold"
                  size="12px"
                  custom-style="margin-top:1px"
                  color="#fff"
                  v-if="getElected(orderDetails[level1].payShopListReqVo[level2].pointInx, ind)"
                ></wd-icon>
              </view>
            </view>
            <view class="flex-1 overflow-hidden">
              <view class="name w-full overflow-hidden" style="font-size: 16px; color: #000">
                {{ key.storeName }}
              </view>
              <view class="name w-full overflow-hidden mt-5px">
                <wd-icon name="location" size="12px" color="#999999"></wd-icon>
                <text style="margin-left: 2px; font-size: 12px; color: #999999">
                  {{ key.address }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="address-submit" @click="closePops()">确定</view>
    </wd-popup>
    <!-- 提货 -->
    <!-- 选择收货地址 -->
    <wd-popup
      v-model="showAddress"
      lock-scroll
      position="bottom"
      custom-class="pt-18px px-15px pb-25px box-border rounded-t-20px"
    >
      <view class="font-600 mb-10px">选择收货地址</view>
      <view class="FHcs mb-10px">
        <view class="mr-40px" style="font-size: 14px; color: #333">常用地址</view>
        <view class="mb-10px" @click="goAddress" style="font-size: 14px; color: #f44d24">
          +新建收货地址
        </view>
      </view>

      <view class="overflow-y-auto max-h-60vh py-10px pb-20px">
        <templete v-if="addressLists.length > 0">
          <view
            class="flex pb-10px mb-15px"
            v-for="(key, ind) in addressLists"
            style="
              padding: 15px;
              background: #f8f8f8;
              border: 1px solid #f0f0f0;
              border-radius: 7px 7px 7px 7px;
            "
            :key="ind"
            @click="changePops('showAddress', key, ind)"
          >
            <view class="FHst">
              <view style="width: 30px; padding-left: 5px; margin-top: 1px; text-align: center">
                <view
                  class="FScc"
                  :style="
                    getElected(orderDetails[level1].payShopListReqVo[level2].addressInx, ind)
                      ? 'width: 15px;height: 15px;border-radius:100%;background:#f44d24;border: 1px solid #f44d24;'
                      : 'width: 15px;height: 15px;border-radius:100%;background:#fff;border: 1px solid #999;'
                  "
                >
                  <wd-icon
                    name="check-bold"
                    size="12px"
                    custom-style="margin-top:1px"
                    color="#fff"
                    v-if="getElected(orderDetails[level1].payShopListReqVo[level2].addressInx, ind)"
                  ></wd-icon>
                </view>
              </view>
            </view>
            <view class="flex-1 overflow-hidden">
              <view
                style="width: 100%; margin-bottom: 5px; font-size: 14px; color: #888888"
                class="add-detail"
              >
                {{ key.province }} {{ key.city }} {{ key.area }}
              </view>
              <view class="w-full flex items-center justify-between py-5px">
                <view class="flex-1 add-detail" style="width: 100%; font-size: 16px; color: #000">
                  {{ key.userAddress }}
                </view>
              </view>
              <view style="margin-top: 5px; font-size: 14px; color: #000">
                {{ key.userName }} {{ key.userPhone }}
              </view>
            </view>
          </view>
        </templete>
        <wd-status-tip v-else image="content" tip="暂无内容" />
      </view>

      <view class="address-submit" @click="closePops()">确定</view>
    </wd-popup>
    <!-- 选择收货地址 -->

    <!--优惠券-->
    <!--    <wd-popup-->
    <!--      v-model="showAddress"-->
    <!--      lock-scroll-->
    <!--      position="bottom"-->
    <!--      custom-class="pt-18px px-15px pb-25px box-border rounded-t-20px"-->
    <!--    >-->
    <!--      <view class="font-600 mb-10px">可使用优惠券</view>-->

    <!--      <view class="overflow-y-auto max-h-60vh py-10px pb-20px">-->
    <!--        <templete v-if="addressLists.length > 0">-->
    <!--          <view-->
    <!--            class="flex pb-10px mb-15px"-->
    <!--            v-for="(key, ind) in addressLists"-->
    <!--            style="-->
    <!--              padding: 15px;-->
    <!--              background: #f8f8f8;-->
    <!--              border: 1px solid #f0f0f0;-->
    <!--              border-radius: 7px 7px 7px 7px;-->
    <!--            "-->
    <!--            :key="ind"-->
    <!--            @click="changePops('showAddress', key, ind)"-->
    <!--          >-->
    <!--            <view class="FHst">-->
    <!--              <view style="width: 30px; padding-left: 5px; margin-top: 1px; text-align: center">-->
    <!--                <view-->
    <!--                  class="FScc"-->
    <!--                  :style="-->
    <!--                    getElected(orderDetails[level1].payShopListReqVo[level2].addressInx, ind)-->
    <!--                      ? 'width: 15px;height: 15px;border-radius:100%;background:#f44d24;border: 1px solid #f44d24;'-->
    <!--                      : 'width: 15px;height: 15px;border-radius:100%;background:#fff;border: 1px solid #999;'-->
    <!--                  "-->
    <!--                >-->
    <!--                  <wd-icon-->
    <!--                    name="check-bold"-->
    <!--                    size="12px"-->
    <!--                    custom-style="margin-top:1px"-->
    <!--                    color="#fff"-->
    <!--                    v-if="getElected(orderDetails[level1].payShopListReqVo[level2].addressInx, ind)"-->
    <!--                  ></wd-icon>-->
    <!--                </view>-->
    <!--              </view>-->
    <!--            </view>-->
    <!--          </view>-->
    <!--        </templete>-->
    <!--        <wd-status-tip v-else image="content" tip="暂无内容" />-->
    <!--      </view>-->

    <!--      <view class="address-submit" @click="closePops()">确定</view>-->
    <!--    </wd-popup>-->
    <!--优惠券-->

    <!--    //////////////////////-->
  </view>
</template>

<style lang="less" scoped>
:deep(.wd-input-number__action) {
  background: #f0f2f7;
}

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
  width: 100%;
  margin: 0px 0 20px 0;
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

.noUse {
  text-align: center;
  padding: 10px;
  color: #999;
  border: 1px solid #cecece;
  border-radius: 5px;
  font-size: 14px;
}

.yUse {
  text-align: center;
  padding: 10px;
  color: #fff;
  border: 1px solid #4bbefd;
  border-radius: 5px;
  font-size: 14px;
  background-color: #4bbefd;
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
</style>
<style lang="scss" scoped>
.coupon {
  $c: #ffc4a6;
  position: relative;
  box-sizing: border-box;
  width: 100%;

  padding: 17px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }

  image {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  & > view {
    position: relative;
    z-index: 2;
  }

  .flex {
    display: flex;
  }

  .flex-c {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
  }

  .flex-h {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .coupon_title {
    margin-bottom: 4px;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }

  .effect_time {
    margin-bottom: 4px;
    font-size: 12px;
    color: $c;
  }

  .operate {
    display: flex;
    align-items: center;

    .receive_btn {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 25px;
      font-size: 13px;
      color: $c;
      border: 1px solid #fff;
      border-radius: 13px;
    }

    .desc {
      margin-left: 20px;
      font-size: 12px;
      color: #fff6da;
    }
  }

  .amount {
    display: flex;
    flex-direction: column;
    align-items: center;

    .reduct {
      font-size: 32px;
      font-weight: bold;
      color: #ff4345;
    }

    .reduct_desc {
      font-size: 12px;
      color: #666;
      text-indent: 5px;
    }
  }
}

.unact {
  opacity: 0.4;
}

.active {
  opacity: 1;
}

.labels {
  font-size: 14px;
  font-weight: 400;
  line-height: 44px;
  color: #000000;
  text-align: left;
}

.vals {
  font-size: 14px;
  font-weight: 600;
  line-height: 44px;
  color: #000000;
  text-align: right;
}

.red {
  color: #ff4345;
}
</style>
