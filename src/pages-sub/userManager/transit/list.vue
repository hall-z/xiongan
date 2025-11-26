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
import { getCardInfo, getTransitCardTradeDetails, getUserCard } from '@/service/api/userMessage'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { useMessage } from 'wot-design-uni/index'
import chongzhi from '../static/images/transit/chongzhi.png'
import laonianka from '../static/images/transit/laonianka.png'
import laoniankabg from '../static/images/transit/laoniankabg.png'
import laoniankaicon from '../static/images/transit/laoniankaicon.png'
import putongka from '../static/images/transit/putongka.png'
import putongkabg from '../static/images/transit/putongkabg.png'
import putongkaicon from '../static/images/transit/putongkaicon.png'
import xiaofei from '../static/images/transit/xiaofei.png'
import xueshengka from '../static/images/transit/xueshengka.png'
import xueshengkabg from '../static/images/transit/xueshengkabg.png'
import xueshengkaicon from '../static/images/transit/xueshengkaicon.png'
import yue from '../static/images/transit/yue.png'

const { userInfo } = storeToRefs(useUserStore())
const title = ref('公交乘车记录')
const paging = ref(null)
const conponList: any = ref([])
const message = useMessage()
const form = reactive({
  cardno: '',
  cardtype: '',
  name: '',
  cardbal: 0,
})

const nameHide = (name) => {
  if (name.length === 2) {
    name = name.substring(0, 1) + '*' // 截取name 字符串截取第一个字符，
    return name // 张三显示为张*
  } else if (name.length === 3) {
    name = name.substring(0, 1) + '*' + name.substring(2, 3) // 截取第一个和第三个字符
    return name // 李思思显示为李*思
  } else if (name.length > 3) {
    name = name.substring(0, 1) + '*' + '*' + name.substring(3, name.length) // 截取第一个和大于第4个字符
    return name // 王五哈哈显示为王**哈
  }
}

async function queryList(pageNo: number, pageSize: number) {
  // 调用接口获取数据
  try {
    const obj = {
      cardno: form.cardno,
      page: pageNo,
      size: pageSize,
      rectype: '0',
      orderby: '0',
    }
    getTransitCardTradeDetails(obj).then((res: any) => {
      console.log('交通卡充值记录', res)
      paging.value.complete(res.data.data.txndetail)
    })
  } catch (error) {
    paging.value.complete(false)
  }
}

const getCardinfo = () => {
  getCardInfo({ cardno: form.cardno }).then((res: any) => {
    console.log('交通卡信息', res.data.data)
    form.cardtype = res.data.data.cardtype
    form.cardbal = res.data.data.cardbal
  })
}
const phoneHide = (phone) => {
  console.log('phone', phone.length)
  const reg = /^(\d{6})\d{9}(\d{4}$)/ // 定义手机号正则表达式
  phone = phone.replace(reg, '$1*******$2')
  return phone // 185****6696
}
onShow(() => {
  console.log('userInfo', userInfo.value)
  getUserCard({ cardId: userInfo.value.cardId }).then((res: any) => {
    if (!res.trafficNumber) {
      form.cardno = ''
      message
        .alert({
          msg: '未查询到您的公交卡号！',
          title: '提示',
        })
        .then((e) => {
          uni.navigateBack()
        })
    } else {
      form.cardno = res.trafficNumber
      getCardinfo()
      paging.value.reload()
    }
  })
})
</script>

