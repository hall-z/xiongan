import { addressList } from '@/service/api/address'
import { getActivityList, getPickUpStoreByMerchantId, submitOrder } from '@/service/api/shop'
import { routeTo } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import { useRequest } from 'alova/client'
import { useBaseStore } from '@/store'
const baseStore = useBaseStore()
const orderDetails = ref<any>([])
const checkShop = ref(null)
const shopAdsList = ref<any>([])
const selfAdsList = ref<any>([{ username: '', userphone: '' }])
const couponList = ref<any>([])
const shopExtractList = ref<any>([])
const showPop = reactive({
  showDeliveryMode: false,
  isExtract: false,
  addList: false,
})
const isExtractList = ref<any>([])
const adsList = ref<any>([])
const actions = ref<Array<any>>([
  {
    id: 0,
    name: '快递配送',
  },
  {
    id: 1,
    name: '上门自提',
  },
  // {
  //   name: '同城配送',
  // },
])

const submit = () => {
  uni.showLoading({ title: '订单提交中...' })

  let fl = true
  orderDetails.value.forEach((item, idx) => {
    if (item.deliveryMode !== '1') {
      if (!shopAdsList.value[idx]) {
        fl = false
      } else {
        // orderDetails.value[idx].receiveAddrId = selfAdsList.value[idx].id
        orderDetails.value[idx].receiverName = ''
        orderDetails.value[idx].receiverTel = ''
        orderDetails.value[idx].pickUpPoint = ''
      }
    }
    if (item.deliveryMode === '1') {
      if (!selfAdsList.value[idx].username || !selfAdsList.value[idx].userphone) {
        fl = false
      } else if (!shopExtractList.value[idx].storeName) {
        fl = false
      } else if (
        selfAdsList.value[idx].userphone &&
        !/^1[3-9]\d{9}$/.test(selfAdsList.value[idx].userphone)
      ) {
        fl = false
      } else {
        // orderDetails.value[idx].receiveAddrId = ''
        orderDetails.value[idx].receiverName = selfAdsList.value[idx].username
        orderDetails.value[idx].receiverTel = selfAdsList.value[idx].userphone
        orderDetails.value[idx].pickUpPoint = JSON.stringify(shopExtractList.value[idx])
      }
    }
  })

  if (fl) {
    orderDetails.value.forEach((it, index) => {
      it.receiveId = couponList.value[index].id ? couponList.value[index].id : ''
      it.couponId = couponList.value[index].cid ? couponList.value[index].cid : ''
    })
    const arr = []

    orderDetails.value[0].payShopListReqVo.forEach((it, index) => {
      if (it.shopCartId) {
        arr.push(it.shopCartId)
      }
    })
    orderDetails.value[0].shopCartIds = arr

    // orderDetails.value[0].deliveryMode=Number(orderDetails.value[0].deliveryMode)

    submitOrder({
      xcxPaymentReqVos: orderDetails.value,
      shopCartIds: arr,
    }).then((res: any) => {
      // console.log('resresresresresresresresresresresres', res.bizOrderNo)
      uni.hideLoading()
      routeTo({
        url: '/pages-sub/order/orderInfo?id=' + res.bizOrderNo,
      })
    })
  } else {
    uni.hideLoading()
    Toast('请完善配送地址和自提门店')
  }
}
const getAdsList = async (data) => {
  shopAdsList.value = []
  selfAdsList.value = []
  adsList.value = await addressList({})
  if (adsList.value.length > 0) {
    adsList.value.forEach((element) => {
      element.isCheck = !!element.isDefault
    })
    let obj = adsList.value.find((it) => it.isDefault)
    if (!obj) {
      obj = adsList.value[0]
    }

    orderDetails.value.forEach((it) => {
      shopAdsList.value.push(obj)
      selfAdsList.value.push({ username: '', userphone: '' })
      shopExtractList.value.push('请选择门店')
      it.receiveAddrId = obj.id
    })
  } else {
    orderDetails.value.forEach((it) => {
      const obj = adsList.value.find((it) => it.isDefault)
      shopAdsList.value.push(obj)
      selfAdsList.value.push({ username: '', userphone: '' })
      shopExtractList.value.push('请选择门店')
      it.receiveAddrId = ''
    })
  }

  if (data) {
    shopAdsList.value[0] = JSON.parse(data)
    orderDetails.value[0].receiveAddrId = JSON.parse(data).id
  }
  console.log('shopAdsList', shopAdsList)
}

const handleChange = ({ value }, id, key) => {
  console.log(value, id, key)
  if (key === 'isExtractList') {
    isExtractList.value.forEach((element) => {
      if (element.id === id) {
        element.isCheck = value
      } else {
        element.isCheck = !value
      }
    })
  } else {
    adsList.value.forEach((element) => {
      if (element.id === id) {
        element.isCheck = value
      } else {
        element.isCheck = !value
      }
    })
  }
}
const checkAddress = (idx) => {
  showPop.addList = true
  checkShop.value = idx
}
const checkExtract = (key) => {
  if (key === 'isExtractList') {
    const obj = isExtractList.value.find((it) => it.isCheck)
    orderDetails.value[checkShop.value].receiveAddrId = obj.id
    shopExtractList.value[checkShop.value] = obj
    showPop.isExtract = false
  } else {
    const obj = adsList.value.find((it) => it.isCheck)
    shopAdsList.value[checkShop.value] = obj
    orderDetails.value[checkShop.value].receiveAddrId = obj.id
    showPop.addList = false
  }
}
const checkDriver = async (key, idx) => {
  if (key === 'isExtract') {
    if (isExtractList.value.length <= 0) {
      isExtractList.value = await getPickUpStoreByMerchantId({
        shopId: orderDetails.value[idx].shopId,
        latitude: baseStore.userLocation.latitude ? baseStore.userLocation.latitude : '',
        longitude: baseStore.userLocation.longitude ? baseStore.userLocation.longitude : '',
      })
      isExtractList.value.forEach((element) => {
        element.isCheck = false
      })
    }
    console.log(isExtractList.value)
  }
  showPop[key] = true
  checkShop.value = idx
}

const deliveryIndex = ref(0)
const select = (e) => {
  deliveryIndex.value = e.current
  orderDetails.value[checkShop.value].deliveryMode = e.index + ''
  showPop.showDeliveryMode = false
}

const { send: sendGetActivityList } = useRequest(
  (params: ActivityParams) => getActivityList<IPaginationData<IActivityBanner>>(params),
  {
    immediate: false,
    loading: true,
  },
)

export default () => {
  return {
    routeTo,
    Toast,
    actions,
    showPop,
    checkDriver,
    select,
    orderDetails,
    isExtractList,
    handleChange,
    adsList,
    checkExtract,
    getAdsList,
    submit,
    checkAddress,
    shopAdsList,
    selfAdsList,
    shopExtractList,
    sendGetActivityList,
    deliveryIndex,
    couponList,
  }
}
