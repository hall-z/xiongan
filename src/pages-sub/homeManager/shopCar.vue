<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'default',
  realNameAuthentication: true,
  style: {
    navigationBarTitleText: '购物车',
    backgroundColor: '#fff',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  },
}
</route>
<script lang="ts" setup>
import { delCart, shopCarList } from '@/service/api/shop'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import { useToast } from 'wot-design-uni'

const toast = useToast()
const paging = ref(null)
const allValue = ref(false)
const goodList = ref([])
const total = ref()
const changeArr = ref<any>([])
const userStore = useUserStore()
const isManage = ref(false)

const submitData = ref([])
const totalPrice = ref(0)

// 计算价格
const getTotalPrice = () => {
  totalPrice.value = 0
  goodList.value.forEach((item) => {
    item.shopCartProductResp.forEach((it) => {
      if (it.isCheck) {
        console.log('价格', it.sellingPrice * it.itemNum)
        totalPrice.value += Math.floor(it.sellingPrice * it.itemNum * 1000) / 1000
      }
    })
  })
  console.log('🍺', changeArr.value)
}
const handleShop = ({ value }, id) => {
  changeArr.value.length = 0

  if (id === 'all') {
    goodList.value.forEach((el) => {
      el.isCheck = value
      el.shopCartProductResp.forEach((key) => {
        key.isCheck = value
        if (value) {
          changeArr.value.push({
            shopId: el.shopId,
            shopCartId: key.shopCartId,
          })
        } else {
          changeArr.value.length = 0
        }
      })
    })
    allValue.value = value
  } else {
    goodList.value.forEach((el) => {
      console.log('🍚[el]:', el)
      if (el.shopId === id) {
        console.log('🍼️')
        el.isCheck = value
        el.shopCartProductResp.forEach((key) => {
          if (key.stock > 0) {
            key.isCheck = value
            if (value) {
              changeArr.value.push({
                shopId: el.shopId,
                shopCartId: key.shopCartId,
              })
            } else {
              changeArr.value = changeArr.value.filter((item) => item.shopCartId !== key.shopCartId)
            }
          } else {
            key.isCheck = false

            changeArr.value = changeArr.value.filter((item) => item.shopCartId !== key.shopCartId)
          }
        })
      } else {
        console.log('🍊[   ---     ]:')
      }
    })
    allValue.value = goodList.value.every((item) => item.isCheck === true)
  }
  getTotalPrice()
}
const goDetails = (type, id) => {
  if (isManage.value) {
    return false
  } else {
    if (type === 'shop') {
      routeTo({ url: '/pages-sub/shopManager/shopHome', data: { id } })
    } else {
      routeTo({ url: '/pages-sub/homeManager/shopInfo', data: { id } })
    }
  }
}
const deleteCart = async () => {
  const arrList = []
  goodList.value.forEach((el) => {
    el.shopCartProductResp.forEach((it) => {
      if (it.isCheck) {
        const obj = {
          shopCartId: it.shopCartId,
          shopId: el.shopId,
        }
        arrList.push(obj)
      }
    })
  })
  if (arrList.length === 0) {
    Toast('请选择要删除的商品')
    return
  }
  try {
    const res = await delCart({
      shopCartIds: arrList.map((item) => item.shopCartId),
    })
    Toast('删除成功')
    arrList.length <= total.value ? (allValue.value = false) : (allValue.value = true)
    arrList.length = 0
    paging.value.reload()
    totalPrice.value = 0
  } catch {
    console.log('???')
  }
}
const handleGood = ({ value }, id) => {
  goodList.value.forEach((el) => {
    el.shopCartProductResp.forEach((key) => {
      if (key.shopCartId === id) {
        key.isCheck = value
        if (value) {
          changeArr.value.push({
            shopId: el.shopId,
            shopCartId: id,
          })
        } else {
          changeArr.value = changeArr.value.filter((item) => item.shopCartId !== id)
          allValue.value = false
        }
      }
    })
    const status = el.shopCartProductResp.every((it) => it.isCheck)
    if (status) {
      el.isCheck = true
    } else {
      el.isCheck = false
    }
    allValue.value = total.value === changeArr.value.length
  })
  getTotalPrice()
  console.log('???', changeArr.value.length)
}

