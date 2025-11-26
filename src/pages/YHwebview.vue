<route lang="json5" type="page">
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

<script setup lang="ts">
import { ref } from 'vue'
import { getBannerH5 } from '@/service/api/webview'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

const { userInfo } = storeToRefs(useUserStore())
const loading = ref(true)
const src = ref('')
const da = ref({})
const type = ref('release')
// develop（开发版），trial（体验版），release（正式版）

onLoad((e) => {
  if (e.type) {
    type.value = e.type
    // develop（开发版），trial（体验版），release（正式版）
  }
  uni.showLoading({ title: '请求H5地址' })
  da.value = {
    identificationName: userInfo.value.cardName,
    identificationNumber: userInfo.value.idCardNumber,
    mobileNumber: userInfo.value.userPhone,
    userId: userInfo.value.userDId,
    pageType: '1',
  }
  src.value = ''
  loading.value = false

  uni.hideLoading()
  getBannerH5(da.value).then((res) => {
    console.log('-------------res', res)
    src.value = res.data.url ? res.data.url : ''
    loading.value = false
    uni.hideLoading()
  })
})

// #region webView事件
function getRequestParams(urltemp) {
  const url = urltemp
  const requestParams = {}
  if (url.indexOf('?') !== -1) {
    const str = url.substr(url.indexOf('?') + 1) // 截取?后面的内容作为字符串
    // console.log(str, '?后面的内容');
    const strs = str.split('&') // 将字符串内容以&分隔为一个数组
    // console.log(strs, '以&切割的数组');
    for (let i = 0; i < strs.length; i++) {
      requestParams[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
      // 将数组元素中'='左边的内容作为对象的属性名，'='右边的内容作为对象对应属性的属性值
    }
  }
  // console.log(requestParams, '处理后的对象');
  return requestParams
}

const message = (value: any) => {
  console.log('message', value)
  const urltemp = value.detail.data[0] ? value.detail.data[0] : ''
  if (urltemp.indexOf('weixin://dl/business/?') === 0) {
    const requestParams = getRequestParams(urltemp)

    const appid = requestParams.appid ? requestParams.appid : '--'
    const path = requestParams.path ? requestParams.path : '--'
    const query = requestParams.query ? requestParams.query : '--'

    // /调用微信API跳转到B小程序
    if (appid && appid !== '--') {
      console.log('--------------------')
      console.log('跳转小程序了')
      console.log('appId', appid)
      console.log('path', path)
      console.log('extraData.src', src.value)
      console.log('extraData.query', query)
      console.log('da', da.value)
      console.log('--------------------')

      wx.navigateToMiniProgram({
        envVersion: type.value,
        appId: appid, // B小程序的appid
        path: 'pages/index/authM', // 跳转路径(含参数)
        extraData: {
          src: src.value,
          query,
          da: da.value,
        },
        // 额外数据(需B小程序在App.onLaunch中接收)
        success: () => console.log('跳转成功'),
        fail: (err) => console.error('跳转失败', err),
      })
    }
  }
}
</script>

<template>
  <web-view v-if="!loading" :src="src" @message="message"></web-view>
</template>

<style lang="scss" scoped></style>
