<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      defaultTitle: '',
      titlePenetrate: 'NO',
      backButtonIcon: null,
    },
  },
}
</route>

<script lang="ts" setup>
import { useBaseStore, useUserStore } from '@/store'
import { formatHTML, removeT } from '@/utils'
import useWebview from './hooks/useWebview'
import quest from './static/images/quest.png'
import quest2 from './static/images/quest2.png'

const {
  sedAarData,
  ArticleData,
  bannerDaata,
  getbanner,
  sendDetailUpdateRead,
  ReadData,
  sendMessageRead,
} = useWebview()
const userStore = useUserStore()
const basestore = useBaseStore()
const types = ref(null)

function handleClickLeft() {
  uni.navigateBack()
}

const remark = ref(null)
const showTop = ref(1) // 是否显示顶部
const title = ref()
const showType = ref() // webView banner message
const webUrl = ref('')
const showTime = ref(true) // 是否显示时间
const cuurentData = ref<any>({})

onLoad(async (options) => {
  title.value = '常见问题详情'

  types.value = options.type

  await sedAarData({ articleId: options.type })
  cuurentData.value = ArticleData.value
})

function fmtHtml(cuurentData) {
  let e = cuurentData.content || cuurentData.articleContent || cuurentData.shopHdDesc

  e = formatHTML(e)

  return e
}
</script>

<template>
  <view class="">
    <view class="bg-#Ffff">
      <dy-navbar
        :leftTitle="title"
        left
        color="#000"
        custom-style="background-color: #fff"
      ></dy-navbar>
    </view>

    <view class="itembox">
      <view class="itemQ FHtl">
        <wd-img mode="heightFix" custom-class="imgbg" width="26px" height="26px" :src="quest" />
        <view>
          <view class="text break-all! text-wrap! text-ellipsis!">
            {{ cuurentData.articleTitle }}
          </view>
          <view class="color-#999 font-size-14px line-height-20px">
            发布时间：{{
              removeT(
                cuurentData.updateTime ||
                  cuurentData.createTime ||
                  cuurentData.shopHdStartT ||
                  cuurentData.sendTime,
              )
            }}
          </view>
        </view>
      </view>

      <view class="itemA FHtl">
        <wd-img
          mode="heightFix"
          custom-class=" imgbg imgbg2 "
          width="20px"
          height="20px"
          :src="quest2"
        />

        <!-- <rich-text
          :nodes="
            formatHTML(cuurentData.content || cuurentData.articleContent || cuurentData.shopHdDesc)
          "
        ></rich-text> -->
        <view class="px-10px break-all!">
          <dy-richtext :html="fmtHtml(cuurentData)"></dy-richtext>
        </view>
      </view>
    </view>
  </view>
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

.itembox {
  :deep(.imgbg) {
    margin-right: 10px;
  }
  .itemQ {
    box-sizing: border-box;
    padding: 15px;
    background-image: linear-gradient(#fff, #f3f4f6);

    .text {
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
      line-height: 1.5;
      color: #333;
    }
  }

  .itemA {
    padding: 15px 15px 50px 15px;
    background: #ffffff;
    border-radius: 5px 5px 5px 5px;

    :deep(.imgbg) {
      margin-top: 16px;
      margin-right: 15px;
    }
  }
}
</style>