const goSubmitOrder = () => {
  let N = 0

  goodList.value.forEach((it, idx) => {
    it.shopCartProductResp.forEach((e) => {
      if (e.isCheck) {
        N = N + 1
      }
    })
  })

  if (N === 0) {
    toast.warning('未选择任何商品')
  } else if (N > 20) {
    toast.warning('单次下单商品数不能超过20件')
  } else {
    submitData.value = []
    console.log('goodList', goodList)

    goodList.value.forEach((it, idx) => {
      const temp = {
        shopId: it.shopId,
        shopName: it.shopName,
        shopAvatar: it.shopAvatar,
        merchantId: it.merchantId,
        orderResource: 2, //  订单来源 1web  2 小程序
        payShopListReqVo: [],
      }
      it.shopCartProductResp.forEach((im, index) => {
        if (im.isCheck && !im.disabled) {
          const json = JSON.parse(im.cartData)
          temp.payShopListReqVo.push({
            spuId: im.spuId,
            skuId: im.skuId,
            image: getUrl(im.rotationUrl),
            skuName: im.skuName,
            cartData: im.cartData,
            spuNum: im.itemNum,
            spuName: im.spuName,
            price: im.sellingPrice,
            shopCartId: im.shopCartId,
            /// //
            buy_num: im.itemNum,
            goods_id: im.spuId,
            stock: json.stock,
            spuType: json.spuType,
            couponInfo: json.couponInfo,
            deliveryMode: json.deliveryMode,
            pointList: json.pointList,
            pointInx: json.pointInx,
            deliveryInx: json.deliveryInx,
            addressInx: json.addressInx,
            logisticsType: json.logisticsType, // 配送方式  0: 快递配送 ,1: 上门自提 ,2: 同城配送
            receiveAddrId: json.receiveAddrId,
            receiverName: json.receiverName,
            receiverTel: json.receiverTel,
            deliveryAmount: json.deliveryAmount,
            orderNote: json.orderNote,
          })
        }
      })
      if (temp.payShopListReqVo.length > 0) {
        submitData.value.push(temp)
      }
    })

    routeTo({ url: '/pages-sub/homeManager/orderC?obj=' + JSON.stringify(submitData.value) })
    console.log('submitData.value', submitData.value)
  }
}
const getLsit = async (pageNo: number, pageSize: number) => {
  try {
    const res: any = await shopCarList({
      customerId: userStore.userInfo.userDId,
      current: pageNo,
      size: pageSize,
    })

    res.forEach((el) => {
      el.isCheck = false
      el.disabled = false
      el.shopCartProductResp.forEach((key) => {
        key.isCheck = false
        key.disabled = false
        key.skuName = Object.values(JSON.parse(key.skuName)).join(',')
        key.skuUrl = JSON.parse(key.skuUrl)[0].data
      })
    })
    console.log('购物车列表i', res)
    /* total.value = res.reduce((a, b) => {
      const num = b.shopCartProductResp.reduce((c, d) => {
        return c + d.itemNum
      }, 0)
      return a + num
    }, 0) */

    total.value = res.reduce((a, b) => {
      return a + b.shopCartProductResp.length
    }, 0)
    paging.value.complete(res)
  } catch {
    console.log('????')
    paging.value.complete(false)
  }
}
const getUrl = (str) => {
  if (str) {
    return JSON.parse(str)[0].data
  } else {
    return ''
  }
}

function changer() {
  isManage.value = !isManage.value

  goodList.value.forEach((el) => {
    el.isCheck = false
    el.shopCartProductResp.forEach((key) => {
      key.isCheck = false
    })
  })

  changeArr.value = []

  getTotalPrice()
}

function idCheckedNumber(data) {
  return data
    .filter((it) => it.isCheck)
    .map((it) => it.itemNum)
    .reduce((acc, cur) => acc + cur, 0)
}

