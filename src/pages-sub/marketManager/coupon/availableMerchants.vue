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
import { getAvailableMerchantList } from '@/service/api/userMessage'
import { useRequest } from 'alova/client'
import { StockMerchants } from './utils/types'

const title = ref('可用商户')
const paging = ref(null)
const stockId = ref('')
const listData = ref([])
// const {data: listData} = useRequest((data) => getAvailableMerchantList<StockMerchants>(data), {
//   immediate: true,
//   loading: false,
//   initialData: {},
//   middleware: async (ctx, next) => {
//     const result = (await next()) as any
//     return result!.data as StockMerchants
//   },
// })
//   .onSuccess((res) => {
//     console.log('🍖[res]:', res)
//   })
//   .onError((err) => {
//     console.log('🍖[err]:', err)
//   })

const queryList = async (pageNo: number, pageSize: number) => {
  const params = {
    page: pageNo,
    size: pageSize,
  }
  // 调用接口获取数据
  try {
    paging.value.complete(listData.value ?? [])
  } catch (error) {
    paging.value.complete(false)
  }
}

const handShow = (index: number) => {
  if (listData.value[index]?.secondaryStores?.length > 0) {
    listData.value[index].off = !listData.value[index].off
  }
}

onLoad((options) => {
  console.log('🍖[options]:', options)
  stockId.value = options?.id ?? ''

  if (stockId.value) {
    // listData.value =
    getAvailableMerchantList({ stockId: stockId.value }).then((e) => {
      if (e.data.data[0] && e.data.data[0] !== undefined) {
        listData.value = e.data.data[0].levelStores
      } else {
        listData.value = []
      }
    })
  } else {
    listData.value = []
  }
})
</script>

<template>
  <z-paging
    ref="paging"
    v-model="listData"
    @query="queryList"
    :auto-show-system-loading="true"
    bg-color="#F5F5F5"
    :auto="false"
    :refresher-enabled="false"
    :loading-more-enabled="false"
  >
    <template #top>
      <dy-navbar :leftTitle="title" left></dy-navbar>
    </template>
    <view class="p-10px" v-if="listData.length > 0">
      <view v-for="(item, index) in listData" :key="index" class="relative mb-10px">
        <view class="p-10px bg-#fff rounded-10px">
          <view class="flex justify-between" @click="handShow(index)" hover-class="bg-#f5f5f5">
            <view class="text-16px color-#333 truncate-1">
              {{ item && item.storeName ? item.storeName : '' }}
            </view>
            <view v-if="item.secondaryStores" class="pl-50px">
              <wd-icon
                :name="item.off ? 'arrow-down' : 'arrow-right'"
                color="#999"
                size="18px"
              ></wd-icon>
            </view>
          </view>
        </view>
        <view class="p-10px my-10px bg-#fff rounded-10px" v-if="item.off">
          <view
            v-for="(item2, index2) in item.secondaryStores"
            :key="index2"
            class="my-5px px-10px"
          >
            <view class="text-14px my-10px color-#333">
              {{ item2 && item2.storeName ? item2.storeName : '' }}
            </view>
            <view class="text-#999 text-12px my-10px" v-if="item2.storeAddress">
              地址：{{ item2.storeAddress }}
            </view>
            <wd-gap
              bg-color="#f5f5f5"
              height="1px"
              v-if="index2 < item.secondaryStores.length - 1"
            ></wd-gap>
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped></style>
