<route lang="json5">
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
import { addressList, addressListDel } from '@/service/api/address'
import { useMessage } from 'wot-design-uni'
import useAddress from './utils/useAddress'

const { routeTo, Toast } = useAddress()
const message = useMessage()

const title = ref('收货地址')

const paging = ref(null)
const dataList = ref([])
const queryList = async (pageNo, pageSize) => {
  const params = {
    page: pageNo,
    size: pageSize,
  }
  // 调用接口获取数据
  try {
    const data: any = await addressList(params)
    console.log('🍛[data]:', data)
    // dataList.value = data.content
    paging.value.complete(data)
    // paging.value.complete([])
  } catch (error) {
    paging.value.complete(false)
  }
}
const checkAds = (itm) => {
  if (!itm) {
    uni.$emit('getParams', false)
    uni.navigateBack({
      delta: 1, // 返回上一级页面。
    })
  } else {
    const pageList = getCurrentPages()
    if (pageList[pageList.length - 2].route === 'pages-sub/homeManager/order') {
      const prevPage = pageList[pageList.length - 2]

      // prevPage.$vm.getParams(itm)
      uni.$emit('getParams', JSON.stringify(itm))
      uni.navigateBack({
        delta: 1, // 返回上一级页面。
      })
      // console.log('pageList', pageList)
    }
  }
}
onShow(async () => {
  await nextTick()
  paging.value.reload()
})
const back = () => {
  dataList.value.length === 1 ? checkAds() : checkAds()
}
const delAdderss = (id: string) => {
  message
    .confirm({
      msg: '是否删除这条收货地址？',
      title: '提示',
    })
    .then(async () => {
      try {
        await addressListDel({ id })
        Toast('删除成功')
        paging.value.reload()
      } catch (error) {
        console.log('error', error)
      }
    })
    .catch(() => {
      console.log('点击了取消按钮')
    })
}

function addAddress() {
  routeTo({
    url: '/pages-sub/userManager/address/editor',
    data: {
      type: 'add',
    },
  })
}

// 返回携带的参数
function selectAddress(item) {
  // TODO:本地存储
  // routeTo({
  //   url: '/pages-sub/userManager/address/editor',
  //   data: item,
  // })
}

function actioAddress(item, type) {
  routeTo({
    url: '/pages-sub/userManager/address/editor',
    data: {
      item: JSON.stringify(item),
      type,
    },
  })
}
</script>
<template>
  <z-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    class="bg-#f5f5f5"
    :auto="false"
    :refresher-enabled="false"
    :paging-style="{ 'background-color': '#F7F7F7', 'box-sizing': 'border-box', padding: '20px' }"
    :loading-more-enabled="false"
  >
    <template #top>
      <dy-navbar :leftTitle="title" left @back="back" :back="false"></dy-navbar>
    </template>
    <view class="mt-10px">
      <view
        class="mb-10px rounded-8px overflow-hidden"
        v-for="(item, index) in dataList"
        :key="index"
        @click="checkAds(item)"
      >
        <wd-cell title-width="75%" center clickable @click="selectAddress(item)">
          <template #title>
            <view class="truncate-2 color-#000 flex! items-center gap-10px justify-start!">
              <view mark v-if="item.isDefault">
                <wd-tag type="danger">默认</wd-tag>
              </view>
              <text>
                {{ item.userName }}
              </text>
              <text class="#999">
                {{ item.userPhone }}
              </text>
            </view>
          </template>
          <template #label>
            <view class="color-#999 truncate-2">
              地址:{{ item.province }} {{ item.city }} {{ item.area }} {{ item.userAddress }}
            </view>
          </template>
          <view class="flex justify-between items-center gap-10px">
            <view
              class="rounded-full size-30px bg-#f5f5f5 text-center flex justify-center items-center"
              @click.stop="actioAddress(item, 'edit')"
            >
              <wd-icon name="edit-1" size="14px"></wd-icon>
            </view>
            <view
              class="rounded-full size-30px bg-#f5f5f5 text-center flex justify-center items-center"
              @click.stop="delAdderss(item.id)"
            >
              <wd-icon name="delete" size="14px"></wd-icon>
            </view>
          </view>
        </wd-cell>
      </view>
    </view>

    <template #bottom>
      <view class="py-20px">
        <wd-button block custom-class="custom-class-mine-error" @click="addAddress">
          新增收货地址
        </wd-button>
      </view>
    </template>
  </z-paging>
</template>

<style></style>
