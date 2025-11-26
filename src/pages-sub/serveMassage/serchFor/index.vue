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
import { getSerchList } from '@/service/api/source'
import { List } from '@/service/model/baseModel'
import { useBaseStore } from '@/store'
import { routeTo } from '@/utils'
import { useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import kong from '../static/images/kong.png'
import quest from '../static/images/quest.png'
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
const { historySearch } = storeToRefs(useBaseStore())

const serchValue = ref('')
const flog = ref(false)
const cancel = () => {
  serchValue.value = ''
  if (serchValue.value.length === 0) {
    serchListData.value.content = []
  }
  routeTo({
    url: '/pages/index/index',
    navType: NAVIGATE_TYPE.SWITCH_TAB,
  })
}
const clear = () => {
  if (serchValue.value.length === 0) {
    serchListData.value.content = []
  }
}

const {
  loading,
  send: sendSerchList,
  data: serchListData,
} = useRequest((data) => getSerchList<List>(data), {
  immediate: false,
  loading: false,
  initialData: {
    content: [],
  },
})

async function search() {
  if (serchValue.value.length === 0 && currentType.value !== 7) {
    return
  }
  const params = {
    articleTitle: serchValue.value,
    // articleType: currentTypeData.value.value,
    appSearch: true,
  }
  // 发起请求
  try {
    await sendSerchList(params)
    if (!serchListData.value.content.length) {
      flog.value = true
    }
    useBaseStore().setHistorySearch(serchValue.value)
  } catch (error) {}
}
const change = () => {
  if (serchValue.value.length === 0) {
    serchListData.value.content = []
    flog.value = true
  } else {
    flog.value = false
  }
}
const cleatHistory = () => {
  uni.showModal({
    content: '您确定要删除历史记录吗',
    success: function (res) {
      if (res.confirm) {
        useBaseStore().clearHistorySearch()
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    },
  })
}
const histortSerch = (item: string) => {
  // 跳转详情
  serchValue.value = item
  search()
}
const toDetile = (item: any) => {
  routeTo({
    url: '/pages-sub/webView/index',
    data: {
      type: item.articleId,
      showTime: 0,
      showType: item.linkType === '1' ? 'webView' : '',
      url: item.linkUrl,
    },
  })
}
const titleList = ref([
  {
    label: '搜索页',
    value: 0,
  },
  {
    label: '常见问题',
    value: 7,
  },
  {
    label: '服务功能',
    value: 2,
  },
])
const currentType = ref(0)
const currentTypeData = computed(() => {
  return titleList.value.find((item: any) => item.value === currentType.value) ?? titleList.value[0]
})

onLoad((options) => {
  console.log('🥩[options]:', options)
  currentType.value = Number(options.type) ?? 0

  if (currentType.value === 7) {
    console.log('🍶')
    search()
  }
})
</script>

<template>
  <dy-navbar :leftTitle="currentTypeData.label" left></dy-navbar>
  <view class="p-10px">
    <view class="rounded-3px overflow-hidden bg-#C7C7C7/18 py-5px">
      <wd-search
        v-model="serchValue"
        :maxlength="10"
        placeholder-left
        placeholder="请输入关键词检索"
        custom-class="custom-class-serch"
        @cancel="cancel"
        @clear="clear"
        @search="search"
        @change="change"
      >
        <template #suffix>
          <view
            class="color-#333 px-5px text-14px relative search-type"
            @click="search"
            v-if="serchValue.length > 0"
          >
            搜索
          </view>
          <view class="color-#333 px-5px text-14px relative search-type" @click="cancel" v-else>
            取消
          </view>
        </template>
      </wd-search>
    </view>
  </view>

  <!-- content -->
  <view class="px-20px mt-10px" v-if="!loading || (serchListData.content && serchValue.length > 0)">
    <view
      class="flex gap-10px justify-between items-center text-16px bb-1px_dashed_#707070 py-10px border-#707070/20!"
      v-for="(item, index) in serchListData.content"
      :key="index"
      @click="toDetile(item)"
    >
      <wd-icon name="search" size="16px" color="#A7A7A7" v-if="currentType !== 7"></wd-icon>
      <wd-img :src="quest" width="24px" height="24px" v-else></wd-img>
      <view class="flex-1 text-16px truncate-1">{{ item.articleTitle }}</view>
      <wd-icon name="arrow-right" size="16px" color="#A7A7A7"></wd-icon>
    </view>
  </view>
  <view class="mt-30" v-if="serchListData.content.length === 0 && serchValue.length !== 0 && flog">
    <wd-status-tip
      :image="kong"
      :image-size="{
        height: 107,
        width: 190,
      }"
      tip="抱歉没有找到您想要搜索的内容"
    />
  </view>
  <!-- history -->
  <view
    class="px-20px mt-10px"
    v-if="historySearch && serchValue.length === 0 && currentType !== 7"
  >
    <view class="flex justify-between items-center">
      <view class="text-16px font-semibold">历史搜索</view>
      <view @click="cleatHistory">
        <wd-icon name="delete" size="16px"></wd-icon>
      </view>
    </view>
    <view>
      <view
        class="mt-5px text-16px color-#444 line-height-30px truncate-1"
        v-for="(item, index) in historySearch"
        :key="index"
        @click="histortSerch(item)"
      >
        {{ item }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.custom-class-serch) {
  @apply bg-transparent!;
  @apply p-0!;
  .wd-search__block {
    @apply rounded-0!;
  }
  .wd-search__cancel {
    @apply text-14px;
  }
}
.search-type::after {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: -5px;
  width: 1px;
  content: '';
  background: #333;
}
</style>
