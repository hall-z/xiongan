<route lang="json5" type="page">
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

<script setup lang="ts">
import { NAVIGATE_TYPE } from '@/enums/routerEnum'
import { useUserStore } from '@/store'
import { routeTo } from '@/utils'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useMessage } from 'wot-design-uni'
const message = useMessage()
const { userInfo } = storeToRefs(useUserStore())
const loading = ref(true)

const pageData = ref('')
const pagePath = ref('')
const pageNeedLogin = ref('0')
const pageNeedRealname = ref('0')
const terminal = ref('')
const pageTitle = ref('')
const pageId = ref('')
const idCardNumber = ref('')

onLoad((e) => {
  console.log('🍍onload===>>', e)
  uni.showLoading({ title: '处理中...' })
  let pages = null
  if (e !== undefined) {
    pages = e
    pages.path = decodeURIComponent(e.path)
    console.log('🍢[ pages.path]:', pages.path)
    if (pages.path === '/pages/shop/index') {
      return routeTo({
        url: pages.path,
        navType: NAVIGATE_TYPE.SWITCH_TAB,
      })
    }
    if (pages.data !== undefined || pages.data !== '' || pages.data !== null) {
      if (decodeURIComponent(pages.data) !== '' || decodeURIComponent(pages.data) !== '') {
        pageData.value = JSON.parse(decodeURIComponent(pages.data))
      }
    }
    if (pages.path !== undefined || pages.path !== '' || pages.path !== null) {
      pagePath.value = pages.path
    }
    if (pages.needLogin !== undefined || pages.needLogin !== '' || pages.needLogin !== null) {
      pageNeedLogin.value = pages.needLogin
    }
    if (
      pages.needRealname !== undefined ||
      pages.needRealname !== '' ||
      pages.needRealname !== null
    ) {
      pageNeedRealname.value = pages.needRealname
    }
    if (pages.title !== undefined || pages.title !== '' || pages.title !== null) {
      pageTitle.value = pages.title
    }
    if (pages.id !== undefined || pages.id !== '' || pages.id !== null) {
      pageId.value = pages.id
    }
    if (
      pages.idCardNumber !== undefined ||
      pages.idCardNumber !== '' ||
      pages.idCardNumber !== null
    ) {
      idCardNumber.value = pages.idCardNumber
    }
    if (pages.terminal !== undefined || pages.terminal !== '' || pages.terminal !== null) {
      terminal.value = pages.terminal
    }
    console.log(pages)

    if (isLogined()) {
      if (pageNeedRealname.value === '1' && !isIdcard()) {
        uni.showModal({
          title: '提示', // 弹窗标题
          content: '请先完成实名认证', // 弹窗内容
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              const url =
                '/pages/login/loginsmrz?redirectPath=/pages/codeshare&path=' +
                pagePath.value +
                '&needLogin=' +
                pageNeedLogin.value +
                '&needRealname=' +
                pageNeedRealname.value +
                '&title=' +
                pageTitle.value +
                '&id=' +
                pageId.value +
                '&data=' +
                JSON.stringify(pageData.value)

              console.log('中转页面跳转路径', url)
              uni.redirectTo({ url })
            } else if (res.cancel) {
              uni.switchTab({ url: '/pages/index/index' })
            }
          },
        })
      } else {
        gopages()
        uni.hideLoading()
      }
    } else if (isIdcard()) {
      gopages()
      uni.hideLoading()
    } else {
      if (pageNeedRealname.value === '1' || pageNeedLogin.value === '1') {
        if (pageNeedRealname.value === '1' && pageNeedLogin.value === '1') {
          console.log('345345')
          uni.showModal({
            title: '提示', // 弹窗标题
            content: '请先完成登录', // 弹窗内容
            showCancel: false,
            success: function (res) {
              console.log('12312312')
              if (res.confirm) {
                const url =
                  '/pages/login/index?redirectPath=/pages/codeshare&path=' +
                  pagePath.value +
                  '&needLogin=' +
                  pageNeedLogin.value +
                  '&needRealname=' +
                  pageNeedRealname.value +
                  '&title=' +
                  pageTitle.value +
                  '&id=' +
                  pageId.value +
                  '&data=' +
                  JSON.stringify(pageData.value)

                console.log('中转页面跳转路径', url)
                uni.redirectTo({ url })
                // uni.redirectTo({ url: '/pages/login/index' })
              } else if (res.cancel) {
                console.log('nononononononon')
                uni.redirectTo({ url: '/pages/login/index' })
              }
            },
          })
        }
        if (pageNeedLogin.value === '1' && pageNeedRealname.value === '0') {
          console.log('345345')
          uni.showModal({
            title: '提示', // 弹窗标题
            content: '请先完成登录', // 弹窗内容
            showCancel: false,
            success: function (res) {
              console.log('12312312')
              if (res.confirm) {
                console.log('okokokookokokok')
                const url =
                  '/pages/login/index?redirectPath=/pages/codeshare&path=' +
                  pagePath.value +
                  '&needLogin=' +
                  pageNeedLogin.value +
                  '&needRealname=' +
                  pageNeedRealname.value +
                  '&title=' +
                  pageTitle.value +
                  '&id=' +
                  pageId.value +
                  '&data=' +
                  JSON.stringify(pageData.value)

                console.log('中转页面跳转路径', url)
                uni.redirectTo({ url })
              } else if (res.cancel) {
                console.log('nononononononon')
                uni.switchTab({ url: '/pages/login/index' })
              }
            },
          })
        }
      } else {
        gopages()
        uni.hideLoading()
      }
    }

    uni.hideLoading()
  } else {
    uni.hideLoading()
    uni.showModal({
      title: '提示', // 弹窗标题
      content: '参数异常', // 弹窗内容
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          uni.redirectTo({ url: '/pages/index/index' })
        } else if (res.cancel) {
          uni.redirectTo({ url: '/pages/index/index' })
        }
      },
    })
  }
})

function gopages() {
  if (terminal.value === 'app') {
    if (idCardNumber.value !== userInfo.value.idCardNumber) {
      message
        .alert({
          title: '提示',
          msg: '当前操作用户不一致，请重新登录！',
          closeOnClickModal: false,
        })
        .then(() => {
          uni.switchTab({
            url: '/pages/index/index',
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  } else {
    uni.redirectTo({
      url:
        pagePath.value +
        '?id=' +
        pageId.value +
        '&title=' +
        pageTitle.value +
        '&data=' +
        JSON.stringify(pageData.value),
    })
  }
}

const isLogined = () => {
  const userStore = useUserStore()
  return userStore.isLogined
}
const isIdcard = () => {
  const userStore = useUserStore()
  return (
    userStore.userInfo.idCardNumber &&
    userStore.userInfo.cardId &&
    userStore.userInfo.isReal === '1'
  )
}
</script>

<template>
  <view></view>
</template>

<style lang="scss" scoped></style>
