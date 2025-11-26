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

<script lang="ts" setup>
import { searchUser } from '@/service/api/userMessage'
import { routeTo } from '@/utils'
import { useToast } from 'wot-design-uni/index'

const toast = useToast()
const title = ref('代他人充值')

const name = ref('')
const phone = ref('')
const option = ref({})

function handleConfirm2({ value }: any) {
  console.log(value)
}

const canteenNameObj = {
  // JT2: {
  //   name: '集团食堂(待启用)',
  //   value: 'JT2',
  //   mid: '2411250913509978',
  //   tid: '087481292',
  //   merchantId: '1835238852856737794',
  //   isShow: false,
  // },
  B5: {
    name: '华望城食堂B5/C5',
    value: 'B5',
    mid: '2411250913405161',
    tid: '087526887',
    merchantId: '1863183900566712322',
    isShow: false,
  },
  B7: {
    name: '华望城食堂B7',
    value: 'B7',
    mid: '2411250913149466',
    tid: '087526888',
    merchantId: '1862084318529114113',
    isShow: false,
  },
}
const canteenNameList = ref([
  // {
  //   label: '集团食堂(待启用)',
  //   value: 'JT2',
  //   mid: '2411250913509978',
  //   tid: '087481292',
  //   merchantId: '1835238852856737794',
  //   isShow: false,
  // },
  {
    label: '华望城食堂B5/C5',
    value: 'B5',
    mid: '2411250913405161',
    tid: '087526887',
    merchantId: '1863183900566712322',
    isShow: false,
  },
  {
    label: '华望城食堂B7',
    value: 'B7',
    mid: '2411250913149466',
    tid: '087526888',
    merchantId: '1862084318529114113',
    isShow: false,
  },
])
const value = ref('B5')
onLoad((options) => {
  option.value = JSON.parse(options.item)
})

function gosearch() {
  if (!name.value) {
    toast.error('请输入人员食堂姓名')
  } else if (!phone.value) {
    toast.error('请输入人员食堂绑定手机号')
  } else {
    searchUser({
      pageNo: 1,
      pageSize: 10,
      phone: phone.value,
      personName: name.value,
      // canteenName: value.value,
      // certificateNo: userStore.userInfo.idCardNumber,
    }).then((res: any) => {
      if (res.data && res.data.data && Object.keys(res.data.data).length > 0) {
        const par = { phones: '', names: '' }

        par.phones = phone.value
        par.names = name.value
        // par.list = res.data.data

        const da = JSON.stringify(par)

        routeTo({
          url: '/pages-sub/userManager/smartCanteen/indexD?item=' + da,
        })
      } else {
        toast.error('此账号在该食堂不存在！')
      }
    })
  }
}
</script>

<template>
  <view class="flex flex-col bg-no-repeat dy-blue-bg2" style="min-height: 100vh">
    <view>
      <dy-navbar
        :leftTitle="title"
        left
        isNavShow
        color="#000"
        custom-style="background: transparent;position: relative;"
      ></dy-navbar>
      <view class="topbg pos-relative">
        <view title="" style="margin-bottom: 50px">
          <wd-cell-group border>
            <!--            <wd-select-picker label="充值食堂" v-model="value" :columns="canteenNameList" type="radio"-->
            <!--                              @confirm="handleConfirm2"/>-->
            <wd-input
              type="text"
              title-width="150px"
              label="被充值人姓名"
              v-model.trim="name"
              placeholder="请输入人员食堂姓名"
            />
            <wd-input
              type="text"
              title-width="150px"
              label="被充值人手机号"
              v-model.trim="phone"
              placeholder="请输入人员食堂绑定手机号"
            />
          </wd-cell-group>
        </view>
        <wd-button block plain @click="gosearch">查询</wd-button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.topbg {
  box-sizing: border-box;
  padding: 19px 19px 45px 19px;
  overflow: hidden;
}
</style>
