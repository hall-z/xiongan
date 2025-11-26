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
import { getHTML, routeTo } from '@/utils'
import { useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import kong from '../static/images/kong.png'
import quest from '../static/images/quest.png'
import quest2 from '../static/images/quest2.png'
const { historySearch } = storeToRefs(useBaseStore())

const serchValue = ref('')
const flog = ref(false)
const cancel = () => {
  serchValue.value = ''
  if (serchValue.value.length === 0) {
    serchListData.value.content = []
  }
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
    articleType: currentTypeData.value.value,
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
  useBaseStore().clearHistorySearch()
}
const histortSerch = (item: string) => {
  // 跳转详情
  serchValue.value = item
  search()
}
const toDetile = (item: any) => {
  routeTo({
    url: '/pages-sub/webView/index2info',
    data: {
      type: item.articleId,
      // showTime: 0,
      // showType: item.linkType === '1' ? 'webView' : '',
      // url: item.linkUrl,
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
const searchchange = ({ value }) => {
  if (value === '') {
    search()
  }
}

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
  <view class="px-15px pt-10px">
    <wd-input
      no-border
      v-model="serchValue"
      prefix-icon="search"
      custom-class="searchBox"
      placeholder="请输入关键词检索"
      @input="searchchange"
    >
      <template #suffix>
        <view class="searchBtn" @click="search">搜索</view>
      </template>
    </wd-input>
    <!--    <view class="rounded-3px overflow-hidden bg-#C7C7C7/18 py-5px">-->
    <!--      <wd-search-->
    <!--        v-model="serchValue"-->
    <!--        :maxlength="10"-->
    <!--        placeholder-left-->
    <!--        placeholder="请输入关键词检索"-->
    <!--        custom-class="custom-class-serch"-->
    <!--        @cancel="cancel"-->
    <!--        @clear="clear"-->
    <!--        @search="search"-->
    <!--        @change="change"-->
    <!--      >-->
    <!--        <template #suffix>-->
    <!--          <view-->
    <!--            class="color-#333 px-5px text-14px relative search-type"-->
    <!--            @click="search"-->
    <!--            v-if="serchValue.length > 0"-->
    <!--          >-->
    <!--            搜索-->
    <!--          </view>-->
    <!--          <view class="color-#333 px-5px text-14px relative search-type" @click="cancel" v-else>-->
    <!--            取消-->
    <!--          </view>-->
    <!--        </template>-->
    <!--      </wd-search>-->
    <!--    </view>-->
  </view>

  <!-- content -->
  <view class="px-15px pb-50px" v-if="!loading || (serchListData.content && serchValue.length > 0)">
    <view class="py-5px" v-for="(item, index) in serchListData.content" :key="index">
      <view class="itembox">
        <view class="itemQ FHcl">
          <wd-img mode="heightFix" custom-class="imgbg" width="26px" height="26px" :src="quest" />
          <wd-text
            :text="item.articleTitle"
            :lines="3"
            size="14px"
            color="#000"
            custom-class="break-all! text-wrap! text-ellipsis!"
          ></wd-text>
        </view>
        <view class="itemA FHtl">
          <wd-img mode="heightFix" custom-class="imgbg" width="20px" height="20px" :src="quest2" />
          <wd-text
            :text="getHTML(item.articleContent)"
            size="12px"
            :lines="3"
            color="#777777"
            lineHeight="20px"
          ></wd-text>
        </view>
        <view class="itemO FHcs">
          <wd-text
            :text="'时间:' + item.updateTime.slice(0, 10)"
            size="12px"
            color="#777777"
            lineHeight="20px"
          ></wd-text>
          <wd-text text="查看详情" size="12px" color="#2D69EF" @click="toDetile(item)"></wd-text>
        </view>
      </view>
      <!--      <wd-icon name="search" size="16px" color="#A7A7A7" v-if="currentType !== 7"></wd-icon>-->
      <!--      <wd-img :src="quest" width="24px" height="24px" v-else></wd-img>-->
      <!--      <view class="flex-1 text-16px truncate-1">{{ item.articleTitle }}</view>-->
      <!--      <wd-icon name="arrow-right" size="16px" color="#A7A7A7"></wd-icon>-->
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
:deep(.searchBox) {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 10px 0px 10px 10px;
  margin-bottom: 10px;
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
.itembox {
  padding: 10px;
  background: #f3f7ff;
  border: 1px solid #e3ecff;
  border-radius: 5px 5px 5px 5px;
  :deep(.imgbg) {
    margin-right: 10px;
  }
  .itemQ,
  .itemA {
    margin-bottom: 10px;
  }
  .itemA {
    padding: 10px 10px 10px 0;
    background: #ffffff;
    border-radius: 5px 5px 5px 5px;
    :deep(.imgbg) {
      margin-right: 15px;
    }
  }
}
</style>
