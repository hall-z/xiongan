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
import { savePromoterUser } from '@/service/api/system'
import { promotionDateStore, useUserStore } from '@/store'
import { useRequest } from 'alova/client'
import isObject from 'lodash/isObject'
import { storeToRefs } from 'pinia'
import CardApply from './components/CardApply.vue'
import CardBhk from './components/CardBhk.vue'
import CardJuvenApply from './components/CardJuvenApply.vue'
import useCardApply from './hooks/useCardApply'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const { promotionDate } = storeToRefs(promotionDateStore())
const { promoteUpdateId, sedGetPromoterById, sedBankCodeById, sedPromoterOrgUserById } =
  useCardApply()
const promotionStore = promotionDateStore()

const { send: sedSavePromoterUser } = useRequest((data: any) => savePromoterUser(data), {
  immediate: false,
  loading: false,
})

const navTitle = ref('')
const baseCon = ref('')
const applyType = ref('')

onLoad(async (options: any) => {
  console.log('options', options)
  if (options.applyType) {
    applyType.value = options.applyType
  }

  if (options.id) {
    let promotionDate: any = {}
    baseCon.value = 'shebaoksl'
    baseCon.value = options.base
    navTitle.value = decodeURIComponent(options.title)
    if (options.promoterType === '1') {
      promotionDate = {
        promoterType: options.promoterType,
        promoterId: options.id,
        isPromotion: false,
      }
      // 请求状态启用和禁用
      const returnData: any = await sedGetPromoterById({ id: options.id })
      console.log('returnData', returnData)
      if (returnData.status === 0) {
        promotionDate.isPromotion = true
      } else {
        promotionDate.isPromotion = false
      }
      const params = {
        userName: userInfo.value.userName,
        userPhone: userInfo.value.userPhone,
        promoterId: options.id,
        promoterName: returnData.name ? returnData.name : '',
        promoterType: options.promoterType,
        bankCodeId: '',
        bankCodeName: '',
        orgUserId: '',
        orgUserName: '',
        orgUserPhone: '',
      }
      // 请求保存
      try {
        const res: any = await sedSavePromoterUser(params)
        console.log('sedSavePromoterUser', res)
        promoteUpdateId.value = res.id
        promotionDate.isPromotion = true
      } catch (error) {
        console.log('error', error)
        promotionDate.isPromotion = false
      }
      promotionStore.setPromotionDate(promotionDate)
    } else if (options.promoterType === '2') {
      // 缓存数据
      promotionDate = {
        promoterType: options.promoterType,
        bankCodeId: options.id,
        isPromotion: false,
      }
      // 请求状态启用和禁用
      const returnData: any = await sedBankCodeById({ id: options.id })
      console.log('returnData', returnData)
      if (returnData.status === 0) {
        promotionDate.isPromotion = true
      } else {
        promotionDate.isPromotion = false
      }
      const params = {
        userName: userInfo.value.userName,
        userPhone: userInfo.value.userPhone,
        promoterId: '',
        promoterName: '',
        bankCodeId: options.id,
        promoterType: options.promoterType,
        bankCodeName: returnData.bankName ? returnData.bankName : '',
        orgUserId: '',
        orgUserName: '',
        orgUserPhone: '',
      }
      // 请求保存
      try {
        const res: any = await sedSavePromoterUser(params)
        console.log('sedSavePromoterUser', res)
        promoteUpdateId.value = res.id
        promotionDate.isPromotion = true
      } catch (error) {
        promotionDate.isPromotion = false
      }
      console.log('promotionDatepromotionStore', promotionDate)
      promotionStore.setPromotionDate(promotionDate)
    } else {
      // 第三方机构请求
      promotionDate = {
        promoterType: options.promoterType,
        promoterId: options.id,
        isPromotion: false,
      }
      // 请求状态启用和禁用
      const returnData: any = await sedPromoterOrgUserById({ id: options.id })
      console.log('returnData', returnData)
      if (returnData.status === 0) {
        promotionDate.isPromotion = true
      } else {
        promotionDate.isPromotion = false
      }
      const params = {
        userName: userInfo.value.userName,
        userPhone: userInfo.value.userPhone,
        promoterId: '',
        promoterName: '',
        promoterType: options.promoterType,
        bankCodeId: '',
        bankCodeName: '',
        orgUserId: options.id,
        orgUserName: returnData.userName ? returnData.userName : '',
        orgUserPhone: returnData.userPhone ? returnData.userPhone : '',
      }
      // 请求保存
      try {
        const res: any = await sedSavePromoterUser(params)
        console.log('sedSavePromoterUser', res)
        promoteUpdateId.value = res.id
        promotionDate.isPromotion = true
      } catch (error) {
        console.log('error', error)
        promotionDate.isPromotion = false
      }
      promotionStore.setPromotionDate(promotionDate)
    }
  } else {
    console.log('取缓存promotionDate', promotionDate.value)
    if (isObject(promotionDate.value) && Object.values(promotionDate.value).length !== 0) {
      let promotionDateStore: any = {}
      baseCon.value = 'shebaoksl'
      baseCon.value = options.base
      navTitle.value = decodeURIComponent(options.title)
      if (promotionDate.value.promoterType === '1') {
        promotionDateStore = {
          promoterType: promotionDate.value.promoterType,
          promoterId: promotionDate.value.promoterId,
          isPromotion: false,
        }
        // 请求状态启用和禁用
        const returnData: any = await sedGetPromoterById({ id: promotionDate.value.promoterId })
        console.log('returnData', returnData)
        if (returnData.status === 0) {
          promotionDateStore.isPromotion = true
        } else {
          promotionDateStore.isPromotion = false
        }
        const params = {
          userName: userInfo.value.userName,
          userPhone: userInfo.value.userPhone,
          promoterId: promotionDate.value.promoterId,
          promoterName: returnData.name ? returnData.name : '',
          promoterType: promotionDate.value.promoterType,
          bankCodeId: '',
          bankCodeName: '',
          orgUserId: '',
          orgUserName: '',
          orgUserPhone: '',
        }
        // 请求保存
        try {
          const res: any = await sedSavePromoterUser(params)
          console.log('sedSavePromoterUser', res)
          promoteUpdateId.value = res.id
          promotionDateStore.isPromotion = true
        } catch (error) {
          console.log('error', error)
          promotionDateStore.isPromotion = false
        }
        promotionStore.setPromotionDate(promotionDateStore)
      } else if (promotionDate.value.promoterType === '2') {
        // 缓存数据
        promotionDateStore = {
          promoterType: promotionDate.value.promoterType,
          bankCodeId: promotionDate.value.bankCodeId,
          isPromotion: false,
        }
        // 请求状态启用和禁用
        const returnData: any = await sedBankCodeById({ id: promotionDate.value.bankCodeId })
        console.log('returnData', returnData)
        if (returnData.status === 0) {
          promotionDateStore.isPromotion = true
        } else {
          promotionDateStore.isPromotion = false
        }
        const params = {
          userName: userInfo.value.userName,
          userPhone: userInfo.value.userPhone,
          promoterId: '',
          promoterName: '',
          bankCodeId: promotionDate.value.bankCodeId,
          promoterType: promotionDate.value.promoterType,
          bankCodeName: returnData.bankName ? returnData.bankName : '',
          orgUserId: '',
          orgUserName: '',
          orgUserPhone: '',
        }
        // 请求保存
        try {
          const res: any = await sedSavePromoterUser(params)
          console.log('sedSavePromoterUser', res)
          promoteUpdateId.value = res.id
          promotionDateStore.isPromotion = true
        } catch (error) {
          promotionDateStore.isPromotion = false
        }
        promotionStore.setPromotionDate(promotionDateStore)
      } else {
        // 第三方机构请求
        // 缓存数据
        promotionDateStore = {
          promoterType: promotionDate.value.promoterType,
          promoterId: promotionDate.value.promoterId,
          isPromotion: false,
        }
        // 请求状态启用和禁用
        const returnData: any = await sedPromoterOrgUserById({ id: promotionDate.value.promoterId })
        console.log('returnData', returnData)
        if (returnData.status === 0) {
          promotionDateStore.isPromotion = true
        } else {
          promotionDateStore.isPromotion = false
        }
        const params = {
          userName: userInfo.value.userName,
          userPhone: userInfo.value.userPhone,
          promoterId: '',
          promoterName: '',
          promoterType: promotionDate.value.promoterType,
          bankCodeId: '',
          bankCodeName: '',
          orgUserId: promotionDate.value.promoterId,
          orgUserName: returnData.userName ? returnData.userName : '',
          orgUserPhone: returnData.userPhone ? returnData.userPhone : '',
        }
        // 请求保存
        try {
          const res: any = await sedSavePromoterUser(params)
          console.log('sedSavePromoterUser', res)
          promoteUpdateId.value = res.id
          promotionDateStore.isPromotion = true
        } catch (error) {
          console.log('error', error)
          promotionDateStore.isPromotion = false
        }
        promotionStore.setPromotionDate(promotionDateStore)
      }
    } else {
      console.log('11')
      baseCon.value = options.base
      navTitle.value = decodeURIComponent(options.title)
    }
  }
})
</script>

<template>
  <view class="h-100vh">
    <dy-navbar :leftTitle="navTitle" center customClass="nav_bg"></dy-navbar>

    <Card-Apply v-if="baseCon === 'shebaoksl'" :applyType="applyType" />
    <!-- 补卡换卡 -->
    <Card-Bhk v-if="baseCon === 'shebaokbh'" :applyType="applyType" />
    <!-- 未成年人申领 -->
    <Card-Juven-Apply v-if="baseCon === 'xinshenersl'" />
  </view>
</template>

<style lang="scss" scoped></style>
