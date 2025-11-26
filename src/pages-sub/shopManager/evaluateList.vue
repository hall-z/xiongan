<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'default',

  style: {
    navigationBarTitleText: '全部评价',
    backgroundColor: '#fff',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  },
}
</route>
<script lang="ts" setup>
import { evaluationList } from '@/service/api/shop'
import shoukuanma from './static/shoukuanma.png'

const paging = ref(null)
const goodList = ref([])
const num = ref(3)
const content = ref('评价内容评价内容评价内容评价内容评价内容评价内容评价内容')
const tabIndex = ref(0)
const spuId = ref(null)
const filterData = (type: number) => {
  console.log(type)
  tabIndex.value = type
}
const getLsit = async (pageNo, pageSize) => {
  try {
    const res: any = await evaluationList({
      page: pageNo,
      size: pageSize,
      spuId: spuId.value,
    })
    res.content.forEach((el) => {
      el.productScore = Number(el.productScore)
      el.evaluationImg = el.evaluationImg.length > 0 ? el.evaluationImg.split(',') : []
      el.userNickname = el.userNickname || '匿名用户'
      el.evaluationContent = el.evaluationContent || '该用户没有填写评价'
    })
    paging.value.complete(res.content)
  } catch {
    paging.value.complete(false)
  }
}
onLoad(async (options) => {
  console.log(options)
  spuId.value = options.details
})
</script>
<template>
  <z-paging
    ref="paging"
    v-model="goodList"
    @query="getLsit"
    :paging-style="{
      'box-sizing': 'border-box',
      padding: '15px',
      'background-color': '#F3F4F8',
    }"
  >
    <view class="bg-white w-full p-10px box-border" style="border-radius: 10px 10px 0 0">
      <view v-if="false" class="mb-10px">
        <wd-text text="评分" color="#999999" size="14px"></wd-text>
        <wd-text text="99%" color="#F54F25" size="14px"></wd-text>
        <wd-text text="好评" color="#999999" size="14px"></wd-text>
      </view>
      <view v-if="false" class="flex items-center justify-between">
        <!--  -->
        <view
          class="w-62px line-height-30px text-center font-size-14px border-rd-5px"
          @click="filterData(0)"
          :class="tabIndex === 0 ? 'bg-#F54F25 color-#ffffff' : 'bg-#F3F4F8 color-#666666'"
        >
          全部
        </view>
        <view
          class="w-62px line-height-30px text-center font-size-14px border-rd-5px"
          @click="filterData(1)"
          :class="tabIndex === 1 ? 'bg-#F54F25 color-#ffffff' : 'bg-#F3F4F8 color-#666666'"
        >
          最新
        </view>
        <view
          class="w-62px line-height-30px text-center font-size-14px border-rd-5px"
          @click="filterData(2)"
          :class="tabIndex === 2 ? 'bg-#F54F25 color-#ffffff' : 'bg-#F3F4F8 color-#666666'"
        >
          有图
        </view>
        <view
          class="w-62px line-height-30px text-center font-size-14px border-rd-5px"
          @click="filterData(3)"
          :class="tabIndex === 3 ? 'bg-#F54F25 color-#ffffff' : 'bg-#F3F4F8 color-#666666'"
        >
          好评
        </view>
        <view
          class="w-62px line-height-30px text-center font-size-14px border-rd-5px"
          @click="filterData(4)"
          :class="tabIndex === 4 ? 'bg-#F54F25 color-#ffffff' : 'bg-#F3F4F8 color-#666666'"
        >
          差评
        </view>
      </view>
    </view>

    <!-- 评价列表 -->
    <view class="w-full bg-white" style="border-radius: 0 0 10px 10px">
      <view class="flex p-10px box-border" v-for="it in goodList" :key="it.id">
        <wd-img :src="shoukuanma" :width="28" :height="28" round></wd-img>
        <view class="flex-1 ml-8px">
          <view>
            <view class="w-full">
              <view class="flex items-center justify-between" style="width: 100%">
                <wd-text :text="it.userNickname" color="#000000" size="14px" bold></wd-text>
                <wd-text :text="it.evaluationTime" color="#CCCCCC" size="14px"></wd-text>
              </view>
              <view style="margin: 5px 0px; font-size: 14px; color: #9c9dad">
                {{ it.specification }}
              </view>
            </view>
          </view>
          <wd-rate v-model="it.productScore" readonly size="14px" />
          <view class="mt-10px" style="word-break: break-all">
            <wd-text
              :text="it.evaluationContent"
              color="#000000"
              custom-class="break-all! text-wrap!"
              size="14px"
            ></wd-text>
            <view
              class="mt-10px flex flex-warp"
              v-if="it.evaluationImg.length > 0"
              style="flex-wrap: wrap"
            >
              <wd-img
                :width="90"
                :height="90"
                :src="i"
                custom-class="mr-10px"
                mode="aspectFill"
                v-for="i in it.evaluationImg"
                :key="i"
                :enable-preview="true"
              />
            </view>
          </view>
          <!-- 商家回复 -->
          <view class="mt-10px" v-if="it.replyCount > 0">
            <wd-text
              :text="'商家回复：' + it.replyContent"
              color="#333"
              size="14px"
              custom-class="break-all! text-wrap!"
            ></wd-text>
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style></style>