<template>
  <z-paging
    ref="paging"
    v-model="conponList"
    @query="queryList"
    :auto="false"
    :auto-show-system-loading="true"
    class="flex flex-col p-15px box-border bg-no-repeat h-100vh dy-blue-bg"
  >
    <template #top>
      <dy-navbar :leftTitle="title" left isNavShow color="#000"></dy-navbar>
      <view class="px-15px box-border" v-if="form.cardno">
        <view class="topbg flex justify-between items-center pos-relative">
          <view class="flex flex-col justify-around py-11px box-border h-full">
            <view class="pl-20px">
              <wd-text :text="nameHide(userInfo.cardName)" size="16px" color="#FFF"></wd-text>
            </view>
            <view class="w-247px h-35px cardno pl-20px box-border">
              <wd-text text="卡号：" size="16px" bold color="#fff"></wd-text>
              <wd-text :text="phoneHide(form.cardno)" size="16px" bold color="#fff"></wd-text>
            </view>
            <view class="pl-20px" v-if="false">
              <wd-text text="年检时间：" size="12px" color="#C5DEFF"></wd-text>
              <wd-text text="2020年10月20日" size="12px" color="#C5DEFF"></wd-text>
            </view>
          </view>
          <view class="pos-absolute pos-top--2px pos-right--2px">
            <wd-img :src="laoniankabg" :width="104" :height="37" v-if="form.cardtype === '0301'" />
            <wd-img :src="xueshengkabg" :width="104" :height="37" v-if="form.cardtype === '0201'" />
            <wd-img :src="putongkabg" :width="104" :height="37" v-if="form.cardtype === '0100'" />
          </view>
          <view class="pos-absolute pos-top-4px pos-right-20px">
            <wd-img :src="laonianka" :width="48" :height="22" v-if="form.cardtype === '0301'" />
            <wd-img :src="xueshengka" :width="48" :height="22" v-if="form.cardtype === '0201'" />
            <wd-img :src="putongka" :width="48" :height="22" v-if="form.cardtype === '0100'" />
          </view>
          <view class="pos-absolute pos-bottom-10px pos-right-22px">
            <wd-img :src="laoniankaicon" :width="54" :height="63" v-if="form.cardtype === '0301'" />
            <wd-img :src="xueshengkaicon" :width="54" :height="58" v-if="form.cardtype === '0201'" />
            <wd-img :src="putongkaicon" :width="65" :height="63" v-if="form.cardtype === '0100'" />
          </view>
        </view>

        <view class="w-full flex items-center justify-between px-13px py-15px box-border bg-white border-rd-5px">
          <view class="flex items-center">
            <wd-img :src="yue" :width="22" :height="22"></wd-img>
            <wd-text text="余额" size="16px" color="#000" custom-class="ml-8px"></wd-text>
          </view>
          <wd-text :text="`￥${(form.cardbal / 100).toFixed(2)}元`" size="16px" color="#F44D24"></wd-text>
        </view>
        <view class="my-14px">
          <wd-text text="近期交易记录" size="16px" bold color="#000"></wd-text>
        </view>
      </view>
    </template>
    <view class="px-15px box-border">
      <template v-for="(item, index) in conponList" :key="index">
        <view v-if="item.txnamt !== '0'" class="my-10px p-15px bg-#fff rounded-6px box-border">
          <view class="flex justify-between items-center">
            <view class="flex flex-col justify-between">
              <view class="flex items-center mb-8px">
                <wd-img :src="xiaofei" :width="22" :height="22" v-if="item.txntype === '8451'"></wd-img>
                <wd-img :src="chongzhi" :width="22" :height="22" v-if="item.txntype === '5163'"></wd-img>
                <wd-text
                  text="充值"
                  size="16px"
                  color="#000"
                  bold
                  custom-class="ml-8px"
                  v-if="item.txntype === '5163'"
                ></wd-text>
                <wd-text
                  v-if="item.txntype === '8451'"
                  text="消费"
                  size="16px"
                  color="#000"
                  bold
                  custom-class="ml-8px"
                ></wd-text>
              </view>
              <wd-text :text="item.txndate" size="14px" color="#999999"></wd-text>
            </view>
            <wd-text
              :text="`-￥${(Number(item.txnamt) / 100).toFixed(2)}元`"
              size="16px"
              color="#FF0000"
              v-if="item.txntype === '8451'"
            ></wd-text>
            <wd-text
              :text="`￥${(Number(item.txnamt) / 100).toFixed(2)}元`"
              size="16px"
              color="#49940F"
              v-if="item.txntype === '5163'"
            ></wd-text>
          </view>
        </view>
      </template>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.topbg {
  box-sizing: border-box;
  width: 100%;
  min-height: 110px;
  margin: 10px auto;
  background: linear-gradient(48deg, #2bc5ff 0%, #1d4adc 100%);
  border-radius: 8px 8px 8px 8px;

  .cardno {
    width: 247px;
    height: 35px;
    line-height: 35px;
    background: rgba($color: #0c3dc2, $alpha: 0.45);
    border-radius: 0px 30px 30px 0px;
  }
}
</style>