const selctTotal = computed(() => {
  const list = goodList.value.map((i) => i.shopCartProductResp).flat(1)
  console.log('🥥[a]====:', list)

  return idCheckedNumber(list) ?? 0
})
onShow(() => {
  if (paging.value) {
    paging.value.reload()
  }
  totalPrice.value = 0
  submitData.value = []
  changeArr.value = []
  allValue.value = false
})
</script>
<template>
  <z-paging ref="paging" v-model="goodList" @query="getLsit">
    <template #top>
      <view class="w-full font-600 flex items-center justify-between px-20px box-border bg-white">
        <view class="line-height-50px">购物车数量({{ total ? total : 0 }})</view>
        <view>
          <text style="margin-right: 10px; color: #f44d24" v-if="isManage" @click="deleteCart">
            删除
          </text>
          <text @click="changer">{{ isManage ? '退出管理' : '管理' }}</text>
        </view>
      </view>
    </template>
    <view class="p-10px">
      <view
        class="bg-white border-rd-10px p-15px box-border w-full mb-15px"
        v-for="item in goodList"
        :key="item.shopId"
      >
        <div class="flex items-center">
          <wd-checkbox
            v-model="item.isCheck"
            :disabled="isManage ? false : item.disabled"
            @change="handleShop($event, item.shopId)"
          ></wd-checkbox>
          <view class="flex items-center" @click="goDetails('shop', item.shopId)">
            <wd-img :width="30" :height="30" round :src="item.shopAvatar" />
            <view class="ml-1">{{ item.shopName }}</view>
            <wd-icon name="arrow-right" size="20px" color=""></wd-icon>
          </view>
        </div>

        <view
          class="w-full mt-15px flex"
          v-for="it in item.shopCartProductResp"
          :key="it.spuId"
          :class="it.stock === 0 ? 'dis' : ''"
        >
          <view class="flex items-center">
            <wd-checkbox
              v-model="it.isCheck"
              :disabled="isManage ? false : it.stock === 0"
              @change="handleGood($event, it.shopCartId)"
            ></wd-checkbox>
          </view>
          <wd-img
            :width="105"
            :height="95"
            :src="getUrl(it.rotationUrl)"
            custom-class="img"
            mode="aspectFit"
          />
          <view
            class="ml-15px flex-1 flex flex-col justify-between"
            @click="goDetails('goods', it.spuId)"
          >
            <view class="w-190px name">{{ it.spuName }}</view>
            <view style="font-size: 14px; color: #757575">{{ it.skuName }}</view>

            <view class="w-full flex justify-between">
              <view class="flex items-center">
                <text style="font-size: 12px; color: #f44d24">￥</text>
                <text style="font-size: 18px; color: #f44d24">{{ it.sellingPrice }}</text>
                <text style="margin-left: 2px; font-size: 12px; color: #999">/件</text>
              </view>
              <view class="num px-5px text-center" style="font-size: 12px">
                x {{ it.itemNum }}件
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <template #bottom>
      <view
        v-if="!isManage"
        class="bg-white h-80px pos-bottom-none flex w-full justify-between px-15px box-border items-center"
      >
        <wd-checkbox v-model="allValue" @change="handleShop($event, 'all')">全选</wd-checkbox>
        <view class="flex items-center">
          <view class="flex items-center" style="font-size: 14px">
            合计：
            <view style="color: #f44d24">
              <text style="font-size: 12px">￥</text>
              <text style="font-size: 18px">{{ totalPrice.toFixed(2) }}</text>
            </view>
          </view>
          <view class="submit" @click="goSubmitOrder">
            结算
            <text style="font-size: 12px">
              ({{ selctTotal > 999 ? '999+件' : selctTotal + '件' }})
            </text>
          </view>
        </view>
      </view>
    </template>
  </z-paging>
</template>
<style>
page {
  background-color: #f5f5f5;
}
</style>
<style>
.submit {
  width: 103px;
  margin-left: 20px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  background: #f44d24;
  border-radius: 6px 6px 6px 6px;
}

.img {
  display: inline-block;
  overflow: hidden !important;
  border-radius: 5px;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.num {
  padding-right: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: 25px;
  /*width: 30px;*/
  /*text-align: left;*/
  /*text-align: left;*/
  color: #999;
  background: #ffffff;
  /*border: 1px solid rgba(0,0,0,0.1);*/
  /*border-radius: 5px 5px 5px 5px;*/
}

.dis {
  filter: grayscale(100%);
}
</style>
