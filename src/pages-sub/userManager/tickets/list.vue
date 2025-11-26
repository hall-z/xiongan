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
import useSuggest from './utils/useSuggest'

const { sendAdvicelist, advicelist, checkStatus, checkType, changeStatus } = useSuggest()

const orderId = ref('')
const paging = ref(null)
const dataList = ref([])
async function queryList(pageNo, pageSize) {
  const params = {
    page: pageNo,
    size: pageSize,
    orderId: orderId.value,
  }
  // 调用接口获取数据
  try {
    await sendAdvicelist(params)

    paging.value.complete(advicelist.value.content)
  } catch (error) {
    paging.value.complete(false)
  }
}
onLoad((option: any) => {
  orderId.value = option.id
})
onShow(() => {
  paging.value && paging.value.reload()
})
</script>
<template>
  <view class="size-100% fixed top-0 right-0 left-0 bottom-0 bg-no-repeat z-[-1] dy-blue-bg"></view>
  <z-paging ref="paging" v-model="dataList" @query="queryList" :auto-show-system-loading="true">
    <template #top>
      <!-- 顶部 -->
      <dy-navbar leftTitle="历史记录" left isNavShow color="#000"></dy-navbar>
    </template>
    <view class="px-15px pt-10px box-border dy-blue-bg2">
      <view
        class="w-full px-19px py-16px box-border pos-relative bg-white rounded-5px mb-13px"
        v-for="item in dataList"
        :key="item.id"
      >
        <view class="mb-5px">
          <wd-text text="反馈类型：" size="16px" color="#000000" bold></wd-text>
          <wd-text :text="checkType(item.reasonType)" size="16px" color="#000000" bold></wd-text>
        </view>
        <wd-text :text="'联系电话：' + item.createPhone" color="#999999" size="14px"></wd-text>
        <view
          :style="changeStatus(item.ticketStatus).bg"
          class="pos-absolute pos-right-none pos-top-none w-76px line-height-32px pl-20px box-border color-#4EA833 font-size-14px bg-#F0F9ED brge"
        >
          {{ changeStatus(item.ticketStatus).label }}
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
:deep(.z-paging-content) {
  background: linear-gradient(180deg, #d6eafe 0%, #f3f4f6 40%, #f2f3f7 100%) !important;
}
.brge {
  border-radius: 0px 5px 0px 25px;
}
</style>
