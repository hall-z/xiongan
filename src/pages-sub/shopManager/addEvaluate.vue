<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'default',

  style: {
    navigationBarTitleText: '评价',
    backgroundColor: '#fff',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  },
}
</route>
<script lang="ts" setup>
import { evaluationAdd, getOrderInfo } from '@/service/api/shop'
import { Toast } from '@/utils/uniapi/prompt'
import { useToast } from 'wot-design-uni/index'

const toast = useToast()
const orderDetails = ref({})
const formData = ref({
  orderId: '',
  productScore: 5,
  serveScore: 5,
  logisticsScore: 5,
  evaluationContent: '',
  evaluationImg: '',
  specification: '',
  productName: '',
  spuId: '',
})
const changeText = (type: number) => {
  console.log('type', type)
  switch (type) {
    case 1:
      formData.value.evaluationContent +=
        formData.value.evaluationContent.trim() === '' ? '配件问题：' : '\n配件问题：'
      break
    case 2:
      formData.value.evaluationContent +=
        formData.value.evaluationContent.trim() === '' ? '包装品质：' : '\n包装品质：'
      break
    case 3:
      formData.value.evaluationContent +=
        formData.value.evaluationContent.trim() === '' ? '外观品相：' : '\n外观品相：'
      break
    case 4:
      formData.value.evaluationContent +=
        formData.value.evaluationContent.trim() === '' ? '触摸手感：' : '\n触摸手感：'
      break
    default:
      break
  }
}
const handleChange = () => {}

// 内容校验
const isNotText = (input: string) => {
  if (!input) return false
  const regex = /^[a-zA-Z0-9\u4e00-\u9fa5，。：,.:\r\n]+$/
  return regex.test(input)
}
const submit = async () => {
  if (!formData.value.evaluationContent) {
    toast.show('请输入评价内容!')
    return
  }

  const res = await evaluationAdd(formData.value)
  console.log('发布评价', res)
  Toast('评价成功')
  setTimeout(() => {
    uni.navigateBack()
    // uni.redirectTo({ url: '/pages-sub/order/orderList' })
  }, 1500)
}
onLoad(async (options) => {
  console.log('传参', options)
  formData.value.orderId = options.orderId
  getOrderInfo({ orderId: options.orderId }).then((res) => {
    console.log('订单详情', res)
    res.sysOrderItemBeans.forEach((it) => {
      it.skuUrl = JSON.parse(it.skuUrl)[0].data
      it.skuName = Object.values(JSON.parse(it.skuName)).join(' ')
    })
    formData.value.specification = res.sysOrderItemBeans.map((it) => it.skuName).join(',')
    formData.value.productName = res.sysOrderItemBeans.map((it) => it.productName).join(',')
    formData.value.spuId = res.sysOrderItemBeans.map((it) => it.productSpuId).join(',')
    orderDetails.value = res
  })
})
</script>
<template>
  <view class="w-full h-100vh flex flex-col bg-#F3F4F8 box-border">
    <view class="flex-1 my-12px mx-12px overscroll-y-auto">
      <!-- 商品信息 -->
      <view class="bg-white w-full p-12px box-border border-rd-10px mb-10px">
        <view>
          <wd-text text="订单编号：" color="#333333" size="12px"></wd-text>
          <wd-text :text="orderDetails.orderId" color="#333333" size="12px"></wd-text>
        </view>
        <view
          class="w-full flex mt-12px"
          v-for="item in orderDetails.sysOrderItemBeans"
          :key="item.orderId"
        >
          <wd-img :src="item.skuUrl" :width="100" :height="100" radius="5px"></wd-img>
          <view class="ml-12px flex-1 flex flex-col justify-between">
            <view>
              <wd-text :text="item.productName" :lines="2" size="14px" color="#333333"></wd-text>
              <view class="w-full flex items-center justify-between mt-5px">
                <wd-text :text="item.skuName" size="12px" color="#999999"></wd-text>
                <wd-text :text="item.productSkuCount" size="12px" color="#999999"></wd-text>
              </view>
            </view>
            <view class="w-full flex items-center justify-end">
              <wd-text text="金额：" size="12px" color="#333333"></wd-text>
              <wd-text text="￥" size="12px" color="#EA4455"></wd-text>
              <wd-text :text="item.skuSellingPrice" size="16px" bold color="#EA4455"></wd-text>
            </view>
          </view>
        </view>
      </view>

      <!-- 上传  -->
      <view class="bg-white w-full p-12px box-border border-rd-10px mb-10px">
        <dy-upload v-model="formData.evaluationImg" :limit="9">
          <view class="w-full h-full flex flex-col item-center justify-center">
            <wd-icon
              name="camera"
              size="30px"
              color="#333333"
              custom-class="mb-15px text-center"
            ></wd-icon>
            <wd-text
              text="添加视频/图片"
              color="#333333"
              bold
              size="14px"
              custom-class="text-center"
            ></wd-text>
          </view>
        </dy-upload>
      </view>
      <!-- 评价 -->
      <view class="bg-white w-full p-12px box-border border-rd-10px mb-10px">
        <view class="w-full flex justify-between">
          <view
            class="w-80px line-height-28px color-#999999 bg-#F6F6F6 font-size-14px text-center border-rd-50px"
            style="border: 1px dotted #999"
            @click="changeText(1)"
          >
            配件问题
          </view>
          <view
            class="w-80px line-height-28px color-#999999 bg-#F6F6F6 font-size-14px text-center border-rd-50px"
            style="border: 1px dotted #999"
            @click="changeText(2)"
          >
            包装品质
          </view>
          <view
            class="w-80px line-height-28px color-#999999 bg-#F6F6F6 font-size-14px text-center border-rd-50px"
            style="border: 1px dotted #999"
            @click="changeText(3)"
          >
            外观品相
          </view>
          <view
            class="w-80px line-height-28px color-#999999 bg-#F6F6F6 font-size-14px text-center border-rd-50px"
            style="border: 1px dotted #999"
            @click="changeText(4)"
          >
            触摸手感
          </view>
        </view>
        <wd-textarea
          v-model.trim="formData.evaluationContent"
          placeholder="展开说说对商品的想法吧…"
          :placeholder-color="'#999999'"
          :maxlength="200"
          :show-word-limit="true"
          no-border
        />
      </view>
      <!-- 评分 -->
      <view class="bg-white w-full p-12px box-border border-rd-10px">
        <view class="w-full flex">
          <wd-text text="商品评价" color="#000000" bold size="14px"></wd-text>
          <wd-rate
            v-model="formData.productScore"
            @change="handleChange"
            size="14px"
            custom-class="ml-12px"
          />
        </view>
        <view class="w-full flex my-10px">
          <wd-text text="物流服务" color="#000000" bold size="14px"></wd-text>
          <wd-rate
            v-model="formData.serveScore"
            @change="handleChange"
            size="14px"
            custom-class="ml-12px"
          />
        </view>
        <view class="w-full flex">
          <wd-text text="服务态度" color="#000000" bold size="14px"></wd-text>
          <wd-rate
            v-model="formData.logisticsScore"
            @change="handleChange"
            size="14px"
            custom-class="ml-12px"
          />
        </view>
      </view>
    </view>

    <view class="w-full bg-white h-56px px-12px py-6px box-border">
      <view
        class="w-full h-full color-white bg-#F54F25 border-rd-50px flex items-center justify-center font-600"
        style="height: 44px"
        @click="submit"
      >
        发布
      </view>
    </view>
  </view>
</template>

<style></style>
