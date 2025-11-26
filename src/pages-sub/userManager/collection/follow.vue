<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'default',

  style: {
    navigationBarTitleText: '店铺关注',
    backgroundColor: '#fff',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  },
}
</route>
<script lang="ts" setup>
import { delUserShop, getUserShopList } from '@/service/api/shop'
import { routeTo } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
const isManage = ref(false)
const topbgBase64 = ref('')
const arrList = ref([])
const allCheck = ref(false)
const paging = ref(null)
const goodList = ref([])
const getLsit = async (pageNo: number, pageSize: number) => {
  try {
    const res: any = await getUserShopList({
      current: pageNo,
      size: pageSize,
    })
    const arr = res.map((it) => {
      it.isCheck = false
      return it
    })

    paging.value.complete(arr)
    console.log('收藏列表i哦', arr)
  } catch {
    paging.value.complete(false)
  }
}
const handleChangeAll = ({ value }) => {
  if (value) {
    arrList.value = goodList.value.map((it) => it.shopInfo.id)
    goodList.value.forEach((it) => {
      it.isCheck = true
    })
  } else {
    arrList.value.length = 0
    goodList.value.forEach((it) => {
      it.isCheck = false
    })
  }
  console.log('全选', value, goodList.value, arrList.value)
}
const handleChange = ({ value }, id) => {
  if (value) {
    arrList.value.push(id)
  } else {
    const idx = arrList.value.indexOf(id)
    arrList.value.splice(idx, 1)
  }
  if (arrList.value.length === goodList.value.length) {
    allCheck.value = true
  } else {
    allCheck.value = false
  }
  console.log('arrList.value', arrList.value)
}
const delFoverGoods = () => {
  delUserShop({ idList: arrList.value }).then((res) => {
    if (res.data) {
      Toast('取消关注成功')
    } else {
      Toast('取消关注失败')
    }
    paging.value.reload()
  })
}
</script>
<template>
  <z-paging
    ref="paging"
    v-model="goodList"
    @query="getLsit"
    class="list"
    :class="isManage ? 'p-15px pb-80px' : 'p-15px'"
  >
    <template #top>
      <view class="w-full font-600 flex items-center justify-between px-20px box-border">
        <view class="line-height-50px">店铺数量（{{ goodList.length }}）</view>
        <view @click="isManage = !isManage">管理</view>
      </view>
    </template>
    <view class="bg-white border-rd-10px p-15px box-border w-full mb-10px" v-for="item in goodList" :key="item.spuId">
      <view class="w-full flex">
        <view class="flex flex-col justify-center items-center">
          <wd-checkbox
            v-if="isManage"
            v-model="item.isCheck"
            @change="handleChange($event, item.shopBean.id)"
          ></wd-checkbox>
        </view>

        <view
          class="flex-1 flex"
          @click="routeTo({ url: '/pages-sub/shopManager/shopHome', data: { id: item.shopBean.id } })"
        >
          <wd-img :width="80" :height="80" :src="item.shopInfo.businessLicenseUrl" custom-class="img" />
          <view class="ml-15px flex-1 flex flex-col justify-between">
            <view class="w-190px">
              <view class="name mb-10px fw-600">{{ item.shopInfo.name }}</view>
              <!-- <view style="font-size: 14px; color: #757575">灰色</view> -->
            </view>

            <view class="w-full flex color-#999999">
              <text>{{ item.userCount }}人关注</text>
            </view>
          </view>
          <view class="flex flex-col justify-center">
            <wd-icon name="arrow-right" size="22px" color="#999999"></wd-icon>
          </view>
        </view>
      </view>
    </view>
  </z-paging>

  <view
    v-if="isManage"
    class="bg-white pos-fixed h-80px pos-bottom-none flex w-full justify-between px-15px box-border items-center"
  >
    <wd-checkbox v-model="allCheck" @change="handleChangeAll">全选</wd-checkbox>
    <view class="flex items-center">
      <view class="flex items-center">共计{{ arrList.length }}个</view>
      <view class="submit" @click="delFoverGoods">删除</view>
    </view>
  </view>
</template>

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

.list {
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 50px);
  margin-top: 50px;
  /*background-color: #f5f6f8;*/
}

.img {
  overflow: hidden !important;
  border-radius: 5px;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
