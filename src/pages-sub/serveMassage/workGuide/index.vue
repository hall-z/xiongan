<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  layout: 'default',
  needLogin: true,
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
import { removeT } from '@/utils/index'
import useNews from './hooks/useGurid'
const { sendMessageList, messageData, messageClick } = useNews()

defineOptions({
  name: 'workGuide',
})

const articleTitle = ref('')
const paging = ref(null)
const dataList = ref([])
const queryList = async (pageNo, pageSize) => {
  const data = {
    number: pageNo,
    size: pageSize,
    articleType: '1',
    articleTitle: articleTitle.value,
  }
  // 调用接口获取数据
  try {
    await sendMessageList(data)
    paging.value.complete(messageData.value.content)
  } catch (error) {
    paging.value.complete(false)
  }
}
const searchchange = ({ value }) => {
  if (value === '') {
    handleChange()
  }
}
const handleChange = () => {
  paging.value.reload()
}
</script>
<template>
  <z-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    :auto-show-system-loading="true"
    :paging-style="{
      boxSizing: 'border-box',
      background: '#fff',
    }"
  >
    <template #top>
      <!-- 顶部 -->
      <dy-navbar leftTitle="办事指南" left></dy-navbar>
    </template>
    <view style="padding: 15px">
      <wd-input
        no-border
        v-model="articleTitle"
        prefix-icon="search"
        custom-class="searchBox"
        placeholder="请输入搜索关键词"
        @input="searchchange"
      >
        <template #suffix>
          <view class="searchBtn" @click="handleChange">搜索</view>
        </template>
      </wd-input>
    </view>
    <view
      v-for="(item, index) in dataList"
      :key="index"
      class="mb-15px box-border rounded-10px bg-white px-15px"
    >
      <view>
        <view class="FHcs" @click="messageClick(item)">
          <view
            class="FSsl F1"
            style="box-sizing: border-box; height: 80px; padding: 5px 10px 5px 0"
          >
            <wd-text :text="item.articleTitle" :lines="2" size="16px" color="#000"></wd-text>
            <wd-text
              :text="'发布时间：' + removeT(item.updateTime || item.createTime)"
              :lines="1"
              size="14px"
              color="#B5B5B5"
            ></wd-text>
          </view>
          <wd-img
            custom-class="imgbg"
            width="120px"
            height="80px"
            :radius="4"
            :src="item.articleImg"
          />
        </view>
      </view>
    </view>

    <!--    <view class="px-10px">-->
    <!--      &lt;!&ndash; leibiao  &ndash;&gt;-->
    <!--      <wd-cell-group>-->
    <!--        <wd-cell-->
    <!--          v-for="(item, index) in dataList"-->
    <!--          :key="index"-->
    <!--          title-width="100%"-->
    <!--          clickable-->
    <!--          @click="messageClick(item)"-->
    <!--          custom-class="custom-class-cell"-->
    <!--        >-->
    <!--          <template #icon>-->
    <!--            <view class="pt-5px mr-5px">-->
    <!--              <wd-img :src="guidIcon" width="12" height="12"></wd-img>-->
    <!--            </view>-->
    <!--          </template>-->
    <!--          <template #title>-->
    <!--            <view class="truncate-1 text-16px">-->
    <!--              {{ item.articleTitle }}-->
    <!--            </view>-->
    <!--          </template>-->
    <!--          <template #label>-->
    <!--            <view class="flex gap-20px color-#888 text-14px">-->
    <!--              <view>日期：{{ removeT(item.updateTime || item.createTime) }}</view>-->
    <!--              &lt;!&ndash; <view>-->
    <!--                <wd-icon name="browse" size="14px"></wd-icon>-->
    <!--                {{ item.createBy }}次-->
    <!--              </view> &ndash;&gt;-->
    <!--            </view>-->
    <!--          </template>-->
    <!--        </wd-cell>-->
    <!--      </wd-cell-group>-->
    <!--    </view>-->
  </z-paging>
</template>

<style lang="scss" scoped>
:deep(.nav_bg) {
  background-color: var(--color-nav-bg);
  .wd-navbar__title {
    color: var(--color-nav-text);
  }
  .wd-navbar__left {
    color: var(--color-nav-text);
  }
}
:deep(.custom-class-cell) {
  // background: linear-gradient(90deg, #e2f2ff 0%, #ffffff 100%);

  @apply my-10px bb-1px_dashed_#CECACA;
}
:deep(.searchBox) {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 10px 0px 10px 10px;
  margin-bottom: 20px;
  background: rgba(199, 199, 199, 0.18) !important;
  border: none;
  border-radius: 6px 6px 6px 6px;

  .wd-icon-search {
    background: transparent !important;
  }

  .searchBtn {
    height: 16px;
    padding: 0 15px;
    margin: 0;
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    border-left: 1px solid #000000;
  }
}

:deep(.imgbg) {
  background: #f5f5f5;
}
</style>
